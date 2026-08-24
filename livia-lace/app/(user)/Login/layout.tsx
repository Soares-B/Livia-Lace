import type { Metadata } from "next";

import "../../globals.css";

export const metadata: Metadata = {
  title: "Livia Lace",
  description: "Laços feitos com muito amor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="bg-(--lightPink-Pastel) flex flex-col min-height-screen selection:bg-rose-400 selection:text-white">
        {children}
      </body>
    </html>
  );
}
