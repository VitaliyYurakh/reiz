import type { ReactNode } from "react";
import SiteShell from "@/app/[locale]/(site)/components/SiteShell";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell sectionClass="auth-section" mode={false}>
      {children}
    </SiteShell>
  );
}
