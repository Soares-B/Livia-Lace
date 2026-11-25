"use client";

import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import Submit from "@/components/Animation/LoginAnimation";
import { useState } from "react";
import { isValidCPF } from "@/lib/validation.mjs";

export default function CPFform({ cpf }: { cpf: string | null }) {
  const [CPF, setCPF] = useState(cpf?.toString() ?? "");
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (CPF.length > 0 && (CPF.length !== 11 || !isValidCPF(CPF))) {
      setFeedback({ text: "CPF inválido.", ok: false });
      return;
    }

    setSaving(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/registerCPF", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          CPF,
        }),
      });
      const data = await response.json().catch(() => null);

      setFeedback({
        text: data?.message ?? (response.ok ? "CPF atualizado com sucesso!" : "Não foi possível salvar o CPF."),
        ok: response.ok,
      });
    } catch {
      setFeedback({ text: "Erro de conexão. Tente novamente.", ok: false });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative w-[40%] h-[50%] row-3">
      <form onSubmit={handleSubmit}>
        <Field>
          <FieldLabel className="absolute top-[-37%] left-[1%] font-montserrat text-xl">
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
          <Submit disabled={saving} />
          {feedback && (
            <p
              role="status"
              className={`font-montserrat text-sm ${feedback.ok ? "text-green-600" : "text-red-500"}`}
            >
              {feedback.text}
            </p>
          )}
        </Field>
      </form>
    </div>
  );
}
