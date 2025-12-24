import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";

export default function CertificateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SiteShell
      sectionBoxClass={"cert-page__box"}
      sectionClass={"cert-page"}
    >
      {children}
    </SiteShell>
  );
}
