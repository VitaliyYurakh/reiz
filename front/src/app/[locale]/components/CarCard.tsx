"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  useRentalSearch,
  type CoverageOption,
} from "@/context/RentalSearchContext";
import { useCurrency } from "@/context/CurrencyContext";
import { BASE_URL } from "@/config/environment";
import type { Car, CarCountingRule, RentalTariff } from "@/types/cars";
import { Link } from "@/i18n/request";
import { createCarIdSlug } from "@/lib/utils/carSlug";

type CarCardProps = {
  car: Car;
};

const COVERAGE_PLAN_INDEX: Record<CoverageOption, number> = {
  deposit: 0,
  coverage50: 1,
  coverage100: 2,
};

const findActiveTariff = (
  tariffs: RentalTariff[],
  totalDays: number,
): RentalTariff | undefined => {
  if (tariffs.length === 0) return undefined;
  if (totalDays <= 0) return tariffs[0];
  const matched = tariffs.find(
    (tariff) =>
      totalDays >= tariff.minDays &&
      (tariff.maxDays === 0 || totalDays <= tariff.maxDays),
  );
  return matched ?? tariffs[tariffs.length - 1];
};

const selectPlan = (plans: CarCountingRule[], coverageKey: CoverageOption) => {
  const index = COVERAGE_PLAN_INDEX[coverageKey] ?? 0;
  return plans[index] ?? plans[0];
};

