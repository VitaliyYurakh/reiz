"use client";

import { useEffect } from "react";
import Icon from "@/components/Icon";
import { CurrencyText } from "@/components/CurrencyPrice";
import { useCurrency } from "@/context/CurrencyContext";
import type { Car } from "@/types/cars";

interface Props {
  car: Car;
  carName: string;
  isOpen: boolean;
  onClose: () => void;
  t: ReturnType<typeof import("next-intl").useTranslations>;
}

export default function RentalPolicyModal({ car, carName, isOpen, onClose, t }: Props) {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
      };
    }
  }, [isOpen]);

  const { formatPrice, formatDeposit } = useCurrency();

  if (!isOpen) return null;

  const dailyMileage = car.dailyMileageLimit ?? 300;
  const weeklyMileage = car.weeklyMileageLimit ?? dailyMileage * 7;
  const monthlyMileage = car.monthlyMileageLimit ?? dailyMileage * 30;
  const unlimited = car.unlimitedMileage ?? false;
  const overmileagePrice = car.overmileagePrice ?? car.segment?.[0]?.overmileagePrice ?? 0;

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

  const cancellationHours = car.cancellationHours ?? 24;

  return (
    <div
      className="rpm-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="rpm">
        <div className="rpm__header">
          <span className="rpm__header-spacer" />
          <h3 className="rpm__title">{t("title")}</h3>
          <button type="button" onClick={onClose} className="rpm__close" aria-label="Close">
            <Icon id="cross" width={14} height={14} />
          </button>
        </div>

        <div className="rpm__body">
          <div className="rpm__body-inner">
          {/* Mileage Policy */}
          <section className="rpm__section">
            <h4 className="rpm__heading">{t("mileage.title")}</h4>
            <p className="rpm__subtitle">{t("mileage.subtitle")}</p>
            {unlimited ? (
              <p className="rpm__text">{t("mileage.unlimited")}</p>
            ) : (
              <>
              <h5 className="rpm__subheading">{t("mileage.limitsTitle")}</h5>
              <ul className="rpm__list">
                <li className="rpm__item">
                  <span className="rpm__icon sprite">
                    <Icon id="calendar-rental" width={22} height={22} />
                  </span>
                  <span className="rpm__label">{t("mileage.perDay")}</span>
                  <span className="rpm__value">{dailyMileage.toLocaleString()} {t("km")}</span>
                </li>
                <li className="rpm__item">
                  <span className="rpm__icon sprite">
                    <Icon id="calendar-rental" width={22} height={22} />
                  </span>
                  <span className="rpm__label">{t("mileage.perWeek")}</span>
                  <span className="rpm__value">{weeklyMileage.toLocaleString()} {t("km")}</span>
                </li>
                {(car.unlimitedMileageFreeFromDays ?? 0) > 0 ? (
                  <li className="rpm__item">
                    <span className="rpm__icon sprite">
                      <Icon id="calendar-rental" width={22} height={22} />
                    </span>
                    <span className="rpm__label">{t("mileage.unlimitedFrom")}</span>
                    <span className="rpm__value">{t("mileage.unlimitedFromValue", { freeFrom: car.unlimitedMileageFreeFromDays })}</span>
                  </li>
                ) : (
                  <li className="rpm__item">
                    <span className="rpm__icon sprite">
                      <Icon id="calendar-rental" width={22} height={22} />
                    </span>
                    <span className="rpm__label">{t("mileage.perMonth")}</span>
                    <span className="rpm__value">{monthlyMileage.toLocaleString()} {t("km")}</span>
                  </li>
                )}
                {overmileagePrice > 0 && (
                  <li className="rpm__item">
                    <span className="rpm__icon sprite">
                      <Icon id="plus-circle" width={22} height={22} />
                    </span>
                    <span className="rpm__label">{t("mileage.overcharge")}</span>
                    <span className="rpm__value">{formatPrice(overmileagePrice, true)}/{t("km")}</span>
                  </li>
                )}
              </ul>
              </>
            )}
          </section>

          {/* Fuel Policy */}
          <section className="rpm__section">
            <h4 className="rpm__heading">{t("fuel.title")}</h4>
            <p className="rpm__text">{fuelText}</p>
          </section>

          {/* Rental Policy */}
          <section className="rpm__section">
            <h4 className="rpm__heading">{t("rental.title")}</h4>
            <ul className="rpm__list">
              <li className="rpm__item">
                <span className="rpm__icon sprite">
                  <Icon id="calendar-rental" width={22} height={22} />
                </span>
                <span className="rpm__label">{t("rental.minDays")}</span>
                <span className="rpm__value">{minDays} {t("rental.days")}</span>
              </li>
              {maxDays > 0 && (
                <li className="rpm__item">
                  <span className="rpm__icon sprite">
                    <Icon id="calendar-rental" width={22} height={22} />
                  </span>
                  <span className="rpm__label">{t("rental.maxDays")}</span>
                  <span className="rpm__value">{maxDays} {t("rental.days")}</span>
                </li>
              )}
              <li className="rpm__item">
                <span className="rpm__icon sprite">
                  <Icon id="t-person-key" width={22} height={22} />
                </span>
                <span className="rpm__label">{t("rental.driverAge")}</span>
                <span className="rpm__value">{t("rental.driverAgeValue", { age: driverAge })}</span>
              </li>
              <li className="rpm__item">
                <span className="rpm__icon sprite">
                  <Icon id="t-person-key" width={22} height={22} />
                </span>
                <span className="rpm__label">{t("rental.experience")}</span>
                <span className="rpm__value">{t("rental.experienceValue", { years: driverExp })}</span>
              </li>
              {dailyMileage > 0 && overmileagePrice > 0 && (
                <li className="rpm__item">
                  <span className="rpm__icon sprite">
                    <Icon id="mileage" width={22} height={22} />
                  </span>
                  <span className="rpm__label">{t("extras.overmileage")}</span>
                  <span className="rpm__value">{t("extras.overmileageValue", { limit: dailyMileage, price: Math.round(overmileagePrice * 100) })}</span>
                </li>
              )}
            </ul>
          </section>

          {/* Deposit Policy */}
          <section className="rpm__section">
            <h4 className="rpm__heading">{t("deposit.title")}</h4>
            <ul className="rpm__list">
              <li className="rpm__item">
                <span className="rpm__icon sprite">
                  <Icon id="shield-deposit" width={22} height={22} />
                </span>
                <span className="rpm__label">{t("deposit.refundable")}</span>
                <span className="rpm__value">
                  {minDeposit === maxDeposit
                    ? (baseDeposit === 0 ? t("deposit.noDeposit") : formatDeposit(baseDeposit))
                    : `${formatDeposit(minDeposit)} – ${formatDeposit(maxDeposit)}`}
                </span>
              </li>
            </ul>
            <p className="rpm__text" style={{ marginTop: 14 }}><CurrencyText text={t("deposit.note")} /></p>
          </section>

          {/* Young Driver Surcharge */}
          {(car.youngerDriverAge ?? 0) > 0 && (car.youngerDriverSurcharge ?? 0) > 0 && (
            <section className="rpm__section">
              <h4 className="rpm__heading">{t("youngDriver.title")}</h4>
              <p className="rpm__text">
                <CurrencyText text={t("youngDriver.text", {
                  age: car.youngerDriverAge ?? 0,
                  fee: car.youngerDriverSurcharge ?? 0,
                })} />
              </p>
            </section>
          )}

          {/* Cross-Border */}
          <section className="rpm__section">
            <h4 className="rpm__heading">{t("crossBorder.title")}</h4>
            {car.allowCrossBorder ? (
              <>
                <p className="rpm__text rpm__text--success">{t("crossBorder.allowed")}</p>
                <ul className="rpm__list">
                  {(car.crossBorderFee ?? 0) > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite">
                        <Icon id="geo-alt" width={22} height={22} />
                      </span>
                      <span className="rpm__label">{t("crossBorder.fee")}</span>
                      <span className="rpm__value">{formatPrice(car.crossBorderFee ?? 0)}</span>
                    </li>
                  )}
                  {(car.crossBorderDailyFee ?? 0) > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite">
                        <Icon id="geo-alt" width={22} height={22} />
                      </span>
                      <span className="rpm__label">{t("crossBorder.dailyFee")}</span>
                      <span className="rpm__value">{formatPrice(car.crossBorderDailyFee ?? 0)}/{t("crossBorder.day")}</span>
                    </li>
                  )}
                  {car.allowedCountries && car.allowedCountries.length > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite">
                        <Icon id="geo-alt" width={22} height={22} />
                      </span>
                      <span className="rpm__label">{t("crossBorder.countries")}</span>
                      <span className="rpm__value">{car.allowedCountries.join(", ")}</span>
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <p className="rpm__text rpm__text--warning">{t("crossBorder.notAllowed")}</p>
            )}
          </section>

          {/* Late Return */}
          {((car.lateReturnGraceMin ?? 0) > 0 || (car.lateReturnFeePerHour ?? 0) > 0) && (
            <section className="rpm__section">
              <h4 className="rpm__heading">{t("lateReturn.title")}</h4>
              <ul className="rpm__list">
                {(car.lateReturnGraceMin ?? 0) > 0 && (
                  <li className="rpm__item">
                    <span className="rpm__icon sprite">
                      <Icon id="cancel-circle" width={22} height={22} />
                    </span>
                    <span className="rpm__label">{t("lateReturn.grace")}</span>
                    <span className="rpm__value">{car.lateReturnGraceMin} {t("lateReturn.min")}</span>
                  </li>
                )}
                {(car.lateReturnFeePerHour ?? 0) > 0 && (
                  <li className="rpm__item">
                    <span className="rpm__icon sprite">
                      <Icon id="cancel-circle" width={22} height={22} />
                    </span>
                    <span className="rpm__label">{t("lateReturn.fee")}</span>
                    <span className="rpm__value">{formatPrice(car.lateReturnFeePerHour ?? 0)}/{t("lateReturn.hour")}</span>
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* Cancellation */}
          <section className="rpm__section">
            <h4 className="rpm__heading">{t("cancellation.title")}</h4>
            <p className="rpm__text">
              {cancellationHours > 0
                ? t("cancellation.hoursValue", { hours: cancellationHours })
                : t("cancellation.free")}
            </p>
          </section>

          {/* Rules */}
          {(car.petAllowed || (car.cleaningFee ?? 0) > 0) && (
            <section className="rpm__section">
              <h4 className="rpm__heading">{t("rules.title")}</h4>
              <ul className="rpm__list">
                <li className="rpm__item">
                  <span className="rpm__icon sprite">
                    <Icon id="t-person-key" width={22} height={22} />
                  </span>
                  <span className="rpm__label">{t("rules.pets")}</span>
                  <span className={`rpm__value ${!car.petAllowed ? 'rpm__text--warning' : ''}`}>
                    {car.petAllowed ? t("rules.allowed") : t("rules.notAllowed")}
                  </span>
                </li>
                {(car.cleaningFee ?? 0) > 0 && (
                  <li className="rpm__item">
                    <span className="rpm__icon sprite">
                      <Icon id="credit-card" width={22} height={22} />
                    </span>
                    <span className="rpm__label">{t("rules.cleaningFee")}</span>
                    <span className="rpm__value">{formatPrice(car.cleaningFee ?? 0)}</span>
                  </li>
                )}
              </ul>
            </section>
          )}

          {/* Extra Services */}
          {(() => {
            const ovP = overmileagePrice;
            const ulP1 = car.unlimitedMileagePrice1Day;
            const ulP2 = car.unlimitedMileagePrice2to7;
            const ulFree = car.unlimitedMileageFreeFromDays ?? 8;
            const icP = car.intercityDeliveryPrice;
            const cwP = car.carWashPrice;
            const etF = car.emptyTankFee;
            const adF = car.additionalDriverFee;
            const dlP = car.deliveryPrice ?? 0;
            const fthr = car.freeDeliveryThreshold ?? 351;
            const yAge = car.youngerDriverAge ?? 0;
            const ySur = car.youngerDriverSurcharge ?? 0;
            const yExp = car.driverExperience ?? car.segment?.[0]?.experience ?? 2;
            const eqP = car.equipmentRentalPrice;
            const ahF = car.afterHoursServiceFee;
            const whS = car.workingHoursStart ?? '09:00';
            const whE = car.workingHoursEnd ?? '20:00';
            const hasAny = ulP1 != null || icP != null || cwP != null || etF != null || adF != null || dlP > 0 || (yAge > 0 && ySur > 0) || eqP != null || ahF != null;
            if (!hasAny) return null;
            return (
              <section className="rpm__section">
                <h4 className="rpm__heading">{t("extras.title")}</h4>
                <ul className="rpm__list">
                  {ulP1 != null && ulP2 != null && (
                    <li className="rpm__item" style={{ flexWrap: 'wrap' }}>
                      <span className="rpm__icon sprite"><Icon id="mileage" width={22} height={22} /></span>
                      <span className="rpm__label">{t("extras.unlimitedMileage")}</span>
                      <span className="rpm__value" style={{ whiteSpace: 'normal' }}>{t("extras.unlimitedMileageValue", { price1Day: ulP1, price2to7: ulP2, freeFrom: ulFree })}</span>
                    </li>
                  )}
                  {icP != null && icP > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="geo-alt" width={22} height={22} /></span>
                      <span className="rpm__label">{t("extras.intercityDelivery")}</span>
                      <span className="rpm__value">{t("extras.intercityDeliveryValue", { price: icP })}</span>
                    </li>
                  )}
                  {cwP != null && cwP > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="plus-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("extras.carWash")}</span>
                      <span className="rpm__value">{formatPrice(cwP)}</span>
                    </li>
                  )}
                  {etF != null && etF > 0 && (
                    <li className="rpm__item" style={{ flexWrap: 'wrap' }}>
                      <span className="rpm__icon sprite"><Icon id="plus-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("extras.emptyTank")}</span>
                      <span className="rpm__value">{formatPrice(etF)}</span>
                    </li>
                  )}
                  {adF != null && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="t-person-key" width={22} height={22} /></span>
                      <span className="rpm__label">{t("extras.additionalDriver")}</span>
                      <span className="rpm__value">{adF === 0 ? t("extras.free") : formatPrice(adF)}</span>
                    </li>
                  )}
                  {dlP > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="geo-alt" width={22} height={22} /></span>
                      <span className="rpm__label">{t("extras.cityDelivery")}</span>
                      <span className="rpm__value">{t("extras.cityDeliveryValue", { price: dlP, threshold: fthr })}</span>
                    </li>
                  )}
                  {yAge > 0 && ySur > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="t-person-key" width={22} height={22} /></span>
                      <span className="rpm__label">{t("extras.youngDriver", { age: yAge, experience: yExp })}</span>
                      <span className="rpm__value">{formatPrice(ySur)}{t("extras.perDay")}</span>
                    </li>
                  )}
                  {eqP != null && eqP > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="plus-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("extras.equipment")}</span>
                      <span className="rpm__value">{formatPrice(eqP)}{t("extras.perDay")}</span>
                    </li>
                  )}
                  {ahF != null && ahF > 0 && (
                    <li className="rpm__item" style={{ flexWrap: 'wrap' }}>
                      <span className="rpm__icon sprite"><Icon id="plus-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("extras.afterHours")}</span>
                      <span className="rpm__value">{formatPrice(ahF)}</span>
                    </li>
                  )}
                </ul>
                {ahF != null && ahF > 0 && (
                  <p className="rpm__text" style={{ marginTop: 8, color: '#6b7280', fontSize: 13 }}>
                    {t("extras.afterHoursSchedule", { start: whS, end: whE })}
                  </p>
                )}
              </section>
            );
          })()}

          {/* Payment */}
          <section className="rpm__section">
            <h4 className="rpm__heading">{t("payment.title")}</h4>
            <p className="rpm__text">
              {car.paymentMethods || t("payment.default")}
            </p>
          </section>

          {/* Damages */}
          {(() => {
            const tires = car.damageTiresFee;
            const chip = car.damageGlassChipFee;
            const keys = car.damageLostKeysFee;
            const glass = car.damageBrokenGlassFee;
            const totalPct = car.damageTotalLossPercent;
            const scratch = car.damageScratchesFee;
            const smoke = car.damageSmokingFee;
            const hasDamages = tires || chip || keys || glass || totalPct || scratch || smoke;
            if (!hasDamages) return null;
            return (
              <section className="rpm__section">
                <h4 className="rpm__heading">{t("damages.title")}</h4>
                <ul className="rpm__list">
                  {tires != null && tires > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="cancel-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("damages.tires")}</span>
                      <span className="rpm__value">{formatPrice(tires)}{t("damages.perUnit")}</span>
                    </li>
                  )}
                  {chip != null && chip > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="cancel-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("damages.glassChip")}</span>
                      <span className="rpm__value">{formatPrice(chip)}{t("damages.perChip")}</span>
                    </li>
                  )}
                  {keys != null && keys > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="cancel-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("damages.lostKeys")}</span>
                      <span className="rpm__value">{formatPrice(keys)}</span>
                    </li>
                  )}
                  <li className="rpm__item">
                    <span className="rpm__icon sprite"><Icon id="cancel-circle" width={22} height={22} /></span>
                    <span className="rpm__label">{t("damages.lostAccessories")}</span>
                    <span className="rpm__value">{t("damages.lostAccessoriesValue")}</span>
                  </li>
                  {glass != null && glass > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="cancel-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("damages.brokenGlass")}</span>
                      <span className="rpm__value">{formatPrice(glass)}</span>
                    </li>
                  )}
                  {totalPct != null && totalPct > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="cancel-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("damages.totalLoss")}</span>
                      <span className="rpm__value">{t("damages.totalLossValue", { percent: totalPct })}</span>
                    </li>
                  )}
                  {scratch != null && scratch > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="cancel-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("damages.scratches")}</span>
                      <span className="rpm__value">{formatPrice(scratch)}{t("damages.perElement")}</span>
                    </li>
                  )}
                  {smoke != null && smoke > 0 && (
                    <li className="rpm__item">
                      <span className="rpm__icon sprite"><Icon id="cancel-circle" width={22} height={22} /></span>
                      <span className="rpm__label">{t("damages.smoking")}</span>
                      <span className="rpm__value">{formatPrice(smoke)}</span>
                    </li>
                  )}
                </ul>
                <p className="rpm__text" style={{ marginTop: 14 }}>{t("damages.coverageNote")}</p>
              </section>
            );
          })()}

          {/* Deposit multiplier */}
          {(car.depositMultiplier ?? 0) > 0 && (
            <section className="rpm__section">
              <h4 className="rpm__heading">{t("depositMultiplier.title", { multiplier: car.depositMultiplier ?? 1.5 })}</h4>
              <ul className="rpm__list">
                <li className="rpm__item">
                  <span className="rpm__icon sprite"><Icon id="shield-deposit" width={22} height={22} /></span>
                  <span className="rpm__label">{t("depositMultiplier.youngDriver")}</span>
                  <span className="rpm__value">x{car.depositMultiplier ?? 1.5}</span>
                </li>
                <li className="rpm__item">
                  <span className="rpm__icon sprite"><Icon id="shield-deposit" width={22} height={22} /></span>
                  <span className="rpm__label">{t("depositMultiplier.crossBorder")}</span>
                  <span className="rpm__value">x{car.depositMultiplier ?? 1.5}</span>
                </li>
              </ul>
            </section>
          )}
          </div>
        </div>
      </div>

      <style>{`
        .rpm-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(0, 0, 0, 0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          animation: rpmFadeIn 0.2s ease;
          overflow: hidden;
        }
        @keyframes rpmFadeIn { from { opacity: 0 } to { opacity: 1 } }

        .rpm {
          background: #f0f0f0;
          border-radius: 12px;
          max-width: 720px;
          width: 100%;
          max-height: calc(100vh - 80px);
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .rpm__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 25px;
          flex-shrink: 0;
        }
        .rpm__title {
          font-size: 16px;
          font-weight: 600;
          margin: 0;
          color: #000;
          flex: 1;
          text-align: center;
        }
        .rpm__header-spacer {
          width: 36px;
          flex-shrink: 0;
        }
        .rpm__close {
          background: transparent;
          border: none;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          color: #000;
        }
        .rpm__close:hover { opacity: 0.6; }

        .rpm__body {
          padding: 0 16px 16px;
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }
        .rpm__body-inner {
          background: #fff;
          border-radius: 12px;
          padding: 20px 60px 20px 25px;
          overflow-y: auto;
          overscroll-behavior: contain;
          flex: 1;
          min-height: 0;
        }

        .rpm__section {
          padding: 24px 0;
        }
        .rpm__section:first-child { padding-top: 0; }
        .rpm__section:last-child { padding-bottom: 0; }

        .rpm__heading {
          font-size: 20px;
          font-weight: 700;
          color: #000;
          margin: 0 0 8px;
          line-height: 1.3;
        }
        .rpm__subtitle {
          font-size: 14px;
          color: #6b7280;
          margin: 0 0 16px;
          line-height: 1.5;
        }
        .rpm__subheading {
          font-size: 16px;
          font-weight: 600;
          color: #000;
          margin: 0 0 12px;
          line-height: 1.3;
        }

        .rpm__list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .rpm__item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 0;
          border-top: 1px solid #eeeeee;
        }
        .rpm__icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          color: #555;
        }
        .rpm__icon svg {
          width: 22px;
          height: 22px;
        }
        .rpm__label {
          font-weight: 400;
          font-size: 14px;
          line-height: 1.5;
          color: #5e5e5e;
          flex: 1;
        }
        .rpm__value {
          font-weight: 400;
          font-size: 14px;
          line-height: 1.5;
          color: #000;
        }

        .rpm__text {
          font-size: 14px;
          color: #000;
          line-height: 1.65;
          margin: 0;
        }
        .rpm__text + .rpm__text {
          margin-top: 12px;
        }
        .rpm__text--success { color: #16a34a; font-weight: 600; }
        .rpm__text--warning { color: #dc2626; font-weight: 600; }

        @media (max-width: 768px) {
          .rpm-overlay {
            padding: 0;
            align-items: flex-end;
            animation: rpmFadeIn 0.2s ease;
          }
          .rpm {
            max-width: 100%;
            max-height: 100%;
            height: 100%;
            border-radius: 0;
            animation: rpmSlideUp 0.35s ease;
          }
          @keyframes rpmSlideUp { from { transform: translateY(100%) } to { transform: translateY(0) } }
          .rpm__header { padding: 14px 16px; }
          .rpm__body { padding: 0 10px 10px; }
          .rpm__body-inner { padding: 16px; max-height: 100%; }
          .rpm__heading { font-size: 18px; }
          .rpm__label { min-width: 0; }
        }
      `}</style>
    </div>
  );
}
