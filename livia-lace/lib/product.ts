import prisma from "@/lib/prisma"

export default async function getProduct(prod_id: number
){
    const produto = await prisma.produtos.findUnique({
        where: {
            product_id: prod_id
        }
    })

    if (!produto){
        return null;
    }

    return produto;
}