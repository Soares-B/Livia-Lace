import { UserPen, MapPinHouse, ChartPie } from 'lucide-react';
import Link from "next/link";

export default function Options( {admin}: {admin: boolean} ){
    return(
        <aside className="row-[1/5] flex flex-col items-center w-full h-[50%] justify-around">
        <Link href="/User/Info" aria-label="Dados da conta" className="flex w-[25%] h-[25%] justify-center">
          <UserPen className="text-[var(--darkPink-Pastel)] w-full h-full hover:text-[var(--darkerPink)]" />
        </Link>
        <Link href="/User/Address" aria-label="Endereço" className="flex w-[25%] h-[25%] justify-center">
          <MapPinHouse className="text-[var(--darkPink-Pastel)] w-full h-full hover:text-[var(--darkerPink)]" />
        </Link>
        <ChartPie className={`text-[var(--darkPink-Pastel)] w-[25%] h-[25%] hover:cursor-pointer hover:text-[var(--darkerPink)] ${admin ? "inline" : "hidden"} `} />
      </aside>
    );
}
