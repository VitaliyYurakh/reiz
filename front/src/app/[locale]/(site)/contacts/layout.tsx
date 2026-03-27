import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";
import ContactsClientProvider from "@/app/[locale]/(site)/contacts/components/modals/ContactsClientProvider";
import ContactsHeroBg from "@/app/[locale]/(site)/contacts/components/ContactsHero";

export default function ContactsLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      sectionBoxClass={"contacts-section__box"}
      sectionClass={"contacts-section"}
      additionalChildren={<ContactsHeroBg />}
      mode={false}
    >
      <ContactsClientProvider>{children}</ContactsClientProvider>
    </SiteShell>
  );
}
