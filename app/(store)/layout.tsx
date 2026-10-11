import Header from "@/components/main/Header";
import Footer from "@/components/main/Footer";

export default function StoreLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Header />
      {children}
      {modal}
      <Footer />
    </>
  );
}