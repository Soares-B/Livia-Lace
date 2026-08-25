import localFont from "next/font/local";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import TaglineHover, { ButtonHoverGrow } from "@/components/HomeAnimation";
import ProductSection from "@/components/topProducts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { div } from "motion/react-client";

const stylizedFont = localFont({
  src: "../Fonts/Unbounded/Unbounded-VariableFont_wght.ttf",
});

const yellowTail = localFont({
  src: "../Fonts/Yellowtail/Yellowtail-Regular.ttf",
});

export default function Home() {
  return (
    <>
      <header
        id="topo"
        className="relative w-full h-[700px] scroll-m-[80px] bg-cover bg-no-repeat bg-[url('/Imagens/LogoBackground.jpeg')] bg-[center_42%]"
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute top-[20%] left-[7%] w-[300px] h-fit flex flex-col items-center">
          <TaglineHover />
          <Link href="/Catalogue">
            <ButtonHoverGrow />
          </Link>
        </div>
      </header>
      <main className="flex-1 mt-[2%] mb-[5%] max-w-dvw">
        <Suspense
          fallback={
            <>
              <Skeleton className="rounded-[15px] ml-[10%] mb-[1%] w-[10%] h-[25px]" />
              <div className="flex flex-row gap-[3%] m-[0%_10%] mb-[5%]">
                <Skeleton className="h-[400px] w-[250px]" />
                <Skeleton className="h-[400px] w-[250px]" />
                <Skeleton className="h-[400px] w-[250px]" />
                <Skeleton className="h-[400px] w-[250px]" />
                <Skeleton className="h-[400px] w-[250px] " />
              </div>

              <Skeleton className="rounded-[15px] ml-[10%] mb-[1%] w-[10%] h-[25px]" />
              <div className="flex flex-row gap-[3%] m-[0%_10%]">
                <Skeleton className="h-[400px] w-[250px]" />
                <Skeleton className="h-[400px] w-[250px]" />
                <Skeleton className="h-[400px] w-[250px]" />
                <Skeleton className="h-[400px] w-[250px]" />
                <Skeleton className="h-[400px] w-[250px]" />
              </div>
            </>
          }
        >
          <ProductSection />
        </Suspense>
      </main>
    </>
  );
}
