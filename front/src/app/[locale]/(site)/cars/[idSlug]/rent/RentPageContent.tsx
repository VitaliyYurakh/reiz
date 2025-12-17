"use client";

import clsx from "classnames";
import { useTranslations } from "next-intl";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useCarModal } from "@/app/[locale]/(site)/cars/[idSlug]/components/modals";
import CustomSelect from "@/app/[locale]/components/CustomSelect";
import TelInput from "@/components/TelInput";
import { Link } from "@/i18n/request";
import type { Car, CarCountingRule } from "@/types/cars";
import InsuranceCoverage from "@/app/[locale]/(site)/cars/[idSlug]/rent/components/InsuranceCoverage";
import { BASE_URL } from "@/config/environment";
import { useSideBarModal } from "@/components/modals";
import { createCarIdSlug } from "@/lib/utils/carSlug";

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

  const locationOptions = useMemo(
    () => (t.raw("locations.options") as string[]) ?? [],
    [t],
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

  const dailyPrice =
    (activeTariff?.dailyPrice ?? baseDailyPrice) * (1 + pricePercent / 100);
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
        await new Promise((resolve) => setTimeout(resolve, 600));
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
    [formState, t],
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
              <Link href="#">{t("breadcrumbs.cars")}</Link>
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
                <CustomSelect
                  placeholder={t("personal.pickupPlaceholder")}
                  options={locationOptions}
                  containerClassName={clsx("rent-page__select", {
                    "custom-select--error": invalidFields.has("pickupLocation"),
                  })}
                  icon={"geo"}
                  value={formState.pickupLocation}
                  onChange={handleSelectChange("pickupLocation")}
                  containerRef={setFieldRef("pickupLocation")}
                />
                <CustomSelect
                  placeholder={t("personal.returnPlaceholder")}
                  options={locationOptions}
                  containerClassName={clsx("rent-page__select", {
                    "custom-select--error": invalidFields.has("returnLocation"),
                  })}
                  icon={"geo"}
                  value={formState.returnLocation}
                  onChange={handleSelectChange("returnLocation")}
                  containerRef={setFieldRef("returnLocation")}
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
                      totalPrice={rentalCost}
                      depositAmount={depositAmount}
                      carCountingRule={car.carCountingRule}
                      selectedPlanId={selectedPlanId}
                      setSelectedPlanId={setSelectedPlanId}
                    />

                    <div className="main-form__wrapp">
                      <span className="main-form__text">
                        {t("addOns.title")}
                      </span>

                      {EXTRA_DEFINITIONS.map((extra) => (
                        <label className="custom-checkbox offer" key={extra.id}>
                          <input
                            type="checkbox"
                            className="custom-checkbox__field"
                            checked={selectedExtras.has(extra.id)}
                            onChange={() => toggleExtra(extra.id)}
                          />
                          <span
                            className="custom-checkbox__content"
                            style={{ borderRadius: "20px" }}
                          >
                            <span>{t(`addOns.options.${extra.id}.label`)}</span>
                            <b>
                              {t(`addOns.options.${extra.id}.price`, {
                                price: Math.round(extra.price),
                              })}
                            </b>
                          </span>
                        </label>
                      ))}
                    </div>

                    <div className="main-form__wrapp">
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
                            "main-form__tel_input--error":
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
                            "main-form__input--error":
                              invalidFields.has("email"),
                          })}
                          value={formState.email}
                          onChange={handleInputChange("email")}
                          required
                        />
                        <i></i>
                      </label>
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
                      <span></span>

                      <label
                        className="custom-checkbox"
                        style={{ marginTop: "-15px" }}
                      >
                        <input
                          type="checkbox"
                          className="custom-checkbox__field"
                          checked={formState.consent}
                          onChange={handleInputChange("consent")}
                        />
                        <span
                          className="custom-checkbox__content"
                          style={{ border: "none" }}
                        >
                          {t("agreement")}
                        </span>
                      </label>
                    </div>

                    {formError && (
                      <p className="rent-page-form__error" role="alert">
                        {formError}
                      </p>
                    )}

                    {feedback && (
                      <p
                        className={clsx("rent-page-form__feedback", {
                          "rent-page-form__feedback--success":
                            feedback === "success",
                          "rent-page-form__feedback--error":
                            feedback === "error",
                        })}
                        role="status"
                      >
                        {feedback === "success"
                          ? t("notifications.success")
                          : t("notifications.error")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="rent-page__summary rent-page__summary-panel">
            <div className="rent-page__summary-image">
              <picture>
                <img
                  width={570}
                  height={319}
                  src={`${BASE_URL}static/${car.previewUrl}`}
                  alt={t("summary.imageAlt", {
                    car: carName || t("summary.locationPlaceholder"),
                  })}
                />
              </picture>
            </div>

            <h2 className="rent-page__summary-title">
              {t("summary.title", { car: carName })}
            </h2>

            <ul className="rent-page__summary-list">
              <li
                className="rent-page__summary-item rent-page__summary-item--mode"
                style={{ gap: "10px" }}
              >
                <div className="rent-page__summary-item-info">
                  <span className="rent-page__summary-name">
                    {t("summary.pickupLabel")}
                  </span>
                  <span className="rent-page__summary-info">
                    <b>
                      {formatFull(selectedDate.startDate)} (
                      {formatTime(selectedDate.startDate)})
                    </b>{" "}
                    {formState.pickupLocation ||
                      t("summary.locationPlaceholder")}
                  </span>
                </div>
                <div className="rent-page__summary-item-info">
                  <span className="rent-page__summary-name">
                    {t("summary.returnLabel")}
                  </span>
                  <span className="rent-page__summary-info">
                    <b>
                      {formatFull(selectedDate.endDate)} (
                      {formatTime(selectedDate.endDate)})
                    </b>{" "}
                    {formState.returnLocation ||
                      t("summary.locationPlaceholder")}
                  </span>
                </div>
              </li>

              <li className="rent-page__summary-item rent-page__summary-item--mode">
                <div className="rent-page__summary-item-wrapper">
                  <span className="rent-page__summary-name">
                    {t("summary.durationLabel")}
                  </span>
                  <span className="rent-page__summary-value">
                    {t("summary.durationValue", { count: totalDays })}
                  </span>
                </div>
                <div className="rent-page__summary-item-wrapper">
                  <span className="rent-page__summary-name">
                    {t("summary.rateLabel")}
                  </span>
                  <span className="rent-page__summary-value">
                    {t("summary.pricePerDay", { price: dailyPrice.toFixed(0) })}
                  </span>
                </div>
                {Array.from(selectedExtras).map((id) => {
                  const extra = EXTRA_DEFINITIONS.find(
                    (item) => item.id === id,
                  );
                  if (!extra) return null;

                  const isPerDay = extra.pricing === "perDay";
                  const priceText = t(`addOns.options.${id}.price`, {
                    price: extra.price,
                  });

                  return (
                    <div className="rent-page__summary-item-wrapper" key={id}>
                      <span className="rent-page__summary-name">
                        {t(`addOns.options.${id}.label`)}
                      </span>
                      <span className="rent-page__summary-value">
                        {priceText}
                        {isPerDay && totalDays > 0
                          ? ` × ${totalDays} = ${extra.price * totalDays} USD`
                          : ""}
                      </span>
                    </div>
                  );
                })}
              </li>
              <li className="rent-page__summary-item">
                <span className="rent-page__summary-name">
                  {t("summary.depositLabel")}
                </span>
                <span className="rent-page__summary-value">
                  <b>{t("currency", { value: depositAmount.toFixed(0) })}</b>
                </span>
              </li>
              <li className="rent-page__summary-item">
                <span className="rent-page__summary-name">
                  {t("summary.totalLabel")}
                </span>
                <span className="rent-page__summary-value rent-page__summary-value--big">
                  {t("currency", { value: totalCost.toFixed(0) })}
                </span>
              </li>
            </ul>
          </div>

          <div className="main-order-wrapper">
            <div className="main-order">
              <span className="main-order__text">{t("totalCostLabel")}</span>
              <span className="main-order__value">
                {t("currency", { value: totalCost.toFixed(0) })}
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
