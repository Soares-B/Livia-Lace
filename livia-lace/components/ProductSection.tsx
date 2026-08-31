"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageHoverOpacity } from "@/components/Animation/HomeAnimation";
import { Button } from "@/components/ui/button";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

export type Filtros = {
  laco: boolean;
  xuxinha: boolean;
  tiara: boolean;
  faixaBebe: boolean;
  presilha: boolean;
  pulseira: boolean;
};

export type Product = {
  product_id: number;
  tipo: string | null;
  nome: string | null;
  valor: number | null;
  quantidade: number | null;
  tamanho: string | null;
  imagem: string | null;
  image_overlay: string | null;
};

type ProductSectionProps = {
  filtros: Filtros;
  precoInicial: string;
  precoFinal: string;
};

export default function ProductSection({
  filtros,
  precoInicial,
  precoFinal,
}: ProductSectionProps) {
  const [produtos, setProdutos] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function buscarProdutos() {
      try {
        setLoading(true);

        const converterPreco = (valor: string) => {
          if (!valor) return undefined;

          const numero = valor
            .replace("R$", "")
            .replace(/\./g, "")
            .replace(",", ".")
            .trim();

          const resultado = Number(numero);

          return Number.isNaN(resultado)
            ? undefined
            : resultado;
        };

        const inicial = converterPreco(precoInicial);
        const final = converterPreco(precoFinal);

        const response = await fetch("/api/getProducts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...filtros,
            inicial,
            final,
          }),
        });

        if (!response.ok) {
          const erro = await response.text();

          console.error("Resposta da API:", erro);

          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        setProdutos(data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setProdutos([]);
      } finally {
        setLoading(false);
      }
    }

    buscarProdutos();
  }, [filtros, precoInicial, precoFinal]);

  if (loading) {
    return (
      <div className="flex w-full justify-center py-[5%]">
        <p className={Montserrat.className}>
          Carregando produtos...
        </p>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="flex w-full justify-center py-[5%]">
        <p className={Montserrat.className}>
          Nenhum produto encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-[3%] m-[0%_10%]">
      {produtos.map((produto) => (
        <article
          key={produto.product_id}
          className="
            relative
            bg-white
            flex-[1_1_250px]
            max-w-[250px]
            min-w-[120px]
            h-[400px]
            rounded-[10px]
            overflow-hidden
            mb-[3%]
          "
        >

          <Link href={`/Product/${produto.product_id}`}>
            {produto.imagem && (
              <Suspense fallback={
                <Skeleton className="w-[500px] h-[500px]"/>
              }>
                <Image
                  src={produto.imagem}
                  width={500}
                  height={500}
                  className="w-full aspect-square object-cover rounded-t-[10px] select-none"
                  alt={produto.nome ?? "Produto"}
                />
              </Suspense>
            )}
          </Link>


          {produto.image_overlay && (
            <Link href={`/Product/${produto.product_id}`}>
              <ImageHoverOpacity produto={produto} />
            </Link>
          )}

          <div className="absolute bottom-[15%] left-[3%]">
            <p
              className={`
                ${Montserrat.className}
                font-bold
                text-sm
                h-[40px]
                mb-[3%]
              `}
            >
              {produto.nome}
            </p>

            <p
              className={`
                ${MontserratBold.className}
                text-2xl
                mb-[2%]
              `}
            >
              R$
              {produto.valor !== null
                ? produto.valor
                    .toFixed(2)
                    .replace(".", ",")
                : "0,00"}
            </p>
          </div>

          <Button
            variant="main"
            className={`
              absolute
              bottom-0
              left-0
              w-full
              h-[15%]
              rounded-b-[10px]
              ${MontserratBold.className}
            `}
            onClick={() => {
              console.log(
                "Adicionar produto:",
                produto.product_id
              );
            }}
          >
            Adicionar ao carrinho
          </Button>
        </article>
      ))}
    </div>
  );
}