"use client";

import { createModalSystem } from "@/components/modals/createModalSystem";
import type {
  RangeDateTimePickerData,
  RangeDateTimePickerResult,
} from "@/components/modals/RangeDateTimePicker";
import type { Car } from "@/types/cars";

export type CarModalSpec = {
  rent: {
    data: {
      selectedPlanId: number;
      car: Car;
      startDate: Date;
      endDate: Date;
    };
    isClosing: boolean;
    callback: (result: { car: Car; startDate: Date; endDate: Date }) => void;
  };
  rangeDateTimePicker: {
    data: RangeDateTimePickerData;
    isClosing: boolean;
    callback: (result: RangeDateTimePickerResult) => void;
  };
};

export const { Provider: CarModalProvider, useModal: useCarModal } =
  createModalSystem<CarModalSpec>();
