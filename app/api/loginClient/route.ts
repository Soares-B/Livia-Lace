import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const dados = await request.json();
    const { email, senha } = dados;

    if (!email || !senha) {
      return NextResponse.json(
        {
          message: "Todos os campos são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const cliente_exist = await prisma.clientes.findUnique({
      where: {
        email: email,
      },
    });

    if (!cliente_exist) {
      return NextResponse.json(
        { message: "Usuário ou senha inválidos." },
        { status: 401 },
      );
    }

    const senhaValida = await bcrypt.compare(
      senha,
      cliente_exist.senha!,
    );

    if (!senhaValida) {
      return NextResponse.json(
        { message: "Usuário ou senha inválidos." },
        { status: 401 },
      );
    }

    const cookieStore = await cookies();

    await prisma.sessoes.deleteMany({
      where: {
        validade: {
          lt: new Date(),
        },
      },
    });

    const session = await prisma.sessoes.create({
      data: {
        id_client: cliente_exist.id,
        validade: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    });

    cookieStore.set("session", String(session.id_sessao), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json(
      { message: "Login realizado com sucesso!" },
      { status: 200 },
    );
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { message: "Erro interno do servidor." },
      { status: 500 },
    );
  }
}