export default function CarCard({ car }: CarCardProps) {
  const locale = useLocale();
  const tCatalog = useTranslations("homePage.catalog_aside.catalog_list");
  const { coverageOption, setCoverageOption, startDate, endDate, totalDays } =
    useRentalSearch();
  const { formatPrice } = useCurrency();

  const hasDates = Boolean(startDate && endDate && totalDays > 0);

  const sortedTariffs = useMemo(() => {
    return [...car.rentalTariff].sort((a, b) => a.minDays - b.minDays);
  }, [car.rentalTariff]);

  const activeTariff = useMemo(
    () => findActiveTariff(sortedTariffs, totalDays),
    [sortedTariffs, totalDays],
  );

  const selectedPlan = useMemo(
    () => selectPlan(car.carCountingRule, coverageOption),
    [car.carCountingRule, coverageOption],
  );

  const baseTariff = sortedTariffs[0];
  const activeTariffForCalc = hasDates
      ? activeTariff ?? baseTariff
      : baseTariff;

  const baseDailyPrice = activeTariffForCalc.dailyPrice ?? 0;
  const baseDeposit = activeTariffForCalc.deposit ?? 0;

  const pricePercent = selectedPlan?.pricePercent ?? 0;
  const depositPercent = selectedPlan?.depositPercent ?? 0;

  const dailyPrice = baseDailyPrice * (1 + pricePercent / 100);
  const depositAmount = baseDeposit * (1 - depositPercent / 100);
  const rentalCost = hasDates ? dailyPrice * totalDays : 0;

  const carIdSlug = useMemo(() => createCarIdSlug(car), [car]);

  const rentLink = useMemo(() => {
    if (!hasDates) {
      return `/cars/${carIdSlug}`;
    }

    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());
    if (selectedPlan?.id) params.set("planId", String(selectedPlan.id));

    const query = params.toString();
    return `/cars/${carIdSlug}/rent${query ? `?${query}` : ""}`;
  }, [carIdSlug, endDate, hasDates, selectedPlan?.id, startDate]);

  const coverageOptions: {
    key: CoverageOption;
    label: string;
    disabled: boolean;
  }[] = [
    {
      key: "deposit",
      label: tCatalog("badges.withDeposit"),
      disabled: !car.carCountingRule[0],
    },
    {
      key: "coverage50",
      label: tCatalog("badges.coverage50"),
      disabled: !car.carCountingRule[1],
    },
    {
      key: "coverage100",
      label: tCatalog("badges.coverage100"),
      disabled: !car.carCountingRule[2],
    },
  ];

  const rangeLabelKeys = [
    "rates.range1",
    "rates.range2",
    "rates.range3",
    "rates.range4",
  ] as const;

  return (
    <li className="car-card">
      <Link href={rentLink} className="car-card__image">
        <picture>
          <source type="image/webp" />
          <img
            width="450"
            height="252"
            src={`${BASE_URL}static/${car.previewUrl ?? ""}`}
            alt={`${car.brand ?? ""} ${car.model ?? ""}`.trim()}
          />
        </picture>
      </Link>

      <div className="car-card__box">
        <div className="car-card__top">
          <Link href={rentLink} className="car-card__name">
            {car.brand} {car.model}
          </Link>
          {car.isNew && <span className="car-card__label">NEW</span>}
        </div>

        <div className="car-card__labels">
          {coverageOptions.map(({ key, label, disabled }) => (
            <span
              key={key}
              className={
                [
                  coverageOption === key ? "active" : "",
                  disabled ? "disabled" : "",
                ]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              role={disabled ? undefined : "button"}
              tabIndex={disabled ? -1 : 0}
              onClick={() => {
                if (!disabled) setCoverageOption(key);
              }}
              onKeyDown={(event) => {
                if (disabled) return;
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setCoverageOption(key);
                }
              }}
              aria-pressed={disabled ? undefined : coverageOption === key}
              aria-disabled={disabled ? true : undefined}
            >
              {label}
            </span>
          ))}
        </div>

        {hasDates ? null : (
          <ul className="car-card__list">
            {sortedTariffs.map((tariff, index) => {
              const adjustedPrice = tariff.dailyPrice * (1 + (selectedPlan?.pricePercent ?? 0) / 100);

              return (
              <li key={tariff.id ?? index} className="car-card__item">
                <span className="car-card__text">
                  {tCatalog(
                      rangeLabelKeys[Math.min(index, rangeLabelKeys.length - 1)],
                  )}
                </span>
                <span className="car-card__value">
                  <b>{formatPrice(adjustedPrice)}</b>
                  <i>/</i>
                  {tCatalog("rates.perDay")}
                </span>
              </li>
            )}
            )}
          </ul>
        )}

        <ul className="car-card__info">
          <li className="car-card__item">
            <i className="sprite">
              <svg width="26" height="26">
                <use href="/img/sprite/sprite.svg#icon1"></use>
              </svg>
            </i>
            <span className="car-card__text">
              {tCatalog("features.engine")}
            </span>
            <span className="car-card__value desktop">{car.engineVolume}</span>
            <span className="car-card__value mob">
              {car.engineVolume} {car.engineType?.[locale]}
            </span>
          </li>
          <li className="car-card__item">
            <i className="sprite">
              <svg width="26" height="26">
                <use href="/img/sprite/sprite.svg#icon2"></use>
              </svg>
            </i>
            <span className="car-card__text">
              {tCatalog("features.transmission")}
            </span>

            <span className="car-card__value desktop">
              {car.transmission?.[locale]}
            </span>
            <span className="car-card__value mob">
              {car.transmission?.[locale]}
            </span>
          </li>
          <li className="car-card__item">
            <i className="sprite">
              <svg width="26" height="26">
                <use href="/img/sprite/sprite.svg#icon3"></use>
              </svg>
            </i>
            <span className="car-card__text">{tCatalog("features.drive")}</span>
            <span className="car-card__value desktop">
              {car.driveType?.[locale]}
            </span>
            <span className="car-card__value mob">
              {car.driveType?.[locale]}
            </span>
          </li>
          <li className="car-card__item">
            <i className="sprite">
              <svg width="26" height="26">
                <use href="/img/sprite/sprite.svg#icon4"></use>
              </svg>
            </i>
            <span className="car-card__text">
              {tCatalog("features.seatsLabel")}
            </span>
            <span className="car-card__value">
              {tCatalog("features.seatsValue", {
                count: car.seats?.toString() ?? "0",
              })}
            </span>
          </li>
        </ul>

        {hasDates ? (
          <>
            <ul className="car-card__list">
              <li className="car-card__item">
                <span className="car-card__text">
                  {tCatalog("total.dailyLabel")}
                </span>
                <span className="car-card__value">
                  <b>{formatPrice(dailyPrice)}</b>
                </span>
              </li>
              <li className="car-card__item">
                <span className="car-card__text">
                  {tCatalog("total.depositLabel")}
                </span>
                <span className="car-card__value">
                  <b>{formatPrice(depositAmount)}</b>
                </span>
              </li>
              <li className="car-card__item" style={{borderBottom: 'none'}}>
                <span className="car-card__text">
                  {tCatalog("total.totalLabel")}
                </span>
                <span className="car-card__value">
                  <b>{formatPrice(rentalCost)}</b>
                </span>
              </li>
            </ul>
          </>
        ) : (
          <div className="car-card__total">
            <span className="car-card__text">
              {tCatalog("total.depositLabel")}:
            </span>
            <span className="car-card__value">
              {formatPrice(depositAmount)}
            </span>
          </div>
        )}
        <Link href={rentLink} className="main-button">
          {hasDates ? tCatalog("actions.book") : tCatalog("actions.details")}
        </Link>
      </div>
    </li>
  );
}
