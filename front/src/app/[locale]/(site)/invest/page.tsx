import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import InvestCalculator from "@/app/[locale]/(site)/invest/components/InvestCalculator";
import InvestFaq from "@/app/[locale]/(site)/invest/components/InvestFaq";
import InvestLeadForm from "@/app/[locale]/(site)/invest/components/InvestLeadForm";
import StickyInvestCta from "@/app/[locale]/(site)/invest/components/StickyInvestCta";
import Icon from "@/components/Icon";
import UiImage from "@/components/ui/UiImage";
import { type Locale, locales } from "@/i18n/request";
import { getDefaultPath } from "@/lib/seo";
import { getStaticPageMetadata } from "@/lib/seo-sync";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return getStaticPageMetadata("investPage", locale);
}

type StatItem = { value: string; label: string };

type CompareCard = {
  title: string;
  icon: string;
  yield: string;
  yieldNote?: string;
  payback: string;
  entry: string;
  liquidity: string;
  featured?: boolean;
};

type AssetCard = {
  title: string;
  load: string;
  payout: string;
  text: string;
};

type SafetyBullet = {
  title: string;
  text: string;
  icon: string;
  detailsText?: string;
};
type SafetyGroup = {
  title: string;
  text: string;
  icon: string;
  tone: "insurance" | "operations";
  bullets: SafetyBullet[];
};
type PathStep = { title: string; time: string; text: string; icon: string };
type FaqItem = { question: string; answer: string };

type InvestCopy = {
  breadcrumbCurrent: string;
  hero: {
    tag: string;
    title: string;
    text: string;
    primaryCta: string;
    secondaryCta: string;
    heroAlt: string;
  };
  stats: StatItem[];
  calculator: {
    title: string;
    text: string;
  };
  compare: {
    title: string;
    text: string;
    kicker: string;
    labels: {
      yield: string;
      payback: string;
      entry: string;
      liquidity: string;
    };
    cards: CompareCard[];
  };
  assets: {
    title: string;
    text: string;
    labels: {
      load: string;
      payout: string;
    };
    cards: AssetCard[];
    modelTitle: string;
    model: string[];
  };
  safety: {
    title: string;
    text: string;
    groups: SafetyGroup[];
  };
  path: {
    title: string;
    text: string;
    steps: PathStep[];
  };
  faq: {
    title: string;
    items: FaqItem[];
  };
  apply: {
    title: string;
    text: string;
    bullets: string[];
  };
  stickyCta: string;
};

function BankDepositIcon() {
  return (
    <svg viewBox="0 0 24 24" width={20} height={20} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6.545 13.053c-.48-.08-.96-.19-1.44-.32-.55-.16-1.08-.39-1.59-.74-.09-.07-.19-.14-.31-.22 0 .06.01 1.88 0 2.74-.01.41.12.71.35.96.26.28.57.48.89.64.56.28 1.15.46 1.76.58a10.897 10.897 0 0 0 2.71.19v-.16l-.01-1.52v-.06c0-.13.01-.29 0-.46.01-.28.01-.6.01-.91v-.6c-.22.02-.45.02-.67.02-.57 0-1.14-.04-1.7-.14ZM6.734 7.994c-.61-.09-1.21-.22-1.81-.42-.47-.15-.93-.35-1.36-.64-.11-.08-.23-.17-.36-.26 0 .06.01 1.9 0 2.78 0 .33.09.6.27.83.28.34.61.55.96.73.51.27 1.04.43 1.58.55.52.12 1.05.2 1.59.23.44.03.88.04 1.31.02l-.01-2.27.03.02c-.05-.42.01-.95.33-1.5-.84.07-1.69.04-2.53-.07ZM3.54 5.283c.3.338.655.547 1.023.722.663.315 1.353.488 2.053.6.59.094 1.184.142 1.662.133 1.117.002 2.107-.109 3.082-.4.486-.145.96-.334 1.405-.632.244-.164.472-.356.648-.635a1.05 1.05 0 0 0 0-1.166 1.955 1.955 0 0 0-.276-.338c-.378-.366-.814-.579-1.262-.755-.797-.313-1.617-.466-2.446-.536-1.13-.095-2.257-.047-3.376.2-.608.133-1.204.32-1.771.637-.303.17-.592.37-.824.68-.193.258-.306.552-.225.92.052.234.169.413.308.57ZM20.794 16.617c-.043.032-.065.05-.088.064-.244.157-.482.333-.735.465-.893.47-1.831.688-2.787.816-.579.078-1.159.103-1.74.098a10.21 10.21 0 0 1-1.702-.138 15.969 15.969 0 0 1-1.43-.326 5.157 5.157 0 0 1-1.59-.735c-.1-.07-.198-.143-.313-.225 0 .06.01 1.88-.003 2.748-.006.403.122.701.35.951.262.29.567.483.886.644.57.285 1.16.456 1.76.58.572.115 1.145.18 1.72.201.994.036 1.982-.032 2.96-.263.563-.133 1.116-.312 1.64-.608.3-.169.585-.369.817-.674a1.25 1.25 0 0 0 .256-.802c-.006-.885-.002-2.732-.002-2.796Z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.68 15.15c.271.341.604.554.952.733.51.262 1.04.427 1.58.55.527.121 1.058.195 1.592.23 1.032.067 2.06.012 3.08-.205.621-.133 1.231-.32 1.811-.641.31-.171.606-.376.846-.691.167-.22.256-.475.254-.793-.007-.891-.006-2.744-.008-2.789-.118.084-.222.165-.33.237-.842.564-1.754.823-2.684.99-.433.078-.87.124-1.307.161a11.65 11.65 0 0 1-2.53-.075 9.669 9.669 0 0 1-1.807-.413 5.423 5.423 0 0 1-1.36-.646c-.116-.08-.23-.165-.36-.258 0 .059.005 1.899-.003 2.777-.003.337.091.605.273.833Z"
        fill="#fff"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.486 7.98c-.303.169-.591.37-.823.68-.193.257-.307.55-.225.92.051.233.169.413.307.57.299.337.654.547 1.022.722.664.315 1.354.488 2.053.6a9.882 9.882 0 0 0 1.662.133c1.117.002 2.107-.11 3.082-.4.486-.145.961-.335 1.405-.633.244-.163.473-.355.649-.634a1.052 1.052 0 0 0 0-1.166 2.007 2.007 0 0 0-.277-.338c-.378-.367-.814-.58-1.262-.755-.797-.313-1.617-.467-2.445-.536a11.214 11.214 0 0 0-3.377.199c-.607.134-1.204.32-1.771.638Z"
        fill="#fff"
      />
    </svg>
  );
}

