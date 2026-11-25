import getClient from "@/lib/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { toBRLCents } from "@/lib/payment-security.mjs";

type CartItem = { produto: number; quantidade: number };
class CartInputError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

const validIntegerInput = (value: unknown) =>
  (typeof value === "number" && Number.isSafeInteger(value)) ||
  (typeof value === "string" && /^\d+$/.test(value) && Number.isSafeInteger(Number(value)));

// Rede de segurança: se mesmo com o bloqueio de linha houver conflito (P2034) ou criação simultânea
// do carrinho (P2002), tenta de novo após uma pequena pausa.
async function withRetry<T>(fn: () => Promise<T>, attempts = 4): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (error) {
      const code = (error as { code?: string } | null)?.code;
      if (attempt < attempts && (code === "P2034" || code === "P2002")) {
        await new Promise((resolve) => setTimeout(resolve, 20 * attempt + Math.random() * 30));
        continue;
      }
      throw error;
    }
  }
}

export async function POST(request: Request) {
  try {
    const client = await getClient();
    if (!client) return NextResponse.json({ message: "Não autenticado" }, { status: 401 });

    const body = await request.json().catch(() => null) as { id?: unknown; amount?: unknown } | null;
    if (!body || !validIntegerInput(body.id) || !validIntegerInput(body.amount)) {
      return NextResponse.json({ message: "Produto ou quantidade inválidos" }, { status: 400 });
    }
    const id = Number(body.id);
    const amount = Number(body.amount);
    if (id <= 0 || amount <= 0) {
      return NextResponse.json({ message: "Produto ou quantidade inválidos" }, { status: 400 });
    }

    await withRetry(() => prisma.$transaction(async (tx) => {
      // Bloqueia a linha do carrinho: requisições simultâneas do mesmo cliente (ex.: duplo clique)
      // passam a ser executadas uma de cada vez, cada uma partindo do carrinho já atualizado pela anterior.
      await tx.$queryRaw`SELECT id FROM "Carrinho" WHERE id_client = ${client.id} FOR UPDATE`;
      const cart = await tx.carrinho.findUnique({ where: { id_client: client.id } });
      const stored = Array.isArray(cart?.produtos) ? (cart.produtos as Partial<CartItem>[]) : [];

      // Itens corrompidos no carrinho são descartados em vez de travar novas adições.
      const quantities = new Map<number, number>();
      for (const item of stored) {
        if (item && Number.isSafeInteger(item.produto) && item.produto! > 0 &&
            Number.isSafeInteger(item.quantidade) && item.quantidade! > 0) {
          quantities.set(item.produto!, (quantities.get(item.produto!) ?? 0) + item.quantidade!);
        }
      }

      const nextQuantity = (quantities.get(id) ?? 0) + amount;
      if (!Number.isSafeInteger(nextQuantity)) throw new CartInputError("Quantidade inválida", 400);
      quantities.set(id, nextQuantity);

      const products = await tx.produtos.findMany({
        where: { product_id: { in: [...quantities.keys()].map((pid) => BigInt(pid)) } },
      });
      const priceCents = new Map(products.map((p) => [Number(p.product_id), toBRLCents(p.valor)]));
      if (!priceCents.has(id)) throw new CartInputError("Produto indisponível", 404);

      // Produtos que saíram do catálogo deixam de bloquear o carrinho: são removidos dele.
      const items: CartItem[] = [...quantities]
        .filter(([produto]) => priceCents.has(produto))
        .map(([produto, quantidade]) => ({ produto, quantidade }));
      const totalCents = items.reduce((sum, item) => sum + priceCents.get(item.produto)! * item.quantidade, 0);
      if (!Number.isSafeInteger(totalCents)) throw new CartInputError("Total inválido", 400);

      const valor_total = (totalCents / 100).toFixed(2);
      await tx.carrinho.upsert({
        where: { id_client: client.id },
        update: { produtos: items, valor_total },
        create: { id_client: client.id, produtos: items, valor_total },
      });
    }));

    return NextResponse.json({ message: "Adicionado ao carrinho!" }, { status: 200 });
  } catch (error) {
    if (error instanceof CartInputError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("Erro ao adicionar ao carrinho:", error);
    return NextResponse.json({ message: "Não foi possível adicionar ao carrinho" }, { status: 500 });
  }
}
