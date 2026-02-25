"use client";

import { createModalSystem } from "@/components/modals/createModalSystem";

export type InvestFormData = {
  car: string;
  model: string;
  transmission?: string;
  mileage?: string;
  year?: string;
  color?: string;
  complect?: string;
  name: string;
  phone: string;
  email: string;
};

export type InvestModalSpec = {
  confirm: {
    data: { formData: InvestFormData };
    isClosing: boolean;
    callback?: (result: { ok: boolean }) => void;
  };
};

export const { Provider: InvestModalProvider, useModal: useInvestModal } =
  createModalSystem<InvestModalSpec>();
