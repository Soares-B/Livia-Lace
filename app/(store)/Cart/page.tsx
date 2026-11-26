import getClient from "@/lib/client";
import getCart from "@/lib/cart";
import getProduct from "@/lib/product";
import getAddress from "@/lib/address";
import CartProducts from "@/components/CartProducts";
import { redirect } from "next/navigation";

type produtoArray = {
  produto: number,
  quantidade: number
  nome?: string,
  valor?: number,
  imagem?: string,
}[]

export default async function Cart() {
  const client = await getClient();
  if (!client) {
    redirect("/Login");
  }

  // Um cliente logado sem linha de carrinho é tratado como carrinho vazio, não como deslogado.
  const cart = await getCart();
  const produtos = Array.isArray(cart?.produtos) ? (cart.produtos as produtoArray) : [];
  const products: produtoArray = [];

  for (const item of produtos) {
    const produtoInfo = await getProduct(String(item?.produto));
    if (!produtoInfo) {
      continue;
    }

    products.push({
      produto: item.produto,
      quantidade: item.quantidade,
      nome: produtoInfo.nome ?? undefined,
      valor: Number(produtoInfo.valor),
      imagem: produtoInfo.imagem ?? undefined,
    });
  }

  const address = await getAddress();
  const addressMissing = !address || [
    address.estado,
    address.cidade,
    address.rua,
    address.numero,
    address.telefone,
    address.cep,
    address.cpf,
  ].some((valor) => typeof valor !== "string" || !valor.trim());

  const fullCartInfo: [produtoArray, boolean] = [products, addressMissing];

  return (
    <div className="bg-[url('/Imagens/BackgroundStyle.png')]">
      <div className="w-[95vw] min-h-[95vh] m-[40_auto] bg-[var(--lightPink-Pastel)] flex flex-col rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
        <CartProducts cart={fullCartInfo} />
      </div>
    </div>
  );
}
