"use client";

import localFont from "next/font/local";
import Image from "next/image";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Submit from "@/components/Animation/LoginAnimation";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Montserrat = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [success, setSuccess] = useState(false);
  const [logged, setLogged] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = {
      email: "",
      password: "",
    };

    setSuccess(false);

    if (!email) {
      newErrors.email = "Digite seu email.";
    } else if (!email.includes("@")) {
      newErrors.email = "Digite um email válido.";
    }

    if (!senha) {
      newErrors.password = "Digite sua senha.";
    }

    setErrors(newErrors);

    if (!newErrors.email && !newErrors.password) {
      setSuccess(true);
    }

    if (success) {
      login(email, senha);
    }

    async function login(email: string, senha: string) {
      const response = await fetch("/api/loginClient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          senha,
        }),
      });
      const data = await response.json();
      if (response.status == 200) {
        setMessage("Login realizado com sucesso!");
        setLogged(true);

        setTimeout(() => {
          router.push('/')
        }, 2000);
      } else {
        setMessage(data.message);
        setLogged(true);
        setTimeout(() => {
          setLogged(false);
        }, 2000);
      }
    }
  }

  return (
    <div className="w-screen h-screen bg-[url('/Imagens/BackgroundStyle.png')]">
      <p
        className={`font-[MontserratBold] text-center mt-[4%] text-2xl transition-[.25s] ${logged ? "opacity-100" : "opacity-0"}`}
      >
        {message}
      </p>
      <div className="absolute top-[50%] left-[50%] flex flex-col items-center translate-[-50%] bg-white w-[600px] h-[700px] rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
        <Link href="/" className="w-full h-[35%]">
          <Image
            src="/Imagens/LogoBackground.jpeg"
            width={1536}
            height={1024}
            alt="logo"
            className="w-full h-full aspect-square object-cover rounded-t-[25px]"
          />
        </Link>
        <form
          onSubmit={handleSubmit}
          className="flex w-[60%] flex-col items-center"
        >
          <h2 className="font-[MontserratBold] text-2xl m-[0_auto] mt-[3%] mb-[3%]">
            Entrar
          </h2>
          <FieldGroup className="gap-[3%] mb-[5%]">
            <Field>
              <FieldLabel className="flex w-full justify-center font-[Montserrat] text-lg">
                Email
              </FieldLabel>
              <Input
                type="text"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                className="font-[Montserrat] h-[40px] focus:outline-none"
                placeholder=""
              />
            </Field>
            <Field>
              <FieldLabel className="flex w-full justify-center font-[Montserrat] text-lg">
                Senha
              </FieldLabel>
              <Input
                type="password"
                value={senha}
                autoComplete="off"
                onChange={(e) => setSenha(e.target.value)}
                className="font-[Montserrat] h-[40px] mb-[1%] focus:outline-none"
                placeholder=""
              />
            </Field>
          </FieldGroup>
          <Submit />
        </form>

        <p className="font-[Montserrat] text-lg mb-[4%] mt-[3%]">
          Ainda não possui uma conta?
          <Link
            href="/Register"
            className="h-[50px] mt-[6%] mb-[2%] text-[var(--linkColor)] hover:cursor-pointer hover:text-[var(--linkHover)]"
          >
            {" "}
            Cadastre aqui!
          </Link>
        </p>
      </div>
    </div>
  );
}
