"use client"

import { Button } from "./ui/button";
import { useAddToCart } from "@/lib/add-to-cart";

export default function BuyButton({produto}: {produto: bigint}){
    const { label, status, add } = useAddToCart();

    return(
        <Button variant="main" disabled={status === "pending"} className="absolute bottom-0 left-0 w-full h-[15%] font-montserrat-bold rounded-b-[10px]" onClick={() => add(produto)}>
            {label}
        </Button>
    );
}
