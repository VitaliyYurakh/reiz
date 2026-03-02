"use client";

import { useMemo, useState } from "react";

type Props = {
  locale: string;
};

type CarClass = "economy" | "business" | "luxury" | "suv";

const PRICE_STEP = 500;
const MIN_TERM = 3;
const MAX_TERM = 36;
const MIN_LOAD = 55;
const MAX_LOAD = 80;

const OWNER_NET_SHARE = 0.58;

const MIN_YIELD_FLOOR = 18;

const classConfig: Record<CarClass, { minPrice: number; maxPrice: number; minYield: number; maxYield: number }> = {
  economy: { minPrice: 10000, maxPrice: 20000, minYield: 18, maxYield: 24 },
  business: { minPrice: 20000, maxPrice: 55000, minYield: 18, maxYield: 25 },
  suv: { minPrice: 25000, maxPrice: 100000, minYield: 18, maxYield: 26 },
  luxury: { minPrice: 40000, maxPrice: 120000, minYield: 18, maxYield: 28 },
};

const copy = {
  ru: {
    price: "Рыночная стоимость авто",
    priceRange: "от {min} до {max}",
    term: "Срок передачи",
    termRange: "от 3 до 36 месяцев",
    termSuffix: "мес.",
    load: "Средняя загрузка авто",
    loadSuffix: "%",
    classLabel: "Класс авто",
    classes: {
      economy: "Эконом",
      business: "Бизнес",
      luxury: "Лакшери",
      suv: "SUV",
    },
    resultTitle: "Ориентировочный чистый доход владельца",
    grossMonthly: "Ориентировочный брутто-доход в месяц",
    opsMonthly: "Операционные расходы и комиссия",
    monthly: "Средняя выплата владельцу в месяц",
    margin: "Маржа владельца (NET/GROSS)",
    annual: "Ориентировочная годовая доходность авто",
    horizon: "Доход за выбранный срок",
    payback: "Ориентировочная окупаемость потоком",
    paybackSuffix: "мес.",
    disclaimer: "",
  },
  uk: {
    price: "Ринкова вартість авто",
    priceRange: "від {min} до {max}",
    term: "Строк передачі",
    termRange: "від 3 до 36 місяців",
    termSuffix: "міс.",
    load: "Середнє завантаження авто",
    loadSuffix: "%",
    classLabel: "Клас авто",
    classes: {
      economy: "Економ",
      business: "Бізнес",
      luxury: "Лакшері",
      suv: "SUV",
    },
    resultTitle: "Орієнтовний чистий дохід власника",
    grossMonthly: "Орієнтовний брутто-дохід на місяць",
    opsMonthly: "Операційні витрати та комісія",
    monthly: "Середня виплата власнику на місяць",
    margin: "Маржа власника (NET/GROSS)",
    annual: "Орієнтовна річна дохідність авто",
    horizon: "Дохід за обраний строк",
    payback: "Орієнтовна окупність потоком",
    paybackSuffix: "міс.",
    disclaimer: "",
  },
  en: {
    price: "Market value of the car",
    priceRange: "from {min} to {max}",
    term: "Management term",
    termRange: "from 3 to 36 months",
    termSuffix: "mo.",
    load: "Average utilization",
    loadSuffix: "%",
    classLabel: "Car class",
    classes: {
      economy: "Economy",
      business: "Business",
      luxury: "Luxury",
      suv: "SUV",
    },
    resultTitle: "Estimated net income for the owner",
    grossMonthly: "Estimated monthly gross revenue",
    opsMonthly: "Operating costs and commission",
    monthly: "Average monthly payout",
    margin: "Owner margin (NET/GROSS)",
    annual: "Estimated annual car yield",
    horizon: "Income for selected term",
    payback: "Estimated cashflow payback",
    paybackSuffix: "mo.",
    disclaimer: "",
  },
  pl: {
    price: "Wartość rynkowa auta",
    priceRange: "od {min} do {max}",
    term: "Okres przekazania",
    termRange: "od 3 do 36 miesięcy",
    termSuffix: "mies.",
    load: "Średnie obłożenie auta",
    loadSuffix: "%",
    classLabel: "Klasa auta",
    classes: {
      economy: "Ekonom",
      business: "Biznes",
      luxury: "Luksus",
      suv: "SUV",
    },
    resultTitle: "Szacunkowy dochód netto właściciela",
    grossMonthly: "Szacunkowy miesięczny przychód brutto",
    opsMonthly: "Koszty operacyjne i prowizja",
    monthly: "Średnia miesięczna wypłata właścicielowi",
    margin: "Marża właściciela (NET/GROSS)",
    annual: "Szacunkowa roczna rentowność auta",
    horizon: "Dochód za wybrany okres",
    payback: "Szacunkowy zwrot z przepływów",
    paybackSuffix: "mies.",
    disclaimer: "",
  },
  ro: {
    price: "Valoarea de piață a mașinii",
    priceRange: "de la {min} la {max}",
    term: "Perioada de predare",
    termRange: "de la 3 la 36 luni",
    termSuffix: "luni",
    load: "Ocupare medie a mașinii",
    loadSuffix: "%",
    classLabel: "Clasa mașinii",
    classes: {
      economy: "Economy",
      business: "Business",
      luxury: "Luxury",
      suv: "SUV",
    },
    resultTitle: "Venitul net estimat al proprietarului",
    grossMonthly: "Venitul brut lunar estimat",
    opsMonthly: "Costuri operaționale și comision",
    monthly: "Plata medie lunară proprietarului",
    margin: "Marja proprietarului (NET/GROSS)",
    annual: "Rentabilitatea anuală estimată a mașinii",
    horizon: "Venit pe perioada selectată",
    payback: "Recuperare estimată din flux",
    paybackSuffix: "luni",
    disclaimer: "",
  },
} as const;

