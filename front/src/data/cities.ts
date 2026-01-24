// Конфігурація міст для динамічних сторінок оренди авто
// URL формат: /rental-{slug}/

export interface CityConfig {
  // URL slug (rental-kyiv)
  slug: string;
  // Назва міста в називному відмінку
  name: string;
  // Назва міста в місцевому відмінку (у Києві) - legacy, для uk
  nameLocative: string;
  // Локалізовані назви міста
  localized: {
    uk: { name: string; nameLocative: string };
    ru: { name: string; nameLocative: string };
    en: { name: string; nameLocative: string };
  };
  // Координати для Schema.org
  geo: {
    latitude: string;
    longitude: string;
  };
  // Поштовий індекс
  postalCode: string;
  // Область
  region: string;
}

// Локалізовані дані для кожного міста
export interface CityLocalizedData {
  // Meta title
  title: string;
  // Meta description
  metaDescription: string;
  // H1 заголовок
  h1: string;
  // Секція автомобілів
  sectionCars: string;
  // Секція привітання
  sectionWelcome: string;
  // Підзаголовок hero
  subtitle: string;
  // Адреса в футері (опціонально)
  address?: string;
  // Опис у футері (опціонально)
  footerDescription?: string;
  // OG title
  ogTitle: string;
  // OG description
  ogDescription: string;
}

// Базові дані міст (не залежать від локалі)
export const cities: CityConfig[] = [
  {
    slug: "kyiv",
    name: "Київ",
    nameLocative: "Києві",
    localized: {
      uk: { name: "Київ", nameLocative: "Києві" },
      ru: { name: "Киев", nameLocative: "Киеве" },
      en: { name: "Kyiv", nameLocative: "Kyiv" },
    },
    geo: { latitude: "50.4501", longitude: "30.5234" },
    postalCode: "01001",
    region: "Київська область",
  },
  {
    slug: "lviv",
    name: "Львів",
    nameLocative: "Львові",
    localized: {
      uk: { name: "Львів", nameLocative: "Львові" },
      ru: { name: "Львов", nameLocative: "Львове" },
      en: { name: "Lviv", nameLocative: "Lviv" },
    },
    geo: { latitude: "49.8397", longitude: "24.0297" },
    postalCode: "79000",
    region: "Львівська область",
  },
  {
    slug: "ternopil",
    name: "Тернопіль",
    nameLocative: "Тернополі",
    localized: {
      uk: { name: "Тернопіль", nameLocative: "Тернополі" },
      ru: { name: "Тернополь", nameLocative: "Тернополе" },
      en: { name: "Ternopil", nameLocative: "Ternopil" },
    },
    geo: { latitude: "49.5535", longitude: "25.5948" },
    postalCode: "46001",
    region: "Тернопільська область",
  },
  {
    slug: "odesa",
    name: "Одеса",
    nameLocative: "Одесі",
    localized: {
      uk: { name: "Одеса", nameLocative: "Одесі" },
      ru: { name: "Одесса", nameLocative: "Одессе" },
      en: { name: "Odesa", nameLocative: "Odesa" },
    },
    geo: { latitude: "46.4825", longitude: "30.7233" },
    postalCode: "65000",
    region: "Одеська область",
  },
  {
    slug: "dnipro",
    name: "Дніпро",
    nameLocative: "Дніпрі",
    localized: {
      uk: { name: "Дніпро", nameLocative: "Дніпрі" },
      ru: { name: "Днепр", nameLocative: "Днепре" },
      en: { name: "Dnipro", nameLocative: "Dnipro" },
    },
    geo: { latitude: "48.4647", longitude: "35.0462" },
    postalCode: "49000",
    region: "Дніпропетровська область",
  },
  {
    slug: "kharkiv",
    name: "Харків",
    nameLocative: "Харкові",
    localized: {
      uk: { name: "Харків", nameLocative: "Харкові" },
      ru: { name: "Харьков", nameLocative: "Харькове" },
      en: { name: "Kharkiv", nameLocative: "Kharkiv" },
    },
    geo: { latitude: "49.9935", longitude: "36.2304" },
    postalCode: "61000",
    region: "Харківська область",
  },
  {
    slug: "bukovel",
    name: "Буковель",
    nameLocative: "Буковелі",
    localized: {
      uk: { name: "Буковель", nameLocative: "Буковелі" },
      ru: { name: "Буковель", nameLocative: "Буковеле" },
      en: { name: "Bukovel", nameLocative: "Bukovel" },
    },
    geo: { latitude: "48.3607", longitude: "24.4003" },
    postalCode: "78593",
    region: "Івано-Франківська область",
  },
  {
    slug: "truskavets",
    name: "Трускавець",
    nameLocative: "Трускавці",
    localized: {
      uk: { name: "Трускавець", nameLocative: "Трускавці" },
      ru: { name: "Трускавец", nameLocative: "Трускавце" },
      en: { name: "Truskavets", nameLocative: "Truskavets" },
    },
    geo: { latitude: "49.2784", longitude: "23.5064" },
    postalCode: "82200",
    region: "Львівська область",
  },
  {
    slug: "ivano-frankivsk",
    name: "Івано-Франківськ",
    nameLocative: "Івано-Франківську",
    localized: {
      uk: { name: "Івано-Франківськ", nameLocative: "Івано-Франківську" },
      ru: { name: "Ивано-Франковск", nameLocative: "Ивано-Франковске" },
      en: { name: "Ivano-Frankivsk", nameLocative: "Ivano-Frankivsk" },
    },
    geo: { latitude: "48.9226", longitude: "24.7111" },
    postalCode: "76000",
    region: "Івано-Франківська область",
  },
  {
    slug: "skhidnytsia",
    name: "Східниця",
    nameLocative: "Східниці",
    localized: {
      uk: { name: "Східниця", nameLocative: "Східниці" },
      ru: { name: "Сходница", nameLocative: "Сходнице" },
      en: { name: "Skhidnytsia", nameLocative: "Skhidnytsia" },
    },
    geo: { latitude: "49.2667", longitude: "23.4667" },
    postalCode: "82391",
    region: "Львівська область",
  },
  {
    slug: "uzhhorod",
    name: "Ужгород",
    nameLocative: "Ужгороді",
    localized: {
      uk: { name: "Ужгород", nameLocative: "Ужгороді" },
      ru: { name: "Ужгород", nameLocative: "Ужгороде" },
      en: { name: "Uzhhorod", nameLocative: "Uzhhorod" },
    },
    geo: { latitude: "48.6208", longitude: "22.2879" },
    postalCode: "88000",
    region: "Закарпатська область",
  },
  {
    slug: "vinnytsia",
    name: "Вінниця",
    nameLocative: "Вінниці",
    localized: {
      uk: { name: "Вінниця", nameLocative: "Вінниці" },
      ru: { name: "Винница", nameLocative: "Виннице" },
      en: { name: "Vinnytsia", nameLocative: "Vinnytsia" },
    },
    geo: { latitude: "49.2328", longitude: "28.4681" },
    postalCode: "21000",
    region: "Вінницька область",
  },
  {
    slug: "zaporizhzhia",
    name: "Запоріжжя",
    nameLocative: "Запоріжжі",
    localized: {
      uk: { name: "Запоріжжя", nameLocative: "Запоріжжі" },
      ru: { name: "Запорожье", nameLocative: "Запорожье" },
      en: { name: "Zaporizhzhia", nameLocative: "Zaporizhzhia" },
    },
    geo: { latitude: "47.8388", longitude: "35.1396" },
    postalCode: "69000",
    region: "Запорізька область",
  },
  {
    slug: "mukachevo",
    name: "Мукачево",
    nameLocative: "Мукачеві",
    localized: {
      uk: { name: "Мукачево", nameLocative: "Мукачеві" },
      ru: { name: "Мукачево", nameLocative: "Мукачеве" },
      en: { name: "Mukachevo", nameLocative: "Mukachevo" },
    },
    geo: { latitude: "48.4394", longitude: "22.7183" },
    postalCode: "89600",
    region: "Закарпатська область",
  },
  {
    slug: "poltava",
    name: "Полтава",
    nameLocative: "Полтаві",
    localized: {
      uk: { name: "Полтава", nameLocative: "Полтаві" },
      ru: { name: "Полтава", nameLocative: "Полтаве" },
      en: { name: "Poltava", nameLocative: "Poltava" },
    },
    geo: { latitude: "49.5883", longitude: "34.5514" },
    postalCode: "36000",
    region: "Полтавська область",
  },
  {
    slug: "chernivtsi",
    name: "Чернівці",
    nameLocative: "Чернівцях",
    localized: {
      uk: { name: "Чернівці", nameLocative: "Чернівцях" },
      ru: { name: "Черновцы", nameLocative: "Черновцах" },
      en: { name: "Chernivtsi", nameLocative: "Chernivtsi" },
    },
    geo: { latitude: "48.2920", longitude: "25.9358" },
    postalCode: "58000",
    region: "Чернівецька область",
  },
  {
    slug: "boryspil",
    name: "Бориспіль",
    nameLocative: "Борисполі",
    localized: {
      uk: { name: "Бориспіль", nameLocative: "Борисполі" },
      ru: { name: "Борисполь", nameLocative: "Борисполе" },
      en: { name: "Boryspil", nameLocative: "Boryspil" },
    },
    geo: { latitude: "50.3532", longitude: "30.9577" },
    postalCode: "08300",
    region: "Київська область",
  },
  {
    slug: "lutsk",
    name: "Луцьк",
    nameLocative: "Луцьку",
    localized: {
      uk: { name: "Луцьк", nameLocative: "Луцьку" },
      ru: { name: "Луцк", nameLocative: "Луцке" },
      en: { name: "Lutsk", nameLocative: "Lutsk" },
    },
    geo: { latitude: "50.7472", longitude: "25.3254" },
    postalCode: "43000",
    region: "Волинська область",
  },
  {
    slug: "rivne",
    name: "Рівне",
    nameLocative: "Рівному",
    localized: {
      uk: { name: "Рівне", nameLocative: "Рівному" },
      ru: { name: "Ровно", nameLocative: "Ровно" },
      en: { name: "Rivne", nameLocative: "Rivne" },
    },
    geo: { latitude: "50.6199", longitude: "26.2516" },
    postalCode: "33000",
    region: "Рівненська область",
  },
  {
    slug: "khmelnytskyi",
    name: "Хмельницький",
    nameLocative: "Хмельницькому",
    localized: {
      uk: { name: "Хмельницький", nameLocative: "Хмельницькому" },
      ru: { name: "Хмельницкий", nameLocative: "Хмельницком" },
      en: { name: "Khmelnytskyi", nameLocative: "Khmelnytskyi" },
    },
    geo: { latitude: "49.4230", longitude: "26.9871" },
    postalCode: "29000",
    region: "Хмельницька область",
  },
  {
    slug: "kamianets-podilskyi",
    name: "Кам'янець-Подільський",
    nameLocative: "Кам'янці-Подільському",
    localized: {
      uk: { name: "Кам'янець-Подільський", nameLocative: "Кам'янці-Подільському" },
      ru: { name: "Каменец-Подольский", nameLocative: "Каменце-Подольском" },
      en: { name: "Kamianets-Podilskyi", nameLocative: "Kamianets-Podilskyi" },
    },
    geo: { latitude: "48.6744", longitude: "26.5809" },
    postalCode: "32300",
    region: "Хмельницька область",
  },
  {
    slug: "drohobych",
    name: "Дрогобич",
    nameLocative: "Дрогобичі",
    localized: {
      uk: { name: "Дрогобич", nameLocative: "Дрогобичі" },
      ru: { name: "Дрогобыч", nameLocative: "Дрогобыче" },
      en: { name: "Drohobych", nameLocative: "Drohobych" },
    },
    geo: { latitude: "49.3489", longitude: "23.5069" },
    postalCode: "82100",
    region: "Львівська область",
  },
  {
    slug: "stryi",
    name: "Стрий",
    nameLocative: "Стрию",
    localized: {
      uk: { name: "Стрий", nameLocative: "Стрию" },
      ru: { name: "Стрый", nameLocative: "Стрые" },
      en: { name: "Stryi", nameLocative: "Stryi" },
    },
    geo: { latitude: "49.2606", longitude: "23.8536" },
    postalCode: "82400",
    region: "Львівська область",
  },
  {
    slug: "sambir",
    name: "Самбір",
    nameLocative: "Самборі",
    localized: {
      uk: { name: "Самбір", nameLocative: "Самборі" },
      ru: { name: "Самбор", nameLocative: "Самборе" },
      en: { name: "Sambir", nameLocative: "Sambir" },
    },
    geo: { latitude: "49.5181", longitude: "23.2006" },
    postalCode: "81400",
    region: "Львівська область",
  },
  {
    slug: "chervonohrad",
    name: "Червоноград",
    nameLocative: "Червонограді",
    localized: {
      uk: { name: "Червоноград", nameLocative: "Червонограді" },
      ru: { name: "Червоноград", nameLocative: "Червонограде" },
      en: { name: "Chervonohrad", nameLocative: "Chervonohrad" },
    },
    geo: { latitude: "50.3872", longitude: "24.2286" },
    postalCode: "80100",
    region: "Львівська область",
  },
  {
    slug: "boryslav",
    name: "Борислав",
    nameLocative: "Бориславі",
    localized: {
      uk: { name: "Борислав", nameLocative: "Бориславі" },
      ru: { name: "Борислав", nameLocative: "Бориславе" },
      en: { name: "Boryslav", nameLocative: "Boryslav" },
    },
    geo: { latitude: "49.2867", longitude: "23.4311" },
    postalCode: "82300",
    region: "Львівська область",
  },
  {
    slug: "zhovkva",
    name: "Жовква",
    nameLocative: "Жовкві",
    localized: {
      uk: { name: "Жовква", nameLocative: "Жовкві" },
      ru: { name: "Жолква", nameLocative: "Жолкве" },
      en: { name: "Zhovkva", nameLocative: "Zhovkva" },
    },
    geo: { latitude: "50.0547", longitude: "23.9714" },
    postalCode: "80300",
    region: "Львівська область",
  },
  {
    slug: "yaremche",
    name: "Яремче",
    nameLocative: "Яремчі",
    localized: {
      uk: { name: "Яремче", nameLocative: "Яремчі" },
      ru: { name: "Яремче", nameLocative: "Яремче" },
      en: { name: "Yaremche", nameLocative: "Yaremche" },
    },
    geo: { latitude: "48.4500", longitude: "24.5500" },
    postalCode: "78500",
    region: "Івано-Франківська область",
  },
  {
    slug: "kolomyia",
    name: "Коломия",
    nameLocative: "Коломиї",
    localized: {
      uk: { name: "Коломия", nameLocative: "Коломиї" },
      ru: { name: "Коломыя", nameLocative: "Коломые" },
      en: { name: "Kolomyia", nameLocative: "Kolomyia" },
    },
    geo: { latitude: "48.5310", longitude: "25.0339" },
    postalCode: "78200",
    region: "Івано-Франківська область",
  },
  {
    slug: "kalush",
    name: "Калуш",
    nameLocative: "Калуші",
    localized: {
      uk: { name: "Калуш", nameLocative: "Калуші" },
      ru: { name: "Калуш", nameLocative: "Калуше" },
      en: { name: "Kalush", nameLocative: "Kalush" },
    },
    geo: { latitude: "49.0430", longitude: "24.3600" },
    postalCode: "77300",
    region: "Івано-Франківська область",
  },
  {
    slug: "nadvirna",
    name: "Надвірна",
    nameLocative: "Надвірній",
    localized: {
      uk: { name: "Надвірна", nameLocative: "Надвірній" },
      ru: { name: "Надворная", nameLocative: "Надворной" },
      en: { name: "Nadvirna", nameLocative: "Nadvirna" },
    },
    geo: { latitude: "48.6340", longitude: "24.5790" },
    postalCode: "78400",
    region: "Івано-Франківська область",
  },
  {
    slug: "kosiv",
    name: "Косів",
    nameLocative: "Косові",
    localized: {
      uk: { name: "Косів", nameLocative: "Косові" },
      ru: { name: "Косов", nameLocative: "Косове" },
      en: { name: "Kosiv", nameLocative: "Kosiv" },
    },
    geo: { latitude: "48.3100", longitude: "25.0950" },
    postalCode: "78600",
    region: "Івано-Франківська область",
  },
  {
    slug: "chortkiv",
    name: "Чортків",
    nameLocative: "Чорткові",
    localized: {
      uk: { name: "Чортків", nameLocative: "Чорткові" },
      ru: { name: "Чортков", nameLocative: "Чорткове" },
      en: { name: "Chortkiv", nameLocative: "Chortkiv" },
    },
    geo: { latitude: "49.0160", longitude: "25.7980" },
    postalCode: "48500",
    region: "Тернопільська область",
  },
  {
    slug: "kremenets",
    name: "Кременець",
    nameLocative: "Кременці",
    localized: {
      uk: { name: "Кременець", nameLocative: "Кременці" },
      ru: { name: "Кременец", nameLocative: "Кременце" },
      en: { name: "Kremenets", nameLocative: "Kremenets" },
    },
    geo: { latitude: "50.1030", longitude: "25.7250" },
    postalCode: "47000",
    region: "Тернопільська область",
  },
  {
    slug: "berehove",
    name: "Берегове",
    nameLocative: "Береговому",
    localized: {
      uk: { name: "Берегове", nameLocative: "Береговому" },
      ru: { name: "Берегово", nameLocative: "Берегово" },
      en: { name: "Berehove", nameLocative: "Berehove" },
    },
    geo: { latitude: "48.2050", longitude: "22.6440" },
    postalCode: "90200",
    region: "Закарпатська область",
  },
  {
    slug: "khust",
    name: "Хуст",
    nameLocative: "Хусті",
    localized: {
      uk: { name: "Хуст", nameLocative: "Хусті" },
      ru: { name: "Хуст", nameLocative: "Хусте" },
      en: { name: "Khust", nameLocative: "Khust" },
    },
    geo: { latitude: "48.1700", longitude: "23.2890" },
    postalCode: "90400",
    region: "Закарпатська область",
  },
  {
    slug: "rakhiv",
    name: "Рахів",
    nameLocative: "Рахові",
    localized: {
      uk: { name: "Рахів", nameLocative: "Рахові" },
      ru: { name: "Рахов", nameLocative: "Рахове" },
      en: { name: "Rakhiv", nameLocative: "Rakhiv" },
    },
    geo: { latitude: "48.0550", longitude: "24.2060" },
    postalCode: "90600",
    region: "Закарпатська область",
  },
];

