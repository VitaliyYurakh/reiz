"use client";

import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import type { Car } from "@/types/cars";

interface Props {
  car: Car;
  carName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RentalPolicyModal({ car, carName, isOpen, onClose }: Props) {
  const t = useTranslations("rentalPolicyModal");

  if (!isOpen) return null;

  const dailyMileage = car.dailyMileageLimit ?? 300;
  const weeklyMileage = car.weeklyMileageLimit ?? dailyMileage * 7;
  const monthlyMileage = car.monthlyMileageLimit ?? dailyMileage * 30;
  const unlimited = car.unlimitedMileage ?? false;

  const fuelPolicyMap: Record<string, string> = {
    full_to_full: t("fuel.fullToFull"),
    same_level: t("fuel.sameLevel"),
    prepaid: t("fuel.prepaid"),
    included: t("fuel.included"),
  };
  const fuelText = fuelPolicyMap[car.fuelPolicy ?? "full_to_full"] ?? fuelPolicyMap.full_to_full;

  const driverAge = car.driverAge ?? car.segment?.[0]?.driverAge ?? 21;
  const driverExp = car.driverExperience ?? car.segment?.[0]?.experience ?? 2;
  const minDays = car.minRentalDays ?? 1;
  const maxDays = car.maxRentalDays ?? 0;

  const baseDeposit = car.rentalTariff.length > 0
    ? Math.min(...car.rentalTariff.map((t) => t.deposit))
    : 0;
  const sortedRules = [...(car.carCountingRule || [])].sort(
    (a, b) => a.depositPercent - b.depositPercent,
  );
  const depositValues = sortedRules.map((rule) =>
    rule.depositFixed != null
      ? rule.depositFixed
      : Math.max(Math.round(baseDeposit * (1 - rule.depositPercent / 100)), 0),
  );
  if (depositValues.length === 0) depositValues.push(baseDeposit);
  const minDeposit = Math.min(...depositValues);
  const maxDeposit = Math.max(...depositValues, baseDeposit);

  return (
    <div
      className="rental-policy-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="rental-policy-modal">
        <div className="rental-policy-modal__header">
          <h3>{t("title")}</h3>
          <button type="button" onClick={onClose} className="rental-policy-modal__close" aria-label="Close">
            <Icon id="cross" width={14} height={14} />
          </button>
        </div>

        <div className="rental-policy-modal__body">
          {/* Mileage */}
          <section className="rental-policy-modal__section">
            <h4 className="rental-policy-modal__section-title">
              <Icon id="mileage" width={20} height={20} />
              {t("mileage.title")}
            </h4>
            {unlimited ? (
              <div className="rental-policy-modal__row">
                <span>{t("mileage.unlimited")}</span>
              </div>
            ) : (
              <>
                <div className="rental-policy-modal__row">
                  <span>{t("mileage.perDay")}</span>
                  <span>{dailyMileage.toLocaleString()} {t("km")}</span>
                </div>
                <div className="rental-policy-modal__row">
                  <span>{t("mileage.perWeek")}</span>
                  <span>{weeklyMileage.toLocaleString()} {t("km")}</span>
                </div>
                <div className="rental-policy-modal__row">
                  <span>{t("mileage.perMonth")}</span>
                  <span>{monthlyMileage.toLocaleString()} {t("km")}</span>
                </div>
              </>
            )}
            {(car.overmileagePrice ?? car.segment?.[0]?.overmileagePrice ?? 0) > 0 && (
              <div className="rental-policy-modal__row">
                <span>{t("mileage.overcharge")}</span>
                <span>{car.overmileagePrice ?? car.segment?.[0]?.overmileagePrice} USD/{t("km")}</span>
              </div>
            )}
          </section>

          {/* Fuel Policy */}
          <section className="rental-policy-modal__section">
            <h4 className="rental-policy-modal__section-title">
              <Icon id="t-fuel" width={20} height={20} />
              {t("fuel.title")}
            </h4>
            <p className="rental-policy-modal__text">{fuelText}</p>
          </section>

          {/* Rental Policy */}
          <section className="rental-policy-modal__section">
            <h4 className="rental-policy-modal__section-title">
              <Icon id="calendar-rental" width={20} height={20} />
              {t("rental.title")}
            </h4>
            <div className="rental-policy-modal__row">
              <span>{t("rental.minDays")}</span>
              <span>{minDays} {t("rental.days")}</span>
            </div>
            {maxDays > 0 && (
              <div className="rental-policy-modal__row">
                <span>{t("rental.maxDays")}</span>
                <span>{maxDays} {t("rental.days")}</span>
              </div>
            )}
            <div className="rental-policy-modal__row">
              <span>{t("rental.driverAge")}</span>
              <span>{t("rental.driverAgeValue", { age: driverAge })}</span>
            </div>
            <div className="rental-policy-modal__row">
              <span>{t("rental.experience")}</span>
              <span>{t("rental.experienceValue", { years: driverExp })}</span>
            </div>
          </section>

          {/* Deposit Policy */}
          <section className="rental-policy-modal__section">
            <h4 className="rental-policy-modal__section-title">
              <Icon id="shield-deposit" width={20} height={20} />
              {t("deposit.title")}
            </h4>
            <div className="rental-policy-modal__row">
              <span>{t("deposit.refundable")}</span>
              <span>
                {minDeposit === maxDeposit
                  ? (baseDeposit === 0 ? t("deposit.noDeposit") : `${baseDeposit} USD`)
                  : `${minDeposit} – ${maxDeposit} USD`}
              </span>
            </div>
          </section>

          {/* Young Driver Surcharge */}
          {(car.youngerDriverAge ?? 0) > 0 && (car.youngerDriverSurcharge ?? 0) > 0 && (
            <section className="rental-policy-modal__section">
              <h4 className="rental-policy-modal__section-title">
                <Icon id="t-person-key" width={20} height={20} />
                {t("youngDriver.title")}
              </h4>
              <p className="rental-policy-modal__text">
                {t("youngDriver.text", {
                  age: car.youngerDriverAge,
                  fee: car.youngerDriverSurcharge,
                })}
              </p>
            </section>
          )}

          {/* Cross-Border */}
          <section className="rental-policy-modal__section">
            <h4 className="rental-policy-modal__section-title">
              <Icon id="geo-alt" width={20} height={20} />
              {t("crossBorder.title")}
            </h4>
            {car.allowCrossBorder ? (
              <>
                <p className="rental-policy-modal__text rental-policy-modal__text--success">
                  {t("crossBorder.allowed")}
                </p>
                {(car.crossBorderFee ?? 0) > 0 && (
                  <div className="rental-policy-modal__row">
                    <span>{t("crossBorder.fee")}</span>
                    <span>{car.crossBorderFee} USD</span>
                  </div>
                )}
                {(car.crossBorderDailyFee ?? 0) > 0 && (
                  <div className="rental-policy-modal__row">
                    <span>{t("crossBorder.dailyFee")}</span>
                    <span>{car.crossBorderDailyFee} USD/{t("crossBorder.day")}</span>
                  </div>
                )}
                {car.allowedCountries && car.allowedCountries.length > 0 && (
                  <div className="rental-policy-modal__row">
                    <span>{t("crossBorder.countries")}</span>
                    <span>{car.allowedCountries.join(", ")}</span>
                  </div>
                )}
              </>
            ) : (
              <p className="rental-policy-modal__text rental-policy-modal__text--warning">
                {t("crossBorder.notAllowed")}
              </p>
            )}
          </section>

          {/* Late Return */}
          {((car.lateReturnGraceMin ?? 0) > 0 || (car.lateReturnFeePerHour ?? 0) > 0) && (
            <section className="rental-policy-modal__section">
              <h4 className="rental-policy-modal__section-title">
                <Icon id="cancel-circle" width={20} height={20} />
                {t("lateReturn.title")}
              </h4>
              {(car.lateReturnGraceMin ?? 0) > 0 && (
                <div className="rental-policy-modal__row">
                  <span>{t("lateReturn.grace")}</span>
                  <span>{car.lateReturnGraceMin} {t("lateReturn.min")}</span>
                </div>
              )}
              {(car.lateReturnFeePerHour ?? 0) > 0 && (
                <div className="rental-policy-modal__row">
                  <span>{t("lateReturn.fee")}</span>
                  <span>{car.lateReturnFeePerHour} USD/{t("lateReturn.hour")}</span>
                </div>
              )}
            </section>
          )}

          {/* Cancellation */}
          <section className="rental-policy-modal__section">
            <h4 className="rental-policy-modal__section-title">
              <Icon id="cancel-circle" width={20} height={20} />
              {t("cancellation.title")}
            </h4>
            <p className="rental-policy-modal__text">
              {(car.cancellationHours ?? 24) > 0
                ? t("cancellation.hoursValue", { hours: car.cancellationHours ?? 24 })
                : t("cancellation.free")}
            </p>
          </section>

          {/* Rules: pets, smoking, cleaning */}
          {(car.petAllowed || (car.cleaningFee ?? 0) > 0) && (
            <section className="rental-policy-modal__section">
              <h4 className="rental-policy-modal__section-title">
                <Icon id="t-person-key" width={20} height={20} />
                {t("rules.title")}
              </h4>
              <div className="rental-policy-modal__row">
                <span>{t("rules.pets")}</span>
                <span className={car.petAllowed ? '' : 'rental-policy-modal__text--warning'} style={{ fontWeight: 600 }}>
                  {car.petAllowed ? t("rules.allowed") : t("rules.notAllowed")}
                </span>
              </div>
              {(car.cleaningFee ?? 0) > 0 && (
                <div className="rental-policy-modal__row">
                  <span>{t("rules.cleaningFee")}</span>
                  <span>{car.cleaningFee} USD</span>
                </div>
              )}
            </section>
          )}

          {/* Payment */}
          <section className="rental-policy-modal__section">
            <h4 className="rental-policy-modal__section-title">
              <Icon id="credit-card" width={20} height={20} />
              {t("payment.title")}
            </h4>
            <p className="rental-policy-modal__text">
              {car.paymentMethods || t("payment.default")}
            </p>
          </section>
        </div>
      </div>

      <style>{`
        .rental-policy-overlay {
          position: fixed; inset: 0; z-index: 9999;
          background: rgba(0,0,0,0.5); display: flex;
          align-items: center; justify-content: center;
          padding: 20px; animation: rpFadeIn 0.2s ease;
        }
        @keyframes rpFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .rental-policy-modal {
          background: #fff; border-radius: 20px;
          max-width: 600px; width: 100%; max-height: 85vh;
          display: flex; flex-direction: column;
          box-shadow: 0 20px 60px rgba(0,0,0,0.15);
        }
        .rental-policy-modal__header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 20px 24px; border-bottom: 1px solid #f0f0f0;
        }
        .rental-policy-modal__header h3 {
          font-size: 18px; font-weight: 700; margin: 0; color: #1a1a2e;
        }
        .rental-policy-modal__close {
          background: #f5f5f5; border: none; border-radius: 50%;
          width: 36px; height: 36px; display: flex; align-items: center;
          justify-content: center; cursor: pointer; transition: background 0.15s;
        }
        .rental-policy-modal__close:hover { background: #e8e8e8; }
        .rental-policy-modal__body {
          padding: 16px 24px 24px; overflow-y: auto;
        }
        .rental-policy-modal__section {
          padding: 16px 0; border-bottom: 1px solid #f0f0f0;
        }
        .rental-policy-modal__section:last-child { border-bottom: none; }
        .rental-policy-modal__section-title {
          display: flex; align-items: center; gap: 10px;
          font-size: 15px; font-weight: 700; color: #1a1a2e;
          margin: 0 0 12px;
        }
        .rental-policy-modal__row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 6px 0; font-size: 14px;
        }
        .rental-policy-modal__row span:first-child { color: #6b7280; }
        .rental-policy-modal__row span:last-child { font-weight: 600; color: #1a1a2e; }
        .rental-policy-modal__text {
          font-size: 14px; color: #374151; line-height: 1.5; margin: 0;
        }
        .rental-policy-modal__text--success { color: #16a34a; font-weight: 600; }
        .rental-policy-modal__text--warning { color: #dc2626; font-weight: 600; }
        @media (max-width: 640px) {
          .rental-policy-modal { max-height: 90vh; border-radius: 16px; }
          .rental-policy-modal__body { padding: 12px 16px 20px; }
          .rental-policy-modal__header { padding: 16px; }
        }
      `}</style>
    </div>
  );
}
