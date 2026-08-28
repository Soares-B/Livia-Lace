import { Input } from "@/components/ui/input";
import { easeIn, easeInOut, motion } from "motion/react";

export default function Submit(){
    return(
        <motion.div
    whileTap={{scale: 0.95}}
    className="w-[100%] flex justify-center">
        <Input type="submit" className="h-[50px] mt-[6%] mb-[1%] hover:cursor-pointer w-full active:bg-[var(--lightPink-Pastel)]"/>
    </motion.div>
    );
}