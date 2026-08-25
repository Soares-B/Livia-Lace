import { Input } from "@/components/ui/input";
import { easeIn, easeInOut, motion } from "motion/react";

export default function Submit(){
    return(
        <motion.div
    whileTap={{scale: 0.95}}
    className="w-[150%]">
        <Input type="submit" className="h-[50px] mt-[6%] mb-[2%] hover:cursor-pointer w-full" />
    </motion.div>
    );
}