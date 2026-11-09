import getClient from "@/lib/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

type CartItem = { produto: number; quantidade: number };

export async function POST(request: Request) {
  try {
    const client = await getClient();
    if (!client) return NextResponse.json({ message: "Não autenticado" }, { status: 401 });

    const body = await request.json() as { id?: unknown; amount?: unknown };
    const validIntegerInput = (value: unknown) =>
      (typeof value === "number" && Number.isSafeInteger(value)) ||
      (typeof value === "string" && /^\d+$/.test(value) && Number.isSafeInteger(Number(value)));
    if (!validIntegerInput(body.id) || !validIntegerInput(body.amount)) {
      return NextResponse.json({ message: "Produto ou quantidade inválidos" }, { status: 400 });
    }
    const id = Number(body.id);
    const amount = Number(body.amount);
    if (!Number.isSafeInteger(id) || id <= 0 || !Number.isSafeInteger(amount) || amount <= 0) {
      return NextResponse.json({ message: "Produto ou quantidade inválidos" }, { status: 400 });
    }

    const product = await prisma.produtos.findUnique({ where: { product_id: BigInt(id) } });
    if (!product || product.valor === null) return NextResponse.json({ message: "Produto indisponível" }, { status: 404 });
    const cart = await prisma.carrinho.findUnique({ where: { id_client: client.id } });
    const items = Array.isArray(cart?.produtos) ? (cart.produtos as CartItem[]) : [];
    if (items.some((item) => !item || !Number.isSafeInteger(item.produto) || item.produto <= 0 ||
      !Number.isSafeInteger(item.quantidade) || item.quantidade <= 0)) {
      return NextResponse.json({ message: "Carrinho inválido" }, { status: 400 });
    }
    const existing = items.find((item) => item.produto === id);
    const nextQuantity = (existing?.quantidade ?? 0) + amount;
    if (!Number.isSafeInteger(nextQuantity)) {
      return NextResponse.json({ message: "Quantidade inválida" }, { status: 400 });
    }
    if (existing) existing.quantidade = nextQuantity;
    else items.push({ produto: id, quantidade: amount });

    const products = await Promise.all(items.map(async (item) => {
      const current = await prisma.produtos.findUnique({ where: { product_id: BigInt(item.produto) } });
      if (!current || current.valor === null) {
        throw new Error("Produto indisponível");
      }
      return { ...item, cents: Math.round(Number(current.valor) * 100) };
    }));
    const totalCents = products.reduce((sum, item) => sum + item.cents * item.quantidade, 0);
    if (!Number.isSafeInteger(totalCents)) return NextResponse.json({ message: "Total inválido" }, { status: 400 });
    await prisma.carrinho.upsert({
      where: { id_client: client.id },
      update: { produtos: items, valor_total: (totalCents / 100).toFixed(2) },
      create: { id_client: client.id, produtos: items, valor_total: (totalCents / 100).toFixed(2) },
    });
    return NextResponse.json({ message: "Adicionado ao carrinho!" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao adicionar ao carrinho:", error);
    return NextResponse.json({ message: "Não foi possível adicionar ao carrinho" }, { status: 500 });
  }
}

