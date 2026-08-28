import localFont from "next/font/local";
import Email from "@/components/UserEmail";
import { CPF } from "@/lib/proxy";

const Montserrat = localFont({
  src: "../../../Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

export default function Info() {
  return (
    <>
      <Email />
      <CPF />
    </>
  );
}
