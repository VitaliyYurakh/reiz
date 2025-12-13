"use client";

import { createModalSystem } from "@/components/modals/createModalSystem";

export type BusinessModalSpec = {
  offer: {
    data: {};
    isClosing: boolean;
    callback?: (result: { ok: boolean }) => void;
  };
};

export const { Provider: BusinessModalProvider, useModal: useBusinessModal } =
  createModalSystem<BusinessModalSpec>();
