import { useTranslations } from "next-intl";
import type { InvestModalSpec } from "@/app/[locale]/(site)/invest/components/modals";

export default function ConfirmTicket({
  close,
  isClosing,
}: {
  id: string;
  data?: InvestModalSpec["confirm"]["data"];
  close: () => void;
  isClosing: boolean;
}) {
  const t = useTranslations("applyModal");
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
        <p>{t("consent")}</p>

        <form className="modal-form">
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
