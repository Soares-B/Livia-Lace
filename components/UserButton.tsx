"use client"

import { CircleUserRound, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function IconButtons({logado}: {logado: boolean;}) {
    const router = useRouter();

    function handleClick(info: string) {
        if (logado){
            if (info === "user"){
                router.push("/User/Info");
            }else{
                router.push("/Cart")
            }
        }else{
            router.push("/Login");
        }
    }

    return(
        <>
            <ShoppingCart className="w-[50px] h-[50px] m-[0_10px] hover:cursor-pointer" onClick={() => handleClick('cart')}/>
            <CircleUserRound className="w-[50px] h-[50px] m-[0_10px] hover:cursor-pointer" onClick={() => handleClick('user')}/>
        </>
    );
}