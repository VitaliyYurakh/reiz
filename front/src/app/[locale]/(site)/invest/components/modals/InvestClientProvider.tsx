"use client";

import { InvestModalProvider } from "@/app/[locale]/(site)/invest/components/modals";
import ConfirmTicket from "@/components/modals/ConfirmTicket";

export default function InvestClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <InvestModalProvider
      registry={{
        confirm: (props: any) => <ConfirmTicket {...props} />,
      }}
    >
      {children}
    </InvestModalProvider>
  );
}
