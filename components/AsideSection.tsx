'use client'

import { UserPen, MapPinHouse, ChartPie, LogOut } from 'lucide-react';
import { useRouter } from "next/navigation";

export default function Options( {admin}: {admin: boolean} ){
    const router = useRouter();
    
      function handleClick(button: string): void{
        if (button === "info"){
          router.push("/User/Info");
        } else if (button === "address"){
          router.push("/User/Address")
        }
      }

      async function handleLogout() {
        try {
          const response = await fetch("/api/logout", { method: "POST" });
          if (!response.ok) {
            throw new Error("Não foi possível encerrar a sessão.");
          }
          router.replace("/Login");
          router.refresh();
        } catch (error) {
          console.error("Erro ao sair da conta:", error);
        }
      }

    return(
        <aside className="row-[1/5] flex flex-col items-center w-full h-[50%] justify-around">
        <UserPen className="text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)]" onClick={() => handleClick("info")}/>
        <MapPinHouse className="text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)]" onClick={() => handleClick("address")}/>
        <ChartPie className={`text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)] ${admin ? "inline" : "hidden"} `} />
        <button type="button" onClick={handleLogout} aria-label="Sair da conta" title="Sair da conta" className="w-[25%] h-[25%] border-0 bg-transparent p-0">
          <LogOut aria-hidden="true" className="text-[var(--darkPink-Pastel)] w-full h-full hover:cursor-pointer hover:text-[var(--darkerPink)]" />
        </button>
      </aside>
    );
}
