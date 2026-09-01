"use client"

import { CircleUserRound, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export default function IconButtons({logado}: {logado: boolean;}) {
        const router = useRouter();

        function handleClick() {
            if (logado) {
                router.push("/User/Info");
            } else {
                router.push("/Login");
            }
        }

    return(
        <>
            <ShoppingCart className="w-[50px] h-[50px] m-[0_10px] hover:cursor-pointer" />
            <CircleUserRound className="w-[50px] h-[50px] m-[0_10px] hover:cursor-pointer" onClick={handleClick}/>
        </>
    );
}