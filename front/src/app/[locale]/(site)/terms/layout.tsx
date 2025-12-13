import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";

export default function TermsLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"terms-section__box"}
      sectionClass={"terms-section"}
    >
      {children}
    </SiteShell>
  );
}
