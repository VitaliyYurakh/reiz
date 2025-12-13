"use client";

import RequestCallModal from "@/components/modals/RequestCallModal";
import { SideBarModalProvider } from "@/components/modals/index";
import ManagerWillContactYouModal from "@/components/modals/ManagerWillContactYouModal";

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
