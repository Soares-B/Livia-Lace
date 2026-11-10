import getAddress from "@/lib/address";
import CPFform from "@/components/UserCPF"
import AddressField from "@/components/UserAdress"
import getProduct from "@/lib/product";
import ProductData from "./ProductData";
import { notFound } from "next/navigation";

export async function CPF(){
    const address = await getAddress();

    return (
        <CPFform cpf={address!.cpf}/>
    );
}

export async function AddressProxy(){
    const address = await getAddress();

    return (
        <AddressField
  estado={address!.estado}
  cidade={address!.cidade}
  rua={address!.rua}
  referencia={address!.referencia}
  numero={address!.numero}
  cep={address!.cep}
/>
    );

}

export default async function ProductProxy({product}: {product: string}){
    const produto = await getProduct(product);

    if (!produto || !produto.nome || (!produto.image_overlay && !produto.imagem) || produto.valor === null) {
        notFound();
    }

    return(
        <ProductData
            id={produto.product_id}
            imagem={produto.image_overlay ?? produto.imagem!}
            nome={produto.nome}
            valor={Number(produto.valor)}
        />
    );

}
