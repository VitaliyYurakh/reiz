"use client";

import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import { SideBarModalSpec } from "@/components/modals/index";

export default function BookingContactModal({
  close,
  isClosing,
}: {
  id: string;
  data?: SideBarModalSpec["bookingContact"]["data"];
  close: () => void;
  isClosing: boolean;
}) {
  const t = useTranslations("bookingContactModal");

  const telegramLink = "https://t.me/reaboryslavska";
  const whatsappLink = "https://wa.me/380964441454";
  const viberLink = "viber://chat?number=%2B380964441454";
  const phoneNumber = "tel:+380964441454";

  return (
    <div
      className={`modal booking-contact-modal ${!isClosing ? "active" : ""}`}
      style={
        !isClosing
          ? { opacity: 1, display: "flex", transition: "200ms" }
          : { opacity: "0", display: "flex", transition: "300ms" }
      }
    >
      <button className="close modal__close" onClick={close}>
        <Icon id="cross" width={14} height={14} />
      </button>

      <div className="editor">
        <h2>
          {t.rich("title", {
            accent: (chunks) => <em>{chunks}</em>,
          })}
        </h2>

        <div className="booking-contact-modal__buttons">
          <button
            type="button"
            className="booking-contact-modal__btn"
          >
            {t("buttons.telegram")}
          </button>
          <button
            type="button"
            className="booking-contact-modal__btn"
          >
            {t("buttons.whatsapp")}
          </button>
          <button
            type="button"
            className="booking-contact-modal__btn"
          >
            {t("buttons.viber")}
          </button>
          <button
            type="button"
            className="booking-contact-modal__btn"
          >
            {t("buttons.phone")}
          </button>
        </div>

        <p className="booking-contact-modal__terms">{t("terms")}</p>
      </div>
    </div>
  );
}
