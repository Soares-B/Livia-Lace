import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { error } from "console";

export async function POST(request: Request) {
  try {
    const dados = await request.json();

    const { email, username, password } = dados;

    if (!email || !username || !password) {
      return NextResponse.json(
        {
          message: "Todos os campos são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const cliente_exist = await prisma.clientes.findUnique({
      where: {
        email: email,
      },
    });

    if (cliente_exist){
      return NextResponse.json(
        {
          message: "Este email já está cadastrado.",
        },
        { status: 409 }
      );
    }
    const hash = await bcrypt.hash(password, 10);

    const client = await prisma.$transaction(async (tx) => {
      const cliente = await tx.clientes.create({
        data: {
          nome: username,
          email: email,
          senha: hash,
          is_admin: false,
        },
      });

      await tx.carrinho.create({
        data: {
          id_client: cliente.id,
        },
      });

      return cliente;
    });

    return NextResponse.json(
      {
        message: "Cadastro concluído com sucesso!"
      },
      { status: 201 }
    );
  } catch (err) {
  console.error("ERRO AO CADASTRAR:", err);

  return NextResponse.json(
    {
      message: "Erro ao cadastrar cliente",
      error: err instanceof Error ? err.message : String(err),
    },
    { status: 500 }
  );
}

}
