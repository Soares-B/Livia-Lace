import { cache } from "react";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

// cache() evita repetir a mesma consulta (Header, layout e página) dentro de uma requisição.
export const getSession = cache(async () => {
  const cookieStore = await cookies();

  const sessionId = cookieStore.get("session")?.value;

  if (!sessionId) {
    return null;
  }

  const sessao = await prisma.sessoes.findUnique({
    where: {
      id_sessao: sessionId,
    },
  });

  if (!sessao) {
    return null;
  }

  if (sessao.validade < new Date()) {
    return null;
  }

  return sessao;
});
