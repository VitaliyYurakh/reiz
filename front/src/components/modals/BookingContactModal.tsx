"use client";

import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import { SideBarModalSpec } from "@/components/modals/index";
import { SOCIAL_LINKS } from "@/config/social";

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

  const telegramLink = SOCIAL_LINKS.telegram;
  const whatsappLink = SOCIAL_LINKS.whatsapp;
  const viberLink = SOCIAL_LINKS.viber;
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
      <button className="close modal__close" onClick={close} aria-label="Close">
        <Icon id="cross" width={14} height={14} />
      </button>

      <div className="editor">
        <h2>
          {t.rich("title", {
            accent: (chunks) => <em>{chunks}</em>,
          })}
        </h2>

        <div className="booking-contact-modal__buttons">
          <a
            href={telegramLink}
            className="booking-contact-modal__btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("buttons.telegram")}
          </a>
          <a
            href={whatsappLink}
            className="booking-contact-modal__btn"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("buttons.whatsapp")}
          </a>
          <a href={viberLink} className="booking-contact-modal__btn">
            {t("buttons.viber")}
          </a>
          <a href={phoneNumber} className="booking-contact-modal__btn">
            {t("buttons.phone")}
          </a>
        </div>

        <p className="booking-contact-modal__terms">{t("terms")}</p>
      </div>
    </div>
  );
}
