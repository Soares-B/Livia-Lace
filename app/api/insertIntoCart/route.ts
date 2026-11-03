import getClient from "@/lib/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type product = {
  produto: number;
  quantidade: number;
};

export async function POST(request: Request) {
  try {
    const client = await getClient();

    if (!client){
      return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
      );
    }

    const data = await request.json();

    const { cart } = data;

    if (!Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json(
        { message: "Carrinho inválido ou vazio" },
        { status: 400 }
      );
    }

    const carrinho = await Promise.all(
      cart.map(async (item: product) => {
        const produto = await prisma.produtos.findUnique({
          where: {
            product_id: BigInt(item.produto),
          },
        });

        if (!produto || produto.valor === null) {
          throw new Error(`Produto ${item.produto} não encontrado`);
        }

        if (
          !Number.isInteger(item.produto) ||
          item.produto <= 0
        ) {
          throw new Error("ID de produto inválido");
        }

        if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
          throw new Error("Quantidade inválida");
        }

        return {
          produto: item.produto,
          quantidade: item.quantidade,
          valor: produto.valor.toFixed(2),
        };
      })
    );

    const valorTotalCentavos = carrinho.reduce(
      (total, item) =>
        total + Math.round(Number(item.valor) * 100) * item.quantidade,
      0
    );

    const valorTotal = (valorTotalCentavos / 100).toFixed(2);

    await prisma.carrinho.upsert({
      where: {
        id_client: client.id,
      },
      update: {
        produtos: carrinho,
        valor_total: valorTotal,
      },
      create: {
        id_client: client.id,
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
