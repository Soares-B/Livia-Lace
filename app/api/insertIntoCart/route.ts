import getClient from "@/lib/client";
import getProduct from "@/lib/product";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type product = {
  produto: number;
  quantidade: number;
};

type value = {
  produto: number;
  valor: number;
  quantidade: number;
}[]

export async function POST(request: Request) {
  try {
    const client = await getClient();

    if (!client){
      return NextResponse.json(
      {
        message: "Usuário não encontrado",
      },
      { status: 401 },
    );
    }

    const data = await request.json();

    const { cart } = data;

    const newCart: value = await Promise.all(
      cart.map(async (p: any) => {
      const produto = p.produto;
      const productData: any = await getProduct(p.produto)

      if (!productData){
        throw new Error("Produto não encontrado");
      }

      if (productData.valor === null) {
        throw new Error("Produto sem preço cadastrado");
      }

      const valor = productData.valor
      const quantidade = p.quantidade

      if (!Number.isInteger(quantidade) || quantidade <= 0) {
        throw new Error("Quantidade inválida");
      }

      return {produto: produto, valor: valor, quantidade: quantidade}
    }))
    
    const valorTotal = newCart.reduce((total, current) => {
      total += current.valor * current.quantidade
      return total
    }, 0);

    const carrinho = newCart.map((product: product) => ({
      produto: (product.produto),
      quantidade: product.quantidade,
    }));

    await prisma.carrinho.update({
      where: {
        id_client: client.id,
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
