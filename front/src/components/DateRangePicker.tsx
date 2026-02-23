"use client";

import { useEffect, useRef } from "react";
import "air-datepicker/air-datepicker.css";
import { formatFull } from "@/lib/utils/date-format";

type Mode = "short" | "full";

export interface DateRangePickerProps {
  mode?: Mode;
  placeholder?: string;
  defaultValue?: string;
  onChange?: (value: string, start?: Date, end?: Date) => void;
  className?: string;
  ariaLabel?: string;
}

export default function DateRangePicker({
  mode = "full",
  placeholder,
  defaultValue,
  onChange,
  className,
  ariaLabel,
}: DateRangePickerProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let dp: any;

    (async () => {
      const { default: AirDatepicker } = await import("air-datepicker");

      dp = new AirDatepicker(inputRef.current!, {
        range: true,
        timepicker: mode === "short",
        timeFormat: "HH:mm",
        multipleDates: true,
        autoClose: mode !== "short",
        locale: {
          days: [
            "Воскресенье",
            "Понедельник",
            "Вторник",
            "Среда",
            "Четверг",
            "Пятница",
            "Суббота",
          ],
          daysShort: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          daysMin: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
          months: [
            "января",
            "февраля",
            "марта",
            "апреля",
            "мая",
            "июня",
            "июля",
            "августа",
            "сентября",
            "октября",
            "ноября",
            "декабря",
          ],
          monthsShort: [
            "янв.",
            "февр.",
            "мар.",
            "апр.",
            "мая",
            "июн.",
            "июл.",
            "авг.",
            "сент.",
            "окт.",
            "нояб.",
            "дек.",
          ],
        },
        buttons:
          mode === "short"
            ? [
                {
                  content: "Применить",
                  className: "custom-close-btn",
                  onClick(dp: any) {
                    dp.hide();
                  },
                },
              ]
            : [],
        onSelect: ({ date, datepicker }: any) => {
          if (!Array.isArray(date) || date.length !== 2) return;
          const [start, end] = date as [Date, Date];

          const formatShort = (d: Date) => {
            const day = d.getDate();
            const month = datepicker.locale.monthsShort[d.getMonth()];
            const hh = String(d.getHours()).padStart(2, "0");
            const mm = String(d.getMinutes()).padStart(2, "0");
            return `${day} ${month} ${hh}:${mm}`;
          };
          const value =
            mode === "short"
              ? `${formatShort(start)} — ${formatShort(end)}`
              : `${formatFull(start)} до ${formatFull(end)}`;

          if (inputRef.current) inputRef.current.value = value;
          onChange?.(value, start, end);
        },
      });
    })();

    return () => {
      dp?.destroy?.();
    };
  }, [mode, onChange]);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      defaultValue={defaultValue}
      className={className}
      aria-label={ariaLabel || placeholder || "Select date range"}
    />
  );
}
