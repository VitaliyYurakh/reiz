"use client";

import { createModalSystem } from "@/components/modals/createModalSystem";

export type InvestModalSpec = {
  confirm: {
    data: { formData?: { car: string; model: string; transmission?: string; mileage?: string; year?: string; color?: string; complect?: string; name: string; phone: string; email: string } };
    isClosing: boolean;
    callback?: (result: { ok: boolean }) => void;
  };
};

export const { Provider: ContactsModalProvider, useModal: useContactsModal } =
  createModalSystem<InvestModalSpec>();
