"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import {
  useRentalSearch,
  type CoverageOption,
} from "@/context/RentalSearchContext";
import { useCurrency } from "@/context/CurrencyContext";
import { BASE_URL } from "@/config/environment";
import { type Car, type CarCountingRule, type RentalTariff, localized } from "@/types/cars";
import { Link } from "@/i18n/request";
import { createCarIdSlug } from "@/lib/utils/carSlug";
import { formatEngine } from "@/lib/utils/catalog-utils";
import UiImage from "@/components/ui/UiImage";

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
  const topRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLAnchorElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const badgesFullWidthRef = useRef<number | null>(null);
  const [compactBadges, setCompactBadges] = useState(false);

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

  const dailyPriceBeforeDiscount = baseDailyPrice * (1 + pricePercent / 100);
  const discountPercent = car.discount ?? 0;
  const dailyPrice = Math.round(dailyPriceBeforeDiscount * (1 - discountPercent / 100));
  const hasDiscount = discountPercent > 0;

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

  useLayoutEffect(() => {
    const topEl = topRef.current;
    const nameEl = nameRef.current;
    const badgesEl = badgesRef.current;

    if (!topEl || !nameEl || !badgesEl) return;

    let frameId = 0;

    const measureNameWidth = () => {
      const prevWhiteSpace = nameEl.style.whiteSpace;
      nameEl.style.whiteSpace = "nowrap";
      const width = nameEl.scrollWidth;
      nameEl.style.whiteSpace = prevWhiteSpace;
      return width;
    };

    const update = () => {
      const styles = getComputedStyle(topEl);
      const gap =
        parseFloat(styles.columnGap || styles.gap || "0") || 0;
      const paddingLeft = parseFloat(styles.paddingLeft || "0") || 0;
      const paddingRight = parseFloat(styles.paddingRight || "0") || 0;
      const availableWidth = topEl.clientWidth - paddingLeft - paddingRight;

      const currentBadgesWidth = badgesEl.scrollWidth;
      if (
        !badgesFullWidthRef.current ||
        currentBadgesWidth > badgesFullWidthRef.current
      ) {
        badgesFullWidthRef.current = currentBadgesWidth;
      }

      const badgeItems = Array.from(badgesEl.children) as HTMLElement[];
      if (badgeItems.length > 0) {
        const maxBadgeHeight = badgeItems.reduce((maxHeight, badge) => {
          const height = badge.getBoundingClientRect().height;
          return height > maxHeight ? height : maxHeight;
        }, 0);
        if (maxBadgeHeight > 0) {
          badgesEl.style.setProperty(
            "--car-card-badge-height",
            `${Math.ceil(maxBadgeHeight)}px`,
          );
        }
      }

      const nameWidth = measureNameWidth();
      const fullBadgesWidth = badgesFullWidthRef.current ?? currentBadgesWidth;
      const requiredWidth = Math.ceil(nameWidth + fullBadgesWidth + gap);
      const nextCompact = availableWidth > 0 && requiredWidth > availableWidth;

      setCompactBadges((prev) => (prev === nextCompact ? prev : nextCompact));
    };

    const scheduleUpdate = () => {
      if (frameId) cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(update);
    };

    update();

    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(topEl);
    observer.observe(nameEl);
    observer.observe(badgesEl);

    return () => {
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
    };
  }, []);

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
    <li className={compactBadges ? "car-card car-card--compact-badges" : "car-card"}>
      <Link href={carDetailsLink} className="car-card__image">
        <UiImage
          width={450}
          height={252}
          src={`${BASE_URL}static/${encodeURI(car.previewUrl ?? "")}`}
          alt={tCatalog("imageAlt", { brand: car.brand ?? "", model: car.model ?? "" })}
          sizePreset="card"
        />
      </Link>

      <div className="car-card__box">
        <div className="car-card__top" ref={topRef}>
          <h3 className="car-card__name">
            <Link
              href={carDetailsLink}
              className="car-card__name"
              ref={nameRef}
            >
              {car.brand} {car.model}
            </Link>
          </h3>
          <div className="car-card__badges" ref={badgesRef}>
            {car.isAvailable ? (
              <span className="car-card__badge car-card__badge--available">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.66682 1.30371C4.66682 0.960067 4.9653 0.681488 5.3335 0.681488C5.70168 0.681488 6.00016 0.960067 6.00016 1.30371V1.92593H10.0002V1.30371C10.0002 0.960067 10.2986 0.681488 10.6668 0.681488C11.035 0.681488 11.3335 0.960067 11.3335 1.30371V1.92593H12.6668C13.7714 1.92593 14.6668 2.76166 14.6668 3.7926V12.5037C14.6668 13.5346 13.7714 14.3704 12.6668 14.3704H3.3335C2.22892 14.3704 1.3335 13.5346 1.3335 12.5037V3.7926C1.3335 2.76166 2.22892 1.92593 3.3335 1.92593H4.66682V1.30371Z" fill="#0EA548"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3332 5.84124C11.5937 6.08411 11.5938 6.47807 11.3336 6.72119L7.80481 10.2026C7.6798 10.3194 7.5102 10.3851 7.33334 10.3851C7.15647 10.3851 6.98683 10.3196 6.86177 10.2029L4.86177 8.33619C4.60142 8.0932 4.60142 7.69923 4.86177 7.45624C5.12211 7.21325 5.54423 7.21325 5.80458 7.45624L7.33294 8.88271L10.3904 5.84168C10.6506 5.59856 11.0727 5.59836 11.3332 5.84124Z" fill="white"/>
                </svg>
                <span className="car-card__badge-text car-card__badge-text--availability">
                  {tCatalog("badges.available")}
                </span>
              </span>
            ) : (
              <span className="car-card__badge car-card__badge--contact">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.66682 1.30371C4.66682 0.960067 4.9653 0.681488 5.3335 0.681488C5.70168 0.681488 6.00016 0.960067 6.00016 1.30371V1.92593H10.0002V1.30371C10.0002 0.960067 10.2986 0.681488 10.6668 0.681488C11.035 0.681488 11.3335 0.960067 11.3335 1.30371V1.92593H12.6668C13.7714 1.92593 14.6668 2.76166 14.6668 3.7926V12.5037C14.6668 13.5346 13.7714 14.3704 12.6668 14.3704H3.3335C2.22892 14.3704 1.3335 13.5346 1.3335 12.5037V3.7926C1.3335 2.76166 2.22892 1.92593 3.3335 1.92593H4.66682V1.30371Z" fill="#6B6B6B"/>
                  <path fillRule="evenodd" clipRule="evenodd" d="M11.3332 5.84124C11.5937 6.08411 11.5938 6.47807 11.3336 6.72119L7.80481 10.2026C7.6798 10.3194 7.5102 10.3851 7.33334 10.3851C7.15647 10.3851 6.98683 10.3196 6.86177 10.2029L4.86177 8.33619C4.60142 8.0932 4.60142 7.69923 4.86177 7.45624C5.12211 7.21325 5.54423 7.21325 5.80458 7.45624L7.33294 8.88271L10.3904 5.84168C10.6506 5.59856 11.0727 5.59836 11.3332 5.84124Z" fill="white"/>
                </svg>
                <span className="car-card__badge-text car-card__badge-text--contact">
                  {tCatalog("badges.contact")}
                </span>
              </span>
            )}
            {car.isNew && (
              <span className="car-card__badge car-card__badge--new">NEW</span>
            )}
            {car.discount && car.discount > 0 && (
              <span className="car-card__badge car-card__badge--discount">
                -{car.discount}
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_4363_21)">
                    <path d="M20.8767 11.3844L19.782 10.3389C19.3973 9.97153 19.3358 9.38612 19.6356 8.94684L20.489 7.69664C20.5591 7.59393 20.5772 7.4672 20.5388 7.34887C20.5003 7.23066 20.4111 7.13882 20.294 7.09687L18.8689 6.58712C18.3681 6.40788 18.0737 5.89806 18.1691 5.37482L18.4402 3.88566C18.4625 3.76327 18.4275 3.6401 18.3444 3.54774C18.261 3.45529 18.1421 3.4082 18.0183 3.41702L16.5088 3.531C15.9783 3.57124 15.5022 3.22502 15.3764 2.70831L15.0184 1.23753C14.9889 1.11665 14.9069 1.01842 14.7933 0.967766C14.6798 0.917357 14.5518 0.922115 14.4423 0.981014L13.1097 1.69903C12.6415 1.95128 12.0657 1.82897 11.7406 1.40811L10.8153 0.210165C10.7393 0.111768 10.6243 0.0552893 10.5 0.0552893C10.3757 0.0552893 10.2607 0.111727 10.1847 0.210165L9.25941 1.40803C8.93432 1.82897 8.35842 1.9514 7.89023 1.69903L6.55763 0.981014C6.44811 0.922115 6.32019 0.917193 6.20665 0.967807C6.09304 1.01838 6.01105 1.11669 5.9816 1.23748L5.62357 2.70827C5.49778 3.22502 5.02191 3.57157 4.49117 3.53096L2.98179 3.41698C2.85739 3.40808 2.7389 3.45533 2.65576 3.54769C2.57246 3.64014 2.53755 3.76331 2.55982 3.88571L2.83102 5.37486C2.92626 5.8981 2.63193 6.40792 2.13117 6.58708L0.705832 7.09691C0.588732 7.13878 0.499564 7.23062 0.461173 7.34891C0.422701 7.46711 0.440871 7.59393 0.510967 7.6966L1.3643 8.94688C1.66416 9.38608 1.6026 9.97149 1.21795 10.3389L0.123245 11.3844C0.0333387 11.4703 -0.0107942 11.5905 0.00224875 11.7141C0.0151687 11.8379 0.0834188 11.9462 0.189198 12.0116L1.47742 12.8067C1.93007 13.086 2.11197 13.6458 1.90993 14.1379L1.3351 15.5382C1.28797 15.6533 1.2965 15.7811 1.35872 15.8887C1.4209 15.9964 1.52721 16.0677 1.65046 16.0843L3.15053 16.2867C3.67767 16.3578 4.0715 16.7952 4.08713 17.3269L4.13155 18.8399C4.13516 18.9642 4.19504 19.0775 4.29561 19.1506C4.39626 19.2237 4.52251 19.2456 4.64162 19.2106L6.09456 18.7853C6.19644 18.7554 6.29951 18.7411 6.40099 18.7411C6.80753 18.7411 7.18869 18.971 7.37318 19.3546L8.0291 20.7188C8.083 20.8309 8.18373 20.9101 8.30543 20.9359C8.42683 20.9617 8.55128 20.9303 8.64598 20.8499L9.80012 19.8705C10.2057 19.5265 10.7943 19.5265 11.1998 19.8705L12.354 20.8499C12.4488 20.9304 12.5729 20.9617 12.6946 20.9359C12.8162 20.91 12.9169 20.8309 12.9708 20.7188L13.6268 19.3546C13.8573 18.8753 14.3951 18.6359 14.9056 18.7853L16.3584 19.2106C16.4777 19.2457 16.6038 19.2237 16.7044 19.1506C16.8051 19.0775 16.8648 18.9642 16.8685 18.8399L16.9129 17.327C16.9285 16.7954 17.3224 16.3578 17.8495 16.2867L19.3495 16.0844C19.4729 16.0677 19.5792 15.9965 19.6413 15.8888C19.7036 15.7811 19.7121 15.6534 19.6649 15.5382L19.0902 14.1379C18.8881 13.6459 19.07 13.086 19.5227 12.8067L20.8109 12.0117C20.9167 11.9464 20.9849 11.838 20.9979 11.7143C21.0107 11.5905 20.9666 11.4703 20.8767 11.3844ZM5.52711 7.94934C5.52711 6.8141 6.45074 5.89047 7.58593 5.89047C8.72116 5.89047 9.6448 6.8141 9.6448 7.9493C9.6448 9.08449 8.72116 10.0082 7.58593 10.0082C6.45074 10.0082 5.52711 9.08461 5.52711 7.94934ZM7.51079 14.3316C7.37737 14.465 7.20251 14.5317 7.02766 14.5317C6.85281 14.5317 6.67797 14.4649 6.54454 14.3316C6.27773 14.0648 6.27773 13.6321 6.54454 13.3653L13.5114 6.39833C13.7783 6.1316 14.2107 6.1316 14.4777 6.39833C14.7445 6.66513 14.7445 7.09777 14.4777 7.36466L7.51079 14.3316ZM12.9177 15.34C11.7825 15.34 10.8589 14.4163 10.8589 13.2811C10.8589 12.1459 11.7825 11.2223 12.9177 11.2223C14.053 11.2223 14.9766 12.1459 14.9766 13.2811C14.9766 14.4163 14.053 15.34 12.9177 15.34Z" fill="#E63946"/>
                    <path d="M7.5859 7.25699C7.20417 7.25699 6.89355 7.5676 6.89355 7.94934C6.89355 8.33107 7.20417 8.64168 7.5859 8.64168C7.96763 8.64168 8.27824 8.33107 8.27824 7.94934C8.27824 7.5676 7.96763 7.25699 7.5859 7.25699Z" fill="#E63946"/>
                    <path d="M12.9179 12.5888C12.5362 12.5888 12.2256 12.8994 12.2256 13.2812C12.2256 13.6629 12.5362 13.9735 12.9179 13.9735C13.2997 13.9735 13.6103 13.6629 13.6103 13.2812C13.6103 12.8994 13.2997 12.5888 12.9179 12.5888Z" fill="#E63946"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_4363_21">
                      <rect width="21" height="21" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </span>
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
              const priceBeforeDiscount = tariff.dailyPrice * (1 + (selectedPlan?.pricePercent ?? 0) / 100);
              const finalPrice = Math.round(priceBeforeDiscount * (1 - discountPercent / 100));

              return (
              <li key={tariff.id ?? index} className="car-card__item">
                <span className="car-card__text">
                  {tCatalog(
                      rangeLabelKeys[Math.min(index, rangeLabelKeys.length - 1)],
                  )}
                </span>
                <span className="car-card__value">
                  {hasDiscount && (
                    <span className="text-strikethrough">
                      {formatPrice(priceBeforeDiscount)}
                    </span>
                  )}
                  <span className="text-strong">{formatPrice(finalPrice)}</span>
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
              {localized(car.transmission, locale)}
            </span>
            <span className="car-card__value mob">
              {localized(car.transmission, locale)}
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
              {localized(car.driveType, locale)}
            </span>
            <span className="car-card__value mob">
              {localized(car.driveType, locale)}{tCatalog("features.driveMobileSuffix")}
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
                  {hasDiscount && (
                    <span className="text-strikethrough">
                      {formatPrice(dailyPriceBeforeDiscount)}
                    </span>
                  )}
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
        {/* Desktop: одна кнопка */}
        <Link href={hasDates ? bookingLink : carDetailsLink} className="main-button car-card__btn-desktop">
          {hasDates ? tCatalog("actions.book") : tCatalog("actions.details")}
        </Link>
        {/* Mobile: дві кнопки */}
        <div className="car-card__buttons-mobile">
          <Link href={carDetailsLink} className="main-button main-button--outline">
            {tCatalog("actions.details")}
          </Link>
          <Link href={bookingLink} className="main-button">
            {tCatalog("actions.book")}
          </Link>
        </div>
      </div>
    </li>
  );
}
