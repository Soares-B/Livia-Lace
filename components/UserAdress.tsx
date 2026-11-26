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
import { isValidHouseNumber } from "@/lib/validation.mjs";
import { Button } from "@/components/ui/button";

type AddressProps = {
  estado: string | null;
  cidade: string | null;
  rua: string | null;
  referencia: string | null;
  numero: string | null;
  telefone: string | null;
  cep: string | null;
};

function formatCep(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
}

export default function AddressField({
  estado: estadoInicial,
  cidade: cidadeInicial,
  rua: ruaInicial,
  referencia: referenciaInicial,
  numero: numeroInicial,
  telefone: telefoneInicial,
  cep: cepInicial,
}: AddressProps) {
  const [estado, setEstado] = useState(estadoInicial ?? "");
  const [cidade, setCidade] = useState(cidadeInicial ?? "");
  const [rua, setRua] = useState(ruaInicial ?? "");
  const [referencia, setReferencia] = useState(referenciaInicial ?? "");
  const [numero, setNumero] = useState(numeroInicial ?? "");
  const [telefone, setTelefone] = useState(telefoneInicial ?? "");
  // O CEP é salvo só com dígitos; sem formatar aqui, o "Salvar" recusava o CEP já cadastrado (8 < 9 caracteres).
  const [cep, setCep] = useState(formatCep(cepInicial ?? ""));
  const [saving, setSaving] = useState(false);
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

  async function deleteData() {
    if (saving || !window.confirm("Apagar o endereço salvo? Essa ação não pode ser desfeita.")) {
      return;
    }

    setSaving(true);

    try {
      const response = await fetch("/api/registerAddress", { method: "DELETE" });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(true);
        setErrMessage("Não foi possível apagar");
        setErrDesc(data?.message ?? "Tente novamente em instantes.");
        return;
      }

      // Só limpa a tela depois que o banco confirmou a exclusão.
      setCep("");
      setEstado("");
      setRua("");
      setCidade("");
      setNumero("");
      setTelefone("");
      setReferencia("");
      setError(true);
      setErrMessage("Dados apagados");
      setErrDesc("Seu endereço foi removido.");
    } catch {
      setError(true);
      setErrMessage("Erro de conexão");
      setErrDesc("Não foi possível apagar seus dados. Verifique sua internet e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!estado) {
      setError(true);
      setErrMessage("Estado não selecionado");
      setErrDesc("Por favor, selecione um estado antes de salvar seus dados.");
      return;
    }

    if (!isValidHouseNumber(numero)) {
      setError(true);
      setErrMessage("Número inválido");
      setErrDesc("Digite o número da casa (ex.: 123) ou S/N se não houver número.");
      return;
    }

    if (telefone.length < 14) {
      setError(true);
      setErrMessage("Telefone inválido");
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

    setSaving(true);

    try {
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
          numero,
          telefone,
          cep,
        }),
      });
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(true);
        setErrMessage("Não foi possível salvar");
        setErrDesc(data?.message ?? "Tente novamente em instantes.");
        return;
      }

      setError(true);
      setErrMessage("Dados salvos");
      setErrDesc("Seu endereço foi atualizado com sucesso.");
    } catch {
      setError(true);
      setErrMessage("Erro de conexão");
      setErrDesc("Não foi possível salvar seus dados. Verifique sua internet e tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="relative col-2 row-[2/-1] w-full h-full">
      <AlertDialog open={error} onOpenChange={setError}>
        <AlertDialogContent size="sm" className="font-montserrat-bold">
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
          <SelectTrigger className="w-[90%] font-montserrat-bold text-[var(--darkerPink)] h-20 text-lg">
            <SelectValue placeholder="Selecione um estado" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectLabel className="font-montserrat-bold text-[var(--darkestPink)]">
                Estados
              </SelectLabel>

              {states.map((estado) => (
                <SelectItem
                  key={estado.value}
                  value={estado.value}
                  className="font-montserrat text-[var(--darkerPink)]"
                >
                  {estado.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="relative w-[90%] h-[60%]">
          <h2 className="absolute top-[-45%] left-[2%] font-montserrat-bold">
            Cidade*
          </h2>
          <Input
            type="text"
            autoComplete="off"
            required
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full h-[95%] font-montserrat pl-[10px] text-lg box-border"
          />
        </div>

        <div className="w-[90%] h-[60%] flex gap-[3%]">
          <div className="relative w-[67%] h-full">
            <h2 className="absolute top-[-45%] left-[2%] font-montserrat-bold">
              Rua*
            </h2>
            <Input
              type="text"
              autoComplete="off"
              required
              value={rua}
              onChange={(e) => setRua(e.target.value)}
              className="w-full h-[95%] font-montserrat pl-[10px] text-lg box-border"
            />
          </div>
          <div className="relative w-[30%] h-full">
            <h2 className="absolute top-[-45%] left-[2%] font-montserrat-bold">
              Número*
            </h2>
            <Input
              type="text"
              name="numero"
              id="numero"
              autoComplete="off"
              required
              maxLength={10}
              placeholder="123 ou S/N"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              className="w-full h-[95%] font-montserrat pl-[10px] text-lg box-border"
            />
          </div>
        </div>

        <div className="relative w-[90%] h-[60%]">
          <h2 className="absolute top-[-45%] left-[2%] font-montserrat-bold">
            Referência
          </h2>
          <Input
            type="text"
            autoComplete="off"
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            className="w-full h-[95%] font-montserrat pl-[10px] text-lg box-border"
          />
        </div>

        <div className="relative w-[90%] h-[60%]">
          <h2 className="absolute top-[-45%] left-[2%] font-montserrat-bold">
            Telefone*
          </h2>

          <Input
            type="tel"
            name="telefone"
            id="telefone"
            className="w-full h-[95%] font-montserrat pl-[10px] text-lg box-border"
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
          <h2 className="absolute top-[-45%] left-[2%] font-montserrat-bold">
            CEP*
          </h2>

          <Input
            type="text"
            name="cep"
            id="cep"
            className="w-full h-[95%] font-montserrat pl-[10px] text-lg box-border"
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
            disabled={saving}
            className="w-full h-[95%] font-montserrat-bold pl-[10px] text-lg box-border bg-[var(--delete)] hover:bg-[var(--deleteHover)] hover:cursor-pointer text-black"
            onClick={() => deleteData()}
          >
            Deletar dados
          </Button>
        </div>

        <div className="relative w-[90%] h-[60%]">
          <Button
            type="submit"
            disabled={saving}
            className="w-full h-[95%] font-montserrat-bold pl-[10px] text-lg box-border bg-[var(--save)] hover:bg-[var(--saveHover)] hover:cursor-pointer text-black"
          >
            Salvar
          </Button>
        </div>
      </form>
    </div>
  );
}
