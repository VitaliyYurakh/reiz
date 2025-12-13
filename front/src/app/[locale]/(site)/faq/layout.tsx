import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";

export default function FAQLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"faq-section__box"}
      sectionClass={"faq-section"}
    >
      {children}
    </SiteShell>
  );
}
