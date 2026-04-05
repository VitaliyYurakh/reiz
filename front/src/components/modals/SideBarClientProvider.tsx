"use client";

import dynamic from "next/dynamic";
import { SideBarModalProvider } from "@/components/modals/index";

// Dynamic imports for code splitting - modals are not needed on initial load
const RequestCallModal = dynamic(
  () => import("@/components/modals/RequestCallModal"),
  { ssr: false }
);

const ManagerWillContactYouModal = dynamic(
  () => import("@/components/modals/ManagerWillContactYouModal"),
  { ssr: false }
);

const BookingContactModal = dynamic(
  () => import("@/components/modals/BookingContactModal"),
  { ssr: false }
);

const LoginRequiredModal = dynamic(
  () => import("@/components/modals/LoginRequiredModal"),
  { ssr: false }
);

export default function SideBarClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SideBarModalProvider
      registry={{
        requestCall: (props: any) => <RequestCallModal {...props} />,
        bookingContact: (props: any) => <BookingContactModal {...props} />,
        managerWillContactYouModal: (props: any) => (
          <ManagerWillContactYouModal {...props} />
        ),
        loginRequired: (props: any) => <LoginRequiredModal {...props} />,
      }}
    >
      {children}
    </SideBarModalProvider>
  );
}
