import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";

export default function InsuranceLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"insurance-section__box"}
      sectionClass={"insurance-section"}
    >
      {children}
    </SiteShell>
  );
}
