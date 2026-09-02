import getClient from "@/lib/client";
import getCart from "@/lib/cart";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const { id, amount } = dados;

    const client = await getClient();

    const cart = await getCart();

    const produto = {
      produto: Number(id),
      quantidade: Number(amount),
    };
    const produtos = Array.isArray(cart?.produtos) ? cart.produtos : [];
    produtos.push(produto);

    const cartUpdate = await prisma.carrinho.update({
      where: {
        id_client: client!.id,
      },
      data: {
        produtos: produtos,
      },
    });

    return NextResponse.json(
      {
        message: "adicionado ao carrinho!",
      },
      { status: 200 },
    );
  } catch (err) {
    console.log(err);
    NextResponse.json(
      { message: "Não foi possível adicionar ao carrinho" },
      { status: 500 },
    );
  }
}
