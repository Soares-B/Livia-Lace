import Link from "next/link";
import localFont from "next/font/local";
import { FooterItemsHover } from "@/components/Animation/HomeAnimation"

const Montserrat = localFont({
  src: "../../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../../app/Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

export default function Footer() {
  return (
    <div className="grid grid-rows-[1fr] grid-cols-[.15fr_.5fr_1fr_1fr] bg-[var(--darkPink-Pastel)] h-[50%]">
      <p className="ml-[2%] font-[MontserratBold] text-2xl p-[10px_0px] col-[2]">
        Navegue:
      </p>
      <FooterItemsHover page="/" content="Início"/>
      <FooterItemsHover page="/Catalogue" content="Catálogo"/>
      <FooterItemsHover page="/User/Info" content="Usuário"/>
      <FooterItemsHover page="/Cart" content="Carrinho"/>
      <p className="ml-[2%] font-[MontserratBold] text-2xl p-[10px_0px] col-[3]">
        Contato:
      </p>
      <p className="ml-[2%] font-[MontserratBold] h-fit text-xl col-[3] row-[2]">
        Livia_lace@gmail.com
      </p>
      <p className="ml-[2%] font-[MontserratBold] text-2xl p-[10px_0px] col-[4]">
        Redes socias:
      </p>
      <FooterItemsHover page="https://www.instagram.com/livia_lacebr/" content="Instagram"/>
    </div>
  );
}
