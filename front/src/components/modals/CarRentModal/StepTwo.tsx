import { useTranslations } from "next-intl";
import type { ChangeEvent } from "react";
import { Tooltip } from "react-tooltip";
import { useCurrency } from "@/context/CurrencyContext";
import type { CarCountingRule } from "@/types/cars";
import { type ExtraId, EXTRA_DEFINITIONS, type FormState } from "./types";

type StepTwoProps = {
  formState: FormState;
  formError: string | null;
  feedback: "" | "success" | "error";
  step: 1 | 2;
  isSubmitting: boolean;
  selectedPlan: CarCountingRule | undefined;
  selectedExtras: Set<ExtraId>;
  carCountingRules: CarCountingRule[];
  baseDailyPrice: number;
  discountPercent: number;
  setStep: (step: 1 | 2) => void;
  setSelectedPlanId: (id: number) => void;
  toggleExtra: (id: ExtraId) => void;
  handleInputChange: (field: keyof FormState) => (event: ChangeEvent<HTMLInputElement>) => void;
};

export default function StepTwo({
  formState,
  formError,
  feedback,
  step,
  isSubmitting,
  selectedPlan,
  selectedExtras,
  carCountingRules,
  baseDailyPrice,
  discountPercent,
  setStep,
  setSelectedPlanId,
  toggleExtra,
  handleInputChange,
}: StepTwoProps) {
  const t = useTranslations("carRentModal");
  const tAside = useTranslations("carAside");
  const { formatPrice } = useCurrency();

  return (
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

            {carCountingRules.map((plan) => {
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

            {carCountingRules.map((plan) => (
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
  );
}
