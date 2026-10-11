"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import localFont from "next/font/local";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
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

// Agrupa um array em blocos de N itens
function chunkArray<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}


function ProductShelf({ products }: { products: Product[] }) {
  const [produtoEsquerda, produtoMeio, produtoDireita] = products;

  return (
    <div className="relative w-full mb-[4%] select-none">

      <div className="flex w-full">
        <div className="relative flex-1 aspect-[514/323]">
          <Image src="/Imagens/Prateleira-left.png" alt="" fill className="object-fill" />
        </div>
        <div className="relative flex-1 aspect-[514/323]">
          <Image src="/Imagens/Prateleira-middle.png" alt="" fill className="object-fill" />
        </div>
        <div className="relative flex-1 aspect-[514/323]">
          <Image src="/Imagens/Prateleira-right.png" alt="" fill className="object-fill" />
        </div>
      </div>

      <div className="absolute inset-0 flex">

        <div className="relative flex-1 flex items-end justify-center pb-[2%]">
          {produtoEsquerda?.imagem && (
            <Link
              href={`/Product/${produtoEsquerda.product_id}`}
              className="block w-[50%] translate-x-[25%] translate-y-[-20%] transition-[.5s] hover:translate-y-[-30%] hover:scale-[105%]"
            >
              <Suspense fallback={<Skeleton className="w-full aspect-square" />}>
                <Image
                  src={produtoEsquerda.imagem}
                  width={300}
                  height={300}
                  className="w-full aspect-square object-cover rounded-[10px] select-none"
                  alt={produtoEsquerda.nome ?? "Produto"}
                />
              </Suspense>
            </Link>
          )}

        </div>
        <div className="relative flex-1 flex items-end justify-center pb-[2%]">
          {produtoMeio?.imagem && (
            <Link
              href={`/Product/${produtoMeio.product_id}`}
              className="block w-[50%] translate-x-[0%] translate-y-[-20%] transition-[.5s] hover:translate-y-[-30%] hover:scale-[105%]"
            >
              <Suspense fallback={<Skeleton className="w-full aspect-square" />}>
                <Image
                  src={produtoMeio.imagem}
                  width={300}
                  height={300}
                  className="w-full aspect-square object-cover rounded-[10px] select-none"
                  alt={produtoMeio.nome ?? "Produto"}
                />
              </Suspense>
            </Link>
          )}

        </div>
        <div className="relative flex-1 flex items-end justify-center pb-[2%]">
          {produtoDireita?.imagem && (
            <Link
              href={`/Product/${produtoDireita.product_id}`}
              className="block w-[50%] translate-x-[-25%] translate-y-[-20%] transition-[.5s] hover:translate-y-[-30%] hover:scale-[105%]"
            >
              <Suspense fallback={<Skeleton className="w-full aspect-square" />}>
                <Image
                  src={produtoDireita.imagem}
                  width={300}
                  height={300}
                  className="w-full aspect-square object-cover rounded-[10px] select-none"
                  alt={produtoDireita.nome ?? "Produto"}
                />
              </Suspense>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

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
          return Number.isNaN(resultado) ? undefined : resultado;
        };

        const inicial = converterPreco(precoInicial);
        const final = converterPreco(precoFinal);

        const response = await fetch("/api/getProducts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...filtros, inicial, final }),
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
        <p className={Montserrat.className}>Carregando produtos...</p>
      </div>
    );
  }

  if (produtos.length === 0) {
    return (
      <div className="flex w-full justify-center py-[5%]">
        <p className={Montserrat.className}>Nenhum produto encontrado.</p>
      </div>
    );
  }

  const shelves = chunkArray(produtos, 3);

  return (
    <div className="flex flex-col m-[0%_10%]">
      {shelves.map((shelfProducts, i) => (
        <ProductShelf key={i} products={shelfProducts} />
      ))}
    </div>
  );
}