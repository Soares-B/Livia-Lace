import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { getSession } from "@/lib/auth";
import IconButtons from "@/components/UserButton";

export default async function Header() {
  let session = await getSession();

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
        <IconButtons logado={!!session}/>
      </div>
    </div>
  );
}
