"use client";

import { useState } from "react";
import localFont from "next/font/local";
import Image from "next/image";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Submit from "@/components/Animation/LoginAnimation";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Montserrat = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../../Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [created, setCreated] = useState(false)
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState({
    email: "",
    username: "",
    password: "",
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const newErrors = {
      email: "",
      username: "",
      password: "",
    };

    setSuccess(false);

    if (!email) {
      newErrors.email = "Digite seu email.";
    } else if (!email.includes("@")) {
      newErrors.email = "Digite um email válido.";
    }

    if (!username) {
      newErrors.username = "Digite seu nome de usuário.";
    }

    if (!password) {
      newErrors.password = "Digite sua senha.";
    } else if (password.length < 8) {
      newErrors.password = "A senha deve ter pelo menos 8 caracteres.";
    }

    setErrors(newErrors);

    if (
      !newErrors.email &&
      !newErrors.username &&
      !newErrors.password
    ) {
      setSuccess(true);
    }

    if (success){
        register(email, username, password)
    }

    async function register(email: string, username: string, password: string){
      const response = await fetch("/api/registerClient", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
            username,
            password
        })
    });
      const data = await response.json();

      if(response.status == 200){
        setMessage("Cadastro realizado com sucesso!")
        setCreated(true)

        setTimeout(() =>{
          router.push('/Login')
        }, 2000)
      }else{
        setMessage(data.message)
        setCreated(true)

        setTimeout(() =>{
          setCreated(false)
        }, 2000)
      }
    }
  }

  return (
    <div className="w-screen h-screen bg-[url('/Imagens/BackgroundStyle.png')]">
      <p
        className={`font-[MontserratBold] relative z-1 text-center mt-[10%] text-2xl transition-[.25s] ${created ? "opacity-100" : "opacity-0"}`}
      >
        {message}
      </p>

      <div className="absolute top-[50%] left-[50%] flex flex-col items-center translate-[-50%] bg-white w-[600px] min-h-[700px] h-[800px] rounded-[25px] shadow-[5px_5px_5px] shadow-[#00000022]">
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
          className="flex w-[60%] flex-col items-center"
          onSubmit={handleSubmit}
        >
          <h2 className="font-[MontserratBold] text-2xl m-[0_auto] mt-[3%] mb-[2%]">
            Cadastrar
          </h2>

          <FieldGroup className="gap-[3%] mb-[5%] w-full">
            <Field>
              <FieldLabel className="flex w-full justify-center font-[Montserrat] text-lg">
                Email
              </FieldLabel>

              <Input
                type="email"
                value={email}
                autoComplete="off"
                onChange={(e) => setEmail(e.target.value)}
                className="font-[Montserrat] h-[40px]"
              />

              {errors.email && (
                <p className="text-red-500 text-sm font-[Montserrat]">
                  {errors.email}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel className="flex w-full justify-center font-[Montserrat] text-lg">
                Nome de usuário
              </FieldLabel>

              <Input
                type="text"
                value={username}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                className="font-[Montserrat] h-[40px]"
              />

              {errors.username && (
                <p className="text-red-500 text-sm font-[Montserrat]">
                  {errors.username}
                </p>
              )}
            </Field>

            <Field>
              <FieldLabel className="flex w-full justify-center font-[Montserrat] text-lg">
                Senha
              </FieldLabel>

              <Input
                type="password"
                value={password}
                autoComplete="off"
                onChange={(e) => setPassword(e.target.value)}
                className="font-[Montserrat] h-[40px]"
              />

              {errors.password && (
                <p className="text-red-500 text-sm font-[Montserrat]">
                  {errors.password}
                </p>
              )}
            </Field>
          </FieldGroup>

          <Submit />
        </form>

        <p className="font-[Montserrat] text-lg mb-[4%] mt-[3%]">
          Já possui uma conta?{" "}
          <Link
            href="/Login"
            className="text-[var(--linkColor)] hover:cursor-pointer hover:text-[var(--linkHover)]"
          >
            Entre aqui!
          </Link>
        </p>
      </div>
    </div>
  );
}
