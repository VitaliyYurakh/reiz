"use client";

import { createModalSystem } from "@/components/modals/createModalSystem";
import { Car } from "@/types/cars";

export type SideBarModalSpec = {
  requestCall: {
    data: {};
    isClosing: boolean;
    callback?: (phone: string) => void;
  };
  bookingContact: {
    data: {};
    isClosing: boolean;
    callback?: () => void;
  };
  managerWillContactYouModal: {
    data:
      | {
          type: "car_request";
          car: Car;
          startDate: Date;
          endDate: Date;
          showCloseButton: boolean;
          navigateToHomePage?: boolean;
        }
      | {
          type: "call_request";
          phone: string;
          showCloseButton: boolean;
          navigateToHomePage?: boolean;
        };
    isClosing: boolean;
    callback?: (result: { ok: boolean }) => void;
  };
};

export const { Provider: SideBarModalProvider, useModal: useSideBarModal } =
  createModalSystem<SideBarModalSpec>();
