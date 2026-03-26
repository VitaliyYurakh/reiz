import clsx from "classnames";
import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "@/i18n/request";
import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "react-tooltip";
import {
  type CarModalSpec,
  useCarModal,
} from "@/app/[locale]/(site)/cars/[idSlug]/components/modals";
import LocationSelect from "@/app/[locale]/components/LocationSelect";
import type { CarCountingRule } from "@/types/cars";
import { submitBookingRequest } from "@/lib/api/feedback";
import {
  type ExtraId,
  type FormState,
  EXTRAS_BY_ID,
  DEFAULT_FORM_STATE,
  EMAIL_PATTERN,
  formatFull,
  calcRentalDays,
} from "./types";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import PricingSummary from "./PricingSummary";

export default function CarRentModal({
  close,
  data,
  isClosing,
  runCallback,
}: {
  id: string;
  data: CarModalSpec["rent"]["data"];
  close: () => void;
  isClosing: boolean;
  runCallback: CarModalSpec["rent"]["callback"];
}) {
  const t = useTranslations("carRentModal");
  const tAside = useTranslations("carAside");
  const { open: openDatePicker } = useCarModal("rangeDateTimePicker");
  const locale = useLocale() as Locale;

  const [step, setStep] = useState<1 | 2>(1);
  const [formState, setFormState] = useState<FormState>(() => ({
    ...DEFAULT_FORM_STATE,
  }));
  const [selectedPlanId, setSelectedPlanId] = useState<number>(
    data.selectedPlanId || data.car.carCountingRule[0]?.id,
  );
  const [selectedExtras, setSelectedExtras] = useState<Set<ExtraId>>(
    () => new Set(["additionalDriver"]),
  );
  const [formResetKey, setFormResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<"" | "success" | "error">("");
  const [formError, setFormError] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<Set<keyof FormState>>(
    new Set(),
  );
  const fieldRefs = useRef<any>({});
  const [selectedDate, setSelectedDate] = useState({
    startDate: data.startDate,
    endDate: data.endDate,
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setSelectedDate({
      startDate: data.startDate,
      endDate: data.endDate,
    });
  }, [data.startDate, data.endDate]);

  useEffect(() => {
    setSelectedPlanId(data.selectedPlanId);
  }, [data.selectedPlanId]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <1>
  useEffect(() => {
    setFormState({ ...DEFAULT_FORM_STATE });
    setSelectedExtras(new Set());
    setStep(1);
    setFeedback("");
    setFormError(null);
    setFormResetKey((value) => value + 1);
    setInvalidFields(new Set());
  }, [data.car.id]);

  const setFieldRef = useCallback(
    (field: keyof FormState) => (node: HTMLElement | null) => {
      if (node) {
        fieldRefs.current[field] = node;
      } else {
        delete fieldRefs.current[field];
      }
    },
    [],
  );

  const clearFieldError = useCallback((field: keyof FormState) => {
    setInvalidFields((prev) => {
      if (!prev.has(field)) return prev;
      const next = new Set(prev);
      next.delete(field);
      return next;
    });
  }, []);

  const handleSelectDates = useCallback(() => {
    openDatePicker(
      {
        startDate: selectedDate.startDate,
        endDate: selectedDate.endDate,
      },
      (res) => {
        setSelectedDate({
          startDate: res.startDate,
          endDate: res.endDate,
        });
      },
    );
  }, [openDatePicker, selectedDate.endDate, selectedDate.startDate]);

  const totalDays = useMemo(() => {
    if (!selectedDate.startDate || !selectedDate.endDate) return 0;
    return calcRentalDays(selectedDate.startDate, selectedDate.endDate);
  }, [selectedDate.endDate, selectedDate.startDate]);

  const selectedPlan: CarCountingRule | undefined = useMemo(() => {
    if (selectedPlanId === null) return data.car.carCountingRule[0];
    return data.car.carCountingRule.find((plan) => plan.id === selectedPlanId);
  }, [data.car.carCountingRule, selectedPlanId]);

  const activeTariff = useMemo(() => {
    if (data.car.rentalTariff.length === 0) return undefined;
    if (totalDays <= 0) return data.car.rentalTariff[0];
    return (
      data.car.rentalTariff.find(
        (tariff) =>
          totalDays >= tariff.minDays &&
          (totalDays <= tariff.maxDays || tariff.maxDays === 0),
      ) ?? data.car.rentalTariff[data.car.rentalTariff.length - 1]
    );
  }, [data.car.rentalTariff, totalDays]);

  const pricePercent = selectedPlan?.pricePercent ?? 0;
  const depositPercent = selectedPlan?.depositPercent ?? 0;

  const baseDailyPrice = activeTariff?.dailyPrice ?? 0;
  const is30Plus = totalDays >= 29;
  const pFixed30 = selectedPlan?.priceFixed30 ?? null;
  const pFixed = selectedPlan?.priceFixed ?? null;
  const surchargePerDay = is30Plus && pFixed30 != null ? pFixed30 / 30 : (pFixed ?? 0);
  const dailyPriceBeforeDiscount = pFixed != null || pFixed30 != null
    ? baseDailyPrice + surchargePerDay
    : baseDailyPrice * (1 + pricePercent / 100);
  const discountPercent = data.car.discount ?? 0;
  const dailyPrice = Math.round(dailyPriceBeforeDiscount * (1 - discountPercent / 100));
  const hasDiscount = discountPercent > 0;
  const depositAmount = Math.max(
    (activeTariff?.deposit ?? 0) * (1 - depositPercent / 100),
    120,
  );

  const extrasPerDay = useMemo(() => {
    return Array.from(selectedExtras).reduce((sum, id) => {
      const extra = EXTRAS_BY_ID[id];
      if (!extra || extra.pricing !== "perDay") return sum;
      return sum + extra.price;
    }, 0);
  }, [selectedExtras]);

  const extrasOneTime = useMemo(() => {
    return Array.from(selectedExtras).reduce((sum, id) => {
      const extra = EXTRAS_BY_ID[id];
      if (!extra || extra.pricing !== "perRental") return sum;
      return sum + extra.price;
    }, 0);
  }, [selectedExtras]);

  const extrasTotal = useMemo(() => {
    if (totalDays <= 0) return extrasOneTime;
    return extrasPerDay * totalDays + extrasOneTime;
  }, [extrasOneTime, extrasPerDay, totalDays]);

  const rentalCost = totalDays > 0 ? dailyPrice * totalDays : 0;
  const totalCost = rentalCost + extrasTotal;

  const carName = useMemo(() => {
    return `${data.car.brand ?? ""} ${data.car.model ?? ""} ${
      data.car.yearOfManufacture ?? ""
    }`.trim();
  }, [data.car.brand, data.car.model, data.car.yearOfManufacture]);

  const handleInputChange = useCallback(
    (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => {
      const value =
        event.target.type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : event.target.value;
      setFormState((prev) => ({ ...prev, [field]: value }));
      if (formError) setFormError(null);
      if (feedback) setFeedback("");
      clearFieldError(field);
    },
    [clearFieldError, feedback, formError],
  );

  const handleSelectChange = useCallback(
    (field: "pickupLocation" | "returnLocation") => (value: string) => {
      setFormState((prev) => ({ ...prev, [field]: value }));
      if (formError) setFormError(null);
      clearFieldError(field);
    },
    [clearFieldError, formError],
  );

  const handlePhoneChange = useCallback(
    (value: string) => {
      setFormState((prev) => ({ ...prev, phone: value }));
      if (formError) setFormError(null);
      clearFieldError("phone");
    },
    [clearFieldError, formError],
  );

  const toggleExtra = useCallback((id: ExtraId) => {
    setSelectedExtras((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const validatePersonalStep = useCallback(() => {
    const requiredFields: (keyof FormState)[] = [
      "firstName",
      "lastName",
      "phone",
      "email",
      "pickupLocation",
      "returnLocation",
    ];

    const invalid = new Set<keyof FormState>();
    for (const field of requiredFields) {
      const value = formState[field];
      if (typeof value === "string" && value.trim().length === 0) {
        invalid.add(field);
      }
    }

    const emailValue = formState.email.trim();
    const isEmailInvalid = emailValue !== "" && !EMAIL_PATTERN.test(emailValue);
    if (isEmailInvalid) {
      invalid.add("email");
    }

    if (invalid.size > 0) {
      setInvalidFields(invalid);
      const priorityOrder = [...requiredFields];
      if (!priorityOrder.includes("email")) priorityOrder.push("email");
      const firstInvalidField = priorityOrder.find((field) =>
        invalid.has(field),
      );
      if (firstInvalidField) {
        fieldRefs.current[firstInvalidField]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      setFormError(
        isEmailInvalid && invalid.size === 1
          ? t("notifications.validation.invalidEmail")
          : t("notifications.validation.fillRequired"),
      );
      return false;
    }

    setInvalidFields(new Set());
    return true;
  }, [formState, t]);

  const ensureStepOneValid = useCallback(() => {
    const isPersonalValid = validatePersonalStep();
    if (!isPersonalValid) return false;
    if (totalDays <= 0) {
      setFormError(t("notifications.validation.fillRequired"));
      return false;
    }
    setFormError(null);
    return true;
  }, [t, totalDays, validatePersonalStep]);

  const handleNextStep = useCallback(() => {
    if (!ensureStepOneValid()) {
      return;
    }
    setStep(2);
  }, [ensureStepOneValid]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (step !== 2) {
        handleNextStep();
        return;
      }
      if (!ensureStepOneValid()) {
        return;
      }
      if (!formState.consent) {
        setFormError(t("notifications.validation.acceptTerms"));
        return;
      }
      setIsSubmitting(true);
      setFormError(null);
      setFeedback("");
      try {
        // Calculate extras with details
        const extrasDetails = Array.from(selectedExtras).map((id) => {
          const extra = EXTRAS_BY_ID[id];
          const isPerDay = extra.pricing === "perDay";
          const quantity = isPerDay ? totalDays : 1;
          const cost = extra.price * quantity;
          return {
            id: id,
            price: extra.price,
            quantity: quantity,
            cost: cost,
            isPerDay: isPerDay,
          };
        });

        await submitBookingRequest({
          firstName: formState.firstName,
          lastName: formState.lastName,
          phone: formState.phone,
          email: formState.email,
          pickupLocation: formState.pickupLocation,
          returnLocation: formState.returnLocation,
          startDate: selectedDate.startDate,
          endDate: selectedDate.endDate,
          flightNumber: formState.flightNumber,
          comment: formState.comment,
          carId: data.car.id,
          carDetails: {
            brand: data.car.brand,
            model: data.car.model,
            year: data.car.yearOfManufacture,
          },
          selectedPlan: selectedPlan ? {
            id: selectedPlan.id,
            depositPercent: selectedPlan.depositPercent,
            pricePercent: selectedPlan.pricePercent,
          } : null,
          selectedExtras: extrasDetails,
          totalDays: totalDays,
          priceBreakdown: {
            dailyPrice: dailyPrice,
            rentalCost: rentalCost,
            extrasCost: extrasTotal,
            totalCost: totalCost,
            depositAmount: depositAmount,
          },
        });

        setFeedback("success");
        runCallback?.({
          car: data.car,
          startDate: selectedDate.startDate,
          endDate: selectedDate.endDate,
        });
        close();
      } catch (error) {
        console.error(error);
        setFeedback("error");
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      ensureStepOneValid,
      formState,
      handleNextStep,
      runCallback,
      step,
      selectedDate,
      data.car,
      selectedPlan,
      selectedExtras,
      totalDays,
      dailyPrice,
      rentalCost,
      extrasTotal,
      totalCost,
      depositAmount,
      t,
      close,
    ],
  );

  const renderRangeLabel = () => {
    if (!selectedDate.startDate || !selectedDate.endDate)
      return t("orderForm.datePlaceholder");
    return `${formatFull(selectedDate.startDate)} ${tAside("rangeSeparator")} ${formatFull(selectedDate.endDate)}`;
  };

  return (
    <div
      className={`rent-modal modal ${!isClosing ? "active" : ""}`}
      style={
        !isClosing
          ? { opacity: 1, display: "flex", transition: "200ms" }
          : { opacity: "0", display: "flex", transition: "300ms" }
      }
      data-popup="rent"
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "48px 32px",
          maxWidth: "440px",
          width: "90%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
          margin: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#b0b0b0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p style={{ fontSize: "16px", lineHeight: 1.6, margin: 0, color: "#333" }}>
          {t("unavailable")}
        </p>
        <button
          className="main-button"
          type="button"
          onClick={close}
          style={{ marginTop: "8px", minWidth: "160px" }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
