import getClient from "@/lib/client";
import getCart from "@/lib/cart";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type ProdutoCarrinho = {
  produto: number;
  quantidade: number;
};

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const { id, amount } = dados;

    const client = await getClient();
    const cart = await getCart();

    const produtoId = Number(id);
    const quantidade = Number(amount);

    const produtos = Array.isArray(cart?.produtos)
      ? (cart.produtos as ProdutoCarrinho[])
      : [];

    const produtoExistente = produtos.find(
      (produto) => produto.produto === produtoId,
    );

    if (produtoExistente) {
      produtoExistente.quantidade += quantidade;
    } else {
      produtos.push({
        produto: produtoId,
        quantidade: quantidade,
      });
    }

    await prisma.carrinho.update({
      where: {
        id_client: client!.id,
      },
      data: {
        produtos: produtos,
      },
    });

    return NextResponse.json(
      {
        message: "Adicionado ao carrinho!",
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);

    return NextResponse.json(
      { message: "Não foi possível adicionar ao carrinho" },
      { status: 500 },
    );
  }
}
