"use client";

import localFont from "next/font/local";
import { easeIn, easeInOut, motion } from "motion/react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

const stylizedFont = localFont({
  src: "../app/Fonts/Unbounded/Unbounded-VariableFont_wght.ttf",
});

export default function TaglineHover() {
  return (
    <p className="w-[300px] font-[stylizedFont] text-[38px] font-bold hover:cursor-default text-white selection:bg-rose-400 mb-[10%]">
      Laços feitos com muito{" "}
      <motion.span
        className="inline-block text-rose-200"
        style={{
          cursor: 'url("/Imagens/Cursor.png"), auto',
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1, color: "var(--darkPink-Pastel)" }}
      >
        Amor
      </motion.span>{" "}
      em cada Detalhe
    </p>
  );
}

export function ButtonHoverGrow() {
  
  return (
    <motion.div
      whileHover={{
        scale: 1.1,
        transition: { duration: 0.3, ease: easeInOut },
      }}
    >
      <Button variant="main" className="bg-white focus-visible:outline-none focus-visible:ring-0 focus-visible:shadow-none">
        Catálogo
      </Button>
    </motion.div>
  );
}

type ImageHoverOpacityProps = {
  produto: {
    nome: string | null;
    image_overlay: string | null;
  };
};

export function ImageHoverOpacity({ produto }: ImageHoverOpacityProps) {
  const MotionImage = motion.create(Image);

  if (!produto.image_overlay) return null;

  return (
    <MotionImage
      whileHover={{ opacity: 1 }}
      src={produto.image_overlay}
      width={500}
      height={500}
      className="w-full h-auto aspect-square object-cover rounded-t-[10px] absolute top-0 block z-1 opacity-0"
      alt={produto.nome ?? "Produto"}
    />
  );
}

export function BuyCardButtonColorHover() {
  return (
    <motion.div whileHover={{ color: "var(--darkPink-Pastel)" }}>
      <Button
        variant="main"
        className="absolute bottom-0 left-0 w-full h-[15%] font-[MontserratBold] rounded-b-[10px]"
      >
        Adicionar ao carrinho
      </Button>
    </motion.div>
  );
}

export function FooterItemsHover({
  page,
  content,
}: {
  page: string;
  content: string;
}) {
  return (
    <>
      {content === "Instagram" && (
        <motion.div
        whileHover={{scale: 1.2}}
        className="col-[4] row-[2] font-[MontserratBold] text-xl w-fit h-fit mb-[1%] ml-[10%]">
          <Link
            href={page}
            target="_blank"
            rel="nofollow"
          >
            {content}
          </Link>
        </motion.div>
      )}
      {content === "Catálogo" && (
        <motion.div
        whileHover={{scale: 1.2}}
        className="col-[2] row-[3] font-[MontserratBold] text-xl w-fit h-fit mb-[1%]">
          <Link
            href={page}
          >
            {content}
          </Link>
        </motion.div>
      )}
      {content === "Início" && (
        <motion.div
        whileHover={{scale: 1.2}}
        className="col-[2] row-[2] font-[MontserratBold] text-xl w-fit h-fit mb-[1%]">
          <Link
            href={page}
            onClick={(e) => {
              e.preventDefault();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });

              window.history.replaceState(
                null,
                "",
                window.location.pathname + window.location.search
              );
            }}
          >
            {content}
          </Link>
        </motion.div>
      )}
    </>
  );
}
