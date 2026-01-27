import { InvestModalSpec } from "@/app/[locale]/(site)/invest/components/modals";
import { useTranslations } from "next-intl";

export default function OfferModal({
  close,
  isClosing,
}: {
  id: string;
  data?: InvestModalSpec["confirm"]["data"];
  close: () => void;
  isClosing: boolean;
}) {
  const t = useTranslations("offerModal");
  return (
    <div
      className={`modal ${!isClosing ? "active" : ""}`}
      style={
        !isClosing
          ? { opacity: 1, display: "flex", transition: "200ms" }
          : { opacity: "0", display: "flex", transition: "300ms" }
      }
    >
      <button className="close modal__close" onClick={close} aria-label="Close">
        <svg width="24" height="24">
          <use href="/img/sprite/sprite.svg#close"></use>
        </svg>
      </button>

      <div className="editor">
        <h2>{t("title")}</h2>

        <form className="modal-form">
          <label className="modal-form__label">
            <input
              type="text"
              name="name_offer"
              id="name_offer"
              placeholder={t("placeholders.name")}
              className="modal-form__input"
            />
          </label>
          <label className="modal-form__label">
            <input
              type="tel"
              name="phone_offer"
              id="phone_offer"
              placeholder={t("placeholders.phone")}
              className="modal-form__input"
            />
          </label>
          <label className="modal-form__label">
            <input
              type="tel"
              name="mail_offer"
              id="main_offer"
              placeholder={t("placeholders.email")}
              className="modal-form__input"
            />
          </label>

          <p>{t("consentText")}</p>
          <label className="custom-checkbox">
            <input type="checkbox" className="custom-checkbox__field" />
            <span className="custom-checkbox__content">
              {t("checkboxLabel")}
            </span>
          </label>
          <button className="main-button" type="submit">
            {t("submit")}
          </button>
        </form>
      </div>
    </div>
  );
}
