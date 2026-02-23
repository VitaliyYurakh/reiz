"use client";

import clsx from "classnames";
import { useTranslations, useLocale } from "next-intl";
import type { Locale } from "@/i18n/request";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useCarModal } from "@/app/[locale]/(site)/cars/[idSlug]/components/modals";
import LocationSelect from "@/app/[locale]/components/LocationSelect";
import { Link } from "@/i18n/request";
import type { Car, CarCountingRule } from "@/types/cars";
import InsuranceCoverage from "@/app/[locale]/(site)/cars/[idSlug]/rent/components/InsuranceCoverage";
import AddOnsSection from "@/app/[locale]/(site)/cars/[idSlug]/rent/components/AddOnsSection";
import PersonalInfoForm from "@/app/[locale]/(site)/cars/[idSlug]/rent/components/PersonalInfoForm";
import PricingSummaryPanel from "@/app/[locale]/(site)/cars/[idSlug]/rent/components/PricingSummaryPanel";
import FormFeedback from "@/app/[locale]/(site)/cars/[idSlug]/rent/components/FormFeedback";
import { useSideBarModal } from "@/components/modals";
import { createCarIdSlug } from "@/lib/utils/carSlug";
import { formatFull } from "@/lib/utils/date-format";
import { useCurrency } from "@/context/CurrencyContext";
import { useRentalSearchOptional } from "@/context/RentalSearchContext";
import { submitBookingRequest } from "@/lib/api/feedback";

type ExtraDefinition = {
  id: "additionalDriver" | "childSeat" | "borderCrossing" | "driverService";
  price: number;
  pricing: "perDay" | "perRental";
};

type ExtraId = (typeof EXTRA_DEFINITIONS)[number]["id"];

type FormState = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  pickupLocation: string;
  returnLocation: string;
  flightNumber: string;
  comment: string;
  consent?: boolean;
};

type RentPageContentProps = {
  car: Car;
  initialPlanId: number;
  initialStartDate: string;
  initialEndDate: string;
};

const EXTRA_DEFINITIONS = [
  { id: "additionalDriver", price: 6, pricing: "perDay" },
  { id: "childSeat", price: 3, pricing: "perDay" },
  { id: "borderCrossing", price: 150, pricing: "perRental" },
  { id: "driverService", price: 80, pricing: "perDay" },
] as const satisfies ExtraDefinition[];

const createExtraMap = () => {
  const map: Record<ExtraId, ExtraDefinition> = {
    additionalDriver: EXTRA_DEFINITIONS[0],
    childSeat: EXTRA_DEFINITIONS[1],
    borderCrossing: EXTRA_DEFINITIONS[2],
    driverService: EXTRA_DEFINITIONS[3],
  };
  return map;
};

const EXTRAS_BY_ID = createExtraMap();

const DEFAULT_FORM_STATE: FormState = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  pickupLocation: "",
  returnLocation: "",
  flightNumber: "",
  comment: "",
  consent: false,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const parseISODate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    return now;
  }
  return date;
};

