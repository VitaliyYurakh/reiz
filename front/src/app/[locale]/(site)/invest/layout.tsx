import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";
import InvestClientProvider from "@/app/[locale]/(site)/invest/components/modals/InvestClientProvider";

export default function InvestLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"rental-section__box"}
      sectionClass={"rental-section"}
    >
      <InvestClientProvider>{children}</InvestClientProvider>
    </SiteShell>
  );
}