function ApartmentRentIcon() {
  return (
    <svg viewBox="0 0 56 56" width={20} height={20} aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M43.88 18.233a1.915 1.915 0 0 0 1.915-1.914v-.028c0-1.057-.858-1.9-1.915-1.9s-1.914.871-1.914 1.928.857 1.915 1.914 1.915Zm-1.914 9.545c0 1.057.857 1.9 1.914 1.9s1.915-.871 1.915-1.928a1.915 1.915 0 0 0-3.83 0v.028Zm1.914 13.346a1.915 1.915 0 0 0 1.915-1.915v-.028a1.904 1.904 0 0 0-1.915-1.901 1.928 1.928 0 0 0-1.914 1.93c0 1.056.857 1.914 1.914 1.914Zm-9.008-22.89a1.915 1.915 0 0 0 1.914-1.915v-.028c0-1.057-.858-1.9-1.914-1.9-1.057 0-1.915.871-1.915 1.928s.858 1.915 1.915 1.915ZM32.622 5h13.334c3.714 0 6.734 3.022 6.734 6.74v32.24c0 3.717-3.02 6.74-6.734 6.74H37.86c-.674 0-1.048-.839-.682-1.405a9.043 9.043 0 0 0 1.451-4.878V30.87a7.582 7.582 0 0 0-2.923-5.862l-9.494-7.584a.766.766 0 0 1-.288-.598v-5.138C25.924 8 28.931 5 32.623 5Zm-9.554 13.879 10.168 8.125a5.053 5.053 0 0 1 1.965 3.908v13.51a6.584 6.584 0 0 1-1.973 4.684A6.547 6.547 0 0 1 28.602 51h-7.42c-.012 0-.016-.009-.016-.02V40.049a1.915 1.915 0 0 0-3.83 0v10.93c0 .012-.003.021-.015.021H9.947c-3.64 0-6.62-2.951-6.637-6.578V30.96a4.946 4.946 0 0 1 1.998-3.957l10.079-8.115a6.194 6.194 0 0 1 7.68-.01Z"
        fill="#fff"
      />
    </svg>
  );
}

function ReizCompareIcon() {
  return (
    <svg viewBox="0 0 50 50" width={20} height={20} aria-hidden="true">
      <path
        d="M18 0C13.515625 0 10 3.515625 10 8C10 12.484375 13.515625 16 18 16C22.484375 16 26 12.484375 26 8C26 3.515625 22.484375 0 18 0 Z M 30.40625 4C30.210938 4 30.007813 4.046875 29.84375 4.15625L28.6875 4.96875L27.5625 4.15625C27.457031 4.085938 27.34375 4.058594 27.21875 4.03125C27.730469 5.242188 28 6.582031 28 8C28 9.429688 27.707031 10.78125 27.1875 12L37 12C37.265625 12 37.53125 11.90625 37.71875 11.71875L39.71875 9.71875C39.90625 9.53125 40 9.265625 40 9L40 7C40 6.734375 39.90625 6.46875 39.71875 6.28125L37.71875 4.28125C37.53125 4.09375 37.265625 4 37 4L35.3125 4C35.046875 4 34.8125 4.09375 34.625 4.28125L33.5 5.4375L32.375 4.28125C32.1875 4.09375 31.921875 4 31.65625 4 Z M 16 6C17.105469 6 18 6.894531 18 8C18 9.105469 17.105469 10 16 10C14.894531 10 14 9.105469 14 8C14 6.894531 14.894531 6 16 6 Z M 15.6875 18C13.667969 18 11.832031 19.242188 11.09375 21.09375L8.125 28L7 28C5.347656 28 4 29.347656 4 31C4 32.652344 5.347656 34 7 34L7 47C7 48.652344 8.347656 50 10 50L13 50C14.652344 50 16 48.652344 16 47L16 46L34 46L34 47C34 48.652344 35.347656 50 37 50L40 50C41.652344 50 43 48.652344 43 47L43 34C44.652344 34 46 32.652344 46 31C46 29.347656 44.652344 28 43 28L41.875 28L38.9375 21.125C38.191406 19.253906 36.332031 18 34.3125 18 Z M 15.6875 20L34.3125 20C35.523438 20 36.636719 20.765625 37.09375 21.90625L39.90625 28.53125L38.9375 29.1875C38.152344 29.738281 37.234375 30 36.1875 30L13.8125 30C12.765625 30 11.867188 29.71875 11.0625 29.15625L10.09375 28.53125L12.9375 21.875C13.386719 20.757813 14.476563 20 15.6875 20 Z M 14.5 36C15.898438 36 17 37.101563 17 38.5C17 39.898438 15.898438 41 14.5 41C13.101563 41 12 39.898438 12 38.5C12 37.101563 13.101563 36 14.5 36 Z M 35.5 36C36.898438 36 38 37.101563 38 38.5C38 39.898438 36.898438 41 35.5 41C34.101563 41 33 39.898438 33 38.5C33 37.101563 34.101563 36 35.5 36Z"
        fill="currentColor"
      />
    </svg>
  );
}

