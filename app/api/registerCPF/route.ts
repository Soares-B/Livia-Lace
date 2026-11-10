import getClient from "@/lib/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const client = await getClient();
    if (!client) {
      return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
    }

    const body: unknown = await request.json();
    if (!body || typeof body !== "object" || typeof (body as Record<string, unknown>).CPF !== "string") {
      return NextResponse.json({ message: "CPF inválido." }, { status: 400 });
    }

    const cpfInput = ((body as { CPF: string }).CPF).replace(/\D/g, "");
    if (cpfInput.length !== 0 && cpfInput.length !== 11) {
      return NextResponse.json({ message: "CPF deve conter 11 dígitos." }, { status: 400 });
    }

    await prisma.enderecos.update({
      where: { id_client: client.id },
      data: { cpf: cpfInput || null },
    });

    return NextResponse.json({ message: "CPF atualizado com sucesso!" }, { status: 200 });
  } catch (error) {
    console.error("Erro ao atualizar CPF:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
