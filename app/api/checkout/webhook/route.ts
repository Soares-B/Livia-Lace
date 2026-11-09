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

export async function POST(request: Request) {
  const secret = process.env.MERCADO_PAGO_WEBHOOK_SECRET;
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  const url = new URL(request.url);
  const dataId = url.searchParams.get("data.id")?.toLowerCase();
  const requestId = request.headers.get("x-request-id");

  if (!secret || !accessToken || !dataId || !verifyMercadoPagoSignature(
    request.headers.get("x-signature"), requestId, dataId, secret,
  )) {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 401 });
  }

  try {
    const body = await request.json().catch(() => ({})) as {
      type?: string; action?: string; data?: { id?: string | number };
    };
    const type = body.type ?? url.searchParams.get("type") ?? url.searchParams.get("topic");
    if (type !== "payment" && !body.action?.startsWith("payment.")) {
      return NextResponse.json({ received: true });
    }
    if (body.data?.id !== undefined && String(body.data.id).toLowerCase() !== dataId) {
      return NextResponse.json({ error: "IDs de pagamento divergentes" }, { status: 400 });
    }

    const paymentClient = new Payment(new MercadoPagoConfig({ accessToken }));
    const payment = await paymentClient.get({ id: dataId });
    if (!payment.external_reference || !/^\d+$/.test(payment.external_reference) ||
        !payment.status || payment.transaction_amount == null || payment.currency_id !== "BRL" || !payment.id) {
      return NextResponse.json({ error: "Dados de pagamento incompletos" }, { status: 400 });
    }

    const pedidoId = BigInt(payment.external_reference);
    const pedido = await prisma.pedidos.findUnique({ where: { id: pedidoId } });
    if (!pedido) return NextResponse.json({ error: "Pedido não encontrado" }, { status: 404 });
    if (pedido.valor_total === null || toBRLCents(pedido.valor_total) !== toBRLCents(payment.transaction_amount)) {
      return NextResponse.json({ error: "Valor do pagamento divergente" }, { status: 400 });
    }
    const preferenceId = (payment as typeof payment & { preference_id?: string }).preference_id;
    if (pedido.id_preferencia && preferenceId && pedido.id_preferencia !== preferenceId) {
      return NextResponse.json({ error: "Preferência de pagamento divergente" }, { status: 400 });
    }

    const newStatus = statusMap[payment.status];
    if (!newStatus) return NextResponse.json({ received: true });
    const paymentId = String(payment.id);
    const finalStatuses = ["reembolsado", "contestado"];
    if (pedido.situa__o === "aprovado" && newStatus !== "aprovado" && !finalStatuses.includes(newStatus)) {
      return NextResponse.json({ received: true });
    }

    await prisma.$transaction(async (tx) => {
      const result = await tx.pedidos.updateMany({
        where: { id: pedidoId, OR: [{ id_pagamento: null }, { id_pagamento: paymentId }] },
        data: { situa__o: newStatus, id_pagamento: paymentId },
      });
      if (result.count !== 1) throw new Error("Pedido já associado a outro pagamento");
      if (payment.status === "approved" && pedido.id_carrinho !== null) {
        await tx.carrinho.update({ where: { id: pedido.id_carrinho }, data: { produtos: [] } });
      }
    });
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ error: "Erro ao processar notificação" }, { status: 500 });
  }
}

