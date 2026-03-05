import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";
import BusinessClientProvider from "@/app/[locale]/(site)/business/components/modals/BusinessClientProvider";

export default function BusinessLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"rental-section__box"}
      sectionClass={"rental-section rental-section--business"}
    >
      <BusinessClientProvider>{children}</BusinessClientProvider>
    </SiteShell>
  );
}
