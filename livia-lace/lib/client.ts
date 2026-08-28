import { cookies } from "next/headers";
import prisma from "@/lib/prisma"

export default async function getClient(){
    const cookieStore = await cookies();

    const sessionId = cookieStore.get("session")?.value;

    const clientID = await prisma.sessoes.findFirst({
        where: {
            id_sessao: sessionId
        }
    })

    const client = await prisma.clientes.findUnique({
        where: {
            id: clientID!.id_client
        }
    })

    return client
}