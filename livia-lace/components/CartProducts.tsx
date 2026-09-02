import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Fragment } from "react";
import localFont from "next/font/local";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});



type cart = {
    produto: number,
    quantidade: number
}[]

type productInfo = {
    nome: string,
    imagem: string,
    product_id: bigint,
    valor: number
}[]


export default function CartProducts({ cart, productInfo }: {cart: cart, productInfo: productInfo}){

    console.log(productInfo)

    return(
        <div>
            {cart.map((produto) => {
                return(
                    <Fragment key={produto.produto}>
                    <article className="relative flex flex-row m-[2%] h-[200px]">
                        <div className="absolute flex left-[2%] w-[80%]">
                        <Link href={`/Product/${produto.produto}`}>
                            <Image src={productInfo.find(prod => prod.product_id == BigInt(produto.produto))?.imagem} alt="" width={200} height={200} className="rounded-[10%]"></Image>
                        </Link>
                        <Link href={`/Product/${produto.produto}`}>
                            <p className="mt-[1%] ml-[3g%] text-2xl w-full font-[Montserrat]">{productInfo.find(prod => prod.product_id == BigInt(produto.produto))?.nome}</p>
                        </Link>
                        </div>
                        <p className="absolute bottom-[4%] right-[20%] font-[Montserrat] text-3xl">{`R$${String((productInfo.find(prod => prod.product_id == BigInt(produto.produto))?.valor)?.toFixed(2)).replace('.', ',')}`}</p>
                        <Button></Button>
                        <div>
                            <Button></Button>
                            <span></span>
                            <Button></Button>
                        </div>
                    </article>
                    <hr />
                    </Fragment>
                    );
                })}
        </div>
    );
}