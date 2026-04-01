import type { ReactNode } from "react";
import clsx from "classnames";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SidebarNav from "@/app/[locale]/(site)/components/SidebarNav";
import UtilityBar from "@/components/UtilityBar";

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
            <div className={clsx("site-box", sectionBoxClass)}>
              <SidebarNav />
              <div>
                <UtilityBar />
                {children}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
