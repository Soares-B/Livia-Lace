import Link from "next/link"

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <nav>
        <Link href="/usuario/informacoes">
          Informações
        </Link>

        <Link href="/usuario/endereco">
          Endereço
        </Link>
      </nav>

      {children}
    </div>
  );
}