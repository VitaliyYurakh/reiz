"use client";

import { useTranslations } from "next-intl";
import { formatFull, formatTime } from "@/lib/utils/date-format";
import { useCurrency } from "@/context/CurrencyContext";
import { BASE_URL } from "@/config/environment";
import UiImage from "@/components/ui/UiImage";

type ExtraDefinition = {
  id: "additionalDriver" | "childSeat" | "borderCrossing" | "driverService";
  price: number;
  pricing: "perDay" | "perRental";
};

interface PricingSummaryPanelProps {
  carName: string;
  previewUrl: string | null;
  selectedDate: { startDate: Date; endDate: Date };
  pickupLocation: string;
  returnLocation: string;
  totalDays: number;
  dailyPrice: number;
  depositAmount: number;
  totalCost: number;
  selectedExtras: Set<ExtraDefinition["id"]>;
  extraDefinitions: readonly ExtraDefinition[];
}

export default function PricingSummaryPanel({
  carName,
  previewUrl,
  selectedDate,
  pickupLocation,
  returnLocation,
  totalDays,
  dailyPrice,
  depositAmount,
  totalCost,
  selectedExtras,
  extraDefinitions,
}: PricingSummaryPanelProps) {
  const t = useTranslations("carRentPage");
  const { formatPrice, formatDeposit } = useCurrency();

  return (
    <div className="rent-page__summary rent-page__summary-panel">
      <div className="rent-page__summary-image">
        <UiImage
          width={570}
          height={319}
          sizePreset="card"
          src={`${BASE_URL}static/${encodeURI(previewUrl ?? "")}`}
          alt={t("summary.imageAlt", {
            car: carName || t("summary.locationPlaceholder"),
          })}
        />
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
              <span className="text-strong">
                {formatFull(selectedDate.startDate)} (
                {formatTime(selectedDate.startDate)})
              </span>{" "}
              {pickupLocation || t("summary.locationPlaceholder")}
            </span>
          </div>
          <div className="rent-page__summary-item-info">
            <span className="rent-page__summary-name">
              {t("summary.returnLabel")}
            </span>
            <span className="rent-page__summary-info">
              <span className="text-strong">
                {formatFull(selectedDate.endDate)} (
                {formatTime(selectedDate.endDate)})
              </span>{" "}
              {returnLocation || t("summary.locationPlaceholder")}
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
              {formatPrice(dailyPrice)}/day
            </span>
          </div>
          {Array.from(selectedExtras).map((id) => {
            const extra = extraDefinitions.find(
              (item) => item.id === id,
            );
            if (!extra) return null;

            const isPerDay = extra.pricing === "perDay";
            const priceText = t(`addOns.options.${id}.price`, {
              formattedPrice: formatPrice(extra.price),
            });

            return (
              <div className="rent-page__summary-item-wrapper" key={id}>
                <span className="rent-page__summary-name">
                  {t(`addOns.options.${id}.label`)}
                </span>
                <span className="rent-page__summary-value">
                  {priceText}
                  {isPerDay && totalDays > 0
                    ? ` × ${totalDays} = ${formatPrice(extra.price * totalDays)}`
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
            <span className="text-strong">{formatDeposit(depositAmount)}</span>
          </span>
        </li>
        <li className="rent-page__summary-item">
          <span className="rent-page__summary-name">
            {t("summary.totalLabel")}
          </span>
          <span className="rent-page__summary-value rent-page__summary-value--big">
            {formatPrice(totalCost)}
          </span>
        </li>
      </ul>
    </div>
  );
}
