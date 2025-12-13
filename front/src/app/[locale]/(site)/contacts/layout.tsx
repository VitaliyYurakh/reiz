import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";
import ContactsClientProvider from "@/app/[locale]/(site)/contacts/components/modals/ContactsClientProvider";

export default function ContactsLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"contacts-section__box"}
      sectionClass={"contacts-section"}
    >
      <ContactsClientProvider>{children}</ContactsClientProvider>
    </SiteShell>
  );
}
