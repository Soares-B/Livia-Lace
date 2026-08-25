"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import TaglineHeader from "@/components/CatalogueAnimation";
import ProductSection from "@/components/ProductSection";

import localFont from "next/font/local";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

const Montserrat = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

type Filtros = {
  laco: boolean;
  xuxinha: boolean;
  tiara: boolean;
  faixaBebe: boolean;
  presilha: boolean;
  pulseira: boolean;
};

export default function Catalogue() {
  const [filtros, setFiltros] = React.useState<Filtros>({
    laco: false,
    xuxinha: false,
    tiara: false,
    faixaBebe: false,
    presilha: false,
    pulseira: false,
  });

  const [precoInicial, setPrecoInicial] = React.useState("");
  const [precoFinal, setPrecoFinal] = React.useState("");

  const toggleFiltro = (filtro: keyof Filtros, checked: boolean) => {
    setFiltros((prev) => ({
      ...prev,
      [filtro]: checked,
    }));
  };

  const formatPrice = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (!numbers) {
      return "";
    }

    const amount = Number(numbers) / 100;

    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <>
      <header
        id="topo"
        className="relative h-[300px] w-full scroll-m-[80px] bg-[url('/Imagens/LogoBackground.jpeg')] bg-cover bg-[center_35%] bg-no-repeat"
      >
        <div className="absolute inset-0 bg-black/50" />

        <TaglineHeader />
      </header>

      <main className="mt-[3%] flex">
        <aside className="sticky top-[150px] ml-[3%] flex h-[500px] w-[20%] flex-col">
          <h2 className="block font-[MontserratBold] m-[0_auto]">Filtros</h2>

          <hr className="mb-[5%] w-full border-[var(--darkPink-Pastel)]" />

          <label
            className={`font-[MontserratBold] mb-[3%] ml-[10%] flex cursor-pointer select-none items-center gap-[8px] text-lg`}
          >
            <Checkbox
              variant="main"
              size="lg"
              checked={filtros.laco}
              onCheckedChange={(checked) =>
                toggleFiltro("laco", checked === true)
              }
            />
            Laço bico de pato
          </label>

          <label
            className={`font-[MontserratBold] mb-[3%] ml-[10%] flex cursor-pointer select-none items-center gap-[8px] text-lg`}
          >
            <Checkbox
              variant="orange"
              size="lg"
              checked={filtros.xuxinha}
              onCheckedChange={(checked) =>
                toggleFiltro("xuxinha", checked === true)
              }
            />
            Xuxinha
          </label>

          <label
            className={`font-[MontserratBold] mb-[3%] ml-[10%] flex cursor-pointer select-none items-center gap-[8px] text-lg`}
          >
            <Checkbox
              variant="yellow"
              size="lg"
              checked={filtros.tiara}
              onCheckedChange={(checked) =>
                toggleFiltro("tiara", checked === true)
              }
            />
            Tiara
          </label>

          <label
            className={`font-[MontserratBold] mb-[3%] ml-[10%] flex cursor-pointer select-none items-center gap-[8px] text-lg`}
          >
            <Checkbox
              variant="green"
              size="lg"
              checked={filtros.faixaBebe}
              onCheckedChange={(checked) =>
                toggleFiltro("faixaBebe", checked === true)
              }
            />
            Faixa de bebê
          </label>

          <label
            className={`font-[MontserratBold] mb-[3%] ml-[10%] flex cursor-pointer select-none items-center gap-[8px] text-lg`}
          >
            <Checkbox
              variant="blue"
              size="lg"
              checked={filtros.presilha}
              onCheckedChange={(checked) =>
                toggleFiltro("presilha", checked === true)
              }
            />
            Presilha de cabelo
          </label>

          <label
            className={`font-[MontserratBold] mb-[3%] ml-[10%] flex cursor-pointer select-none items-center gap-[8px] text-lg`}
          >
            <Checkbox
              variant="lilac"
              size="lg"
              checked={filtros.pulseira}
              onCheckedChange={(checked) =>
                toggleFiltro("pulseira", checked === true)
              }
            />
            Pulseira
          </label>

          <hr className="mb-[5%] w-full border-[var(--darkPink-Pastel)]" />
          <h2 className="block font-[MontserratBold] m-[0_auto]">Valor</h2>

          <div className="mt-[5%] flex w-full gap-[10%]">
            <Input
              type="text"
              placeholder="De R$0,00"
              value={precoInicial}
              onChange={(e) => {
                setPrecoInicial(formatPrice(e.target.value));
              }}
            />

            <Input
              type="text"
              placeholder="Até R$99,99"
              value={precoFinal}
              onChange={(e) => {
                setPrecoFinal(formatPrice(e.target.value));
              }}
            />
          </div>
        </aside>

        <section className="flex-1">
          <ProductSection
            filtros={filtros}
            precoInicial={precoInicial}
            precoFinal={precoFinal}
          />
        </section>
      </main>
    </>
  );
}
