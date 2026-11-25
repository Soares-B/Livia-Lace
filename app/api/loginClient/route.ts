import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";

// Hash descartável usado para gastar o mesmo tempo de CPU quando o email não existe,
// evitando revelar quais emails estão cadastrados pelo tempo de resposta.
const DUMMY_HASH = "$2b$10$pP4qIg5.QjkAMmRDCNXGTuuI28JVvbb8T.Y7TKBrPItYPiMLrxbsu";

export async function POST(request: Request) {
  try {
    const dados: unknown = await request.json().catch(() => null);
    const { email, senha } = (dados && typeof dados === "object" ? dados : {}) as {
      email?: unknown;
      senha?: unknown;
    };

    if (typeof email !== "string" || typeof senha !== "string" || !email.trim() || !senha) {
      return NextResponse.json(
        {
          message: "Todos os campos são obrigatórios.",
        },
        { status: 400 },
      );
    }

    const cliente_exist = await prisma.clientes.findFirst({
      where: {
        email: { equals: email.trim(), mode: "insensitive" },
      },
    });

    const senhaValida = await bcrypt.compare(
      senha,
      cliente_exist?.senha ?? DUMMY_HASH,
    );

    if (!cliente_exist || !senhaValida) {
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
