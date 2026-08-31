"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";

import localFont from "next/font/local";

const Montserrat = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Medium.ttf",
});

const MontserratBold = localFont({
  src: "../app/Fonts/Montserrat/static/Montserrat-Bold.ttf",
});

type AddressProps = {
  estado: string | null;
  cidade: string | null;
  rua: string | null;
  referencia: string | null;
  numero: string | null;
  cep: BigInt | string | null;
};

export default function AddressField({
  estado: estadoInicial,
  cidade: cidadeInicial,
  rua: ruaInicial,
  referencia: referenciaInicial,
  numero: numeroInicial,
  cep: cepInicial,
}: AddressProps) {
  const [estado, setEstado] = useState(estadoInicial ?? "");
  const [cidade, setCidade] = useState(cidadeInicial ?? "");
  const [rua, setRua] = useState(ruaInicial ?? "");
  const [referencia, setReferencia] = useState(referenciaInicial ?? "");
  const [telefone, setTelefone] = useState(numeroInicial ?? "");
  const [cep, setCep] = useState(cepInicial != null ? String(cepInicial) : "");
  const [error, setError] = useState(false);
  const [errMessage, setErrMessage] = useState("");
  const [errDesc, setErrDesc] = useState("");

  const states = [
    { label: "Acre", value: "Acre" },
    { label: "Alagoas", value: "Alagoas" },
    { label: "Amapá", value: "Amapá" },
    { label: "Amazonas", value: "Amazonas" },
    { label: "Bahia", value: "Bahia" },
    { label: "Ceará", value: "Ceará" },
    { label: "Distrito Federal", value: "Distrito Federal" },
    { label: "Espírito Santo", value: "Espírito Santo" },
    { label: "Goiás", value: "Goiás" },
    { label: "Maranhão", value: "Maranhão" },
    { label: "Mato Grosso", value: "Mato Grosso" },
    { label: "Mato Grosso do Sul", value: "Mato Grosso do Sul" },
    { label: "Minas Gerais", value: "Minas Gerais" },
    { label: "Pará", value: "Pará" },
    { label: "Paraíba", value: "Paraíba" },
    { label: "Paraná", value: "Paraná" },
    { label: "Pernambuco", value: "Pernambuco" },
    { label: "Piauí", value: "Piauí" },
    { label: "Rio de Janeiro", value: "Rio de Janeiro" },
    { label: "Rio Grande do Norte", value: "Rio Grande do Norte" },
    { label: "Rio Grande do Sul", value: "Rio Grande do Sul" },
    { label: "Rondônia", value: "Rondônia" },
    { label: "Roraima", value: "Roraima" },
    { label: "Santa Catarina", value: "Santa Catarina" },
    { label: "São Paulo", value: "São Paulo" },
    { label: "Sergipe", value: "Sergipe" },
    { label: "Tocantins", value: "Tocantins" },
  ];

  function deleteData() {
    setCep("");
    setEstado("");
    setRua("");
    setCidade("");
    setTelefone("");
    setReferencia("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!estado) {
      setError(true);
      setErrMessage("Estado não selecionado");
      setErrDesc("Por favor, selecione um estado antes de salvar seus dados.");
      return;
    }

    if (telefone.length < 14) {
      setError(true);
      setErrMessage("Número inválido");
      setErrDesc("Por favor, digite um número de telefone válido");
      return;
    }

    if (cep.length < 9) {
      setError(true);
      setErrMessage("CEP inválido");
      setErrDesc("Por favor, digite um CEP válido");
      return;
    }

    const city = cidade.trim();
    if (city.length < 3) {
      setError(true);
      setErrMessage("Cidade inválida");
      setErrDesc("Por favor, digite uma Cidade válida");
      return;
    }

    const road = rua.trim();
    if (road.length < 3) {
      setError(true);
      setErrMessage("Rua inválida");
      setErrDesc("Por favor, digite uma rua válida");
      return;
    }

    const ref = referencia.trim();

    const response = await fetch("/api/registerAddress", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        estado,
        city,
        road,
        ref,
        telefone,
        cep,
      }),
    });
    const data = await response.json();

    console.log(data, response.status);
  }

  return (
    <div className="relative col-2 row-[2/-1] w-full h-full">
      <AlertDialog open={error} onOpenChange={setError}>
        <AlertDialogContent size="sm" className="font-[MontserratBold]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--darkerPink)] text-lg">
              {errMessage}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-[var(--darkPink-Pastel)]">
              {errDesc}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="!grid !grid-cols-1 bg-[var(--lightPink-Pastel)]/50">
            <AlertDialogAction
              onClick={() => setError(false)}
              className="bg-[var(--darkestPink)]/50 hover:bg-[var(--darkestPink)]/75 hover:cursor-pointer"
            >
              Entendi
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <form
        onSubmit={handleSubmit}
        className="w-full h-full grid grid-cols-[1fr_1fr] grid-rows-[1fr_1fr_1fr_1fr] gap-[25px] items-center justify-items-center"
      >
        <Select
          items={states}
          value={estado}
          onValueChange={(value) => setEstado(value!)}
        >
          <SelectTrigger className="w-[90%] font-[MontserratBold] text-[var(--darkerPink)] h-20 text-lg">
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel className="font-[MontserratBold] text-[var(--darkestPink)]">
                Estados
              </SelectLabel>

              {states.map((estado) => (
                <SelectItem
                  key={estado.value}
                  value={estado.value}
                  className="font-[Montserrat] text-[var(--darkerPink)]"
                >
                  {estado.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="relative w-[90%] h-[60%]">
          <h2 className="absolute top-[-45%] left-[2%] font-[MontserratBold]">
            Cidade*
          </h2>
          <Input
            type="text"
            autoComplete="off"
            required
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full h-[95%] font-[Montserrat] pl-[10px] text-lg box-border"
          />
        </div>

        <div className="relative w-[90%] h-[60%]">
          <h2 className="absolute top-[-45%] left-[2%] font-[MontserratBold]">
            Rua*
          </h2>
          <Input
            type="text"
            autoComplete="off"
            required
            value={rua}
            onChange={(e) => setRua(e.target.value)}
            className="w-full h-[95%] font-[Montserrat] pl-[10px] text-lg box-border"
          />
        </div>

        <div className="relative w-[90%] h-[60%]">
          <h2 className="absolute top-[-45%] left-[2%] font-[MontserratBold]">
            Referência
          </h2>
          <Input
            type="text"
            autoComplete="off"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            className="w-full h-[95%] font-[Montserrat] pl-[10px] text-lg box-border"
          />
        </div>

        <div className="relative w-[90%] h-[60%]">
          <h2 className="absolute top-[-45%] left-[2%] font-[MontserratBold]">
            Telefone*
          </h2>

          <Input
            type="tel"
            name="telefone"
            id="telefone"
            className="w-full h-[95%] font-[Montserrat] pl-[10px] text-lg box-border"
            placeholder="(99) 99999-9999"
            maxLength={15}
            autoComplete="off"
            required
            value={telefone}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, "");

              if (valor.length > 11) {
                valor = valor.slice(0, 11);
              }

              if (valor.length > 6) {
                valor = valor.replace(
                  /^(\d{2})(\d{5})(\d{0,4}).*/,
                  "($1) $2-$3",
                );
              } else if (valor.length > 2) {
                valor = valor.replace(/^(\d{2})(\d{0,5}).*/, "($1) $2");
              } else if (valor.length > 0) {
                valor = valor.replace(/^(\d*)/, "($1");
              }

              setTelefone(valor);
            }}
          />
        </div>

        <div className="relative w-[90%] h-[60%]">
          <h2 className="absolute top-[-45%] left-[2%] font-[MontserratBold]">
            CEP*
          </h2>

          <Input
            type="text"
            name="cep"
            id="cep"
            className="w-full h-[95%] font-[Montserrat] pl-[10px] text-lg box-border"
            placeholder="00000-000"
            maxLength={9}
            autoComplete="off"
            required
            value={cep}
            onChange={(e) => {
              let valor = e.target.value.replace(/\D/g, "");

              if (valor.length > 8) {
                valor = valor.slice(0, 8);
              }

              if (valor.length > 5) {
                valor = valor.replace(/^(\d{5})(\d{0,3}).*/, "$1-$2");
              }

              setCep(valor);
            }}
          />
        </div>

        <div className="relative w-[90%] h-[60%]">
          <Button
            type="button"
            className="w-full h-[95%] font-[MontserratBold] pl-[10px] text-lg box-border bg-[var(--delete)] hover:bg-[var(--deleteHover)] hover:cursor-pointer text-black"
            onClick={() => deleteData()}
          >
            Deletar dados
          </Button>
        </div>

        <div className="relative w-[90%] h-[60%]">
          <Button
            type="submit"
            className="w-full h-[95%] font-[MontserratBold] pl-[10px] text-lg box-border bg-[var(--save)] hover:bg-[var(--saveHover)] hover:cursor-pointer text-black"
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
