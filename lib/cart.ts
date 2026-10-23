import getClient from "./client";
import prisma from "./prisma";
import { NextResponse } from "next/server";

export default async function getCart(){
    const client = await getClient();

    if (!client){
    return NextResponse.json(
        { message: "Não autenticado" },
        { status: 401 }
  );
}

    const cart = await prisma.carrinho.findUnique({
        where: {
            id_client: client!.id
        }
    })

    return cart
}