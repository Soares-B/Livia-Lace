import getClient from "@/lib/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type CartItem = { produto: number; quantidade: number };
class CartInputError extends Error {}

export async function POST(request: Request) {
  try {
    const client = await getClient();
    if (!client) return NextResponse.json({ message: "Usuário não autenticado" }, { status: 401 });

    const data = await request.json() as { cart?: unknown };
    if (!Array.isArray(data.cart) || data.cart.length === 0 || data.cart.length > 100) {
      return NextResponse.json({ message: "Carrinho inválido" }, { status: 400 });
    }

    const items: CartItem[] = [];
    for (const entry of data.cart) {
      if (!entry || typeof entry !== "object") {
        return NextResponse.json({ message: "Item inválido" }, { status: 400 });
      }
      const item = entry as Record<string, unknown>;
      const id = item.produto;
      const quantity = item.quantidade;
      if (!Number.isSafeInteger(id) || (id as number) <= 0 || !Number.isSafeInteger(quantity) || (quantity as number) <= 0) {
        return NextResponse.json({ message: "Produto ou quantidade inválidos" }, { status: 400 });
      }
      items.push({ produto: id as number, quantidade: quantity as number });
    }

    const aggregated = new Map<number, number>();
    for (const item of items) {
      const quantity = (aggregated.get(item.produto) ?? 0) + item.quantidade;
      if (!Number.isSafeInteger(quantity)) throw new CartInputError("Quantidade inválida");
      aggregated.set(item.produto, quantity);
    }
    const cart = Array.from(aggregated, ([produto, quantidade]) => ({ produto, quantidade }));
    const prices = await Promise.all(cart.map(async (item) => {
      const product = await prisma.produtos.findUnique({ where: { product_id: BigInt(item.produto) } });
      if (!product || product.valor === null) throw new CartInputError("Produto indisponível");
      return Math.round(Number(product.valor) * 100) * item.quantidade;
    }));
    const totalCents = prices.reduce((sum, value) => sum + value, 0);
    if (!Number.isSafeInteger(totalCents)) throw new CartInputError("Total inválido");

    await prisma.carrinho.upsert({
      where: { id_client: client.id },
      update: { produtos: cart, valor_total: (totalCents / 100).toFixed(2) },
      create: { id_client: client.id, produtos: cart, valor_total: (totalCents / 100).toFixed(2) },
    });
    return NextResponse.json({ message: "Carrinho atualizado com sucesso" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar carrinho:", error);
    return NextResponse.json({ message: "Não foi possível atualizar o carrinho" }, {
      status: error instanceof CartInputError ? 400 : 500,
    });
  }
}