const COPY: Record<"ru" | "uk" | "en" | "pl" | "ro", InvestCopy> = {
  ru: {
    breadcrumbCurrent: "Передать авто в автопарк",
    hero: {
      tag: "АВТО В УПРАВЛЕНИЕ REIZ",
      title: "Передайте авто в автопарк REIZ и получайте доход каждый месяц",
      text: "Вы передаёте автомобиль, мы берём на себя аренду, сервис, проверку клиентов, страховки и контроль. Вы получаете выплаты владельца по прозрачной модели.",
      primaryCta: "Рассчитать доход авто",
      secondaryCta: "Передать авто",
      heroAlt: "Автопарк REIZ — передайте авто в управление",
    },
    stats: [
      { value: "3-7 дней", label: "до запуска авто в аренду" },
      { value: "До 85%", label: "средняя загрузка в сезон" },
      { value: "КАСКО", label: "полная страховка каждого авто" },
      { value: "24/7", label: "мониторинг и отчётность" },
    ],
    calculator: {
      title: "Калькулятор дохода вашего авто",
      text: "Укажите параметры автомобиля и получите ориентировочный доход владельца.",
    },
    compare: {
      title: "Сравнение: депозит, аренда квартиры и авто с REIZ",
      text: "Если цель — пассивный доход, сравнили три популярные стратегии.",
      kicker: "",
      labels: {
        yield: "Ориентировочная доходность",
        payback: "Порог входа",
        entry: "Операционное участие",
        liquidity: "Ликвидность",
      },
      cards: [
        {
          title: "Банковский депозит",
          icon: "bank-deposit",
          yield: "10-14% в год",
          yieldNote: "Доход в грн, есть риск девальвации",
          payback: "от $1 000",
          entry: "Минимальное",
          liquidity: "Высокая",

        },
        {
          title: "Аренда квартиры",
          icon: "apartment-rent",
          yield: "7-11% в год",
          yieldNote: "Доход зависит от простоев и расходов на обслуживание",
          payback: "от $60 000",
          entry: "Среднее",
          liquidity: "Низкая",

        },
        {
          title: "С REIZ",
          icon: "reiz-compare",
          yield: "18-26% в год*",
          yieldNote: "Выплаты владельцу с привязкой к доллару",
          payback: "Ваш автомобиль",
          entry: "Низкое",
          liquidity: "Средняя",

          featured: true,
        },
      ],
    },
    assets: {
      title: "Какие авто мы принимаем и как работает модель",
      text: "Мы принимаем авто эконом, бизнес, премиум и SUV-сегмента. Для каждого класса подбираем стратегию загрузки, чтобы владелец получал стабильные выплаты.",
      labels: {
        load: "Средняя загрузка",
        payout: "Выплата владельцу",
      },
      cards: [
        {
          title: "Economy",
          load: "79%",
          payout: "$200-300 / мес",
          text: "Высокая частота бронирований и стабильный спрос в течение года.",
        },
        {
          title: "Business",
          load: "76%",
          payout: "$300-500 / мес",
          text: "Оптимальный баланс среднего чека и стабильной загрузки.",
        },
        {
          title: "Premium",
          load: "71%",
          payout: "$800-3 500 / мес",
          text: "Более высокий чек и повышенная маржинальность сегмента.",
        },
        {
          title: "SUV",
          load: "73%",
          payout: "$550-3 500 / мес",
          text: "Стабильный спрос у туристов, семей и корпоративных клиентов.",
        },
      ],
      modelTitle: "Как это работает в 3 шага",
      model: [
        "Вы передаёте авто в управление REIZ.",
        "Мы сдаём авто в аренду и ведём всю операционку.",
        "Вы получаете выплаты владельца по согласованному графику.",
      ],
    },
    safety: {
      title: "Страхование и гарантии владельца",
      text: "Мы разделяем защиту на два уровня: страховой контур и операционный контроль вашего авто.",
      groups: [
        {
          title: "Страховая защита",
          text: "Перед запуском в аренду каждое авто оформляется по полному КАСКО.",
          icon: "shield",
          tone: "insurance",
          bullets: [
            {
              title: "Покрытие серьёзных ДТП и total",
              text: "",
              icon: "t-insurance",
              detailsText:
                "Полис покрывает крупные повреждения и полную гибель авто в рамках условий страхования.",
            },
            {
              title: "Полис активен с первого дня",
              text: "Автомобиль выходит в аренду только после подтверждения страховой защиты.",
              icon: "check-square",
            },
            {
              title: "Сопровождение страхового случая",
              text: "Мы взаимодействуем со страховой и ведём кейс до финального урегулирования.",
              icon: "t-claim-case",
            },
          ],
        },
        {
          title: "Операционные гарантии",
          text: "Контролируем сроки, техническое состояние и прозрачность выплат владельцу.",
          icon: "settings",
          tone: "operations",
          bullets: [
            {
              title: "Официальный договор и выплаты по графику",
              text: "Фиксируем условия передачи, периодичность выплат и ответственность сторон.",
              icon: "t-contract",
            },
            {
              title: "Контроль сроков КАСКО и ТО",
              text: "Отслеживаем даты полисов, сервисов и регламентных работ, чтобы не терять загрузку.",
              icon: "calendar-detail",
            },
            {
              title: "Мониторинг 24/7 и отчётность",
              text: "GPS-трекинг, телеметрия и регулярные отчёты по вашему автомобилю.",
              icon: "crosshair-dark",
            },
          ],
        },
      ],
    },
    path: {
      title: "Путь владельца авто",
      text: "Процесс построен так, чтобы старт был быстрым и понятным, без лишней бюрократии.",
      steps: [
        {
          title: "Заявка на передачу авто",
          time: "1 минута",
          text: "Заявка на передачу авто — контакты и базовые данные.",
          icon: "car-request",
        },
        {
          title: "Оценка и прогноз выплат",
          time: "15-30 минут",
          text: "Оценка авто и прогноз выплат.",
          icon: "car-eval",
        },
        {
          title: "Договор и страховая защита",
          time: "1 день",
          text: "Договор, график выплат и КАСКО.",
          icon: "t-contract",
        },
        {
          title: "Подключение к системе и GPS",
          time: "1 день",
          text: "Подключение к системе проката и GPS-маякам.",
          icon: "crosshair-dark",
        },
        {
          title: "Подготовка и запуск в аренду",
          time: "3-7 дней",
          text: "Фото, размещение и запуск в аренду.",
          icon: "camera",
        },
        {
          title: "Первые выплаты владельцу",
          time: "30-45 дней",
          text: "Первые выплаты и дальше по графику.",
          icon: "wallet-invest",
        },
      ],
    },
    faq: {
      title: "Частые вопросы",
      items: [
        {
          question: "Какого года авто вы принимаете?",
          answer:
            "Мы принимаем относительно новые автомобили — не старше 4 лет. Решение зависит от технического состояния, комплектации и ликвидности модели на рынке аренды.",
        },
        {
          question: "Как часто я получаю выплаты как владелец?",
          answer:
            "Выплаты поступают регулярно по графику, который фиксируется в договоре до запуска авто.",
        },
        {
          question: "Что если произойдёт серьёзное ДТП или total?",
          answer:
            "Риски покрывает полное КАСКО. Полис включает серьёзные ДТП и полную гибель авто (total).",
        },
        {
          question: "Кто обслуживает и контролирует автомобиль?",
          answer:
            "Мы полностью ведём операционку: сервис, осмотры, арендаторов, мониторинг и коммуникацию.",
        },
        {
          question: "Могу ли я пользоваться своим авто?",
          answer:
            "Да, если авто не забронировано. Достаточно заранее уведомить нас, и мы поставим его на паузу в системе на нужный период.",
        },
        {
          question: "Как вы проверяете арендаторов?",
          answer:
            "Каждый арендатор проходит верификацию документов, проверку водительского стажа и историю предыдущих аренд. Авто не передаётся без залога и подписанного договора.",
        },
      ],
    },
    apply: {
      title: "Оставьте заявку на передачу авто",
      text: "Мы оценим ваш автомобиль и предложим прозрачный сценарий сотрудничества.",
      bullets: [
        "Быстрая оценка за 15-30 минут",
        "Понятный график выплат владельцу",
        "Договор и страховая защита с первого дня",
      ],
    },
    stickyCta: "Передать авто",
  },
  uk: {
    breadcrumbCurrent: "Передати авто в автопарк",
    hero: {
      tag: "АВТО В УПРАВЛІННЯ REIZ",
      title: "Передайте авто в управління REIZ і отримуйте дохід щомісяця",
      text: "Ви передаєте автомобіль нам в управління. Ми беремо на себе оренду, сервіс, перевірку клієнтів, страхування та контроль. Ви отримуєте регулярні виплати власника за прозорою моделлю.",
      primaryCta: "Розрахувати дохід авто",
      secondaryCta: "Передати авто",
      heroAlt: "Автопарк REIZ — передайте авто в управління",
    },
    stats: [
      { value: "3-7 днів", label: "до запуску авто в оренду" },
      { value: "До 85%", label: "середнє завантаження в сезон" },
      { value: "КАСКО", label: "повне страхування кожного авто" },
      { value: "24/7", label: "моніторинг і звітність" },
    ],
    calculator: {
      title: "Калькулятор доходу вашого авто",
      text: "Вкажіть параметри автомобіля та отримайте орієнтовний дохід власника.",
    },
    compare: {
      title: "Порівняння: депозит, оренда квартири та авто з REIZ",
      text: "Якщо ціль — пасивний дохід, порівняли три популярні стратегії.",
      kicker: "",
      labels: {
        yield: "Орієнтовна дохідність",
        payback: "Поріг входу",
        entry: "Операційна участь",
        liquidity: "Ліквідність",
      },
      cards: [
        {
          title: "Банківський депозит",
          icon: "bank-deposit",
          yield: "10-14% на рік",
          yieldNote: "Дохід у грн, є ризик девальвації",
          payback: "від $1 000",
          entry: "Мінімальна",
          liquidity: "Висока",

        },
        {
          title: "Оренда квартири",
          icon: "apartment-rent",
          yield: "7-11% на рік",
          yieldNote: "Дохід залежить від простоїв і витрат на утримання",
          payback: "від $60 000",
          entry: "Середня",
          liquidity: "Низька",

        },
        {
          title: "З REIZ",
          icon: "reiz-compare",
          yield: "18-26% на рік*",
          yieldNote: "Виплати власнику з прив'язкою до долара",
          payback: "Ваш автомобіль",
          entry: "Низька",
          liquidity: "Середня",

          featured: true,
        },
      ],
    },
    assets: {
      title: "Які авто ми приймаємо і як працює модель",
      text: "Ми приймаємо авто економ, бізнес, преміум та SUV-сегмента. Для кожного класу підбираємо стратегію завантаження, щоб власник отримував стабільні виплати.",
      labels: {
        load: "Середнє завантаження",
        payout: "Виплата власнику",
      },
      cards: [
        {
          title: "Economy",
          load: "79%",
          payout: "$200-300 / міс",
          text: "Висока частота бронювань і стабільний попит протягом року.",
        },
        {
          title: "Business",
          load: "76%",
          payout: "$300-500 / міс",
          text: "Оптимальний баланс середнього чека і стабільного завантаження.",
        },
        {
          title: "Premium",
          load: "71%",
          payout: "$800-3 500 / міс",
          text: "Вищий середній чек і краща маржинальність сегмента.",
        },
        {
          title: "SUV",
          load: "73%",
          payout: "$550-3 500 / міс",
          text: "Стійкий попит серед туристів, сімей і корпоративних клієнтів.",
        },
      ],
      modelTitle: "Як це працює у 3 кроки",
      model: [
        "Ви передаєте авто в управління REIZ.",
        "Ми здаємо авто в оренду і ведемо всю операційну частину.",
        "Ви отримуєте виплати власника за погодженим графіком.",
      ],
    },
    safety: {
      title: "Страхування та гарантії власника",
      text: "Ми розділяємо захист на два рівні: страховий контур і операційний контроль вашого авто.",
      groups: [
        {
          title: "Страховий захист",
          text: "До запуску в оренду кожне авто оформлюємо за повним КАСКО.",
          icon: "shield",
          tone: "insurance",
          bullets: [
            {
              title: "Покриття серйозних ДТП і total",
              text: "",
              icon: "t-insurance",
              detailsText:
                "Поліс покриває великі пошкодження та повну загибель авто в межах умов страхування.",
            },
            {
              title: "Поліс активний з першого дня",
              text: "Авто виходить в оренду лише після підтвердження страхового покриття.",
              icon: "check-square",
            },
            {
              title: "Супровід страхового випадку",
              text: "Ми комунікуємо зі страховою та ведемо кейс до фінального врегулювання.",
              icon: "t-claim-case",
            },
          ],
        },
        {
          title: "Операційні гарантії",
          text: "Контролюємо строки, технічний стан і прозорість виплат власнику.",
          icon: "settings",
          tone: "operations",
          bullets: [
            {
              title: "Офіційний договір і виплати за графіком",
              text: "Фіксуємо умови передачі, періодичність виплат і відповідальність сторін.",
              icon: "t-contract",
            },
            {
              title: "Контроль строків КАСКО і ТО",
              text: "Відстежуємо дати полісів, сервісів і регламентних робіт, щоб не втрачати завантаження.",
              icon: "calendar-detail",
            },
            {
              title: "Моніторинг 24/7 і звітність",
              text: "GPS-трекінг, телеметрія та регулярні звіти по вашому автомобілю.",
              icon: "crosshair-dark",
            },
          ],
        },
      ],
    },
    path: {
      title: "Шлях власника авто",
      text: "Процес побудований так, щоб старт був швидким і зрозумілим, без зайвої бюрократії.",
      steps: [
        {
          title: "Заявка на передачу авто",
          time: "1 хвилина",
          text: "Заявка на передачу авто.",
          icon: "car-request",
        },
        {
          title: "Оцінка та прогноз виплат",
          time: "15-30 хвилин",
          text: "Оцінка авто та прогноз виплат.",
          icon: "car-eval",
        },
        {
          title: "Договір і страховий захист",
          time: "1 день",
          text: "Договір, графік виплат і КАСКО.",
          icon: "t-contract",
        },
        {
          title: "Підключення до системи і GPS",
          time: "1 день",
          text: "Підключення до системи автопрокату та GPS-маяків.",
          icon: "crosshair-dark",
        },
        {
          title: "Підготовка та запуск в оренду",
          time: "3-7 днів",
          text: "Фото, розміщення на сайті і запуск в оренду.",
          icon: "camera",
        },
        {
          title: "Перші виплати власнику",
          time: "30-45 днів",
          text: "Перші виплати інвестору і далі за графіком.",
          icon: "wallet-invest",
        },
      ],
    },
    faq: {
      title: "Часті питання",
      items: [
        {
          question: "Якого року авто ви приймаєте?",
          answer:
            "Ми приймаємо відносно нові автомобілі — не старші за 4 роки. Рішення залежить від технічного стану, комплектації та ліквідності моделі на ринку оренди.",
        },
        {
          question: "Як часто я отримую виплати як власник?",
          answer:
            "Виплати надходять регулярно за графіком, який фіксується в договорі до запуску авто.",
        },
        {
          question: "Що якщо станеться серйозне ДТП або total?",
          answer:
            "Ризики покриває повне КАСКО. Поліс включає серйозні ДТП і повну загибель авто (total).",
        },
        {
          question: "Хто обслуговує і контролює автомобіль?",
          answer:
            "Ми повністю ведемо операційну частину: сервіс, огляди, орендарів, моніторинг і комунікацію.",
        },
        {
          question: "Чи можу я користуватися своїм авто?",
          answer:
            "Так, якщо авто не заброньоване. Достатньо заздалегідь повідомити нас, і ми поставимо його на паузу в системі на потрібний період.",
        },
        {
          question: "Як ви перевіряєте орендарів?",
          answer:
            "Кожен орендар проходить верифікацію документів, перевірку водійського стажу та історію попередніх оренд. Авто не передається без застави та підписаного договору.",
        },
      ],
    },
    apply: {
      title: "Залиште заявку на передачу авто",
      text: "Ми оцінимо ваш автомобіль і запропонуємо прозорий сценарій співпраці.",
      bullets: [
        "Швидка оцінка за 15-30 хвилин",
        "Зрозумілий графік виплат власнику",
        "Договір і страховий захист з першого дня",
      ],
    },
    stickyCta: "Передати авто",
  },
  en: {
    breadcrumbCurrent: "List Your Car",
    hero: {
      tag: "CAR MANAGEMENT BY REIZ",
      title: "List your car with REIZ and receive monthly owner payouts",
      text: "You hand over the vehicle, we handle rentals, service, screening, insurance, and control. You receive regular owner payouts under a clear model.",
      primaryCta: "Calculate car income",
      secondaryCta: "List your car",
      heroAlt: "REIZ fleet — list your car for management",
    },
    stats: [
      { value: "3-7 days", label: "to launch your car in rentals" },
      { value: "Up to 85%", label: "average peak utilization" },
      { value: "CASCO", label: "full insurance for each car" },
      { value: "24/7", label: "monitoring and reporting" },
    ],
    calculator: {
      title: "Income calculator for your car",
      text: "Set your car parameters and get an estimated owner income.",
    },
    compare: {
      title: "Comparison: bank deposit, apartment rent, and REIZ",
      text: "If your goal is passive income, here are three common strategies.",
      kicker: "",
      labels: {
        yield: "Estimated return",
        payback: "Entry threshold",
        entry: "Operational involvement",
        liquidity: "Liquidity",
      },
      cards: [
        {
          title: "Bank deposit",
          icon: "bank-deposit",
          yield: "10-14% yearly",
          yieldNote: "UAH-denominated, exposed to devaluation risk",
          payback: "from $1,000",
          entry: "Minimal",
          liquidity: "High",

        },
        {
          title: "Apartment rent",
          icon: "apartment-rent",
          yield: "7-11% yearly",
          yieldNote: "Return depends on vacancies and maintenance costs",
          payback: "from $60,000",
          entry: "Medium",
          liquidity: "Low",

        },
        {
          title: "With REIZ",
          icon: "reiz-compare",
          yield: "18-26% yearly*",
          yieldNote: "Owner payouts are USD-linked",
          payback: "Your vehicle",
          entry: "Low",
          liquidity: "Medium",

          featured: true,
        },
      ],
    },
    assets: {
      title: "What cars we accept and how the model works",
      text: "We accept economy, business, premium, and SUV cars. For each class we build the right utilization strategy to keep owner payouts stable.",
      labels: {
        load: "Average utilization",
        payout: "Owner payout",
      },
      cards: [
        {
          title: "Economy",
          load: "79%",
          payout: "$200-300 / mo",
          text: "High booking frequency with steady year-round demand.",
        },
        {
          title: "Business",
          load: "76%",
          payout: "$300-500 / mo",
          text: "A balanced segment with steady utilization and healthy margins.",
        },
        {
          title: "Premium",
          load: "71%",
          payout: "$800-3,500 / mo",
          text: "Higher average ticket with stronger segment-level margin.",
        },
        {
          title: "SUV",
          load: "73%",
          payout: "$550-3,500 / mo",
          text: "Consistent demand from tourists, families, and corporate clients.",
        },
      ],
      modelTitle: "How it works in 3 steps",
      model: [
        "You hand over the car to REIZ management.",
        "We rent it out and handle all operations.",
        "You receive owner payouts on schedule.",
      ],
    },
    safety: {
      title: "Insurance and owner guarantees",
      text: "We split protection into two layers: insurance coverage and day-to-day operational control.",
      groups: [
        {
          title: "Insurance protection",
          text: "Before launch, every car is covered by full CASCO insurance.",
          icon: "shield",
          tone: "insurance",
          bullets: [
            {
              title: "Coverage for severe accidents and total loss",
              text: "",
              icon: "t-insurance",
              detailsText:
                "The policy covers major damage and total loss (total) under insurance terms.",
            },
            {
              title: "Policy active from day one",
              text: "A vehicle is launched only after insurance coverage is fully active.",
              icon: "check-square",
            },
            {
              title: "Claim handling support",
              text: "We coordinate with the insurer and manage the claim through final settlement.",
              icon: "t-claim-case",
            },
          ],
        },
        {
          title: "Operational guarantees",
          text: "We control deadlines, technical condition, and payout transparency for owners.",
          icon: "settings",
          tone: "operations",
          bullets: [
            {
              title: "Official contract and fixed payout schedule",
              text: "We formalize transfer terms, payout frequency, and responsibilities of both sides.",
              icon: "t-contract",
            },
            {
              title: "CASCO and maintenance deadline control",
              text: "We track policy dates, service windows, and routine maintenance to prevent downtime.",
              icon: "calendar-detail",
            },
            {
              title: "24/7 monitoring and reporting",
              text: "GPS tracking, telemetry, and regular owner reports for your vehicle.",
              icon: "crosshair-dark",
            },
          ],
        },
      ],
    },
    path: {
      title: "Car owner journey",
      text: "The flow is designed to be quick and clear, without unnecessary bureaucracy.",
      steps: [
        {
          title: "Submit your listing request",
          time: "1 minute",
          text: "Listing request — contacts and basic car details.",
          icon: "car-request",
        },
        {
          title: "Evaluation and payout forecast",
          time: "15-30 minutes",
          text: "Car evaluation and payout forecast.",
          icon: "car-eval",
        },
        {
          title: "Agreement and insurance protection",
          time: "1 day",
          text: "Agreement, payout schedule, and CASCO.",
          icon: "t-contract",
        },
        {
          title: "Connect to system and GPS",
          time: "1 day",
          text: "Connect to the rental system and GPS beacons.",
          icon: "crosshair-dark",
        },
        {
          title: "Preparation and rental launch",
          time: "3-7 days",
          text: "Photos, listing, and rental launch.",
          icon: "camera",
        },
        {
          title: "First owner payouts",
          time: "30-45 days",
          text: "First payouts, then on schedule.",
          icon: "wallet-invest",
        },
      ],
    },
    faq: {
      title: "Frequently asked questions",
      items: [
        {
          question: "How old can the car be?",
          answer:
            "We accept relatively new vehicles — no older than 4 years. Approval depends on technical condition, trim, and model demand in the rental market.",
        },
        {
          question: "How often do I receive payouts as an owner?",
          answer:
            "Payouts are regular and fixed in the agreement before launch.",
        },
        {
          question: "What if a severe accident or total loss happens?",
          answer: "Full CASCO covers severe accidents and total loss (total).",
        },
        {
          question: "Who handles maintenance and operations?",
          answer:
            "We manage service, inspections, renters, monitoring, and communication.",
        },
        {
          question: "Can I use my own car while it's listed?",
          answer:
            "Yes, as long as it's not booked. Just notify us in advance and we'll pause it in the system for the period you need.",
        },
        {
          question: "How do you screen renters?",
          answer:
            "Every renter goes through document verification, driving experience check, and rental history review. No car is handed over without a deposit and signed agreement.",
        },
      ],
    },
    apply: {
      title: "Submit your car for evaluation",
      text: "We will evaluate your vehicle and offer a transparent cooperation model.",
      bullets: [
        "Fast evaluation in 15-30 minutes",
        "Clear owner payout schedule",
        "Contract and insurance protection from day one",
      ],
    },
    stickyCta: "List your car",
  },
  pl: {
    breadcrumbCurrent: "Przekaż auto do floty",
    hero: {
      tag: "AUTO W ZARZĄDZANIU REIZ",
      title: "Przekaż auto do floty REIZ i otrzymuj dochód co miesiąc",
      text: "Przekazujesz samochód, my zajmujemy się wynajmem, serwisem, weryfikacją klientów, ubezpieczeniem i kontrolą. Ty otrzymujesz regularne wypłaty właściciela według przejrzystego modelu.",
      primaryCta: "Oblicz dochód z auta",
      secondaryCta: "Przekaż auto",
      heroAlt: "Flota REIZ — przekaż auto w zarządzanie",
    },
    stats: [
      { value: "3-7 dni", label: "do uruchomienia auta w wynajmie" },
      { value: "Do 85%", label: "średnie obłożenie w sezonie" },
      { value: "AC/OC", label: "pełne ubezpieczenie każdego auta" },
      { value: "24/7", label: "monitoring i raportowanie" },
    ],
    calculator: {
      title: "Kalkulator dochodu z Twojego auta",
      text: "Podaj parametry samochodu i uzyskaj szacunkowy dochód właściciela.",
    },
    compare: {
      title: "Porównanie: lokata, wynajem mieszkania i auto z REIZ",
      text: "Jeśli celem jest dochód pasywny, porównaliśmy trzy popularne strategie.",
      kicker: "",
      labels: {
        yield: "Szacunkowa rentowność",
        payback: "Próg wejścia",
        entry: "Zaangażowanie operacyjne",
        liquidity: "Płynność",
      },
      cards: [
        {
          title: "Lokata bankowa",
          icon: "bank-deposit",
          yield: "10-14% rocznie",
          yieldNote: "Dochód w UAH, ryzyko dewaluacji",
          payback: "od $1 000",
          entry: "Minimalne",
          liquidity: "Wysoka",
        },
        {
          title: "Wynajem mieszkania",
          icon: "apartment-rent",
          yield: "7-11% rocznie",
          yieldNote: "Dochód zależy od przestojów i kosztów utrzymania",
          payback: "od $60 000",
          entry: "Średnie",
          liquidity: "Niska",
        },
        {
          title: "Z REIZ",
          icon: "reiz-compare",
          yield: "18-26% rocznie*",
          yieldNote: "Wypłaty właścicielowi powiązane z dolarem",
          payback: "Twój samochód",
          entry: "Niskie",
          liquidity: "Średnia",
          featured: true,
        },
      ],
    },
    assets: {
      title: "Jakie auta przyjmujemy i jak działa model",
      text: "Przyjmujemy auta segmentu ekonomicznego, biznesowego, premium i SUV. Dla każdej klasy dobieramy strategię obłożenia, aby właściciel otrzymywał stabilne wypłaty.",
      labels: {
        load: "Średnie obłożenie",
        payout: "Wypłata właścicielowi",
      },
      cards: [
        {
          title: "Economy",
          load: "79%",
          payout: "$200-300 / mies.",
          text: "Wysoka częstotliwość rezerwacji i stabilny popyt przez cały rok.",
        },
        {
          title: "Business",
          load: "76%",
          payout: "$300-500 / mies.",
          text: "Optymalny balans średniego rachunku i stabilnego obłożenia.",
        },
        {
          title: "Premium",
          load: "71%",
          payout: "$800-3 500 / mies.",
          text: "Wyższy średni rachunek i lepsza marżowość segmentu.",
        },
        {
          title: "SUV",
          load: "73%",
          payout: "$550-3 500 / mies.",
          text: "Stały popyt wśród turystów, rodzin i klientów korporacyjnych.",
        },
      ],
      modelTitle: "Jak to działa w 3 krokach",
      model: [
        "Przekazujesz auto w zarządzanie REIZ.",
        "Wynajmujemy auto i prowadzimy całą operację.",
        "Otrzymujesz wypłaty właściciela według uzgodnionego harmonogramu.",
      ],
    },
    safety: {
      title: "Ubezpieczenie i gwarancje właściciela",
      text: "Rozdzielamy ochronę na dwa poziomy: kontur ubezpieczeniowy i kontrola operacyjna Twojego auta.",
      groups: [
        {
          title: "Ochrona ubezpieczeniowa",
          text: "Przed uruchomieniem wynajmu każde auto jest objęte pełnym AC.",
          icon: "shield",
          tone: "insurance",
          bullets: [
            {
              title: "Pokrycie poważnych wypadków i szkody całkowitej",
              text: "",
              icon: "t-insurance",
              detailsText:
                "Polisa pokrywa poważne uszkodzenia i całkowitą utratę auta w ramach warunków ubezpieczenia.",
            },
            {
              title: "Polisa aktywna od pierwszego dnia",
              text: "Auto trafia do wynajmu dopiero po potwierdzeniu ochrony ubezpieczeniowej.",
              icon: "check-square",
            },
            {
              title: "Obsługa szkody ubezpieczeniowej",
              text: "Kontaktujemy się z ubezpieczycielem i prowadzimy sprawę do końcowego rozliczenia.",
              icon: "t-claim-case",
            },
          ],
        },
        {
          title: "Gwarancje operacyjne",
          text: "Kontrolujemy terminy, stan techniczny i przejrzystość wypłat właścicielowi.",
          icon: "settings",
          tone: "operations",
          bullets: [
            {
              title: "Oficjalna umowa i wypłaty według harmonogramu",
              text: "Ustalamy warunki przekazania, częstotliwość wypłat i odpowiedzialność stron.",
              icon: "t-contract",
            },
            {
              title: "Kontrola terminów AC i przeglądów",
              text: "Śledzimy daty polis, serwisów i prac regulaminowych, aby nie tracić obłożenia.",
              icon: "calendar-detail",
            },
            {
              title: "Monitoring 24/7 i raportowanie",
              text: "Śledzenie GPS, telemetria i regularne raporty dotyczące Twojego samochodu.",
              icon: "crosshair-dark",
            },
          ],
        },
      ],
    },
    path: {
      title: "Ścieżka właściciela auta",
      text: "Proces jest zaprojektowany tak, aby start był szybki i czytelny, bez zbędnej biurokracji.",
      steps: [
        {
          title: "Wniosek o przekazanie auta",
          time: "1 minuta",
          text: "Wniosek o przekazanie auta — dane kontaktowe i podstawowe informacje.",
          icon: "car-request",
        },
        {
          title: "Wycena i prognoza wypłat",
          time: "15-30 minut",
          text: "Wycena auta i prognoza wypłat.",
          icon: "car-eval",
        },
        {
          title: "Umowa i ochrona ubezpieczeniowa",
          time: "1 dzień",
          text: "Umowa, harmonogram wypłat i AC.",
          icon: "t-contract",
        },
        {
          title: "Podłączenie do systemu i GPS",
          time: "1 dzień",
          text: "Podłączenie do systemu wynajmu i nadajników GPS.",
          icon: "crosshair-dark",
        },
        {
          title: "Przygotowanie i uruchomienie wynajmu",
          time: "3-7 dni",
          text: "Zdjęcia, publikacja ogłoszenia i uruchomienie wynajmu.",
          icon: "camera",
        },
        {
          title: "Pierwsze wypłaty właścicielowi",
          time: "30-45 dni",
          text: "Pierwsze wypłaty, potem według harmonogramu.",
          icon: "wallet-invest",
        },
      ],
    },
    faq: {
      title: "Często zadawane pytania",
      items: [
        {
          question: "Z jakiego roku przyjmujecie auta?",
          answer:
            "Przyjmujemy stosunkowo nowe samochody — nie starsze niż 4 lata. Decyzja zależy od stanu technicznego, wyposażenia i płynności modelu na rynku wynajmu.",
        },
        {
          question: "Jak często otrzymuję wypłaty jako właściciel?",
          answer:
            "Wypłaty są regularne i ustalone w umowie przed uruchomieniem auta.",
        },
        {
          question: "Co jeśli dojdzie do poważnego wypadku lub szkody całkowitej?",
          answer:
            "Ryzyko pokrywa pełne AC. Polisa obejmuje poważne wypadki i całkowitą utratę auta.",
        },
        {
          question: "Kto obsługuje i kontroluje samochód?",
          answer:
            "Prowadzimy całą operację: serwis, przeglądy, najemców, monitoring i komunikację.",
        },
        {
          question: "Czy mogę korzystać ze swojego auta?",
          answer:
            "Tak, jeśli auto nie jest zarezerwowane. Wystarczy powiadomić nas z wyprzedzeniem, a wstrzymamy je w systemie na potrzebny okres.",
        },
        {
          question: "Jak weryfikujecie najemców?",
          answer:
            "Każdy najemca przechodzi weryfikację dokumentów, sprawdzenie doświadczenia za kierownicą i historii wynajmu. Auto nie jest przekazywane bez kaucji i podpisanej umowy.",
        },
      ],
    },
    apply: {
      title: "Złóż wniosek o przekazanie auta",
      text: "Ocenimy Twój samochód i zaproponujemy przejrzysty scenariusz współpracy.",
      bullets: [
        "Szybka wycena w 15-30 minut",
        "Czytelny harmonogram wypłat właścicielowi",
        "Umowa i ochrona ubezpieczeniowa od pierwszego dnia",
      ],
    },
    stickyCta: "Przekaż auto",
  },
  ro: {
    breadcrumbCurrent: "Predă mașina în flotă",
    hero: {
      tag: "MAȘINĂ ÎN ADMINISTRAREA REIZ",
      title: "Predă mașina flotei REIZ și primește venit în fiecare lună",
      text: "Predai automobilul, noi ne ocupăm de închiriere, service, verificarea clienților, asigurare și control. Tu primești plăți regulate de proprietar conform unui model transparent.",
      primaryCta: "Calculează venitul din mașină",
      secondaryCta: "Predă mașina",
      heroAlt: "Flota REIZ — predă mașina în administrare",
    },
    stats: [
      { value: "3-7 zile", label: "până la lansarea mașinii în închiriere" },
      { value: "Până la 85%", label: "ocupare medie în sezon" },
      { value: "CASCO", label: "asigurare completă pentru fiecare mașină" },
      { value: "24/7", label: "monitorizare și raportare" },
    ],
    calculator: {
      title: "Calculator de venit pentru mașina ta",
      text: "Specifică parametrii automobilului și obține venitul estimat al proprietarului.",
    },
    compare: {
      title: "Comparație: depozit, chirie apartament și mașină cu REIZ",
      text: "Dacă scopul este venitul pasiv, am comparat trei strategii populare.",
      kicker: "",
      labels: {
        yield: "Rentabilitate estimată",
        payback: "Prag de intrare",
        entry: "Implicare operațională",
        liquidity: "Lichiditate",
      },
      cards: [
        {
          title: "Depozit bancar",
          icon: "bank-deposit",
          yield: "10-14% pe an",
          yieldNote: "Venit în UAH, risc de devalorizare",
          payback: "de la $1 000",
          entry: "Minim",
          liquidity: "Ridicată",
        },
        {
          title: "Chirie apartament",
          icon: "apartment-rent",
          yield: "7-11% pe an",
          yieldNote: "Venitul depinde de perioade libere și costuri de întreținere",
          payback: "de la $60 000",
          entry: "Mediu",
          liquidity: "Scăzută",
        },
        {
          title: "Cu REIZ",
          icon: "reiz-compare",
          yield: "18-26% pe an*",
          yieldNote: "Plăți proprietarului legate de dolar",
          payback: "Automobilul tău",
          entry: "Scăzut",
          liquidity: "Medie",
          featured: true,
        },
      ],
    },
    assets: {
      title: "Ce mașini acceptăm și cum funcționează modelul",
      text: "Acceptăm mașini din segmentele economy, business, premium și SUV. Pentru fiecare clasă selectăm strategia de ocupare, astfel încât proprietarul să primească plăți stabile.",
      labels: {
        load: "Ocupare medie",
        payout: "Plată proprietarului",
      },
      cards: [
        {
          title: "Economy",
          load: "79%",
          payout: "$200-300 / lună",
          text: "Frecvență ridicată a rezervărilor și cerere stabilă pe tot parcursul anului.",
        },
        {
          title: "Business",
          load: "76%",
          payout: "$300-500 / lună",
          text: "Echilibru optim între valoarea medie a comenzii și ocuparea stabilă.",
        },
        {
          title: "Premium",
          load: "71%",
          payout: "$800-3 500 / lună",
          text: "Valoare medie mai mare și marjă mai bună a segmentului.",
        },
        {
          title: "SUV",
          load: "73%",
          payout: "$550-3 500 / lună",
          text: "Cerere constantă din partea turiștilor, familiilor și clienților corporativi.",
        },
      ],
      modelTitle: "Cum funcționează în 3 pași",
      model: [
        "Predai mașina în administrarea REIZ.",
        "Noi o dăm în chirie și gestionăm toată operațiunea.",
        "Tu primești plăți de proprietar conform graficului convenit.",
      ],
    },
    safety: {
      title: "Asigurare și garanții pentru proprietar",
      text: "Împărțim protecția în două niveluri: conturul de asigurare și controlul operațional al mașinii tale.",
      groups: [
        {
          title: "Protecție prin asigurare",
          text: "Înainte de lansare, fiecare mașină este acoperită de CASCO complet.",
          icon: "shield",
          tone: "insurance",
          bullets: [
            {
              title: "Acoperire accidente grave și daună totală",
              text: "",
              icon: "t-insurance",
              detailsText:
                "Polița acoperă daune majore și pierderea totală a mașinii conform condițiilor de asigurare.",
            },
            {
              title: "Polița activă din prima zi",
              text: "Mașina intră în închiriere doar după confirmarea protecției de asigurare.",
              icon: "check-square",
            },
            {
              title: "Gestionarea cazului de asigurare",
              text: "Comunicăm cu asigurătorul și gestionăm cazul până la soluționarea finală.",
              icon: "t-claim-case",
            },
          ],
        },
        {
          title: "Garanții operaționale",
          text: "Controlăm termenele, starea tehnică și transparența plăților către proprietar.",
          icon: "settings",
          tone: "operations",
          bullets: [
            {
              title: "Contract oficial și plăți conform graficului",
              text: "Stabilim condițiile de predare, frecvența plăților și responsabilitățile părților.",
              icon: "t-contract",
            },
            {
              title: "Controlul termenelor CASCO și revizie",
              text: "Urmărim datele polițelor, service-urilor și lucrărilor de rutină pentru a nu pierde ocuparea.",
              icon: "calendar-detail",
            },
            {
              title: "Monitorizare 24/7 și raportare",
              text: "Urmărire GPS, telemetrie și rapoarte regulate pentru automobilul tău.",
              icon: "crosshair-dark",
            },
          ],
        },
      ],
    },
    path: {
      title: "Parcursul proprietarului de mașină",
      text: "Procesul este conceput pentru un start rapid și clar, fără birocrație inutilă.",
      steps: [
        {
          title: "Cerere de predare a mașinii",
          time: "1 minut",
          text: "Cerere de predare — date de contact și informații de bază.",
          icon: "car-request",
        },
        {
          title: "Evaluare și prognoza plăților",
          time: "15-30 minute",
          text: "Evaluarea mașinii și prognoza plăților.",
          icon: "car-eval",
        },
        {
          title: "Contract și protecție asigurare",
          time: "1 zi",
          text: "Contract, grafic de plăți și CASCO.",
          icon: "t-contract",
        },
        {
          title: "Conectare la sistem și GPS",
          time: "1 zi",
          text: "Conectarea la sistemul de închiriere și balizele GPS.",
          icon: "crosshair-dark",
        },
        {
          title: "Pregătire și lansare în închiriere",
          time: "3-7 zile",
          text: "Fotografii, publicare și lansare în închiriere.",
          icon: "camera",
        },
        {
          title: "Primele plăți proprietarului",
          time: "30-45 zile",
          text: "Primele plăți, apoi conform graficului.",
          icon: "wallet-invest",
        },
      ],
    },
    faq: {
      title: "Întrebări frecvente",
      items: [
        {
          question: "Din ce an acceptați mașini?",
          answer:
            "Acceptăm mașini relativ noi — nu mai vechi de 4 ani. Decizia depinde de starea tehnică, dotări și cererea modelului pe piața de închiriere.",
        },
        {
          question: "Cât de des primesc plăți ca proprietar?",
          answer:
            "Plățile sunt regulate și stabilite în contract înainte de lansare.",
        },
        {
          question: "Ce se întâmplă dacă are loc un accident grav sau daună totală?",
          answer:
            "Riscurile sunt acoperite de CASCO complet. Polița include accidente grave și pierderea totală a mașinii.",
        },
        {
          question: "Cine se ocupă de întreținere și control?",
          answer:
            "Gestionăm complet operațiunea: service, inspecții, chiriași, monitorizare și comunicare.",
        },
        {
          question: "Pot folosi mașina mea proprie?",
          answer:
            "Da, dacă mașina nu este rezervată. Este suficient să ne anunți din timp, iar noi o vom pune pe pauză în sistem pe perioada necesară.",
        },
        {
          question: "Cum verificați chiriașii?",
          answer:
            "Fiecare chiriaș trece prin verificarea documentelor, verificarea experienței de conducere și istoricul închirierilor anterioare. Mașina nu este predată fără garanție și contract semnat.",
        },
      ],
    },
    apply: {
      title: "Trimite cererea de predare a mașinii",
      text: "Vom evalua automobilul tău și vom propune un scenariu transparent de colaborare.",
      bullets: [
        "Evaluare rapidă în 15-30 minute",
        "Grafic clar de plăți pentru proprietar",
        "Contract și protecție asigurare din prima zi",
      ],
    },
    stickyCta: "Predă mașina",
  },
};

