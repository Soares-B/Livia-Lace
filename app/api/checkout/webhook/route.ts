import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log("Webhook Mercado Pago:", body);

    const paymentId = body.data?.id;

    console.log("ID do pagamento:", paymentId);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Erro no webhook:", error);

    return NextResponse.json(
      { error: "Erro ao processar webhook" },
      { status: 500 }
    );
  }
}