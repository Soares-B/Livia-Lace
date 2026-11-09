import { MercadoPagoConfig, Preference } from "mercadopago";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import getClient from "@/lib/client";
import { toBRLCents } from "@/lib/payment-security.mjs";

const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;

type CartItem = { produto: number; quantidade: number };

function absoluteUrl(value: string, label: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`${label} deve ser uma URL absoluta`);
  }
  if (url.protocol !== "https:" && url.hostname !== "localhost") {
    throw new Error(`${label} deve usar HTTPS`);
  }
  return url.toString().replace(/\/$/, "");
}

function toCents(value: number | { toString(): string }) {
  return toBRLCents(value);
}

export async function POST() {
  let pedidoId: bigint | undefined;
  try {
    if (!accessToken) {
      return NextResponse.json({ error: "Pagamento indisponível" }, { status: 503 });
    }
    const cliente = await getClient();
    if (!cliente) {
      return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
    }

    const cart = await prisma.carrinho.findUnique({ where: { id_client: cliente.id } });
    if (!cart || !Array.isArray(cart.produtos) || cart.produtos.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio ou não encontrado" }, { status: 400 });
    }

    const rawItems = cart.produtos as CartItem[];
    if (rawItems.length > 100) throw new Error("Carrinho contém itens demais");
    const unique = new Set<number>();
    const products = await Promise.all(rawItems.map(async (item) => {
      if (!item || !Number.isSafeInteger(item.produto) || item.produto <= 0 ||
          !Number.isSafeInteger(item.quantidade) || item.quantidade <= 0 || item.quantidade > 100) {
        throw new Error("Produto ou quantidade inválidos");
      }
      if (unique.has(item.produto)) throw new Error("Carrinho contém produtos duplicados");
      unique.add(item.produto);

      const product = await prisma.produtos.findUnique({ where: { product_id: BigInt(item.produto) } });
      if (!product || product.valor === null || !product.nome) throw new Error("Produto indisponível");
      if (product.quantidade !== null && BigInt(item.quantidade) > product.quantidade) {
        throw new Error(`Estoque insuficiente para ${product.nome}`);
      }
      const unitPriceCents = toCents(product.valor);
      if (unitPriceCents <= 0) throw new Error("Preço inválido");
      return { id: product.product_id.toString(), title: product.nome, quantity: item.quantidade,
        unit_price: unitPriceCents / 100, currency_id: "BRL", unitPriceCents };
    }));

    const totalCents = products.reduce((total, item) => total + item.unitPriceCents * item.quantity, 0);
    if (!Number.isSafeInteger(totalCents) || totalCents <= 0) throw new Error("Total do pedido inválido");
    const pedido = await prisma.pedidos.create({
      data: {
        id_client: cliente.id,
        id_carrinho: cart.id,
        valor_total: (totalCents / 100).toFixed(2),
        items: products.map(({ unitPriceCents, ...item }) => ({ ...item, unit_price_cents: unitPriceCents })),
        situa__o: "pendente",
      },
    });
    pedidoId = pedido.id;

    const siteUrlValue = process.env.SITE_URL;
    if (!siteUrlValue) throw new Error("SITE_URL não configurada");
    const siteUrl = absoluteUrl(siteUrlValue, "SITE_URL");
    const webhookUrl = process.env.MERCADO_PAGO_WEBHOOK_URL
      ? absoluteUrl(process.env.MERCADO_PAGO_WEBHOOK_URL, "MERCADO_PAGO_WEBHOOK_URL")
      : `${siteUrl}/api/checkout/webhook`;

    const preference = await new Preference(new MercadoPagoConfig({ accessToken })).create({
      body: {
        items: products.map(({ id, title, quantity, unit_price, currency_id }) => ({
          id, title, quantity, unit_price, currency_id,
        })),
        external_reference: pedido.id.toString(),
        notification_url: webhookUrl,
        back_urls: {
          success: `${siteUrl}/Checkout/PaymentSuccess`,
          failure: `${siteUrl}/Checkout/PaymentFailure`,
          pending: `${siteUrl}/Checkout/PaymentPending`,
        },
        auto_return: "approved",
      },
    });
    if (!preference.id || !preference.init_point) throw new Error("Preferência inválida retornada pelo Mercado Pago");

    await prisma.pedidos.update({ where: { id: pedido.id }, data: { id_preferencia: preference.id } });
    return NextResponse.json({ init_point: preference.init_point });
  } catch (error) {
    console.error("Erro ao criar checkout:", error);
    if (pedidoId !== undefined) {
      await prisma.pedidos.update({ where: { id: pedidoId }, data: { situa__o: "falha_checkout" } }).catch((updateError) => {
        console.error("Erro ao atualizar pedido:", updateError);
      });
    }
    return NextResponse.json({ error: "Não foi possível criar o checkout" }, { status: 400 });
  }
}

