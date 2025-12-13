import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CarsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header mode />
      <main className={"main"}>{children}</main>
      <Footer />
    </>
  );
}
