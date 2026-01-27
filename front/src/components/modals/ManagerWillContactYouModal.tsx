import { useTranslations } from "next-intl";
import Icon from "@/components/Icon";
import { SideBarModalSpec } from "@/components/modals/index";
import { Link } from "@/i18n/request";

function formatDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

export default function ManagerWillContactYouModal({
  close,
  data,
  isClosing,
}: {
  id: string;
  data: SideBarModalSpec["managerWillContactYouModal"]["data"];
  close: () => void;
  isClosing: boolean;
}) {
  const t = useTranslations("managerWillContactYouModal");
  const shouldNavigateHome =
    data.type !== "call_request" && data.navigateToHomePage === true;

  return (
    <div
      className={`modal manager-will-contact-you-modal ${!isClosing ? "active" : ""}`}
      style={
        !isClosing
          ? { opacity: 1, display: "flex", transition: "200ms" }
          : { opacity: "0", display: "flex", transition: "300ms" }
      }
    >
      {data.showCloseButton && (
        <button className="close modal__close" onClick={close} aria-label="Close">
          <Icon id="cross" width={14} height={14} />
        </button>
      )}

      <div className="editor">
        <div>
          <div className="logo_title">REIZ</div>
          <div className="logo_subtitle">CAR RENTAL IN UKRAINE</div>
          <div className="text-block">
            <div>{t("title")}</div>
            <div>{t("subtitle")}</div>
            {data.type === "call_request" ? (
              <div>{t("callRequest", { phone: data.phone })}</div>
            ) : (
              <div>
                <div>
                  {t("carInfo", {
                    brand: data.car.brand || "",
                    model: data.car.model || "",
                    year: data.car.yearOfManufacture || "",
                  })}
                </div>
                <div>
                  {t("dateRange", {
                    startDate: formatDate(data.startDate),
                    endDate: formatDate(data.endDate),
                  })}
                </div>
              </div>
            )}
            <br />
            <div>{t("managerContact")}</div>
            <div className="modal-form">
              {shouldNavigateHome ? (
                <Link href="/" className="main-button" onClick={close}>
                  {t("buttons.home")}
                </Link>
              ) : (
                <button className="main-button" onClick={close} type="button">
                  {t("buttons.close")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
