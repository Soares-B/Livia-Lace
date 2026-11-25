"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  const [paying, setPaying] = useState(false);

  // Estado desejado (latest), último estado confirmado pelo servidor (saved) e a gravação em andamento.
  // As gravações são feitas uma por vez e juntam cliques rápidos, para que uma resposta atrasada
  // nunca sobrescreva uma alteração mais nova.
  const latest = useRef(cart[0]);
  const saved = useRef(cart[0]);
  const flushing = useRef<Promise<void> | null>(null);

  useEffect(() => {
    // Ao voltar do Mercado Pago pelo botão "voltar", a página pode vir do cache com o botão travado.
    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) setPaying(false);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);

  function showError(message: string, description: string) {
    setErrMessage(message);
    setErrDesc(description);
    setError(true);
  }

  function flush(): Promise<void> {
    if (flushing.current) return flushing.current;

    const run = async () => {
      try {
        while (latest.current !== saved.current) {
          const target = latest.current;
          try {
            await insertIntoCart(target);
            saved.current = target;
          } catch (err) {
            console.error(err);
            // Desfaz a alteração na tela para refletir o que realmente está salvo.
            latest.current = saved.current;
            setProducts(saved.current);
            showError(
              "Erro ao atualizar carrinho",
              "Não foi possível salvar as alterações. Tente novamente.",
            );
            return;
          }
        }
      } finally {
        flushing.current = null;
      }
    };

    flushing.current = run();
    return flushing.current;
  }

  function updateCart(newProducts: products) {
    latest.current = newProducts;
    setProducts(newProducts);
    void flush();
  }

  function diminuirQuantidade(id: number) {
    const newProducts = products.map((produto) =>
      produto.produto === id
        ? {
            ...produto,
            quantidade: Math.max(1, produto.quantidade - 1),
          }
        : produto,
    );

    updateCart(newProducts);
  }

  function aumentarQuantidade(id: number) {
    const newProducts = products.map((produto) =>
      produto.produto === id
        ? {
            ...produto,
            quantidade: produto.quantidade + 1,
          }
        : produto,
    );

    updateCart(newProducts);
  }

  function removerProduto(id: number) {
    const newProducts = products.filter(
      (produto) => produto.produto !== id,
    );

    updateCart(newProducts);
  }

  const valorTotal = products.reduce(
    (total, produto) => total + (produto.valor ?? 0) * produto.quantidade,
    0,
  );

  async function insertIntoCart(cartProducts: products) {
    const dataModified = cartProducts.map((produto) => ({
      produto: produto.produto,
      quantidade: produto.quantidade,
    }));

    const response = await fetch("/api/insertIntoCart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart: dataModified,
      }),
    });

    if (!response.ok) {
      throw new Error("Não foi possível atualizar o carrinho");
    }
  }

  async function buyButton(){
    if (addressMissing || paying || products.length === 0){
      return;
    }

    setPaying(true);

    try{
      // Espera as alterações pendentes terminarem e grava o carrinho exibido antes de cobrar.
      await flush();
      await insertIntoCart(latest.current);
      saved.current = latest.current;

      const response = await fetch("/api/checkout", {
        method: "POST"})

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.init_point) {
        throw new Error("Não foi possível criar o checkout");
      }

      window.location.assign(data.init_point);
    }catch(err){
      console.error(err)
      setPaying(false)
      showError(
        "Erro ao realizar compra",
        "Ocorreu um erro ao realizar a compra! Tente novamente mais tarde",
      )
    }
  }

  return (
    <>
    <AlertDialog open={error} onOpenChange={setError}>
        <AlertDialogContent size="sm" className="font-montserrat-bold">
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
                  {produto.imagem ? (
                    <Image
                      src={produto.imagem}
                      width={200}
                      height={200}
                      alt={produto.nome ?? ""}
                      className="rounded-[10%] select-none"
                    />
                  ) : (
                    <div className="h-[200px] w-[200px] rounded-[10%] bg-white" />
                  )}
                </Link>

                <Link href={`/Product/${produto.produto}`} className="z-2">
                  <p className="mt-[1%] ml-[5%] font-montserrat text-2xl w-full">
                    {produto.nome}
                  </p>
                </Link>
              </div>

              <p className="absolute bottom-[4%] right-[20%] font-montserrat text-4xl">
                {`R$${precoTotal.toFixed(2).replace(".", ",")}`}
              </p>

              <Button
                variant="main"
                className="absolute bottom-0 right-[3%] bg-white hover:bg-[var(--orange-Pastel)] w-[15%] h-[20%]"
                onClick={() => removerProduto(produto.produto)}
              >
                Remover
              </Button>

              <div className="absolute bottom-[30%] right-[3%] w-[15%] h-[20%] flex justify-between items-center bg-white rounded-[10px] font-montserrat text-xl border-2 border-solid border-[var(--darkPink-Pastel)]">
                <Button
                  className="font-montserrat text-2xl bg-white text-black border-0 border-solid border-[#FFFFFF00] w-[30%] h-full hover:cursor-pointer rounded-[7px] hover:bg-[var(--orange-Pastel)]"
                  onClick={() => diminuirQuantidade(produto.produto)}
                >
                  -
                </Button>

                <span className="select-none">{produto.quantidade}</span>

                <Button
                  className="font-montserrat text-2xl bg-white text-black border-0 border-solid border-[#FFFFFF00] w-[30%] h-full hover:cursor-pointer rounded-[7px] hover:bg-[var(--green-Pastel)]"
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

      {products.length > 0 ? <div className="sticky z-1 bottom-0 w-full h-[150px] bg-[var(--lightPink-Pastel)] flex justify-end items-center gap-[15px] rounded-[25px]">
        <p className={`mr-[5%] transition-[1s] font-montserrat text-2xl text-[var(--darkestPink)] ${addressMissing ? "opacity-100" : "opacity-0"} ${addressMissing ? "pointer-events-auto" : "pointer-events-none"} bg-[var(--lightPink-Pastel)]`}>Adicione todas as informações na página do <Link href="/User/Address" className="underline">Usuário</Link></p>
        <p className="font-montserrat text-3xl mr-[2%]">
          {`R$${valorTotal.toFixed(2).replace(".", ",")}`}
        </p>

        <Button
          variant="main"
          className="mr-[5%] w-fit font-montserrat text-lg bg-white rounded-[10px] border-2 border-solid border-[var(--darkPink-Pastel)] p-[1.2%] text-black"
          disabled={paying}
          onClick={() => buyButton()}
        >
          {paying ? "Redirecionando..." : "Prosseguir para pagamento"}
        </Button>
      </div> : <p className="font-montserrat text-2xl m-[0_auto] mt-[2%] text-[var(--darkestPink)]">Nenhum produto no carrinho</p> }
    </>
  );
}
