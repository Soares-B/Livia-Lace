"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleLogout() {
    if (loading) return;

    setLoading(true);
    setError(false);

    try {
      // A rota apaga a sessão no banco e o cookie. Mesmo que a limpeza no banco falhe (resposta 500),
      // o cookie já foi removido, então a pessoa está deslogada neste navegador e pode seguir para o login.
      await fetch("/api/logout", { method: "POST" });
      router.replace("/Login");
      router.refresh();
    } catch {
      // Sem resposta do servidor (rede): a sessão continua ativa, então avisa e deixa tentar de novo.
      setError(true);
      setLoading(false);
    }
  }

  return (
    <>
      <Input
        type="button"
        value={loading ? "Saindo..." : "Sair da conta"}
        disabled={loading}
        onClick={handleLogout}
        className="h-[50px] mt-[6%] mb-[1%] hover:cursor-pointer w-full"
      />
      {error && (
        <p role="alert" className="font-montserrat text-sm text-red-500">
          Não foi possível sair. Verifique sua internet e tente novamente.
        </p>
      )}
    </>
  );
}
