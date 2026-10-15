import Link from "next/link";

export default function Success(){

    return (
        <div className="bg-[url('/Imagens/BackgroundStyle.png')] w-screen h-screen">
            <div className="absolute top-[30%] left-[50%] flex flex-col items-center translate-[-50%] bg-white w-[600px] h-[300px] rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
                <div className="h-[80%] flex flex-col items-center justify-evenly mt-[5%]">
                    <p className="font-[Montserrat] text-[var(--darkPink-Pastel)] text-3xl w-fit">Pagamento recusado!</p>
                    <div className="flex gap-10">
                        <Link href="/" className="font-[Montserrat] text-[var(--darkPink-Pastel)] text-xl w-[50%] text-center">Voltar para a página inicial</Link>
                        <Link href="http:localhost:3000/Cart" className="font-[Montserrat] text-[var(--darkPink-Pastel)] text-xl w-[50%]">Voltar para o carrinho</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}