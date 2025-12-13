import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"blog-section__box"}
      sectionClass={"blog-section"}
    >
      {children}
    </SiteShell>
  );
}
