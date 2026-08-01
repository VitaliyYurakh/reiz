// Конфігурація міст для динамічних сторінок оренди авто
// URL формат: /rental-{slug}/

import type { Locale } from "@/i18n/request";
import type { LocalizedField } from "@/i18n/locale-config";

export interface CityConfig {
  // URL slug (rental-kyiv)
  slug: string;
  // Назва міста в називному відмінку
  name: string;
  // Назва міста в місцевому відмінку (у Києві) - legacy, для uk
  nameLocative: string;
  // Локалізовані назви міста
  localized: LocalizedField<{ name: string; nameLocative: string }>;
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
      pl: { name: "Kijów", nameLocative: "Kijowie" },
      ro: { name: "Kiev", nameLocative: "Kiev" },
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
      pl: { name: "Lwów", nameLocative: "Lwowie" },
      ro: { name: "Lviv", nameLocative: "Lviv" },
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
      pl: { name: "Tarnopol", nameLocative: "Tarnopolu" },
      ro: { name: "Ternopil", nameLocative: "Ternopil" },
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
      pl: { name: "Odessa", nameLocative: "Odessie" },
      ro: { name: "Odesa", nameLocative: "Odesa" },
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
      pl: { name: "Dniepr", nameLocative: "Dnieprze" },
      ro: { name: "Dnipro", nameLocative: "Dnipro" },
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
      pl: { name: "Charków", nameLocative: "Charkowie" },
      ro: { name: "Harkiv", nameLocative: "Harkiv" },
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
      pl: { name: "Bukowel", nameLocative: "Bukowelu" },
      ro: { name: "Bukovel", nameLocative: "Bukovel" },
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
      pl: { name: "Truskawiec", nameLocative: "Truskawcu" },
      ro: { name: "Truskaveț", nameLocative: "Truskaveț" },
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
      pl: { name: "Iwano-Frankiwsk", nameLocative: "Iwano-Frankiwsku" },
      ro: { name: "Ivano-Frankivsk", nameLocative: "Ivano-Frankivsk" },
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
      pl: { name: "Schodnica", nameLocative: "Schodnicy" },
      ro: { name: "Shidnița", nameLocative: "Shidnița" },
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
      pl: { name: "Użhorod", nameLocative: "Użhorodzie" },
      ro: { name: "Ujhorod", nameLocative: "Ujhorod" },
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
      pl: { name: "Winnica", nameLocative: "Winnicy" },
      ro: { name: "Vinnița", nameLocative: "Vinnița" },
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
      pl: { name: "Zaporoże", nameLocative: "Zaporożu" },
      ro: { name: "Zaporijjia", nameLocative: "Zaporijjia" },
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
      pl: { name: "Mukaczewo", nameLocative: "Mukaczewie" },
      ro: { name: "Mukacevo", nameLocative: "Mukacevo" },
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
      pl: { name: "Połtawa", nameLocative: "Połtawie" },
      ro: { name: "Poltava", nameLocative: "Poltava" },
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
      pl: { name: "Czerniowce", nameLocative: "Czerniowcach" },
      ro: { name: "Cernăuți", nameLocative: "Cernăuți" },
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
      pl: { name: "Boryszpol", nameLocative: "Boryszpolu" },
      ro: { name: "Boryspil", nameLocative: "Boryspil" },
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
      pl: { name: "Łuck", nameLocative: "Łucku" },
      ro: { name: "Luțk", nameLocative: "Luțk" },
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
      pl: { name: "Równe", nameLocative: "Równem" },
      ro: { name: "Rivne", nameLocative: "Rivne" },
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
      pl: { name: "Chmielnicki", nameLocative: "Chmielnickim" },
      ro: { name: "Hmelnițki", nameLocative: "Hmelnițki" },
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
      pl: { name: "Kamieniec Podolski", nameLocative: "Kamieńcu Podolskim" },
      ro: { name: "Kameneț-Podolsk", nameLocative: "Kameneț-Podolsk" },
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
      pl: { name: "Drohobycz", nameLocative: "Drohobyczu" },
      ro: { name: "Drogobici", nameLocative: "Drogobici" },
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
      pl: { name: "Stryj", nameLocative: "Stryju" },
      ro: { name: "Strâi", nameLocative: "Strâi" },
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
      pl: { name: "Sambor", nameLocative: "Samborze" },
      ro: { name: "Sambir", nameLocative: "Sambir" },
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
      pl: { name: "Czerwonogród", nameLocative: "Czerwonogrodzie" },
      ro: { name: "Cervonograd", nameLocative: "Cervonograd" },
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
      pl: { name: "Borysław", nameLocative: "Borysławiu" },
      ro: { name: "Borislav", nameLocative: "Borislav" },
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
      pl: { name: "Żółkiew", nameLocative: "Żółkwi" },
      ro: { name: "Jovkva", nameLocative: "Jovkva" },
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
      pl: { name: "Jaremcze", nameLocative: "Jaremczu" },
      ro: { name: "Iaremce", nameLocative: "Iaremce" },
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
      pl: { name: "Kołomyja", nameLocative: "Kołomyi" },
      ro: { name: "Kolomâia", nameLocative: "Kolomâia" },
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
      pl: { name: "Kałusz", nameLocative: "Kałuszu" },
      ro: { name: "Kalush", nameLocative: "Kalush" },
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
      pl: { name: "Nadwórna", nameLocative: "Nadwórnej" },
      ro: { name: "Nadvorna", nameLocative: "Nadvorna" },
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
      pl: { name: "Kosów", nameLocative: "Kosowie" },
      ro: { name: "Kosiv", nameLocative: "Kosiv" },
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
      pl: { name: "Czortków", nameLocative: "Czortkowie" },
      ro: { name: "Ciortkov", nameLocative: "Ciortkov" },
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
      pl: { name: "Krzemieniec", nameLocative: "Krzemieńcu" },
      ro: { name: "Kremeneț", nameLocative: "Kremeneț" },
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
      pl: { name: "Berehowo", nameLocative: "Berehowie" },
      ro: { name: "Berehove", nameLocative: "Berehove" },
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
      pl: { name: "Chust", nameLocative: "Chuście" },
      ro: { name: "Hust", nameLocative: "Hust" },
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
      pl: { name: "Rachów", nameLocative: "Rachowie" },
      ro: { name: "Rahiv", nameLocative: "Rahiv" },
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
  LocalizedField<CityLocalizedData>
> = {
  kyiv: {
    uk: {
      title: "Оренда та прокат авто у Києві без застави",
      metaDescription:
        "Оренда та прокат авто у Києві від REIZ: Економ, Комфорт, SUV і бізнес-клас. Подача за адресою або до вокзалу, прозорі умови оренди.",
      h1: "Оренда авто у Києві від REIZ",
      sectionCars: "АВТОПАРК REIZ У КИЄВІ: ВІД КОМФОРТУ ДО ПРЕМІУМ-КЛАСУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ КИЇВ",
      subtitle:
        "Оренда авто у Києві від REIZ — нові автомобілі, преміум-сервіс, вигідні тарифи та подання за адресою у зручний час.",
      address: "Київ: Персональна подача (Аеропорти / Вокзал / Місто)",
      ogTitle: "Оренда та прокат авто у Києві без застави | REIZ",
      ogDescription:
        "Оренда та прокат авто у Києві від REIZ: Економ, Комфорт, SUV і бізнес-клас. Подача за адресою або до вокзалу, прозорі умови оренди.",
      footerDescription:
        "Надійний прокат авто в Києві від REIZ. Оренда машин класів Економ, Комфорт та SUV з доставкою по місту, до Ж/Д вокзалу або в аеропорти Бориспіль (KBP) та Жуляни (IEV). Підтримка 24/7.",
    },
    ru: {
      title: "Аренда и прокат авто в Киеве без залога",
      metaDescription:
        "Аренда и прокат авто в Киеве от REIZ: Эконом, Комфорт, SUV и бизнес-класс. Подача по адресу или к вокзалу, прозрачные условия аренды.",
      h1: "Аренда авто в Киеве",
      sectionCars: "АВТОПАРК REIZ В КИЕВЕ: ОТ КОМФОРТА ДО ПРЕМИУМ-КЛАССА",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ КИЕВ",
      subtitle:
        "Аренда авто в Киеве от REIZ — новые автомобили, премиум-сервис, выгодные тарифы и подача по адресу в удобное время.",
      address: "Киев: Персональная подача (Аэропорты / Вокзал / Город)",
      ogTitle: "Аренда и прокат авто в Киеве без залога | REIZ",
      ogDescription:
        "Аренда и прокат авто в Киеве от REIZ: Эконом, Комфорт, SUV и бизнес-класс. Подача по адресу или к вокзалу, прозрачные условия аренды.",
      footerDescription:
        "Надежный прокат авто в Киеве от REIZ. Аренда машин классов Эконом, Комфорт и SUV с доставкой по городу, к Ж/Д вокзалу или в аэропорты Борисполь (KBP) и Жуляны (IEV). Поддержка 24/7.",
    },
    en: {
      title: "Car Rental Kyiv: Rent a Car | Best Prices | Railway Station Pickup",
      metaDescription:
        "Best car rental in Kyiv (Kiev). ⭐ New fleet 2023-2025. ⚡ Delivery to Railway Station and City Center hotels. 🛡️ Full insurance & English support. Book now!",
      h1: "Car Rental in Kyiv",
      sectionCars: "REIZ FLEET IN KYIV: FROM COMFORT TO PREMIUM CLASS",
      sectionWelcome: "WELCOME TO REIZ KYIV",
      subtitle:
        "Car rental in Kyiv from REIZ — new vehicles, premium service, competitive rates and delivery to your address at a convenient time.",
      address: "Kyiv: Personal Delivery (Airports / Railway / City)",
      ogTitle: "Car Rental Kyiv: Rent a Car | Best Prices | Railway Station Pickup",
      ogDescription:
        "Best car rental in Kyiv (Kiev). ⭐ New fleet 2023-2025. ⚡ Delivery to Railway Station and City Center hotels. 🛡️ Full insurance & English support. Book now!",
      footerDescription:
        "Reliable car rental in Kyiv by REIZ. Rent Economy, Comfort, and SUV cars with delivery across the city, to the Railway Station, or Boryspil (KBP) and Zhuliany (IEV) airports. 24/7 support.",
    },
    pl: {
      title: "Wynajem samochodu w Kijowie bez kaucji — podstawienie na Boryszpol 24/7",
      metaDescription:
        "Wynajem samochodu w Kijowie od REIZ. Flota 2023–2025, podstawienie na lotnisko Boryszpol, dworzec i po mieście. Bez ukrytych opłat, pełne ubezpieczenie.",
      h1: "Wynajem samochodu w Kijowie",
      sectionCars: "FLOTA REIZ W KIJOWIE: OD KOMFORTU DO KLASY PREMIUM",
      sectionWelcome: "WITAMY W REIZ KIJÓW",
      subtitle:
        "Wynajem samochodu w Kijowie od REIZ — nowe pojazdy, serwis premium, konkurencyjne ceny i dostawa pod wskazany adres o wygodnej porze.",
      address: "Kijów: Dostawa osobista (Lotniska / Dworzec / Miasto)",
      ogTitle: "Wynajem samochodu w Kijowie bez kaucji — podstawienie na Boryszpol 24/7 | REIZ",
      ogDescription:
        "Wynajem samochodu w Kijowie od REIZ. Flota 2023–2025, podstawienie na lotnisko Boryszpol, dworzec i po mieście. Bez ukrytych opłat, pełne ubezpieczenie.",
      footerDescription:
        "Niezawodny wynajem samochodu w Kijowie od REIZ. Samochody klasy Ekonom, Komfort i SUV z dostawą po mieście, na dworzec kolejowy lub lotniska Boryszpol (KBP) i Żulany (IEV). Wsparcie 24/7.",
    },
    ro: {
      title: "Închiriere auto în Kiev fără garanție — livrare la Boryspil 24/7",
      metaDescription:
        "Închiriere auto în Kiev de la REIZ. Flotă 2023–2025, livrare la aeroportul Boryspil, gară și în oraș. Fără taxe ascunse, CASCO complet. Rezervați online!",
      h1: "Închiriere auto în Kiev de la REIZ",
      sectionCars: "FLOTA REIZ ÎN KIEV: DE LA CONFORT LA CLASA PREMIUM",
      sectionWelcome: "BINE AȚI VENIT LA REIZ KIEV",
      subtitle:
        "Închiriere auto în Kiev de la REIZ — vehicule noi, servicii premium, tarife competitive și livrare la adresă la ora convenabilă.",
      address: "Kiev: Livrare personală (Aeroporturi / Gară / Oraș)",
      ogTitle: "Închiriere auto în Kiev fără garanție — livrare la Boryspil 24/7 | REIZ",
      ogDescription:
        "Închiriere auto în Kiev de la REIZ. Flotă 2023–2025, livrare la aeroportul Boryspil, gară și în oraș. Fără taxe ascunse, CASCO complet. Rezervați online!",
      footerDescription:
        "Închiriere auto de încredere în Kiev de la REIZ. Mașini Economy, Comfort și SUV cu livrare în oraș, la gară sau la aeroporturile Boryspil (KBP) și Zhuliany (IEV). Suport 24/7.",
    },
  },
  lviv: {
    uk: {
      title: "Оренда авто у Львові без застави — подача в аеропорт LWO",
      metaDescription:
        "Прокат авто у Львові від REIZ. Нові автомобілі 2023–2025, подача в аеропорт, на вокзал та по місту. Без прихованих платежів, виїзд за кордон. Оформлення за 15 хв.",
      h1: "Оренда авто у Львові від REIZ",
      sectionCars: "АВТОМОБІЛІ REIZ У ЛЬВОВІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЛЬВІВ",
      subtitle:
        "Прокат авто у Львові без застави. Подача в аеропорт LWO, на вокзал або за адресою. Оформлення за 15 хвилин.",
      address: "Міжнародний аеропорт «Львів» ім. Данила Галицького",
      ogTitle: "Оренда авто у Львові без застави — подача в аеропорт LWO | REIZ",
      ogDescription:
        "Прокат авто у Львові від REIZ. Нові автомобілі 2023–2025, подача в аеропорт, на вокзал та по місту. Без прихованих платежів, виїзд за кордон. Оформлення за 15 хв.",
      footerDescription:
        "Оренда авто у Львові без зайвого клопоту. REIZ пропонує нові моделі від Економу до Преміум класу. Забирайте авто в офісі або замовляйте подачу в аеропорт чи до готелю. Прозорі тарифи.",
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
      footerDescription:
        "Аренда авто во Львове без лишних хлопот. REIZ предлагает новые модели от Эконома до Премиум класса. Забирайте авто в офисе или закажите подачу в аэропорт или к отелю. Прозрачные тарифы.",
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
      footerDescription:
        "Hassle-free car rental in Lviv. REIZ offers new models from Economy to Premium class. Pick up the car at our office or request delivery to the airport or your hotel. Transparent rates.",
    },
    pl: {
      title: "Wynajem samochodu we Lwowie bez kaucji — podstawienie na lotnisko LWO",
      metaDescription:
        "Wynajem samochodu we Lwowie od REIZ. Nowe auta 2023–2025, podstawienie na lotnisko i dworzec. Bez ukrytych opłat, wyjazd za granicę. Formalności w 15 min.",
      h1: "Wynajem samochodu we Lwowie — bez kaucji i dostawa 24/7",
      sectionCars: "SAMOCHODY REIZ WE LWOWIE",
      sectionWelcome: "WITAMY W REIZ LWÓW",
      subtitle:
        "Wynajem samochodu we Lwowie bez kaucji. Dostawa na lotnisko LWO, dworzec lub pod wskazany adres. Formalności w 15 minut.",
      address: "Międzynarodowy port lotniczy Lwów im. Danyła Halickiego",
      ogTitle: "Wynajem samochodu we Lwowie bez kaucji — podstawienie na lotnisko LWO | REIZ",
      ogDescription:
        "Wynajem samochodu we Lwowie od REIZ. Nowe auta 2023–2025, podstawienie na lotnisko i dworzec. Bez ukrytych opłat, wyjazd za granicę. Formalności w 15 min.",
      footerDescription:
        "Bezproblemowy wynajem samochodów we Lwowie. REIZ oferuje nowe modele od klasy Ekonom do Premium. Odbierz auto w biurze lub zamów dostawę na lotnisko lub do hotelu. Przejrzyste ceny.",
    },
    ro: {
      title: "Închiriere auto în Lviv fără garanție — livrare la aeroportul LWO",
      metaDescription:
        "Închiriere auto în Lviv de la REIZ. Vehicule noi 2023–2025, livrare la aeroport, gară și în oraș. Fără taxe ascunse, ieșire peste graniță. Formalități în 15 min.",
      h1: "Închiriere auto în Lviv — fără garanție și livrare 24/7",
      sectionCars: "MAȘINI REIZ ÎN LVIV",
      sectionWelcome: "BINE AȚI VENIT LA REIZ LVIV",
      subtitle:
        "Închiriere auto în Lviv fără garanție. Livrare la aeroportul LWO, gară sau la adresă. Formalități în 15 minute.",
      address: "Aeroportul Internațional Lviv Danylo Halytskyi",
      ogTitle: "Închiriere auto în Lviv fără garanție — livrare la aeroportul LWO | REIZ",
      ogDescription:
        "Închiriere auto în Lviv de la REIZ. Vehicule noi 2023–2025, livrare la aeroport, gară și în oraș. Fără taxe ascunse, ieșire peste graniță. Formalități în 15 min.",
      footerDescription:
        "Închiriere auto fără griji în Lviv. REIZ oferă modele noi de la Economy la Premium. Ridicați mașina la birou sau solicitați livrare la aeroport sau hotel. Tarife transparente.",
    },
  },
  ternopil: {
    uk: {
      title: "Оренда та прокат авто у Тернополі без застави",
      metaDescription:
        "Оренда та прокат авто у Тернополі від REIZ: Економ і бізнес-клас. Подача за адресою або до вокзалу; умови оренди підтвердить менеджер.",
      h1: "Оренда авто у Тернополі",
      sectionCars: "АВТОМОБІЛІ REIZ У ТЕРНОПОЛІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ТЕРНОПІЛЬ",
      subtitle:
        "Прокат авто у Тернополі без застави. Подача на вокзал, автостанцію або за адресою 24/7. Економ та бізнес-клас.",
      address: "Центр міста Тернопіль",
      ogTitle: "Оренда та прокат авто у Тернополі без застави | REIZ",
      ogDescription:
        "Оренда та прокат авто у Тернополі від REIZ: Економ і бізнес-клас. Подача за адресою або до вокзалу; умови оренди підтвердить менеджер.",
      footerDescription:
        "Сервіс прокату автомобілів у Тернополі. Обирайте авто класу Економ або Бізнес для поїздок містом. REIZ гарантує швидку подачу машини за адресою та ідеальний технічний стан.",
    },
    ru: {
      title: "Аренда и прокат авто в Тернополе без залога",
      metaDescription:
        "Аренда и прокат авто в Тернополе от REIZ: Эконом и бизнес-класс. Подача по адресу или к вокзалу; условия аренды подтвердит менеджер.",
      h1: "Аренда авто в Тернополе",
      sectionCars: "АВТОМОБИЛИ REIZ В ТЕРНОПОЛЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ТЕРНОПОЛЬ",
      subtitle:
        "Прокат авто в Тернополе без залога. Подача на вокзал, автостанцию или по адресу 24/7. Эконом и бизнес-класс.",
      address: "Центр города Тернополь",
      ogTitle: "Аренда и прокат авто в Тернополе без залога | REIZ",
      ogDescription:
        "Аренда и прокат авто в Тернополе от REIZ: Эконом и бизнес-класс. Подача по адресу или к вокзалу; условия аренды подтвердит менеджер.",
      footerDescription:
        "Сервис проката автомобилей в Тернополе. Выбирайте авто класса Эконом или Бизнес для поездок по городу. REIZ гарантирует быструю подачу машины по адресу и идеальное техническое состояние.",
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
      address: "Ternopil City Center",
      ogTitle: "Car Rental Ternopil — REIZ | No Deposit, Fast Pickup",
      ogDescription:
        "Rent a car in Ternopil. No deposit. New fleet. Free city delivery. Fast paperwork 24/7.",
      footerDescription:
        "Car rental service in Ternopil. Choose Economy or Business class cars for city trips. REIZ guarantees fast car delivery to your address and perfect technical condition.",
    },
    pl: {
      title: "Wynajem samochodu w Tarnopolu — bez kaucji, szybki odbiór",
      metaDescription:
        "Wynajem samochodu w Tarnopolu oficjalnie. Nowa flota. Bezpłatna dostawa po mieście i na dworzec 24/7. Szybkie formalności. Zarezerwuj!",
      h1: "Wynajem samochodu w Tarnopolu",
      sectionCars: "SAMOCHODY REIZ W TARNOPOLU",
      sectionWelcome: "WITAMY W REIZ TARNOPOL",
      subtitle:
        "Wynajem samochodu w Tarnopolu bez kaucji. Dostawa na dworzec, dworzec autobusowy lub pod wskazany adres 24/7. Klasa ekonom i biznes.",
      address: "Centrum miasta Tarnopol",
      ogTitle: "Wynajem samochodu Tarnopol — REIZ | Bez kaucji, szybki odbiór",
      ogDescription:
        "Wynajem samochodu w Tarnopolu. Bez kaucji. Nowa flota. Bezpłatna dostawa po mieście. Szybkie formalności 24/7.",
      footerDescription:
        "Wypożyczalnia samochodów w Tarnopolu. Wybierz samochód klasy Ekonom lub Biznes na przejażdżki po mieście. REIZ gwarantuje szybką dostawę samochodu pod wskazany adres i doskonały stan techniczny.",
    },
    ro: {
      title: "Închiriere auto în Ternopil — fără garanție, preluare rapidă",
      metaDescription:
        "Închiriere auto în Ternopil oficial. Flotă nouă. Livrare gratuită în oraș și la gară 24/7. Formalități rapide. Rezervați!",
      h1: "Închiriere auto în Ternopil",
      sectionCars: "MAȘINI REIZ ÎN TERNOPIL",
      sectionWelcome: "BINE AȚI VENIT LA REIZ TERNOPIL",
      subtitle:
        "Închiriere auto în Ternopil fără garanție. Livrare la gară, autogară sau la adresă 24/7. Clasă economy și business.",
      address: "Centrul orașului Ternopil",
      ogTitle: "Închiriere auto Ternopil — REIZ | Fără garanție, preluare rapidă",
      ogDescription:
        "Închiriere auto în Ternopil. Fără garanție. Flotă nouă. Livrare gratuită în oraș. Formalități rapide 24/7.",
      footerDescription:
        "Serviciu de închiriere auto în Ternopil. Alegeți mașini Economy sau Business. REIZ garantează livrare rapidă la adresă și stare tehnică perfectă.",
    },
  },
  odesa: {
    uk: {
      title: "Оренда та прокат авто в Одесі без застави",
      metaDescription:
        "Оренда та прокат авто в Одесі від REIZ: Економ, Комфорт, SUV і бізнес-клас. Подача за адресою, у центр або Аркадію, прозорі умови.",
      h1: "Оренда авто в Одесі від REIZ",
      sectionCars: "АВТОПАРК REIZ В ОДЕСІ: ВІД КОМФОРТУ ДО ПРЕМІУМ-КЛАСУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ОДЕСА",
      subtitle:
        "Прокат авто в Одесі без застави. Подача в аеропорт ODS, на Аркадію, в порт або за адресою. Кабріолети та позашляховики.",
      address: "Міжнародний аеропорт «Одеса» (ODS)",
      ogTitle: "Оренда та прокат авто в Одесі без застави | REIZ",
      ogDescription:
        "Оренда та прокат авто в Одесі від REIZ: Економ, Комфорт, SUV і бізнес-клас. Подача за адресою, у центр або Аркадію, прозорі умови.",
      footerDescription:
        "Оренда машин в Одесі для відпочинку та справ. Доступні авто Економ класу та позашляховики. Зустрінемо вас в аеропорту або на вокзалі. Подорожуйте з комфортом разом з REIZ.",
    },
    ru: {
      title: "Аренда и прокат авто в Одессе без залога",
      metaDescription:
        "Аренда и прокат авто в Одессе от REIZ: Эконом, Комфорт, SUV и бизнес-класс. Подача по адресу, в центр или Аркадию, прозрачные условия.",
      h1: "Аренда авто в Одессе",
      sectionCars: "АВТОПАРК REIZ В ОДЕССЕ: ОТ КОМФОРТА ДО ПРЕМИУМ-КЛАССА",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ОДЕССА",
      subtitle:
        "Прокат авто в Одессе без залога. Подача в аэропорт ODS, на Аркадию, в порт или по адресу. Кабриолеты и внедорожники.",
      address: "Международный аэропорт «Одесса» (ODS)",
      ogTitle: "Аренда и прокат авто в Одессе без залога | REIZ",
      ogDescription:
        "Аренда и прокат авто в Одессе от REIZ: Эконом, Комфорт, SUV и бизнес-класс. Подача по адресу, в центр или Аркадию, прозрачные условия.",
      footerDescription:
        "Аренда машин в Одессе для отдыха и дел. Доступны авто Эконом класса и внедорожники. Встретим вас в аэропорту или на вокзале. Путешествуйте с комфортом вместе с REIZ.",
    },
    en: {
      title: "Car Rental Odesa: City Center & Arcadia | Business Class",
      metaDescription:
        "Rent a car in Odesa. 🌊 Luxury and Economy cars. ⚡ Fast booking in Arcadia & Center. 🛡️ Insurance included. Flexible terms for long-term rental.",
      h1: "Car Rental in Odesa — No Deposit & 24/7 Delivery",
      sectionCars: "REIZ FLEET IN ODESA: FROM COMFORT TO PREMIUM CLASS",
      sectionWelcome: "WELCOME TO REIZ ODESA",
      subtitle:
        "Car rental in Odesa with no deposit. Delivery to ODS airport, Arcadia beach, port or your address. Convertibles and SUVs available.",
      address: "Odesa International Airport (ODS)",
      ogTitle: "Car Rental Odesa: City Center & Arcadia | Business Class",
      ogDescription:
        "Rent a car in Odesa. 🌊 Luxury and Economy cars. ⚡ Fast booking in Arcadia & Center. 🛡️ Insurance included. Flexible terms for long-term rental.",
      footerDescription:
        "Car rental in Odesa for leisure and business. Economy class cars and SUVs available. We will meet you at the airport or train station. Travel with comfort with REIZ.",
    },
    pl: {
      title: "Wynajem samochodu w Odessie bez kaucji — Centrum i Arkadia",
      metaDescription:
        "Wynajem samochodu w Odessie od REIZ. Luksusowe i ekonomiczne auta. Rezerwacja w Arkadii i Centrum. Ubezpieczenie w cenie. Elastyczny wynajem długoterminowy.",
      h1: "Wynajem samochodu w Odessie — bez kaucji i dostawa 24/7",
      sectionCars: "FLOTA REIZ W ODESSIE: OD KOMFORTU DO KLASY PREMIUM",
      sectionWelcome: "WITAMY W REIZ ODESSA",
      subtitle:
        "Wynajem samochodu w Odessie bez kaucji. Dostawa na lotnisko ODS, plażę Arkadia, port lub pod wskazany adres. Kabriolety i SUV-y dostępne.",
      address: "Międzynarodowy port lotniczy Odessa (ODS)",
      ogTitle: "Wynajem samochodu w Odessie bez kaucji — Centrum i Arkadia | REIZ",
      ogDescription:
        "Wynajem samochodu w Odessie od REIZ. Luksusowe i ekonomiczne auta. Rezerwacja w Arkadii i Centrum. Ubezpieczenie w cenie. Elastyczny wynajem długoterminowy.",
      footerDescription:
        "Wynajem samochodów w Odessie na wypoczynek i sprawy służbowe. Dostępne samochody klasy Ekonom i SUV-y. Spotkamy Cię na lotnisku lub dworcu. Podróżuj z komfortem z REIZ.",
    },
    ro: {
      title: "Închiriere auto în Odesa: Centru și Arcadia | Clasă business",
      metaDescription:
        "Închiriere auto în Odesa. Mașini de lux și economice. Rezervare rapidă în Arcadia și Centru. Asigurare inclusă. Condiții flexibile.",
      h1: "Închiriere auto în Odesa — fără garanție și livrare 24/7",
      sectionCars: "FLOTA REIZ ÎN ODESA: DE LA CONFORT LA CLASA PREMIUM",
      sectionWelcome: "BINE AȚI VENIT LA REIZ ODESA",
      subtitle:
        "Închiriere auto în Odesa fără garanție. Livrare la aeroportul ODS, plaja Arcadia, port sau la adresă. Cabrioleturi și SUV-uri disponibile.",
      address: "Aeroportul Internațional Odesa (ODS)",
      ogTitle: "Închiriere auto în Odesa: Centru și Arcadia | Clasă business",
      ogDescription:
        "Închiriere auto în Odesa. Mașini de lux și economice. Rezervare rapidă în Arcadia și Centru. Asigurare inclusă.",
      footerDescription:
        "Închiriere auto în Odesa pentru vacanță și afaceri. Mașini Economy și SUV-uri disponibile. Vă întâmpinăm la aeroport sau gară. Călătoriți confortabil cu REIZ.",
    },
  },
  dnipro: {
    uk: {
      title: "Оренда та прокат авто у Дніпрі без застави",
      metaDescription:
        "Оренда та прокат авто у Дніпрі від REIZ для міських і ділових поїздок. Економ, SUV та бізнес-клас, подача за адресою.",
      h1: "Оренда авто у Дніпрі від REIZ",
      sectionCars: "АВТОПАРК REIZ У ДНІПРІ: ВІД КОМФОРТУ ДО ПРЕМІУМ-КЛАСУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ДНІПРО",
      subtitle:
        "Прокат авто у Дніпрі без застави для ділових поїздок. Подача в аеропорт DNK та по місту. Бізнес-клас та довгострокова оренда.",
      footerDescription:
        "Автопрокат у Дніпрі від компанії REIZ. Широкий вибір: бюджетні Економ авто та комфортні седани. Замовляйте доставку машини в будь-який район міста. Чесна ціна без прихованих комісій.",
      address: "Міжнародний аеропорт «Дніпро» (DNK)",
      ogTitle: "Оренда та прокат авто у Дніпрі без застави | REIZ",
      ogDescription:
        "Оренда та прокат авто у Дніпрі від REIZ для міських і ділових поїздок. Економ, SUV та бізнес-клас, подача за адресою.",
    },
    ru: {
      title: "Аренда и прокат авто в Днепре без залога",
      metaDescription:
        "Аренда и прокат авто в Днепре от REIZ для городских и деловых поездок. Эконом, SUV и бизнес-класс, подача по адресу.",
      h1: "Аренда авто в Днепре",
      sectionCars: "АВТОПАРК REIZ В ДНЕПРЕ: ОТ КОМФОРТА ДО ПРЕМИУМ-КЛАССА",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ДНЕПР",
      subtitle:
        "Прокат авто в Днепре без залога для деловых поездок. Подача в аэропорт DNK и по городу. Бизнес-класс и долгосрочная аренда.",
      footerDescription:
        "Автопрокат в Днепре от компании REIZ. Широкий выбор: бюджетные Эконом авто и комфортные седаны. Заказывайте доставку машины в любой район города. Честная цена без скрытых комиссий.",
      address: "Международный аэропорт «Днепр» (DNK)",
      ogTitle: "Аренда и прокат авто в Днепре без залога | REIZ",
      ogDescription:
        "Аренда и прокат авто в Днепре от REIZ для городских и деловых поездок. Эконом, SUV и бизнес-класс, подача по адресу.",
    },
    en: {
      title: "Car Rental Dnipro: SUV & Pickup Rental | Business Services",
      metaDescription:
        "Car rental services in Dnipro. 🏭 Reliable fleet for business and industrial needs. 🚙 4x4 SUVs available. ⚡ VAT invoices for companies.",
      h1: "Car Rental in Dnipro",
      sectionCars: "REIZ FLEET IN DNIPRO: FROM COMFORT TO PREMIUM CLASS",
      sectionWelcome: "WELCOME TO REIZ DNIPRO",
      subtitle:
        "Car rental in Dnipro with no deposit for business trips. Delivery to DNK airport and city-wide. Business class and long-term rental.",
      footerDescription:
        "Car rental in Dnipro by REIZ company. Wide selection: budget Economy cars and comfort sedans. Order car delivery to any district of the city. Fair price with no hidden fees.",
      address: "Dnipro International Airport (DNK)",
      ogTitle: "Car Rental Dnipro: SUV & Pickup Rental | Business Services",
      ogDescription:
        "Car rental services in Dnipro. 🏭 Reliable fleet for business and industrial needs. 🚙 4x4 SUVs available. ⚡ VAT invoices for companies.",
    },
    pl: {
      title: "Wynajem samochodu w Dnieprze: SUV i klasa biznesowa",
      metaDescription:
        "Wynajem samochodu w Dnieprze. Niezawodna flota dla biznesu i przemysłu. SUV-y 4x4 dostępne. Faktury VAT dla firm.",
      h1: "Wynajem samochodu w Dnieprze",
      sectionCars: "FLOTA REIZ W DNIEPRZE: OD KOMFORTU DO KLASY PREMIUM",
      sectionWelcome: "WITAMY W REIZ DNIEPR",
      subtitle:
        "Wynajem samochodu w Dnieprze bez kaucji na podróże służbowe. Dostawa na lotnisko DNK i po mieście. Klasa biznes i wynajem długoterminowy.",
      footerDescription:
        "Wynajem samochodów w Dnieprze od REIZ. Szeroki wybór: budżetowe samochody Ekonom i komfortowe sedany. Zamów dostawę samochodu do dowolnej dzielnicy miasta. Uczciwa cena bez ukrytych opłat.",
      address: "Międzynarodowy port lotniczy Dniepr (DNK)",
      ogTitle: "Wynajem samochodu w Dnieprze: SUV i klasa biznesowa | REIZ",
      ogDescription:
        "Wynajem samochodu w Dnieprze. Niezawodna flota dla biznesu i przemysłu. SUV-y 4x4 dostępne. Faktury VAT dla firm.",
    },
    ro: {
      title: "Închiriere auto în Dnipro: SUV și clasă business",
      metaDescription:
        "Închiriere auto în Dnipro. Flotă fiabilă pentru afaceri. SUV-uri 4x4 disponibile. Facturi TVA pentru companii.",
      h1: "Închiriere auto în Dnipro",
      sectionCars: "FLOTA REIZ ÎN DNIPRO: DE LA CONFORT LA CLASA PREMIUM",
      sectionWelcome: "BINE AȚI VENIT LA REIZ DNIPRO",
      subtitle:
        "Închiriere auto în Dnipro fără garanție pentru călătorii de afaceri. Livrare la aeroportul DNK și în oraș. Clasă business și închiriere pe termen lung.",
      address: "Aeroportul Internațional Dnipro (DNK)",
      ogTitle: "Închiriere auto în Dnipro: SUV și clasă business | REIZ",
      ogDescription:
        "Închiriere auto în Dnipro. Flotă fiabilă pentru afaceri. SUV-uri 4x4 disponibile. Facturi TVA pentru companii.",
      footerDescription:
        "Închiriere auto în Dnipro de la REIZ. Selecție largă: mașini Economy și sedan-uri confortabile. Comandați livrarea în orice zonă a orașului. Preț corect fără taxe ascunse.",
    },
  },
  kharkiv: {
    uk: {
      title: "Оренда та прокат авто у Харкові без застави",
      metaDescription:
        "Оренда та прокат авто у Харкові від REIZ: Економ, Комфорт, SUV і бізнес-клас. Подача за адресою або до вокзалу, умови погоджує менеджер.",
      h1: "Оренда авто у Харкові від REIZ",
      sectionCars: "АВТОПАРК REIZ У ХАРКОВІ: ВІД КОМФОРТУ ДО ПРЕМІУМ-КЛАСУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ХАРКІВ",
      subtitle:
        "Прокат авто у Харкові без застави. Подача на вокзал, в аеропорт HRK або за адресою 24/7. Бізнес та SUV-клас.",
      footerDescription:
        "Прокат автомобілів у Харкові. Потрібне авто терміново? REIZ доставить машину (Економ / SUV) у зручне для вас місце. Оренда без водія з повною страховкою та підтримкою в дорозі.",
      address: "Міжнародний аеропорт «Харків» (HRK)",
      ogTitle: "Оренда та прокат авто у Харкові без застави | REIZ",
      ogDescription:
        "Оренда та прокат авто у Харкові від REIZ: Економ, Комфорт, SUV і бізнес-клас. Подача за адресою або до вокзалу, умови погоджує менеджер.",
    },
    ru: {
      title: "Аренда и прокат авто в Харькове без залога",
      metaDescription:
        "Аренда и прокат авто в Харькове от REIZ: Эконом, Комфорт, SUV и бизнес-класс. Подача по адресу или к вокзалу, детали подтвердит менеджер.",
      h1: "Аренда авто в Харькове",
      sectionCars: "АВТОПАРК REIZ В ХАРЬКОВЕ: ОТ КОМФОРТА ДО ПРЕМИУМ-КЛАССА",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ХАРЬКОВ",
      subtitle:
        "Прокат авто в Харькове без залога. Подача на вокзал, в аэропорт HRK или по адресу 24/7. Бизнес и SUV-класс.",
      footerDescription:
        "Прокат автомобилей в Харькове. Нужна машина срочно? REIZ доставит авто (Эконом / SUV) в удобное для вас место. Аренда без водителя с полной страховкой и поддержкой в дороге.",
      address: "Международный аэропорт «Харьков» (HRK)",
      ogTitle: "Аренда и прокат авто в Харькове без залога | REIZ",
      ogDescription:
        "Аренда и прокат авто в Харькове от REIZ: Эконом, Комфорт, SUV и бизнес-класс. Подача по адресу или к вокзалу, детали подтвердит менеджер.",
    },
    en: {
      title: "Car Rental Kharkiv: Railway Station Pickup | We are Open",
      metaDescription:
        "Rent a car in Kharkiv. ⚡ Delivery to Railway Station. 🚗 Economy and Mid-size cars. 🛡️ 24/7 Support. Safe and reliable booking in 2025.",
      h1: "Car Rental in Kharkiv",
      sectionCars: "REIZ FLEET IN KHARKIV: FROM COMFORT TO PREMIUM CLASS",
      sectionWelcome: "WELCOME TO REIZ KHARKIV",
      subtitle:
        "Car rental in Kharkiv with no deposit. Delivery to the railway station, HRK airport or your address 24/7. Business and SUV class.",
      footerDescription:
        "Car rental in Kharkiv. Need a car urgently? REIZ will deliver a car (Economy / SUV) to a convenient location. Self-drive rental with full insurance and roadside assistance.",
      address: "Kharkiv International Airport (HRK)",
      ogTitle: "Car Rental Kharkiv: Railway Station Pickup | We are Open",
      ogDescription:
        "Rent a car in Kharkiv. ⚡ Delivery to Railway Station. 🚗 Economy and Mid-size cars. 🛡️ 24/7 Support. Safe and reliable booking in 2025.",
    },
    pl: {
      title: "Wynajem samochodu w Charkowie bez kaucji — podstawienie na dworzec 24/7",
      metaDescription:
        "Wynajem samochodu w Charkowie od REIZ. Dostawa na Dworzec Południowy, lotnisko HRK i po mieście. Ekonom, biznes i SUV. Ubezpieczenie w cenie.",
      h1: "Wynajem samochodu w Charkowie",
      sectionCars: "FLOTA REIZ W CHARKOWIE: OD KOMFORTU DO KLASY PREMIUM",
      sectionWelcome: "WITAMY W REIZ CHARKÓW",
      subtitle:
        "Wynajem samochodu w Charkowie bez kaucji. Dostawa na dworzec, lotnisko HRK lub pod wskazany adres 24/7. Klasa biznes i SUV.",
      footerDescription:
        "Wynajem samochodów w Charkowie. Potrzebujesz samochodu pilnie? REIZ dostarczy auto (Ekonom / SUV) w wygodne dla Ciebie miejsce. Wynajem bez kierowcy z pełnym ubezpieczeniem i pomocą drogową.",
      address: "Międzynarodowy port lotniczy Charków (HRK)",
      ogTitle: "Wynajem samochodu w Charkowie bez kaucji — podstawienie na dworzec 24/7 | REIZ",
      ogDescription:
        "Wynajem samochodu w Charkowie od REIZ. Dostawa na Dworzec Południowy, lotnisko HRK i po mieście. Ekonom, biznes i SUV. Ubezpieczenie w cenie.",
    },
    ro: {
      title: "Închiriere auto în Harkiv fără garanție — livrare la gară 24/7",
      metaDescription:
        "Închiriere auto în Harkiv de la REIZ. Livrare la Gara de Sud, aeroportul HRK și în oraș. Economy, business și SUV. Asigurare inclusă.",
      h1: "Închiriere auto în Harkiv",
      sectionCars: "FLOTA REIZ ÎN HARKIV: DE LA CONFORT LA CLASA PREMIUM",
      sectionWelcome: "BINE AȚI VENIT LA REIZ HARKIV",
      subtitle:
        "Închiriere auto în Harkiv fără garanție. Livrare la gară, aeroportul HRK sau la adresă 24/7. Clasă business și SUV.",
      address: "Aeroportul Internațional Harkiv (HRK)",
      ogTitle: "Închiriere auto în Harkiv fără garanție — livrare la gară 24/7 | REIZ",
      ogDescription:
        "Închiriere auto în Harkiv de la REIZ. Livrare la Gara de Sud, aeroportul HRK și în oraș. Economy, business și SUV. Asigurare inclusă.",
      footerDescription:
        "Închiriere auto în Harkiv. Aveți nevoie urgent de mașină? REIZ vă livrează (Economy / SUV) la locația convenabilă. Fără șofer, cu asigurare completă.",
    },
  },
  bukovel: {
    uk: {
      title: "Оренда авто Буковель, Яремче: Джипи 4x4 | Зимова гума гарантовано",
      metaDescription:
        "Прокат авто в Буковелі, Яремче, Ворохті. 🏔️ Позашляховики та кросовери. ❄️ Зимова гума та ланцюги. 🚗 Доставка до готелю. Бронюйте джип в горах!",
      h1: "Оренда авто в Буковелі",
      sectionCars: "АВТОПАРК REIZ У БУКОВЕЛІ: ПОЗАШЛЯХОВИКИ ТА КРОСОВЕРИ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ БУКОВЕЛЬ",
      subtitle:
        "Прокат авто в Буковелі без застави. Позашляховики та повнопривідні авто для гір. Доставка на курорт з Івано-Франківська та Львова.",
      footerDescription:
        "Оренда позашляховиків для поїздок в Буковель. Надійні SUV та Економ авто від REIZ для гірських доріг. Доставка машини прямо до вашого готелю чи котеджу. Безпека понад усе.",
      address: "Курорт Буковель, Поляниця",
      ogTitle: "Оренда авто Буковель, Яремче: Джипи 4x4 | Зимова гума гарантовано",
      ogDescription:
        "Прокат авто в Буковелі, Яремче, Ворохті. 🏔️ Позашляховики та кросовери. ❄️ Зимова гума та ланцюги. 🚗 Доставка до готелю. Бронюйте джип в горах!",
    },
    ru: {
      title: "Аренда авто Буковель: Быстрая подача в любую точку курорта",
      metaDescription:
        "Прокат авто в Буковеле официально. Внедорожники и полноприводные авто для гор. Доставка на курорт 24/7. Новые машины. Бронируйте!",
      h1: "Аренда авто в Буковеле",
      sectionCars: "АВТОПАРК REIZ В БУКОВЕЛЕ: ВНЕДОРОЖНИКИ И КРОССОВЕРЫ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ БУКОВЕЛЬ",
      subtitle:
        "Прокат авто в Буковеле без залога. Внедорожники и полноприводные авто для гор. Доставка на курорт из Ивано-Франковска и Львова.",
      footerDescription:
        "Аренда внедорожников для поездок в Буковель. Надежные SUV и Эконом авто от REIZ для горных дорог. Доставка машины прямо к вашему отелю или коттеджу. Безопасность превыше всего.",
      address: "Курорт Буковель, Поляница",
      ogTitle: "Аренда авто Буковель: Быстрая подача в любую точку курорта",
      ogDescription:
        "Прокат авто в Буковеле официально. Внедорожники и полноприводные авто для гор. Доставка на курорт 24/7. Новые машины. Бронируйте!",
    },
    en: {
      title: "Car Rental Bukovel & Yaremche: SUV 4x4 Rental | Winter Tires",
      metaDescription:
        "Rent a Jeep/SUV in Bukovel. 🏔️ 4x4 Vehicles for mountain roads. ❄️ Winter tires guaranteed. 🚗 Hotel delivery in Polyanytsya/Yaremche.",
      h1: "Car Rental in Bukovel",
      sectionCars: "REIZ FLEET IN BUKOVEL: SUVS AND CROSSOVERS",
      sectionWelcome: "WELCOME TO REIZ BUKOVEL",
      subtitle:
        "Car rental in Bukovel with no deposit. SUVs and AWD vehicles for mountain trips. Resort delivery from Ivano-Frankivsk and Lviv.",
      footerDescription:
        "SUV rental for trips to Bukovel. Reliable SUV and Economy cars from REIZ for mountain roads. Car delivery directly to your hotel or cottage. Safety first.",
      address: "Bukovel Ski Resort, Polyanytsya",
      ogTitle: "Car Rental Bukovel & Yaremche: SUV 4x4 Rental | Winter Tires",
      ogDescription:
        "Rent a Jeep/SUV in Bukovel. 🏔️ 4x4 Vehicles for mountain roads. ❄️ Winter tires guaranteed. 🚗 Hotel delivery in Polyanytsya/Yaremche.",
    },
    pl: {
      title: "Wynajem samochodu Bukowel i Jaremcze — SUV 4x4, opony zimowe",
      metaDescription:
        "Wynajmij Jeepa/SUV-a w Bukowelu. Pojazdy 4x4 na drogi górskie. Opony zimowe gwarantowane. Dostawa do hotelu w Polanicy/Jaremczu.",
      h1: "Wynajem samochodu w Bukowelu",
      sectionCars: "FLOTA REIZ W BUKOWELU: SUV-Y I CROSSOVERY",
      sectionWelcome: "WITAMY W REIZ BUKOWEL",
      subtitle:
        "Wynajem samochodu w Bukowelu bez kaucji. SUV-y i pojazdy AWD na wyjazdy górskie. Dostawa na kurort z Iwano-Frankiwska i Lwowa.",
      footerDescription:
        "Wynajem SUV-ów na wyjazdy do Bukowelu. Niezawodne SUV-y i samochody Ekonom od REIZ na drogi górskie. Dostawa samochodu prosto do Twojego hotelu lub domku. Bezpieczeństwo przede wszystkim.",
      address: "Ośrodek narciarski Bukowel, Polanyca",
      ogTitle: "Wynajem samochodu Bukowel i Jaremcze — SUV 4x4, opony zimowe | REIZ",
      ogDescription:
        "Wynajmij Jeepa/SUV-a w Bukowelu. Pojazdy 4x4 na drogi górskie. Opony zimowe gwarantowane. Dostawa do hotelu w Polanicy/Jaremczu.",
    },
    ro: {
      title: "Închiriere auto Bukovel și Iaremce: SUV 4x4 | Anvelope de iarnă",
      metaDescription:
        "Închiriere SUV în Bukovel. Vehicule 4x4 pentru drumuri montane. Anvelope de iarnă garantate. Livrare la hotel.",
      h1: "Închiriere auto în Bukovel",
      sectionCars: "FLOTA REIZ ÎN BUKOVEL: SUV-URI ȘI CROSSOVERE",
      sectionWelcome: "BINE AȚI VENIT LA REIZ BUKOVEL",
      subtitle:
        "Închiriere auto în Bukovel fără garanție. SUV-uri și vehicule AWD pentru excursii montane. Livrare la stațiune din Ivano-Frankivsk și Lviv.",
      address: "Stațiunea de schi Bukovel, Polianița",
      ogTitle: "Închiriere auto Bukovel și Iaremce: SUV 4x4 | Anvelope de iarnă",
      ogDescription:
        "Închiriere SUV în Bukovel. Vehicule 4x4 pentru drumuri montane. Anvelope de iarnă garantate. Livrare la hotel.",
      footerDescription:
        "Închiriere SUV pentru excursii la Bukovel. SUV-uri și mașini Economy fiabile de la REIZ pentru drumuri montane. Livrare direct la hotel sau cabană. Siguranță pe primul loc.",
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
      address: "Центр курорту Трускавець",
      footerDescription:
        "Ваше авто в Трускавці. Замовляйте прокат машин (Економ / Стандарт) з подачею до санаторію. REIZ забезпечує мобільність на курорті та прості умови оренди.",
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
      address: "Центр курорта Трускавец",
      footerDescription:
        "Ваше авто в Трускавце. Заказывайте прокат машин (Эконом / Стандарт) с подачей к санаторию. REIZ обеспечивает мобильность на курорте и простые условия аренды.",
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
      address: "Truskavets Resort Center",
      footerDescription:
        "Your car in Truskavets. Book car rental (Economy / Standard) with delivery to the sanatorium. REIZ ensures mobility at the resort and simple rental terms.",
      ogTitle: "Car Rental Truskavets & Skhidnytsia: Holiday Rental | Long-term",
      ogDescription:
        "Rent a car in Truskavets. 💧 Best for visiting mineral springs. 🚗 SUVs available for Skhidnytsia roads. ⚡ Discounts for 2+ weeks rental.",
    },
    pl: {
      title: "Wynajem samochodu Truskawiec i Schodnica — wakacje i długoterminowy",
      metaDescription:
        "Wynajmij samochód w Truskawcu. Idealny do odwiedzania źródeł mineralnych. SUV-y na drogi Schodnicy. Zniżki na wynajem 2+ tygodni.",
      h1: "Wynajem samochodu w Truskawcu",
      sectionCars: "SAMOCHODY REIZ W TRUSKAWCU",
      sectionWelcome: "WITAMY W REIZ TRUSKAWIEC",
      subtitle:
        "Wynajem samochodu w Truskawcu bez kaucji. Dostawa do sanatoriów i hoteli kurortowych. Komfortowe pojazdy na wyjazdy w Karpaty.",
      address: "Centrum kurortu Truskawiec",
      footerDescription:
        "Twój samochód w Truskawcu. Zamów wynajem (Ekonom / Standard) z dostawą do sanatorium. REIZ zapewnia mobilność na kurorcie i proste warunki wynajmu.",
      ogTitle: "Wynajem samochodu Truskawiec i Schodnica — wakacje i długoterminowy | REIZ",
      ogDescription:
        "Wynajmij samochód w Truskawcu. Idealny do odwiedzania źródeł mineralnych. SUV-y na drogi Schodnicy. Zniżki na wynajem 2+ tygodni.",
    },
    ro: {
      title: "Închiriere auto Truskaveț și Shidnița: Închiriere vacanță | Termen lung",
      metaDescription:
        "Închiriere auto în Truskaveț. Ideal pentru vizitarea izvoarelor minerale. SUV-uri disponibile. Reduceri pentru închirieri 2+ săptămâni.",
      h1: "Închiriere auto în Truskaveț",
      sectionCars: "MAȘINI REIZ ÎN TRUSKAVEȚ",
      sectionWelcome: "BINE AȚI VENIT LA REIZ TRUSKAVEȚ",
      subtitle:
        "Închiriere auto în Truskaveț fără garanție. Livrare la sanatorii și hoteluri. Vehicule confortabile pentru excursii în Carpați.",
      address: "Centrul stațiunii Truskaveț",
      ogTitle: "Închiriere auto Truskaveț și Shidnița: Închiriere vacanță | Termen lung",
      ogDescription:
        "Închiriere auto în Truskaveț. Ideal pentru vizitarea izvoarelor minerale. SUV-uri disponibile. Reduceri pentru închirieri 2+ săptămâni.",
      footerDescription:
        "Mașina dvs. în Truskaveț. Rezervați închiriere (Economy / Standard) cu livrare la sanatoriu. REIZ asigură mobilitate și condiții simple de închiriere.",
    },
  },
  "ivano-frankivsk": {
    uk: {
      title: "Оренда авто в Івано-Франківську без застави",
      metaDescription:
        "Оренда та прокат авто в Івано-Франківську від REIZ: седани, SUV і 4x4 для поїздок містом та в Карпати. Подача за адресою або до вокзалу.",
      h1: "Оренда авто в Івано-Франківську від REIZ",
      sectionCars: "АВТОМОБІЛІ REIZ В ІВАНО-ФРАНКІВСЬКУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ІВАНО-ФРАНКІВСЬК",
      subtitle:
        "Прокат авто в Івано-Франківську без застави. Подача в аеропорт IFO та виїзд до Карпат. Позашляховики та седани 24/7.",
      address: "Міжнародний аеропорт «Івано-Франківськ» (IFO)",
      footerDescription:
        "Автопрокат в Івано-Франківську. Зручний старт для подорожі в Карпати. В наявності Економ та джипи 4x4. REIZ організує подачу авто до аеропорту або вокзалу в будь-який час.",
      ogTitle: "Оренда авто в Івано-Франківську без застави | REIZ",
      ogDescription:
        "Оренда та прокат авто в Івано-Франківську від REIZ: седани, SUV і 4x4 для поїздок містом та в Карпати. Подача за адресою або до вокзалу.",
    },
    ru: {
      title: "Аренда авто в Ивано-Франковске без залога",
      metaDescription:
        "Аренда и прокат авто в Ивано-Франковске от REIZ: седаны, SUV и 4x4 для поездок по городу и в Карпаты. Подача по адресу или к вокзалу.",
      h1: "Аренда авто в Ивано-Франковске",
      sectionCars: "АВТОМОБИЛИ REIZ В ИВАНО-ФРАНКОВСКЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ИВАНО-ФРАНКОВСК",
      subtitle:
        "Прокат авто в Ивано-Франковске без залога. Подача в аэропорт IFO и выезд в Карпаты. Внедорожники и седаны 24/7.",
      address: "Международный аэропорт «Ивано-Франковск» (IFO)",
      footerDescription:
        "Автопрокат в Ивано-Франковске. Удобный старт для путешествия в Карпаты. В наличии Эконом и джипы 4x4. REIZ организует подачу авто к аэропорту или вокзалу в любое время.",
      ogTitle: "Аренда авто в Ивано-Франковске без залога | REIZ",
      ogDescription:
        "Аренда и прокат авто в Ивано-Франковске от REIZ: седаны, SUV и 4x4 для поездок по городу и в Карпаты. Подача по адресу или к вокзалу.",
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
      address: "Ivano-Frankivsk International Airport (IFO)",
      footerDescription:
        "Car rental in Ivano-Frankivsk. Convenient start for a trip to the Carpathians. Economy and 4x4 jeeps available. REIZ organizes car delivery to the airport or station at any time.",
      ogTitle: "Car Rental Ivano-Frankivsk — REIZ | No Deposit, Carpathian Access",
      ogDescription:
        "Rent a car in Ivano-Frankivsk. No deposit. Airport delivery and Carpathian trips. New fleet.",
    },
    pl: {
      title: "Wynajem samochodu w Iwano-Frankiwsku — bez kaucji, dostęp do Karpat",
      metaDescription:
        "Wynajmij samochód w Iwano-Frankiwsku oficjalnie. Dostawa na lotnisko i wyjazdy w Karpaty 24/7. Nowa flota. SUV-y i sedany. Zarezerwuj!",
      h1: "Wynajem samochodu w Iwano-Frankiwsku",
      sectionCars: "SAMOCHODY REIZ W IWANO-FRANKIWSKU",
      sectionWelcome: "WITAMY W REIZ IWANO-FRANKIWSK",
      subtitle:
        "Wynajem samochodu w Iwano-Frankiwsku bez kaucji. Dostawa na lotnisko IFO i wyjazdy w Karpaty. SUV-y i sedany dostępne 24/7.",
      address: "Międzynarodowy port lotniczy Iwano-Frankiwsk (IFO)",
      footerDescription:
        "Wynajem samochodów w Iwano-Frankiwsku. Wygodny start podróży w Karpaty. Dostępne Ekonom i jeepy 4x4. REIZ organizuje dostawę samochodu na lotnisko lub dworzec o dowolnej porze.",
      ogTitle: "Wynajem samochodu Iwano-Frankiwsk — REIZ | Bez kaucji, dostęp do Karpat",
      ogDescription:
        "Wynajmij samochód w Iwano-Frankiwsku. Bez kaucji. Dostawa na lotnisko i wyjazdy w Karpaty. Nowa flota.",
    },
    ro: {
      title: "Închiriere auto în Ivano-Frankivsk — fără garanție, acces în Carpați",
      metaDescription:
        "Închiriere auto în Ivano-Frankivsk oficial. Livrare la aeroport și excursii în Carpați 24/7. Flotă nouă. SUV-uri și sedan-uri. Rezervați!",
      h1: "Închiriere auto în Ivano-Frankivsk",
      sectionCars: "MAȘINI REIZ ÎN IVANO-FRANKIVSK",
      sectionWelcome: "BINE AȚI VENIT LA REIZ IVANO-FRANKIVSK",
      subtitle:
        "Închiriere auto în Ivano-Frankivsk fără garanție. Livrare la aeroportul IFO și excursii în Carpați. SUV-uri și sedan-uri 24/7.",
      address: "Aeroportul Internațional Ivano-Frankivsk (IFO)",
      ogTitle: "Închiriere auto Ivano-Frankivsk — REIZ | Fără garanție, acces în Carpați",
      ogDescription:
        "Închiriere auto în Ivano-Frankivsk. Fără garanție. Livrare la aeroport și excursii în Carpați. Flotă nouă.",
      footerDescription:
        "Închiriere auto în Ivano-Frankivsk. Start convenabil pentru o excursie în Carpați. Economy și jeep-uri 4x4 disponibile. REIZ organizează livrare la aeroport sau gară.",
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
      address: "Центр курорту Східниця",
      footerDescription:
        "Оренда авто з доставкою в Східницю. Відпочивайте вільно з машинами від REIZ (Економ, Кросовери). Привеземо автомобіль за вашою адресою. Швидке оформлення на місці.",
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
      address: "Центр курорта Сходница",
      footerDescription:
        "Аренда авто с доставкой в Сходницу. Отдыхайте свободно с машинами от REIZ (Эконом, Кроссоверы). Привезем автомобиль по вашему адресу. Быстрое оформление на месте.",
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
      address: "Skhidnytsia Resort Center",
      footerDescription:
        "Car rental with delivery to Skhidnytsia. Relax freely with cars from REIZ (Economy, Crossovers). We will bring the car to your address. Fast processing on the spot.",
      ogTitle: "Car Rental Skhidnytsia — REIZ | No Deposit, Resort Delivery 24/7",
      ogDescription:
        "Rent a car in Skhidnytsia. No deposit. Delivery to spa resort. Carpathian trips. New fleet.",
    },
    pl: {
      title: "Wynajem samochodu Schodnica — bez kaucji, kurort uzdrowiskowy",
      metaDescription:
        "Wynajmij samochód w Schodnicy oficjalnie. Dostawa do kurortu uzdrowiskowego i wyjazdy w Karpaty 24/7. Nowa flota. Komfortowy wypoczynek. Zarezerwuj!",
      h1: "Wynajem samochodu w Schodnicy",
      sectionCars: "SAMOCHODY REIZ W SCHODNICY",
      sectionWelcome: "WITAMY W REIZ SCHODNICA",
      subtitle:
        "Wynajem samochodu w Schodnicy bez kaucji. Dostawa na kurort i wyjazdy w Karpaty. Transfery ze Lwowa i Drohobycza.",
      address: "Centrum kurortu Schodnica",
      footerDescription:
        "Wynajem samochodu z dostawą do Schodnicy. Wypoczywaj swobodnie z samochodami od REIZ (Ekonom, Crossovery). Przywiesiemy samochód pod Twój adres. Szybkie formalności na miejscu.",
      ogTitle: "Wynajem samochodu Schodnica — REIZ | Bez kaucji, dostawa na kurort 24/7",
      ogDescription:
        "Wynajmij samochód w Schodnicy. Bez kaucji. Dostawa na kurort uzdrowiskowy. Wyjazdy w Karpaty. Nowa flota.",
    },
    ro: {
      title: "Închiriere auto Shidnița — fără garanție, stațiune balneară",
      metaDescription:
        "Închiriere auto în Shidnița oficial. Livrare la stațiune și excursii în Carpați 24/7. Flotă nouă. Vacanță confortabilă. Rezervați!",
      h1: "Închiriere auto în Shidnița",
      sectionCars: "MAȘINI REIZ ÎN SHIDNIȚA",
      sectionWelcome: "BINE AȚI VENIT LA REIZ SHIDNIȚA",
      subtitle:
        "Închiriere auto în Shidnița fără garanție. Livrare la stațiune și excursii în Carpați. Transferuri din Lviv și Drogobici.",
      address: "Centrul stațiunii Shidnița",
      ogTitle: "Închiriere auto Shidnița — REIZ | Fără garanție, livrare la stațiune 24/7",
      ogDescription:
        "Închiriere auto în Shidnița. Fără garanție. Livrare la stațiune. Excursii în Carpați. Flotă nouă.",
      footerDescription:
        "Închiriere auto cu livrare în Shidnița. Relaxați-vă liber cu mașinile REIZ (Economy, Crossovere). Aducem mașina la adresa dvs. Procesare rapidă pe loc.",
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
      address: "Центр міста Ужгород",
      footerDescription:
        "Прокат машин в Ужгороді. Європейський сервіс та нові авто класів Економ і Бізнес. REIZ пропонує подачу по місту та вигідні умови для подорожей Закарпаттям.",
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
      address: "Центр города Ужгород",
      footerDescription:
        "Прокат машин в Ужгороде. Европейский сервис и новые авто классов Эконом и Бизнес. REIZ предлагает подачу по городу и выгодные условия для путешествий по Закарпатью.",
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
      address: "Uzhhorod City Center",
      footerDescription:
        "Car rental in Uzhhorod. European service and new Economy and Business class cars. REIZ offers city delivery and favorable conditions for traveling around Transcarpathia.",
      ogTitle: "Car Rental Uzhhorod & Mukachevo: Cross-Border to EU",
      ogDescription:
        "Rent a car in Uzhhorod. 🌍 Cross-border rentals allowed (EU). 🏔️ Perfect start for Carpathians. ⚡ Green Card included options.",
    },
    pl: {
      title: "Wynajem samochodu Użhorod i Mukaczewo — wyjazd za granicę UE",
      metaDescription:
        "Wynajmij samochód w Użhorodzie. Wynajem transgraniczny dozwolony (UE). Idealny start w Karpaty. Opcje z Zieloną Kartą.",
      h1: "Wynajem samochodu w Użhorodzie",
      sectionCars: "SAMOCHODY REIZ W UŻHORODZIE",
      sectionWelcome: "WITAMY W REIZ UŻHOROD",
      subtitle:
        "Wynajem samochodu w Użhorodzie — nowa flota, szybkie formalności i wygodny dostęp do granicy z UE.",
      address: "Centrum miasta Użhorod",
      footerDescription:
        "Wynajem samochodów w Użhorodzie. Europejski serwis i nowe samochody klasy Ekonom i Biznes. REIZ oferuje dostawę po mieście i korzystne warunki podróży po Zakarpaciu.",
      ogTitle: "Wynajem samochodu Użhorod i Mukaczewo — wyjazd za granicę UE | REIZ",
      ogDescription:
        "Wynajmij samochód w Użhorodzie. Wynajem transgraniczny dozwolony (UE). Idealny start w Karpaty. Opcje z Zieloną Kartą.",
    },
    ro: {
      title: "Închiriere auto Ujhorod și Mukacevo: Ieșire în UE",
      metaDescription:
        "Închiriere auto în Ujhorod. Închiriere transfrontalieră permisă (UE). Start perfect pentru Carpați. Opțiuni Carte Verde.",
      h1: "Închiriere auto în Ujhorod",
      sectionCars: "MAȘINI REIZ ÎN UJHOROD",
      sectionWelcome: "BINE AȚI VENIT LA REIZ UJHOROD",
      subtitle:
        "Închiriere auto în Ujhorod — flotă nouă, formalități rapide și acces convenabil la granița UE.",
      address: "Centrul orașului Ujhorod",
      ogTitle: "Închiriere auto Ujhorod și Mukacevo: Ieșire în UE",
      ogDescription:
        "Închiriere auto în Ujhorod. Închiriere transfrontalieră permisă (UE). Start perfect pentru Carpați. Opțiuni Carte Verde.",
      footerDescription:
        "Închiriere auto în Ujhorod. Serviciu european și mașini noi Economy și Business. REIZ oferă livrare în oraș și condiții favorabile pentru călătorii în Transcarpația.",
    },
  },
  vinnytsia: {
    uk: {
      title: "Оренда та прокат авто у Вінниці без застави",
      metaDescription:
        "Оренда та прокат авто у Вінниці від REIZ: Економ, Комфорт, SUV і бізнес-клас. Подача за адресою або до вокзалу, зрозумілі умови оренди.",
      h1: "Оренда авто у Вінниці",
      sectionCars: "АВТОМОБІЛІ REIZ У ВІННИЦІ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ВІННИЦЯ",
      subtitle:
        "Оренда авто у Вінниці — ідеальний варіант для ділових поїздок та комфортних подорожей по центру України.",
      address: "Центр міста Вінниця",
      footerDescription:
        "Послуги оренди авто у Вінниці. Великий парк машин REIZ: від Економу до SUV. Зустрінемо біля фонтану, на вокзалі або подамо авто під дім. Комфорт та чистота гарантовані.",
      ogTitle: "Оренда та прокат авто у Вінниці без застави | REIZ",
      ogDescription:
        "Оренда та прокат авто у Вінниці від REIZ: Економ, Комфорт, SUV і бізнес-клас. Подача за адресою або до вокзалу, зрозумілі умови оренди.",
    },
    ru: {
      title: "Аренда и прокат авто в Виннице без залога",
      metaDescription:
        "Аренда и прокат авто в Виннице от REIZ: Эконом, Комфорт, SUV и бизнес-класс. Подача по адресу или к вокзалу, прозрачные условия аренды.",
      h1: "Аренда авто в Виннице",
      sectionCars: "АВТОМОБИЛИ REIZ В ВИННИЦЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ВИННИЦА",
      subtitle:
        "Аренда авто в Виннице — идеальный вариант для деловых поездок и комфортных путешествий по центру Украины.",
      address: "Центр города Винница",
      footerDescription:
        "Услуги аренды авто в Виннице. Большой парк машин REIZ: от Эконома до SUV. Встретим у фонтана, на вокзале или подадим авто под дом. Комфорт и чистота гарантированы.",
      ogTitle: "Аренда и прокат авто в Виннице без залога | REIZ",
      ogDescription:
        "Аренда и прокат авто в Виннице от REIZ: Эконом, Комфорт, SUV и бизнес-класс. Подача по адресу или к вокзалу, прозрачные условия аренды.",
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
      address: "Vinnytsia City Center",
      footerDescription:
        "Car rental services in Vinnytsia. Large REIZ fleet: from Economy to SUV. We will meet you near the fountain, at the station, or deliver the car to your home. Comfort and cleanliness guaranteed.",
      ogTitle: "Car Rental Vinnytsia — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Vinnytsia. No deposit. New fleet. Free city delivery. Fast pickup 24/7.",
    },
    pl: {
      title: "Wynajem samochodu w Winnicy — bez kaucji, nowa flota",
      metaDescription:
        "Wynajmij samochód w Winnicy na podróże służbowe. Nowa flota. Bezpłatna dostawa po mieście 24/7. Zarezerwuj self-drive!",
      h1: "Wynajem samochodu w Winnicy",
      sectionCars: "SAMOCHODY REIZ W WINNICY",
      sectionWelcome: "WITAMY W REIZ WINNICA",
      subtitle:
        "Wynajem samochodu w Winnicy — idealny na podróże służbowe i komfortowe podróże po centralnej Ukrainie.",
      address: "Centrum miasta Winnica",
      footerDescription:
        "Usługi wynajmu samochodów w Winnicy. Duży park REIZ: od Ekonomu do SUV. Spotkamy przy fontannie, na dworcu lub dostarczymy auto pod dom. Komfort i czystość gwarantowane.",
      ogTitle: "Wynajem samochodu Winnica — REIZ | Bez kaucji",
      ogDescription:
        "Wynajmij samochód w Winnicy. Bez kaucji. Nowe samochody. Bezpłatna dostawa. Szybkie formalności 24/7.",
    },
    ro: {
      title: "Închiriere auto în Vinnița — fără garanție, flotă nouă",
      metaDescription:
        "Închiriere auto în Vinnița pentru călătorii de afaceri. Flotă nouă. Livrare gratuită în oraș 24/7. Rezervați acum!",
      h1: "Închiriere auto în Vinnița",
      sectionCars: "MAȘINI REIZ ÎN VINNIȚA",
      sectionWelcome: "BINE AȚI VENIT LA REIZ VINNIȚA",
      subtitle:
        "Închiriere auto în Vinnița — ideal pentru călătorii de afaceri și deplasări confortabile în Ucraina centrală.",
      address: "Centrul orașului Vinnița",
      ogTitle: "Închiriere auto Vinnița — REIZ | Fără garanție",
      ogDescription:
        "Închiriere auto în Vinnița. Fără garanție. Flotă nouă. Livrare gratuită. Preluare rapidă 24/7.",
      footerDescription:
        "Servicii de închiriere auto în Vinnița. Flotă mare REIZ: de la Economy la SUV. Vă întâmpinăm la fântână, la gară sau livrăm mașina acasă. Confort garantat.",
    },
  },
  zaporizhzhia: {
    uk: {
      title: "Оренда та прокат авто у Запоріжжі без застави",
      metaDescription:
        "Оренда та прокат авто у Запоріжжі від REIZ: Економ і Комфорт-клас для поїздок містом. Подача за адресою, деталі підтвердить менеджер.",
      h1: "Оренда авто у Запоріжжі від REIZ",
      sectionCars: "АВТОПАРК REIZ У ЗАПОРІЖЖІ: ВІД КОМФОРТУ ДО ПРЕМІУМ-КЛАСУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЗАПОРІЖЖЯ",
      subtitle:
        "Оренда авто у Запоріжжі — надійні нові автомобілі, офіційне оформлення та швидка подача по місту.",
      footerDescription:
        "Оренда авто в Запоріжжі від REIZ. Потрібна машина на кілька днів? Пропонуємо Економ та Комфорт класи з доставкою. Прозорий договір і відсутність ліміту пробігу (опціонально).",
      address: "Міжнародний аеропорт «Запоріжжя» (OZH)",
      ogTitle: "Оренда та прокат авто у Запоріжжі без застави | REIZ",
      ogDescription:
        "Оренда та прокат авто у Запоріжжі від REIZ: Економ і Комфорт-клас для поїздок містом. Подача за адресою, деталі підтвердить менеджер.",
    },
    ru: {
      title: "Аренда и прокат авто в Запорожье без залога",
      metaDescription:
        "Аренда и прокат авто в Запорожье от REIZ: Эконом и Комфорт-класс для поездок по городу. Подача по адресу, детали подтвердит менеджер.",
      h1: "Аренда авто в Запорожье",
      sectionCars: "АВТОПАРК REIZ В ЗАПОРОЖЬЕ: ОТ КОМФОРТА ДО ПРЕМИУМ-КЛАССА",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЗАПОРОЖЬЕ",
      subtitle:
        "Аренда авто в Запорожье — надежные новые автомобили, официальное оформление и быстрая подача по городу.",
      footerDescription:
        "Аренда авто в Запорожье от REIZ. Нужна машина на несколько дней? Предлагаем Эконом и Комфорт классы с доставкой. Прозрачный договор и отсутствие лимита пробега (опционально).",
      address: "Международный аэропорт «Запорожье» (OZH)",
      ogTitle: "Аренда и прокат авто в Запорожье без залога | REIZ",
      ogDescription:
        "Аренда и прокат авто в Запорожье от REIZ: Эконом и Комфорт-класс для поездок по городу. Подача по адресу, детали подтвердит менеджер.",
    },
    en: {
      title: "Car Rental Zaporizhzhia — No Deposit, Delivery 24/7",
      metaDescription:
        "Rent a car in Zaporizhzhia officially. New fleet. Free city delivery 24/7. Fast pickup. Book your self-drive!",
      h1: "Car Rental in Zaporizhzhia",
      sectionCars: "REIZ FLEET IN ZAPORIZHZHIA: FROM COMFORT TO PREMIUM CLASS",
      sectionWelcome: "WELCOME TO REIZ ZAPORIZHZHIA",
      subtitle:
        "Car rental in Zaporizhzhia — reliable new vehicles, official paperwork, and fast city-wide delivery.",
      footerDescription:
        "Car rental in Zaporizhzhia by REIZ. Need a car for a few days? We offer Economy and Comfort classes with delivery. Transparent contract and no mileage limit (optional).",
      address: "Zaporizhzhia International Airport (OZH)",
      ogTitle: "Car Rental Zaporizhzhia — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Zaporizhzhia. No deposit. New fleet. Free city delivery. Fast pickup 24/7.",
    },
    pl: {
      title: "Wynajem samochodu w Zaporożu bez kaucji — dostawa 24/7",
      metaDescription:
        "Wynajem samochodu w Zaporożu oficjalnie. Dostawa na dworzec i po mieście 24/7. Nowe samochody. Szybkie formalności. Zarezerwuj!",
      h1: "Wynajem samochodu w Zaporożu",
      sectionCars: "FLOTA REIZ W ZAPOROŻU: OD KOMFORTU DO KLASY PREMIUM",
      sectionWelcome: "WITAMY W REIZ ZAPOROŻE",
      subtitle:
        "Wynajem samochodu w Zaporożu bez kaucji. Dostawa na dworzec, lotnisko OZH lub pod wskazany adres 24/7.",
      footerDescription:
        "Wynajem samochodów w Zaporożu od REIZ. Samochody klasy Ekonom i SUV z dostawą po mieście. Szybkie formalności i pełne ubezpieczenie.",
      address: "Dworzec kolejowy Zaporoże-1",
      ogTitle: "Wynajem samochodu w Zaporożu bez kaucji — dostawa 24/7",
      ogDescription:
        "Wynajem samochodu w Zaporożu oficjalnie. Dostawa na dworzec i po mieście 24/7. Nowe samochody. Szybkie formalności. Zarezerwuj!",
    },
    ro: {
      title: "Închiriere auto în Zaporijjia fără garanție — livrare 24/7",
      metaDescription:
        "Închiriere auto în Zaporijjia oficial. Flotă nouă. Livrare gratuită în oraș 24/7. Formalități rapide. Rezervați!",
      h1: "Închiriere auto în Zaporijjia",
      sectionCars: "FLOTA REIZ ÎN ZAPORIJJIA: DE LA CONFORT LA CLASA PREMIUM",
      sectionWelcome: "BINE AȚI VENIT LA REIZ ZAPORIJJIA",
      subtitle:
        "Închiriere auto în Zaporijjia — vehicule noi fiabile, documente oficiale și livrare rapidă în oraș.",
      address: "Aeroportul Internațional Zaporijjia (OZH)",
      ogTitle: "Închiriere auto în Zaporijjia fără garanție — livrare 24/7 | REIZ",
      ogDescription:
        "Închiriere auto în Zaporijjia oficial. Flotă nouă. Livrare gratuită în oraș 24/7. Formalități rapide. Rezervați!",
      footerDescription:
        "Închiriere auto în Zaporijjia de la REIZ. Clase Economy și Confort cu livrare. Contract transparent și fără limită de kilometraj (opțional).",
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
      address: "Центр міста Мукачево",
      footerDescription:
        "Прокат автомобілів у Мукачеві. Досліджуйте замки Закарпаття на авто REIZ (Економ / SUV). Оперативна подача до вокзалу. Надійні машини для ваших подорожей.",
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
      address: "Центр города Мукачево",
      footerDescription:
        "Прокат автомобилей в Мукачево. Исследуйте замки Закарпатья на авто REIZ (Эконом / SUV). Оперативная подача к вокзалу. Надежные машины для ваших путешествий.",
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
      address: "Mukachevo City Center",
      footerDescription:
        "Car rental in Mukachevo. Explore Transcarpathian castles in a REIZ car (Economy / SUV). Prompt delivery to the station. Reliable cars for your travels.",
      ogTitle: "Car Rental Mukachevo — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Mukachevo. No deposit. Easy Carpathian and border access. Free city delivery 24/7.",
    },
    pl: {
      title: "Wynajem samochodu w Mukaczewie — Karpaty i granica z UE",
      metaDescription:
        "Wynajem samochodu w Mukaczewie. Wygodny wyjazd do Karpat i na granicę z UE. Nowe samochody. Dostawa po mieście 24/7. Zarezerwuj!",
      h1: "Wynajem samochodu w Mukaczewie",
      sectionCars: "SAMOCHODY REIZ W MUKACZEWIE",
      sectionWelcome: "WITAMY W REIZ MUKACZEWO",
      subtitle:
        "Wynajem samochodu w Mukaczewie bez kaucji. SUV-y i sedany na podróże po Zakarpaciu i za granicę.",
      address: "Centrum miasta Mukaczewo",
      footerDescription:
        "Wynajem samochodów w Mukaczewie. Szeroki wybór aut od Ekonomu do SUV. REIZ zapewnia dostawę po mieście i do zamku Palanok.",
      ogTitle: "Wynajem samochodu Mukaczewo — Karpaty i granica z UE | REIZ",
      ogDescription:
        "Wynajem samochodu w Mukaczewie. Wygodny wyjazd do Karpat i na granicę z UE. Nowe samochody. Dostawa po mieście 24/7.",
    },
    ro: {
      title: "Închiriere auto în Mukacevo — fără garanție, excursii în Carpați",
      metaDescription:
        "Închiriere auto în Mukacevo. Trecere ușoară a graniței și acces în Carpați. Flotă nouă. Livrare gratuită 24/7. Rezervați!",
      h1: "Închiriere auto în Mukacevo",
      sectionCars: "MAȘINI REIZ ÎN MUKACEVO",
      sectionWelcome: "BINE AȚI VENIT LA REIZ MUKACEVO",
      subtitle:
        "Închiriere auto în Mukacevo — vehicule noi pentru aventuri în Transcarpația, trecere ușoară a graniței.",
      address: "Centrul orașului Mukacevo",
      ogTitle: "Închiriere auto Mukacevo — REIZ | Fără garanție",
      ogDescription:
        "Închiriere auto în Mukacevo. Fără garanție. Acces ușor în Carpați și la graniță. Livrare 24/7.",
      footerDescription:
        "Închiriere auto în Mukacevo. Explorați castelele Transcarpatiei cu mașini REIZ (Economy / SUV). Livrare rapidă la gară.",
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
      address: "Центр міста Полтава",
      footerDescription:
        "Автопрокат у Полтаві. Сучасні автомобілі REIZ (Економ, Стандарт) для ваших потреб. Замовляйте подачу на Київський або Південний вокзал. Зручно, швидко, надійно.",
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
      address: "Центр города Полтава",
      footerDescription:
        "Автопрокат в Полтаве. Современные автомобили REIZ (Эконом, Стандарт) для ваших нужд. Заказывайте подачу на Киевский или Южный вокзал. Удобно, быстро, надежно.",
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
      address: "Poltava City Center",
      footerDescription:
        "Car rental in Poltava. Modern REIZ cars (Economy, Standard) for your needs. Order delivery to Kyivskyi or Pivdennyi railway stations. Convenient, fast, reliable.",
      ogTitle: "Car Rental Poltava — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Poltava. No deposit. New fleet. Free city delivery. Fast pickup 24/7.",
    },
    pl: {
      title: "Wynajem samochodu w Połtawie bez kaucji — szybki odbiór",
      metaDescription:
        "Wynajem samochodu w Połtawie oficjalnie. Dostawa na dworzec i po mieście 24/7. Nowe samochody. Szybkie formalności. Zarezerwuj!",
      h1: "Wynajem samochodu w Połtawie",
      sectionCars: "SAMOCHODY REIZ W POŁTAWIE",
      sectionWelcome: "WITAMY W REIZ POŁTAWA",
      subtitle:
        "Wynajem samochodu w Połtawie bez kaucji. Dostawa na dworzec lub pod wskazany adres 24/7. Klasa ekonom i biznes.",
      address: "Centrum miasta Połtawa",
      footerDescription:
        "Wynajem samochodów w Połtawie od REIZ. Samochody Ekonom i Biznes z dostawą po mieście. Pomoc drogowa 24/7.",
      ogTitle: "Wynajem samochodu Połtawa — REIZ | Bez kaucji, szybki odbiór",
      ogDescription:
        "Wynajem samochodu w Połtawie. Bez kaucji. Nowa flota. Szybkie formalności 24/7.",
    },
    ro: {
      title: "Închiriere auto în Poltava — fără garanție, flotă nouă",
      metaDescription:
        "Închiriere auto în Poltava pentru călătorii de afaceri. Flotă nouă. Livrare gratuită în oraș 24/7. Rezervați!",
      h1: "Închiriere auto în Poltava",
      sectionCars: "MAȘINI REIZ ÎN POLTAVA",
      sectionWelcome: "BINE AȚI VENIT LA REIZ POLTAVA",
      subtitle:
        "Închiriere auto în Poltava — călătorii confortabile de afaceri și deplasări prin Ucraina centrală cu vehicule noi.",
      address: "Centrul orașului Poltava",
      ogTitle: "Închiriere auto Poltava — REIZ | Fără garanție",
      ogDescription:
        "Închiriere auto în Poltava. Fără garanție. Flotă nouă. Livrare gratuită. Preluare rapidă 24/7.",
      footerDescription:
        "Închiriere auto în Poltava. Mașini moderne REIZ (Economy, Standard). Comandați livrare la gară. Convenabil, rapid, fiabil.",
    },
  },
  chernivtsi: {
    uk: {
      title: "Оренда та прокат авто у Чернівцях без застави",
      metaDescription:
        "Оренда та прокат авто у Чернівцях від REIZ: Економ, Комфорт і SUV. Подача за адресою, до готелю або вокзалу; умови погоджує менеджер.",
      h1: "Оренда авто у Чернівцях",
      sectionCars: "АВТОМОБІЛІ REIZ У ЧЕРНІВЦЯХ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЧЕРНІВЦІ",
      subtitle:
        "Оренда авто у Чернівцях — нові авто для подорожей Буковиною, зручний виїзд до кордону та в Карпати.",
      address: "Центр міста Чернівці",
      footerDescription:
        "Оренда авто в Чернівцях. Відкрийте для себе місто на машинах REIZ (Економ / Джипи). Персональна доставка до університету, готелю чи вокзалу. Сервіс високого рівня.",
      ogTitle: "Оренда та прокат авто у Чернівцях без застави | REIZ",
      ogDescription:
        "Оренда та прокат авто у Чернівцях від REIZ: Економ, Комфорт і SUV. Подача за адресою, до готелю або вокзалу; умови погоджує менеджер.",
    },
    ru: {
      title: "Аренда и прокат авто в Черновцах без залога",
      metaDescription:
        "Аренда и прокат авто в Черновцах от REIZ: Эконом, Комфорт и SUV. Подача по адресу, к отелю или вокзалу; условия согласует менеджер.",
      h1: "Аренда авто в Черновцах",
      sectionCars: "АВТОМОБИЛИ REIZ В ЧЕРНОВЦАХ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЧЕРНОВЦЫ",
      subtitle:
        "Аренда авто в Черновцах — новые авто для путешествий по Буковине, удобный выезд к границе и в Карпаты.",
      address: "Центр города Черновцы",
      footerDescription:
        "Аренда авто в Черновцах. Откройте для себя город на машинах REIZ (Эконом / Джипы). Персональная доставка к университету, отелю или вокзалу. Сервис высокого уровня.",
      ogTitle: "Аренда и прокат авто в Черновцах без залога | REIZ",
      ogDescription:
        "Аренда и прокат авто в Черновцах от REIZ: Эконом, Комфорт и SUV. Подача по адресу, к отелю или вокзалу; условия согласует менеджер.",
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
      address: "Chernivtsi City Center",
      footerDescription:
        "Car rental in Chernivtsi. Discover the city in REIZ cars (Economy / Jeeps). Personal delivery to the university, hotel, or station. High-level service.",
      ogTitle: "Car Rental Chernivtsi — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car in Chernivtsi. No deposit. Easy border access to Romania and Moldova. Free delivery 24/7.",
    },
    pl: {
      title: "Wynajem samochodu w Czerniowcach bez kaucji — Karpaty i granica",
      metaDescription:
        "Wynajem samochodu w Czerniowcach oficjalnie. Nowe samochody. Dostawa na dworzec i po mieście 24/7. Wyjazd za granicę. Zarezerwuj!",
      h1: "Wynajem samochodu w Czerniowcach",
      sectionCars: "SAMOCHODY REIZ W CZERNIOWCACH",
      sectionWelcome: "WITAMY W REIZ CZERNIOWCE",
      subtitle:
        "Wynajem samochodu w Czerniowcach bez kaucji. Dostawa na dworzec lub pod wskazany adres 24/7. Wyjazd do Karpat i Rumunii.",
      address: "Centrum miasta Czerniowce",
      footerDescription:
        "Wynajem samochodów w Czerniowcach od REIZ. Od klasy Ekonom do SUV. Dostarczymy samochód na dworzec lub pod hotel. Przejrzyste warunki.",
      ogTitle: "Wynajem samochodu Czerniowce — REIZ | Bez kaucji, wyjazd za granicę",
      ogDescription:
        "Wynajem samochodu w Czerniowcach. Bez kaucji. Nowe samochody. Dostawa 24/7. Wyjazd do Karpat i Rumunii.",
    },
    ro: {
      title: "Închiriere auto în Cernăuți — fără garanție, acces la graniță",
      metaDescription:
        "Închiriere auto în Cernăuți. Trecere ușoară la granița cu România și Moldova. Flotă nouă. Livrare gratuită 24/7. Rezervați!",
      h1: "Închiriere auto în Cernăuți",
      sectionCars: "MAȘINI REIZ ÎN CERNĂUȚI",
      sectionWelcome: "BINE AȚI VENIT LA REIZ CERNĂUȚI",
      subtitle:
        "Închiriere auto în Cernăuți — vehicule noi pentru aventuri în Bucovina, trecere ușoară a graniței cu România.",
      address: "Centrul orașului Cernăuți",
      ogTitle: "Închiriere auto Cernăuți — REIZ | Fără garanție, acces la graniță",
      ogDescription:
        "Închiriere auto în Cernăuți. Fără garanție. Acces ușor la granița cu România și Moldova. Livrare 24/7.",
      footerDescription:
        "Închiriere auto în Cernăuți. Descoperiți orașul cu mașini REIZ (Economy / Jeep). Livrare personală la universitate, hotel sau gară. Servicii de nivel înalt.",
    },
  },
  boryspil: {
    uk: {
      title: "Оренда авто в аеропорту Бориспіль (KBP) — зустріч з рейсу 24/7",
      metaDescription:
        "Прокат авто в Борисполі від REIZ. Зустріч з рейсу в аеропорту KBP 24/7, нові автомобілі 2023–2025. Без застави, швидке оформлення. Трансфер до Києва та по Україні.",
      h1: "Оренда авто в аеропорту Бориспіль від REIZ",
      sectionCars: "АВТОПАРК REIZ У БОРИСПОЛІ: ВІД КОМФОРТУ ДО ПРЕМІУМ-КЛАСУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ БОРИСПІЛЬ",
      subtitle:
        "Оренда авто в Борисполі — зустріч в аеропорту, швидке оформлення та комфортний трансфер на нових автомобілях.",
      address: "Бориспіль: Персональна подача (Аеропорт KBP / Готелі / Київ)",
      footerDescription:
        "Оренда авто в аеропорту Бориспіль (KBP). REIZ зустріне вас з машиною (Економ / Бізнес / SUV) одразу після прильоту. Швидкий старт вашої поїздки без очікування таксі.",
      ogTitle: "Оренда авто в аеропорту Бориспіль (KBP) — зустріч з рейсу 24/7 | REIZ",
      ogDescription:
        "Прокат авто в Борисполі від REIZ. Зустріч з рейсу в аеропорту KBP 24/7, нові автомобілі 2023–2025. Без застави, швидке оформлення. Трансфер до Києва.",
    },
    ru: {
      title: "Аренда авто в Борисполе без залога — Аэропорт 24/7",
      metaDescription:
        "Прокат авто в Борисполе с подачей в аэропорт. Встреча с рейса 24/7. Новые машины. Быстрое оформление. Без залога!",
      h1: "Аренда авто в Борисполе",
      sectionCars: "АВТОПАРК REIZ В БОРИСПОЛЕ: ОТ КОМФОРТА ДО ПРЕМИУМ-КЛАССА",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ БОРИСПОЛЬ",
      subtitle:
        "Аренда авто в Борисполе — встреча в аэропорту, быстрое оформление и комфортный трансфер на новых автомобилях.",
      address: "Борисполь: Персональная подача (Аэропорт KBP / Отели / Киев)",
      footerDescription:
        "Аренда авто в аэропорту Борисполь (KBP). REIZ встретит вас с машиной (Эконом / Бизнес / SUV) сразу после прилета. Быстрый старт вашей поездки без ожидания такси.",
      ogTitle: "Аренда авто Борисполь аэропорт — REIZ | Без залога",
      ogDescription:
        "Прокат авто в Борисполе. Без залога. Встреча с рейса в аэропорту. Новые авто 24/7. Быстрая выдача.",
    },
    en: {
      title: "Car Rental Boryspil Airport — No Deposit, 24/7 Pickup",
      metaDescription:
        "Rent a car at Boryspil Airport. Flight meet and greet 24/7. New fleet. Fast paperwork. No deposit. Book your self-drive!",
      h1: "Car Rental in Boryspil",
      sectionCars: "REIZ FLEET IN BORYSPIL: FROM COMFORT TO PREMIUM CLASS",
      sectionWelcome: "WELCOME TO REIZ BORYSPIL",
      subtitle:
        "Car rental in Boryspil — airport meet and greet, fast paperwork, and comfortable transfers in new vehicles.",
      address: "Boryspil: Personal Delivery (KBP Airport / Hotels / Kyiv)",
      footerDescription:
        "Car rental at Boryspil Airport (KBP). REIZ will meet you with a car (Economy / Business / SUV) right after arrival. Quick start of your trip without waiting for a taxi.",
      ogTitle: "Car Rental Boryspil Airport — REIZ | No Deposit, Self-Drive",
      ogDescription:
        "Rent a car at Boryspil Airport. No deposit. Flight meet and greet 24/7. New fleet. Fast pickup.",
    },
    pl: {
      title: "Wynajem samochodu Boryszpol — lotnisko KBP 24/7",
      metaDescription:
        "Wynajem samochodu na lotnisku Boryszpol. Szybki odbiór przy Terminalu D i F. Nowe samochody. Pełne ubezpieczenie. Zarezerwuj!",
      h1: "Wynajem samochodu w Boryszpolu",
      sectionCars: "SAMOCHODY REIZ W BORYSZPOLU",
      sectionWelcome: "WITAMY W REIZ BORYSZPOL",
      subtitle:
        "Wynajem samochodu na lotnisku Boryszpol. Podstawienie do terminali D i F 24/7. Podróże po Kijowie i Ukrainie.",
      address: "Międzynarodowy port lotniczy Boryszpol (KBP)",
      footerDescription:
        "Wynajem samochodu na lotnisku Boryszpol od REIZ. Szybki odbiór i zdanie. Samochody Ekonom, Komfort i SUV. Transfery po Kijowie i okolicach.",
      ogTitle: "Wynajem samochodu Boryszpol — lotnisko KBP 24/7 | REIZ",
      ogDescription:
        "Wynajem samochodu na lotnisku Boryszpol. Szybki odbiór. Nowa flota. Pełne ubezpieczenie.",
    },
    ro: {
      title: "Închiriere auto la Aeroportul Boryspil — fără garanție, preluare 24/7",
      metaDescription:
        "Închiriere auto la Aeroportul Boryspil. Întâmpinare la zbor 24/7. Flotă nouă. Formalități rapide. Fără garanție. Rezervați!",
      h1: "Închiriere auto în Boryspil",
      sectionCars: "FLOTA REIZ ÎN BORYSPIL: DE LA CONFORT LA CLASA PREMIUM",
      sectionWelcome: "BINE AȚI VENIT LA REIZ BORYSPIL",
      subtitle:
        "Închiriere auto în Boryspil — întâmpinare la aeroport, formalități rapide și transferuri confortabile cu vehicule noi.",
      address: "Boryspil: Livrare personală (Aeroport KBP / Hoteluri / Kiev)",
      ogTitle: "Închiriere auto Aeroportul Boryspil — REIZ | Fără garanție",
      ogDescription:
        "Închiriere auto la Aeroportul Boryspil. Fără garanție. Întâmpinare la zbor 24/7. Flotă nouă. Preluare rapidă.",
      footerDescription:
        "Închiriere auto la Aeroportul Boryspil (KBP). REIZ vă întâmpină cu mașina (Economy / Business / SUV) imediat după aterizare. Start rapid fără așteptare taxi.",
    },
  },
  lutsk: {
    uk: {
      title: "Оренда та прокат авто у Луцьку",
      metaDescription:
        "Оренда та прокат авто у Луцьку від REIZ: Економ, Комфорт і SUV для поїздок містом та Волинню. Подача за адресою або до вокзалу.",
      h1: "Оренда авто у Луцьку",
      sectionCars: "АВТОМОБІЛІ REIZ У ЛУЦЬКУ",
      sectionWelcome: "ЛАСКАВО ПРОСИМО В REIZ ЛУЦЬК",
      subtitle:
        "Прокат авто у Луцьку без застави. Подача по місту та на вокзал 24/7. Виїзд на Шацькі озера та до кордону з Польщею.",
      footerDescription:
        "Прокат авто у Луцьку. REIZ — це вигідна оренда машин (Економ та Преміум) на Волині. Замовити авто можна з доставкою до Замку Любарта або будь-якої іншої локації.",
      ogTitle: "Оренда та прокат авто у Луцьку | REIZ",
      ogDescription:
        "Оренда та прокат авто у Луцьку від REIZ: Економ, Комфорт і SUV для поїздок містом та Волинню. Подача за адресою або до вокзалу.",
    },
    ru: {
      title: "Аренда и прокат авто в Луцке",
      metaDescription:
        "Аренда и прокат авто в Луцке от REIZ: Эконом, Комфорт и SUV для поездок по городу и Волыни. Подача по адресу или к вокзалу.",
      h1: "Аренда авто в Луцке — подача 24/7 и выезд к озёрам",
      sectionCars: "АВТОМОБИЛИ REIZ В ЛУЦКЕ",
      sectionWelcome: "ДОБРО ПОЖАЛОВАТЬ В REIZ ЛУЦК",
      subtitle:
        "Прокат авто в Луцке без залога. Подача по городу и на вокзал 24/7. Выезд на Шацкие озёра и к границе с Польшей.",
      footerDescription:
        "Прокат авто в Луцке. REIZ — это выгодная аренда машин (Эконом и Премиум) на Волыни. Заказать авто можно с доставкой к Замку Любарта или любой другой локации.",
      ogTitle: "Аренда и прокат авто в Луцке | REIZ",
      ogDescription:
        "Аренда и прокат авто в Луцке от REIZ: Эконом, Комфорт и SUV для поездок по городу и Волыни. Подача по адресу или к вокзалу.",
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
      footerDescription:
        "Car rental in Lutsk. REIZ offers profitable car rental (Economy and Premium) in Volyn. You can order a car with delivery to Lubart's Castle or any other location.",
      ogTitle: "Car Rental Lutsk — Shatsk Lakes & Border Trips | REIZ",
      ogDescription:
        "Car rental in Lutsk with no deposit. 24/7 city and station delivery. Trips to Shatsk Lakes and Poland border.",
    },
    pl: {
      title: "Wynajem samochodu w Łucku bez kaucji — szybka realizacja",
      metaDescription:
        "Wynajem samochodu w Łucku oficjalnie. Nowa flota. Bezpłatna dostawa po mieście i na dworzec 24/7. Szybkie formalności. Zarezerwuj!",
      h1: "Wynajem samochodu w Łucku",
      sectionCars: "SAMOCHODY REIZ W ŁUCKU",
      sectionWelcome: "WITAMY W REIZ ŁUCK",
      subtitle:
        "Wynajem samochodu w Łucku bez kaucji. Dostawa na dworzec lub pod wskazany adres 24/7. Klasa ekonom i biznes.",
      address: "Centrum miasta Łuck",
      footerDescription:
        "Wynajem samochodów w Łucku od REIZ. Samochody Ekonom i Biznes z dostawą po mieście. Idealne na wyjazdy nad Jeziora Szackie.",
      ogTitle: "Wynajem samochodu Łuck — REIZ | Bez kaucji",
      ogDescription:
        "Wynajem samochodu w Łucku. Bez kaucji. Nowa flota. Bezpłatna dostawa. Szybkie formalności 24/7.",
    },
    ro: {
      title: "Închiriere auto în Luțk — Lacurile Shațk și Castelul Lubart",
      metaDescription:
        "Închiriere auto în Luțk. Livrare în oraș și la gară 24/7. Excursii la Lacurile Shațk și la granița cu Polonia.",
      h1: "Închiriere auto în Luțk — livrare 24/7 și excursii la lac",
      sectionCars: "MAȘINI REIZ ÎN LUȚK",
      sectionWelcome: "BINE AȚI VENIT LA REIZ LUȚK",
      subtitle:
        "Închiriere auto în Luțk fără garanție. Livrare în oraș și la gară 24/7. Excursii la Lacurile Shațk și granița cu Polonia.",
      ogTitle: "Închiriere auto Luțk — Lacurile Shațk și granița | REIZ",
      ogDescription:
        "Închiriere auto în Luțk fără garanție. Livrare 24/7 în oraș și la gară. Excursii la Lacurile Shațk și granița cu Polonia.",
      footerDescription:
        "Închiriere auto în Luțk. REIZ oferă închiriere profitabilă (Economy și Premium) în Volyn. Comandați cu livrare la Castelul Lubart sau altă locație.",
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
      footerDescription:
        "Послуги автопрокату в Рівному. Надійні автомобілі REIZ: від економних малолітражок до потужних кросоверів. Доставим авто клієнту в межах міста. Простий процес бронювання.",
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
      footerDescription:
        "Услуги автопроката в Ровно. Надежные автомобили REIZ: от экономных малолитражек до мощных кроссоверов. Доставим авто клиенту в черте города. Простой процесс бронирования.",
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
      footerDescription:
        "Car rental services in Rivne. Reliable REIZ cars: from economical compacts to powerful crossovers. We will deliver the car to the client within the city. Simple booking process.",
      ogTitle: "Car Rental Rivne: Visit Tunnel of Love | City Car Hire",
      ogDescription:
        "Rent a car in Rivne. 💚 Trip to Tunnel of Love. 🚗 Economy and Comfort cars. ⚡ Fast delivery. Book online.",
    },
    pl: {
      title: "Wynajem samochodu w Równem bez kaucji — szybka realizacja",
      metaDescription:
        "Wynajem samochodu w Równem oficjalnie. Nowa flota. Bezpłatna dostawa po mieście 24/7. Szybkie formalności. Zarezerwuj!",
      h1: "Wynajem samochodu w Równem",
      sectionCars: "SAMOCHODY REIZ W RÓWNEM",
      sectionWelcome: "WITAMY W REIZ RÓWNE",
      subtitle:
        "Wynajem samochodu w Równem bez kaucji. Dostawa na dworzec lub pod wskazany adres 24/7.",
      address: "Centrum miasta Równe",
      footerDescription:
        "Wynajem samochodów w Równem od REIZ. Samochody klasy Ekonom i Biznes z dostawą po mieście.",
      ogTitle: "Wynajem samochodu Równe — REIZ | Bez kaucji",
      ogDescription:
        "Wynajem samochodu w Równem. Bez kaucji. Nowa flota. Szybkie formalności 24/7.",
    },
    ro: {
      title: "Închiriere auto Rivne: Tunelul Dragostei | Închiriere în oraș",
      metaDescription:
        "Închiriere auto în Rivne. Excursie la Tunelul Dragostei. Mașini Economy și Comfort. Livrare rapidă. Rezervați online.",
      h1: "Închiriere auto în Rivne — livrare 24/7 și excursii regionale",
      sectionCars: "MAȘINI REIZ ÎN RIVNE",
      sectionWelcome: "BINE AȚI VENIT LA REIZ RIVNE",
      subtitle:
        "Închiriere auto în Rivne fără garanție. Livrare 24/7 și excursii regionale la Klevan, Ostroh și Dubno.",
      ogTitle: "Închiriere auto Rivne: Tunelul Dragostei | Închiriere în oraș",
      ogDescription:
        "Închiriere auto în Rivne. Excursie la Tunelul Dragostei. Mașini Economy și Comfort. Livrare rapidă. Rezervați online.",
      footerDescription:
        "Servicii de închiriere auto în Rivne. Mașini REIZ fiabile: de la compact-uri economice la crossovere puternice. Livrăm mașina în oraș. Proces simplu de rezervare.",
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
      footerDescription:
        "Оренда машин у Хмельницькому. REIZ пропонує авто класів Економ, Комфорт та SUV. Подача за адресою або до Ж/Д вокзалу. Ваша свобода пересування за чесною ціною.",
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
      footerDescription:
        "Аренда машин в Хмельницком. REIZ предлагает авто классов Эконом, Комфорт и SUV. Подача по адресу или к Ж/Д вокзалу. Ваша свобода передвижения по честной цене.",
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
      footerDescription:
        "Car rental in Khmelnytskyi. REIZ offers Economy, Comfort, and SUV class cars. Delivery to address or Railway Station. Your freedom of movement at a fair price.",
      ogTitle: "Car Rental Khmelnytskyi — Fortress Routes | REIZ",
      ogDescription:
        "Car rental in Khmelnytskyi with no deposit. 24/7 city delivery. Trips to Kamianets-Podilskyi, Khotyn and Bakota.",
    },
    pl: {
      title: "Wynajem samochodu w Chmielnickim bez kaucji — szybka realizacja",
      metaDescription:
        "Wynajem samochodu w Chmielnickim oficjalnie. Nowa flota. Dostawa po mieście 24/7. Zarezerwuj!",
      h1: "Wynajem samochodu w Chmielnickim",
      sectionCars: "SAMOCHODY REIZ W CHMIELNICKIM",
      sectionWelcome: "WITAMY W REIZ CHMIELNICKI",
      subtitle:
        "Wynajem samochodu w Chmielnickim bez kaucji. Dostawa na dworzec lub pod wskazany adres 24/7.",
      address: "Centrum miasta Chmielnicki",
      footerDescription:
        "Wynajem samochodów w Chmielnickim od REIZ. Ekonom i Biznes z dostawą po mieście.",
      ogTitle: "Wynajem samochodu Chmielnicki — REIZ | Bez kaucji",
      ogDescription:
        "Wynajem samochodu w Chmielnickim. Bez kaucji. Nowa flota. Szybkie formalności 24/7.",
    },
    ro: {
      title: "Închiriere auto în Hmelnițki — Kameneț, Hotin, Bakota",
      metaDescription:
        "Închiriere auto în Hmelnițki. Livrare în oraș 24/7. Excursii la Kameneț-Podolsk, Hotin, Bakota și Medjiboj.",
      h1: "Închiriere auto în Hmelnițki",
      sectionCars: "MAȘINI REIZ ÎN HMELNIȚKI",
      sectionWelcome: "BINE AȚI VENIT LA REIZ HMELNIȚKI",
      subtitle:
        "Închiriere auto în Hmelnițki fără garanție. Livrare 24/7 în oraș. Excursii la Kameneț-Podolsk și Hotin.",
      ogTitle: "Închiriere auto Hmelnițki — rute la cetăți | REIZ",
      ogDescription:
        "Închiriere auto în Hmelnițki fără garanție. Livrare 24/7 în oraș. Excursii la Kameneț-Podolsk, Hotin și Bakota.",
      footerDescription:
        "Închiriere auto în Hmelnițki. REIZ oferă mașini Economy, Comfort și SUV. Livrare la adresă sau la gară. Libertatea dvs. de deplasare la un preț corect.",
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
      footerDescription:
        "Прокат авто в Кам'янці-Подільському. Подорожуйте історичними місцями на авто REIZ (Економ / Стандарт). Привеземо машину до готелю чи в центр старого міста.",
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
      footerDescription:
        "Прокат авто в Каменце-Подольском. Путешествуйте по историческим местам на авто REIZ (Эконом / Стандарт). Привезем машину к отелю или в центр старого города.",
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
      footerDescription:
        "Car rental in Kamianets-Podilskyi. Travel through historical places in a REIZ car (Economy / Standard). We will bring the car to the hotel or the old city center.",
      ogTitle: "Car Rental Kamianets‑Podilskyi — Fortress Trips | REIZ",
      ogDescription:
        "Car rental in Kamianets-Podilskyi with no deposit. Delivery to Old Town and fortress. Trips to Khotyn and Bakota.",
    },
    pl: {
      title: "Wynajem samochodu w Kamieńcu Podolskim — twierdza i atrakcje",
      metaDescription:
        "Wynajem samochodu w Kamieńcu Podolskim. Nowa flota. Dostawa po mieście. Idealne na zwiedzanie twierdzy i okolic. Zarezerwuj!",
      h1: "Wynajem samochodu w Kamieńcu Podolskim",
      sectionCars: "SAMOCHODY REIZ W KAMIEŃCU PODOLSKIM",
      sectionWelcome: "WITAMY W REIZ KAMIENIEC PODOLSKI",
      subtitle:
        "Wynajem samochodu w Kamieńcu Podolskim bez kaucji. Zwiedzanie twierdzy i okolic.",
      address: "Centrum miasta Kamieniec Podolski",
      footerDescription:
        "Wynajem samochodów w Kamieńcu Podolskim od REIZ. Idealne do zwiedzania twierdzy i okolic.",
      ogTitle: "Wynajem samochodu Kamieniec Podolski — REIZ",
      ogDescription:
        "Wynajem samochodu w Kamieńcu Podolskim. Nowa flota. Dostawa po mieście.",
    },
    ro: {
      title: "Închiriere auto în Kameneț-Podolsk — cetate, Hotin, Bakota",
      metaDescription:
        "Închiriere auto în Kameneț-Podolsk. Livrare la Orașul Vechi și cetate. Excursii la Hotin și Bakota.",
      h1: "Închiriere auto în Kameneț-Podolsk",
      sectionCars: "MAȘINI REIZ ÎN KAMENEȚ-PODOLSK",
      sectionWelcome: "BINE AȚI VENIT LA REIZ KAMENEȚ-PODOLSK",
      subtitle:
        "Închiriere auto în Kameneț-Podolsk fără garanție. Livrare la Orașul Vechi și cetate 24/7. Excursii la Hotin și Bakota.",
      ogTitle: "Închiriere auto Kameneț-Podolsk — excursii la cetate | REIZ",
      ogDescription:
        "Închiriere auto în Kameneț-Podolsk fără garanție. Livrare la Orașul Vechi și cetate. Excursii la Hotin și Bakota.",
      footerDescription:
        "Închiriere auto în Kameneț-Podolsk. Călătoriți prin locuri istorice cu mașini REIZ (Economy / Standard). Aducem mașina la hotel sau în centrul vechi.",
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
      footerDescription:
        "Автопрокат у Дрогобичі. REIZ забезпечує комфорт: автомобілі Економ та Середнього класу з доставкою. Прозорі умови, чисті салони та цілодобова підтримка.",
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
      footerDescription:
        "Автопрокат в Дрогобыче. REIZ обеспечивает комфорт: автомобили Эконом и Среднего класса с доставкой. Прозрачные условия, чистые салоны и круглосуточная поддержка.",
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
      footerDescription:
        "Car rental in Drohobych. REIZ ensures comfort: Economy and Mid-class cars with delivery. Transparent conditions, clean interiors, and 24/7 support.",
      ogTitle: "Car Rental Drohobych — Resort Trips | REIZ",
      ogDescription: "Car rental in Drohobych with no deposit. 24/7 city delivery. Trips to Truskavets, Skhidnytsia and Carpathians.",
    },
    pl: {
      title: "Wynajem samochodu w Drohobyczu — bez kaucji",
      metaDescription:
        "Wynajem samochodu w Drohobyczu oficjalnie. Nowa flota. Dostawa po mieście 24/7. Zarezerwuj!",
      h1: "Wynajem samochodu w Drohobyczu",
      sectionCars: "SAMOCHODY REIZ W DROHOBYCZU",
      sectionWelcome: "WITAMY W REIZ DROHOBYCZ",
      subtitle: "Wynajem samochodu w Drohobyczu bez kaucji. Dostawa na dworzec lub pod wskazany adres.",
      address: "Centrum miasta Drohobycz",
      footerDescription: "Wynajem samochodów w Drohobyczu od REIZ. Ekonom i Biznes z dostawą po mieście.",
      ogTitle: "Wynajem samochodu Drohobycz — REIZ | Bez kaucji",
      ogDescription: "Wynajem samochodu w Drohobyczu. Bez kaucji. Nowa flota.",
    },
    ro: {
      title: "Închiriere auto Drogobici — Truskaveț, Shidnița, Carpați",
      metaDescription:
        "Închiriere auto în Drogobici. Livrare în oraș 24/7. Ideal pentru excursii la Truskaveț, Shidnița și Carpați.",
      h1: "Închiriere auto în Drogobici",
      sectionCars: "MAȘINI REIZ ÎN DROGOBICI",
      sectionWelcome: "BINE AȚI VENIT LA REIZ DROGOBICI",
      subtitle:
        "Închiriere auto în Drogobici fără garanție. Livrare 24/7 în oraș. Perfect pentru excursii la Truskaveț și Shidnița.",
      ogTitle: "Închiriere auto Drogobici — excursii la stațiuni | REIZ",
      ogDescription:
        "Închiriere auto în Drogobici fără garanție. Livrare 24/7 în oraș. Excursii la Truskaveț, Shidnița și Carpați.",
      footerDescription:
        "Închiriere auto în Drogobici. REIZ asigură confort: mașini Economy și Medii cu livrare. Condiții transparente și suport 24/7.",
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
      footerDescription:
        "Зручна оренда авто в Стрию. Транзит чи візит у справах? Візьміть авто (Економ / SUV) у REIZ. Зустріч на вокзалі або адресна доставка машини.",
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
      footerDescription:
        "Удобная аренда авто в Стрые. Транзит или визит по делам? Возьмите авто (Эконом / SUV) в REIZ. Встреча на вокзале или адресная доставка машины.",
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
      footerDescription:
        "Convenient car rental in Stryi. Transit or business visit? Rent a car (Economy / SUV) at REIZ. Meeting at the station or address car delivery.",
      ogTitle: "Car Rental Stryi, Drohobych, Sambir: Local Service",
      ogDescription:
        "Rent a car in Stryi, Drohobych, Sambir. 🚗 Delivery to your location. ⚡ Affordable rates. 🛡️ Insurance included.",
    },
    pl: {
      title: "Wynajem samochodu w Stryju — bez kaucji",
      metaDescription: "Wynajem samochodu w Stryju oficjalnie. Nowa flota. Dostawa po mieście 24/7. Zarezerwuj!",
      h1: "Wynajem samochodu w Stryju",
      sectionCars: "SAMOCHODY REIZ W STRYJU",
      sectionWelcome: "WITAMY W REIZ STRYJ",
      subtitle: "Wynajem samochodu w Stryju bez kaucji. Dostawa na dworzec lub pod wskazany adres.",
      address: "Centrum miasta Stryj",
      footerDescription: "Wynajem samochodów w Stryju od REIZ.",
      ogTitle: "Wynajem samochodu Stryj — REIZ | Bez kaucji",
      ogDescription: "Wynajem samochodu w Stryju. Bez kaucji. Nowa flota.",
    },
    ro: {
      title: "Închiriere auto Strâi, Drogobici, Sambir: Serviciu local",
      metaDescription:
        "Închiriere auto în Strâi, Drogobici, Sambir. Livrare la locație. Tarife accesibile. Asigurare inclusă.",
      h1: "Închiriere auto în Strâi — livrare 24/7 și rute în Carpați",
      sectionCars: "MAȘINI REIZ ÎN STRÂI",
      sectionWelcome: "BINE AȚI VENIT LA REIZ STRÂI",
      subtitle:
        "Închiriere auto în Strâi fără garanție. Livrare 24/7 în oraș. Excursii la Skole, Slavske și Morșin.",
      ogTitle: "Închiriere auto Strâi, Drogobici, Sambir: Serviciu local",
      ogDescription:
        "Închiriere auto în Strâi, Drogobici, Sambir. Livrare la locație. Tarife accesibile. Asigurare inclusă.",
      footerDescription:
        "Închiriere auto convenabilă în Strâi. Tranzit sau vizită de afaceri? Închiriați o mașină (Economy / SUV) de la REIZ. Întâmpinare la gară sau livrare la adresă.",
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
      footerDescription:
        "Прокат автомобілів у Самборі. REIZ пропонує надійні машини (Економ, Стандарт) для ваших поїздок. Швидке оформлення та можливість подачі авто на потрібний час.",
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
      footerDescription:
        "Прокат автомобилей в Самборе. REIZ предлагает надежные машины (Эконом, Стандарт) для ваших поездок. Быстрое оформление и возможность подачи авто на нужное время.",
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
      footerDescription:
        "Car rental in Sambir. REIZ offers reliable cars (Economy, Standard) for your trips. Fast processing and ability to deliver the car at the required time.",
      ogTitle: "Car Rental Sambir — Border & Resort Trips | REIZ",
      ogDescription: "Car rental in Sambir with no deposit. 24/7 city delivery. Trips to Drohobych, Truskavets and Shehyni border.",
    },
    pl: {
      title: "Wynajem samochodu w Samborze — bez kaucji",
      metaDescription: "Wynajem samochodu w Samborze oficjalnie. Nowa flota. Dostawa po mieście 24/7. Zarezerwuj!",
      h1: "Wynajem samochodu w Samborze",
      sectionCars: "SAMOCHODY REIZ W SAMBORZE",
      sectionWelcome: "WITAMY W REIZ SAMBOR",
      subtitle: "Wynajem samochodu w Samborze bez kaucji. Dostawa na dworzec lub pod wskazany adres.",
      address: "Centrum miasta Sambor",
      footerDescription: "Wynajem samochodów w Samborze od REIZ.",
      ogTitle: "Wynajem samochodu Sambor — REIZ | Bez kaucji",
      ogDescription: "Wynajem samochodu w Samborze. Bez kaucji. Nowa flota.",
    },
    ro: {
      title: "Închiriere auto în Sambir — rute la graniță, Truskaveț",
      metaDescription:
        "Închiriere auto în Sambir. Livrare 24/7. Excursii la Drogobici, Truskaveț și granița Shehâni.",
      h1: "Închiriere auto în Sambir",
      sectionCars: "MAȘINI REIZ ÎN SAMBIR",
      sectionWelcome: "BINE AȚI VENIT LA REIZ SAMBIR",
      subtitle:
        "Închiriere auto în Sambir fără garanție. Livrare 24/7. Excursii la Drogobici, Truskaveț și granița Shehâni.",
      ogTitle: "Închiriere auto Sambir — graniță și stațiuni | REIZ",
      ogDescription:
        "Închiriere auto în Sambir fără garanție. Livrare 24/7 în oraș. Excursii la Drogobici, Truskaveț și granița Shehâni.",
      footerDescription:
        "Închiriere auto în Sambir. REIZ oferă mașini fiabile (Economy, Standard). Procesare rapidă și livrare la ora dorită.",
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
      footerDescription:
        "Оренда машин у Червонограді. Вигідні тарифи на класи Економ та Комфорт від REIZ. Замовляйте авто без водія з доставкою по місту. Техпідтримка 24/7.",
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
      footerDescription:
        "Аренда машин в Червонограде. Выгодные тарифы на классы Эконом и Комфорт от REIZ. Заказывайте авто без водителя с доставкой по городу. Техподдержка 24/7.",
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
      footerDescription:
        "Car rental in Chervonohrad. Favorable rates for Economy and Comfort classes from REIZ. Book a self-drive car with city delivery. 24/7 technical support.",
      ogTitle: "Car Rental Chervonohrad — Border Routes | REIZ",
      ogDescription: "Car rental in Chervonohrad with no deposit. 24/7 delivery. Trips to Lviv and Rava-Ruska.",
    },
    pl: {
      title: "Wynajem samochodu w Czerwonogrodzie — bez kaucji",
      metaDescription: "Wynajem samochodu w Czerwonogrodzie oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Czerwonogrodzie",
      sectionCars: "SAMOCHODY REIZ W CZERWONOGRODZIE",
      sectionWelcome: "WITAMY W REIZ CZERWONOGRÓD",
      subtitle: "Wynajem samochodu w Czerwonogrodzie bez kaucji.",
      address: "Centrum miasta Czerwonogród",
      footerDescription: "Wynajem samochodów w Czerwonogrodzie od REIZ.",
      ogTitle: "Wynajem samochodu Czerwonogród — REIZ",
      ogDescription: "Wynajem samochodu w Czerwonogrodzie. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto în Cervonograd — Rava-Ruska, Lviv, graniță",
      metaDescription:
        "Închiriere auto în Cervonograd. Livrare 24/7. Excursii la Lviv, Rava-Ruska și Belz.",
      h1: "Închiriere auto în Cervonograd",
      sectionCars: "MAȘINI REIZ ÎN CERVONOGRAD",
      sectionWelcome: "BINE AȚI VENIT LA REIZ CERVONOGRAD",
      subtitle:
        "Închiriere auto în Cervonograd fără garanție. Livrare 24/7. Excursii la Lviv și Rava-Ruska.",
      ogTitle: "Închiriere auto Cervonograd — rute la graniță | REIZ",
      ogDescription:
        "Închiriere auto în Cervonograd fără garanție. Livrare 24/7. Excursii la Lviv și Rava-Ruska.",
      footerDescription:
        "Închiriere auto în Cervonograd. Tarife avantajoase Economy și Comfort de la REIZ. Rezervați cu livrare în oraș. Suport tehnic 24/7.",
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
      footerDescription:
        "Прокат авто в Бориславі. Подорожуйте вільно з REIZ. В наявності моделі Економ та SUV. Організуємо подачу машини до вашого дому або готелю. Просто та надійно.",
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
      footerDescription:
        "Прокат авто в Бориславе. Путешествуйте свободно с REIZ. В наличии модели Эконом и SUV. Организуем подачу машины к вашему дому или отелю. Просто и надежно.",
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
      footerDescription:
        "Car rental in Boryslav. Travel freely with REIZ. Economy and SUV models available. We organize car delivery to your home or hotel. Simple and reliable.",
      ogTitle: "Car Rental Boryslav — Resort Trips | REIZ",
      ogDescription: "Car rental in Boryslav with no deposit. 24/7 city delivery. Trips to Truskavets and Skhidnytsia.",
    },
    pl: {
      title: "Wynajem samochodu w Borysławiu — bez kaucji",
      metaDescription: "Wynajem samochodu w Borysławiu oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Borysławiu",
      sectionCars: "SAMOCHODY REIZ W BORYSŁAWIU",
      sectionWelcome: "WITAMY W REIZ BORYSŁAW",
      subtitle: "Wynajem samochodu w Borysławiu bez kaucji.",
      address: "Centrum miasta Borysław",
      footerDescription: "Wynajem samochodów w Borysławiu od REIZ.",
      ogTitle: "Wynajem samochodu Borysław — REIZ",
      ogDescription: "Wynajem samochodu w Borysławiu. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto în Borislav — Truskaveț, Shidnița, stațiuni",
      metaDescription:
        "Închiriere auto în Borislav. Livrare 24/7. Ideal pentru excursii la Truskaveț, Shidnița și Carpați.",
      h1: "Închiriere auto în Borislav",
      sectionCars: "MAȘINI REIZ ÎN BORISLAV",
      sectionWelcome: "BINE AȚI VENIT LA REIZ BORISLAV",
      subtitle:
        "Închiriere auto în Borislav fără garanție. Livrare 24/7. Ideal pentru excursii la Truskaveț, Shidnița și Carpați.",
      ogTitle: "Închiriere auto Borislav — rute la stațiuni | REIZ",
      ogDescription:
        "Închiriere auto în Borislav fără garanție. Livrare 24/7 în oraș. Excursii la Truskaveț și Shidnița.",
      footerDescription:
        "Închiriere auto în Borislav. Călătoriți liber cu REIZ. Modele Economy și SUV disponibile. Livrare la domiciliu sau hotel. Simplu și fiabil.",
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
      footerDescription:
        "Ваш автомобіль у Жовкві. REIZ пропонує оренду (Економ / Комфорт) для туристів та місцевих жителів. Забудьте про маршрутки — замовляйте авто з персональною подачею.",
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
      footerDescription:
        "Ваш автомобиль в Жовкве. REIZ предлагает аренду (Эконом / Комфорт) для туристов и местных жителей. Забудьте о маршрутках — заказывайте авто с персональной подачей.",
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
      footerDescription:
        "Your car in Zhovkva. REIZ offers rental (Economy / Comfort) for tourists and locals. Forget about buses — book a car with personal delivery.",
      ogTitle: "Car Rental Zhovkva — Lviv Castles | REIZ",
      ogDescription: "Car rental in Zhovkva with no deposit. 24/7 delivery. Trips to Lviv, Krekhiv and Lviv region castles.",
    },
    pl: {
      title: "Wynajem samochodu w Żółkwi — bez kaucji",
      metaDescription: "Wynajem samochodu w Żółkwi oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Żółkwi",
      sectionCars: "SAMOCHODY REIZ W ŻÓŁKWI",
      sectionWelcome: "WITAMY W REIZ ŻÓŁKIEW",
      subtitle: "Wynajem samochodu w Żółkwi bez kaucji. Zwiedzanie zamku i okolic.",
      address: "Centrum miasta Żółkiew",
      footerDescription: "Wynajem samochodów w Żółkwi od REIZ.",
      ogTitle: "Wynajem samochodu Żółkiew — REIZ",
      ogDescription: "Wynajem samochodu w Żółkwi. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto în Jovkva — castele din regiunea Lviv, Krekhiv",
      metaDescription:
        "Închiriere auto în Jovkva. Livrare 24/7. Excursii la Lviv, Krekhiv, Olesko și Pidhirți.",
      h1: "Închiriere auto în Jovkva",
      sectionCars: "MAȘINI REIZ ÎN JOVKVA",
      sectionWelcome: "BINE AȚI VENIT LA REIZ JOVKVA",
      subtitle:
        "Închiriere auto în Jovkva fără garanție. Livrare 24/7. Excursii la Lviv, Krekhiv și castelele regiunii Lviv.",
      ogTitle: "Închiriere auto Jovkva — castelele Lvivului | REIZ",
      ogDescription:
        "Închiriere auto în Jovkva fără garanție. Livrare 24/7. Excursii la Lviv, Krekhiv și castelele regiunii Lviv.",
      footerDescription:
        "Mașina dvs. în Jovkva. REIZ oferă închiriere (Economy / Comfort) pentru turiști și localnici. Uitați de microbuz — rezervați cu livrare personală.",
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
      footerDescription:
        "Оренда авто для відпочинку в Яремче. Ідеальні машини для гір (SUV / Кросовери) та Економ варіанти від REIZ. Зустріч на вокзалі та доставка до готелів Карпат.",
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
      footerDescription:
        "Аренда авто для отдыха в Яремче. Идеальные машины для гор (SUV / Кроссоверы) и Эконом варианты от REIZ. Встреча на вокзале и доставка к отелям Карпат.",
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
      footerDescription:
        "Car rental for vacation in Yaremche. Ideal cars for mountains (SUV / Crossovers) and Economy options from REIZ. Meeting at the station and delivery to Carpathian hotels.",
      ogTitle: "Car Rental Yaremche — Bukovel & Hoverla | REIZ",
      ogDescription:
        "Car rental in Yaremche with no deposit. 24/7 resort delivery. Trips to Bukovel, Hoverla and Yablunytsia Pass.",
    },
    pl: {
      title: "Wynajem samochodu w Jaremczu — Karpaty",
      metaDescription: "Wynajem samochodu w Jaremczu. SUV-y na drogi górskie. Dostawa na kurort. Zarezerwuj!",
      h1: "Wynajem samochodu w Jaremczu",
      sectionCars: "SAMOCHODY REIZ W JAREMCZU",
      sectionWelcome: "WITAMY W REIZ JAREMCZE",
      subtitle: "Wynajem samochodu w Jaremczu bez kaucji. SUV-y na drogi karpackie.",
      address: "Centrum Jaremcza",
      footerDescription: "Wynajem samochodów w Jaremczu od REIZ. SUV-y i Ekonom na drogi górskie.",
      ogTitle: "Wynajem samochodu Jaremcze — REIZ | Karpaty",
      ogDescription: "Wynajem samochodu w Jaremczu. SUV-y. Dostawa na kurort.",
    },
    ro: {
      title: "Închiriere auto în Iaremce — Probiy, Bukovel, Hoverla",
      metaDescription:
        "Închiriere auto în Iaremce. Livrare 24/7. Excursii la Bukovel, Vorokhta, Hoverla și Pasul Iablunița.",
      h1: "Închiriere auto în Iaremce",
      sectionCars: "MAȘINI REIZ ÎN IAREMCE",
      sectionWelcome: "BINE AȚI VENIT LA REIZ IAREMCE",
      subtitle:
        "Închiriere auto în Iaremce de la REIZ — vehicule noi, servicii premium și livrare convenabilă în Carpați.",
      ogTitle: "Închiriere auto Iaremce — Bukovel și Hoverla | REIZ",
      ogDescription:
        "Închiriere auto în Iaremce fără garanție. Livrare 24/7 la stațiune. Excursii la Bukovel, Hoverla și Pasul Iablunița.",
      footerDescription:
        "Închiriere auto pentru vacanță în Iaremce. Mașini ideale pentru munte (SUV / Crossovere) și opțiuni Economy de la REIZ. Întâmpinare la gară și livrare la hoteluri.",
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
      footerDescription:
        "Послуги автопрокату в Коломиї. REIZ — це машини класів Економ і Стандарт з доставкою клієнту. Досліджуйте Покуття з комфортом. Чесний договір та відмінний сервіс.",
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
      footerDescription:
        "Услуги автопроката в Коломые. REIZ — это машины классов Эконом и Стандарт с доставкой клиенту. Исследуйте Покутье с комфортом. Честный договор и отличный сервис.",
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
      footerDescription:
        "Car rental services in Kolomyia. REIZ offers Economy and Standard class cars with customer delivery. Explore Pokuttya with comfort. Fair contract and excellent service.",
      ogTitle: "Car Rental Kolomyia — Kosiv & Chernivtsi | REIZ",
      ogDescription:
        "Car rental in Kolomyia with no deposit. 24/7 city delivery. Trips to Kosiv, Yaremche and Chernivtsi.",
    },
    pl: {
      title: "Wynajem samochodu w Kołomyi — bez kaucji",
      metaDescription: "Wynajem samochodu w Kołomyi oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Kołomyi",
      sectionCars: "SAMOCHODY REIZ W KOŁOMYI",
      sectionWelcome: "WITAMY W REIZ KOŁOMYJA",
      subtitle: "Wynajem samochodu w Kołomyi bez kaucji.",
      address: "Centrum miasta Kołomyja",
      footerDescription: "Wynajem samochodów w Kołomyi od REIZ.",
      ogTitle: "Wynajem samochodu Kołomyja — REIZ",
      ogDescription: "Wynajem samochodu w Kołomyi. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto în Kolomâia — Muzeul Pisanki, Kosiv, Cernăuți",
      metaDescription:
        "Închiriere auto în Kolomâia. Livrare 24/7. Excursii la Kosiv, Iaremce, Cernăuți și Verkhovâna.",
      h1: "Închiriere auto în Kolomâia",
      sectionCars: "MAȘINI REIZ ÎN KOLOMÂIA",
      sectionWelcome: "BINE AȚI VENIT LA REIZ KOLOMÂIA",
      subtitle:
        "Închiriere auto în Kolomâia fără garanție. Livrare 24/7 în oraș. Excursii la Kosiv, Iaremce și Cernăuți.",
      ogTitle: "Închiriere auto Kolomâia — Kosiv și Cernăuți | REIZ",
      ogDescription:
        "Închiriere auto în Kolomâia fără garanție. Livrare 24/7 în oraș. Excursii la Kosiv, Iaremce și Cernăuți.",
      footerDescription:
        "Servicii de închiriere auto în Kolomâia. REIZ oferă mașini Economy și Standard cu livrare. Explorați Pokuttia confortabil. Contract corect și serviciu excelent.",
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
      footerDescription:
        "Прокат автомобілів у Калуші. Потрібне авто? REIZ доставить машину (Економ / Бізнес) в будь-яку точку міста. Оренда без водія на вигідних умовах.",
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
      footerDescription:
        "Прокат автомобилей в Калуше. Нужна машина? REIZ доставит авто (Эконом / Бизнес) в любую точку города. Аренда без водителя на выгодных условиях.",
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
      footerDescription:
        "Car rental in Kalush. Need a car? REIZ will deliver a car (Economy / Business) to any point in the city. Self-drive rental on favorable terms.",
      ogTitle: "Car Rental Kalush — Ivano-Frankivsk Trips | REIZ",
      ogDescription:
        "Car rental in Kalush with no deposit. 24/7 city delivery. Routes to Ivano-Frankivsk, Halych and Dolyna.",
    },
    pl: {
      title: "Wynajem samochodu w Kałuszu — bez kaucji",
      metaDescription: "Wynajem samochodu w Kałuszu oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Kałuszu",
      sectionCars: "SAMOCHODY REIZ W KAŁUSZU",
      sectionWelcome: "WITAMY W REIZ KAŁUSZ",
      subtitle: "Wynajem samochodu w Kałuszu bez kaucji.",
      address: "Centrum miasta Kałusz",
      footerDescription: "Wynajem samochodów w Kałuszu od REIZ.",
      ogTitle: "Wynajem samochodu Kałusz — REIZ",
      ogDescription: "Wynajem samochodu w Kałuszu. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto în Kalush — Ivano-Frankivsk, Halici, Dolâna",
      metaDescription:
        "Închiriere auto în Kalush. Livrare 24/7 în oraș. Rute la Ivano-Frankivsk, Halici și Dolâna.",
      h1: "Închiriere auto în Kalush",
      sectionCars: "MAȘINI REIZ ÎN KALUSH",
      sectionWelcome: "BINE AȚI VENIT LA REIZ KALUSH",
      subtitle:
        "Închiriere auto în Kalush fără garanție. Livrare 24/7 în oraș. Rute la Ivano-Frankivsk, Halici și Dolâna.",
      ogTitle: "Închiriere auto Kalush — excursii la Ivano-Frankivsk | REIZ",
      ogDescription:
        "Închiriere auto în Kalush fără garanție. Livrare 24/7 în oraș. Rute la Ivano-Frankivsk, Halici și Dolâna.",
      footerDescription:
        "Închiriere auto în Kalush. Aveți nevoie de mașină? REIZ livrează (Economy / Business) în orice punct al orașului. Închiriere fără șofer în condiții avantajoase.",
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
      footerDescription:
        "Оренда машин у Надвірній. REIZ пропонує надійний транспорт (Економ, SUV) для поїздок в гори та містом. Оперативна подача та цілодобова підтримка клієнтів.",
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
      footerDescription:
        "Аренда машин в Надворной. REIZ предлагает надежный транспорт (Эконом, SUV) для поездок в горы и по городу. Оперативная подача и круглосуточная поддержка клиентов.",
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
      footerDescription:
        "Car rental in Nadvirna. REIZ offers reliable transport (Economy, SUV) for trips to the mountains and around the city. Prompt delivery and 24/7 customer support.",
      ogTitle: "Car Rental Nadvirna — REIZ | Carpathians 24/7",
      ogDescription:
        "Rent a car in Nadvirna. No deposit. City delivery. Trips to Bukovel.",
    },
    pl: {
      title: "Wynajem samochodu w Nadwórnej — bez kaucji",
      metaDescription: "Wynajem samochodu w Nadwórnej oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Nadwórnej",
      sectionCars: "SAMOCHODY REIZ W NADWÓRNEJ",
      sectionWelcome: "WITAMY W REIZ NADWÓRNA",
      subtitle: "Wynajem samochodu w Nadwórnej bez kaucji.",
      address: "Centrum miasta Nadwórna",
      footerDescription: "Wynajem samochodów w Nadwórnej od REIZ.",
      ogTitle: "Wynajem samochodu Nadwórna — REIZ",
      ogDescription: "Wynajem samochodu w Nadwórnej. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto în Nadvorna — fără garanție, Carpați 24/7",
      metaDescription:
        "Închiriere auto în Nadvorna oficial. Flotă nouă. Livrare în oraș 24/7. Excursii la Bukovel, Iaremce și Vorokhta. Rezervați online!",
      h1: "Închiriere auto în Nadvorna",
      sectionCars: "MAȘINI REIZ ÎN NADVORNA",
      sectionWelcome: "BINE AȚI VENIT LA REIZ NADVORNA",
      subtitle:
        "Închiriere auto în Nadvorna de la REIZ — vehicule noi, servicii premium și livrare convenabilă pe rute carpatice.",
      ogTitle: "Închiriere auto Nadvorna — REIZ | Carpați 24/7",
      ogDescription:
        "Închiriere auto în Nadvorna. Fără garanție. Livrare în oraș. Excursii la Bukovel.",
      footerDescription:
        "Închiriere auto în Nadvorna. REIZ oferă transport fiabil (Economy, SUV) pentru excursii la munte și în oraș. Livrare promptă și suport 24/7.",
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
      footerDescription:
        "Автопрокат у Косові від REIZ. Подорожуйте Гуцульщиною на комфортних авто (Економ / Кросовери). Доставимо машину до вашого місця перебування. Нові моделі.",
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
      footerDescription:
        "Автопрокат в Косове от REIZ. Путешествуйте по Гуцульщине на комфортных авто (Эконом / Кроссоверы). Доставим машину к вашему местоположению. Новые модели.",
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
      footerDescription:
        "Car rental in Kosiv by REIZ. Travel around Hutsulshchyna in comfortable cars (Economy / Crossovers). We will deliver the car to your location. New models.",
      ogTitle: "Car Rental Kosiv — REIZ | Carpathian Trips",
      ogDescription:
        "Rent a car in Kosiv. Mountain-ready cars and SUVs. Delivery within the city and region.",
    },
    pl: {
      title: "Wynajem samochodu w Kosowie — bez kaucji",
      metaDescription: "Wynajem samochodu w Kosowie oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Kosowie",
      sectionCars: "SAMOCHODY REIZ W KOSOWIE",
      sectionWelcome: "WITAMY W REIZ KOSÓW",
      subtitle: "Wynajem samochodu w Kosowie bez kaucji.",
      address: "Centrum miasta Kosów",
      footerDescription: "Wynajem samochodów w Kosowie od REIZ.",
      ogTitle: "Wynajem samochodu Kosów — REIZ",
      ogDescription: "Wynajem samochodu w Kosowie. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto Kosiv — mașini pentru munte | REIZ",
      metaDescription:
        "Închiriere auto în Kosiv. SUV-uri fiabile pentru excursii la Sheshori, Iavoriv, Verkhovâna. Fără garanție. Livrare la hotel 24/7. Rezervați online!",
      h1: "Închiriere auto în Kosiv — livrare 24/7 și rute huțule",
      sectionCars: "MAȘINI REIZ ÎN KOSIV",
      sectionWelcome: "BINE AȚI VENIT LA REIZ KOSIV",
      subtitle:
        "Închiriere auto în Kosiv de la REIZ — vehicule noi, servicii premium și livrare convenabilă pe rute huțule.",
      ogTitle: "Închiriere auto Kosiv — REIZ | Excursii în Carpați",
      ogDescription:
        "Închiriere auto în Kosiv. Mașini pentru munte și SUV-uri. Livrare în oraș și regiune.",
      footerDescription:
        "Închiriere auto în Kosiv de la REIZ. Călătoriți prin Huțulșcina cu mașini confortabile (Economy / Crossovere). Livrare la locația dvs. Modele noi.",
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
      footerDescription:
        "Сервіс оренди авто в Чорткові. REIZ надає машини класів Економ та Комфорт. Замовляйте подачу за адресою і насолоджуйтесь свободою руху. Без прихованих платежів.",
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
      footerDescription:
        "Сервис аренды авто в Чорткове. REIZ предоставляет машины классов Эконом и Комфорт. Заказывайте подачу по адресу и наслаждайтесь свободой движения. Без скрытых платежей.",
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
      footerDescription:
        "Car rental service in Chortkiv. REIZ provides Economy and Comfort class cars. Order delivery to address and enjoy freedom of movement. No hidden fees.",
      ogTitle: "Car Rental Chortkiv, Kremenets, Berehove, Khust",
      ogDescription:
        "Rent a car in Chortkiv, Kremenets, Berehove, Khust. 🏰 Explore castles and thermal baths. 🚗 Convenient service. Book now.",
    },
    pl: {
      title: "Wynajem samochodu w Czortkowie — bez kaucji",
      metaDescription: "Wynajem samochodu w Czortkowie oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Czortkowie",
      sectionCars: "SAMOCHODY REIZ W CZORTKOWIE",
      sectionWelcome: "WITAMY W REIZ CZORTKÓW",
      subtitle: "Wynajem samochodu w Czortkowie bez kaucji.",
      address: "Centrum miasta Czortków",
      footerDescription: "Wynajem samochodów w Czortkowie od REIZ.",
      ogTitle: "Wynajem samochodu Czortków — REIZ",
      ogDescription: "Wynajem samochodu w Czortkowie. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto Ciortkov, Kremeneț, Berehove, Hust",
      metaDescription:
        "Închiriere auto în Ciortkov, Kremeneț, Berehove, Hust. Explorați castele și băi termale. Serviciu convenabil. Rezervați acum.",
      h1: "Închiriere auto în Ciortkov",
      sectionCars: "MAȘINI REIZ ÎN CIORTKOV",
      sectionWelcome: "BINE AȚI VENIT LA REIZ CIORTKOV",
      subtitle:
        "Închiriere auto în Ciortkov de la REIZ — vehicule noi, servicii premium și livrare convenabilă pe rute podoliene.",
      ogTitle: "Închiriere auto Ciortkov, Kremeneț, Berehove, Hust",
      ogDescription:
        "Închiriere auto în Ciortkov, Kremeneț, Berehove, Hust. Explorați castele și băi termale. Serviciu convenabil. Rezervați acum.",
      footerDescription:
        "Serviciu de închiriere auto în Ciortkov. REIZ oferă mașini Economy și Comfort. Comandați livrare la adresă și bucurați-vă de libertatea de mișcare. Fără taxe ascunse.",
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
      footerDescription:
        "Прокат авто в Кременці. Огляньте святині та гори на автомобілі від REIZ. Доступні класи Економ і Стандарт. Швидка подача машини та зручне повернення.",
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
      footerDescription:
        "Прокат авто в Кременце. Осмотрите святыни и горы на авто от REIZ. Доступны классы Эконом и Стандарт. Быстрая подача машины и удобный возврат.",
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
      footerDescription:
        "Car rental in Kremenets. Explore shrines and mountains with REIZ car. Economy and Standard classes available. Quick delivery and easy return.",
      ogTitle: "Car Rental Kremenets — REIZ | Pochaiv Tours",
      ogDescription:
        "Rent a car in Kremenets. Best choice for visiting Pochaiv. City and hotel delivery available.",
    },
    pl: {
      title: "Wynajem samochodu w Krzemieńcu — bez kaucji",
      metaDescription: "Wynajem samochodu w Krzemieńcu oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Krzemieńcu",
      sectionCars: "SAMOCHODY REIZ W KRZEMIEŃCU",
      sectionWelcome: "WITAMY W REIZ KRZEMIENIEC",
      subtitle: "Wynajem samochodu w Krzemieńcu bez kaucji.",
      address: "Centrum miasta Krzemieniec",
      footerDescription: "Wynajem samochodów w Krzemieńcu od REIZ.",
      ogTitle: "Wynajem samochodu Krzemieniec — REIZ",
      ogDescription: "Wynajem samochodu w Krzemieńcu. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto Kremeneț — excursii la Pociaiv | REIZ",
      metaDescription:
        "Închiriere auto în Kremeneț. Mașini confortabile pentru vizitarea Lavrei Pociaiv și Castelului Dubno. Livrare la hotel. Fără garanție. Rezervați online!",
      h1: "Închiriere auto în Kremeneț",
      sectionCars: "MAȘINI REIZ ÎN KREMENEȚ",
      sectionWelcome: "BINE AȚI VENIT LA REIZ KREMENEȚ",
      subtitle:
        "Închiriere auto în Kremeneț de la REIZ — vehicule noi, servicii premium și livrare convenabilă pe rute turistice.",
      ogTitle: "Închiriere auto Kremeneț — REIZ | Excursii la Lavra",
      ogDescription:
        "Închiriere auto în Kremeneț. Alegere ideală pentru vizitarea Pociaiv. Livrare în oraș și la hotel.",
      footerDescription:
        "Închiriere auto în Kremeneț. Explorați sanctuarele și munții cu mașini REIZ. Clase Economy și Standard disponibile. Livrare rapidă și returnare ușoară.",
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
      footerDescription:
        "Прокат авто в Береговому. Термальні басейни та винороби Закарпаття — найкраще вивчати на авто від REIZ. Швидка подача, без застави.",
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
      footerDescription:
        "Прокат авто в Берегово. Термальные бассейны и виноделы Закарпатья — лучше всего изучать на авто от REIZ. Быстрая подача, без залога.",
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
      footerDescription:
        "Car rental in Berehove. Thermal pools and Zakarpattia wineries — best explored by REIZ car. Fast delivery, no deposit.",
      ogTitle: "Car Rental Berehove — REIZ | Transcarpathia Tours",
      ogDescription:
        "Rent a car in Berehove. Reliable cars for local trips, thermal spas, and vineyards.",
    },
    pl: {
      title: "Wynajem samochodu w Berehowie — baseny termalne",
      metaDescription: "Wynajem samochodu w Berehowie oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Berehowie",
      sectionCars: "SAMOCHODY REIZ W BEREHOWIE",
      sectionWelcome: "WITAMY W REIZ BEREHOWO",
      subtitle: "Wynajem samochodu w Berehowie bez kaucji. Baseny termalne i atrakcje.",
      address: "Centrum miasta Berehowo",
      footerDescription: "Wynajem samochodów w Berehowie od REIZ.",
      ogTitle: "Wynajem samochodu Berehowo — REIZ",
      ogDescription: "Wynajem samochodu w Berehowie. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto Berehove — Băi termale și vin | REIZ",
      metaDescription:
        "Închiriere auto în Berehove. Mașini cu A/C perfecte pentru apele termale Kosino și tururi vinicole. Livrare la graniță și piscine. Fără garanție. Rezervați online!",
      h1: "Închiriere auto în Berehove",
      sectionCars: "MAȘINI REIZ ÎN BEREHOVE",
      sectionWelcome: "BINE AȚI VENIT LA REIZ BEREHOVE",
      subtitle:
        "Închiriere auto în Berehove de la REIZ — vehicule noi, servicii premium și livrare convenabilă lângă stațiunile termale.",
      ogTitle: "Închiriere auto Berehove — REIZ | Excursii în Transcarpația",
      ogDescription:
        "Închiriere auto în Berehove. Mașini fiabile pentru excursii locale, băi termale și podgorii.",
      footerDescription:
        "Închiriere auto în Berehove. Piscinele termale și vinăriile Transcarpatiei — cel mai bine explorate cu mașini REIZ. Livrare rapidă, fără garanție.",
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
      footerDescription:
        "Прокат авто в Хусті. Закарпатський вузол — звідси легко дістатися Рахова, Ужгорода чи Берегового. REIZ забезпечить подачу авто та підтримку 24/7.",
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
      footerDescription:
        "Прокат авто в Хусте. Закарпатский узел — отсюда легко добраться до Рахова, Ужгорода или Берегово. REIZ обеспечит подачу авто и поддержку 24/7.",
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
      footerDescription:
        "Car rental in Khust. Zakarpattia hub — easy access to Rakhiv, Uzhhorod, or Berehove. REIZ provides car delivery and 24/7 support.",
      ogTitle: "Car Rental Khust — REIZ | Self Drive Service",
      ogDescription:
        "Car rental services in Khust. Wide selection: economy to SUVs. Fast delivery.",
    },
    pl: {
      title: "Wynajem samochodu w Chuście — bez kaucji",
      metaDescription: "Wynajem samochodu w Chuście oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Chuście",
      sectionCars: "SAMOCHODY REIZ W CHUŚCIE",
      sectionWelcome: "WITAMY W REIZ CHUST",
      subtitle: "Wynajem samochodu w Chuście bez kaucji.",
      address: "Centrum miasta Chust",
      footerDescription: "Wynajem samochodów w Chuście od REIZ.",
      ogTitle: "Wynajem samochodu Chust — REIZ",
      ogDescription: "Wynajem samochodu w Chuście. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto Hust — fără garanție. SUV-uri | REIZ",
      metaDescription:
        "Închiriere auto în Hust. Serviciu fără șofer. SUV-uri și Economy disponibile. Livrare la gară. Asigurare completă. Rezervați online!",
      h1: "Închiriere auto în Hust — Transcarpația și livrare 24/7",
      sectionCars: "MAȘINI REIZ ÎN HUST",
      sectionWelcome: "BINE AȚI VENIT LA REIZ HUST",
      subtitle:
        "Închiriere auto în Hust de la REIZ — vehicule noi, servicii premium și livrare convenabilă pe rute montane.",
      ogTitle: "Închiriere auto Hust — REIZ | Serviciu fără șofer",
      ogDescription:
        "Servicii de închiriere auto în Hust. Selecție largă: de la economy la SUV-uri. Livrare rapidă.",
      footerDescription:
        "Închiriere auto în Hust. Nod transcarpatic — acces ușor la Rahiv, Ujhorod sau Berehove. REIZ asigură livrare și suport 24/7.",
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
      footerDescription:
        "Оренда авто в Рахові. Найвища точка України поруч — тож вам потрібен надійний транспорт. REIZ пропонує позашляховики та комфортабельні авто.",
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
      footerDescription:
        "Аренда авто в Рахове. Наивысшая точка Украины рядом — вам нужен надежный транспорт. REIZ предлагает внедорожники и комфортабельные авто.",
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
      footerDescription:
        "Car rental in Rakhiv. The highest point in Ukraine is nearby — you need reliable transport. REIZ offers SUVs and comfortable cars.",
      ogTitle: "Car Rental Rakhiv — REIZ | 4x4 SUVs",
      ogDescription:
        "SUV rental in Rakhiv. Reliable cars for the highest mountains in Ukraine.",
    },
    pl: {
      title: "Wynajem samochodu w Rachowie — centrum Europy",
      metaDescription: "Wynajem samochodu w Rachowie oficjalnie. Nowa flota. Dostawa po mieście. Zarezerwuj!",
      h1: "Wynajem samochodu w Rachowie",
      sectionCars: "SAMOCHODY REIZ W RACHOWIE",
      sectionWelcome: "WITAMY W REIZ RACHÓW",
      subtitle: "Wynajem samochodu w Rachowie bez kaucji. Dostęp do szlaków górskich.",
      address: "Centrum miasta Rachów",
      footerDescription: "Wynajem samochodów w Rachowie od REIZ.",
      ogTitle: "Wynajem samochodu Rachów — REIZ",
      ogDescription: "Wynajem samochodu w Rachowie. Bez kaucji.",
    },
    ro: {
      title: "Închiriere auto Rahiv — Dragobrat și Hoverla | REIZ",
      metaDescription:
        "Închiriere auto 4x4 în Rahiv. Cele mai bune SUV-uri pentru excursii la Dragobrat și Bukovel. Anvelope de iarnă incluse. Livrare la gară. Fără garanție. Rezervați online!",
      h1: "Închiriere auto în Rahiv",
      sectionCars: "MAȘINI REIZ ÎN RAHIV",
      sectionWelcome: "BINE AȚI VENIT LA REIZ RAHIV",
      subtitle:
        "Închiriere auto în Rahiv de la REIZ — vehicule noi, servicii premium și livrare convenabilă pe rute carpatice.",
      ogTitle: "Închiriere auto Rahiv — REIZ | SUV-uri 4x4",
      ogDescription:
        "Închiriere SUV-uri în Rahiv. Mașini fiabile pentru cele mai înalte munți din Ucraina.",
      footerDescription:
        "Închiriere auto în Rahiv. Cel mai înalt punct din Ucraina este aproape — aveți nevoie de transport fiabil. REIZ oferă SUV-uri și mașini confortabile.",
    },
  },
};

// Інтерфейс для місць подачі авто
export interface PickupLocation {
  id: string;
  name: LocalizedField;
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
        pl: "Centralny dworzec kolejowy",
        ro: "Gara Centrală",
      },
      type: "railway",
    },
    {
      id: "kyiv-bus",
      name: {
        uk: "Автовокзал «Центральний»",
        ru: "Автовокзал «Центральный»",
        en: "Central Bus Station",
        pl: "Centralny dworzec autobusowy",
        ro: "Autogara Centrală",
      },
      type: "bus",
    },
    {
      id: "kyiv-boryspil",
      name: {
        uk: "Аеропорт «Бориспіль» (KBP)",
        ru: "Аэропорт «Борисполь» (KBP)",
        en: "Boryspil Airport (KBP)",
        pl: "Lotnisko Boryszpol (KBP)",
        ro: "Aeroportul Boryspil (KBP)",
      },
      type: "airport",
    },
    {
      id: "kyiv-ocean-plaza",
      name: {
        uk: "ТРЦ Ocean Plaza",
        ru: "ТРЦ Ocean Plaza",
        en: "Ocean Plaza Mall",
        pl: "Centrum handlowe Ocean Plaza",
        ro: "Centrul Comercial Ocean Plaza",
      },
      type: "mall",
    },
    {
      id: "kyiv-maidan",
      name: {
        uk: "Майдан Незалежності",
        ru: "Майдан Независимости",
        en: "Maidan Nezalezhnosti",
        pl: "Majdan Niepodległości",
        ro: "Maidan Nezalezhnosti",
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
        pl: "Główny dworzec kolejowy",
        ro: "Gara Principală",
      },
      type: "railway",
    },
    {
      id: "lviv-bus",
      name: {
        uk: "Автостанція №8 (Стрийська)",
        ru: "Автостанция №8 (Стрыйская)",
        en: "Bus Station №8 (Stryiska)",
        pl: "Dworzec autobusowy nr 8 (Stryjska)",
        ro: "Autogara nr. 8 (Stryiska)",
      },
      type: "bus",
    },
    {
      id: "lviv-airport",
      name: {
        uk: "Аеропорт «Львів» (LWO)",
        ru: "Аэропорт «Львов» (LWO)",
        en: "Lviv Airport (LWO)",
        pl: "Lotnisko Lwów (LWO)",
        ro: "Aeroportul Lviv (LWO)",
      },
      type: "airport",
    },
    {
      id: "lviv-forum",
      name: {
        uk: "ТРЦ Forum Lviv",
        ru: "ТРЦ Forum Lviv",
        en: "Forum Lviv Mall",
        pl: "Centrum handlowe Forum Lviv",
        ro: "Centrul Comercial Forum Lviv",
      },
      type: "mall",
    },
    {
      id: "lviv-rynok",
      name: {
        uk: "Площа Ринок",
        ru: "Площадь Рынок",
        en: "Rynok Square",
        pl: "Plac Rynok",
        ro: "Piața Rynok",
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
        pl: "Dworzec kolejowy Odessa-Główna",
        ro: "Gara Principală Odesa",
      },
      type: "railway",
    },
    {
      id: "odesa-bus",
      name: {
        uk: "Автовокзал «Привоз»",
        ru: "Автовокзал «Привоз»",
        en: "Pryvoz Bus Station",
        pl: "Dworzec autobusowy Prywoz",
        ro: "Autogara Pryvoz",
      },
      type: "bus",
    },
    {
      id: "odesa-airport",
      name: {
        uk: "Аеропорт «Одеса» (ODS)",
        ru: "Аэропорт «Одесса» (ODS)",
        en: "Odesa Airport (ODS)",
        pl: "Lotnisko Odessa (ODS)",
        ro: "Aeroportul Odesa (ODS)",
      },
      type: "airport",
    },
    {
      id: "odesa-fontan",
      name: {
        uk: "ТРЦ Fontan Sky Center",
        ru: "ТРЦ Fontan Sky Center",
        en: "Fontan Sky Center Mall",
        pl: "Centrum handlowe Fontan Sky Center",
        ro: "Centrul Comercial Fontan Sky Center",
      },
      type: "mall",
    },
    {
      id: "odesa-derybasivska",
      name: {
        uk: "Дерибасівська вулиця",
        ru: "Дерибасовская улица",
        en: "Derybasivska Street",
        pl: "Ulica Derybasówska",
        ro: "Strada Derybasivska",
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
        pl: "Dworzec kolejowy Dniepr-Główny",
        ro: "Gara Principală Dnipro",
      },
      type: "railway",
    },
    {
      id: "dnipro-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
        pl: "Centralny dworzec autobusowy",
        ro: "Autogara Centrală",
      },
      type: "bus",
    },
    {
      id: "dnipro-airport",
      name: {
        uk: "Аеропорт «Дніпро» (DNK)",
        ru: "Аэропорт «Днепр» (DNK)",
        en: "Dnipro Airport (DNK)",
        pl: "Lotnisko Dniepr (DNK)",
        ro: "Aeroportul Dnipro (DNK)",
      },
      type: "airport",
    },
    {
      id: "dnipro-most-city",
      name: {
        uk: "ТРЦ MOST-city",
        ru: "ТРЦ MOST-city",
        en: "MOST-city Mall",
        pl: "Centrum handlowe MOST-city",
        ro: "Centrul Comercial MOST-city",
      },
      type: "mall",
    },
    {
      id: "dnipro-european",
      name: {
        uk: "Європейська площа",
        ru: "Европейская площадь",
        en: "European Square",
        pl: "Plac Europejski",
        ro: "Piața Europeană",
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
        pl: "Dworzec kolejowy Charków-Pasażerski",
        ro: "Gara de Pasageri Harkiv",
      },
      type: "railway",
    },
    {
      id: "kharkiv-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
        pl: "Centralny dworzec autobusowy",
        ro: "Autogara Centrală",
      },
      type: "bus",
    },
    {
      id: "kharkiv-airport",
      name: {
        uk: "Міжнародний аеропорт «Харків» (HRK)",
        ru: "Международный аэропорт «Харьков» (HRK)",
        en: "Kharkiv International Airport (HRK)",
        pl: "Międzynarodowe lotnisko Charków (HRK)",
        ro: "Aeroportul Internațional Harkiv (HRK)",
      },
      type: "airport",
    },
    {
      id: "kharkiv-nikolsky",
      name: {
        uk: "ТРЦ Нікольський",
        ru: "ТРЦ Никольский",
        en: "Nikolsky Mall",
        pl: "Centrum handlowe Nikolski",
        ro: "Centrul Comercial Nikolski",
      },
      type: "mall",
    },
    {
      id: "kharkiv-svobody",
      name: {
        uk: "Площа Свободи",
        ru: "Площадь Свободы",
        en: "Freedom Square",
        pl: "Plac Wolności",
        ro: "Piața Libertății",
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
        pl: "Dworzec kolejowy Tarnopol",
        ro: "Gara Ternopil",
      },
      type: "railway",
    },
    {
      id: "ternopil-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
        pl: "Centralny dworzec autobusowy",
        ro: "Autogara Centrală",
      },
      type: "bus",
    },
    {
      id: "ternopil-podillia",
      name: {
        uk: "ТРЦ «Поділля City»",
        ru: "ТРЦ «Подолье City»",
        en: "Podillia City Mall",
        pl: "Centrum handlowe Podilla City",
        ro: "Centrul Comercial Podillia City",
      },
      type: "mall",
    },
    {
      id: "ternopil-teatralna",
      name: {
        uk: "Театральна площа",
        ru: "Театральная площадь",
        en: "Theatre Square",
        pl: "Plac Teatralny",
        ro: "Piața Teatrală",
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
        pl: "Dworzec kolejowy Użhorod",
        ro: "Gara Ujhorod",
      },
      type: "railway",
    },
    {
      id: "uzhhorod-bus",
      name: {
        uk: "Автовокзал «Ужгород»",
        ru: "Автовокзал «Ужгород»",
        en: "Uzhhorod Bus Station",
        pl: "Dworzec autobusowy Użhorod",
        ro: "Autogara Ujhorod",
      },
      type: "bus",
    },
    {
      id: "uzhhorod-dastор",
      name: {
        uk: "ТРЦ «Дастор»",
        ru: "ТРЦ «Дастор»",
        en: "Dastor Mall",
        pl: "Centrum handlowe Dastor",
        ro: "Centrul Comercial Dastor",
      },
      type: "mall",
    },
    {
      id: "uzhhorod-narodna",
      name: {
        uk: "Площа Народна",
        ru: "Народная площадь",
        en: "Narodna Square",
        pl: "Plac Narodna",
        ro: "Piața Narodna",
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
        pl: "Dworzec kolejowy Winnica",
        ro: "Gara Vinnița",
      },
      type: "railway",
    },
    {
      id: "vinnytsia-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
        pl: "Centralny dworzec autobusowy",
        ro: "Autogara Centrală",
      },
      type: "bus",
    },
    {
      id: "vinnytsia-airport",
      name: {
        uk: "Аеропорт «Вінниця» (VIN)",
        ru: "Аэропорт «Винница» (VIN)",
        en: "Vinnytsia Airport (VIN)",
        pl: "Lotnisko Winnica (VIN)",
        ro: "Aeroportul Vinnița (VIN)",
      },
      type: "airport",
    },
    {
      id: "vinnytsia-skypark",
      name: {
        uk: "ТРЦ Sky Park",
        ru: "ТРЦ Sky Park",
        en: "Sky Park Mall",
        pl: "Centrum handlowe Sky Park",
        ro: "Centrul Comercial Sky Park",
      },
      type: "mall",
    },
    {
      id: "vinnytsia-european",
      name: {
        uk: "Європейська площа",
        ru: "Европейская площадь",
        en: "European Square",
        pl: "Plac Europejski",
        ro: "Piața Europeană",
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
        pl: "Dworzec kolejowy Mukaczewo",
        ro: "Gara Mukacevo",
      },
      type: "railway",
    },
    {
      id: "mukachevo-bus",
      name: {
        uk: "Автовокзал «Мукачево»",
        ru: "Автовокзал «Мукачево»",
        en: "Mukachevo Bus Station",
        pl: "Dworzec autobusowy Mukaczewo",
        ro: "Autogara Mukacevo",
      },
      type: "bus",
    },
    {
      id: "mukachevo-karpaty",
      name: {
        uk: "ТЦ «Карпати»",
        ru: "ТЦ «Карпаты»",
        en: "Karpaty Shopping Center",
        pl: "Centrum handlowe Karpaty",
        ro: "Centrul Comercial Karpaty",
      },
      type: "mall",
    },
    {
      id: "mukachevo-kyryla",
      name: {
        uk: "Площа Кирила і Мефодія",
        ru: "Площадь Кирилла и Мефодия",
        en: "Cyril and Methodius Square",
        pl: "Plac Cyryla i Metodego",
        ro: "Piața Chiril și Metodiu",
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
        pl: "Dworzec kolejowy Czerniowce",
        ro: "Gara Cernăuți",
      },
      type: "railway",
    },
    {
      id: "chernivtsi-bus",
      name: {
        uk: "Автовокзал «Чернівці»",
        ru: "Автовокзал «Черновцы»",
        en: "Chernivtsi Bus Station",
        pl: "Dworzec autobusowy Czerniowce",
        ro: "Autogara Cernăuți",
      },
      type: "bus",
    },
    {
      id: "chernivtsi-depot",
      name: {
        uk: "ТРЦ «Депот»",
        ru: "ТРЦ «Депот»",
        en: "Depot Mall",
        pl: "Centrum handlowe Depot",
        ro: "Centrul Comercial Depot",
      },
      type: "mall",
    },
    {
      id: "chernivtsi-centralna",
      name: {
        uk: "Центральна площа",
        ru: "Центральная площадь",
        en: "Central Square",
        pl: "Plac Centralny",
        ro: "Piața Centrală",
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
        pl: "Dworzec kolejowy Połtawa-Kijowska",
        ro: "Gara Poltava-Kievska",
      },
      type: "railway",
    },
    {
      id: "poltava-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
        pl: "Centralny dworzec autobusowy",
        ro: "Autogara Centrală",
      },
      type: "bus",
    },
    {
      id: "poltava-kyiv-mall",
      name: {
        uk: "ТРЦ «Київ»",
        ru: "ТРЦ «Киев»",
        en: "Kyiv Mall",
        pl: "Centrum handlowe Kijów",
        ro: "Centrul Comercial Kiev",
      },
      type: "mall",
    },
    {
      id: "poltava-kruhly",
      name: {
        uk: "Круглий сквер",
        ru: "Круглый сквер",
        en: "Round Square",
        pl: "Skwer Okrągły",
        ro: "Scuarul Rotund",
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
        pl: "Dworzec kolejowy Zaporoże-1",
        ro: "Gara Zaporijjia-1",
      },
      type: "railway",
    },
    {
      id: "zaporizhzhia-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
        pl: "Centralny dworzec autobusowy",
        ro: "Autogara Centrală",
      },
      type: "bus",
    },
    {
      id: "zaporizhzhia-airport",
      name: {
        uk: "Аеропорт «Запоріжжя» (OZH)",
        ru: "Аэропорт «Запорожье» (OZH)",
        en: "Zaporizhzhia Airport (OZH)",
        pl: "Lotnisko Zaporoże (OZH)",
        ro: "Aeroportul Zaporijjia (OZH)",
      },
      type: "airport",
    },
    {
      id: "zaporizhzhia-city-mall",
      name: {
        uk: "ТРЦ City Mall",
        ru: "ТРЦ City Mall",
        en: "City Mall",
        pl: "Centrum handlowe City Mall",
        ro: "Centrul Comercial City Mall",
      },
      type: "mall",
    },
    {
      id: "zaporizhzhia-festyvalna",
      name: {
        uk: "Площа Фестивальна",
        ru: "Фестивальная площадь",
        en: "Festival Square",
        pl: "Plac Festiwalowy",
        ro: "Piața Festivalului",
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
        pl: "Międzynarodowe lotnisko Boryszpol (KBP)",
        ro: "Aeroportul Internațional Boryspil (KBP)",
      },
      type: "airport",
    },
    {
      id: "boryspil-terminal-d",
      name: {
        uk: "Аеропорт «Бориспіль» — Термінал D",
        ru: "Аэропорт «Борисполь» — Терминал D",
        en: "Boryspil Airport — Terminal D",
        pl: "Lotnisko Boryszpol — Terminal D",
        ro: "Aeroportul Boryspil — Terminalul D",
      },
      type: "airport",
    },
    {
      id: "boryspil-terminal-f",
      name: {
        uk: "Аеропорт «Бориспіль» — Термінал F",
        ru: "Аэропорт «Борисполь» — Терминал F",
        en: "Boryspil Airport — Terminal F",
        pl: "Lotnisko Boryszpol — Terminal F",
        ro: "Aeroportul Boryspil — Terminalul F",
      },
      type: "airport",
    },
    {
      id: "boryspil-railway",
      name: {
        uk: "Залізничний вокзал «Бориспіль»",
        ru: "Ж/д вокзал «Борисполь»",
        en: "Boryspil Railway Station",
        pl: "Dworzec kolejowy Boryszpol",
        ro: "Gara Boryspil",
      },
      type: "railway",
    },
    {
      id: "boryspil-center",
      name: {
        uk: "Центр міста Бориспіль",
        ru: "Центр города Борисполь",
        en: "Boryspil City Center",
        pl: "Centrum miasta Boryszpol",
        ro: "Centrul orașului Boryspil",
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
        pl: "Dworzec kolejowy Iwano-Frankiwsk",
        ro: "Gara Ivano-Frankivsk",
      },
      type: "railway",
    },
    {
      id: "ivano-frankivsk-bus",
      name: {
        uk: "Центральний автовокзал",
        ru: "Центральный автовокзал",
        en: "Central Bus Station",
        pl: "Centralny dworzec autobusowy",
        ro: "Autogara Centrală",
      },
      type: "bus",
    },
    {
      id: "ivano-frankivsk-airport",
      name: {
        uk: "Аеропорт «Івано-Франківськ» (IFO)",
        ru: "Аэропорт «Ивано-Франковск» (IFO)",
        en: "Ivano-Frankivsk Airport (IFO)",
        pl: "Lotnisko Iwano-Frankiwsk (IFO)",
        ro: "Aeroportul Ivano-Frankivsk (IFO)",
      },
      type: "airport",
    },
    {
      id: "ivano-frankivsk-arsen",
      name: {
        uk: "ТРЦ «Арсен»",
        ru: "ТРЦ «Арсен»",
        en: "Arsen Mall",
        pl: "Centrum handlowe Arsen",
        ro: "Centrul Comercial Arsen",
      },
      type: "mall",
    },
    {
      id: "ivano-frankivsk-viche",
      name: {
        uk: "Площа Вічевий Майдан",
        ru: "Площадь Вечевой Майдан",
        en: "Viche Maidan Square",
        pl: "Plac Wiecowy Majdan",
        ro: "Piața Viche Maidan",
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
        pl: "Ośrodek Bukowel — wejście główne",
        ro: "Stațiunea Bukovel — intrarea principală",
      },
      type: "center",
    },
    {
      id: "bukovel-lift-8",
      name: {
        uk: "Підйомник №8 (Буковель)",
        ru: "Подъемник №8 (Буковель)",
        en: "Lift №8 (Bukovel)",
        pl: "Wyciąg nr 8 (Bukowel)",
        ro: "Telescaunul nr. 8 (Bukovel)",
      },
      type: "other",
    },
    {
      id: "bukovel-yaremche",
      name: {
        uk: "Яремче — залізничний вокзал",
        ru: "Яремче — ж/д вокзал",
        en: "Yaremche Railway Station",
        pl: "Jaremcze — dworzec kolejowy",
        ro: "Gara Iaremce",
      },
      type: "railway",
    },
    {
      id: "bukovel-ivano-frankivsk-airport",
      name: {
        uk: "Аеропорт «Івано-Франківськ» (IFO)",
        ru: "Аэропорт «Ивано-Франковск» (IFO)",
        en: "Ivano-Frankivsk Airport (IFO)",
        pl: "Lotnisko Iwano-Frankiwsk (IFO)",
        ro: "Aeroportul Ivano-Frankivsk (IFO)",
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
        pl: "Dworzec kolejowy Truskawiec",
        ro: "Gara Truskaveț",
      },
      type: "railway",
    },
    {
      id: "truskavets-bus",
      name: {
        uk: "Автовокзал «Трускавець»",
        ru: "Автовокзал «Трускавец»",
        en: "Truskavets Bus Station",
        pl: "Dworzec autobusowy Truskawiec",
        ro: "Autogara Truskaveț",
      },
      type: "bus",
    },
    {
      id: "truskavets-naftusya",
      name: {
        uk: "Бювет «Нафтуся»",
        ru: "Бювет «Нафтуся»",
        en: "Naftusya Pump Room",
        pl: "Pijalnia Naftusya",
        ro: "Izvor Naftusya",
      },
      type: "center",
    },
    {
      id: "truskavets-lviv-airport",
      name: {
        uk: "Аеропорт «Львів» (LWO)",
        ru: "Аэропорт «Львов» (LWO)",
        en: "Lviv Airport (LWO)",
        pl: "Lotnisko Lwów (LWO)",
        ro: "Aeroportul Lviv (LWO)",
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
        pl: "Centrum Schodnicy",
        ro: "Centrul Shidnița",
      },
      type: "center",
    },
    {
      id: "skhidnytsia-naftusya",
      name: {
        uk: "Бювет мінеральних вод",
        ru: "Бювет минеральных вод",
        en: "Mineral Water Pump Room",
        pl: "Pijalnia wód mineralnych",
        ro: "Izvor de apă minerală",
      },
      type: "other",
    },
    {
      id: "skhidnytsia-drohobych",
      name: {
        uk: "Дрогобич — залізничний вокзал",
        ru: "Дрогобыч — ж/д вокзал",
        en: "Drohobych Railway Station",
        pl: "Drohobycz — dworzec kolejowy",
        ro: "Gara Drogobici",
      },
      type: "railway",
    },
    {
      id: "skhidnytsia-lviv-airport",
      name: {
        uk: "Аеропорт «Львів» (LWO)",
        ru: "Аэропорт «Львов» (LWO)",
        en: "Lviv Airport (LWO)",
        pl: "Lotnisko Lwów (LWO)",
        ro: "Aeroportul Lviv (LWO)",
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
        pl: "Dworzec kolejowy Łuck",
        ro: "Gara Luțk",
      },
      type: "railway",
    },
    {
      id: "lutsk-bus",
      name: {
        uk: "Автовокзал «Луцьк»",
        ru: "Автовокзал «Луцк»",
        en: "Lutsk Bus Station",
        pl: "Dworzec autobusowy Łuck",
        ro: "Autogara Luțk",
      },
      type: "bus",
    },
    {
      id: "lutsk-center",
      name: {
        uk: "Центр міста Луцьк",
        ru: "Центр города Луцк",
        en: "Lutsk City Center",
        pl: "Centrum miasta Łuck",
        ro: "Centrul orașului Luțk",
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
        pl: "Dworzec kolejowy Równe",
        ro: "Gara Rivne",
      },
      type: "railway",
    },
    {
      id: "rivne-bus",
      name: {
        uk: "Автовокзал «Рівне»",
        ru: "Автовокзал «Ровно»",
        en: "Rivne Bus Station",
        pl: "Dworzec autobusowy Równe",
        ro: "Autogara Rivne",
      },
      type: "bus",
    },
    {
      id: "rivne-center",
      name: {
        uk: "Центр міста Рівне",
        ru: "Центр города Ровно",
        en: "Rivne City Center",
        pl: "Centrum miasta Równe",
        ro: "Centrul orașului Rivne",
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
        pl: "Dworzec kolejowy Chmielnicki",
        ro: "Gara Hmelnițki",
      },
      type: "railway",
    },
    {
      id: "khmelnytskyi-bus",
      name: {
        uk: "Автовокзал «Хмельницький»",
        ru: "Автовокзал «Хмельницкий»",
        en: "Khmelnytskyi Bus Station",
        pl: "Dworzec autobusowy Chmielnicki",
        ro: "Autogara Hmelnițki",
      },
      type: "bus",
    },
    {
      id: "khmelnytskyi-center",
      name: {
        uk: "Центр міста Хмельницький",
        ru: "Центр города Хмельницкий",
        en: "Khmelnytskyi City Center",
        pl: "Centrum miasta Chmielnicki",
        ro: "Centrul orașului Hmelnițki",
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
        pl: "Twierdza Kamieniec Podolski",
        ro: "Cetatea Kameneț-Podolsk",
      },
      type: "other",
    },
    {
      id: "kamianets-old-town",
      name: {
        uk: "Старе місто Кам'янець-Подільський",
        ru: "Старый город Каменец-Подольский",
        en: "Kamianets-Podilskyi Old Town",
        pl: "Stare miasto Kamieniec Podolski",
        ro: "Orașul Vechi Kameneț-Podolsk",
      },
      type: "center",
    },
    {
      id: "kamianets-bus",
      name: {
        uk: "Автовокзал «Кам'янець-Подільський»",
        ru: "Автовокзал «Каменец-Подольский»",
        en: "Kamianets-Podilskyi Bus Station",
        pl: "Dworzec autobusowy Kamieniec Podolski",
        ro: "Autogara Kameneț-Podolsk",
      },
      type: "bus",
    },
  ],
  drohobych: [
    {
      id: "drohobych-railway",
      name: { uk: "Залізничний вокзал «Дрогобич»", ru: "Ж/д вокзал «Дрогобыч»", en: "Drohobych Railway Station", pl: "Dworzec kolejowy Drohobycz", ro: "Gara Drogobici" },
      type: "railway",
    },
    {
      id: "drohobych-center",
      name: { uk: "Центр міста Дрогобич", ru: "Центр города Дрогобыч", en: "Drohobych City Center", pl: "Centrum miasta Drohobycz", ro: "Centrul orașului Drogobici" },
      type: "center",
    },
  ],
  stryi: [
    {
      id: "stryi-railway",
      name: { uk: "Залізничний вокзал «Стрий»", ru: "Ж/д вокзал «Стрый»", en: "Stryi Railway Station", pl: "Dworzec kolejowy Stryj", ro: "Gara Strâi" },
      type: "railway",
    },
    {
      id: "stryi-center",
      name: { uk: "Центр міста Стрий", ru: "Центр города Стрый", en: "Stryi City Center", pl: "Centrum miasta Stryj", ro: "Centrul orașului Strâi" },
      type: "center",
    },
  ],
  sambir: [
    {
      id: "sambir-railway",
      name: { uk: "Залізничний вокзал «Самбір»", ru: "Ж/д вокзал «Самбор»", en: "Sambir Railway Station", pl: "Dworzec kolejowy Sambor", ro: "Gara Sambir" },
      type: "railway",
    },
    {
      id: "sambir-center",
      name: { uk: "Центр міста Самбір", ru: "Центр города Самбор", en: "Sambir City Center", pl: "Centrum miasta Sambor", ro: "Centrul orașului Sambir" },
      type: "center",
    },
  ],
  chervonohrad: [
    {
      id: "chervonohrad-center",
      name: { uk: "Центр міста Червоноград", ru: "Центр города Червоноград", en: "Chervonohrad City Center", pl: "Centrum miasta Czerwonogród", ro: "Centrul orașului Cervonograd" },
      type: "center",
    },
  ],
  boryslav: [
    {
      id: "boryslav-center",
      name: { uk: "Центр міста Борислав", ru: "Центр города Борислав", en: "Boryslav City Center", pl: "Centrum miasta Borysław", ro: "Centrul orașului Borislav" },
      type: "center",
    },
  ],
  zhovkva: [
    {
      id: "zhovkva-castle",
      name: { uk: "Жовківський замок", ru: "Жолковский замок", en: "Zhovkva Castle", pl: "Zamek w Żółkwi", ro: "Castelul Jovkva" },
      type: "other",
    },
    {
      id: "zhovkva-center",
      name: { uk: "Центр міста Жовква", ru: "Центр города Жолква", en: "Zhovkva City Center", pl: "Centrum miasta Żółkiew", ro: "Centrul orașului Jovkva" },
      type: "center",
    },
  ],
  yaremche: [
    {
      id: "yaremche-railway",
      name: { uk: "Залізнична станція «Яремче»", ru: "Ж/д станция «Яремче»", en: "Yaremche Railway Station", pl: "Stacja kolejowa Jaremcze", ro: "Gara Iaremce" },
      type: "railway",
    },
    {
      id: "yaremche-probiy",
      name: { uk: "Водоспад Пробій", ru: "Водопад Пробий", en: "Probiy Waterfall", pl: "Wodospad Probij", ro: "Cascada Probiy" },
      type: "other",
    },
    {
      id: "yaremche-center",
      name: { uk: "Центр Яремче", ru: "Центр Яремче", en: "Yaremche City Center", pl: "Centrum Jaremcza", ro: "Centrul Iaremce" },
      type: "center",
    },
  ],
  kolomyia: [
    {
      id: "kolomyia-railway",
      name: { uk: "Залізничний вокзал «Коломия»", ru: "Ж/д вокзал «Коломыя»", en: "Kolomyia Railway Station", pl: "Dworzec kolejowy Kołomyja", ro: "Gara Kolomâia" },
      type: "railway",
    },
    {
      id: "kolomyia-bus",
      name: { uk: "Автовокзал «Коломия»", ru: "Автовокзал «Коломыя»", en: "Kolomyia Bus Station", pl: "Dworzec autobusowy Kołomyja", ro: "Autogara Kolomâia" },
      type: "bus",
    },
    {
      id: "kolomyia-center",
      name: { uk: "Центр міста Коломия", ru: "Центр города Коломыя", en: "Kolomyia City Center", pl: "Centrum miasta Kołomyja", ro: "Centrul orașului Kolomâia" },
      type: "center",
    },
  ],
  kalush: [
    {
      id: "kalush-railway",
      name: { uk: "Залізничний вокзал «Калуш»", ru: "Ж/д вокзал «Калуш»", en: "Kalush Railway Station", pl: "Dworzec kolejowy Kałusz", ro: "Gara Kalush" },
      type: "railway",
    },
    {
      id: "kalush-bus",
      name: { uk: "Автовокзал «Калуш»", ru: "Автовокзал «Калуш»", en: "Kalush Bus Station", pl: "Dworzec autobusowy Kałusz", ro: "Autogara Kalush" },
      type: "bus",
    },
    {
      id: "kalush-center",
      name: { uk: "Центр міста Калуш", ru: "Центр города Калуш", en: "Kalush City Center", pl: "Centrum miasta Kałusz", ro: "Centrul orașului Kalush" },
      type: "center",
    },
  ],
  nadvirna: [
    {
      id: "nadvirna-railway",
      name: { uk: "Залізничний вокзал «Надвірна»", ru: "Ж/д вокзал «Надворная»", en: "Nadvirna Railway Station", pl: "Dworzec kolejowy Nadwórna", ro: "Gara Nadvorna" },
      type: "railway",
    },
    {
      id: "nadvirna-bus",
      name: { uk: "Автовокзал «Надвірна»", ru: "Автовокзал «Надворная»", en: "Nadvirna Bus Station", pl: "Dworzec autobusowy Nadwórna", ro: "Autogara Nadvorna" },
      type: "bus",
    },
    {
      id: "nadvirna-center",
      name: { uk: "Центр міста Надвірна", ru: "Центр города Надворная", en: "Nadvirna City Center", pl: "Centrum miasta Nadwórna", ro: "Centrul orașului Nadvorna" },
      type: "center",
    },
  ],
  kosiv: [
    {
      id: "kosiv-bus",
      name: { uk: "Автовокзал «Косів»", ru: "Автовокзал «Косов»", en: "Kosiv Bus Station", pl: "Dworzec autobusowy Kosów", ro: "Autogara Kosiv" },
      type: "bus",
    },
    {
      id: "kosiv-market",
      name: { uk: "Косівський базар", ru: "Косовский базар", en: "Kosiv Market", pl: "Bazar w Kosowie", ro: "Piața Kosiv" },
      type: "other",
    },
    {
      id: "kosiv-center",
      name: { uk: "Центр міста Косів", ru: "Центр города Косов", en: "Kosiv City Center", pl: "Centrum miasta Kosów", ro: "Centrul orașului Kosiv" },
      type: "center",
    },
  ],
  chortkiv: [
    {
      id: "chortkiv-railway",
      name: { uk: "Залізничний вокзал «Чортків»", ru: "Ж/д вокзал «Чортков»", en: "Chortkiv Railway Station", pl: "Dworzec kolejowy Czortków", ro: "Gara Ciortkov" },
      type: "railway",
    },
    {
      id: "chortkiv-bus",
      name: { uk: "Автовокзал «Чортків»", ru: "Автовокзал «Чортков»", en: "Chortkiv Bus Station", pl: "Dworzec autobusowy Czortków", ro: "Autogara Ciortkov" },
      type: "bus",
    },
    {
      id: "chortkiv-center",
      name: { uk: "Центр міста Чортків", ru: "Центр города Чортков", en: "Chortkiv City Center", pl: "Centrum miasta Czortków", ro: "Centrul orașului Ciortkov" },
      type: "center",
    },
  ],
  kremenets: [
    {
      id: "kremenets-bus",
      name: { uk: "Автовокзал «Кременець»", ru: "Автовокзал «Кременец»", en: "Kremenets Bus Station", pl: "Dworzec autobusowy Krzemieniec", ro: "Autogara Kremeneț" },
      type: "bus",
    },
    {
      id: "kremenets-castle",
      name: { uk: "Замкова гора", ru: "Замковая гора", en: "Castle Hill", pl: "Góra Zamkowa", ro: "Dealul Castelului" },
      type: "other",
    },
    {
      id: "kremenets-center",
      name: { uk: "Центр міста Кременець", ru: "Центр города Кременец", en: "Kremenets City Center", pl: "Centrum miasta Krzemieniec", ro: "Centrul orașului Kremeneț" },
      type: "center",
    },
  ],
  berehove: [
    {
      id: "berehove-railway",
      name: { uk: "Залізничний вокзал «Берегове»", ru: "Ж/д вокзал «Берегово»", en: "Berehove Railway Station", pl: "Dworzec kolejowy Berehowo", ro: "Gara Berehove" },
      type: "railway",
    },
    {
      id: "berehove-bus",
      name: { uk: "Автовокзал «Берегове»", ru: "Автовокзал «Берегово»", en: "Berehove Bus Station", pl: "Dworzec autobusowy Berehowo", ro: "Autogara Berehove" },
      type: "bus",
    },
    {
      id: "berehove-thermal",
      name: { uk: "Термальні басейни Берегове", ru: "Термальные бассейны Берегово", en: "Berehove Thermal Pools", pl: "Baseny termalne Berehowo", ro: "Piscinele termale Berehove" },
      type: "other",
    },
    {
      id: "berehove-center",
      name: { uk: "Центр міста Берегове", ru: "Центр города Берегово", en: "Berehove City Center", pl: "Centrum miasta Berehowo", ro: "Centrul orașului Berehove" },
      type: "center",
    },
  ],
  khust: [
    {
      id: "khust-railway",
      name: { uk: "Залізничний вокзал «Хуст»", ru: "Ж/д вокзал «Хуст»", en: "Khust Railway Station", pl: "Dworzec kolejowy Chust", ro: "Gara Hust" },
      type: "railway",
    },
    {
      id: "khust-bus",
      name: { uk: "Автовокзал «Хуст»", ru: "Автовокзал «Хуст»", en: "Khust Bus Station", pl: "Dworzec autobusowy Chust", ro: "Autogara Hust" },
      type: "bus",
    },
    {
      id: "khust-castle",
      name: { uk: "Хустський замок", ru: "Хустский замок", en: "Khust Castle", pl: "Zamek Chust", ro: "Castelul Hust" },
      type: "other",
    },
    {
      id: "khust-center",
      name: { uk: "Центр міста Хуст", ru: "Центр города Хуст", en: "Khust City Center", pl: "Centrum miasta Chust", ro: "Centrul orașului Hust" },
      type: "center",
    },
  ],
  rakhiv: [
    {
      id: "rakhiv-railway",
      name: { uk: "Залізничний вокзал «Рахів»", ru: "Ж/д вокзал «Рахов»", en: "Rakhiv Railway Station", pl: "Dworzec kolejowy Rachów", ro: "Gara Rahiv" },
      type: "railway",
    },
    {
      id: "rakhiv-bus",
      name: { uk: "Автовокзал «Рахів»", ru: "Автовокзал «Рахов»", en: "Rakhiv Bus Station", pl: "Dworzec autobusowy Rachów", ro: "Autogara Rahiv" },
      type: "bus",
    },
    {
      id: "rakhiv-center",
      name: { uk: "Центр міста Рахів", ru: "Центр города Рахов", en: "Rakhiv City Center", pl: "Centrum miasta Rachów", ro: "Centrul orașului Rahiv" },
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
  locale: Locale
): CityLocalizedData | undefined {
  return cityLocalizations[slug]?.[locale];
}

export function getCityFooterAddress(
  city: CityConfig,
  locale: Locale
): string {
  const cityData = cityLocalizations[city.slug]?.[locale];
  if (cityData?.address) return cityData.address;

  const cityName = city.localized[locale].name;
  const templates: LocalizedField = {
    uk: `${cityName}: Персональна подача (Аеропорти / Вокзал / Місто)`,
    ru: `${cityName}: Персональная подача (Аэропорты / Вокзал / Город)`,
    en: `${cityName}: Personal Delivery (Airports / Railway / City)`,
    pl: `${cityName}: Dostawa osobista (Lotniska / Dworzec / Miasto)`,
    ro: `${cityName}: Livrare personală (Aeroporturi / Gară / Oraș)`,
  };

  return templates[locale];
}

export function getAllCitySlugs(): string[] {
  return cities.map((city) => city.slug);
}

export function getCityPickupLocations(
  slug: string,
  locale: Locale
): { id: string; name: string; type: string }[] {
  const locations = cityPickupLocations[slug];
  if (!locations) return [];
  return locations.map((loc) => ({
    id: loc.id,
    name: loc.name[locale],
    type: loc.type,
  }));
}
