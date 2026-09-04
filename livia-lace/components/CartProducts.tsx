"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import localFont from "next/font/local";
import { useState } from "react";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

type cart = {
  produto: number;
  quantidade: number;
}[];

type productInfo = {
  nome: string;
  imagem: string;
  product_id: bigint;
  valor: number;
}[];

export default function CartProducts({
  cart,
  productInfo,
  userInfo
}: {
  cart: cart;
  productInfo: productInfo;
  userInfo: UserInfo;
}) {
  const [cartItems, setCartItems] = useState(cart);

  function aumentarQuantidade(id: number) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.produto === id
          ? { ...item, quantidade: item.quantidade + 1 }
          : item,
      ),
    );
  }

  function diminuirQuantidade(id: number) {
    setCartItems((prev) =>
      prev.map((item) =>
        item.produto === id
          ? {
              ...item,
              quantidade: Math.max(1, item.quantidade - 1),
            }
          : item,
      ),
    );
  }

  function removerProduto(id: number) {
    setCartItems((prev) =>
      prev.filter((item) => item.produto !== id),
    );
  }

  const valorTotal = cartItems.reduce((total, item) => {
    const info = productInfo.find(
      (prod) => prod.product_id === BigInt(item.produto),
    );

    return total + (info?.valor ?? 0) * item.quantidade;
  }, 0);

  return (
    <div>
      {cartItems.map((produto) => {
        const info = productInfo.find(
          (prod) => prod.product_id === BigInt(produto.produto),
        );

        const precoTotal = (info?.valor ?? 0) * produto.quantidade;

        return (
          <Fragment key={produto.produto}>
            <article className="relative flex flex-row m-[2%] h-[200px]">
              <div className="absolute flex left-[2%] w-[80%]">
                <Link href={`/Product/${produto.produto}`} className="z-1">
                  <Image
                    src={info?.imagem ?? ""}
                    alt=""
                    width={200}
                    height={200}
                    className="rounded-[10%]"
                  />
                </Link>

                <Link href={`/Product/${produto.produto}`} className="z-1">
                  <p className="mt-[1%] ml-[3%] text-2xl w-full font-[Montserrat]">
                    {info?.nome}
                  </p>
                </Link>
              </div>

              <p className="absolute bottom-[4%] right-[20%] font-[MontserratBold] text-3xl">
                {`R$${precoTotal.toFixed(2).replace(".", ",")}`}
              </p>

              <Button
                className="absolute bottom-[0%] right-[3%] w-[15%] h-[20%] font-[Montserrat] text-black text-lg bg-white border-[2px] border-solid border-[var(--darkPink-Pastel)] hover:cursor-pointer hover:text-white hover:bg-[var(--orange-Pastel)]"
                onClick={() => removerProduto(produto.produto)}
              >
                Remover
              </Button>

              <div className="absolute bottom-[30%] right-[3%] w-[15%] h-[20%] flex justify-between items-center rounded-[10px] font-[Montserrat] text-xl border-[2px] border-solid border-[var(--darkPink-Pastel)] bg-white">
                <Button
                  className="font-[Montserrat] text-black text-lg bg-white border-0 border-solid border-[#FFFFFF00] hover:cursor-pointer w-[30%] h-full rounded-[7px] hover:bg-[var(--orange-Pastel)]"
                  onClick={() => diminuirQuantidade(produto.produto)}
                >
                  -
                </Button>

                <span>{produto.quantidade}</span>

                <Button
                  className="font-[Montserrat] text-black text-lg bg-white border-0 border-solid border-[#FFFFFF00] hover:cursor-pointer w-[30%] h-full rounded-[7px] hover:bg-[var(--green-Pastel)]"
                  onClick={() => aumentarQuantidade(produto.produto)}
                >
                  +
                </Button>
              </div>
            </article>

            <hr className="m-[0_auto] mt-[20px] w-[95%] border-[var(--darkPink-Pastel)]" />
          </Fragment>
        );
      })}

      <div className="sticky bottom-0 w-full h-[150px] order-1 bg-[var(--lightPink-Pastel)] flex justify-end items-center gap-[15px] mr-[20px] rounded-[25px]">
        <p className="font-[MontserratBold] text-3xl mr-[2%]">
            {`R$${valorTotal.toFixed(2).replace(".", ",")}`}
        </p>
        <Button variant="main" className="mr-[5%] w-fit font-[Montserrat] text-lg bg-white rounded-[10px] border-2 border-solid border-[var(--darkPink-Pastel)] p-[1.2%] text-black">Prosseguir para pagamento</Button>
      </div>
    </div>
  );
}