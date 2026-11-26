import getClient from "@/lib/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isValidHouseNumber, normalizeHouseNumber } from "@/lib/validation.mjs";

export async function POST(request: Request) {
  try {
    const client = await getClient();
    if (!client) {
      return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
    }

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ message: "Dados de endereço inválidos." }, { status: 400 });
    }

    const data = body as Record<string, unknown>;
    const { estado, city, road, ref, numero, telefone, cep } = data;
    if (
      typeof estado !== "string" || !estado.trim() || estado.length > 100 ||
      typeof city !== "string" || city.trim().length < 3 || city.length > 150 ||
      typeof road !== "string" || road.trim().length < 3 || road.length > 200 ||
      typeof ref !== "string" || ref.length > 255 ||
      !isValidHouseNumber(numero) ||
      typeof telefone !== "string" || !/^\d{10,11}$/.test(telefone.replace(/\D/g, "")) ||
      typeof cep !== "string" || !/^\d{5}-?\d{3}$/.test(cep)
    ) {
      return NextResponse.json({ message: "Confira os dados do endereço." }, { status: 400 });
    }

    const dados = {
      estado: estado.trim(),
      cidade: city.trim(),
      rua: road.trim(),
      referencia: ref.trim(),
      numero: normalizeHouseNumber(numero as string),
      telefone,
      cep: cep.replace(/\D/g, ""),
    };

    await prisma.enderecos.upsert({
      where: { id_client: client.id },
      update: dados,
      create: { id_client: client.id, ...dados },
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

// Apaga o endereço salvo do cliente (o CPF é um cadastro separado e não é afetado).
// Pedidos já feitos guardam a própria cópia do endereço, então não mudam.
export async function DELETE() {
  try {
    const client = await getClient();
    if (!client) {
      return NextResponse.json({ message: "Usuário não autenticado." }, { status: 401 });
    }

    const vazio = {
      estado: null,
      cidade: null,
      rua: null,
      referencia: null,
      numero: null,
      telefone: null,
      cep: null,
    };

    await prisma.enderecos.upsert({
      where: { id_client: client.id },
      update: vazio,
      create: { id_client: client.id, ...vazio },
    });

    return NextResponse.json({ message: "Endereço apagado." }, { status: 200 });
  } catch (error) {
    console.error("Erro ao apagar endereço:", error);
    return NextResponse.json({ message: "Erro interno do servidor." }, { status: 500 });
  }
}
