"use client"
import { easeIn, easeInOut, motion } from "motion/react";
import localFont from "next/font/local";

const stylizedFont = localFont({
  src: "../../app/Fonts/Unbounded/Unbounded-VariableFont_wght.ttf",
});

export default function TaglineHeader(){
    return(
        <p className="w-[300px] absolute top-[15%] left-[5%] font-[stylizedFont] font-bold text-4xl text-white">Laços feitos com <motion.span
        className="inline-block text-rose-200"
        style={{
          cursor: 'url("/Imagens/Cursor.png"), auto',
        }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.1, color: "var(--darkPink-Pastel)" }}
      >
        Amor
      </motion.span>{". "}Delicadeza em cada detalhe.</p>
    );
}