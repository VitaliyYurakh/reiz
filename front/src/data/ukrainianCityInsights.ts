import { cityPickupLocations, type CityConfig } from "./cities";

export const UKRAINIAN_CITY_INSIGHT_SLUGS = [
  "rivne",
  "khmelnytskyi",
  "kamianets-podilskyi",
  "drohobych",
  "stryi",
  "sambir",
  "chervonohrad",
  "boryslav",
  "zhovkva",
  "yaremche",
  "kolomyia",
] as const;

type UkrainianCityInsightSlug = (typeof UKRAINIAN_CITY_INSIGHT_SLUGS)[number];

type CityInsightCopy = {
  heading: string;
  routeText: string;
};

const CITY_INSIGHTS: Record<UkrainianCityInsightSlug, CityInsightCopy> = {
  rivne: {
    heading: "Орієнтири для поїздок з Рівного",
    routeText:
      "З Рівного зручно планувати поїздки до Клевані, Дубна та в напрямку Луцька. Якщо маршрут виходить за межі міста, повідомте його під час бронювання, щоб завчасно погодити деталі повернення.",
  },
  khmelnytskyi: {
    heading: "Маршрути Поділлям із Хмельницького",
    routeText:
      "Із Хмельницького часто планують маршрути до Кам'янця-Подільського, Бакоти та Меджибожа. Для такої поїздки корисно заздалегідь оцінити тривалість маршруту, кількість пасажирів і місце для багажу.",
  },
  "kamianets-podilskyi": {
    heading: "Планування маршруту з Кам'янця-Подільського",
    routeText:
      "Кам'янець-Подільський є зручною точкою старту для поїздок до Хотина, Бакоти та інших локацій Поділля. Під час планування виїзду за місто варто одразу вказати передбачуваний час повернення.",
  },
  drohobych: {
    heading: "Поїздки з Дрогобича курортним напрямком",
    routeText:
      "З Дрогобича легко спланувати маршрут до Трускавця, Борислава або Східниці. Якщо поїздка передбачає кілька зупинок, оберіть категорію автомобіля з урахуванням пасажирів і речей.",
  },
  stryi: {
    heading: "Старт маршруту зі Стрия",
    routeText:
      "Зі Стрия зручно рухатися в бік Моршина, Сколе та Карпат. Перед далекою поїздкою повідомте про маршрут у заявці, аби узгодити термін оренди та час повернення автомобіля.",
  },
  sambir: {
    heading: "Напрямки для поїздок із Самбора",
    routeText:
      "Із Самбора можна планувати поїздки до Львова, Дрогобича та в напрямку українсько-польського кордону. Для маршруту з кількома точками зупинки краще завчасно визначити орієнтовний кілометраж і час повернення.",
  },
  chervonohrad: {
    heading: "Планування поїздок із Червонограда",
    routeText:
      "Із Червонограда можна планувати маршрути до Белза, Жовкви, Львова та прикордонних доріг. Завчасно вкажіть маршрут у заявці, якщо автомобіль потрібен не лише для міських справ.",
  },
  boryslav: {
    heading: "Маршрути з Борислава",
    routeText:
      "Борислав зручний для поїздок до Трускавця, Дрогобича та Східниці. Для відпочинкових або сімейних маршрутів зверніть увагу на кількість місць у салоні та обсяг багажника.",
  },
  zhovkva: {
    heading: "Орієнтири для маршруту з Жовкви",
    routeText:
      "Із Жовкви можна спланувати поїздки до Львова, Крехова, Белза або в напрямку Рави-Руської. Якщо плануєте кілька локацій за один день, зазначте це під час бронювання.",
  },
  yaremche: {
    heading: "Гірські маршрути з Яремче",
    routeText:
      "Яремче є зручною точкою для маршрутів до Буковеля, Ворохти та Яблуницького перевалу. Для гірської поїздки заздалегідь визначте склад пасажирів, багаж і тривалість маршруту.",
  },
  kolomyia: {
    heading: "Поїздки з Коломиї Прикарпаттям",
    routeText:
      "Із Коломиї можна планувати маршрути до Косова, Яремче та Чернівців. Коли поїздка виходить за межі міста, повідомте про неї під час бронювання, щоб погодити деталі оренди.",
  },
};

const escapeHtml = (value: string): string =>
  value.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character] ?? character,
  );

const isInsightCity = (slug: string): slug is UkrainianCityInsightSlug =>
  (UKRAINIAN_CITY_INSIGHT_SLUGS as readonly string[]).includes(slug);

const joinUkrainian = (items: string[]): string => {
  if (items.length === 0) return "узгоджена адреса в межах міста";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} та ${items[1]}`;

  return `${items.slice(0, -1).join(", ")} та ${items[items.length - 1]}`;
};

const getPickupPoints = (city: CityConfig): string =>
  joinUkrainian(
    (cityPickupLocations[city.slug] ?? [])
      .map((location) => location.name.uk)
      .filter(Boolean)
      .slice(0, 3)
      .map(escapeHtml),
  );

export function getUkrainianCityInsight(city: CityConfig): string | null {
  if (!isInsightCity(city.slug)) return null;

  const insight = CITY_INSIGHTS[city.slug];
  const cityName = escapeHtml(city.localized.uk.nameLocative);
  const pickupPoints = getPickupPoints(city);

  return `
<div class='editor_title'>${insight.heading}</div>
<div class='editor_text'>У ${cityName} під час бронювання можна назвати зручний орієнтир для подачі: ${pickupPoints}. Остаточну можливість подачі, адресу та час менеджер підтверджує для конкретного замовлення.</div>
<div class='editor_text'>${insight.routeText}</div>
`.trim();
}
