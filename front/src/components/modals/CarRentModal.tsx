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
import TelInput from "@/components/TelInput";
import type { CarCountingRule } from "@/types/cars";
import { BASE_URL } from "@/config/environment";
import { useCurrency } from "@/context/CurrencyContext";
import { submitBookingRequest } from "@/lib/api/feedback";
import UiImage from "@/components/ui/UiImage";

const formatFull = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

const formatTime = (d: Date) => {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

type ExtraDefinition = {
  id: "additionalDriver" | "childSeat" | "borderCrossing" | "driverService";
  price: number;
  pricing: "perDay" | "perRental";
};

const EXTRA_DEFINITIONS = [
  { id: "additionalDriver", price: 6, pricing: "perDay" },
  { id: "childSeat", price: 3, pricing: "perDay" },
  { id: "borderCrossing", price: 150, pricing: "perRental" },
  { id: "driverService", price: 80, pricing: "perDay" },
] as const satisfies ExtraDefinition[];

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
  consent: boolean;
};

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
  const { formatPrice, formatDeposit } = useCurrency();
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
    const diffTime =
      Math.abs(
        selectedDate.endDate.getTime() - selectedDate.startDate.getTime(),
      ) -
      3600 * 1000;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
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
  const dailyPriceBeforeDiscount = baseDailyPrice * (1 + pricePercent / 100);
  const discountPercent = data.car.discount ?? 0;
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
        // Calculate detailed pricing breakdown
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
            baseRentalCost: baseRentalCost,
            insuranceCost: insuranceCost,
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
      baseDailyPrice,
      dailyPrice,
      pricePercent,
      extrasTotal,
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
      className={`rent-modal modal slide-step-${step} ${!isClosing ? "active" : ""}`}
      style={
        !isClosing
          ? { opacity: 1, display: "flex", transition: "200ms" }
          : { opacity: "0", display: "flex", transition: "300ms" }
      }
      data-popup="rent"
    >
      <button className="close modal__close" onClick={close} aria-label="Close">
        <svg width="24" height="24">
          <use href="/img/sprite/sprite.svg#close"></use>
        </svg>
      </button>

      <div className="modal__box car-rental-modal-box">
        <span className="modal-step__title">{t("title")}</span>
        <form className="modal__content" onSubmit={handleSubmit}>
          <div className="order-form">
            <LocationSelect
              placeholder={t("personal.pickupPlaceholder")}
              containerClassName={clsx("order", {
                "custom-select--error": invalidFields.has("pickupLocation"),
              })}
              value={formState.pickupLocation}
              onChange={handleSelectChange("pickupLocation")}
              containerRef={setFieldRef("pickupLocation")}
              locale={locale}
              locationType="pickup"
            />
            <LocationSelect
              placeholder={t("personal.returnPlaceholder")}
              containerClassName={clsx("order", {
                "custom-select--error": invalidFields.has("returnLocation"),
              })}
              value={formState.returnLocation}
              onChange={handleSelectChange("returnLocation")}
              containerRef={setFieldRef("returnLocation")}
              locale={locale}
              locationType="return"
            />
            <label className="order-form__label" onClick={handleSelectDates}>
              <span className="order-form__icon">
                <svg width="21" height="21">
                  <use href="/img/sprite/sprite.svg#car"></use>
                </svg>
              </span>
              <input
                type="text"
                name="date"
                id="date"
                readOnly
                value={renderRangeLabel()}
              />

              <div className="arrow-down">
                <svg width="6" height="3">
                  <use href="/img/sprite/sprite.svg#arrow-d"></use>
                </svg>
              </div>
            </label>

            <button
              className="main-button"
              type="button"
              onClick={handleNextStep}
            >
              {t("orderForm.submit")}
            </button>
          </div>

          <div className="modal__steps">
            <div className="modal__step" data-step="1">
              <div className="modal-step">
                <div className="modal-step__top">
                  <span className="modal-step__title">{t("steps.title")}</span>
                  <div>
                    <button
                      type={"button"}
                      className={"modal-step__back"}
                      onClick={close}
                    >
                      {t("steps.back")}
                    </button>

                    <span className="modal-step__info">
                      {t("steps.indicator", { current: 1, total: 2 })}
                    </span>
                  </div>
                </div>

                <div className="main-form">
                  <div className="main-form__wrapp mode">
                    <span className="main-form__text">
                      {t("personal.title")}
                    </span>

                    <label
                      className="main-form__label"
                      ref={setFieldRef("firstName")}
                    >
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        placeholder={t("personal.firstName")}
                        className={clsx("main-form__input", {
                          "main-form__input--error":
                            invalidFields.has("firstName"),
                        })}
                        value={formState.firstName}
                        onChange={handleInputChange("firstName")}
                        required
                      />
                      <i></i>
                    </label>
                    <label
                      className="main-form__label"
                      ref={setFieldRef("lastName")}
                    >
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        placeholder={t("personal.lastName")}
                        className={clsx("main-form__input", {
                          "main-form__input--error":
                            invalidFields.has("lastName"),
                        })}
                        value={formState.lastName}
                        onChange={handleInputChange("lastName")}
                        required
                      />
                      <i></i>
                    </label>
                    <label
                      className="main-form__label tel"
                      ref={setFieldRef("phone")}
                    >
                      <TelInput
                        key={formResetKey}
                        // @ts-expect-error
                        onChange={handlePhoneChange}
                        name="step_phone"
                        id="step_phone"
                        required
                        placeholder={t("personal.phonePlaceholder")}
                        className={clsx({
                          "main-form__tel-input--error":
                            invalidFields.has("phone"),
                        })}
                        defaultValue={formState.phone}
                      />
                      <i></i>
                    </label>
                    <label
                      className="main-form__label"
                      ref={setFieldRef("email")}
                    >
                      <input
                        type="email"
                        name="step_mail"
                        id="step_mail"
                        placeholder={t("personal.email")}
                        className={clsx("main-form__input", {
                          "main-form__input--error": invalidFields.has("email"),
                        })}
                        value={formState.email}
                        onChange={handleInputChange("email")}
                        required
                      />
                      <i></i>
                    </label>
                  </div>

                  <div className="main-form__wrapp">
                    <span className="main-form__text">
                      {t("personal.datesLabel")}
                    </span>
                    <label
                      className="main-form__label calendar"
                      onClick={handleSelectDates}
                    >
                      <input type="text" value={renderRangeLabel()} readOnly />
                      <span className="selectedDays">
                        {t("personal.selectedDays", { count: totalDays })}
                      </span>
                    </label>

                    <LocationSelect
                      placeholder={t("personal.pickupPlaceholder")}
                      containerClassName={clsx("rent", {
                        "custom-select--error":
                          invalidFields.has("pickupLocation"),
                      })}
                      value={formState.pickupLocation}
                      onChange={handleSelectChange("pickupLocation")}
                      containerRef={setFieldRef("pickupLocation")}
                      locale={locale}
                      locationType="pickup"
                    />

                    <LocationSelect
                      placeholder={t("personal.returnPlaceholder")}
                      containerClassName={clsx("rent", {
                        "custom-select--error":
                          invalidFields.has("returnLocation"),
                      })}
                      value={formState.returnLocation}
                      onChange={handleSelectChange("returnLocation")}
                      containerRef={setFieldRef("returnLocation")}
                      locale={locale}
                      locationType="return"
                    />

                    <label className="main-form__label number">
                      <input
                        type="text"
                        name="number"
                        id="number"
                        placeholder={t("personal.flightNumber")}
                        className="main-form__input"
                        value={formState.flightNumber}
                        onChange={handleInputChange("flightNumber")}
                      />
                      <span>{t("personal.flightOptional")}</span>
                    </label>
                    <button
                      className="main-button main-button--black"
                      type={"button"}
                      onClick={handleNextStep}
                    >
                      {t("steps.next")}
                    </button>
                  </div>
                </div>
                {formError && step === 1 && (
                  <p className="form-error" role="alert">
                    {formError}
                  </p>
                )}
              </div>
            </div>
            <div className="modal__step" data-step="2">
              <div className="modal-step">
                <div className="modal-step__top">
                  <span className="modal-step__title">{t("steps.title")}</span>
                  <div>
                    <button
                      type={"button"}
                      className={"modal-step__back"}
                      onClick={() => setStep(1)}
                    >
                      {t("steps.back")}
                    </button>
                    <span className="modal-step__info">
                      {t("steps.indicator", { current: 2, total: 2 })}
                    </span>
                  </div>
                </div>

                <div className="main-form">
                  <div className="main-form__wrapp fields inchurance mob">
                    <span className="main-form__text">
                      {t("insurance.title")}
                    </span>

                    {data.car.carCountingRule.map((plan) => {
                      const planDailyBeforeDiscount =
                        baseDailyPrice * (1 + plan.pricePercent / 100);
                      const planDaily = Math.round(planDailyBeforeDiscount * (1 - discountPercent / 100));
                      return (
                        <label
                          className="custom-checkbox inchurance"
                          key={plan.id}
                        >
                          <input
                            type="radio"
                            className="custom-checkbox__field"
                            checked={selectedPlan?.id === plan.id}
                            onChange={() => setSelectedPlanId(plan.id)}
                          />
                          <span className="custom-checkbox__content">
                            {plan.depositPercent === 0
                              ? t("insurance.packages.withDeposit")
                              : t("insurance.packages.coverage", {
                                  percent: plan.depositPercent,
                                })}
                            <span>
                              {plan.depositPercent === 0
                                ? t("insurance.included")
                                : t("insurance.depositReduction", {
                                    percent: plan.depositPercent,
                                  })}
                              <i>
                                {plan.pricePercent === 0
                                  ? t("insurance.included")
                                  : t("insurance.pricePerDay", {
                                      formattedPrice: formatPrice(planDaily),
                                    })}
                              </i>
                            </span>
                          </span>
                        </label>
                      );
                    })}
                  </div>

                  <div className="main-form__wrapp check">
                    <span className="main-form__text">
                      {t("insurance.infoTitle")}
                      <div
                        style={{ cursor: "pointer" }}
                        className="single-form__label"
                        data-tooltip-id="insurance-tooltip"
                      >
                        i
                      </div>

                      <Tooltip
                        id="insurance-tooltip"
                        place={"bottom"}
                        variant={"light"}
                        opacity={1}
                        border={"1px solid #D6D6D6"}
                        style={{ zIndex: 999, borderRadius: "16px" }}
                      >
                        <div
                          // biome-ignore lint/security/noDangerouslySetInnerHtml: <2>
                          dangerouslySetInnerHTML={{
                            __html: tAside("tooltips.deposit"),
                          }}
                        />
                      </Tooltip>
                    </span>

                    {data.car.carCountingRule.map((plan) => (
                      <label className="radio-checkbox mode" key={plan.id}>
                        <input
                          type="radio"
                          name="insurance"
                          value={plan.id}
                          checked={selectedPlan?.id === plan.id}
                          className="radio-checkbox__field"
                          onChange={() => setSelectedPlanId(plan.id)}
                        />
                        <span className="radio-checkbox__content">
                          {plan.depositPercent === 0
                            ? t("insurance.packages.withDeposit")
                            : t("insurance.packages.coverage", {
                                percent: plan.depositPercent,
                              })}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="main-form__wrapp fields mob">
                    <span className="main-form__text">{t("addOns.title")}</span>

                    {EXTRA_DEFINITIONS.map((extra) => (
                      <label className="custom-checkbox offer" key={extra.id}>
                        <input
                          type="checkbox"
                          className="custom-checkbox__field"
                          checked={selectedExtras.has(extra.id)}
                          onChange={() => toggleExtra(extra.id)}
                        />
                        <span className="custom-checkbox__content">
                          <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            {t(`addOns.options.${extra.id}.label`)}
                            {extra.id === "driverService" && (
                              <span
                                data-tooltip-id="driver-service-tooltip-modal"
                                style={{
                                  cursor: "pointer",
                                  width: "18px",
                                  height: "18px",
                                  fontSize: "11px",
                                  fontWeight: 600,
                                  border: "1px solid currentColor",
                                  borderRadius: "50%",
                                  display: "inline-flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                                onClick={(e) => e.preventDefault()}
                              >
                                i
                              </span>
                            )}
                          </span>
                          <span className="text-strong">
                            {t(`addOns.options.${extra.id}.price`, {
                              formattedPrice: formatPrice(extra.price),
                            })}
                          </span>
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="main-form__wrapp fields">
                    <span className="main-form__text">
                      {t("comment.title")}
                    </span>

                    <label className="main-form__label">
                      <input
                        type="text"
                        name="step_mess"
                        id="step_mess"
                        placeholder={t("comment.placeholder")}
                        className="main-form__input"
                        value={formState.comment}
                        onChange={handleInputChange("comment")}
                      />
                    </label>
                  </div>

                  <label className="custom-checkbox">
                    <input
                      type="checkbox"
                      className="custom-checkbox__field"
                      checked={formState.consent}
                      onChange={handleInputChange("consent")}
                    />
                    <span className="custom-checkbox__content">
                      {t("agreement")}
                    </span>
                  </label>

                  {formError && step === 2 && (
                    <p className="form-error" role="alert">
                      {formError}
                    </p>
                  )}

                  {feedback && (
                    <p
                      className={`form-${feedback === "success" ? "success" : "error"}`}
                      role="status"
                    >
                      {feedback === "success"
                        ? t("notifications.success")
                        : t("notifications.error")}
                    </p>
                  )}

                  <button
                    className="main-button main-button--black"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? `${t("steps.submit")}...`
                      : t("steps.submit")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>

        <div className="modal__right">
          <div className="modal__image">
            <UiImage
              width={570}
              height={319}
              src={`${BASE_URL}static/${encodeURI(data.car.previewUrl ?? "")}`}
              alt={t("summary.imageAlt", {
                car: carName || t("summary.locationPlaceholder"),
              })}
              sizePreset="card"
            />
          </div>

          <h2 className="modal__title">
            {t("summary.title", { car: carName })}
          </h2>

          <ul className="modal__list">
            <li className="modal__item mode">
              <div className="modal__item-info">
                <span className="modal__name">{t("summary.pickupLabel")}</span>
                <span className="modal__info">
                  <span className="text-strong">
                    {formatFull(selectedDate.startDate)} (
                    {formatTime(selectedDate.startDate)})
                  </span>{" "}
                  {formState.pickupLocation || t("summary.locationPlaceholder")}
                </span>
              </div>
              <div className="modal__item-info">
                <span className="modal__name">{t("summary.returnLabel")}</span>
                <span className="modal__info">
                  <span className="text-strong">
                    {formatFull(selectedDate.endDate)} (
                    {formatTime(selectedDate.endDate)})
                  </span>{" "}
                  {formState.returnLocation || t("summary.locationPlaceholder")}
                </span>
              </div>
            </li>

            <li className="modal__item mode">
              <div className="modal__item-wrapp">
                <span className="modal__name">
                  {t("summary.durationLabel")}
                </span>
                <span className="modal__value">
                  {t("summary.durationValue", { count: totalDays })}
                </span>
              </div>
              <div className="modal__item-wrapp">
                <span className="modal__name">{t("summary.rateLabel")}</span>
                <span className="modal__value">
                  {hasDiscount && (
                    <span className="text-strikethrough">
                      {formatPrice(dailyPriceBeforeDiscount)}
                    </span>
                  )}
                  {formatPrice(dailyPrice)}/day
                </span>
              </div>
              {Array.from(selectedExtras).map((id) => {
                const extra = EXTRA_DEFINITIONS.find((item) => item.id === id);
                if (!extra) return null;

                const isPerDay = extra.pricing === "perDay";
                const priceText = t(`addOns.options.${id}.price`, {
                  formattedPrice: formatPrice(extra.price),
                });

                return (
                  <div className="modal__item-wrapp" key={id}>
                    <span className="modal__name">
                      {t(`addOns.options.${id}.label`)}
                    </span>
                    <span className="modal__value">
                      {priceText}
                      {isPerDay && totalDays > 0
                        ? ` × ${totalDays} = ${formatPrice(extra.price * totalDays)}`
                        : ""}
                    </span>
                  </div>
                );
              })}
            </li>
            <li className="modal__item">
              <span className="modal__name">{t("summary.depositLabel")}</span>
              <span className="modal__value">
                <span className="text-strong">{formatDeposit(depositAmount)}</span>
              </span>
            </li>
            <li className="modal__item">
              <span className="modal__name">{t("summary.totalLabel")}</span>
              <span className="modal__value big">
                {formatPrice(totalCost)}
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Driver service tooltip rendered via portal */}
      {isMounted &&
        createPortal(
          <Tooltip
            id="driver-service-tooltip-modal"
            place="top"
            positionStrategy="fixed"
            variant="light"
            opacity={1}
            border="1px solid #D6D6D6"
            style={{ zIndex: 9999, borderRadius: "16px", maxWidth: "300px" }}
          >
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: tooltip content
              dangerouslySetInnerHTML={{
                __html: t.raw("addOns.options.driverService.tooltip"),
              }}
            />
          </Tooltip>,
          document.body
        )}
    </div>
  );
}
