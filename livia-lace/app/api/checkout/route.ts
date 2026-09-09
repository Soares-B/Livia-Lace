import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";

import getCart from "@/lib/cart";
import getProduct from "@/lib/product";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

export async function POST() {
  try {
    const cart = await getCart();

    const produtos = Array.isArray(cart?.produtos)
      ? (cart.produtos as {
          produto: number;
          quantidade: number;
        }[])
      : [];

    const items = await Promise.all(
      produtos.map(async (item) => {
        const produto = await getProduct((item.produto));

        if (!produto) {
          throw new Error(`Produto ${item.produto} não encontrado`);
        }

        return {
          id: produto.product_id.toString(),
          title: produto.nome!,
          quantity: item.quantidade,
          unit_price: Number(produto.valor),
        };
      })
    );

    const preferenceClient = new Preference(client);

    const preference = await preferenceClient.create({
      body: {
        items,

        back_urls: {
          success: "https://yearly-pamperer-payback.ngrok-free.dev/Checkout/PaymentSuccess",
          failure: "https://yearly-pamperer-payback.ngrok-free.dev/Checkout/PaymentFailure",
          pending: "https://yearly-pamperer-payback.ngrok-free.dev/Checkout/PaymentPending",
        },
        auto_return: "approved",
      },
    });

    return NextResponse.json({
      init_point: preference.init_point,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Erro ao criar checkout" },
      { status: 500 }
    );
  }
}