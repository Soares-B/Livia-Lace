'use client'

import Image from "next/image";
import Link from "next/link";
import localFont from "next/font/local";
import { Button } from "./ui/button";
import { useState } from "react";

const Montserrat = localFont({
    src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf"
})

export default function ProductData({id, imagem, nome, valor, quantidade}: {id: bigint | null, imagem: string | null, nome: string | null, valor: number | null, quantidade: bigint | null}){

    const [amount, setAmount] = useState(1);

    async function buyProduct(){
        const response = await fetch("/api/addProductCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id?.toString(),
                amount: amount
            })
        })
    }
    
    return(
        <div className="m-[40_auto] rounded-[15px] bg-white w-[80vw] h-[85vh] grid grid-cols-[.1fr_1fr_1fr] grid-rows-[.5fr_1.5fr_2fr_2fr_.5fr]">
            <Image src={imagem!} width={1200} height={1200} alt={nome!} className="col-[2/3] row-[2/4] w-full h-auto object-cover rounded-[15px] select-none"/>
            <div className="flex col-3 row-[2/3] m-[2%] w-[95%] flex-col gap-[5%]">
                <p className="font-[Montserrat] font-xl">
                    <Link href="/" className="text-black no-underline">
                    Início
                    </Link>
                    {" > "}
                    <Link href="/Catalogue" className="text-black no-underline">
                    Catálogo
                    </Link>
                    {" > "}
                    {nome}
                </p>
                <p className="font-[Montserrat] text-3xl">{nome}</p>
                <p className="text-start font-[Montserrat] text-5xl">R${String(valor!.toFixed(2)).replace('.', ',')}</p>
            </div>
            <div className="col-3 row-3 m-[2%] font-[Montserrat] text-3xl">
                <p>quantidade: {quantidade}</p>
            </div>
            <div className="m-[0_2%] col-3 row-3 mt-[2%] flex justify-end items-end flex-row gap-[5%]">
                <div className="w-[40%] h-[25%] flex justify-between items-center bg-white rounded-[10px] font-[Montserrat] text-2xl border-[2px] border-solid border-[var(--darkPink-Pastel)]">
                    <Button className="font-[Montserrat] font-lg bg-white border-[0px] border-solid border-[FFFFFF00] hover:cursor-pointer focus:outline-none w-[30%] h-full rounded-l-[7px] hover:bg-[var(--orange-Pastel)] text-3xl text-black hover:text-white" onClick={() => setAmount(amount > 1 ? amount - 1 : amount)}>-</Button>
                    <span>{amount}</span>
                    <Button className="font-[Montserrat] font-lg bg-white border-[0px] border-solid border-[FFFFFF00] hover:cursor-pointer focus:outline-none w-[30%] h-full rounded-r-[7px] hover:bg-[var(--green-Pastel)] text-3xl text-black hover:text-white" onClick={() => setAmount(amount + 1)}>+</Button>
                </div>
                <Button className="w-[65%] h-[25%] font-[Montserrat] rounded-[10px] border-[FFFFFF00] bg-[var(--darkerPink)] hover:bg-[var(--darkestPink)] hover:cursor-pointer text-xl" onClick={() => buyProduct()}> Adicionar ao carrinho</Button>
            </div>
            <div className="col-3 row-4 w-full h-full flex items-center justify-center">
                <Image src="/Imagens/BowSVG.png" width={287} height={307} alt="Bow SVG" className="max-w-[20%] h-fit select-none"/>
            </div>
        </div>
    );
}