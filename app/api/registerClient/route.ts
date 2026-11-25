import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { isValidEmail, isValidPassword } from "@/lib/validation.mjs";

export async function POST(request: Request) {
  try {
    const dados: unknown = await request.json().catch(() => null);
    const { email, username, password } = (dados && typeof dados === "object" ? dados : {}) as {
      email?: unknown;
      username?: unknown;
      password?: unknown;
    };

    if (
      typeof email !== "string" || !email.trim() ||
      typeof username !== "string" || !username.trim() ||
      typeof password !== "string" || !password
    ) {
      return NextResponse.json(
        {
          message: "Todos os campos são obrigatórios.",
        },
        { status: 400 }
      );
    }

    const emailNormalizado = email.trim().toLowerCase();
    const nome = username.trim();

    if (!isValidEmail(emailNormalizado)) {
      return NextResponse.json({ message: "Digite um email válido." }, { status: 400 });
    }

    if (nome.length > 100) {
      return NextResponse.json(
        { message: "O nome de usuário deve ter no máximo 100 caracteres." },
        { status: 400 }
      );
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { message: "A senha deve ter entre 8 e 72 caracteres." },
        { status: 400 }
      );
    }

    const cliente_exist = await prisma.clientes.findFirst({
      where: {
        email: { equals: emailNormalizado, mode: "insensitive" },
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

    await prisma.$transaction(async (tx) => {
      const cliente = await tx.clientes.create({
        data: {
          nome,
          email: emailNormalizado,
          senha: hash,
          is_admin: false,
        },
      });

      await tx.carrinho.create({
        data: {
          id_client: cliente.id,
        },
      });

      await tx.enderecos.create({
        data: {
          id_client: cliente.id
        }
      });
    });

    return NextResponse.json(
      {
        message: "Cadastro concluído com sucesso!"
      },
      { status: 201 }
    );
  } catch (err) {
    // Dois cadastros simultâneos com o mesmo email: o banco rejeita o segundo (P2002).
    if ((err as { code?: string } | null)?.code === "P2002") {
      return NextResponse.json(
        { message: "Este email já está cadastrado." },
        { status: 409 }
      );
    }
    console.error("ERRO AO CADASTRAR:", err);
    return NextResponse.json(
      { message: "Erro ao cadastrar cliente." },
      { status: 500 }
    );
  }
}
