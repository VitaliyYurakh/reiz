"use client";

import { CarModalProvider } from "@/app/[locale]/(site)/cars/[idSlug]/components/modals/index";
import CarRentModal from "@/components/modals/CarRentModal";
import DatePicker from "@/components/modals/RangeDateTimePicker";

export default function CarClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CarModalProvider
      registry={{
        rent: (props: any) => <CarRentModal {...props} />,
        rangeDateTimePicker: (props: any) => <DatePicker {...props} />,
      }}
    >
      {children}
    </CarModalProvider>
  );
}
