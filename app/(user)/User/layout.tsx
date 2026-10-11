import Image from "next/image";
import Header from "@/components/main/Header";
import localFont from "next/font/local";
import getClient from "@/lib/client";
import Options from "@/components/AsideSection";
import { redirect } from "next/navigation";

const Montserrat = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const client = await getClient();

  if (!client){
    redirect('/Login')
  }

  console.log(client)

  return (
    <>
      <Header />
      <div className="bg-[url('/Imagens/BackgroundStyle.png')] h-full w-full absolute z-[-1]"></div>
      <div className="bg-white w-[95vw] h-[85vh] grid grid-cols-[1fr_6fr_1fr] grid-rows-[1.5fr_.5fr_.5fr_1fr] items-center justify-items-center m-[20px_auto] rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
        <Options admin={client!.is_admin}/>
        <div className="col-2 row-1 w-[200px] h-auto">
          <Image
            src="/Imagens/pfp/Default_2.png"
            width={200}
            height={200}
            alt="Profile Picture"
            className="select-none rounded-[50%]"
          />
          <p className="mt-[5%] text-center w-full font-[Montserrat] text-2xl">
            {client!.nome}
          </p>
        </div>
        {children}
      </div>
    </>
  );
}
