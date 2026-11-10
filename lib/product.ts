import prisma from "@/lib/prisma"

export default async function getProduct(prod_id: string
){
    if (!/^\d+$/.test(prod_id)) {
        return null;
    }

    const produto = await prisma.produtos.findUnique({
        where: {
            product_id: BigInt(prod_id)
        }
    })

    if (!produto){
        return null;
    }

    return produto;
}