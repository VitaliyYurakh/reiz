"use client";

import BookingContactModal from "@/components/modals/BookingContactModal";
import { BusinessModalProvider } from "@/app/[locale]/(site)/business/components/modals/index";

export default function BusinessClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BusinessModalProvider
      registry={{
        offer: (props: any) => <BookingContactModal {...props} />,
      }}
    >
      {children}
    </BusinessModalProvider>
  );
}
