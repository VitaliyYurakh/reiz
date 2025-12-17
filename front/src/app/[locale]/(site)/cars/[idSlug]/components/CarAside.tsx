"use client";

import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Tooltip } from "react-tooltip";
import { useCarModal } from "@/app/[locale]/(site)/cars/[idSlug]/components/modals";
import { Link } from "@/i18n/request";
import type { Car, CarCountingRule } from "@/types/cars";
import { useSideBarModal } from "@/components/modals";
import { createCarIdSlug } from "@/lib/utils/carSlug";

const formatFull = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}`;
};

export default function CarAside({ car }: { car: Car }) {
  const { open } = useCarModal("rent");
  const { open: openDateSelect } = useCarModal("rangeDateTimePicker");
  const { open: openRequestModal } = useSideBarModal("requestCall");
  const { open: openManagerModal } = useSideBarModal(
    "managerWillContactYouModal",
  );
  const t = useTranslations("carAside");
  const router = useRouter();
  const locale = useLocale();

  const [selectedPlanId, setSelectedPlanId] = useState<number>(
    car.carCountingRule[0]?.id || 0,
  );

  const [isMobile, setIsMobile] = useState(false);

  const now = new Date();
  const [selectedDate, setSelectedDate] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(now.setHours(0, 0, 0, 0)),
    endDate: new Date(
      new Date(now.setDate(now.getDate() + 7)).setHours(0, 0, 0, 0),
    ),
  });

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const handleBook = useCallback(() => {
    if (isMobile) {
      const params = new URLSearchParams({
        startDate: selectedDate.startDate.toISOString(),
        endDate: selectedDate.endDate.toISOString(),
        planId: String(selectedPlanId),
      });
      const carIdSlug = createCarIdSlug(car);
      router.push(`/${locale}/cars/${carIdSlug}/rent?${params.toString()}`);
      return;
    }

    open(
      {
        selectedPlanId,
        car,
        startDate: selectedDate.startDate,
        endDate: selectedDate.endDate,
      },
      (result) => {
        setTimeout(() => {
          openManagerModal({
            type: "car_request",
            car: result.car,
            startDate: result.startDate,
            endDate: result.endDate,
            showCloseButton: true,
          });
        }, 500);
      },
    );
  }, [
    car,
    isMobile,
    locale,
    open,
    router,
    selectedDate.endDate,
    selectedDate.startDate,
    selectedPlanId,
  ]);

  const selectedPlan: CarCountingRule = useMemo(() => {
    if (selectedPlanId === null) return car.carCountingRule[0];
    return (
      car.carCountingRule.find((plan) => plan.id === selectedPlanId) ||
      car.carCountingRule[0]
    );
  }, [car.carCountingRule, selectedPlanId]);

  const totalDays = useMemo(() => {
    if (!selectedDate.startDate || !selectedDate.endDate) return 0;
    const diffTime =
      Math.abs(
        selectedDate.endDate.getTime() - selectedDate.startDate.getTime(),
      ) -
      3600 * 1000; // 1 hour included
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [selectedDate.startDate, selectedDate.endDate]);

  const tariff = car.rentalTariff.find(
    (tItem) =>
      totalDays >= tItem.minDays &&
      (totalDays <= tItem.maxDays || tItem.maxDays === 0),
  );

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

  const dailyPrice = activeTariff!.dailyPrice * (1 + pricePercent / 100);
  const depositAmount =
    (activeTariff?.deposit ?? 0) * (1 - depositPercent / 100);
  // const totalPrice = dailyPrice * totalDays + depositAmount;
  const totalPrice = dailyPrice * totalDays;
  const clubPrice = totalPrice * 0.9;

  const formatTariffRange = (minDays: number, maxDays: number) => {
    if (minDays === maxDays) {
      return t("tariffs.exact", { count: minDays });
    }
    if (maxDays === 0) {
      return t("tariffs.more", { count: minDays });
    }
    return t("tariffs.range", { min: minDays, max: maxDays });
  };

  return (
    <form
      className="single-form"
      data-aos="fade-left"
      data-aos-duration="900"
      data-aos-delay="500"
    >
      <div className="single-form__top">
        <span className="single-form__title">
          {t("rentalPeriodTitle", {
            brand: car.brand || "",
            model: car.model || "",
            year: car.yearOfManufacture || "",
          })}
        </span>

        <label
          className="single-form__label"
          onClick={() =>
            openDateSelect(selectedDate, (res) => {
              setSelectedDate({
                startDate: res.startDate,
                endDate: res.endDate,
              });
            })
          }
        >
          <input
            type="text"
            value={`${formatFull(selectedDate.startDate)} ${t("rangeSeparator")} ${formatFull(selectedDate.endDate)}`}
            readOnly={true}
          />
          <span className="selectedDays">
            {t("selectedDays", { count: totalDays })}
          </span>
        </label>

        <span className="single-form__title">{t("rentalCostTitle")}</span>
      </div>

      <div className="single-form__wrapp">
        <div className="single-form__fields">
          {car.carCountingRule.map((el) => (
            <label className="radio-checkbox mode" key={el.id}>
              <input
                type="radio"
                name="type"
                checked={selectedPlan.depositPercent === el.depositPercent}
                onChange={() => setSelectedPlanId(el.id)}
                value={el.depositPercent}
                className="radio-checkbox__field"
              />
              <span className="radio-checkbox__content">
                {el.depositPercent === 0
                  ? t("plans.withDeposit")
                  : t("plans.coverage", { percent: el.depositPercent })}
              </span>
            </label>
          ))}
        </div>

        <ul className="single-form__list">
          {car.rentalTariff.map((el) => (
            <li className="single-form__item" key={el.id}>
              <span className="single-form__value">
                {formatTariffRange(el.minDays, el.maxDays)}
              </span>
              <span className="single-form__value mode">
                {t("tariffs.pricePerDay", {
                  price: (
                    el.dailyPrice *
                    (1 + (selectedPlan?.pricePercent || 0) / 100)
                  ).toFixed(0),
                })}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="single-form__info">
        <span className="single-form__name">
          {t("depositLabel")}
          <div
            style={{ cursor: "pointer" }}
            className="single-form__label"
            data-tooltip-id="deposit-tooltip"
          >
            i
          </div>
        </span>
        <span className="single-form__value">
          {t("currency", { value: depositAmount.toFixed(0) })}
        </span>
      </div>
      <div className="single-form__info">
        <span className="single-form__name">
          {t("totalPriceLabel", {
            brand: car.brand || "",
            model: car.model || "",
            year: car.yearOfManufacture || "",
          })}
        </span>
        <span className="single-form__value">
          <b>{t("currency", { value: totalPrice.toFixed(0) })}</b>
        </span>
      </div>
      <div className="single-form__info mode">
        <span className="single-form__name">
          {t("clubPriceLabel")}
          <div
            style={{ cursor: "pointer" }}
            className="single-form__label"
            data-tooltip-id="my-tooltip"
          >
            i
          </div>
        </span>
        <span className="single-form__value">
          <b>{t("currency", { value: clubPrice.toFixed(0) })}</b>
        </span>
      </div>

      <div className="single-form__btns">
        <button
          className="main-button"
          data-btn-modal="rent"
          type="button"
          onClick={handleBook}
        >
          {t("actions.book")}
        </button>
        <button
          className="main-button main-button--black"
          type="button"
          onClick={() => {
            openRequestModal({}, (phone: string) => {
              setTimeout(() => {
                openManagerModal({
                  type: "call_request",
                  phone,
                  showCloseButton: true,
                });
              }, 500);
            });
          }}
        >
          {t("actions.requestCall")}
        </button>
      </div>

      <div className="single-form__bottom">
        <span className="single-form__pretitle">
          {t("conditionsTitle", {
            brand: car.brand || "",
            model: car.model || "",
            year: car.yearOfManufacture || "",
          })}
        </span>

        <div className="single-form__row">
          <span className="single-form__quest">
            <b>{t("requirements.age.title")}</b>
            {t("requirements.age.value", {
              age: car.segment[0].driverAge,
            })}
          </span>
          <span className="single-form__quest">
            <b>{t("requirements.experience.title")}</b>
            {t("requirements.experience.value", {
              years: car.segment[0].experience,
            })}
          </span>
          <span className="single-form__quest">
            <b style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {t("requirements.mileage.title", { count: totalDays })}
              <span
                style={{ cursor: "pointer" }}
                className="single-form__label"
                data-tooltip-id="overdrive-tooltip"
              >
                i
              </span>
            </b>
            {t("requirements.mileage.value", { limit: totalDays * 300 })}
          </span>
        </div>

        <div className="single-form__links">
        <Link href="/terms" className="main-button main-button--black">
            {t("links.conditions")}
          </Link>
          <Link href="/faq" className="main-button main-button--black">
            {t("links.faq")}
          </Link>
        </div>
      </div>

      <Tooltip
        id="my-tooltip"
        variant={"light"}
        opacity={1}
        border={"1px solid #D6D6D6"}
        style={{ zIndex: 999, borderRadius: "16px" }}
      >
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: <1> */}
        <div dangerouslySetInnerHTML={{ __html: t("tooltips.club") }} />
      </Tooltip>
      <Tooltip
        id="deposit-tooltip"
        place={"bottom"}
        variant={"light"}
        opacity={1}
        border={"1px solid #D6D6D6"}
        style={{ zIndex: 999, borderRadius: "16px" }}
      >
        {/** biome-ignore lint/security/noDangerouslySetInnerHtml: <2> */}
        <div dangerouslySetInnerHTML={{ __html: t("tooltips.deposit") }} />
      </Tooltip>
      <Tooltip
        id="overdrive-tooltip"
        variant={"light"}
        opacity={1}
        border={"1px solid #D6D6D6"}
        style={{ zIndex: 999, borderRadius: "16px" }}
      >
        <div
          // biome-ignore lint/security/noDangerouslySetInnerHtml: <3>
          dangerouslySetInnerHTML={{
            __html: t("tooltips.overdrive", {
              price: car.segment[0].overmileagePrice,
            }),
          }}
        />
      </Tooltip>
    </form>
  );
}
