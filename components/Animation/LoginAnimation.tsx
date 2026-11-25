"use client";

import { Input } from "@/components/ui/input";
import { motion } from "motion/react";

export default function Submit({ disabled = false }: { disabled?: boolean }){
    return(
        <motion.div
    whileTap={{scale: 0.95}}
    className="w-[100%] flex justify-center">
        <Input type="submit" disabled={disabled} className="h-[50px] mt-[6%] mb-[1%] hover:cursor-pointer w-full active:bg-[var(--lightPink-Pastel)]"/>
    </motion.div>
    );
}
