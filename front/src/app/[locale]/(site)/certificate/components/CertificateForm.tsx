"use client";

import { useState } from "react";

type Props = {
  amountOptions: string[];
  labels: {
    chooseAmount: string;
    fillForm: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    emailPlaceholder: string;
    togglePhysical: string;
    previewTitle: string;
    previewButton: string;
    termsTitle: string;
    termsText: string;
    checkoutTitle: string;
    payButton: string;
    consent: string;
  };
};

export default function CertificateForm({ amountOptions, labels }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [wantPhysical, setWantPhysical] = useState<boolean>(false);

  // Last 2 items: $5000 removed, "Custom amount" shown instead
  const regularOptions = amountOptions.slice(0, -2);
  const customLabel = amountOptions[amountOptions.length - 1];
  const isCustomSelected = selectedIndex === regularOptions.length;

  const handleTileClick = (index: number) => {
    setSelectedIndex(index);
    if (index !== regularOptions.length) {
      setCustomAmount("");
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setCustomAmount(value);
  };

  // Get selected amount for display
  const getSelectedAmount = () => {
    if (isCustomSelected && customAmount) {
      return `${customAmount} $`;
    }
    return regularOptions[selectedIndex] || "0 $";
  };

  return (
    <>
      {/* ============================================================= */}
      {/* SECTION 1: Amount Selection (stays in right column) */}
      {/* ============================================================= */}
      <div className="cert__amounts-inner">
        <div className="cert-form__label">
          <span className="cert-form__marker" />
          <span className="cert-form__label-text">{labels.chooseAmount}</span>
        </div>

        <div className="cert-form__tiles">
          {regularOptions.map((amount, index) => (
            <button
              key={amount}
              type="button"
              className={`cert-tile ${selectedIndex === index ? "cert-tile--active" : ""}`}
              onClick={() => handleTileClick(index)}
            >
              <span className="cert-tile__text">{amount}</span>
              <span className="cert-tile__indicator" />
            </button>
          ))}

          {/* Custom amount tile */}
          <button
            type="button"
            className={`cert-tile cert-tile--custom ${isCustomSelected ? "cert-tile--active" : ""}`}
            onClick={() => handleTileClick(regularOptions.length)}
          >
            {isCustomSelected ? (
              <input
                type="text"
                inputMode="numeric"
                className="cert-tile__input"
                placeholder="0 $"
                value={customAmount ? `${customAmount} $` : ""}
                onChange={handleCustomAmountChange}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            ) : (
              <span className="cert-tile__text cert-tile__text--muted">
                {customLabel}
              </span>
            )}
            <span className="cert-tile__indicator" />
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* SECTION 2: Form (full width, outside grid) */}
      {/* ============================================================= */}
      <section className="cert__section cert__section--form">
        <div className="cert-form__label">
          <span className="cert-form__marker" />
          <span className="cert-form__label-text">{labels.fillForm}</span>
        </div>

        <div className="cert-form__fields">
          <label className="cert-input">
            <input
              type="text"
              name="name"
              required
              placeholder={labels.namePlaceholder}
              className="cert-input__field"
            />
          </label>
          <label className="cert-input">
            <input
              type="tel"
              name="phone"
              required
              inputMode="tel"
              placeholder={labels.phonePlaceholder}
              className="cert-input__field"
            />
          </label>
          <label className="cert-input">
            <input
              type="email"
              name="email"
              required
              placeholder={labels.emailPlaceholder}
              className="cert-input__field"
            />
          </label>
        </div>

        <label className="cert-toggle">
          <input
            type="checkbox"
            checked={wantPhysical}
            onChange={(e) => setWantPhysical(e.target.checked)}
            className="cert-toggle__input"
          />
          <span className="cert-toggle__switch">
            <span className="cert-toggle__knob" />
          </span>
          <span className="cert-toggle__label">{labels.togglePhysical}</span>
        </label>
      </section>

      {/* ============================================================= */}
      {/* SECTION 3: Preview (full width) */}
      {/* ============================================================= */}
      <section className="cert__section cert__section--preview">
        <div className="cert-form__label">
          <span className="cert-form__marker" />
          <span className="cert-form__label-text">{labels.previewTitle}</span>
        </div>

        <button type="button" className="cert-preview-btn">
          {labels.previewButton}
        </button>
      </section>

      {/* ============================================================= */}
      {/* SECTION 4: Terms (info only, no actions) */}
      {/* ============================================================= */}
      <section className="cert__section cert__section--terms">
        <div className="cert-form__label">
          <span className="cert-form__marker" />
          <span className="cert-form__label-text">{labels.termsTitle}</span>
        </div>

        <p className="cert-form__terms">{labels.termsText}</p>
      </section>

      {/* ============================================================= */}
      {/* SECTION 5: Final Payment Block (clean action) */}
      {/* ============================================================= */}
      <section className="cert__section cert__section--checkout">
        {/* Section label */}
        <div className="cert-form__label">
          <span className="cert-form__marker" />
          <span className="cert-form__label-text">{labels.checkoutTitle}</span>
        </div>

        {/* Final row: price — line — button with consent under button */}
        <div className="cert-checkout">
          <span className="cert-checkout__price">{getSelectedAmount()}</span>
          <span className="cert-checkout__line" />
          <div className="cert-checkout__action">
            <button type="submit" className="cert-checkout__btn">
              {labels.payButton}
            </button>
            <p className="cert-checkout__consent">{labels.consent}</p>
          </div>
        </div>
      </section>
    </>
  );
}
