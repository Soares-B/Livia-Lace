import getClient from "@/lib/client";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { estado, city, road, ref, telefone, cep } = data;

    const client = await getClient();

    const cepNumber = Number(cep.replace('-', ''))

    const address = await prisma.enderecos.update({
      where: {
        id_client: client!.id,
      },
      data: {
        estado: estado,
        cidade: city,
        rua: road,
        referencia: ref,
        numero: telefone,
        cep: cepNumber,
      },
    });

    return NextResponse.json({
      message: "Cadastro de endereço realizado com sucesso!",
    },
{status: 201});
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      {
        message: "Erro interno do servidor.",
      },
      { status: 500 })}
}
