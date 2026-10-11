'use client'

import { UserPen, MapPinHouse, ChartPie } from 'lucide-react';
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

    return(
        <aside className="row-[1/5] flex flex-col items-center w-full h-[50%] justify-around">
        <UserPen className="text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)]" onClick={() => handleClick("info")}/>
        <MapPinHouse className="text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)]" onClick={() => handleClick("address")}/>
        <ChartPie className={`text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)] ${admin ? "inline" : "hidden"} `} />
      </aside>
    );
}