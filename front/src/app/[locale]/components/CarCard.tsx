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
import { formatEngine } from "@/lib/utils/catalog-utils";

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
  const { formatPrice, formatDeposit } = useCurrency();

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

  // Link to car details page (for image and name)
  const carDetailsLink = `/cars/${carIdSlug}`;

  // Link to booking page with dates (for button when dates are selected)
  const bookingLink = useMemo(() => {
    const params = new URLSearchParams();
    if (startDate) params.set("startDate", startDate.toISOString());
    if (endDate) params.set("endDate", endDate.toISOString());
    if (selectedPlan?.id) params.set("planId", String(selectedPlan.id));

    const query = params.toString();
    return `/cars/${carIdSlug}/rent${query ? `?${query}` : ""}`;
  }, [carIdSlug, endDate, selectedPlan?.id, startDate]);

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
      <Link href={carDetailsLink} className="car-card__image">
        <img
          width="450"
          height="252"
          src={`${BASE_URL}static/${encodeURI(car.previewUrl ?? "")}`}
          alt={tCatalog("imageAlt", { brand: car.brand ?? "", model: car.model ?? "" })}
        />
      </Link>

      <div className="car-card__box">
        <div className="car-card__top">
          <Link href={carDetailsLink} className="car-card__name">
            {car.brand} {car.model}
          </Link>
          <div className="car-card__badges">
            {car.isAvailable ? (
              <span className="car-card__badge car-card__badge--available">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.66682 1.30371C4.66682 0.960067 4.9653 0.681488 5.3335 0.681488C5.70168 0.681488 6.00016 0.960067 6.00016 1.30371V1.92593H10.0002V1.30371C10.0002 0.960067 10.2986 0.681488 10.6668 0.681488C11.035 0.681488 11.3335 0.960067 11.3335 1.30371V1.92593H12.6668C13.7714 1.92593 14.6668 2.76166 14.6668 3.7926V12.5037C14.6668 13.5346 13.7714 14.3704 12.6668 14.3704H3.3335C2.22892 14.3704 1.3335 13.5346 1.3335 12.5037V3.7926C1.3335 2.76166 2.22892 1.92593 3.3335 1.92593H4.66682V1.30371Z" fill="#0EA548"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3332 5.84124C11.5937 6.08411 11.5938 6.47807 11.3336 6.72119L7.80481 10.2026C7.6798 10.3194 7.5102 10.3851 7.33334 10.3851C7.15647 10.3851 6.98683 10.3196 6.86177 10.2029L4.86177 8.33619C4.60142 8.0932 4.60142 7.69923 4.86177 7.45624C5.12211 7.21325 5.54423 7.21325 5.80458 7.45624L7.33294 8.88271L10.3904 5.84168C10.6506 5.59856 11.0727 5.59836 11.3332 5.84124Z" fill="white"/>
                </svg>
                {tCatalog("badges.available")}
              </span>
            ) : (
              <span className="car-card__badge car-card__badge--contact">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.66682 1.30371C4.66682 0.960067 4.9653 0.681488 5.3335 0.681488C5.70168 0.681488 6.00016 0.960067 6.00016 1.30371V1.92593H10.0002V1.30371C10.0002 0.960067 10.2986 0.681488 10.6668 0.681488C11.035 0.681488 11.3335 0.960067 11.3335 1.30371V1.92593H12.6668C13.7714 1.92593 14.6668 2.76166 14.6668 3.7926V12.5037C14.6668 13.5346 13.7714 14.3704 12.6668 14.3704H3.3335C2.22892 14.3704 1.3335 13.5346 1.3335 12.5037V3.7926C1.3335 2.76166 2.22892 1.92593 3.3335 1.92593H4.66682V1.30371Z" fill="#6B6B6B"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3332 5.84124C11.5937 6.08411 11.5938 6.47807 11.3336 6.72119L7.80481 10.2026C7.6798 10.3194 7.5102 10.3851 7.33334 10.3851C7.15647 10.3851 6.98683 10.3196 6.86177 10.2029L4.86177 8.33619C4.60142 8.0932 4.60142 7.69923 4.86177 7.45624C5.12211 7.21325 5.54423 7.21325 5.80458 7.45624L7.33294 8.88271L10.3904 5.84168C10.6506 5.59856 11.0727 5.59836 11.3332 5.84124Z" fill="white"/>
                </svg>
                {tCatalog("badges.contact")}
              </span>
            )}
            {car.isNew && (
              <span className="car-card__badge car-card__badge--new">NEW</span>
            )}
          </div>
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
                  <span className="text-strong">{formatPrice(adjustedPrice)}</span>
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
            <span className="car-card__value">
              {formatEngine(car.engineVolume, car.engineType, locale)}
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
              {car.driveType?.[locale]}{tCatalog("features.driveMobileSuffix")}
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
                  <span className="text-strong">{formatPrice(dailyPrice)}</span>
                </span>
              </li>
              <li className="car-card__item">
                <span className="car-card__text">
                  {tCatalog("total.depositLabel")}
                </span>
                <span className="car-card__value">
                  <span className="text-strong">{formatDeposit(depositAmount)}</span>
                </span>
              </li>
              <li className="car-card__item" style={{borderBottom: 'none'}}>
                <span className="car-card__text">
                  {tCatalog("total.totalLabel")}
                </span>
                <span className="car-card__value">
                  <span className="text-strong">{formatPrice(rentalCost)}</span>
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
              {formatDeposit(depositAmount)}
            </span>
          </div>
        )}
        <Link href={hasDates ? bookingLink : carDetailsLink} className="main-button">
          {hasDates ? tCatalog("actions.book") : tCatalog("actions.details")}
        </Link>
      </div>
    </li>
  );
}
