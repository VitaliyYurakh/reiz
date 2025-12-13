import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";

export default function CertificateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SiteShell
      sectionBoxClass={"gift-section__box"}
      sectionClass={"gift-section"}
    >
      {children}
    </SiteShell>
  );
}
