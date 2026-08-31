"use client";

import localFont from "next/font/local";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Submit from "@/components/Animation/LoginAnimation";
import { useState } from "react";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

export default function CPFform({ cpf }: { cpf: BigInt | null }) {
  const [CPF, setCPF] = useState(cpf?.toString() ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const response = await fetch("/api/registerCPF", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        CPF,
      }),
    });
  }

  return (
    <div className="relative w-[40%] h-[50%] row-3">
      <form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel className="absolute top-[-37%] left-[1%] font-[Montserrat] text-xl">
            CPF
          </FieldLabel>
          <Input
            className="h-14 text-xl"
            value={CPF}
            maxLength={11}
            autoComplete="off"
            inputMode="numeric"
            onChange={(e) => {
              const valor = e.target.value.replace(/\D/g, "");
              setCPF(valor);
            }}
          />
          <Submit />
        </Field>
      </form>
    </div>
  );
}