// Локалізовані тексти для кожного міста
// Ключ: slug, значення: об'єкт з локалями
export const cityLocalizations: Record<
  string,
  Record<"uk" | "ru" | "en", CityLocalizedData>
> = {
  kyiv: {
    uk: {
      title: "Оренда авто Київ: Прокат машин без водія | Доступні ціни | Подача на Вокзал",
      metaDescription:
        "Шукаєте прокат авто в Києві? ⭐ Без прихованих платежів. ⚡ Подача на Центральний залізничний вокзал та в центр (Печерськ, Поділ). 🚗 Автопарк 2023-2025. 🛡️ Повне КАСКО. Бронюйте онлайн!",
      h1: "Оренда авто у Києві",
      sectionCars: "Автопарк REIZ у Києві: від комфорту до преміум-класу",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ КИЇВ",
      subtitle:
        "Оренда авто у Києві від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      address: "Київ: Персональна подача (Аеропорти / Вокзал / Місто)",
      ogTitle: "Оренда авто Київ: Прокат машин без водія | Доступні ціни | Подача на Вокзал",
      ogDescription:
        "Шукаєте прокат авто в Києві? ⭐ Без прихованих платежів. ⚡ Подача на Центральний залізничний вокзал та в центр (Печерськ, Поділ). 🚗 Автопарк 2023-2025. 🛡️ Повне КАСКО. Бронюйте онлайн!",
    },
    ru: {
      title: "Аренда авто в Киеве без залога — Аэропорт Борисполь 24/7",
      metaDescription:
        "Прокат авто в Киеве официально. Подача в аэропорт Борисполь и по городу 24/7. Новые машины. Быстрое оформление. Бронируйте онлайн!",
      h1: "Аренда авто в Киеве",
      sectionCars: "Автопарк REIZ в Киеве: от комфорта до премиум-класса",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ КИЕВ",
      subtitle:
        "Аренда авто в Киеве от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      address: "Киев: Персональная подача (Аэропорты / Вокзал / Город)",
      ogTitle: "Аренда авто в Киеве без залога — Аэропорт Борисполь 24/7",
      ogDescription:
        "Прокат авто в Киеве официально. Подача в аэропорт Борисполь и по городу 24/7. Новые машины. Быстрое оформление. Бронируйте онлайн!",
    },
    en: {
      title: "Car Rental Kyiv: Rent a Car | Best Prices | Railway Station Pickup",
      metaDescription:
        "Best car rental in Kyiv (Kiev). ⭐ New fleet 2023-2025. ⚡ Delivery to Railway Station and City Center hotels. 🛡️ Full insurance & English support. Book now!",
      h1: "Car Rental in Kyiv",
      sectionCars: "REIZ fleet in Kyiv: from comfort to premium class",
      sectionWelcome: "WELCOME TO REIZ KYIV",
      subtitle:
        "Car rental in Kyiv from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      address: "Kyiv: Personal Delivery (Airports / Railway / City)",
      ogTitle: "Car Rental Kyiv: Rent a Car | Best Prices | Railway Station Pickup",
      ogDescription:
        "Best car rental in Kyiv (Kiev). ⭐ New fleet 2023-2025. ⚡ Delivery to Railway Station and City Center hotels. 🛡️ Full insurance & English support. Book now!",
    },
  },
  lviv: {
    uk: {
      title: "Оренда авто Львів: Прокат біля Вокзалу | Виїзд за кордон (Зелена карта)",
      metaDescription:
        "Прокат авто у Львові. 🚗 Подача на залізничний вокзал. 🌍 Авто для виїзду за кордон (Польща, Європа). ⭐ Оренда без застави (опція). 🏔️ Поїздки в Карпати.",
      h1: "Оренда авто у Львові",
      sectionCars: "АВТОМОБІЛІ REIZ У ЛЬВОВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЛЬВІВ",
      subtitle:
        "Прокат авто у Львові без застави. Подача в аеропорт LWO, на вокзал або за адресою. Оформлення за 15 хвилин.",
      address: "Міжнародний аеропорт «Львів» ім. Данила Галицького",
      ogTitle: "Оренда авто Львів: Прокат біля Вокзалу | Виїзд за кордон (Зелена карта)",
      ogDescription:
        "Прокат авто у Львові. 🚗 Подача на залізничний вокзал. 🌍 Авто для виїзду за кордон (Польща, Європа). ⭐ Оренда без застави (опція). 🏔️ Поїздки в Карпати.",
    },
    ru: {
      title: "Аренда авто Львов | Оформление за 15 минут 24/7 | REIZ",
      metaDescription:
        "Минимум документов, быстрая выдача авто. Официальный договор, возможен безналичный расчет. Авто бизнес и эконом-класса в наличии.",
      h1: "Аренда авто во Львове",
      sectionCars: "АВТОМОБИЛИ REIZ ВО ЛЬВОВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЛЬВОВ",
      subtitle:
        "Прокат авто во Львове без залога. Подача в аэропорт LWO, на вокзал или по адресу. Оформление за 15 минут.",
      address: "Международный аэропорт «Львов» им. Данила Галицкого",
      ogTitle: "Аренда авто Львов | Оформление за 15 минут 24/7 | REIZ",
      ogDescription:
        "Минимум документов, быстрая выдача авто. Официальный договор, возможен безналичный расчет. Авто бизнес и эконом-класса в наличии.",
    },
    en: {
      title: "Car Rental Lviv: Railway Station Pick-up | Cross-Border Rentals",
      metaDescription:
        "Rent a car in Lviv. 🚗 Perfect for trips to Carpathians or Poland. ⚡ 24/7 Railway station delivery. ⭐ SUV and Economy cars. Transparent documents for border crossing.",
      h1: "Car Rental in Lviv — No Deposit & 24/7 Delivery",
      sectionCars: "REIZ CARS IN LVIV",
      sectionWelcome: "WELCOME TO REIZ LVIV",
      subtitle:
        "Car rental in Lviv with no deposit. Delivery to LWO airport, train station or your address. 15-minute paperwork.",
      address: "Danylo Halytskyi International Airport Lviv",
      ogTitle: "Car Rental Lviv: Railway Station Pick-up | Cross-Border Rentals",
      ogDescription:
        "Rent a car in Lviv. 🚗 Perfect for trips to Carpathians or Poland. ⚡ 24/7 Railway station delivery. ⭐ SUV and Economy cars. Transparent documents for border crossing.",
    },
  },
  ternopil: {
    uk: {
      title: "Оренда авто у Тернополі без застави — Швидка видача",
      metaDescription:
        "Прокат авто у Тернополі офіційно. Нові машини. Безкоштовна подача по місту та на вокзал 24/7. Швидке оформлення. Бронюйте!",
      h1: "Оренда авто у Тернополі",
      sectionCars: "АВТОМОБІЛІ REIZ У ТЕРНОПОЛІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ТЕРНОПІЛЬ",
      subtitle:
        "Прокат авто у Тернополі без застави. Подача на вокзал, автостанцію або за адресою 24/7. Економ та бізнес-клас.",
      ogTitle: "Оренда авто Тернопіль без водія — REIZ | Швидка видача",
      ogDescription:
        "Прокат авто у Тернополі. Без застави. Нові авто. Безкоштовна подача по місту. Швидке оформлення 24/7.",
    },
    ru: {
      title: "Аренда авто в Тернополе без залога — Быстрая выдача",
      metaDescription:
        "Прокат авто в Тернополе официально. Новые машины. Бесплатная подача по городу и на вокзал 24/7. Быстрое оформление. Бронируйте!",
      h1: "Аренда авто в Тернополе",
      sectionCars: "АВТОМОБИЛИ REIZ В ТЕРНОПОЛЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ТЕРНОПОЛЬ",
      subtitle:
        "Прокат авто в Тернополе без залога. Подача на вокзал, автостанцию или по адресу 24/7. Эконом и бизнес-класс.",
      ogTitle: "Аренда авто Тернополь без водителя — REIZ | Быстрая выдача",
      ogDescription:
        "Прокат авто в Тернополе. Без залога. Новые авто. Бесплатная подача по городу. Быстрое оформление 24/7.",
    },
    en: {
      title: "Car Rental Ternopil — No Deposit, Fast Pickup",
      metaDescription:
        "Rent a car in Ternopil officially. New fleet. Free city and station delivery 24/7. Fast paperwork. Book now!",
      h1: "Car Rental in Ternopil",
      sectionCars: "REIZ CARS IN TERNOPIL",
      sectionWelcome: "WELCOME TO REIZ TERNOPIL",
      subtitle:
        "Car rental in Ternopil with no deposit. Delivery to train station, bus station or your address 24/7. Economy and business class.",
      ogTitle: "Car Rental Ternopil — REIZ | No Deposit, Fast Pickup",
      ogDescription:
        "Rent a car in Ternopil. No deposit. New fleet. Free city delivery. Fast paperwork 24/7.",
    },
  },
  odesa: {
    uk: {
      title: "Оренда авто Одеса: Прокат машин Центр, Таїрове, Аркадія | Бізнес клас",
      metaDescription:
        "Прокат авто в Одесі. 🌊 Найкращі ціни на бізнес-клас. 🚗 Подача в Аркадію та Центр. ⚡ Швидке оформлення. 🛡️ Страховка включена. Оренда без водія подобово.",
      h1: "Оренда авто в Одесі — без застави та подача 24/7",
      sectionCars: "Автопарк REIZ в Одесі: від комфорту до преміум-класу",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ОДЕСА",
      subtitle:
        "Прокат авто в Одесі без застави. Подача в аеропорт ODS, на Аркадію, в порт або за адресою. Кабріолети та позашляховики.",
      ogTitle: "Оренда авто Одеса: Прокат машин Центр, Таїрове, Аркадія | Бізнес клас",
      ogDescription:
        "Прокат авто в Одесі. 🌊 Найкращі ціни на бізнес-клас. 🚗 Подача в Аркадію та Центр. ⚡ Швидке оформлення. 🛡️ Страховка включена. Оренда без водія подобово.",
    },
    ru: {
      title: "Аренда авто в Одессе без залога — Подача по адресу 24/7",
      metaDescription:
        "Прокат авто в Одессе официально. Подача по городу, аэропорт 24/7. Новые машины. Эконом и внедорожники. Бронируйте!",
      h1: "Аренда авто в Одессе",
      sectionCars: "Автопарк REIZ в Одессе: от комфорта до премиум-класса",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ОДЕССА",
      subtitle:
        "Прокат авто в Одессе без залога. Подача в аэропорт ODS, на Аркадию, в порт или по адресу. Кабриолеты и внедорожники.",
      ogTitle: "Аренда авто в Одессе без залога — Подача по адресу 24/7",
      ogDescription:
        "Прокат авто в Одессе официально. Подача по городу, аэропорт 24/7. Новые машины. Эконом и внедорожники. Бронируйте!",
    },
    en: {
      title: "Car Rental Odesa: City Center & Arcadia | Business Class",
      metaDescription:
        "Rent a car in Odesa. 🌊 Luxury and Economy cars. ⚡ Fast booking in Arcadia & Center. 🛡️ Insurance included. Flexible terms for long-term rental.",
      h1: "Car Rental in Odesa — No Deposit & 24/7 Delivery",
      sectionCars: "REIZ fleet in Odesa: from comfort to premium class",
      sectionWelcome: "WELCOME TO REIZ ODESA",
      subtitle:
        "Car rental in Odesa with no deposit. Delivery to ODS airport, Arcadia beach, port or your address. Convertibles and SUVs available.",
      ogTitle: "Car Rental Odesa: City Center & Arcadia | Business Class",
      ogDescription:
        "Rent a car in Odesa. 🌊 Luxury and Economy cars. ⚡ Fast booking in Arcadia & Center. 🛡️ Insurance included. Flexible terms for long-term rental.",
    },
  },
  dnipro: {
    uk: {
      title: "Оренда авто Дніпро: Прокат без водія | Позашляховики та Пікапи",
      metaDescription:
        "Оренда авто в Дніпрі. 🏭 Авто для бізнесу та волонтерів. 🚙 Позашляховики 4х4. ⚡ Працюємо з ПДВ для юр. осіб. 🛡️ Технічно справні авто.",
      h1: "Оренда авто у Дніпрі",
      sectionCars: "Автопарк REIZ у Дніпрі: від комфорту до преміум-класу",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ДНІПРО",
      subtitle:
        "Прокат авто у Дніпрі без застави для ділових поїздок. Подача в аеропорт DNK та по місту. Бізнес-клас та довгострокова оренда.",
      footerDescription:
        "Це надійний сервіс оренди автомобілів у Дніпрі: оренда авто без водія, прокат бізнес-класу та позашляховиків, подача в аеропорт DNK, на залізничний вокзал або в центр міста. Підтримка 24/7 і прозорі тарифи.",
      ogTitle: "Оренда авто Дніпро: Прокат без водія | Позашляховики та Пікапи",
      ogDescription:
        "Оренда авто в Дніпрі. 🏭 Авто для бізнесу та волонтерів. 🚙 Позашляховики 4х4. ⚡ Працюємо з ПДВ для юр. осіб. 🛡️ Технічно справні авто.",
    },
    ru: {
      title: "Аренда авто в Днепре без залога — Деловые поездки",
      metaDescription:
        "Прокат авто в Днепре официально. Идеально для деловых поездок. Новые автомобили. Подача в аэропорт и по городу 24/7. Бронируйте онлайн!",
      h1: "Аренда авто в Днепре",
      sectionCars: "Автопарк REIZ в Днепре: от комфорта до премиум-класса",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ДНЕПР",
      subtitle:
        "Прокат авто в Днепре без залога для деловых поездок. Подача в аэропорт DNK и по городу. Бизнес-класс и долгосрочная аренда.",
      footerDescription:
        "Это надежный сервис аренды автомобилей в Днепре: аренда авто без водителя, прокат бизнес-класса и внедорожников, подача в аэропорт DNK, на железнодорожный вокзал или в центр города. Поддержка 24/7 и прозрачные тарифы.",
      ogTitle: "Аренда авто в Днепре без залога — Деловые поездки",
      ogDescription:
        "Прокат авто в Днепре официально. Идеально для деловых поездок. Новые автомобили. Подача в аэропорт и по городу 24/7. Бронируйте онлайн!",
    },
    en: {
      title: "Car Rental Dnipro: SUV & Pickup Rental | Business Services",
      metaDescription:
        "Car rental services in Dnipro. 🏭 Reliable fleet for business and industrial needs. 🚙 4x4 SUVs available. ⚡ VAT invoices for companies.",
      h1: "Car Rental in Dnipro",
      sectionCars: "REIZ fleet in Dnipro: from comfort to premium class",
      sectionWelcome: "WELCOME TO REIZ DNIPRO",
      subtitle:
        "Car rental in Dnipro with no deposit for business trips. Delivery to DNK airport and city-wide. Business class and long-term rental.",
      footerDescription:
        "This is a reliable car rental service in Dnipro: self-drive rentals, business-class and SUV hire, delivery to DNK airport, the railway station, or the city center. 24/7 support and transparent rates.",
      ogTitle: "Car Rental Dnipro: SUV & Pickup Rental | Business Services",
      ogDescription:
        "Car rental services in Dnipro. 🏭 Reliable fleet for business and industrial needs. 🚙 4x4 SUVs available. ⚡ VAT invoices for companies.",
    },
  },
  kharkiv: {
    uk: {
      title: "Оренда авто Харків: Прокат машин Вокзал | Безпечний сервіс",
      metaDescription:
        "Прокат авто у Харкові. ⚡ Подача на Південний вокзал. 🚗 Економ та Середній клас. 🛡️ Гнучкі умови повернення. Ми працюємо!",
      h1: "Оренда авто у Харкові",
      sectionCars: "Автопарк REIZ у Харкові: від комфорту до преміум-класу",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ХАРКІВ",
      subtitle:
        "Прокат авто у Харкові без застави. Подача на вокзал, в аеропорт HRK або за адресою 24/7. Бізнес та SUV-клас.",
      footerDescription:
        "Це надійний сервіс оренди автомобілів у Харкові: оренда авто без водія, прокат бізнес-класу та позашляховиків, подача на залізничний вокзал, в аеропорт HRK або за адресою. Підтримка 24/7 і прозорі тарифи.",
      ogTitle: "Оренда авто Харків: Прокат машин Вокзал | Безпечний сервіс",
      ogDescription:
        "Прокат авто у Харкові. ⚡ Подача на Південний вокзал. 🚗 Економ та Середній клас. 🛡️ Гнучкі умови повернення. Ми працюємо!",
    },
    ru: {
      title: "Аренда авто в Харькове без залога — Трансфер по городу",
      metaDescription:
        "Прокат авто в Харькове официально. Подача на вокзал и по городу 24/7. Новые машины. Быстрое оформление. Бронируйте!",
      h1: "Аренда авто в Харькове",
      sectionCars: "Автопарк REIZ в Харькове: от комфорта до премиум-класса",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ХАРЬКОВ",
      subtitle:
        "Прокат авто в Харькове без залога. Подача на вокзал, в аэропорт HRK или по адресу 24/7. Бизнес и SUV-класс.",
      footerDescription:
        "Это надежный сервис аренды автомобилей в Харькове: аренда авто без водителя, прокат бизнес-класса и внедорожников, подача на железнодорожный вокзал, в аэропорт HRK или по адресу. Поддержка 24/7 и прозрачные тарифы.",
      ogTitle: "Аренда авто в Харькове без залога — Трансфер по городу",
      ogDescription:
        "Прокат авто в Харькове официально. Подача на вокзал и по городу 24/7. Новые машины. Быстрое оформление. Бронируйте!",
    },
    en: {
      title: "Car Rental Kharkiv: Railway Station Pickup | We are Open",
      metaDescription:
        "Rent a car in Kharkiv. ⚡ Delivery to Railway Station. 🚗 Economy and Mid-size cars. 🛡️ 24/7 Support. Safe and reliable booking in 2025.",
      h1: "Car Rental in Kharkiv",
      sectionCars: "REIZ fleet in Kharkiv: from comfort to premium class",
      sectionWelcome: "WELCOME TO REIZ KHARKIV",
      subtitle:
        "Car rental in Kharkiv with no deposit. Delivery to the railway station, HRK airport or your address 24/7. Business and SUV class.",
      footerDescription:
        "This is a reliable car rental service in Kharkiv: self-drive rentals, business-class and SUV hire, delivery to the railway station, HRK airport, or your address. 24/7 support and transparent rates.",
      ogTitle: "Car Rental Kharkiv: Railway Station Pickup | We are Open",
      ogDescription:
        "Rent a car in Kharkiv. ⚡ Delivery to Railway Station. 🚗 Economy and Mid-size cars. 🛡️ 24/7 Support. Safe and reliable booking in 2025.",
    },
  },
  bukovel: {
    uk: {
      title: "Оренда авто Буковель, Яремче: Джипи 4x4 | Зимова гума гарантовано",
      metaDescription:
        "Прокат авто в Буковелі, Яремче, Ворохті. 🏔️ Позашляховики та кросовери. ❄️ Зимова гума та ланцюги. 🚗 Доставка до готелю. Бронюйте джип в горах!",
      h1: "Оренда авто в Буковелі",
      sectionCars: "Автопарк REIZ у Буковелі: позашляховики та кросовери",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ БУКОВЕЛЬ",
      subtitle:
        "Прокат авто в Буковелі без застави. Позашляховики та повнопривідні авто для гір. Доставка на курорт з Івано-Франківська та Львова.",
      footerDescription:
        "Це надійний сервіс оренди автомобілів у Буковелі: прокат позашляховиків та кросоверів для гірських доріг, подача до готелів Поляниці, Яремче, Татарова або трансфер з Івано-Франківська/Львова. Підтримка 24/7.",
      ogTitle: "Оренда авто Буковель, Яремче: Джипи 4x4 | Зимова гума гарантовано",
      ogDescription:
        "Прокат авто в Буковелі, Яремче, Ворохті. 🏔️ Позашляховики та кросовери. ❄️ Зимова гума та ланцюги. 🚗 Доставка до готелю. Бронюйте джип в горах!",
    },
    ru: {
      title: "Аренда авто Буковель: Быстрая подача в любую точку курорта",
      metaDescription:
        "Прокат авто в Буковеле официально. Внедорожники и полноприводные авто для гор. Доставка на курорт 24/7. Новые машины. Бронируйте!",
      h1: "Аренда авто в Буковеле",
      sectionCars: "Автопарк REIZ в Буковеле: внедорожники и кроссоверы",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ БУКОВЕЛЬ",
      subtitle:
        "Прокат авто в Буковеле без залога. Внедорожники и полноприводные авто для гор. Доставка на курорт из Ивано-Франковска и Львова.",
      footerDescription:
        "Это надежный сервис аренды автомобилей в Буковеле: прокат внедорожников и кроссоверов для горных дорог, подача к отелям Поляницы, Яремче, Татарова или трансфер из Ивано-Франковска/Львова. Поддержка 24/7.",
      ogTitle: "Аренда авто Буковель: Быстрая подача в любую точку курорта",
      ogDescription:
        "Прокат авто в Буковеле официально. Внедорожники и полноприводные авто для гор. Доставка на курорт 24/7. Новые машины. Бронируйте!",
    },
    en: {
      title: "Car Rental Bukovel & Yaremche: SUV 4x4 Rental | Winter Tires",
      metaDescription:
        "Rent a Jeep/SUV in Bukovel. 🏔️ 4x4 Vehicles for mountain roads. ❄️ Winter tires guaranteed. 🚗 Hotel delivery in Polyanytsya/Yaremche.",
      h1: "Car Rental in Bukovel",
      sectionCars: "REIZ fleet in Bukovel: SUVs and crossovers",
      sectionWelcome: "WELCOME TO REIZ BUKOVEL",
      subtitle:
        "Car rental in Bukovel with no deposit. SUVs and AWD vehicles for mountain trips. Resort delivery from Ivano-Frankivsk and Lviv.",
      footerDescription:
        "This is a reliable car rental service in Bukovel: SUV and crossover rentals for mountain roads, delivery to hotels in Polyanytsya, Yaremche, Tatariv, or transfers from Ivano-Frankivsk/Lviv. 24/7 support.",
      ogTitle: "Car Rental Bukovel & Yaremche: SUV 4x4 Rental | Winter Tires",
      ogDescription:
        "Rent a Jeep/SUV in Bukovel. 🏔️ 4x4 Vehicles for mountain roads. ❄️ Winter tires guaranteed. 🚗 Hotel delivery in Polyanytsya/Yaremche.",
    },
  },
  truskavets: {
    uk: {
      title: "Оренда авто Трускавець та Східниця: Знижки на 14+ днів",
      metaDescription:
        "Прокат авто в Трускавці та Східниці. 💧 Для поїздок на джерела та процедури. 🚗 Високий кліренс для Східниці. ⚡ Тарифи для відпочиваючих.",
      h1: "Оренда авто у Трускавці",
      sectionCars: "АВТОМОБІЛІ REIZ У ТРУСКАВЦІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ТРУСКАВЕЦЬ",
      subtitle:
        "Прокат авто у Трускавці без застави. Доставка в санаторії та готелі курорту. Комфортні авто для поїздок Прикарпаттям.",
      ogTitle: "Оренда авто Трускавець та Східниця: Знижки на 14+ днів",
      ogDescription:
        "Прокат авто в Трускавці та Східниці. 💧 Для поїздок на джерела та процедури. 🚗 Високий кліренс для Східниці. ⚡ Тарифи для відпочиваючих.",
    },
    ru: {
      title: "Аренда авто в Трускавце без залога — Подача по адресу",
      metaDescription:
        "Прокат авто в Трускавце официально. Доставка на курорт и в санатории 24/7. Новые машины. Комфортные путешествия по Прикарпатью. Бронируйте!",
      h1: "Аренда авто в Трускавце",
      sectionCars: "АВТОМОБИЛИ REIZ В ТРУСКАВЦЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ТРУСКАВЕЦ",
      subtitle:
        "Прокат авто в Трускавце без залога. Доставка в санатории и отели курорта. Комфортные авто для поездок по Прикарпатью.",
      ogTitle: "Аренда авто в Трускавце без залога — Подача по адресу",
      ogDescription:
        "Прокат авто в Трускавце официально. Доставка на курорт и в санатории 24/7. Новые машины. Комфортные путешествия по Прикарпатью. Бронируйте!",
    },
    en: {
      title: "Car Rental Truskavets & Skhidnytsia: Holiday Rental | Long-term",
      metaDescription:
        "Rent a car in Truskavets. 💧 Best for visiting mineral springs. 🚗 SUVs available for Skhidnytsia roads. ⚡ Discounts for 2+ weeks rental.",
      h1: "Car Rental in Truskavets",
      sectionCars: "REIZ CARS IN TRUSKAVETS",
      sectionWelcome: "WELCOME TO REIZ TRUSKAVETS",
      subtitle:
        "Car rental in Truskavets with no deposit. Delivery to sanatoriums and resort hotels. Comfortable vehicles for Carpathian trips.",
      ogTitle: "Car Rental Truskavets & Skhidnytsia: Holiday Rental | Long-term",
      ogDescription:
        "Rent a car in Truskavets. 💧 Best for visiting mineral springs. 🚗 SUVs available for Skhidnytsia roads. ⚡ Discounts for 2+ weeks rental.",
    },
  },
  "ivano-frankivsk": {
    uk: {
      title: "Оренда авто в Івано-Франківську без застави — До Карпат 24/7",
      metaDescription:
        "Прокат авто в Івано-Франківську офіційно. Подача в аеропорт та виїзд до Карпат 24/7. Нові машини. Позашляховики та седани. Бронюйте!",
      h1: "Оренда авто в Івано-Франківську",
      sectionCars: "АВТОМОБІЛІ REIZ В ІВАНО-ФРАНКІВСЬКУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ІВАНО-ФРАНКІВСЬК",
      subtitle:
        "Прокат авто в Івано-Франківську без застави. Подача в аеропорт IFO та виїзд до Карпат. Позашляховики та седани 24/7.",
      ogTitle: "Оренда авто Івано-Франківськ без водія — REIZ | Доставка авто 24/7",
      ogDescription:
        "Прокат авто в Івано-Франківську. Без застави. Подача в аеропорт та виїзд до Карпат. Нові авто.",
    },
    ru: {
      title: "Аренда авто в Ивано-Франковске — Доставка 24/7",
      metaDescription:
        "Прокат авто в Ивано-Франковске официально. Подача в аэропорт и выезд в Карпаты 24/7. Новые машины. Внедорожники и седаны. Бронируйте!",
      h1: "Аренда авто в Ивано-Франковске",
      sectionCars: "АВТОМОБИЛИ REIZ В ИВАНО-ФРАНКОВСКЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ИВАНО-ФРАНКОВСК",
      subtitle:
        "Прокат авто в Ивано-Франковске без залога. Подача в аэропорт IFO и выезд в Карпаты. Внедорожники и седаны 24/7.",
      ogTitle: "Аренда авто Ивано-Франковск без водителя — REIZ | В Карпаты 24/7",
      ogDescription:
        "Прокат авто в Ивано-Франковске. Без залога. Подача в аэропорт и выезд в Карпаты. Новые авто.",
    },
    en: {
      title: "Car Rental Ivano-Frankivsk — No Deposit, Carpathian Access",
      metaDescription:
        "Rent a car in Ivano-Frankivsk officially. Airport delivery and Carpathian trips 24/7. New fleet. SUVs and sedans. Book now!",
      h1: "Car Rental in Ivano-Frankivsk",
      sectionCars: "REIZ CARS IN IVANO-FRANKIVSK",
      sectionWelcome: "WELCOME TO REIZ IVANO-FRANKIVSK",
      subtitle:
        "Car rental in Ivano-Frankivsk with no deposit. Delivery to IFO airport and Carpathian trips. SUVs and sedans available 24/7.",
      ogTitle: "Car Rental Ivano-Frankivsk — REIZ | No Deposit, Carpathian Access",
      ogDescription:
        "Rent a car in Ivano-Frankivsk. No deposit. Airport delivery and Carpathian trips. New fleet.",
    },
  },
  skhidnytsia: {
    uk: {
      title: "Оренда авто у Східниці без застави — Подача за адресою",
      metaDescription:
        "Прокат авто у Східниці офіційно. Доставка на курорт та подорожі Карпатами 24/7. Нові машини. Комфортний відпочинок. Бронюйте!",
      h1: "Оренда авто у Східниці",
      sectionCars: "АВТОМОБІЛІ REIZ У СХІДНИЦІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ СХІДНИЦЯ",
      subtitle:
        "Прокат авто у Східниці без застави. Доставка на курорт та подорожі Карпатами. Трансфер зі Львова та Дрогобича.",
      ogTitle: "Оренда авто Східниця без водія — REIZ | Курортна подача 24/7",
      ogDescription:
        "Прокат авто у Східниці. Без застави. Доставка на курорт. Подорожі Карпатами. Нові авто.",
    },
    ru: {
      title: "Аренда авто в Сходнице без залога — Нафтуся и Карпаты",
      metaDescription:
        "Прокат авто в Сходнице официально. Доставка на курорт и путешествия по Карпатам 24/7. Новые машины. Комфортный отдых. Бронируйте!",
      h1: "Аренда авто в Сходнице",
      sectionCars: "АВТОМОБИЛИ REIZ В СХОДНИЦЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ СХОДНИЦА",
      subtitle:
        "Прокат авто в Сходнице без залога. Доставка на курорт и путешествия по Карпатам. Трансфер из Львова и Дрогобыча.",
      ogTitle: "Аренда авто Сходница без водителя — REIZ | Курортная подача 24/7",
      ogDescription:
        "Прокат авто в Сходнице. Без залога. Доставка на курорт. Путешествия по Карпатам. Новые авто.",
    },
    en: {
      title: "Car Rental Skhidnytsia — No Deposit, Spa Resort",
      metaDescription:
        "Rent a car in Skhidnytsia officially. Delivery to spa resort and Carpathian trips 24/7. New fleet. Comfortable vacation. Book now!",
      h1: "Car Rental in Skhidnytsia",
      sectionCars: "REIZ CARS IN SKHIDNYTSIA",
      sectionWelcome: "WELCOME TO REIZ SKHIDNYTSIA",
      subtitle:
        "Car rental in Skhidnytsia with no deposit. Resort delivery and Carpathian trips. Transfers from Lviv and Drohobych.",
      ogTitle: "Car Rental Skhidnytsia — REIZ | No Deposit, Resort Delivery 24/7",
      ogDescription:
        "Rent a car in Skhidnytsia. No deposit. Delivery to spa resort. Carpathian trips. New fleet.",
    },
  },
  uzhhorod: {
    uk: {
      title: "Оренда авто Ужгород та Мукачево: Виїзд за кордон | Трансфер",
      metaDescription:
        "Прокат авто в Ужгороді та Мукачево. 🌍 Авто для виїзду в Європу (Словаччина, Угорщина). 🏔️ Старт подорожі в Карпати. ⚡ Документи для кордону.",
      h1: "Оренда авто в Ужгороді",
      sectionCars: "АВТОМОБІЛІ REIZ В УЖГОРОДІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ УЖГОРОД",
      subtitle:
        "Оренда авто в Ужгороді — нові автомобілі, швидке оформлення та зручний виїзд до кордону ЄС.",
      ogTitle: "Оренда авто Ужгород та Мукачево: Виїзд за кордон | Трансфер",
      ogDescription:
        "Прокат авто в Ужгороді та Мукачево. 🌍 Авто для виїзду в Європу (Словаччина, Угорщина). 🏔️ Старт подорожі в Карпати. ⚡ Документи для кордону.",
    },
    ru: {
      title: "Аренда авто в Ужгороде — Выезд за границу ЕС",
      metaDescription:
        "Прокат авто в Ужгороде. Удобный выезд к границе ЕС и в Карпаты. Новые авто. Бесплатная подача по городу 24/7. Бронируйте!",
      h1: "Аренда авто в Ужгороде",
      sectionCars: "АВТОМОБИЛИ REIZ В УЖГОРОДЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ УЖГОРОД",
      subtitle:
        "Аренда авто в Ужгороде — новые автомобили года, быстрое оформление и удобный выезд к границе.",
      ogTitle: "Аренда авто в Ужгороде — Выезд за границу ЕС",
      ogDescription:
        "Прокат авто в Ужгороде. Удобный выезд к границе ЕС и в Карпаты. Новые авто. Бесплатная подача по городу 24/7. Бронируйте!",
    },
    en: {
      title: "Car Rental Uzhhorod & Mukachevo: Cross-Border to EU",
      metaDescription:
        "Rent a car in Uzhhorod. 🌍 Cross-border rentals allowed (EU). 🏔️ Perfect start for Carpathians. ⚡ Green Card included options.",
      h1: "Car Rental in Uzhhorod",
      sectionCars: "REIZ CARS IN UZHHOROD",
      sectionWelcome: "WELCOME TO REIZ UZHHOROD",
      subtitle:
        "Car rental in Uzhhorod — new fleet, fast paperwork, and convenient EU border crossing access.",
      ogTitle: "Car Rental Uzhhorod & Mukachevo: Cross-Border to EU",
      ogDescription:
        "Rent a car in Uzhhorod. 🌍 Cross-border rentals allowed (EU). 🏔️ Perfect start for Carpathians. ⚡ Green Card included options.",
    },
  },
  vinnytsia: {
    uk: {
      title: "Оренда авто у Вінниці без застави — Швидка видача",
      metaDescription:
        "Прокат авто у Вінниці для ділових поїздок. Нові машини. Безкоштовна подача в центр 24/7. Бронюйте офіційно!",
      h1: "Оренда авто у Вінниці",
      sectionCars: "АВТОМОБІЛІ REIZ У ВІННИЦІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ВІННИЦЯ",
      subtitle:
        "Оренда авто у Вінниці — ідеальний варіант для ділових поїздок та комфортних подорожей по центру України.",
      ogTitle: "Оренда авто Вінниця без водія — REIZ | Без застави",
      ogDescription:
        "Прокат авто у Вінниці. Без застави. Нові авто. Безкоштовна подача. Швидка видача 24/7.",
    },
    ru: {
      title: "Аренда авто в Виннице без залога — Быстрое оформление",
      metaDescription:
        "Прокат авто в Виннице для деловых поездок. Новые машины. Бесплатная подача в центр 24/7. Бронируйте!",
      h1: "Аренда авто в Виннице",
      sectionCars: "АВТОМОБИЛИ REIZ В ВИННИЦЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ВИННИЦА",
      subtitle:
        "Аренда авто в Виннице — идеальный вариант для деловых поездок и комфортных путешествий по центру Украины.",
      ogTitle: "Аренда авто Винница без водителя — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Виннице. Без залога. Новые авто. Бесплатная подача. Быстрое оформление 24/7.",
    },
    en: {
      title: "Car Rental Vinnytsia — No Deposit, New Fleet",
      metaDescription:
        "Rent a car in Vinnytsia for business trips. New fleet. Free city delivery 24/7. Book your self-drive now!",
      h1: "Car Rental in Vinnytsia",
      sectionCars: "REIZ CARS IN VINNYTSIA",
      sectionWelcome: "WELCOME TO REIZ VINNYTSIA",
      subtitle:
        "Car rental in Vinnytsia — ideal for business trips and comfortable travel across central Ukraine.",
      ogTitle: "Car Rental Vinnytsia — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Vinnytsia. No deposit. New fleet. Free city delivery. Fast pickup 24/7.",
    },
  },
  zaporizhzhia: {
    uk: {
      title: "Оренда авто у Запоріжжі — Без застави, подача 24/7",
      metaDescription:
        "Прокат авто у Запоріжжі офіційно. Нові машини. Безкоштовна подача по місту 24/7. Швидка видача. Бронюйте!",
      h1: "Оренда авто у Запоріжжі",
      sectionCars: "Автопарк REIZ у Запоріжжі: від комфорту до преміум-класу",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЗАПОРІЖЖЯ",
      subtitle:
        "Оренда авто у Запоріжжі — надійні нові автомобілі, офіційне оформлення та швидка подача по місту.",
      footerDescription:
        "Це надійний сервіс оренди автомобілів у Запоріжжі: оренда авто без водія, прокат бізнес-класу та позашляховиків, подача на залізничний вокзал, в аеропорт OZH або за адресою. Підтримка 24/7 і прозорі тарифи.",
      ogTitle: "Оренда авто Запоріжжя без водія — REIZ | Без застави",
      ogDescription:
        "Прокат авто у Запоріжжі. Без застави. Нові авто. Безкоштовна подача. Швидка видача 24/7.",
    },
    ru: {
      title: "Аренда авто в Запорожье — Без залога, подача 24/7",
      metaDescription:
        "Прокат авто в Запорожье официально. Новые машины. Бесплатная подача по городу 24/7. Быстрое оформление!",
      h1: "Аренда авто в Запорожье",
      sectionCars: "Автопарк REIZ в Запорожье: от комфорта до премиум-класса",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЗАПОРОЖЬЕ",
      subtitle:
        "Аренда авто в Запорожье — надежные новые автомобили, официальное оформление и быстрая подача по городу.",
      footerDescription:
        "Это надежный сервис аренды автомобилей в Запорожье: аренда авто без водителя, прокат бизнес-класса и внедорожников, подача на железнодорожный вокзал, в аэропорт OZH или по адресу. Поддержка 24/7 и прозрачные тарифы.",
      ogTitle: "Аренда авто Запорожье без водителя — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Запорожье. Без залога. Новые авто. Бесплатная подача. Быстрое оформление 24/7.",
    },
    en: {
      title: "Car Rental Zaporizhzhia — No Deposit, Delivery 24/7",
      metaDescription:
        "Rent a car in Zaporizhzhia officially. New fleet. Free city delivery 24/7. Fast pickup. Book your self-drive!",
      h1: "Car Rental in Zaporizhzhia",
      sectionCars: "REIZ fleet in Zaporizhzhia: from comfort to premium class",
      sectionWelcome: "WELCOME TO REIZ ZAPORIZHZHIA",
      subtitle:
        "Car rental in Zaporizhzhia — reliable new vehicles, official paperwork, and fast city-wide delivery.",
      footerDescription:
        "This is a reliable car rental service in Zaporizhzhia: self-drive rentals, business-class and SUV hire, delivery to the railway station, OZH airport, or your address. 24/7 support and transparent rates.",
      ogTitle: "Car Rental Zaporizhzhia — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Zaporizhzhia. No deposit. New fleet. Free city delivery. Fast pickup 24/7.",
    },
  },
  mukachevo: {
    uk: {
      title: "Оренда авто в Мукачеві без застави — Виїзд в Карпати",
      metaDescription:
        "Прокат авто в Мукачеві офіційно. Зручний виїзд до кордону та в Карпати. Нові машини. Безкоштовна подача 24/7. Швидка видача!",
      h1: "Оренда авто в Мукачеві",
      sectionCars: "АВТОМОБІЛІ REIZ В МУКАЧЕВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ МУКАЧЕВО",
      subtitle:
        "Оренда авто в Мукачеві — нові авто для подорожей Закарпаттям, зручний виїзд до кордону та в Карпати.",
      ogTitle: "Оренда авто Мукачево без водія — REIZ | Без застави",
      ogDescription:
        "Прокат авто в Мукачеві. Без застави. Зручний виїзд в Карпати та до кордону. Безкоштовна подача 24/7.",
    },
    ru: {
      title: "Аренда авто в Мукачеве без залога — Выезд в Карпаты",
      metaDescription:
        "Прокат авто в Мукачеве официально. Удобный выезд к границе ЕС и в Карпаты. Новые машины. Бесплатная подача 24/7. Бронируйте!",
      h1: "Аренда авто в Мукачеве",
      sectionCars: "АВТОМОБИЛИ REIZ В МУКАЧЕВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ МУКАЧЕВО",
      subtitle:
        "Аренда авто в Мукачеве — новые авто для путешествий по Закарпатью, удобный выезд к границе и в Карпаты.",
      ogTitle: "Аренда авто Мукачево без водителя — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Мукачеве. Без залога. Удобный выезд в Карпаты и к границе. Бесплатная подача 24/7.",
    },
    en: {
      title: "Car Rental Mukachevo — No Deposit, Carpathian Trips",
      metaDescription:
        "Rent a car in Mukachevo. Easy border crossing and Carpathian mountain access. New fleet. Free delivery 24/7. Book now!",
      h1: "Car Rental in Mukachevo",
      sectionCars: "REIZ CARS IN MUKACHEVO",
      sectionWelcome: "WELCOME TO REIZ MUKACHEVO",
      subtitle:
        "Car rental in Mukachevo — new vehicles for Transcarpathian adventures, easy border crossing and Carpathian access.",
      ogTitle: "Car Rental Mukachevo — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Mukachevo. No deposit. Easy Carpathian and border access. Free city delivery 24/7.",
    },
  },
  poltava: {
    uk: {
      title: "Оренда авто у Полтаві без застави — Швидка видача",
      metaDescription:
        "Прокат авто у Полтаві для ділових поїздок. Нові машини. Безкоштовна подача в центр 24/7. Бронюйте офіційно!",
      h1: "Оренда авто у Полтаві",
      sectionCars: "АВТОМОБІЛІ REIZ У ПОЛТАВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ПОЛТАВА",
      subtitle:
        "Оренда авто у Полтаві — комфортні ділові поїздки та подорожі центральною Україною на нових автомобілях.",
      ogTitle: "Оренда авто Полтава без водія — REIZ | Без застави",
      ogDescription:
        "Прокат авто у Полтаві. Без застави. Нові авто. Безкоштовна подача. Швидке оформлення 24/7.",
    },
    ru: {
      title: "Аренда авто в Полтаве без залога — Быстрое оформление",
      metaDescription:
        "Прокат авто в Полтаве для деловых поездок. Новые машины. Бесплатная подача в центр 24/7. Бронируйте!",
      h1: "Аренда авто в Полтаве",
      sectionCars: "АВТОМОБИЛИ REIZ В ПОЛТАВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ПОЛТАВА",
      subtitle:
        "Аренда авто в Полтаве — комфортные деловые поездки и путешествия по центральной Украине на новых автомобилях.",
      ogTitle: "Аренда авто Полтава без водителя — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Полтаве. Без залога. Новые авто. Бесплатная подача. Быстрое оформление 24/7.",
    },
    en: {
      title: "Car Rental Poltava — No Deposit, New Fleet",
      metaDescription:
        "Rent a car in Poltava for business trips. New fleet. Free city delivery 24/7. Book your self-drive now!",
      h1: "Car Rental in Poltava",
      sectionCars: "REIZ CARS IN POLTAVA",
      sectionWelcome: "WELCOME TO REIZ POLTAVA",
      subtitle:
        "Car rental in Poltava — comfortable business trips and travel across central Ukraine in new vehicles.",
      ogTitle: "Car Rental Poltava — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Poltava. No deposit. New fleet. Free city delivery. Fast pickup 24/7.",
    },
  },
  chernivtsi: {
    uk: {
      title: "Оренда авто у Чернівцях без застави — Виїзд до кордону",
      metaDescription:
        "Прокат авто у Чернівцях офіційно. Зручний виїзд до кордону з Румунією та Молдовою. Нові машини. Безкоштовна подача 24/7!",
      h1: "Оренда авто у Чернівцях",
      sectionCars: "АВТОМОБІЛІ REIZ У ЧЕРНІВЦЯХ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЧЕРНІВЦІ",
      subtitle:
        "Оренда авто у Чернівцях — нові авто для подорожей Буковиною, зручний виїзд до кордону та в Карпати.",
      ogTitle: "Оренда авто Чернівці без водія — REIZ | Без застави",
      ogDescription:
        "Прокат авто у Чернівцях. Без застави. Зручний виїзд до кордону. Безкоштовна подача по місту 24/7.",
    },
    ru: {
      title: "Аренда авто в Черновцах без залога — Выезд к границе",
      metaDescription:
        "Прокат авто в Черновцах официально. Удобный выезд к границе с Румынией и Молдовой. Новые машины. Бесплатная подача 24/7!",
      h1: "Аренда авто в Черновцах",
      sectionCars: "АВТОМОБИЛИ REIZ В ЧЕРНОВЦАХ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЧЕРНОВЦЫ",
      subtitle:
        "Аренда авто в Черновцах — новые авто для путешествий по Буковине, удобный выезд к границе и в Карпаты.",
      ogTitle: "Аренда авто Черновцы без водителя — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Черновцах. Без залога. Удобный выезд к границе. Бесплатная подача по городу 24/7.",
    },
    en: {
      title: "Car Rental Chernivtsi — No Deposit, Border Access",
      metaDescription:
        "Rent a car in Chernivtsi. Easy border crossing to Romania and Moldova. New fleet. Free city delivery 24/7. Book now!",
      h1: "Car Rental in Chernivtsi",
      sectionCars: "REIZ CARS IN CHERNIVTSI",
      sectionWelcome: "WELCOME TO REIZ CHERNIVTSI",
      subtitle:
        "Car rental in Chernivtsi — new vehicles for Bukovyna adventures, easy border crossing and Carpathian access.",
      ogTitle: "Car Rental Chernivtsi — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Chernivtsi. No deposit. Easy border access to Romania and Moldova. Free delivery 24/7.",
    },
  },
  boryspil: {
    uk: {
      title: "Оренда авто в Борисполі без застави — Аеропорт 24/7",
      metaDescription:
        "Прокат авто в Борисполі з подачею в аеропорт. Зустріч з рейсу 24/7. Нові машини. Швидке оформлення. Без застави!",
      h1: "Оренда авто в Борисполі",
      sectionCars: "Автопарк REIZ у Борисполі: від комфорту до преміум-класу",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ БОРИСПІЛЬ",
      subtitle:
        "Оренда авто в Борисполі — зустріч в аеропорту, швидке оформлення та комфортний трансфер на нових автомобілях.",
      address: "Бориспіль: Персональна подача (Аеропорт KBP / Готелі / Київ)",
      footerDescription:
        "Це надійний сервіс оренди автомобілів у Борисполі: зустріч в аеропорту KBP, прокат бізнес-класу та мінівенів, подача до терміналів D/F або в Київ. Підтримка 24/7 і прозорі тарифи.",
      ogTitle: "Оренда авто Бориспіль аеропорт — REIZ | Без застави",
      ogDescription:
        "Прокат авто в Борисполі. Без застави. Зустріч з рейсу в аеропорту. Нові авто 24/7. Швидка видача.",
    },
    ru: {
      title: "Аренда авто в Борисполе без залога — Аэропорт 24/7",
      metaDescription:
        "Прокат авто в Борисполе с подачей в аэропорт. Встреча с рейса 24/7. Новые машины. Быстрое оформление. Без залога!",
      h1: "Аренда авто в Борисполе",
      sectionCars: "Автопарк REIZ в Борисполе: от комфорта до премиум-класса",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ БОРИСПОЛЬ",
      subtitle:
        "Аренда авто в Борисполе — встреча в аэропорту, быстрое оформление и комфортный трансфер на новых автомобилях.",
      address: "Борисполь: Персональная подача (Аэропорт KBP / Отели / Киев)",
      footerDescription:
        "Это надёжный сервис аренды автомобилей в Борисполе: встреча в аэропорту KBP, прокат бизнес-класса и минивэнов, подача к терминалам D/F или в Киев. Поддержка 24/7 и прозрачные тарифы.",
      ogTitle: "Аренда авто Борисполь аэропорт — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Борисполе. Без залога. Встреча с рейса в аэропорту. Новые авто 24/7. Быстрая выдача.",
    },
    en: {
      title: "Car Rental Boryspil Airport — No Deposit, 24/7 Pickup",
      metaDescription:
        "Rent a car at Boryspil Airport. Flight meet and greet 24/7. New fleet. Fast paperwork. No deposit. Book your self-drive!",
      h1: "Car Rental in Boryspil",
      sectionCars: "REIZ fleet in Boryspil: from comfort to premium class",
      sectionWelcome: "WELCOME TO REIZ BORYSPIL",
      subtitle:
        "Car rental in Boryspil — airport meet and greet, fast paperwork, and comfortable transfers in new vehicles.",
      address: "Boryspil: Personal Delivery (KBP Airport / Hotels / Kyiv)",
      footerDescription:
        "This is a reliable car rental service in Boryspil: meet-and-greet at KBP airport, business-class and minivan hire, delivery to terminals D/F or Kyiv. 24/7 support and transparent rates.",
      ogTitle: "Car Rental Boryspil Airport — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car at Boryspil Airport. No deposit. Flight meet and greet 24/7. New fleet. Fast pickup.",
    },
  },
  lutsk: {
    uk: {
      title: "Оренда авто у Луцьку — Шацькі озера та замок Любарта",
      metaDescription:
        "Прокат авто у Луцьку. Подача по місту й на вокзал 24/7. Шацькі озера, Ковель, Ягодин/Устилуг та виїзд до Польщі за узгодженням.",
      h1: "Оренда авто у Луцьку",
      sectionCars: "АВТОМОБІЛІ REIZ У ЛУЦЬКУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЛУЦЬК",
      subtitle:
        "Прокат авто у Луцьку без застави. Подача по місту та на вокзал 24/7. Виїзд на Шацькі озера та до кордону з Польщею.",
      ogTitle: "Оренда авто Луцьк — Шацькі озера та кордон | REIZ",
      ogDescription:
        "Прокат авто у Луцьку без застави. Подача 24/7 по місту та на вокзал. Виїзд на Шацькі озера та до кордону з Польщею.",
    },
    ru: {
      title: "Аренда авто в Луцке — Шацкие озёра и замок Любарта",
      metaDescription:
        "Прокат авто в Луцке. Подача по городу и на вокзал 24/7. Шацкие озёра, Ковель, КПП Ягодин/Устилуг, выезд в Польшу по согласованию.",
      h1: "Аренда авто в Луцке — подача 24/7 и выезд к озёрам",
      sectionCars: "АВТОМОБИЛИ REIZ В ЛУЦКЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЛУЦК",
      subtitle:
        "Прокат авто в Луцке без залога. Подача по городу и на вокзал 24/7. Выезд на Шацкие озёра и к границе с Польшей.",
      ogTitle: "Аренда авто Луцк — Шацкие озёра и граница | REIZ",
      ogDescription:
        "Прокат авто в Луцке без залога. Подача 24/7 по городу и на вокзал. Выезд на Шацкие озёра и к границе с Польшей.",
    },
    en: {
      title: "Car Rental Lutsk — Shatsk Lakes & Lubart Castle",
      metaDescription:
        "Rent a car in Lutsk. City and station delivery 24/7. Trips to Shatsk Lakes, Kovel, and border checkpoints; Poland travel by approval.",
      h1: "Car Rental in Lutsk — 24/7 Delivery & Lake Trips",
      sectionCars: "REIZ CARS IN LUTSK",
      sectionWelcome: "WELCOME TO REIZ LUTSK",
      subtitle:
        "Car rental in Lutsk with no deposit. City and station delivery 24/7. Trips to Shatsk Lakes and Poland border.",
      ogTitle: "Car Rental Lutsk — Shatsk Lakes & Border Trips | REIZ",
      ogDescription:
        "Car rental in Lutsk with no deposit. 24/7 city and station delivery. Trips to Shatsk Lakes and Poland border.",
    },
  },
  rivne: {
    uk: {
      title: "Оренда авто Рівне: Прокат машин | Маршрут в Тунель Кохання",
      metaDescription:
        "Прокат авто у Рівному. 💚 Авто для поїздки в Тунель Кохання (Клевань). 🚗 Економ та Комфорт. ⚡ Швидка подача. Бронюйте онлайн.",
      h1: "Оренда авто у Рівному",
      sectionCars: "АВТОМОБІЛІ REIZ У РІВНОМУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ РІВНЕ",
      subtitle:
        "Прокат авто у Рівному без застави. Подача 24/7 по місту та на вокзал. Маршрути до Клевані, Острога та Дубна.",
      ogTitle: "Оренда авто Рівне: Прокат машин | Маршрут в Тунель Кохання",
      ogDescription:
        "Прокат авто у Рівному. 💚 Авто для поїздки в Тунель Кохання (Клевань). 🚗 Економ та Комфорт. ⚡ Швидка подача. Бронюйте онлайн.",
    },
    ru: {
      title: "Аренда авто в Ровно — Тоннель любви, Острог, Полесье",
      metaDescription:
        "Прокат авто в Ровно. Подача 24/7 по городу и на вокзал. Маршруты в Клевань, Острог, Дубно и по Полесью.",
      h1: "Аренда авто в Ровно — подача 24/7 и маршруты по области",
      sectionCars: "АВТОМОБИЛИ REIZ В РОВНО",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ РОВНО",
      subtitle:
        "Прокат авто в Ровно без залога. Подача 24/7 по городу и на вокзал. Маршруты в Клевань, Острог и Дубно.",
      ogTitle: "Аренда авто в Ровно — Тоннель любви, Острог, Полесье",
      ogDescription:
        "Прокат авто в Ровно. Подача 24/7 по городу и на вокзал. Маршруты в Клевань, Острог, Дубно и по Полесью.",
    },
    en: {
      title: "Car Rental Rivne: Visit Tunnel of Love | City Car Hire",
      metaDescription:
        "Rent a car in Rivne. 💚 Trip to Tunnel of Love. 🚗 Economy and Comfort cars. ⚡ Fast delivery. Book online.",
      h1: "Car Rental in Rivne — 24/7 Delivery & Regional Trips",
      sectionCars: "REIZ CARS IN RIVNE",
      sectionWelcome: "WELCOME TO REIZ RIVNE",
      subtitle:
        "Car rental in Rivne with no deposit. 24/7 delivery & regional trips to Klevan, Ostroh and Dubno.",
      ogTitle: "Car Rental Rivne: Visit Tunnel of Love | City Car Hire",
      ogDescription:
        "Rent a car in Rivne. 💚 Trip to Tunnel of Love. 🚗 Economy and Comfort cars. ⚡ Fast delivery. Book online.",
    },
  },
  khmelnytskyi: {
    uk: {
      title: "Оренда авто у Хмельницькому — Кам'янець, Хотин, Бакота",
      metaDescription:
        "Прокат авто у Хмельницькому. Подача 24/7 по місту. Зручні маршрути до Кам'янця-Подільського, Хотина, Бакоти, Меджибожа.",
      h1: "Оренда авто у Хмельницькому",
      sectionCars: "АВТОМОБІЛІ REIZ У ХМЕЛЬНИЦЬКОМУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ХМЕЛЬНИЦЬКИЙ",
      subtitle:
        "Прокат авто у Хмельницькому без застави. Подача 24/7 по місту. Зручні маршрути до Кам'янця-Подільського та Хотина.",
      ogTitle: "Оренда авто Хмельницький — Кам'янець і Бакота | REIZ",
      ogDescription:
        "Прокат авто у Хмельницькому без застави. Подача 24/7 по місту. Поїздки до Кам'янця-Подільського, Хотина та Бакоти.",
    },
    ru: {
      title: "Аренда авто в Хмельницком — Каменец, Хотин, Бакота",
      metaDescription:
        "Прокат авто в Хмельницком. Подача 24/7 по городу. Маршруты в Каменец‑Подольский, Хотин, Бакоту, Меджибож.",
      h1: "Аренда авто в Хмельницком",
      sectionCars: "АВТОМОБИЛИ REIZ В ХМЕЛЬНИЦКОМ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ХМЕЛЬНИЦКИЙ",
      subtitle:
        "Прокат авто в Хмельницком без залога. Подача 24/7 по городу. Удобные маршруты в Каменец-Подольский и Хотин.",
      ogTitle: "Аренда авто Хмельницкий — Каменец и Бакота | REIZ",
      ogDescription:
        "Прокат авто в Хмельницком без залога. Подача 24/7 по городу. Поездки в Каменец-Подольский, Хотин и Бакоту.",
    },
    en: {
      title: "Car Rental Khmelnytskyi — Kamianets, Khotyn, Bakota",
      metaDescription:
        "Rent a car in Khmelnytskyi. City delivery 24/7. Easy trips to Kamianets-Podilskyi, Khotyn, Bakota and Medzhybizh.",
      h1: "Car Rental in Khmelnytskyi",
      sectionCars: "REIZ CARS IN KHMELNYTSKYI",
      sectionWelcome: "WELCOME TO REIZ KHMELNYTSKYI",
      subtitle:
        "Car rental in Khmelnytskyi with no deposit. 24/7 city delivery. Easy trips to Kamianets-Podilskyi and Khotyn.",
      ogTitle: "Car Rental Khmelnytskyi — Fortress Routes | REIZ",
      ogDescription:
        "Car rental in Khmelnytskyi with no deposit. 24/7 city delivery. Trips to Kamianets-Podilskyi, Khotyn and Bakota.",
    },
  },
  "kamianets-podilskyi": {
    uk: {
      title: "Оренда авто у Кам'янці-Подільському — фортеця, Хотин, Бакота",
      metaDescription:
        "Прокат авто у Кам'янці-Подільському. Подача до Старого міста й фортеці. Маршрути до Хотина та Бакоти.",
      h1: "Оренда авто у Кам'янці-Подільському",
      sectionCars: "АВТОМОБІЛІ REIZ У КАМ'ЯНЦІ-ПОДІЛЬСЬКОМУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ КАМ'ЯНЕЦЬ-ПОДІЛЬСЬКИЙ",
      subtitle:
        "Прокат авто у Кам'янці-Подільському без застави. Подача до Старого міста та фортеці 24/7. Поїздки до Хотина та Бакоти.",
      ogTitle: "Оренда авто Кам'янець‑Подільський — фортеця | REIZ",
      ogDescription:
        "Прокат авто у Кам'янці-Подільському без застави. Подача до Старого міста та фортеці. Поїздки до Хотина та Бакоти.",
    },
    ru: {
      title: "Аренда авто в Каменце‑Подольском — крепость, Хотин, Бакота",
      metaDescription:
        "Прокат авто в Каменце‑Подольском. Подача к Старому городу и крепости. Маршруты в Хотин и Бакоту.",
      h1: "Аренда авто в Каменце-Подольском",
      sectionCars: "АВТОМОБИЛИ REIZ В КАМЕНЦЕ-ПОДОЛЬСКОМ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ КАМЕНЕЦ-ПОДОЛЬСКИЙ",
      subtitle:
        "Прокат авто в Каменце-Подольском без залога. Подача к Старому городу и крепости 24/7. Поездки в Хотин и Бакоту.",
      ogTitle: "Аренда авто Каменец‑Подольский — крепость | REIZ",
      ogDescription:
        "Прокат авто в Каменце-Подольском без залога. Подача к Старому городу и крепости. Поездки в Хотин и Бакоту.",
    },
    en: {
      title: "Car Rental Kamianets-Podilskyi — Fortress, Khotyn, Bakota",
      metaDescription:
        "Rent a car in Kamianets-Podilskyi. Delivery to Old Town and the fortress. Trips to Khotyn and Bakota.",
      h1: "Car Rental in Kamianets-Podilskyi",
      sectionCars: "REIZ CARS IN KAMIANETS-PODILSKYI",
      sectionWelcome: "WELCOME TO REIZ KAMIANETS-PODILSKYI",
      subtitle:
        "Car rental in Kamianets-Podilskyi with no deposit. Delivery to Old Town and fortress 24/7. Trips to Khotyn and Bakota.",
      ogTitle: "Car Rental Kamianets‑Podilskyi — Fortress Trips | REIZ",
      ogDescription:
        "Car rental in Kamianets-Podilskyi with no deposit. Delivery to Old Town and fortress. Trips to Khotyn and Bakota.",
    },
  },
  drohobych: {
    uk: {
      title: "Оренда авто у Дрогобичі — Трускавець, Східниця, Карпати",
      metaDescription:
        "Прокат авто у Дрогобичі. Подача 24/7 по місту. Зручно для поїздок у Трускавець, Східницю та до Карпат.",
      h1: "Оренда авто у Дрогобичі",
      sectionCars: "АВТОМОБІЛІ REIZ У ДРОГОБИЧІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ДРОГОБИЧ",
      subtitle: "Прокат авто у Дрогобичі без застави. Подача 24/7 по місту. Зручно для поїздок у Трускавець та Східницю.",
      ogTitle: "Оренда авто Дрогобич — Трускавець і Східниця | REIZ",
      ogDescription: "Прокат авто у Дрогобичі без застави. Подача 24/7 по місту. Поїздки до Трускавця, Східниці та Карпат.",
    },
    ru: {
      title: "Аренда авто в Дрогобыче — Трускавец, Сходница, Карпаты",
      metaDescription:
        "Прокат авто в Дрогобыче. Подача 24/7 по городу. Удобно для поездок в Трускавец, Сходницу и Карпаты.",
      h1: "Аренда авто в Дрогобыче",
      sectionCars: "АВТОМОБИЛИ REIZ В ДРОГОБЫЧЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ДРОГОБЫЧ",
      subtitle: "Прокат авто в Дрогобыче без залога. Подача 24/7 по городу. Удобно для поездок в Трускавец и Сходницу.",
      ogTitle: "Аренда авто Дрогобыч — Трускавец и Сходница | REIZ",
      ogDescription: "Прокат авто в Дрогобыче без залога. Подача 24/7 по городу. Поездки в Трускавец, Сходницу и Карпаты.",
    },
    en: {
      title: "Car Rental Drohobych — Truskavets, Skhidnytsia, Carpathians",
      metaDescription:
        "Rent a car in Drohobych. City delivery 24/7. Great for trips to Truskavets, Skhidnytsia and the Carpathians.",
      h1: "Car Rental in Drohobych",
      sectionCars: "REIZ CARS IN DROHOBYCH",
      sectionWelcome: "WELCOME TO REIZ DROHOBYCH",
      subtitle: "Car rental in Drohobych with no deposit. 24/7 city delivery. Perfect for trips to Truskavets and Skhidnytsia.",
      ogTitle: "Car Rental Drohobych — Resort Trips | REIZ",
      ogDescription: "Car rental in Drohobych with no deposit. 24/7 city delivery. Trips to Truskavets, Skhidnytsia and Carpathians.",
    },
  },
  stryi: {
    uk: {
      title: "Оренда авто Стрий, Дрогобич, Самбір: Регіональна доставка",
      metaDescription:
        "Прокат авто в Стрию, Дрогобичі, Самборі. 🚗 Подача за адресою клієнта. ⚡ Доступні ціни. 🛡️ Страховка. Зручніше ніж таксі.",
      h1: "Оренда авто у Стрию — подача 24/7 і маршрути в Карпати",
      sectionCars: "АВТОМОБІЛІ REIZ У СТРИЮ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ СТРИЙ",
      subtitle:
        "Оренда авто у Стрию без застави. Подача 24/7 по місту. Маршрути в Карпати — Сколе, Славське та Моршин.",
      ogTitle: "Оренда авто Стрий, Дрогобич, Самбір: Регіональна доставка",
      ogDescription:
        "Прокат авто в Стрию, Дрогобичі, Самборі. 🚗 Подача за адресою клієнта. ⚡ Доступні ціни. 🛡️ Страховка. Зручніше ніж таксі.",
    },
    ru: {
      title: "Аренда авто в Стрыю — Славское, Сколе, Карпаты",
      metaDescription:
        "Прокат авто в Стрые. Подача 24/7 по городу. Маршруты в Сколе, Славское, Моршин и Карпаты.",
      h1: "Аренда авто в Стрые — подача 24/7 и маршруты в Карпаты",
      sectionCars: "АВТОМОБИЛИ REIZ В СТРЫЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ СТРЫЙ",
      subtitle: "Прокат авто в Стрые без залога. Подача 24/7 по городу. Маршруты в Сколе, Славское и Моршин.",
      ogTitle: "Аренда авто в Стрые — Славское, Сколе, Карпаты",
      ogDescription:
        "Прокат авто в Стрые. Подача 24/7 по городу. Маршруты в Сколе, Славское, Моршин и Карпаты.",
    },
    en: {
      title: "Car Rental Stryi, Drohobych, Sambir: Local Service",
      metaDescription:
        "Rent a car in Stryi, Drohobych, Sambir. 🚗 Delivery to your location. ⚡ Affordable rates. 🛡️ Insurance included.",
      h1: "Car Rental in Stryi — 24/7 Delivery & Carpathian Routes",
      sectionCars: "REIZ CARS IN STRYI",
      sectionWelcome: "WELCOME TO REIZ STRYI",
      subtitle:
        "Car rental in Stryi with no deposit. 24/7 city delivery. Trips to Skole, Slavske and Morshyn.",
      ogTitle: "Car Rental Stryi, Drohobych, Sambir: Local Service",
      ogDescription:
        "Rent a car in Stryi, Drohobych, Sambir. 🚗 Delivery to your location. ⚡ Affordable rates. 🛡️ Insurance included.",
    },
  },
  sambir: {
    uk: {
      title: "Оренда авто у Самборі — кордон, Дрогобич, Трускавець",
      metaDescription:
        "Прокат авто у Самборі. Подача 24/7. Зручні маршрути до Дрогобича, Трускавця та КПП Шегині.",
      h1: "Оренда авто у Самборі",
      sectionCars: "АВТОМОБІЛІ REIZ У САМБОРІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ САМБІР",
      subtitle: "Прокат авто у Самборі без застави. Подача 24/7. Маршрути до Дрогобича, Трускавця та КПП Шегині.",
      ogTitle: "Оренда авто Самбір — кордон і курорти | REIZ",
      ogDescription: "Прокат авто у Самборі без застави. Подача 24/7 по місту. Поїздки до Дрогобича, Трускавця та КПП Шегині.",
    },
    ru: {
      title: "Аренда авто в Самборе — граница, Дрогобыч, Трускавец",
      metaDescription:
        "Прокат авто в Самборе. Подача 24/7. Маршруты в Дрогобыч, Трускавец и к КПП Шегини.",
      h1: "Аренда авто в Самборе",
      sectionCars: "АВТОМОБИЛИ REIZ В САМБОРЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ САМБОР",
      subtitle: "Прокат авто в Самборе без залога. Подача 24/7. Маршруты в Дрогобыч, Трускавец и к КПП Шегини.",
      ogTitle: "Аренда авто Самбор — граница и курорты | REIZ",
      ogDescription: "Прокат авто в Самборе без залога. Подача 24/7 по городу. Поездки в Дрогобыч, Трускавец и к КПП Шегини.",
    },
    en: {
      title: "Car Rental Sambir — Border Routes, Truskavets",
      metaDescription:
        "Rent a car in Sambir. 24/7 delivery. Easy trips to Drohobych, Truskavets and the Shehyni border.",
      h1: "Car Rental in Sambir",
      sectionCars: "REIZ CARS IN SAMBIR",
      sectionWelcome: "WELCOME TO REIZ SAMBIR",
      subtitle: "Car rental in Sambir with no deposit. 24/7 delivery. Trips to Drohobych, Truskavets and Shehyni border.",
      ogTitle: "Car Rental Sambir — Border & Resort Trips | REIZ",
      ogDescription: "Car rental in Sambir with no deposit. 24/7 city delivery. Trips to Drohobych, Truskavets and Shehyni border.",
    },
  },
  chervonohrad: {
    uk: {
      title: "Оренда авто у Червонограді — Рава-Руська, Львів, кордон",
      metaDescription:
        "Прокат авто у Червонограді. Подача 24/7. Маршрути до Львова, Рава-Руської та Белза.",
      h1: "Оренда авто у Червонограді",
      sectionCars: "АВТОМОБІЛІ REIZ У ЧЕРВОНОГРАДІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЧЕРВОНОГРАД",
      subtitle: "Прокат авто у Червонограді без застави. Подача 24/7. Маршрути до Львова та Рава-Руської.",
      ogTitle: "Оренда авто Червоноград — кордон і Львів | REIZ",
      ogDescription: "Прокат авто у Червонограді без застави. Подача 24/7. Маршрути до Львова та Рава-Руської.",
    },
    ru: {
      title: "Аренда авто в Червонограде — Рава-Русская, Львов, граница",
      metaDescription:
        "Прокат авто в Червонограде. Подача 24/7. Маршруты во Львов, Рава-Русскую и Белз.",
      h1: "Аренда авто в Червонограде",
      sectionCars: "АВТОМОБИЛИ REIZ В ЧЕРВОНОГРАДЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЧЕРВОНОГРАД",
      subtitle: "Прокат авто в Червонограде без залога. Подача 24/7. Маршруты во Львов и Рава-Русскую.",
      ogTitle: "Аренда авто Червоноград — граница и Львов | REIZ",
      ogDescription: "Прокат авто в Червонограде без залога. Подача 24/7. Маршруты во Львов и Рава-Русскую.",
    },
    en: {
      title: "Car Rental Chervonohrad — Rava-Ruska, Lviv, Border",
      metaDescription:
        "Rent a car in Chervonohrad. 24/7 delivery. Trips to Lviv, Rava-Ruska and Belz.",
      h1: "Car Rental in Chervonohrad",
      sectionCars: "REIZ CARS IN CHERVONOHRAD",
      sectionWelcome: "WELCOME TO REIZ CHERVONOHRAD",
      subtitle: "Car rental in Chervonohrad with no deposit. 24/7 delivery. Trips to Lviv and Rava-Ruska.",
      ogTitle: "Car Rental Chervonohrad — Border Routes | REIZ",
      ogDescription: "Car rental in Chervonohrad with no deposit. 24/7 delivery. Trips to Lviv and Rava-Ruska.",
    },
  },
  boryslav: {
    uk: {
      title: "Оренда авто у Бориславі — Трускавець, Східниця, курорти",
      metaDescription:
        "Прокат авто у Бориславі. Подача 24/7. Зручно для поїздок у Трускавець, Східницю та Карпати.",
      h1: "Оренда авто у Бориславі",
      sectionCars: "АВТОМОБІЛІ REIZ У БОРИСЛАВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ БОРИСЛАВ",
      subtitle: "Прокат авто у Бориславі без застави. Подача 24/7. Зручно для поїздок у Трускавець, Східницю та Карпати.",
      ogTitle: "Оренда авто Борислав — курортні маршрути | REIZ",
      ogDescription: "Прокат авто у Бориславі без застави. Подача 24/7 по місту. Поїздки до Трускавця та Східниці.",
    },
    ru: {
      title: "Аренда авто в Бориславе — Трускавец, Сходница, курорты",
      metaDescription:
        "Прокат авто в Бориславе. Подача 24/7. Удобно для поездок в Трускавец, Сходницу и Карпаты.",
      h1: "Аренда авто в Бориславе",
      sectionCars: "АВТОМОБИЛИ REIZ В БОРИСЛАВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ БОРИСЛАВ",
      subtitle: "Прокат авто в Бориславе без залога. Подача 24/7. Удобно для поездок в Трускавец, Сходницу и Карпаты.",
      ogTitle: "Аренда авто Борислав — курортные маршруты | REIZ",
      ogDescription: "Прокат авто в Бориславе без залога. Подача 24/7 по городу. Поездки в Трускавец и Сходницу.",
    },
    en: {
      title: "Car Rental Boryslav — Truskavets, Skhidnytsia, Resorts",
      metaDescription:
        "Rent a car in Boryslav. 24/7 delivery. Great for trips to Truskavets, Skhidnytsia and the Carpathians.",
      h1: "Car Rental in Boryslav",
      sectionCars: "REIZ CARS IN BORYSLAV",
      sectionWelcome: "WELCOME TO REIZ BORYSLAV",
      subtitle: "Car rental in Boryslav with no deposit. 24/7 delivery. Great for trips to Truskavets, Skhidnytsia and Carpathians.",
      ogTitle: "Car Rental Boryslav — Resort Trips | REIZ",
      ogDescription: "Car rental in Boryslav with no deposit. 24/7 city delivery. Trips to Truskavets and Skhidnytsia.",
    },
  },
  zhovkva: {
    uk: {
      title: "Оренда авто у Жовкві — замки Львівщини, Крехів",
      metaDescription:
        "Прокат авто у Жовкві. Подача 24/7. Маршрути до Львова, Крехова, Олеська та Підгірців.",
      h1: "Оренда авто у Жовкві",
      sectionCars: "АВТОМОБІЛІ REIZ У ЖОВКВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЖОВКВА",
      subtitle: "Прокат авто у Жовкві без застави. Подача 24/7. Маршрути до Львова, Крехова та замків Львівщини.",
      ogTitle: "Оренда авто Жовква — замки Львівщини | REIZ",
      ogDescription: "Прокат авто у Жовкві без застави. Подача 24/7. Маршрути до Львова, Крехова та замків Львівщини.",
    },
    ru: {
      title: "Аренда авто в Жолкве — замки Львовщины, Крехов",
      metaDescription:
        "Прокат авто в Жолкве. Подача 24/7. Маршруты во Львов, Крехов, Олеско и Подгорцы.",
      h1: "Аренда авто в Жолкве",
      sectionCars: "АВТОМОБИЛИ REIZ В ЖОЛКВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЖОЛКВА",
      subtitle: "Прокат авто в Жолкве без залога. Подача 24/7. Маршруты во Львов, Крехов и замки Львовщины.",
      ogTitle: "Аренда авто Жолква — замки Львовщины | REIZ",
      ogDescription: "Прокат авто в Жолкве без залога. Подача 24/7. Маршруты во Львов, Крехов и замки Львовщины.",
    },
    en: {
      title: "Car Rental Zhovkva — Lviv Region Castles, Krekhiv",
      metaDescription:
        "Rent a car in Zhovkva. 24/7 delivery. Trips to Lviv, Krekhiv, Olesko and Pidhirtsi.",
      h1: "Car Rental in Zhovkva",
      sectionCars: "REIZ CARS IN ZHOVKVA",
      sectionWelcome: "WELCOME TO REIZ ZHOVKVA",
      subtitle: "Car rental in Zhovkva with no deposit. 24/7 delivery. Trips to Lviv, Krekhiv and Lviv region castles.",
      ogTitle: "Car Rental Zhovkva — Lviv Castles | REIZ",
      ogDescription: "Car rental in Zhovkva with no deposit. 24/7 delivery. Trips to Lviv, Krekhiv and Lviv region castles.",
    },
  },
  yaremche: {
    uk: {
      title: "Оренда авто у Яремчі — Пробій, Буковель, Говерла",
      metaDescription:
        "Прокат авто у Яремчі. Подача 24/7. Зручно для маршрутів до Буковеля, Ворохти, Говерли та Яблуницького перевалу.",
      h1: "Оренда авто у Яремчі",
      sectionCars: "АВТОМОБІЛІ REIZ У ЯРЕМЧІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЯРЕМЧЕ",
      subtitle:
        "Оренда авто у Яремчі від REIZ — нові автомобілі, преміум-сервіс та зручна подача у Карпатах.",
      ogTitle: "Оренда авто Яремче — Буковель і Говерла | REIZ",
      ogDescription:
        "Прокат авто у Яремчі без застави. Подача 24/7 на курорт. Поїздки до Буковеля, Говерли та Яблуницького перевалу.",
    },
    ru: {
      title: "Аренда авто в Яремче — Пробий, Буковель, Говерла",
      metaDescription:
        "Прокат авто в Яремче. Подача 24/7. Удобные маршруты в Буковель, Ворохту, к Говерле и Яблуницкому перевалу.",
      h1: "Аренда авто в Яремче",
      sectionCars: "АВТОМОБИЛИ REIZ В ЯРЕМЧЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЯРЕМЧЕ",
      subtitle:
        "Аренда авто в Яремче от REIZ — новые автомобили, премиум-сервис и удобная подача в Карпатах.",
      ogTitle: "Аренда авто Яремче — Буковель и Говерла | REIZ",
      ogDescription:
        "Прокат авто в Яремче без залога. Подача 24/7 на курорт. Поездки в Буковель, к Говерле и Яблуницкому перевалу.",
    },
    en: {
      title: "Car Rental Yaremche — Probiy, Bukovel, Hoverla",
      metaDescription:
        "Rent a car in Yaremche. 24/7 delivery. Easy trips to Bukovel, Vorokhta, Hoverla and Yablunytsia Pass.",
      h1: "Car Rental in Yaremche",
      sectionCars: "REIZ CARS IN YAREMCHE",
      sectionWelcome: "WELCOME TO REIZ YAREMCHE",
      subtitle:
        "Car rental in Yaremche from REIZ — new vehicles, premium service and convenient delivery in the Carpathians.",
      ogTitle: "Car Rental Yaremche — Bukovel & Hoverla | REIZ",
      ogDescription:
        "Car rental in Yaremche with no deposit. 24/7 resort delivery. Trips to Bukovel, Hoverla and Yablunytsia Pass.",
    },
  },
  kolomyia: {
    uk: {
      title: "Оренда авто у Коломиї — музей писанки, Косів, Чернівці",
      metaDescription:
        "Прокат авто у Коломиї. Подача 24/7. Маршрути до Косова, Яремча, Чернівців і Верховини.",
      h1: "Оренда авто у Коломиї",
      sectionCars: "АВТОМОБІЛІ REIZ У КОЛОМИЇ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ КОЛОМИЯ",
      subtitle:
        "Прокат авто у Коломиї без застави. Подача 24/7 по місту. Маршрути до Косова, Яремча та Чернівців.",
      ogTitle: "Оренда авто Коломия — Косів і Чернівці | REIZ",
      ogDescription:
        "Прокат авто у Коломиї без застави. Подача 24/7 по місту. Маршрути до Косова, Яремча та Чернівців.",
    },
    ru: {
      title: "Аренда авто в Коломые — музей писанки, Косов, Черновцы",
      metaDescription:
        "Прокат авто в Коломые. Подача 24/7. Маршруты в Косов, Яремче, Черновцы и Верховину.",
      h1: "Аренда авто в Коломые",
      sectionCars: "АВТОМОБИЛИ REIZ В КОЛОМЫЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ КОЛОМЫЯ",
      subtitle:
        "Прокат авто в Коломые без залога. Подача 24/7 по городу. Маршруты в Косов, Яремче и Черновцы.",
      ogTitle: "Аренда авто Коломыя — Косов и Черновцы | REIZ",
      ogDescription:
        "Прокат авто в Коломые без залога. Подача 24/7 по городу. Маршруты в Косов, Яремче и Черновцы.",
    },
    en: {
      title: "Car Rental Kolomyia — Pysanka Museum, Kosiv, Chernivtsi",
      metaDescription:
        "Rent a car in Kolomyia. 24/7 delivery. Trips to Kosiv, Yaremche, Chernivtsi and Verkhovyna.",
      h1: "Car Rental in Kolomyia",
      sectionCars: "REIZ CARS IN KOLOMYIA",
      sectionWelcome: "WELCOME TO REIZ KOLOMYIA",
      subtitle:
        "Car rental in Kolomyia with no deposit. 24/7 city delivery. Trips to Kosiv, Yaremche and Chernivtsi.",
      ogTitle: "Car Rental Kolomyia — Kosiv & Chernivtsi | REIZ",
      ogDescription:
        "Car rental in Kolomyia with no deposit. 24/7 city delivery. Trips to Kosiv, Yaremche and Chernivtsi.",
    },
  },
  kalush: {
    uk: {
      title: "Оренда авто у Калуші — Івано-Франківськ, Галич, Долина",
      metaDescription:
        "Прокат авто у Калуші. Подача 24/7 по місту. Маршрути до Івано-Франківська, Галича та Долини.",
      h1: "Оренда авто у Калуші",
      sectionCars: "АВТОМОБІЛІ REIZ У КАЛУШІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ КАЛУШ",
      subtitle:
        "Прокат авто у Калуші без застави. Подача 24/7 по місту. Маршрути до Івано-Франківська, Галича та Долини.",
      ogTitle: "Оренда авто Калуш — Івано-Франківськ і Галич | REIZ",
      ogDescription:
        "Прокат авто у Калуші без застави. Подача 24/7 по місту. Маршрути до Івано-Франківська, Галича та Долини.",
    },
    ru: {
      title: "Аренда авто в Калуше — Ивано-Франковск, Галич, Долина",
      metaDescription:
        "Прокат авто в Калуше. Подача 24/7 по городу. Маршруты в Ивано-Франковск, Галич и Долину.",
      h1: "Аренда авто в Калуше",
      sectionCars: "АВТОМОБИЛИ REIZ В КАЛУШЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ КАЛУШ",
      subtitle:
        "Прокат авто в Калуше без залога. Подача 24/7 по городу. Маршруты в Ивано-Франковск, Галич и Долину.",
      ogTitle: "Аренда авто Калуш — Ивано-Франковск и Галич | REIZ",
      ogDescription:
        "Прокат авто в Калуше без залога. Подача 24/7 по городу. Маршруты в Ивано-Франковск, Галич и Долину.",
    },
    en: {
      title: "Car Rental Kalush — Ivano-Frankivsk, Halych, Dolyna",
      metaDescription:
        "Rent a car in Kalush. 24/7 city delivery. Routes to Ivano-Frankivsk, Halych and Dolyna.",
      h1: "Car Rental in Kalush",
      sectionCars: "REIZ CARS IN KALUSH",
      sectionWelcome: "WELCOME TO REIZ KALUSH",
      subtitle:
        "Car rental in Kalush with no deposit. 24/7 city delivery. Routes to Ivano-Frankivsk, Halych and Dolyna.",
      ogTitle: "Car Rental Kalush — Ivano-Frankivsk Trips | REIZ",
      ogDescription:
        "Car rental in Kalush with no deposit. 24/7 city delivery. Routes to Ivano-Frankivsk, Halych and Dolyna.",
    },
  },
  nadvirna: {
    uk: {
      title: "Оренда авто у Надвірній без застави — Карпати 24/7",
      metaDescription:
        "Прокат авто у Надвірній офіційно. Нові машини. Подача по місту 24/7. Поїздки до Буковеля, Яремча та Ворохти. Бронюйте онлайн!",
      h1: "Оренда авто у Надвірній",
      sectionCars: "АВТОМОБІЛІ REIZ У НАДВІРНІЙ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ НАДВІРНА",
      subtitle:
        "Оренда авто у Надвірній від REIZ — нові автомобілі, преміум-сервіс та зручна подача на карпатські маршрути.",
      ogTitle: "Оренда авто Надвірна — REIZ | Карпати 24/7",
      ogDescription:
        "Прокат авто у Надвірній. Без застави. Подача по місту. Поїздки до Буковеля.",
    },
    ru: {
      title: "Аренда авто в Надворной без залога — Карпаты 24/7",
      metaDescription:
        "Прокат авто в Надворной официально. Новые машины. Подача по городу 24/7. Поездки в Буковель, Яремче и Ворохту. Бронируйте онлайн!",
      h1: "Аренда авто в Надворной",
      sectionCars: "АВТОМОБИЛИ REIZ В НАДВОРНОЙ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ НАДВОРНАЯ",
      subtitle:
        "Аренда авто в Надворной от REIZ — новые автомобили, премиум-сервис и удобная подача на карпатские маршруты.",
      ogTitle: "Аренда авто Надворная — REIZ | Карпаты 24/7",
      ogDescription:
        "Прокат авто в Надворной. Без залога. Подача по городу. Поездки в Буковель.",
    },
    en: {
      title: "Car Rental Nadvirna — No Deposit, Carpathians 24/7",
      metaDescription:
        "Rent a car in Nadvirna officially. New fleet. City delivery 24/7. Trips to Bukovel, Yaremche and Vorokhta. Book online!",
      h1: "Car Rental in Nadvirna",
      sectionCars: "REIZ CARS IN NADVIRNA",
      sectionWelcome: "WELCOME TO REIZ NADVIRNA",
      subtitle:
        "Car rental in Nadvirna from REIZ — new vehicles, premium service and convenient delivery for Carpathian routes.",
      ogTitle: "Car Rental Nadvirna — REIZ | Carpathians 24/7",
      ogDescription:
        "Rent a car in Nadvirna. No deposit. City delivery. Trips to Bukovel.",
    },
  },
  kosiv: {
    uk: {
      title: "Оренда авто Косів — Кросовери для гір | REIZ",
      metaDescription:
        "Прокат авто у Косові. Надійні машини для поїздок у Шешори, Яворів, Верховину. Без застави. Подача до готелю 24/7. Бронюйте онлайн!",
      h1: "Оренда авто у Косові",
      sectionCars: "АВТОМОБІЛІ REIZ У КОСОВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ КОСІВ",
      subtitle:
        "Оренда авто у Косові від REIZ — нові автомобілі, преміум-сервіс та зручна подача на гуцульські маршрути.",
      ogTitle: "Оренда авто Косів — REIZ | Авто для Карпат",
      ogDescription:
        "Прокат авто у Косові. Кросовери та авто для гірських доріг. Подача по місту та району.",
    },
    ru: {
      title: "Аренда авто Косов — Кроссоверы для гор | REIZ",
      metaDescription:
        "Прокат авто в Косове. Надежные машины для поездок в Шешоры, Яворов, Верховину. Без залога. Подача к отелю 24/7. Бронируйте онлайн!",
      h1: "Аренда авто в Косове",
      sectionCars: "АВТОМОБИЛИ REIZ В КОСОВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ КОСОВ",
      subtitle:
        "Аренда авто в Косове от REIZ — новые автомобили, премиум-сервис и удобная подача на гуцульские маршруты.",
      ogTitle: "Аренда авто Косов — REIZ | Авто для Карпат",
      ogDescription:
        "Прокат авто в Косове. Кроссоверы и авто для горных дорог. Подача по городу и району.",
    },
    en: {
      title: "Car Rental Kosiv — Mountain Ready Cars | REIZ",
      metaDescription:
        "Rent a car in Kosiv. Reliable SUVs for trips to Sheshory, Yavoriv, Verkhovyna. No deposit options. Hotel delivery 24/7. Book online!",
      h1: "Car Rental in Kosiv — 24/7 Delivery & Hutsul Routes",
      sectionCars: "REIZ CARS IN KOSIV",
      sectionWelcome: "WELCOME TO REIZ KOSIV",
      subtitle:
        "Car rental in Kosiv from REIZ — new vehicles, premium service and convenient delivery for Hutsul routes.",
      ogTitle: "Car Rental Kosiv — REIZ | Carpathian Trips",
      ogDescription:
        "Rent a car in Kosiv. Mountain-ready cars and SUVs. Delivery within the city and region.",
    },
  },
  chortkiv: {
    uk: {
      title: "Оренда авто Чортків, Кременець, Берегове, Хуст | Туризм",
      metaDescription:
        "Прокат авто в Чорткові, Кременці, Береговому, Хусті. 🏰 Замки та термальні води. 🚗 Зручний сервіс доставки. Бронюйте зараз.",
      h1: "Оренда авто у Чорткові",
      sectionCars: "АВТОМОБІЛІ REIZ У ЧОРТКОВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЧОРТКІВ",
      subtitle:
        "Оренда авто у Чорткові від REIZ — нові автомобілі, преміум-сервіс та зручна подача на подільські маршрути.",
      ogTitle: "Оренда авто Чортків, Кременець, Берегове, Хуст | Туризм",
      ogDescription:
        "Прокат авто в Чорткові, Кременці, Береговому, Хусті. 🏰 Замки та термальні води. 🚗 Зручний сервіс доставки. Бронюйте зараз.",
    },
    ru: {
      title: "Аренда авто Чортков — Бизнес и Командировки | REIZ",
      metaDescription:
        "Прокат авто для рабочих поездок. Официальные документы. Надежные авто для маршрута Чортков–Тернополь–Черновцы. Без залога. Подача 24/7.",
      h1: "Аренда авто в Чорткове",
      sectionCars: "АВТОМОБИЛИ REIZ В ЧОРТКОВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЧОРТКОВ",
      subtitle:
        "Аренда авто в Чорткове от REIZ — новые автомобили, премиум-сервис и удобная подача на подольские маршруты.",
      ogTitle: "Аренда авто Чортков — Бизнес и Командировки | REIZ",
      ogDescription:
        "Прокат авто для рабочих поездок. Официальные документы. Надежные авто для маршрута Чортков–Тернополь–Черновцы. Без залога. Подача 24/7.",
    },
    en: {
      title: "Car Rental Chortkiv, Kremenets, Berehove, Khust",
      metaDescription:
        "Rent a car in Chortkiv, Kremenets, Berehove, Khust. 🏰 Explore castles and thermal baths. 🚗 Convenient service. Book now.",
      h1: "Car Rental in Chortkiv",
      sectionCars: "REIZ CARS IN CHORTKIV",
      sectionWelcome: "WELCOME TO REIZ CHORTKIV",
      subtitle:
        "Car rental in Chortkiv from REIZ — new vehicles, premium service and convenient delivery for Podillia routes.",
      ogTitle: "Car Rental Chortkiv, Kremenets, Berehove, Khust",
      ogDescription:
        "Rent a car in Chortkiv, Kremenets, Berehove, Khust. 🏰 Explore castles and thermal baths. 🚗 Convenient service. Book now.",
    },
  },
  kremenets: {
    uk: {
      title: "Оренда авто Кременець — Поїздки в Почаїв | REIZ",
      metaDescription:
        "Прокат авто у Кременці. Комфортні авто для поїздок у Почаївську Лавру та Дубно. Без застави. Подача до готелю чи вокзалу. Бронюйте!",
      h1: "Оренда авто у Кременці",
      sectionCars: "АВТОМОБІЛІ REIZ У КРЕМЕНЦІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ КРЕМЕНЕЦЬ",
      subtitle:
        "Оренда авто у Кременці від REIZ — нові автомобілі, преміум-сервіс та зручна подача на туристичні маршрути.",
      ogTitle: "Оренда авто Кременець — REIZ | Подорожі до Лаври",
      ogDescription:
        "Прокат авто у Кременці. Зручні машини для поїздок по святих місцях. Подача по місту.",
    },
    ru: {
      title: "Аренда авто Кременец — Поездки в Почаев | REIZ",
      metaDescription:
        "Прокат авто в Кременце. Комфортные авто для поездок в Почаевскую Лавру и Дубно. Без залога. Подача к отелю или вокзалу. Бронируйте!",
      h1: "Аренда авто в Кременце",
      sectionCars: "АВТОМОБИЛИ REIZ В КРЕМЕНЦЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ КРЕМЕНЕЦ",
      subtitle:
        "Аренда авто в Кременце от REIZ — новые автомобили, премиум-сервис и удобная подача на туристические маршруты.",
      ogTitle: "Аренда авто Кременец — REIZ | Поездки в Лавру",
      ogDescription:
        "Прокат авто в Кременце. Удобные машины для поездок по святым местам. Подача по городу.",
    },
    en: {
      title: "Car Rental Kremenets — Pochaiv Trips | REIZ",
      metaDescription:
        "Rent a car in Kremenets. Comfortable cars for visiting Pochaiv Lavra and Dubno Castle. Hotel delivery. No deposit options. Book online!",
      h1: "Car Rental in Kremenets",
      sectionCars: "REIZ CARS IN KREMENETS",
      sectionWelcome: "WELCOME TO REIZ KREMENETS",
      subtitle:
        "Car rental in Kremenets from REIZ — new vehicles, premium service and convenient delivery for tourist routes.",
      ogTitle: "Car Rental Kremenets — REIZ | Pochaiv Tours",
      ogDescription:
        "Rent a car in Kremenets. Best choice for visiting Pochaiv. City and hotel delivery available.",
    },
  },
  berehove: {
    uk: {
      title: "Оренда авто Берегове — Термальні води | REIZ",
      metaDescription:
        "Прокат авто у Берегові. Авто з кондиціонером для поїздок у Косино та на винні дегустації. Подача до басейнів та кордону. Без застави. Бронюйте!",
      h1: "Оренда авто у Береговому",
      sectionCars: "АВТОМОБІЛІ REIZ У БЕРЕГОВОМУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ БЕРЕГОВЕ",
      subtitle:
        "Оренда авто у Береговому від REIZ — нові автомобілі, преміум-сервіс та зручна подача біля термальних курортів.",
      ogTitle: "Оренда авто Берегове — REIZ | Відпочинок та Кордон",
      ogDescription:
        "Прокат авто у Берегові. Комфортні машини для спекотного клімату та подорожей Закарпаттям.",
    },
    ru: {
      title: "Аренда авто Берегово — Термальные воды | REIZ",
      metaDescription:
        "Прокат авто в Берегово. Авто с кондиционером для поездок в Косино и на винные дегустации. Подача к бассейнам и границе. Без залога. Бронируйте!",
      h1: "Аренда авто в Берегово",
      sectionCars: "АВТОМОБИЛИ REIZ В БЕРЕГОВО",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ БЕРЕГОВО",
      subtitle:
        "Аренда авто в Берегово от REIZ — новые автомобили, премиум-сервис и удобная подача у термальных курортов.",
      ogTitle: "Аренда авто Берегово — REIZ | Отдых и Граница",
      ogDescription:
        "Прокат авто в Берегово. Комфортные машины для жаркого климата и путешествий по Закарпатью.",
    },
    en: {
      title: "Car Rental Berehove — Thermal Spas & Wine | REIZ",
      metaDescription:
        "Rent a car in Berehove. A/C cars perfect for Kosino Thermal Waters and wine tours. Delivery to border and pools. No deposit options. Book online!",
      h1: "Car Rental in Berehove",
      sectionCars: "REIZ CARS IN BEREHOVE",
      sectionWelcome: "WELCOME TO REIZ BEREHOVE",
      subtitle:
        "Car rental in Berehove from REIZ — new vehicles, premium service and convenient delivery near thermal resorts.",
      ogTitle: "Car Rental Berehove — REIZ | Transcarpathia Tours",
      ogDescription:
        "Rent a car in Berehove. Reliable cars for local trips, thermal spas, and vineyards.",
    },
  },
  khust: {
    uk: {
      title: "Оренда авто Хуст — Без застави. Кросовери | REIZ",
      metaDescription:
        "Прокат авто у Хусті без водія. Подача на залізничний вокзал. Кросовери та економ-клас. Офіційний договір, КАСКО. Бронюйте онлайн!",
      h1: "Оренда авто у Хусті — Закарпаття та подача 24/7",
      sectionCars: "АВТОМОБІЛІ REIZ У ХУСТІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ХУСТ",
      subtitle:
        "Оренда авто у Хусті від REIZ — нові автомобілі, преміум-сервіс та зручна подача для гірських маршрутів.",
      ogTitle: "Оренда авто Хуст — REIZ | Прокат без водія",
      ogDescription:
        "Послуги прокату авто в Хусті. Великий вибір: від економ до позашляховиків. Швидка подача.",
    },
    ru: {
      title: "Аренда авто Хуст — Без залога. Кроссоверы | REIZ",
      metaDescription:
        "Прокат авто в Хусте без водителя. Подача на ж/д вокзал. Кроссоверы и эконом-класс. Официальный договор, КАСКО. Бронируйте онлайн!",
      h1: "Аренда авто в Хусте — Закарпатье и подача 24/7",
      sectionCars: "АВТОМОБИЛИ REIZ В ХУСТЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ХУСТ",
      subtitle:
        "Аренда авто в Хусте — Закарпатье и подача 24/7. Новые автомобили и премиум-сервис для горных маршрутов.",
      ogTitle: "Аренда авто Хуст — REIZ | Прокат без водителя",
      ogDescription:
        "Услуги проката авто в Хусте. Большой выбор: от эконом до внедорожников. Быстрая подача.",
    },
    en: {
      title: "Car Rental Khust — No Deposit. SUVs | REIZ",
      metaDescription:
        "Rent a car in Khust. Self-drive service. SUV and Economy cars available. Railway station delivery. Full insurance included. Book online!",
      h1: "Car Rental in Khust — Zakarpattia & 24/7 Delivery",
      sectionCars: "REIZ CARS IN KHUST",
      sectionWelcome: "WELCOME TO REIZ KHUST",
      subtitle:
        "Car rental in Khust from REIZ — new vehicles, premium service and convenient delivery for mountain routes.",
      ogTitle: "Car Rental Khust — REIZ | Self Drive Service",
      ogDescription:
        "Car rental services in Khust. Wide selection: economy to SUVs. Fast delivery.",
    },
  },
  rakhiv: {
    uk: {
      title: "Оренда авто Рахів — Драгобрат та Говерла | REIZ",
      metaDescription:
        "Прокат авто у Рахові. Повнопривідні авто (4x4) для поїздок на Драгобрат та Буковель. Зимова гума. Подача до вокзалу. Без застави. Бронюйте!",
      h1: "Оренда авто у Рахові",
      sectionCars: "АВТОМОБІЛІ REIZ У РАХОВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ РАХІВ",
      subtitle:
        "Оренда авто у Рахові від REIZ — нові автомобілі, преміум-сервіс та зручна подача на карпатські маршрути.",
      ogTitle: "Оренда авто Рахів — REIZ | Повний привід 4x4",
      ogDescription:
        "Прокат позашляховиків у Рахові. Надійні авто для найвищих гір України.",
    },
    ru: {
      title: "Аренда авто Рахов — Драгобрат и Говерла | REIZ",
      metaDescription:
        "Прокат авто в Рахове. Полноприводные авто (4x4) для поездок на Драгобрат и Буковель. Зимняя резина. Подача к вокзалу. Без залога. Бронируйте!",
      h1: "Аренда авто в Рахове",
      sectionCars: "АВТОМОБИЛИ REIZ В РАХОВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ РАХОВ",
      subtitle:
        "Аренда авто в Рахове от REIZ — новые автомобили, премиум-сервис и удобная подача на карпатские маршруты.",
      ogTitle: "Аренда авто Рахов — REIZ | Полный привод 4x4",
      ogDescription:
        "Прокат внедорожников в Рахове. Надежные авто для самых высоких гор Украины.",
    },
    en: {
      title: "Car Rental Rakhiv — Dragobrat & Hoverla | REIZ",
      metaDescription:
        "Rent a 4x4 car in Rakhiv. Best SUVs for Dragobrat and Bukovel trips. Winter tires included. Railway station delivery. No deposit options. Book online!",
      h1: "Car Rental in Rakhiv",
      sectionCars: "REIZ CARS IN RAKHIV",
      sectionWelcome: "WELCOME TO REIZ RAKHIV",
      subtitle:
        "Car rental in Rakhiv from REIZ — new vehicles, premium service and convenient delivery for Carpathian routes.",
      ogTitle: "Car Rental Rakhiv — REIZ | 4x4 SUVs",
      ogDescription:
        "SUV rental in Rakhiv. Reliable cars for the highest mountains in Ukraine.",
    },
  },
};

