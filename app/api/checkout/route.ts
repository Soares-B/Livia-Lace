import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getClient from "@/lib/client";

const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN!,
});

type ProdutoCarrinho = {
  produto: number;
  quantidade: number;
};

export async function POST() {
  let pedidoId: bigint | undefined;

  try {
    const cliente = await getClient();

    if (!cliente) {
      return NextResponse.json(
        { error: "Usuário não autenticado" },
        { status: 401 }
      );
    }

    const cart = await prisma.carrinho.findUnique({
      where: { id_client: cliente.id },
    });

    if (!cart || !Array.isArray(cart.produtos) || cart.produtos.length === 0) {
      return NextResponse.json(
        { error: "Carrinho vazio ou não encontrado" },
        { status: 400 }
      );
    }

    const produtos = cart.produtos as ProdutoCarrinho[];

    const newCart = await Promise.all(
      produtos.map(async (item) => {
        if (
          !Number.isInteger(item.produto) ||
          !Number.isInteger(item.quantidade) ||
          item.produto <= 0 ||
          item.quantidade <= 0
        ) {
          throw new Error("Produto ou quantidade inválidos");
        }

        const produto = await prisma.produtos.findUnique({
          where: { product_id: BigInt(item.produto) },
        });

        if (!produto || produto.valor === null) {
          throw new Error(`Produto ${item.produto} não encontrado ou sem preço`);
        }

        return {
          produto: item.produto,
          product_id: produto.product_id.toString(),
          nome: produto.nome ?? `Produto ${item.produto}`,
          valor: produto.valor,
          quantidade: item.quantidade,
        };
      })
    );

    const valorFinal = Number(
      newCart
        .reduce(
          (total, item) => total + item.valor * item.quantidade,
          0
        )
        .toFixed(2)
    );

    const items = newCart.map((item) => ({
      id: item.product_id,
      title: item.nome,
      quantity: item.quantidade,
      unit_price: item.valor,
      currency_id: "BRL",
    }));

    const pedido = await prisma.pedidos.create({
      data: {
        Clientes: { connect: { id: cliente.id } },
        Carrinho: { connect: { id: cart.id } },
        valor_total: valorFinal,
        items: newCart,
        situa__o: "pendente",
      },
    });

    pedidoId = pedido.id;

    const preferenceClient = new Preference(client);

    const preference = await preferenceClient.create({
      body: {
        items,
        external_reference: pedido.id.toString(),
        notification_url: process.env.MERCADO_PAGO_WEBHOOK_URL,
        back_urls: {
          success:
            "https://yearly-pamperer-payback.ngrok-free.dev/Checkout/PaymentSuccess",
          failure:
            "https://yearly-pamperer-payback.ngrok-free.dev/Checkout/PaymentFailure",
          pending:
            "https://yearly-pamperer-payback.ngrok-free.dev/Checkout/PaymentPending",
        },
        auto_return: "approved",
      },
    });

    if (!preference.id || !preference.init_point) {
      throw new Error("Mercado Pago não retornou a preferência corretamente");
    }

    await prisma.pedidos.update({
      where: { id: pedido.id },
      data: { id_preferencia: preference.id },
    });

    return NextResponse.json({
      init_point: preference.init_point,
    });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);

    if (pedidoId !== undefined) {
      try {
        await prisma.pedidos.update({
          where: { id: pedidoId },
          data: { situa__o: "falha_checkout" },
        });
      } catch (updateError) {
        console.error("Erro ao atualizar pedido:", updateError);
      }
    }

    return NextResponse.json(
      { error: "Erro ao criar checkout" },
      { status: 500 }
    );
  }
}