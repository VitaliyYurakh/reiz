import { useTranslations } from "next-intl";
import { useCurrency } from "@/context/CurrencyContext";
import { BASE_URL } from "@/config/environment";
import UiImage from "@/components/ui/UiImage";
import { type ExtraId, EXTRA_DEFINITIONS, formatFull, formatTime } from "./types";

type PricingSummaryProps = {
  carName: string;
  previewUrl: string | null;
  selectedDate: {
    startDate: Date;
    endDate: Date;
  };
  pickupLocation: string;
  returnLocation: string;
  totalDays: number;
  dailyPrice: number;
  dailyPriceBeforeDiscount: number;
  hasDiscount: boolean;
  depositAmount: number;
  totalCost: number;
  selectedExtras: Set<ExtraId>;
};

export default function PricingSummary({
  carName,
  previewUrl,
  selectedDate,
  pickupLocation,
  returnLocation,
  totalDays,
  dailyPrice,
  dailyPriceBeforeDiscount,
  hasDiscount,
  depositAmount,
  totalCost,
  selectedExtras,
}: PricingSummaryProps) {
  const t = useTranslations("carRentModal");
  const { formatPrice, formatDeposit } = useCurrency();

  return (
    <div className="modal__right">
      <div className="modal__image">
        <UiImage
          width={570}
          height={319}
          src={`${BASE_URL}static/${encodeURI(previewUrl ?? "")}`}
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
              {pickupLocation || t("summary.locationPlaceholder")}
            </span>
          </div>
          <div className="modal__item-info">
            <span className="modal__name">{t("summary.returnLabel")}</span>
            <span className="modal__info">
              <span className="text-strong">
                {formatFull(selectedDate.endDate)} (
                {formatTime(selectedDate.endDate)})
              </span>{" "}
              {returnLocation || t("summary.locationPlaceholder")}
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
                    ? ` \u00d7 ${totalDays} = ${formatPrice(extra.price * totalDays)}`
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
  );
}
