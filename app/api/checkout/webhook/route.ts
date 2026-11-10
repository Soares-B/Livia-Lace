import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import prisma from "@/lib/prisma";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

const paymentClient = new Payment(client);

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
  try {
    const url = new URL(request.url);

    let body: {
      type?: string;
      data?: { id?: string | number };
    } = {};

    try {
      body = await request.json();
    } catch {
    }

    const type =
      body.type ??
      url.searchParams.get("type") ??
      url.searchParams.get("topic");

    if (type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId =
      url.searchParams.get("data.id") ??
      body.data?.id?.toString() ??
      url.searchParams.get("id");

    if (!paymentId) {
      return NextResponse.json(
        { error: "ID do pagamento ausente" },
        { status: 400 }
      );
    }

    const payment = await paymentClient.get({
      id: paymentId,
    });

    if (
      !payment.external_reference ||
      !payment.status ||
      payment.transaction_amount == null ||
      payment.currency_id !== "BRL"
    ) {
      return NextResponse.json(
        { error: "Dados do pagamento incompletos" },
        { status: 400 }
      );
    }

    if (!/^\d+$/.test(payment.external_reference)) {
      return NextResponse.json(
        { error: "Referência do pedido inválida" },
        { status: 400 }
      );
    }

    const pedidoId = BigInt(payment.external_reference);

    const pedido = await prisma.pedidos.findUnique({
      where: { id: pedidoId },
    });

    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 }
      );
    }

    const valorPedido = Number(pedido.valor_total);
    const valorPagamento = payment.transaction_amount;

    if (Math.abs(valorPedido - valorPagamento) > 0.01) {
      console.error("Valor divergente:", {
        pedidoId: pedido.id.toString(),
        valorPedido,
        valorPagamento,
      });

      return NextResponse.json(
        { error: "Valor do pagamento diferente do pedido" },
        { status: 400 }
      );
    }

    const novaSituacao = statusMap[payment.status];

    if (!novaSituacao) {
      return NextResponse.json({ received: true });
    }

    const statusFinais = ["reembolsado", "contestado"];

    if (
      pedido.situa__o === "aprovado" &&
      novaSituacao !== "aprovado" &&
      !statusFinais.includes(novaSituacao)
    ) {
      return NextResponse.json({ received: true });
    }

    await prisma.pedidos.update({
      where: { id: pedidoId },
      data: { situa__o: novaSituacao },
    });

    if (payment.status === "approved" && pedido.id_carrinho !== null) {
      await prisma.carrinho.update({
        where: { id: pedido.id_carrinho },
        data: { produtos: [] },
      });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);

    return NextResponse.json(
      { error: "Erro ao processar notificação" },
      { status: 500 }
    );
  }
}
