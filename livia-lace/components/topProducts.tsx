import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";
import localFont from "next/font/local";
import { ImageHoverOpacity } from "@/components/HomeAnimation";
import { Button } from "@/components/ui/button";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

export default async function ProductSection() {
  const productsList = {
    ["Bico de pato"]: [90, 116, 117, 39, 26],
    ["Xuxinha"]: [73, 92, 83, 95, 84],
    ["Tiara"]: [136, 125, 7, 21, 124],
    ["Faixa de bebê"]: [71, 22, 128, 68, 65],
    ["Presilha de cabelo"]: [110, 109, 0, 0, 0],
    ["Pulseiras"]: [0, 0, 0, 0, 0],
  };

  const productsInfoList = [];

  for (const [categoria, produtos] of Object.entries(productsList)) {
    const products = await prisma.produtos.findMany({
      where: {
        product_id: {
          in: produtos,
        },
      },
    });

    const productsMap = new Map(
      products.map((product) => [Number(product.product_id), product]),
    );

    const productsOrdenados = produtos
      .map((id) => productsMap.get(id))
      .filter((product) => product !== undefined);

    productsInfoList.push({
      categoria,
      produtos: productsOrdenados,
    });
  }

  return (
    <>
      {productsInfoList.map(({ categoria, produtos }) => (
        <section key={categoria} className="mb-[5%]">
          <h2 className="font-[MontserratBold] text-black text-2xl text-bold ml-[10%] mb-[1%] w-[1000px]">
            {categoria}
          </h2>

          <div className="products flex flex-row gap-[3%] m-[0%_10%]">
            {produtos.map((produto) => (
              <article
                key={produto.product_id.toString()}
                className="relative bg-white flex-[1_1_250px] max-w-[250px] min-w-[120px] h-[400px] rounded-[10px] overflow-hidden"
              >
                <Link href="/">
                  <Image
                    src={produto.imagem!}
                    width={500}
                    height={500}
                    className="w-full aspect-square object-cover rounded-t-[10px]"
                    alt={produto.nome!}
                  />
                </Link>
                <Link href="/">
                  <ImageHoverOpacity produto={produto} />
                </Link>
                <div className="absolute bottom-[15%] left-[3%] ">
                  <p className="font-[Montserrat] font-bold text-sm h-[40px] mb-[3%]">
                    {produto.nome}
                  </p>
                  <p className="font-[MontserratBold] text-2xl mb-[2%]">
                    R${String(produto.valor?.toFixed(2)).replace(".", ",")}
                  </p>
                </div>
                <Button variant="main" className="absolute bottom-0 left-0 w-full h-[15%] font-[MontserratBold] rounded-b-[10px]">
                  Adicionar ao carrinho
                </Button>
              </article>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
