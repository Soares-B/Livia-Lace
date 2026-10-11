import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import getClient from "@/lib/client";

export async function POST(request: Request){

    const data = await request.json();
    const { CPF } = await data
    const client = await getClient();

    const CPFmodify = await prisma.enderecos.update({
        where: {
            id_client: client!.id
        },
        data: {
            cpf: CPF
        }
    })

    return 
}