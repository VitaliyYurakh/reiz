"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import Icon from "@/components/Icon";
import CustomSelect2 from "@/app/[locale]/(site)/cars/[idSlug]/components/CustomSelect2";

import styles from "./DatePicker.module.scss";

export type RangeDateTimePickerData = {
  startDate: Date | null;
  endDate: Date | null;
};

export type RangeDateTimePickerResult = {
  startDate: Date;
  endDate: Date;
};

interface DatePickerProps {
  close: () => void;
  data: RangeDateTimePickerData;
  runCallback: (result: RangeDateTimePickerResult) => void;
}

const generateMonthGrid = (date: Date) => {
  const month = date.getMonth();
  const year = date.getFullYear();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const dayOfWeekOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;
  const grid: (Date | null)[] = Array(dayOfWeekOffset).fill(null);
  for (let i = 1; i <= daysInMonth; i++) {
    grid.push(new Date(year, month, i));
  }
  return grid;
};

const isSameDay = (d1: Date, d2: Date) =>
  d1?.getFullYear() === d2?.getFullYear() &&
  d1?.getMonth() === d2?.getMonth() &&
  d1?.getDate() === d2?.getDate();
const isBetween = (date: Date, start: Date, end: Date) =>
  date > start && date < end;

const formatHoursMinutes = (date: Date | null): string => {
  if (!date) return "10:00";
  return `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const formatDate = (date: Date, locale: string): string => {
  const day = date.getDate();
  const monthName = date.toLocaleDateString(locale, { month: "long" });
  const weekdayName = date.toLocaleDateString(locale, { weekday: "short" });
  const capitalize = (value: string) =>
    value.charAt(0).toUpperCase() + value.slice(1);
  return `${day} ${capitalize(monthName)}, ${capitalize(weekdayName)}`;
};

const formatDateWithTime = (date: Date, locale: string): string => {
  return `${formatDate(date, locale)}, ${formatHoursMinutes(date)}`;
};

const availableTime = Array.from({ length: 48 }, (_, i) => {
  const hours = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? "00" : "30";
  return `${String(hours).padStart(2, "0")}:${minutes}`;
});

const addMonths = (base: Date, m: number) =>
  new Date(base.getFullYear(), base.getMonth() + m, 1);

const MOBILE_MONTHS_AHEAD = 12;

const DatePicker: React.FC<DatePickerProps> = ({
  close,
  data,
  runCallback,
}) => {
  const locale = useLocale();
  const t = useTranslations("rangeDateTimePicker");
  const [startDate, setStartDate] = useState<Date | null>(
    data.startDate ?? null,
  );
  const [endDate, setEndDate] = useState<Date | null>(data.endDate ?? null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date());
  const [isMobile, setIsMobile] = useState(false);
  const weekDays = t.raw("weekDays") as string[];
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const isBeforeToday = (d: Date) => {
    const nd = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    return nd.getTime() < today.getTime();
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleDateClick = (_day: Date) => {
    const day = new Date(
      _day.getFullYear(),
      _day.getMonth(),
      _day.getDate(),
      10,
      0,
      0,
      0,
    );
    if (isBeforeToday(day)) return;

    if (!startDate || (startDate && endDate)) {
      setStartDate(day);
      setEndDate(null);
    } else if (day < startDate) {
      setStartDate(day);
    } else {
      setEndDate(day);
    }
  };

  const mobileMonths = useMemo(() => {
    if (!isMobile) return [];
    const start = new Date(today);
    start.setDate(1);
    return Array.from({ length: MOBILE_MONTHS_AHEAD }, (_, i) =>
      addMonths(start, i),
    );
  }, [isMobile, today]);

  const handleReset = () => {
    setStartDate(null);
    setEndDate(null);
  };
  const handlePrevMonth = () =>
    setCurrentMonthDate(
      new Date(
        currentMonthDate.getFullYear(),
        currentMonthDate.getMonth() - 1,
        1,
      ),
    );
  const handleNextMonth = () =>
    setCurrentMonthDate(
      new Date(
        currentMonthDate.getFullYear(),
        currentMonthDate.getMonth() + 1,
        1,
      ),
    );

  const durationInDays = useMemo(() => {
    if (!startDate || !endDate) return 0;
    const diffTime =
      Math.abs(endDate.getTime() - startDate.getTime()) - 3600 * 1000; // 1 hour included
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  }, [startDate, endDate]);

  const renderMonth = (date: Date) => {
    const grid = generateMonthGrid(date);
    const monthName = date.toLocaleDateString(locale, { month: "long" });
    const year = date.getFullYear();
    const capitalize = (value: string) =>
      value.charAt(0).toUpperCase() + value.slice(1);
    return (
      <div className={styles.monthContainer}>
        <div
          className={styles.monthHeader}
        >{`${capitalize(monthName)} ${year}`}</div>
        <div className={styles.weekDays}>
          {weekDays.map((day) => (
            <div key={day}>{day}</div>
          ))}
        </div>
        <div className={styles.daysGrid}>
          {grid.map((day, index) => {
            if (!day)
              return <div key={`empty-${index}`} className={styles.dayCell} />;

            const isSelected =
              (startDate && isSameDay(day, startDate)) ||
              (endDate && isSameDay(day, endDate));
            const isInRange =
              startDate && endDate && isBetween(day, startDate, endDate);
            const isPast = isBeforeToday(day);

            const cellClasses = [
              styles.dayCell,
              styles.day,
              isSelected && styles.selected,
              isInRange && styles.inRange,
              isPast && styles.past,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <div
                key={day.toISOString()}
                className={cellClasses}
                onClick={() => {
                  if (!isPast) handleDateClick(day);
                }}
                aria-disabled={isPast ? true : undefined}
                tabIndex={isPast ? -1 : 0}
              >
                <span>{day.getDate()}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const secondMonthDate = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() + 1,
    1,
  );

  return (
    <div className={styles.datePickerOverlay}>
      <div className={styles.datePickerContainer}>
        <div className={styles.header}>
          <button onClick={handleReset} className={styles.resetButton}>
            {t("reset")}
          </button>
          <h3>{t("title")}</h3>
          <button
            onClick={() => {
              close();
            }}
            className={styles.closeButton}
          >
            <Icon id="cross" width={14} height={14} />
          </button>
        </div>

        <div className={styles.calendars}>
          {isMobile ? (
            <div
              className={styles.monthsScroll}
              role="region"
              aria-label={t("monthsAriaLabel")}
            >
              {mobileMonths.map((m) => (
                <div
                  key={`${m.getFullYear()}-${m.getMonth()}`}
                  className={styles.snapWrapper}
                >
                  {renderMonth(m)}
                </div>
              ))}
            </div>
          ) : (
            <>
              <button
                onClick={handlePrevMonth}
                className={`${styles.navButton} ${styles.prev}`}
              >
                <Icon
                  id="arrow-d2"
                  width={15}
                  height={9}
                  style={{ transform: "rotate(90deg)", display: "block" }}
                />
              </button>

              {renderMonth(currentMonthDate)}
              {renderMonth(secondMonthDate)}

              <button
                onClick={handleNextMonth}
                className={`${styles.navButton} ${styles.next}`}
              >
                <Icon
                  id="arrow-d2"
                  width={15}
                  height={9}
                  style={{ transform: "rotate(-90deg)", display: "block" }}
                />
              </button>
            </>
          )}
        </div>

        <div className={styles.footer}>
          <div
            className={`${styles.dateInfo} ${styles.dateInfoStart}`}
            style={{ width: "191px" }}
          >
            <div className={styles.label}>{t("startDate.label")}</div>
            <div className={styles.dateValue}>
              {startDate ? (
                isMobile ? (
                  <>
                    {formatDate(startDate, locale)}
                    <br />
                    {formatHoursMinutes(startDate)}
                  </>
                ) : (
                  formatDateWithTime(startDate, locale)
                )
              ) : (
                t("notSelected")
              )}
            </div>
          </div>
          <div className={styles.timeControls}>
            <div className={`${styles.dateInfo}`}>
              <div className={styles.label}>{t("startDate.timeLabel")}</div>
              <CustomSelect2
                value={startDate ? formatHoursMinutes(startDate) : "10:00"}
                onChange={(el) => {
                  const [hours, minutes] = el.split(":").map(Number);
                  setStartDate((prev) => {
                    if (!prev) return prev;
                    return new Date(
                      prev.getFullYear(),
                      prev.getMonth(),
                      prev.getDate(),
                      hours,
                      minutes,
                      0,
                      0,
                    );
                  });
                }}
                disabled={!startDate}
                variant={"left"}
                options={availableTime.map((el) => ({ label: el, value: el }))}
              />
            </div>
            <div className={`${styles.dateInfo} ${styles.durationInfo}`}>
              <div className={styles.label} style={{ visibility: "hidden" }}>
                .
              </div>
              <div className={styles.duration}>
                {t("duration", { count: durationInDays || 0 })}
              </div>
            </div>
            <div className={`${styles.dateInfo}`}>
              <div className={styles.label}>{t("endDate.timeLabel")}</div>
              <CustomSelect2
                value={endDate ? formatHoursMinutes(endDate) : "10:00"}
                onChange={(el) => {
                  const [hours, minutes] = el.split(":").map(Number);
                  setEndDate((prev) => {
                    if (!prev) return prev;
                    return new Date(
                      prev.getFullYear(),
                      prev.getMonth(),
                      prev.getDate(),
                      hours,
                      minutes,
                      0,
                      0,
                    );
                  });
                }}
                disabled={!endDate}
                variant={"right"}
                options={availableTime.map((el) => ({ label: el, value: el }))}
              />
            </div>
          </div>
          <div
            className={`${styles.dateInfo} ${styles.dateInfoEnd}`}
            style={{ width: "191px" }}
          >
            <div className={styles.label}>{t("endDate.label")}</div>
            <div className={styles.dateValue}>
              {endDate ? (
                isMobile ? (
                  <>
                    {formatDate(endDate, locale)}
                    <br />
                    {formatHoursMinutes(endDate)}
                  </>
                ) : (
                  formatDateWithTime(endDate, locale)
                )
              ) : (
                t("notSelected")
              )}
            </div>
          </div>
        </div>

        <button
          className={styles.confirmButton}
          onClick={() => {
            if (!startDate || !endDate) return;
            runCallback({ startDate, endDate });
            close();
          }}
          disabled={!startDate || !endDate}
        >
          {t("confirm")}
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