// Інтерфейс для місць подачі авто
export interface PickupLocation {
  id: string;
  name: {
    uk: string;
    ru: string;
    en: string;
  };
  type: "railway" | "bus" | "airport" | "mall" | "center" | "other";
}

// Популярні місця подачі для кожного міста
export const cityPickupLocations: Record<string, PickupLocation[]> = {
  kyiv: [
    {
      id: "kyiv-railway",
      name: {
        uk: "Центральний залізничний вокзал",
        ru: "Центральный ж/д вокзал",
        en: "Central Railway Station",
      },
      type: "railway",
    },
    {
      id: "kyiv-bus",
      name: {
        uk: "Автовокзал «Центральний»",
        ru: "Автовокзал «Центральный»",
        en: "Central Bus Station",
      },
      type: "bus",
    },
    {
      id: "kyiv-boryspil",
      name: {
        uk: "Аеропорт «Бориспіль» (KBP)",
        ru: "Аэропорт «Борисполь» (KBP)",
        en: "Boryspil Airport (KBP)",
      },
      type: "airport",
    },
    {
      id: "kyiv-ocean-plaza",
      name: {
        uk: "ТРЦ Ocean Plaza",
        ru: "ТРЦ Ocean Plaza",
        en: "Ocean Plaza Mall",
      },
      type: "mall",
    },
    {
      id: "kyiv-maidan",
      name: {
        uk: "Майдан Незалежності",
        ru: "Майдан Независимости",
        en: "Maidan Nezalezhnosti",
      },
      type: "center",
    },
  ],
  lviv: [
    {
      id: "lviv-railway",
      name: {
        uk: "Головний залізничний вокзал",
        ru: "Главный ж/д вокзал",
        en: "Main Railway Station",
      },
      type: "railway",
    },
    {
      id: "lviv-bus",
      name: {
        uk: "Автостанція №8 (Стрийська)",
        ru: "Автостанция №8 (Стрыйская)",
        en: "Bus Station №8 (Stryiska)",
      },
      type: "bus",
    },
    {
      id: "lviv-airport",
      name: {
        uk: "Аеропорт «Львів» (LWO)",
        ru: "Аэропорт «Львов» (LWO)",
        en: "Lviv Airport (LWO)",
      },
      type: "airport",
    },
    {
      id: "lviv-forum",
      name: {
        uk: "ТРЦ Forum Lviv",
        ru: "ТРЦ Forum Lviv",
        en: "Forum Lviv Mall",
      },
      type: "mall",
    },
    {
      id: "lviv-rynok",
      name: {
        uk: "Площа Ринок",
        ru: "Площадь Рынок",
        en: "Rynok Square",
      },
      type: "center",
    },
  ],
  odesa: [
    {
      id: "odesa-railway",
      name: {
        uk: "Залізничний вокзал «Одеса-Головна»",
        ru: "Ж/д вокзал «Одесса-Главная»",
        en: "Odesa Main Railway Station",
      },
      type: "railway",
    },
    {
      id: "odesa-bus",
      name: {
        uk: "Автовокзал «Привоз»",
        ru: "Автовокзал «Привоз»",
        en: "Pryvoz Bus Station",
      },
      type: "bus",
    },
    {
      id: "odesa-airport",
      name: {
        uk: "Аеропорт «Одеса» (ODS)",
        ru: "Аэропорт «Одесса» (ODS)",
        en: "Odesa Airport (ODS)",
      },
      type: "airport",
    },
    {
      id: "odesa-fontan",
      name: {
        uk: "ТРЦ Fontan Sky Center",
        ru: "ТРЦ Fontan Sky Center",
        en: "Fontan Sky Center Mall",
      },
      type: "mall",
    },
    {
      id: "odesa-derybasivska",
      name: {
        uk: "Дерибасівська вулиця",
        ru: "Дерибасовская улица",
        en: "Derybasivska Street",
      },
      type: "center",
    },
  ],
  dnipro: [
    {
      id: "dnipro-railway",
      name: {
        uk: "Залізничний вокзал «Дніпро-Головний»",
        ru: "Ж/д вокзал «Днепр-Главный»",
        en: "Dnipro Main Railway Station",
      },
      type: "railway",
    },
    {
      id: "dnipro-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
      },
      type: "bus",
    },
    {
      id: "dnipro-airport",
      name: {
        uk: "Аеропорт «Дніпро» (DNK)",
        ru: "Аэропорт «Днепр» (DNK)",
        en: "Dnipro Airport (DNK)",
      },
      type: "airport",
    },
    {
      id: "dnipro-most-city",
      name: {
        uk: "ТРЦ MOST-city",
        ru: "ТРЦ MOST-city",
        en: "MOST-city Mall",
      },
      type: "mall",
    },
    {
      id: "dnipro-european",
      name: {
        uk: "Європейська площа",
        ru: "Европейская площадь",
        en: "European Square",
      },
      type: "center",
    },
  ],
  kharkiv: [
    {
      id: "kharkiv-railway",
      name: {
        uk: "Залізничний вокзал «Харків-Пасажирський»",
        ru: "Ж/д вокзал «Харьков-Пассажирский»",
        en: "Kharkiv Passenger Railway Station",
      },
      type: "railway",
    },
    {
      id: "kharkiv-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
      },
      type: "bus",
    },
    {
      id: "kharkiv-airport",
      name: {
        uk: "Міжнародний аеропорт «Харків» (HRK)",
        ru: "Международный аэропорт «Харьков» (HRK)",
        en: "Kharkiv International Airport (HRK)",
      },
      type: "airport",
    },
    {
      id: "kharkiv-nikolsky",
      name: {
        uk: "ТРЦ Нікольський",
        ru: "ТРЦ Никольский",
        en: "Nikolsky Mall",
      },
      type: "mall",
    },
    {
      id: "kharkiv-svobody",
      name: {
        uk: "Площа Свободи",
        ru: "Площадь Свободы",
        en: "Freedom Square",
      },
      type: "center",
    },
  ],
  ternopil: [
    {
      id: "ternopil-railway",
      name: {
        uk: "Залізничний вокзал «Тернопіль»",
        ru: "Ж/д вокзал «Тернополь»",
        en: "Ternopil Railway Station",
      },
      type: "railway",
    },
    {
      id: "ternopil-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
      },
      type: "bus",
    },
    {
      id: "ternopil-podillia",
      name: {
        uk: "ТРЦ «Поділля City»",
        ru: "ТРЦ «Подолье City»",
        en: "Podillia City Mall",
      },
      type: "mall",
    },
    {
      id: "ternopil-teatralna",
      name: {
        uk: "Театральна площа",
        ru: "Театральная площадь",
        en: "Theatre Square",
      },
      type: "center",
    },
  ],
  uzhhorod: [
    {
      id: "uzhhorod-railway",
      name: {
        uk: "Залізничний вокзал «Ужгород»",
        ru: "Ж/д вокзал «Ужгород»",
        en: "Uzhhorod Railway Station",
      },
      type: "railway",
    },
    {
      id: "uzhhorod-bus",
      name: {
        uk: "Автовокзал «Ужгород»",
        ru: "Автовокзал «Ужгород»",
        en: "Uzhhorod Bus Station",
      },
      type: "bus",
    },
    {
      id: "uzhhorod-dastор",
      name: {
        uk: "ТРЦ «Дастор»",
        ru: "ТРЦ «Дастор»",
        en: "Dastor Mall",
      },
      type: "mall",
    },
    {
      id: "uzhhorod-narodna",
      name: {
        uk: "Площа Народна",
        ru: "Народная площадь",
        en: "Narodna Square",
      },
      type: "center",
    },
  ],
  vinnytsia: [
    {
      id: "vinnytsia-railway",
      name: {
        uk: "Залізничний вокзал «Вінниця»",
        ru: "Ж/д вокзал «Винница»",
        en: "Vinnytsia Railway Station",
      },
      type: "railway",
    },
    {
      id: "vinnytsia-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
      },
      type: "bus",
    },
    {
      id: "vinnytsia-airport",
      name: {
        uk: "Аеропорт «Вінниця» (VIN)",
        ru: "Аэропорт «Винница» (VIN)",
        en: "Vinnytsia Airport (VIN)",
      },
      type: "airport",
    },
    {
      id: "vinnytsia-skypark",
      name: {
        uk: "ТРЦ Sky Park",
        ru: "ТРЦ Sky Park",
        en: "Sky Park Mall",
      },
      type: "mall",
    },
    {
      id: "vinnytsia-european",
      name: {
        uk: "Європейська площа",
        ru: "Европейская площадь",
        en: "European Square",
      },
      type: "center",
    },
  ],
  mukachevo: [
    {
      id: "mukachevo-railway",
      name: {
        uk: "Залізничний вокзал «Мукачево»",
        ru: "Ж/д вокзал «Мукачево»",
        en: "Mukachevo Railway Station",
      },
      type: "railway",
    },
    {
      id: "mukachevo-bus",
      name: {
        uk: "Автовокзал «Мукачево»",
        ru: "Автовокзал «Мукачево»",
        en: "Mukachevo Bus Station",
      },
      type: "bus",
    },
    {
      id: "mukachevo-karpaty",
      name: {
        uk: "ТЦ «Карпати»",
        ru: "ТЦ «Карпаты»",
        en: "Karpaty Shopping Center",
      },
      type: "mall",
    },
    {
      id: "mukachevo-kyryla",
      name: {
        uk: "Площа Кирила і Мефодія",
        ru: "Площадь Кирилла и Мефодия",
        en: "Cyril and Methodius Square",
      },
      type: "center",
    },
  ],
  chernivtsi: [
    {
      id: "chernivtsi-railway",
      name: {
        uk: "Залізничний вокзал «Чернівці»",
        ru: "Ж/д вокзал «Черновцы»",
        en: "Chernivtsi Railway Station",
      },
      type: "railway",
    },
    {
      id: "chernivtsi-bus",
      name: {
        uk: "Автовокзал «Чернівці»",
        ru: "Автовокзал «Черновцы»",
        en: "Chernivtsi Bus Station",
      },
      type: "bus",
    },
    {
      id: "chernivtsi-depot",
      name: {
        uk: "ТРЦ «Депот»",
        ru: "ТРЦ «Депот»",
        en: "Depot Mall",
      },
      type: "mall",
    },
    {
      id: "chernivtsi-centralna",
      name: {
        uk: "Центральна площа",
        ru: "Центральная площадь",
        en: "Central Square",
      },
      type: "center",
    },
  ],
  poltava: [
    {
      id: "poltava-railway",
      name: {
        uk: "Залізничний вокзал «Полтава-Київська»",
        ru: "Ж/д вокзал «Полтава-Киевская»",
        en: "Poltava-Kyivska Railway Station",
      },
      type: "railway",
    },
    {
      id: "poltava-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
      },
      type: "bus",
    },
    {
      id: "poltava-kyiv-mall",
      name: {
        uk: "ТРЦ «Київ»",
        ru: "ТРЦ «Киев»",
        en: "Kyiv Mall",
      },
      type: "mall",
    },
    {
      id: "poltava-kruhly",
      name: {
        uk: "Круглий сквер",
        ru: "Круглый сквер",
        en: "Round Square",
      },
      type: "center",
    },
  ],
  zaporizhzhia: [
    {
      id: "zaporizhzhia-railway",
      name: {
        uk: "Залізничний вокзал «Запоріжжя-1»",
        ru: "Ж/д вокзал «Запорожье-1»",
        en: "Zaporizhzhia-1 Railway Station",
      },
      type: "railway",
    },
    {
      id: "zaporizhzhia-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
      },
      type: "bus",
    },
    {
      id: "zaporizhzhia-airport",
      name: {
        uk: "Аеропорт «Запоріжжя» (OZH)",
        ru: "Аэропорт «Запорожье» (OZH)",
        en: "Zaporizhzhia Airport (OZH)",
      },
      type: "airport",
    },
    {
      id: "zaporizhzhia-city-mall",
      name: {
        uk: "ТРЦ City Mall",
        ru: "ТРЦ City Mall",
        en: "City Mall",
      },
      type: "mall",
    },
    {
      id: "zaporizhzhia-festyvalna",
      name: {
        uk: "Площа Фестивальна",
        ru: "Фестивальная площадь",
        en: "Festival Square",
      },
      type: "center",
    },
  ],
  boryspil: [
    {
      id: "boryspil-airport",
      name: {
        uk: "Міжнародний аеропорт «Бориспіль» (KBP)",
        ru: "Международный аэропорт «Борисполь» (KBP)",
        en: "Boryspil International Airport (KBP)",
      },
      type: "airport",
    },
    {
      id: "boryspil-terminal-d",
      name: {
        uk: "Аеропорт «Бориспіль» — Термінал D",
        ru: "Аэропорт «Борисполь» — Терминал D",
        en: "Boryspil Airport — Terminal D",
      },
      type: "airport",
    },
    {
      id: "boryspil-terminal-f",
      name: {
        uk: "Аеропорт «Бориспіль» — Термінал F",
        ru: "Аэропорт «Борисполь» — Терминал F",
        en: "Boryspil Airport — Terminal F",
      },
      type: "airport",
    },
    {
      id: "boryspil-railway",
      name: {
        uk: "Залізничний вокзал «Бориспіль»",
        ru: "Ж/д вокзал «Борисполь»",
        en: "Boryspil Railway Station",
      },
      type: "railway",
    },
    {
      id: "boryspil-center",
      name: {
        uk: "Центр міста Бориспіль",
        ru: "Центр города Борисполь",
        en: "Boryspil City Center",
      },
      type: "center",
    },
  ],
  "ivano-frankivsk": [
    {
      id: "ivano-frankivsk-railway",
      name: {
        uk: "Залізничний вокзал «Івано-Франківськ»",
        ru: "Ж/д вокзал «Ивано-Франковск»",
        en: "Ivano-Frankivsk Railway Station",
      },
      type: "railway",
    },
    {
      id: "ivano-frankivsk-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
      },
      type: "bus",
    },
    {
      id: "ivano-frankivsk-airport",
      name: {
        uk: "Аеропорт «Івано-Франківськ» (IFO)",
        ru: "Аэропорт «Ивано-Франковск» (IFO)",
        en: "Ivano-Frankivsk Airport (IFO)",
      },
      type: "airport",
    },
    {
      id: "ivano-frankivsk-arsen",
      name: {
        uk: "ТРЦ «Арсен»",
        ru: "ТРЦ «Арсен»",
        en: "Arsen Mall",
      },
      type: "mall",
    },
    {
      id: "ivano-frankivsk-viche",
      name: {
        uk: "Площа Вічевий Майдан",
        ru: "Площадь Вечевой Майдан",
        en: "Viche Maidan Square",
      },
      type: "center",
    },
  ],
  bukovel: [
    {
      id: "bukovel-resort",
      name: {
        uk: "Курорт Буковель — головний вхід",
        ru: "Курорт Буковель — главный вход",
        en: "Bukovel Resort — Main Entrance",
      },
      type: "center",
    },
    {
      id: "bukovel-lift-8",
      name: {
        uk: "Підйомник №8 (Буковель)",
        ru: "Подъемник №8 (Буковель)",
        en: "Lift №8 (Bukovel)",
      },
      type: "other",
    },
    {
      id: "bukovel-yaremche",
      name: {
        uk: "Яремче — залізничний вокзал",
        ru: "Яремче — ж/д вокзал",
        en: "Yaremche Railway Station",
      },
      type: "railway",
    },
    {
      id: "bukovel-ivano-frankivsk-airport",
      name: {
        uk: "Аеропорт «Івано-Франківськ» (IFO)",
        ru: "Аэропорт «Ивано-Франковск» (IFO)",
        en: "Ivano-Frankivsk Airport (IFO)",
      },
      type: "airport",
    },
  ],
  truskavets: [
    {
      id: "truskavets-railway",
      name: {
        uk: "Залізничний вокзал «Трускавець»",
        ru: "Ж/д вокзал «Трускавец»",
        en: "Truskavets Railway Station",
      },
      type: "railway",
    },
    {
      id: "truskavets-bus",
      name: {
        uk: "Автовокзал «Трускавець»",
        ru: "Автовокзал «Трускавец»",
        en: "Truskavets Bus Station",
      },
      type: "bus",
    },
    {
      id: "truskavets-naftusya",
      name: {
        uk: "Бювет «Нафтуся»",
        ru: "Бювет «Нафтуся»",
        en: "Naftusya Pump Room",
      },
      type: "center",
    },
    {
      id: "truskavets-lviv-airport",
      name: {
        uk: "Аеропорт «Львів» (LWO)",
        ru: "Аэропорт «Львов» (LWO)",
        en: "Lviv Airport (LWO)",
      },
      type: "airport",
    },
  ],
  skhidnytsia: [
    {
      id: "skhidnytsia-center",
      name: {
        uk: "Центр Східниці",
        ru: "Центр Сходницы",
        en: "Skhidnytsia Center",
      },
      type: "center",
    },
    {
      id: "skhidnytsia-naftusya",
      name: {
        uk: "Бювет мінеральних вод",
        ru: "Бювет минеральных вод",
        en: "Mineral Water Pump Room",
      },
      type: "other",
    },
    {
      id: "skhidnytsia-drohobych",
      name: {
        uk: "Дрогобич — залізничний вокзал",
        ru: "Дрогобыч — ж/д вокзал",
        en: "Drohobych Railway Station",
      },
      type: "railway",
    },
    {
      id: "skhidnytsia-lviv-airport",
      name: {
        uk: "Аеропорт «Львів» (LWO)",
        ru: "Аэропорт «Львов» (LWO)",
        en: "Lviv Airport (LWO)",
      },
      type: "airport",
    },
  ],
  lutsk: [
    {
      id: "lutsk-railway",
      name: {
        uk: "Залізничний вокзал «Луцьк»",
        ru: "Ж/д вокзал «Луцк»",
        en: "Lutsk Railway Station",
      },
      type: "railway",
    },
    {
      id: "lutsk-bus",
      name: {
        uk: "Автовокзал «Луцьк»",
        ru: "Автовокзал «Луцк»",
        en: "Lutsk Bus Station",
      },
      type: "bus",
    },
    {
      id: "lutsk-center",
      name: {
        uk: "Центр міста Луцьк",
        ru: "Центр города Луцк",
        en: "Lutsk City Center",
      },
      type: "center",
    },
  ],
  rivne: [
    {
      id: "rivne-railway",
      name: {
        uk: "Залізничний вокзал «Рівне»",
        ru: "Ж/д вокзал «Ровно»",
        en: "Rivne Railway Station",
      },
      type: "railway",
    },
    {
      id: "rivne-bus",
      name: {
        uk: "Автовокзал «Рівне»",
        ru: "Автовокзал «Ровно»",
        en: "Rivne Bus Station",
      },
      type: "bus",
    },
    {
      id: "rivne-center",
      name: {
        uk: "Центр міста Рівне",
        ru: "Центр города Ровно",
        en: "Rivne City Center",
      },
      type: "center",
    },
  ],
  khmelnytskyi: [
    {
      id: "khmelnytskyi-railway",
      name: {
        uk: "Залізничний вокзал «Хмельницький»",
        ru: "Ж/д вокзал «Хмельницкий»",
        en: "Khmelnytskyi Railway Station",
      },
      type: "railway",
    },
    {
      id: "khmelnytskyi-bus",
      name: {
        uk: "Автовокзал «Хмельницький»",
        ru: "Автовокзал «Хмельницкий»",
        en: "Khmelnytskyi Bus Station",
      },
      type: "bus",
    },
    {
      id: "khmelnytskyi-center",
      name: {
        uk: "Центр міста Хмельницький",
        ru: "Центр города Хмельницкий",
        en: "Khmelnytskyi City Center",
      },
      type: "center",
    },
  ],
  "kamianets-podilskyi": [
    {
      id: "kamianets-fortress",
      name: {
        uk: "Кам'янець-Подільська фортеця",
        ru: "Каменец-Подольская крепость",
        en: "Kamianets-Podilskyi Fortress",
      },
      type: "other",
    },
    {
      id: "kamianets-old-town",
      name: {
        uk: "Старе місто Кам'янець-Подільський",
        ru: "Старый город Каменец-Подольский",
        en: "Kamianets-Podilskyi Old Town",
      },
      type: "center",
    },
    {
      id: "kamianets-bus",
      name: {
        uk: "Автовокзал «Кам'янець-Подільський»",
        ru: "Автовокзал «Каменец-Подольский»",
        en: "Kamianets-Podilskyi Bus Station",
      },
      type: "bus",
    },
  ],
  drohobych: [
    {
      id: "drohobych-railway",
      name: { uk: "Залізничний вокзал «Дрогобич»", ru: "Ж/д вокзал «Дрогобыч»", en: "Drohobych Railway Station" },
      type: "railway",
    },
    {
      id: "drohobych-center",
      name: { uk: "Центр міста Дрогобич", ru: "Центр города Дрогобыч", en: "Drohobych City Center" },
      type: "center",
    },
  ],
  stryi: [
    {
      id: "stryi-railway",
      name: { uk: "Залізничний вокзал «Стрий»", ru: "Ж/д вокзал «Стрый»", en: "Stryi Railway Station" },
      type: "railway",
    },
    {
      id: "stryi-center",
      name: { uk: "Центр міста Стрий", ru: "Центр города Стрый", en: "Stryi City Center" },
      type: "center",
    },
  ],
  sambir: [
    {
      id: "sambir-railway",
      name: { uk: "Залізничний вокзал «Самбір»", ru: "Ж/д вокзал «Самбор»", en: "Sambir Railway Station" },
      type: "railway",
    },
    {
      id: "sambir-center",
      name: { uk: "Центр міста Самбір", ru: "Центр города Самбор", en: "Sambir City Center" },
      type: "center",
    },
  ],
  chervonohrad: [
    {
      id: "chervonohrad-center",
      name: { uk: "Центр міста Червоноград", ru: "Центр города Червоноград", en: "Chervonohrad City Center" },
      type: "center",
    },
  ],
  boryslav: [
    {
      id: "boryslav-center",
      name: { uk: "Центр міста Борислав", ru: "Центр города Борислав", en: "Boryslav City Center" },
      type: "center",
    },
  ],
  zhovkva: [
    {
      id: "zhovkva-castle",
      name: { uk: "Жовківський замок", ru: "Жолковский замок", en: "Zhovkva Castle" },
      type: "other",
    },
    {
      id: "zhovkva-center",
      name: { uk: "Центр міста Жовква", ru: "Центр города Жолква", en: "Zhovkva City Center" },
      type: "center",
    },
  ],
  yaremche: [
    {
      id: "yaremche-railway",
      name: { uk: "Залізнична станція «Яремче»", ru: "Ж/д станция «Яремче»", en: "Yaremche Railway Station" },
      type: "railway",
    },
    {
      id: "yaremche-probiy",
      name: { uk: "Водоспад Пробій", ru: "Водопад Пробий", en: "Probiy Waterfall" },
      type: "other",
    },
    {
      id: "yaremche-center",
      name: { uk: "Центр Яремче", ru: "Центр Яремче", en: "Yaremche City Center" },
      type: "center",
    },
  ],
  kolomyia: [
    {
      id: "kolomyia-railway",
      name: { uk: "Залізничний вокзал «Коломия»", ru: "Ж/д вокзал «Коломыя»", en: "Kolomyia Railway Station" },
      type: "railway",
    },
    {
      id: "kolomyia-bus",
      name: { uk: "Автовокзал «Коломия»", ru: "Автовокзал «Коломыя»", en: "Kolomyia Bus Station" },
      type: "bus",
    },
    {
      id: "kolomyia-center",
      name: { uk: "Центр міста Коломия", ru: "Центр города Коломыя", en: "Kolomyia City Center" },
      type: "center",
    },
  ],
  kalush: [
    {
      id: "kalush-railway",
      name: { uk: "Залізничний вокзал «Калуш»", ru: "Ж/д вокзал «Калуш»", en: "Kalush Railway Station" },
      type: "railway",
    },
    {
      id: "kalush-bus",
      name: { uk: "Автовокзал «Калуш»", ru: "Автовокзал «Калуш»", en: "Kalush Bus Station" },
      type: "bus",
    },
    {
      id: "kalush-center",
      name: { uk: "Центр міста Калуш", ru: "Центр города Калуш", en: "Kalush City Center" },
      type: "center",
    },
  ],
  nadvirna: [
    {
      id: "nadvirna-railway",
      name: { uk: "Залізничний вокзал «Надвірна»", ru: "Ж/д вокзал «Надворная»", en: "Nadvirna Railway Station" },
      type: "railway",
    },
    {
      id: "nadvirna-bus",
      name: { uk: "Автовокзал «Надвірна»", ru: "Автовокзал «Надворная»", en: "Nadvirna Bus Station" },
      type: "bus",
    },
    {
      id: "nadvirna-center",
      name: { uk: "Центр міста Надвірна", ru: "Центр города Надворная", en: "Nadvirna City Center" },
      type: "center",
    },
  ],
  kosiv: [
    {
      id: "kosiv-bus",
      name: { uk: "Автовокзал «Косів»", ru: "Автовокзал «Косов»", en: "Kosiv Bus Station" },
      type: "bus",
    },
    {
      id: "kosiv-market",
      name: { uk: "Косівський базар", ru: "Косовский базар", en: "Kosiv Market" },
      type: "other",
    },
    {
      id: "kosiv-center",
      name: { uk: "Центр міста Косів", ru: "Центр города Косов", en: "Kosiv City Center" },
      type: "center",
    },
  ],
  chortkiv: [
    {
      id: "chortkiv-railway",
      name: { uk: "Залізничний вокзал «Чортків»", ru: "Ж/д вокзал «Чортков»", en: "Chortkiv Railway Station" },
      type: "railway",
    },
    {
      id: "chortkiv-bus",
      name: { uk: "Автовокзал «Чортків»", ru: "Автовокзал «Чортков»", en: "Chortkiv Bus Station" },
      type: "bus",
    },
    {
      id: "chortkiv-center",
      name: { uk: "Центр міста Чортків", ru: "Центр города Чортков", en: "Chortkiv City Center" },
      type: "center",
    },
  ],
  kremenets: [
    {
      id: "kremenets-bus",
      name: { uk: "Автовокзал «Кременець»", ru: "Автовокзал «Кременец»", en: "Kremenets Bus Station" },
      type: "bus",
    },
    {
      id: "kremenets-castle",
      name: { uk: "Замкова гора", ru: "Замковая гора", en: "Castle Hill" },
      type: "other",
    },
    {
      id: "kremenets-center",
      name: { uk: "Центр міста Кременець", ru: "Центр города Кременец", en: "Kremenets City Center" },
      type: "center",
    },
  ],
  berehove: [
    {
      id: "berehove-railway",
      name: { uk: "Залізничний вокзал «Берегове»", ru: "Ж/д вокзал «Берегово»", en: "Berehove Railway Station" },
      type: "railway",
    },
    {
      id: "berehove-bus",
      name: { uk: "Автовокзал «Берегове»", ru: "Автовокзал «Берегово»", en: "Berehove Bus Station" },
      type: "bus",
    },
    {
      id: "berehove-thermal",
      name: { uk: "Термальні басейни Берегове", ru: "Термальные бассейны Берегово", en: "Berehove Thermal Pools" },
      type: "other",
    },
    {
      id: "berehove-center",
      name: { uk: "Центр міста Берегове", ru: "Центр города Берегово", en: "Berehove City Center" },
      type: "center",
    },
  ],
  khust: [
    {
      id: "khust-railway",
      name: { uk: "Залізничний вокзал «Хуст»", ru: "Ж/д вокзал «Хуст»", en: "Khust Railway Station" },
      type: "railway",
    },
    {
      id: "khust-bus",
      name: { uk: "Автовокзал «Хуст»", ru: "Автовокзал «Хуст»", en: "Khust Bus Station" },
      type: "bus",
    },
    {
      id: "khust-castle",
      name: { uk: "Хустський замок", ru: "Хустский замок", en: "Khust Castle" },
      type: "other",
    },
    {
      id: "khust-center",
      name: { uk: "Центр міста Хуст", ru: "Центр города Хуст", en: "Khust City Center" },
      type: "center",
    },
  ],
  rakhiv: [
    {
      id: "rakhiv-railway",
      name: { uk: "Залізничний вокзал «Рахів»", ru: "Ж/д вокзал «Рахов»", en: "Rakhiv Railway Station" },
      type: "railway",
    },
    {
      id: "rakhiv-bus",
      name: { uk: "Автовокзал «Рахів»", ru: "Автовокзал «Рахов»", en: "Rakhiv Bus Station" },
      type: "bus",
    },
    {
      id: "rakhiv-center",
      name: { uk: "Центр міста Рахів", ru: "Центр города Рахов", en: "Rakhiv City Center" },
      type: "center",
    },
  ],
};

