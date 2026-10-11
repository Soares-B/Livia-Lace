import getCart from "@/lib/cart";
import getProduct from "@/lib/product";
import getAddress from "@/lib/address";
import CartProducts from "@/components/CartProducts";

type produtoArray = {
  produto: number,
  quantidade: number
  nome?: string,
  valor?: number,
  imagem?: string,
}[]

export default async function Cart() {
  const cart = await getCart();

  const produtos = cart!.produtos as produtoArray;
  const products: produtoArray = [];

  if (!produtos){
    return
  } else {
      for (const produto of produtos){
        const produtoInfo = await getProduct(produto.produto)

        if (!produtoInfo){
          continue
        }

        const { tipo, quantidade, tamanho, image_overlay, ...resto} = produtoInfo
        produto.nome = resto.nome!
        produto.valor = resto.valor!
        produto.imagem = resto.imagem!
        products.push(produto)
      }
  }

  const address = await getAddress();

  if (!address){
    return;
  }

  const { referencia, ...resto } = address;

  const addressMissing = Object.values(resto).some(
  (valor) => valor === "" || valor === null,
);

  const fullCartInfo: [produtoArray, boolean] = [
  products,
  addressMissing,
];

  return (
    <div className="bg-[url('/Imagens/BackgroundStyle.png')]">
        <div className="w-[95vw] min-h-[95vh] m-[40_auto] bg-[var(--lightPink-Pastel)] flex flex-col rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
            <CartProducts cart={fullCartInfo}/>
        </div>
    </div>
  );
}
