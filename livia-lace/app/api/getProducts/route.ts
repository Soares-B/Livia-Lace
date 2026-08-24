import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const filtros = await request.json();

    console.log("Filtros recebidos:", filtros);

    const {
      laco,
      xuxinha,
      tiara,
      faixaBebe,
      presilha,
      pulseira,
      inicial,
      final,
    } = filtros;

    const tiposSelecionados: string[] = [];

    if (laco) tiposSelecionados.push("Bico de pato");
    if (xuxinha) tiposSelecionados.push("Xuxinha");
    if (tiara) tiposSelecionados.push("Tiara");
    if (faixaBebe) tiposSelecionados.push("Faixa de bebe");
    if (presilha) tiposSelecionados.push("Presilha");
    if (pulseira) tiposSelecionados.push("Pulseira");

    const nenhumSelecionado = tiposSelecionados.length === 0;

    const precoInicial =
      typeof inicial === "number" ? inicial : undefined;

    const precoFinal =
      typeof final === "number" ? final : undefined;

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
                ...(precoInicial !== undefined
                  ? { gte: precoInicial }
                  : {}),

                ...(precoFinal !== undefined
                  ? { lte: precoFinal }
                  : {}),
              },
            }
          : {}),
      },

      orderBy: [
        {
          tipo: "asc",
        },
        {
          valor: "asc",
        },
        {
          nome: "asc",
        },
      ],
    });

    const produtosJson = produtos.map((produto) => ({
      product_id: Number(produto.product_id),
      tipo: produto.tipo,
      nome: produto.nome,
      valor: produto.valor,
      quantidade:
        produto.quantidade !== null
          ? Number(produto.quantidade)
          : null,
      tamanho: produto.tamanho,
      imagem: produto.imagem,
      image_overlay: produto.image_overlay,
    }));

    console.log("Quantidade encontrada:", produtosJson.length);

    return NextResponse.json(produtosJson);
  } catch (error) {
    console.error("ERRO NA API:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      {
        status: 500,
      }
    );
  }
}