export default async function InvestPage() {
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("investPage");

  const copy = COPY[locale] ?? COPY.en;

  return (
    <div className="rental-section__inner invest-page">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          { href: getDefaultPath("invest"), name: copy.breadcrumbCurrent },
        ]}
      />

      <section className="invest-page__hero">
        <div className="invest-page__hero-content">
          <span className="invest-page__hero-tag">{copy.hero.tag}</span>
          <h1 className="invest-page__hero-title">{copy.hero.title}</h1>
          <p className="invest-page__hero-text">{copy.hero.text}</p>

          <div className="invest-page__hero-actions">
            <a
              href="#invest-calculator"
              className="main-button main-button--black"
            >
              {copy.hero.primaryCta}
            </a>
            <a href="#invest-form" className="main-button main-button--white">
              {copy.hero.secondaryCta}
            </a>
          </div>
        </div>

        <div className="invest-page__hero-media">
          <UiImage
            src="/img/home/card-invest.webp"
            alt={copy.hero.heroAlt}
            width={380}
            height={460}
            hero
          />
        </div>
      </section>

      <section className="invest-page__stats">
        {copy.stats.map((item) => (
          <div key={item.label} className="invest-page__stat-card">
            <span className="invest-page__stat-value">{item.value}</span>
            <span className="invest-page__stat-label">{item.label}</span>
          </div>
        ))}
      </section>

      <section
        className="invest-page__block invest-page__block--calculator"
        id="invest-calculator"
      >
        <div className="invest-page__block-head">
          <h2>{copy.calculator.title}</h2>
          <p>{copy.calculator.text}</p>
        </div>
        <InvestCalculator locale={locale} />
      </section>

      <section className="invest-page__block invest-page__block--compare">
        <div className="invest-page__block-head">
          <h2>{copy.compare.title}</h2>
          <p>{copy.compare.text}</p>
        </div>

        {copy.compare.kicker ? (
          <p className="invest-page__kicker">{copy.compare.kicker}</p>
        ) : null}

        <div className="invest-compare">
          {copy.compare.cards.map((item) => (
            <article
              key={item.title}
              className={`invest-compare__card${item.featured ? " is-featured" : ""}`}
            >
              <div className="invest-compare__head">
                <span className="invest-compare__icon" aria-hidden="true">
                  {item.icon === "bank-deposit" ? (
                    <BankDepositIcon />
                  ) : item.icon === "apartment-rent" ? (
                    <ApartmentRentIcon />
                  ) : item.icon === "reiz-compare" ? (
                    <ReizCompareIcon />
                  ) : (
                    <Icon id={item.icon} width={20} height={20} />
                  )}
                </span>
                <div className="invest-compare__copy">
                  <h3>{item.title}</h3>
                  {item.yieldNote ? (
                    <p className="invest-compare__text">{item.yieldNote}</p>
                  ) : null}
                </div>
              </div>

              <ul className="invest-compare__list">
                <li>
                  <span>{copy.compare.labels.yield}</span>
                  <strong>{item.yield}</strong>
                </li>
                <li>
                  <span>{copy.compare.labels.payback}</span>
                  <strong>{item.payback}</strong>
                </li>
                <li>
                  <span>{copy.compare.labels.entry}</span>
                  <strong>{item.entry}</strong>
                </li>
                <li>
                  <span>{copy.compare.labels.liquidity}</span>
                  <strong>{item.liquidity}</strong>
                </li>
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="invest-page__block invest-page__block--assets">
        <div className="invest-page__block-head">
          <h2>{copy.assets.title}</h2>
          <p>{copy.assets.text}</p>
        </div>

        <div className="invest-assets">
          {copy.assets.cards.map((item) => (
            <article key={item.title} className="invest-assets__card">
              <div className="invest-assets__body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <ul className="invest-assets__meta">
                  <li>
                    <span>{copy.assets.labels.load}</span>
                    <strong>{item.load}</strong>
                  </li>
                  <li>
                    <span>{copy.assets.labels.payout}</span>
                    <strong>{item.payout}</strong>
                  </li>
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="invest-page__block invest-page__block--model">
        <div className="invest-model">
          <h2>{copy.assets.modelTitle}</h2>
          <ol>
            {copy.assets.model.map((item, index) => (
              <li key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="invest-page__block invest-page__block--safety">
        <div className="invest-page__block-head">
          <h2>{copy.safety.title}</h2>
          <p>{copy.safety.text}</p>
        </div>
        <div className="invest-safety__groups">
          {copy.safety.groups.map((group) => (
            <article
              key={group.title}
              className={`invest-safety__group invest-safety__group--${group.tone}`}
            >
              <div className="invest-safety__group-head">
                <span className="invest-safety__group-icon" aria-hidden="true">
                  <Icon id={group.icon} width={20} height={20} />
                </span>
                <div className="invest-safety__group-copy">
                  <h3>{group.title}</h3>
                  <p>{group.text}</p>
                </div>
              </div>

              <div className="invest-safety">
                {group.bullets.map((item) => {
                  const detailsBody = item.detailsText ?? item.text;

                  return (
                    <details key={item.title} className="invest-safety__item">
                      <summary className="invest-safety__summary">
                        <span className="invest-safety__icon" aria-hidden="true">
                          <Icon id={item.icon} width={25} height={25} />
                        </span>
                        <span className="invest-safety__title">{item.title}</span>
                        <span className="invest-safety__toggle" aria-hidden="true" />
                      </summary>

                      {detailsBody ? (
                        <p className="invest-safety__details-text">{detailsBody}</p>
                      ) : null}
                    </details>
                  );
                })}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="invest-page__block invest-page__block--path">
        <div className="invest-page__block-head">
          <h2>{copy.path.title}</h2>
          <p>{copy.path.text}</p>
        </div>

        <ol className="invest-path">
          {copy.path.steps.map((item, index) => (
            <li key={item.title} className="invest-path__card">
              <div className="invest-path__head">
                <span className="invest-path__icon" aria-hidden="true">
                  <Icon id={item.icon} width={28} height={28} />
                </span>
              </div>
              <p className="invest-path__text">
                <span className="invest-path__index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{item.text}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <section className="invest-page__block invest-page__block--faq">
        <div className="invest-page__block-head">
          <h2>{copy.faq.title}</h2>
        </div>

        <InvestFaq
          className="acc invest-page__faq"
          items={copy.faq.items.map((item) => ({
            title: item.question,
            content: item.answer,
          }))}
        />
      </section>

      <section
        className="invest-page__block invest-page__block--apply"
        id="invest-form"
      >
        <div className="invest-page__apply-copy">
          <h2>{copy.apply.title}</h2>
          <p>{copy.apply.text}</p>
          <ul>
            {copy.apply.bullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <InvestLeadForm locale={locale} />
      </section>

      <StickyInvestCta label={copy.stickyCta} href="#invest-form" />
    </div>
  );
}
