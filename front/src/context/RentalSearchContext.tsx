"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import RangeDateTimePicker, {
  type RangeDateTimePickerData,
  type RangeDateTimePickerResult,
} from "@/components/modals/RangeDateTimePicker";
import { createModalSystem } from "@/components/modals/createModalSystem";

export type CoverageOption = "deposit" | "coverage50" | "coverage100";

type RentalSearchModalSpec = {
  rangeDateTimePicker: {
    data: RangeDateTimePickerData;
    isClosing: boolean;
    callback: (result: RangeDateTimePickerResult) => void;
  };
};

const { Provider: RentalSearchModalProvider, useModal: useRentalSearchModal } =
  createModalSystem<RentalSearchModalSpec>();

type RentalSearchContextValue = {
  pickupLocation: string;
  setPickupLocation: (value: string) => void;
  returnLocation: string;
  setReturnLocation: (value: string) => void;
  startDate: Date | null;
  endDate: Date | null;
  setDates: (start: Date | null, end: Date | null) => void;
  totalDays: number;
  hasSelectedDates: boolean;
  coverageOption: CoverageOption;
  setCoverageOption: (option: CoverageOption) => void;
  openDatePicker: () => void;
  resetDates: () => void;
};

const RentalSearchContext = createContext<RentalSearchContextValue | null>(
  null,
);

type ProviderProps = {
  children: ReactNode;
};

function RentalSearchInnerProvider({ children }: ProviderProps) {
  const { open } = useRentalSearchModal("rangeDateTimePicker");
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });
  const [coverageOption, setCoverageOption] =
    useState<CoverageOption>("deposit");

  const setDates = useCallback((start: Date | null, end: Date | null) => {
    setDateRange({ start, end });
  }, []);

  const totalDays = useMemo(() => {
    if (!dateRange.start || !dateRange.end) return 0;
    const diffTime =
      Math.abs(dateRange.end.getTime() - dateRange.start.getTime()) -
      3600 * 1000;
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Number.isFinite(days) && days > 0 ? days : 0;
  }, [dateRange.end, dateRange.start]);

  const openDatePicker = useCallback(() => {
    open(
      {
        startDate: dateRange.start,
        endDate: dateRange.end,
      },
      ({ startDate, endDate }) => {
        setDateRange({ start: startDate, end: endDate });
      },
    );
  }, [dateRange.end, dateRange.start, open]);

  const resetDates = useCallback(() => {
    setDateRange({ start: null, end: null });
  }, []);

  const value = useMemo<RentalSearchContextValue>(
    () => ({
      pickupLocation,
      setPickupLocation,
      returnLocation,
      setReturnLocation,
      startDate: dateRange.start,
      endDate: dateRange.end,
      setDates,
      totalDays,
      hasSelectedDates: Boolean(dateRange.start && dateRange.end),
      coverageOption,
      setCoverageOption,
      openDatePicker,
      resetDates,
    }),
    [
      coverageOption,
      dateRange.end,
      dateRange.start,
      openDatePicker,
      pickupLocation,
      returnLocation,
      resetDates,
      setDates,
      totalDays,
    ],
  );

  return (
    <RentalSearchContext.Provider value={value}>
      {children}
    </RentalSearchContext.Provider>
  );
}

export function RentalSearchProvider({ children }: ProviderProps) {
  return (
    <RentalSearchModalProvider
      registry={{
        rangeDateTimePicker: (props) => <RangeDateTimePicker {...props} />,
      }}
    >
      <RentalSearchInnerProvider>{children}</RentalSearchInnerProvider>
    </RentalSearchModalProvider>
  );
}

export function useRentalSearch() {
  const ctx = useContext(RentalSearchContext);
  if (!ctx)
    throw new Error(
      "useRentalSearch must be used within a RentalSearchProvider",
    );
  return ctx;
}

export function useRentalSearchOptional() {
  return useContext(RentalSearchContext);
}
