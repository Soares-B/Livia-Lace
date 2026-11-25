import Link from "next/link";
import { CircleUserRound, ShoppingCart } from "lucide-react";

export default function IconButtons({logado}: {logado: boolean;}) {
    return(
        <>
            <Link href={logado ? "/Cart" : "/Login"} aria-label="Carrinho" className="m-[0_10px]">
                <ShoppingCart className="w-[50px] h-[50px]" />
            </Link>
            <Link href={logado ? "/User/Info" : "/Login"} aria-label="Minha conta" className="m-[0_10px]">
                <CircleUserRound className="w-[50px] h-[50px]" />
            </Link>
        </>
    );
}
