import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";
import InvestThemeColorSetter from "@/app/[locale]/(site)/invest/components/ThemeColorSetter";

export default function InvestLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"rental-section__box"}
      sectionClass={"rental-section rental-section--invest"}
      headerClass={"header--invest"}
    >
      <InvestThemeColorSetter />
      {children}
    </SiteShell>
  );
}
