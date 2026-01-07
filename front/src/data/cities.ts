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
];

// Локалізовані тексти для кожного міста
// Ключ: slug, значення: об'єкт з локалями
export const cityLocalizations: Record<
  string,
  Record<"uk" | "ru" | "en", CityLocalizedData>
> = {
  kyiv: {
    uk: {
      title: "Оренда авто у Києві без застави — Аеропорт Бориспіль 24/7",
      metaDescription:
        "Прокат авто у Києві офіційно. Подача в аеропорт Бориспіль та по місту 24/7. Нові машини 2023-2026. Швидке оформлення. Бронюйте онлайн!",
      h1: "Оренда авто у Києві",
      sectionCars: "АВТОМОБІЛІ REIZ У КИЄВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ КИЇВ",
      subtitle:
        "Оренда авто у Києві від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Київ без водія — REIZ | Подача в аеропорт 24/7",
      ogDescription:
        "Прокат авто у Києві. Без застави. Подача в аеропорт Бориспіль та по місту. Нові авто. Швидке оформлення.",
    },
    ru: {
      title: "Аренда авто в Киеве без залога — Аэропорт Борисполь 24/7",
      metaDescription:
        "Прокат авто в Киеве официально. Подача в аэропорт Борисполь и по городу 24/7. Новые машины 2023-2026. Быстрое оформление. Бронируйте онлайн!",
      h1: "Аренда авто в Киеве",
      sectionCars: "АВТОМОБИЛИ REIZ В КИЕВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ КИЕВ",
      subtitle:
        "Аренда авто в Киеве от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Киев без водителя — REIZ | Подача в аэропорт 24/7",
      ogDescription:
        "Прокат авто в Киеве. Без залога. Подача в аэропорт Борисполь и по городу. Новые авто. Быстрое оформление.",
    },
    en: {
      title: "Car Rental Kyiv — No Deposit, Boryspil Airport 24/7",
      metaDescription:
        "Rent a car in Kyiv officially. Delivery to Boryspil Airport and city-wide 24/7. New 2023-2026 fleet. Fast paperwork. Book online now!",
      h1: "Car Rental in Kyiv",
      sectionCars: "REIZ CARS IN KYIV",
      sectionWelcome: "WELCOME TO REIZ KYIV",
      subtitle:
        "Car rental in Kyiv from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Kyiv — REIZ | No Deposit, Airport Delivery 24/7",
      ogDescription:
        "Rent a car in Kyiv. No deposit. Delivery to Boryspil Airport and city-wide. New fleet. Fast paperwork.",
    },
  },
  lviv: {
    uk: {
      title: "Прокат авто Львів: Без ліміту пробігу. Нові моделі",
      metaDescription:
        "Оренда машин для поїздок по місту та Карпатах. Оформлення за 15 хв. Стандартні тарифи або опція «Без застави». Підтримка в дорозі 24/7.",
      h1: "Оренда авто у Львові",
      sectionCars: "АВТОМОБІЛІ REIZ У ЛЬВОВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЛЬВІВ",
      subtitle:
        "Оренда авто у Львові від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Львів без водія — REIZ | Подача 24/7 в аеропорт",
      ogDescription:
        "Прокат авто у Львові. Без застави. Великий автопарк. Подача в аеропорт та по місту. Нові авто.",
    },
    ru: {
      title: "Прокат авто Львов: Без лимита пробега. Новые модели",
      metaDescription:
        "Аренда машин во Львове для поездок по городу и Карпатам. Оформление за 15 мин. Стандартные тарифы или опция «Без залога». Поддержка в дороге 24/7.",
      h1: "Аренда авто во Львове",
      sectionCars: "АВТОМОБИЛИ REIZ ВО ЛЬВОВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЛЬВОВ",
      subtitle:
        "Аренда авто во Львове от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Львов без водителя — REIZ | Подача 24/7 в аэропорт",
      ogDescription:
        "Прокат авто во Львове. Без залога. Большой автопарк. Подача в аэропорт и по городу. Новые авто.",
    },
    en: {
      title: "Car Rental in Lviv: Unlimited Mileage & New Fleet",
      metaDescription:
        "Rent a car in Lviv for city trips or the Carpathians. 15-min booking. Standard rates or No Deposit option. 24/7 Roadside Assistance. Book your car online!",
      h1: "Car Rental in Lviv",
      sectionCars: "REIZ CARS IN LVIV",
      sectionWelcome: "WELCOME TO REIZ LVIV",
      subtitle:
        "Car rental in Lviv from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Lviv — REIZ | No Deposit, Airport Delivery 24/7",
      ogDescription:
        "Rent a car in Lviv. No deposit. Large fleet. Airport and city delivery. New vehicles.",
    },
  },
  ternopil: {
    uk: {
      title: "Оренда авто у Тернополі без застави — Швидка видача",
      metaDescription:
        "Прокат авто у Тернополі офіційно. Нові машини 2023-2026. Безкоштовна подача по місту та на вокзал 24/7. Швидке оформлення. Бронюйте!",
      h1: "Оренда авто у Тернополі",
      sectionCars: "АВТОМОБІЛІ REIZ У ТЕРНОПОЛІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ТЕРНОПІЛЬ",
      subtitle:
        "Оренда авто у Тернополі від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Тернопіль без водія — REIZ | Швидка видача",
      ogDescription:
        "Прокат авто у Тернополі. Без застави. Нові авто. Безкоштовна подача по місту. Швидке оформлення 24/7.",
    },
    ru: {
      title: "Аренда авто в Тернополе без залога — Быстрая выдача",
      metaDescription:
        "Прокат авто в Тернополе официально. Новые машины 2023-2026. Бесплатная подача по городу и на вокзал 24/7. Быстрое оформление. Бронируйте!",
      h1: "Аренда авто в Тернополе",
      sectionCars: "АВТОМОБИЛИ REIZ В ТЕРНОПОЛЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ТЕРНОПОЛЬ",
      subtitle:
        "Аренда авто в Тернополе от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Тернополь без водителя — REIZ | Быстрая выдача",
      ogDescription:
        "Прокат авто в Тернополе. Без залога. Новые авто 2024. Бесплатная подача по городу. Быстрое оформление 24/7.",
    },
    en: {
      title: "Car Rental Ternopil — No Deposit, Fast Pickup",
      metaDescription:
        "Rent a car in Ternopil officially. New 2023-2024 fleet. Free city and station delivery 24/7. Fast paperwork. Book now!",
      h1: "Car Rental in Ternopil",
      sectionCars: "REIZ CARS IN TERNOPIL",
      sectionWelcome: "WELCOME TO REIZ TERNOPIL",
      subtitle:
        "Car rental in Ternopil from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Ternopil — REIZ | No Deposit, Fast Pickup",
      ogDescription:
        "Rent a car in Ternopil. No deposit. New 2024 fleet. Free city delivery. Fast paperwork 24/7.",
    },
  },
  odesa: {
    uk: {
      title: "Оренда авто в Одесі без застави — Подача на пляж 24/7",
      metaDescription:
        "Прокат авто в Одесі офіційно. Подача на Аркадію, в порт та аеропорт 24/7. Нові машини 2023-2026. Економ та бізнес. Бронюйте!",
      h1: "Оренда авто в Одесі",
      sectionCars: "АВТОМОБІЛІ REIZ В ОДЕСІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ОДЕСА",
      subtitle:
        "Оренда авто в Одесі від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Одеса без водія — REIZ | Подача по адресу 24/7",
      ogDescription:
        "Прокат авто в Одесі. Без застави. Подача по адресу, в порт та аеропорт. Нові авто.",
    },
    ru: {
      title: "Аренда авто в Одессе без залога — Подача по адресу 24/7",
      metaDescription:
        "Прокат авто в Одессе официально. Подача по городу, аэропорт 24/7. Новые машины 2023-2026. Економ и внедорожники. Бронируйте!",
      h1: "Аренда авто в Одессе",
      sectionCars: "АВТОМОБИЛИ REIZ В ОДЕССЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ОДЕССА",
      subtitle:
        "Аренда авто в Одессе от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Одесса без водителя — REIZ | Подача на пляж 24/7",
      ogDescription:
        "Прокат авто в Одессе. Без залога. Подача на Аркадию, в порт и аэропорт. Кабриолеты и новые авто.",
    },
    en: {
      title: "Car Rental Odesa — No Deposit, Beach Delivery 24/7",
      metaDescription:
        "Rent a car in Odesa officially. Delivery to Arcadia beach, port and airport 24/7. New 2023-2026 fleet. Convertibles and SUVs. Book now!",
      h1: "Car Rental in Odesa",
      sectionCars: "REIZ CARS IN ODESA",
      sectionWelcome: "WELCOME TO REIZ ODESA",
      subtitle:
        "Car rental in Odesa from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Odesa — REIZ | No Deposit, Beach Delivery 24/7",
      ogDescription:
        "Rent a car in Odesa. No deposit. Delivery to Arcadia beach, port and airport. Convertibles and new fleet.",
    },
  },
  dnipro: {
    uk: {
      title: "Оренда авто у Дніпрі без застави — Ділові поїздки",
      metaDescription:
        "Прокат авто у Дніпрі офіційно. Ідеально для ділових поїздок. Нові автомобілі. Подача в аеропорт та по місту 24/7. Бронюйте онлайн!",
      h1: "Оренда авто у Дніпрі",
      sectionCars: "АВТОМОБІЛІ REIZ У ДНІПРІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ДНІПРО",
      subtitle:
        "Оренда авто у Дніпрі від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Дніпро без водія — REIZ | Ділові поїздки 24/7",
      ogDescription:
        "Прокат авто у Дніпрі. Без застави. Для бізнесу та подорожей. Подача в аеропорт та по місту. Нові авто.",
    },
    ru: {
      title: "Аренда авто в Днепре без залога — Деловые поездки",
      metaDescription:
        "Прокат авто в Днепре официально. Идеально для деловых поездок. Новые автомобили. Подача в аэропорт и по городу 24/7. Бронируйте онлайн!",
      h1: "Аренда авто в Днепре",
      sectionCars: "АВТОМОБИЛИ REIZ В ДНЕПРЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ДНЕПР",
      subtitle:
        "Аренда авто в Днепре от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Днепр без водителя — REIZ | Деловые поездки 24/7",
      ogDescription:
        "Прокат авто в Днепре. Без залога. Для бизнеса и путешествий. Подача в аэропорт и по городу. Новые авто.",
    },
    en: {
      title: "Car Rental in Dnipro: Business Class & New Fleet",
      metaDescription:
        "Rent a car in Dnipro officially. Perfect for business trips. New fleet. Airport and city delivery 24/7. Book online now!",
      h1: "Car Rental in Dnipro",
      sectionCars: "REIZ CARS IN DNIPRO",
      sectionWelcome: "WELCOME TO REIZ DNIPRO",
      subtitle:
        "Car rental in Dnipro from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Dnipro — REIZ | No Deposit, Business Travel 24/7",
      ogDescription:
        "Rent a car in Dnipro. No deposit. For business and travel. Airport and city delivery. New fleet.",
    },
  },
  kharkiv: {
    uk: {
      title: "Оренда авто у Харкові без застави — Трансфер по місту",
      metaDescription:
        "Прокат авто у Харкові офіційно. Подача на вокзал та по місту 24/7. Нові машини 2023-2026. Без ліміту пробігу. Швидке оформлення. Бронюйте!",
      h1: "Оренда авто у Харкові",
      sectionCars: "АВТОМОБІЛІ REIZ У ХАРКОВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ХАРКІВ",
      subtitle:
        "Оренда авто у Харкові від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Харків без водія — REIZ | Трансфер 24/7",
      ogDescription:
        "Прокат авто у Харкові. Без застави. Без ліміту пробігу. Подача на вокзал та по місту. Нові авто.",
    },
    ru: {
      title: "Аренда авто в Харькове без залога — Трансфер по городу",
      metaDescription:
        "Прокат авто в Харькове официально. Подача на вокзал и по городу 24/7. Новые машины. Без лимита пробега. Быстрое оформление. Бронируйте!",
      h1: "Аренда авто в Харькове",
      sectionCars: "АВТОМОБИЛИ REIZ В ХАРЬКОВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ХАРЬКОВ",
      subtitle:
        "Аренда авто в Харькове от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Харьков без водителя — REIZ | Трансфер 24/7",
      ogDescription:
        "Прокат авто в Харькове. Без залога. Без лимита пробега. Подача на вокзал и по городу. Новые авто.",
    },
    en: {
      title: "Car Rental Kharkiv — No Deposit, City Transfer",
      metaDescription:
        "Rent a car in Kharkiv officially. Station and city delivery 24/7. New fleet. Unlimited mileage. Fast paperwork. Book now!",
      h1: "Car Rental in Kharkiv",
      sectionCars: "REIZ CARS IN KHARKIV",
      sectionWelcome: "WELCOME TO REIZ KHARKIV",
      subtitle:
        "Car rental in Kharkiv from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Kharkiv — REIZ | No Deposit, City Transfer 24/7",
      ogDescription:
        "Rent a car in Kharkiv. No deposit. Unlimited mileage. Station and city delivery. New fleet.",
    },
  },
  bukovel: {
    uk: {
      title: "Оренда авто в Буковелі без застави — Позашляховики 24/7",
      metaDescription:
        "Прокат авто в Буковелі офіційно. Позашляховики та повнопривідні авто для гір. Доставка на курорт 24/7. Нові машини. Бронюйте!",
      h1: "Оренда авто в Буковелі",
      sectionCars: "АВТОМОБІЛІ REIZ У БУКОВЕЛІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ БУКОВЕЛЬ",
      subtitle:
        "Оренда авто в Буковелі від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Буковель без водія — REIZ | Позашляховики 24/7",
      ogDescription:
        "Прокат авто в Буковелі. Без застави. Позашляховики та повнопривідні авто. Доставка на курорт. Нові авто.",
    },
    ru: {
      title: "Аренда авто в Буковеле без залога — Внедорожники 24/7",
      metaDescription:
        "Прокат авто в Буковеле официально. Внедорожники и полноприводные авто для гор. Доставка на курорт 24/7. Новые машины . Бронируйте!",
      h1: "Аренда авто в Буковеле",
      sectionCars: "АВТОМОБИЛИ REIZ В БУКОВЕЛЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ БУКОВЕЛЬ",
      subtitle:
        "Аренда авто в Буковеле от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Буковель без водителя — REIZ | Внедорожники 24/7",
      ogDescription:
        "Прокат авто в Буковеле. Без залога. Внедорожники и полноприводные авто. Доставка на курорт. Новые авто.",
    },
    en: {
      title: "Car Rental Bukovel — No Deposit, SUVs for Mountains",
      metaDescription:
        "Rent a car in Bukovel officially. SUVs and AWD vehicles for mountain trips. Resort delivery 24/7. New fleet. Book now!",
      h1: "Car Rental in Bukovel",
      sectionCars: "REIZ CARS IN BUKOVEL",
      sectionWelcome: "WELCOME TO REIZ BUKOVEL",
      subtitle:
        "Car rental in Bukovel from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Bukovel — REIZ | No Deposit, SUVs 24/7",
      ogDescription:
        "Rent a car in Bukovel. No deposit. SUVs and AWD vehicles. Resort delivery. New fleet.",
    },
  },
  truskavets: {
    uk: {
      title: "Оренда авто у Трускавці без застави — Курортна подача",
      metaDescription:
        "Прокат авто у Трускавці офіційно. Доставка на курорт та в санаторії 24/7. Нові машини. Комфортні подорожі Прикарпаттям. Бронюйте!",
      h1: "Оренда авто у Трускавці",
      sectionCars: "АВТОМОБІЛІ REIZ У ТРУСКАВЦІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ТРУСКАВЕЦЬ",
      subtitle:
        "Оренда авто у Трускавці від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Трускавець без водія — REIZ | Подача по адресу",
      ogDescription:
        "Прокат авто у Трускавці. Без застави. Доставка на курорт та в санаторії. Нові авто. Подорожі Прикарпаттям.",
    },
    ru: {
      title: "Аренда авто в Трускавце без залога — Подача по адресу",
      metaDescription:
        "Прокат авто в Трускавце официально. Доставка на курорт и в санатории 24/7. Новые машины. Комфортные путешествия по Прикарпатью. Бронируйте!",
      h1: "Аренда авто в Трускавце",
      sectionCars: "АВТОМОБИЛИ REIZ В ТРУСКАВЦЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ТРУСКАВЕЦ",
      subtitle:
        "Аренда авто в Трускавце от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Трускавец без водителя — REIZ | Подача по адресу",
      ogDescription:
        "Прокат авто в Трускавце. Без залога. Доставка на курорт и в санатории. Новые авто. Путешествия по Прикарпатью.",
    },
    en: {
      title: "Car Rental Truskavets — No Deposit, Resort Delivery",
      metaDescription:
        "Rent a car in Truskavets officially. Delivery to resort and sanatoriums 24/7. New 2023-2026 fleet. Comfortable Carpathian trips. Book now!",
      h1: "Car Rental in Truskavets",
      sectionCars: "REIZ CARS IN TRUSKAVETS",
      sectionWelcome: "WELCOME TO REIZ TRUSKAVETS",
      subtitle:
        "Car rental in Truskavets from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Truskavets — REIZ | No Deposit, Resort Delivery",
      ogDescription:
        "Rent a car in Truskavets. No deposit. Delivery to resort and sanatoriums. New fleet. Carpathian trips.",
    },
  },
  "ivano-frankivsk": {
    uk: {
      title: "Оренда авто в Івано-Франківську без застави — До Карпат 24/7",
      metaDescription:
        "Прокат авто в Івано-Франківську офіційно. Подача в аеропорт та виїзд до Карпат 24/7. Нові машини 2023-2024. Позашляховики та седани. Бронюйте!",
      h1: "Оренда авто в Івано-Франківську",
      sectionCars: "АВТОМОБІЛІ REIZ В ІВАНО-ФРАНКІВСЬКУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ІВАНО-ФРАНКІВСЬК",
      subtitle:
        "Оренда авто в Івано-Франківську від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Івано-Франківськ без водія — REIZ | Доставка авто 24/7",
      ogDescription:
        "Прокат авто в Івано-Франківську. Без застави. Подача в аеропорт та виїзд до Карпат. Нові авто 2024.",
    },
    ru: {
      title: "Аренда авто в Ивано-Франковске без залога — Доставка авто 24/7",
      metaDescription:
        "Прокат авто в Ивано-Франковске официально. Подача в аэропорт и выезд в Карпаты 24/7. Новые машины 2023-2024. Внедорожники и седаны. Бронируйте!",
      h1: "Аренда авто в Ивано-Франковске",
      sectionCars: "АВТОМОБИЛИ REIZ В ИВАНО-ФРАНКОВСКЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ИВАНО-ФРАНКОВСК",
      subtitle:
        "Аренда авто в Ивано-Франковске от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Ивано-Франковск без водителя — REIZ | В Карпаты 24/7",
      ogDescription:
        "Прокат авто в Ивано-Франковске. Без залога. Подача в аэропорт и выезд в Карпаты. Новые авто 2024.",
    },
    en: {
      title: "Car Rental Ivano-Frankivsk — No Deposit, Carpathian Access",
      metaDescription:
        "Rent a car in Ivano-Frankivsk officially. Airport delivery and Carpathian trips 24/7. New 2023-2024 fleet. SUVs and sedans. Book now!",
      h1: "Car Rental in Ivano-Frankivsk",
      sectionCars: "REIZ CARS IN IVANO-FRANKIVSK",
      sectionWelcome: "WELCOME TO REIZ IVANO-FRANKIVSK",
      subtitle:
        "Car rental in Ivano-Frankivsk from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Ivano-Frankivsk — REIZ | No Deposit, Carpathian Access",
      ogDescription:
        "Rent a car in Ivano-Frankivsk. No deposit. Airport delivery and Carpathian trips. New 2024 fleet.",
    },
  },
  skhidnytsia: {
    uk: {
      title: "Оренда авто у Східниці без застави — Подача по адресу",
      metaDescription:
        "Прокат авто у Східниці офіційно. Доставка на курорт та подорожі Карпатами 24/7. Нові машини. Комфортний відпочинок. Бронюйте!",
      h1: "Оренда авто у Східниці",
      sectionCars: "АВТОМОБІЛІ REIZ У СХІДНИЦІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ СХІДНИЦЯ",
      subtitle:
        "Оренда авто у Східниці від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
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
        "Аренда авто в Сходнице от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Сходница без водителя — REIZ | Курортная подача 24/7",
      ogDescription:
        "Прокат авто в Сходнице. Без залога. Доставка на курорт. Путешествия по Карпатам. Новые авто.",
    },
    en: {
      title: "Car Rental Skhidnytsia — No Deposit, Spa Resort",
      metaDescription:
        "Rent a car in Skhidnytsia officially. Delivery to spa resort and Carpathian trips 24/7. New 2023-2024 fleet. Comfortable vacation. Book now!",
      h1: "Car Rental in Skhidnytsia",
      sectionCars: "REIZ CARS IN SKHIDNYTSIA",
      sectionWelcome: "WELCOME TO REIZ SKHIDNYTSIA",
      subtitle:
        "Car rental in Skhidnytsia from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Skhidnytsia — REIZ | No Deposit, Resort Delivery 24/7",
      ogDescription:
        "Rent a car in Skhidnytsia. No deposit. Delivery to spa resort. Carpathian trips. New fleet.",
    },
  },
  uzhhorod: {
    uk: {
      title: "Оренда авто в Ужгороді без застави — Нові авто",
      metaDescription:
        "Прокат авто в Ужгороді. Зручний виїзд до кордону та в Карпати. Нові машини. Безкоштовна подача по місту 24/7. Бронюйте офіційно!",
      h1: "Оренда авто в Ужгороді",
      sectionCars: "АВТОМОБІЛІ REIZ В УЖГОРОДІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ УЖГОРОД",
      subtitle:
        "Оренда авто в Ужгороді — нові автомобілі, швидке оформлення та зручний виїзд до кордону ЄС.",
      ogTitle: "Оренда авто Ужгород без водія — REIZ | Без застави",
      ogDescription:
        "Прокат авто в Ужгороді. Без застави. Безкоштовна подача. Зручний виїзд до кордону. Нові авто 24/7.",
    },
    ru: {
      title: "Аренда авто в Ужгороде без залога — Новые машины",
      metaDescription:
        "Прокат авто в Ужгороде. Удобный выезд к границе ЕС и в Карпаты. Новые авто 2023-2026. Бесплатная подача по городу 24/7. Бронируйте!",
      h1: "Аренда авто в Ужгороде",
      sectionCars: "АВТОМОБИЛИ REIZ В УЖГОРОДЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ УЖГОРОД",
      subtitle:
        "Аренда авто в Ужгороде — новые автомобили года, быстрое оформление и удобный выезд к границе.",
      ogTitle: "Аренда авто Ужгород без водителя — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Ужгороде. Без залога. Бесплатная подача по городу. Удобный выезд к границе. 24/7.",
    },
    en: {
      title: "Car Rental Uzhhorod — No Deposit, New Fleet",
      metaDescription:
        "Rent a car in Uzhhorod. Easy border crossing to EU. New 2023-2026 fleet. Free city delivery 24/7. Book your self-drive now!",
      h1: "Car Rental in Uzhhorod",
      sectionCars: "REIZ CARS IN UZHHOROD",
      sectionWelcome: "WELCOME TO REIZ UZHHOROD",
      subtitle:
        "Car rental in Uzhhorod — new fleet, fast paperwork, and convenient EU border crossing access.",
      ogTitle: "Car Rental Uzhhorod — REIZ | No Deposit, Free Delivery",
      ogDescription:
        "Rent a car in Uzhhorod. No deposit. Free city delivery. Easy border access. New fleet 24/7.",
    },
  },
  vinnytsia: {
    uk: {
      title: "Оренда авто у Вінниці без застави — Швидка видача",
      metaDescription:
        "Прокат авто у Вінниці для ділових поїздок. Нові машини 2023-2026. Без ліміту пробігу. Безкоштовна подача в центр 24/7. Бронюйте офіційно!",
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
        "Прокат авто в Виннице для деловых поездок. Новые машины 2023-2026. Без лимита пробега. Бесплатная подача в центр 24/7. Бронируйте!",
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
      title: "Car Rental Vinnytsia — No Deposit, Unlimited Mileage",
      metaDescription:
        "Rent a car in Vinnytsia for business trips. New 2023-2026 fleet. Unlimited mileage. Free city delivery 24/7. Book your self-drive now!",
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
      title: "Оренда авто у Запоріжжі без застави — Нові авто",
      metaDescription:
        "Прокат авто у Запоріжжі офіційно. Нові машини 2023-2026. Без ліміту пробігу. Безкоштовна подача по місту 24/7. Швидка видача. Бронюйте!",
      h1: "Оренда авто у Запоріжжі",
      sectionCars: "АВТОМОБІЛІ REIZ У ЗАПОРІЖЖІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЗАПОРІЖЖЯ",
      subtitle:
        "Оренда авто у Запоріжжі — надійні нові автомобілі, офіційне оформлення та швидка подача по місту.",
      ogTitle: "Оренда авто Запоріжжя без водія — REIZ | Без застави",
      ogDescription:
        "Прокат авто у Запоріжжі. Без застави. Нові авто. Безкоштовна подача. Швидка видача 24/7.",
    },
    ru: {
      title: "Аренда авто в Запорожье без залога — Новые машины",
      metaDescription:
        "Прокат авто в Запорожье официально. Новые машины 2023-2026. Без лимита пробега. Бесплатная подача по городу 24/7. Быстрое оформление!",
      h1: "Аренда авто в Запорожье",
      sectionCars: "АВТОМОБИЛИ REIZ В ЗАПОРОЖЬЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЗАПОРОЖЬЕ",
      subtitle:
        "Аренда авто в Запорожье — надежные новые автомобили, официальное оформление и быстрая подача по городу.",
      ogTitle: "Аренда авто Запорожье без водителя — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Запорожье. Без залога. Новые авто. Бесплатная подача. Быстрое оформление 24/7.",
    },
    en: {
      title: "Car Rental Zaporizhzhia — No Deposit, New Fleet",
      metaDescription:
        "Rent a car in Zaporizhzhia officially. New 2023-2026 fleet. Unlimited mileage. Free city delivery 24/7. Fast pickup. Book your self-drive!",
      h1: "Car Rental in Zaporizhzhia",
      sectionCars: "REIZ CARS IN ZAPORIZHZHIA",
      sectionWelcome: "WELCOME TO REIZ ZAPORIZHZHIA",
      subtitle:
        "Car rental in Zaporizhzhia — reliable new vehicles, official paperwork, and fast city-wide delivery.",
      ogTitle: "Car Rental Zaporizhzhia — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Zaporizhzhia. No deposit. New fleet. Free city delivery. Fast pickup 24/7.",
    },
  },
  mukachevo: {
    uk: {
      title: "Оренда авто в Мукачеві без застави — Виїзд в Карпати",
      metaDescription:
        "Прокат авто в Мукачеві офіційно. Зручний виїзд до кордону та в Карпати. Нові машини 2023-2024. Безкоштовна подача 24/7. Швидка видача!",
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
        "Прокат авто в Мукачеве официально. Удобный выезд к границе ЕС и в Карпаты. Новые машины 2023-2024. Бесплатная подача 24/7. Бронируйте!",
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
        "Rent a car in Mukachevo. Easy border crossing and Carpathian mountain access. New 2023-2024 fleet. Free delivery 24/7. Book now!",
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
        "Прокат авто у Полтаві для ділових поїздок. Нові машини 2023-2026. Без ліміту пробігу. Безкоштовна подача в центр 24/7. Бронюйте офіційно!",
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
        "Прокат авто в Полтаве для деловых поездок. Новые машины 2023-2026. Без лимита пробега. Бесплатная подача в центр 24/7. Бронируйте!",
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
      title: "Car Rental Poltava — No Deposit, Unlimited Mileage",
      metaDescription:
        "Rent a car in Poltava for business trips. New 2023-2026 fleet. Unlimited mileage. Free city delivery 24/7. Book your self-drive now!",
      h1: "Car Rental in Poltava",
      sectionCars: "REIZ CARS IN POLTAVA",
      sectionWelcome: "WELCOME TO REIZ POLTAVA",
      subtitle:
        "Car rental in Poltava — comfortable business trips and travel across central Ukraine in new vehicles.",
      ogTitle: "Car Rental Poltava — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Poltava. No deposit. New 2024 fleet. Free city delivery. Fast pickup 24/7.",
    },
  },
  chernivtsi: {
    uk: {
      title: "Оренда авто у Чернівцях без застави — Виїзд до кордону",
      metaDescription:
        "Прокат авто у Чернівцях офіційно. Зручний виїзд до кордону з Румунією та Молдовою. Нові машини 2023-2024. Безкоштовна подача 24/7!",
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
        "Прокат авто в Черновцах официально. Удобный выезд к границе с Румынией и Молдовой. Новые машины 2023-2024. Бесплатная подача 24/7!",
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
        "Rent a car in Chernivtsi. Easy border crossing to Romania and Moldova. New 2023-2026 fleet. Free city delivery 24/7. Book now!",
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
        "Прокат авто в Борисполі з подачею в аеропорт. Зустріч з рейсу 24/7. Нові машини 2023-2026. Швидке оформлення. Без ліміту пробігу!",
      h1: "Оренда авто в Борисполі",
      sectionCars: "АВТОМОБІЛІ REIZ В БОРИСПОЛІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ БОРИСПІЛЬ",
      subtitle:
        "Оренда авто в Борисполі — зустріч в аеропорту, швидке оформлення та комфортний трансфер на нових автомобілях.",
      ogTitle: "Оренда авто Бориспіль аеропорт — REIZ | Без застави",
      ogDescription:
        "Прокат авто в Борисполі. Без застави. Зустріч з рейсу в аеропорту. Нові авто 24/7. Швидка видача.",
    },
    ru: {
      title: "Аренда авто в Борисполе без залога — Аэропорт 24/7",
      metaDescription:
        "Прокат авто в Борисполе с подачей в аэропорт. Встреча с рейса 24/7. Новые машины 2023-2026. Быстрое оформление. Без лимита пробега!",
      h1: "Аренда авто в Борисполе",
      sectionCars: "АВТОМОБИЛИ REIZ В БОРИСПОЛЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ БОРИСПОЛЬ",
      subtitle:
        "Аренда авто в Борисполе — встреча в аэропорту, быстрое оформление и комфортный трансфер на новых автомобилях.",
      ogTitle: "Аренда авто Борисполь аэропорт — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Борисполе. Без залога. Встреча с рейса в аэропорту. Новые авто 24/7. Быстрая выдача.",
    },
    en: {
      title: "Car Rental Boryspil Airport — No Deposit, 24/7 Pickup",
      metaDescription:
        "Rent a car at Boryspil Airport. Flight meet and greet 24/7. New 2023-2026 fleet. Fast paperwork. Unlimited mileage. Book your self-drive!",
      h1: "Car Rental in Boryspil",
      sectionCars: "REIZ CARS IN BORYSPIL",
      sectionWelcome: "WELCOME TO REIZ BORYSPIL",
      subtitle:
        "Car rental in Boryspil — airport meet and greet, fast paperwork, and comfortable transfers in new vehicles.",
      ogTitle: "Car Rental Boryspil Airport — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car at Boryspil Airport. No deposit. Flight meet and greet 24/7. New fleet. Fast pickup.",
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
