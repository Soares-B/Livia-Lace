import Link from "next/link";
import { UserPen, MapPinHouse, ChartPie } from 'lucide-react';
import Image from "next/image";
import Header from "@/components/Header";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import getClient from "@/lib/client";


const Montserrat = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

export default async function Layout({ children }: { children: React.ReactNode }) {
  const client = await getClient();

  return (
    <>
    <Header />
    <div className="bg-[url('/Imagens/BackgroundStyle.png')] h-full w-full absolute z-[-1]"></div>
    <div className="bg-white w-[95vw] h-[85vh] grid grid-cols-[1fr_6fr_1fr] grid-rows-[1.5fr_.5fr_.5fr_1fr] items-center justify-items-center m-[20px_auto] rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
      <aside className="row-[1/5] flex flex-col items-center w-full h-[50%] justify-around">
        <UserPen className="text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)]" />
        <MapPinHouse className="text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)]" />
        <ChartPie className="text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)]" />
      </aside>
      <div className="col-2 row-1 w-[200px] h-auto">
        <Image
          src="/Imagens/pfp/Default_2.png"
          width={200}
          height={200}
          alt="Profile Picture"
          className="select-none rounded-[50%]"
        />
        <p className="mt-[5%] text-center w-full font-[Montserrat] text-2xl">{client!.nome}</p>
      </div>
      {children}
    </div>
    </>
  );
}
