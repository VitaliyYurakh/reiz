import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";

export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"about-section__box"}
      sectionClass={"about-section"}
    >
      {children}
    </SiteShell>
  );
}