export default function RentPageContent({
  car,
  initialPlanId,
  initialStartDate,
  initialEndDate,
}: RentPageContentProps) {
  const t = useTranslations("carRentPage");
  const { open: openDatePicker } = useCarModal("rangeDateTimePicker");
  const { open: openManagerModal } = useSideBarModal(
    "managerWillContactYouModal",
  );
  const { formatPrice } = useCurrency();
  const locale = useLocale() as Locale;
  const rentalSearchContext = useRentalSearchOptional();
  const contextPickupLocation = rentalSearchContext?.pickupLocation ?? "";
  const contextReturnLocation = rentalSearchContext?.returnLocation ?? "";

  const [formState, setFormState] = useState<FormState>(() => ({
    ...DEFAULT_FORM_STATE,
  }));
  const [selectedPlanId, setSelectedPlanId] = useState<number>(() => {
    if (car.carCountingRule.some((plan) => plan.id === initialPlanId)) {
      return initialPlanId;
    }
    return car.carCountingRule[0]?.id ?? 0;
  });
  const [selectedExtras, setSelectedExtras] = useState<Set<ExtraId>>(
    () => new Set([]),
  );
  const [formResetKey, setFormResetKey] = useState(0);
  const [feedback, setFeedback] = useState<"" | "success" | "error">("");
  const [formError, setFormError] = useState<string | null>(null);
  const [invalidFields, setInvalidFields] = useState<Set<keyof FormState>>(
    new Set(),
  );
  const fieldRefs = useRef<
    Partial<Record<keyof FormState, HTMLElement | null>>
  >({});
  const [selectedDate, setSelectedDate] = useState({
    startDate: parseISODate(initialStartDate),
    endDate: parseISODate(initialEndDate),
  });
  useEffect(() => {
    setSelectedDate({
      startDate: parseISODate(initialStartDate),
      endDate: parseISODate(initialEndDate),
    });
  }, [initialEndDate, initialStartDate]);

  useEffect(() => {
    if (car.carCountingRule.some((plan) => plan.id === initialPlanId)) {
      setSelectedPlanId(initialPlanId);
    }
  }, [car.carCountingRule, initialPlanId]);

  useEffect(() => {
    setFormState({ ...DEFAULT_FORM_STATE });
    setSelectedExtras(new Set());
    setFeedback("");
    setFormError(null);
    setFormResetKey((value) => value + 1);
    setInvalidFields(new Set());
  }, []);

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

  // Initialize form with context locations if available
  useEffect(() => {
    if (contextPickupLocation || contextReturnLocation) {
      setFormState((prev) => ({
        ...prev,
        pickupLocation: contextPickupLocation || prev.pickupLocation,
        returnLocation: contextReturnLocation || prev.returnLocation,
      }));
    }
  }, [contextPickupLocation, contextReturnLocation]);

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
    const diffTime =
      Math.abs(
        selectedDate.endDate.getTime() - selectedDate.startDate.getTime(),
      ) -
      3600 * 1000;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [selectedDate.endDate, selectedDate.startDate]);

  const selectedPlan: CarCountingRule | undefined = useMemo(() => {
    if (selectedPlanId === null) return car.carCountingRule[0];
    return car.carCountingRule.find((plan) => plan.id === selectedPlanId);
  }, [car.carCountingRule, selectedPlanId]);

  const baseDailyPrice = car.rentalTariff[0]?.dailyPrice ?? 0;

  const activeTariff = useMemo(() => {
    if (car.rentalTariff.length === 0) return undefined;
    if (totalDays <= 0) return car.rentalTariff[0];
    return (
      car.rentalTariff.find(
        (tariff) =>
          totalDays >= tariff.minDays &&
          (totalDays <= tariff.maxDays || tariff.maxDays === 0),
      ) ?? car.rentalTariff[car.rentalTariff.length - 1]
    );
  }, [car.rentalTariff, totalDays]);

  const pricePercent = selectedPlan?.pricePercent ?? 0;
  const depositPercent = selectedPlan?.depositPercent ?? 0;

  const dailyPriceBeforeDiscount =
    (activeTariff?.dailyPrice ?? baseDailyPrice) * (1 + pricePercent / 100);
  const discountPercent = car.discount ?? 0;
  const dailyPrice = Math.round(dailyPriceBeforeDiscount * (1 - discountPercent / 100));
  const hasDiscount = discountPercent > 0;

  const depositAmount =
    (activeTariff?.deposit ?? 0) * (1 - depositPercent / 100);

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
  // const totalCost = rentalCost + depositAmount + extrasTotal;

  const carName = useMemo(() => {
    return `${car.brand ?? ""} ${car.model ?? ""} ${car.yearOfManufacture ?? ""}`.trim();
  }, [car.brand, car.model, car.yearOfManufacture]);

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

  const handleSubmit = useCallback(
    async (event: any) => {
      event.preventDefault();
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
      const isEmailInvalid =
        emailValue !== "" && !EMAIL_PATTERN.test(emailValue);
      if (isEmailInvalid) {
        invalid.add("email");
      }
      if (!formState.consent) {
        invalid.add("consent");
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
        return;
      }
      setFormError(null);
      setFeedback("");
      try {
        // Calculate detailed pricing breakdown (same as CarRentModal)
        const baseDailyPrice = activeTariff?.dailyPrice ?? 0;
        const pricePercent = selectedPlan?.pricePercent ?? 0;
        const baseRentalCost = baseDailyPrice * totalDays;
        const insuranceCost = pricePercent > 0 ? (dailyPrice - baseDailyPrice) * totalDays : 0;

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

        // Submit booking request to API (sends to Telegram)
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
          carId: car.id,
          carDetails: {
            brand: car.brand,
            model: car.model,
            year: car.yearOfManufacture,
          },
          selectedPlan: selectedPlan ? {
            id: selectedPlan.id,
            depositPercent: selectedPlan.depositPercent,
            pricePercent: selectedPlan.pricePercent,
          } : null,
          selectedExtras: extrasDetails,
          totalDays: totalDays,
          priceBreakdown: {
            baseRentalCost: baseRentalCost,
            insuranceCost: insuranceCost,
            extrasCost: extrasTotal,
            totalCost: totalCost,
            depositAmount: depositAmount,
          },
        });

        openManagerModal({
          type: "car_request",
          car: car,
          showCloseButton: false,
          startDate: selectedDate.startDate,
          endDate: selectedDate.endDate,
          navigateToHomePage: true,
        });
        setFeedback("success");
      } catch (error) {
        console.error(error);
        setFeedback("error");
      } finally {
        setInvalidFields(new Set());
      }
    },
    [
      formState,
      t,
      car,
      selectedDate,
      selectedPlan,
      selectedExtras,
      totalDays,
      activeTariff,
      dailyPrice,
      extrasTotal,
      totalCost,
      depositAmount,
      openManagerModal,
    ],
  );

  const renderRangeLabel = () => {
    if (!selectedDate.startDate || !selectedDate.endDate)
      return t("orderForm.datePlaceholder");
    return `${formatFull(selectedDate.startDate)} ${t("rangeSeparator")} ${formatFull(selectedDate.endDate)}`;
  };

  return (
    <section className="rent-page">
      <div className="container">
        <div className="rent-page__surface">
          <ul
            className="breadcrumbs"
            data-aos="fade-right"
            data-aos-duration="900"
            data-aos-delay="400"
          >
            <li>
              <Link href="/">{t("breadcrumbs.home")}</Link>
            </li>
            <li>
              <Link href="/#catalog">{t("breadcrumbs.cars")}</Link>
            </li>
            <li>
              <Link href={`/cars/${createCarIdSlug(car)}`}>
                {car.brand} {car.model} {car.yearOfManufacture}
              </Link>
            </li>
            <li>{t("breadcrumbs.booking")}</li>
          </ul>
          <div className="rent-page__main">
            <form className="rent-page__form-card" onSubmit={handleSubmit}>
              <div className="rent-page__search">
                <LocationSelect
                  placeholder={t("personal.pickupPlaceholder")}
                  containerClassName={clsx("rent-page__select", {
                    "custom-select--error": invalidFields.has("pickupLocation"),
                  })}
                  icon={"geo"}
                  value={formState.pickupLocation}
                  onChange={handleSelectChange("pickupLocation")}
                  containerRef={setFieldRef("pickupLocation")}
                  locale={locale}
                  locationType="pickup"
                />
                <LocationSelect
                  placeholder={t("personal.returnPlaceholder")}
                  containerClassName={clsx("rent-page__select", {
                    "custom-select--error": invalidFields.has("returnLocation"),
                  })}
                  icon={"geo"}
                  value={formState.returnLocation}
                  onChange={handleSelectChange("returnLocation")}
                  containerRef={setFieldRef("returnLocation")}
                  locale={locale}
                  locationType="return"
                />
                <label
                  className="rent-page__date-field"
                  onClick={handleSelectDates}
                >
                  <span className="rent-page__date-icon">
                    <svg width="21" height="21">
                      <use href="/img/sprite/sprite.svg#pickup"></use>
                    </svg>
                  </span>
                  <input
                    type="text"
                    name="date"
                    id="date"
                    readOnly
                    value={renderRangeLabel()}
                  />

                  <div className="rent-page__date-arrow">
                    <svg width="6" height="3">
                      <use href="/img/sprite/sprite.svg#arrow-d"></use>
                    </svg>
                  </div>
                </label>
              </div>

              <div className="rent-page__details">
                <div className="rent-page__details-layout">
                  <div className="main-form">
                    <InsuranceCoverage
                      dailyPrice={dailyPrice}
                      dailyPriceBeforeDiscount={dailyPriceBeforeDiscount}
                      totalPrice={rentalCost}
                      depositAmount={depositAmount}
                      carCountingRule={car.carCountingRule}
                      selectedPlanId={selectedPlanId}
                      setSelectedPlanId={setSelectedPlanId}
                      hasDiscount={hasDiscount}
                    />

                    <AddOnsSection
                      extraDefinitions={EXTRA_DEFINITIONS}
                      selectedExtras={selectedExtras}
                      toggleExtra={toggleExtra}
                    />

                    <PersonalInfoForm
                      formState={formState}
                      invalidFields={invalidFields}
                      locale={locale}
                      formResetKey={formResetKey}
                      handleInputChange={handleInputChange}
                      handlePhoneChange={handlePhoneChange}
                      setFieldRef={setFieldRef}
                    />

                    <FormFeedback
                      formError={formError}
                      feedback={feedback}
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          <PricingSummaryPanel
            carName={carName}
            previewUrl={car.previewUrl}
            selectedDate={selectedDate}
            pickupLocation={formState.pickupLocation}
            returnLocation={formState.returnLocation}
            totalDays={totalDays}
            dailyPrice={dailyPrice}
            depositAmount={depositAmount}
            totalCost={totalCost}
            selectedExtras={selectedExtras}
            extraDefinitions={EXTRA_DEFINITIONS}
          />

          <div className="main-order-wrapper">
            <div className="main-order">
              <span className="main-order__text">{t("totalCostLabel")}</span>
              <span className="main-order__value">
                {formatPrice(totalCost)}
              </span>

              <button className="main-button" onClick={handleSubmit}>
                {t("bookButton")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