export default function InvestCalculator({ locale }: Props) {
  const [carPrice, setCarPrice] = useState(30000);
  const [term, setTerm] = useState(12);
  const [load, setLoad] = useState(75);
  const [carClass, setCarClass] = useState<CarClass>("business");

  const cfg = classConfig[carClass];

  const localeCode =
    locale === "ru" ? "ru-RU" : locale === "uk" ? "uk-UA" : locale === "pl" ? "pl-PL" : locale === "ro" ? "ro-RO" : "en-US";
  const text = copy[locale as keyof typeof copy] ?? copy.en;

  const moneyFormatter = useMemo(
    () =>
      new Intl.NumberFormat(localeCode, {
        maximumFractionDigits: 0,
      }),
    [localeCode],
  );

  const percentFormatter = useMemo(
    () =>
      new Intl.NumberFormat(localeCode, {
        maximumFractionDigits: 1,
      }),
    [localeCode],
  );

  const clampedPrice = Math.max(cfg.minPrice, Math.min(cfg.maxPrice, carPrice));
  const loadFactor = (load - MIN_LOAD) / (MAX_LOAD - MIN_LOAD);
  const annualYield = Math.max(MIN_YIELD_FLOOR, cfg.minYield + (cfg.maxYield - cfg.minYield) * loadFactor);
  const monthlyNet = (annualYield / 100) * clampedPrice / 12;
  const monthlyGross = monthlyNet / OWNER_NET_SHARE;
  const totalNet = monthlyNet * term;

  const classes: CarClass[] = ["economy", "business", "luxury", "suv"];

  return (
    <div className="invest-calculator">
      <div className="invest-calculator__class">
        <span className="invest-calculator__label">{text.classLabel}</span>
        <div className="invest-calculator__class-list">
          {classes.map((item) => (
            <button
              key={item}
              type="button"
              className={`invest-calculator__class-button${
                carClass === item ? " is-active" : ""
              }`}
              onClick={() => {
                setCarClass(item);
                const c = classConfig[item];
                setCarPrice((prev) => Math.max(c.minPrice, Math.min(c.maxPrice, prev)));
              }}
            >
              {text.classes[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="invest-calculator__controls">
        <label className="invest-calculator__control">
          <span className="invest-calculator__label">{text.price}</span>
          <div className="invest-calculator__value-row">
            <strong>{moneyFormatter.format(clampedPrice)} $</strong>
            <span>
              {text.priceRange
                .replace("{min}", moneyFormatter.format(cfg.minPrice))
                .replace("{max}", moneyFormatter.format(cfg.maxPrice))}
            </span>
          </div>
          <input
            type="range"
            min={cfg.minPrice}
            max={cfg.maxPrice}
            step={PRICE_STEP}
            value={clampedPrice}
            onChange={(e) => setCarPrice(Number(e.target.value))}
          />
        </label>

        <label className="invest-calculator__control">
          <span className="invest-calculator__label">{text.term}</span>
          <div className="invest-calculator__value-row">
            <strong>
              {term} {text.termSuffix}
            </strong>
            <span>{text.termRange}</span>
          </div>
          <input
            type="range"
            min={MIN_TERM}
            max={MAX_TERM}
            step={1}
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
          />
        </label>

        <label className="invest-calculator__control">
          <span className="invest-calculator__label">{text.load}</span>
          <div className="invest-calculator__value-row">
            <strong>
              {load}
              {text.loadSuffix}
            </strong>
            <span>
              {MIN_LOAD}
              {text.loadSuffix} - {MAX_LOAD}
              {text.loadSuffix}
            </span>
          </div>
          <input
            type="range"
            min={MIN_LOAD}
            max={MAX_LOAD}
            step={1}
            value={load}
            onChange={(e) => setLoad(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="invest-calculator__result">
        <div className="invest-calculator__result-main">
          <span className="invest-calculator__result-title">
            {text.resultTitle}
          </span>
          <strong className="invest-calculator__result-value">
            {moneyFormatter.format(monthlyNet)} $
          </strong>
        </div>

        <div className="invest-calculator__result-items">
          <div className="invest-calculator__result-item">
            <span>{text.grossMonthly}</span>
            <b>{moneyFormatter.format(monthlyGross)} $</b>
          </div>
          <div className="invest-calculator__result-item">
            <span>{text.annual}</span>
            <b>{percentFormatter.format(annualYield)}%</b>
          </div>
          <div className="invest-calculator__result-item">
            <span>{text.horizon}</span>
            <b>{moneyFormatter.format(totalNet)} $</b>
          </div>
        </div>

        {text.disclaimer && (
          <p className="invest-calculator__disclaimer">{text.disclaimer}</p>
        )}
      </div>
    </div>
  );
}
