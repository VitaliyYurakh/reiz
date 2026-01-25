"use client";
import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import type { CarCountingRule } from "@/types/cars";
import { useCurrency } from "@/context/CurrencyContext";

interface InsuranceCoverageProps {
  dailyPrice: number;
  dailyPriceBeforeDiscount: number;
  totalPrice: number;
  depositAmount: number;
  setSelectedPlanId: (planId: number) => void;
  carCountingRule: CarCountingRule[];
  selectedPlanId: number;
  hasDiscount: boolean;
}

export default function InsuranceCoverage({
  dailyPrice,
  dailyPriceBeforeDiscount,
  totalPrice,
  depositAmount,
  setSelectedPlanId,
  carCountingRule,
  selectedPlanId,
  hasDiscount,
}: InsuranceCoverageProps) {
  const t = useTranslations("carRentPage.insuranceCoverage");
  const { formatPrice, formatDeposit } = useCurrency();

  const options = [
    {
      value: "deposit",
      label: t("options.deposit"),
      planId: carCountingRule[0]?.id,
    },
    { value: "50", label: t("options.50"), planId: carCountingRule[1]?.id },
    { value: "100", label: t("options.100"), planId: carCountingRule[2]?.id },
  ];

  const features = [
    {
      label: t("features.damage.label"),
      sub: t("features.damage.sub"),
      included: selectedPlanId === carCountingRule[2]?.id,
      icon: "car-damage",
    },
    {
      label: t("features.theft.label"),
      sub: t("features.theft.sub"),
      included: selectedPlanId === carCountingRule[2]?.id,
      icon: "car-theft",
    },
    {
      label: t("features.tireDamage.label"),
      sub: t("features.tireDamage.sub"),
      included: selectedPlanId === carCountingRule[2]?.id,
      icon: "car-tire-damage",
    },
    {
      label: t("features.wash.label"),
      sub: t("features.wash.sub"),
      included:
        selectedPlanId === carCountingRule[2]?.id ||
        selectedPlanId === carCountingRule[1]?.id,
      icon: "car-wash",
    },
  ];

  return (
    <div className="insurance">
      <h3 className="insurance__title">{t("title")}</h3>

      <div className="insurance__options">
        {options.map((opt) => {
          const isDisabled = typeof opt.planId !== "number";
          return (
            <button
              type="button"
              key={opt.value}
              className={`insurance__option ${
                selectedPlanId === opt.planId ? "active" : ""
              }`}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled && typeof opt.planId === "number") {
                  setSelectedPlanId(opt.planId);
                }
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div className="insurance__features">
        {features.map((f, i) => (
          <div key={f.label} className="insurance__feature">
            <div className="insurance__feature-left">
              <span className="insurance__icon-bg">
                <Icon id={f.icon} width={32} height={32} />
              </span>
            </div>

            <div className="insurance__feature-right">
              <span className="insurance__text">
                <span className="insurance__label">{f.label}</span>
                <span className="insurance__sub">{f.sub}</span>
              </span>

              <span className={`insurance__status`}>
                {f.included ? (
                  <Icon id={"check"} height={20} width={20} />
                ) : (
                  <Icon id={"cancel2"} width={10} height={10} />
                )}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="insurance__footer">
        <div className="insurance__deposit">
          <div>
            {t("footer.deposit")}: <span className="text-strong">{formatDeposit(depositAmount)}</span>
          </div>
        </div>
        <div className="insurance__price">
          <div>
            <span className="text-strong">{formatPrice(dailyPrice)}</span> {t("footer.pricePerDay")}
          </div>
          <div className="insurance__price-sub">
            {formatPrice(totalPrice)} {t("footer.total")}
          </div>
        </div>
      </div>
    </div>
  );
}
