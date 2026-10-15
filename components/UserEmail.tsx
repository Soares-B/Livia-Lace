import getClient from "@/lib/client";

export default async function Email() {
  const client = await getClient();

  return (
    <div className="relative col-2 row-2 items-center w-[40%] h-[50%] bg-white border-3 border-solid border-[var(--darkPink-Pastel)] rounded-[15px]">
      <h2 className="absolute top-[-65%] left-[1%] font-[Montserrat] text-xl">
        Email
      </h2>
      <p className="ml-[2%] mt-[2%] font-[Montserrat] text-xl">
        {client!.email}
      </p>
    </div>
  );
}
