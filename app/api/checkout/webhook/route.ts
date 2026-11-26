import { MercadoPagoConfig, Payment } from "mercadopago";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { toBRLCents, verifyMercadoPagoSignature } from "@/lib/payment-security.mjs";

const statusMap: Record<string, string> = {
  approved: "aprovado",
  pending: "pendente",
  in_process: "pendente",
  in_mediation: "em_disputa",
  rejected: "rejeitado",
  cancelled: "cancelado",
  refunded: "reembolsado",
  charged_back: "contestado",
};

// Toda recusa do webhook é registrada no terminal com o motivo, para facilitar achar por que
// um pedido não saiu de "pendente" (segredo errado, valor divergente etc.). Nunca registra segredos.
function fail(message: string, status: number, publicMessage = message) {
  console.warn(`[webhook] ${status}: ${message}`);
  return NextResponse.json({ error: publicMessage }, { status });
}

export async function POST(request: Request) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id")?.toLowerCase();
  const requestId = request.headers.get("x-request-id");

  if (!secret || !accessToken) {
    const faltando = [!secret && "MERCADO_PAGO_WEBHOOK_SECRET", !accessToken && "MERCADO_PAGO_ACCESS_TOKEN"].filter(Boolean).join(", ");
    return fail(`variável de ambiente ausente: ${faltando}`, 401, "Assinatura inválida");
  }
  const signature = request.headers.get("x-signature");
  if (!dataId || !verifyMercadoPagoSignature(signature, requestId, dataId, secret)) {
    return fail(
      `assinatura inválida (data.id: ${dataId ? "ok" : "ausente"}, x-signature: ${signature ? "ok" : "ausente"}, x-request-id: ${requestId ? "ok" : "ausente"}). ` +
        "Se os três estão ok, o MERCADO_PAGO_WEBHOOK_SECRET provavelmente não é o do mesmo modo (teste ou produção) do pagamento",
      401,
      "Assinatura inválida",
    );
  }
  console.info(`[webhook] notificação válida para o pagamento ${dataId}`);

  try {
    const body = await request.json().catch(() => ({})) as {
      type?: string; action?: string; data?: { id?: string | number };
    };
    const type = body.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
    if (type !== "payment" && !body.action?.startsWith("payment.")) {
      return NextResponse.json({ received: true });
    }
    if (body.data?.id !== undefined && String(body.data.id).toLowerCase() !== dataId) {
      return fail("IDs de pagamento divergentes", 400);
    }

    const paymentClient = new Payment(new MercadoPagoConfig({ accessToken }));
    const payment = await paymentClient.get({ id: dataId });
    if (!payment.external_reference || !/^\d+$/.test(payment.external_reference) ||
        !payment.status || payment.transaction_amount == null || payment.currency_id !== "BRL" || !payment.id) {
      return fail("Dados de pagamento incompletos", 400);
    }

    const pedidoId = BigInt(payment.external_reference);
    const pedido = await prisma.pedidos.findUnique({ where: { id: pedidoId } });
    if (!pedido) return fail("Pedido não encontrado", 404);
    if (pedido.valor_total === null || toBRLCents(pedido.valor_total) !== toBRLCents(payment.transaction_amount)) {
      return fail("Valor do pagamento divergente", 400);
    }
    const preferenceId = (payment as typeof payment & { preference_id?: string }).preference_id;
    if (pedido.id_preferencia && preferenceId && pedido.id_preferencia !== preferenceId) {
      return fail("Preferência de pagamento divergente", 400);
    }

    const newStatus = statusMap[payment.status];
    if (!newStatus) return NextResponse.json({ received: true });
    const paymentId = String(payment.id);
    const finalStatuses = ["reembolsado", "contestado"];
    const existingPayment = await prisma.pagamentos.findUnique({ where: { id: paymentId } });
    if (existingPayment && existingPayment.id_pedido !== pedidoId) {
      return fail("Pagamento já associado a outro pedido", 409);
    }

    await prisma.$transaction(async (tx) => {
      const priorApprovedPayment = payment.status === "approved"
        ? await tx.pagamentos.findFirst({ where: { id_pedido: pedidoId, status: "approved", id: { not: paymentId } } })
        : null;
      await tx.pagamentos.upsert({
        where: { id: paymentId },
        create: { id: paymentId, id_pedido: pedidoId, status: payment.status!, valor_total: payment.transaction_amount! },
        update: { status: payment.status!, valor_total: payment.transaction_amount! },
      });
      if (priorApprovedPayment) {
        await tx.pedidos.update({ where: { id: pedidoId }, data: { situa__o: "pagamento_duplicado" } });
      } else if (pedido.situa__o !== "aprovado" || newStatus === "aprovado" || finalStatuses.includes(newStatus)) {
        await tx.pedidos.update({ where: { id: pedidoId }, data: { situa__o: newStatus } });
      }
      if (payment.status === "approved" && pedido.id_carrinho !== null) {
        await tx.carrinho.update({ where: { id: pedido.id_carrinho }, data: { produtos: [] } });
      }
    }, { isolationLevel: "Serializable" });
    console.info(`[webhook] pedido ${pedidoId} atualizado (status do pagamento: ${payment.status})`);
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return fail("Erro ao processar notificação", 500);
  }
}

