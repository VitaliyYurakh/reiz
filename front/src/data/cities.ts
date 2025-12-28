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
];

// Локалізовані тексти для кожного міста
// Ключ: slug, значення: об'єкт з локалями
export const cityLocalizations: Record<
  string,
  Record<"uk" | "ru" | "en", CityLocalizedData>
> = {
  kyiv: {
    uk: {
      title: "Оренда авто у Києві | REIZ - від 800 грн/день",
      metaDescription:
        "Оренда авто у Києві від REIZ. Сучасний автопарк, доставка в аеропорт Бориспіль та по місту. Від економ до преміум класу. Бронювання 24/7.",
      h1: "Оренда авто у Києві",
      sectionCars: "АВТОМОБІЛІ REIZ У КИЄВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ КИЇВ",
      subtitle:
        "Оренда авто у Києві від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Київ без водія — REIZ | Прокат від 800 грн/день",
      ogDescription:
        "Прокат автомобілів у Києві. Без застави. Доставка по місту та в аеропорт Бориспіль. Сучасний автопарк від економ до преміум класу.",
    },
    ru: {
      title: "Аренда авто в Киеве | REIZ - от 800 грн/день",
      metaDescription:
        "Аренда авто в Киеве от REIZ. Современный автопарк, доставка в аэропорт Борисполь и по городу. От эконом до премиум класса. Бронирование 24/7.",
      h1: "Аренда авто в Киеве",
      sectionCars: "АВТОМОБИЛИ REIZ В КИЕВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ КИЕВ",
      subtitle:
        "Аренда авто в Киеве от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Киев без водителя — REIZ | Прокат от 800 грн/день",
      ogDescription:
        "Прокат автомобилей в Киеве. Без залога. Доставка по городу и в аэропорт Борисполь. Современный автопарк от эконом до премиум класса.",
    },
    en: {
      title: "Car Rental in Kyiv | REIZ - from 800 UAH/day",
      metaDescription:
        "Car rental in Kyiv from REIZ. Modern fleet, delivery to Boryspil Airport and city-wide. From economy to premium class. Booking 24/7.",
      h1: "Car Rental in Kyiv",
      sectionCars: "REIZ CARS IN KYIV",
      sectionWelcome: "WELCOME TO REIZ KYIV",
      subtitle:
        "Car rental in Kyiv from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Kyiv — REIZ | Rent from 800 UAH/day",
      ogDescription:
        "Car rental in Kyiv. No deposit. Delivery throughout the city and to Boryspil Airport. Modern fleet from economy to premium class.",
    },
  },
  lviv: {
    uk: {
      title: "Оренда авто у Львові | REIZ - від 800 грн/день",
      metaDescription:
        "Оренда авто у Львові від REIZ. Сучасний автопарк, доставка в аеропорт та по місту. Від економ до преміум класу. Бронювання 24/7.",
      h1: "Оренда авто у Львові",
      sectionCars: "АВТОМОБІЛІ REIZ У ЛЬВОВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЛЬВІВ",
      subtitle:
        "Оренда авто у Львові від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Львів без водія — REIZ | Прокат від 800 грн/день",
      ogDescription:
        "Прокат автомобілів у Львові. Без застави. Доставка по місту та в аеропорт. Сучасний автопарк від економ до преміум класу.",
    },
    ru: {
      title: "Аренда авто во Львове | REIZ - от 800 грн/день",
      metaDescription:
        "Аренда авто во Львове от REIZ. Современный автопарк, доставка в аэропорт и по городу. От эконом до премиум класса. Бронирование 24/7.",
      h1: "Аренда авто во Львове",
      sectionCars: "АВТОМОБИЛИ REIZ ВО ЛЬВОВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЛЬВОВ",
      subtitle:
        "Аренда авто во Львове от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Львов без водителя — REIZ | Прокат от 800 грн/день",
      ogDescription:
        "Прокат автомобилей во Львове. Без залога. Доставка по городу и в аэропорт. Современный автопарк от эконом до премиум класса.",
    },
    en: {
      title: "Car Rental in Lviv | REIZ - from 800 UAH/day",
      metaDescription:
        "Car rental in Lviv from REIZ. Modern fleet, delivery to airport and city-wide. From economy to premium class. Booking 24/7.",
      h1: "Car Rental in Lviv",
      sectionCars: "REIZ CARS IN LVIV",
      sectionWelcome: "WELCOME TO REIZ LVIV",
      subtitle:
        "Car rental in Lviv from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Lviv — REIZ | Rent from 800 UAH/day",
      ogDescription:
        "Car rental in Lviv. No deposit. Delivery throughout the city and to the airport. Modern fleet from economy to premium class.",
    },
  },
  ternopil: {
    uk: {
      title: "Оренда авто у Тернополі | REIZ - від 800 грн/день",
      metaDescription:
        "Оренда авто у Тернополі від REIZ. Сучасний автопарк, доставка по місту. Від економ до преміум класу. Бронювання 24/7.",
      h1: "Оренда авто у Тернополі",
      sectionCars: "АВТОМОБІЛІ REIZ У ТЕРНОПОЛІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ТЕРНОПІЛЬ",
      subtitle:
        "Оренда авто у Тернополі від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle:
        "Оренда авто Тернопіль без водія — REIZ | Прокат від 800 грн/день",
      ogDescription:
        "Прокат автомобілів у Тернополі. Без застави. Доставка по місту. Сучасний автопарк від економ до преміум класу.",
    },
    ru: {
      title: "Аренда авто в Тернополе | REIZ - от 800 грн/день",
      metaDescription:
        "Аренда авто в Тернополе от REIZ. Современный автопарк, доставка по городу. От эконом до премиум класса. Бронирование 24/7.",
      h1: "Аренда авто в Тернополе",
      sectionCars: "АВТОМОБИЛИ REIZ В ТЕРНОПОЛЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ТЕРНОПОЛЬ",
      subtitle:
        "Аренда авто в Тернополе от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle:
        "Аренда авто Тернополь без водителя — REIZ | Прокат от 800 грн/день",
      ogDescription:
        "Прокат автомобилей в Тернополе. Без залога. Доставка по городу. Современный автопарк от эконом до премиум класса.",
    },
    en: {
      title: "Car Rental in Ternopil | REIZ - from 800 UAH/day",
      metaDescription:
        "Car rental in Ternopil from REIZ. Modern fleet, city-wide delivery. From economy to premium class. Booking 24/7.",
      h1: "Car Rental in Ternopil",
      sectionCars: "REIZ CARS IN TERNOPIL",
      sectionWelcome: "WELCOME TO REIZ TERNOPIL",
      subtitle:
        "Car rental in Ternopil from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Ternopil — REIZ | Rent from 800 UAH/day",
      ogDescription:
        "Car rental in Ternopil. No deposit. Delivery throughout the city. Modern fleet from economy to premium class.",
    },
  },
  odesa: {
    uk: {
      title: "Оренда авто в Одесі | REIZ - від 800 грн/день",
      metaDescription:
        "Оренда авто в Одесі від REIZ. Сучасний автопарк, доставка в аеропорт та по місту. Від економ до преміум класу. Бронювання 24/7.",
      h1: "Оренда авто в Одесі",
      sectionCars: "АВТОМОБІЛІ REIZ В ОДЕСІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ОДЕСА",
      subtitle:
        "Оренда авто в Одесі від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Одеса без водія — REIZ | Прокат від 800 грн/день",
      ogDescription:
        "Прокат автомобілів в Одесі. Без застави. Доставка по місту та в аеропорт. Сучасний автопарк від економ до преміум класу.",
    },
    ru: {
      title: "Аренда авто в Одессе | REIZ - от 800 грн/день",
      metaDescription:
        "Аренда авто в Одессе от REIZ. Современный автопарк, доставка в аэропорт и по городу. От эконом до премиум класса. Бронирование 24/7.",
      h1: "Аренда авто в Одессе",
      sectionCars: "АВТОМОБИЛИ REIZ В ОДЕССЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ОДЕССА",
      subtitle:
        "Аренда авто в Одессе от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Одесса без водителя — REIZ | Прокат от 800 грн/день",
      ogDescription:
        "Прокат автомобилей в Одессе. Без залога. Доставка по городу и в аэропорт. Современный автопарк от эконом до премиум класса.",
    },
    en: {
      title: "Car Rental in Odesa | REIZ - from 800 UAH/day",
      metaDescription:
        "Car rental in Odesa from REIZ. Modern fleet, delivery to airport and city-wide. From economy to premium class. Booking 24/7.",
      h1: "Car Rental in Odesa",
      sectionCars: "REIZ CARS IN ODESA",
      sectionWelcome: "WELCOME TO REIZ ODESA",
      subtitle:
        "Car rental in Odesa from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Odesa — REIZ | Rent from 800 UAH/day",
      ogDescription:
        "Car rental in Odesa. No deposit. Delivery throughout the city and to the airport. Modern fleet from economy to premium class.",
    },
  },
  dnipro: {
    uk: {
      title: "Оренда авто у Дніпрі | REIZ - від 800 грн/день",
      metaDescription:
        "Оренда авто у Дніпрі від REIZ. Сучасний автопарк, доставка в аеропорт та по місту. Від економ до преміум класу. Бронювання 24/7.",
      h1: "Оренда авто у Дніпрі",
      sectionCars: "АВТОМОБІЛІ REIZ У ДНІПРІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ДНІПРО",
      subtitle:
        "Оренда авто у Дніпрі від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Дніпро без водія — REIZ | Прокат від 800 грн/день",
      ogDescription:
        "Прокат автомобілів у Дніпрі. Без застави. Доставка по місту та в аеропорт. Сучасний автопарк від економ до преміум класу.",
    },
    ru: {
      title: "Аренда авто в Днепре | REIZ - от 800 грн/день",
      metaDescription:
        "Аренда авто в Днепре от REIZ. Современный автопарк, доставка в аэропорт и по городу. От эконом до премиум класса. Бронирование 24/7.",
      h1: "Аренда авто в Днепре",
      sectionCars: "АВТОМОБИЛИ REIZ В ДНЕПРЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ДНЕПР",
      subtitle:
        "Аренда авто в Днепре от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle: "Аренда авто Днепр без водителя — REIZ | Прокат от 800 грн/день",
      ogDescription:
        "Прокат автомобилей в Днепре. Без залога. Доставка по городу и в аэропорт. Современный автопарк от эконом до премиум класса.",
    },
    en: {
      title: "Car Rental in Dnipro | REIZ - from 800 UAH/day",
      metaDescription:
        "Car rental in Dnipro from REIZ. Modern fleet, delivery to airport and city-wide. From economy to premium class. Booking 24/7.",
      h1: "Car Rental in Dnipro",
      sectionCars: "REIZ CARS IN DNIPRO",
      sectionWelcome: "WELCOME TO REIZ DNIPRO",
      subtitle:
        "Car rental in Dnipro from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Dnipro — REIZ | Rent from 800 UAH/day",
      ogDescription:
        "Car rental in Dnipro. No deposit. Delivery throughout the city and to the airport. Modern fleet from economy to premium class.",
    },
  },
  kharkiv: {
    uk: {
      title: "Оренда авто у Харкові | REIZ - від 800 грн/день",
      metaDescription:
        "Оренда авто у Харкові від REIZ. Сучасний автопарк, доставка по місту. Від економ до преміум класу. Бронювання 24/7.",
      h1: "Оренда авто у Харкові",
      sectionCars: "АВТОМОБІЛІ REIZ У ХАРКОВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ХАРКІВ",
      subtitle:
        "Оренда авто у Харкові від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Харків без водія — REIZ | Прокат від 800 грн/день",
      ogDescription:
        "Прокат автомобілів у Харкові. Без застави. Доставка по місту. Сучасний автопарк від економ до преміум класу.",
    },
    ru: {
      title: "Аренда авто в Харькове | REIZ - от 800 грн/день",
      metaDescription:
        "Аренда авто в Харькове от REIZ. Современный автопарк, доставка по городу. От эконом до премиум класса. Бронирование 24/7.",
      h1: "Аренда авто в Харькове",
      sectionCars: "АВТОМОБИЛИ REIZ В ХАРЬКОВЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ХАРЬКОВ",
      subtitle:
        "Аренда авто в Харькове от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle:
        "Аренда авто Харьков без водителя — REIZ | Прокат от 800 грн/день",
      ogDescription:
        "Прокат автомобилей в Харькове. Без залога. Доставка по городу. Современный автопарк от эконом до премиум класса.",
    },
    en: {
      title: "Car Rental in Kharkiv | REIZ - from 800 UAH/day",
      metaDescription:
        "Car rental in Kharkiv from REIZ. Modern fleet, city-wide delivery. From economy to premium class. Booking 24/7.",
      h1: "Car Rental in Kharkiv",
      sectionCars: "REIZ CARS IN KHARKIV",
      sectionWelcome: "WELCOME TO REIZ KHARKIV",
      subtitle:
        "Car rental in Kharkiv from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Kharkiv — REIZ | Rent from 800 UAH/day",
      ogDescription:
        "Car rental in Kharkiv. No deposit. Delivery throughout the city. Modern fleet from economy to premium class.",
    },
  },
  bukovel: {
    uk: {
      title: "Оренда авто в Буковелі | REIZ - від 800 грн/день",
      metaDescription:
        "Оренда авто в Буковелі від REIZ. Сучасний автопарк, доставка на курорт. Від економ до преміум класу. Бронювання 24/7.",
      h1: "Оренда авто в Буковелі",
      sectionCars: "АВТОМОБІЛІ REIZ У БУКОВЕЛІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ БУКОВЕЛЬ",
      subtitle:
        "Оренда авто в Буковелі від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle: "Оренда авто Буковель без водія — REIZ | Прокат від 800 грн/день",
      ogDescription:
        "Прокат автомобілів у Буковелі. Без застави. Доставка на курорт. Сучасний автопарк від економ до преміум класу.",
    },
    ru: {
      title: "Аренда авто в Буковеле | REIZ - от 800 грн/день",
      metaDescription:
        "Аренда авто в Буковеле от REIZ. Современный автопарк, доставка на курорт. От эконом до премиум класса. Бронирование 24/7.",
      h1: "Аренда авто в Буковеле",
      sectionCars: "АВТОМОБИЛИ REIZ В БУКОВЕЛЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ БУКОВЕЛЬ",
      subtitle:
        "Аренда авто в Буковеле от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle:
        "Аренда авто Буковель без водителя — REIZ | Прокат от 800 грн/день",
      ogDescription:
        "Прокат автомобилей в Буковеле. Без залога. Доставка на курорт. Современный автопарк от эконом до премиум класса.",
    },
    en: {
      title: "Car Rental in Bukovel | REIZ - from 800 UAH/day",
      metaDescription:
        "Car rental in Bukovel from REIZ. Modern fleet, delivery to the resort. From economy to premium class. Booking 24/7.",
      h1: "Car Rental in Bukovel",
      sectionCars: "REIZ CARS IN BUKOVEL",
      sectionWelcome: "WELCOME TO REIZ BUKOVEL",
      subtitle:
        "Car rental in Bukovel from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Bukovel — REIZ | Rent from 800 UAH/day",
      ogDescription:
        "Car rental in Bukovel. No deposit. Delivery to the resort. Modern fleet from economy to premium class.",
    },
  },
  truskavets: {
    uk: {
      title: "Оренда авто у Трускавці | REIZ - від 800 грн/день",
      metaDescription:
        "Оренда авто у Трускавці від REIZ. Сучасний автопарк, доставка на курорт. Від економ до преміум класу. Бронювання 24/7.",
      h1: "Оренда авто у Трускавці",
      sectionCars: "АВТОМОБІЛІ REIZ У ТРУСКАВЦІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ТРУСКАВЕЦЬ",
      subtitle:
        "Оренда авто у Трускавці від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle:
        "Оренда авто Трускавець без водія — REIZ | Прокат від 800 грн/день",
      ogDescription:
        "Прокат автомобілів у Трускавці. Без застави. Доставка на курорт. Сучасний автопарк від економ до преміум класу.",
    },
    ru: {
      title: "Аренда авто в Трускавце | REIZ - от 800 грн/день",
      metaDescription:
        "Аренда авто в Трускавце от REIZ. Современный автопарк, доставка на курорт. От эконом до премиум класса. Бронирование 24/7.",
      h1: "Аренда авто в Трускавце",
      sectionCars: "АВТОМОБИЛИ REIZ В ТРУСКАВЦЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ТРУСКАВЕЦ",
      subtitle:
        "Аренда авто в Трускавце от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle:
        "Аренда авто Трускавец без водителя — REIZ | Прокат от 800 грн/день",
      ogDescription:
        "Прокат автомобилей в Трускавце. Без залога. Доставка на курорт. Современный автопарк от эконом до премиум класса.",
    },
    en: {
      title: "Car Rental in Truskavets | REIZ - from 800 UAH/day",
      metaDescription:
        "Car rental in Truskavets from REIZ. Modern fleet, delivery to the resort. From economy to premium class. Booking 24/7.",
      h1: "Car Rental in Truskavets",
      sectionCars: "REIZ CARS IN TRUSKAVETS",
      sectionWelcome: "WELCOME TO REIZ TRUSKAVETS",
      subtitle:
        "Car rental in Truskavets from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Truskavets — REIZ | Rent from 800 UAH/day",
      ogDescription:
        "Car rental in Truskavets. No deposit. Delivery to the resort. Modern fleet from economy to premium class.",
    },
  },
  "ivano-frankivsk": {
    uk: {
      title: "Оренда авто в Івано-Франківську | REIZ - від 800 грн/день",
      metaDescription:
        "Оренда авто в Івано-Франківську від REIZ. Сучасний автопарк, доставка в аеропорт та по місту. Від економ до преміум класу. Бронювання 24/7.",
      h1: "Оренда авто в Івано-Франківську",
      sectionCars: "АВТОМОБІЛІ REIZ В ІВАНО-ФРАНКІВСЬКУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ІВАНО-ФРАНКІВСЬК",
      subtitle:
        "Оренда авто в Івано-Франківську від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      ogTitle:
        "Оренда авто Івано-Франківськ без водія — REIZ | Прокат від 800 грн/день",
      ogDescription:
        "Прокат автомобілів в Івано-Франківську. Без застави. Доставка по місту та в аеропорт. Сучасний автопарк від економ до преміум класу.",
    },
    ru: {
      title: "Аренда авто в Ивано-Франковске | REIZ - от 800 грн/день",
      metaDescription:
        "Аренда авто в Ивано-Франковске от REIZ. Современный автопарк, доставка в аэропорт и по городу. От эконом до премиум класса. Бронирование 24/7.",
      h1: "Аренда авто в Ивано-Франковске",
      sectionCars: "АВТОМОБИЛИ REIZ В ИВАНО-ФРАНКОВСКЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ИВАНО-ФРАНКОВСК",
      subtitle:
        "Аренда авто в Ивано-Франковске от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      ogTitle:
        "Аренда авто Ивано-Франковск без водителя — REIZ | Прокат от 800 грн/день",
      ogDescription:
        "Прокат автомобилей в Ивано-Франковске. Без залога. Доставка по городу и в аэропорт. Современный автопарк от эконом до премиум класса.",
    },
    en: {
      title: "Car Rental in Ivano-Frankivsk | REIZ - from 800 UAH/day",
      metaDescription:
        "Car rental in Ivano-Frankivsk from REIZ. Modern fleet, delivery to airport and city-wide. From economy to premium class. Booking 24/7.",
      h1: "Car Rental in Ivano-Frankivsk",
      sectionCars: "REIZ CARS IN IVANO-FRANKIVSK",
      sectionWelcome: "WELCOME TO REIZ IVANO-FRANKIVSK",
      subtitle:
        "Car rental in Ivano-Frankivsk from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      ogTitle: "Car Rental Ivano-Frankivsk — REIZ | Rent from 800 UAH/day",
      ogDescription:
        "Car rental in Ivano-Frankivsk. No deposit. Delivery throughout the city and to the airport. Modern fleet from economy to premium class.",
    },
  },
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
