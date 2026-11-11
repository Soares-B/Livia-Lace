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
  const cart = await getCart();
  if (!cart) {
    redirect("/Login");
  }

  const produtos = (cart.produtos as produtoArray | null) ?? [];
  const products: produtoArray = [];

  for (const produto of produtos) {
    const produtoInfo = await getProduct(String(produto.produto));
    if (!produtoInfo) {
      continue;
    }

    const { tipo, quantidade, tamanho, image_overlay, ...resto } = produtoInfo;
    produto.nome = resto.nome ?? undefined;
    produto.valor = Number(resto.valor);
    produto.imagem = resto.imagem ?? undefined;
    products.push(produto);
  }

  const address = await getAddress();
  const addressMissing = !address || [
    address.estado,
    address.cidade,
    address.rua,
    address.numero,
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
