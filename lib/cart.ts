import getClient from "./client";
import prisma from "./prisma";

export default async function getCart(){
    const client = await getClient();

    const cart = await prisma.carrinho.findUnique({
        where: {
            id_client: client!.id
        }
    })

    return cart
}