import type { Metadata } from "next";

import "./globals.css";
import localFont from "next/font/local";

const Montserrat = localFont({
  src: "./Fonts/Montserrat/static/Montserrat-Medium.ttf",
  variable: "--font-montserrat",
  display: "swap",
});

const MontserratBold = localFont({
  src: "./Fonts/Montserrat/static/Montserrat-SemiBold.ttf",
  variable: "--font-montserrat-bold",
});

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
    <html lang="pt-BR" className="scroll-smooth scrollbar-thumb-[var(--scrollColor)] ">
      <body className={`${Montserrat.variable} ${MontserratBold.variable} bg-[var(--lightPink-Pastel)] flex flex-col min-h-screen selection:bg-[var(--selectionColor)] selection:text-[var(--selectionText)] outline-[var(--outlineColor)]`}>
        {children}
      </body>
    </html>
  );
}
