"use client";

import OfferModal from "@/components/modals/OfferModal";
import { BusinessModalProvider } from "@/app/[locale]/(site)/business/components/modals/index";

export default function BusinessClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessModalProvider
      registry={{
        offer: (props: any) => <OfferModal {...props} />,
      }}
    >
      {children}
    </BusinessModalProvider>
  );
}
