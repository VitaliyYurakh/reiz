"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Tooltip } from "react-tooltip";
import { useTranslations } from "next-intl";
import { useCurrency } from "@/context/CurrencyContext";

type ExtraDefinition = {
  id: "additionalDriver" | "childSeat" | "borderCrossing" | "driverService";
  price: number;
  pricing: "perDay" | "perRental";
};

type ExtraId = ExtraDefinition["id"];

interface AddOnsSectionProps {
  extraDefinitions: readonly ExtraDefinition[];
  selectedExtras: Set<ExtraId>;
  toggleExtra: (id: ExtraId) => void;
}

export default function AddOnsSection({
  extraDefinitions,
  selectedExtras,
  toggleExtra,
}: AddOnsSectionProps) {
  const t = useTranslations("carRentPage");
  const { formatPrice } = useCurrency();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div className="main-form__wrapp">
        <span className="main-form__text">
          {t("addOns.title")}
        </span>

        {extraDefinitions.map((extra) => (
          <label className="custom-checkbox offer" key={extra.id}>
            <input
              type="checkbox"
              className="custom-checkbox__field"
              checked={selectedExtras.has(extra.id)}
              onChange={() => toggleExtra(extra.id)}
            />
            <span
              className="custom-checkbox__content"
              style={{ borderRadius: "20px" }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                {t(`addOns.options.${extra.id}.label`)}
                {extra.id === "driverService" && (
                  <span
                    data-tooltip-id="driver-service-tooltip"
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

      {isMounted &&
        createPortal(
          <Tooltip
            id="driver-service-tooltip"
            place="top"
            positionStrategy="fixed"
            variant="light"
            opacity={1}
            border="1px solid #D6D6D6"
            style={{ zIndex: 9999, borderRadius: "16px", maxWidth: "300px" }}
          >
            <div
              // biome-ignore lint/security/noDangerouslySetInnerHtml: tooltip content
              dangerouslySetInnerHTML={{
                __html: t.raw("addOns.options.driverService.tooltip"),
              }}
            />
          </Tooltip>,
          document.body,
        )}
    </>
  );
}
