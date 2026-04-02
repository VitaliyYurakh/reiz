import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UtilityBar from "@/components/UtilityBar";

export default function CarsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header mode />
      <main className={"main"}>
        <div className="container" style={{ paddingTop: 20 }}>
          <UtilityBar />
        </div>
        {children}
      </main>
      <Footer />
    </>
  );
}
