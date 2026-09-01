import getAddress from "@/lib/address";
import CPFform from "@/components/UserCPF"
import AddressField from "@/components/userAdress"
import getProduct from "@/lib/product";
import ProductData from "./ProductData";

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
    const produto = await getProduct(Number(product));

    return(
        <ProductData imagem={produto!.image_overlay} nome={produto!.nome} valor={produto!.valor} quantidade={produto!.quantidade}/>
    );

}