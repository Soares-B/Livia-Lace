"use client"

import Image from "next/image";
import Link from "next/link";
import { CircleUserRound, ShoppingCart } from "lucide-react";

export default function Header() {
  function user() {
    window.location.href = "/Login";
  }

  return (
    <div
      id="top"
      className="w-full h-[95px] bg-white p-[10px_0px] sticky top-0 z-10"
    >
      <Link href={"/"}>
        <Image
          src="/Imagens/Logo.png"
          width={100}
          height={60}
          alt="Logo"
          className="absolute left-[5%]"
        />
      </Link>
      <div className="absolute top-[25%] right-[2%] w-fit h-fit text-[var(--darkPink-Pastel)] flex gap-[10%]">
        <ShoppingCart className="w-[50px] h-[50px] m-[0_10px] hover:cursor-pointer" />
        <CircleUserRound className="w-[50px] h-[50px] m-[0_10px] hover:cursor-pointer" onClick={() => user()}/>
      </div>
    </div>
  );
}
