import Image from "next/image";
import Link from "next/link";

export default function Header() {
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
        ></Image>
      </Link>
    </div>
  );
}
