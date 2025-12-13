import type { ReactNode } from "react";
import clsx from "classnames";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarNav from "@/app/[locale]/(site)/components/SidebarNav";

type Props = {
  children: ReactNode;
  additionalChildren?: ReactNode;
  sectionClass: string;
  sectionBoxClass?: string;
  mainClass?: string;
  headerClass?: string;
  mode?: boolean;
};

export default function SiteShell({
  children,
  mainClass,
  sectionClass,
  sectionBoxClass,
  additionalChildren,
  headerClass,
  mode = true,
}: Props) {
  return (
    <>
      <Header mode={mode} className={headerClass} />
      <main className={clsx("main", mainClass)}>
        <section className={clsx("site-section", sectionClass)}>
          {additionalChildren}
          <div className="container">
            <div className={sectionBoxClass}>
              <SidebarNav />
              {children}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
