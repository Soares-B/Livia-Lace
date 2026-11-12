import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("session")?.value;

  try {
    if (sessionId) {
      await prisma.sessoes.deleteMany({
        where: { id_sessao: sessionId },
      });
    }
    cookieStore.delete("session");
    return NextResponse.json({ message: "Sessão encerrada." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao encerrar sessão:", error);
    cookieStore.delete("session");
    return NextResponse.json({ message: "Não foi possível encerrar a sessão." }, { status: 500 });
  }
}
