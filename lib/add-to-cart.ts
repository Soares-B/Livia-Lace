"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export type AddToCartResult = "ok" | "unauthenticated" | "error";
export type AddToCartStatus = "idle" | "pending" | "added" | "error";

export async function addToCart(id: string, amount: number): Promise<AddToCartResult> {
  try {
    const response = await fetch("/api/addProductCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, amount }),
    });

    if (response.status === 401) return "unauthenticated";
    return response.ok ? "ok" : "error";
  } catch {
    return "error";
  }
}

export const addToCartLabels: Record<AddToCartStatus, string> = {
  idle: "Adicionar ao carrinho",
  pending: "Adicionando...",
  added: "Adicionado!",
  error: "Tente novamente",
};

// Centraliza o comportamento dos botões "Adicionar ao carrinho": evita cliques repetidos
// durante a requisição, manda para o login quando não há sessão e mostra o resultado.
export function useAddToCart() {
  const router = useRouter();
  const [status, setStatus] = useState<AddToCartStatus>("idle");
  const pending = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function add(id: string | number | bigint, amount = 1) {
    if (pending.current) return;
    pending.current = true;
    setStatus("pending");

    const result = await addToCart(String(id), amount);
    pending.current = false;

    if (result === "unauthenticated") {
      setStatus("idle");
      router.push("/Login");
      return;
    }

    setStatus(result === "ok" ? "added" : "error");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 2000);
  }

  return { status, label: addToCartLabels[status], add };
}
