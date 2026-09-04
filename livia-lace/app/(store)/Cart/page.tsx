import getCart from "@/lib/cart";
import getProduct from "@/lib/product";
import getAddress from "@/lib/address";
import CartProducts from "@/components/CartProducts";

type cart = {
  id_client: bigint;
  produtos: {
    produto: number;
    quantidade: number;
  }[];
  valor_total: number | null;
  id: bigint;
} | null;

type produtos = {
    produto: number,
    quantidade: number
}[]

type productInfo = {
    nome: string,
    imagem: string,
    product_id: bigint,
    valor: number
}[]

type product_info = {
    product_id: bigint,
    tipo: string,
    quantidade: number,
    tamanho: string,
    image_overlay: string,
    nome: string,
    valor: number,
    imagem: string
}

export default async function Cart() {
  const cart: cart = await getCart();

  const produtos: produtos = cart!.produtos;
  const productInfo: productInfo = []

  for (const produto of produtos ?? []) {
    const produto_info: product_info = await getProduct(produto.produto);

    const { tipo, quantidade, tamanho, image_overlay, ...resto } = produto_info
    
    productInfo.push(resto)
  }

  const address = await getAddress();

  return (
    <div className="bg-[url('/Imagens/BackgroundStyle.png')]">
        <div className="w-[95vw] min-h-[95vh] m-[40_auto] bg-[var(--lightPink-Pastel)] flex flex-col rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
            <CartProducts cart={produtos} productInfo={productInfo} userInfo={address}/>
        </div>
    </div>
  );
}
