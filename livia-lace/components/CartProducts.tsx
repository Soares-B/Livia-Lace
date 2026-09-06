"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import localFont from "next/font/local";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

type products = {
  produto: number;
  quantidade: number;
  nome?: string;
  valor?: number;
  imagem?: string;
}[];

export default function CartProducts({ cart }: { cart: [products, boolean] }) {
  const [products, setProducts] = useState(cart[0]);
  const addressMissing = cart[1];
  const [error, setError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [errDesc, setErrDesc] = useState("");

  function diminuirQuantidade(id: number) {
    setProducts((prev) =>
      prev.map((produto) =>
        produto.produto === id
          ? {
              ...produto,
              quantidade: Math.max(1, produto.quantidade - 1),
            }
          : produto,
      ),
    );
  }

  function aumentarQuantidade(id: number) {
    setProducts((prev) =>
      prev.map((produto) =>
        produto.produto === id
          ? {
              ...produto,
              quantidade: produto.quantidade + 1,
            }
          : produto,
      ),
    );
  }

  function removerProduto(id: number) {
    setProducts((prev) => prev.filter((produto) => produto.produto !== id));
  }

  const valorTotal = products.reduce(
    (total, produto) => total + (produto.valor ?? 0) * produto.quantidade,
    0,
  );

  async function insertIntoCart(){
    const dataModified = products.map((produto) => ({
    produto: produto.produto,
    quantidade: produto.quantidade,
    valor: produto.valor,
  }));

    console.log(products)

    const cartModified = await fetch("/api/insertIntoCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cart: dataModified
      })
    })

    return cartModified.status
  }

  async function buyButton(){
    if (addressMissing){
      return;
    }
    
    try{
      const status = await insertIntoCart();

      if (status === 200){
          const response = await fetch("/api/checkout", {
            method: "POST"})

          const data = await response.json();

          if (!response.ok || !data.init_point) {
            throw new Error("Não foi possível criar o checkout");
          }

          window.location.href = data.init_point;
      }else{
        setErrMessage("Erro ao atualizar o carrinho")
        setErrDesc("Ocorreu um erro ao atualizar o carrinho! Tente novamente mais tarde")
        setError(true)
      }

    }catch(err){
      console.log(err)
      setErrMessage("Erro ao realizar compra")
      setErrDesc("Ocorreu um erro ao realizar a compra! Tente novamente mais tarde")
      setError(true)
    }
    }

  return (
    <>
    <AlertDialog open={error} onOpenChange={setError}>
        <AlertDialogContent size="sm" className="font-[MontserratBold]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--darkerPink)] text-lg">
              {errMessage}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-[var(--darkPink-Pastel)]">
              {errDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="!grid !grid-cols-1 bg-[var(--lightPink-Pastel)]/50">
            <AlertDialogAction
              onClick={() => setError(false)}
              className="bg-[var(--darkestPink)]/50 hover:bg-[var(--darkestPink)]/75 hover:cursor-pointer"
            >
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {products.map((produto) => {
        const precoTotal = (produto.valor ?? 0) * produto.quantidade;

        return (
          <div key={produto.produto}>
            <article className="relative flex flex-row mt-[2%] mb-[1%] ml-[2%] h-[200px]">
              <div className="absolute flex left-[2%] w-[80%]">
                <Link href={`/Product/${produto.produto}`} className="z-2">
                  <Image
                    src={produto.imagem ?? ""}
                    width={200}
                    height={200}
                    alt={produto.nome ?? ""}
                    className="rounded-[10%] select-none"
                  />
                </Link>

                <Link href={`/Product/${produto.produto}`} className="z-2">
                  <p className="mt-[1%] ml-[5%] font-[Montserrat] text-2xl w-full">
                    {produto.nome}
                  </p>
                </Link>
              </div>

              <p className="absolute bottom-[4%] right-[20%] font-[Montserrat] text-4xl">
                {`R$${precoTotal.toFixed(2).replace(".", ",")}`}
              </p>

              <Button
                variant="main"
                className="absolute bottom-0 right-[3%] bg-white hover:bg-[var(--orange-Pastel)] w-[15%] h-[20%]"
                onClick={() => removerProduto(produto.produto)}
              >
                Remover
              </Button>

              <div className="absolute bottom-[30%] right-[3%] w-[15%] h-[20%] flex justify-between items-center bg-white rounded-[10px] font-[Montserrat] text-xl border-2 border-solid border-[var(--darkPink-Pastel)]">
                <Button
                  className="font-[Montserrat] text-2xl bg-white text-black border-0 border-solid border-[#FFFFFF00] w-[30%] h-full hover:cursor-pointer rounded-[7px] hover:bg-[var(--orange-Pastel)]"
                  onClick={() => diminuirQuantidade(produto.produto)}
                >
                  -
                </Button>

                <span className="select-none">{produto.quantidade}</span>

                <Button
                  className="font-[Montserrat] text-2xl bg-white text-black border-0 border-solid border-[#FFFFFF00] w-[30%] h-full hover:cursor-pointer rounded-[7px] hover:bg-[var(--green-Pastel)]"
                  onClick={() => aumentarQuantidade(produto.produto)}
                >
                  +
                </Button>
              </div>
            </article>

            <hr className="m-[0_auto] mt-[20px] w-[95%] border-[var(--darkPink-Pastel)]" />
          </div>
        );
      })}

      <div className="sticky z-1 bottom-0 w-full h-[150px] bg-[var(--lightPink-Pastel)] flex justify-end items-center gap-[15px] rounded-[25px]">
        <p className={`mr-[5%] transition-[1s] font-[Montserrat] text-2xl text-[var(--darkestPink)] ${addressMissing ? "opacity-100" : "opacity-0"} ${addressMissing ? "pointer-events-auto" : "pointer-events-none"} bg-[var(--lightPink-Pastel)]`}>Adicione todas as informações na página do <Link href="/User/Address" className="underline">Usuário</Link></p>
        <p className="font-[Montserrat] text-3xl mr-[2%]">
          {`R$${valorTotal.toFixed(2).replace(".", ",")}`}
        </p>

        <Button
          variant="main"
          className="mr-[5%] w-fit font-[Montserrat] text-lg bg-white rounded-[10px] border-2 border-solid border-[var(--darkPink-Pastel)] p-[1.2%] text-black"
          onClick={() => buyButton()}
        >
          Prosseguir para pagamento
        </Button>
      </div>
    </>
  );
}
