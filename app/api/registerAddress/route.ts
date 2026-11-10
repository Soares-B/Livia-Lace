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
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Dados de endereço inválidos." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const { estado, city, road, ref, telefone, cep } = data;
    if (
      typeof estado !== "string" || !estado.trim() || estado.length > 100 ||
      typeof city !== "string" || city.trim().length < 3 || city.length > 150 ||
      typeof road !== "string" || road.trim().length < 3 || road.length > 200 ||
      typeof ref !== "string" || ref.length > 255 ||
      typeof telefone !== "string" || !/^\d{10,11}$/.test(telefone.replace(/\D/g, "")) ||
      typeof cep !== "string" || !/^\d{5}-?\d{3}$/.test(cep)
    ) {
      return NextResponse.json({ message: "Confira os dados do endereço." }, { status: 400 });
    }

    await prisma.enderecos.update({
      where: { id_client: client.id },
      data: {
        estado: estado.trim(),
        cidade: city.trim(),
        rua: road.trim(),
        referencia: ref.trim(),
        numero: telefone,
        cep: cep.replace(/\D/g, ""),
      },
    });

    return NextResponse.json(
      { message: "Cadastro de endereço realizado com sucesso!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Erro ao atualizar endereço:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
