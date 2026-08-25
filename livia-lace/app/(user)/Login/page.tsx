"use client"

import localFont from "next/font/local";
import Image from "next/image"
import { Input } from "@/components/ui/input";
import login from "./login";
import Submit from "@/components/LoginAnimation";

const Montserrat = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

export default function Login(){

    return(
        <div className="w-screen h-screen bg-[url('/Imagens/BackgroundStyle.png')]">
            <p className="opacity-0 font-[MontserratBold] text-center mt-[4%] text-2xl transiction-[.25s] has-[show]:opacity-1">Login realizado com sucesso!</p>
            <div className="absolute top-[50%] left-[50%] flex flex-col items-center translate-[-50%] bg-white w-[600px] h-[700px] rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
                <Image src="/Imagens/LogoBackground.jpeg"
                width={1536}
                height={1024}
                alt="logo"
                className="w-full h-[35%] aspect-square object-cover rounded-t-[25px]"
                />
                <form action={login} className="flex flex-col items-center">
                    <h2 className="font-[MontserratBold] text-2xl m-[0_auto] mt-[3%] mb-[3%]">Entrar</h2>
                    <p className="font-[Montserrat] text-lg mb-[4%]">Email</p>
                    <Input className="font-[Montserrat] w-[150%] h-[40px] mb-[4%] focus:outline-none"/>
                    <p className="font-[Montserrat] text-lg mb-[4%]">Senha</p>
                    <Input className="font-[Montserrat] w-[150%] h-[40px] mb-[4%] focus:outline-none"/>
                    <Submit />
                    <p>Ainda não possui uma conta?</p>
                </form>
            </div>
        </div>
    );
}