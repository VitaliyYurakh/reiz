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

export default function SideBarClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SideBarModalProvider
      registry={{
        requestCall: (props: any) => <RequestCallModal {...props} />,
        managerWillContactYouModal: (props: any) => (
          <ManagerWillContactYouModal {...props} />
        ),
      }}
    >
      {children}
    </SideBarModalProvider>
  );
}
