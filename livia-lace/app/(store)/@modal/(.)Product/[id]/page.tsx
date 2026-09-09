import getProduct from "@/lib/product";
import Modal from "@/components/Animation/ModalAnimation"

export default async function ProductModal({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProduct(Number(id))

  console.log(product)

    if (!product){
        return null;
    }

  return (
    <Modal product={product}/>
  );
}