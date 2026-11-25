import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const filtros: unknown = await request.json().catch(() => null);
    if (!filtros || typeof filtros !== "object") {
      return NextResponse.json({ error: "Filtros inválidos." }, { status: 400 });
    }

    const {
      laco,
      xuxinha,
      tiara,
      faixaBebe,
      presilha,
      pulseira,
      inicial,
      final,
    } = filtros as Record<string, unknown>;

    const tiposSelecionados: string[] = [];

    if (laco === true) tiposSelecionados.push("Bico de pato");
    if (xuxinha === true) tiposSelecionados.push("Xuxinha");
    if (tiara === true) tiposSelecionados.push("Tiara");
    if (faixaBebe === true) tiposSelecionados.push("Faixa de bebe");
    if (presilha === true) tiposSelecionados.push("Presilha");
    if (pulseira === true) tiposSelecionados.push("Pulseira");

    const nenhumSelecionado = tiposSelecionados.length === 0;

    const precoInicial = typeof inicial === "number" && Number.isFinite(inicial) ? inicial : undefined;
    const precoFinal = typeof final === "number" && Number.isFinite(final) ? final : undefined;

    const produtos = await prisma.produtos.findMany({
      where: {
        ...(nenhumSelecionado
          ? {}
          : {
              tipo: {
                in: tiposSelecionados,
              },
            }),
        ...(precoInicial !== undefined || precoFinal !== undefined
          ? {
              valor: {
                ...(precoInicial !== undefined ? { gte: precoInicial } : {}),
                ...(precoFinal !== undefined ? { lte: precoFinal } : {}),
              },
            }
          : {}),
      },
      orderBy: [
        { tipo: "asc" },
        { valor: "asc" },
        { nome: "asc" },
      ],
    });

    const produtosJson = produtos.map((produto) => ({
      product_id: Number(produto.product_id),
      tipo: produto.tipo,
      nome: produto.nome,
      valor: produto.valor !== null ? Number(produto.valor) : null,
      quantidade: produto.quantidade !== null ? Number(produto.quantidade) : null,
      tamanho: produto.tamanho,
      imagem: produto.imagem,
      image_overlay: produto.image_overlay,
    }));

    return NextResponse.json(produtosJson);
  } catch (error) {
    console.error("ERRO NA API:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar os produtos." },
      { status: 500 },
    );
  }
}
