import ProductProxy from "@/components/proxy";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Product({ params }: Props){
    const { id } = await params;

    return(
        <ProductProxy product={id}/>
    );
}