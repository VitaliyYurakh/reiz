"use client";

import { createModalSystem } from "@/components/modals/createModalSystem";

export type InvestModalSpec = {
  confirm: {
    data: {};
    isClosing: boolean;
    callback?: (result: { ok: boolean }) => void;
  };
};

export const { Provider: InvestModalProvider, useModal: useInvestModal } =
  createModalSystem<InvestModalSpec>();
