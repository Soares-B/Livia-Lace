"use client"

import localFont from "next/font/local";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Submit from "@/components/LoginAnimation";
import { useState } from "react";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

export default function CPFform( {cpf}: { cpf: BigInt | null }) {
    const [CPF, setCPF] = useState(cpf?.toString() ?? "");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        const response = await fetch("/api/registerCPF", {
            method: "POST",
        })
    }

  return (
    <div className="relative w-[40%] h-[50%] row-3">
      <form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel className="absolute top-[-65%] left-[1%] font-[Montserrat] text-xl">
            CPF
          </FieldLabel>
          <Input className="h-14"
          value={CPF}
          autoComplete="off"
          onChange={(e) => setCPF(e.target.value)}/>
          <Submit />
        </Field>
      </form>
    </div>
  );
}
