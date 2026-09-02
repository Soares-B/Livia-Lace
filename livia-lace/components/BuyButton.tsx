"use client"

import { Button } from "./ui/button";

export default function BuyButton({produto}: {produto: bigint}){
    async function buyProduct(id: bigint){
        const response = await fetch("/api/addProductCart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id?.toString(),
                amount: 1
            })
        })
    }
    
    return(
        <Button variant="main" className="absolute bottom-0 left-0 w-full h-[15%] font-[MontserratBold] rounded-b-[10px]" onClick={() => buyProduct(produto)}>
            Adicionar ao carrinho
        </Button>
    );
}