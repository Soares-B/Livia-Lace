import getClient from "@/lib/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type product = {
  produto: number;
  quantidade: number;
  valor: number;
};

export async function POST(request: Request) {
  try {
    const client = await getClient();

    const data = await request.json();

    const { cart } = data;

    const valorTotal = cart
      .reduce((soma: number, produto: product) => {
        return (soma += produto.valor * produto.quantidade);
      }, 0)
      .toFixed(2);

    const carrinho = cart.map((product: product) => ({
      produto: (product.produto),
      quantidade: product.quantidade,
    }));

    await prisma.carrinho.update({
      where: {
        id_client: client!.id,
      },
      data: {
        produtos: carrinho,
        valor_total: valorTotal,
      },
    });

    return NextResponse.json(
      {
        message: "carrinho atualizado com sucesso!",
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "não foi possivel atualizar o carrinho",
      },
      { status: 500 },
    );
  }
}
