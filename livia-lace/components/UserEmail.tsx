import localFont from "next/font/local";
import getClient from "@/lib/client";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

export default async function Email() {
  const client = await getClient();

  return (
    <div className="relative col-2 row-2 items-center w-[40%] h-[50%] bg-white border-3 border-solid border-[var(--darkPink-Pastel)] rounded-[15px]">
      <h2 className="absolute top-[-65%] left-[1%] font-[Montserrat] text-xl">
        Email
      </h2>
      <p className="ml-[2%] mt-[2%] font-[Montserrat] text-2xl">
        {client!.email}
      </p>
    </div>
  );
}
