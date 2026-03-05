"use client";

import BusinessOfferModal from "@/components/modals/BusinessOfferModal";
import { BusinessModalProvider } from "@/app/[locale]/(site)/business/components/modals/index";

export default function BusinessClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessModalProvider
      registry={{
        offer: (props: any) => <BusinessOfferModal {...props} />,
      }}
    >
      {children}
    </BusinessModalProvider>
  );
}
