"use client";

import ConfirmTicket from "@/components/modals/ConfirmTicket";
import { ContactsModalProvider } from "@/app/[locale]/(site)/contacts/components/modals/index";

export default function ContactsClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ContactsModalProvider
      registry={{
        confirm: (props: any) => <ConfirmTicket {...props} />,
      }}
    >
      {children}
    </ContactsModalProvider>
  );
}
