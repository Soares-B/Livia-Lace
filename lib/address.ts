import getClient from "@/lib/client"
import prisma from "@/lib/prisma"

export default async function getAddress(){
    const client = await getClient();

    const address = await prisma.enderecos.findUnique({
        where: {
            id_client: client!.id
        }
    })

    return address
}