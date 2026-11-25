"use client";
import { motion } from "motion/react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAddToCart } from "@/lib/add-to-cart";


type product = {
  product_id: bigint | null;
  tipo: string | null;
  nome: string | null;
  valor: number | null;
  quantidade: bigint | null;
  tamanho: string | null;
  imagem: string | null;
  image_overlay: string | null;
};

export default function Modal({ product }: { product: product }) {
    const [amount, setAmount] = useState(1)
    const router = useRouter();
    const { label, status, add } = useAddToCart();

    // Produtos sem imagem de overlay usam a imagem principal; sem nenhuma das duas não há o que mostrar.
    const imagem = product.image_overlay ?? product.imagem;
    if (!imagem || product.product_id === null || product.valor === null) return null;

  return (
    <motion.div
     initial={{opacity: 0}}
     animate={{opacity: 1}}
     className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <motion.div
        className="relative w-[80%] h-[80%] rounded-xl bg-white p-8 grid grid-cols-[2fr_1fr_1fr] grid-rows-[1fr_1fr_1fr]"
        initial={{ opacity: 0, scale: 0.8, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <Image
            src={imagem}
            width={600}
            height={600}
            alt={product.nome ?? "Produto"}
            className="rounded-[10px] w-full mt-[-2%] ml-[-2%] col-1 row-[1/3]"
        />
        <div className="flex justify-end col-3 row-1">
            <Button variant="main" className="w-fit h-[1px] font-montserrat rounded-[20px] mt-[-9%] mr-[-10%] text-black bg-white hover:text-[var(--darkestPink)] hover:bg-white scale-[90%]" onClick={() => router.back()}>Fechar</Button>
        </div>
        <div className="flex flex-col gap-[10%] w-full col-[2/-1] row-1">
            <h1 className="font-montserrat text-3xl">{product.nome}</h1>
            <p className="text-start font-montserrat-bold text-5xl">R${String(product.valor.toFixed(2)).replace('.', ',')}</p>
        </div>
        <div className="m-[0_2%] col-[2/-1] row-2 mt-[2%] flex justify-end items-end flex-row gap-[5%]">
            <div className="w-[40%] h-[25%] flex justify-between items-center bg-white rounded-[10px] font-montserrat text-2xl border-[2px] border-solid border-[var(--darkPink-Pastel)]">
                <Button className="font-montserrat font-lg bg-white border-[0px] border-solid border-[FFFFFF00] hover:cursor-pointer focus:outline-none w-[30%] h-full rounded-l-[7px] hover:bg-[var(--orange-Pastel)] text-3xl text-black hover:text-white" onClick={() => setAmount(amount > 1 ? amount - 1 : amount)}>-</Button>
                <span>{amount}</span>
                <Button className="font-montserrat font-lg bg-white border-[0px] border-solid border-[FFFFFF00] hover:cursor-pointer focus:outline-none w-[30%] h-full rounded-r-[7px] hover:bg-[var(--green-Pastel)] text-3xl text-black hover:text-white" onClick={() => setAmount(amount + 1)}>+</Button>
            </div>
            <Button className="w-[65%] h-[25%] font-montserrat rounded-[10px] border-[FFFFFF00] bg-[var(--darkerPink)] hover:bg-[var(--darkestPink)] hover:cursor-pointer text-xl" disabled={status === "pending"} onClick={() => add(product.product_id!, amount)}>{label}</Button>
        </div>
        <div className="col-[2/-1] row-3 w-full h-full flex items-center justify-center">
            <Image src="/Imagens/BowSVG.png" width={287} height={307} alt="Bow SVG" className="max-w-[20%] h-fit select-none"/>
        </div>
      </motion.div>
    </motion.div>
  );
}