// Допоміжні функції
export function getCityBySlug(slug: string): CityConfig | undefined {
  return cities.find((city) => city.slug === slug);
}

export function getCityLocalizedData(
  slug: string,
  locale: "uk" | "ru" | "en"
): CityLocalizedData | undefined {
  return cityLocalizations[slug]?.[locale];
}

export function getCityFooterAddress(
  city: CityConfig,
  locale: "uk" | "ru" | "en"
): string {
  const cityData = cityLocalizations[city.slug]?.[locale];
  if (cityData?.address) return cityData.address;

  const cityName = city.localized[locale].name;
  const templates = {
    uk: `${cityName}: Персональна подача (Аеропорти / Вокзал / Місто)`,
    ru: `${cityName}: Персональная подача (Аэропорты / Вокзал / Город)`,
    en: `${cityName}: Personal Delivery (Airports / Railway / City)`,
  };

  return templates[locale];
}

export function getAllCitySlugs(): string[] {
  return cities.map((city) => city.slug);
}

export function getCityPickupLocations(
  slug: string,
  locale: "uk" | "ru" | "en"
): { id: string; name: string; type: string }[] {
  const locations = cityPickupLocations[slug];
  if (!locations) return [];
  return locations.map((loc) => ({
    id: loc.id,
    name: loc.name[locale],
    type: loc.type,
  }));
}
