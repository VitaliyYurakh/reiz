import { cityPickupLocations, type CityConfig } from "./cities";

export type Locale = "uk" | "ru" | "en";

// ============================================
// CITY-SPECIFIC FAQ
// ============================================
export type CityFAQItem = {
  question: { uk: string; ru: string; en: string };
  answer: { uk: string; ru: string; en: string };
};

export type CityFAQSection = {
  title: { uk: string; ru: string; en: string };
  items: CityFAQItem[];
};

// ============================================
// CITY-SPECIFIC UNIQUE CONTENT
// ============================================
export type CitySpecificContent = {
  // Приклад маршруту (як модель поводиться на...)
  routeExample: {
    uk: string;
    ru: string;
    en: string;
  };
  // Популярні маршрути з міста
  routes: {
    uk: string;
    ru: string;
    en: string;
  };
  // Уїк-енд поїздка
  weekendTrip: {
    uk: string;
    ru: string;
    en: string;
  };
  // Назва аеропорту (якщо є)
  airport?: {
    code: string;
    name: {
      uk: string;
      ru: string;
      en: string;
    };
  };
  // Локальні пам'ятки для delivery секції
  localAttractions: {
    uk: string;
    ru: string;
    en: string;
  };
  // Кастомний контент для editor section (якщо є — використовується замість генерації)
  customEditorContent?: {
    uk: string;
    ru: string;
    en: string;
  };
};

export const citySpecificContent: Record<string, CitySpecificContent> = {
  kyiv: {
    routeExample: {
      uk: "як обрана модель поводиться у столичному трафіку та на трасі",
      ru: "как выбранная модель ведёт себя в столичном трафике и на трассе",
      en: "how the chosen model handles capital city traffic and highways",
    },
    routes: {
      uk: "Київ ↔ Львів, Одеса, Дніпро на зустрічі та переговори",
      ru: "Киев ↔ Львов, Одесса, Днепр на встречи и переговоры",
      en: "Kyiv ↔ Lviv, Odesa, Dnipro for meetings and negotiations",
    },
    weekendTrip: {
      uk: "уїк-енд у Карпатах — Буковель, Славське",
      ru: "уик-энд в Карпатах — Буковель, Славское",
      en: "weekend in the Carpathians — Bukovel, Slavske",
    },
    airport: {
      code: "KBP/IEV",
      name: {
        uk: "аеропорт Бориспіль (KBP) або Жуляни (IEV)",
        ru: "аэропорт Борисполь (KBP) или Жуляны (IEV)",
        en: "Boryspil Airport (KBP) or Zhuliany (IEV)",
      },
    },
    localAttractions: {
      uk: "центр, Поділ, Печерськ, Оболонь",
      ru: "центр, Подол, Печерск, Оболонь",
      en: "city center, Podil, Pechersk, Obolon",
    },
  },
  lviv: {
    routeExample: {
      uk: "як модель поводиться на бруківці Старого міста та карпатських серпантинах",
      ru: "как модель ведёт себя на брусчатке Старого города и карпатских серпантинах",
      en: "how the model handles the Old Town cobblestones and Carpathian serpentines",
    },
    routes: {
      uk: "Львів ↔ Київ, замки Львівщини, Карпати",
      ru: "Львов ↔ Киев, замки Львовщины, Карпаты",
      en: "Lviv ↔ Kyiv, castles of Lviv region, Carpathians",
    },
    weekendTrip: {
      uk: "замки Галичини — Олеський, Підгірці, Золочів",
      ru: "замки Галичины — Олесский, Подгорцы, Золочев",
      en: "castles of Galicia — Olesko, Pidhirtsi, Zolochiv",
    },
    airport: {
      code: "LWO",
      name: {
        uk: "аеропорт Львів (LWO)",
        ru: "аэропорт Львов (LWO)",
        en: "Lviv Airport (LWO)",
      },
    },
    localAttractions: {
      uk: "центр, Старе місто, вокзал, аеропорт LWO",
      ru: "центр, Старый город, вокзал, аэропорт LWO",
      en: "city center, Old Town, railway station, LWO airport",
    },
  },
  ternopil: {
    routeExample: {
      uk: "як модель поводиться на міських вулицях та трасі до сусідніх міст",
      ru: "как модель ведёт себя на городских улицах и трассе до соседних городов",
      en: "how the model handles city streets and highways to neighboring cities",
    },
    routes: {
      uk: "Тернопіль ↔ Київ, Львів, Івано-Франківськ",
      ru: "Тернополь ↔ Киев, Львов, Ивано-Франковск",
      en: "Ternopil ↔ Kyiv, Lviv, Ivano-Frankivsk",
    },
    weekendTrip: {
      uk: "поїздка до Кременця, Почаєва, Збаража",
      ru: "поездка в Кременец, Почаев, Збараж",
      en: "trip to Kremenets, Pochaiv, Zbarazh",
    },
    localAttractions: {
      uk: "центр, набережна, залізничний вокзал",
      ru: "центр, набережная, железнодорожный вокзал",
      en: "city center, embankment, railway station",
    },
  },
  odesa: {
    routeExample: {
      uk: "як модель поводиться на приморських дорогах та міському трафіку",
      ru: "как модель ведёт себя на приморских дорогах и городском трафике",
      en: "how the model handles coastal roads and city traffic",
    },
    routes: {
      uk: "Одеса ↔ Київ, Миколаїв, узбережжя Чорного моря",
      ru: "Одесса ↔ Киев, Николаев, побережье Чёрного моря",
      en: "Odesa ↔ Kyiv, Mykolaiv, Black Sea coast",
    },
    weekendTrip: {
      uk: "курорти Затока, Кароліно-Бугаз, Білгород-Дністровська фортеця",
      ru: "курорты Затока, Каролино-Бугаз, Белгород-Днестровская крепость",
      en: "Zatoka resort, Karolino-Buhaz, Bilhorod-Dnistrovskyi fortress",
    },
    airport: {
      code: "ODS",
      name: {
        uk: "аеропорт Одеса (ODS)",
        ru: "аэропорт Одесса (ODS)",
        en: "Odesa Airport (ODS)",
      },
    },
    localAttractions: {
      uk: "центр, Аркадія, Приморський бульвар, Дерибасівська",
      ru: "центр, Аркадия, Приморский бульвар, Дерибасовская",
      en: "city center, Arcadia, Prymorskyi Boulevard, Derybasivska",
    },
  },
  dnipro: {
    routeExample: {
      uk: "як модель поводиться на широких проспектах Дніпра та на трасі",
      ru: "как модель ведёт себя на широких проспектах Днепра и на трассе",
      en: "how the model handles wide Dnipro avenues and highways",
    },
    routes: {
      uk: "Дніпро ↔ Київ, Харків, Запоріжжя",
      ru: "Днепр ↔ Киев, Харьков, Запорожье",
      en: "Dnipro ↔ Kyiv, Kharkiv, Zaporizhzhia",
    },
    weekendTrip: {
      uk: "острів Хортиця, Запоріжжя, дніпровські пляжі",
      ru: "остров Хортица, Запорожье, днепровские пляжи",
      en: "Khortytsia Island, Zaporizhzhia, Dnipro beaches",
    },
    airport: {
      code: "DNK",
      name: {
        uk: "аеропорт Дніпро (DNK)",
        ru: "аэропорт Днепр (DNK)",
        en: "Dnipro Airport (DNK)",
      },
    },
    localAttractions: {
      uk: "центр, набережна, Європейська площа",
      ru: "центр, набережная, Европейская площадь",
      en: "city center, embankment, European Square",
    },
  },
  kharkiv: {
    routeExample: {
      uk: "як модель поводиться в умовах мегаполісу та на швидкісних трасах",
      ru: "как модель ведёт себя в условиях мегаполиса и на скоростных трассах",
      en: "how the model handles metropolis conditions and high-speed highways",
    },
    routes: {
      uk: "Харків ↔ Київ, Дніпро, Полтава",
      ru: "Харьков ↔ Киев, Днепр, Полтава",
      en: "Kharkiv ↔ Kyiv, Dnipro, Poltava",
    },
    weekendTrip: {
      uk: "Полтава, Краснокутськ, природні парки Харківщини",
      ru: "Полтава, Краснокутск, природные парки Харьковщины",
      en: "Poltava, Krasnokutsk, nature parks of Kharkiv region",
    },
    airport: {
      code: "HRK",
      name: {
        uk: "аеропорт Харків (HRK)",
        ru: "аэропорт Харьков (HRK)",
        en: "Kharkiv Airport (HRK)",
      },
    },
    localAttractions: {
      uk: "центр, площа Свободи, Сумська вулиця",
      ru: "центр, площадь Свободы, Сумская улица",
      en: "city center, Freedom Square, Sumska Street",
    },
  },
  bukovel: {
    routeExample: {
      uk: "як модель поводиться на гірських підйомах та серпантинах Карпат",
      ru: "как модель ведёт себя на горных подъёмах и серпантинах Карпат",
      en: "how the model handles mountain climbs and Carpathian serpentines",
    },
    routes: {
      uk: "трансфери Буковель ↔ Івано-Франківськ, Львів",
      ru: "трансферы Буковель ↔ Ивано-Франковск, Львов",
      en: "transfers Bukovel ↔ Ivano-Frankivsk, Lviv",
    },
    weekendTrip: {
      uk: "гірськолижні курорти — Славське, Драгобрат, Яремче",
      ru: "горнолыжные курорты — Славское, Драгобрат, Яремче",
      en: "ski resorts — Slavske, Dragobrat, Yaremche",
    },
    localAttractions: {
      uk: "курорт Буковель, підйомники, готельні комплекси",
      ru: "курорт Буковель, подъёмники, гостиничные комплексы",
      en: "Bukovel resort, ski lifts, hotel complexes",
    },
  },
  truskavets: {
    routeExample: {
      uk: "як модель забезпечує комфорт для санаторного відпочинку",
      ru: "как модель обеспечивает комфорт для санаторного отдыха",
      en: "how the model provides comfort for spa vacation",
    },
    routes: {
      uk: "Трускавець ↔ Львів, Дрогобич, Стрий",
      ru: "Трускавец ↔ Львов, Дрогобыч, Стрый",
      en: "Truskavets ↔ Lviv, Drohobych, Stryi",
    },
    weekendTrip: {
      uk: "цілющі джерела Карпат, Сходниця, Східниця",
      ru: "целебные источники Карпат, Сходница",
      en: "healing springs of the Carpathians, Skhidnytsia",
    },
    localAttractions: {
      uk: "центр курорту, бювети, санаторії",
      ru: "центр курорта, бюветы, санатории",
      en: "resort center, pump rooms, sanatoriums",
    },
  },
  "ivano-frankivsk": {
    routeExample: {
      uk: "як модель поводиться у передгір'ї Карпат та на міських вулицях",
      ru: "как модель ведёт себя в предгорьях Карпат и на городских улицах",
      en: "how the model handles the Carpathian foothills and city streets",
    },
    routes: {
      uk: "Івано-Франківськ ↔ Львів, Буковель, Яремче",
      ru: "Ивано-Франковск ↔ Львов, Буковель, Яремче",
      en: "Ivano-Frankivsk ↔ Lviv, Bukovel, Yaremche",
    },
    weekendTrip: {
      uk: "Карпатські гори — Буковель, Яремче, водоспад Пробій",
      ru: "Карпатские горы — Буковель, Яремче, водопад Пробой",
      en: "Carpathian Mountains — Bukovel, Yaremche, Probiy Waterfall",
    },
    airport: {
      code: "IFO",
      name: {
        uk: "аеропорт Івано-Франківськ (IFO)",
        ru: "аэропорт Ивано-Франковск (IFO)",
        en: "Ivano-Frankivsk Airport (IFO)",
      },
    },
    localAttractions: {
      uk: "центр, ратуша, вокзал, аеропорт",
      ru: "центр, ратуша, вокзал, аэропорт",
      en: "city center, town hall, railway station, airport",
    },
  },
  skhidnytsia: {
    routeExample: {
      uk: "як модель забезпечує комфорт для оздоровчого відпочинку",
      ru: "как модель обеспечивает комфорт для оздоровительного отдыха",
      en: "how the model provides comfort for wellness vacation",
    },
    routes: {
      uk: "Східниця ↔ Львів, Трускавець, Дрогобич",
      ru: "Сходница ↔ Львов, Трускавец, Дрогобыч",
      en: "Skhidnytsia ↔ Lviv, Truskavets, Drohobych",
    },
    weekendTrip: {
      uk: "оздоровчі курорти Карпат — Трускавець, Моршин, Сколе",
      ru: "оздоровительные курорты Карпат — Трускавец, Моршин, Сколе",
      en: "wellness resorts of the Carpathians — Truskavets, Morshyn, Skole",
    },
    localAttractions: {
      uk: "курортна зона, бювети мінеральних вод, санаторії",
      ru: "курортная зона, бюветы минеральных вод, санатории",
      en: "resort area, mineral water pump rooms, sanatoriums",
    },
  },
  uzhhorod: {
    routeExample: {
      uk: "як модель поводиться на прикордонних маршрутах та міських вулицях",
      ru: "как модель ведёт себя на приграничных маршрутах и городских улицах",
      en: "how the model handles border routes and city streets",
    },
    routes: {
      uk: "Ужгород ↔ Київ, Львів, Мукачево, кордони ЄС",
      ru: "Ужгород ↔ Киев, Львов, Мукачево, границы ЕС",
      en: "Uzhhorod ↔ Kyiv, Lviv, Mukachevo, EU borders",
    },
    weekendTrip: {
      uk: "замки Закарпаття — Невицький, Паланок, Середнянський",
      ru: "замки Закарпатья — Невицкий, Паланок, Середнянский",
      en: "Transcarpathian castles — Nevytske, Palanok, Serednie",
    },
    localAttractions: {
      uk: "набережна Ужа, кордон з ЄС, центр міста, Боздоський парк",
      ru: "набережная Ужа, граница с ЕС, центр города, Боздошский парк",
      en: "Uzh Embankment, EU border, city center, Bozdosh Park",
    },
  },
  vinnytsia: {
    routeExample: {
      uk: "як модель забезпечує комфорт для бізнес-поїздок центральною Україною",
      ru: "как модель обеспечивает комфорт для бизнес-поездок по центральной Украине",
      en: "how the model provides comfort for business trips in central Ukraine",
    },
    routes: {
      uk: "Вінниця ↔ Київ, Одеса, Житомир, Хмельницький",
      ru: "Винница ↔ Киев, Одесса, Житомир, Хмельницкий",
      en: "Vinnytsia ↔ Kyiv, Odesa, Zhytomyr, Khmelnytskyi",
    },
    weekendTrip: {
      uk: "Подільські Товтри, Немирів, Брацлавський каньйон",
      ru: "Подольские Товтры, Немиров, Брацлавский каньон",
      en: "Podilski Tovtry, Nemyriv, Bratslav Canyon",
    },
    localAttractions: {
      uk: "центр, фонтан Roshen, Єзуїтський монастир, вокзал",
      ru: "центр, фонтан Roshen, Иезуитский монастырь, вокзал",
      en: "city center, Roshen Fountain, Jesuit Monastery, station",
    },
  },
  zaporizhzhia: {
    routeExample: {
      uk: "як модель поводиться на автомагістралях та промислових маршрутах",
      ru: "как модель ведёт себя на автомагистралях и промышленных маршрутах",
      en: "how the model handles highways and industrial routes",
    },
    routes: {
      uk: "Запоріжжя ↔ Дніпро, Київ, Херсон, Маріуполь",
      ru: "Запорожье ↔ Днепр, Киев, Херсон, Мариуполь",
      en: "Zaporizhzhia ↔ Dnipro, Kyiv, Kherson, Mariupol",
    },
    weekendTrip: {
      uk: "острів Хортиця, Каменська Січ, Велике Будування",
      ru: "остров Хортица, Каменская Сечь, Великое Строительство",
      en: "Khortytsia Island, Kamyanska Sich, Great Construction",
    },
    localAttractions: {
      uk: "ДніпроГЕС, острів Хортиця, проспект Соборний, вокзал",
      ru: "ДнепроГЭС, остров Хортица, проспект Соборный, вокзал",
      en: "DniproHES, Khortytsia Island, Sobornyi Avenue, station",
    },
  },
  mukachevo: {
    routeExample: {
      uk: "як модель поводиться на закарпатських серпантинах і гірських дорогах",
      ru: "как модель ведёт себя на закарпатских серпантинах и горных дорогах",
      en: "how the model handles Transcarpathian serpentines and mountain roads",
    },
    routes: {
      uk: "Мукачево ↔ Ужгород, Рахів, Хуст, кордон з ЄС",
      ru: "Мукачево ↔ Ужгород, Рахов, Хуст, граница с ЕС",
      en: "Mukachevo ↔ Uzhhorod, Rakhiv, Khust, EU border",
    },
    weekendTrip: {
      uk: "замок Паланок, Синяк, озеро Синевир, Колочава",
      ru: "замок Паланок, Синяк, озеро Синевир, Колочава",
      en: "Palanok Castle, Synyak, Synevyr Lake, Kolochava",
    },
    localAttractions: {
      uk: "замок Паланок, центр міста, Ратуша, винні підвали",
      ru: "замок Паланок, центр города, Ратуша, винные подвалы",
      en: "Palanok Castle, city center, Town Hall, wine cellars",
    },
  },
  poltava: {
    routeExample: {
      uk: "як модель забезпечує комфорт на транзитних маршрутах",
      ru: "как модель обеспечивает комфорт на транзитных маршрутах",
      en: "how the model provides comfort on transit routes",
    },
    routes: {
      uk: "Полтава ↔ Київ, Харків, Дніпро, Кременчук",
      ru: "Полтава ↔ Киев, Харьков, Днепр, Кременчуг",
      en: "Poltava ↔ Kyiv, Kharkiv, Dnipro, Kremenchuk",
    },
    weekendTrip: {
      uk: "Диканька, Сорочинці, Опішня, Великі Сорочинці",
      ru: "Диканька, Сорочинцы, Опошня, Великие Сорочинцы",
      en: "Dykanka, Sorochyntsi, Opishnia, Velyki Sorochyntsi",
    },
    localAttractions: {
      uk: "Корпусний парк, Круглу площа, вокзал, центр міста",
      ru: "Корпусный парк, Круглая площадь, вокзал, центр города",
      en: "Korpusnyi Park, Round Square, station, city center",
    },
  },
  chernivtsi: {
    routeExample: {
      uk: "як модель підкорює карпатські серпантини та маршрути до кордону",
      ru: "как модель покоряет карпатские серпантины и маршруты к границе",
      en: "how the model handles Carpathian serpentines and border routes",
    },
    routes: {
      uk: "Чернівці ↔ Львів, Івано-Франківськ, Кам'янець-Подільський, кордон з Румунією",
      ru: "Черновцы ↔ Львов, Ивано-Франковск, Каменец-Подольский, граница с Румынией",
      en: "Chernivtsi ↔ Lviv, Ivano-Frankivsk, Kamianets-Podilskyi, Romania border",
    },
    weekendTrip: {
      uk: "Хотин, Кам'янець-Подільський, Вижниця, Буковинські Карпати",
      ru: "Хотин, Каменец-Подольский, Выжница, Буковинские Карпаты",
      en: "Khotyn, Kamianets-Podilskyi, Vyzhnytsia, Bukovinian Carpathians",
    },
    localAttractions: {
      uk: "Чернівецький університет, Театральна площа, вокзал, центр міста",
      ru: "Черновицкий университет, Театральная площадь, вокзал, центр города",
      en: "Chernivtsi University, Theater Square, station, city center",
    },
  },
  boryspil: {
    routeExample: {
      uk: "як модель забезпечує комфортний трансфер з аеропорту",
      ru: "как модель обеспечивает комфортный трансфер из аэропорта",
      en: "how the model provides comfortable airport transfer",
    },
    routes: {
      uk: "Бориспіль ↔ Київ, Львів, Одеса, Дніпро, Харків",
      ru: "Борисполь ↔ Киев, Львов, Одесса, Днепр, Харьков",
      en: "Boryspil ↔ Kyiv, Lviv, Odesa, Dnipro, Kharkiv",
    },
    weekendTrip: {
      uk: "Київ, Переяслав, Канів, Умань (Софіївка)",
      ru: "Киев, Переяслав, Канев, Умань (Софиевка)",
      en: "Kyiv, Pereiaslav, Kaniv, Uman (Sofiyivka)",
    },
    airport: {
      code: "KBP",
      name: {
        uk: "Міжнародний аеропорт Бориспіль",
        ru: "Международный аэропорт Борисполь",
        en: "Boryspil International Airport",
      },
    },
    localAttractions: {
      uk: "термінал D, термінал F, готелі біля аеропорту, центр Борисполя",
      ru: "терминал D, терминал F, отели возле аэропорта, центр Борисполя",
      en: "Terminal D, Terminal F, airport hotels, Boryspil center",
    },
  },
  lutsk: {
    routeExample: {
      uk: "як модель поводиться на дорогах Волині та шляху до Шацьких озер",
      ru: "как модель ведёт себя на дорогах Волыни и пути к Шацким озёрам",
      en: "how the model handles Volyn roads and the route to Shatsk Lakes",
    },
    routes: {
      uk: "Луцьк ↔ Львів, Рівне, Шацькі озера, кордон з Польщею",
      ru: "Луцк ↔ Львов, Ровно, Шацкие озёра, граница с Польшей",
      en: "Lutsk ↔ Lviv, Rivne, Shatsk Lakes, Poland border",
    },
    weekendTrip: {
      uk: "відпочинок на Шацьких озерах, Луцький замок, Володимир-Волинський",
      ru: "отдых на Шацких озёрах, Луцкий замок, Владимир-Волынский",
      en: "Shatsk Lakes getaway, Lutsk Castle, Volodymyr-Volynskyi",
    },
    localAttractions: {
      uk: "центр, Луцький замок, вокзал, автовокзал",
      ru: "центр, Луцкий замок, вокзал, автовокзал",
      en: "city center, Lutsk Castle, railway station, bus station",
    },
    customEditorContent: {
      uk: `
<div class='editor_text'>REIZ — це сучасний автопрокат у Луцьку, де головними принципами є прозорість та технічна справність авто. Ми розуміємо специфіку місцевих доріг: від бруківки в Старому місті до швидкісних трас на Рівне чи Ковель.<br/>Ми доставляємо авто до залізничного вокзалу, ТРЦ PortCity, ЦУМу або за будь-якою адресою в межах міста.</div>

<div class='editor_title'>Погодинний тариф: тест-драйв перед дорогою</div>
<div class='editor_text'>Погодинна оренда — ідеальний варіант для вирішення короткострокових справ у місті або тестування автомобіля. За одну добу ви зрозумієте характер машини: як підвіска справляється з луцькою бруківкою біля Замку Любарта, чи зручно маневрувати на парковках біля "Променя" або "Гостинця", і як працює клімат-контроль. Це найкращий спосіб переконатися, що авто вам підходить, перед тим як вирушати у далеку подорож на Світязь або до Тунелю кохання у Клевані. Ви перевіряєте місткість багажника та комфорт посадки без довгострокових зобов'язань.</div>

<div class='editor_title'>Оренда авто на тиждень у Луцьку: курс на Шацькі озера</div>
<div class='editor_text'>Тижневий прокат — найпопулярніший формат для відпочинку на Волині. Це єдиний фіксований тариф, який дарує повну свободу пересування. Сім днів — оптимальний термін для повноцінної відпустки: Луцьк → Шацькі озера (Світязь, Пісочне) → Олика → Дубенський замок. Ви не залежите від розкладу маршруток чи наявності квитків на поїзд. Власний графік дозволяє зупинятися де завгодно: на каву в лісі або для фото біля Тараканівського форту. Якщо плани зміняться, продовжити оренду можна дистанційно за кілька хвилин.</div>

<div class='editor_title'>Оренда авто на місяць</div>
<div class='editor_text'>Місячний тариф розроблений для тих, хто цінує стабільність: відрядження, релокація бізнесу або тимчасова заміна власного авто, що в ремонті. Суттєва економія порівняно з добовою орендою і повний контроль над своїм часом. Це вибір для активного бізнес-ритму між містами: Луцьк ↔ Рівне, Володимир, Ковель, Львів. Один автомобіль закриває всі побутові та робочі питання: розвезення дітей, зустріч партнерів, поїздки в офіс. За потреби ми оперативно замінимо авто на інший клас (наприклад, кросовер для зими або економ для міста).</div>

<div class='editor_title'>Довгострокова оренда авто в Луцьку</div>
<div class='editor_text'>Рішення для тих, хто планує залишатися в місті надовго (від 3 місяців до року). Ви отримуєте всі переваги власного авто без ризиків його обслуговування, страхування та амортизації. Ваш бюджет зафіксовано, а всі турботи про ТО та сезонну гуму бере на себе REIZ. Це особливо зручно для компаній та фахівців, чия робота пов'язана з регулярними поїздками регіоном (Волинська та Рівненська області). Якщо ваші задачі зміняться, ви легко можете пересісти з седана на позашляховик без складних процедур купівлі-продажу.</div>

<div class='editor_title'>Прокат бюджетних авто — від $20/доба</div>
<div class='editor_text'>Потрібна мобільність без зайвих витрат? Економ-клас у REIZ — це надійні та перевірені автомобілі з помірним споживанням пального. Вони ідеальні для міського трафіку Луцька, легко паркуються в центрі та мають достатньо місця для пасажирів і покупок. Ви платите лише за функціонал та безпеку.</div>

<div class='editor_title'>Наші переваги оренди авто в Луцьку</div>
<div class='editor_text'><ul><li><span class='text-strong'>Сайт, що економить час:</span> актуальна наявність авто та фільтри під ваші потреби.</li><li><span class='text-strong'>Швидкий старт:</span> мінімум паперів, ключі у вас за лічені хвилини.</li><li><span class='text-strong'>Локальна подача:</span> зустрінемо вас на вокзалі, біля готелю чи офісу.</li><li><span class='text-strong'>Чесна ціна:</span> ви бачите фінальну суму до моменту оплати, жодних "сюрпризів" при поверненні.</li><li><span class='text-strong'>Гнучкість:</span> тарифи від доби до року з можливістю легкої пролонгації.</li><li><span class='text-strong'>Безпека парку:</span> автомобілі проходять огляд після кожного клієнта, шини завжди по сезону.</li><li><span class='text-strong'>Підтримка 24/7:</span> ми на зв'язку будь-якою зручною мовою (UA/EN та ін.).</li><li><span class='text-strong'>Відповідність фото:</span> ви бронюєте конкретний клас і комплектацію, а не "щось схоже".</li><li><span class='text-strong'>Людський договір:</span> прості та зрозумілі умови щодо палива та пробігу.</li></ul></div>

<div class='editor_title'>Без застави / Зменшений депозит</div>
<div class='editor_text'>Ми робимо прокат доступнішим. Для багатьох моделей доступна опція оренди без повної суми застави або зі знижкою на депозит до 50%. Це дозволяє краще планувати бюджет подорожі. Умови залежать від вашого стажу водіння, класу авто та терміну оренди — система покаже доступні варіанти при бронюванні.</div>

<div class='editor_title'>Послуги водія в Луцьку</div>
<div class='editor_text'>Бажаєте відпочити від керма або потрібно зустріти VIP-гостей? Замовте авто з досвідченим водієм. Ми забезпечимо трансфер до готелю, замку або бізнес-центру з максимальним комфортом.</div>

<div class='editor_title'>Безкоштовна доставка авто по Луцьку</div>
<div class='editor_text'>Безкоштовно: Подача авто в межах міста (Центр, 33-й, 40-й квартали, Вишків тощо) входить у вартість.<br/>За містом: Подача в передмістя (наприклад, Гірка Полонка, Підгайці) або в інші міста області тарифікується окремо. Ціну розрахує менеджер залежно від кілометражу.<br/>Повернення: У межах Луцька — безкоштовно.<br/>Як замовити: Просто вкажіть адресу та час при бронюванні на сайті.</div>

<div class='editor_title'>Додаткові опції для комфорту</div>
<div class='editor_text'><ul><li><span class='text-strong'>Навігація:</span> Apple CarPlay та Android Auto у більшості авто — ваші карти завжди на екрані.</li><li><span class='text-strong'>Дитяче крісло:</span> Безпека найменших пасажирів — наш пріоритет (вкажіть вік дитини при замовленні).</li><li><span class='text-strong'>Виїзд за кордон:</span> Можливий за попереднім погодженням (готуємо розширену страховку та документи).</li><li><span class='text-strong'>Unlimited пробіг:</span> Для тих, хто планує довгі маршрути Волинню, доступна опція безлімітного пробігу (деталі у менеджера).</li></ul></div>

<div class='editor_title'>Автомобілі в ідеальному стані</div>
<div class='editor_text'>Ми фанатично ставимося до чистоти та справності. Дороги Волині можуть бути різними, але ваше авто має бути бездоганним. Перед кожною видачею перевіряємо: гальмівну систему, світло, тиск у шинах та рівень рідин. Салон завжди проходить хімчистку або ретельне миття. Ви сідаєте в свіже авто, готове до будь-якої відстані.</div>

<div class='editor_title'>Поради щодо безпечного водіння в регіоні</div>
<div class='editor_text'>Луцьк та область мають свої особливості руху. Щоб поїздка була приємною, пам'ятайте:<ol><li><span class='text-strong'>Тримайте дистанцію та увагу на покритті:</span> У центрі міста багато історичної бруківки, яка стає слизькою під час дощу. Збільшуйте дистанцію гальмування. На трасах області слідкуйте за знаками — можливий вихід диких тварин на дорогу (особливо в лісистих зонах біля Шацька).</li><li><span class='text-strong'>Маневруйте зважено:</span> Перевіряйте сліпі зони перед перелаштуванням. Луцьк — компактне місто з активним рухом на кільцях, будьте уважні до пріоритетів проїзду. Не забувайте про велосипедистів та електросамокати.</li><li><span class='text-strong'>Дотримуйтесь швидкісного режиму:</span> Знаки в населених пунктах стоять не просто так. Камери фіксації швидкості працюють як у місті, так і на трасах М-07 та М-19.</li><li><span class='text-strong'>Алкоголь та кермо несумісні:</span> У REIZ діє політика нульової толерантності до алкоголю. Безпека — це відповідальність кожного водія. Керування в нетверезому стані суворо заборонено умовами договору та законом.</li></ol></div>
`.trim(),
      ru: `
<div class='editor_text'>REIZ — это современный автопрокат в Луцке, где главными принципами являются прозрачность и техническая исправность авто. Мы отлично понимаем специфику местных дорог: от брусчатки в Старом городе до скоростных трасс на Ровно или Ковель.<br/>Мы доставляем авто к ж/д вокзалу, ТРЦ PortCity, ЦУМу или по любому адресу в черте города.</div>

<div class='editor_title'>Почасовой тариф: тест-драйв перед дорогой</div>
<div class='editor_text'>Почасовая аренда — идеальный вариант для решения краткосрочных дел в городе или тест-драйва автомобиля. За одни сутки вы поймете характер машины: как подвеска справляется с луцкой брусчаткой возле Замка Любарта, удобно ли маневрировать на парковках у "Променя" или "Гостинца", и как работает климат-контроль. Это лучший способ убедиться, что авто вам подходит, перед тем как отправиться в долгое путешествие на Шацкие озера (Свитязь) или к Тоннелю любви в Клевани. Вы проверяете вместительность багажника и комфорт посадки без долгосрочных обязательств.</div>

<div class='editor_title'>Аренда авто на неделю в Луцке: курс на Шацкие озера</div>
<div class='editor_text'>Недельный прокат — самый популярный формат для отдыха на Волыни. Это единый фиксированный тариф, который дарит полную свободу передвижения. Семь дней — оптимальный срок для полноценного отпуска: Луцк → Шацкие озера (Свитязь, Песочное) → Олыка → Дубенский замок. Вы не зависите от расписания маршруток или наличия билетов на поезд. Собственный график позволяет останавливаться где угодно: на кофе в лесу или для фото у Таракановского форта. Если планы изменятся, продлить аренду можно дистанционно за пару минут.</div>

<div class='editor_title'>Аренда авто на месяц</div>
<div class='editor_text'>Месячный тариф разработан для тех, кто ценит стабильность: командировки, релокация бизнеса или временная замена своего авто, которое в ремонте. Существенная экономия по сравнению с суточной арендой и полный контроль над своим временем. Это выбор для активного бизнес-ритма между городами: Луцк ↔ Ровно, Владимир, Ковель, Львов. Один автомобиль закрывает все бытовые и рабочие вопросы: развозка детей, встречи партнеров, поездки в офис. При необходимости мы оперативно заменим авто на другой класс (например, кроссовер для зимы или эконом для города).</div>

<div class='editor_title'>Долгосрочная аренда авто в Луцке</div>
<div class='editor_text'>Решение для тех, кто планирует оставаться в городе надолго (от 3 месяцев до года). Вы получаете все преимущества собственного авто без рисков его обслуживания, страхования и амортизации. Ваш бюджет зафиксирован, а все заботы о ТО и сезонной резине берет на себя REIZ. Это особенно удобно для компаний и специалистов, чья работа связана с регулярными поездками по региону (Волынская и Ровенская области). Если ваши задачи изменятся, вы легко можете пересесть с седана на внедорожник без сложных процедур купли-продажи.</div>

<div class='editor_title'>Прокат бюджетных авто — от $20/сутки</div>
<div class='editor_text'>Нужна мобильность без лишних трат? Эконом-класс в REIZ — это надежные и проверенные автомобили с умеренным расходом топлива. Они идеальны для городского трафика Луцка, легко паркуются в центре и имеют достаточно места для пассажиров и покупок. Вы платите только за функционал и безопасность.</div>

<div class='editor_title'>Наши преимущества аренды авто в Луцке</div>
<div class='editor_text'><ul><li><span class='text-strong'>Сайт, экономящий время:</span> актуальное наличие авто и фильтры под ваши нужды.</li><li><span class='text-strong'>Быстрый старт:</span> минимум бумаг, ключи у вас за считанные минуты.</li><li><span class='text-strong'>Локальная подача:</span> встретим вас на вокзале, у отеля или офиса.</li><li><span class='text-strong'>Честная цена:</span> вы видите финальную сумму до момента оплаты, никаких "сюрпризов" при возврате.</li><li><span class='text-strong'>Гибкость:</span> тарифы от суток до года с возможностью легкой пролонгации.</li><li><span class='text-strong'>Безопасность парка:</span> автомобили проходят осмотр после каждого клиента, шины всегда по сезону.</li><li><span class='text-strong'>Поддержка 24/7:</span> мы на связи на любом удобном языке (UA/RU/EN и др.).</li><li><span class='text-strong'>Соответствие фото:</span> вы бронируете конкретный класс и комплектацию, а не "что-то похожее".</li><li><span class='text-strong'>Человеческий договор:</span> простые и понятные условия по топливу и пробегу.</li></ul></div>

<div class='editor_title'>Без залога / Уменьшенный депозит</div>
<div class='editor_text'>Мы делаем прокат доступнее. Для многих моделей доступна опция аренды без полной суммы залога или со скидкой на депозит до 50%. Это позволяет лучше планировать бюджет путешествия. Условия зависят от вашего стажа вождения, класса авто и срока аренды — система покажет доступные варианты при бронировании.</div>

<div class='editor_title'>Услуги водителя в Луцке</div>
<div class='editor_text'>Хотите отдохнуть от руля или нужно встретить VIP-гостей? Закажите авто с опытным водителем. Мы обеспечим трансфер в отель, к замку или бизнес-центру с максимальным комфортом.</div>

<div class='editor_title'>Бесплатная доставка авто по Луцку</div>
<div class='editor_text'>Бесплатно: Подача авто в черте города (Центр, 33-й, 40-й кварталы, Вышков и т.д.) входит в стоимость.<br/>За городом: Подача в пригороды (например, Горка Полонка, Подгайцы) или в другие города области тарифицируется отдельно. Цену рассчитает менеджер в зависимости от километража.<br/>Возврат: В черте Луцка — бесплатно.<br/>Как заказать: Просто укажите адрес и время при бронировании на сайте.</div>

<div class='editor_title'>Дополнительные опции для комфорта</div>
<div class='editor_text'><ul><li><span class='text-strong'>Навигация:</span> Apple CarPlay и Android Auto в большинстве авто — ваши карты всегда на экране.</li><li><span class='text-strong'>Детское кресло:</span> Безопасность самых маленьких пассажиров — наш приоритет (укажите возраст ребенка при заказе).</li><li><span class='text-strong'>Выезд за границу:</span> Возможен по предварительному согласованию (готовим расширенную страховку и документы).</li><li><span class='text-strong'>Unlimited пробег:</span> Для тех, кто планирует длинные маршруты по Волыни, доступна опция безлимитного пробега (детали у менеджера).</li></ul></div>

<div class='editor_title'>Автомобили в идеальном состоянии</div>
<div class='editor_text'>Мы фанатично относимся к чистоте и исправности. Дороги Волыни могут быть разными, но ваше авто должно быть безупречным. Перед каждой выдачей проверяем: тормозную систему, свет, давление в шинах и уровень жидкостей. Салон всегда проходит химчистку или тщательную мойку. Вы садитесь в свежее авто, готовое к любому расстоянию.</div>

<div class='editor_title'>Советы по безопасному вождению в регионе</div>
<div class='editor_text'>Луцк и область имеют свои особенности движения. Чтобы поездка была приятной, помните:<ol><li><span class='text-strong'>Держите дистанцию и внимание на покрытии:</span> В центре города много исторической брусчатки, которая становится скользкой во время дождя. Увеличивайте дистанцию торможения. На трассах области следите за знаками — возможен выход диких животных на дорогу (особенно в лесистых зонах возле Шацка).</li><li><span class='text-strong'>Маневрируйте взвешенно:</span> Проверяйте слепые зоны перед перестроением. Луцк — компактный город с активным движением на кольцах, будьте внимательны к приоритетам проезда. Не забывайте про велосипедистов и электросамокаты.</li><li><span class='text-strong'>Соблюдайте скоростной режим:</span> Знаки в населенных пунктах стоят не просто так. Камеры фиксации скорости работают как в городе, так и на трассах М-07 и М-19.</li><li><span class='text-strong'>Алкоголь и руль несовместимы:</span> В REIZ действует политика нулевой толерантности к алкоголю. Безопасность — это ответственность каждого водителя. Управление в нетрезвом виде строго запрещено условиями договора и законом.</li></ol></div>
`.trim(),
      en: `
<div class='editor_text'>REIZ offers modern car rental services in Lutsk, prioritizing transparency and vehicle reliability. We understand local driving conditions perfectly: from the historic cobblestones of the Old Town to the highways leading to Rivne or Kovel.<br/>We deliver cars to the Railway Station, PortCity Mall, TSUM, or any specific address within the city limits.</div>

<div class='editor_title'>Hourly Rate: Test Drive Before the Journey</div>
<div class='editor_text'>Hourly rental is the perfect solution for running quick errands in the city or testing a vehicle. Within 24 hours, you'll understand the car's character: how the suspension handles the cobblestones near Lubart's Castle, how easy it is to park near "Promin" or "Hostynets," and how the climate control performs. It's the best way to ensure the car suits you before heading out on a long trip to Shatsky Lakes (Svityaz) or the Tunnel of Love in Klevan. You can check trunk capacity and seating comfort without long-term commitments.</div>

<div class='editor_title'>Weekly Car Rental in Lutsk: Course to Shatsky Lakes</div>
<div class='editor_text'>Weekly rental is the most popular choice for vacations in the Volyn region. It's a single fixed rate that offers total freedom of movement. Seven days is the optimal time for a full vacation: Lutsk → Shatsky Lakes (Svityaz, Pisochne) → Olyka → Dubno Castle. You are not dependent on bus schedules or train ticket availability. Your own schedule allows you to stop anywhere: for coffee in the forest or a photo at the Tarakaniv Fort. If plans change, extending the rental takes just a few minutes remotely.</div>

<div class='editor_title'>Monthly Car Rental</div>
<div class='editor_text'>The monthly tariff is designed for those who value stability: business trips, business relocation, or a temporary replacement for your own car while it's in repair. Significant savings compared to daily rental and full control over your time. This is the choice for an active business rhythm between cities: Lutsk ↔ Rivne, Volodymyr, Kovel, Lviv. One car covers all domestic and work needs: school runs, meeting partners, commuting to the office. If needed, we can quickly swap the car for another class (e.g., an SUV for winter or an economy car for city driving).</div>

<div class='editor_title'>Long-term Car Rental in Lutsk</div>
<div class='editor_text'>A solution for those planning to stay in the city for a long time (from 3 months to a year). You get all the benefits of owning a car without the risks of maintenance, insurance, and depreciation. Your budget is fixed, and REIZ takes care of all maintenance and seasonal tire changes. This is especially convenient for companies and professionals whose work involves regular travel within the region (Volyn and Rivne oblasts).</div>

<div class='editor_title'>Budget Car Rental — From $20/day</div>
<div class='editor_text'>Need mobility without extra costs? REIZ Economy Class offers reliable and proven cars with moderate fuel consumption. They are ideal for Lutsk city traffic, easy to park in the center, and have enough space for passengers and shopping. You pay only for functionality and safety.</div>

<div class='editor_title'>Our Advantages in Lutsk</div>
<div class='editor_text'><ul><li><span class='text-strong'>Time-Saving Website:</span> Real-time availability and filters for your needs.</li><li><span class='text-strong'>Quick Start:</span> Minimal paperwork, keys in your hand in minutes.</li><li><span class='text-strong'>Local Delivery:</span> We meet you at the station, hotel, or office.</li><li><span class='text-strong'>Transparent Price:</span> You see the final total before payment, no "surprises" upon return.</li><li><span class='text-strong'>Flexibility:</span> Terms from a day to a year with easy extension options.</li><li><span class='text-strong'>Fleet Safety:</span> Cars are inspected after every client; tires are always season-appropriate.</li><li><span class='text-strong'>24/7 Support:</span> We are online in your preferred language (UA/EN, etc.).</li><li><span class='text-strong'>Photo Match:</span> You book a specific class and trim, not "something similar."</li><li><span class='text-strong'>Human Contract:</span> Simple and clear terms regarding fuel and mileage.</li></ul></div>

<div class='editor_title'>No Deposit / Reduced Deposit</div>
<div class='editor_text'>We make rental more accessible. For many models, an option to rent without a full deposit or with a 50% deposit discount is available. This allows for better travel budget planning. Conditions depend on your driving experience, car class, and rental term — the system will show available options during booking.</div>

<div class='editor_title'>Driver Services in Lutsk</div>
<div class='editor_text'>Want to rest from the wheel or need to meet VIP guests? Order a car with an experienced chauffeur. We ensure a transfer to the hotel, castle, or business center with maximum comfort.</div>

<div class='editor_title'>Free Car Delivery in Lutsk</div>
<div class='editor_text'>Free: Delivery within the city (Center, 33rd district, 40th district, Vyshkov, etc.) is included.<br/>Outside City: Delivery to suburbs (e.g., Hirka Polonka, Pidhaytsi) or other towns in the region is charged separately. The manager will calculate the price based on mileage.<br/>Return: Within Lutsk — free of charge.<br/>How to Order: Just specify the address and time when booking on the site.</div>

<div class='editor_title'>Extra Options for Comfort</div>
<div class='editor_text'><ul><li><span class='text-strong'>Navigation:</span> Apple CarPlay and Android Auto in most cars — your maps are always on screen.</li><li><span class='text-strong'>Child Seat:</span> Safety of the youngest passengers is our priority (specify the child's age when booking).</li><li><span class='text-strong'>Cross-Border:</span> Possible upon prior agreement (we prepare extended insurance and documents).</li><li><span class='text-strong'>Unlimited Mileage:</span> Available for those planning long routes through Volyn (details with the manager).</li></ul></div>

<div class='editor_title'>Cars in Perfect Condition</div>
<div class='editor_text'>We are fanatical about cleanliness and mechanics. Volyn roads can vary, but your car must be flawless. Before every handover, we check: brakes, lights, tire pressure, and fluid levels. The interior always undergoes dry cleaning or thorough washing. You get into a fresh car, ready for any distance.</div>

<div class='editor_title'>Safety Tips for Driving in the Region</div>
<div class='editor_text'>Lutsk and the region have their own traffic specifics. To ensure a pleasant trip, remember:<ol><li><span class='text-strong'>Keep Distance and Watch the Surface:</span> The city center has a lot of historic cobblestones, which become slippery when wet. Increase your braking distance. On regional highways, watch for signs — wild animals may cross the road (especially in forest zones near Shatsk).</li><li><span class='text-strong'>Maneuver Wisely:</span> Check blind spots before changing lanes. Lutsk is a compact city with active traffic on roundabouts; be attentive to right-of-way rules. Don't forget about cyclists and electric scooters.</li><li><span class='text-strong'>Alcohol and Driving Don't Mix:</span> REIZ has a zero-tolerance policy towards alcohol. Safety is every driver's responsibility. Driving under the influence is strictly prohibited by the contract and the law.</li></ol></div>
`.trim(),
    },
  },
  rivne: {
    routeExample: {
      uk: "як модель поводиться на дорогах Рівненщини та Полісся",
      ru: "как модель ведёт себя на дорогах Ровенщины и Полесья",
      en: "how the model handles Rivne region and Polissia roads",
    },
    routes: {
      uk: "Рівне ↔ Київ, Львів, Луцьк, Тернопіль",
      ru: "Ровно ↔ Киев, Львов, Луцк, Тернополь",
      en: "Rivne ↔ Kyiv, Lviv, Lutsk, Ternopil",
    },
    weekendTrip: {
      uk: "Тунель кохання в Клевані, Тараканівський форт, Корець",
      ru: "Тоннель любви в Клевани, Тараканивский форт, Корец",
      en: "Tunnel of Love in Klevan, Tarakaniv Fort, Korets",
    },
    localAttractions: {
      uk: "центр, вокзал, автовокзал, Рівненський замок",
      ru: "центр, вокзал, автовокзал, Ровенский замок",
      en: "city center, railway station, bus station, Rivne Castle",
    },
  },
  khmelnytskyi: {
    routeExample: {
      uk: "як модель поводиться на дорогах Поділля та шляху до Кам'янця",
      ru: "как модель ведёт себя на дорогах Подолья и пути в Каменец",
      en: "how the model handles Podillia roads and the route to Kamianets",
    },
    routes: {
      uk: "Хмельницький ↔ Київ, Львів, Вінниця, Кам'янець-Подільський",
      ru: "Хмельницкий ↔ Киев, Львов, Винница, Каменец-Подольский",
      en: "Khmelnytskyi ↔ Kyiv, Lviv, Vinnytsia, Kamianets-Podilskyi",
    },
    weekendTrip: {
      uk: "Кам'янець-Подільська фортеця, Бакота, Хотин",
      ru: "Каменец-Подольская крепость, Бакота, Хотин",
      en: "Kamianets-Podilskyi Fortress, Bakota, Khotyn",
    },
    localAttractions: {
      uk: "центр, вокзал, автовокзал, Подільський міст",
      ru: "центр, вокзал, автовокзал, Подольский мост",
      en: "city center, railway station, bus station, Podilskyi Bridge",
    },
  },
  "kamianets-podilskyi": {
    routeExample: {
      uk: "як модель поводиться на серпантинах каньйону та історичних вулицях",
      ru: "как модель ведёт себя на серпантинах каньона и исторических улицах",
      en: "how the model handles canyon serpentines and historic streets",
    },
    routes: {
      uk: "Кам'янець-Подільський ↔ Хотин, Бакота, Хмельницький, Чернівці",
      ru: "Каменец-Подольский ↔ Хотин, Бакота, Хмельницкий, Черновцы",
      en: "Kamianets-Podilskyi ↔ Khotyn, Bakota, Khmelnytskyi, Chernivtsi",
    },
    weekendTrip: {
      uk: "Хотинська фортеця, Бакота, водоспад Бурбун",
      ru: "Хотинская крепость, Бакота, водопад Бурбун",
      en: "Khotyn Fortress, Bakota, Burbun Waterfall",
    },
    localAttractions: {
      uk: "фортеця, Старе місто, Турецький міст, каньйон",
      ru: "крепость, Старый город, Турецкий мост, каньон",
      en: "fortress, Old Town, Turkish Bridge, canyon",
    },
  },
  drohobych: {
    routeExample: {
      uk: "як модель поводиться на дорогах Прикарпаття",
      ru: "как модель ведёт себя на дорогах Прикарпатья",
      en: "how the model handles Prykarpattia roads",
    },
    routes: {
      uk: "Дрогобич ↔ Львів, Трускавець, Борислав, Стрий",
      ru: "Дрогобыч ↔ Львов, Трускавец, Борислав, Стрый",
      en: "Drohobych ↔ Lviv, Truskavets, Boryslav, Stryi",
    },
    weekendTrip: {
      uk: "Трускавець, Східниця, дерев'яні церкви ЮНЕСКО",
      ru: "Трускавец, Сходница, деревянные церкви ЮНЕСКО",
      en: "Truskavets, Skhidnytsia, UNESCO wooden churches",
    },
    localAttractions: {
      uk: "центр, вокзал, церква св. Юра",
      ru: "центр, вокзал, церковь св. Юра",
      en: "city center, railway station, St. George's Church",
    },
  },
  stryi: {
    routeExample: {
      uk: "як модель поводиться на трасі до Карпат",
      ru: "как модель ведёт себя на трассе в Карпаты",
      en: "how the model handles the highway to Carpathians",
    },
    routes: {
      uk: "Стрий ↔ Львів, Моршин, Сколе, Буковель",
      ru: "Стрый ↔ Львов, Моршин, Сколе, Буковель",
      en: "Stryi ↔ Lviv, Morshyn, Skole, Bukovel",
    },
    weekendTrip: {
      uk: "Моршин, Сколівські Бескиди, озеро Синевир",
      ru: "Моршин, Сколевские Бескиды, озеро Синевир",
      en: "Morshyn, Skole Beskids, Lake Synevyr",
    },
    localAttractions: {
      uk: "центр, вокзал, автовокзал",
      ru: "центр, вокзал, автовокзал",
      en: "city center, railway station, bus station",
    },
  },
  sambir: {
    routeExample: {
      uk: "як модель поводиться на дорогах біля кордону",
      ru: "как модель ведёт себя на дорогах у границы",
      en: "how the model handles roads near the border",
    },
    routes: {
      uk: "Самбір ↔ Львів, кордон з Польщею, Дрогобич",
      ru: "Самбор ↔ Львов, граница с Польшей, Дрогобыч",
      en: "Sambir ↔ Lviv, Poland border, Drohobych",
    },
    weekendTrip: {
      uk: "поїздка до Львова, Перемишль (Польща)",
      ru: "поездка во Львов, Перемышль (Польша)",
      en: "trip to Lviv, Przemysl (Poland)",
    },
    localAttractions: {
      uk: "центр, вокзал, ратуша",
      ru: "центр, вокзал, ратуша",
      en: "city center, railway station, town hall",
    },
  },
  chervonohrad: {
    routeExample: {
      uk: "як модель поводиться на дорогах Сокальщини",
      ru: "как модель ведёт себя на дорогах Сокальщины",
      en: "how the model handles Sokal region roads",
    },
    routes: {
      uk: "Червоноград ↔ Львів, Рава-Руська, кордон",
      ru: "Червоноград ↔ Львов, Рава-Русская, граница",
      en: "Chervonohrad ↔ Lviv, Rava-Ruska, border",
    },
    weekendTrip: {
      uk: "Жовква, Львів, Белз",
      ru: "Жолква, Львов, Белз",
      en: "Zhovkva, Lviv, Belz",
    },
    localAttractions: {
      uk: "центр міста",
      ru: "центр города",
      en: "city center",
    },
  },
  boryslav: {
    routeExample: {
      uk: "як модель поводиться в гірській місцевості",
      ru: "как модель ведёт себя в горной местности",
      en: "how the model handles mountainous terrain",
    },
    routes: {
      uk: "Борислав ↔ Трускавець, Дрогобич, Східниця",
      ru: "Борислав ↔ Трускавец, Дрогобыч, Сходница",
      en: "Boryslav ↔ Truskavets, Drohobych, Skhidnytsia",
    },
    weekendTrip: {
      uk: "Трускавець, Східниця, курорти Прикарпаття",
      ru: "Трускавец, Сходница, курорты Прикарпатья",
      en: "Truskavets, Skhidnytsia, Prykarpattia resorts",
    },
    localAttractions: {
      uk: "центр, музей нафтовидобутку",
      ru: "центр, музей нефтедобычи",
      en: "city center, oil extraction museum",
    },
  },
  zhovkva: {
    routeExample: {
      uk: "як модель поводиться на історичних вулицях",
      ru: "как модель ведёт себя на исторических улицах",
      en: "how the model handles historic streets",
    },
    routes: {
      uk: "Жовква ↔ Львів, Рава-Руська, Белз",
      ru: "Жолква ↔ Львов, Рава-Русская, Белз",
      en: "Zhovkva ↔ Lviv, Rava-Ruska, Belz",
    },
    weekendTrip: {
      uk: "замки Львівщини, Креховський монастир",
      ru: "замки Львовщины, Креховский монастырь",
      en: "Lviv region castles, Krekhiv Monastery",
    },
    localAttractions: {
      uk: "замок, ратуша, Глинська брама",
      ru: "замок, ратуша, Глинские ворота",
      en: "castle, town hall, Glynska Gate",
    },
  },
  yaremche: {
    routeExample: {
      uk: "як модель поводиться на карпатських серпантинах і підйомах",
      ru: "как модель ведёт себя на карпатских серпантинах и подъёмах",
      en: "how the model handles Carpathian serpentines and climbs",
    },
    routes: {
      uk: "Яремче ↔ Буковель, Ворохта, Івано-Франківськ",
      ru: "Яремче ↔ Буковель, Ворохта, Ивано-Франковск",
      en: "Yaremche ↔ Bukovel, Vorokhta, Ivano-Frankivsk",
    },
    weekendTrip: {
      uk: "Говерла, Яблуницький перевал, водоспад Пробій",
      ru: "Говерла, Яблуницкий перевал, водопад Пробий",
      en: "Hoverla, Yablunytsia Pass, Probiy Waterfall",
    },
    localAttractions: {
      uk: "центр, водоспад Пробій, сувенірний ринок",
      ru: "центр, водопад Пробий, сувенирный рынок",
      en: "city center, Probiy Waterfall, souvenir market",
    },
  },
  kolomyia: {
    routeExample: {
      uk: "як модель поводиться на трасі до Карпат та Чернівців",
      ru: "как модель ведёт себя на трассе к Карпатам и Черновцам",
      en: "how the model handles the highway to the Carpathians and Chernivtsi",
    },
    routes: {
      uk: "Коломия ↔ Косів, Яремче, Чернівці",
      ru: "Коломыя ↔ Косов, Яремче, Черновцы",
      en: "Kolomyia ↔ Kosiv, Yaremche, Chernivtsi",
    },
    weekendTrip: {
      uk: "Косів, Шешори, Яремче",
      ru: "Косов, Шешоры, Яремче",
      en: "Kosiv, Sheshory, Yaremche",
    },
    localAttractions: {
      uk: "центр, музей писанки, ратуша",
      ru: "центр, музей писанки, ратуша",
      en: "city center, Pysanka Museum, town hall",
    },
  },
  kalush: {
    routeExample: {
      uk: "як модель поводиться в міському трафіку та на трасі до Долини",
      ru: "как модель ведёт себя в городском трафике и на трассе до Долины",
      en: "how the model handles city traffic and the road to Dolyna",
    },
    routes: {
      uk: "Калуш ↔ Івано-Франківськ, Долина, Галич",
      ru: "Калуш ↔ Ивано-Франковск, Долина, Галич",
      en: "Kalush ↔ Ivano-Frankivsk, Dolyna, Halych",
    },
    weekendTrip: {
      uk: "Галич, Долина, Скелі Довбуша",
      ru: "Галич, Долина, Скалы Довбуша",
      en: "Halych, Dolyna, Dovbush Rocks",
    },
    localAttractions: {
      uk: "центр, парк, соляна криниця",
      ru: "центр, парк, соляной источник",
      en: "city center, park, salt spring",
    },
    customEditorContent: {
      uk: `
<div class='editor_text'>REIZ пропонує прокат автомобілів у Калуші з акцентом на мобільність та технічну надійність. Ми знаємо, що Калуш — це і промисловий хаб, і ворота до гір. Наші авто готові як до міських поїздок проспектом Лесі Українки, так і до траси Н-10.<br/>Ми подаємо авто до льодової арени, парку культури, автовокзалу або за вашою адресою.</div>

<div class='editor_title'>Погодинний тариф: тест-драйв перед горами</div>
<div class='editor_text'>Це ідеальний спосіб перевірити авто перед поїздкою в бік Долини чи Рожнятова. За добу ви зрозумієте: чи зручна посадка для далекої дороги, як авто поводиться на об'їзній Калуша та чи вистачить багажника для туристичного спорядження. Часто клієнти беруть машину на день, щоб з'їздити до родичів у сусідні села або протестувати модель перед купівлею.</div>

<div class='editor_title'>Оренда авто на тиждень: вікенд у Скелях Довбуша</div>
<div class='editor_text'>Тижневий тариф — це ваша перепустка до найгарніших місць регіону без прив'язки до автобусів. Маршрут вихідного дня: Калуш → Гошівський монастир → Скелі Довбуша (Бубнище) → Карпатський трамвайчик у Вигоді. Ви самі вирішуєте, коли виїхати і де зупинитися на обід. За 7 днів ви встигнете вирішити всі справи в місті та якісно відпочити на природі.</div>

<div class='editor_title'>Оренда авто на місяць: бізнес без кордонів</div>
<div class='editor_text'>Оптимальне рішення для тих, хто працює на два міста. Калуш розташований лише за 30 км від Івано-Франківська, і орендоване авто перетворює цю відстань на 30 хвилин комфортної їзди. Цей формат підходить для відряджень на великі підприємства («Карпатнафтохім» та ін.) або для тимчасової заміни власного транспорту. Єдиний платіж, повне технічне забезпечення від REIZ і можливість замінити седан на кросовер, якщо плануються поїздки в гори взимку.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Якщо ваш проект у Калуші триває кілька місяців або ви переїхали сюди тимчасово, довгострокова оренда вигідніша за таксі. Ви отримуєте персональний транспорт без витрат на амортизацію та страховку. Всі клопоти з обслуговування (заміна мастила, зимова гума) ми беремо на себе.</div>

<div class='editor_title'>Бюджетний прокат — від $20/доба</div>
<div class='editor_text'>Для поїздок містом та в сусідні райцентри (Галич, Брошнів-Осада) ми пропонуємо економічні авто. Мінімальна витрата пального, компактність для паркування біля ринку чи в центрі, і при цьому — повна безпека та справність.</div>

<div class='editor_title'>Переваги REIZ у Калуші</div>
<div class='editor_text'><ul><li><span class='text-strong'>Локальна специфіка:</span> Ми знаємо дороги регіону і порадимо авто, яке найкраще підійде для вашого маршруту.</li><li><span class='text-strong'>Швидкість:</span> Оформлення договору займає до 15 хвилин.</li><li><span class='text-strong'>Без прихованих платежів:</span> Ціна, яку ви бачите на сайті, є остаточною.</li><li><span class='text-strong'>Чистота:</span> Авто подається після мийки та хімчистки салону.</li><li><span class='text-strong'>Підтримка:</span> Ми на зв'язку 24/7, якщо вам знадобиться допомога в дорозі.</li></ul></div>

<div class='editor_title'>Без застави / Зменшений депозит</div>
<div class='editor_text'>Щоб зробити оренду доступнішою, ми пропонуємо опцію зменшеного депозиту (до 50%) або оренди без застави для перевірених клієнтів. Умови залежать від вашого стажу та класу авто.</div>

<div class='editor_title'>Безкоштовна доставка по Калушу</div>
<div class='editor_text'>У місті: Подача авто в межах Калуша (Центр, Хотінь, Загір'я) — безкоштовна.<br/>Передмістя: Доставка в Пійло, Копанки чи Верхню розраховується індивідуально менеджером.<br/>Повернення: У межах міста — безкоштовно.</div>

<div class='editor_title'>Авто в ідеальному стані</div>
<div class='editor_text'>Перед кожною орендою механіки перевіряють ходову частину, гальма та рівень технічних рідин. Ми розуміємо, що дорога на Долину чи Болехів може бути різною, тому ваше авто має бути надійним на 100%.</div>

<div class='editor_title'>Поради водіям у регіоні</div>
<div class='editor_text'><ol><li><span class='text-strong'>Обережно на трасі Н-10:</span> Це жвава магістраль з інтенсивним рухом вантажівок. Дотримуйтесь дистанції.</li><li><span class='text-strong'>Індустріальна зона:</span> У районі промислових об'єктів можливий виїзд спецтехніки, будьте уважні.</li><li><span class='text-strong'>Туристичні маршрути:</span> Дорога до Скель Довбуша місцями має гравійне покриття — враховуйте це при виборі швидкості.</li></ol></div>
`.trim(),
      en: `
<div class='editor_text'>REIZ offers car rental services in Kalush focused on mobility and technical reliability. We know that Kalush is both an industrial hub and the gateway to the mountains. Our cars are ready for both city driving along Lesya Ukrainka Avenue and trips on the H-10 highway.<br/>We deliver cars to the Ice Arena, the Culture Park, the Bus Station, or directly to your address.</div>

<div class='editor_title'>Hourly Rate: Test Drive Before the Mountains</div>
<div class='editor_text'>This is the perfect way to test a car before a trip towards Dolyna or Rozhnyativ. Within 24 hours, you will understand if the seating is comfortable for long distances, how the car handles the Kalush bypass road, and if the trunk is large enough for your hiking gear. Clients often rent a car for a day to visit relatives in nearby villages or to test a model before buying.</div>

<div class='editor_title'>Weekly Rental: Weekend at Dovbush Rocks</div>
<div class='editor_text'>The weekly tariff is your pass to the region's most beautiful spots without relying on buses. Weekend route: Kalush → Hoshiv Monastery → Dovbush Rocks (Bubnyshche) → Carpathian Tram in Vyhoda. You decide when to leave and where to stop for lunch. In 7 days, you can manage all your business in the city and enjoy a quality rest in nature.</div>

<div class='editor_title'>Monthly Rental: Business Without Borders</div>
<div class='editor_text'>The optimal solution for those working between two cities. Kalush is only 30 km from Ivano-Frankivsk, and a rental car turns this distance into a comfortable 30-minute drive. This format suits business trips to large enterprises (like "Karpatnaftokhim") or as a temporary replacement for your own transport. One payment covers everything, REIZ provides full technical support, and you can swap a sedan for a crossover if winter trips to the mountains are planned.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>If your project in Kalush lasts several months or you have relocated temporarily, long-term rental is more cost-effective than taxis. You get a personal vehicle without depreciation and insurance costs. We take care of all maintenance (oil changes, seasonal tires).</div>

<div class='editor_title'>Budget Rental — From $20/day</div>
<div class='editor_text'>For trips around the city and to neighboring district centers (Halych, Broshniv-Osada), we offer economical cars. Minimal fuel consumption, compact size for parking near the market or in the center, yet fully safe and reliable.</div>

<div class='editor_title'>REIZ Advantages in Kalush</div>
<div class='editor_text'><ul><li><span class='text-strong'>Local Expertise:</span> We know the region's roads and will recommend the best car for your route.</li><li><span class='text-strong'>Speed:</span> Contract signing takes up to 15 minutes.</li><li><span class='text-strong'>No Hidden Fees:</span> The price you see on the website is final.</li><li><span class='text-strong'>Cleanliness:</span> The car is delivered after washing and interior dry cleaning.</li><li><span class='text-strong'>Support:</span> We are available 24/7 if you need help on the road.</li></ul></div>

<div class='editor_title'>Free Delivery in Kalush</div>
<div class='editor_text'>In the City: Delivery within Kalush limits (Center, Khotin, Zahirya) is free.<br/>Suburbs: Delivery to Piylo, Kopanky, or Verkhnya is calculated individually.<br/>Return: Within the city limits — free.</div>

<div class='editor_title'>Cars in Perfect Condition</div>
<div class='editor_text'>Before every rental, mechanics check the suspension, brakes, and fluid levels. We understand that the road to Dolyna or Bolekhiv can vary, so your car must be 100% reliable.</div>
`.trim(),
      ru: `
<div class='editor_text'>REIZ предлагает прокат автомобилей в Калуше с акцентом на мобильность и техническую надежность. Мы знаем, что Калуш — это и промышленный хаб, и ворота в горы. Наши авто готовы как к городским поездкам по проспекту Леси Украинки, так и к выездам на трассу Н-10.<br/>Мы подаем авто к ледовой арене, парку культуры, автовокзалу или по вашему адресу.</div>

<div class='editor_title'>Почасовой тариф: тест-драйв перед горами</div>
<div class='editor_text'>Это идеальный способ проверить авто перед поездкой в сторону Долины или Рожнятова. За сутки вы поймете: удобна ли посадка для дальней дороги, как авто ведет себя на объездной Калуша и хватит ли багажника для туристического снаряжения. Часто клиенты берут машину на день, чтобы съездить к родственникам в соседние села или протестировать модель перед покупкой.</div>

<div class='editor_title'>Аренда авто на неделю: уикенд в Скалах Довбуша</div>
<div class='editor_text'>Недельный тариф — это ваш пропуск к самым красивым местам региона без привязки к автобусам. Маршрут выходного дня: Калуш → Гошевский монастырь → Скалы Довбуша (Бубнище) → Карпатский трамвайчик в Выгоде. Вы сами решаете, когда выехать и где остановиться на обед. За 7 дней вы успеете решить все дела в городе и качественно отдохнуть на природе.</div>

<div class='editor_title'>Аренда авто на месяц: бизнес без границ</div>
<div class='editor_text'>Оптимальное решение для тех, кто работает на два города. Калуш находится всего в 30 км от Ивано-Франковска, и арендованное авто превращает это расстояние в 30 минут комфортной езды. Этот формат подходит для командировок на крупные предприятия (например, «Карпатнафтохим») или для временной замены собственного транспорта. Единый платеж, полное техническое обеспечение от REIZ и возможность заменить седан на кроссовер, если планируются поездки в горы зимой.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Если ваш проект в Калуше длится несколько месяцев или вы переехали сюда временно, долгосрочная аренда выгоднее такси. Вы получаете персональный транспорт без расходов на амортизацию и страховку. Все заботы по обслуживанию (замена масла, зимняя резина) мы берем на себя.</div>

<div class='editor_title'>Бюджетный прокат — от $20/сутки</div>
<div class='editor_text'>Для поездок по городу и в соседние райцентры (Галич, Брошнев-Осада) мы предлагаем экономичные авто. Минимальный расход топлива, компактность для парковки у рынка или в центре, и при этом — полная безопасность и исправность.</div>

<div class='editor_title'>Преимущества REIZ в Калуше</div>
<div class='editor_text'><ul><li><span class='text-strong'>Локальная специфика:</span> Мы знаем дороги региона и посоветуем авто, которое лучше всего подойдет для вашего маршрута.</li><li><span class='text-strong'>Скорость:</span> Оформление договора занимает до 15 минут.</li><li><span class='text-strong'>Без скрытых платежей:</span> Цена, которую вы видите на сайте, является окончательной.</li><li><span class='text-strong'>Чистота:</span> Авто подается после мойки и химчистки салона.</li><li><span class='text-strong'>Поддержка:</span> Мы на связи 24/7, если вам понадобится помощь в дороге.</li></ul></div>

<div class='editor_title'>Бесплатная доставка по Калушу</div>
<div class='editor_text'>В городе: Подача авто в пределах Калуша (Центр, Хотинь, Загорье) — бесплатная.<br/>Пригород: Доставка в Пийло, Копанки или Верхнюю рассчитывается индивидуально менеджером.<br/>Возврат: В черте города — бесплатно.</div>

<div class='editor_title'>Авто в идеальном состоянии</div>
<div class='editor_text'>Перед каждой арендой механики проверяют ходовую часть, тормоза и уровень технических жидкостей. Мы понимаем, что дорога на Долину или Болехов может быть разной, поэтому ваше авто должно быть надежным на 100%.</div>
`.trim(),
    },
  },
  nadvirna: {
    routeExample: {
      uk: "як модель поводиться на гірських підйомах і трасі до Буковеля",
      ru: "как модель ведёт себя на горных подъёмах и трассе до Буковеля",
      en: "how the model handles mountain climbs and the road to Bukovel",
    },
    routes: {
      uk: "Надвірна ↔ Буковель, Яремче, Івано-Франківськ",
      ru: "Надворная ↔ Буковель, Яремче, Ивано-Франковск",
      en: "Nadvirna ↔ Bukovel, Yaremche, Ivano-Frankivsk",
    },
    weekendTrip: {
      uk: "Ворохта, Яблуницький перевал, Буковель",
      ru: "Ворохта, Яблуницкий перевал, Буковель",
      en: "Vorokhta, Yablunytsia Pass, Bukovel",
    },
    localAttractions: {
      uk: "центр, Надвірнянський замок, автовокзал",
      ru: "центр, Надворнянский замок, автовокзал",
      en: "city center, Nadvirna Castle, bus station",
    },
    customEditorContent: {
      uk: `
<div class='editor_text'>REIZ — це автопрокат у Надвірній, створений для тих, хто цінує свободу руху. Надвірна — це стратегічна точка: звідси починаються найкращі туристичні маршрути на Яремче та Буковель, і саме тут зосереджений потужний бізнес-сектор.<br/>Ми подаємо авто до Руїн Пнівського замку, автовокзалу, міського парку ім. Франка або за будь-якою адресою в місті.</div>

<div class='editor_title'>Погодинний тариф: перевірка горами</div>
<div class='editor_text'>Погодинна оренда — ідеальний спосіб протестувати авто перед серйозним підйомом. Вам вистачить доби, щоб зрозуміти: чи тягне двигун на затяжних підйомах біля Делятина, як працюють гальма на спусках і чи комфортно вам у салоні. Це "тест-драйв" у реальних умовах перед тим, як бронювати машину на довгу відпустку в горах.</div>

<div class='editor_title'>Оренда авто на тиждень: свобода від розкладу</div>
<div class='editor_text'>Тижневий тариф у Надвірній — це вибір туристів, які не хочуть залежати від переповнених автобусів. Ваш маршрут: Надвірна → Яремче (водоспад Пробій) → Микуличин → Татарів → Буковель. Ви зупиняєтесь там, де гарний краєвид, а не там, де зупинка маршрутки. За 7 днів ви встигнете об'їхати всі локації, включаючи Манявський водоспад, до якого без власного авто дістатися складно.</div>

<div class='editor_title'>Оренда авто на місяць: для бізнесу та життя</div>
<div class='editor_text'>Надвірна — промислове місто. Місячна оренда — вигідне рішення для фахівців нафтогазової сфери, відряджених інженерів або менеджерів. Фіксований платіж, повна технічна підтримка та можливість заміни авто. Якщо ви плануєте часті поїздки маршрутом Надвірна ↔ Івано-Франківськ, орендоване авто заощадить вам години часу щодня.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Для тих, хто залишається у місті на сезон або довше. Ви отримуєте автомобіль у своє розпорядження без необхідності купувати його, ставити на облік та страхувати. Всі питання з ТО, заміною мастила та сезонною "перевзувкою" шин вирішує команда REIZ. Це особливо зручно взимку, коли вимоги до авто в цьому регіоні підвищені.</div>

<div class='editor_title'>Бюджетний прокат — від $20/доба</div>
<div class='editor_text'>Потрібно просто вирішити справи в місті? Наш економ-клас — це маневрені та економні машини. Вони ідеально підходять для вузьких вуличок Надвірної та поїздок у сусідні села (Ланчин, Пнів) без зайвих витрат на пальне.</div>

<div class='editor_title'>Чому обирають REIZ у Надвірній</div>
<div class='editor_text'><ul><li><span class='text-strong'>Гірська підготовка:</span> Наші авто готові до перепадів висот — перевірені гальма, потужне світло, надійна гума.</li><li><span class='text-strong'>Миттєва подача:</span> Зустрінемо вас на вокзалі або біля готелю "Смарагд".</li><li><span class='text-strong'>Прозорість:</span> Жодних прихованих комісій — ціна фіксується в договорі.</li><li><span class='text-strong'>Підтримка 24/7:</span> Якщо в горах зникне зв'язок або станеться форс-мажор — ми знайдемо спосіб допомогти.</li></ul></div>

<div class='editor_title'>Без застави / Зменшений депозит</div>
<div class='editor_text'>Ми довіряємо нашим клієнтам. Для багатьох моделей доступна опція оренди зі зниженим депозитом (до 50%) або зовсім без застави. Система автоматично запропонує доступні варіанти при бронюванні.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Не впевнені у своїх навичках їзди серпантинами? Замовте авто з професійним водієм, який знає кожний поворот на трасі Н-09.</div>

<div class='editor_title'>Безкоштовна доставка по місту</div>
<div class='editor_text'>Надвірна: Подача та повернення в межах міста — безкоштовно.<br/>Область: Доставка в Яремче, Богородчани чи віддалені села розраховується окремо.</div>

<div class='editor_title'>Автомобілі в ідеальному стані</div>
<div class='editor_text'>Гори не пробачають несправностей. Тому в Надвірній ми приділяємо подвійну увагу технічному стану:<ul><li>Перевірка гальмівної системи після кожного клієнта.</li><li>Контроль системи охолодження двигуна (важливо для підйомів).</li><li>Чистий салон без сторонніх запахів.</li></ul></div>

<div class='editor_title'>Специфіка водіння: поради для траси Н-09</div>
<div class='editor_text'>Виїжджаючи з Надвірної в бік гір, пам'ятайте:<ol><li><span class='text-strong'>Серпантини та сліпі повороти:</span> Дорога на Буковель має багато закритих поворотів. Не йдіть на обгін, якщо не бачите зустрічну смугу на 100%.</li><li><span class='text-strong'>Гальмування двигуном:</span> На затяжних спусках (наприклад, Яблуницький перевал) використовуйте гальмування двигуном, щоб не перегріти гальмівні колодки.</li><li><span class='text-strong'>Погода змінюється миттєво:</span> У Надвірній може світити сонце, а через 20 км у Татарові — йти сніг або дощ. Будьте готові до зміни дорожнього покриття.</li></ol></div>
`.trim(),
      en: `
<div class='editor_text'>REIZ offers car rental services in Nadvirna tailored for those who value freedom of movement. Nadvirna is a strategic point: the best tourist routes to Yaremche and Bukovel start here, and a strong industrial sector is concentrated in the city.<br/>We deliver cars to the Pniv Castle Ruins, the Bus Station, Franko City Park, or any address within the city.</div>

<div class='editor_title'>Hourly Rate: Mountain Test</div>
<div class='editor_text'>Hourly rental is the perfect way to test a car before a serious climb. One day is enough to understand: does the engine handle the long ascents near Delyatyn, how do the brakes work on descents, and is the interior comfortable for you. It's a "test drive" in real conditions before booking a car for a long vacation in the mountains.</div>

<div class='editor_title'>Weekly Rental: Freedom from Schedules</div>
<div class='editor_text'>The weekly tariff in Nadvirna is the choice of tourists who do not want to depend on crowded buses. Your route: Nadvirna → Yaremche (Probiy Waterfall) → Mykulychyn → Tatariv → Bukovel. You stop where the view is beautiful, not where the bus stops. In 7 days, you will have time to visit all locations, including the Manyava Waterfall, which is difficult to reach without a private car.</div>

<div class='editor_title'>Monthly Rental: For Business and Life</div>
<div class='editor_text'>Nadvirna is an industrial city. Monthly rental is a profitable solution for oil and gas industry specialists, visiting engineers, or managers. Fixed payment, full technical support, and the possibility of car replacement. If you plan frequent trips on the Nadvirna ↔ Ivano-Frankivsk route, a rental car will save you hours daily.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>For those staying in the city for a season or longer. You get a car at your disposal without the need to buy, register, and insure it. The REIZ team handles all maintenance, oil changes, and seasonal tire swaps. This is especially convenient in winter when vehicle requirements in this region are higher.</div>

<div class='editor_title'>Budget Rental — From $20/day</div>
<div class='editor_text'>Need to run errands in the city? Our economy class features maneuverable and fuel-efficient cars. They are ideal for the narrow streets of Nadvirna and trips to neighboring villages (Lanchyn, Pniv) without extra fuel costs.</div>

<div class='editor_title'>Why Choose REIZ in Nadvirna</div>
<div class='editor_text'><ul><li><span class='text-strong'>Mountain Ready:</span> Our cars are prepared for elevation changes — checked brakes, powerful lights, reliable tires.</li><li><span class='text-strong'>Instant Delivery:</span> We will meet you at the station or near the "Smaragd" hotel.</li><li><span class='text-strong'>Transparency:</span> No hidden fees — the price is fixed in the contract.</li><li><span class='text-strong'>24/7 Support:</span> If the connection is lost in the mountains or force majeure happens, we will find a way to help.</li></ul></div>

<div class='editor_title'>No Deposit / Reduced Deposit</div>
<div class='editor_text'>We trust our clients. For many models, a reduced deposit option (up to 50%) or no deposit at all is available. The system will automatically suggest available options when booking.</div>

<div class='editor_title'>Driver Services</div>
<div class='editor_text'>Not confident in your skills driving on serpentines? Order a car with a professional driver who knows every turn on the H-09 highway.</div>

<div class='editor_title'>Free Delivery within the City</div>
<div class='editor_text'>Nadvirna: Delivery and return within the city limits are free.<br/>Region: Delivery to Yaremche, Bohorodchany, or remote villages is calculated separately.</div>

<div class='editor_title'>Cars in Perfect Condition</div>
<div class='editor_text'>Mountains do not forgive malfunctions. Therefore, in Nadvirna, we pay double attention to technical condition:<ul><li>Brake system check after each client.</li><li>Engine cooling system control (crucial for climbs).</li><li>Clean interior without foreign odors.</li></ul></div>

<div class='editor_title'>Driving Specifics: Tips for the H-09 Highway</div>
<div class='editor_text'>Leaving Nadvirna towards the mountains, remember:<ol><li><span class='text-strong'>Serpentines and Blind Turns:</span> The road to Bukovel has many blind corners. Do not overtake if you do not see the oncoming lane 100%.</li><li><span class='text-strong'>Engine Braking:</span> On long descents (e.g., Yablunytsia Pass), use engine braking to avoid overheating the brake pads.</li><li><span class='text-strong'>Weather Changes Instantly:</span> It might be sunny in Nadvirna, but snowing or raining 20 km away in Tatariv. Be ready for changing road surface conditions.</li></ol></div>
`.trim(),
      ru: `
<div class='editor_text'>REIZ — это автопрокат в Надворной, созданный для тех, кто ценит свободу движения. Надворная — это стратегическая точка: отсюда начинаются лучшие туристические маршруты на Яремче и Буковель, и именно здесь сосредоточен мощный бизнес-сектор.<br/>Мы подаем авто к Руинам Пневского замка, автовокзалу, городскому парку им. Франко или по любому адресу в городе.</div>

<div class='editor_title'>Почасовой тариф: проверка горами</div>
<div class='editor_text'>Почасовая аренда — идеальный способ протестировать авто перед серьезным подъемом. Вам хватит суток, чтобы понять: тянет ли двигатель на затяжных подъемах возле Делятина, как работают тормоза на спусках и комфортно ли вам в салоне. Это "тест-драйв" в реальных условиях перед тем, как бронировать машину на долгий отпуск в горах.</div>

<div class='editor_title'>Аренда авто на неделю: свобода от расписания</div>
<div class='editor_text'>Недельный тариф в Надворной — это выбор туристов, которые не хотят зависеть от переполненных автобусов. Ваш маршрут: Надворная → Яремче (водопад Пробой) → Микуличин → Татаров → Буковель. Вы останавливаетесь там, где красивый вид, а не там, где остановка маршрутки. За 7 дней вы успеете объехать все локации, включая Манявский водопад, до которого без личного авто добраться сложно.</div>

<div class='editor_title'>Аренда авто на месяц: для бизнеса и жизни</div>
<div class='editor_text'>Надворная — промышленный город. Месячная аренда — выгодное решение для специалистов нефтегазовой сферы, командированных инженеров или менеджеров. Фиксированный платеж, полная техническая поддержка и возможность замены авто. Если вы планируете частые поездки по маршруту Надворная ↔ Ивано-Франковск, арендованное авто сэкономит вам часы времени ежедневно.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Для тех, кто остается в городе на сезон или дольше. Вы получаете автомобиль в свое распоряжение без необходимости покупать его, ставить на учет и страховать. Все вопросы с ТО, заменой масла и сезонной "переобувкой" шин решает команда REIZ. Это особенно удобно зимой, когда требования к авто в этом регионе повышены.</div>

<div class='editor_title'>Бюджетный прокат — от $20/сутки</div>
<div class='editor_text'>Нужно просто решить дела в городе? Наш эконом-класс — это маневренные и экономные машины. Они идеально подходят для узких улочек Надворной и поездок в соседние села (Ланчин, Пнев) без лишних трат на топливо.</div>

<div class='editor_title'>Почему выбирают REIZ в Надворной</div>
<div class='editor_text'><ul><li><span class='text-strong'>Горная подготовка:</span> Наши авто готовы к перепадам высот — проверенные тормоза, мощный свет, надежная резина.</li><li><span class='text-strong'>Мгновенная подача:</span> Встретим вас на вокзале или у отеля "Смарагд".</li><li><span class='text-strong'>Прозрачность:</span> Никаких скрытых комиссий — цена фиксируется в договоре.</li><li><span class='text-strong'>Поддержка 24/7:</span> Если в горах пропадет связь или случится форс-мажор — мы найдем способ помочь.</li></ul></div>

<div class='editor_title'>Без залога / Уменьшенный депозит</div>
<div class='editor_text'>Мы доверяем нашим клиентам. Для многих моделей доступна опция аренды со сниженным депозитом (до 50%) или вовсе без залога. Система автоматически предложит доступные варианты при бронировании.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Не уверены в своих навыках езды по серпантинам? Закажите авто с профессиональным водителем, который знает каждый поворот на трассе Н-09.</div>

<div class='editor_title'>Бесплатная доставка по городу</div>
<div class='editor_text'>Надворная: Подача и возврат в черте города — бесплатно.<br/>Область: Доставка в Яремче, Богородчаны или отдаленные села рассчитывается отдельно.</div>

<div class='editor_title'>Автомобили в идеальном состоянии</div>
<div class='editor_text'>Горы не прощают неисправностей. Поэтому в Надворной мы уделяем двойное внимание техническому состоянию:<ul><li>Проверка тормозной системы после каждого клиента.</li><li>Контроль системы охлаждения двигателя (важно для подъемов).</li><li>Чистый салон без посторонних запахов.</li></ul></div>

<div class='editor_title'>Специфика вождения: советы для трассы Н-09</div>
<div class='editor_text'>Выезжая из Надворной в сторону гор, помните:<ol><li><span class='text-strong'>Серпантины и слепые повороты:</span> Дорога на Буковель имеет много закрытых поворотов. Не идите на обгон, если не видите встречную полосу на 100%.</li><li><span class='text-strong'>Торможение двигателем:</span> На затяжных спусках (например, Яблуницкий перевал) используйте торможение двигателем, чтобы не перегреть тормозные колодки.</li><li><span class='text-strong'>Погода меняется мгновенно:</span> В Надворной может светить солнце, а через 20 км в Татарове — идти снег или дождь. Будьте готовы к смене дорожного покрытия.</li></ol></div>
`.trim(),
    },
  },
  kosiv: {
    routeExample: {
      uk: "як модель поводиться на гуцульських дорогах",
      ru: "как модель ведёт себя на гуцульских дорогах",
      en: "how the model handles Hutsul roads",
    },
    routes: {
      uk: "Косів ↔ Коломия, Верховина, Яремче",
      ru: "Косов ↔ Коломыя, Верховина, Яремче",
      en: "Kosiv ↔ Kolomyia, Verkhovyna, Yaremche",
    },
    weekendTrip: {
      uk: "Шешори, Космач, Яворів",
      ru: "Шешоры, Космач, Яворов",
      en: "Sheshory, Kosmach, Yavoriv",
    },
    localAttractions: {
      uk: "центр, Косівський базар, музей народного мистецтва",
      ru: "центр, Косовский базар, музей народного искусства",
      en: "city center, Kosiv market, folk art museum",
    },
    customEditorContent: {
      uk: `
<div class='editor_text'>REIZ — це ваш надійний партнер для подорожей Прикарпаттям. Косів — місто майстрів, де дороги можуть вести як до ідеального асфальту на Коломию, так і до гравійних підйомів у високогірні села. Ми підберемо авто, яке впорається з будь-яким маршрутом.<br/>Ми подаємо авто до автостанції, Музею народного мистецтва Гуцульщини, туристичного комплексу "Байка" або за вашою адресою.</div>

<div class='editor_title'>Погодинний тариф: тест перед горами</div>
<div class='editor_text'>Вирішили поїхати в Яворів за ліжниками, але не впевнені, чи впорається седан? Візьміть авто погодинно. За добу ви перевірите: як підвіска реагує на дороги в районі Смодни, чи зручно маневрувати вузькими вуличками центру в базарний день і чи вистачить потужності для підйому на Буковецький перевал. Це найкращий спосіб переконатися у виборі перед тривалою мандрівкою.</div>

<div class='editor_title'>Оренда авто на тиждень: етно-тур без обмежень</div>
<div class='editor_text'>Тижнева оренда — ідеальний формат для дослідження автентичних Карпат. Маршрут для натхнення: Косів → Сріблясті водоспади (Шешори) → Пістинь (Маєток Св. Миколая) → Криворівня. Ви не залежите від розкладу автобусів, які рідко ходять у віддалені села. Власний графік дозволяє зустріти захід сонця на Сокільському хребті і повернутися в готель з комфортом.</div>

<div class='editor_title'>Оренда авто на місяць: життя в ритмі гір</div>
<div class='editor_text'>Якщо ви обрали Косів для релокації або тривалого проекту, місячна оренда — це ваша незалежність. Формат підходить для тих, хто живе в затишному Косові, а у справах їздить до Коломиї чи Івано-Франківська. Ви отримуєте один автомобіль для всіх потреб: від поїздок за продуктами до зустрічі партнерів. REIZ бере на себе все технічне обслуговування.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Рішення для місцевих мешканців та бізнесу. Ви користуєтесь новим, справним авто без необхідності купувати його та втрачати кошти на амортизації. Ми слідкуємо за тим, щоб шини завжди відповідали сезону (що критично важливо для косівських зим), а страховка була актуальною.</div>

<div class='editor_title'>Бюджетний прокат — від $20/доба</div>
<div class='editor_text'>Потрібно авто для справ у межах міста та поїздок хорошою дорогою до Кут чи Коломиї? Економ-клас від REIZ — це маневрені автомобілі, які легко припаркувати біля сувенірного ринку навіть у суботу вранці, і які приємно дивують витратою пального.</div>

<div class='editor_title'>Чому обирають REIZ у Косові</div>
<div class='editor_text'><ul><li><span class='text-strong'>Знання місцевості:</span> Ми порадимо, яке авто краще взяти для поїздки в Космач, а яке — для траси на Чернівці.</li><li><span class='text-strong'>Швидкість:</span> Від дзвінка до отримання ключів — мінімум часу.</li><li><span class='text-strong'>Чесність:</span> Ви платите лише суму, вказану в договорі. Жодних прихованих доплат за "гірський тариф".</li><li><span class='text-strong'>Доглянутість:</span> Наші авто завжди чисті та технічно справні, готові до фотосесій на фоні гір.</li></ul></div>

<div class='editor_title'>Без застави / Зменшений депозит</div>
<div class='editor_text'>Ми робимо сервіс доступним. Для постійних клієнтів та певних категорій авто доступна оренда без застави або зі знижкою на депозит до 50%. Перевірте доступність опції при бронюванні на сайті.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Хочете насолоджуватися краєвидами, а не стежити за дорогою? Замовте трансфер або оренду з водієм. Це особливо актуально після дегустацій місцевих наливок або для зустрічі гостей.</div>

<div class='editor_title'>Безкоштовна доставка по Косову</div>
<div class='editor_text'>У місті: Подача та повернення в межах Косова (Центр, Москалівка, Монастирське) — безкоштовно.<br/>Околиці: Доставка в Старий Косів, Вербовець чи Смодну можлива за додаткову плату (розраховується менеджером).</div>

<div class='editor_title'>Автомобілі в ідеальному стані</div>
<div class='editor_text'>Гірські дороги вимагають надійності. Перед кожною орендою ми перевіряємо:<ul><li>Стан рульового управління (важливо для серпантинів).</li><li>Роботу гальм та ручного гальма.</li><li>Справність світлотехніки для безпечної їзди ввечері.</li></ul></div>

<div class='editor_title'>Особливості водіння: поради для Косівщини</div>
<div class='editor_text'><ol><li><span class='text-strong'>Увага: Базарний день:</span> У суботу вранці рух у центрі Косова та в районі Смоднянського ринку дуже щільний. Плануйте виїзд заздалегідь або обирайте об'їзні шляхи.</li><li><span class='text-strong'>Гірські повороти:</span> Дорога на Верховину через Буковецький перевал — це серія крутих поворотів ("тещиних язиків"). Не перевищуйте швидкість і тримайтеся своєї смуги.</li><li><span class='text-strong'>Пішоходи та велосипедисти:</span> У селах Косівського району (особливо Космач, Рожнів) узбіччя часто відсутні, тому люди ходять краєм проїжджої частини. Будьте особливо уважні у темну пору доби.</li></ol></div>
`.trim(),
      en: `
<div class='editor_text'>REIZ is your reliable partner for traveling in the Precarpathian region. Kosiv is a city of artisans where roads can lead to perfect asphalt towards Kolomyia or gravel climbs into high mountain villages. We will select a car that can handle any route.<br/>We deliver cars to the Bus Station, the Museum of Hutsul Folk Art, the "Baika" tourist complex, or directly to your address.</div>

<div class='editor_title'>Hourly Rate: Test Before the Mountains</div>
<div class='editor_text'>Decided to drive to Yavoriv for handmade blankets but not sure if a sedan can handle it? Rent a car hourly. In 24 hours, you can check: how the suspension reacts to roads near Smodna, how easy it is to maneuver through narrow streets on market day, and if there is enough power for the Bukovets Pass climb. It is the best way to verify your choice before a long trip.</div>

<div class='editor_title'>Weekly Rental: Ethno-Tour Without Limits</div>
<div class='editor_text'>Weekly rental is the ideal format for exploring the authentic Carpathians. Route for inspiration: Kosiv → Silver Waterfalls (Sheshory) → Pistyn (St. Nicholas Estate) → Kryvorivnia. You don't depend on bus schedules, which are rare in remote villages. Your own schedule allows you to watch the sunset on the Sokilsky Ridge and return to your hotel in comfort.</div>

<div class='editor_title'>Monthly Rental: Life in the Mountain Rhythm</div>
<div class='editor_text'>If you chose Kosiv for relocation or a long-term project, monthly rental is your independence. This format suits those living in cozy Kosiv while traveling to Kolomyia or Ivano-Frankivsk for business. You get one car for all needs: from grocery shopping to meeting partners. REIZ takes care of all technical maintenance.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>A solution for locals and businesses. You use a new, reliable car without the need to buy it and lose money on depreciation. We ensure tires always match the season (crucial for Kosiv winters) and insurance is up to date.</div>

<div class='editor_title'>Budget Rental — From $20/day</div>
<div class='editor_text'>Need a car for errands within the city and trips on good roads to Kuty or Kolomyia? REIZ Economy Class offers maneuverable cars that are easy to park near the souvenir market even on Saturday mornings, with pleasantly low fuel consumption.</div>

<div class='editor_title'>Why Choose REIZ in Kosiv</div>
<div class='editor_text'><ul><li><span class='text-strong'>Local Knowledge:</span> We will advise which car is better for a trip to Kosmach and which for the highway to Chernivtsi.</li><li><span class='text-strong'>Speed:</span> Minimum time from call to receiving keys.</li><li><span class='text-strong'>Honesty:</span> You pay only the amount specified in the contract. No hidden "mountain fees."</li><li><span class='text-strong'>Condition:</span> Our cars are always clean and technically sound, ready for photoshoots against the mountain backdrop.</li></ul></div>

<div class='editor_title'>No Deposit / Reduced Deposit</div>
<div class='editor_text'>We make our service accessible. For regular clients and certain car categories, rental without a deposit or with a discount on the deposit of up to 50% is available. Check availability when booking on the site.</div>

<div class='editor_title'>Driver Services</div>
<div class='editor_text'>Want to enjoy the views instead of watching the road? Order a transfer or rental with a driver. This is especially relevant after tasting local liqueurs or for meeting guests.</div>

<div class='editor_title'>Free Delivery in Kosiv</div>
<div class='editor_text'>In the City: Delivery and return within Kosiv (Center, Moskalivka, Monastyrske) are free.<br/>Surroundings: Delivery to Staryi Kosiv, Verbovets, or Smodna is possible for an extra fee (calculated by the manager).</div>

<div class='editor_title'>Cars in Perfect Condition</div>
<div class='editor_text'>Mountain roads demand reliability. Before every rental, we check:<ul><li>Steering condition (important for serpentines).</li><li>Brake and handbrake performance.</li><li>Lighting functionality for safe evening driving.</li></ul></div>

<div class='editor_title'>Driving Specifics: Tips for Kosiv Region</div>
<div class='editor_text'><ol><li><span class='text-strong'>Attention: Market Day:</span> On Saturday mornings, traffic in Kosiv center and near the Smodna market is very heavy. Plan your departure in advance or choose bypass routes.</li><li><span class='text-strong'>Mountain Turns:</span> The road to Verkhovyna via Bukovets Pass is a series of sharp turns. Do not speed and stay in your lane.</li><li><span class='text-strong'>Pedestrians and Cyclists:</span> In villages of the Kosiv district (especially Kosmach, Rozhniv), shoulders are often missing, so people walk on the edge of the roadway. Be especially careful at night.</li></ol></div>
`.trim(),
      ru: `
<div class='editor_text'>REIZ — это ваш надежный партнер для путешествий по Прикарпатью. Косов — город мастеров, где дороги могут вести как к идеальному асфальту на Коломыю, так и к гравийным подъемам в высокогорные села. Мы подберем авто, которое справится с любым маршрутом.<br/>Мы подаем авто к автостанции, Музею народного искусства Гуцульщины, туристическому комплексу "Байка" или по вашему адресу.</div>

<div class='editor_title'>Почасовой тариф: тест перед горами</div>
<div class='editor_text'>Решили поехать в Яворов за лижниками, но не уверены, справится ли седан? Возьмите авто почасово. За сутки вы проверите: как подвеска реагирует на дороги в районе Смодны, удобно ли маневрировать узкими улочками центра в базарный день и хватит ли мощности для подъема на Буковецкий перевал. Это лучший способ убедиться в выборе перед длительным путешествием.</div>

<div class='editor_title'>Аренда авто на неделю: этно-тур без ограничений</div>
<div class='editor_text'>Недельная аренда — идеальный формат для исследования аутентичных Карпат. Маршрут для вдохновения: Косов → Серебристые водопады (Шешоры) → Пистынь (Поместье Св. Николая) → Криворовня. Вы не зависите от расписания автобусов, которые редко ходят в отдаленные села. Свой график позволяет встретить закат на Сокольском хребте и вернуться в отель с комфортом.</div>

<div class='editor_title'>Аренда авто на месяц: жизнь в ритме гор</div>
<div class='editor_text'>Если вы выбрали Косов для релокации или длительного проекта, месячная аренда — это ваша независимость. Формат подходит для тех, кто живет в уютном Косове, а по делам ездит в Коломыю или Ивано-Франковск. Вы получаете один автомобиль для всех нужд: от поездок за продуктами до встречи партнеров. REIZ берет на себя все техническое обслуживание.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Решение для местных жителей и бизнеса. Вы пользуетесь новым, исправным авто без необходимости покупать его и терять деньги на амортизации. Мы следим за тем, чтобы шины всегда соответствовали сезону (что критически важно для косовских зим), а страховка была актуальной.</div>

<div class='editor_title'>Бюджетный прокат — от $20/сутки</div>
<div class='editor_text'>Нужно авто для дел в черте города и поездок по хорошей дороге до Кут или Коломыи? Эконом-класс от REIZ — это маневренные автомобили, которые легко припарковать возле сувенирного рынка даже в субботу утром, и которые приятно удивляют расходом топлива.</div>

<div class='editor_title'>Почему выбирают REIZ в Косове</div>
<div class='editor_text'><ul><li><span class='text-strong'>Знание местности:</span> Мы посоветуем, какое авто лучше взять для поездки в Космач, а какое — для трассы на Черновцы.</li><li><span class='text-strong'>Скорость:</span> От звонка до получения ключей — минимум времени.</li><li><span class='text-strong'>Честность:</span> Вы платите только сумму, указанную в договоре. Никаких скрытых доплат за "горный тариф".</li><li><span class='text-strong'>Ухоженность:</span> Наши авто всегда чистые и технически исправные, готовы к фотосессиям на фоне гор.</li></ul></div>

<div class='editor_title'>Без залога / Уменьшенный депозит</div>
<div class='editor_text'>Мы делаем сервис доступным. Для постоянных клиентов и определенных категорий авто доступна аренда без залога или со скидкой на депозит до 50%. Проверьте доступность опции при бронировании на сайте.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Хотите наслаждаться видами, а не следить за дорогой? Закажите трансфер или аренду с водителем. Это особенно актуально после дегустаций местных наливок или для встречи гостей.</div>

<div class='editor_title'>Бесплатная доставка по Косову</div>
<div class='editor_text'>В городе: Подача и возврат в пределах Косова (Центр, Москалевка, Монастырское) — бесплатно.<br/>Окрестности: Доставка в Старый Косов, Вербовец или Смодну возможна за дополнительную плату (рассчитывается менеджером).</div>

<div class='editor_title'>Автомобили в идеальном состоянии</div>
<div class='editor_text'>Горные дороги требуют надежности. Перед каждой арендой мы проверяем:<ul><li>Состояние рулевого управления (важно для серпантинов).</li><li>Работу тормозов и ручного тормоза.</li><li>Исправность светотехники для безопасной езды вечером.</li></ul></div>

<div class='editor_title'>Особенности вождения: советы для Косовщины</div>
<div class='editor_text'><ol><li><span class='text-strong'>Внимание: Базарный день:</span> В субботу утром движение в центре Косова и в районе Смоднянского рынка очень плотное. Планируйте выезд заранее или выбирайте объездные пути.</li><li><span class='text-strong'>Горные повороты:</span> Дорога на Верховину через Буковецкий перевал — это серия крутых поворотов ("тещиных языков"). Не превышайте скорость и держитесь своей полосы.</li><li><span class='text-strong'>Пешеходы и велосипедисты:</span> В селах Косовского района (особенно Космач, Рожнов) обочины часто отсутствуют, поэтому люди ходят по краю проезжей части. Будьте особенно внимательны в темное время суток.</li></ol></div>
`.trim(),
    },
  },
  chortkiv: {
    routeExample: {
      uk: "як модель поводиться на дорогах Поділля",
      ru: "как модель ведёт себя на дорогах Подолья",
      en: "how the model handles Podillia roads",
    },
    routes: {
      uk: "Чортків ↔ Тернопіль, Бучач, Заліщики",
      ru: "Чортков ↔ Тернополь, Бучач, Залещики",
      en: "Chortkiv ↔ Ternopil, Buchach, Zalishchyky",
    },
    weekendTrip: {
      uk: "Дністровський каньйон, Заліщики, Бучач",
      ru: "Днестровский каньон, Залещики, Бучач",
      en: "Dniester Canyon, Zalishchyky, Buchach",
    },
    localAttractions: {
      uk: "центр, замок, автовокзал",
      ru: "центр, замок, автовокзал",
      en: "city center, castle, bus station",
    },
    customEditorContent: {
      uk: `
<div class='editor_text'>REIZ — це сервіс прокату авто в Чорткові, який поєднує європейські стандарти обслуговування з розумінням місцевих доріг. Чортків — це не просто історичний центр, а ідеальна база для старту в напрямку Тернополя, Чернівців чи Дністровського каньйону.<br/>Ми подаємо авто до Замку Гольських, Ратуші, залізничного вокзалу або за будь-якою адресою в місті.</div>

<div class='editor_title'>Погодинний тариф: тест на бруківці</div>
<div class='editor_text'>Погодинна оренда — найкращий спосіб перевірити авто в реальних умовах старого міста. Вам вистачить доби, щоб відчути: як підвіска "ковтає" історичну бруківку біля Домініканського костелу, чи зручно паркуватися біля ринку та як авто поводиться на підйомах. Це чудовий варіант для вирішення термінових справ або зустрічі гостей з потяга.</div>

<div class='editor_title'>Оренда авто на тиждень: Тур Дністровським каньйоном</div>
<div class='editor_text'>Чортків — ворота до природних див регіону. Тижневий тариф дозволить вам побачити все без поспіху. Рекомендований маршрут: Чортків → Джуринський водоспад (Нирків) → Заліщики (панорама) → печера Млинки. Власний автомобіль дає можливість під'їхати максимально близько до водоспадів та кемпінгів, куди не ходить громадський транспорт.</div>

<div class='editor_title'>Оренда авто на місяць: Бізнес-мобільність</div>
<div class='editor_text'>Для тих, хто працює між містами. Чортків розташований на перетині важливих шляхів. Орендоване авто перетворює маршрут Чортків ↔ Тернопіль на 1 годину комфортної їзди. Це вигідне рішення для агробізнесу, торгових представників та релокованих підприємців. Один платіж на місяць закриває всі питання логістики, страхування та сервісу.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Якщо ви плануєте залишитися в Чорткові на сезон або довше, довгострокова оренда — це альтернатива купівлі авто. Ви отримуєте свіжий автомобіль, а ми дбаємо про заміну мастила, фільтрів та сезонної гуми. Ваш бюджет залишається фіксованим і передбачуваним.</div>

<div class='editor_title'>Бюджетний прокат — від $20/доба</div>
<div class='editor_text'>Потрібна економна машина для міста? Наш економ-клас — це компактні авто з мінімальною витратою пального. Ідеально підходять для вузьких вуличок центру та коротких поїздок у сусідні Копичинці чи Бучач.</div>

<div class='editor_title'>Переваги REIZ у Чорткові</div>
<div class='editor_text'><ul><li><span class='text-strong'>Локальна подача:</span> Безкоштовно доставимо авто в межах міста (Центр, Кадуб, Синяково).</li><li><span class='text-strong'>Чесність:</span> Ви отримуєте саме той клас авто, який бронювали. Жодних "сюрпризів" із заміною на дешевшу модель.</li><li><span class='text-strong'>Підтримка:</span> Ми на зв'язку 24/7. Якщо проб'єте колесо десь під Заліщиками — ми підкажемо найближчий шиномонтаж або допоможемо організаційно.</li><li><span class='text-strong'>Без лімітів:</span> Для тривалих поїздок доступні тарифи з безлімітним пробігом.</li></ul></div>

<div class='editor_title'>Без застави / Зменшений депозит</div>
<div class='editor_text'>Ми будуємо стосунки на довірі. Перевірте при бронюванні — для багатьох авто доступна опція оренди зі зниженим депозитом (до 50%) або без застави (для постійних клієнтів).</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Потрібно зустріти делегацію або відсвяткувати подію? Замовте авто з водієм. Ми забезпечимо комфортний трансфер до готелю або ресторану.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>У місті: Подача та повернення в межах Чорткова — безкоштовно.<br/>Регіон: Можлива доставка в Гусятин, Борщів чи Бучач за індивідуальним прорахунком.</div>

<div class='editor_title'>Автомобілі в ідеальному стані</div>
<div class='editor_text'>Ми знаємо стан доріг у районі, тому наші механіки ретельно перевіряють ходову частину (сайлентблоки, амортизатори) після кожного повернення авто. Ви сідаєте в машину, в якій впевнені.</div>

<div class='editor_title'>Специфіка водіння: поради для Чорткова</div>
<div class='editor_text'><ol><li><span class='text-strong'>Історична бруківка:</span> Центр міста вимощений старою бруківкою. У дощ вона стає слизькою, як лід. Збільшуйте дистанцію та гальмуйте плавно.</li><li><span class='text-strong'>Мости через Серет:</span> У місті є вузькі місця на мостах. Будьте уважні до знаків пріоритету руху зустрічного транспорту.</li><li><span class='text-strong'>Сільськогосподарська техніка:</span> У сезон жнив на трасах навколо Чорткова багато габаритної техніки. Будьте обережні при обгонах на трасі М-19.</li></ol></div>
`.trim(),
      en: `
<div class='editor_text'>REIZ offers car rental services in Chortkiv, combining European service standards with an understanding of local roads. Chortkiv is not just a historical center but an ideal base for trips towards Ternopil, Chernivtsi, or the Dniester Canyon.<br/>We deliver cars to the Golski Castle, the City Hall (Ratusha), the Railway Station, or any address in the city.</div>

<div class='editor_title'>Hourly Rate: Cobblestone Test</div>
<div class='editor_text'>Hourly rental is the best way to test a car in the real conditions of the old town. One day is enough to feel how the suspension handles the historic cobblestones near the Dominican Church, how easy it is to park near the market, and how the car behaves on hills. It is a great option for urgent errands or picking up guests from the train.</div>

<div class='editor_title'>Weekly Rental: Dniester Canyon Tour</div>
<div class='editor_text'>Chortkiv is the gateway to the region's natural wonders. A weekly tariff lets you see everything without rushing. Recommended route: Chortkiv → Dzhurynskyi Waterfall (Nyrkiv) → Zalishchyky (Panorama) → Mlynky Cave. A private car allows you to get as close as possible to waterfalls and campsites where public transport does not go.</div>

<div class='editor_title'>Monthly Rental: Business Mobility</div>
<div class='editor_text'>For those working between cities. Chortkiv is located at a crossroads of important routes. A rental car turns the Chortkiv ↔ Ternopil route into a comfortable 1-hour drive. This is a profitable solution for agribusiness, sales representatives, and relocated entrepreneurs. One monthly payment covers logistics, insurance, and service.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>If you plan to stay in Chortkiv for a season or longer, long-term rental is an alternative to buying a car. You get a fresh vehicle, and we take care of oil changes, filters, and seasonal tires. Your budget remains fixed and predictable.</div>

<div class='editor_title'>Budget Rental — From $20/day</div>
<div class='editor_text'>Need an economical car for the city? Our economy class features compact cars with minimal fuel consumption. Perfect for the narrow streets of the center and short trips to nearby Kopychyntsi or Buchach.</div>

<div class='editor_title'>REIZ Advantages in Chortkiv</div>
<div class='editor_text'><ul><li><span class='text-strong'>Local Delivery:</span> Free delivery within the city limits (Center, Kadub, Syniakovo).</li><li><span class='text-strong'>Honesty:</span> You get exactly the car class you booked. No "surprises" with downgrades.</li><li><span class='text-strong'>Support:</span> We are online 24/7. If you have a flat tire near Zalishchyky, we will guide you to the nearest service or help organizationally.</li><li><span class='text-strong'>No Limits:</span> Unlimited mileage tariffs are available for long trips.</li></ul></div>

<div class='editor_title'>No Deposit / Reduced Deposit</div>
<div class='editor_text'>We build relationships on trust. Check when booking — a reduced deposit option (up to 50%) or no deposit (for returning clients) is available for many cars.</div>

<div class='editor_title'>Driver Services</div>
<div class='editor_text'>Need to meet a delegation or celebrate an event? Order a car with a driver. We ensure a comfortable transfer to the hotel or restaurant.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>In the City: Delivery and return within Chortkiv are free.<br/>Region: Delivery to Husiatyn, Borshchiv, or Buchach is possible upon individual calculation.</div>

<div class='editor_title'>Cars in Perfect Condition</div>
<div class='editor_text'>We know the road conditions in the area, so our mechanics thoroughly check the suspension (bushings, shock absorbers) after every return. You get into a car you can trust.</div>

<div class='editor_title'>Driving Specifics: Tips for Chortkiv</div>
<div class='editor_text'><ol><li><span class='text-strong'>Historic Cobblestones:</span> The city center is paved with old stones. In the rain, they become as slippery as ice. Increase your distance and brake gently.</li><li><span class='text-strong'>Bridges over Seret:</span> There are narrow spots on the bridges in the city. Pay attention to priority signs for oncoming traffic.</li><li><span class='text-strong'>Agricultural Machinery:</span> During the harvest season, there is a lot of large machinery on the roads around Chortkiv. Be careful when overtaking on the M-19 highway.</li></ol></div>
`.trim(),
      ru: `
<div class='editor_text'>REIZ — это сервис проката авто в Чорткове, который сочетает европейские стандарты обслуживания с пониманием местных дорог. Чортков — это не просто исторический центр, а идеальная база для старта в направлении Тернополя, Черновцов или Днестровского каньона.<br/>Мы подаем авто к Замку Гольских, Ратуше, ж/д вокзалу или по любому адресу в городе.</div>

<div class='editor_title'>Почасовой тариф: тест на брусчатке</div>
<div class='editor_text'>Почасовая аренда — лучший способ проверить авто в реальных условиях старого города. Вам хватит суток, чтобы почувствовать: как подвеска "глотает" историческую брусчатку возле Доминиканского костела, удобно ли парковаться возле рынка и как авто ведет себя на подъемах. Это отличный вариант для решения срочных дел или встречи гостей с поезда.</div>

<div class='editor_title'>Аренда авто на неделю: Тур по Днестровскому каньону</div>
<div class='editor_text'>Чортков — ворота к природным чудесам региона. Недельный тариф позволит вам увидеть всё без спешки. Рекомендуемый маршрут: Чортков → Джуринский водопад (Нырков) → Залещики (панорама) → пещера Млынки. Личный автомобиль дает возможность подъехать максимально близко к водопадам и кемпингам, куда не ходит общественный транспорт.</div>

<div class='editor_title'>Аренда авто на месяц: Бизнес-мобильность</div>
<div class='editor_text'>Для тех, кто работает между городами. Чортков расположен на пересечении важных путей. Арендованное авто превращает маршрут Чортков ↔ Тернополь в 1 час комфортной езды. Это выгодное решение для агробизнеса, торговых представителей и релоцированных предпринимателей. Один платеж в месяц закрывает все вопросы логистики, страхования и сервиса.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Если вы планируете остаться в Чорткове на сезон или дольше, долгосрочная аренда — это альтернатива покупке авто. Вы получаете свежий автомобиль, а мы заботимся о замене масла, фильтров и сезонной резины. Ваш бюджет остается фиксированным и предсказуемым.</div>

<div class='editor_title'>Бюджетный прокат — от $20/сутки</div>
<div class='editor_text'>Нужна экономная машина для города? Наш эконом-класс — это компактные авто с минимальным расходом топлива. Идеально подходят для узких улочек центра и коротких поездок в соседние Копычинцы или Бучач.</div>

<div class='editor_title'>Преимущества REIZ в Чорткове</div>
<div class='editor_text'><ul><li><span class='text-strong'>Локальная подача:</span> Бесплатно доставим авто в пределах города (Центр, Кадуб, Синяково).</li><li><span class='text-strong'>Честность:</span> Вы получаете именно тот класс авто, который бронировали. Никаких "сюрпризов" с заменой на более дешевую модель.</li><li><span class='text-strong'>Поддержка:</span> Мы на связи 24/7. Если пробьете колесо где-то под Залещиками — мы подскажем ближайший шиномонтаж или поможем организационно.</li><li><span class='text-strong'>Без лимитов:</span> Для длительных поездок доступны тарифы с безлимитным пробегом.</li></ul></div>

<div class='editor_title'>Без залога / Уменьшенный депозит</div>
<div class='editor_text'>Мы строим отношения на доверии. Проверьте при бронировании — для многих авто доступна опция аренды со сниженным депозитом (до 50%) или без залога (для постоянных клиентов).</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Нужно встретить делегацию или отпраздновать событие? Закажите авто с водителем. Мы обеспечим комфортный трансфер в отель или ресторан.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>В городе: Подача и возврат в пределах Чорткова — бесплатно.<br/>Регион: Возможна доставка в Гусятин, Борщев или Бучач по индивидуальному просчету.</div>

<div class='editor_title'>Автомобили в идеальном состоянии</div>
<div class='editor_text'>Мы знаем состояние дорог в районе, поэтому наши механики тщательно проверяют ходовую часть (сайлентблоки, амортизаторы) после каждого возврата авто. Вы садитесь в машину, в которой уверены.</div>

<div class='editor_title'>Специфика вождения: советы для Чорткова</div>
<div class='editor_text'><ol><li><span class='text-strong'>Историческая брусчатка:</span> Центр города вымощен старой брусчаткой. В дождь она становится скользкой, как лед. Увеличивайте дистанцию и тормозите плавно.</li><li><span class='text-strong'>Мосты через Серет:</span> В городе есть узкие места на мостах. Будьте внимательны к знакам приоритета движения встречного транспорта.</li><li><span class='text-strong'>Сельскохозяйственная техника:</span> В сезон жатвы на трассах вокруг Чорткова много габаритной техники. Будьте осторожны при обгонах на трассе М-19.</li></ol></div>
`.trim(),
    },
  },
  kremenets: {
    routeExample: {
      uk: "як модель поводиться на пагорбах Кременецьких гір",
      ru: "как модель ведёт себя на холмах Кременецких гор",
      en: "how the model handles Kremenets hills",
    },
    routes: {
      uk: "Кременець ↔ Почаїв, Тернопіль, Дубно",
      ru: "Кременец ↔ Почаев, Тернополь, Дубно",
      en: "Kremenets ↔ Pochaiv, Ternopil, Dubno",
    },
    weekendTrip: {
      uk: "Почаївська лавра, Замкова гора",
      ru: "Почаевская лавра, Замковая гора",
      en: "Pochaiv Lavra, Castle Hill",
    },
    localAttractions: {
      uk: "центр, Замкова гора, колегіум",
      ru: "центр, Замковая гора, коллегиум",
      en: "city center, Castle Hill, collegium",
    },
    customEditorContent: {
      uk: `
<div class='editor_text'>REIZ — це прокат авто в Кременці, який розуміє специфіку місцевих доріг. Це місто крутих підйомів та вузьких історичних вулиць, тому ми пропонуємо автомобілі, які впевнено почуваються на серпантинах Замкової гори та бруківці центру.<br/>Ми подаємо авто до Єзуїтського колегіуму, автовокзалу, підніжжя гори Бона або за вашою адресою.</div>

<div class='editor_title'>Погодинний тариф: тест на витривалість</div>
<div class='editor_text'>Кременець — ідеальний полігон для перевірки авто. Візьміть машину на добу, щоб протестувати її на крутому підйомі до руїн замку. Ви одразу зрозумієте: чи добре тримає ручне гальмо, чи вистачає тяги двигуну і чи зручно вам паркуватися на похилих вулицях. Це найкращий спосіб переконатися в надійності машини перед поїздкою до Почаєва чи джерела Святої Анни.</div>

<div class='editor_title'>Оренда авто на тиждень: історичний маршрут</div>
<div class='editor_text'>Тижневий прокат дозволяє охопити "Золоте кільце" регіону без прив'язки до екскурсійних автобусів. Ваш маршрут: Кременець → Почаївська Лавра → Вишнівецький палац → Дубенський замок. Ви зможете зустріти схід сонця на Божій горі або заїхати в Білокриницю, не хвилюючись про розклад маршруток.</div>

<div class='editor_title'>Оренда авто на місяць: мобільність між областями</div>
<div class='editor_text'>Кременець розташований на стику Тернопільської, Рівненської та Хмельницької областей. Місячна оренда — це стратегічне рішення для бізнесу. Маршрути Кременець ↔ Тернопіль або Кременець ↔ Рівне стають швидкими та комфортними. Єдиний платіж покриває страховку та сервіс. Якщо вам потрібно справити враження на партнерів, ми підберемо авто бізнес-класу.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Живете в Кременці, але не хочете купувати власне авто? Довгострокова оренда знімає головний біль водіїв цього регіону — обслуговування ходової та заміну зчеплення (яке страждає від гірської їзди). Ми беремо на себе всі технічні питання. Ви просто заправляєтесь і їздите.</div>

<div class='editor_title'>Бюджетний прокат — від $20/доба</div>
<div class='editor_text'>Для студентів (поруч гуманітарна академія) та економних подорожей. Наш економ-клас — це компактні, але жваві автомобілі, які легко розминаються із зустрічним транспортом на вузьких вуличках старого міста.</div>

<div class='editor_title'>Чому обирають REIZ у Кременці</div>
<div class='editor_text'><ul><li><span class='text-strong'>Технічна впевненість:</span> Враховуючи рельєф, ми особливо ретельно перевіряємо зчеплення та гальмівну систему.</li><li><span class='text-strong'>Допомога на старті:</span> Більшість наших авто оснащені системою допомоги при старті вгору (Hill Start Assist), що незамінно в Кременці.</li><li><span class='text-strong'>Подача до пам'яток:</span> Можемо передати ключі прямо біля Ботанічного саду чи музею Юліуша Словацького.</li><li><span class='text-strong'>Прозорість:</span> Ви платите лише за оренду. Жодних прихованих комісій за "складність маршруту".</li></ul></div>

<div class='editor_title'>Без застави / Зменшений депозит</div>
<div class='editor_text'>Ми робимо прокат доступним. Для багатьох моделей доступна опція оренди зі знижкою на депозит (до 50%) або без застави. Перевірте умови для вашого стажу на сайті.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Не впевнені, що зможете впевнено керувати на крутих серпантинах взимку чи в дощ? Замовте авто з досвідченим водієм, який знає кожну яму та поворот у місті.</div>

<div class='editor_title'>Безкоштовна доставка</div>
<div class='editor_text'>У місті: Подача та повернення в межах Кременця — безкоштовно.<br/>Регіон: Доставка в Почаїв, Шумськ чи Вишнівець можлива за окремим тарифом.</div>

<div class='editor_title'>Автомобілі в ідеальному стані</div>
<div class='editor_text'>Гори перевіряють техніку на міцність. Тому після кожного клієнта ми проводимо діагностику ходової та перевіряємо рівень гальмівної рідини. Салон завжди чистий і свіжий.</div>

<div class='editor_title'>Специфіка водіння: поради для Кременця</div>
<div class='editor_text'><ol><li><span class='text-strong'>Рушання під гору:</span> Це головна навичка у місті. Тримайте дистанцію до авто попереду значно більшу, ніж зазвичай, адже на світлофорі машина попереду може трохи відкотитися назад.</li><li><span class='text-strong'>Вузькі вулиці:</span> Центр міста має дуже щільну забудову. Паркуйтеся лише у дозволених місцях, щоб не заблокувати проїзд туристичним автобусам.</li><li><span class='text-strong'>Бруківка та дощ:</span> Історична бруківка на спусках стає дуже слизькою. Гальмуйте двигуном і уникайте різких маневрів у вологу погоду.</li></ol></div>
`.trim(),
      en: `
<div class='editor_text'>REIZ is a car rental service in Kremenets that understands the specifics of local roads. This city is known for steep climbs and narrow historic streets, so we offer cars that feel confident on the serpentines of Castle Hill and the cobblestones of the center.<br/>We deliver cars to the Jesuit Collegium, the Bus Station, the foot of Mount Bona, or your specific address.</div>

<div class='editor_title'>Hourly Rate: Endurance Test</div>
<div class='editor_text'>Kremenets is an ideal proving ground for cars. Rent a vehicle for a day to test it on the steep climb to the castle ruins. You will immediately understand: does the handbrake hold well, does the engine have enough torque, and is it comfortable to park on inclined streets. It is the best way to verify the car's reliability before a trip to Pochaiv or the Spring of St. Anne.</div>

<div class='editor_title'>Weekly Rental: Historical Route</div>
<div class='editor_text'>Weekly rental allows you to cover the region's "Golden Ring" without relying on tour buses. Your route: Kremenets → Pochaiv Lavra → Vyshnivets Palace → Dubno Castle. You can watch the sunrise on Bozha Hill or visit Bilokrynytsia without worrying about bus schedules.</div>

<div class='editor_title'>Monthly Rental: Inter-Regional Mobility</div>
<div class='editor_text'>Kremenets is located at the junction of Ternopil, Rivne, and Khmelnytskyi regions. Monthly rental is a strategic decision for business. Routes Kremenets ↔ Ternopil or Kremenets ↔ Rivne become fast and comfortable. A single payment covers insurance and service. If you need to impress partners, we will select a business-class car.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>Living in Kremenets but don't want to buy a car? Long-term rental removes the main headache for drivers in this region — suspension maintenance and clutch replacement (which suffers from mountain driving). We take care of all technical issues. You just refuel and drive.</div>

<div class='editor_title'>Budget Rental — From $20/day</div>
<div class='editor_text'>For students (Humanitarian Academy is nearby) and budget travels. Our economy class features compact but lively cars that easily pass oncoming traffic on the narrow streets of the old town.</div>

<div class='editor_title'>Why Choose REIZ in Kremenets</div>
<div class='editor_text'><ul><li><span class='text-strong'>Technical Confidence:</span> Given the terrain, we meticulously check the clutch and braking system.</li><li><span class='text-strong'>Hill Start Help:</span> Most of our cars are equipped with Hill Start Assist, which is indispensable in Kremenets.</li><li><span class='text-strong'>Landmark Delivery:</span> We can hand over keys right next to the Botanical Garden or Juliusz Słowacki Museum.</li><li><span class='text-strong'>Transparency:</span> You pay only for the rental. No hidden fees for "route complexity."</li></ul></div>

<div class='editor_title'>No Deposit / Reduced Deposit</div>
<div class='editor_text'>We make rental accessible. For many models, a discounted deposit option (up to 50%) or no deposit is available. Check the conditions for your driving experience on the website.</div>

<div class='editor_title'>Driver Services</div>
<div class='editor_text'>Not sure you can handle steep serpentines in winter or rain? Order a car with an experienced driver who knows every pothole and turn in the city.</div>

<div class='editor_title'>Free Delivery</div>
<div class='editor_text'>In the City: Delivery and return within Kremenets limits are free.<br/>Region: Delivery to Pochaiv, Shumsk, or Vyshnivets is available at a separate rate.</div>

<div class='editor_title'>Cars in Perfect Condition</div>
<div class='editor_text'>Hills test the machinery. Therefore, after every client, we diagnose the suspension and check brake fluid levels. The interior is always clean and fresh.</div>

<div class='editor_title'>Driving Specifics: Tips for Kremenets</div>
<div class='editor_text'><ol><li><span class='text-strong'>Hill Starts:</span> This is the #1 skill in the city. Keep a much larger distance to the car in front than usual, as vehicles may roll back slightly at traffic lights.</li><li><span class='text-strong'>Narrow Streets:</span> The city center is densely built. Park only in designated areas to avoid blocking tourist buses.</li><li><span class='text-strong'>Cobblestones and Rain:</span> Historic cobblestones on descents become very slippery. Use engine braking and avoid sudden maneuvers in wet weather.</li></ol></div>
`.trim(),
      ru: `
<div class='editor_text'>REIZ — это прокат авто в Кременце, который понимает специфику местных дорог. Это город крутых подъемов и узких исторических улиц, поэтому мы предлагаем автомобили, которые уверенно чувствуют себя на серпантинах Замковой горы и брусчатке центра.<br/>Мы подаем авто к Иезуитскому коллегиуму, автовокзалу, подножию горы Бона или по вашему адресу.</div>

<div class='editor_title'>Почасовой тариф: тест на выносливость</div>
<div class='editor_text'>Кременец — идеальный полигон для проверки авто. Возьмите машину на сутки, чтобы протестировать ее на крутом подъеме к руинам замка. Вы сразу поймете: хорошо ли держит ручник, хватает ли тяги двигателю и удобно ли вам парковаться на наклонных улицах. Это лучший способ убедиться в надежности машины перед поездкой в Почаев или к источнику Святой Анны.</div>

<div class='editor_title'>Аренда авто на неделю: исторический маршрут</div>
<div class='editor_text'>Недельный прокат позволяет охватить "Золотое кольцо" региона без привязки к экскурсионным автобусам. Ваш маршрут: Кременец → Почаевская Лавра → Вишневецкий дворец → Дубенский замок. Вы сможете встретить рассвет на Божьей горе или заехать в Белокриницу, не волнуясь о расписании маршруток.</div>

<div class='editor_title'>Аренда авто на месяц: мобильность между областями</div>
<div class='editor_text'>Кременец расположен на стыке Тернопольской, Ровенской и Хмельницкой областей. Месячная аренда — это стратегическое решение для бизнеса. Маршруты Кременец ↔ Тернополь или Кременец ↔ Ровно становятся быстрыми и комфортными. Единый платеж покрывает страховку и сервис. Если вам нужно произвести впечатление на партнеров, мы подберем авто бизнес-класса.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Живете в Кременце, но не хотите покупать свое авто? Долгосрочная аренда снимает главную головную боль водителей этого региона — обслуживание ходовой и замену сцепления (которое страдает от горной езды). Мы берем на себя все технические вопросы. Вы просто заправляетесь и ездите.</div>

<div class='editor_title'>Бюджетный прокат — от $20/сутки</div>
<div class='editor_text'>Для студентов (рядом гуманитарная академия) и экономных путешествий. Наш эконом-класс — это компактные, но резвые автомобили, которые легко разъезжаются со встречным транспортом на узких улочках старого города.</div>

<div class='editor_title'>Почему выбирают REIZ в Кременце</div>
<div class='editor_text'><ul><li><span class='text-strong'>Техническая уверенность:</span> Учитывая рельеф, мы особенно тщательно проверяем сцепление и тормозную систему.</li><li><span class='text-strong'>Помощь на старте:</span> Большинство наших авто оснащены системой помощи при старте вверх (Hill Start Assist), что незаменимо в Кременце.</li><li><span class='text-strong'>Подача к достопримечательностям:</span> Можем передать ключи прямо у Ботанического сада или музея Юлиуша Словацкого.</li><li><span class='text-strong'>Прозрачность:</span> Вы платите только за аренду. Никаких скрытых комиссий за "сложность маршрута".</li></ul></div>

<div class='editor_title'>Без залога / Уменьшенный депозит</div>
<div class='editor_text'>Мы делаем прокат доступным. Для многих моделей доступна опция аренды со скидкой на депозит (до 50%) или без залога. Проверьте условия для вашего стажа на сайте.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Не уверены, что сможете уверенно рулить на крутых серпантинах зимой или в дождь? Закажите авто с опытным водителем, который знает каждую яму и поворот в городе.</div>

<div class='editor_title'>Бесплатная доставка</div>
<div class='editor_text'>В городе: Подача и возврат в черте Кременца — бесплатно.<br/>Регион: Доставка в Почаев, Шумск или Вишневец возможна по отдельному тарифу.</div>

<div class='editor_title'>Автомобили в идеальном состоянии</div>
<div class='editor_text'>Горы проверяют технику на прочность. Поэтому после каждого клиента мы проводим диагностику ходовой и проверяем уровень тормозной жидкости. Салон всегда чистый и свежий.</div>

<div class='editor_title'>Специфика вождения: советы для Кременца</div>
<div class='editor_text'><ol><li><span class='text-strong'>Трогание под гору:</span> Это главный навык в городе. Держите дистанцию до авто впереди значительно больше обычной, так как на светофоре машина впереди может немного откатиться назад.</li><li><span class='text-strong'>Узкие улицы:</span> Центр города имеет очень плотную застройку. Паркуйтесь только в разрешенных местах, чтобы не заблокировать проезд туристическим автобусам.</li><li><span class='text-strong'>Брусчатка и дождь:</span> Историческая брусчатка на спусках становится очень скользкой. Тормозите двигателем и избегайте резких маневров во влажную погоду.</li></ol></div>
`.trim(),
    },
  },
  berehove: {
    routeExample: {
      uk: "як модель поводиться на прикордонних дорогах і трасі до Мукачево",
      ru: "как модель ведёт себя на приграничных дорогах и трассе до Мукачева",
      en: "how the model handles border roads and the route to Mukachevo",
    },
    routes: {
      uk: "Берегове ↔ Мукачево, Ужгород, кордон",
      ru: "Берегово ↔ Мукачево, Ужгород, граница",
      en: "Berehove ↔ Mukachevo, Uzhhorod, border",
    },
    weekendTrip: {
      uk: "термальні басейни, винні дегустації",
      ru: "термальные бассейны, винные дегустации",
      en: "thermal pools, wine tastings",
    },
    localAttractions: {
      uk: "центр, термальні басейни, винні підвали",
      ru: "центр, термальные бассейны, винные подвалы",
      en: "city center, thermal pools, wine cellars",
    },
    customEditorContent: {
      uk: `
<div class='editor_text'>REIZ — це прокат авто в Берегові, адаптований до ритму прикордонного міста. Тут особлива атмосфера: угорська архітектура, термальні джерела та активний рух у бік кордону. Ми пропонуємо авто, які ідеально вписуються в цей контекст.<br/>Ми подаємо авто до термального комплексу "Жайворонок", спортбази "Закарпаття", автостанції або прямо до вашого готелю.</div>

<div class='editor_title'>Погодинний тариф: комфортний візит</div>
<div class='editor_text'>Приїхали потягом, але хочете встигнути і в басейн, і на дегустацію в "Шато Чизай"? Погодинна оренда вирішує це питання. За добу ви встигнете: з'їздити в Косино (всього 20 км), повернутися на вечерю в центр Берегова та зустріти друзів з кордону. Це зручніше, ніж таксі, особливо коли у вас із собою сумки з рушниками та купальниками після термалів.</div>

<div class='editor_title'>Оренда авто на тиждень: винний та гастро-тур</div>
<div class='editor_text'>Берегівщина — це край виноградників. Тижневий тариф — ваш квиток у гастрономічну подорож. Маршрут: Берегове → Косино (термали) → Мукачево (Замок Паланок) → Виноградів (ферма буйволів). Ви зможете заїхати в приватні винні підвали у селах Бене чи Кідьош, куди не зручно добиратися громадським транспортом.</div>

<div class='editor_title'>Оренда авто на місяць: бізнес на кордоні</div>
<div class='editor_text'>Берегове — важливий логістичний вузол біля КПП "Лужанка". Місячна оренда підходить для підприємців, експедиторів та тих, хто займається зовнішньоекономічною діяльністю. Маршрут Берегове ↔ Ужгород або Берегове ↔ Чоп стане швидшим. Ми забезпечуємо технічну справність, щоб ви не втрачали час у дорозі.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Ідеально для тих, хто релокував бізнес або сім'ю на Закарпаття. Ви отримуєте персональне авто без необхідності його купувати. Ми беремо на себе сезонну заміну гуми та техогляд. Ваша задача — лише заправляти авто та насолоджуватися м'яким кліматом регіону.</div>

<div class='editor_title'>Бюджетний прокат — від $20/доба</div>
<div class='editor_text'>Вулиці Берегова місцями вузькі та з одностороннім рухом. Наш економ-клас — це компактні авто, які легко припаркувати біля ринку або в центрі біля костелу, і які споживають мінімум пального.</div>

<div class='editor_title'>Чому обирають REIZ у Берегові</div>
<div class='editor_text'><ul><li><span class='text-strong'>Клімат-контроль:</span> У Берегові влітку буває дуже спекотно (це найтепліший регіон Західної України). Усі наші авто мають справні кондиціонери.</li><li><span class='text-strong'>Місткий багажник:</span> Навіть у компактних авто вистачить місця для покупок, валіз та сувенірного вина.</li><li><span class='text-strong'>Чистота:</span> Після відвідування термалів важливо сісти в чистий, сухий салон. Ми за цим слідкуємо суворо.</li><li><span class='text-strong'>Без лімітів:</span> Тарифи з безлімітним пробігом для тих, хто хоче об'їхати все Закарпаття.</li></ul></div>

<div class='editor_title'>Без застави / Зменшений депозит</div>
<div class='editor_text'>Сервіс європейського рівня. Для багатьох авто доступна опція оренди без застави або зі зменшеним депозитом. Це зручно, якщо ви не хочете "заморожувати" кошти під час відпочинку.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Плануєте дегустацію закарпатських вин? Не ризикуйте правами та безпекою. Замовте авто з водієм, який розвезе вашу компанію по найкращих підвалах регіону.</div>

<div class='editor_title'>Безкоштовна доставка</div>
<div class='editor_text'>У місті: Подача та повернення в межах Берегова — безкоштовно.<br/>Регіон: Доставка в Косино, Дийду (озеро) або на КПП "Лужанка" можлива за індивідуальним тарифом.</div>

<div class='editor_title'>Автомобілі в ідеальному стані</div>
<div class='editor_text'>Ми перевіряємо систему охолодження двигуна та кондиціонер (важливо для місцевого клімату). Ви отримуєте надійне авто, готове до доріг будь-якої якості.</div>

<div class='editor_title'>Специфіка водіння: поради для Берегова</div>
<div class='editor_text'><ol><li><span class='text-strong'>Обережно, велосипедисти!</span> Берегове — "найбільш велосипедне" місто регіону через рівнинний рельєф. Велосипедисти тут усюди, часто без світловідбивачів ввечері. Будьте максимально уважні при обгонах та поворотах праворуч.</li><li><span class='text-strong'>Бруківка в центрі:</span> Центральна частина міста вимощена бруківкою. У дощ вона слизька, а гальмівний шлях збільшується.</li><li><span class='text-strong'>Прикордонний трафік:</span> На виїзді з міста в бік кордону (вул. Сечені) можливі черги з авто. Враховуйте це при плануванні часу.</li></ol></div>
`.trim(),
      en: `
<div class='editor_text'>REIZ is a car rental service in Berehove adapted to the rhythm of a border town. Here you find a unique atmosphere: Hungarian architecture, thermal springs, and active traffic towards the border. We offer cars that fit perfectly into this context.<br/>We deliver cars to the "Zhayvoronok" Thermal Complex, "Zakarpattia" Sports Base, the Bus Station, or directly to your hotel.</div>

<div class='editor_title'>Hourly Rate: Comfortable Visit</div>
<div class='editor_text'>Arrived by train but want to visit both the pool and a wine tasting at "Chateau Chizay"? Hourly rental solves this. In 24 hours, you can drive to Kosino (just 20 km away), return for dinner in Berehove center, and pick up friends from the border. It's more convenient than a taxi, especially when carrying bags with wet towels and swimsuits after the thermal baths.</div>

<div class='editor_title'>Weekly Rental: Wine & Gastro Tour</div>
<div class='editor_text'>Berehove region is the land of vineyards. The weekly tariff is your ticket to a gastronomic journey. Route: Berehove → Kosino (Thermal Waters) → Mukachevo (Palanok Castle) → Vynohradiv (Buffalo Farm). You can visit private wine cellars in Bene or Kidyosh villages, which are hard to reach by public transport.</div>

<div class='editor_title'>Monthly Rental: Business on the Border</div>
<div class='editor_text'>Berehove is an important logistics hub near the "Luzhanka" checkpoint. Monthly rental suits entrepreneurs, forwarders, and those involved in foreign trade. The Berehove ↔ Uzhhorod or Berehove ↔ Chop route becomes faster. We ensure technical reliability so you don't lose time on the road.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>Ideal for those who have relocated their business or family to Transcarpathia. You get a personal car without buying one. We handle seasonal tire changes and maintenance. Your task is only to refuel and enjoy the region's mild climate.</div>

<div class='editor_title'>Budget Rental — From $20/day</div>
<div class='editor_text'>Berehove streets can be narrow and one-way. Our economy class features compact cars that are easy to park near the market or the church in the center, consuming minimal fuel.</div>

<div class='editor_title'>Why Choose REIZ in Berehove</div>
<div class='editor_text'><ul><li><span class='text-strong'>Climate Control:</span> Berehove can be very hot in summer (it's the warmest region in Western Ukraine). All our cars have working A/C.</li><li><span class='text-strong'>Spacious Trunk:</span> Even compact cars have enough room for shopping, suitcases, and souvenir wine.</li><li><span class='text-strong'>Cleanliness:</span> After visiting thermal pools, it's important to get into a clean, dry interior. We monitor this strictly.</li><li><span class='text-strong'>No Limits:</span> Unlimited mileage tariffs for those who want to drive all over Transcarpathia.</li></ul></div>

<div class='editor_title'>No Deposit / Reduced Deposit</div>
<div class='editor_text'>European-level service. For many cars, a no-deposit or reduced-deposit option is available. Convenient if you don't want to "freeze" funds during your vacation.</div>

<div class='editor_title'>Driver Services</div>
<div class='editor_text'>Planning a Transcarpathian wine tasting? Don't risk your license and safety. Order a car with a driver who will take your company to the best cellars in the region.</div>

<div class='editor_title'>Free Delivery</div>
<div class='editor_text'>In the City: Delivery and return within Berehove limits are free.<br/>Region: Delivery to Kosino, Dyida (lake), or "Luzhanka" Checkpoint is possible at an individual rate.</div>

<div class='editor_title'>Cars in Perfect Condition</div>
<div class='editor_text'>We check the engine cooling system and air conditioning (crucial for the local climate). You get a reliable car ready for roads of any quality.</div>

<div class='editor_title'>Driving Specifics: Tips for Berehove</div>
<div class='editor_text'><ol><li><span class='text-strong'>Watch Out for Cyclists!</span> Berehove is the most "bicycle-friendly" city in the region due to its flat terrain. Cyclists are everywhere, often without reflectors at night. Be extremely careful when overtaking and turning right.</li><li><span class='text-strong'>Cobblestones in the Center:</span> The central part of the city is paved with cobblestones. In the rain, they are slippery, and the braking distance increases.</li><li><span class='text-strong'>Border Traffic:</span> On the exit from the city towards the border (Secheni St.), traffic queues are possible. Consider this when planning your time.</li></ol></div>
`.trim(),
      ru: `
<div class='editor_text'>REIZ — это прокат авто в Берегово, адаптированный к ритму приграничного города. Здесь особая атмосфера: венгерская архитектура, термальные источники и активное движение в сторону границы. Мы предлагаем авто, которые идеально вписываются в этот контекст.<br/>Мы подаем авто к термальному комплексу "Жаворонок", спортбазе "Закарпатье", автостанции или прямо к вашему отелю.</div>

<div class='editor_title'>Почасовой тариф: комфортный визит</div>
<div class='editor_text'>Приехали поездом, но хотите успеть и в бассейн, и на дегустацию в "Шато Чизай"? Почасовая аренда решает этот вопрос. За сутки вы успеете: съездить в Косино (всего 20 км), вернуться на ужин в центр Берегово и встретить друзей с границы. Это удобнее такси, особенно когда у вас с собой сумки с полотенцами и купальниками после термалов.</div>

<div class='editor_title'>Аренда авто на неделю: винный и гастро-тур</div>
<div class='editor_text'>Береговщина — это край виноградников. Недельный тариф — ваш билет в гастрономическое путешествие. Маршрут: Берегово → Косино (термалы) → Мукачево (Замок Паланок) → Виноградов (ферма буйволов). Вы сможете заехать в частные винные подвалы в селах Бене или Кидеш, куда неудобно добираться общественным транспортом.</div>

<div class='editor_title'>Аренда авто на месяц: бизнес на границе</div>
<div class='editor_text'>Берегово — важный логистический узел возле КПП "Лужанка". Месячная аренда подходит для предпринимателей, экспедиторов и тех, кто занимается внешнеэкономической деятельностью. Маршрут Берегово ↔ Ужгород или Берегово ↔ Чоп станет быстрее. Мы обеспечиваем техническую исправность, чтобы вы не теряли время в дороге.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Идеально для тех, кто релоцировал бизнес или семью в Закарпатье. Вы получаете персональное авто без необходимости его покупать. Мы берем на себя сезонную замену резины и техосмотр. Ваша задача — только заправлять авто и наслаждаться мягким климатом региона.</div>

<div class='editor_title'>Бюджетный прокат — от $20/сутки</div>
<div class='editor_text'>Улицы Берегово местами узкие и с односторонним движением. Наш эконом-класс — это компактные авто, которые легко припарковать у рынка или в центре возле костела, и которые потребляют минимум топлива.</div>

<div class='editor_title'>Почему выбирают REIZ в Берегово</div>
<div class='editor_text'><ul><li><span class='text-strong'>Климат-контроль:</span> В Берегово летом бывает очень жарко (это самый теплый регион Западной Украины). Все наши авто имеют исправные кондиционеры.</li><li><span class='text-strong'>Вместительный багажник:</span> Даже в компактных авто хватит места для покупок, чемоданов и сувенирного вина.</li><li><span class='text-strong'>Чистота:</span> После посещения термалов важно сесть в чистый, сухой салон. Мы за этим следим строго.</li><li><span class='text-strong'>Без лимитов:</span> Тарифы с безлимитным пробегом для тех, кто хочет объехать все Закарпатье.</li></ul></div>

<div class='editor_title'>Без залога / Уменьшенный депозит</div>
<div class='editor_text'>Сервис европейского уровня. Для многих авто доступна опция аренды без залога или со сниженным депозитом. Это удобно, если вы не хотите "замораживать" средства во время отдыха.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Планируете дегустацию закарпатских вин? Не рискуйте правами и безопасностью. Закажите авто с водителем, который развезет вашу компанию по лучшим подвалам региона.</div>

<div class='editor_title'>Бесплатная доставка</div>
<div class='editor_text'>В городе: Подача и возврат в пределах Берегово — бесплатно.<br/>Регион: Доставка в Косино, Дыйду (озеро) или на КПП "Лужанка" возможна по индивидуальному тарифу.</div>

<div class='editor_title'>Автомобили в идеальном состоянии</div>
<div class='editor_text'>Мы проверяем систему охлаждения двигателя и кондиционер (важно для местного климата). Вы получаете надежное авто, готовое к дорогам любого качества.</div>

<div class='editor_title'>Специфика вождения: советы для Берегово</div>
<div class='editor_text'><ol><li><span class='text-strong'>Осторожно, велосипедисты!</span> Берегово — самый "велосипедный" город региона из-за равнинного рельефа. Велосипедисты здесь повсюду, часто без светоотражателей вечером. Будьте максимально внимательны при обгонах и поворотах направо.</li><li><span class='text-strong'>Брусчатка в центре:</span> Центральная часть города вымощена брусчаткой. В дождь она скользкая, а тормозной путь увеличивается.</li><li><span class='text-strong'>Приграничный трафик:</span> На выезде из города в сторону границы (ул. Сечени) возможны очереди из авто. Учитывайте это при планировании времени.</li></ol></div>
`.trim(),
    },
  },
  khust: {
    routeExample: {
      uk: "як модель поводиться на гірських дорогах Закарпаття",
      ru: "как модель ведёт себя на горных дорогах Закарпатья",
      en: "how the model handles Zakarpattia mountain roads",
    },
    routes: {
      uk: "Хуст ↔ Мукачево, Ужгород, Рахів",
      ru: "Хуст ↔ Мукачево, Ужгород, Рахов",
      en: "Khust ↔ Mukachevo, Uzhhorod, Rakhiv",
    },
    weekendTrip: {
      uk: "Долина нарцисів, Синевир",
      ru: "Долина нарциссов, Синевир",
      en: "Valley of Daffodils, Synevyr",
    },
    localAttractions: {
      uk: "центр, Хустський замок, автовокзал",
      ru: "центр, Хустский замок, автовокзал",
      en: "city center, Khust Castle, bus station",
    },
    customEditorContent: {
      uk: `
<div class='editor_text'>REIZ пропонує автопрокат у Хусті — місті, яке є ідеальною точкою для старту подорожей Карпатами. Звідси однаково зручно їхати і до високогір'я (Синевир), і до курортної зони (Шаян). Ми підготували автопарк, який витримає будь-який із цих маршрутів.<br/>Ми подаємо авто до Хустського замку, залізничного вокзалу, готелю "Карпати" або за вашою адресою.</div>

<div class='editor_title'>Погодинний тариф: тестуємо на серпантинах</div>
<div class='editor_text'>Погодинна оренда — це можливість перевірити авто перед поїздкою в гори. За добу ви встигнете проїхати до села Іза (центр лозоплетіння) та піднятися до оленячої ферми. Це дозволить оцінити, чи комфортно вам керувати обраною моделлю на вузьких дорогах.</div>

<div class='editor_title'>Оренда авто на тиждень: курортний тур</div>
<div class='editor_text'>Тижневий тариф — найвигідніший для тих, хто приїхав на лікування чи відпочинок. Маршрут: Хуст → Велятино (термальні води) → Шаян (мінеральні води) → Долина нарцисів (у сезон). Вам не потрібно підлаштовуватися під розклад санаторних автобусів. Ви самі вирішуєте, скільки часу провести в басейні.</div>

<div class='editor_title'>Оренда авто на місяць: для бізнесу та життя</div>
<div class='editor_text'>Хуст — активне торгове місто. Місячна оренда підходить для торгових представників, які працюють по всьому району (Тячів, Виноградів). Це дешевше, ніж утримувати власне авто, адже ми беремо на себе всі витрати на обслуговування.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Рішення для тих, хто переїхав до Хуста надовго. Ви отримуєте надійний транспорт без першого внеску (як при лізингу) та бюрократії. Ми слідкуємо за тим, щоб страховка була дійсною, а шини — по сезону.</div>

<div class='editor_title'>Бюджетний прокат — від $20/доба</div>
<div class='editor_text'>Для поїздок містом та в сусідні села (Сокирниця, Крайниково) ідеально підійде наш економ-клас. Це надійні авто з низькою витратою пального, які легко маневрують у центрі Хуста.</div>

<div class='editor_title'>Чому обирають REIZ у Хусті</div>
<div class='editor_text'><ul><li><span class='text-strong'>Готовність до гір:</span> Наші авто перевірені на підйомах. Гальма та система охолодження працюють ідеально.</li><li><span class='text-strong'>Зручна логістика:</span> Ми знаходимось поруч з основними транспортними розв'язками.</li><li><span class='text-strong'>Підтримка:</span> Якщо ви заблукаєте в горах або проб'єте колесо — ми на зв'язку 24/7 і допоможемо.</li></ul></div>

<div class='editor_title'>Без застави / Зменшений депозит</div>
<div class='editor_text'>Ми розуміємо, що у відпустці кожна гривня важлива. Тому пропонуємо оренду зі зниженим депозитом або без застави для перевірених клієнтів.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Хочете відвідати сироварню в Нижньому Селищі з дегустацією? Замовте авто з водієм, щоб не відмовляти собі у задоволенні.</div>

<div class='editor_title'>Безкоштовна доставка</div>
<div class='editor_text'>У місті: Подача та повернення в межах Хуста — безкоштовно.<br/>Регіон: Доставка у Шаян, Вишково чи Велятино розраховується окремо.</div>

<div class='editor_title'>Автомобілі в ідеальному стані</div>
<div class='editor_text'>Перед кожною орендою ми миємо авто та проводимо дезінфекцію салону. Технічний стан перевіряється за чек-листом (ходова, рідини, електроніка).</div>

<div class='editor_title'>Специфіка водіння: поради для Хустського району</div>
<div class='editor_text'><ol><li><span class='text-strong'>Обережно на перевалах:</span> Дорога на Синевир через Міжгір'я дуже мальовнича, але має багато крутих поворотів. Не розганяйтеся на спусках.</li><li><span class='text-strong'>Домашні тварини:</span> У селах навколо Хуста (особливо в Ізі та Нанково) на дорогу часто виходять корови та коні. Будьте уважні, особливо вранці та ввечері.</li><li><span class='text-strong'>Якість покриття:</span> Основні траси (Н-09) у хорошому стані, але дорога до Долини нарцисів або другорядні шляхи можуть мати ями. Обирайте швидкість відповідно до умов.</li></ol></div>
`.trim(),
      en: `
<div class='editor_text'>REIZ offers car rental in Khust — the perfect starting point for trips around the Carpathian Mountains. From here, it is equally convenient to drive to the highlands (Synevir) and the resort area (Shayan). We have prepared a fleet ready for any of these routes.<br/>We deliver cars to Khust Castle, the Railway Station, Hotel "Karpaty", or your address.</div>

<div class='editor_title'>Hourly Rate: Testing on Serpentines</div>
<div class='editor_text'>Hourly rental is an opportunity to check the car before a trip to the mountains. In 24 hours, you can drive to Iza village (wickerwork center) and visit the Deer Farm. This allows you to assess if you are comfortable driving the chosen model on narrow roads.</div>

<div class='editor_title'>Weekly Rental: Resort Tour</div>
<div class='editor_text'>The weekly tariff is most profitable for those who came for treatment or vacation. Route: Khust → Velyatyno (Thermal Waters) → Shayan (Mineral Waters) → Valley of Narcissi (in season). You don't need to adjust to the schedule of sanatorium buses. You decide how much time to spend in the pool.</div>

<div class='editor_title'>Monthly Rental: For Business & Life</div>
<div class='editor_text'>Khust is an active trading city. Monthly rental suits sales representatives working throughout the district (Tiachiv, Vynohradiv). It is cheaper than maintaining your own car, as we cover all maintenance costs.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>A solution for those who moved to Khust for a long time. You get reliable transport without a down payment (like in leasing) and bureaucracy. We ensure that insurance is valid and tires are appropriate for the season.</div>

<div class='editor_title'>Budget Rental — From $20/day</div>
<div class='editor_text'>For trips around the city and to neighboring villages (Sokyrnytsia, Krainykovo), our economy class is perfect. These are reliable cars with low fuel consumption that maneuver easily in the center of Khust.</div>

<div class='editor_title'>Why Choose REIZ in Khust</div>
<div class='editor_text'><ul><li><span class='text-strong'>Mountain Ready:</span> Our cars are tested on climbs. Brakes and cooling systems work perfectly.</li><li><span class='text-strong'>Convenient Logistics:</span> We are located near major transport interchanges.</li><li><span class='text-strong'>Support:</span> If you get lost in the mountains or have a flat tire — we are online 24/7 to help.</li></ul></div>

<div class='editor_title'>No Deposit / Reduced Deposit</div>
<div class='editor_text'>We understand that every hryvnia counts on vacation. Therefore, we offer rental with a reduced deposit or no deposit for verified clients.</div>

<div class='editor_title'>Driver Services</div>
<div class='editor_text'>Want to visit the cheese dairy in Nyzhnie Selyshche with tasting? Order a car with a driver so you don't deny yourself the pleasure.</div>

<div class='editor_title'>Free Delivery</div>
<div class='editor_text'>In the City: Delivery and return within Khust are free.<br/>Region: Delivery to Shayan, Vyshkovo, or Velyatyno is calculated separately.</div>

<div class='editor_title'>Cars in Perfect Condition</div>
<div class='editor_text'>Before every rental, we wash the car and disinfect the interior. Technical condition is checked via a checklist (suspension, fluids, electronics).</div>

<div class='editor_title'>Driving Specifics: Tips for Khust District</div>
<div class='editor_text'><ol><li><span class='text-strong'>Careful on Passes:</span> The road to Synevir via Mizhhiria is very scenic but has many sharp turns. Do not speed on descents.</li><li><span class='text-strong'>Livestock:</span> In villages around Khust (especially in Iza and Nankovo), cows and horses often wander onto the road. Be careful, especially in the morning and evening.</li><li><span class='text-strong'>Road Quality:</span> Main highways (H-09) are in good condition, but the road to the Valley of Narcissi or secondary roads may have potholes. Choose speed according to conditions.</li></ol></div>
`.trim(),
      ru: `
<div class='editor_text'>REIZ предлагает автопрокат в Хусте — городе, который является идеальной точкой для старта путешествий по Карпатам. Отсюда одинаково удобно ехать и к высокогорью (Синевир), и в курортную зону (Шаян). Мы подготовили автопарк, который выдержит любой из этих маршрутов.<br/>Мы подаем авто к Хустскому замку, ж/д вокзалу, отелю "Карпаты" или по вашему адресу.</div>

<div class='editor_title'>Почасовой тариф: тестируем на серпантинах</div>
<div class='editor_text'>Почасовая аренда — это возможность проверить авто перед поездкой в горы. За сутки вы успеете проехать в село Иза (центр лозоплетения) и подняться к оленьей ферме. Это позволит оценить, комфортно ли вам управлять выбранной моделью на узких дорогах.</div>

<div class='editor_title'>Аренда авто на неделю: курортный тур</div>
<div class='editor_text'>Недельный тариф — самый выгодный для тех, кто приехал на лечение или отдых. Маршрут: Хуст → Велятино (термальные воды) → Шаян (минеральные воды) → Долина нарциссов (в сезон). Вам не нужно подстраиваться под расписание санаторных автобусов. Вы сами решаете, сколько времени провести в бассейне.</div>

<div class='editor_title'>Аренда авто на месяц: для бизнеса и жизни</div>
<div class='editor_text'>Хуст — активный торговый город. Месячная аренда подходит для торговых представителей, работающих по всему району (Тячев, Виноградов). Это дешевле, чем содержать собственное авто, ведь мы берем на себя все расходы на обслуживание.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Решение для тех, кто переехал в Хуст надолго. Вы получаете надежный транспорт без первого взноса (как при лизинге) и бюрократии. Мы следим за тем, чтобы страховка была действительной, а шины — по сезону.</div>

<div class='editor_title'>Бюджетный прокат — от $20/сутки</div>
<div class='editor_text'>Для поездок по городу и в соседние села (Сокирница, Крайниково) идеально подойдет наш эконом-класс. Это надежные авто с низким расходом топлива, которые легко маневрируют в центре Хуста.</div>

<div class='editor_title'>Почему выбирают REIZ в Хусте</div>
<div class='editor_text'><ul><li><span class='text-strong'>Готовность к горам:</span> Наши авто проверены на подъемах. Тормоза и система охлаждения работают идеально.</li><li><span class='text-strong'>Удобная логистика:</span> Мы находимся рядом с основными транспортными развязками.</li><li><span class='text-strong'>Поддержка:</span> Если вы заблудитесь в горах или пробьете колесо — мы на связи 24/7 и поможем.</li></ul></div>

<div class='editor_title'>Без залога / Уменьшенный депозит</div>
<div class='editor_text'>Мы понимаем, что в отпуске каждая гривна важна. Поэтому предлагаем аренду со сниженным депозитом или без залога для проверенных клиентов.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Хотите посетить сыроварню в Нижнем Селище с дегустацией? Закажите авто с водителем, чтобы не отказывать себе в удовольствии.</div>

<div class='editor_title'>Бесплатная доставка</div>
<div class='editor_text'>В городе: Подача и возврат в черте Хуста — бесплатно.<br/>Регион: Доставка в Шаян, Вышково или Велятино рассчитывается отдельно.</div>

<div class='editor_title'>Автомобили в идеальном состоянии</div>
<div class='editor_text'>Перед каждой арендой мы моем авто и проводим дезинфекцию салона. Техническое состояние проверяется по чек-листу (ходовая, жидкости, электроника).</div>

<div class='editor_title'>Специфика вождения: советы для Хустского района</div>
<div class='editor_text'><ol><li><span class='text-strong'>Осторожно на перевалах:</span> Дорога на Синевир через Межгорье очень живописная, но имеет много крутых поворотов. Не разгоняйтесь на спусках.</li><li><span class='text-strong'>Домашние животные:</span> В селах вокруг Хуста (особенно в Изе и Нанково) на дорогу часто выходят коровы и лошади. Будьте внимательны, особенно утром и вечером.</li><li><span class='text-strong'>Качество покрытия:</span> Основные трассы (Н-09) в хорошем состоянии, но дорога к Долине нарциссов или второстепенные пути могут иметь ямы. Выбирайте скорость согласно условиям.</li></ol></div>
`.trim(),
    },
  },
  rakhiv: {
    routeExample: {
      uk: "як модель поводиться на високогірних маршрутах",
      ru: "как модель ведёт себя на высокогорных маршрутах",
      en: "how the model handles high-mountain routes",
    },
    routes: {
      uk: "Рахів ↔ Ясіня, Буковель, Івано-Франківськ",
      ru: "Рахов ↔ Ясиня, Буковель, Ивано-Франковск",
      en: "Rakhiv ↔ Yasinia, Bukovel, Ivano-Frankivsk",
    },
    weekendTrip: {
      uk: "Драгобрат, Говерла, Ясіня",
      ru: "Драгобрат, Говерла, Ясиня",
      en: "Drahobrat, Hoverla, Yasinia",
    },
    localAttractions: {
      uk: "центр, вокзал, музей гуцульської культури",
      ru: "центр, вокзал, музей гуцульской культуры",
      en: "city center, railway station, Hutsul culture museum",
    },
    customEditorContent: {
      uk: `
<div class='editor_text'>REIZ — це прокат авто в самому серці Карпат. Рахів — це місто, де рівних доріг майже немає. Тут кожен виїзд — це маленький іспит для водія та техніки. Тому ми пропонуємо автомобілі, які готові до серйозних навантажень: від потужних кросоверів до маневрених повнопривідних седанів.<br/>Ми подаємо авто до залізничного вокзалу, готелю "Європа", Географічного центру Європи (Ділове) або за вашою адресою.</div>

<div class='editor_title'>Погодинний тариф: гірський тест-драйв</div>
<div class='editor_text'>Приїхали потягом, але хочете побачити більше, ніж центр міста? Візьміть авто на кілька годин або добу. За цей час ви встигнете з'їздити до стели "Центр Європи" та скуштувати банош у колибі. Це також чудова можливість перевірити, як авто поводиться на підйомах до високогірних сіл, таких як Богдан чи Луги.</div>

<div class='editor_title'>Оренда авто на тиждень: підкорення вершин</div>
<div class='editor_text'>Рахів — це база для тих, хто йде на Говерлу, Петрос чи Близниці. Тижнева оренда — це ваша незалежність від трансферів. Маршрут: Рахів → Лазещина (старт на Говерлу) → Ясиня (Драгобрат) → Кваси (мінеральні джерела). Важливо: на Драгобрат власним ходом пускають лише підготовлені позашляховики. Наші менеджери підкажуть, яке авто з нашого парку впорається з цим завданням, а яке краще залишити в Ясині.</div>

<div class='editor_title'>Оренда авто на місяць: робота на висоті</div>
<div class='editor_text'>Для тих, хто працює у високогір'ї або розвиває тут бізнес. Місячна оренда вигідніша, ніж власне авто, адже гірські дороги швидко зношують підвіску. У REIZ амортизація — це наша турбота, а не ваша. Ми оперативно замінимо авто, якщо виникне потреба в сервісі, щоб ваш графік не постраждав.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Ідеально для місцевих жителів та тих, хто переїхав у гори. Ви отримуєте надійний повнопривідний автомобіль на сезон зими або на цілий рік. Вам не потрібно думати про купівлю дорогої зимової гуми чи ланцюгів — ми все це надаємо.</div>

<div class='editor_title'>Бюджетний прокат — від $20/доба</div>
<div class='editor_text'>Навіть у горах можна їздити економно. Для поїздок трасою Н-09 (Рахів-Яремче) цілком підійде наш комфортний економ-клас. Це сучасні авто з клімат-контролем та низькою витратою пального, які впевнено тримають дорогу.</div>

<div class='editor_title'>Чому обирають REIZ у Рахові</div>
<div class='editor_text'><ul><li><span class='text-strong'>4x4 у наявності:</span> Ми розуміємо, що в Рахові повний привід — це не розкіш, а необхідність взимку.</li><li><span class='text-strong'>Гірська підготовка:</span> Посилена перевірка гальм та рульового управління перед кожною видачею.</li><li><span class='text-strong'>Зимовий пакет:</span> У сезон усі авто комплектуються скребками, зимовим омивачем та, за запитом, ланцюгами протиковзання.</li><li><span class='text-strong'>Чесна ціна:</span> Жодних націнок за "складність рельєфу".</li></ul></div>

<div class='editor_title'>Без застави / Зменшений депозит</div>
<div class='editor_text'>Подорож у гори — це витрати. Ми йдемо назустріч і пропонуємо оренду зі зниженим депозитом або без нього для досвідчених водіїв.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Дорога на Драгобрат чи високогірні села може лякати недосвідченого водія. Замовте авто з професіоналом, який знає кожен камінь на цьому шляху.</div>

<div class='editor_title'>Безкоштовна доставка</div>
<div class='editor_text'>У місті: Подача та повернення в межах Рахова — безкоштовно.<br/>Регіон: Доставка в Ясиню, Лазещину, Кваси або Великий Бичків розраховується індивідуально.</div>

<div class='editor_title'>Автомобілі в ідеальному стані</div>
<div class='editor_text'>Гори не пробачають помилок. Ми це знаємо, тому наші авто проходять подвійний контроль технічного стану. Ви можете бути впевнені у своїй безпеці.</div>

<div class='editor_title'>Специфіка водіння: поради для Рахівського району</div>
<div class='editor_text'><ol><li><span class='text-strong'>Гальма перегріваються!</span> На затяжних спусках (наприклад, з Яблуницького перевалу) обов'язково використовуйте гальмування двигуном. Ніколи не котіться на нейтральній передачі!</li><li><span class='text-strong'>Вузькі місця:</span> Дороги в місті часто затиснуті між річкою Тиса та горами. Будьте готові до того, що розминутися з вантажівкою буде складно.</li><li><span class='text-strong'>Погода змінюється миттєво:</span> У Рахові може йти дощ, а через 15 км у Ясині — сніг. Будьте готові до різкої зміни дорожніх умов.</li></ol></div>
`.trim(),
      en: `
<div class='editor_text'>REIZ provides car rental in the very heart of the Carpathians. Rakhiv is a city where flat roads are scarce. Every trip here is a small test for the driver and the vehicle. That's why we offer cars ready for serious challenges: from powerful SUVs to agile AWD sedans.<br/>We deliver cars to the Railway Station, Hotel "Europa", the Geographical Center of Europe (Dilove), or your address.</div>

<div class='editor_title'>Hourly Rate: Mountain Test Drive</div>
<div class='editor_text'>Arrived by train but want to see more than the city center? Rent a car for a few hours or a day. During this time, you can visit the "Center of Europe" monument and taste banosh in a kolyba (local hut). It's also a great opportunity to check how the car handles climbs to high-altitude villages like Bohdan or Luhy.</div>

<div class='editor_title'>Weekly Rental: Conquering Peaks</div>
<div class='editor_text'>Rakhiv is the base for those hiking Hoverla, Petros, or Blyznytsi. Weekly rental is your independence from transfers. Route: Rakhiv → Lazeshchyna (Hoverla start) → Yasinia (Dragobrat) → Kvasy (mineral springs). Important: Only prepared off-road vehicles are allowed to drive up to Dragobrat. Our managers will advise which car from our fleet can handle this task, and which is better left in Yasinia.</div>

<div class='editor_title'>Monthly Rental: Work at Altitude</div>
<div class='editor_text'>For those working in the highlands or developing a business here. Monthly rental is more profitable than owning a car, as mountain roads wear out suspension quickly. At REIZ, depreciation is our concern, not yours. We will promptly replace the car if service is needed so your schedule doesn't suffer.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>Ideal for locals and those who moved to the mountains. You get a reliable all-wheel-drive vehicle for the winter season or the whole year. You don't need to think about buying expensive winter tires or chains — we provide it all.</div>

<div class='editor_title'>Budget Rental — From $20/day</div>
<div class='editor_text'>Even in the mountains, you can drive economically. For trips along the H-09 highway (Rakhiv-Yaremche), our comfortable economy class is quite suitable. These are modern cars with climate control and low fuel consumption that hold the road confidently.</div>

<div class='editor_title'>Why Choose REIZ in Rakhiv</div>
<div class='editor_text'><ul><li><span class='text-strong'>4x4 Available:</span> We understand that in Rakhiv, all-wheel drive is not a luxury but a necessity in winter.</li><li><span class='text-strong'>Mountain Prep:</span> Enhanced check of brakes and steering before every rental.</li><li><span class='text-strong'>Winter Pack:</span> In season, all cars come with scrapers, winter washer fluid, and snow chains upon request.</li><li><span class='text-strong'>Fair Price:</span> No surcharges for "terrain complexity."</li></ul></div>

<div class='editor_title'>No Deposit / Reduced Deposit</div>
<div class='editor_text'>A trip to the mountains involves expenses. We meet you halfway and offer rental with a reduced deposit or no deposit for experienced drivers.</div>

<div class='editor_title'>Driver Services</div>
<div class='editor_text'>The road to Dragobrat or high-altitude villages can scare an inexperienced driver. Order a car with a professional who knows every stone on this path.</div>

<div class='editor_title'>Free Delivery</div>
<div class='editor_text'>In the City: Delivery and return within Rakhiv are free.<br/>Region: Delivery to Yasinia, Lazeshchyna, Kvasy, or Velykyi Bychkiv is calculated individually.</div>

<div class='editor_title'>Cars in Perfect Condition</div>
<div class='editor_text'>Mountains do not forgive mistakes. We know this, so our cars undergo double technical control. You can be sure of your safety.</div>

<div class='editor_title'>Driving Specifics: Tips for Rakhiv District</div>
<div class='editor_text'><ol><li><span class='text-strong'>Brakes Overheat!</span> On long descents (e.g., from Yablunytsia Pass), be sure to use engine braking. Never coast in neutral!</li><li><span class='text-strong'>Narrow Spots:</span> Roads in the city are often squeezed between the Tisa River and the mountains. Be prepared that passing a truck might be difficult.</li><li><span class='text-strong'>Weather Changes Instantly:</span> It can be raining in Rakhiv, and snowing 15 km away in Yasinia. Be ready for sudden changes in road conditions.</li></ol></div>
`.trim(),
      ru: `
<div class='editor_text'>REIZ — это прокат авто в самом сердце Карпат. Рахов — это город, где ровных дорог почти нет. Здесь каждый выезд — это маленький экзамен для водителя и техники. Поэтому мы предлагаем автомобили, которые готовы к серьезным нагрузкам: от мощных кроссоверов до маневренных полноприводных седанов.<br/>Мы подаем авто к ж/д вокзалу, отелю "Европа", Географическому центру Европы (Деловое) или по вашему адресу.</div>

<div class='editor_title'>Почасовой тариф: горный тест-драйв</div>
<div class='editor_text'>Приехали поездом, но хотите увидеть больше, чем центр города? Возьмите авто на несколько часов или сутки. За это время вы успеете съездить к стеле "Центр Европы" и попробовать банош в колыбе. Это также отличная возможность проверить, как авто ведет себя на подъемах к высокогорным селам, таким как Богдан или Луги.</div>

<div class='editor_title'>Аренда авто на неделю: покорение вершин</div>
<div class='editor_text'>Рахов — это база для тех, кто идет на Говерлу, Петрос или Близницы. Недельная аренда — это ваша независимость от трансферов. Маршрут: Рахов → Лазещина (старт на Говерлу) → Ясиня (Драгобрат) → Квасы (минеральные источники). Важно: на Драгобрат своим ходом пускают только подготовленные внедорожники. Наши менеджеры подскажут, какое авто из нашего парка справится с этой задачей, а какое лучше оставить в Ясине.</div>

<div class='editor_title'>Аренда авто на месяц: работа на высоте</div>
<div class='editor_text'>Для тех, кто работает в высокогорье или развивает здесь бизнес. Месячная аренда выгоднее, чем собственное авто, ведь горные дороги быстро изнашивают подвеску. В REIZ амортизация — это наша забота, а не ваша. Мы оперативно заменим авто, если возникнет потребность в сервисе, чтобы ваш график не пострадал.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Идеально для местных жителей и тех, кто переехал в горы. Вы получаете надежный полноприводный автомобиль на сезон зимы или на целый год. Вам не нужно думать о покупке дорогой зимней резины или цепей — мы всё это предоставляем.</div>

<div class='editor_title'>Бюджетный прокат — от $20/сутки</div>
<div class='editor_text'>Даже в горах можно ездить экономно. Для поездок по трассе Н-09 (Рахов-Яремче) вполне подойдет наш комфортный эконом-класс. Это современные авто с климат-контролем и низким расходом топлива, которые уверенно держат дорогу.</div>

<div class='editor_title'>Почему выбирают REIZ в Рахове</div>
<div class='editor_text'><ul><li><span class='text-strong'>4x4 в наличии:</span> Мы понимаем, что в Рахове полный привод — это не роскошь, а необходимость зимой.</li><li><span class='text-strong'>Горная подготовка:</span> Усиленная проверка тормозов и рулевого управления перед каждой выдачей.</li><li><span class='text-strong'>Зимний пакет:</span> В сезон все авто комплектуются скребками, зимним омывателем и, по запросу, цепями противоскольжения.</li><li><span class='text-strong'>Честная цена:</span> Никаких наценок за "сложность рельефа".</li></ul></div>

<div class='editor_title'>Без залога / Уменьшенный депозит</div>
<div class='editor_text'>Путешествие в горы — это расходы. Мы идем навстречу и предлагаем аренду со сниженным депозитом или без него для опытных водителей.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Дорога на Драгобрат или высокогорные села может пугать неопытного водителя. Закажите авто с профессионалом, который знает каждый камень на этом пути.</div>

<div class='editor_title'>Бесплатная доставка</div>
<div class='editor_text'>В городе: Подача и возврат в черте Рахова — бесплатно.<br/>Регион: Доставка в Ясиню, Лазещину, Квасы или Великий Бычков рассчитывается индивидуально.</div>

<div class='editor_title'>Автомобили в идеальном состоянии</div>
<div class='editor_text'>Горы не прощают ошибок. Мы это знаем, поэтому наши авто проходят двойной контроль технического состояния. Вы можете быть уверены в своей безопасности.</div>

<div class='editor_title'>Специфика вождения: советы для Раховского района</div>
<div class='editor_text'><ol><li><span class='text-strong'>Тормоза перегреваются!</span> На затяжных спусках (например, с Яблуницкого перевала) обязательно используйте торможение двигателем. Никогда не катитесь на нейтральной передаче!</li><li><span class='text-strong'>Узкие места:</span> Дороги в городе часто зажаты между рекой Тиса и горами. Будьте готовы к тому, что разминуться с грузовиком будет сложно.</li><li><span class='text-strong'>Погода меняется мгновенно:</span> В Рахове может идти дождь, а через 15 км в Ясине — снег. Будьте готовы к резкой смене дорожных условий.</li></ol></div>
`.trim(),
    },
  },
};

// ============================================
// CITY-SPECIFIC FAQ DATA
// ============================================
export const cityFAQData: Record<string, CityFAQSection[]> = {
  kyiv: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Києві й як уникнути штрафів?",
            ru: "Где парковать арендованный автомобиль в Киеве и как избежать штрафов?",
            en: "Where to park a rental car in Kyiv and how to avoid fines?",
          },
          answer: {
            uk: "У центрі Києва працює платне паркування — оплачуйте через ParkingUA або Kyiv Smart City. Поза зоною платного паркування можна залишати авто безкоштовно. Біля ТРЦ і бізнес-центрів є підземні паркінги. Уникайте зупинок під знаками «Зупинку заборонено» та на тротуарах.",
            ru: "В центре Киева работает платная парковка — оплачивайте через ParkingUA или Kyiv Smart City. Вне зоны платной парковки можно оставлять авто бесплатно. Возле ТРЦ и бизнес-центров есть подземные паркинги. Избегайте остановок под знаками «Остановка запрещена» и на тротуарах.",
            en: "Paid parking operates in central Kyiv — pay via ParkingUA or Kyiv Smart City apps. Outside the paid zone, you can park for free. Underground parking is available near shopping malls and business centers. Avoid stopping under 'No Stopping' signs and on sidewalks.",
          },
        },
        {
          question: {
            uk: "Доставка авто в аеропорти Києва (Бориспіль KBP, Жуляни IEV): умови й ціни",
            ru: "Доставка авто в аэропорты Киева (Борисполь KBP, Жуляны IEV): условия и цены",
            en: "Car delivery to Kyiv airports (Boryspil KBP, Zhuliany IEV): terms and prices",
          },
          answer: {
            uk: "Подача авто в аеропорт Бориспіль (KBP) та Жуляни (IEV) — безкоштовна при оренді від 3 діб. При короткостроковій оренді може застосовуватись невелика доплата. Менеджер зустріне вас у зоні прильоту з табличкою. Час подачі — від 30 хвилин після підтвердження прильоту.",
            ru: "Подача авто в аэропорт Борисполь (KBP) и Жуляны (IEV) — бесплатная при аренде от 3 суток. При краткосрочной аренде может применяться небольшая доплата. Менеджер встретит вас в зоне прилёта с табличкой. Время подачи — от 30 минут после подтверждения прилёта.",
            en: "Car delivery to Boryspil (KBP) and Zhuliany (IEV) airports is free for rentals of 3+ days. A small fee may apply for short-term rentals. Our manager will meet you in the arrivals area with a sign. Delivery time — from 30 minutes after confirmed arrival.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу при оренді в Києві й як поїхати по Україні без обмежень?",
            ru: "Есть ли лимит пробега при аренде в Киеве и как поехать по Украине без ограничений?",
            en: "Is there a mileage limit for rentals in Kyiv and how to travel across Ukraine without restrictions?",
          },
          answer: {
            uk: "Стандартний ліміт — 250-300 км/добу залежно від тарифу. Для далеких поїздок (Київ — Львів, Київ — Одеса, Київ — Харків) рекомендуємо тариф з безлімітним пробігом. Перевищення ліміту оплачується за км згідно з прайсом.",
            ru: "Стандартный лимит — 250-300 км/сутки в зависимости от тарифа. Для дальних поездок (Киев — Львов, Киев — Одесса, Киев — Харьков) рекомендуем тариф с безлимитным пробегом. Превышение лимита оплачивается за км согласно прайсу.",
            en: "Standard limit is 250-300 km/day depending on the rate. For long trips (Kyiv — Lviv, Kyiv — Odesa, Kyiv — Kharkiv), we recommend the unlimited mileage rate. Exceeding the limit is charged per km according to the price list.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто в Києві? (ОСЦПВ/КАСКО)",
            ru: "Что покрывает страховка при аренде авто в Киеве? (ОСАГО/КАСКО)",
            en: "What does insurance cover when renting a car in Kyiv? (MTPL/Comprehensive)",
          },
          answer: {
            uk: "Всі авто мають обов'язкову ОСЦПВ — вона покриває шкоду третім особам. Додатково доступні пакети CDW/SCDW, які зменшують вашу відповідальність при пошкодженні авто. Пакет «Преміум» покриває навіть шини, скло та дзеркала.",
            ru: "Все авто имеют обязательное ОСАГО — оно покрывает ущерб третьим лицам. Дополнительно доступны пакеты CDW/SCDW, которые уменьшают вашу ответственность при повреждении авто. Пакет «Премиум» покрывает даже шины, стекло и зеркала.",
            en: "All cars have mandatory MTPL insurance covering third-party damage. Additional CDW/SCDW packages are available to reduce your liability for car damage. The 'Premium' package even covers tires, glass, and mirrors.",
          },
        },
        {
          question: {
            uk: "Франшиза та страховий депозит у Києві: у чому різниця й скільки ви ризикуєте?",
            ru: "Франшиза и страховой депозит в Киеве: в чём разница и сколько вы рискуете?",
            en: "Deductible and security deposit in Kyiv: what's the difference and how much do you risk?",
          },
          answer: {
            uk: "Депозит — це сума, яка блокується на картці на час оренди і повертається при поверненні авто без пошкоджень. Франшиза — максимальна сума вашої відповідальності при страховому випадку. Пакети «Комфорт» та «Преміум» зменшують обидві суми.",
            ru: "Депозит — это сумма, которая блокируется на карте на время аренды и возвращается при возврате авто без повреждений. Франшиза — максимальная сумма вашей ответственности при страховом случае. Пакеты «Комфорт» и «Премиум» уменьшают обе суммы.",
            en: "Deposit is the amount blocked on your card during rental and returned when the car is returned undamaged. Deductible is the maximum amount of your liability in case of an incident. 'Comfort' and 'Premium' packages reduce both amounts.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто в Києві без застави й як працює «нульова відповідальність»?",
            ru: "Можно ли арендовать авто в Киеве без залога и как работает «нулевая ответственность»?",
            en: "Can I rent a car in Kyiv without a deposit and how does 'zero liability' work?",
          },
          answer: {
            uk: "Так, з пакетом страхування «Преміум» застава мінімальна (200-300$) або відсутня для окремих моделей. «Нульова відповідальність» означає, що навіть при ДТП з вашої вини ви не платите за ремонт (крім випадків грубих порушень).",
            ru: "Да, с пакетом страхования «Премиум» залог минимальный (200-300$) или отсутствует для отдельных моделей. «Нулевая ответственность» означает, что даже при ДТП по вашей вине вы не платите за ремонт (кроме случаев грубых нарушений).",
            en: "Yes, with the 'Premium' insurance package, the deposit is minimal ($200-300) or waived for selected models. 'Zero liability' means that even in an accident caused by you, you don't pay for repairs (except for gross violations).",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж водія для оренди авто в Києві",
            ru: "Минимальный возраст и стаж водителя для аренды авто в Киеве",
            en: "Minimum age and driving experience for car rental in Kyiv",
          },
          answer: {
            uk: "Мінімальний вік — 21 рік, стаж водіння — від 2 років. Для преміум-авто та кросоверів вимоги вищі: від 25 років і стаж від 3-4 років. Для молодих водіїв може діяти додатковий збір.",
            ru: "Минимальный возраст — 21 год, стаж вождения — от 2 лет. Для премиум-авто и кроссоверов требования выше: от 25 лет и стаж от 3-4 лет. Для молодых водителей может действовать дополнительный сбор.",
            en: "Minimum age is 21, driving experience from 2 years. For premium cars and crossovers, requirements are higher: from 25 years old and 3-4 years of experience. Young driver surcharge may apply.",
          },
        },
        {
          question: {
            uk: "Чи можна виїжджати за межі України на орендованому авто з Києва?",
            ru: "Можно ли выезжать за пределы Украины на арендованном авто из Киева?",
            en: "Can I travel outside Ukraine with a rental car from Kyiv?",
          },
          answer: {
            uk: "Так, виїзд за кордон можливий за попереднім погодженням. Потрібно повідомити мінімум за 48 годин, оформити додаткову страховку та документи (Green Card). Список дозволених країн уточнюйте у менеджера.",
            ru: "Да, выезд за границу возможен по предварительному согласованию. Нужно сообщить минимум за 48 часов, оформить дополнительную страховку и документы (Green Card). Список разрешённых стран уточняйте у менеджера.",
            en: "Yes, cross-border travel is possible with prior arrangement. Notify us at least 48 hours in advance, arrange additional insurance and documents (Green Card). Check with our manager for the list of permitted countries.",
          },
        },
        {
          question: {
            uk: "Передача авто третім особам і робота в таксі: що заборонено в Києві",
            ru: "Передача авто третьим лицам и работа в такси: что запрещено в Киеве",
            en: "Transferring the car to third parties and taxi use: what's prohibited in Kyiv",
          },
          answer: {
            uk: "Категорично заборонено: передавати авто особам, не вказаним у договорі; використовувати для таксі, Uber, Bolt; здавати в суборенду; брати участь у змаганнях; буксирувати інші авто. Порушення — розірвання договору та штраф.",
            ru: "Категорически запрещено: передавать авто лицам, не указанным в договоре; использовать для такси, Uber, Bolt; сдавать в субаренду; участвовать в соревнованиях; буксировать другие авто. Нарушение — расторжение договора и штраф.",
            en: "Strictly prohibited: transferring the car to persons not listed in the contract; using for taxi, Uber, Bolt; subletting; participating in races; towing other vehicles. Violation results in contract termination and penalty.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Які способи оплати доступні при оренді авто в Києві?",
            ru: "Какие способы оплаты доступны при аренде авто в Киеве?",
            en: "What payment methods are available for car rental in Kyiv?",
          },
          answer: {
            uk: "Приймаємо: банківські картки Visa/Mastercard (включно з Apple Pay, Google Pay), готівку (UAH, USD, EUR), безготівковий розрахунок для юридичних осіб. Депозит блокується на картці або вноситься готівкою.",
            ru: "Принимаем: банковские карты Visa/Mastercard (включая Apple Pay, Google Pay), наличные (UAH, USD, EUR), безналичный расчёт для юридических лиц. Депозит блокируется на карте или вносится наличными.",
            en: "We accept: Visa/Mastercard bank cards (including Apple Pay, Google Pay), cash (UAH, USD, EUR), bank transfer for legal entities. Deposit is blocked on the card or paid in cash.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди авто в Києві: громадянам України та іноземцям?",
            ru: "Какие документы нужны для аренды авто в Киеве: гражданам Украины и иностранцам?",
            en: "What documents are required to rent a car in Kyiv: for Ukrainian citizens and foreigners?",
          },
          answer: {
            uk: "Громадянам України: паспорт/ID-картка, посвідчення водія категорії B, РНОКПП (ІПН). Іноземцям: закордонний паспорт, національне посвідчення водія (бажано міжнародне, якщо права не латиницею), віза/штамп про в'їзд.",
            ru: "Гражданам Украины: паспорт/ID-карта, водительское удостоверение категории B, РНОКПП (ИНН). Иностранцам: загранпаспорт, национальное водительское удостоверение (желательно международное, если права не на латинице), виза/штамп о въезде.",
            en: "Ukrainian citizens: passport/ID card, category B driver's license, tax ID (RNOKPP). Foreigners: international passport, national driver's license (international preferred if not in Latin script), entry visa/stamp.",
          },
        },
        {
          question: {
            uk: "Політика пального «повний-повний»: як повернути авто в Києві без доплат?",
            ru: "Политика топлива «полный-полный»: как вернуть авто в Киеве без доплат?",
            en: "Full-to-full fuel policy: how to return a car in Kyiv without extra charges?",
          },
          answer: {
            uk: "Авто видається з повним баком — поверніть також із повним. Найближчі АЗС є в 5 хвилинах від точок повернення. Якщо не встигаєте заправитись — доступна опція передплаченого пального за ринковою ціною + невеликий сервісний збір.",
            ru: "Авто выдаётся с полным баком — верните также с полным. Ближайшие АЗС есть в 5 минутах от точек возврата. Если не успеваете заправиться — доступна опция предоплаченного топлива по рыночной цене + небольшой сервисный сбор.",
            en: "The car is provided with a full tank — return it full as well. Nearby gas stations are 5 minutes from return points. If you don't have time to refuel, a prepaid fuel option is available at market price + small service fee.",
          },
        },
      ],
    },
  ],
  lviv: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Львові й як уникнути штрафів?",
            ru: "Где парковать арендованный автомобиль во Львове и как избежать штрафов?",
            en: "Where to park a rental car in Lviv and how to avoid fines?",
          },
          answer: {
            uk: "У центрі Львова (Старе місто) паркування обмежене — користуйтесь підземними паркінгами біля Оперного театру чи на пл. Міцкевича. Оплата через додаток Lviv Parking. Поза історичним центром паркування переважно безкоштовне. Уникайте пішохідних зон та місць з табличкою «Евакуатор працює».",
            ru: "В центре Львова (Старый город) парковка ограничена — пользуйтесь подземными паркингами возле Оперного театра или на пл. Мицкевича. Оплата через приложение Lviv Parking. Вне исторического центра парковка преимущественно бесплатная. Избегайте пешеходных зон и мест с табличкой «Эвакуатор работает».",
            en: "Parking in central Lviv (Old Town) is limited — use underground parking near the Opera House or Mickiewicz Square. Pay via Lviv Parking app. Outside the historic center, parking is mostly free. Avoid pedestrian zones and areas with 'Tow truck operates' signs.",
          },
        },
        {
          question: {
            uk: "Доставка авто в аеропорт Львів (LWO) та на вокзал: умови й ціни",
            ru: "Доставка авто в аэропорт Львов (LWO) и на вокзал: условия и цены",
            en: "Car delivery to Lviv Airport (LWO) and railway station: terms and prices",
          },
          answer: {
            uk: "Подача авто в аеропорт Львів (LWO) та на головний залізничний вокзал — безкоштовна. Менеджер зустріне вас у зоні прильоту або біля виходу з вокзалу. Час подачі — від 20 хвилин. Також доставляємо в Старе місто, готелі та за вашою адресою по Львову.",
            ru: "Подача авто в аэропорт Львов (LWO) и на главный ж/д вокзал — бесплатная. Менеджер встретит вас в зоне прилёта или у выхода из вокзала. Время подачи — от 20 минут. Также доставляем в Старый город, отели и по вашему адресу во Львове.",
            en: "Car delivery to Lviv Airport (LWO) and the main railway station is free. Our manager will meet you in the arrivals area or at the station exit. Delivery time — from 20 minutes. We also deliver to the Old Town, hotels, and your address in Lviv.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу при оренді у Львові й як поїхати в Карпати без обмежень?",
            ru: "Есть ли лимит пробега при аренде во Львове и как поехать в Карпаты без ограничений?",
            en: "Is there a mileage limit for rentals in Lviv and how to travel to the Carpathians without restrictions?",
          },
          answer: {
            uk: "Стандартний ліміт — 250-300 км/добу. Для поїздок у Карпати (Буковель — 280 км, Славське — 150 км) та далеких маршрутів рекомендуємо тариф Unlimited. Перевищення ліміту оплачується за км згідно з прайсом класу авто.",
            ru: "Стандартный лимит — 250-300 км/сутки. Для поездок в Карпаты (Буковель — 280 км, Славское — 150 км) и дальних маршрутов рекомендуем тариф Unlimited. Превышение лимита оплачивается за км согласно прайсу класса авто.",
            en: "Standard limit is 250-300 km/day. For Carpathian trips (Bukovel — 280 km, Slavske — 150 km) and long routes, we recommend the Unlimited rate. Exceeding the limit is charged per km based on the car class price list.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто у Львові? (ОСЦПВ/КАСКО)",
            ru: "Что покрывает страховка при аренде авто во Львове? (ОСАГО/КАСКО)",
            en: "What does insurance cover when renting a car in Lviv? (MTPL/Comprehensive)",
          },
          answer: {
            uk: "Базова ОСЦПВ покриває шкоду третім особам. Пакети CDW/SCDW зменшують вашу відповідальність при пошкодженні авто. Для поїздок у Карпати рекомендуємо пакет «Преміум» — він покриває навіть пошкодження шин і скла на гірських дорогах.",
            ru: "Базовое ОСАГО покрывает ущерб третьим лицам. Пакеты CDW/SCDW уменьшают вашу ответственность при повреждении авто. Для поездок в Карпаты рекомендуем пакет «Премиум» — он покрывает даже повреждения шин и стекла на горных дорогах.",
            en: "Basic MTPL covers third-party damage. CDW/SCDW packages reduce your liability for car damage. For Carpathian trips, we recommend the 'Premium' package — it covers even tire and glass damage on mountain roads.",
          },
        },
        {
          question: {
            uk: "Франшиза та страховий депозит у Львові: скільки блокується на картці?",
            ru: "Франшиза и страховой депозит во Львове: сколько блокируется на карте?",
            en: "Deductible and security deposit in Lviv: how much is blocked on the card?",
          },
          answer: {
            uk: "Розмір депозиту залежить від класу авто: економ — від $200, бізнес — від $400, SUV — від $500. Пакет «Комфорт» зменшує депозит на 50%, «Преміум» — до мінімуму ($200-300). Кошти повертаються протягом 1-3 днів після повернення авто.",
            ru: "Размер депозита зависит от класса авто: эконом — от $200, бизнес — от $400, SUV — от $500. Пакет «Комфорт» уменьшает депозит на 50%, «Премиум» — до минимума ($200-300). Средства возвращаются в течение 1-3 дней после возврата авто.",
            en: "Deposit amount depends on car class: economy — from $200, business — from $400, SUV — from $500. 'Comfort' package reduces deposit by 50%, 'Premium' — to minimum ($200-300). Funds are returned within 1-3 days after car return.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто у Львові без застави?",
            ru: "Можно ли арендовать авто во Львове без залога?",
            en: "Can I rent a car in Lviv without a deposit?",
          },
          answer: {
            uk: "Для окремих моделей економ-класу та при довгостроковій оренді (від 2 тижнів) доступна опція без застави або зі зменшеним депозитом. Доступність залежить від історії клієнта та умов бронювання — уточнюйте при оформленні.",
            ru: "Для отдельных моделей эконом-класса и при долгосрочной аренде (от 2 недель) доступна опция без залога или с уменьшенным депозитом. Доступность зависит от истории клиента и условий бронирования — уточняйте при оформлении.",
            en: "For selected economy models and long-term rentals (from 2 weeks), a no-deposit or reduced deposit option is available. Availability depends on customer history and booking conditions — check when booking.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж водія для оренди авто у Львові",
            ru: "Минимальный возраст и стаж водителя для аренды авто во Львове",
            en: "Minimum age and driving experience for car rental in Lviv",
          },
          answer: {
            uk: "Мінімум 21 рік і 2 роки стажу. Для кросоверів/SUV (популярних для Карпат) — від 23 років і 3 роки стажу. Преміум-авто — від 25 років. Молоді водії (21-24) можуть мати додатковий збір.",
            ru: "Минимум 21 год и 2 года стажа. Для кроссоверов/SUV (популярных для Карпат) — от 23 лет и 3 года стажа. Премиум-авто — от 25 лет. Молодые водители (21-24) могут иметь дополнительный сбор.",
            en: "Minimum 21 years old and 2 years of experience. For crossovers/SUVs (popular for the Carpathians) — from 23 years and 3 years experience. Premium cars — from 25 years. Young drivers (21-24) may have an additional fee.",
          },
        },
        {
          question: {
            uk: "Чи можна виїхати на орендованому авто зі Львова за кордон (Польща, Словаччина)?",
            ru: "Можно ли выехать на арендованном авто из Львова за границу (Польша, Словакия)?",
            en: "Can I travel abroad from Lviv with a rental car (Poland, Slovakia)?",
          },
          answer: {
            uk: "Так, виїзд до Польщі та інших країн ЄС можливий за попереднім погодженням (мінімум за 48 годин). Потрібно: оформити Green Card, додаткову страховку, сплатити збір за міжнародну поїздку. Список країн та умови — у менеджера.",
            ru: "Да, выезд в Польшу и другие страны ЕС возможен по предварительному согласованию (минимум за 48 часов). Нужно: оформить Green Card, дополнительную страховку, оплатить сбор за международную поездку. Список стран и условия — у менеджера.",
            en: "Yes, travel to Poland and other EU countries is possible with prior arrangement (minimum 48 hours). Required: Green Card, additional insurance, international trip fee. Country list and conditions — check with our manager.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто у Львові: таксі, перевезення тварин, куріння",
            ru: "Что запрещено при аренде авто во Львове: такси, перевозка животных, курение",
            en: "What's prohibited when renting a car in Lviv: taxi, pets, smoking",
          },
          answer: {
            uk: "Заборонено: використання для таксі/Uber/Bolt, суборенда, участь у змаганнях, куріння в салоні. Перевезення тварин — дозволено у переносці/з покривалом (за забруднення — доплата за хімчистку). За порушення — штраф та можливе розірвання договору.",
            ru: "Запрещено: использование для такси/Uber/Bolt, субаренда, участие в соревнованиях, курение в салоне. Перевозка животных — разрешена в переноске/с покрывалом (за загрязнение — доплата за химчистку). За нарушения — штраф и возможное расторжение договора.",
            en: "Prohibited: taxi/Uber/Bolt use, subletting, racing, smoking inside. Pet transport allowed in carriers/with blankets (extra cleaning fee for soiling). Violations result in fines and possible contract termination.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Які способи оплати доступні при оренді авто у Львові?",
            ru: "Какие способы оплаты доступны при аренде авто во Львове?",
            en: "What payment methods are available for car rental in Lviv?",
          },
          answer: {
            uk: "Приймаємо: Visa/Mastercard (Apple Pay, Google Pay), готівку UAH/USD/EUR, безготівковий розрахунок для компаній. Туристи з-за кордону можуть оплатити карткою іноземного банку. Депозит — блокування на картці або готівка.",
            ru: "Принимаем: Visa/Mastercard (Apple Pay, Google Pay), наличные UAH/USD/EUR, безналичный расчёт для компаний. Туристы из-за рубежа могут оплатить картой иностранного банка. Депозит — блокировка на карте или наличные.",
            en: "We accept: Visa/Mastercard (Apple Pay, Google Pay), cash UAH/USD/EUR, bank transfer for companies. Foreign tourists can pay with international bank cards. Deposit — card block or cash.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди авто у Львові: туристам та українцям?",
            ru: "Какие документы нужны для аренды авто во Львове: туристам и украинцам?",
            en: "What documents are required to rent a car in Lviv: for tourists and Ukrainians?",
          },
          answer: {
            uk: "Українцям: паспорт/ID, посвідчення водія кат. B, ІПН. Іноземцям: закордонний паспорт, водійське посвідчення (міжнародне — якщо права не латиницею), штамп про в'їзд. Туристам з ЄС/США — національні права дійсні.",
            ru: "Украинцам: паспорт/ID, водительское удостоверение кат. B, ИНН. Иностранцам: загранпаспорт, водительское удостоверение (международное — если права не на латинице), штамп о въезде. Туристам из ЕС/США — национальные права действительны.",
            en: "Ukrainians: passport/ID, category B license, tax ID. Foreigners: passport, driver's license (international if not in Latin script), entry stamp. EU/US tourists — national licenses are valid.",
          },
        },
        {
          question: {
            uk: "Політика пального у Львові: як заправити авто перед поверненням?",
            ru: "Политика топлива во Львове: как заправить авто перед возвратом?",
            en: "Fuel policy in Lviv: how to refuel before returning the car?",
          },
          answer: {
            uk: "Правило «повний-повний»: отримали з повним баком — поверніть так само. АЗС OKKO, WOG, UPG є по всьому Львову і на виїздах. Не встигаєте заправитись? Є опція передплаченого пального (ринкова ціна + сервісний збір).",
            ru: "Правило «полный-полный»: получили с полным баком — верните так же. АЗС OKKO, WOG, UPG есть по всему Львову и на выездах. Не успеваете заправиться? Есть опция предоплаченного топлива (рыночная цена + сервисный сбор).",
            en: "Full-to-full rule: received with a full tank — return it the same. OKKO, WOG, UPG gas stations are throughout Lviv and at exits. No time to refuel? Prepaid fuel option available (market price + service fee).",
          },
        },
      ],
    },
  ],
  ternopil: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Тернополі?",
            ru: "Где парковать арендованный автомобиль в Тернополе?",
            en: "Where to park a rental car in Ternopil?",
          },
          answer: {
            uk: "У центрі Тернополя паркування переважно безкоштовне. Біля озера та на набережній є облаштовані паркінги. Уникайте паркування на газонах та під забороняючими знаками. Біля торгових центрів є безкоштовні парковки.",
            ru: "В центре Тернополя парковка преимущественно бесплатная. Возле озера и на набережной есть оборудованные паркинги. Избегайте парковки на газонах и под запрещающими знаками. Возле торговых центров есть бесплатные парковки.",
            en: "Parking in central Ternopil is mostly free. There are equipped parking lots near the lake and embankment. Avoid parking on lawns and under prohibition signs. Free parking is available near shopping centers.",
          },
        },
        {
          question: {
            uk: "Доставка авто в Тернополі: вокзал, центр, за адресою",
            ru: "Доставка авто в Тернополе: вокзал, центр, по адресу",
            en: "Car delivery in Ternopil: station, center, to your address",
          },
          answer: {
            uk: "Подача авто по Тернополю безкоштовна: залізничний вокзал, центр міста, набережна Тернопільського ставу, готелі. Час подачі — від 30 хвилин. Також можлива подача в сусідні міста (Збараж, Кременець) за домовленістю.",
            ru: "Подача авто по Тернополю бесплатная: ж/д вокзал, центр города, набережная Тернопольского пруда, отели. Время подачи — от 30 минут. Также возможна подача в соседние города (Збараж, Кременец) по договорённости.",
            en: "Car delivery in Ternopil is free: railway station, city center, Ternopil Lake embankment, hotels. Delivery time — from 30 minutes. Delivery to nearby towns (Zbarazh, Kremenets) is also available by arrangement.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу й як відвідати Почаїв та Кременець?",
            ru: "Есть ли лимит пробега и как посетить Почаев и Кременец?",
            en: "Is there a mileage limit and how to visit Pochaiv and Kremenets?",
          },
          answer: {
            uk: "Стандартний ліміт — 250 км/добу. Для маршрутів Тернопіль — Почаївська Лавра (60 км), Кременецькі гори (50 км), Збаразький замок (25 км) цього достатньо. Для далеких поїздок є тариф Unlimited.",
            ru: "Стандартный лимит — 250 км/сутки. Для маршрутов Тернополь — Почаевская Лавра (60 км), Кременецкие горы (50 км), Збаражский замок (25 км) этого достаточно. Для дальних поездок есть тариф Unlimited.",
            en: "Standard limit is 250 km/day. For routes Ternopil — Pochaiv Lavra (60 km), Kremenets Mountains (50 km), Zbarazh Castle (25 km) this is enough. Unlimited rate available for longer trips.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто в Тернополі?",
            ru: "Что покрывает страховка при аренде авто в Тернополе?",
            en: "What does insurance cover when renting a car in Ternopil?",
          },
          answer: {
            uk: "Всі авто мають базову ОСЦПВ. Додатково доступні пакети CDW (зменшення відповідальності) та SCDW (повне покриття). Для поїздок до печер Млинки/Оптимістична рекомендуємо розширену страховку.",
            ru: "Все авто имеют базовое ОСАГО. Дополнительно доступны пакеты CDW (уменьшение ответственности) и SCDW (полное покрытие). Для поездок к пещерам Млынки/Оптимистическая рекомендуем расширенную страховку.",
            en: "All cars have basic MTPL. Additional CDW (reduced liability) and SCDW (full coverage) packages available. Extended insurance recommended for trips to Mlynky/Optymistychna caves.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто в Тернополі?",
            ru: "Какой депозит при аренде авто в Тернополе?",
            en: "What is the deposit for car rental in Ternopil?",
          },
          answer: {
            uk: "Депозит залежить від класу авто: економ — від $150, бізнес — від $300, SUV — від $400. Пакет страхування «Комфорт» зменшує суму на 50%. Кошти повертаються після огляду авто.",
            ru: "Депозит зависит от класса авто: эконом — от $150, бизнес — от $300, SUV — от $400. Пакет страхования «Комфорт» уменьшает сумму на 50%. Средства возвращаются после осмотра авто.",
            en: "Deposit depends on car class: economy — from $150, business — from $300, SUV — from $400. 'Comfort' insurance package reduces the amount by 50%. Funds returned after car inspection.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати без застави в Тернополі?",
            ru: "Можно ли арендовать без залога в Тернополе?",
            en: "Can I rent without a deposit in Ternopil?",
          },
          answer: {
            uk: "Для постійних клієнтів та при довгостроковій оренді (від 2 тижнів) можлива оренда без застави або зі зменшеним депозитом. Умови обговорюються індивідуально.",
            ru: "Для постоянных клиентов и при долгосрочной аренде (от 2 недель) возможна аренда без залога или с уменьшенным депозитом. Условия обсуждаются индивидуально.",
            en: "For regular customers and long-term rentals (from 2 weeks), rental without deposit or with reduced deposit is possible. Terms discussed individually.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж для оренди в Тернополі",
            ru: "Минимальный возраст и стаж для аренды в Тернополе",
            en: "Minimum age and experience for rental in Ternopil",
          },
          answer: {
            uk: "Мінімум 21 рік і 2 роки водійського стажу. Для SUV та преміум-авто — від 23-25 років. Молодим водіям може нараховуватись додатковий збір.",
            ru: "Минимум 21 год и 2 года водительского стажа. Для SUV и премиум-авто — от 23-25 лет. Молодым водителям может начисляться дополнительный сбор.",
            en: "Minimum 21 years old and 2 years driving experience. For SUV and premium cars — from 23-25 years. Young driver fee may apply.",
          },
        },
        {
          question: {
            uk: "Чи можна виїхати з Тернополя до Львова чи Києва?",
            ru: "Можно ли выехать из Тернополя во Львов или Киев?",
            en: "Can I travel from Ternopil to Lviv or Kyiv?",
          },
          answer: {
            uk: "Так, подорожі по Україні дозволені без обмежень. Популярні маршрути: Тернопіль — Львів (130 км), Тернопіль — Київ (400 км), Тернопіль — Чернівці (200 км). Виїзд за кордон — за попереднім погодженням.",
            ru: "Да, путешествия по Украине разрешены без ограничений. Популярные маршруты: Тернополь — Львов (130 км), Тернополь — Киев (400 км), Тернополь — Черновцы (200 км). Выезд за границу — по предварительному согласованию.",
            en: "Yes, travel within Ukraine is allowed without restrictions. Popular routes: Ternopil — Lviv (130 km), Ternopil — Kyiv (400 km), Ternopil — Chernivtsi (200 km). Cross-border travel — by prior arrangement.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто в Тернополі?",
            ru: "Что запрещено при аренде авто в Тернополе?",
            en: "What is prohibited when renting a car in Ternopil?",
          },
          answer: {
            uk: "Заборонено: таксі/Uber, суборенда, участь у змаганнях, куріння, керування у стані сп'яніння. Перевезення тварин дозволене у переносці. Порушення — штраф і можливе розірвання договору.",
            ru: "Запрещено: такси/Uber, субаренда, участие в соревнованиях, курение, управление в состоянии опьянения. Перевозка животных разрешена в переноске. Нарушение — штраф и возможное расторжение договора.",
            en: "Prohibited: taxi/Uber, subletting, racing, smoking, driving under influence. Pet transport allowed in carriers. Violation — fine and possible contract termination.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Як оплатити оренду авто в Тернополі?",
            ru: "Как оплатить аренду авто в Тернополе?",
            en: "How to pay for car rental in Ternopil?",
          },
          answer: {
            uk: "Приймаємо картки Visa/Mastercard, готівку (гривня, долари, євро), Apple Pay/Google Pay. Для компаній — безготівковий розрахунок з ПДВ. Депозит — блокування на картці або готівка.",
            ru: "Принимаем карты Visa/Mastercard, наличные (гривна, доллары, евро), Apple Pay/Google Pay. Для компаний — безналичный расчёт с НДС. Депозит — блокировка на карте или наличные.",
            en: "We accept Visa/Mastercard, cash (UAH, USD, EUR), Apple Pay/Google Pay. For companies — bank transfer with VAT. Deposit — card block or cash.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди в Тернополі?",
            ru: "Какие документы нужны для аренды в Тернополе?",
            en: "What documents are required for rental in Ternopil?",
          },
          answer: {
            uk: "Громадянам України: паспорт/ID, посвідчення водія, ІПН. Іноземцям: закордонний паспорт, водійське посвідчення (міжнародне — якщо не латиницею). Вік від 21 року, стаж від 2 років.",
            ru: "Гражданам Украины: паспорт/ID, водительское удостоверение, ИНН. Иностранцам: загранпаспорт, водительское удостоверение (международное — если не на латинице). Возраст от 21 года, стаж от 2 лет.",
            en: "Ukrainian citizens: passport/ID, driver's license, tax ID. Foreigners: passport, driver's license (international if not in Latin). Age from 21, experience from 2 years.",
          },
        },
        {
          question: {
            uk: "Як повернути авто з повним баком у Тернополі?",
            ru: "Как вернуть авто с полным баком в Тернополе?",
            en: "How to return the car with a full tank in Ternopil?",
          },
          answer: {
            uk: "Правило «повний-повний». АЗС WOG, OKKO, SOCAR є по всьому місту та на виїздах. Якщо не встигаєте — є опція передплаченого пального. Повернення з неповним баком — доплата за пальне + сервісний збір.",
            ru: "Правило «полный-полный». АЗС WOG, OKKO, SOCAR есть по всему городу и на выездах. Если не успеваете — есть опция предоплаченного топлива. Возврат с неполным баком — доплата за топливо + сервисный сбор.",
            en: "Full-to-full rule. WOG, OKKO, SOCAR gas stations throughout the city and at exits. If no time — prepaid fuel option available. Return with less fuel — fuel charge + service fee.",
          },
        },
      ],
    },
  ],
  odesa: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль в Одесі влітку?",
            ru: "Где парковать арендованный автомобиль в Одессе летом?",
            en: "Where to park a rental car in Odesa in summer?",
          },
          answer: {
            uk: "У центрі Одеси (Дерибасівська, Приморський бульвар) паркування платне та обмежене. В Аркадії влітку — підземні паркінги біля готелів. На пляжах Ланжерон, Отрада є парковки. Оплата через Odesa Parking або паркомати.",
            ru: "В центре Одессы (Дерибасовская, Приморский бульвар) парковка платная и ограниченная. В Аркадии летом — подземные паркинги возле отелей. На пляжах Ланжерон, Отрада есть парковки. Оплата через Odesa Parking или паркоматы.",
            en: "In central Odesa (Derybasivska, Prymorskyi Boulevard), parking is paid and limited. In Arcadia in summer — underground parking near hotels. Lanzheron, Otrada beaches have parking. Pay via Odesa Parking or parking meters.",
          },
        },
        {
          question: {
            uk: "Доставка авто в аеропорт Одеса (ODS) та на вокзал: умови",
            ru: "Доставка авто в аэропорт Одесса (ODS) и на вокзал: условия",
            en: "Car delivery to Odesa Airport (ODS) and station: terms",
          },
          answer: {
            uk: "Подача в аеропорт Одеса (ODS), на залізничний вокзал, в Аркадію, на Дерибасівську — безкоштовна. Менеджер зустріне з табличкою. Час подачі від 30 хвилин. Також доставляємо в Затоку та на курорти (за домовленістю).",
            ru: "Подача в аэропорт Одесса (ODS), на ж/д вокзал, в Аркадию, на Дерибасовскую — бесплатная. Менеджер встретит с табличкой. Время подачи от 30 минут. Также доставляем в Затоку и на курорты (по договорённости).",
            en: "Delivery to Odesa Airport (ODS), railway station, Arcadia, Derybasivska — free. Manager meets with a sign. Delivery from 30 minutes. We also deliver to Zatoka and resorts (by arrangement).",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу й як поїхати в Затоку та на курорти?",
            ru: "Есть ли лимит пробега и как поехать в Затоку и на курорты?",
            en: "Is there a mileage limit and how to visit Zatoka and resorts?",
          },
          answer: {
            uk: "Стандартний ліміт — 250-300 км/добу. Для маршрутів Одеса — Затока (60 км), Кароліно-Бугаз (65 км), Білгород-Дністровський (80 км) цього достатньо. Для далеких поїздок (Київ, Молдова) є Unlimited.",
            ru: "Стандартный лимит — 250-300 км/сутки. Для маршрутов Одесса — Затока (60 км), Каролино-Бугаз (65 км), Белгород-Днестровский (80 км) этого достаточно. Для дальних поездок (Киев, Молдова) есть Unlimited.",
            en: "Standard limit is 250-300 km/day. For routes Odesa — Zatoka (60 km), Karolino-Buhaz (65 km), Bilhorod-Dnistrovskyi (80 km) this is enough. Unlimited available for long trips (Kyiv, Moldova).",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто в Одесі?",
            ru: "Что покрывает страховка при аренде авто в Одессе?",
            en: "What does insurance cover when renting a car in Odesa?",
          },
          answer: {
            uk: "Базова ОСЦПВ включена. Пакети CDW/SCDW зменшують вашу відповідальність. Для літнього сезону в Одесі (інтенсивний трафік) рекомендуємо пакет «Комфорт» або «Преміум» — покриття навіть дрібних подряпин.",
            ru: "Базовое ОСАГО включено. Пакеты CDW/SCDW уменьшают вашу ответственность. Для летнего сезона в Одессе (интенсивный трафик) рекомендуем пакет «Комфорт» или «Премиум» — покрытие даже мелких царапин.",
            en: "Basic MTPL included. CDW/SCDW packages reduce your liability. For summer season in Odesa (heavy traffic), we recommend 'Comfort' or 'Premium' package — covers even minor scratches.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто в Одесі влітку?",
            ru: "Какой депозит при аренде авто в Одессе летом?",
            en: "What is the deposit for car rental in Odesa in summer?",
          },
          answer: {
            uk: "Депозит: економ — від $200, бізнес — від $400, кабріолет — від $600. Влітку попит високий — бронюйте заздалегідь. Пакет «Преміум» зменшує депозит до $200-300 для всіх класів.",
            ru: "Депозит: эконом — от $200, бизнес — от $400, кабриолет — от $600. Летом спрос высокий — бронируйте заранее. Пакет «Премиум» уменьшает депозит до $200-300 для всех классов.",
            en: "Deposit: economy — from $200, business — from $400, convertible — from $600. Summer demand is high — book in advance. 'Premium' package reduces deposit to $200-300 for all classes.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати кабріолет в Одесі без великої застави?",
            ru: "Можно ли арендовать кабриолет в Одессе без большого залога?",
            en: "Can I rent a convertible in Odesa without a large deposit?",
          },
          answer: {
            uk: "Так, з пакетом «Преміум» застава на кабріолети зменшується до $300-400. Кабріолети особливо популярні влітку — бронюйте за 1-2 тижні. Доступні: Mercedes C-Class Cabrio, BMW 4 Series.",
            ru: "Да, с пакетом «Премиум» залог на кабриолеты уменьшается до $300-400. Кабриолеты особенно популярны летом — бронируйте за 1-2 недели. Доступны: Mercedes C-Class Cabrio, BMW 4 Series.",
            en: "Yes, with 'Premium' package, convertible deposit is reduced to $300-400. Convertibles are especially popular in summer — book 1-2 weeks ahead. Available: Mercedes C-Class Cabrio, BMW 4 Series.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік для оренди авто в Одесі (кабріолети, преміум)",
            ru: "Минимальный возраст для аренды авто в Одессе (кабриолеты, премиум)",
            en: "Minimum age for car rental in Odesa (convertibles, premium)",
          },
          answer: {
            uk: "Економ/бізнес: 21 рік, стаж 2 роки. Кабріолети та преміум: від 25 років, стаж 3-4 роки. Для водіїв 21-24 років може діяти додатковий збір «молодий водій».",
            ru: "Эконом/бизнес: 21 год, стаж 2 года. Кабриолеты и премиум: от 25 лет, стаж 3-4 года. Для водителей 21-24 лет может действовать дополнительный сбор «молодой водитель».",
            en: "Economy/business: 21 years, 2 years experience. Convertibles and premium: from 25 years, 3-4 years experience. Drivers 21-24 may have 'young driver' surcharge.",
          },
        },
        {
          question: {
            uk: "Чи можна виїхати з Одеси до Молдови на орендованому авто?",
            ru: "Можно ли выехать из Одессы в Молдову на арендованном авто?",
            en: "Can I travel from Odesa to Moldova by rental car?",
          },
          answer: {
            uk: "Так, виїзд до Молдови можливий за попереднім погодженням (48 годин). Потрібно: Green Card, додаткова страховка, збір за міжнародну поїздку. Кишинів — 180 км від Одеси, зручний маршрут на день.",
            ru: "Да, выезд в Молдову возможен по предварительному согласованию (48 часов). Нужно: Green Card, дополнительная страховка, сбор за международную поездку. Кишинёв — 180 км от Одессы, удобный маршрут на день.",
            en: "Yes, travel to Moldova possible with prior arrangement (48 hours). Required: Green Card, additional insurance, international trip fee. Chisinau — 180 km from Odesa, convenient day trip.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто в Одесі?",
            ru: "Что запрещено при аренде авто в Одессе?",
            en: "What is prohibited when renting a car in Odesa?",
          },
          answer: {
            uk: "Заборонено: таксі/Uber/Bolt, суборенда, куріння, виїзд на пляж (пісок пошкоджує авто). Перевезення тварин — у переносці. Влітку слідкуйте за температурою двигуна в заторах Аркадії.",
            ru: "Запрещено: такси/Uber/Bolt, субаренда, курение, выезд на пляж (песок повреждает авто). Перевозка животных — в переноске. Летом следите за температурой двигателя в пробках Аркадии.",
            en: "Prohibited: taxi/Uber/Bolt, subletting, smoking, driving on beach (sand damages car). Pets in carriers. In summer, watch engine temperature in Arcadia traffic jams.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Як оплатити оренду авто в Одесі туристу?",
            ru: "Как оплатить аренду авто в Одессе туристу?",
            en: "How can a tourist pay for car rental in Odesa?",
          },
          answer: {
            uk: "Приймаємо: міжнародні картки Visa/Mastercard, готівку USD/EUR/UAH, Apple Pay/Google Pay. Для іноземних туристів — оплата карткою будь-якого банку світу. Депозит — блокування на картці.",
            ru: "Принимаем: международные карты Visa/Mastercard, наличные USD/EUR/UAH, Apple Pay/Google Pay. Для иностранных туристов — оплата картой любого банка мира. Депозит — блокировка на карте.",
            en: "We accept: international Visa/Mastercard, cash USD/EUR/UAH, Apple Pay/Google Pay. Foreign tourists can pay with any international bank card. Deposit — card block.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні туристу для оренди в Одесі?",
            ru: "Какие документы нужны туристу для аренды в Одессе?",
            en: "What documents does a tourist need to rent in Odesa?",
          },
          answer: {
            uk: "Іноземцям: закордонний паспорт, водійське посвідчення (міжнародне — якщо не латиницею), штамп про в'їзд. Українцям: паспорт/ID, права кат. B, ІПН. Вік від 21 року.",
            ru: "Иностранцам: загранпаспорт, водительское удостоверение (международное — если не на латинице), штамп о въезде. Украинцам: паспорт/ID, права кат. B, ИНН. Возраст от 21 года.",
            en: "Foreigners: passport, driver's license (international if not in Latin), entry stamp. Ukrainians: passport/ID, category B license, tax ID. Age from 21.",
          },
        },
        {
          question: {
            uk: "Де заправити авто перед поверненням в Одесі?",
            ru: "Где заправить авто перед возвратом в Одессе?",
            en: "Where to refuel before returning the car in Odesa?",
          },
          answer: {
            uk: "Правило «повний-повний». АЗС OKKO, WOG, Shell є по всій Одесі, на трасі до аеропорту та в Аркадії. Біля вокзалу — OKKO на Пантелеймонівській. Передплачене пальне — за запитом.",
            ru: "Правило «полный-полный». АЗС OKKO, WOG, Shell есть по всей Одессе, на трассе к аэропорту и в Аркадии. Возле вокзала — OKKO на Пантелеймоновской. Предоплаченное топливо — по запросу.",
            en: "Full-to-full rule. OKKO, WOG, Shell stations throughout Odesa, on airport road and in Arcadia. Near station — OKKO on Panteleimonivska. Prepaid fuel — on request.",
          },
        },
      ],
    },
  ],
  dnipro: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Дніпрі?",
            ru: "Где парковать арендованный автомобиль в Днепре?",
            en: "Where to park a rental car in Dnipro?",
          },
          answer: {
            uk: "У центрі Дніпра (пр. Яворницького, набережна) є платні та безкоштовні парковки. Біля ТРЦ «Мост-сіті», «Passage» — безкоштовні паркінги. На набережній — зони з погодинною оплатою. Уникайте паркування під знаками заборони.",
            ru: "В центре Днепра (пр. Яворницкого, набережная) есть платные и бесплатные парковки. Возле ТРЦ «Мост-сити», «Passage» — бесплатные паркинги. На набережной — зоны с почасовой оплатой. Избегайте парковки под знаками запрета.",
            en: "In central Dnipro (Yavornytskoho Ave, embankment), there are paid and free parking. Near Most-City, Passage malls — free parking. On the embankment — hourly paid zones. Avoid parking under prohibition signs.",
          },
        },
        {
          question: {
            uk: "Доставка авто в аеропорт Дніпро (DNK) та на вокзал",
            ru: "Доставка авто в аэропорт Днепр (DNK) и на вокзал",
            en: "Car delivery to Dnipro Airport (DNK) and station",
          },
          answer: {
            uk: "Подача в аеропорт Дніпро (DNK), на залізничний вокзал, у центр міста — безкоштовна. Також доставляємо на набережну, в готелі та за адресою. Час подачі — від 30 хвилин.",
            ru: "Подача в аэропорт Днепр (DNK), на ж/д вокзал, в центр города — бесплатная. Также доставляем на набережную, в отели и по адресу. Время подачи — от 30 минут.",
            en: "Delivery to Dnipro Airport (DNK), railway station, city center — free. We also deliver to the embankment, hotels, and your address. Delivery time — from 30 minutes.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу й як поїхати в Запоріжжя та Харків?",
            ru: "Есть ли лимит пробега и как поехать в Запорожье и Харьков?",
            en: "Is there a mileage limit and how to travel to Zaporizhzhia and Kharkiv?",
          },
          answer: {
            uk: "Стандартний ліміт — 250-300 км/добу. Для маршрутів Дніпро — Запоріжжя (80 км), Хортиця, Кривий Ріг (150 км) достатньо. Для Києва (480 км), Харкова (220 км) рекомендуємо Unlimited.",
            ru: "Стандартный лимит — 250-300 км/сутки. Для маршрутов Днепр — Запорожье (80 км), Хортица, Кривой Рог (150 км) достаточно. Для Киева (480 км), Харькова (220 км) рекомендуем Unlimited.",
            en: "Standard limit is 250-300 km/day. For routes Dnipro — Zaporizhzhia (80 km), Khortytsia, Kryvyi Rih (150 km) this is enough. For Kyiv (480 km), Kharkiv (220 km) we recommend Unlimited.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто у Дніпрі?",
            ru: "Что покрывает страховка при аренде авто в Днепре?",
            en: "What does insurance cover when renting a car in Dnipro?",
          },
          answer: {
            uk: "Базова ОСЦПВ включена. Пакети CDW/SCDW зменшують відповідальність. Для ділових поїздок рекомендуємо «Комфорт» або «Преміум» — повне покриття пошкоджень без зайвих питань.",
            ru: "Базовое ОСАГО включено. Пакеты CDW/SCDW уменьшают ответственность. Для деловых поездок рекомендуем «Комфорт» или «Премиум» — полное покрытие повреждений без лишних вопросов.",
            en: "Basic MTPL included. CDW/SCDW packages reduce liability. For business trips, we recommend 'Comfort' or 'Premium' — full damage coverage without extra questions.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто у Дніпрі?",
            ru: "Какой депозит при аренде авто в Днепре?",
            en: "What is the deposit for car rental in Dnipro?",
          },
          answer: {
            uk: "Депозит: економ — від $150, бізнес — від $350, SUV — від $450. Пакет «Комфорт» зменшує на 50%, «Преміум» — до мінімуму. Кошти повертаються після огляду авто протягом 1-3 днів.",
            ru: "Депозит: эконом — от $150, бизнес — от $350, SUV — от $450. Пакет «Комфорт» уменьшает на 50%, «Премиум» — до минимума. Средства возвращаются после осмотра авто в течение 1-3 дней.",
            en: "Deposit: economy — from $150, business — from $350, SUV — from $450. 'Comfort' package reduces by 50%, 'Premium' — to minimum. Funds returned after car inspection within 1-3 days.",
          },
        },
        {
          question: {
            uk: "Чи є оренда без застави для бізнес-клієнтів у Дніпрі?",
            ru: "Есть ли аренда без залога для бизнес-клиентов в Днепре?",
            en: "Is there no-deposit rental for business clients in Dnipro?",
          },
          answer: {
            uk: "Так, для корпоративних клієнтів та при довгостроковій оренді (від 1 місяця) можлива оренда без застави або зі зменшеним депозитом. Оформлення договору на юридичну особу з ПДВ.",
            ru: "Да, для корпоративных клиентов и при долгосрочной аренде (от 1 месяца) возможна аренда без залога или с уменьшенным депозитом. Оформление договора на юридическое лицо с НДС.",
            en: "Yes, for corporate clients and long-term rentals (from 1 month), no-deposit or reduced deposit rental is possible. Contract issued to legal entity with VAT.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж для оренди авто у Дніпрі",
            ru: "Минимальный возраст и стаж для аренды авто в Днепре",
            en: "Minimum age and experience for car rental in Dnipro",
          },
          answer: {
            uk: "Мінімум 21 рік і 2 роки стажу. Для бізнес-класу та SUV — від 23 років. Преміум-авто — від 25 років, стаж 3-4 роки. Молодим водіям може нараховуватись додатковий збір.",
            ru: "Минимум 21 год и 2 года стажа. Для бизнес-класса и SUV — от 23 лет. Премиум-авто — от 25 лет, стаж 3-4 года. Молодым водителям может начисляться дополнительный сбор.",
            en: "Minimum 21 years and 2 years experience. For business class and SUV — from 23 years. Premium cars — from 25 years, 3-4 years experience. Young driver fee may apply.",
          },
        },
        {
          question: {
            uk: "Чи можна виїхати з Дніпра до Києва або Харкова?",
            ru: "Можно ли выехать из Днепра в Киев или Харьков?",
            en: "Can I travel from Dnipro to Kyiv or Kharkiv?",
          },
          answer: {
            uk: "Так, подорожі по Україні без обмежень. Популярні маршрути: Дніпро — Київ (480 км, 5 год), Дніпро — Харків (220 км, 2.5 год), Дніпро — Одеса (450 км). Для далеких поїздок — тариф Unlimited.",
            ru: "Да, путешествия по Украине без ограничений. Популярные маршруты: Днепр — Киев (480 км, 5 ч), Днепр — Харьков (220 км, 2.5 ч), Днепр — Одесса (450 км). Для дальних поездок — тариф Unlimited.",
            en: "Yes, travel within Ukraine without restrictions. Popular routes: Dnipro — Kyiv (480 km, 5 hrs), Dnipro — Kharkiv (220 km, 2.5 hrs), Dnipro — Odesa (450 km). For long trips — Unlimited rate.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто у Дніпрі?",
            ru: "Что запрещено при аренде авто в Днепре?",
            en: "What is prohibited when renting a car in Dnipro?",
          },
          answer: {
            uk: "Заборонено: таксі/Uber/Bolt, суборенда, куріння, участь у змаганнях, керування у стані сп'яніння. Перевезення тварин — у переносці. Порушення — штраф та розірвання договору.",
            ru: "Запрещено: такси/Uber/Bolt, субаренда, курение, участие в соревнованиях, управление в состоянии опьянения. Перевозка животных — в переноске. Нарушение — штраф и расторжение договора.",
            en: "Prohibited: taxi/Uber/Bolt, subletting, smoking, racing, driving under influence. Pets in carriers only. Violation — fine and contract termination.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Як оплатити оренду авто у Дніпрі?",
            ru: "Как оплатить аренду авто в Днепре?",
            en: "How to pay for car rental in Dnipro?",
          },
          answer: {
            uk: "Приймаємо: Visa/Mastercard (Apple Pay, Google Pay), готівку UAH/USD/EUR, безготівковий розрахунок для компаній з ПДВ. Депозит — блокування на картці або готівка.",
            ru: "Принимаем: Visa/Mastercard (Apple Pay, Google Pay), наличные UAH/USD/EUR, безналичный расчёт для компаний с НДС. Депозит — блокировка на карте или наличные.",
            en: "We accept: Visa/Mastercard (Apple Pay, Google Pay), cash UAH/USD/EUR, bank transfer for companies with VAT. Deposit — card block or cash.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди у Дніпрі?",
            ru: "Какие документы нужны для аренды в Днепре?",
            en: "What documents are required for rental in Dnipro?",
          },
          answer: {
            uk: "Українцям: паспорт/ID, посвідчення водія кат. B, ІПН. Іноземцям: закордонний паспорт, права (міжнародні — якщо не латиницею). Компаніям: статут, довіреність на представника.",
            ru: "Украинцам: паспорт/ID, водительское удостоверение кат. B, ИНН. Иностранцам: загранпаспорт, права (международные — если не на латинице). Компаниям: устав, доверенность на представителя.",
            en: "Ukrainians: passport/ID, category B license, tax ID. Foreigners: passport, license (international if not in Latin). Companies: charter, power of attorney for representative.",
          },
        },
        {
          question: {
            uk: "Де заправити авто перед поверненням у Дніпрі?",
            ru: "Где заправить авто перед возвратом в Днепре?",
            en: "Where to refuel before returning the car in Dnipro?",
          },
          answer: {
            uk: "Правило «повний-повний». АЗС OKKO, WOG, SOCAR є по всьому місту, на виїздах на Київ та Запоріжжя. Біля вокзалу та аеропорту — декілька станцій. Передплачене пальне — за запитом.",
            ru: "Правило «полный-полный». АЗС OKKO, WOG, SOCAR есть по всему городу, на выездах на Киев и Запорожье. Возле вокзала и аэропорта — несколько станций. Предоплаченное топливо — по запросу.",
            en: "Full-to-full rule. OKKO, WOG, SOCAR stations throughout the city, at exits to Kyiv and Zaporizhzhia. Near station and airport — several stations. Prepaid fuel — on request.",
          },
        },
      ],
    },
  ],
  kharkiv: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Харкові?",
            ru: "Где парковать арендованный автомобиль в Харькове?",
            en: "Where to park a rental car in Kharkiv?",
          },
          answer: {
            uk: "У центрі Харкова (пл. Свободи, Сумська) паркування платне. Біля ТРЦ «Французький бульвар», «Дафі» — безкоштовні паркінги. Є підземні паркінги в центрі. Уникайте паркування на трамвайних коліях та під знаками.",
            ru: "В центре Харькова (пл. Свободы, Сумская) парковка платная. Возле ТРЦ «Французский бульвар», «Дафи» — бесплатные паркинги. Есть подземные паркинги в центре. Избегайте парковки на трамвайных путях и под знаками.",
            en: "In central Kharkiv (Freedom Square, Sumska), parking is paid. Near French Boulevard, Dafi malls — free parking. Underground parking available in center. Avoid parking on tram tracks and under signs.",
          },
        },
        {
          question: {
            uk: "Доставка авто на вокзал та в центр Харкова",
            ru: "Доставка авто на вокзал и в центр Харькова",
            en: "Car delivery to station and Kharkiv center",
          },
          answer: {
            uk: "Подача на залізничний вокзал Харків-Пасажирський, у центр міста (пл. Свободи, Сумська), готелі — безкоштовна. Час подачі від 30 хвилин. Доставка за адресою по всьому місту.",
            ru: "Подача на ж/д вокзал Харьков-Пассажирский, в центр города (пл. Свободы, Сумская), отели — бесплатная. Время подачи от 30 минут. Доставка по адресу по всему городу.",
            en: "Delivery to Kharkiv-Pasazhyrskyi station, city center (Freedom Square, Sumska), hotels — free. Delivery time from 30 minutes. Address delivery throughout the city.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу й як поїхати в Полтаву та Дніпро?",
            ru: "Есть ли лимит пробега и как поехать в Полтаву и Днепр?",
            en: "Is there a mileage limit and how to travel to Poltava and Dnipro?",
          },
          answer: {
            uk: "Стандартний ліміт — 250-300 км/добу. Для маршрутів Харків — Полтава (140 км), природні парки Харківщини достатньо. Для Дніпра (220 км), Києва (480 км) рекомендуємо Unlimited.",
            ru: "Стандартный лимит — 250-300 км/сутки. Для маршрутов Харьков — Полтава (140 км), природные парки Харьковщины достаточно. Для Днепра (220 км), Киева (480 км) рекомендуем Unlimited.",
            en: "Standard limit is 250-300 km/day. For routes Kharkiv — Poltava (140 km), Kharkiv region nature parks this is enough. For Dnipro (220 km), Kyiv (480 km) we recommend Unlimited.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто у Харкові?",
            ru: "Что покрывает страховка при аренде авто в Харькове?",
            en: "What does insurance cover when renting a car in Kharkiv?",
          },
          answer: {
            uk: "Базова ОСЦПВ включена в усі тарифи. Пакети CDW/SCDW зменшують вашу відповідальність при пошкодженні. Пакет «Преміум» покриває навіть дрібні подряпини, шини та скло.",
            ru: "Базовое ОСАГО включено во все тарифы. Пакеты CDW/SCDW уменьшают вашу ответственность при повреждении. Пакет «Премиум» покрывает даже мелкие царапины, шины и стекло.",
            en: "Basic MTPL included in all rates. CDW/SCDW packages reduce your liability for damage. 'Premium' package covers even minor scratches, tires, and glass.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто у Харкові?",
            ru: "Какой депозит при аренде авто в Харькове?",
            en: "What is the deposit for car rental in Kharkiv?",
          },
          answer: {
            uk: "Депозит: економ — від $150, бізнес — від $350, SUV — від $400. Пакет «Комфорт» зменшує депозит на 50%, «Преміум» — до мінімуму ($200). Кошти повертаються протягом 1-3 днів.",
            ru: "Депозит: эконом — от $150, бизнес — от $350, SUV — от $400. Пакет «Комфорт» уменьшает депозит на 50%, «Премиум» — до минимума ($200). Средства возвращаются в течение 1-3 дней.",
            en: "Deposit: economy — from $150, business — from $350, SUV — from $400. 'Comfort' package reduces deposit by 50%, 'Premium' — to minimum ($200). Funds returned within 1-3 days.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто у Харкові без застави?",
            ru: "Можно ли арендовать авто в Харькове без залога?",
            en: "Can I rent a car in Kharkiv without a deposit?",
          },
          answer: {
            uk: "Для окремих моделей економ-класу та при довгостроковій оренді (від 2 тижнів) доступна оренда без застави. З пакетом «Преміум» депозит мінімальний для всіх класів. Умови — при бронюванні.",
            ru: "Для отдельных моделей эконом-класса и при долгосрочной аренде (от 2 недель) доступна аренда без залога. С пакетом «Премиум» депозит минимальный для всех классов. Условия — при бронировании.",
            en: "For selected economy models and long-term rentals (from 2 weeks), no-deposit rental is available. With 'Premium' package, deposit is minimal for all classes. Terms — when booking.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж для оренди авто у Харкові",
            ru: "Минимальный возраст и стаж для аренды авто в Харькове",
            en: "Minimum age and experience for car rental in Kharkiv",
          },
          answer: {
            uk: "Мінімум 21 рік і 2 роки стажу. Для бізнес-класу та SUV — від 23 років. Преміум — від 25 років, стаж 3-4 роки. Молодим водіям може нараховуватись додатковий збір.",
            ru: "Минимум 21 год и 2 года стажа. Для бизнес-класса и SUV — от 23 лет. Премиум — от 25 лет, стаж 3-4 года. Молодым водителям может начисляться дополнительный сбор.",
            en: "Minimum 21 years and 2 years experience. For business class and SUV — from 23. Premium — from 25, 3-4 years experience. Young driver fee may apply.",
          },
        },
        {
          question: {
            uk: "Чи можна виїхати з Харкова до Києва або Дніпра?",
            ru: "Можно ли выехать из Харькова в Киев или Днепр?",
            en: "Can I travel from Kharkiv to Kyiv or Dnipro?",
          },
          answer: {
            uk: "Так, подорожі по Україні без обмежень. Популярні маршрути: Харків — Київ (480 км), Харків — Дніпро (220 км), Харків — Полтава (140 км). Для далеких поїздок — тариф Unlimited.",
            ru: "Да, путешествия по Украине без ограничений. Популярные маршруты: Харьков — Киев (480 км), Харьков — Днепр (220 км), Харьков — Полтава (140 км). Для дальних поездок — тариф Unlimited.",
            en: "Yes, travel within Ukraine without restrictions. Popular routes: Kharkiv — Kyiv (480 km), Kharkiv — Dnipro (220 km), Kharkiv — Poltava (140 km). For long trips — Unlimited rate.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто у Харкові?",
            ru: "Что запрещено при аренде авто в Харькове?",
            en: "What is prohibited when renting a car in Kharkiv?",
          },
          answer: {
            uk: "Заборонено: таксі/Uber/Bolt, суборенда, куріння, участь у змаганнях, керування у стані сп'яніння. Перевезення тварин — у переносці. Порушення — штраф та розірвання договору.",
            ru: "Запрещено: такси/Uber/Bolt, субаренда, курение, участие в соревнованиях, управление в состоянии опьянения. Перевозка животных — в переноске. Нарушение — штраф и расторжение договора.",
            en: "Prohibited: taxi/Uber/Bolt, subletting, smoking, racing, driving under influence. Pets in carriers. Violation — fine and contract termination.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Як оплатити оренду авто у Харкові?",
            ru: "Как оплатить аренду авто в Харькове?",
            en: "How to pay for car rental in Kharkiv?",
          },
          answer: {
            uk: "Приймаємо: Visa/Mastercard (Apple Pay, Google Pay), готівку UAH/USD/EUR, безготівковий розрахунок для компаній. Депозит — блокування на картці або готівка.",
            ru: "Принимаем: Visa/Mastercard (Apple Pay, Google Pay), наличные UAH/USD/EUR, безналичный расчёт для компаний. Депозит — блокировка на карте или наличные.",
            en: "We accept: Visa/Mastercard (Apple Pay, Google Pay), cash UAH/USD/EUR, bank transfer for companies. Deposit — card block or cash.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди у Харкові?",
            ru: "Какие документы нужны для аренды в Харькове?",
            en: "What documents are required for rental in Kharkiv?",
          },
          answer: {
            uk: "Українцям: паспорт/ID, посвідчення водія кат. B, ІПН. Іноземцям: закордонний паспорт, права (міжнародні — якщо не латиницею), штамп про в'їзд. Вік від 21 року.",
            ru: "Украинцам: паспорт/ID, водительское удостоверение кат. B, ИНН. Иностранцам: загранпаспорт, права (международные — если не на латинице), штамп о въезде. Возраст от 21 года.",
            en: "Ukrainians: passport/ID, category B license, tax ID. Foreigners: passport, license (international if not in Latin), entry stamp. Age from 21.",
          },
        },
        {
          question: {
            uk: "Де заправити авто перед поверненням у Харкові?",
            ru: "Где заправить авто перед возвратом в Харькове?",
            en: "Where to refuel before returning the car in Kharkiv?",
          },
          answer: {
            uk: "Правило «повний-повний». АЗС OKKO, WOG, Shell є по всьому місту та на виїздах. Біля вокзалу — OKKO на Полтавському шляху. Передплачене пальне — за запитом.",
            ru: "Правило «полный-полный». АЗС OKKO, WOG, Shell есть по всему городу и на выездах. Возле вокзала — OKKO на Полтавском пути. Предоплаченное топливо — по запросу.",
            en: "Full-to-full rule. OKKO, WOG, Shell stations throughout the city and at exits. Near station — OKKO on Poltavskyi Shliakh. Prepaid fuel — on request.",
          },
        },
      ],
    },
  ],
  bukovel: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль на курорті Буковель?",
            ru: "Где парковать арендованный автомобиль на курорте Буковель?",
            en: "Where to park a rental car at Bukovel resort?",
          },
          answer: {
            uk: "На Буковелі є платні паркінги біля підйомників (P1-P8). Біля готелів зазвичай безкоштовне паркування для гостей. Взимку рекомендуємо залишати авто на охороняваному паркінгу — сніг може накрити машину за ніч.",
            ru: "На Буковеле есть платные паркинги возле подъёмников (P1-P8). Возле отелей обычно бесплатная парковка для гостей. Зимой рекомендуем оставлять авто на охраняемой парковке — снег может засыпать машину за ночь.",
            en: "Bukovel has paid parking near lifts (P1-P8). Hotels usually have free parking for guests. In winter, we recommend leaving the car in guarded parking — snow can cover the car overnight.",
          },
        },
        {
          question: {
            uk: "Де забрати авто для поїздки в Буковель?",
            ru: "Где забрать авто для поездки в Буковель?",
            en: "Where to pick up a car for a trip to Bukovel?",
          },
          answer: {
            uk: "Авто можна забрати: аеропорт Івано-Франківськ (IFO) — 100 км до Буковеля; Львів (LWO, вокзал) — 280 км. Також доставляємо безпосередньо на курорт за домовленістю. Взимку рекомендуємо SUV з повним приводом.",
            ru: "Авто можно забрать: аэропорт Ивано-Франковск (IFO) — 100 км до Буковеля; Львов (LWO, вокзал) — 280 км. Также доставляем непосредственно на курорт по договорённости. Зимой рекомендуем SUV с полным приводом.",
            en: "Pick up locations: Ivano-Frankivsk Airport (IFO) — 100 km to Bukovel; Lviv (LWO, station) — 280 km. We also deliver directly to the resort by arrangement. In winter, we recommend AWD SUV.",
          },
        },
        {
          question: {
            uk: "Яке авто краще для Буковеля взимку?",
            ru: "Какое авто лучше для Буковеля зимой?",
            en: "Which car is best for Bukovel in winter?",
          },
          answer: {
            uk: "Для зимових поїздок рекомендуємо повнопривідні SUV: Skoda Kodiaq, VW Tiguan, Toyota RAV4, Mitsubishi Outlander. Всі авто оснащені зимовою гумою в сезон. Для літа підійде будь-яке авто — дорога до Буковеля асфальтована.",
            ru: "Для зимних поездок рекомендуем полноприводные SUV: Skoda Kodiaq, VW Tiguan, Toyota RAV4, Mitsubishi Outlander. Все авто оснащены зимней резиной в сезон. Для лета подойдёт любое авто — дорога до Буковеля асфальтированная.",
            en: "For winter trips, we recommend AWD SUVs: Skoda Kodiaq, VW Tiguan, Toyota RAV4, Mitsubishi Outlander. All cars have winter tires in season. For summer, any car works — the road to Bukovel is paved.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Яка страховка потрібна для поїздки в Карпати?",
            ru: "Какая страховка нужна для поездки в Карпаты?",
            en: "What insurance is needed for a trip to the Carpathians?",
          },
          answer: {
            uk: "Для гірських доріг рекомендуємо пакет «Преміум» — він покриває пошкодження шин, скла, дзеркал та днища на серпантинах. Базова ОСЦПВ включена. CDW/SCDW зменшують вашу відповідальність.",
            ru: "Для горных дорог рекомендуем пакет «Премиум» — он покрывает повреждения шин, стекла, зеркал и днища на серпантинах. Базовое ОСАГО включено. CDW/SCDW уменьшают вашу ответственность.",
            en: "For mountain roads, we recommend 'Premium' package — it covers tire, glass, mirror, and underbody damage on serpentines. Basic MTPL included. CDW/SCDW reduce your liability.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді SUV для Буковеля?",
            ru: "Какой депозит при аренде SUV для Буковеля?",
            en: "What is the deposit for SUV rental for Bukovel?",
          },
          answer: {
            uk: "Депозит на SUV: від $400-500. Пакет «Комфорт» зменшує на 50%, «Преміум» — до $200-300. Взимку попит на SUV високий — бронюйте за 1-2 тижні, особливо на новорічні свята.",
            ru: "Депозит на SUV: от $400-500. Пакет «Комфорт» уменьшает на 50%, «Премиум» — до $200-300. Зимой спрос на SUV высокий — бронируйте за 1-2 недели, особенно на новогодние праздники.",
            en: "SUV deposit: from $400-500. 'Comfort' package reduces by 50%, 'Premium' — to $200-300. In winter, SUV demand is high — book 1-2 weeks ahead, especially for New Year holidays.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто на Буковель без великої застави?",
            ru: "Можно ли арендовать авто на Буковель без большого залога?",
            en: "Can I rent a car for Bukovel without a large deposit?",
          },
          answer: {
            uk: "З пакетом «Преміум» застава на SUV зменшується до $200-300. Для постійних клієнтів можливі індивідуальні умови. Також є опція економ-кросоверів з меншим депозитом.",
            ru: "С пакетом «Премиум» залог на SUV уменьшается до $200-300. Для постоянных клиентов возможны индивидуальные условия. Также есть опция эконом-кроссоверов с меньшим депозитом.",
            en: "With 'Premium' package, SUV deposit is reduced to $200-300. Individual terms available for regular clients. Economy crossovers with lower deposits are also available.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік для оренди SUV на Буковель",
            ru: "Минимальный возраст для аренды SUV на Буковель",
            en: "Minimum age for SUV rental for Bukovel",
          },
          answer: {
            uk: "Для SUV та кросоверів: від 23 років, стаж 3 роки. Для преміум-SUV (BMW X5, Mercedes GLE): від 25 років, стаж 4 роки. Для молодших водіїв доступні компактні кросовери зі збільшеним депозитом.",
            ru: "Для SUV и кроссоверов: от 23 лет, стаж 3 года. Для премиум-SUV (BMW X5, Mercedes GLE): от 25 лет, стаж 4 года. Для младших водителей доступны компактные кроссоверы с увеличенным депозитом.",
            en: "For SUVs and crossovers: from 23 years, 3 years experience. For premium SUVs (BMW X5, Mercedes GLE): from 25 years, 4 years experience. Younger drivers can rent compact crossovers with increased deposit.",
          },
        },
        {
          question: {
            uk: "Куди ще можна поїхати з Буковеля на орендованому авто?",
            ru: "Куда ещё можно поехать из Буковеля на арендованном авто?",
            en: "Where else can I go from Bukovel by rental car?",
          },
          answer: {
            uk: "Популярні напрямки: Драгобрат (30 км), Яремче (25 км), Славське (100 км), Говерла (40 км до початку маршруту). Для гірських доріг рекомендуємо повний привід. Подорожі по Україні без обмежень.",
            ru: "Популярные направления: Драгобрат (30 км), Яремче (25 км), Славское (100 км), Говерла (40 км до начала маршрута). Для горных дорог рекомендуем полный привод. Путешествия по Украине без ограничений.",
            en: "Popular destinations: Dragobrat (30 km), Yaremche (25 km), Slavske (100 km), Hoverla (40 km to trailhead). AWD recommended for mountain roads. Travel within Ukraine without restrictions.",
          },
        },
        {
          question: {
            uk: "Які особливі правила для оренди авто на Буковель?",
            ru: "Какие особые правила для аренды авто на Буковель?",
            en: "What special rules apply for Bukovel car rental?",
          },
          answer: {
            uk: "Взимку обов'язково: перевірте рівень антифризу, не залишайте авто з ручним гальмом (може примерзнути), очищуйте дах від снігу. Заборонено: офф-роуд поза дорогами, буксирування, куріння. Ланцюги — за запитом.",
            ru: "Зимой обязательно: проверьте уровень антифриза, не оставляйте авто на ручнике (может примёрзнуть), очищайте крышу от снега. Запрещено: офф-роуд вне дорог, буксировка, курение. Цепи — по запросу.",
            en: "Winter essentials: check antifreeze level, don't leave car on handbrake (may freeze), clear roof of snow. Prohibited: off-road driving, towing, smoking. Snow chains available on request.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Як оплатити оренду авто на Буковель?",
            ru: "Как оплатить аренду авто на Буковель?",
            en: "How to pay for Bukovel car rental?",
          },
          answer: {
            uk: "Приймаємо: Visa/Mastercard (Apple Pay, Google Pay), готівку UAH/USD/EUR. Взимку рекомендуємо бронювати та оплачувати заздалегідь — попит на SUV високий. Депозит блокується на картці.",
            ru: "Принимаем: Visa/Mastercard (Apple Pay, Google Pay), наличные UAH/USD/EUR. Зимой рекомендуем бронировать и оплачивать заранее — спрос на SUV высокий. Депозит блокируется на карте.",
            en: "We accept: Visa/Mastercard (Apple Pay, Google Pay), cash UAH/USD/EUR. In winter, book and pay in advance — SUV demand is high. Deposit blocked on card.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди авто на Буковель?",
            ru: "Какие документы нужны для аренды авто на Буковель?",
            en: "What documents are required for Bukovel car rental?",
          },
          answer: {
            uk: "Українцям: паспорт/ID, посвідчення водія кат. B, ІПН. Іноземцям: закордонний паспорт, права (міжнародні — якщо не латиницею). Для SUV вік від 23 років, стаж від 3 років.",
            ru: "Украинцам: паспорт/ID, водительское удостоверение кат. B, ИНН. Иностранцам: загранпаспорт, права (международные — если не на латинице). Для SUV возраст от 23 лет, стаж от 3 лет.",
            en: "Ukrainians: passport/ID, category B license, tax ID. Foreigners: passport, license (international if not in Latin). For SUV: age 23+, 3+ years experience.",
          },
        },
        {
          question: {
            uk: "Де заправити авто на дорозі до Буковеля?",
            ru: "Где заправить авто по дороге на Буковель?",
            en: "Where to refuel on the way to Bukovel?",
          },
          answer: {
            uk: "Рекомендуємо заправитись у Івано-Франківську або Надвірній — на Буковелі АЗС немає. Найближча заправка — в Яремче (25 км). Правило «повний-повний» діє. Поверніть авто з тим же рівнем пального.",
            ru: "Рекомендуем заправиться в Ивано-Франковске или Надворной — на Буковеле АЗС нет. Ближайшая заправка — в Яремче (25 км). Правило «полный-полный» действует. Верните авто с тем же уровнем топлива.",
            en: "Refuel in Ivano-Frankivsk or Nadvirna — no gas stations at Bukovel. Nearest station in Yaremche (25 km). Full-to-full rule applies. Return car with same fuel level.",
          },
        },
      ],
    },
  ],
  truskavets: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Трускавці?",
            ru: "Где парковать арендованный автомобиль в Трускавце?",
            en: "Where to park a rental car in Truskavets?",
          },
          answer: {
            uk: "Біля санаторіїв є парковки для гостей (часто безкоштовні). У центрі курорту, біля бювету «Нафтуся» — платне паркування. Біля парку є безкоштовні місця. Уникайте паркування на пішохідних зонах курорту.",
            ru: "Возле санаториев есть парковки для гостей (часто бесплатные). В центре курорта, возле бювета «Нафтуся» — платная парковка. Возле парка есть бесплатные места. Избегайте парковки в пешеходных зонах курорта.",
            en: "Sanatoriums have guest parking (often free). In the resort center near Naftusya pump room — paid parking. Free spots available near the park. Avoid parking in pedestrian resort zones.",
          },
        },
        {
          question: {
            uk: "Де забрати авто для поїздки в Трускавець?",
            ru: "Где забрать авто для поездки в Трускавец?",
            en: "Where to pick up a car for a trip to Truskavets?",
          },
          answer: {
            uk: "Авто можна забрати у Львові (аеропорт LWO, вокзал — 100 км) або замовити доставку безпосередньо в Трускавець, до санаторію чи готелю. Час у дорозі від Львова — 1.5 години.",
            ru: "Авто можно забрать во Львове (аэропорт LWO, вокзал — 100 км) или заказать доставку непосредственно в Трускавец, к санаторию или отелю. Время в пути от Львова — 1.5 часа.",
            en: "Pick up in Lviv (LWO airport, station — 100 km) or order delivery directly to Truskavets, to your sanatorium or hotel. Travel time from Lviv — 1.5 hours.",
          },
        },
        {
          question: {
            uk: "Чи зручно пересуватися на авто під час санаторного відпочинку?",
            ru: "Удобно ли передвигаться на авто во время санаторного отдыха?",
            en: "Is it convenient to travel by car during spa vacation?",
          },
          answer: {
            uk: "Так, авто дає свободу пересування між бюветами, санаторіями та курортними зонами. Зручно відвідати: Сходницю (20 км), Дрогобич (15 км), Борислав (5 км), Моршин (75 км). Пробігу 250 км/добу достатньо.",
            ru: "Да, авто даёт свободу передвижения между бюветами, санаториями и курортными зонами. Удобно посетить: Сходницу (20 км), Дрогобыч (15 км), Борислав (5 км), Моршин (75 км). Пробега 250 км/сутки достаточно.",
            en: "Yes, a car gives freedom to move between pump rooms, sanatoriums, and resort areas. Easy to visit: Skhidnytsia (20 km), Drohobych (15 km), Boryslav (5 km), Morshyn (75 km). 250 km/day is enough.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Яка страховка при оренді авто в Трускавці?",
            ru: "Какая страховка при аренде авто в Трускавце?",
            en: "What insurance for car rental in Truskavets?",
          },
          answer: {
            uk: "Базова ОСЦПВ включена. Пакети CDW/SCDW зменшують вашу відповідальність. Для спокійного санаторного відпочинку достатньо базової страховки, для поїздок у Карпати — рекомендуємо «Комфорт».",
            ru: "Базовое ОСАГО включено. Пакеты CDW/SCDW уменьшают вашу ответственность. Для спокойного санаторного отдыха достаточно базовой страховки, для поездок в Карпаты — рекомендуем «Комфорт».",
            en: "Basic MTPL included. CDW/SCDW packages reduce your liability. For relaxing spa vacation, basic insurance is enough; for Carpathian trips — we recommend 'Comfort'.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто в Трускавці?",
            ru: "Какой депозит при аренде авто в Трускавце?",
            en: "What is the deposit for car rental in Truskavets?",
          },
          answer: {
            uk: "Депозит: економ — від $150, бізнес — від $300, SUV — від $400. Для тривалого санаторного відпочинку (від 2 тижнів) можливі знижки та зменшений депозит.",
            ru: "Депозит: эконом — от $150, бизнес — от $300, SUV — от $400. Для длительного санаторного отдыха (от 2 недель) возможны скидки и уменьшенный депозит.",
            en: "Deposit: economy — from $150, business — from $300, SUV — from $400. For long spa stays (from 2 weeks), discounts and reduced deposit available.",
          },
        },
        {
          question: {
            uk: "Чи є оренда без застави для відпочиваючих у санаторіях?",
            ru: "Есть ли аренда без залога для отдыхающих в санаториях?",
            en: "Is no-deposit rental available for sanatorium guests?",
          },
          answer: {
            uk: "При оренді від 2 тижнів (типовий термін санаторного відпочинку) доступні варіанти зі зменшеним депозитом або без застави. Пакет «Преміум» зменшує депозит до мінімуму для всіх класів.",
            ru: "При аренде от 2 недель (типичный срок санаторного отдыха) доступны варианты с уменьшенным депозитом или без залога. Пакет «Премиум» уменьшает депозит до минимума для всех классов.",
            en: "For rentals from 2 weeks (typical spa stay), options with reduced or no deposit are available. 'Premium' package reduces deposit to minimum for all classes.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік для оренди авто в Трускавці",
            ru: "Минимальный возраст для аренды авто в Трускавце",
            en: "Minimum age for car rental in Truskavets",
          },
          answer: {
            uk: "Мінімум 21 рік і 2 роки стажу. Для бізнес-класу та SUV — від 23 років. Багато гостей курорту старшого віку — для них немає обмежень за віком.",
            ru: "Минимум 21 год и 2 года стажа. Для бизнес-класса и SUV — от 23 лет. Многие гости курорта старшего возраста — для них нет ограничений по возрасту.",
            en: "Minimum 21 years and 2 years experience. For business class and SUV — from 23 years. Many resort guests are older — no upper age limits.",
          },
        },
        {
          question: {
            uk: "Куди можна поїхати з Трускавця на орендованому авто?",
            ru: "Куда можно поехать из Трускавца на арендованном авто?",
            en: "Where can I go from Truskavets by rental car?",
          },
          answer: {
            uk: "Популярні напрямки: Сходниця (20 км), Дрогобич (15 км), Львів (100 км), Моршин (75 км), Карпати. Подорожі по Україні без обмежень. Для Карпат рекомендуємо кросовер.",
            ru: "Популярные направления: Сходница (20 км), Дрогобыч (15 км), Львов (100 км), Моршин (75 км), Карпаты. Путешествия по Украине без ограничений. Для Карпат рекомендуем кроссовер.",
            en: "Popular destinations: Skhidnytsia (20 km), Drohobych (15 km), Lviv (100 km), Morshyn (75 km), Carpathians. Travel within Ukraine without restrictions. Crossover recommended for Carpathians.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто в Трускавці?",
            ru: "Что запрещено при аренде авто в Трускавце?",
            en: "What is prohibited when renting a car in Truskavets?",
          },
          answer: {
            uk: "Стандартні заборони: таксі/Uber, суборенда, куріння в салоні. Перевезення тварин дозволене у переносці. Курортна зона — дотримуйтесь обмежень швидкості та паркування.",
            ru: "Стандартные запреты: такси/Uber, субаренда, курение в салоне. Перевозка животных разрешена в переноске. Курортная зона — соблюдайте ограничения скорости и парковки.",
            en: "Standard prohibitions: taxi/Uber, subletting, smoking inside. Pets allowed in carriers. Resort area — follow speed and parking restrictions.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Як оплатити оренду авто в Трускавці?",
            ru: "Как оплатить аренду авто в Трускавце?",
            en: "How to pay for car rental in Truskavets?",
          },
          answer: {
            uk: "Приймаємо: Visa/Mastercard (Apple Pay, Google Pay), готівку UAH/USD/EUR. Для тривалого санаторного відпочинку можлива оплата частинами (передоплата + залишок на місці).",
            ru: "Принимаем: Visa/Mastercard (Apple Pay, Google Pay), наличные UAH/USD/EUR. Для длительного санаторного отдыха возможна оплата частями (предоплата + остаток на месте).",
            en: "We accept: Visa/Mastercard (Apple Pay, Google Pay), cash UAH/USD/EUR. For long spa stays, partial payment possible (deposit + remainder on site).",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди в Трускавці?",
            ru: "Какие документы нужны для аренды в Трускавце?",
            en: "What documents are required for rental in Truskavets?",
          },
          answer: {
            uk: "Українцям: паспорт/ID, посвідчення водія кат. B, ІПН. Іноземцям: закордонний паспорт, права (міжнародні — якщо не латиницею). Вік від 21 року.",
            ru: "Украинцам: паспорт/ID, водительское удостоверение кат. B, ИНН. Иностранцам: загранпаспорт, права (международные — если не на латинице). Возраст от 21 года.",
            en: "Ukrainians: passport/ID, category B license, tax ID. Foreigners: passport, license (international if not in Latin). Age from 21.",
          },
        },
        {
          question: {
            uk: "Де заправити авто в Трускавці?",
            ru: "Где заправить авто в Трускавце?",
            en: "Where to refuel in Truskavets?",
          },
          answer: {
            uk: "У Трускавці є АЗС OKKO, WOG на виїзді в напрямку Дрогобича та Львова. У самому курорті заправок немає. Правило «повний-повний» — поверніть авто з повним баком.",
            ru: "В Трускавце есть АЗС OKKO, WOG на выезде в направлении Дрогобыча и Львова. В самом курорте заправок нет. Правило «полный-полный» — верните авто с полным баком.",
            en: "Truskavets has OKKO, WOG stations at exits toward Drohobych and Lviv. No stations in the resort itself. Full-to-full rule — return car with full tank.",
          },
        },
      ],
    },
  ],
  "ivano-frankivsk": [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль в Івано-Франківську?",
            ru: "Где парковать арендованный автомобиль в Ивано-Франковске?",
            en: "Where to park a rental car in Ivano-Frankivsk?",
          },
          answer: {
            uk: "У центрі міста (Площа Ринок, вул. Незалежності) паркування платне або обмежене. Біля ТРЦ «Арсен», «Епіцентр» — безкоштовні паркінги. На вулицях житлових районів — безкоштовно. Уникайте пішохідних зон.",
            ru: "В центре города (Площадь Рынок, ул. Независимости) парковка платная или ограниченная. Возле ТРЦ «Арсен», «Эпицентр» — бесплатные паркинги. На улицах жилых районов — бесплатно. Избегайте пешеходных зон.",
            en: "In the city center (Rynok Square, Nezalezhnosti St), parking is paid or limited. Near Arsen, Epicentr malls — free parking. Street parking in residential areas — free. Avoid pedestrian zones.",
          },
        },
        {
          question: {
            uk: "Доставка авто в аеропорт Івано-Франківськ (IFO) та на вокзал",
            ru: "Доставка авто в аэропорт Ивано-Франковск (IFO) и на вокзал",
            en: "Car delivery to Ivano-Frankivsk Airport (IFO) and station",
          },
          answer: {
            uk: "Подача в аеропорт Івано-Франківськ (IFO), на залізничний вокзал, у центр міста — безкоштовна. Менеджер зустріне з табличкою. Час подачі — від 30 хвилин. Аеропорт — 15 хвилин від центру.",
            ru: "Подача в аэропорт Ивано-Франковск (IFO), на ж/д вокзал, в центр города — бесплатная. Менеджер встретит с табличкой. Время подачи — от 30 минут. Аэропорт — 15 минут от центра.",
            en: "Delivery to Ivano-Frankivsk Airport (IFO), railway station, city center — free. Manager meets with a sign. Delivery time — from 30 minutes. Airport — 15 minutes from center.",
          },
        },
        {
          question: {
            uk: "Як дістатися з Івано-Франківська до Буковеля?",
            ru: "Как добраться из Ивано-Франковска до Буковеля?",
            en: "How to get from Ivano-Frankivsk to Bukovel?",
          },
          answer: {
            uk: "На авто — 100 км, 1.5 години через Надвірну та Яремче. Дорога асфальтована, але взимку рекомендуємо SUV з повним приводом. Також зручно відвідати Яремче (60 км), Говерлу (140 км), Манявський скит (25 км).",
            ru: "На авто — 100 км, 1.5 часа через Надворную и Яремче. Дорога асфальтированная, но зимой рекомендуем SUV с полным приводом. Также удобно посетить Яремче (60 км), Говерлу (140 км), Манявский скит (25 км).",
            en: "By car — 100 km, 1.5 hours via Nadvirna and Yaremche. Road is paved, but in winter we recommend AWD SUV. Also convenient to visit Yaremche (60 km), Hoverla (140 km), Manyava Monastery (25 km).",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Яка страховка потрібна для поїздок у Карпати з Івано-Франківська?",
            ru: "Какая страховка нужна для поездок в Карпаты из Ивано-Франковска?",
            en: "What insurance is needed for Carpathian trips from Ivano-Frankivsk?",
          },
          answer: {
            uk: "Базова ОСЦПВ включена. Для гірських доріг рекомендуємо пакет «Комфорт» або «Преміум» — покриває пошкодження шин, скла, дзеркал на серпантинах. Взимку — обов'язково розширена страховка.",
            ru: "Базовое ОСАГО включено. Для горных дорог рекомендуем пакет «Комфорт» или «Премиум» — покрывает повреждения шин, стекла, зеркал на серпантинах. Зимой — обязательно расширенная страховка.",
            en: "Basic MTPL included. For mountain roads, we recommend 'Comfort' or 'Premium' package — covers tire, glass, mirror damage on serpentines. In winter — extended insurance is essential.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто в Івано-Франківську?",
            ru: "Какой депозит при аренде авто в Ивано-Франковске?",
            en: "What is the deposit for car rental in Ivano-Frankivsk?",
          },
          answer: {
            uk: "Депозит: економ — від $150, бізнес — від $350, SUV — від $400-500. Пакет «Комфорт» зменшує на 50%, «Преміум» — до $200-300. Взимку попит на SUV високий — бронюйте заздалегідь.",
            ru: "Депозит: эконом — от $150, бизнес — от $350, SUV — от $400-500. Пакет «Комфорт» уменьшает на 50%, «Премиум» — до $200-300. Зимой спрос на SUV высокий — бронируйте заранее.",
            en: "Deposit: economy — from $150, business — from $350, SUV — from $400-500. 'Comfort' package reduces by 50%, 'Premium' — to $200-300. In winter, SUV demand is high — book in advance.",
          },
        },
        {
          question: {
            uk: "Чи є оренда без застави в Івано-Франківську?",
            ru: "Есть ли аренда без залога в Ивано-Франковске?",
            en: "Is no-deposit rental available in Ivano-Frankivsk?",
          },
          answer: {
            uk: "Для окремих моделей та при довгостроковій оренді (від 2 тижнів) можлива оренда зі зменшеним депозитом або без застави. Пакет «Преміум» мінімізує застави для всіх класів авто.",
            ru: "Для отдельных моделей и при долгосрочной аренде (от 2 недель) возможна аренда с уменьшенным депозитом или без залога. Пакет «Премиум» минимизирует залоги для всех классов авто.",
            en: "For selected models and long-term rentals (from 2 weeks), rental with reduced or no deposit is available. 'Premium' package minimizes deposits for all car classes.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік для оренди авто в Івано-Франківську",
            ru: "Минимальный возраст для аренды авто в Ивано-Франковске",
            en: "Minimum age for car rental in Ivano-Frankivsk",
          },
          answer: {
            uk: "Економ: 21 рік, 2 роки стажу. SUV/кросовери (для Карпат): від 23 років, 3 роки стажу. Преміум-SUV: від 25 років, 4 роки. Молодим водіям може нараховуватись додатковий збір.",
            ru: "Эконом: 21 год, 2 года стажа. SUV/кроссоверы (для Карпат): от 23 лет, 3 года стажа. Премиум-SUV: от 25 лет, 4 года. Молодым водителям может начисляться дополнительный сбор.",
            en: "Economy: 21 years, 2 years experience. SUV/crossovers (for Carpathians): from 23 years, 3 years experience. Premium SUV: from 25 years, 4 years. Young driver fee may apply.",
          },
        },
        {
          question: {
            uk: "Куди можна поїхати з Івано-Франківська на орендованому авто?",
            ru: "Куда можно поехать из Ивано-Франковска на арендованном авто?",
            en: "Where can I go from Ivano-Frankivsk by rental car?",
          },
          answer: {
            uk: "Популярні напрямки: Буковель (100 км), Яремче (60 км), Говерла (140 км), Львів (130 км), Чернівці (180 км). Подорожі по Україні без обмежень. Виїзд за кордон — за погодженням.",
            ru: "Популярные направления: Буковель (100 км), Яремче (60 км), Говерла (140 км), Львов (130 км), Черновцы (180 км). Путешествия по Украине без ограничений. Выезд за границу — по согласованию.",
            en: "Popular destinations: Bukovel (100 km), Yaremche (60 km), Hoverla (140 km), Lviv (130 km), Chernivtsi (180 km). Travel within Ukraine without restrictions. Cross-border — by arrangement.",
          },
        },
        {
          question: {
            uk: "Які правила для поїздок у Карпати з Івано-Франківська?",
            ru: "Какие правила для поездок в Карпаты из Ивано-Франковска?",
            en: "What rules for Carpathian trips from Ivano-Frankivsk?",
          },
          answer: {
            uk: "Для гірських доріг рекомендуємо SUV з повним приводом (особливо взимку). Заборонено: офф-роуд поза дорогами, буксирування, перегрузка. Взимку — зимова гума включена, ланцюги за запитом. Куріння заборонено.",
            ru: "Для горных дорог рекомендуем SUV с полным приводом (особенно зимой). Запрещено: офф-роуд вне дорог, буксировка, перегруз. Зимой — зимняя резина включена, цепи по запросу. Курение запрещено.",
            en: "For mountain roads, we recommend AWD SUV (especially in winter). Prohibited: off-road driving, towing, overloading. In winter — winter tires included, chains on request. Smoking prohibited.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Як оплатити оренду авто в Івано-Франківську?",
            ru: "Как оплатить аренду авто в Ивано-Франковске?",
            en: "How to pay for car rental in Ivano-Frankivsk?",
          },
          answer: {
            uk: "Приймаємо: Visa/Mastercard (Apple Pay, Google Pay), готівку UAH/USD/EUR, безготівковий розрахунок для компаній. Взимку рекомендуємо бронювати SUV заздалегідь з передоплатою.",
            ru: "Принимаем: Visa/Mastercard (Apple Pay, Google Pay), наличные UAH/USD/EUR, безналичный расчёт для компаний. Зимой рекомендуем бронировать SUV заранее с предоплатой.",
            en: "We accept: Visa/Mastercard (Apple Pay, Google Pay), cash UAH/USD/EUR, bank transfer for companies. In winter, book SUV in advance with prepayment.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди в Івано-Франківську?",
            ru: "Какие документы нужны для аренды в Ивано-Франковске?",
            en: "What documents are required for rental in Ivano-Frankivsk?",
          },
          answer: {
            uk: "Українцям: паспорт/ID, посвідчення водія кат. B, ІПН. Іноземцям: закордонний паспорт, права (міжнародні — якщо не латиницею). Для SUV: вік від 23 років, стаж від 3 років.",
            ru: "Украинцам: паспорт/ID, водительское удостоверение кат. B, ИНН. Иностранцам: загранпаспорт, права (международные — если не на латинице). Для SUV: возраст от 23 лет, стаж от 3 лет.",
            en: "Ukrainians: passport/ID, category B license, tax ID. Foreigners: passport, license (international if not in Latin). For SUV: age 23+, 3+ years experience.",
          },
        },
        {
          question: {
            uk: "Де заправити авто перед поверненням в Івано-Франківську?",
            ru: "Где заправить авто перед возвратом в Ивано-Франковске?",
            en: "Where to refuel before returning the car in Ivano-Frankivsk?",
          },
          answer: {
            uk: "АЗС OKKO, WOG є по всьому місту, біля аеропорту та на виїздах на Буковель і Львів. Правило «повний-повний». Їдете з Буковеля — заправтесь у Яремче або Надвірній.",
            ru: "АЗС OKKO, WOG есть по всему городу, возле аэропорта и на выездах на Буковель и Львов. Правило «полный-полный». Едете с Буковеля — заправьтесь в Яремче или Надворной.",
            en: "OKKO, WOG stations throughout the city, near airport and at exits to Bukovel and Lviv. Full-to-full rule. Coming from Bukovel — refuel in Yaremche or Nadvirna.",
          },
        },
      ],
    },
  ],
  skhidnytsia: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Східниці?",
            ru: "Где парковать арендованный автомобиль в Сходнице?",
            en: "Where to park a rental car in Skhidnytsia?",
          },
          answer: {
            uk: "Біля санаторіїв та пансіонатів є парковки для гостей (часто безкоштовні). У центральній курортній зоні біля бюветів — платне паркування. Уникайте паркування на пішохідних алеях курорту та приватних територіях.",
            ru: "Возле санаториев и пансионатов есть парковки для гостей (часто бесплатные). В центральной курортной зоне возле бюветов — платная парковка. Избегайте парковки на пешеходных аллеях курорта и частных территориях.",
            en: "Sanatoriums and guesthouses have parking for guests (often free). In the central resort area near pump rooms — paid parking. Avoid parking on pedestrian alleys and private property.",
          },
        },
        {
          question: {
            uk: "Де забрати авто для поїздки у Східницю?",
            ru: "Где забрать авто для поездки в Сходницу?",
            en: "Where to pick up a car for a trip to Skhidnytsia?",
          },
          answer: {
            uk: "Авто можна забрати у Львові (аеропорт LWO, вокзал — 110 км) або замовити доставку безпосередньо у Східницю, до вашого санаторію чи готелю. Час у дорозі від Львова — близько 2 годин.",
            ru: "Авто можно забрать во Львове (аэропорт LWO, вокзал — 110 км) или заказать доставку непосредственно в Сходницу, к вашему санаторию или отелю. Время в пути от Львова — около 2 часов.",
            en: "Pick up in Lviv (LWO airport, station — 110 km) or order delivery directly to Skhidnytsia, to your sanatorium or hotel. Travel time from Lviv — about 2 hours.",
          },
        },
        {
          question: {
            uk: "Чи зручно пересуватися на авто під час оздоровчого відпочинку у Східниці?",
            ru: "Удобно ли передвигаться на авто во время оздоровительного отдыха в Сходнице?",
            en: "Is it convenient to travel by car during wellness vacation in Skhidnytsia?",
          },
          answer: {
            uk: "Так, авто дає свободу відвідувати різні бювети та курортні зони. Зручно відвідати: Трускавець (15 км), Дрогобич (25 км), Борислав (10 км), Моршин (70 км), Скелі Довбуша (40 км). Пробігу 250 км/добу цілком достатньо.",
            ru: "Да, авто даёт свободу посещать разные бюветы и курортные зоны. Удобно посетить: Трускавец (15 км), Дрогобыч (25 км), Борислав (10 км), Моршин (70 км), Скалы Довбуша (40 км). Пробега 250 км/сутки вполне достаточно.",
            en: "Yes, a car gives freedom to visit different pump rooms and resort areas. Easy to visit: Truskavets (15 km), Drohobych (25 km), Boryslav (10 km), Morshyn (70 km), Dovbush Rocks (40 km). 250 km/day is enough.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Яка страховка при оренді авто у Східниці?",
            ru: "Какая страховка при аренде авто в Сходнице?",
            en: "What insurance for car rental in Skhidnytsia?",
          },
          answer: {
            uk: "Базова ОСЦПВ включена. Пакети CDW/SCDW зменшують вашу відповідальність. Для спокійного оздоровчого відпочинку достатньо базової страховки, для поїздок у гори — рекомендуємо пакет «Комфорт».",
            ru: "Базовое ОСАГО включено. Пакеты CDW/SCDW уменьшают вашу ответственность. Для спокойного оздоровительного отдыха достаточно базовой страховки, для поездок в горы — рекомендуем пакет «Комфорт».",
            en: "Basic MTPL included. CDW/SCDW packages reduce your liability. For relaxing wellness vacation, basic insurance is enough; for mountain trips — we recommend 'Comfort' package.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто у Східниці?",
            ru: "Какой депозит при аренде авто в Сходнице?",
            en: "What is the deposit for car rental in Skhidnytsia?",
          },
          answer: {
            uk: "Депозит: економ — від $150, бізнес — від $300, SUV — від $400. Для тривалого оздоровчого відпочинку (від 2 тижнів) можливі знижки та зменшений депозит.",
            ru: "Депозит: эконом — от $150, бизнес — от $300, SUV — от $400. Для длительного оздоровительного отдыха (от 2 недель) возможны скидки и уменьшенный депозит.",
            en: "Deposit: economy — from $150, business — from $300, SUV — from $400. For long wellness stays (from 2 weeks), discounts and reduced deposit available.",
          },
        },
        {
          question: {
            uk: "Чи є оренда без застави для відпочиваючих у Східниці?",
            ru: "Есть ли аренда без залога для отдыхающих в Сходнице?",
            en: "Is no-deposit rental available for Skhidnytsia guests?",
          },
          answer: {
            uk: "При оренді від 2 тижнів (типовий термін санаторного відпочинку) доступні варіанти зі зменшеним депозитом або без застави. Пакет «Преміум» зменшує депозит до мінімуму для всіх класів.",
            ru: "При аренде от 2 недель (типичный срок санаторного отдыха) доступны варианты с уменьшенным депозитом или без залога. Пакет «Премиум» уменьшает депозит до минимума для всех классов.",
            en: "For rentals from 2 weeks (typical spa stay), options with reduced or no deposit are available. 'Premium' package reduces deposit to minimum for all classes.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік для оренди авто у Східниці",
            ru: "Минимальный возраст для аренды авто в Сходнице",
            en: "Minimum age for car rental in Skhidnytsia",
          },
          answer: {
            uk: "Для економ-класу: від 21 року, стаж 2 роки. Для бізнес та SUV: від 23 років, стаж 3 роки. Для преміум-класу: від 25 років, стаж 4 роки. Молодшим водіям доступні економ-авто зі збільшеним депозитом.",
            ru: "Для эконом-класса: от 21 года, стаж 2 года. Для бизнес и SUV: от 23 лет, стаж 3 года. Для премиум-класса: от 25 лет, стаж 4 года. Младшим водителям доступны эконом-авто с увеличенным депозитом.",
            en: "For economy: from 21 years, 2 years experience. For business and SUV: from 23 years, 3 years experience. For premium: from 25 years, 4 years experience. Younger drivers can rent economy cars with increased deposit.",
          },
        },
        {
          question: {
            uk: "Куди ще можна поїхати зі Східниці на орендованому авто?",
            ru: "Куда ещё можно поехать из Сходницы на арендованном авто?",
            en: "Where else can I go from Skhidnytsia by rental car?",
          },
          answer: {
            uk: "Популярні напрямки: Трускавець (15 км), Дрогобич (25 км), Моршин (70 км), Скелі Довбуша (40 км), Львів (110 км), замки Галичини (80-100 км). Подорожі по Україні без обмежень.",
            ru: "Популярные направления: Трускавец (15 км), Дрогобыч (25 км), Моршин (70 км), Скалы Довбуша (40 км), Львов (110 км), замки Галичины (80-100 км). Путешествия по Украине без ограничений.",
            en: "Popular destinations: Truskavets (15 km), Drohobych (25 km), Morshyn (70 km), Dovbush Rocks (40 km), Lviv (110 km), Galician castles (80-100 km). Travel within Ukraine without restrictions.",
          },
        },
        {
          question: {
            uk: "Які особливі правила для оренди авто у Східниці?",
            ru: "Какие особые правила для аренды авто в Сходнице?",
            en: "What special rules apply for car rental in Skhidnytsia?",
          },
          answer: {
            uk: "Заборонено: куріння в авто, офф-роуд, передача керування третім особам без узгодження. Для поїздок у гори взимку рекомендуємо SUV або авто з добрим кліренсом. Дороги в курортній зоні вузькі — паркуйтесь акуратно.",
            ru: "Запрещено: курение в авто, офф-роуд, передача управления третьим лицам без согласования. Для поездок в горы зимой рекомендуем SUV или авто с хорошим клиренсом. Дороги в курортной зоне узкие — паркуйтесь аккуратно.",
            en: "Prohibited: smoking in car, off-road driving, giving control to third parties without agreement. For mountain trips in winter, we recommend SUV or cars with good clearance. Roads in resort area are narrow — park carefully.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Як оплатити оренду авто у Східниці?",
            ru: "Как оплатить аренду авто в Сходнице?",
            en: "How to pay for car rental in Skhidnytsia?",
          },
          answer: {
            uk: "Приймаємо: Visa/Mastercard (Apple Pay, Google Pay), готівку UAH/USD/EUR. Рекомендуємо бронювати та оплачувати заздалегідь, особливо у високий сезон (літо). Депозит блокується на картці.",
            ru: "Принимаем: Visa/Mastercard (Apple Pay, Google Pay), наличные UAH/USD/EUR. Рекомендуем бронировать и оплачивать заранее, особенно в высокий сезон (лето). Депозит блокируется на карте.",
            en: "We accept: Visa/Mastercard (Apple Pay, Google Pay), cash UAH/USD/EUR. We recommend booking and paying in advance, especially during high season (summer). Deposit blocked on card.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди авто у Східниці?",
            ru: "Какие документы нужны для аренды авто в Сходнице?",
            en: "What documents are required for car rental in Skhidnytsia?",
          },
          answer: {
            uk: "Українцям: паспорт/ID, посвідчення водія кат. B, ІПН. Іноземцям: закордонний паспорт, права (міжнародні — якщо не латиницею). Вік від 21 року для економ-класу, від 23 років для бізнес та SUV.",
            ru: "Украинцам: паспорт/ID, водительское удостоверение кат. B, ИНН. Иностранцам: загранпаспорт, права (международные — если не на латинице). Возраст от 21 года для эконом-класса, от 23 лет для бизнес и SUV.",
            en: "Ukrainians: passport/ID, category B license, tax ID. Foreigners: passport, license (international if not in Latin). Age from 21 for economy, from 23 for business and SUV.",
          },
        },
        {
          question: {
            uk: "Де заправити авто біля Східниці?",
            ru: "Где заправить авто возле Сходницы?",
            en: "Where to refuel near Skhidnytsia?",
          },
          answer: {
            uk: "У самій Східниці АЗС немає. Найближчі заправки — в Трускавці (15 км), Дрогобичі (25 км) та Бориславі (10 км). Є АЗС OKKO, WOG. Правило «повний-повний» — поверніть авто з повним баком.",
            ru: "В самой Сходнице АЗС нет. Ближайшие заправки — в Трускавце (15 км), Дрогобыче (25 км) и Бориславе (10 км). Есть АЗС OKKO, WOG. Правило «полный-полный» — верните авто с полным баком.",
            en: "No gas stations in Skhidnytsia itself. Nearest stations in Truskavets (15 km), Drohobych (25 km) and Boryslav (10 km). OKKO, WOG stations available. Full-to-full rule — return car with full tank.",
          },
        },
      ],
    },
  ],
  uzhhorod: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль в Ужгороді біля кордону?",
            ru: "Где парковать арендованный автомобиль в Ужгороде возле границы?",
            en: "Where to park a rental car in Uzhhorod near the border?",
          },
          answer: {
            uk: "Біля КПП «Малі Селменці» (Словаччина) та «Ужгород» (Словаччина) є платні паркінги. У центрі Ужгорода паркування платне на Корзо та Площі Петефі — оплата через термінали або додаток. Біля замку Ужгород безкоштовні місця обмежені.",
            ru: "Возле КПП «Малые Селменцы» (Словакия) и «Ужгород» (Словакия) есть платные парковки. В центре Ужгорода парковка платная на Корзо и Площади Петефи — оплата через терминалы или приложение. Возле замка Ужгород бесплатные места ограничены.",
            en: "Near border crossing points 'Mali Selmenci' (Slovakia) and 'Uzhhorod' (Slovakia) there are paid parking lots. In Uzhhorod center, parking is paid on Korzo and Petofi Square — pay via terminals or app. Free spots near Uzhhorod Castle are limited.",
          },
        },
        {
          question: {
            uk: "Доставка авто в Ужгород до кордону та вокзалу: умови",
            ru: "Доставка авто в Ужгород к границе и вокзалу: условия",
            en: "Car delivery in Uzhhorod to border and station: terms",
          },
          answer: {
            uk: "Подача авто в центр Ужгорода, на вокзал, до готелів біля кордону — безкоштовна. Доставка до КПП «Малі Селменці» та «Ужгород» (Словаччина) узгоджується окремо. Час подачі від 30-40 хвилин.",
            ru: "Подача авто в центр Ужгорода, на вокзал, к гостиницам возле границы — бесплатная. Доставка к КПП «Малые Селменцы» и «Ужгород» (Словакия) согласовывается отдельно. Время подачи от 30-40 минут.",
            en: "Car delivery to Uzhhorod center, station, hotels near border — free. Delivery to 'Mali Selmenci' and 'Uzhhorod' (Slovakia) border crossings is arranged separately. Delivery time from 30-40 minutes.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу при оренді в Ужгороді для поїздок у ЄС?",
            ru: "Есть ли лимит пробега при аренде в Ужгороде для поездок в ЕС?",
            en: "Is there a mileage limit for Uzhhorod rentals for EU trips?",
          },
          answer: {
            uk: "Стандартний ліміт 250-300 км/добу. Для поїздок у Словаччину (Кошице — 90 км, Братислава — 270 км), Угорщину (Ніредьгаза — 80 км) чи Польщу рекомендуємо тариф Unlimited. Виїзд за кордон — за попереднім погодженням (48 годин).",
            ru: "Стандартный лимит 250-300 км/сутки. Для поездок в Словакию (Кошице — 90 км, Братислава — 270 км), Венгрию (Ниредьгаза — 80 км) или Польшу рекомендуем тариф Unlimited. Выезд за границу — по предварительному согласованию (48 часов).",
            en: "Standard limit is 250-300 km/day. For trips to Slovakia (Košice — 90 km, Bratislava — 270 km), Hungary (Nyíregyháza — 80 km) or Poland, we recommend Unlimited rate. Cross-border travel — with prior arrangement (48 hours).",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто в Ужгороді для поїздок у ЄС?",
            ru: "Что покрывает страховка при аренде авто в Ужгороде для поездок в ЕС?",
            en: "What does insurance cover when renting a car in Uzhhorod for EU trips?",
          },
          answer: {
            uk: "Базова ОСЦПВ діє в Україні. Для виїзду в ЄС оформляємо Green Card (міжнародна страховка) — покриває шкоду третім особам у Європі. Пакети CDW/SCDW діють у межах дозволених країн. Для транзитних поїздок рекомендуємо «Преміум».",
            ru: "Базовое ОСАГО действует в Украине. Для выезда в ЕС оформляем Green Card (международная страховка) — покрывает ущерб третьим лицам в Европе. Пакеты CDW/SCDW действуют в пределах разрешённых стран. Для транзитных поездок рекомендуем «Премиум».",
            en: "Basic MTPL is valid in Ukraine. For EU travel, we arrange Green Card (international insurance) — covers third-party damage in Europe. CDW/SCDW packages are valid in permitted countries. We recommend 'Premium' for transit trips.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто в Ужгороді з виїздом за кордон?",
            ru: "Какой депозит при аренде авто в Ужгороде с выездом за границу?",
            en: "What is the deposit for car rental in Uzhhorod with cross-border travel?",
          },
          answer: {
            uk: "Депозит: економ — від $300, бізнес — від $500, SUV — від $600 (підвищений для виїзду за кордон). Пакет «Преміум» зменшує депозит до $300-400. Green Card оплачується окремо — від €50 на 15 днів.",
            ru: "Депозит: эконом — от $300, бизнес — от $500, SUV — от $600 (повышенный для выезда за границу). Пакет «Премиум» уменьшает депозит до $300-400. Green Card оплачивается отдельно — от €50 на 15 дней.",
            en: "Deposit: economy — from $300, business — from $500, SUV — from $600 (increased for cross-border). 'Premium' package reduces deposit to $300-400. Green Card paid separately — from €50 for 15 days.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто в Ужгороді без застави для поїздок по Закарпаттю?",
            ru: "Можно ли арендовать авто в Ужгороде без залога для поездок по Закарпатью?",
            en: "Can I rent a car in Uzhhorod without a deposit for Transcarpathian trips?",
          },
          answer: {
            uk: "Так, для поїздок по Закарпаттю (без виїзду за кордон) з пакетом «Преміум» депозит мінімальний ($200-250) або відсутній для окремих економ-моделей. Для виїзду в ЄС застава обов'язкова.",
            ru: "Да, для поездок по Закарпатью (без выезда за границу) с пакетом «Премиум» депозит минимальный ($200-250) или отсутствует для отдельных эконом-моделей. Для выезда в ЕС залог обязателен.",
            en: "Yes, for Transcarpathian trips (without cross-border) with 'Premium' package, deposit is minimal ($200-250) or waived for selected economy models. For EU travel, deposit is mandatory.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж для оренди авто в Ужгороді з виїздом у ЄС",
            ru: "Минимальный возраст и стаж для аренды авто в Ужгороде с выездом в ЕС",
            en: "Minimum age and experience for Uzhhorod car rental with EU travel",
          },
          answer: {
            uk: "Для поїздок по Україні: 21 рік, стаж 2 роки. Для виїзду в ЄС: від 23 років, стаж від 3 років (для преміум-авто — 25 років і стаж 4+ роки). Молодим водіям може діяти додатковий збір.",
            ru: "Для поездок по Украине: 21 год, стаж 2 года. Для выезда в ЕС: от 23 лет, стаж от 3 лет (для премиум-авто — 25 лет и стаж 4+ года). Молодым водителям может действовать дополнительный сбор.",
            en: "For Ukraine trips: 21 years, 2 years experience. For EU travel: from 23 years, 3+ years experience (premium cars — 25 years and 4+ years experience). Young driver surcharge may apply.",
          },
        },
        {
          question: {
            uk: "У які країни можна виїжджати на орендованому авто з Ужгорода?",
            ru: "В какие страны можно выезжать на арендованном авто из Ужгорода?",
            en: "Which countries can I visit by rental car from Uzhhorod?",
          },
          answer: {
            uk: "Дозволені країни (за попереднім погодженням): Словаччина, Польща, Угорщина, Чехія, Австрія, Німеччина (із Green Card). Заборонені: країни СНД (крім України), Балкани. Повідомляйте про виїзд мінімум за 48 годин — оформимо документи.",
            ru: "Разрешённые страны (по предварительному согласованию): Словакия, Польша, Венгрия, Чехия, Австрия, Германия (с Green Card). Запрещены: страны СНГ (кроме Украины), Балканы. Сообщайте о выезде минимум за 48 часов — оформим документы.",
            en: "Permitted countries (with prior arrangement): Slovakia, Poland, Hungary, Czech Republic, Austria, Germany (with Green Card). Prohibited: CIS countries (except Ukraine), Balkans. Notify at least 48 hours in advance — we'll arrange documents.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто в Ужгороді?",
            ru: "Что запрещено при аренде авто в Ужгороде?",
            en: "What is prohibited when renting a car in Uzhhorod?",
          },
          answer: {
            uk: "Категорично заборонено: таксі/Uber/Bolt, суборенда, передача третім особам, використання для контрабанди, участь у змаганнях. Виїзд за кордон — тільки з Green Card. Куріння в авто — штраф €100.",
            ru: "Категорически запрещено: такси/Uber/Bolt, субаренда, передача третьим лицам, использование для контрабанды, участие в соревнованиях. Выезд за границу — только с Green Card. Курение в авто — штраф €100.",
            en: "Strictly prohibited: taxi/Uber/Bolt, subletting, transfer to third parties, use for smuggling, racing participation. Cross-border travel — only with Green Card. Smoking in car — €100 fine.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Як оплатити оренду авто в Ужгороді іноземцю?",
            ru: "Как оплатить аренду авто в Ужгороде иностранцу?",
            en: "How can a foreigner pay for car rental in Uzhhorod?",
          },
          answer: {
            uk: "Приймаємо: міжнародні картки Visa/Mastercard (у т.ч. європейські), готівку EUR/USD/UAH, Apple Pay/Google Pay. Green Card оплачується окремо (готівкою або карткою). Депозит блокується на картці.",
            ru: "Принимаем: международные карты Visa/Mastercard (в т.ч. европейские), наличные EUR/USD/UAH, Apple Pay/Google Pay. Green Card оплачивается отдельно (наличными или картой). Депозит блокируется на карте.",
            en: "We accept: international Visa/Mastercard (including European), cash EUR/USD/UAH, Apple Pay/Google Pay. Green Card paid separately (cash or card). Deposit blocked on card.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди в Ужгороді з виїздом у ЄС?",
            ru: "Какие документы нужны для аренды в Ужгороде с выездом в ЕС?",
            en: "What documents are required for Uzhhorod rental with EU travel?",
          },
          answer: {
            uk: "Базові: паспорт (закордонний для іноземців), права категорії B (міжнародні — для не-латиниці), ІПН. Для ЄС додатково: Green Card (оформимо), маршрут поїздки, контактні дані за кордоном. Бронюйте заздалегідь.",
            ru: "Базовые: паспорт (загранпаспорт для иностранцев), права категории B (международные — для не-латиницы), ИНН. Для ЕС дополнительно: Green Card (оформим), маршрут поездки, контактные данные за границей. Бронируйте заранее.",
            en: "Basic: passport (international for foreigners), category B license (international for non-Latin), tax ID. For EU additionally: Green Card (we'll arrange), trip itinerary, contact details abroad. Book in advance.",
          },
        },
        {
          question: {
            uk: "Де заправити авто перед поверненням в Ужгороді?",
            ru: "Где заправить авто перед возвратом в Ужгороде?",
            en: "Where to refuel before returning the car in Uzhhorod?",
          },
          answer: {
            uk: "Політика «повний-повний». У центрі Ужгорода є OKKO (вул. Собранецька), WOG (Київська набережна), Shell (вул. Загорська). Біля кордону — АЗС SOCAR (траса Чоп). Передплачене пальне — за запитом + сервісний збір.",
            ru: "Политика «полный-полный». В центре Ужгорода есть OKKO (ул. Собранецкая), WOG (Киевская набережная), Shell (ул. Загорская). Возле границы — АЗС SOCAR (трасса Чоп). Предоплаченное топливо — по запросу + сервисный сбор.",
            en: "Full-to-full policy. In Uzhhorod center: OKKO (Sobranetska St), WOG (Kyivska embankment), Shell (Zahorska St). Near border — SOCAR station (Chop highway). Prepaid fuel — on request + service fee.",
          },
        },
      ],
    },
  ],
  vinnytsia: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Вінниці біля фонтану Roshen?",
            ru: "Где парковать арендованный автомобиль в Виннице возле фонтана Roshen?",
            en: "Where to park a rental car in Vinnytsia near Roshen fountain?",
          },
          answer: {
            uk: "Біля фонтану Roshen на острові Фестивальному є платний паркінг. У центрі Вінниці (вул. Соборна, Театральна площа) паркування платне — оплата через термінали або додаток Vinnytsia Parking. Біля ТРЦ Megamall є безкоштовний паркінг для відвідувачів.",
            ru: "Возле фонтана Roshen на острове Фестивальном есть платная парковка. В центре Винницы (ул. Соборная, Театральная площадь) парковка платная — оплата через терминалы или приложение Vinnytsia Parking. Возле ТРЦ Megamall есть бесплатная парковка для посетителей.",
            en: "Near Roshen fountain on Festyvalnyi Island there is paid parking. In Vinnytsia center (Soborna St, Theatre Square), parking is paid — pay via terminals or Vinnytsia Parking app. Near Megamall shopping center, free parking for visitors.",
          },
        },
        {
          question: {
            uk: "Доставка авто у Вінниці на вокзал та в аеропорт: умови",
            ru: "Доставка авто в Виннице на вокзал и в аэропорт: условия",
            en: "Car delivery in Vinnytsia to station and airport: terms",
          },
          answer: {
            uk: "Подача авто на залізничний вокзал Вінниці, автовокзал, у центр міста та до готелів — безкоштовна. Доставка в аеропорт Гавришівка (30 км від міста) узгоджується окремо. Час подачі в місті — від 20-30 хвилин.",
            ru: "Подача авто на ж/д вокзал Винницы, автовокзал, в центр города и к гостиницам — бесплатная. Доставка в аэропорт Гавришовка (30 км от города) согласовывается отдельно. Время подачи в городе — от 20-30 минут.",
            en: "Car delivery to Vinnytsia railway station, bus station, city center and hotels — free. Delivery to Havryshivka Airport (30 km from city) arranged separately. Delivery time in city — from 20-30 minutes.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу при оренді у Вінниці для транзиту Київ-Одеса?",
            ru: "Есть ли лимит пробега при аренде в Виннице для транзита Киев-Одесса?",
            en: "Is there a mileage limit for Vinnytsia rentals for Kyiv-Odesa transit?",
          },
          answer: {
            uk: "Стандартний ліміт 250-300 км/добу. Вінниця — зручна точка для транзиту: Київ — 270 км, Одеса — 400 км, Львів — 360 км. Для міжміських поїздок рекомендуємо тариф Unlimited — без обмежень за пробігом.",
            ru: "Стандартный лимит 250-300 км/сутки. Винница — удобная точка для транзита: Киев — 270 км, Одесса — 400 км, Львов — 360 км. Для междугородних поездок рекомендуем тариф Unlimited — без ограничений по пробегу.",
            en: "Standard limit is 250-300 km/day. Vinnytsia is a convenient transit point: Kyiv — 270 km, Odesa — 400 km, Lviv — 360 km. For intercity trips, we recommend Unlimited rate — no mileage restrictions.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто у Вінниці?",
            ru: "Что покрывает страховка при аренде авто в Виннице?",
            en: "What does insurance cover when renting a car in Vinnytsia?",
          },
          answer: {
            uk: "Базова ОСЦПВ покриває шкоду третім особам. Пакети CDW/SCDW зменшують вашу відповідальність при пошкодженні авто. Для бізнес-поїздок і корпоративних клієнтів рекомендуємо пакет «Преміум» — мінімальна франшиза та повне покриття.",
            ru: "Базовое ОСАГО покрывает ущерб третьим лицам. Пакеты CDW/SCDW уменьшают вашу ответственность при повреждении авто. Для бизнес-поездок и корпоративных клиентов рекомендуем пакет «Премиум» — минимальная франшиза и полное покрытие.",
            en: "Basic MTPL covers third-party damage. CDW/SCDW packages reduce your liability for car damage. For business trips and corporate clients, we recommend 'Premium' package — minimal deductible and full coverage.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто у Вінниці для бізнес-класу?",
            ru: "Какой депозит при аренде авто в Виннице для бизнес-класса?",
            en: "What is the deposit for business class car rental in Vinnytsia?",
          },
          answer: {
            uk: "Депозит: економ — від $200, бізнес — від $400, преміум — від $600. Для корпоративних клієнтів з договором депозит знижується. Пакет «Преміум» зменшує депозит до $250-350. Повернення коштів — протягом 1-3 робочих днів.",
            ru: "Депозит: эконом — от $200, бизнес — от $400, премиум — от $600. Для корпоративных клиентов с договором депозит снижается. Пакет «Премиум» уменьшает депозит до $250-350. Возврат средств — в течение 1-3 рабочих дней.",
            en: "Deposit: economy — from $200, business — from $400, premium — from $600. For corporate clients with contract, deposit is reduced. 'Premium' package reduces deposit to $250-350. Refund within 1-3 business days.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто у Вінниці без застави для місцевих поїздок?",
            ru: "Можно ли арендовать авто в Виннице без залога для местных поездок?",
            en: "Can I rent a car in Vinnytsia without a deposit for local trips?",
          },
          answer: {
            uk: "Так, для довгострокової оренді (від 2 тижнів) та корпоративних клієнтів доступна опція мінімального депозиту ($150-200) або без застави. Для короткострокової оренді — пакет «Преміум» зменшує депозит до $200.",
            ru: "Да, для долгосрочной аренды (от 2 недель) и корпоративных клиентов доступна опция минимального депозита ($150-200) или без залога. Для краткосрочной аренды — пакет «Премиум» уменьшает депозит до $200.",
            en: "Yes, for long-term rentals (from 2 weeks) and corporate clients, minimal deposit option ($150-200) or no-deposit is available. For short-term rentals — 'Premium' package reduces deposit to $200.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж водія для оренди авто у Вінниці",
            ru: "Минимальный возраст и стаж водителя для аренды авто в Виннице",
            en: "Minimum age and driving experience for car rental in Vinnytsia",
          },
          answer: {
            uk: "Мінімальний вік — 21 рік, стаж водіння — від 2 років. Для бізнес-класу та преміум авто: від 23 років, стаж від 3 років. Для корпоративних клієнтів вимоги до стажу можуть бути знижені за згодою.",
            ru: "Минимальный возраст — 21 год, стаж вождения — от 2 лет. Для бизнес-класса и премиум авто: от 23 лет, стаж от 3 лет. Для корпоративных клиентов требования к стажу могут быть снижены по согласованию.",
            en: "Minimum age is 21, driving experience from 2 years. For business and premium cars: from 23 years, 3+ years experience. For corporate clients, experience requirements may be reduced by arrangement.",
          },
        },
        {
          question: {
            uk: "Чи можна виїжджати на орендованому авто з Вінниці в інші регіони?",
            ru: "Можно ли выезжать на арендованном авто из Винницы в другие регионы?",
            en: "Can I travel from Vinnytsia to other regions by rental car?",
          },
          answer: {
            uk: "Так, виїзд по всій Україні дозволений. Вінниця — зручна точка для поїздок: Київ, Одеса, Львів, Чернівці. Для виїзду за кордон потрібне попереднє погодження (48 годин) та оформлення Green Card.",
            ru: "Да, выезд по всей Украине разрешён. Винница — удобная точка для поездок: Киев, Одесса, Львов, Черновцы. Для выезда за границу нужно предварительное согласование (48 часов) и оформление Green Card.",
            en: "Yes, travel throughout Ukraine is permitted. Vinnytsia is a convenient hub for trips: Kyiv, Odesa, Lviv, Chernivtsi. For cross-border travel, prior arrangement required (48 hours) and Green Card registration.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто у Вінниці?",
            ru: "Что запрещено при аренде авто в Виннице?",
            en: "What is prohibited when renting a car in Vinnytsia?",
          },
          answer: {
            uk: "Категорично заборонено: використання для таксі (Uber, Bolt, Uklon), передача третім особам, суборенда, куріння в авто, участь у змаганнях, буксирування. Порушення — розірвання договору та штраф до $500.",
            ru: "Категорически запрещено: использование для такси (Uber, Bolt, Uklon), передача третьим лицам, субаренда, курение в авто, участие в соревнованиях, буксировка. Нарушение — расторжение договора и штраф до $500.",
            en: "Strictly prohibited: using for taxi (Uber, Bolt, Uklon), transfer to third parties, subletting, smoking in car, racing participation, towing. Violation — contract termination and penalty up to $500.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Які способи оплати доступні при оренді авто у Вінниці?",
            ru: "Какие способы оплаты доступны при аренде авто в Виннице?",
            en: "What payment methods are available for car rental in Vinnytsia?",
          },
          answer: {
            uk: "Приймаємо: банківські картки Visa/Mastercard, Apple Pay/Google Pay, готівку UAH/USD/EUR, безготівковий розрахунок для юридичних осіб. Для корпоративних клієнтів — оплата за рахунком з відстрочкою платежу.",
            ru: "Принимаем: банковские карты Visa/Mastercard, Apple Pay/Google Pay, наличные UAH/USD/EUR, безналичный расчёт для юридических лиц. Для корпоративных клиентов — оплата по счёту с отсрочкой платежа.",
            en: "We accept: Visa/Mastercard bank cards, Apple Pay/Google Pay, cash UAH/USD/EUR, bank transfer for legal entities. For corporate clients — invoice payment with deferred payment.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди авто у Вінниці?",
            ru: "Какие документы нужны для аренды авто в Виннице?",
            en: "What documents are required to rent a car in Vinnytsia?",
          },
          answer: {
            uk: "Фізичним особам: паспорт/ID-картка, права категорії B, ІПН. Іноземцям: закордонний паспорт, національні права (міжнародні — якщо не латиницею). Юридичним особам додатково: витяг з ЄДРПОУ, довіреність (якщо необхідно).",
            ru: "Физическим лицам: паспорт/ID-карта, права категории B, ИНН. Иностранцам: загранпаспорт, национальные права (международные — если не на латинице). Юридическим лицам дополнительно: выписка из ЕГРПОУ, доверенность (если необходимо).",
            en: "Individuals: passport/ID card, category B license, tax ID. Foreigners: international passport, national license (international if not in Latin). Legal entities additionally: company registration extract, power of attorney (if needed).",
          },
        },
        {
          question: {
            uk: "Де заправити авто перед поверненням у Вінниці?",
            ru: "Где заправить авто перед возвратом в Виннице?",
            en: "Where to refuel before returning the car in Vinnytsia?",
          },
          answer: {
            uk: "Політика «повний-повний». АЗС у Вінниці: OKKO (вул. Київська, 600-річчя), WOG (Хмельницьке шосе), Shell (вул. Стрілецька). Біля вокзалу — SOCAR (вул. Келецька). Передплачене пальне — за запитом + сервісний збір 5%.",
            ru: "Политика «полный-полный». АЗС в Виннице: OKKO (ул. Киевская, 600-летия), WOG (Хмельницкое шоссе), Shell (ул. Стрелецкая). Возле вокзала — SOCAR (ул. Келецкая). Предоплаченное топливо — по запросу + сервисный сбор 5%.",
            en: "Full-to-full policy. Gas stations in Vinnytsia: OKKO (Kyivska St, 600-richchia), WOG (Khmelnytske highway), Shell (Striletska St). Near station — SOCAR (Keletska St). Prepaid fuel — on request + 5% service fee.",
          },
        },
      ],
    },
  ],
  zaporizhzhia: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Запоріжжі біля ДніпроГЕС?",
            ru: "Где парковать арендованный автомобиль в Запорожье возле ДнепроГЭС?",
            en: "Where to park a rental car in Zaporizhzhia near Dnipro Hydroelectric Station?",
          },
          answer: {
            uk: "Біля ДніпроГЕС є безкоштовні паркінги для туристів (обмежений час). На проспекті Соборному та біля ТРЦ Dnipro Plaza паркування платне. На острові Хортиця є парковки біля музею та входу до заповідника. Оплата через додаток або термінали.",
            ru: "Возле ДнепроГЭС есть бесплатные парковки для туристов (ограниченное время). На проспекте Соборном и возле ТРЦ Dnipro Plaza парковка платная. На острове Хортица есть парковки возле музея и входа в заповедник. Оплата через приложение или терминалы.",
            en: "Near Dnipro Hydroelectric Station there are free tourist parking lots (limited time). On Sobornyi Avenue and near Dnipro Plaza mall, parking is paid. On Khortytsia Island, parking near museum and reserve entrance. Pay via app or terminals.",
          },
        },
        {
          question: {
            uk: "Доставка авто у Запоріжжі на вокзал та в аеропорт: умови",
            ru: "Доставка авто в Запорожье на вокзал и в аэропорт: условия",
            en: "Car delivery in Zaporizhzhia to station and airport: terms",
          },
          answer: {
            uk: "Подача авто на залізничний вокзал Запоріжжя-1, автовокзал, у центр міста — безкоштовна. Доставка на Хортицю, до промислових об'єктів та готелів — безкоштовна по місту. Час подачі від 30 хвилин.",
            ru: "Подача авто на ж/д вокзал Запорожье-1, автовокзал, в центр города — бесплатная. Доставка на Хортицу, к промышленным объектам и гостиницам — бесплатная по городу. Время подачи от 30 минут.",
            en: "Car delivery to Zaporizhzhia-1 railway station, bus station, city center — free. Delivery to Khortytsia, industrial facilities and hotels — free within city. Delivery time from 30 minutes.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу при оренді у Запоріжжі для поїздок по регіону?",
            ru: "Есть ли лимит пробега при аренде в Запорожье для поездок по региону?",
            en: "Is there a mileage limit for Zaporizhzhia rentals for regional trips?",
          },
          answer: {
            uk: "Стандартний ліміт 250-300 км/добу. Для поїздок по області (Мелітополь — 105 км, Бердянськ — 200 км, Токмак — 70 км) і далеких маршрутів (Київ — 520 км, Дніпро — 90 км) рекомендуємо тариф Unlimited.",
            ru: "Стандартный лимит 250-300 км/сутки. Для поездок по области (Мелитополь — 105 км, Бердянск — 200 км, Токмак — 70 км) и дальних маршрутов (Киев — 520 км, Днепр — 90 км) рекомендуем тариф Unlimited.",
            en: "Standard limit is 250-300 km/day. For regional trips (Melitopol — 105 km, Berdiansk — 200 km, Tokmak — 70 km) and long routes (Kyiv — 520 km, Dnipro — 90 km), we recommend Unlimited rate.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто у Запоріжжі?",
            ru: "Что покрывает страховка при аренде авто в Запорожье?",
            en: "What does insurance cover when renting a car in Zaporizhzhia?",
          },
          answer: {
            uk: "Базова ОСЦПВ покриває шкоду третім особам. Пакети CDW/SCDW зменшують відповідальність при пошкодженні авто. Для промислового регіону (складні дороги, інтенсивний трафік) рекомендуємо пакет «Комфорт» або «Преміум».",
            ru: "Базовое ОСАГО покрывает ущерб третьим лицам. Пакеты CDW/SCDW уменьшают ответственность при повреждении авто. Для промышленного региона (сложные дороги, интенсивный трафик) рекомендуем пакет «Комфорт» или «Премиум».",
            en: "Basic MTPL covers third-party damage. CDW/SCDW packages reduce liability for car damage. For industrial region (challenging roads, heavy traffic), we recommend 'Comfort' or 'Premium' package.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто у Запоріжжі для SUV?",
            ru: "Какой депозит при аренде авто в Запорожье для SUV?",
            en: "What is the deposit for SUV rental in Zaporizhzhia?",
          },
          answer: {
            uk: "Депозит: економ — від $200, бізнес — від $400, SUV/кросовер — від $500. SUV популярні для поїздок на Хортицю та по області. Пакет «Преміум» зменшує депозит до $300-400 для всіх класів.",
            ru: "Депозит: эконом — от $200, бизнес — от $400, SUV/кроссовер — от $500. SUV популярны для поездок на Хортицу и по области. Пакет «Премиум» уменьшает депозит до $300-400 для всех классов.",
            en: "Deposit: economy — from $200, business — from $400, SUV/crossover — from $500. SUVs are popular for Khortytsia trips and regional travel. 'Premium' package reduces deposit to $300-400 for all classes.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто у Запоріжжі без застави?",
            ru: "Можно ли арендовать авто в Запорожье без залога?",
            en: "Can I rent a car in Zaporizhzhia without a deposit?",
          },
          answer: {
            uk: "Так, для довгострокової оренді (від 2 тижнів) та корпоративних клієнтів з промислових підприємств міста доступна опція зменшеного депозиту ($150-200) або без застави. Для короткострокової оренді — пакет «Преміум».",
            ru: "Да, для долгосрочной аренды (от 2 недель) и корпоративных клиентов с промышленных предприятий города доступна опция уменьшенного депозита ($150-200) или без залога. Для краткосрочной аренды — пакет «Премиум».",
            en: "Yes, for long-term rentals (from 2 weeks) and corporate clients from city's industrial enterprises, reduced deposit option ($150-200) or no-deposit is available. For short-term rentals — 'Premium' package.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж водія для оренди авто у Запоріжжі",
            ru: "Минимальный возраст и стаж водителя для аренды авто в Запорожье",
            en: "Minimum age and driving experience for car rental in Zaporizhzhia",
          },
          answer: {
            uk: "Мінімальний вік — 21 рік, стаж водіння — від 2 років. Для SUV та кросоверів: від 23 років, стаж 3+ роки. Для преміум-класу: від 25 років, стаж 4+ роки. Для молодих водіїв може діяти додатковий збір.",
            ru: "Минимальный возраст — 21 год, стаж вождения — от 2 лет. Для SUV и кроссоверов: от 23 лет, стаж 3+ года. Для премиум-класса: от 25 лет, стаж 4+ года. Для молодых водителей может действовать дополнительный сбор.",
            en: "Minimum age is 21, driving experience from 2 years. For SUVs and crossovers: from 23 years, 3+ years experience. For premium class: from 25 years, 4+ years experience. Young driver surcharge may apply.",
          },
        },
        {
          question: {
            uk: "Чи можна виїжджати на орендованому авто з Запоріжжя в інші регіони?",
            ru: "Можно ли выезжать на арендованном авто из Запорожья в другие регионы?",
            en: "Can I travel from Zaporizhzhia to other regions by rental car?",
          },
          answer: {
            uk: "Так, виїзд по всій Україні дозволений: Київ, Дніпро, Харків, Одеса, Херсон. Враховуйте обмеження для певних зон (уточнюйте актуальні). Для виїзду за кордон — попереднє погодження (48 годин) та Green Card.",
            ru: "Да, выезд по всей Украине разрешён: Киев, Днепр, Харьков, Одесса, Херсон. Учитывайте ограничения для определённых зон (уточняйте актуальные). Для выезда за границу — предварительное согласование (48 часов) и Green Card.",
            en: "Yes, travel throughout Ukraine is permitted: Kyiv, Dnipro, Kharkiv, Odesa, Kherson. Consider restrictions for certain zones (check current). For cross-border travel — prior arrangement (48 hours) and Green Card.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто у Запоріжжі?",
            ru: "Что запрещено при аренде авто в Запорожье?",
            en: "What is prohibited when renting a car in Zaporizhzhia?",
          },
          answer: {
            uk: "Категорично заборонено: таксі (Uber, Bolt, Uklon), передача третім особам, суборенда, куріння, використання для комерційних перевезень, буксирування. Виїзд на бездоріжжя без погодження. Порушення — штраф до $500.",
            ru: "Категорически запрещено: такси (Uber, Bolt, Uklon), передача третьим лицам, субаренда, курение, использование для коммерческих перевозок, буксировка. Выезд на бездорожье без согласования. Нарушение — штраф до $500.",
            en: "Strictly prohibited: taxi (Uber, Bolt, Uklon), transfer to third parties, subletting, smoking, use for commercial transport, towing. Off-road driving without approval. Violation — penalty up to $500.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Які способи оплати доступні при оренді авто у Запоріжжі?",
            ru: "Какие способы оплаты доступны при аренде авто в Запорожье?",
            en: "What payment methods are available for car rental in Zaporizhzhia?",
          },
          answer: {
            uk: "Приймаємо: банківські картки Visa/Mastercard, Apple Pay/Google Pay, готівку UAH/USD/EUR, безготівковий розрахунок для юридичних осіб. Для корпоративних клієнтів промислових підприємств — оплата за рахунком.",
            ru: "Принимаем: банковские карты Visa/Mastercard, Apple Pay/Google Pay, наличные UAH/USD/EUR, безналичный расчёт для юридических лиц. Для корпоративных клиентов промышленных предприятий — оплата по счёту.",
            en: "We accept: Visa/Mastercard bank cards, Apple Pay/Google Pay, cash UAH/USD/EUR, bank transfer for legal entities. For corporate clients from industrial enterprises — invoice payment.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди авто у Запоріжжі?",
            ru: "Какие документы нужны для аренды авто в Запорожье?",
            en: "What documents are required to rent a car in Zaporizhzhia?",
          },
          answer: {
            uk: "Фізичним особам: паспорт/ID-картка, права категорії B, ІПН. Іноземцям: закордонний паспорт, національні/міжнародні права. Юридичним особам: витяг з ЄДРПОУ, довіреність на водія (для корпоративних авто).",
            ru: "Физическим лицам: паспорт/ID-карта, права категории B, ИНН. Иностранцам: загранпаспорт, национальные/международные права. Юридическим лицам: выписка из ЕГРПОУ, доверенность на водителя (для корпоративных авто).",
            en: "Individuals: passport/ID card, category B license, tax ID. Foreigners: international passport, national/international license. Legal entities: company registration extract, power of attorney for driver (for corporate cars).",
          },
        },
        {
          question: {
            uk: "Де заправити авто перед поверненням у Запоріжжі?",
            ru: "Где заправить авто перед возвратом в Запорожье?",
            en: "Where to refuel before returning the car in Zaporizhzhia?",
          },
          answer: {
            uk: "Політика «повний-повний». АЗС у Запоріжжі: OKKO (просп. Соборний, Перемоги), WOG (вул. Незалежної України), Shell (просп. Моторобудівників). Біля вокзалу — SOCAR. Передплачене пальне — за запитом + 5% сервісний збір.",
            ru: "Политика «полный-полный». АЗС в Запорожье: OKKO (просп. Соборный, Победы), WOG (ул. Независимой Украины), Shell (просп. Моторостроителей). Возле вокзала — SOCAR. Предоплаченное топливо — по запросу + 5% сервисный сбор.",
            en: "Full-to-full policy. Gas stations in Zaporizhzhia: OKKO (Sobornyi Ave, Peremogy), WOG (Nezalezhnoi Ukrainy St), Shell (Motorobudivnykiv Ave). Near station — SOCAR. Prepaid fuel — on request + 5% service fee.",
          },
        },
      ],
    },
  ],
  mukachevo: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Мукачеві біля замку Паланок?",
            ru: "Где парковать арендованный автомобиль в Мукачево возле замка Паланок?",
            en: "Where to park a rental car in Mukachevo near Palanok Castle?",
          },
          answer: {
            uk: "Біля замку Паланок є платний паркінг для відвідувачів. У центрі Мукачева (площа Миру, вул. Духновича) паркування обмежене — оплата через термінали. Біля залізничного вокзалу безкоштовні місця обмежені, є платна стоянка.",
            ru: "Возле замка Паланок есть платная парковка для посетителей. В центре Мукачево (площадь Мира, ул. Духновича) парковка ограниченная — оплата через терминалы. Возле ж/д вокзала бесплатные места ограничены, есть платная стоянка.",
            en: "Near Palanok Castle there is paid parking for visitors. In Mukachevo center (Peace Square, Dukhnovycha St), parking is limited — pay via terminals. Near railway station, free spots are limited, paid parking available.",
          },
        },
        {
          question: {
            uk: "Доставка авто у Мукачеві на вокзал та до замку: умови",
            ru: "Доставка авто в Мукачево на вокзал и к замку: условия",
            en: "Car delivery in Mukachevo to station and castle: terms",
          },
          answer: {
            uk: "Подача авто на залізничний вокзал, у центр міста, до готелів та замку Паланок — безкоштовна по Мукачеву. Доставка в Ужгород (40 км) та гірські курорти узгоджується окремо. Час подачі від 20-30 хвилин.",
            ru: "Подача авто на ж/д вокзал, в центр города, к гостиницам и замку Паланок — бесплатная по Мукачево. Доставка в Ужгород (40 км) и горные курорты согласовывается отдельно. Время подачи от 20-30 минут.",
            en: "Car delivery to railway station, city center, hotels and Palanok Castle — free within Mukachevo. Delivery to Uzhhorod (40 km) and mountain resorts arranged separately. Delivery time from 20-30 minutes.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу при оренді у Мукачеві для поїздок у гори?",
            ru: "Есть ли лимит пробега при аренде в Мукачево для поездок в горы?",
            en: "Is there a mileage limit for Mukachevo rentals for mountain trips?",
          },
          answer: {
            uk: "Стандартний ліміт 250-300 км/добу. Для поїздок до Синевиру (60 км), Колочави (80 км), Рахова (120 км), Буковелю (180 км) і гірських маршрутів рекомендуємо тариф Unlimited. Для гір краще брати SUV або кросовер.",
            ru: "Стандартный лимит 250-300 км/сутки. Для поездок к Синевиру (60 км), Колочаве (80 км), Рахову (120 км), Буковелю (180 км) и горных маршрутов рекомендуем тариф Unlimited. Для гор лучше брать SUV или кроссовер.",
            en: "Standard limit is 250-300 km/day. For trips to Synevyr (60 km), Kolochava (80 km), Rakhiv (120 km), Bukovel (180 km) and mountain routes, we recommend Unlimited rate. SUV or crossover better for mountains.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто у Мукачеві для гірських доріг?",
            ru: "Что покрывает страховка при аренде авто в Мукачево для горных дорог?",
            en: "What does insurance cover when renting a car in Mukachevo for mountain roads?",
          },
          answer: {
            uk: "Базова ОСЦПВ покриває шкоду третім особам. Для гірських доріг Закарпаття (серпантини, складні умови) настійно рекомендуємо пакет «Преміум» — повне покриття шин, скла, дзеркал, днища авто та підвіски.",
            ru: "Базовое ОСАГО покрывает ущерб третьим лицам. Для горных дорог Закарпатья (серпантины, сложные условия) настоятельно рекомендуем пакет «Премиум» — полное покрытие шин, стекла, зеркал, днища авто и подвески.",
            en: "Basic MTPL covers third-party damage. For Transcarpathian mountain roads (serpentines, challenging conditions), we strongly recommend 'Premium' package — full coverage for tires, glass, mirrors, car underbody and suspension.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді SUV у Мукачеві для Карпат?",
            ru: "Какой депозит при аренде SUV в Мукачево для Карпат?",
            en: "What is the deposit for SUV rental in Mukachevo for Carpathians?",
          },
          answer: {
            uk: "Депозит для SUV/кросоверів — від $500-600 (підвищений через гірські умови). Економ-клас — від $200, бізнес — від $400. Пакет «Преміум» зменшує депозит до $300-400. SUV найпопулярніші для гірських маршрутів.",
            ru: "Депозит для SUV/кроссоверов — от $500-600 (повышенный из-за горных условий). Эконом-класс — от $200, бизнес — от $400. Пакет «Премиум» уменьшает депозит до $300-400. SUV самые популярные для горных маршрутов.",
            en: "Deposit for SUV/crossovers — from $500-600 (increased due to mountain conditions). Economy class — from $200, business — from $400. 'Premium' package reduces deposit to $300-400. SUVs are most popular for mountain routes.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто у Мукачеві без застави для місцевих поїздок?",
            ru: "Можно ли арендовать авто в Мукачево без залога для местных поездок?",
            en: "Can I rent a car in Mukachevo without a deposit for local trips?",
          },
          answer: {
            uk: "Так, для місцевих поїздок по Мукачеву (без гір) з пакетом «Преміум» депозит мінімальний ($200-250) або відсутній для економ-класу. Для гірських маршрутів депозит обов'язковий через підвищені ризики.",
            ru: "Да, для местных поездок по Мукачево (без гор) с пакетом «Премиум» депозит минимальный ($200-250) или отсутствует для эконом-класса. Для горных маршрутов депозит обязателен из-за повышенных рисков.",
            en: "Yes, for local Mukachevo trips (no mountains) with 'Premium' package, deposit is minimal ($200-250) or waived for economy class. For mountain routes, deposit is mandatory due to increased risks.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж водія для оренди SUV у Мукачеві",
            ru: "Минимальный возраст и стаж водителя для аренды SUV в Мукачево",
            en: "Minimum age and driving experience for SUV rental in Mukachevo",
          },
          answer: {
            uk: "Мінімальний вік — 21 рік, стаж 2 роки (економ). Для SUV та гірських поїздок: від 23 років, стаж 3+ роки. Для преміум-класу: від 25 років, стаж 4+ роки. Досвід водіння в горах — перевага.",
            ru: "Минимальный возраст — 21 год, стаж 2 года (эконом). Для SUV и горных поездок: от 23 лет, стаж 3+ года. Для премиум-класса: от 25 лет, стаж 4+ года. Опыт вождения в горах — преимущество.",
            en: "Minimum age is 21, 2 years experience (economy). For SUVs and mountain trips: from 23 years, 3+ years experience. For premium class: from 25 years, 4+ years experience. Mountain driving experience is an advantage.",
          },
        },
        {
          question: {
            uk: "Чи можна виїжджати з Мукачева в Румунію та Словаччину?",
            ru: "Можно ли выезжать из Мукачево в Румынию и Словакию?",
            en: "Can I travel from Mukachevo to Romania and Slovakia?",
          },
          answer: {
            uk: "Так, виїзд до Румунії (КПП Дякове — 60 км), Словаччини (Малі Селменці — 50 км) і Угорщини можливий за попереднім погодженням (48 годин). Потрібно: Green Card, додаткова страховка. Для гірських маршрутів у Румунію рекомендуємо SUV.",
            ru: "Да, выезд в Румынию (КПП Дяково — 60 км), Словакию (Малые Селменцы — 50 км) и Венгрию возможен по предварительному согласованию (48 часов). Нужно: Green Card, дополнительная страховка. Для горных маршрутов в Румынию рекомендуем SUV.",
            en: "Yes, travel to Romania (Diakove border — 60 km), Slovakia (Mali Selmenci — 50 km) and Hungary possible with prior arrangement (48 hours). Required: Green Card, additional insurance. SUV recommended for mountain routes to Romania.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто у Мукачеві для гір?",
            ru: "Что запрещено при аренде авто в Мукачево для гор?",
            en: "What is prohibited when renting a car in Mukachevo for mountains?",
          },
          answer: {
            uk: "Заборонено: таксі/Uber, суборенда, виїзд на бездоріжжя без погодження, користування економ-класом для важких гірських доріг (лише SUV/кросовери), куріння. Перевищення швидкості на серпантинах — розірвання договору.",
            ru: "Запрещено: такси/Uber, субаренда, выезд на бездорожье без согласования, использование эконом-класса для сложных горных дорог (только SUV/кроссоверы), курение. Превышение скорости на серпантинах — расторжение договора.",
            en: "Prohibited: taxi/Uber, subletting, off-road driving without approval, using economy class for difficult mountain roads (only SUV/crossovers), smoking. Speeding on serpentines — contract termination.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Які способи оплати доступні при оренді авто у Мукачеві?",
            ru: "Какие способы оплаты доступны при аренде авто в Мукачево?",
            en: "What payment methods are available for car rental in Mukachevo?",
          },
          answer: {
            uk: "Приймаємо: банківські картки Visa/Mastercard (включно з європейськими), Apple Pay/Google Pay, готівку EUR/USD/UAH. Green Card для виїзду в ЄС оплачується окремо (від €50). Депозит — блокування на картці.",
            ru: "Принимаем: банковские карты Visa/Mastercard (включая европейские), Apple Pay/Google Pay, наличные EUR/USD/UAH. Green Card для выезда в ЕС оплачивается отдельно (от €50). Депозит — блокировка на карте.",
            en: "We accept: Visa/Mastercard bank cards (including European), Apple Pay/Google Pay, cash EUR/USD/UAH. Green Card for EU travel paid separately (from €50). Deposit — card block.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди авто у Мукачеві?",
            ru: "Какие документы нужны для аренды авто в Мукачево?",
            en: "What documents are required to rent a car in Mukachevo?",
          },
          answer: {
            uk: "Фізичним особам: паспорт/ID-картка, права категорії B, ІПН. Іноземцям: закордонний паспорт, національні/міжнародні права. Для виїзду в ЄС: Green Card (оформимо), маршрут подорожі, контакти за кордоном.",
            ru: "Физическим лицам: паспорт/ID-карта, права категории B, ИНН. Иностранцам: загранпаспорт, национальные/международные права. Для выезда в ЕС: Green Card (оформим), маршрут путешествия, контакты за границей.",
            en: "Individuals: passport/ID card, category B license, tax ID. Foreigners: international passport, national/international license. For EU travel: Green Card (we'll arrange), trip itinerary, contacts abroad.",
          },
        },
        {
          question: {
            uk: "Де заправити авто перед поверненням у Мукачеві?",
            ru: "Где заправить авто перед возвратом в Мукачево?",
            en: "Where to refuel before returning the car in Mukachevo?",
          },
          answer: {
            uk: "Політика «повний-повний». У Мукачеві є OKKO (вул. Пряшівська), WOG (вул. Берегівська), Shell (вул. Духновича). Перед поїздками в гори заправляйтесь у місті — АЗС у горах рідкісні. Передплачене пальне — за запитом.",
            ru: "Политика «полный-полный». В Мукачево есть OKKO (ул. Пряшевская), WOG (ул. Береговская), Shell (ул. Духновича). Перед поездками в горы заправляйтесь в городе — АЗС в горах редкие. Предоплаченное топливо — по запросу.",
            en: "Full-to-full policy. In Mukachevo: OKKO (Priashivska St), WOG (Berehivska St), Shell (Dukhnovycha St). Before mountain trips, refuel in city — gas stations are rare in mountains. Prepaid fuel — on request.",
          },
        },
      ],
    },
  ],
  poltava: [
    // Категорія 1: Практична інформація
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Полтаві біля Корпусного парку?",
            ru: "Где парковать арендованный автомобиль в Полтаве возле Корпусного парка?",
            en: "Where to park a rental car in Poltava near Korpusnyi Park?",
          },
          answer: {
            uk: "Біля Корпусного парку та Круглої площі паркування обмежене — платні паркінги через термінали. У центрі Полтави (вул. Соборності, Жовтнева) паркування платне. Біля ТРЦ Lavina Mall та вокзалу є безкоштовні паркінги.",
            ru: "Возле Корпусного парка и Круглой площади парковка ограниченная — платные парковки через терминалы. В центре Полтавы (ул. Соборности, Жовтнева) парковка платная. Возле ТРЦ Lavina Mall и вокзала есть бесплатные парковки.",
            en: "Near Korpusnyi Park and Round Square, parking is limited — paid parking via terminals. In Poltava center (Sobornosti St, Zhovtneva), parking is paid. Near Lavina Mall and station, free parking available.",
          },
        },
        {
          question: {
            uk: "Доставка авто у Полтаві на вокзал і в центр: умови",
            ru: "Доставка авто в Полтаве на вокзал и в центр: условия",
            en: "Car delivery in Poltava to station and center: terms",
          },
          answer: {
            uk: "Подача авто на залізничний вокзал, у центр міста (Корпусний парк, Кругла площа), до готелів та бізнес-центрів — безкоштовна по Полтаві. Час подачі від 20-30 хвилин. Полтава — зручна точка для транзиту між Києвом і Харковом.",
            ru: "Подача авто на ж/д вокзал, в центр города (Корпусный парк, Круглая площадь), к гостиницам и бизнес-центрам — бесплатная по Полтаве. Время подачи от 20-30 минут. Полтава — удобная точка для транзита между Киевом и Харьковом.",
            en: "Car delivery to railway station, city center (Korpusnyi Park, Round Square), hotels and business centers — free within Poltava. Delivery time from 20-30 minutes. Poltava is a convenient transit point between Kyiv and Kharkiv.",
          },
        },
        {
          question: {
            uk: "Чи є ліміт пробігу при оренді у Полтаві для транзиту Київ-Харків?",
            ru: "Есть ли лимит пробега при аренде в Полтаве для транзита Киев-Харьков?",
            en: "Is there a mileage limit for Poltava rentals for Kyiv-Kharkiv transit?",
          },
          answer: {
            uk: "Стандартний ліміт 250-300 км/добу. Полтава — оптимальна транзитна точка: Київ — 340 км, Харків — 140 км, Дніпро — 180 км, Кременчук — 95 км. Для міжміських поїздок рекомендуємо тариф Unlimited.",
            ru: "Стандартный лимит 250-300 км/сутки. Полтава — оптимальная транзитная точка: Киев — 340 км, Харьков — 140 км, Днепр — 180 км, Кременчуг — 95 км. Для междугородних поездок рекомендуем тариф Unlimited.",
            en: "Standard limit is 250-300 km/day. Poltava is an optimal transit point: Kyiv — 340 km, Kharkiv — 140 km, Dnipro — 180 km, Kremenchuk — 95 km. For intercity trips, we recommend Unlimited rate.",
          },
        },
      ],
    },
    // Категорія 2: Страхування та депозит
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Що покриває страховка при оренді авто у Полтаві?",
            ru: "Что покрывает страховка при аренде авто в Полтаве?",
            en: "What does insurance cover when renting a car in Poltava?",
          },
          answer: {
            uk: "Базова ОСЦПВ покриває шкоду третім особам. Пакети CDW/SCDW зменшують вашу відповідальність при ДТП. Для транзитних поїздок і довгих маршрутів (Київ-Харків) рекомендуємо пакет «Комфорт» або «Преміум» — розширене покриття.",
            ru: "Базовое ОСАГО покрывает ущерб третьим лицам. Пакеты CDW/SCDW уменьшают вашу ответственность при ДТП. Для транзитных поездок и дальних маршрутов (Киев-Харьков) рекомендуем пакет «Комфорт» или «Премиум» — расширенное покрытие.",
            en: "Basic MTPL covers third-party damage. CDW/SCDW packages reduce your liability in accidents. For transit trips and long routes (Kyiv-Kharkiv), we recommend 'Comfort' or 'Premium' package — extended coverage.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді авто у Полтаві для бізнес-поїздок?",
            ru: "Какой депозит при аренде авто в Полтаве для бизнес-поездок?",
            en: "What is the deposit for car rental in Poltava for business trips?",
          },
          answer: {
            uk: "Депозит: економ — від $200, бізнес — від $400, преміум — від $600. Для корпоративних клієнтів та довгострокової оренді депозит знижується. Пакет «Преміум» зменшує депозит до $250-350 для всіх класів.",
            ru: "Депозит: эконом — от $200, бизнес — от $400, премиум — от $600. Для корпоративных клиентов и долгосрочной аренды депозит снижается. Пакет «Премиум» уменьшает депозит до $250-350 для всех классов.",
            en: "Deposit: economy — from $200, business — from $400, premium — from $600. For corporate clients and long-term rentals, deposit is reduced. 'Premium' package reduces deposit to $250-350 for all classes.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто у Полтаві без застави?",
            ru: "Можно ли арендовать авто в Полтаве без залога?",
            en: "Can I rent a car in Poltava without a deposit?",
          },
          answer: {
            uk: "Так, для довгострокової оренді (від 2 тижнів) та постійних клієнтів доступна опція мінімального депозиту ($150-200) або без застави. Для транзитних поїздок — пакет «Преміум» зменшує депозит.",
            ru: "Да, для долгосрочной аренды (от 2 недель) и постоянных клиентов доступна опция минимального депозита ($150-200) или без залога. Для транзитных поездок — пакет «Премиум» уменьшает депозит.",
            en: "Yes, for long-term rentals (from 2 weeks) and regular clients, minimal deposit option ($150-200) or no-deposit is available. For transit trips — 'Premium' package reduces deposit.",
          },
        },
      ],
    },
    // Категорія 3: Обмеження та заборони
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      },
      items: [
        {
          question: {
            uk: "Мінімальний вік і стаж водія для оренди авто у Полтаві",
            ru: "Минимальный возраст и стаж водителя для аренды авто в Полтаве",
            en: "Minimum age and driving experience for car rental in Poltava",
          },
          answer: {
            uk: "Мінімальний вік — 21 рік, стаж водіння — від 2 років. Для бізнес-класу: від 23 років, стаж 3+ роки. Для преміум-авто: від 25 років, стаж 4+ роки. Молодим водіям може діяти додатковий збір.",
            ru: "Минимальный возраст — 21 год, стаж вождения — от 2 лет. Для бизнес-класса: от 23 лет, стаж 3+ года. Для премиум-авто: от 25 лет, стаж 4+ года. Молодым водителям может действовать дополнительный сбор.",
            en: "Minimum age is 21, driving experience from 2 years. For business class: from 23 years, 3+ years experience. For premium cars: from 25 years, 4+ years experience. Young driver surcharge may apply.",
          },
        },
        {
          question: {
            uk: "Чи можна виїжджати на орендованому авто з Полтави в інші регіони?",
            ru: "Можно ли выезжать на арендованном авто из Полтавы в другие регионы?",
            en: "Can I travel from Poltava to other regions by rental car?",
          },
          answer: {
            uk: "Так, виїзд по всій Україні дозволений: Київ, Харків, Дніпро, Суми, Черкаси. Полтава — ідеальна точка для транзиту. Для виїзду за кордон потрібне попереднє погодження (48 годин) та оформлення Green Card.",
            ru: "Да, выезд по всей Украине разрешён: Киев, Харьков, Днепр, Сумы, Черкассы. Полтава — идеальная точка для транзита. Для выезда за границу нужно предварительное согласование (48 часов) и оформление Green Card.",
            en: "Yes, travel throughout Ukraine is permitted: Kyiv, Kharkiv, Dnipro, Sumy, Cherkasy. Poltava is an ideal transit point. For cross-border travel, prior arrangement required (48 hours) and Green Card registration.",
          },
        },
        {
          question: {
            uk: "Що заборонено при оренді авто у Полтаві?",
            ru: "Что запрещено при аренде авто в Полтаве?",
            en: "What is prohibited when renting a car in Poltava?",
          },
          answer: {
            uk: "Категорично заборонено: таксі (Uber, Bolt, Uklon), передача третім особам не вказаним у договорі, суборенда, куріння в авто, використання для комерційних перевезень. Порушення — штраф і розірвання договору.",
            ru: "Категорически запрещено: такси (Uber, Bolt, Uklon), передача третьим лицам не указанным в договоре, субаренда, курение в авто, использование для коммерческих перевозок. Нарушение — штраф и расторжение договора.",
            en: "Strictly prohibited: taxi (Uber, Bolt, Uklon), transfer to persons not listed in contract, subletting, smoking in car, use for commercial transport. Violation — penalty and contract termination.",
          },
        },
      ],
    },
    // Категорія 4: Оплата та документи
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      },
      items: [
        {
          question: {
            uk: "Які способи оплати доступні при оренді авто у Полтаві?",
            ru: "Какие способы оплаты доступны при аренде авто в Полтаве?",
            en: "What payment methods are available for car rental in Poltava?",
          },
          answer: {
            uk: "Приймаємо: банківські картки Visa/Mastercard, Apple Pay/Google Pay, готівку UAH/USD/EUR, безготівковий розрахунок для юридичних осіб. Для корпоративних клієнтів — оплата за рахунком. Депозит блокується на картці.",
            ru: "Принимаем: банковские карты Visa/Mastercard, Apple Pay/Google Pay, наличные UAH/USD/EUR, безналичный расчёт для юридических лиц. Для корпоративных клиентов — оплата по счёту. Депозит блокируется на карте.",
            en: "We accept: Visa/Mastercard bank cards, Apple Pay/Google Pay, cash UAH/USD/EUR, bank transfer for legal entities. For corporate clients — invoice payment. Deposit blocked on card.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди авто у Полтаві?",
            ru: "Какие документы нужны для аренды авто в Полтаве?",
            en: "What documents are required to rent a car in Poltava?",
          },
          answer: {
            uk: "Фізичним особам: паспорт/ID-картка, права категорії B, ІПН. Іноземцям: закордонний паспорт, національні права (міжнародні — для не-латиниці). Юридичним особам: витяг з ЄДРПОУ, довіреність на водія.",
            ru: "Физическим лицам: паспорт/ID-карта, права категории B, ИНН. Иностранцам: загранпаспорт, национальные права (международные — для не-латиницы). Юридическим лицам: выписка из ЕГРПОУ, доверенность на водителя.",
            en: "Individuals: passport/ID card, category B license, tax ID. Foreigners: international passport, national license (international for non-Latin). Legal entities: company registration extract, power of attorney for driver.",
          },
        },
        {
          question: {
            uk: "Де заправити авто перед поверненням у Полтаві?",
            ru: "Где заправить авто перед возвратом в Полтаве?",
            en: "Where to refuel before returning the car in Poltava?",
          },
          answer: {
            uk: "Політика «повний-повний». АЗС у Полтаві: OKKO (просп. Першотравневий, вул. Європейська), WOG (вул. Небесної Сотні), Shell (вул. Київська). Біля вокзалу — SOCAR. Передплачене пальне — за запитом + 5% збір.",
            ru: "Политика «полный-полный». АЗС в Полтаве: OKKO (просп. Первомайский, ул. Европейская), WOG (ул. Небесной Сотни), Shell (ул. Киевская). Возле вокзала — SOCAR. Предоплаченное топливо — по запросу + 5% сбор.",
            en: "Full-to-full policy. Gas stations in Poltava: OKKO (Pershotravnevyi Ave, Yevropeiska St), WOG (Nebesnoi Sotni St), Shell (Kyivska St). Near station — SOCAR. Prepaid fuel — on request + 5% fee.",
          },
        },
      ],
    },
  ],
  chernivtsi: [
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де паркувати орендований автомобіль у Чернівцях біля університету?",
            ru: "Где парковать арендованный автомобиль в Черновцах возле университета?",
            en: "Where to park a rental car in Chernivtsi near the university?",
          },
          answer: {
            uk: "Біля Чернівецького університету та Театральної площі паркування обмежене. У центрі (вул. Кобилянської, Головна) — платне паркування. Безкоштовні паркінги є біля ТРЦ Depot Center та залізничного вокзалу.",
            ru: "Возле Черновицкого университета и Театральной площади парковка ограничена. В центре (ул. Кобылянской, Главная) — платная парковка. Бесплатные парковки есть возле ТРЦ Depot Center и ж/д вокзала.",
            en: "Near Chernivtsi University and Theater Square, parking is limited. In center (Kobylianska St, Holovna) — paid parking. Free parking available near Depot Center mall and railway station.",
          },
        },
        {
          question: {
            uk: "Доставка авто до кордону з Румунією: умови та вартість",
            ru: "Доставка авто к границе с Румынией: условия и стоимость",
            en: "Car delivery to Romania border: terms and cost",
          },
          answer: {
            uk: "Подача авто до КПП Порубне (15 км) — безкоштовна. До КПП Вадул-Сірет (Молдова, 40 км) — за домовленістю. Виїзд за кордон можливий з пакетом «Європа» — додаткова страховка Green Card обов'язкова.",
            ru: "Подача авто к КПП Порубное (15 км) — бесплатная. К КПП Вадул-Сирет (Молдова, 40 км) — по договоренности. Выезд за границу возможен с пакетом «Европа» — дополнительная страховка Green Card обязательна.",
            en: "Car delivery to Porubne checkpoint (15 km) — free. To Vadul-Siret checkpoint (Moldova, 40 km) — by arrangement. Border crossing available with 'Europe' package — Green Card insurance required.",
          },
        },
      ],
    },
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Яка страховка потрібна для виїзду в Румунію з Чернівців?",
            ru: "Какая страховка нужна для выезда в Румынию из Черновцов?",
            en: "What insurance is needed for Romania trips from Chernivtsi?",
          },
          answer: {
            uk: "Для виїзду в ЄС обов'язкова Green Card. Пакет «Європа» включає розширене КАСКО та асистанс на території ЄС. Додатково рекомендуємо захист від крадіжки для подорожей по Румунії та Молдові.",
            ru: "Для выезда в ЕС обязательна Green Card. Пакет «Европа» включает расширенное КАСКО и ассистанс на территории ЕС. Дополнительно рекомендуем защиту от угона для поездок по Румынии и Молдове.",
            en: "Green Card is required for EU travel. 'Europe' package includes extended CASCO and EU assistance. We also recommend theft protection for Romania and Moldova trips.",
          },
        },
      ],
    },
  ],
  boryspil: [
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Як отримати авто в аеропорту Бориспіль після прильоту?",
            ru: "Как получить авто в аэропорту Борисполь после прилета?",
            en: "How to get a car at Boryspil Airport after arrival?",
          },
          answer: {
            uk: "Зустріч біля терміналу D або F — менеджер чекатиме з табличкою. Оформлення займає 10-15 хвилин. Паркінг P1 (термінал D) — найзручніший для передачі авто. Працюємо 24/7, включаючи нічні рейси.",
            ru: "Встреча возле терминала D или F — менеджер будет ждать с табличкой. Оформление занимает 10-15 минут. Паркинг P1 (терминал D) — самый удобный для передачи авто. Работаем 24/7, включая ночные рейсы.",
            en: "Meeting near Terminal D or F — manager will wait with a sign. Paperwork takes 10-15 minutes. P1 parking (Terminal D) — most convenient for car handover. We work 24/7, including night flights.",
          },
        },
        {
          question: {
            uk: "Чи можна здати авто в іншому місті України після оренди в Борисполі?",
            ru: "Можно ли сдать авто в другом городе Украины после аренды в Борисполе?",
            en: "Can I return the car in another Ukrainian city after Boryspil rental?",
          },
          answer: {
            uk: "Так, one-way оренда доступна. Популярні напрямки: Київ (центр), Львів, Одеса, Дніпро, Харків. Вартість залежить від відстані. Львів — найпопулярніший напрямок, подача туди додатково оплачується.",
            ru: "Да, one-way аренда доступна. Популярные направления: Киев (центр), Львов, Одесса, Днепр, Харьков. Стоимость зависит от расстояния. Львов — самое популярное направление, подача туда оплачивается дополнительно.",
            en: "Yes, one-way rental is available. Popular destinations: Kyiv (center), Lviv, Odesa, Dnipro, Kharkiv. Cost depends on distance. Lviv is the most popular — delivery there is charged additionally.",
          },
        },
        {
          question: {
            uk: "Доставка авто в аеропорт Бориспіль з Києва: вартість та час",
            ru: "Доставка авто в аэропорт Борисполь из Киева: стоимость и время",
            en: "Car delivery to Boryspil Airport from Kyiv: cost and time",
          },
          answer: {
            uk: "Подача з Києва в аеропорт Бориспіль — безкоштовна при оренді від 3 діб. Час у дорозі 35-50 хвилин залежно від трафіку. Рекомендуємо бронювати за 24 години до прильоту.",
            ru: "Подача из Киева в аэропорт Борисполь — бесплатная при аренде от 3 суток. Время в пути 35-50 минут в зависимости от трафика. Рекомендуем бронировать за 24 часа до прилета.",
            en: "Delivery from Kyiv to Boryspil Airport — free for rentals from 3 days. Travel time 35-50 minutes depending on traffic. We recommend booking 24 hours before arrival.",
          },
        },
      ],
    },
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      },
      items: [
        {
          question: {
            uk: "Який депозит при оренді в аеропорту Бориспіль?",
            ru: "Какой депозит при аренде в аэропорту Борисполь?",
            en: "What is the deposit for Boryspil Airport rentals?",
          },
          answer: {
            uk: "Стандартний депозит: економ — від $200, бізнес — від $400, преміум/SUV — від $600. Оплата готівкою або карткою. При пакеті «Преміум» депозит знижується. Для корпоративних клієнтів — спеціальні умови.",
            ru: "Стандартный депозит: эконом — от $200, бизнес — от $400, премиум/SUV — от $600. Оплата наличными или картой. При пакете «Премиум» депозит снижается. Для корпоративных клиентов — специальные условия.",
            en: "Standard deposit: economy — from $200, business — from $400, premium/SUV — from $600. Payment by cash or card. 'Premium' package reduces deposit. Special terms for corporate clients.",
          },
        },
      ],
    },
  ],
  lutsk: [
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Як дістатися до Шацьких озер на орендованому авто?",
            ru: "Как добраться до Шацких озёр на арендованном авто?",
            en: "How to get to Shatsk Lakes by rental car?",
          },
          answer: {
            uk: "Від Луцька до Шацьких озер близько 60 км (1 година). Дорога у хорошому стані. Рекомендуємо кросовер для лісових доріг біля озер. Ми доставимо авто до вашого готелю або бази відпочинку.",
            ru: "От Луцка до Шацких озёр около 60 км (1 час). Дорога в хорошем состоянии. Рекомендуем кроссовер для лесных дорог у озёр. Мы доставим авто к вашему отелю или базе отдыха.",
            en: "From Lutsk to Shatsk Lakes is about 60 km (1 hour). Road is in good condition. We recommend a crossover for forest roads near the lakes. We deliver to your hotel or resort.",
          },
        },
        {
          question: {
            uk: "Чи можна виїхати на орендованому авто до Польщі?",
            ru: "Можно ли выехать на арендованном авто в Польшу?",
            en: "Can I take the rental car to Poland?",
          },
          answer: {
            uk: "Так, виїзд до Польщі та країн ЄС можливий за попереднім узгодженням. Потрібна зелена карта (можемо оформити). Найближчі КПП: Ягодин, Устилуг. Додаткова плата від 15€/день.",
            ru: "Да, выезд в Польшу и страны ЕС возможен по предварительному согласованию. Нужна зелёная карта (можем оформить). Ближайшие КПП: Ягодин, Устилуг. Дополнительная плата от 15€/день.",
            en: "Yes, travel to Poland and EU countries is possible with prior approval. Green card required (we can arrange). Nearest checkpoints: Yahodyn, Ustyluh. Extra fee from €15/day.",
          },
        },
        {
          question: {
            uk: "Де можна припаркувати авто в центрі Луцька?",
            ru: "Где можно припарковать авто в центре Луцка?",
            en: "Where can I park in Lutsk city center?",
          },
          answer: {
            uk: "Безкоштовні парковки біля ТЦ «Порт Сіті», «Там Там». Платні парковки в центрі коштують 10-20 грн/год. Біля Луцького замку є велика безкоштовна парковка.",
            ru: "Бесплатные парковки у ТЦ «Порт Сити», «Там Там». Платные парковки в центре стоят 10-20 грн/час. У Луцкого замка есть большая бесплатная парковка.",
            en: "Free parking near Port City and Tam Tam malls. Paid parking in center costs 10-20 UAH/hour. Large free parking near Lutsk Castle.",
          },
        },
      ],
    },
    {
      title: {
        uk: "Оренда та умови",
        ru: "Аренда и условия",
        en: "Rental Terms",
      },
      items: [
        {
          question: {
            uk: "Чи є доставка авто на Шацькі озера?",
            ru: "Есть ли доставка авто на Шацкие озёра?",
            en: "Do you deliver cars to Shatsk Lakes?",
          },
          answer: {
            uk: "Так, доставляємо авто на Шацькі озера, до Світязя та інших баз відпочинку. Вартість доставки від 500 грн в один бік. При оренді від 3 днів — знижка на доставку.",
            ru: "Да, доставляем авто на Шацкие озёра, к Свитязю и другим базам отдыха. Стоимость доставки от 500 грн в одну сторону. При аренде от 3 дней — скидка на доставку.",
            en: "Yes, we deliver to Shatsk Lakes, Svityaz and other resorts. Delivery from 500 UAH one way. Discount on delivery for 3+ day rentals.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди в Луцьку?",
            ru: "Какие документы нужны для аренды в Луцке?",
            en: "What documents are needed to rent in Lutsk?",
          },
          answer: {
            uk: "Паспорт громадянина України або закордонний паспорт, водійське посвідчення (стаж від 2 років). Для іноземців — міжнародне посвідчення або національне з перекладом.",
            ru: "Паспорт гражданина Украины или загранпаспорт, водительское удостоверение (стаж от 2 лет). Для иностранцев — международное удостоверение или национальное с переводом.",
            en: "Ukrainian passport or international passport, driver's license (2+ years experience). For foreigners — international license or national with translation.",
          },
        },
      ],
    },
  ],
  rivne: [
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Як дістатися до Тунелю кохання на орендованому авто?",
            ru: "Как добраться до Тоннеля любви на арендованном авто?",
            en: "How to get to the Tunnel of Love by rental car?",
          },
          answer: {
            uk: "Тунель кохання знаходиться в селі Клевань, 25 км від Рівного (30 хв). Дорога асфальтована. Є безкоштовна парковка біля входу. Краще відвідувати влітку, коли листя найгустіше.",
            ru: "Тоннель любви находится в селе Клевань, 25 км от Ровно (30 мин). Дорога асфальтирована. Есть бесплатная парковка у входа. Лучше посещать летом, когда листва самая густая.",
            en: "Tunnel of Love is in Klevan village, 25 km from Rivne (30 min). Road is paved. Free parking at entrance. Best to visit in summer when foliage is thickest.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто в центрі Рівного?",
            ru: "Где припарковать авто в центре Ровно?",
            en: "Where to park in Rivne city center?",
          },
          answer: {
            uk: "Безкоштовні парковки біля ТЦ «Злата Плаза», «Екватор». Платні парковки в центрі 10-15 грн/год. Біля театру та набережної є великі парковки.",
            ru: "Бесплатные парковки у ТЦ «Злата Плаза», «Экватор». Платные парковки в центре 10-15 грн/час. У театра и набережной есть большие парковки.",
            en: "Free parking at Zlata Plaza and Ekvator malls. Paid parking in center 10-15 UAH/hour. Large parking areas near theater and embankment.",
          },
        },
        {
          question: {
            uk: "Який стан доріг у Рівненській області?",
            ru: "Каково состояние дорог в Ровенской области?",
            en: "What is the road condition in Rivne region?",
          },
          answer: {
            uk: "Основні траси М-06 (Київ-Львів) та М-07 в хорошому стані. Дороги до туристичних місць (Клевань, Корець, Острог) переважно асфальтовані. До деяких сіл — ґрунтові дороги.",
            ru: "Основные трассы М-06 (Киев-Львов) и М-07 в хорошем состоянии. Дороги к туристическим местам (Клевань, Корец, Острог) преимущественно асфальтированы. К некоторым сёлам — грунтовые дороги.",
            en: "Main highways M-06 (Kyiv-Lviv) and M-07 are in good condition. Roads to tourist spots (Klevan, Korets, Ostroh) are mostly paved. Some village roads are unpaved.",
          },
        },
      ],
    },
    {
      title: {
        uk: "Оренда та умови",
        ru: "Аренда и условия",
        en: "Rental Terms",
      },
      items: [
        {
          question: {
            uk: "Чи є доставка авто до Острога чи Корця?",
            ru: "Есть ли доставка авто в Острог или Корец?",
            en: "Do you deliver cars to Ostroh or Korets?",
          },
          answer: {
            uk: "Так, доставляємо по всій Рівненській області: Острог (40 км), Корець (50 км), Дубно (45 км). Вартість доставки від 400 грн. При оренді від 3 днів — знижка.",
            ru: "Да, доставляем по всей Ровенской области: Острог (40 км), Корец (50 км), Дубно (45 км). Стоимость доставки от 400 грн. При аренде от 3 дней — скидка.",
            en: "Yes, we deliver throughout Rivne region: Ostroh (40 km), Korets (50 km), Dubno (45 km). Delivery from 400 UAH. Discount for 3+ day rentals.",
          },
        },
        {
          question: {
            uk: "Чи можна орендувати авто на один день?",
            ru: "Можно ли арендовать авто на один день?",
            en: "Can I rent a car for just one day?",
          },
          answer: {
            uk: "Так, мінімальний термін оренди — 1 доба. Вартість від 800 грн/день залежно від класу авто. При оренді від 3 днів діють знижки до 15%.",
            ru: "Да, минимальный срок аренды — 1 сутки. Стоимость от 800 грн/день в зависимости от класса авто. При аренде от 3 дней действуют скидки до 15%.",
            en: "Yes, minimum rental is 1 day. Price from 800 UAH/day depending on car class. Discounts up to 15% for 3+ day rentals.",
          },
        },
      ],
    },
  ],
  khmelnytskyi: [
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Як дістатися до Кам'янця-Подільського на орендованому авто?",
            ru: "Как добраться до Каменца-Подольского на арендованном авто?",
            en: "How to get to Kamianets-Podilskyi by rental car?",
          },
          answer: {
            uk: "Від Хмельницького до Кам'янця-Подільського 100 км (1,5 години). Дорога в хорошому стані. Є платні парковки біля фортеці (30-50 грн). Рекомендуємо виїжджати вранці, щоб уникнути туристичних черг.",
            ru: "От Хмельницкого до Каменца-Подольского 100 км (1,5 часа). Дорога в хорошем состоянии. Есть платные парковки у крепости (30-50 грн). Рекомендуем выезжать утром, чтобы избежать туристических очередей.",
            en: "From Khmelnytskyi to Kamianets-Podilskyi is 100 km (1.5 hours). Road is in good condition. Paid parking near fortress (30-50 UAH). We recommend leaving early to avoid tourist crowds.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто в центрі Хмельницького?",
            ru: "Где припарковать авто в центре Хмельницкого?",
            en: "Where to park in Khmelnytskyi city center?",
          },
          answer: {
            uk: "Безкоштовні парковки біля ТЦ «Либідь», «Дастор». Платні парковки в центрі 10-20 грн/год. Біля набережної є велика безкоштовна парковка.",
            ru: "Бесплатные парковки у ТЦ «Лыбедь», «Дастор». Платные парковки в центре 10-20 грн/час. У набережной есть большая бесплатная парковка.",
            en: "Free parking at Lybid and Dastor malls. Paid parking in center 10-20 UAH/hour. Large free parking near the embankment.",
          },
        },
        {
          question: {
            uk: "Чи є доставка авто до Кам'янця-Подільського?",
            ru: "Есть ли доставка авто в Каменец-Подольский?",
            en: "Do you deliver cars to Kamianets-Podilskyi?",
          },
          answer: {
            uk: "Так, доставляємо авто до Кам'янця-Подільського (100 км). Вартість доставки від 800 грн. При оренді від 3 днів — знижка на доставку 50%.",
            ru: "Да, доставляем авто в Каменец-Подольский (100 км). Стоимость доставки от 800 грн. При аренде от 3 дней — скидка на доставку 50%.",
            en: "Yes, we deliver to Kamianets-Podilskyi (100 km). Delivery from 800 UAH. 50% discount on delivery for 3+ day rentals.",
          },
        },
      ],
    },
    {
      title: {
        uk: "Оренда та умови",
        ru: "Аренда и условия",
        en: "Rental Terms",
      },
      items: [
        {
          question: {
            uk: "Які маршрути популярні з Хмельницького?",
            ru: "Какие маршруты популярны из Хмельницкого?",
            en: "What routes are popular from Khmelnytskyi?",
          },
          answer: {
            uk: "Популярні маршрути: Кам'янець-Подільський (100 км), Бакота (120 км), Хотин (130 км), Меджибіж (35 км), Вінниця (120 км). Всі дороги асфальтовані та в хорошому стані.",
            ru: "Популярные маршруты: Каменец-Подольский (100 км), Бакота (120 км), Хотин (130 км), Меджибож (35 км), Винница (120 км). Все дороги асфальтированы и в хорошем состоянии.",
            en: "Popular routes: Kamianets-Podilskyi (100 km), Bakota (120 km), Khotyn (130 km), Medzhybizh (35 km), Vinnytsia (120 km). All roads are paved and in good condition.",
          },
        },
        {
          question: {
            uk: "Який депозит при оренді в Хмельницькому?",
            ru: "Какой депозит при аренде в Хмельницком?",
            en: "What is the deposit for rental in Khmelnytskyi?",
          },
          answer: {
            uk: "Стандартний депозит: економ — від $200, бізнес — від $400, преміум/SUV — від $600. При пакеті «Без застави» депозит відсутній. Повертається при здачі авто в належному стані.",
            ru: "Стандартный депозит: эконом — от $200, бизнес — от $400, премиум/SUV — от $600. При пакете «Без залога» депозит отсутствует. Возвращается при сдаче авто в надлежащем состоянии.",
            en: "Standard deposit: economy — from $200, business — from $400, premium/SUV — from $600. 'No Deposit' package available. Returned upon car return in proper condition.",
          },
        },
      ],
    },
  ],
  "kamianets-podilskyi": [
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      },
      items: [
        {
          question: {
            uk: "Де припаркувати авто біля Кам'янець-Подільської фортеці?",
            ru: "Где припарковать авто у Каменец-Подольской крепости?",
            en: "Where to park near Kamianets-Podilskyi Fortress?",
          },
          answer: {
            uk: "Є платна парковка біля фортеці (30-50 грн). Також безкоштовна парковка за 300м біля мосту. У вихідні краще приїжджати до 10:00, бо місць може не бути.",
            ru: "Есть платная парковка у крепости (30-50 грн). Также бесплатная парковка в 300м у моста. В выходные лучше приезжать до 10:00, так как мест может не быть.",
            en: "Paid parking near fortress (30-50 UAH). Also free parking 300m away near the bridge. On weekends, arrive before 10:00 as spots fill up quickly.",
          },
        },
        {
          question: {
            uk: "Як дістатися до Хотинської фортеці?",
            ru: "Как добраться до Хотинской крепости?",
            en: "How to get to Khotyn Fortress?",
          },
          answer: {
            uk: "Від Кам'янця до Хотина 20 км (25 хв). Дорога асфальтована. Парковка біля фортеці безкоштовна. Рекомендуємо відвідати обидві фортеці за один день.",
            ru: "От Каменца до Хотина 20 км (25 мин). Дорога асфальтирована. Парковка у крепости бесплатная. Рекомендуем посетить обе крепости за один день.",
            en: "From Kamianets to Khotyn is 20 km (25 min). Road is paved. Parking at fortress is free. We recommend visiting both fortresses in one day.",
          },
        },
        {
          question: {
            uk: "Як дістатися до Бакоти?",
            ru: "Как добраться до Бакоты?",
            en: "How to get to Bakota?",
          },
          answer: {
            uk: "Бакота знаходиться в 35 км від Кам'янця (45 хв). Останні 5 км — ґрунтова дорога, рекомендуємо кросовер. Є оглядовий майданчик та скельний монастир.",
            ru: "Бакота находится в 35 км от Каменца (45 мин). Последние 5 км — грунтовая дорога, рекомендуем кроссовер. Есть смотровая площадка и скальный монастырь.",
            en: "Bakota is 35 km from Kamianets (45 min). Last 5 km is unpaved road, crossover recommended. There's a viewpoint and rock monastery.",
          },
        },
      ],
    },
    {
      title: {
        uk: "Оренда та умови",
        ru: "Аренда и условия",
        en: "Rental Terms",
      },
      items: [
        {
          question: {
            uk: "Чи можна орендувати авто на вихідні для огляду фортець?",
            ru: "Можно ли арендовать авто на выходные для осмотра крепостей?",
            en: "Can I rent a car for a weekend fortress tour?",
          },
          answer: {
            uk: "Так, мінімальний термін — 1 день. Для огляду Кам'янця, Хотина та Бакоти рекомендуємо 2 дні. При оренді на вихідні (пт-нд) діє спеціальна ціна.",
            ru: "Да, минимальный срок — 1 день. Для осмотра Каменца, Хотина и Бакоты рекомендуем 2 дня. При аренде на выходные (пт-вс) действует специальная цена.",
            en: "Yes, minimum is 1 day. For touring Kamianets, Khotyn and Bakota we recommend 2 days. Weekend (Fri-Sun) special rates available.",
          },
        },
        {
          question: {
            uk: "Чи є доставка авто до готелю в Кам'янці?",
            ru: "Есть ли доставка авто в отель в Каменце?",
            en: "Do you deliver cars to hotels in Kamianets?",
          },
          answer: {
            uk: "Так, доставляємо авто до будь-якого готелю в Кам'янці-Подільському безкоштовно. До Старого міста та фортеці — теж безкоштовно.",
            ru: "Да, доставляем авто в любой отель Каменца-Подольского бесплатно. К Старому городу и крепости — тоже бесплатно.",
            en: "Yes, we deliver to any hotel in Kamianets-Podilskyi for free. To Old Town and fortress — also free.",
          },
        },
      ],
    },
  ],
  drohobych: [
    {
      title: { uk: "Оренда та доставка", ru: "Аренда и доставка", en: "Rental and Delivery" },
      items: [
        {
          question: { uk: "Чи є доставка до Трускавця?", ru: "Есть ли доставка в Трускавец?", en: "Do you deliver to Truskavets?" },
          answer: { uk: "Так, доставка до Трускавця (10 км) безкоштовна. До Східниці та Борислава — від 200 грн.", ru: "Да, доставка в Трускавец (10 км) бесплатная. В Сходницу и Борислав — от 200 грн.", en: "Yes, delivery to Truskavets (10 km) is free. To Skhidnytsia and Boryslav — from 200 UAH." },
        },
        {
          question: { uk: "Де орендувати авто для поїздки до Карпат?", ru: "Где арендовать авто для поездки в Карпаты?", en: "Where to rent a car for a Carpathian trip?" },
          answer: { uk: "REIZ у Дрогобичі — ідеальний старт для подорожі до Карпат. До Буковеля 150 км, до Славського 80 км. Рекомендуємо кросовер для гірських доріг.", ru: "REIZ в Дрогобыче — идеальный старт для путешествия в Карпаты. До Буковеля 150 км, до Славского 80 км. Рекомендуем кроссовер для горных дорог.", en: "REIZ in Drohobych is the perfect start for a Carpathian trip. Bukovel is 150 km, Slavske is 80 km. We recommend a crossover for mountain roads." },
        },
        {
          question: { uk: "Де припаркувати авто в центрі Дрогобича?", ru: "Где припарковать авто в центре Дрогобыча?", en: "Where can I park in Drohobych city center?" },
          answer: { uk: "Є парковки біля ратуші та туристичних локацій, також місця вздовж вулиць. У сезон краще приїхати раніше.", ru: "Есть парковки у ратуши и туристических локаций, также места вдоль улиц. В сезон лучше приезжать раньше.", en: "There is parking near the town hall and tourist spots, plus street parking. In high season, arrive earlier." },
        },
        {
          question: { uk: "Чи можна отримати та повернути авто на вокзалі або в готелі?", ru: "Можно ли получить и вернуть авто на вокзале или в отеле?", en: "Can I pick up and return the car at the station or a hotel?" },
          answer: { uk: "Так, подача й повернення можливі за адресою, у готелі або на вокзалі. Час узгоджується під час бронювання.", ru: "Да, подача и возврат возможны по адресу, в отеле или на вокзале. Время согласовывается при бронировании.", en: "Yes, delivery and return are available to your address, hotel, or the station. Timing is arranged during booking." },
        },
        {
          question: { uk: "Яка паливна політика?", ru: "Какая топливная политика?", en: "What is the fuel policy?" },
          answer: { uk: "Зазвичай діє правило «повний‑повний». За потреби доступна опція передоплати.", ru: "Обычно действует правило «полный‑полный». При необходимости доступна опция предоплаты.", en: "We typically use a full-to-full policy. A prepaid option is available if needed." },
        },
        {
          question: { uk: "Які документи потрібні та чи є депозит?", ru: "Какие документы нужны и есть ли депозит?", en: "What documents are required and is there a deposit?" },
          answer: { uk: "Потрібні паспорт/ID та водійське посвідчення (стаж від 2 років). Депозит залежить від класу авто; є пакети без застави.", ru: "Нужны паспорт/ID и водительское удостоверение (стаж от 2 лет). Депозит зависит от класса авто; есть пакеты без залога.", en: "You need a passport/ID card and a driver's license (2+ years experience). The deposit depends on the car class; no-deposit packages are available." },
        },
      ],
    },
  ],
  stryi: [
    {
      title: { uk: "Оренда та доставка", ru: "Аренда и доставка", en: "Rental and Delivery" },
      items: [
        {
          question: { uk: "Чи є доставка до Моршина?", ru: "Есть ли доставка в Моршин?", en: "Do you deliver to Morshyn?" },
          answer: { uk: "Так, доставка до Моршина (30 км) — 300 грн. При оренді від 3 днів — безкоштовно.", ru: "Да, доставка в Моршин (30 км) — 300 грн. При аренде от 3 дней — бесплатно.", en: "Yes, delivery to Morshyn (30 km) — 300 UAH. Free for 3+ day rentals." },
        },
        {
          question: { uk: "Який найкращий маршрут до Буковеля?", ru: "Какой лучший маршрут до Буковеля?", en: "What's the best route to Bukovel?" },
          answer: { uk: "Зі Стрия до Буковеля 130 км через Сколе та Славське. Дорога асфальтована. Взимку можуть бути снігопади на перевалі.", ru: "Из Стрыя до Буковеля 130 км через Сколе и Славское. Дорога асфальтирована. Зимой возможны снегопады на перевале.", en: "From Stryi to Bukovel is 130 km via Skole and Slavske. Road is paved. Winter snowfall possible at the pass." },
        },
        {
          question: { uk: "Чи можна отримати авто на вокзалі Стрия або за адресою?", ru: "Можно ли получить авто на вокзале Стрыя или по адресу?", en: "Can I pick up the car at Stryi station or at an address?" },
          answer: { uk: "Так, подаємо на вокзал, автостанцію або за адресою в місті. Час узгоджується під час бронювання.", ru: "Да, подаем на вокзал, автостанцию или по адресу в городе. Время согласовывается при бронировании.", en: "Yes, we can deliver to the railway station, bus station, or your address. Timing is arranged during booking." },
        },
        {
          question: { uk: "Де припаркувати авто в центрі Стрия?", ru: "Где припарковать авто в центре Стрыя?", en: "Where can I park in Stryi city center?" },
          answer: { uk: "Є парковки біля центральних вулиць та торгових зон, також місця вздовж вулиць. Дотримуйтесь знаків.", ru: "Есть парковки у центральных улиц и торговых зон, также места вдоль улиц. Соблюдайте знаки.", en: "There is parking near central streets and shopping areas, plus street parking. Follow signage." },
        },
        {
          question: { uk: "Які маршрути популярні зі Стрия на 1 день?", ru: "Какие маршруты популярны из Стрыя на 1 день?", en: "What day-trip routes are popular from Stryi?" },
          answer: { uk: "Сколе, Тустань, Славське та Моршин — найпопулярніші напрямки. Для гірських доріг радимо кросовер.", ru: "Сколе, Тустань, Славское и Моршин — самые популярные направления. Для горных дорог советуем кроссовер.", en: "Skole, Tustan, Slavske, and Morshyn are the most popular directions. For mountain roads, we recommend a crossover." },
        },
        {
          question: { uk: "Яка паливна політика?", ru: "Какая топливная политика?", en: "What is the fuel policy?" },
          answer: { uk: "Стандартно діє правило «повний‑повний». За потреби доступна опція передоплати.", ru: "Стандартно действует правило «полный‑полный». При необходимости доступна опция предоплаты.", en: "We use a full-to-full policy. A prepaid option is available if needed." },
        },
      ],
    },
  ],
  sambir: [
    {
      title: { uk: "Оренда та доставка", ru: "Аренда и доставка", en: "Rental and Delivery" },
      items: [
        {
          question: { uk: "Чи можна виїхати до Польщі?", ru: "Можно ли выехать в Польшу?", en: "Can I travel to Poland?" },
          answer: { uk: "Так, до КПП Шегині 30 км. Потрібна зелена карта (оформляємо). Додаткова плата від 15€/день.", ru: "Да, до КПП Шегини 30 км. Нужна зелёная карта (оформляем). Дополнительная плата от 15€/день.", en: "Yes, Shehyni checkpoint is 30 km. Green card required (we can arrange). Extra fee from €15/day." },
        },
        {
          question: { uk: "Чи є доставка до Львова?", ru: "Есть ли доставка во Львов?", en: "Do you deliver to Lviv?" },
          answer: { uk: "Так, доставка до Львова (75 км) — 600 грн. При оренді від 5 днів — знижка 50%.", ru: "Да, доставка во Львов (75 км) — 600 грн. При аренде от 5 дней — скидка 50%.", en: "Yes, delivery to Lviv (75 km) — 600 UAH. 50% discount for 5+ day rentals." },
        },
        {
          question: { uk: "Чи можна отримати авто на вокзалі Самбора або за адресою?", ru: "Можно ли получить авто на вокзале Самбора или по адресу?", en: "Can I pick up the car at Sambir station or at an address?" },
          answer: { uk: "Так, подаємо на вокзал, автостанцію або до готелю. Час узгоджується при бронюванні.", ru: "Да, подаем на вокзал, автостанцию или в отель. Время согласовывается при бронировании.", en: "Yes, we can deliver to the railway station, bus station, or a hotel. Timing is arranged during booking." },
        },
        {
          question: { uk: "Де припаркувати авто в центрі Самбора?", ru: "Где припарковать авто в центре Самбора?", en: "Where can I park in Sambir city center?" },
          answer: { uk: "Є парковки в центрі та місця вздовж основних вулиць. У вихідні місць менше — краще приїхати раніше.", ru: "Есть парковки в центре и места вдоль основных улиц. В выходные мест меньше — лучше приехать раньше.", en: "There is parking in the center and along main streets. On weekends, spots are limited, so arrive earlier." },
        },
        {
          question: { uk: "Які маршрути популярні з Самбора на 1 день?", ru: "Какие маршруты популярны из Самбора на 1 день?", en: "What day-trip routes are popular from Sambir?" },
          answer: { uk: "Популярні напрямки: Дрогобич, Трускавець, Старий Самбір та Турка. Для гірських доріг радимо кросовер.", ru: "Популярные направления: Дрогобыч, Трускавец, Старый Самбор и Турка. Для горных дорог советуем кроссовер.", en: "Popular directions include Drohobych, Truskavets, Staryi Sambir, and Turka. For mountain roads, we recommend a crossover." },
        },
        {
          question: { uk: "Які документи потрібні та чи є депозит?", ru: "Какие документы нужны и есть ли депозит?", en: "What documents are required and is there a deposit?" },
          answer: { uk: "Потрібні паспорт/ID і водійське посвідчення (стаж від 2 років). Депозит залежить від класу авто; є пакети без застави.", ru: "Нужны паспорт/ID и водительское удостоверение (стаж от 2 лет). Депозит зависит от класса авто; есть пакеты без залога.", en: "You need a passport/ID card and a driver's license (2+ years experience). The deposit depends on the car class; no-deposit packages are available." },
        },
      ],
    },
  ],
  chervonohrad: [
    {
      title: { uk: "Оренда та доставка", ru: "Аренда и доставка", en: "Rental and Delivery" },
      items: [
        {
          question: { uk: "Чи є доставка до Львова?", ru: "Есть ли доставка во Львов?", en: "Do you deliver to Lviv?" },
          answer: { uk: "Так, доставка до Львова (65 км) — 500 грн. При оренді від 3 днів — безкоштовно.", ru: "Да, доставка во Львов (65 км) — 500 грн. При аренде от 3 дней — бесплатно.", en: "Yes, delivery to Lviv (65 km) — 500 UAH. Free for 3+ day rentals." },
        },
        {
          question: { uk: "Чи можна виїхати до Польщі?", ru: "Можно ли выехать в Польшу?", en: "Can I travel to Poland?" },
          answer: { uk: "Так, до КПП Рава-Руська 40 км. Потрібна зелена карта. Оформляємо на місці.", ru: "Да, до КПП Рава-Русская 40 км. Нужна зелёная карта. Оформляем на месте.", en: "Yes, Rava-Ruska checkpoint is 40 km. Green card required. We arrange it on site." },
        },
        {
          question: { uk: "Де припаркувати авто в центрі Червонограда?", ru: "Где припарковать авто в центре Червонограда?", en: "Where can I park in Chervonohrad city center?" },
          answer: { uk: "Є парковки біля центру та торгових зон, також місця вздовж вулиць. Дотримуйтесь знаків.", ru: "Есть парковки у центра и торговых зон, также места вдоль улиц. Соблюдайте знаки.", en: "There is parking near the center and shopping areas, plus street parking. Follow signage." },
        },
        {
          question: { uk: "Чи можна отримати авто на вокзалі або за адресою?", ru: "Можно ли получить авто на вокзале или по адресу?", en: "Can I pick up the car at the station or at an address?" },
          answer: { uk: "Так, подаємо на вокзал, автостанцію або за адресою в місті. Час узгоджується при бронюванні.", ru: "Да, подаем на вокзал, автостанцию или по адресу в городе. Время согласовывается при бронировании.", en: "Yes, we can deliver to the railway station, bus station, or your address. Timing is arranged during booking." },
        },
        {
          question: { uk: "Які маршрути популярні з Червонограда на 1 день?", ru: "Какие маршруты популярны из Червонограда на 1 день?", en: "What day-trip routes are popular from Chervonohrad?" },
          answer: { uk: "Популярні напрямки: Сокаль, Белз, Рава-Руська та Львів. Дороги переважно асфальтовані.", ru: "Популярные направления: Сокаль, Белз, Рава-Русская и Львов. Дороги преимущественно асфальтированы.", en: "Popular directions include Sokal, Belz, Rava-Ruska, and Lviv. Roads are mostly paved." },
        },
        {
          question: { uk: "Яка паливна політика?", ru: "Какая топливная политика?", en: "What is the fuel policy?" },
          answer: { uk: "Зазвичай діє правило «повний‑повний». За потреби доступна передоплата.", ru: "Обычно действует правило «полный‑полный». При необходимости доступна предоплата.", en: "We typically use a full-to-full policy. A prepaid option is available if needed." },
        },
      ],
    },
  ],
  boryslav: [
    {
      title: { uk: "Оренда та доставка", ru: "Аренда и доставка", en: "Rental and Delivery" },
      items: [
        {
          question: { uk: "Чи є доставка до Трускавця?", ru: "Есть ли доставка в Трускавец?", en: "Do you deliver to Truskavets?" },
          answer: { uk: "Так, доставка до Трускавця (5 км) безкоштовна. До Східниці (15 км) — 150 грн.", ru: "Да, доставка в Трускавец (5 км) бесплатная. В Сходницу (15 км) — 150 грн.", en: "Yes, delivery to Truskavets (5 km) is free. To Skhidnytsia (15 km) — 150 UAH." },
        },
        {
          question: { uk: "Яке авто краще для гір?", ru: "Какое авто лучше для гор?", en: "Which car is better for mountains?" },
          answer: { uk: "Рекомендуємо кросовер або SUV для гірських доріг Прикарпаття. Для асфальтових трас підійде будь-яке авто.", ru: "Рекомендуем кроссовер или SUV для горных дорог Прикарпатья. Для асфальтовых трасс подойдёт любое авто.", en: "We recommend a crossover or SUV for Prykarpattia mountain roads. Any car works for paved roads." },
        },
        {
          question: { uk: "Чи можна отримати авто в Бориславі на вокзалі або в готелі?", ru: "Можно ли получить авто в Бориславе на вокзале или в отеле?", en: "Can I pick up the car in Boryslav at the station or a hotel?" },
          answer: { uk: "Так, подача можлива на вокзал, до готелю або за адресою. Час узгоджується при бронюванні.", ru: "Да, подача возможна на вокзал, в отель или по адресу. Время согласовывается при бронировании.", en: "Yes, delivery is available to the station, a hotel, or your address. Timing is arranged during booking." },
        },
        {
          question: { uk: "Де припаркувати авто в центрі Борислава?", ru: "Где припарковать авто в центре Борислава?", en: "Where can I park in Boryslav city center?" },
          answer: { uk: "Є парковки біля центру та санаторних зон, також місця вздовж вулиць. У сезон краще приїхати раніше.", ru: "Есть парковки у центра и санаторных зон, также места вдоль улиц. В сезон лучше приехать раньше.", en: "There is parking near the center and resort areas, plus street parking. In high season, arrive earlier." },
        },
        {
          question: { uk: "Які маршрути популярні з Борислава?", ru: "Какие маршруты популярны из Борислава?", en: "What routes are popular from Boryslav?" },
          answer: { uk: "Трускавець, Східниця, Дрогобич і Сколе — часті напрямки на день.", ru: "Трускавец, Сходница, Дрогобыч и Сколе — частые направления на день.", en: "Truskavets, Skhidnytsia, Drohobych, and Skole are popular day-trip directions." },
        },
        {
          question: { uk: "Яка паливна політика?", ru: "Какая топливная политика?", en: "What is the fuel policy?" },
          answer: { uk: "Стандартно «повний‑повний». За потреби можна обрати передоплату.", ru: "Стандартно «полный‑полный». При необходимости можно выбрать предоплату.", en: "We use a full-to-full policy. A prepaid option is available if needed." },
        },
      ],
    },
  ],
  zhovkva: [
    {
      title: { uk: "Оренда та доставка", ru: "Аренда и доставка", en: "Rental and Delivery" },
      items: [
        {
          question: { uk: "Чи є доставка до Львова?", ru: "Есть ли доставка во Львов?", en: "Do you deliver to Lviv?" },
          answer: { uk: "Так, доставка до Львова (30 км) безкоштовна. До аеропорту LWO — теж безкоштовно.", ru: "Да, доставка во Львов (30 км) бесплатная. В аэропорт LWO — тоже бесплатно.", en: "Yes, delivery to Lviv (30 km) is free. To LWO airport — also free." },
        },
        {
          question: { uk: "Які замки можна відвідати?", ru: "Какие замки можно посетить?", en: "Which castles can I visit?" },
          answer: { uk: "Жовківський замок, Креховський монастир (20 км), Олеський замок (50 км), Підгорецький замок (60 км). Всі дороги асфальтовані.", ru: "Жолковский замок, Креховский монастырь (20 км), Олесский замок (50 км), Подгорецкий замок (60 км). Все дороги асфальтированы.", en: "Zhovkva Castle, Krekhiv Monastery (20 km), Olesko Castle (50 km), Pidhirtsi Castle (60 km). All roads are paved." },
        },
        {
          question: { uk: "Де припаркувати авто в центрі Жовкви або біля замку?", ru: "Где припарковать авто в центре Жолквы или у замка?", en: "Where can I park in Zhovkva center or near the castle?" },
          answer: { uk: "Є парковки біля замку та центральної площі, також місця вздовж вулиць. У сезон краще приїхати раніше.", ru: "Есть парковки у замка и центральной площади, также места вдоль улиц. В сезон лучше приехать раньше.", en: "There is parking near the castle and the main square, plus street parking. In high season, arrive earlier." },
        },
        {
          question: { uk: "Чи можна отримати авто в Жовкві на вокзалі або за адресою?", ru: "Можно ли получить авто в Жолкве на вокзале или по адресу?", en: "Can I pick up the car in Zhovkva at the station or at an address?" },
          answer: { uk: "Так, подача можлива на вокзал, у готель або за адресою в місті. Час узгоджується при бронюванні.", ru: "Да, подача возможна на вокзал, в отель или по адресу в городе. Время согласовывается при бронировании.", en: "Yes, delivery is available to the station, a hotel, or your address. Timing is arranged during booking." },
        },
        {
          question: { uk: "Які маршрути популярні з Жовкви на 1 день?", ru: "Какие маршруты популярны из Жолквы на 1 день?", en: "What day-trip routes are popular from Zhovkva?" },
          answer: { uk: "Львів, Крехівський монастир, Рава-Руська та Белз — зручні напрямки на день.", ru: "Львов, Креховский монастырь, Рава-Русская и Белз — удобные направления на день.", en: "Lviv, Krekhiv Monastery, Rava-Ruska, and Belz are convenient day-trip routes." },
        },
        {
          question: { uk: "Які документи потрібні та чи є депозит?", ru: "Какие документы нужны и есть ли депозит?", en: "What documents are required and is there a deposit?" },
          answer: { uk: "Потрібні паспорт/ID і водійське посвідчення (стаж від 2 років). Депозит залежить від класу авто; є пакети без застави.", ru: "Нужны паспорт/ID и водительское удостоверение (стаж от 2 лет). Депозит зависит от класса авто; есть пакеты без залога.", en: "You need a passport/ID card and a driver's license (2+ years experience). The deposit depends on the car class; no-deposit packages are available." },
        },
      ],
    },
  ],
  yaremche: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Яке авто краще для карпатських доріг у Яремчі?",
            ru: "Какое авто лучше для карпатских дорог в Яремче?",
            en: "Which car is better for Carpathian roads in Yaremche?",
          },
          answer: {
            uk: "Для серпантинів і підйомів рекомендуємо кросовер або авто з більшим кліренсом. Взимку — обов'язково зимові шини. Під ваш маршрут підберемо оптимальний клас.",
            ru: "Для серпантинов и подъёмов рекомендуем кроссовер или авто с большим клиренсом. Зимой — обязательно зимние шины. Под ваш маршрут подберём оптимальный класс.",
            en: "For serpentines and climbs, we recommend a crossover or a car with higher clearance. In winter, winter tires are required. We'll suggest the best class for your route.",
          },
        },
        {
          question: {
            uk: "Чи є доставка авто до Буковеля або Ворохти?",
            ru: "Есть ли доставка авто в Буковель или Ворохту?",
            en: "Do you deliver cars to Bukovel or Vorokhta?",
          },
          answer: {
            uk: "Так, доставка по регіону можлива за попереднім узгодженням. Вартість залежить від відстані, для оренди на кілька днів діють знижки.",
            ru: "Да, доставка по региону возможна по предварительному согласованию. Стоимость зависит от расстояния, при аренде на несколько дней действуют скидки.",
            en: "Yes, regional delivery is possible with prior arrangement. Cost depends on distance, and discounts apply for multi-day rentals.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто в Яремчі та біля водоспаду Пробій?",
            ru: "Где припарковать авто в Яремче и у водопада Пробий?",
            en: "Where can I park in Yaremche and near Probiy Waterfall?",
          },
          answer: {
            uk: "Біля водоспаду та сувенірного ринку є паркувальні майданчики, у центрі — місця вздовж вулиць. У сезон приїжджайте раніше та орієнтуйтеся на знаки.",
            ru: "У водопада и сувенирного рынка есть парковки, в центре — места вдоль улиц. В сезон лучше приезжать раньше и ориентироваться по знакам.",
            en: "There are parking areas near the waterfall and the souvenir market, and street parking in the center. In high season, arrive early and follow signage.",
          },
        },
        {
          question: {
            uk: "Чи можна отримати та повернути авто біля готелю або вокзалу Яремче?",
            ru: "Можно ли получить и вернуть авто у отеля или вокзала Яремче?",
            en: "Can I pick up and return the car at a hotel or Yaremche station?",
          },
          answer: {
            uk: "Так, подача і повернення можливі за адресою, у готелі чи на вокзалі. Час і місце узгоджуються під час бронювання.",
            ru: "Да, подача и возврат возможны по адресу, в отеле или на вокзале. Время и место согласовываются при бронировании.",
            en: "Yes, delivery and return are available to your address, hotel, or the station. Time and place are arranged during booking.",
          },
        },
        {
          question: {
            uk: "Чи є обмеження пробігу для поїздок у Карпати?",
            ru: "Есть ли ограничение пробега для поездок в Карпаты?",
            en: "Is there a mileage limit for Carpathian trips?",
          },
          answer: {
            uk: "Ліміт залежить від обраного тарифу. Для далеких маршрутів можна обрати опцію Unlimited — підкажемо при бронюванні.",
            ru: "Лимит зависит от выбранного тарифа. Для дальних маршрутов можно выбрать Unlimited — подскажем при бронировании.",
            en: "The limit depends on the selected rate. For longer routes you can choose Unlimited — we'll advise during booking.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні та чи є депозит?",
            ru: "Какие документы нужны и есть ли депозит?",
            en: "What documents are required and is there a deposit?",
          },
          answer: {
            uk: "Потрібні паспорт/ID і водійське посвідчення (стаж від 2 років). Депозит залежить від класу авто; є пакети без застави.",
            ru: "Нужны паспорт/ID и водительское удостоверение (стаж от 2 лет). Депозит зависит от класса авто; есть пакеты без залога.",
            en: "You need a passport/ID card and a driver's license (2+ years experience). The deposit depends on the car class; no-deposit packages are available.",
          },
        },
      ],
    },
  ],
  kolomyia: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Як дістатися до Косова або Шешор на орендованому авто?",
            ru: "Как добраться до Косова или Шешор на арендованном авто?",
            en: "How to get to Kosiv or Sheshory by rental car?",
          },
          answer: {
            uk: "Від Коломиї до Косова близько 40 км, до Шешор — близько 55 км. Дороги переважно асфальтовані, місцями звивисті. Рекомендуємо виїжджати вдень.",
            ru: "От Коломые до Косова около 40 км, до Шешор — около 55 км. Дороги преимущественно асфальтированы, местами извилистые. Рекомендуем выезжать днем.",
            en: "From Kolomyia to Kosiv is about 40 km, to Sheshory about 55 km. Roads are mostly paved, with winding sections. We recommend traveling in daylight.",
          },
        },
        {
          question: {
            uk: "Чи можна отримати авто на вокзалі Коломиї?",
            ru: "Можно ли получить авто на вокзале Коломыи?",
            en: "Can I pick up the car at Kolomyia station?",
          },
          answer: {
            uk: "Так, подаємо авто на вокзал або автостанцію, також за адресою в місті. Час подачі узгоджується при бронюванні.",
            ru: "Да, подаем авто на вокзал или автостанцию, также по адресу в городе. Время подачи согласовывается при бронировании.",
            en: "Yes, we can deliver to the railway or bus station, or to your address in the city. Delivery time is arranged during booking.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто в центрі Коломиї?",
            ru: "Где припарковать авто в центре Коломыи?",
            en: "Where can I park in Kolomyia city center?",
          },
          answer: {
            uk: "Є паркування біля центральних вулиць, ратуші та музеїв. У години пік місць менше — краще приїхати раніше.",
            ru: "Есть парковки у центральных улиц, ратуши и музеев. В часы пик мест меньше — лучше приехать раньше.",
            en: "There is parking near central streets, the town hall, and museums. At peak times there are fewer spots, so arrive earlier.",
          },
        },
        {
          question: {
            uk: "Які маршрути популярні з Коломиї на 1 день?",
            ru: "Какие маршруты популярны из Коломыи на 1 день?",
            en: "What day-trip routes are popular from Kolomyia?",
          },
          answer: {
            uk: "Популярні напрямки: Косів, Яремче, Верховина, Чернівці. Для гірських маршрутів радимо кросовер.",
            ru: "Популярные направления: Косов, Яремче, Верховина, Черновцы. Для горных маршрутов рекомендуем кроссовер.",
            en: "Popular directions include Kosiv, Yaremche, Verkhovyna, and Chernivtsi. For mountain routes we recommend a crossover.",
          },
        },
        {
          question: {
            uk: "Чи можна повернути авто в іншому місті (Івано-Франківськ або Чернівці)?",
            ru: "Можно ли вернуть авто в другом городе (Ивано-Франковск или Черновцы)?",
            en: "Can I return the car in another city (Ivano-Frankivsk or Chernivtsi)?",
          },
          answer: {
            uk: "Так, повернення в іншому місті можливе за попереднім узгодженням. Умови та вартість підтвердить менеджер.",
            ru: "Да, возврат в другом городе возможен по предварительному согласованию. Условия и стоимость подтвердит менеджер.",
            en: "Yes, one-way return is possible with prior arrangement. Terms and cost are confirmed by our manager.",
          },
        },
        {
          question: {
            uk: "Яка паливна політика?",
            ru: "Какая топливная политика?",
            en: "What is the fuel policy?",
          },
          answer: {
            uk: "Зазвичай діє правило «повний‑повний»: повертаєте авто з таким самим рівнем пального. За потреби доступна опція передоплати.",
            ru: "Обычно действует правило «полный‑полный»: возвращаете авто с тем же уровнем топлива. При необходимости доступна опция предоплаты.",
            en: "We typically use a full-to-full policy: return the car with the same fuel level. A prepaid option is available if needed.",
          },
        },
      ],
    },
  ],
  kalush: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Чи є доставка авто до Івано-Франківська або Долини?",
            ru: "Есть ли доставка авто в Ивано-Франковск или Долину?",
            en: "Do you deliver cars to Ivano-Frankivsk or Dolyna?",
          },
          answer: {
            uk: "Так, доставляємо по області за попереднім узгодженням. Вартість залежить від відстані, для оренди від 3 днів можливі знижки.",
            ru: "Да, доставляем по области по предварительному согласованию. Стоимость зависит от расстояния, при аренде от 3 дней возможны скидки.",
            en: "Yes, we deliver within the region with prior arrangement. The cost depends on distance; discounts are available for 3+ day rentals.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди в Калуші?",
            ru: "Какие документы нужны для аренды в Калуше?",
            en: "What documents are needed to rent in Kalush?",
          },
          answer: {
            uk: "Паспорт або ID-картка та водійське посвідчення (стаж від 2 років). Для іноземців — закордонний паспорт і посвідчення.",
            ru: "Паспорт или ID-карта и водительское удостоверение (стаж от 2 лет). Для иностранцев — загранпаспорт и удостоверение.",
            en: "Passport or ID card and a driver's license (2+ years experience). For foreigners — international passport and license.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто в центрі Калуша?",
            ru: "Где припарковать авто в центре Калуша?",
            en: "Where can I park in Kalush city center?",
          },
          answer: {
            uk: "Є міські парковки біля центру та торгових зон, також місця вздовж вулиць. Дотримуйтесь знаків і розмітки.",
            ru: "Есть городские парковки у центра и торговых зон, также места вдоль улиц. Соблюдайте знаки и разметку.",
            en: "There are city parking areas near the center and shopping zones, plus street parking. Follow signage and markings.",
          },
        },
        {
          question: {
            uk: "Які напрямки популярні з Калуша?",
            ru: "Какие направления популярны из Калуша?",
            en: "What routes are popular from Kalush?",
          },
          answer: {
            uk: "Івано-Франківськ, Долина, Галич і Яремче — часті напрямки на день. Для Карпат краще авто з більшим кліренсом.",
            ru: "Ивано-Франковск, Долина, Галич и Яремче — популярные направления на день. Для Карпат лучше авто с большим клиренсом.",
            en: "Ivano-Frankivsk, Dolyna, Halych, and Yaremche are popular day-trip directions. For the Carpathians, a higher-clearance car is better.",
          },
        },
        {
          question: {
            uk: "Чи можна повернути авто в іншому місті?",
            ru: "Можно ли вернуть авто в другом городе?",
            en: "Can I return the car in another city?",
          },
          answer: {
            uk: "Так, повернення в іншому місті можливе за попереднім узгодженням. Умови залежать від маршруту.",
            ru: "Да, возврат в другом городе возможен по предварительному согласованию. Условия зависят от маршрута.",
            en: "Yes, one-way return is available with prior arrangement. Terms depend on the route.",
          },
        },
        {
          question: {
            uk: "Як працює паливна політика?",
            ru: "Как работает топливная политика?",
            en: "How does the fuel policy work?",
          },
          answer: {
            uk: "Зазвичай діє правило «повний‑повний». Якщо потрібно — можна обрати опцію передоплати пального.",
            ru: "Обычно действует правило «полный‑полный». Если нужно — можно выбрать опцию предоплаты топлива.",
            en: "We typically use a full-to-full policy. If needed, you can choose a prepaid fuel option.",
          },
        },
      ],
    },
  ],
  nadvirna: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Наскільки зручно їхати до Буковеля з Надвірної?",
            ru: "Насколько удобно ехать в Буковель из Надворной?",
            en: "How convenient is the drive to Bukovel from Nadvirna?",
          },
          answer: {
            uk: "Маршрут проходить через Яремче та Ворохту, приблизно 60-70 км. Дорога асфальтована, взимку можливі снігові ділянки.",
            ru: "Маршрут проходит через Яремче и Ворохту, примерно 60-70 км. Дорога асфальтирована, зимой возможны снежные участки.",
            en: "The route goes via Yaremche and Vorokhta, about 60-70 km. The road is paved, with possible snowy sections in winter.",
          },
        },
        {
          question: {
            uk: "Яке авто рекомендуєте для гірських маршрутів?",
            ru: "Какое авто рекомендуете для горных маршрутов?",
            en: "Which car do you recommend for mountain routes?",
          },
          answer: {
            uk: "Для Карпат рекомендуємо кросовер або AWD. Улітку підійде й компакт, але з повним багажником краще авто з більшим кліренсом.",
            ru: "Для Карпат рекомендуем кроссовер или AWD. Летом подойдёт и компакт, но с полным багажником лучше авто с большим клиренсом.",
            en: "For the Carpathians, we recommend a crossover or AWD. In summer a compact car works too, but with a full trunk it's better to choose higher clearance.",
          },
        },
        {
          question: {
            uk: "Чи можна отримати авто на вокзалі або автостанції Надвірної?",
            ru: "Можно ли получить авто на вокзале или автостанции Надворной?",
            en: "Can I pick up the car at Nadvirna railway or bus station?",
          },
          answer: {
            uk: "Так, подаємо на вокзал, автостанцію чи за адресою в місті. Час подачі узгоджується при бронюванні.",
            ru: "Да, подаем на вокзал, автостанцию или по адресу в городе. Время подачи согласовывается при бронировании.",
            en: "Yes, we can deliver to the railway station, bus station, or your address. Delivery time is arranged during booking.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто в центрі Надвірної?",
            ru: "Где припарковать авто в центре Надворной?",
            en: "Where can I park in Nadvirna city center?",
          },
          answer: {
            uk: "Є парковки біля центру та місця вздовж основних вулиць. У сезон краще приїхати раніше.",
            ru: "Есть парковки у центра и места вдоль основных улиц. В сезон лучше приехать раньше.",
            en: "There is parking near the center and along main streets. In high season, arrive earlier.",
          },
        },
        {
          question: {
            uk: "Чи можлива доставка авто до Яремча або Ворохти?",
            ru: "Возможна ли доставка авто в Яремче или Ворохту?",
            en: "Do you deliver cars to Yaremche or Vorokhta?",
          },
          answer: {
            uk: "Так, доставка по регіону можлива за попереднім узгодженням. Вартість залежить від відстані.",
            ru: "Да, доставка по региону возможна по предварительному согласованию. Стоимость зависит от расстояния.",
            en: "Yes, regional delivery is possible with prior arrangement. The cost depends on distance.",
          },
        },
        {
          question: {
            uk: "Які умови щодо депозиту та документів?",
            ru: "Какие условия по депозиту и документам?",
            en: "What are the deposit and document requirements?",
          },
          answer: {
            uk: "Потрібні паспорт/ID і водійське посвідчення (стаж від 2 років). Депозит залежить від класу авто; є пакети без застави.",
            ru: "Нужны паспорт/ID и водительское удостоверение (стаж от 2 лет). Депозит зависит от класса авто; есть пакеты без залога.",
            en: "You need a passport/ID card and a driver's license (2+ years experience). The deposit depends on the car class; no-deposit packages are available.",
          },
        },
      ],
    },
  ],
  kosiv: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Чи можна на орендованому авто доїхати до Шешор або Верховини?",
            ru: "Можно ли на арендованном авто доехать до Шешор или Верховины?",
            en: "Can I drive to Sheshory or Verkhovyna with a rental car?",
          },
          answer: {
            uk: "Так, це популярні маршрути: Косів—Шешори (15-20 км), Косів—Верховина (~60 км). Частина доріг звивиста, тож рекомендуємо кросовер.",
            ru: "Да, это популярные маршруты: Косов—Шешоры (15-20 км), Косов—Верховина (~60 км). Часть дорог извилистая, поэтому рекомендуем кроссовер.",
            en: "Yes, these are popular routes: Kosiv–Sheshory (15-20 km), Kosiv–Verkhovyna (~60 km). Some roads are winding, so a crossover is recommended.",
          },
        },
        {
          question: {
            uk: "Чи є доставка авто до Космача або Яворова?",
            ru: "Есть ли доставка авто в Космач или Яворов?",
            en: "Do you deliver cars to Kosmach or Yavoriv?",
          },
          answer: {
            uk: "Так, можливе подання за попереднім узгодженням. Вартість залежить від відстані, деталі підтвердить менеджер.",
            ru: "Да, подача возможна по предварительному согласованию. Стоимость зависит от расстояния, детали подтвердит менеджер.",
            en: "Yes, delivery is possible with prior arrangement. Cost depends on distance; details are confirmed by the manager.",
          },
        },
        {
          question: {
            uk: "Де зручно паркуватися в Косові (центр, базар)?",
            ru: "Где удобно парковаться в Косове (центр, базар)?",
            en: "Where is it convenient to park in Kosiv (center, market)?",
          },
          answer: {
            uk: "Є парковки біля базару та в центрі. У ярмаркові дні краще приїхати раніше.",
            ru: "Есть парковки у базара и в центре. В ярмарочные дни лучше приезжать раньше.",
            en: "There is parking near the market and in the center. On fair days, it's better to arrive earlier.",
          },
        },
        {
          question: {
            uk: "Яке авто краще для місцевих гірських доріг?",
            ru: "Какое авто лучше для местных горных дорог?",
            en: "Which car is better for local mountain roads?",
          },
          answer: {
            uk: "Рекомендуємо кросовер або авто з більшим кліренсом; взимку — обов'язково зимові шини.",
            ru: "Рекомендуем кроссовер или авто с большим клиренсом; зимой — обязательно зимние шины.",
            en: "We recommend a crossover or a car with higher clearance; in winter, winter tires are required.",
          },
        },
        {
          question: {
            uk: "Чи можна повернути авто в Коломиї або Івано-Франківську?",
            ru: "Можно ли вернуть авто в Коломые или Ивано-Франковске?",
            en: "Can I return the car in Kolomyia or Ivano-Frankivsk?",
          },
          answer: {
            uk: "Так, за попереднім узгодженням. Умови та вартість підтвердить менеджер.",
            ru: "Да, по предварительному согласованию. Условия и стоимость подтвердит менеджер.",
            en: "Yes, with prior arrangement. Terms and cost are confirmed by our manager.",
          },
        },
        {
          question: {
            uk: "Яка паливна політика?",
            ru: "Какая топливная политика?",
            en: "What is the fuel policy?",
          },
          answer: {
            uk: "Стандартно «повний‑повний». За потреби доступна опція передоплати.",
            ru: "Стандартно «полный‑полный». При необходимости доступна опция предоплаты.",
            en: "We use a full-to-full policy. A prepaid option is available if needed.",
          },
        },
      ],
    },
  ],
  chortkiv: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Як дістатися до Дністровського каньйону з Чорткова?",
            ru: "Как добраться до Днестровского каньона из Чорткова?",
            en: "How to get to the Dniester Canyon from Chortkiv?",
          },
          answer: {
            uk: "Найпопулярніші напрямки — Заліщики та Устечко (40-60 км). Дороги асфальтовані, місцями серпантини та спуски.",
            ru: "Самые популярные направления — Залещики и Устечко (40-60 км). Дороги асфальтированы, местами серпантины и спуски.",
            en: "The most popular directions are Zalishchyky and Ustechko (40-60 km). Roads are paved, with some serpentines and descents.",
          },
        },
        {
          question: {
            uk: "Чи є подача авто по Тернопільській області?",
            ru: "Есть ли подача авто по Тернопольской области?",
            en: "Do you deliver cars across Ternopil region?",
          },
          answer: {
            uk: "Так, доставляємо до Бучача, Тернополя, Заліщиків та інших міст. Умови й час узгоджуються під час бронювання.",
            ru: "Да, доставляем в Бучач, Тернополь, Залещики и другие города. Условия и время согласовываются при бронировании.",
            en: "Yes, we deliver to Buchach, Ternopil, Zalishchyky and other towns. Terms and timing are arranged during booking.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто в центрі Чорткова або біля замку?",
            ru: "Где припарковать авто в центре Чорткова или у замка?",
            en: "Where can I park in Chortkiv center or near the castle?",
          },
          answer: {
            uk: "Є парковки біля центру та туристичних локацій. У вихідні краще приїхати раніше.",
            ru: "Есть парковки у центра и туристических локаций. В выходные лучше приехать раньше.",
            en: "There is parking near the center and tourist spots. On weekends, arrive earlier.",
          },
        },
        {
          question: {
            uk: "Які маршрути популярні на 1 день з Чорткова?",
            ru: "Какие маршруты популярны на 1 день из Чорткова?",
            en: "What day-trip routes are popular from Chortkiv?",
          },
          answer: {
            uk: "Бучач, Заліщики, Устечко та Дністровський каньйон — найпопулярніші напрямки.",
            ru: "Бучач, Залещики, Устечко и Днестровский каньон — самые популярные направления.",
            en: "Buchach, Zalishchyky, Ustechko, and the Dniester Canyon are the most popular directions.",
          },
        },
        {
          question: {
            uk: "Яка паливна політика?",
            ru: "Какая топливная политика?",
            en: "What is the fuel policy?",
          },
          answer: {
            uk: "Зазвичай діє правило «повний‑повний». Якщо потрібно — можна обрати передоплату.",
            ru: "Обычно действует правило «полный‑полный». Если нужно — можно выбрать предоплату.",
            en: "We typically use a full-to-full policy. A prepaid option is available if needed.",
          },
        },
        {
          question: {
            uk: "Чи можна повернути авто в іншому місті?",
            ru: "Можно ли вернуть авто в другом городе?",
            en: "Can I return the car in another city?",
          },
          answer: {
            uk: "Так, повернення в Тернополі чи інших містах можливе за попереднім узгодженням.",
            ru: "Да, возврат в Тернополе и других городах возможен по предварительному согласованию.",
            en: "Yes, one-way return in Ternopil or other cities is possible with prior arrangement.",
          },
        },
      ],
    },
  ],
  kremenets: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Як швидко доїхати до Почаєва з Кременця?",
            ru: "Как быстро доехать до Почаева из Кременца?",
            en: "How fast can I get to Pochaiv from Kremenets?",
          },
          answer: {
            uk: "До Почаєва близько 20 км, дорога асфальтована. У святкові дні можливий трафік біля лаври.",
            ru: "До Почаева около 20 км, дорога асфальтирована. В праздничные дни возможен трафик у лавры.",
            en: "Pochaiv is about 20 km away, and the road is paved. On holidays, traffic near the Lavra is possible.",
          },
        },
        {
          question: {
            uk: "Де зручно залишити авто в центрі Кременця?",
            ru: "Где удобно оставить авто в центре Кременца?",
            en: "Where is it convenient to park in Kremenets center?",
          },
          answer: {
            uk: "Паркування є біля Замкової гори, колегіуму та центральної площі. У туристичний сезон краще приїжджати раніше.",
            ru: "Парковка есть у Замковой горы, коллегиума и центральной площади. В туристический сезон лучше приезжать раньше.",
            en: "Parking is available near Castle Hill, the collegium, and the central square. In tourist season, it's better to arrive early.",
          },
        },
        {
          question: {
            uk: "Чи можна отримати авто на автостанції або в готелі Кременця?",
            ru: "Можно ли получить авто на автостанции или в отеле Кременца?",
            en: "Can I pick up the car at the bus station or a hotel in Kremenets?",
          },
          answer: {
            uk: "Так, подаємо на автостанцію, за адресою або до готелю. Час узгоджується при бронюванні.",
            ru: "Да, подаем на автостанцию, по адресу или в отель. Время согласовывается при бронировании.",
            en: "Yes, we can deliver to the bus station, your address, or a hotel. Timing is arranged during booking.",
          },
        },
        {
          question: {
            uk: "Які напрямки популярні з Кременця?",
            ru: "Какие направления популярны из Кременца?",
            en: "What routes are popular from Kremenets?",
          },
          answer: {
            uk: "Почаїв, Дубно та Тернопіль — зручні маршрути на день.",
            ru: "Почаев, Дубно и Тернополь — удобные маршруты на день.",
            en: "Pochaiv, Dubno, and Ternopil are convenient day-trip routes.",
          },
        },
        {
          question: {
            uk: "Яка паливна політика?",
            ru: "Какая топливная политика?",
            en: "What is the fuel policy?",
          },
          answer: {
            uk: "Зазвичай діє правило «повний‑повний». За потреби доступна передоплата.",
            ru: "Обычно действует правило «полный‑полный». При необходимости доступна предоплата.",
            en: "We typically use a full-to-full policy. A prepaid option is available if needed.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні та чи є депозит?",
            ru: "Какие документы нужны и есть ли депозит?",
            en: "What documents are required and is there a deposit?",
          },
          answer: {
            uk: "Потрібні паспорт/ID і водійське посвідчення (стаж від 2 років). Депозит залежить від класу авто; є пакети без застави.",
            ru: "Нужны паспорт/ID и водительское удостоверение (стаж от 2 лет). Депозит зависит от класса авто; есть пакеты без залога.",
            en: "You need a passport/ID card and a driver's license (2+ years experience). The deposit depends on the car class; no-deposit packages are available.",
          },
        },
      ],
    },
  ],
  berehove: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Чи можна виїхати до Угорщини на орендованому авто?",
            ru: "Можно ли выехать в Венгрию на арендованном авто?",
            en: "Can I drive to Hungary with a rental car?",
          },
          answer: {
            uk: "Так, виїзд можливий за попереднім узгодженням. Потрібна зелена карта; оформимо за запитом. Може діяти додаткова плата.",
            ru: "Да, выезд возможен по предварительному согласованию. Нужна зелёная карта; оформим по запросу. Может действовать дополнительная плата.",
            en: "Yes, cross-border travel is possible with prior approval. A green card is required; we can arrange it on request. Additional fees may apply.",
          },
        },
        {
          question: {
            uk: "Чи є доставка до термальних басейнів у Берегово?",
            ru: "Есть ли доставка к термальным бассейнам в Берегово?",
            en: "Do you deliver to thermal pools in Berehove?",
          },
          answer: {
            uk: "Так, подаємо авто до термальних комплексів та готелів Берегового. Час і місце узгоджуються при бронюванні.",
            ru: "Да, подаем авто к термальным комплексам и отелям Берегово. Время и место согласовываются при бронировании.",
            en: "Yes, we deliver to thermal complexes and hotels in Berehove. Time and place are arranged during booking.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто біля термальних басейнів чи в центрі Берегового?",
            ru: "Где припарковать авто у термальных бассейнов или в центре Берегово?",
            en: "Where can I park near the thermal pools or in Berehove center?",
          },
          answer: {
            uk: "Є парковки біля термальних комплексів і в центрі. У сезон місць менше — краще приїхати раніше.",
            ru: "Есть парковки у термальных комплексов и в центре. В сезон мест меньше — лучше приезжать раньше.",
            en: "There is parking near the thermal complexes and in the center. In high season, arrive earlier.",
          },
        },
        {
          question: {
            uk: "Які маршрути популярні з Берегового?",
            ru: "Какие маршруты популярны из Берегово?",
            en: "What routes are popular from Berehove?",
          },
          answer: {
            uk: "Мукачево, Ужгород і винні маршрути Закарпаття — найпопулярніші напрямки.",
            ru: "Мукачево, Ужгород и винные маршруты Закарпатья — самые популярные направления.",
            en: "Mukachevo, Uzhhorod, and Zakarpattia wine routes are the most popular directions.",
          },
        },
        {
          question: {
            uk: "Чи можна повернути авто в Мукачеві або Ужгороді?",
            ru: "Можно ли вернуть авто в Мукачево или Ужгороде?",
            en: "Can I return the car in Mukachevo or Uzhhorod?",
          },
          answer: {
            uk: "Так, повернення в іншому місті можливе за попереднім узгодженням. Вартість залежить від маршруту.",
            ru: "Да, возврат в другом городе возможен по предварительному согласованию. Стоимость зависит от маршрута.",
            en: "Yes, one-way return is possible with prior arrangement. Cost depends on the route.",
          },
        },
        {
          question: {
            uk: "Які документи потрібні для оренди в Береговому?",
            ru: "Какие документы нужны для аренды в Берегово?",
            en: "What documents are needed to rent in Berehove?",
          },
          answer: {
            uk: "Паспорт/ID та водійське посвідчення (стаж від 2 років). Депозит залежить від класу авто; є пакети без застави.",
            ru: "Паспорт/ID и водительское удостоверение (стаж от 2 лет). Депозит зависит от класса авто; есть пакеты без залога.",
            en: "Passport/ID card and a driver's license (2+ years experience). The deposit depends on the car class; no-deposit packages are available.",
          },
        },
      ],
    },
  ],
  khust: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Як дістатися до Долини нарцисів або Синевиру?",
            ru: "Как добраться до Долины нарциссов или Синевира?",
            en: "How to get to the Valley of Daffodils or Synevyr?",
          },
          answer: {
            uk: "Долина нарцисів — близько 8 км від центру, Синевир — близько 80 км через Міжгір'я. Дороги асфальтовані, місцями гірські.",
            ru: "Долина нарциссов — около 8 км от центра, Синевир — около 80 км через Межгорье. Дороги асфальтированы, местами горные.",
            en: "The Valley of Daffodils is about 8 km from the center; Synevyr is around 80 km via Mizhhiria. Roads are paved, with mountain sections.",
          },
        },
        {
          question: {
            uk: "Яке авто краще для гірських поїздок з Хуста?",
            ru: "Какое авто лучше для горных поездок из Хуста?",
            en: "Which car is better for mountain trips from Khust?",
          },
          answer: {
            uk: "Рекомендуємо кросовер або SUV, особливо взимку. На рівні траси підійде будь-який клас.",
            ru: "Рекомендуем кроссовер или SUV, особенно зимой. На ровных трассах подойдет любой класс.",
            en: "We recommend a crossover or SUV, especially in winter. Any class works for flat highways.",
          },
        },
        {
          question: {
            uk: "Чи можна отримати авто на вокзалі або за адресою в Хусті?",
            ru: "Можно ли получить авто на вокзале или по адресу в Хусте?",
            en: "Can I pick up the car at the station or at an address in Khust?",
          },
          answer: {
            uk: "Так, подаємо на вокзал, автостанцію чи за адресою. Час узгоджується при бронюванні.",
            ru: "Да, подаем на вокзал, автостанцию или по адресу. Время согласовывается при бронировании.",
            en: "Yes, we can deliver to the railway station, bus station, or your address. Timing is arranged during booking.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто в центрі Хуста або біля замку?",
            ru: "Где припарковать авто в центре Хуста или у замка?",
            en: "Where can I park in Khust center or near the castle?",
          },
          answer: {
            uk: "Є парковки біля центру та туристичних локацій; у сезон краще приїхати раніше.",
            ru: "Есть парковки у центра и туристических локаций; в сезон лучше приехать раньше.",
            en: "There is parking near the center and tourist spots; in high season, arrive earlier.",
          },
        },
        {
          question: {
            uk: "Яка паливна політика?",
            ru: "Какая топливная политика?",
            en: "What is the fuel policy?",
          },
          answer: {
            uk: "Зазвичай діє правило «повний‑повний». За потреби доступна передоплата.",
            ru: "Обычно действует правило «полный‑полный». При необходимости доступна предоплата.",
            en: "We typically use a full-to-full policy. A prepaid option is available if needed.",
          },
        },
        {
          question: {
            uk: "Чи можна повернути авто в Мукачеві, Ужгороді або Рахові?",
            ru: "Можно ли вернуть авто в Мукачево, Ужгороде или Рахове?",
            en: "Can I return the car in Mukachevo, Uzhhorod, or Rakhiv?",
          },
          answer: {
            uk: "Так, повернення в іншому місті можливе за попереднім узгодженням. Умови підтвердить менеджер.",
            ru: "Да, возврат в другом городе возможен по предварительному согласованию. Условия подтвердит менеджер.",
            en: "Yes, one-way return is possible with prior arrangement. Terms are confirmed by our manager.",
          },
        },
      ],
    },
  ],
  rakhiv: [
    {
      title: { uk: "Практична інформація", ru: "Практическая информация", en: "Practical Information" },
      items: [
        {
          question: {
            uk: "Чи можна доїхати до Драгобрата на орендованому авто?",
            ru: "Можно ли доехать до Драгобрата на арендованном авто?",
            en: "Can I drive to Drahobrat with a rental car?",
          },
          answer: {
            uk: "До Ясіні — асфальт, далі підйом до Драгобрата ґрунтовий. Узимку часто потрібен 4x4 або трансфер. Підкажемо оптимальний варіант.",
            ru: "До Ясини — асфальт, дальше подъём к Драгобрату грунтовый. Зимой часто нужен 4x4 или трансфер. Подскажем оптимальный вариант.",
            en: "Road to Yasinia is paved; the climb to Drahobrat is unpaved. In winter a 4x4 or transfer is often needed. We'll suggest the best option.",
          },
        },
        {
          question: {
            uk: "Чи можливий виїзд до Румунії з Рахова?",
            ru: "Возможен ли выезд в Румынию из Рахова?",
            en: "Is travel to Romania from Rakhiv possible?",
          },
          answer: {
            uk: "Так, за попереднім узгодженням і з зеленою картою. Умови та тарифи уточнюйте у менеджера.",
            ru: "Да, по предварительному согласованию и с зелёной картой. Условия и тарифы уточняйте у менеджера.",
            en: "Yes, with prior approval and a green card. Please check terms and fees with our manager.",
          },
        },
        {
          question: {
            uk: "Яке авто краще для високогірних маршрутів біля Рахова?",
            ru: "Какое авто лучше для высокогорных маршрутов рядом с Раховом?",
            en: "Which car is better for high-mountain routes near Rakhiv?",
          },
          answer: {
            uk: "Рекомендуємо кросовер або AWD; взимку — обов'язково зимові шини. Для рівних трас підійде будь-який клас.",
            ru: "Рекомендуем кроссовер или AWD; зимой — обязательно зимние шины. Для ровных трас подойдет любой класс.",
            en: "We recommend a crossover or AWD; in winter, winter tires are required. Any class works for flat highways.",
          },
        },
        {
          question: {
            uk: "Чи є доставка авто до Ясіні або Буковеля?",
            ru: "Есть ли доставка авто в Ясиню или Буковель?",
            en: "Do you deliver cars to Yasinia or Bukovel?",
          },
          answer: {
            uk: "Так, доставка по регіону можлива за попереднім узгодженням. Вартість залежить від відстані.",
            ru: "Да, доставка по региону возможна по предварительному согласованию. Стоимость зависит от расстояния.",
            en: "Yes, regional delivery is possible with prior arrangement. Cost depends on distance.",
          },
        },
        {
          question: {
            uk: "Де припаркувати авто в центрі Рахова?",
            ru: "Где припарковать авто в центре Рахова?",
            en: "Where can I park in Rakhiv city center?",
          },
          answer: {
            uk: "Є парковки біля вокзалу та в центрі; у сезон місць менше — краще приїхати раніше.",
            ru: "Есть парковки у вокзала и в центре; в сезон мест меньше — лучше приехать раньше.",
            en: "There is parking near the station and in the center; in high season, arrive earlier.",
          },
        },
        {
          question: {
            uk: "Чи можна повернути авто в іншому місті?",
            ru: "Можно ли вернуть авто в другом городе?",
            en: "Can I return the car in another city?",
          },
          answer: {
            uk: "Так, повернення в іншому місті можливе за попереднім узгодженням. Умови та вартість підтвердить менеджер.",
            ru: "Да, возврат в другом городе возможен по предварительному согласованию. Условия и стоимость подтвердит менеджер.",
            en: "Yes, one-way return is possible with prior arrangement. Terms and cost are confirmed by our manager.",
          },
        },
      ],
    },
  ],
};

// ============================================
// DYNAMIC TITLES (з підстановкою міста)
// ============================================
export const dynamicTitles = {
  mainTitle: (_city: CityConfig, locale: Locale): string => {
    const templates = {
      uk: `Оренда авто в Україні з REIZ: новий підхід до комфорту`,
      ru: `Аренда авто в Украине с REIZ: новый подход к комфорту`,
      en: `Car Rental in Ukraine with REIZ: A New Approach to Comfort`,
    };
    return templates[locale];
  },

  weeklyRental: (city: CityConfig, locale: Locale): string => {
    const loc = city.localized[locale];
    const templates = {
      uk: `Оренда авто на тиждень у ${loc.nameLocative}`,
      ru: `Аренда авто на неделю в ${loc.nameLocative}`,
      en: `Weekly Car Rental in ${loc.name}`,
    };
    return templates[locale];
  },

  monthlyRental: (_city: CityConfig, locale: Locale): string => {
    const templates = {
      uk: `Оренда авто на місяць`,
      ru: `Аренда авто на месяц`,
      en: `Monthly Car Rental`,
    };
    return templates[locale];
  },

  longTermRental: (city: CityConfig, locale: Locale): string => {
    const loc = city.localized[locale];
    const templates = {
      uk: `Довгострокова оренда авто у ${loc.nameLocative}`,
      ru: `Долгосрочная аренда авто в ${loc.nameLocative}`,
      en: `Long-term Car Rental in ${loc.name}`,
    };
    return templates[locale];
  },

  advantages: (city: CityConfig, locale: Locale): string => {
    const loc = city.localized[locale];
    const templates = {
      uk: `Наші переваги оренди авто у ${loc.nameLocative}`,
      ru: `Наши преимущества аренды авто в ${loc.nameLocative}`,
      en: `Our Advantages of Car Rental in ${loc.name}`,
    };
    return templates[locale];
  },

  driverService: (city: CityConfig, locale: Locale): string => {
    const loc = city.localized[locale];
    const templates = {
      uk: `Послуги водія у ${loc.nameLocative}`,
      ru: `Услуги водителя в ${loc.nameLocative}`,
      en: `Driver Service in ${loc.name}`,
    };
    return templates[locale];
  },

  freeDelivery: (city: CityConfig, locale: Locale): string => {
    const loc = city.localized[locale];
    const templates = {
      uk: `Безкоштовна доставка авто по ${loc.name}`,
      ru: `Бесплатная доставка авто по ${loc.name}`,
      en: `Free Car Delivery in ${loc.name}`,
    };
    return templates[locale];
  },
};

// ============================================
// STATIC CONTENT (однаковий для всіх міст)
// ============================================
export const staticContent = {
  hourlyRental: {
    title: {
      uk: "Погодинний тариф",
      ru: "Почасовой тариф",
      en: "Hourly Rate",
    },
    content: {
      uk: `Погодинний тариф — найкращий спосіб «приміряти» автомобіль без зобов'язань.<br/>Однієї доби зазвичай достатньо, щоби вирішити: продовжити оренду на тиждень/місяць або змінити клас.`,
      ru: `Почасовой тариф — лучший способ «примерить» автомобиль без обязательств.<br/>Одних суток обычно достаточно, чтобы решить: продолжить аренду на неделю/месяц или сменить класс.`,
      en: `The hourly rate is the best way to "try on" a car without commitment.<br/>One day is usually enough to decide: extend the rental for a week/month or change the class.`,
    },
  },

  monthlyRentalDescription: {
    uk: `Місячна оренда — для тих, хто залишається надовго: проєкт, командировка, релокація.<br/>Нижча добова вартість, один передбачуваний платіж і повна свобода маршрутів — без розкладів і прив'язки до міста.`,
    ru: `Месячная аренда — для тех, кто остаётся надолго: проект, командировка, релокация.<br/>Ниже суточная стоимость, один предсказуемый платёж и полная свобода маршрутов — без расписаний и привязки к городу.`,
    en: `Monthly rental is for those who stay for a long time: project, business trip, relocation.<br/>Lower daily cost, one predictable payment, and complete freedom of routes — without schedules and city restrictions.`,
  },

  longTermDescription: {
    uk: `Довгострокова оренда — рішення для тих, хто залишається надовго: мешканці міста, релокація, проєкти на кілька місяців, корпоративні задачі.<br/>На строк від 3 до 12+ місяців ви отримуєте персональний автомобіль з фіксованим щомісячним платежем і передбачуваним бюджетом — без клопотів із купівлею, продажем і втратою вартості.`,
    ru: `Долгосрочная аренда — решение для тех, кто остаётся надолго: жители города, релокация, проекты на несколько месяцев, корпоративные задачи.<br/>На срок от 3 до 12+ месяцев вы получаете персональный автомобиль с фиксированным ежемесячным платежом и предсказуемым бюджетом — без хлопот с покупкой, продажей и потерей стоимости.`,
    en: `Long-term rental is the solution for those who stay for a long time: city residents, relocation, projects for several months, corporate tasks.<br/>For a period of 3 to 12+ months, you get a personal car with a fixed monthly payment and a predictable budget — without the hassle of buying, selling, and losing value.`,
  },

  budgetCars: {
    title: {
      uk: "Прокат бюджетних авто — від $20/добу",
      ru: "Прокат бюджетных авто — от $20/сутки",
      en: "Budget Car Rental — from $20/day",
    },
    content: {
      uk: `Потрібна практична машина без переплат? Економ-клас REIZ — це комфорт у місті та на трасі за розумний бюджет.<br/>Компактні розміри для паркування в центрі, впевнене керування, низький витрата пального і достатньо місця для 1–4 пасажирів та багажу.`,
      ru: `Нужна практичная машина без переплат? Эконом-класс REIZ — это комфорт в городе и на трассе за разумный бюджет.<br/>Компактные размеры для парковки в центре, уверенное управление, низкий расход топлива и достаточно места для 1–4 пассажиров и багажа.`,
      en: `Need a practical car without overpaying? REIZ economy class offers comfort in the city and on the highway for a reasonable budget.<br/>Compact size for parking in the center, confident handling, low fuel consumption, and enough space for 1-4 passengers and luggage.`,
    },
  },

  advantagesList: {
    uk: `<ul><li>Зручний сайт — швидкий фільтр, актуальні ціни і точні характеристики.</li><li>Миттєве оформлення — бронювання за пару хвилин.</li><li>Прозора ціна — кінцева вартість видно до оплати, без прихованих комісій.</li><li>Гнучкі строки — доба, тиждень, місяць або довгостроково; легко продовжити або змінити модель.</li><li>Надійний парк — регулярний сервіс, чистий салон, сезонні шини за часом року.</li><li>Підтримка 24/7 — оперативно реагуємо на будь-які питання (UA/RU/EN/HE-IL).</li><li>Міжмісто за запитом — подача і повернення авто можливі по Україні.</li><li>Відповідність каталогу — отримуєте саме той клас і комплектацію, які обрали.</li><li>Прості правила — паливо, пробіг і повернення описані «людською» мовою в договорі.</li></ul>`,
    ru: `<ul><li>Удобный сайт — быстрый фильтр, актуальные цены и точные характеристики.</li><li>Мгновенное оформление — бронирование за пару минут.</li><li>Прозрачная цена — итоговая стоимость видна до оплаты, без скрытых комиссий.</li><li>Гибкие сроки — сутки, неделя, месяц или долгосрочно; легко продлить или сменить модель.</li><li>Надёжный парк — регулярный сервис, чистый салон, сезонные шины по времени года.</li><li>Поддержка 24/7 — оперативно реагируем на любые вопросы (UA/RU/EN/HE-IL).</li><li>Межгород по запросу — подача и возврат авто возможны по Украине.</li><li>Соответствие каталогу — получаете именно тот класс и комплектацию, которые выбрали.</li><li>Простые правила — топливо, пробег и возврат описаны «человеческим» языком в договоре.</li></ul>`,
    en: `<ul><li>Convenient website — quick filter, current prices, and accurate specifications.</li><li>Instant booking — reservation in a couple of minutes.</li><li>Transparent pricing — the final cost is visible before payment, no hidden fees.</li><li>Flexible terms — day, week, month, or long-term; easy to extend or change the model.</li><li>Reliable fleet — regular service, clean interior, seasonal tires according to the season.</li><li>24/7 support — we respond promptly to any questions (UA/RU/EN/HE-IL).</li><li>Intercity on request — car delivery and return available throughout Ukraine.</li><li>Catalog compliance — you get exactly the class and configuration you chose.</li><li>Simple rules — fuel, mileage, and return are described in plain language in the contract.</li></ul>`,
  },

  noDeposit: {
    title: {
      uk: "Без застави / зменшений депозит",
      ru: "Без залога / уменьшенный депозит",
      en: "No Deposit / Reduced Deposit",
    },
    content: {
      uk: `Можна взяти авто без внесення застави — це робить оренду доступнішою і передбачуваною за бюджетом.<br/>Для окремих моделей доступна опція знизити депозит на 50%.<br/>Доступність залежить від моделі, строку і дат оренди; всі деталі видно під час бронювання.`,
      ru: `Можно взять авто без внесения залога — это делает аренду доступнее и предсказуемее по бюджету.<br/>Для отдельных моделей доступна опция снизить депозит на 50%.<br/>Доступность зависит от модели, срока и дат аренды; все детали видны при бронировании.`,
      en: `You can rent a car without a deposit — this makes rental more affordable and predictable for your budget.<br/>For some models, an option to reduce the deposit by 50% is available.<br/>Availability depends on the model, term, and rental dates; all details are visible during booking.`,
    },
  },

  additionalServices: {
    title: {
      uk: "Додаткові послуги",
      ru: "Дополнительные услуги",
      en: "Additional Services",
    },
    content: {
      uk: `<ul><li>Навігація — всі авто оснащені Apple CarPlay та Android Auto. Підключайте смартфон і використовуйте звичні карти.</li><li>Дитяче крісло. Надаємо за запитом (вікові групи — за потребою).</li><li>Виїзд за кордон. Можливий за попереднім погодженням — оформимо необхідні документи і додаткову страховку.</li><li>Безлімітний пробіг. Опція Unlimited доступна для частини моделей/тарифів; доступність і вартість видно під час бронювання або уточнюйте у адміністратора.</li></ul>Оберіть потрібні опції при оформленні — ми підготуємо автомобіль до часу подачі.`,
      ru: `<ul><li>Навигация — все авто оснащены Apple CarPlay и Android Auto. Подключайте смартфон и используйте привычные карты.</li><li>Детское кресло. Предоставляем по запросу (возрастные группы — по потребности).</li><li>Выезд за границу. Возможен по предварительному согласованию — оформим необходимые документы и дополнительную страховку.</li><li>Безлимитный пробег. Опция Unlimited доступна для части моделей/тарифов; доступность и стоимость видны при бронировании или уточняйте у администратора.</li></ul>Выберите нужные опции при оформлении — мы подготовим автомобиль ко времени подачи.`,
      en: `<ul><li>Navigation — all cars are equipped with Apple CarPlay and Android Auto. Connect your smartphone and use familiar maps.</li><li>Child seat. Available on request (age groups as needed).</li><li>Cross-border travel. Possible with prior agreement — we'll prepare the necessary documents and additional insurance.</li><li>Unlimited mileage. Unlimited option is available for some models/rates; availability and cost are visible during booking or check with the administrator.</li></ul>Select the options you need when booking — we'll prepare the car for the pickup time.`,
  },
  },

  carCondition: {
    title: {
      uk: "Автомобілі в чудовому стані",
      ru: "Автомобили в отличном состоянии",
      en: "Cars in Excellent Condition",
    },
    content: {
      uk: `Ми дбайливо слідкуємо за парком REIZ — щоб кожна поїздка була комфортною і безпечною.<br/>Перед подачею кожен автомобіль проходить чек-лист: гальма, світло, шини і тиск, рідини, склоомивач. Сезонні шини ставимо вчасно.<br/>Чистота і порядок: суха/волога уборка салону, протирка поверхонь, миття кузова; за необхідності — глибоке очищення.<br/>Сервіс за регламентом: планове техобслуговування на партнёрських СТО, заміна витратних матеріалів без «відтягувань».<br/>Ви отримуєте акуратну, справну і готову до поїздки машину — просто сідайте і їдьте.`,
      ru: `Мы заботливо следим за парком REIZ — чтобы каждая поездка была комфортной и безопасной.<br/>Перед подачей каждый автомобиль проходит чек-лист: тормоза, свет, шины и давление, жидкости, стеклоомыватель. Сезонные шины ставим вовремя.<br/>Чистота и порядок: сухая/влажная уборка салона, протирка поверхностей, мойка кузова; при необходимости — глубокая очистка.<br/>Сервис по регламенту: плановое техобслуживание на партнёрских СТО, замена расходных материалов без «оттягиваний».<br/>Вы получаете аккуратную, исправную и готовую к поездке машину — просто садитесь и едьте.`,
      en: `We carefully maintain the REIZ fleet so that every trip is comfortable and safe.<br/>Before delivery, each car goes through a checklist: brakes, lights, tires and pressure, fluids, windshield washer. We install seasonal tires on time.<br/>Cleanliness and order: dry/wet interior cleaning, surface wiping, body washing; deep cleaning if necessary.<br/>Service according to regulations: scheduled maintenance at partner service stations, replacement of consumables without delays.<br/>You get a neat, working, and trip-ready car — just get in and go.`,
    },
  },

  safetyTipsIntro: {
    title: {
      uk: "Основні поради з безпечного водіння",
      ru: "Основные советы по безопасному вождению",
      en: "Basic Safe Driving Tips",
    },
    content: {
      uk: `Ви забронювали авто — далі все залежить від вашого маршруту. Щоб поїздка пройшла спокійно і приємно, тримайте в увазі базові правила безпеки.`,
      ru: `Вы забронировали авто — дальше всё зависит от вашего маршрута. Чтобы поездка прошла спокойно и приятно, держите в уме базовые правила безопасности.`,
      en: `You've booked a car — the rest depends on your route. To make the trip go smoothly and pleasantly, keep basic safety rules in mind.`,
    },
  },

  safeDistance: {
    title: {
      uk: "Дотримуйтесь безпечної дистанції",
      ru: "Соблюдайте безопасную дистанцию",
      en: "Maintain a Safe Following Distance",
    },
    content: {
      uk: `Тримайте запас до переду йдучого авто — це ваш час на реакцію.<br/>Базове правило — «три секунди». Оберіть орієнтир (знак, стовп): як тільки машина попереду його проїхала, рахуйте «раз-два-три». Якщо ви перетнули орієнтир раніше — дистанції недостатньо.`,
      ru: `Держите запас до впереди идущего авто — это ваше время на реакцию.<br/>Базовое правило — «три секунды». Выберите ориентир (знак, столб): как только машина впереди его проехала, считайте «раз-два-три». Если вы пересекли ориентир раньше — дистанции недостаточно.`,
      en: `Keep a margin to the car ahead — this is your reaction time.<br/>The basic rule is "three seconds." Choose a landmark (sign, pole): as soon as the car ahead passes it, count "one-two-three." If you crossed the landmark earlier, the distance is not enough.`,
    },
  },

  laneChange: {
    title: {
      uk: "Змінюйте смугу лише коли це безпечно",
      ru: "Меняйте полосу только когда это безопасно",
      en: "Change Lanes Only When Safe",
    },
    content: {
      uk: `<ul><li>Оцініть обстановку: центральне та бокові дзеркала, потім короткий погляд через плече — перевірте «сліпу зону».</li><li>Подайте сигнал заздалегідь, а не в момент маневру — дайте іншим час відреагувати.</li><li>Синхронізуйте швидкість з потоком у цільовій смузі, не «ныряйте» з великим розривом за швидкістю.</li><li>Тримайте дистанцію: не підрізайте — залишайте безпечний інтервал спереду і позаду.</li><li>Один маневр — одна смуга: без «змійки» і перетину кількох смуг відразу.</li><li>Уникайте перестроювань на перехрестях, пішохідних переходах і в повороті.</li><li>Особлива увага мотоциклам/велосипедам/самокатам — вони легко губляться в дзеркалах.</li><li>У погану погоду дійте м'якше: більше інтервал і довше час для маневру.</li><li>Завершили — вимкніть поворот і відновіть безпечну дистанцію.</li></ul>`,
      ru: `<ul><li>Оцените обстановку: центральное и боковые зеркала, затем короткий взгляд через плечо — проверьте «слепую зону».</li><li>Подайте сигнал заблаговременно, а не в момент манёвра — дайте другим время отреагировать.</li><li>Синхронизируйте скорость с потоком в целевой полосе, не «ныряйте» с большим разрывом по скорости.</li><li>Держите дистанцию: не подрезайте — оставляйте безопасный интервал спереди и сзади.</li><li>Один манёвр — одна полоса: без «змейки» и пересечения нескольких полос сразу.</li><li>Избегайте перестроений на перекрёстках, пешеходных переходах и в повороте.</li><li>Особое внимание мотоциклам/велосипедам/самокатам — они легко теряются в зеркалах.</li><li>В плохую погоду действуйте мягче: больше интервал и дольше время для манёвра.</li><li>Завершили — выключите поворот и восстановите безопасную дистанцию.</li></ul>`,
      en: `<ul><li>Assess the situation: center and side mirrors, then a quick glance over your shoulder — check the "blind spot."</li><li>Signal in advance, not at the moment of the maneuver — give others time to react.</li><li>Synchronize your speed with the flow in the target lane, don't "dive" with a large speed gap.</li><li>Keep your distance: don't cut off — leave a safe interval in front and behind.</li><li>One maneuver — one lane: no "snake" and crossing multiple lanes at once.</li><li>Avoid lane changes at intersections, pedestrian crossings, and while turning.</li><li>Pay special attention to motorcycles/bicycles/scooters — they easily get lost in mirrors.</li><li>In bad weather, act more gently: more interval and more time for the maneuver.</li><li>Finished — turn off the turn signal and restore the safe distance.</li></ul>`,
    },
  },

  roadSigns: {
    title: {
      uk: "Дотримуйтесь дорожніх знаків",
      ru: "Соблюдайте дорожные знаки",
      en: "Follow Road Signs",
    },
    content: {
      uk: `Знаки і сигнали — це «мова» дороги: вони заздалегідь попереджають про обмеження і можливі небезпеки.<br/>Читайте їх вчасно і дійте без поспіху.<br/>Якщо знак або схема руху незрозумілі — зменшіть швидкість, тримайте дистанцію і керуйтесь правилами пріоритету.`,
      ru: `Знаки и сигналы — это «язык» дороги: они заранее предупреждают об ограничениях и возможных опасностях.<br/>Читайте их вовремя и действуйте без спешки.<br/>Если знак или схема движения непонятны — снизьте скорость, держите дистанцию и руководствуйтесь правилами приоритета.`,
      en: `Signs and signals are the "language" of the road: they warn in advance about restrictions and possible dangers.<br/>Read them in time and act without haste.<br/>If a sign or traffic pattern is unclear — slow down, keep your distance, and follow the priority rules.`,
    },
  },

  noAlcohol: {
    title: {
      uk: "Заборона на вживання алкоголю за кермом",
      ru: "Запрет на употребление алкоголя за рулём",
      en: "Prohibition of Alcohol While Driving",
    },
    content: {
      uk: `Керування автомобілем у стані алкогольного сп'яніння строго заборонене.<br/>REIZ дотримується політики нульової толерантності: клієнт зобов'язаний утримуватись від вживання алкоголю до початку поїздки і на весь час використання орендованого автомобіля.`,
      ru: `Управление автомобилем в состоянии алкогольного опьянения строго запрещено.<br/>REIZ придерживается политики нулевой толерантности: клиент обязан воздерживаться от употребления алкоголя до начала поездки и на всё время использования арендованного автомобиля.`,
      en: `Driving under the influence of alcohol is strictly prohibited.<br/>REIZ adheres to a zero tolerance policy: the client must refrain from consuming alcohol before the trip and throughout the use of the rented car.`,
    },
  },
};

// ============================================
// ГЕНЕРАТОР ПОВНОГО HTML КОНТЕНТУ
// ============================================
function generateKyivEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>REIZ пропонує сервіс прокату автомобілів у Києві, створений для тих, хто цінує час та комфорт.<br/>Ми розуміємо специфіку мегаполіса: від заторів на мостах до потреби бути в аеропорту вчасно. Ми доставимо авто в будь-який район Києва або зустрінемо вас з машиною в будь-якій точці України за попередньою домовленістю.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинна оренда: Тест-драйв у реальних умовах</div>
<div class='editor_text'>Погодинний прокат — це ідеальний спосіб відчути автомобіль без довгострокових зобов'язань. Вам вистачить однієї доби, щоб зрозуміти характер машини: як вона маневрує у щільному київському потоці, чи легко знайти місце для паркування на Подолі або Печерську, та наскільки зручно працюють асистенти водія. Це також чудова можливість перевірити авто перед дальніми поїздками. Клієнти часто беруть машину на день, щоб протестувати її перед вікендом у Карпатах чи поїздкою на море.</div>

<div class='editor_title'>Тижневий тариф: Свобода від розкладу</div>
<div class='editor_text'>Оренда авто на тиждень у Києві — це ваша незалежність. Ви отримуєте фіксовану ціну за 7 днів і повну свободу пересувань, забуваючи про очікування таксі та пікові тарифи. Цей формат ідеальний для насиченого графіка: в будні ви вирішуєте бізнес-питання в сіті, а на вихідні вирушаєте за місто — до заміських комплексів або в подорож до Львова чи Одеси. Тижневий тест-драйв дозволяє повноцінно оцінити комфорт моделі, і якщо все сподобається — договір легко продовжити.</div>

<div class='editor_title'>Оренда на місяць: Для бізнесу та життя</div>
<div class='editor_text'>Тариф "Місяць" — вигідне рішення для проєктної роботи, відряджень або релокації до столиці. Чим довший термін, тим нижча добова вартість. Ви робите один платіж і користуєтесь авто без обмежень по маршрутах. Це оптимальний вибір для регулярних поїздок між містами (Київ ↔ Дніпро, Харків, Львів). Один автомобіль закриє всі ваші потреби: від щоденних поїздок в офіс до зустрічі делегацій в аеропорту. За потреби клас авто можна змінити.</div>

<div class='editor_title'>Довгострокова оренда (від 3 місяців)</div>
<div class='editor_text'>Альтернатива купівлі авто. Ви отримуєте персональний транспортний засіб на термін від 3 місяців до року і більше. Ваші переваги:<ul><li>Фіксований щомісячний бюджет.</li><li>Відсутність турбот про страхування, ТО, сезонну заміну гуми та втрату вартості авто.</li><li>Можливість гнучко змінювати авто залежно від сезону чи завдань (влітку — седан, взимку — кросовер).</li></ul>Подача та повернення можливі не тільки в Києві, а й в інших регіонах України.</div>

<div class='editor_title'>Бюджетний прокат (Економ-клас) — від $20</div>
<div class='editor_text'>Потрібна надійна "робоча конячка"? Економ-клас від REIZ — це поєднання мобільності та розумної ціни. Компактні габарити дозволяють легко паркуватися в центрі столиці, а низька витрата пального суттєво економить бюджет. У салоні комфортно розмістяться до 4 пасажирів з багажем.</div>

<div class='editor_title'>Чому обирають REIZ у Києві</div>
<div class='editor_text'><ul><li>Зручність: Сайт із фільтрами та актуальними цінами.</li><li>Швидкість: Оформлення та видача ключів за лічені хвилини.</li><li>Локації: Зустрічаємо в аеропортах "Бориспіль" (KBP) та "Жуляни" (IEV), на залізничному вокзалі або за вашою адресою.</li><li>Чесність: Жодних прихованих комісій — ви платите ту ціну, яку бачите.</li><li>Гнучкість: Просте продовження оренди або заміна авто.</li><li>Якість: Технічно справні, чисті авто на гумі по сезону.</li><li>Підтримка 24/7: Ми на зв'язку будь-якою зручною мовою.</li><li>Прозорі умови: Правила щодо пального та пробігу чітко прописані в договорі.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Ми робимо прокат доступнішим. Для певних моделей та умов оренди доступна опція зменшеного депозиту (до 50%) або оренди без застави. Перевіряйте доступність цієї опції при бронюванні або запитайте у менеджера.</div>

<div class='editor_title'>Послуги водія та трансфер</div>
<div class='editor_text'>Хочете відпочити або попрацювати в дорозі? Замовте авто з професійним драйвером. Ми забезпечимо комфортний трансфер з аеропортів "Бориспіль"/"Жуляни" до готелю або ділового центру.</div>

<div class='editor_title'>Доставка авто по Києву</div>
<div class='editor_text'>Безкоштовно: Подаємо авто в центральні райони (Печерськ, Поділ, Шевченківський), на Оболонь та до аеропортів (оплата паркування в аеропорту — за рахунок клієнта).<br/>За межі міста: Подача у передмістя або область розраховується індивідуально залежно від кілометражу.<br/>Як замовити: Просто вкажіть адресу та час при бронюванні, і наш адміністратор узгодить деталі.</div>

<div class='editor_title'>Додаткові опції для комфорту</div>
<div class='editor_text'><ul><li>Зв'язок: Apple CarPlay / Android Auto у кожному авто.</li><li>Діти: Дитячі крісла будь-якого розміру за запитом.</li><li>Кордон: Оформлюємо документи для виїзду за межі України (за попереднім погодженням).</li><li>Unlimited: Опція безлімітного пробігу доступна для більшості тарифів.</li></ul></div>

<div class='editor_title'>Технічний стан — наш пріоритет</div>
<div class='editor_text'>Ми гарантуємо, що ваша поїздка Києвом буде безпечною. Кожне авто перед видачею проходить перевірку за чек-листом (гальма, рідини, тиск у шинах, світло). Салон проходить хімчистку та мийку. Ви сідаєте в ідеально підготовлений автомобіль.</div>

<div class='editor_title'>Безпека руху в столиці</div>
<div class='editor_text'>Київський трафік вимагає уваги. Ось кілька порад для комфортної їзди:<ol><li><span class='text-strong'>Дистанція:</span> У щільному потоці та на мостах тримайте безпечну відстань для реакції.</li><li><span class='text-strong'>Маневрування:</span> Завжди використовуйте "поворотники" і перевіряйте "сліпі зони" перед зміною смуги. Уникайте різких перебудувань ("шашок").</li><li><span class='text-strong'>Знаки та розмітка:</span> Слідкуйте за смугами громадського транспорту — рух ними заборонено.</li><li><span class='text-strong'>Нульова толерантність:</span> REIZ категорично забороняє керування в стані алкогольного або наркотичного сп'яніння. Порушення цього правила тягне за собою штрафи та розірвання договору.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>REIZ предлагает сервис проката автомобилей в Киеве, созданный для тех, кто ценит время и комфорт. Мы понимаем специфику мегаполиса: от пробок на мостах до необходимости быть в аэропорту вовремя. Мы доставим авто в любой район Киева или встретим вас с машиной в любой точке Украины по предварительной договоренности.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовая аренда: Тест-драйв в реальных условиях</div>
<div class='editor_text'>Почасовой прокат — идеальный способ почувствовать автомобиль без долгосрочных обязательств. Вам хватит одних суток, чтобы понять характер машины: как она маневрирует в плотном киевском потоке, легко ли найти место для парковки на Подоле или Печерске, и насколько удобно работают ассистенты водителя. Это также отличная возможность проверить авто перед дальними поездками. Клиенты часто берут машину на день, чтобы протестировать её перед уик-эндом в Карпатах или поездкой на море.</div>

<div class='editor_title'>Недельный тариф: Свобода от расписания</div>
<div class='editor_text'>Аренда авто на неделю в Киеве — это ваша независимость. Вы получаете фиксированную цену за 7 дней и полную свободу передвижений, забывая об ожидании такси и пиковых тарифах. Этот формат идеален для насыщенного графика: в будни вы решаете бизнес-вопросы в сити, а на выходные отправляетесь за город — в загородные комплексы или в путешествие во Львов или Одессу. Недельный тест-драйв позволяет полноценно оценить комфорт модели, и если всё понравится — договор легко продлить.</div>

<div class='editor_title'>Аренда на месяц: Для бизнеса и жизни</div>
<div class='editor_text'>Тариф "Месяц" — выгодное решение для проектной работы, командировок или релокации в столицу. Чем дольше срок, тем ниже суточная стоимость. Вы делаете один платеж и пользуетесь авто без ограничений по маршрутам. Это оптимальный выбор для регулярных поездок между городами (Киев ↔ Днепр, Харьков, Львов). Один автомобиль закроет все ваши потребности: от ежедневных поездок в офис до встречи делегаций в аэропорту. При необходимости класс авто можно сменить.</div>

<div class='editor_title'>Долгосрочная аренда (от 3 месяцев)</div>
<div class='editor_text'>Альтернатива покупке авто. Вы получаете персональное транспортное средство на срок от 3 месяцев до года и более. Ваши преимущества:<ul><li>Фиксированный ежемесячный бюджет.</li><li>Отсутствие забот о страховке, ТО, сезонной замене резины и потере стоимости авто.</li><li>Возможность гибко менять авто в зависимости от сезона или задач (летом — седан, зимой — кроссовер).</li></ul>Подача и возврат возможны не только в Киеве, но и в других регионах Украины.</div>

<div class='editor_title'>Бюджетный прокат (Эконом-класс) — от $20</div>
<div class='editor_text'>Нужна надежная "рабочая лошадка"? Эконом-класс от REIZ — это сочетание мобильности и разумной цены. Компактные габариты позволяют легко парковаться в центре столицы, а низкий расход топлива существенно экономит бюджет. В салоне комфортно разместятся до 4 пассажиров с багажом.</div>

<div class='editor_title'>Почему выбирают REIZ в Киеве</div>
<div class='editor_text'><ul><li>Удобство: Сайт с фильтрами и актуальными ценами.</li><li>Скорость: Оформление и выдача ключей за считанные минуты.</li><li>Локации: Встречаем в аэропортах "Борисполь" (KBP) и "Жуляны" (IEV), на железнодорожном вокзале или по вашему адресу.</li><li>Честность: Никаких скрытых комиссий — вы платите ту цену, которую видите.</li><li>Гибкость: Простое продление аренды или замена авто.</li><li>Качество: Технически исправные, чистые авто на резине по сезону.</li><li>Поддержка 24/7: Мы на связи на любом удобном языке.</li><li>Прозрачные условия: Правила касательно топлива и пробега четко прописаны в договоре.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Мы делаем прокат доступнее. Для определенных моделей и условий аренды доступна опция уменьшенного депозита (до 50%) или аренды без залога. Проверяйте доступность этой опции при бронировании или спросите у менеджера.</div>

<div class='editor_title'>Услуги водителя и трансфер</div>
<div class='editor_text'>Хотите отдохнуть или поработать в дороге? Закажите авто с профессиональным драйвером. Мы обеспечим комфортный трансфер из аэропортов "Борисполь"/"Жуляны" в отель или деловой центр.</div>

<div class='editor_title'>Доставка авто по Киеву</div>
<div class='editor_text'>Бесплатно: Подаем авто в центральные районы (Печерск, Подол, Шевченковский), на Оболонь и в аэропорты (оплата парковки в аэропорту — за счет клиента).<br/>За пределы города: Подача в пригород или область рассчитывается индивидуально в зависимости от километража.<br/>Как заказать: Просто укажите адрес и время при бронировании, и наш администратор согласует детали.</div>

<div class='editor_title'>Дополнительные опции для комфорта</div>
<div class='editor_text'><ul><li>Связь: Apple CarPlay / Android Auto в каждом авто.</li><li>Дети: Детские кресла любого размера по запросу.</li><li>Граница: Оформляем документы для выезда за пределы Украины (по предварительному согласованию).</li><li>Unlimited: Опция безлимитного пробега доступна для большинства тарифов.</li></ul></div>

<div class='editor_title'>Техническое состояние — наш приоритет</div>
<div class='editor_text'>Мы гарантируем, что ваша поездка по Киеву будет безопасной. Каждое авто перед выдачей проходит проверку по чек-листу (тормоза, жидкости, давление в шинах, свет). Салон проходит химчистку и мойку. Вы садитесь в идеально подготовленный автомобиль.</div>

<div class='editor_title'>Безопасность движения в столице</div>
<div class='editor_text'>Киевский трафик требует внимания. Вот несколько советов для комфортной езды:<ol><li><span class='text-strong'>Дистанция:</span> В плотном потоке и на мостах держите безопасное расстояние для реакции.</li><li><span class='text-strong'>Маневрирование:</span> Всегда используйте "поворотники" и проверяйте "слепые зоны" перед сменой полосы. Избегайте резких перестроений ("шашек").</li><li><span class='text-strong'>Знаки и разметка:</span> Следите за полосами общественного транспорта — движение по ним запрещено.</li><li><span class='text-strong'>Нулевая толерантность:</span> REIZ категорически запрещает управление в состоянии алкогольного или наркотического опьянения. Нарушение этого правила влечет за собой штрафы и расторжение договора.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>REIZ offers a car rental service in Kyiv designed for those who value time and comfort. We understand the specifics of the metropolis: from traffic jams on bridges to the need to be at the airport on time. We deliver cars to any district of Kyiv or meet you with a car anywhere in Ukraine by prior arrangement.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rental: Real-World Test Drive</div>
<div class='editor_text'>Hourly rental is the perfect way to experience a car without long-term commitments. One day is enough to understand the character of the car: how it maneuvers in dense Kyiv traffic, whether it is easy to find a parking spot in Podil or Pechersk, and how convenient the driver assistants are. It is also a great opportunity to check the car before long trips. Clients often rent a car for a day to test it before a weekend in the Carpathians or a trip to the seaside.</div>

<div class='editor_title'>Weekly Rate: Freedom from Schedules</div>
<div class='editor_text'>Car rental for a week in Kyiv is your independence. You get a fixed price for 7 days and complete freedom of movement, forgetting about waiting for taxis and surge pricing. This format is ideal for a busy schedule: on weekdays you solve business issues in the city, and on weekends you head out of town — to country complexes or on a trip to Lviv or Odesa. A weekly test drive allows you to fully evaluate the comfort of the model, and if you like everything, the contract is easy to extend.</div>

<div class='editor_title'>Monthly Rental: For Business and Life</div>
<div class='editor_text'>The "Month" tariff is a profitable solution for project work, business trips, or relocation to the capital. The longer the term, the lower the daily cost. You make one payment and use the car without restrictions on routes. This is the optimal choice for regular trips between cities (Kyiv ↔ Dnipro, Kharkiv, Lviv). One car will cover all your needs: from daily trips to the office to meeting delegations at the airport. If necessary, the car class can be changed.</div>

<div class='editor_title'>Long-Term Rental (from 3 months)</div>
<div class='editor_text'>An alternative to buying a car. You get a personal vehicle for a period of 3 months to a year or more. Your advantages:<ul><li>Fixed monthly budget.</li><li>No worries about insurance, maintenance, seasonal tire changes, and car depreciation.</li><li>Flexibility to change cars depending on the season or tasks (sedan in summer, crossover in winter).</li></ul>Delivery and return are possible not only in Kyiv but also in other regions of Ukraine.</div>

<div class='editor_title'>Budget Rental (Economy Class) — from $20</div>
<div class='editor_text'>Need a reliable "workhorse"? Economy class from REIZ combines mobility and a reasonable price. Compact dimensions allow for easy parking in the center of the capital, and low fuel consumption significantly saves your budget. The cabin comfortably accommodates up to 4 passengers with luggage.</div>

<div class='editor_title'>Why Choose REIZ in Kyiv</div>
<div class='editor_text'><ul><li>Convenience: Website with filters and up-to-date prices.</li><li>Speed: Paperwork and key handover in minutes.</li><li>Locations: We meet you at Boryspil (KBP) and Zhuliany (IEV) airports, at the railway station, or at your address.</li><li>Honesty: No hidden fees — you pay the price you see.</li><li>Flexibility: Simple rental extension or car replacement.</li><li>Quality: Technically sound, clean cars with seasonal tires.</li><li>24/7 Support: We are in touch in any convenient language.</li><li>Transparent Conditions: Rules regarding fuel and mileage are clearly stated in the contract.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>We make rental more accessible. For certain models and rental conditions, a reduced deposit option (up to 50%) or rental without a deposit is available. Check the availability of this option when booking or ask the manager.</div>

<div class='editor_title'>Chauffeur Services and Transfer</div>
<div class='editor_text'>Want to relax or work on the road? Order a car with a professional driver. We will ensure a comfortable transfer from Boryspil/Zhuliany airports to your hotel or business center.</div>

<div class='editor_title'>Car Delivery in Kyiv</div>
<div class='editor_text'>Free: We deliver cars to central districts (Pechersk, Podil, Shevchenkivskyi), Obolon, and airports (airport parking fees are paid by the client).<br/>Outside the City: Delivery to the suburbs or region is calculated individually depending on the mileage.<br/>How to Order: Just specify the address and time when booking, and our administrator will coordinate the details.</div>

<div class='editor_title'>Additional Options for Comfort</div>
<div class='editor_text'><ul><li>Connectivity: Apple CarPlay / Android Auto in every car.</li><li>Kids: Child seats of any size upon request.</li><li>Borders: We prepare documents for traveling outside Ukraine (by prior agreement).</li><li>Unlimited: Unlimited mileage option is available for most tariffs.</li></ul></div>

<div class='editor_title'>Technical Condition is Our Priority</div>
<div class='editor_text'>We guarantee that your trip around Kyiv will be safe. Before delivery, every car undergoes a check-list inspection (brakes, fluids, tire pressure, lights). The interior undergoes dry cleaning and washing. You get into a perfectly prepared car.</div>

<div class='editor_title'>Traffic Safety in the Capital</div>
<div class='editor_text'>Kyiv traffic requires attention. Here are some tips for a comfortable drive:<ol><li><span class='text-strong'>Distance:</span> In dense traffic and on bridges, keep a safe distance for reaction.</li><li><span class='text-strong'>Maneuvering:</span> Always use turn signals and check blind spots before changing lanes. Avoid aggressive lane changing.</li><li><span class='text-strong'>Signs and Markings:</span> Watch out for public transport lanes — driving on them is prohibited.</li><li><span class='text-strong'>Zero Tolerance:</span> REIZ strictly prohibits driving under the influence of alcohol or drugs. Violation of this rule entails fines and termination of the contract.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateOdesaEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Одеса — це місто, яке живе у власному ритмі: ділові зустрічі в порту вранці, обід на Дерибасівській і вечірній променад в Аркадії. Щоб встигати скрізь і не залежати від таксі, обирайте прокат авто від REIZ. Ми пропонуємо сервіс, що поєднує одеську гостинність з німецькою точністю: ідеально чисті авто, прозорі договори та подача в будь-яку точку міста.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний драйв</div>
<div class='editor_text'>Оренда на кілька годин або добу — це ваш тест-драйв. Спробуйте, як авто поводиться на бруківці Пушкінської або в заторах на проспекті Шевченка. Чи легко вам паркуватися біля «Привозу»? Чи вмістить багажник покупки? Це найкращий спосіб зрозуміти, чи підходить вам машина, перш ніж брати її на довгий термін.</div>

<div class='editor_title'>Тижневий тариф: Відпустка та справи</div>
<div class='editor_text'>Приїхали в Одесу на тиждень? Оренда авто вигідніша за постійні поїздки на таксі. Фіксований тариф на 7 днів дає вам свободу. Ви зможете поєднати роботу в центрі з поїздками на пляжі Фонтану або виїхати за місто: на виноробні Шабо, в Санжійку чи до Аккерманської фортеці. Ви самі будуєте маршрут, не підлаштовуючись під розклад автобусів чи електричок.</div>

<div class='editor_title'>Місяць свободи (Тариф "30+")</div>
<div class='editor_text'>Для тих, хто в Одесі надовго — релокація, сезонна робота або затяжне відрядження. Ми пропонуємо спеціальний тариф: платите раз на місяць, а вартість доби виходить значно нижчою. Це ідеально для регулярних поїздок за маршрутами Одеса ↔ Київ або Одеса ↔ Миколаїв. Один автомобіль вирішує всі питання: офіс, дім, закупівлі, зустріч партнерів. Набрид седан? Можна поміняти на кросовер наступного місяця.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Живіть в Одесі з комфортом, не купуючи авто. Підписка на авто від REIZ (від 3 місяців) звільняє вас від проблем автовласника: ми беремо на себе страховку, ТО, сезонну гуму та ремонти. Ви просто насолоджуєтесь їздою узбережжям. Це вигідно для бізнесу та IT-спеціалістів: передбачувані витрати без сюрпризів.</div>

<div class='editor_title'>Бюджетний клас (від $20/добу)</div>
<div class='editor_text'>Економія може бути комфортною. Наші бюджетні авто — це сучасні іномарки з кондиціонерами (що критично важливо для одеського літа) та помірною витратою пального. Компактні розміри дозволять знайти паркомісце навіть у завантаженому центрі.</div>

<div class='editor_title'>Чому в Одесі обирають REIZ</div>
<div class='editor_text'><ul><li>Локація: Зустрінемо вас в Міжнародному аеропорту "Одеса" (ODS), на Ж/Д вокзалі або привезём авто до вашого готелю.</li><li>Швидкість: Мінімум бюрократії. Бронювання та видача займають лічені хвилини.</li><li>Чесність: Ви бачите фінальну ціну. Жодних прихованих доплат "за повітря".</li><li>Стан авто: Ми дбаємо про машини. Салон після хімчистки, технічна частина — ідеальна.</li><li>Підтримка: Ми на зв'язку 24/7 у месенджерах та телефоном.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Для вашої зручності ми впровадили опцію оренди зі зниженою заставою (до 50%) або взагалі без неї (за умови придбання повного страхування). Уточнюйте доступність цієї опції для обраного класу авто у менеджера.</div>

<div class='editor_title'>Трансфер та водій</div>
<div class='editor_text'>Хочете розслабитися і не думати про дорогу? Замовте послугу авто з водієм. Ми зустрінемо вас з табличкою в аеропорту та з комфортом доставимо в будь-яку точку Одеси чи області.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: Центр, Приморський район, Аркадія, Черемушки, Аеропорт (оплата стоянки — за клієнтом).<br/>Селище Котовського та область: Подача можлива, вартість розраховується індивідуально залежно від відстані.</div>

<div class='editor_title'>Безпека на одеських дорогах</div>
<div class='editor_text'>Специфіка південного міста вимагає уваги.<ol><li><span class='text-strong'>Трамваї:</span> В центрі багато трамвайних колій. Будьте обережні, особливо під час дощу — рейки слизькі.</li><li><span class='text-strong'>Сезонність:</span> Влітку трафік значно зростає за рахунок туристів, скутерів та самокатів. Частіше дивіться в дзеркала і перевіряйте "сліпі зони".</li><li><span class='text-strong'>Паркування:</span> Не залишайте авто під знаками "Зупинку заборонено" — в Одесі активно працюють евакуатори.</li><li><span class='text-strong'>Алкоголь:</span> Ми маємо нульову толерантність до вживання алкоголю за кермом. Порушення — це миттєве розірвання договору, штраф та внесення в чорний список.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Одесса — город, живущий в своем ритме: деловые встречи в порту утром, обед на Дерибасовской и вечерний променад в Аркадии. Чтобы успевать везде и не зависеть от такси, выбирайте прокат авто от REIZ. Мы предлагаем сервис, сочетающий одесское гостеприимство с немецкой точностью: идеально чистые авто, прозрачные договоры и подача в любую точку города.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой драйв</div>
<div class='editor_text'>Аренда на пару часов или сутки — это ваш тест-драйв. Попробуйте, как авто ведет себя на брусчатке Пушкинской или в пробках на проспекте Шевченко. Легко ли вам парковаться возле «Привоза»? Вместит ли багажник покупки? Это лучший способ понять, подходит ли вам машина, прежде чем брать её на долгий срок.</div>

<div class='editor_title'>Недельный тариф: Отпуск и дела</div>
<div class='editor_text'>Приехали в Одессу на неделю? Аренда авто выгоднее постоянных поездок на такси. Фиксированный тариф на 7 дней дает вам свободу. Вы сможете совместить работу в центре с поездками на пляжи Фонтана или выехать за город: на винодельни Шабо, в Санжейку или к Аккерманской крепости. Вы сами строите маршрут, не подстраиваясь под расписание автобусов.</div>

<div class='editor_title'>Месяц свободы (Тариф "30+")</div>
<div class='editor_text'>Для тех, кто в Одессе надолго — релокация, сезонная работа или затяжная командировка. Мы предлагаем специальный тариф: платите раз в месяц, а стоимость суток выходит значительно ниже. Это идеально для регулярных поездок по маршрутам Одесса ↔ Киев или Одесса ↔ Николаев. Один автомобиль решает все вопросы: офис, дом, закупки, встреча партнеров. Надоел седан? Можно поменять на кроссовер в следующем месяце.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Живите в Одессе с комфортом, не покупая авто. Подписка на авто от REIZ (от 3 месяцев) освобождает вас от проблем автовладельца: мы берем на себя страховку, ТО, сезонную резину и ремонты. Вы просто наслаждаетесь ездой по побережью. Это выгодно для бизнеса и IT-специалистов: предсказуемые расходы без сюрпризов.</div>

<div class='editor_title'>Бюджетный класс (от $20/сутки)</div>
<div class='editor_text'>Экономия может быть комфортной. Наши бюджетные авто — это современные иномарки с кондиционерами (что критично для одесского лета) и умеренным расходом топлива. Компактные размеры позволят найти паркоместо даже в загруженном центре.</div>

<div class='editor_title'>Почему в Одессе выбирают REIZ</div>
<div class='editor_text'><ul><li>Локация: Встретим вас в Международном аэропорту "Одесса" (ODS), на Ж/Д вокзале или привезем авто к вашему отелю.</li><li>Скорость: Минимум бюрократии. Бронирование и выдача занимают считанные минуты.</li><li>Честность: Вы видите финальную цену. Никаких скрытых доплат.</li><li>Состояние авто: Мы заботимся о машинах. Салон после химчистки, техническая часть — идеальна.</li><li>Поддержка: Мы на связи 24/7 в мессенджерах и по телефону.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Для вашего удобства мы внедрили опцию аренды со сниженным залогом (до 50%) или вообще без него (при условии покупки полного страхования). Уточняйте доступность этой опции для выбранного класса авто у менеджера.</div>

<div class='editor_title'>Трансфер и водитель</div>
<div class='editor_text'>Хотите расслабиться и не думать о дороге? Закажите услугу авто с водителем. Мы встретим вас с табличкой в аэропорту и с комфортом доставим в любую точку Одессы или области.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: Центр, Приморский район, Аркадия, Черемушки, Аэропорт (оплата парковки — за счет клиента).<br/>Поселок Котовского и область: Подача возможна, стоимость рассчитывается индивидуально в зависимости от расстояния.</div>

<div class='editor_title'>Безопасность на одесских дорогах</div>
<div class='editor_text'>Специфика южного города требует внимания.<ol><li><span class='text-strong'>Трамваи:</span> В центре много трамвайных путей. Будьте осторожны, особенно в дождь — рельсы скользкие.</li><li><span class='text-strong'>Сезонность:</span> Летом трафик значительно возрастает за счет туристов, скутеров и самокатов. Чаще смотрите в зеркала и проверяйте "слепые зоны".</li><li><span class='text-strong'>Парковка:</span> Не оставляйте авто под знаками "Остановка запрещена" — в Одессе активно работают эвакуаторы.</li><li><span class='text-strong'>Алкоголь:</span> У нас нулевая толерантность к употреблению алкоголя за рулем. Нарушение — это мгновенное расторжение договора, штраф и внесение в черный список.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Odesa is a city that lives in its own rhythm: business meetings at the port in the morning, lunch on Deribasivska Street, and an evening promenade in Arcadia. To be on time everywhere and not depend on taxis, choose car rental from REIZ. We offer a service that combines Odesa hospitality with German precision: perfectly clean cars, transparent contracts, and delivery anywhere in the city.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Drive</div>
<div class='editor_text'>Renting for a few hours or a day is your test drive. Try how the car behaves on the cobblestones of Pushkinska Street or in traffic on Shevchenko Avenue. Is it easy for you to park near "Privoz"? Will the trunk fit your shopping? This is the best way to understand if the car suits you before renting it for a long term.</div>

<div class='editor_title'>Weekly Rate: Vacation and Business</div>
<div class='editor_text'>Came to Odesa for a week? Car rental is more profitable than constant taxi rides. A fixed rate for 7 days gives you freedom. You can combine work in the center with trips to the beaches of Fontana or go out of town: to Shabo wineries, Sanzhibka cliffs, or Akkerman Fortress. You build the route yourself, without adjusting to the schedule of buses or trains.</div>

<div class='editor_title'>Month of Freedom (Tariff "30+")</div>
<div class='editor_text'>For those who stay in Odesa for a long time — relocation, seasonal work, or a long business trip. We offer a special tariff: pay once a month, and the daily cost is significantly lower. This is ideal for regular trips on routes like Odesa ↔ Kyiv or Odesa ↔ Mykolaiv. One car solves all issues: office, home, shopping, meeting partners. Tired of a sedan? You can swap it for a crossover next month.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>Live in Odesa comfortably without buying a car. Car subscription from REIZ (from 3 months) frees you from car owner problems: we handle insurance, maintenance, seasonal tires, and repairs. You simply enjoy driving along the coast. This is profitable for businesses and IT specialists: predictable expenses with no surprises.</div>

<div class='editor_title'>Budget Class (from $20/day)</div>
<div class='editor_text'>Economy can be comfortable. Our budget cars are modern foreign cars with air conditioning (critical for Odesa summer) and moderate fuel consumption. Compact dimensions allow finding a parking spot even in the busy city center.</div>

<div class='editor_title'>Why Choose REIZ in Odesa</div>
<div class='editor_text'><ul><li>Location: We will meet you at Odesa International Airport (ODS), at the Railway Station, or bring the car to your hotel.</li><li>Speed: Minimum bureaucracy. Booking and key handover take just a few minutes.</li><li>Honesty: You see the final price. No hidden fees.</li><li>Car Condition: We care about our cars. The interior is dry-cleaned, the technical part is perfect.</li><li>Support: We are in touch 24/7 via messengers and phone.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>For your convenience, we have introduced an option of rental with a reduced deposit (up to 50%) or no deposit at all (subject to purchasing full insurance). Check the availability of this option for the selected car class with the manager.</div>

<div class='editor_title'>Transfer and Chauffeur</div>
<div class='editor_text'>Want to relax and not think about the road? Order a car service with a driver. We will meet you with a sign at the airport and comfortably deliver you to any point in Odesa or the region.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: Center, Prymorskyi district, Arcadia, Cheremushky, Airport (parking fee is paid by the client).<br/>Kotovskyi District and Region: Delivery is possible, the cost is calculated individually depending on the distance.</div>

<div class='editor_title'>Safety on Odesa Roads</div>
<div class='editor_text'>The specifics of the southern city require attention.<ol><li><span class='text-strong'>Trams:</span> There are many tram tracks in the center. Be careful, especially in the rain — the rails are slippery.</li><li><span class='text-strong'>Seasonality:</span> In summer, traffic increases significantly due to tourists, scooters, and electric scooters. Check your mirrors and "blind spots" more often.</li><li><span class='text-strong'>Parking:</span> Do not leave the car under "No Stopping" signs — tow trucks are actively working in Odesa.</li><li><span class='text-strong'>Alcohol:</span> We have zero tolerance for drinking and driving. Violation means immediate termination of the contract, a fine, and blacklisting.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateDniproEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Дніпро — це потужний індустріальний та діловий центр. Тут час коштує дорого, а мобільність вирішує успіх угод. Сервіс REIZ пропонує прокат автомобілів, що відповідає амбіціям міста: від економних седанів для пересування між офісами до преміум-класу для зустрічі важливих партнерів. Ми забезпечуємо подачу авто на правий та лівий берег, а також доставку по всій області.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тест-драйв</div>
<div class='editor_text'>Вам не обов'язково брати авто на тиждень, щоб оцінити його переваги. Тариф "Погодинний" дозволяє взяти машину на день. Проїдьтеся найдовшою набережною Європи, перевірте динаміку на підйомі проспекту Яворницького або маневреність у потоці на Центральному мосту. Це найкращий спосіб переконатися, що габарити та комфорт авто вам підходять.</div>

<div class='editor_title'>Тижневий тариф: Робота і відпочинок</div>
<div class='editor_text'>Приїхали у відрядження на 7 днів? Власний автомобіль значно ефективніший за таксі. Ви зможете вільно пересуватися між промисловими зонами та центром, а на вихідних — гайнути на Блакитні озера або відвідати острів Хортиця у сусідньому Запоріжжі. Фіксована вартість тижневої оренди дозволяє чітко спланувати бюджет поїздки.</div>

<div class='editor_title'>Оренда на місяць (Тариф "Бізнес")</div>
<div class='editor_text'>Оптимальне рішення для тих, хто в Дніпрі надовго. Замість щоденної оплати — один платіж на 30 днів зі значною знижкою. Це ваш особистий транспорт без прив'язки до розкладів поїздів чи автобусів. Зручно для регулярних поїздок за маршрутами Дніпро ↔ Київ, Полтава, Харків. Якщо ваші плани зміняться (наприклад, знадобиться більше місця для багажу), ми оперативно замінимо авто на інший клас.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Потрібне авто на сезон або рік, але не хочете витрачати кошти на купівлю? Довгострокова оренда від REIZ — це сервіс "під ключ". Ви користуєтесь машиною, а ми займаємось страхуванням, технічним оглядом та сезонною заміною шин. Це ідеальний варіант для корпоративних клієнтів та компаній, що релокували бізнес у Дніпро.</div>

<div class='editor_title'>Економ-клас (від $20)</div>
<div class='editor_text'>Практичність передусім. Наші автомобілі бюджетного сегмента — це нові, технічно бездоганні машини з низькою витратою пального. Вони ідеально підходять для насиченого міського трафіку та паркування в центрі.</div>

<div class='editor_title'>Переваги сервісу REIZ у Дніпрі</div>
<div class='editor_text'><ul><li>Зустріч: Подаємо авто до аеропорту (DNK), на залізничний вокзал "Дніпро-Головний" або за вашою адресою.</li><li>Прозорість: Усі умови прописані в договорі. Жодних прихованих комісій при поверненні.</li><li>Технічний стан: Ми фанати чистоти та справності. Кожне авто проходить перевірку перед видачею.</li><li>Підтримка: Наші менеджери на зв'язку 24/7, готові допомогти українською, англійською чи іншими мовами.</li><li>Міжмісто: Подача і повернення авто можливі в інших містах України за попереднім запитом.</li></ul></div>

<div class='editor_title'>Умови без застави</div>
<div class='editor_text'>Ми робимо сервіс гнучким. Для багатьох моделей доступна опція оренди зі зменшеною заставою або без неї (при оформленні повного покриття). Дізнайтеся деталі у менеджера при бронюванні.</div>

<div class='editor_title'>Трансфер та водій</div>
<div class='editor_text'>Потрібно підготуватися до зустрічі в дорозі? Замовте авто з водієм. Ми зустрінемо вас або ваших гостей та забезпечимо трансфер преміум-рівня по місту та області.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: Центр, Набережна, район Вокзалу та прилеглі зони.<br/>Платна подача: Лівий берег, віддалені житлові масиви, передмістя. Вартість розраховується індивідуально.</div>

<div class='editor_title'>Безпека руху в Дніпрі</div>
<div class='editor_text'>Водіння в Дніпрі має свої особливості:<ol><li><span class='text-strong'>Мости:</span> Рух через Дніпро в години пік може бути ускладнений. Плануйте час із запасом.</li><li><span class='text-strong'>Трамвайні колії:</span> У місті розгалужена трамвайна мережа. Будьте обережні при перетині колій, особливо в дощ.</li><li><span class='text-strong'>Швидкість:</span> На набережній спокусливо розігнатися, але камери фіксації швидкості працюють. Дотримуйтесь обмежень.</li><li><span class='text-strong'>Алкоголь:</span> REIZ сповідує політику нульової толерантності. Керування напідпитку суворо заборонено і веде до негайного розірвання договору.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Днепр — мощный индустриальный и деловой центр. Здесь время стоит дорого, а мобильность определяет успех сделок. Сервис REIZ предлагает прокат автомобилей, соответствующий амбициям города: от экономных седанов для перемещения между офисами до премиум-класса для встречи важных партнеров. Мы обеспечиваем подачу авто на правый и левый берег, а также доставку по всей области.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тест-драйв</div>
<div class='editor_text'>Вам не обязательно брать авто на неделю, чтобы оценить его преимущества. Тариф "Почасовой" позволяет взять машину на день. Проедьтесь по самой длинной набережной Европы, проверьте динамику на подъеме проспекта Яворницкого или маневренность в потоке на Центральном мосту. Это лучший способ убедиться, что габариты и комфорт авто вам подходят.</div>

<div class='editor_title'>Недельный тариф: Работа и отдых</div>
<div class='editor_text'>Приехали в командировку на 7 дней? Собственный автомобиль значительно эффективнее такси. Вы сможете свободно перемещаться между промышленными зонами и центром, а на выходных — махнуть на Голубые озера или посетить остров Хортица в соседнем Запорожье. Фиксированная стоимость недельной аренды позволяет четко спланировать бюджет поездки.</div>

<div class='editor_title'>Аренда на месяц (Тариф "Бизнес")</div>
<div class='editor_text'>Оптимальное решение для тех, кто в Днепре надолго. Вместо ежедневной оплаты — один платеж за 30 дней со значительной скидкой. Это ваш личный транспорт без привязки к расписанию поездов или автобусов. Удобно для регулярных поездок по маршрутам Днепр ↔ Киев, Полтава, Харьков. Если ваши планы изменятся (например, понадобится больше места для багажа), мы оперативно заменим авто на другой класс.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Нужно авто на сезон или год, но не хотите тратить средства на покупку? Долгосрочная аренда от REIZ — это сервис "под ключ". Вы пользуетесь машиной, а мы занимаемся страхованием, техосмотром и сезонной заменой шин. Это идеальный вариант для корпоративных клиентов и компаний, релоцировавших бизнес в Днепр.</div>

<div class='editor_title'>Эконом-класс (от $20)</div>
<div class='editor_text'>Практичность прежде всего. Наши автомобили бюджетного сегмента — это новые, технически безупречные машины с низким расходом топлива. Они идеально подходят для насыщенного городского трафика и парковки в центре.</div>

<div class='editor_title'>Преимущества сервиса REIZ в Днепре</div>
<div class='editor_text'><ul><li>Встреча: Подаем авто в аэропорт (DNK), на Ж/Д вокзал "Днепр-Главный" или по вашему адресу.</li><li>Прозрачность: Все условия прописаны в договоре. Никаких скрытых комиссий при возврате.</li><li>Техническое состояние: Мы фанаты чистоты и исправности. Каждое авто проходит проверку перед выдачей.</li><li>Поддержка: Наши менеджеры на связи 24/7, готовы помочь на украинском, английском или других языках.</li><li>Межгород: Подача и возврат авто возможны в других городах Украины по предварительному запросу.</li></ul></div>

<div class='editor_title'>Условия без залога</div>
<div class='editor_text'>Мы делаем сервис гибким. Для многих моделей доступна опция аренды с уменьшенным залогом или без него (при оформлении полного покрытия). Узнайте детали у менеджера при бронировании.</div>

<div class='editor_title'>Трансфер и водитель</div>
<div class='editor_text'>Нужно подготовиться к встрече в дороге? Закажите авто с водителем. Мы встретим вас или ваших гостей и обеспечим трансфер премиум-уровня по городу и области.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: Центр, Набережная, район Вокзала и прилегающие зоны.<br/>Платная подача: Левый берег, отдаленные жилмассивы, пригород. Стоимость рассчитывается индивидуально.</div>

<div class='editor_title'>Безопасность движения в Днепре</div>
<div class='editor_text'>Вождение в Днепре имеет свои особенности:<ol><li><span class='text-strong'>Мосты:</span> Движение через Днепр в часы пик может быть затруднено. Планируйте время с запасом.</li><li><span class='text-strong'>Трамвайные пути:</span> В городе разветвленная трамвайная сеть. Будьте осторожны при пересечении путей, особенно в дождь.</li><li><span class='text-strong'>Скорость:</span> На набережной заманчиво разогнаться, но камеры фиксации скорости работают. Соблюдайте ограничения.</li><li><span class='text-strong'>Алкоголь:</span> REIZ исповедует политику нулевой толерантности. Управление в нетрезвом виде строго запрещено и ведет к немедленному расторжению договора.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Dnipro is a powerful industrial and business hub. Here, time is expensive, and mobility determines the success of deals. REIZ offers a car rental service tailored to the city's ambitions: from economical sedans for moving between offices to premium class vehicles for meeting important partners. We provide car delivery to both the Right and Left banks, as well as delivery throughout the region.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Test Drive</div>
<div class='editor_text'>You don't have to rent a car for a week to appreciate its benefits. The "Hourly" tariff allows you to take a car for a day. Drive along the longest embankment in Europe, check the dynamics on the ascent of Yavornytskyi Avenue, or maneuverability in traffic on the Central Bridge. This is the best way to make sure the dimensions and comfort of the car suit you.</div>

<div class='editor_title'>Weekly Rate: Work and Leisure</div>
<div class='editor_text'>Came on a business trip for 7 days? A personal car is much more efficient than a taxi. You can freely move between industrial zones and the center, and on weekends — head to the Blue Lakes or visit Khortytsia Island in neighboring Zaporizhzhia. The fixed cost of a weekly rental allows you to clearly plan your trip budget.</div>

<div class='editor_title'>Monthly Rental ("Business" Tariff)</div>
<div class='editor_text'>The optimal solution for those staying in Dnipro for a long time. Instead of daily payments — one payment for 30 days with a significant discount. This is your personal transport without being tied to train or bus schedules. Convenient for regular trips on routes Dnipro ↔ Kyiv, Poltava, Kharkiv. If your plans change (for example, you need more luggage space), we will promptly replace the car with another class.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>Need a car for a season or a year, but don't want to spend money on buying one? Long-term rental from REIZ is a turnkey service. You use the car, and we handle insurance, technical inspection, and seasonal tire changes. This is an ideal option for corporate clients and companies that have relocated their business to Dnipro.</div>

<div class='editor_title'>Economy Class (from $20)</div>
<div class='editor_text'>Practicality comes first. Our budget segment cars are new, technically flawless vehicles with low fuel consumption. They are perfect for heavy city traffic and parking in the center.</div>

<div class='editor_title'>Advantages of REIZ Service in Dnipro</div>
<div class='editor_text'><ul><li>Meeting: We deliver the car to the airport (DNK), Dnipro-Main Railway Station, or your address.</li><li>Transparency: All conditions are written in the contract. No hidden fees upon return.</li><li>Technical Condition: We are fanatics of cleanliness and serviceability. Every car undergoes inspection before delivery.</li><li>Support: Our managers are in touch 24/7, ready to help in Ukrainian, English, or other languages.</li><li>Intercity: Delivery and return of the car are possible in other cities of Ukraine upon prior request.</li></ul></div>

<div class='editor_title'>No Deposit Conditions</div>
<div class='editor_text'>We make the service flexible. For many models, a reduced deposit or no deposit option is available (with full coverage purchase). Ask the manager for details when booking.</div>

<div class='editor_title'>Transfer and Chauffeur</div>
<div class='editor_text'>Need to prepare for a meeting on the road? Order a car with a driver. We will meet you or your guests and provide premium-level transfer around the city and the region.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: Center, Embankment (Naberezhna), Railway Station area, and adjacent zones.<br/>Paid Delivery: Left bank, remote residential areas, suburbs. The cost is calculated individually.</div>

<div class='editor_title'>Traffic Safety in Dnipro</div>
<div class='editor_text'>Driving in Dnipro has its specifics:<ol><li><span class='text-strong'>Bridges:</span> Traffic across the Dnipro river during rush hours can be difficult. Plan your time with a margin.</li><li><span class='text-strong'>Tram Tracks:</span> The city has an extensive tram network. Be careful when crossing tracks, especially in the rain.</li><li><span class='text-strong'>Speed:</span> It is tempting to speed up on the embankment, but speed cameras are working. Observe the limits.</li><li><span class='text-strong'>Alcohol:</span> REIZ adheres to a zero-tolerance policy. Drunk driving is strictly prohibited and leads to immediate termination of the contract.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateKharkivEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Харків — це місто масштабів, інтелекту та шаленого ритму. Це мегаполіс, де відстані мають значення: від ділового центру біля Держпрому до індустріальних гігантів на околицях можна їхати годину. Сервіс REIZ пропонує не просто прокат автомобілів, а інструмент вашої свободи. Ми розуміємо специфіку Харкова: тут потрібні авто з надійною підвіскою для бруківки на Сумській та динамічні двигуни для широких проспектів. Ми подаємо ідеально чисті, заправлені та технічно бездоганні машини в будь-яку точку міста.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Ваш тест-драйв реальності</div>
<div class='editor_text'>Не впевнені, чи варто брати авто надовго? Погодинний тариф — це найкращий спосіб "приміряти" автомобіль без зайвих зобов'язань. Однієї доби достатньо, щоб зрозуміти все:<ol><li><span class='text-strong'>Трамвайні колії:</span> Як авто долає трамвайні колії на Героїв Харкова чи бруківку на Пушкінській?</li><li><span class='text-strong'>Паркування:</span> Чи зручно вам паркуватися у тісних дворах центру біля Оперного театру?</li><li><span class='text-strong'>Багажник:</span> Чи вмістить багажник усе спорядження для пікніка в Саржиному Яру?</li></ol>Це ідеальний варіант для коротких справ: зустріти ділових партнерів на вокзалі, влаштувати романтичний вечір або просто протестувати модель перед купівлею.</div>

<div class='editor_title'>Оренда авто на тиждень: Свобода від метро і таксі</div>
<div class='editor_text'>Тижневий тариф у Харкові — це золота середина між ціною та комфортом. Ви отримуєте один фіксований тариф на 7 днів, який значно вигідніший за подобову оренду. За тиждень ви зможете поєднати активну роботу та повноцінний відпочинок:<ol><li><span class='text-strong'>У будні:</span> Встигайте на зустрічі від "Наукової" до "Спортивної" без очікування таксі в годину пік.</li><li><span class='text-strong'>На вікенд:</span> Вирушайте за місто! Відвідайте Фельдман Екопарк, прогуляйтеся по співаючих терасах у Городньому або поїдьте до палацу у Шаровці.</li></ol>Формат "Тиждень" дає час звикнути до габаритів авто та насолодитися поїздкою без поспіху.</div>

<div class='editor_title'>Місячна оренда (Тариф "Бізнес")</div>
<div class='editor_text'>Спеціальна пропозиція для тих, хто приїхав у Харків надовго: IT-спеціалістів, менеджерів проєктів або тих, хто тимчасово залишився без власного "залізного коня".<ol><li><span class='text-strong'>Економія:</span> Вартість доби оренди знижується до мінімуму.</li><li><span class='text-strong'>Передбачуваність:</span> Один платіж раз на 30 днів.</li><li><span class='text-strong'>Мобільність:</span> Ви не прив'язані до міста. Потрібно поїхати в Київ, Дніпро чи Полтаву? Сідайте і їдьте.</li><li><span class='text-strong'>Гнучкість:</span> Якщо ваші плани зміняться (наприклад, приїде сім'я і знадобиться більше місця), ми замінимо седан на кросовер або мінівен.</li></ol></div>

<div class='editor_title'>Довгострокова оренда (Підписка на авто)</div>
<div class='editor_text'>Рішення для бізнесу та раціональних людей. Оренда від 3 місяців до року і більше. Ви отримуєте всі переваги власного автомобіля, але позбавляєтесь головного болю власника:<ol><li><span class='text-strong'>Технічний сервіс:</span> Ми самі слідкуємо за заміною масла та фільтрів.</li><li><span class='text-strong'>Шини:</span> Сезонна заміна та зберігання гуми — це наша турбота.</li><li><span class='text-strong'>Страховка:</span> Повне КАСКО та ОСЦПВ вже включені у вартість. Ви просто платите фіксовану суму щомісяця і користуєтесь авто.</li></ol></div>

<div class='editor_title'>Економ-клас: Практичність від $20/добу</div>
<div class='editor_text'>Потрібна надійна машина без переплат? Наш економ-клас — це бестселери міських доріг. Це сучасні іномарки, які споживають мінімум пального, мають кондиціонери та аудіосистеми. Їх головна перевага в Харкові — компактність. Ви легко знайдете місце для паркування навіть у перевантаженому центрі біля площі Свободи чи ринку Барабашово.</div>

<div class='editor_title'>Чому харків'яни та гості міста обирають REIZ</div>
<div class='editor_text'><ul><li>Локація: Ми зустрінемо вас в залі прильоту аеропорту (HRK), на пероні Ж/Д вокзалу "Харків-Пасажирський" або підвеземо авто прямо під під'їзд.</li><li>Швидкість: Від дзвінка до отримання ключів — мінімум часу. Документи оформлюємо за 15 хвилин.</li><li>Прозорість: Жодних прихованих "сервісних зборів". Ви платите саме ту ціну, яку бачите на сайті.</li><li>Стан авто: Наші машини проходять мийку та хімчистку перед кожною видачею. Технічний стан перевіряється за чек-листом.</li><li>Підтримка 24/7: Ми завжди на зв'язку — українською, російською, англійською чи івритом.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Ми робимо прокат доступним. Для багатьох моделей доступна опція оренди зі зменшеною заставою (50%) або взагалі без депозиту (за умови оформлення додаткового страхування Super CDW). Уточнюйте деталі у менеджера при бронюванні.</div>

<div class='editor_title'>Послуги водія та VIP-трансфер</div>
<div class='editor_text'>Хочете відпочити в дорозі або справити враження? Замовте авто бізнес або преміум-класу з професійним водієм. Ідеально для весіль, зустрічі важливих делегацій або комфортного трансферу в інше місто. Водій знає місто ідеально і обере маршрут без заторів.</div>

<div class='editor_title'>Доставка автомобіля по Харкову</div>
<div class='editor_text'>Безкоштовно: Центральні райони (Шевченківський, Київський), проспект Науки, район Ботанічного саду, парк Горького.<br/>Платна подача: Спальні райони (Салтівка, Олексіївка, ХТЗ, Рогань), а також передмістя (Пісочин, Дергачі, Високий). Вартість розраховується індивідуально залежно від кілометражу.</div>

<div class='editor_title'>Безпека руху в Харкові: На що звернути увагу</div>
<div class='editor_text'>Харків — місто широких доріг, які провокують на швидкість. Але безпека — понад усе.<ol><li><span class='text-strong'>Камери:</span> На проспекті Гагаріна, проспекті Науки та інших магістралях працюють камери автофіксації швидкості. Дотримуйтесь лімітів.</li><li><span class='text-strong'>Трамвайні колії:</span> Будьте особливо обережні на Моспросі (проспект Героїв Харкова) та в районі Кінного ринку. Рейки можуть бути слизькими, а плитка біля них часто має нерівності.</li><li><span class='text-strong'>Складні перехрестя:</span> Круговий рух на Гагаріна та розв'язки біля центру вимагають уважності. Слідкуйте за знаками пріоритету.</li><li><span class='text-strong'>Алкоголь:</span> Політика REIZ — нульова толерантність. Керування автомобілем у стані сп'яніння суворо заборонено, карається величезним штрафом та негайним розірванням договору без повернення коштів.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Харьков — это город масштабов, интеллекта и бешеного ритма. Это мегаполис, где расстояния имеют значение: от делового центра у Госпрома до индустриальных гигантов на окраинах можно ехать час. Сервис REIZ предлагает не просто прокат автомобилей, а инструмент вашей свободы. Мы понимаем специфику Харькова: здесь нужны авто с надежной подвеской для брусчатки на Сумской и динамичные двигатели для широких проспектов. Мы подаем идеально чистые, заправленные и технически безупречные машины в любую точку города.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Ваш тест-драйв реальности</div>
<div class='editor_text'>Не уверены, стоит ли брать авто надолго? Почасовой тариф — это лучший способ "примерить" автомобиль без лишних обязательств. Одних суток достаточно, чтобы понять всё:<ol><li><span class='text-strong'>Трамвайные пути:</span> Как авто преодолевает трамвайные пути на Героев Харькова или брусчатку на Пушкинской?</li><li><span class='text-strong'>Парковка:</span> Удобно ли вам парковаться в тесных дворах центра возле Оперного театра?</li><li><span class='text-strong'>Багажник:</span> Вместит ли багажник всё снаряжение для пикника в Саржином Яру?</li></ol>Это идеальный вариант для коротких дел: встретить деловых партнеров на вокзале, устроить романтический вечер или просто протестировать модель перед покупкой.</div>

<div class='editor_title'>Аренда авто на неделю: Свобода от метро и такси</div>
<div class='editor_text'>Недельный тариф в Харькове — это золотая середина между ценой и комфортом. Вы получаете один фиксированный тариф на 7 дней, который значительно выгоднее посуточной аренды. За неделю вы сможете совместить активную работу и полноценный отдых:<ol><li><span class='text-strong'>В будни:</span> Успевайте на встречи от "Научной" до "Спортивной" без ожидания такси в час пик.</li><li><span class='text-strong'>На уик-энд:</span> Отправляйтесь за город! Посетите Фельдман Экопарк, прогуляйтесь по поющим террасам в Городнем или поезжайте во дворец в Шаровке.</li></ol>Формат "Неделя" дает время привыкнуть к габаритам авто и насладиться поездкой без спешки.</div>

<div class='editor_title'>Месячная аренда (Тариф "Бизнес")</div>
<div class='editor_text'>Специальное предложение для тех, кто приехал в Харьков надолго: IT-специалистов, менеджеров проектов или тех, кто временно остался без собственного "железного коня".<ol><li><span class='text-strong'>Экономия:</span> Стоимость суток аренды снижается до минимума.</li><li><span class='text-strong'>Предсказуемость:</span> Один платеж раз в 30 дней.</li><li><span class='text-strong'>Мобильность:</span> Вы не привязаны к городу. Нужно поехать в Киев, Днепр или Полтаву? Садитесь и езжайте.</li><li><span class='text-strong'>Гибкость:</span> Если ваши планы изменятся (например, приедет семья и понадобится больше места), мы заменим седан на кроссовер или минивэн.</li></ol></div>

<div class='editor_title'>Долгосрочная аренда (Подписка на авто)</div>
<div class='editor_text'>Решение для бизнеса и рациональных людей. Аренда от 3 месяцев до года и более. Вы получаете все преимущества собственного автомобиля, но избавляетесь от головной боли владельца:<ol><li><span class='text-strong'>Технический сервис:</span> Мы сами следим за заменой масла и фильтров.</li><li><span class='text-strong'>Шины:</span> Сезонная замена и хранение резины — это наша забота.</li><li><span class='text-strong'>Страховка:</span> Полное КАСКО и ОСАГО уже включены в стоимость. Вы просто платите фиксированную сумму ежемесячно и пользуетесь авто.</li></ol></div>

<div class='editor_title'>Эконом-класс: Практичность от $20/сутки</div>
<div class='editor_text'>Нужна надежная машина без переплат? Наш эконом-класс — это бестселлеры городских дорог. Это современные иномарки, которые потребляют минимум топлива, имеют кондиционеры и аудиосистемы. Их главное преимущество в Харькове — компактность. Вы легко найдете место для парковки даже в перегруженном центре у площади Свободы или рынка Барабашово.</div>

<div class='editor_title'>Почему харьковчане и гости города выбирают REIZ</div>
<div class='editor_text'><ul><li>Локация: Мы встретим вас в зале прилета аэропорта (HRK), на перроне Ж/Д вокзала "Харьков-Пассажирский" или подвезем авто прямо под подъезд.</li><li>Скорость: От звонка до получения ключей — минимум времени. Документы оформляем за 15 минут.</li><li>Прозрачность: Никаких скрытых "сервисных сборов". Вы платите именно ту цену, которую видите на сайте.</li><li>Состояние авто: Наши машины проходят мойку и химчистку перед каждой выдачей. Техническое состояние проверяется по чек-листу.</li><li>Поддержка 24/7: Мы всегда на связи — на украинском, русском, английском или иврите.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Мы делаем прокат доступным. Для многих моделей доступна опция аренды с уменьшенным залогом (50%) или вообще без депозита (при условии оформления дополнительного страхования Super CDW). Уточняйте детали у менеджера при бронировании.</div>

<div class='editor_title'>Услуги водителя и VIP-трансфер</div>
<div class='editor_text'>Хотите отдохнуть в дороге или произвести впечатление? Закажите авто бизнес или премиум-класса с профессиональным водителем. Идеально для свадеб, встречи важных делегаций или комфортного трансфера в другой город. Водитель знает город идеально и выберет маршрут без пробок.</div>

<div class='editor_title'>Доставка автомобиля по Харькову</div>
<div class='editor_text'>Бесплатно: Центральные районы (Шевченковский, Киевский), проспект Науки, район Ботанического сада, парк Горького.<br/>Платная подача: Спальные районы (Салтовка, Алексеевка, ХТЗ, Рогань), а также пригород (Песочин, Дергачи, Высокий). Стоимость рассчитывается индивидуально в зависимости от километража.</div>

<div class='editor_title'>Безопасность движения в Харькове: На что обратить внимание</div>
<div class='editor_text'>Харьков — город широких дорог, которые провоцируют на скорость. Но безопасность — превыше всего.<ol><li><span class='text-strong'>Камеры:</span> На проспекте Гагарина, проспекте Науки и других магистралях работают камеры автофиксации скорости. Соблюдайте лимиты.</li><li><span class='text-strong'>Трамвайные пути:</span> Будьте особенно осторожны на Московском (проспект Героев Харькова) и в районе Конного рынка. Рельсы могут быть скользкими, а плитка возле них часто имеет неровности.</li><li><span class='text-strong'>Сложные перекрестки:</span> Круговое движение на Гагарина и развязки возле центра требуют внимательности. Следите за знаками приоритета.</li><li><span class='text-strong'>Алкоголь:</span> Политика REIZ — нулевая толерантность. Управление автомобилем в состоянии опьянения строго запрещено, карается огромным штрафом и немедленным расторжением договора без возврата средств.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Kharkiv is a city of scale, intelligence, and a frantic rhythm. It is a metropolis where distances matter: driving from the business center near Gosprom to the industrial giants on the outskirts can take an hour. REIZ service offers not just car rental, but a tool for your freedom. We understand the specifics of Kharkiv: you need cars with reliable suspension for the cobblestones on Sumska Street and dynamic engines for wide avenues. We deliver perfectly clean, refueled, and technically flawless cars anywhere in the city.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: Your Real-World Test Drive</div>
<div class='editor_text'>Not sure if you should rent a car for a long time? The hourly rate is the best way to "try on" a car without unnecessary commitments. One day is enough to understand everything:<ol><li><span class='text-strong'>Tram Tracks:</span> How does the car overcome tram tracks on Heroiv Kharkova Avenue or cobblestones on Pushkinska Street?</li><li><span class='text-strong'>Parking:</span> Is it convenient for you to park in the cramped courtyards of the center near the Opera House?</li><li><span class='text-strong'>Trunk:</span> Will the trunk fit all the equipment for a picnic in Sarzhyn Yar?</li></ol>This is an ideal option for short tasks: meeting business partners at the train station, arranging a romantic evening, or simply testing a model before buying.</div>

<div class='editor_title'>Weekly Car Rental: Freedom from Metro and Taxi</div>
<div class='editor_text'>The weekly rate in Kharkiv is the golden mean between price and comfort. You get one fixed rate for 7 days, which is much more profitable than daily rental. In a week, you can combine active work and proper rest:<ol><li><span class='text-strong'>On weekdays:</span> Make it to meetings from "Naukova" to "Sportyvna" metro stations without waiting for a taxi during rush hour.</li><li><span class='text-strong'>On the weekend:</span> Head out of town! Visit Feldman Ecopark, walk along the Singing Terraces in Horodnie, or drive to the palace in Sharivka.</li></ol>The "Week" format gives time to get used to the dimensions of the car and enjoy the trip without haste.</div>

<div class='editor_title'>Monthly Rental ("Business" Tariff)</div>
<div class='editor_text'>A special offer for those who have come to Kharkiv for a long time: IT specialists, project managers, or those who are temporarily without their own "iron horse".<ol><li><span class='text-strong'>Savings:</span> The cost of a rental day is reduced to a minimum.</li><li><span class='text-strong'>Predictability:</span> One payment once every 30 days.</li><li><span class='text-strong'>Mobility:</span> You are not tied to the city. Need to go to Kyiv, Dnipro, or Poltava? Just get in and drive.</li><li><span class='text-strong'>Flexibility:</span> If your plans change (for example, your family arrives and you need more space), we will replace the sedan with a crossover or minivan.</li></ol></div>

<div class='editor_title'>Long-Term Rental (Car Subscription)</div>
<div class='editor_text'>A solution for business and rational people. Rental from 3 months to a year or more. You get all the benefits of your own car but get rid of the owner's headache:<ol><li><span class='text-strong'>Technical Service:</span> We monitor oil and filter changes ourselves.</li><li><span class='text-strong'>Tires:</span> Seasonal replacement and storage of tires is our concern.</li><li><span class='text-strong'>Insurance:</span> Full CASCO and MTPL are already included in the price. You simply pay a fixed amount monthly and use the car.</li></ol></div>

<div class='editor_title'>Economy Class: Practicality from $20/day</div>
<div class='editor_text'>Need a reliable car without overpaying? Our economy class consists of city road bestsellers. These are modern foreign cars that consume minimum fuel, have air conditioning and audio systems. Their main advantage in Kharkiv is compactness. You will easily find a parking space even in the overloaded center near Freedom Square or Barabashovo market.</div>

<div class='editor_title'>Why Kharkiv Citizens and Guests Choose REIZ</div>
<div class='editor_text'><ul><li>Location: We will meet you in the arrival hall of the Airport (HRK), on the platform of "Kharkiv-Pasazhyrskyi" Railway Station, or drive the car right to your doorstep.</li><li>Speed: From the call to receiving the keys — minimum time. We process documents in 15 minutes.</li><li>Transparency: No hidden "service fees". You pay exactly the price you see on the website.</li><li>Car Condition: Our cars undergo washing and dry cleaning before every delivery. The technical condition is checked by a checklist.</li><li>24/7 Support: We are always in touch — in Ukrainian, Russian, English, or Hebrew.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>We make rental accessible. For many models, a reduced deposit option (50%) or no deposit at all (subject to purchasing additional Super CDW insurance) is available. Check details with the manager when booking.</div>

<div class='editor_title'>Chauffeur Services and VIP Transfer</div>
<div class='editor_text'>Want to rest on the road or make an impression? Order a business or premium class car with a professional driver. Ideal for weddings, meeting important delegations, or a comfortable transfer to another city. The driver knows the city perfectly and will choose a route without traffic jams.</div>

<div class='editor_title'>Car Delivery in Kharkiv</div>
<div class='editor_text'>Free: Central districts (Shevchenkivskyi, Kyivskyi), Nauky Avenue, Botanical Garden area, Gorky Park.<br/>Paid Delivery: Residential districts (Saltivka, Oleksiivka, KHTZ, Rohan), as well as suburbs (Pisochyn, Derhachi, Vysokyi). The cost is calculated individually depending on the mileage.</div>

<div class='editor_title'>Traffic Safety in Kharkiv: What to Look Out For</div>
<div class='editor_text'>Kharkiv is a city of wide roads that provoke speed. But safety is paramount.<ol><li><span class='text-strong'>Cameras:</span> Speed cameras operate on Haharyna Avenue, Nauky Avenue, and other highways. Observe the limits.</li><li><span class='text-strong'>Tram Tracks:</span> Be especially careful on Moskovskyi (Heroiv Kharkova Avenue) and in the Kinnyi Market area. The rails can be slippery, and the tiles near them often have irregularities.</li><li><span class='text-strong'>Complex Intersections:</span> Roundabouts on Haharyna and interchanges near the center require attention. Watch the priority signs.</li><li><span class='text-strong'>Alcohol:</span> REIZ policy is zero tolerance. Driving under the influence is strictly prohibited, punished by a huge fine and immediate termination of the contract without a refund.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateZaporizhzhiaEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Запоріжжя — це місто-гігант, де відстані диктують свої правила. Проїхати від Південного мікрорайону до греблі ДніпроГЕС — це вже маленька подорож. Сервіс REIZ пропонує прокат автомобілів, що дає вам незалежність від громадського транспорту та складного графіку маршруток. Чи ви інженер, що приїхав на завод, чи турист, який хоче побачити колиску козацтва — у нас є ідеальне авто для ваших завдань. Ми гарантуємо: чистий салон, повний бак та технічну справність кожного автомобіля.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Тест-драйв легендарних маршрутів</div>
<div class='editor_text'>Сумніваєтесь, чи зручно вам буде за кермом конкретної моделі? Візьміть авто на добу. Цього часу вистачить, щоб відчути ритм міста:<ol><li><span class='text-strong'>Проспект:</span> Проїдьтеся проспектом Соборним — однією з найдовших вулиць Європи.</li><li><span class='text-strong'>Мости:</span> Перевірте, як авто поводиться у тягнучці на греблі ДніпроГЕС або на нових мостах.</li><li><span class='text-strong'>Багажник:</span> Оцініть місткість багажника біля супермаркетів у центрі міста.</li></ol>Це найкращий спосіб переконатися, що машина підходить вам за габаритами та комфортом.</div>

<div class='editor_title'>Тижнева оренда: Робота та вікенд на природі</div>
<div class='editor_text'>Тижневий тариф у Запоріжжі — це ваш квиток у світ без обмежень. Один фіксований платіж за 7 днів, і ви забуваєте про виклик таксі.<ol><li><span class='text-strong'>Для справ:</span> Ви легко встигнете на ділові зустрічі в Вознесенівському районі та на виробництво на "Павло-Кічкас".</li><li><span class='text-strong'>Для душі:</span> На вихідних обов'язково поїдьте на острів Хортиця. Власним авто ви зможете заїхати вглиб заповідника, побачити Скіфський стан та кінний театр, куди важко дістатися пішки. Або вирушайте до "Акведукту" чи на узбережжя Дніпра на пікнік.</li></ol></div>

<div class='editor_title'>Оренда на місяць (Тариф "Бізнес")</div>
<div class='editor_text'>Оптимальне рішення для підрядників, відряджених спеціалістів та тих, хто тимчасово без власного авто. Ми пропонуємо спеціальну ціну (значно нижчу за добову) та повну свободу пересування. Запоріжжя розташоване зручно: всього година їзди до Дніпра. Ви можете вільно користуватися авто для міжміських поїздок. Якщо ваші задачі зміняться, ми оперативно замінимо компактне авто на престижний бізнес-клас для зустрічі делегації.</div>

<div class='editor_title'>Довгострокова оренда (від 3 місяців)</div>
<div class='editor_text'>Навіщо купувати авто для проєкту, який триватиме пів року? Оренда від REIZ — це вигідна альтернатива. Ви отримуєте персональний транспорт, але не маєте клопоту з його обслуговуванням.<ol><li><span class='text-strong'>Страховка:</span> КАСКО/ОСЦПВ — включена.</li><li><span class='text-strong'>ТО:</span> ТО та заміна мастил — наш клопіт.</li><li><span class='text-strong'>Гума:</span> Зимова/літня гума — ми перевзуємо авто вчасно.</li></ol>Це ідеально для корпоративних клієнтів, які цінують прогнозованість витрат.</div>

<div class='editor_title'>Економ-клас: Розумний вибір від $20</div>
<div class='editor_text'>Практичність — риса запоріжців. Наші авто економ-класу — це надійні "робочі конячки" з кондиціонерами та економними двигунами. Вони ідеальні для міського трафіку, легко паркуються біля ринків та офісних центрів і дозволяють суттєво економити на пальному під час поїздок довгим проспектом.</div>

<div class='editor_title'>Чому Запоріжжя обирає REIZ</div>
<div class='editor_text'><ul><li>Зручність: Ми зустрінемо вас на пероні залізничного вокзалу "Запоріжжя-1" або доставимо авто за вказаною адресою.</li><li>Швидкість: Від підписання договору до старту двигуна — 15 хвилин.</li><li>Чесність: Жодних прихованих комісій. Паливна політика "повний-повний" (отримали з повним баком — повернули так само).</li><li>Сервіс: Підтримка клієнтів 24/7. Ми допоможемо, якщо проб'єте колесо або у вас виникнуть запитання щодо маршруту.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Ми йдемо назустріч клієнтам. Для багатьох моделей доступна послуга оренди зі зниженим депозитом або без застави (за умови оформлення додаткового страхування). Це спрощує процедуру та знижує фінансове навантаження на старті.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Потрібно зустріти важливих гостей або ви просто хочете відпочити під час поїздки? Замовте авто з професійним водієм. Ми забезпечимо комфортний трансфер у готель, аеропорт (у сусідні міста) або на ділову вечерю.</div>

<div class='editor_title'>Доставка авто по місту</div>
<div class='editor_text'>Безкоштовно: Проспект Соборний, район площі Фестивальної, бульвар Шевченка, район Вокзалу "Запоріжжя-1".<br/>Платна подача: Хортицький район (Бабурка), Правий берег (Осипенківський, Бородінський), Шевченківський район та передмістя.</div>

<div class='editor_title'>Безпека руху в Запоріжжі</div>
<div class='editor_text'>Запоріжжя має свою дорожню специфіку, яку варто врахувати:<ol><li><span class='text-strong'>Мости та Гребля:</span> Це "пляшкові горлечка" міста. У години пік тут можливі затори. Плануйте час із запасом, якщо їдете з берега на берег.</li><li><span class='text-strong'>Проспект:</span> Широка дорога спокушає на швидкість, але камери автофіксації працюють. Дотримуйтесь правил.</li><li><span class='text-strong'>Кільцеві розв'язки:</span> Будьте уважні на колі біля Дубового Гаю та на острові Хортиця.</li><li><span class='text-strong'>Алкоголь:</span> Політика REIZ незмінна — нульова толерантність. Керування напідпитку суворо заборонено.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Запорожье — это город-гигант, где расстояния диктуют свои правила. Проехать от Южного микрорайона до плотины ДнепроГЭС — это уже маленькое путешествие. Сервис REIZ предлагает прокат автомобилей, который дает вам независимость от общественного транспорта и сложного графика маршруток. Будь вы инженер, приехавший на завод, или турист, желающий увидеть колыбель казачества — у нас есть идеальное авто для ваших задач. Мы гарантируем: чистый салон, полный бак и техническую исправность каждого автомобиля.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Тест-драйв легендарных маршрутов</div>
<div class='editor_text'>Сомневаетесь, удобно ли вам будет за рулем конкретной модели? Возьмите авто на сутки. Этого времени хватит, чтобы почувствовать ритм города:<ol><li><span class='text-strong'>Проспект:</span> Проедьтесь по проспекту Соборному — одной из самых длинных улиц Европы.</li><li><span class='text-strong'>Мосты:</span> Проверьте, как авто ведет себя в тянучке на плотине ДнепроГЭС или на новых мостах.</li><li><span class='text-strong'>Багажник:</span> Оцените вместительность багажника возле супермаркетов в центре города.</li></ol>Это лучший способ убедиться, что машина подходит вам по габаритам и комфорту.</div>

<div class='editor_title'>Недельная аренда: Работа и уик-энд на природе</div>
<div class='editor_text'>Недельный тариф в Запорожье — это ваш билет в мир без ограничений. Один фиксированный платеж за 7 дней, и вы забываете о вызове такси.<ol><li><span class='text-strong'>Для дел:</span> Вы легко успеете на деловые встречи в Вознесеновском районе и на производство на "Павло-Кичкас".</li><li><span class='text-strong'>Для души:</span> На выходных обязательно съездите на остров Хортица. На собственном авто вы сможете заехать вглубь заповедника, увидеть Скифский стан и конный театр, куда сложно добраться пешком.</li></ol></div>

<div class='editor_title'>Аренда на месяц (Тариф "Бизнес")</div>
<div class='editor_text'>Оптимальное решение для подрядчиков, командированных специалистов и тех, кто временно без собственного авто. Мы предлагаем специальную цену (значительно ниже суточной) и полную свободу передвижения. Запорожье расположено удобно: всего час езды до Днепра. Вы можете свободно пользоваться авто для междугородних поездок. Если ваши задачи изменятся, мы оперативно заменим компактное авто на престижный бизнес-класс для встречи делегации.</div>

<div class='editor_title'>Долгосрочная аренда (от 3 месяцев)</div>
<div class='editor_text'>Зачем покупать авто для проекта, который продлится полгода? Аренда от REIZ — это выгодная альтернатива. Вы получаете персональный транспорт, но не имеете хлопот с его обслуживанием.<ol><li><span class='text-strong'>Страховка:</span> КАСКО/ОСАГО — включена.</li><li><span class='text-strong'>ТО:</span> ТО и замена масел — наша забота.</li><li><span class='text-strong'>Шины:</span> Зимняя/летняя резина — мы переобуем авто вовремя.</li></ol>Это идеально для корпоративных клиентов, которые ценят прогнозируемость расходов.</div>

<div class='editor_title'>Эконом-класс: Умный выбор от $20</div>
<div class='editor_text'>Практичность — черта запорожцев. Наши авто эконом-класса — это надежные "рабочие лошадки" с кондиционерами и экономными двигателями. Они идеальны для городского трафика, легко паркуются возле рынков и офисных центров и позволяют существенно экономить на топливе во время поездок по длинному проспекту.</div>

<div class='editor_title'>Почему Запорожье выбирает REIZ</div>
<div class='editor_text'><ul><li>Удобство: Мы встретим вас на перроне ж/д вокзала "Запорожье-1" или доставим авто по указанному адресу.</li><li>Скорость: От подписания договора до старта двигателя — 15 минут.</li><li>Честность: Никаких скрытых комиссий. Топливная политика "полный-полный".</li><li>Сервис: Поддержка клиентов 24/7. Мы поможем в любой дорожной ситуации.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Мы идем навстречу клиентам. Для многих моделей доступна услуга аренды со сниженным депозитом или без залога (при условии оформления дополнительного страхования). Это упрощает процедуру и снижает финансовую нагрузку на старте.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Нужно встретить важных гостей или вы просто хотите отдохнуть во время поездки? Закажите авто с профессиональным водителем. Мы обеспечим комфортный трансфер в отель или на деловой ужин.</div>

<div class='editor_title'>Доставка авто по городу</div>
<div class='editor_text'>Бесплатно: Проспект Соборный, район площади Фестивальной, бульвар Шевченко, район Вокзала "Запорожье-1".<br/>Платная подача: Хортицкий район (Бабурка), Правый берег (Осипенковский, Бородинский), Шевченковский район и пригород.</div>

<div class='editor_title'>Безопасность движения в Запорожье</div>
<div class='editor_text'>Запорожье имеет свою дорожную специфику:<ol><li><span class='text-strong'>Мосты и Плотина:</span> Это "бутылочные горлышки" города. В часы пик здесь возможны пробки. Планируйте время с запасом, если едете с берега на берег.</li><li><span class='text-strong'>Проспект:</span> Широкая дорога искушает на скорость, но камеры автофиксации работают. Соблюдайте правила.</li><li><span class='text-strong'>Кольцевые развязки:</span> Будьте внимательны на коле возле "Дубовой Рощи" и на острове Хортица.</li><li><span class='text-strong'>Алкоголь:</span> Политика REIZ неизменна — нулевая толерантность. Управление в нетрезвом виде строго запрещено.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Zaporizhzhia is a giant city where distances dictate their own rules. Driving from the Pivdennyi district to the Dnipro HES dam is a small journey in itself. REIZ service offers car rental that gives you independence from public transport and complex bus schedules. Whether you are an engineer visiting a factory or a tourist wanting to see the cradle of the Cossacks, we have the perfect car for your tasks. We guarantee: a clean interior, a full tank, and technical serviceability of every car.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: Test Drive of Legendary Routes</div>
<div class='editor_text'>Doubt if you will be comfortable driving a specific model? Take the car for a day. This time is enough to feel the rhythm of the city:<ol><li><span class='text-strong'>Avenue:</span> Drive along Sobornyi Avenue — one of the longest streets in Europe.</li><li><span class='text-strong'>Bridges:</span> Check how the car behaves in traffic on the Dnipro HES dam or on the new bridges.</li><li><span class='text-strong'>Trunk:</span> Evaluate the trunk capacity near supermarkets in the city center.</li></ol>This is the best way to ensure the car suits your size and comfort needs.</div>

<div class='editor_title'>Weekly Rental: Work and Weekend in Nature</div>
<div class='editor_text'>The weekly rate in Zaporizhzhia is your ticket to a world without limits. One fixed payment for 7 days, and you forget about calling a taxi.<ol><li><span class='text-strong'>For Business:</span> You will easily make it to business meetings in the Voznesenivskyi district and production sites in Pavlo-Kichkas.</li><li><span class='text-strong'>For Leisure:</span> On the weekend, be sure to visit Khortytsia Island. With your own car, you can drive deep into the reserve, see the Scythian Camp and the Horse Theater, which are hard to reach on foot. Or head to the "Aqueduct" or to the banks of the Dnipro for a picnic.</li></ol></div>

<div class='editor_title'>Monthly Rental ("Business" Tariff)</div>
<div class='editor_text'>The optimal solution for contractors, seconded specialists, and those temporarily without their own car. We offer a special price (significantly lower than the daily rate) and complete freedom of movement. Zaporizhzhia is conveniently located: just an hour's drive to Dnipro. You can freely use the car for intercity trips. If your tasks change, we will promptly replace a compact car with a prestigious business class for meeting a delegation.</div>

<div class='editor_title'>Long-Term Rental (from 3 months)</div>
<div class='editor_text'>Why buy a car for a project that will last six months? Rental from REIZ is a profitable alternative. You get personal transport but have no hassle with its maintenance.<ol><li><span class='text-strong'>Insurance:</span> CASCO/MTPL — included.</li><li><span class='text-strong'>Maintenance:</span> Maintenance and oil changes — our concern.</li><li><span class='text-strong'>Tires:</span> Winter/summer tires — we change tires on time.</li></ol>This is ideal for corporate clients who value cost predictability.</div>

<div class='editor_title'>Economy Class: Smart Choice from $20</div>
<div class='editor_text'>Practicality is a trait of Zaporizhzhia locals. Our economy class cars are reliable "workhorses" with air conditioning and economical engines. They are perfect for city traffic, easily park near markets and office centers, and allow significant savings on fuel during trips along the long avenue.</div>

<div class='editor_title'>Why Zaporizhzhia Chooses REIZ</div>
<div class='editor_text'><ul><li>Convenience: We will meet you on the platform of "Zaporizhzhia-1" Railway Station or deliver the car to the specified address.</li><li>Speed: From signing the contract to starting the engine — 15 minutes.</li><li>Honesty: No hidden fees. "Full-to-full" fuel policy.</li><li>Service: 24/7 customer support. We will help if you get a flat tire or have questions about the route.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>We meet clients halfway. For many models, a reduced deposit or no deposit rental service is available (subject to additional insurance). This simplifies the procedure and reduces the financial burden at the start.</div>

<div class='editor_title'>Chauffeur Services</div>
<div class='editor_text'>Need to meet important guests or just want to relax during the trip? Order a car with a professional driver. We will ensure a comfortable transfer to the hotel, airport (in neighboring cities), or a business dinner.</div>

<div class='editor_title'>Car Delivery in the City</div>
<div class='editor_text'>Free: Sobornyi Avenue, Festivalna Square area, Shevchenka Boulevard, "Zaporizhzhia-1" Station area.<br/>Paid Delivery: Khortytskyi district (Baburka), Right Bank (Osypenkivskyi, Borodinskyi), Shevchenkivskyi district, and suburbs.</div>

<div class='editor_title'>Traffic Safety in Zaporizhzhia</div>
<div class='editor_text'>Zaporizhzhia has its own road specifics worth considering:<ol><li><span class='text-strong'>Bridges and Dam:</span> These are the city's "bottlenecks". Traffic jams are possible here during rush hours. Plan your time with a margin if crossing from bank to bank.</li><li><span class='text-strong'>Avenue:</span> The wide road tempts to speed, but speed cameras are working. Observe the rules.</li><li><span class='text-strong'>Roundabouts:</span> Be careful at the circle near "Dubovyi Hai" and on Khortytsia Island.</li><li><span class='text-strong'>Alcohol:</span> REIZ policy remains unchanged — zero tolerance. Drunk driving is strictly prohibited.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateBoryspilEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Бориспіль — це місто, де починається Україна для тисяч мандрівників. Головна артерія тут — це Міжнародний аеропорт та швидкісна магістраль М-03. Сервіс REIZ у Борисполі створений, щоб ви не залежали від розкладу автобусів SkyBus чи високих тарифів таксистів у зоні прильоту. Ми пропонуємо концепцію "Літак – Автомобіль": ви приземляєтесь, отримуєте багаж і вже за 15 хвилин сидите за кермом комфортного авто. Ми подаємо машини до терміналів D та F, а також до готелів біля аеропорту, щоб ваш старт був максимально плавним.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Ідеально для зустрічі та трансферу</div>
<div class='editor_text'>Вам потрібно зустріти бізнес-партнерів чи родичів, але власне авто в ремонті? Або у вас довга пересадка між рейсами? Погодинна оренда — це ваше рішення.<ol><li><span class='text-strong'>Комфорт:</span> Замість очікування на вулиці, ви чекаєте в клімат-контролі власного авто.</li><li><span class='text-strong'>Тест-драйв:</span> Спробуйте авто на ідеальній трасі "Бориспіль – Київ". Це найкращий полігон, щоб перевірити динаміку, шумоізоляцію та роботу круїз-контролю.</li><li><span class='text-strong'>Місткість:</span> Перевірте, чи влізуть усі валізи в багажник, перш ніж бронювати авто на довгу подорож.</li></ol></div>

<div class='editor_title'>Тижневий тариф: Старт великої подорожі</div>
<div class='editor_text'>Якщо ви прилетіли в Україну у відпустку або у справах на тиждень, оренда авто прямо в Борисполі економить вам купу часу. Вам не треба їхати в Київ, щоб взяти машину. Оформлюйте прокат на місці і вирушайте за власним маршрутом:<ol><li><span class='text-strong'>Переяслав:</span> Відвідайте музеї Переяслава (всього 40 хв їзди).</li><li><span class='text-strong'>Канів:</span> Поїдьте на Тарасову гору в Каневі.</li><li><span class='text-strong'>Далекі маршрути:</span> Або одразу рушайте в дорогу до Одеси, Львова чи Карпат, оминаючи столичні затори.</li></ol>Тижневий тариф дає фіксовану ціну і повну свободу дій.</div>

<div class='editor_title'>Оренда на місяць (Тариф "Довгий візит")</div>
<div class='editor_text'>Вигідна пропозиція для експатів, які приїхали відвідати родину, або спеціалістів, задіяних у логістичних проєктах (яких у Борисполі багато). Тариф "Місяць" — це:<ol><li><span class='text-strong'>Економія:</span> Вартість доби значно нижча, ніж при короткій оренді.</li><li><span class='text-strong'>Стабільність:</span> Один платіж раз на 30 днів.</li><li><span class='text-strong'>Гнучкість:</span> Потрібно виїхати за кордон? Ми підготуємо документи. Потрібно змінити авто на інший клас? Зробимо це швидко.</li></ol>Це ваш особистий транспорт без необхідності купувати та обслуговувати машину.</div>

<div class='editor_title'>Довгострокова оренда (від 3 місяців)</div>
<div class='editor_text'>Для бізнесу, що працює в сфері авіації чи логістики, а також для тих, хто будує дім у передмісті Києва. Довгострокова оренда від REIZ знімає з вас усі технічні питання. Ми слідкуємо за страховкою, ТО та гумою. Ваша задача — лише заправляти авто. Це набагато зручніше, ніж таксі, і дешевше, ніж утримання власного автопарку компанії.</div>

<div class='editor_title'>Економ-клас: Трансфер за ціною таксі</div>
<div class='editor_text'>Якщо ваша мета — просто доїхати з точки А в точку Б або мати під рукою колеса для дрібних справ, обирайте наш економ-клас. Сучасні, компактні авто від $20 на добу. Вони споживають мінімум пального на трасі, легкі в керуванні і вміщують стандартний набір багажу.</div>

<div class='editor_title'>Переваги REIZ у Борисполі</div>
<div class='editor_text'><ul><li>Flight Tracking: Ми відстежуємо ваш рейс. Якщо літак затримається, наш менеджер дочекається вас, і це не коштуватиме вам додатково.</li><li>Meet &amp; Greet: Зустрічаємо з іменною табличкою в зоні прильоту Терміналу D.</li><li>Цілодобово: Рейси прибувають і вночі. Ми працюємо 24/7 (за попереднім бронюванням).</li><li>Чистота: Ви сідаєте в ідеально чисте авто, готове до дороги.</li><li>Навігація: Допоможемо налаштувати CarPlay/Android Auto, щоб ви одразу проклали маршрут.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Ми розуміємо, що після перельоту не хочеться думати про депозити. Для багатьох класів авто доступна опція оренди без застави (при купівлі повного захисту). Це спрощує процес і береже ваші нерви.</div>

<div class='editor_title'>Послуги водія (Трансфер)</div>
<div class='editor_text'>Втомлені після довгого перельоту? Не ризикуйте сідати за кермо. Замовте трансфер з професійним водієм від REIZ. Ми зустрінемо вас, допоможемо з багажем і з комфортом бізнес-класу доставимо в будь-який готель Києва або інше місто України.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: Територія аеропорту (KBP), готелі в радіусі 5 км, центр міста Бориспіль.<br/>За межі міста: Подача в Бровари, Київ або інші міста області розраховується індивідуально.</div>

<div class='editor_title'>Безпека руху: Специфіка траси</div>
<div class='editor_text'>Бориспільська траса — це найкраща дорога України, але вона вимагає уваги:<ol><li><span class='text-strong'>Швидкість:</span> Дозволена швидкість (у літній період) — 130 км/год. Тримайте дистанцію і не займайте ліву смугу без потреби.</li><li><span class='text-strong'>Втома:</span> Після перельоту реакція може бути сповільненою. Якщо відчуваєте втому, краще зупиніться на каву на одній із численних заправок.</li><li><span class='text-strong'>Туман:</span> Вранці та восени в низинах біля аеропорту часто буває густий туман. Використовуйте протитуманні фари.</li><li><span class='text-strong'>Алкоголь:</span> Нульова толерантність. Святкувати приліт треба без керма. Порушення — це негайне розірвання договору.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Борисполь — это город, где начинается Украина для тысяч путешественников. Главная артерия здесь — это Международный аэропорт и скоростная магистраль М-03. Сервис REIZ в Борисполе создан, чтобы вы не зависели от расписания автобусов SkyBus или высоких тарифов таксистов в зоне прилета. Мы предлагаем концепцию "Самолет – Автомобиль": вы приземляетесь, получаете багаж и уже через 15 минут сидите за рулем комфортного авто. Мы подаем машины к терминалам D и F, а также к отелям возле аэропорта, чтобы ваш старт был максимально плавным.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Идеально для встречи и трансфера</div>
<div class='editor_text'>Вам нужно встретить бизнес-партнеров или родственников, но свое авто в ремонте? Или у вас долгая пересадка между рейсами? Почасовая аренда — это ваше решение.<ol><li><span class='text-strong'>Комфорт:</span> Вместо ожидания на улице, вы ждете в климат-контроле собственного авто.</li><li><span class='text-strong'>Тест-драйв:</span> Попробуйте авто на идеальной трассе "Борисполь – Киев". Это лучший полигон, чтобы проверить динамику, шумоизоляцию и работу круиз-контроля.</li><li><span class='text-strong'>Вместимость:</span> Проверьте, влезут ли все чемоданы в багажник, прежде чем бронировать авто на долгое путешествие.</li></ol></div>

<div class='editor_title'>Недельный тариф: Старт большого путешествия</div>
<div class='editor_text'>Если вы прилетели в Украину в отпуск или по делам на неделю, аренда авто прямо в Борисполе экономит вам кучу времени. Вам не надо ехать в Киев, чтобы взять машину. Оформляйте прокат на месте и отправляйтесь по собственному маршруту:<ol><li><span class='text-strong'>Переяслав:</span> Посетите музеи Переяслава (всего 40 мин езды).</li><li><span class='text-strong'>Канев:</span> Поезжайте на Тарасову гору в Каневе.</li><li><span class='text-strong'>Дальние маршруты:</span> Или сразу отправляйтесь в дорогу в Одессу, Львов или Карпаты, минуя столичные пробки.</li></ol>Недельный тариф дает фиксированную цену и полную свободу действий.</div>

<div class='editor_title'>Аренда на месяц (Тариф "Долгий визит")</div>
<div class='editor_text'>Выгодное предложение для экспатов, приехавших навестить семью, или специалистов, задействованных в логистических проектах (которых в Борисполе много). Тариф "Месяц" — это:<ol><li><span class='text-strong'>Экономия:</span> Стоимость суток значительно ниже, чем при короткой аренде.</li><li><span class='text-strong'>Стабильность:</span> Один платеж раз в 30 дней.</li><li><span class='text-strong'>Гибкость:</span> Нужно выехать за границу? Мы подготовим документы. Нужно сменить авто на другой класс? Сделаем это быстро.</li></ol>Это ваш личный транспорт без необходимости покупать и обслуживать машину.</div>

<div class='editor_title'>Долгосрочная аренда (от 3 месяцев)</div>
<div class='editor_text'>Для бизнеса, работающего в сфере авиации или логистики, а также для тех, кто строит дом в пригороде Киева. Долгосрочная аренда от REIZ снимает с вас все технические вопросы. Мы следим за страховкой, ТО и резиной. Ваша задача — только заправлять авто. Это намного удобнее, чем такси, и дешевле, чем содержание собственного автопарка компании.</div>

<div class='editor_title'>Эконом-класс: Трансфер по цене такси</div>
<div class='editor_text'>Если ваша цель — просто доехать из точки А в точку Б или иметь под рукой колеса для мелких дел, выбирайте наш эконом-класс. Современные, компактные авто от $20 в сутки. Они потребляют минимум топлива на трассе, легки в управлении и вмещают стандартный набор багажа.</div>

<div class='editor_title'>Преимущества REIZ в Борисполе</div>
<div class='editor_text'><ul><li>Flight Tracking: Мы отслеживаем ваш рейс. Если самолет задержится, наш менеджер дождется вас, и это не будет стоить дополнительно.</li><li>Meet &amp; Greet: Встречаем с именной табличкой в зоне прилета Терминала D.</li><li>Круглосуточно: Рейсы прибывают и ночью. Мы работаем 24/7 (по предварительному бронированию).</li><li>Чистота: Вы садитесь в идеально чистое авто, готовое к дороге.</li><li>Навигация: Поможем настроить CarPlay/Android Auto, чтобы вы сразу проложили маршрут.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Мы понимаем, что после перелета не хочется думать о депозитах. Для многих классов авто доступна опция аренды без залога (при покупке полной защиты). Это упрощает процесс и бережет ваши нервы.</div>

<div class='editor_title'>Услуги водителя (Трансфер)</div>
<div class='editor_text'>Устали после долгого перелета? Не рискуйте садиться за руль. Закажите трансфер с профессиональным водителем от REIZ. Мы встретим вас, поможем с багажом и с комфортом бизнес-класса доставим в любой отель Киева или другой город Украины.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: Территория аэропорта (KBP), отели в радиусе 5 км, центр города Борисполь.<br/>За пределы города: Подача в Бровары, Киев или другие города области рассчитывается индивидуально.</div>

<div class='editor_title'>Безопасность движения: Специфика трассы</div>
<div class='editor_text'>Бориспольская трасса — это лучшая дорога Украины, но она требует внимания:<ol><li><span class='text-strong'>Скорость:</span> Разрешенная скорость (в летний период) — 130 км/ч. Держите дистанцию и не занимайте левую полосу без надобности.</li><li><span class='text-strong'>Усталость:</span> После перелета реакция может быть замедленной. Если чувствуете усталость, лучше остановитесь на кофе на одной из многочисленных заправок.</li><li><span class='text-strong'>Туман:</span> Утром и осенью в низинах возле аэропорта часто бывает густой туман. Используйте противотуманные фары.</li><li><span class='text-strong'>Алкоголь:</span> Нулевая толерантность. Праздновать прилет нужно без руля. Нарушение — это немедленное расторжение договора.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Boryspil is the city where Ukraine begins for thousands of travelers. The main artery here is the International Airport and the M-03 high-speed highway. The REIZ service in Boryspil is created so that you do not depend on the SkyBus schedule or high taxi rates in the arrival zone. We offer the "Plane – Car" concept: you land, pick up your luggage, and within 15 minutes you are sitting behind the wheel of a comfortable car. We deliver cars to Terminals D and F, as well as to hotels near the airport, to make your start as smooth as possible.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: Ideal for Meeting and Transfer</div>
<div class='editor_text'>Do you need to meet business partners or relatives, but your own car is being repaired? Or do you have a long layover between flights? Hourly rental is your solution.<ol><li><span class='text-strong'>Comfort:</span> Instead of waiting outside, you wait in the climate control of your own car.</li><li><span class='text-strong'>Test Drive:</span> Try the car on the perfect "Boryspil – Kyiv" highway. This is the best testing ground to check dynamics, noise insulation, and cruise control operation.</li><li><span class='text-strong'>Capacity:</span> Check if all suitcases fit in the trunk before booking a car for a long trip.</li></ol></div>

<div class='editor_title'>Weekly Rate: Start of a Big Journey</div>
<div class='editor_text'>If you flew to Ukraine for a vacation or business for a week, renting a car directly in Boryspil saves you a lot of time. You don't need to go to Kyiv to pick up a car. Arrange the rental on the spot and set off on your own route:<ol><li><span class='text-strong'>Pereiaslav:</span> Visit the museums of Pereiaslav (only 40 min drive).</li><li><span class='text-strong'>Kaniv:</span> Go to Taras Hill in Kaniv.</li><li><span class='text-strong'>Long routes:</span> Or head straight to Odesa, Lviv, or the Carpathians, bypassing the capital's traffic jams.</li></ol>The weekly rate gives a fixed price and complete freedom of action.</div>

<div class='editor_title'>Monthly Rental ("Long Visit" Tariff)</div>
<div class='editor_text'>A profitable offer for expats who have come to visit family, or specialists involved in logistics projects (of which there are many in Boryspil). The "Month" tariff means:<ol><li><span class='text-strong'>Savings:</span> The daily cost is significantly lower than with short-term rental.</li><li><span class='text-strong'>Stability:</span> One payment once every 30 days.</li><li><span class='text-strong'>Flexibility:</span> Need to go abroad? We will prepare the documents. Need to change the car to another class? We will do it quickly.</li></ol>This is your personal transport without the need to buy and maintain a car.</div>

<div class='editor_title'>Long-Term Rental (from 3 months)</div>
<div class='editor_text'>For businesses working in aviation or logistics, as well as for those building a house in the suburbs of Kyiv. Long-term rental from REIZ removes all technical issues from you. We monitor insurance, maintenance, and tires. Your task is only to refuel the car. This is much more convenient than a taxi and cheaper than maintaining the company's own fleet.</div>

<div class='editor_title'>Economy Class: Transfer for the Price of a Taxi</div>
<div class='editor_text'>If your goal is simply to get from point A to point B or have wheels at hand for small errands, choose our economy class. Modern, compact cars from $20 per day. They consume minimum fuel on the highway, are easy to drive, and accommodate a standard set of luggage.</div>

<div class='editor_title'>Advantages of REIZ in Boryspil</div>
<div class='editor_text'><ul><li>Flight Tracking: We track your flight. If the plane is delayed, our manager will wait for you, and it will not cost extra.</li><li>Meet &amp; Greet: We meet you with a name sign in the arrival zone of Terminal D.</li><li>24/7: Flights arrive at night too. We work 24/7 (by prior booking).</li><li>Cleanliness: You get into a perfectly clean car, ready for the road.</li><li>Navigation: We will help set up CarPlay/Android Auto so you can plot your route immediately.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>We understand that after a flight, you don't want to think about deposits. For many car classes, a no-deposit rental option is available (when purchasing full protection). This simplifies the process and saves your nerves.</div>

<div class='editor_title'>Chauffeur Services (Transfer)</div>
<div class='editor_text'>Tired after a long flight? Don't risk getting behind the wheel. Order a transfer with a professional driver from REIZ. We will meet you, help with luggage, and deliver you with business-class comfort to any hotel in Kyiv or another city in Ukraine.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: Airport territory (KBP), hotels within a 5 km radius, Boryspil city center.<br/>Outside the City: Delivery to Brovary, Kyiv, or other cities in the region is calculated individually.</div>

<div class='editor_title'>Traffic Safety: Highway Specifics</div>
<div class='editor_text'>The Boryspil highway is the best road in Ukraine, but it requires attention:<ol><li><span class='text-strong'>Speed:</span> The permitted speed (in summer) is 130 km/h. Keep your distance and do not occupy the left lane unnecessarily.</li><li><span class='text-strong'>Fatigue:</span> After a flight, reaction time may be slowed. If you feel tired, it is better to stop for coffee at one of the numerous gas stations.</li><li><span class='text-strong'>Fog:</span> In the morning and in autumn, thick fog often occurs in the lowlands near the airport. Use fog lights.</li><li><span class='text-strong'>Alcohol:</span> Zero tolerance. Celebrating arrival must be done without driving. Violation is immediate termination of the contract.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateBukovelEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Буковель — це не просто курорт, це центр тяжіння для активних людей. Але Карпати не обмежуються лише підйомниками. Водоспади Яремче, віадуки Ворохти та найвищі вершини — все це стає доступним лише з власним авто. Сервіс REIZ у Буковелі спеціалізується на прокаті автомобілів, готових до гірських викликів. У нашому флоті — надійні кросовери та позашляховики з повним приводом, які впевнено тримають дорогу і на засніженому перевалі, і на крутому підйомі до готелю.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний драйв: Тест гірськими дорогами</div>
<div class='editor_text'>Хочете спробувати, як поводить себе конкретний позашляховик у реальних умовах? Візьміть авто на добу. Це ідеальний тест-драйв:<ol><li><span class='text-strong'>Тяга:</span> Перевірте тягу двигуна на затяжних підйомах Яблуницького перевалу.</li><li><span class='text-strong'>Керованість:</span> Оцініть керованість на серпантині.</li><li><span class='text-strong'>Багажник:</span> Переконайтеся, що в багажник легко входять ваші лижі або сноуборди.</li></ol>Це також зручно, якщо ви хочете на один день з'їздити на екскурсію до Верховини чи Криворівні.</div>

<div class='editor_title'>Тижневий тариф: Ідеальна відпустка</div>
<div class='editor_text'>Тижнева оренда в Буковелі — це комфорт і незалежність від шатлів готелю. Ви самі вирішуєте, коли їхати на катання — до відкриття трас чи на вечірній сеанс.<ol><li><span class='text-strong'>Свобода вибору:</span> Сьогодні катаєтесь на Буковелі, завтра — їдете на Драгобрат (на спеціально підготовленому авто), а післязавтра — релаксуєте в чанах у Татарові.</li><li><span class='text-strong'>Економія:</span> Тижневий тариф значно вигідніший за щоденне замовлення таксі між селами Поляниця, Яблуниця та Яремче.</li></ol></div>

<div class='editor_title'>Оренда на місяць (Workation в горах)</div>
<div class='editor_text'>Все більше людей приїжджають в Карпати жити і працювати віддалено. Тариф "Місяць" створений саме для них. Це ваш персональний транспорт за ціною, нижчою за ринкову. Ви можете жити в затишному шале подалі від шуму центру, але завжди мати можливість швидко дістатися до супермаркету, коворкінгу чи ресторану. Потрібно поїхати у Львів чи Івано-Франківськ у справах? З авто від REIZ це питання двох годин комфортної їзди.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Для власників бізнесу в Буковелі, готельєрів або тих, хто будує тут нерухомість. Оренда від 3 місяців — це альтернатива купівлі службового авто. Ми беремо на себе найважливіше в горах — технічний стан.<ol><li><span class='text-strong'>Зимова підготовка:</span> Ми ставимо тільки якісну зимову гуму зі "скандинавським" протектором.</li><li><span class='text-strong'>Обслуговування:</span> Регулярна перевірка гальмівної системи та ходової частини, які в горах працюють під навантаженням.</li></ol>Ви просто користуєтесь надійним авто.</div>

<div class='editor_title'>Економ-клас: Бюджетно, але надійно</div>
<div class='editor_text'>Влітку або коли дороги ідеально розчищені, не обов'язково брати джип. Наші авто економ-класу — це чудовий спосіб заощадити. Компактні, маневрені, з помірним апетитом до пального. Вони чудово підходять для поїздок асфальтованими дорогами між курортними містечками.</div>

<div class='editor_title'>Переваги REIZ у Карпатах</div>
<div class='editor_text'><ul><li>Локація: Ми доставимо авто прямо до рецепції вашого готелю в Буковелі, Поляниці, Татарові чи Яремче. Також зустрічаємо в аеропорту/вокзалі Івано-Франківська.</li><li>Підготовка: Усі авто проходять посилений контроль. Ми перевіряємо рідини, світло та роботу обігрівача, щоб ви не мали сюрпризів на морозі.</li><li>Екіпірування: За запитом надаємо кріплення для лиж/бордів (автобокси) та ланцюги протиковзання (для екстремальних умов).</li><li>Прозорість: Жодних доплат за "складність рельєфу". Ціна фіксована.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Відпочинок має бути безтурботним. Для більшості моделей ми пропонуємо опцію оренди без застави (при купівлі повного страхування). Насолоджуйтесь горами, а ризики ми беремо на себе.</div>

<div class='editor_title'>Трансфер та водій</div>
<div class='editor_text'>Хочете розслабитися після лиж з келихом глінтвейну? Не сідайте за кермо. Замовте авто з водієм. Ми організуємо трансфер VIP-рівня з Івано-Франківська чи Львова, або просто відвеземо вас з ресторану в готель. Безпечно, комфортно і в теплі.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: В межах курорту Буковель (села Поляниця, паркінги біля витягів №1, №2, №7, №14).<br/>Платна подача: Яремче, Микуличин, Татарів, Ворохта, Яблуниця. Вартість залежить від відстані до нашого офісу.</div>

<div class='editor_title'>Безпека в горах: Пам'ятка водія</div>
<div class='editor_text'>Карпатські дороги вимагають поваги та навичок:<ol><li><span class='text-strong'>Гальмування двигуном:</span> На затяжних спусках використовуйте понижені передачі, щоб не перегріти гальма.</li><li><span class='text-strong'>Дистанція:</span> На слизькій дорозі гальмівний шлях збільшується в рази. Тримайте подвійну дистанцію.</li><li><span class='text-strong'>Повороти:</span> Знижуйте швидкість перед поворотом, а не в ньому. Уникайте різких рухів кермом.</li><li><span class='text-strong'>Алкоголь:</span> Гірська дорога не пробачає помилок. Політика REIZ — нульова толерантність до алкоголю.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Буковель — это не просто курорт, это центр притяжения для активных людей. Но Карпаты не ограничиваются только подъемниками. Водопады Яремче, виадуки Ворохты и самые высокие вершины — все это становится доступным только с личным авто. Сервис REIZ в Буковеле специализируется на прокате автомобилей, готовых к горным вызовам. В нашем флоте — надежные кроссоверы и внедорожники с полным приводом, которые уверенно держат дорогу и на заснеженном перевале, и на крутом подъеме к отелю.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой драйв: Тест на горных дорогах</div>
<div class='editor_text'>Хотите попробовать, как ведет себя конкретный внедорожник в реальных условиях? Возьмите авто на сутки. Это идеальный тест-драйв:<ol><li><span class='text-strong'>Тяга:</span> Проверьте тягу двигателя на затяжных подъемах Яблуницкого перевала.</li><li><span class='text-strong'>Управляемость:</span> Оцените управляемость на серпантине.</li><li><span class='text-strong'>Багажник:</span> Убедитесь, что в багажник легко входят ваши лыжи или сноуборды.</li></ol>Это также удобно, если вы хотите на один день съездить на экскурсию в Верховину или Криворовню.</div>

<div class='editor_title'>Недельный тариф: Идеальный отпуск</div>
<div class='editor_text'>Недельная аренда в Буковеле — это комфорт и независимость от шаттлов отеля. Вы сами решаете, когда ехать на катание — к открытию трасс или на вечерний сеанс.<ol><li><span class='text-strong'>Свобода выбора:</span> Сегодня катаетесь на Буковеле, завтра — едете на Драгобрат (на специально подготовленном авто), а послезавтра — релаксируете в чанах в Татарове.</li><li><span class='text-strong'>Экономия:</span> Недельный тариф значительно выгоднее ежедневного заказа такси между селами Поляница, Яблуница и Яремче.</li></ol></div>

<div class='editor_title'>Аренда на месяц (Workation в горах)</div>
<div class='editor_text'>Все больше людей приезжают в Карпаты жить и работать удаленно. Тариф "Месяц" создан именно для них. Это ваш персональный транспорт по цене ниже рыночной. Вы можете жить в уютном шале вдали от шума центра, но всегда иметь возможность быстро добраться до супермаркета, коворкинга или ресторана. Нужно поехать во Львов или Ивано-Франковск по делам? С авто от REIZ это вопрос двух часов комфортной езды.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Для владельцев бизнеса в Буковеле, отельеров или тех, кто строит здесь недвижимость. Аренда от 3 месяцев — это альтернатива покупке служебного авто. Мы берем на себя самое важное в горах — техническое состояние.<ol><li><span class='text-strong'>Зимняя подготовка:</span> Мы ставим только качественную зимнюю резину со "скандинавским" протектором.</li><li><span class='text-strong'>Обслуживание:</span> Регулярная проверка тормозной системы и ходовой части, которые в горах работают под нагрузкой.</li></ol>Вы просто пользуетесь надежным авто.</div>

<div class='editor_title'>Эконом-класс: Бюджетно, но надежно</div>
<div class='editor_text'>Летом или когда дороги идеально расчищены, не обязательно брать джип. Наши авто эконом-класса — это отличный способ сэкономить. Компактные, маневренные, с умеренным аппетитом к топливу. Они отлично подходят для поездок по асфальтированным дорогам между курортными городками.</div>

<div class='editor_title'>Преимущества REIZ в Карпатах</div>
<div class='editor_text'><ul><li>Локация: Мы доставим авто прямо к рецепции вашего отеля в Буковеле, Полянице, Татарове или Яремче. Также встречаем в аэропорту/вокзале Ивано-Франковска.</li><li>Подготовка: Все авто проходят усиленный контроль. Мы проверяем жидкости, свет и работу обогревателя, чтобы у вас не было сюрпризов на морозе.</li><li>Экипировка: По запросу предоставляем крепления для лыж/бордов (автобоксы) и цепи противоскольжения.</li><li>Прозрачность: Никаких доплат за "сложность рельефа". Цена фиксирована.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Отдых должен быть беззаботным. Для большинства моделей мы предлагаем опцию аренды без залога (при покупке полного страхования). Наслаждайтесь горами, а риски мы берем на себя.</div>

<div class='editor_title'>Трансфер и водитель</div>
<div class='editor_text'>Хотите расслабиться после лыж с бокалом глинтвейна? Не садитесь за руль. Закажите авто с водителем. Мы организуем трансфер VIP-уровня из Ивано-Франковска или Львова, или просто отвезем вас из ресторана в отель. Безопасно, комфортно и в тепле.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: В пределах курорта Буковель (село Поляница, парковки возле подъемников №1, №2, №7, №14).<br/>Платная подача: Яремче, Микуличин, Татаров, Ворохта, Яблуница. Стоимость зависит от расстояния до нашего офиса.</div>

<div class='editor_title'>Безопасность в горах: Памятка водителя</div>
<div class='editor_text'>Карпатские дороги требуют уважения и навыков:<ol><li><span class='text-strong'>Торможение двигателем:</span> На затяжных спусках используйте пониженные передачи, чтобы не перегреть тормоза.</li><li><span class='text-strong'>Дистанция:</span> На скользкой дороге тормозной путь увеличивается в разы. Держите двойную дистанцию.</li><li><span class='text-strong'>Повороты:</span> Снижайте скорость перед поворотом, а не в нем. Избегайте резких движений рулем.</li><li><span class='text-strong'>Алкоголь:</span> Горная дорога не прощает ошибок. Политика REIZ — нулевая толерантность к алкоголю.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Bukovel is not just a resort, it is a center of attraction for active people. But the Carpathians are not limited to ski lifts. Yaremche waterfalls, Vorokhta viaducts, and the highest peaks — all this becomes accessible only with a personal car. The REIZ service in Bukovel specializes in renting cars ready for mountain challenges. Our fleet includes reliable crossovers and SUVs with four-wheel drive (4x4), which confidently hold the road both on a snowy pass and on a steep climb to the hotel.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Drive: Test on Mountain Roads</div>
<div class='editor_text'>Want to try how a specific SUV behaves in real conditions? Take a car for a day. This is an ideal test drive:<ol><li><span class='text-strong'>Traction:</span> Check the engine traction on the long climbs of the Yablunytskyi Pass.</li><li><span class='text-strong'>Handling:</span> Evaluate the handling on the serpentine.</li><li><span class='text-strong'>Trunk:</span> Make sure your skis or snowboards fit easily in the trunk.</li></ol>It is also convenient if you want to go on a day trip to Verkhovyna or Kryvorivnia.</div>

<div class='editor_title'>Weekly Rate: The Ideal Vacation</div>
<div class='editor_text'>Weekly rental in Bukovel means comfort and independence from hotel shuttles. You decide when to go skiing — for the opening of the slopes or for the evening session.<ol><li><span class='text-strong'>Freedom of Choice:</span> Today you ski in Bukovel, tomorrow you drive to Drahobrat (in a specially prepared car), and the day after tomorrow you relax in the hot tubs in Tatariv.</li><li><span class='text-strong'>Savings:</span> The weekly rate is much more profitable than ordering a taxi daily between the villages of Polianytsia, Yablunytsia, and Yaremche.</li></ol></div>

<div class='editor_title'>Monthly Rental (Workation in the Mountains)</div>
<div class='editor_text'>More and more people come to the Carpathians to live and work remotely. The "Month" tariff is created just for them. This is your personal transport at a price lower than the market one. You can live in a cozy chalet away from the noise of the center, but always be able to quickly get to a supermarket, coworking space, or restaurant. Need to go to Lviv or Ivano-Frankivsk on business? With a car from REIZ, it's a matter of two hours of comfortable driving.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>For business owners in Bukovel, hoteliers, or those building real estate here. Rental from 3 months is an alternative to buying a company car. We take on the most important thing in the mountains — the technical condition.<ol><li><span class='text-strong'>Winter Preparation:</span> We install only high-quality winter tires with a "Nordic" tread.</li><li><span class='text-strong'>Maintenance:</span> Regular checks of the braking system and chassis, which work under load in the mountains.</li></ol>You simply use a reliable car.</div>

<div class='editor_title'>Economy Class: Budget but Reliable</div>
<div class='editor_text'>In summer or when the roads are perfectly cleared, it is not necessary to rent a Jeep. Our economy class cars are a great way to save money. Compact, maneuverable, with moderate fuel appetite. They are great for trips on asphalt roads between resort towns.</div>

<div class='editor_title'>Advantages of REIZ in the Carpathians</div>
<div class='editor_text'><ul><li>Location: We will deliver the car directly to the reception of your hotel in Bukovel, Polianytsia, Tatariv, or Yaremche. We also meet at the airport/train station of Ivano-Frankivsk.</li><li>Preparation: All cars undergo enhanced control. We check fluids, lights, and heater operation so you have no surprises in the frost.</li><li>Equipment: Upon request, we provide ski/board racks (roof boxes) and snow chains.</li><li>Transparency: No extra charges for "terrain complexity". The price is fixed.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>Vacation should be carefree. For most models, we offer a no-deposit rental option (when purchasing full insurance). Enjoy the mountains, and we will take the risks.</div>

<div class='editor_title'>Transfer and Chauffeur</div>
<div class='editor_text'>Want to relax after skiing with a glass of mulled wine? Do not get behind the wheel. Order a car with a driver. We will organize a VIP-level transfer from Ivano-Frankivsk or Lviv, or simply take you from a restaurant to the hotel. Safe, comfortable, and warm.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: Within the Bukovel resort (Polianytsia village, parking lots near lifts No. 1, 2, 7, 14).<br/>Paid Delivery: Yaremche, Mykulychyn, Tatariv, Vorokhta, Yablunytsia. The cost depends on the distance to our office.</div>

<div class='editor_title'>Safety in the Mountains: Driver's Memo</div>
<div class='editor_text'>Carpathian roads require respect and skills:<ol><li><span class='text-strong'>Engine Braking:</span> On long descents, use lower gears to avoid overheating the brakes.</li><li><span class='text-strong'>Distance:</span> On a slippery road, the braking distance increases significantly. Keep double the distance.</li><li><span class='text-strong'>Turns:</span> Reduce speed before the turn, not in it. Avoid sharp steering movements.</li><li><span class='text-strong'>Alcohol:</span> The mountain road does not forgive mistakes. REIZ policy is zero tolerance for alcohol.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateTernopilEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Тернопіль — це місто з особливою атмосферою, де бізнес поєднується з неспішними прогулянками набережною Ставу. Але за межами компактного центру починається справжня магія: замки, печери та духовні святині. Щоб побачити все це і не залежати від розкладу автобусів, сервіс REIZ пропонує прокат сучасних автомобілів. Ми розуміємо потреби міста: компактні авто для вузьких вуличок центру та надійні кросовери для подорожей областю.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Ваш персональний тест-драйв</div>
<div class='editor_text'>Не впевнені, чи підійде вам габаритна машина для тернопільських доріг? Візьміть авто на добу. Цього часу вистачить, щоб:<ol><li><span class='text-strong'>Підвіска:</span> Перевірити підвіску на бруківці вулиці Руської.</li><li><span class='text-strong'>Паркування:</span> Оцінити зручність паркування біля Театрального майдану або ТРЦ "Подоляни".</li><li><span class='text-strong'>Комфорт:</span> Зрозуміти, наскільки комфортно вам та пасажирам у салоні.</li></ol>Це ідеальний варіант для вирішення поточних справ у місті або зустрічі гостей на вокзалі.</div>

<div class='editor_title'>Тижнева оренда: Тур замками Тернопілля</div>
<div class='editor_text'>Тернопільщина займає перше місце в Україні за кількістю замків. Тижнева оренда — це ваш шанс побачити їх усі без поспіху. Фіксований тариф на 7 днів дозволяє вам спланувати ідеальний маршрут:<ol><li><span class='text-strong'>Збараж:</span> Відвідайте резиденцію князів Вишневецьких (всього 20 км від міста).</li><li><span class='text-strong'>Кременець:</span> Підніміться на гору Бона та насолодіться панорамою.</li><li><span class='text-strong'>Почаїв:</span> Відвідайте Лавру — духовний центр, відомий на весь світ.</li></ol>Власним авто ви зможете зупинятися там, де захочете, робити фотосесії та обідати в колоритних придорожніх ресторанах.</div>

<div class='editor_title'>Місячна оренда (Тариф "Бізнес")</div>
<div class='editor_text'>Тернопіль — важливий логістичний хаб між Львовом, Хмельницьким та Рівним. Для підприємців та менеджерів, які працюють у регіоні, ми пропонуємо тариф "Місяць". Це вигідніше, ніж утримувати власний автопарк:<ol><li><span class='text-strong'>Платіж:</span> Один платіж раз на 30 днів.</li><li><span class='text-strong'>Маршрути:</span> Можливість вільного виїзду в сусідні області (Львів, Івано-Франківськ, Чернівці).</li><li><span class='text-strong'>Гнучкість:</span> Якщо автомобіль знадобиться для перевезення вантажу або делегації, ми оперативно замінимо його на більш містку модель.</li></ol></div>

<div class='editor_title'>Довгострокова оренда (від 3 місяців)</div>
<div class='editor_text'>Якщо ви релокували бізнес у Тернопіль або просто живете тут і цінуєте комфорт. Довгострокова оренда від REIZ знімає з вас усі турботи автовласника. Ви не думаєте про страховку, заміну мастила чи сезонну "перевзувку" шин. Ви просто насолоджуєтесь водінням, а всі технічні питання вирішує наша команда. Це сучасний підхід до володіння авто без зайвих зобов'язань.</div>

<div class='editor_title'>Економ-клас: Розумна мобільність від $20</div>
<div class='editor_text'>Тернопіль — місто компактне. Тут не завжди потрібен величезний позашляховик. Наші авто економ-класу — це маневрені, легкі в керуванні машини з мінімальною витратою пального. Вони ідеально вписуються в міський трафік, легко розвертаються на вузьких вуличках і не створюють проблем з паркуванням у дворах.</div>

<div class='editor_title'>Переваги REIZ у Тернополі</div>
<div class='editor_text'><ul><li>Зустріч: Ми чекаємо вас на залізничному вокзалі "Тернопіль", на автовокзалі або подамо авто до вашого під'їзду.</li><li>Швидкість: Оформлення договору займає 15 хвилин. Мінімум бюрократії.</li><li>Чесність: Ви отримуєте авто з повним баком і чистим салоном. Ціна фіксується при бронюванні.</li><li>Підтримка: Наші менеджери на зв'язку 24/7, щоб допомогти у випадку будь-яких питань на дорозі.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Для вашого спокою ми пропонуємо опцію оренди без застави (або зі значно зменшеним депозитом) за умови оформлення повного страхового захисту. Подорожуйте впевнено, знаючи, що фінансові ризики покриті.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Плануєте весілля, урочисту подію або зустріч VIP-партнерів? Замовте авто бізнес-класу з водієм. Наші водії — професіонали, які ідеально знають місто і забезпечать безпечний та комфортний трансфер.</div>

<div class='editor_title'>Доставка авто по місту</div>
<div class='editor_text'>Безкоштовно: Центр, масив "Дружба", район Набережної ставу, Залізничний вокзал.<br/>Платна подача: Масиви "Сонячний", "Східний", "Аляска", район "Подоляни" та передмістя. Вартість розраховується індивідуально.</div>

<div class='editor_title'>Безпека руху в Тернополі</div>
<div class='editor_text'>Місто має свою специфіку, яку варто врахувати водіям:<ol><li><span class='text-strong'>Круговий рух:</span> У Тернополі дуже багато кілець (Збаразьке, Микулинецьке та ін.). Будьте уважні при в'їзді та з'їзді, слідкуйте за знаками пріоритету та розміткою.</li><li><span class='text-strong'>Бруківка:</span> У центрі міста збереглася історична бруківка. У дощ вона стає слизькою, тому збільшуйте дистанцію гальмування.</li><li><span class='text-strong'>Пішоходи:</span> Місто активне і студентське. Будьте уважні біля пішохідних переходів, особливо в районі вишів.</li><li><span class='text-strong'>Алкоголь:</span> Ми маємо нульову толерантність до вживання алкоголю. Безпека — понад усе.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Тернополь — это город с особой атмосферой, где бизнес сочетается с неспешными прогулками по набережной Пруда. Но за пределами компактного центра начинается настоящая магия: замки, пещеры и духовные святыни. Чтобы увидеть всё это и не зависеть от расписания автобусов, сервис REIZ предлагает прокат современных автомобилей. Мы понимаем потребности города: компактные авто для узких улочек центра и надежные кроссоверы для путешествий по области.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Ваш персональный тест-драйв</div>
<div class='editor_text'>Не уверены, подойдет ли вам габаритная машина для тернопольских дорог? Возьмите авто на сутки. Этого времени хватит, чтобы:<ol><li><span class='text-strong'>Подвеска:</span> Проверить подвеску на брусчатке улицы Русской.</li><li><span class='text-strong'>Парковка:</span> Оценить удобство парковки возле Театральной площади или ТРЦ "Подоляны".</li><li><span class='text-strong'>Комфорт:</span> Понять, насколько комфортно вам и пассажирам в салоне.</li></ol>Это идеальный вариант для решения текущих дел в городе или встречи гостей на вокзале.</div>

<div class='editor_title'>Недельная аренда: Тур по замкам Тернопольщины</div>
<div class='editor_text'>Тернопольская область занимает первое место в Украине по количеству замков. Недельная аренда — это ваш шанс увидеть их все без спешки. Фиксированный тариф на 7 дней позволяет вам спланировать идеальный маршрут:<ol><li><span class='text-strong'>Збараж:</span> Посетите резиденцию князей Вишневецких (всего 20 км от города).</li><li><span class='text-strong'>Кременец:</span> Поднимитесь на гору Бона и насладитесь панорамой.</li><li><span class='text-strong'>Почаев:</span> Посетите Лавру — духовный центр, известный на весь мир.</li></ol>На собственном авто вы сможете останавливаться там, где захотите, делать фотосессии и обедать в колоритных придорожных ресторанах.</div>

<div class='editor_title'>Месячная аренда (Тариф "Бизнес")</div>
<div class='editor_text'>Тернополь — важный логистический хаб между Львовом, Хмельницким и Ровно. Для предпринимателей и менеджеров, работающих в регионе, мы предлагаем тариф "Месяц". Это выгоднее, чем содержать собственный автопарк:<ol><li><span class='text-strong'>Платеж:</span> Один платеж раз в 30 дней.</li><li><span class='text-strong'>Маршруты:</span> Возможность свободного выезда в соседние области (Львов, Ивано-Франковск, Черновцы).</li><li><span class='text-strong'>Гибкость:</span> Если автомобиль понадобится для перевозки груза или делегации, мы оперативно заменим его на более вместительную модель.</li></ol></div>

<div class='editor_title'>Долгосрочная аренда (от 3 месяцев)</div>
<div class='editor_text'>Если вы релоцировали бизнес в Тернополь или просто живете здесь и цените комфорт. Долгосрочная аренда от REIZ снимает с вас все заботы автовладельца. Вы не думаете о страховке, замене масла или сезонной "переобувке" шин. Вы просто наслаждаетесь вождением, а все технические вопросы решает наша команда. Это современный подход к владению авто без лишних обязательств.</div>

<div class='editor_title'>Эконом-класс: Умная мобильность от $20</div>
<div class='editor_text'>Тернополь — город компактный. Здесь не всегда нужен огромный внедорожник. Наши авто эконом-класса — это маневренные, легкие в управлении машины с минимальным расходом топлива. Они идеально вписываются в городской трафик, легко разворачиваются на узких улочках и не создают проблем с парковкой во дворах.</div>

<div class='editor_title'>Преимущества REIZ в Тернополе</div>
<div class='editor_text'><ul><li>Встреча: Мы ждем вас на ж/д вокзале "Тернополь", на автовокзале или подадим авто к вашему подъезду.</li><li>Скорость: Оформление договора занимает 15 минут. Минимум бюрократии.</li><li>Честность: Вы получаете авто с полным баком и чистым салоном. Цена фиксируется при бронировании.</li><li>Поддержка: Наши менеджеры на связи 24/7, чтобы помочь в случае любых вопросов на дороге.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Для вашего спокойствия мы предлагаем опцию аренды без залога (или со значительно уменьшенным депозитом) при условии оформления полной страховой защиты. Путешествуйте уверенно, зная, что финансовые риски покрыты.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Планируете свадьбу, торжественное событие или встречу VIP-партнеров? Закажите авто бизнес-класса с водителем. Наши водители — профессионалы, которые идеально знают город и обеспечат безопасный и комфортный трансфер.</div>

<div class='editor_title'>Доставка авто по городу</div>
<div class='editor_text'>Бесплатно: Центр, массив "Дружба", район Набережной пруда, Ж/Д вокзал.<br/>Платная подача: Массивы "Солнечный", "Восточный", "Аляска", район "Подоляны" и пригород. Стоимость рассчитывается индивидуально.</div>

<div class='editor_title'>Безопасность движения в Тернополе</div>
<div class='editor_text'>Город имеет свою специфику, которую стоит учесть водителям:<ol><li><span class='text-strong'>Круговое движение:</span> В Тернополе очень много колец (Збаражское, Микулинецкое и др.). Будьте внимательны при въезде и съезде, следите за знаками приоритета и разметкой.</li><li><span class='text-strong'>Брусчатка:</span> В центре города сохранилась историческая брусчатка. В дождь она становится скользкой, поэтому увеличивайте дистанцию торможения.</li><li><span class='text-strong'>Пешеходы:</span> Город активный и студенческий. Будьте внимательны возле пешеходных переходов, особенно в районе вузов.</li><li><span class='text-strong'>Алкоголь:</span> У нас нулевая толерантность к употреблению алкоголя. Безопасность — превыше всего.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Ternopil is a city with a special atmosphere, where business is combined with leisurely walks along the Lake embankment. But beyond the compact center, real magic begins: castles, caves, and spiritual shrines. To see all this and not depend on bus schedules, REIZ service offers rental of modern cars. We understand the city's needs: compact cars for narrow center streets and reliable crossovers for trips around the region.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: Your Personal Test Drive</div>
<div class='editor_text'>Not sure if a large car is suitable for Ternopil roads? Take a car for a day. This time is enough to:<ol><li><span class='text-strong'>Suspension:</span> Check the suspension on the cobblestones of Ruska Street.</li><li><span class='text-strong'>Parking:</span> Evaluate the convenience of parking near Theater Square or "Podolyany" Mall.</li><li><span class='text-strong'>Comfort:</span> Understand how comfortable you and your passengers feel in the cabin.</li></ol>This is an ideal option for solving current affairs in the city or meeting guests at the train station.</div>

<div class='editor_title'>Weekly Rental: Ternopil Region Castles Tour</div>
<div class='editor_text'>The Ternopil region ranks first in Ukraine in the number of castles. Weekly rental is your chance to see them all without haste. A fixed rate for 7 days allows you to plan the perfect route:<ol><li><span class='text-strong'>Zbarazh:</span> Visit the residence of the Vyshnevetsky princes (only 20 km from the city).</li><li><span class='text-strong'>Kremenets:</span> Climb Bona Hill and enjoy the panorama.</li><li><span class='text-strong'>Pochaiv:</span> Visit the Lavra — a spiritual center known throughout the world.</li></ol>With your own car, you can stop wherever you want, do photo shoots, and dine in colorful roadside restaurants.</div>

<div class='editor_title'>Monthly Rental ("Business" Tariff)</div>
<div class='editor_text'>Ternopil is an important logistics hub between Lviv, Khmelnytskyi, and Rivne. For entrepreneurs and managers working in the region, we offer the "Month" tariff. This is more profitable than maintaining your own fleet:<ol><li><span class='text-strong'>Payment:</span> One payment once every 30 days.</li><li><span class='text-strong'>Routes:</span> Possibility of free travel to neighboring regions (Lviv, Ivano-Frankivsk, Chernivtsi).</li><li><span class='text-strong'>Flexibility:</span> If you need a vehicle to transport cargo or a delegation, we will promptly replace it with a more spacious model.</li></ol></div>

<div class='editor_title'>Long-Term Rental (from 3 months)</div>
<div class='editor_text'>If you relocated your business to Ternopil or just live here and value comfort. Long-term rental from REIZ removes all car owner worries from you. You don't think about insurance, oil changes, or seasonal tire swapping. You simply enjoy driving, and our team solves all technical issues. This is a modern approach to car ownership without unnecessary obligations.</div>

<div class='editor_title'>Economy Class: Smart Mobility from $20</div>
<div class='editor_text'>Ternopil is a compact city. You don't always need a huge SUV here. Our economy class cars are maneuverable, easy-to-drive machines with minimal fuel consumption. They fit perfectly into city traffic, easily turn around on narrow streets, and create no parking problems in courtyards.</div>

<div class='editor_title'>Advantages of REIZ in Ternopil</div>
<div class='editor_text'><ul><li>Meeting: We wait for you at "Ternopil" Railway Station, at the Bus Station, or deliver the car to your doorstep.</li><li>Speed: Contract processing takes 15 minutes. Minimum bureaucracy.</li><li>Honesty: You receive a car with a full tank and a clean interior. The price is fixed when booking.</li><li>Support: Our managers are in touch 24/7 to help in case of any questions on the road.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>For your peace of mind, we offer a no-deposit rental option (or with a significantly reduced deposit) subject to full insurance coverage. Travel confidently knowing that financial risks are covered.</div>

<div class='editor_title'>Chauffeur Services</div>
<div class='editor_text'>Planning a wedding, a gala event, or a meeting of VIP partners? Order a business class car with a driver. Our drivers are professionals who know the city perfectly and will ensure a safe and comfortable transfer.</div>

<div class='editor_title'>Car Delivery in the City</div>
<div class='editor_text'>Free: Center, "Druzhba" district, Lake Embankment area, Railway Station.<br/>Paid Delivery: "Sonyachnyi", "Skhidnyi", "Alaska" districts, "Podolyany" area, and suburbs. The cost is calculated individually.</div>

<div class='editor_title'>Traffic Safety in Ternopil</div>
<div class='editor_text'>The city has its specifics that drivers should consider:<ol><li><span class='text-strong'>Roundabouts:</span> There are many roundabouts in Ternopil (Zbarazke, Mykulynetske, etc.). Be careful when entering and exiting, follow priority signs and markings.</li><li><span class='text-strong'>Cobblestones:</span> Historic cobblestones remain in the city center. In the rain, they become slippery, so increase the braking distance.</li><li><span class='text-strong'>Pedestrians:</span> The city is active and full of students. Be careful near pedestrian crossings, especially in the university area.</li><li><span class='text-strong'>Alcohol:</span> We have zero tolerance for alcohol consumption. Safety is paramount.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateTruskavetsEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Трускавець — перлина бальнеологічних курортів, місце спокою та відновлення. Але пити "Нафтусю" — не означає сидіти в готелі. Навколо міста розкидані неймовірні природні пам'ятки. Сервіс REIZ пропонує прокат авто для тих, хто хоче поєднати лікування з активними подорожами. Забудьте про переповнені екскурсійні автобуси. З власним авто ви самі вирішуєте, коли їхати на водоспад Кам'янка, а коли — на шопінг до Львова.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Маленька подорож</div>
<div class='editor_text'>Втомилися від процедур? Візьміть авто на добу і змініть обстановку.<ol><li><span class='text-strong'>Східниця:</span> Всього 20 км серпантином — і ви в "Українській Швейцарії". Протестуйте, як авто поводиться на гірських поворотах.</li><li><span class='text-strong'>Тустань:</span> Легендарна фортеця в скелях. Доїхати туди на орендованому кросовері значно комфортніше, ніж шукати попутки.</li><li><span class='text-strong'>Дрогобич:</span> Відвідайте старовинну солеварню та ратушу в сусідньому місті.</li></ol>Погодинна оренда — це ідеальний тест-драйв перед тим, як взяти авто на весь період відпустки.</div>

<div class='editor_title'>Тижнева оренда: Ваш ідеальний ритм</div>
<div class='editor_text'>Стандартна путівка в санаторій триває 14-21 день. Оренда авто на тиждень або два — це найкраще рішення для сім'ї. Вам не потрібно підлаштовуватися під розклад маршруток, щоб поїхати на вечерю в інший ресторан або відвідати зоопарк "Лімпопо" в Меденичах. Ви отримуєте свободу пересування: зранку процедури, вдень — поїздка в гори, ввечері — прогулянка центром. І все це за фіксованим, вигідним тарифом.</div>

<div class='editor_title'>Оренда на місяць (Для тривалого відпочинку)</div>
<div class='editor_text'>Якщо ви приїхали в Трускавець на повний курс оздоровлення або просто пожити в тиші подалі від мегаполіса. Тариф "Місяць" — це максимальна економія.<ol><li><span class='text-strong'>Вартість:</span> Ціна за добу знижується майже вдвічі порівняно з короткостроковою орендою.</li><li><span class='text-strong'>Мобільність:</span> Ви можете вільно їздити у Львів на вихідні, зустрічати друзів на вокзалі або влаштувати тур замками Львівщини.</li><li><span class='text-strong'>Комфорт:</span> Ми підберемо авто з великим багажником для ваших речей або економний варіант для частих поїздок.</li></ol></div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Для тих, хто має нерухомість у Трускавці або керує бізнесом у готельній сфері. Оренда від 3 місяців позбавляє вас необхідності купувати службове авто. Ми беремо на себе всі технічні питання: страхування, техогляд, заміну гуми. Ви отримуєте готовий до експлуатації автомобіль, який завжди під рукою.</div>

<div class='editor_title'>Економ-клас: Зручно і недорого</div>
<div class='editor_text'>Вулички Трускавця компактні, а паркування в центрі може бути ускладненим. Наші авто економ-класу — ідеальний вибір. Вони маневрені, легкі в паркуванні біля бювету та споживають мінімум пального. Це розумний вибір для спокійного курортного відпочинку.</div>

<div class='editor_title'>Чому гості Трускавця обирають REIZ</div>
<div class='editor_text'><ul><li>Подача до готелю: Вам не треба нікуди йти. Ми приженемо авто прямо до рецепції "Ріксос", "Міротель", "Карпати" чи будь-якого іншого санаторію.</li><li>Зустріч на вокзалі: Якщо ви прибуваєте потягом, наш менеджер зустріне вас на пероні з ключами.</li><li>Чистота: Авто проходить повну санітарну обробку перед видачею.</li><li>Без прихованих платежів: Ціна, яку ви бачите при бронюванні, є остаточною.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Ми розуміємо, що на відпочинку не хочеться заморожувати кошти на карті. Для більшості авто доступна послуга оренди без застави (при умові оформлення повного страхування). Насолоджуйтесь відпочинком без зайвих фінансових блокувань.</div>

<div class='editor_title'>Трансфер та водій</div>
<div class='editor_text'>Потрібно дістатися до аеропорту Львова? Або хочете поїхати на дегустацію вин і не сідати за кермо? Замовте трансфер з професійним водієм. Комфортні авто бізнес-класу, ввічливі водії та пунктуальність — гарантовані.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: В межах міста Трускавець (всі санаторії, вілли, Ж/Д вокзал).<br/>Платна подача: Стебник, Дрогобич, Борислав, Східниця, Модричі. Вартість розраховується індивідуально залежно від кілометражу.</div>

<div class='editor_title'>Безпека руху в регіоні</div>
<div class='editor_text'>Трускавець — місто пішоходів.<ol><li><span class='text-strong'>Курортна зона:</span> У центрі діють обмеження швидкості та заборона в'їзду в пішохідні зони біля бювету. Слідкуйте за знаками.</li><li><span class='text-strong'>Гірські дороги:</span> Дорога на Східницю через перевал вимагає уваги, особливо взимку чи в дощ. Не перевищуйте швидкість на серпантині.</li><li><span class='text-strong'>Паркування:</span> Залишайте авто тільки на відведених паркінгах готелів або платних стоянках, щоб не заважати іншим відпочивальникам.</li><li><span class='text-strong'>Алкоголь:</span> REIZ — за безпечний відпочинок. Керування в нетверезому стані суворо заборонено.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Трускавец — жемчужина бальнеологических курортов, место спокойствия и восстановления. Но пить "Нафтусю" — не значит сидеть в отеле. Вокруг города разбросаны невероятные природные достопримечательности. Сервис REIZ предлагает прокат авто для тех, кто хочет совместить лечение с активными путешествиями. Забудьте о переполненных экскурсионных автобусах. С личным авто вы сами решаете, когда ехать на водопад Каменка, а когда — на шопинг во Львов.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Маленькое путешествие</div>
<div class='editor_text'>Устали от процедур? Возьмите авто на сутки и смените обстановку.<ol><li><span class='text-strong'>Сходница:</span> Всего 20 км по серпантину — и вы в "Украинской Швейцарии". Протестируйте, как авто ведет себя на горных поворотах.</li><li><span class='text-strong'>Тустань:</span> Легендарная крепость в скалах. Доехать туда на арендованном кроссовере гораздо комфортнее, чем искать попутки.</li><li><span class='text-strong'>Дрогобыч:</span> Посетите старинную солеварню и ратушу в соседнем городе.</li></ol>Почасовая аренда — это идеальный тест-драйв перед тем, как взять авто на весь период отпуска.</div>

<div class='editor_title'>Недельная аренда: Ваш идеальный ритм</div>
<div class='editor_text'>Стандартная путевка в санаторий длится 14-21 день. Аренда авто на неделю или две — это лучшее решение для семьи. Вам не нужно подстраиваться под расписание маршруток, чтобы поехать на ужин в другой ресторан или посетить зоопарк "Лимпопо" в Меденичах. Вы получаете свободу передвижения: утром процедуры, днем — поездка в горы, вечером — прогулка по центру. И все это по фиксированному, выгодному тарифу.</div>

<div class='editor_title'>Аренда на месяц (Для длительного отдыха)</div>
<div class='editor_text'>Если вы приехали в Трускавец на полный курс оздоровления или просто пожить в тишине вдали от мегаполиса. Тариф "Месяц" — это максимальная экономия.<ol><li><span class='text-strong'>Стоимость:</span> Цена за сутки снижается почти вдвое по сравнению с краткосрочной арендой.</li><li><span class='text-strong'>Мобильность:</span> Вы можете свободно ездить во Львов на выходные, встречать друзей на вокзале или устроить тур по замкам Львовщины.</li><li><span class='text-strong'>Комфорт:</span> Мы подберем авто с большим багажником для ваших вещей или экономный вариант для частых поездок.</li></ol></div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Для тех, кто имеет недвижимость в Трускавце или управляет бизнесом в гостиничной сфере. Аренда от 3 месяцев избавляет вас от необходимости покупать служебное авто. Мы берем на себя все технические вопросы: страхование, техосмотр, замену резины. Вы получаете готовый к эксплуатации автомобиль, который всегда под рукой.</div>

<div class='editor_title'>Эконом-класс: Удобно и недорого</div>
<div class='editor_text'>Улочки Трускавца компактны, а парковка в центре может быть затруднена. Наши авто эконом-класса — идеальный выбор. Они маневренные, легкие в парковке возле бювета и потребляют минимум топлива. Это разумный выбор для спокойного курортного отдыха.</div>

<div class='editor_title'>Почему гости Трускавца выбирают REIZ</div>
<div class='editor_text'><ul><li>Подача к отелю: Вам не надо никуда идти. Мы пригоним авто прямо к рецепции "Риксос", "Миротель", "Карпаты" или любого другого санатория.</li><li>Встреча на вокзале: Если вы прибываете поездом, наш менеджер встретит вас на перроне с ключами.</li><li>Чистота: Авто проходит полную санитарную обработку перед выдачей.</li><li>Без скрытых платежей: Цена, которую вы видите при бронировании, является окончательной.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Мы понимаем, что на отдыхе не хочется замораживать средства на карте. Для большинства авто доступна услуга аренды без залога (при условии оформления полного страхования). Наслаждайтесь отдыхом без лишних финансовых блокировок.</div>

<div class='editor_title'>Трансфер и водитель</div>
<div class='editor_text'>Нужно добраться до аэропорта Львова? Или хотите поехать на дегустацию вин и не садиться за руль? Закажите трансфер с профессиональным водителем. Комфортные авто бизнес-класса, вежливые водители и пунктуальность — гарантированы.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: В пределах города Трускавец (все санатории, виллы, Ж/Д вокзал).<br/>Платная подача: Стебник, Дрогобыч, Борислав, Сходница, Модричи. Стоимость рассчитывается индивидуально в зависимости от километража.</div>

<div class='editor_title'>Безопасность движения в регионе</div>
<div class='editor_text'>Трускавец — город пешеходов.<ol><li><span class='text-strong'>Курортная зона:</span> В центре действуют ограничения скорости и запрет въезда в пешеходные зоны возле бювета. Следите за знаками.</li><li><span class='text-strong'>Горные дороги:</span> Дорога на Сходницу через перевал требует внимания, особенно зимой или в дождь. Не превышайте скорость на серпантине.</li><li><span class='text-strong'>Парковка:</span> Оставляйте авто только на отведенных паркингах отелей или платных стоянках, чтобы не мешать другим отдыхающим.</li><li><span class='text-strong'>Алкоголь:</span> REIZ — за безопасный отдых. Управление в нетрезвом виде строго запрещено.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Truskavets is the pearl of balneological resorts, a place of peace and recovery. But drinking "Naftusya" water does not mean sitting in a hotel. Incredible natural attractions are scattered around the city. REIZ service offers car rental for those who want to combine treatment with active travel. Forget about crowded tour buses. With a personal car, you decide when to go to the Kamianka waterfall, and when to go shopping in Lviv.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: A Little Journey</div>
<div class='editor_text'>Tired of procedures? Take a car for a day and change the scenery.<ol><li><span class='text-strong'>Skhidnytsia:</span> Only 20 km along the serpentine — and you are in "Ukrainian Switzerland". Test how the car behaves on mountain turns.</li><li><span class='text-strong'>Tustan:</span> Legendary fortress in the rocks. Getting there by a rented crossover is much more comfortable than looking for a ride.</li><li><span class='text-strong'>Drohobych:</span> Visit the ancient saltworks and the town hall in the neighboring city.</li></ol>Hourly rental is an ideal test drive before renting a car for the entire vacation period.</div>

<div class='editor_title'>Weekly Rental: Your Perfect Rhythm</div>
<div class='editor_text'>A standard voucher to a sanatorium lasts 14-21 days. Renting a car for a week or two is the best solution for a family. You don't need to adjust to the bus schedule to go to dinner at another restaurant or visit the "Limpopo" zoo in Medenychi. You get freedom of movement: procedures in the morning, a trip to the mountains in the afternoon, a walk in the center in the evening. And all this at a fixed, favorable rate.</div>

<div class='editor_title'>Monthly Rental (For Long Rest)</div>
<div class='editor_text'>If you came to Truskavets for a full course of recovery or just to live in silence away from the metropolis. The "Month" tariff is maximum savings.<ol><li><span class='text-strong'>Cost:</span> The price per day is reduced by almost half compared to short-term rental.</li><li><span class='text-strong'>Mobility:</span> You can freely go to Lviv for the weekend, meet friends at the station, or arrange a tour of the castles of the Lviv region.</li><li><span class='text-strong'>Comfort:</span> We will select a car with a large trunk for your things or an economical option for frequent trips.</li></ol></div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>For those who own real estate in Truskavets or manage a business in the hotel sector. Rental from 3 months relieves you of the need to buy a company car. We take care of all technical issues: insurance, inspection, tire replacement. You get a ready-to-use car that is always at hand.</div>

<div class='editor_title'>Economy Class: Convenient and Inexpensive</div>
<div class='editor_text'>The streets of Truskavets are compact, and parking in the center can be difficult. Our economy class cars are the perfect choice. They are maneuverable, easy to park near the pump room, and consume minimum fuel. This is a smart choice for a quiet resort vacation.</div>

<div class='editor_title'>Why Truskavets Guests Choose REIZ</div>
<div class='editor_text'><ul><li>Delivery to the Hotel: You don't have to go anywhere. We will drive the car directly to the reception of "Rixos", "Mirotel", "Karpaty", or any other sanatorium.</li><li>Meeting at the Station: If you arrive by train, our manager will meet you on the platform with the keys.</li><li>Cleanliness: The car undergoes full sanitary treatment before delivery.</li><li>No Hidden Fees: The price you see when booking is final.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>We understand that on vacation you don't want to freeze funds on the card. For most cars, a no-deposit rental service is available (subject to full insurance). Enjoy your vacation without unnecessary financial blocks.</div>

<div class='editor_title'>Transfer and Chauffeur</div>
<div class='editor_text'>Need to get to Lviv airport? Or want to go for wine tasting and not drive? Order a transfer with a professional driver. Comfortable business class cars, polite drivers, and punctuality are guaranteed.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: Within the city of Truskavets (all sanatoriums, villas, Railway Station).<br/>Paid Delivery: Stebnyk, Drohobych, Boryslav, Skhidnytsia, Modrychi. The cost is calculated individually depending on the mileage.</div>

<div class='editor_title'>Traffic Safety in the Region</div>
<div class='editor_text'>Truskavets is a city of pedestrians.<ol><li><span class='text-strong'>Resort Zone:</span> In the center, speed limits apply, and entry into pedestrian zones near the pump room is prohibited. Watch the signs.</li><li><span class='text-strong'>Mountain Roads:</span> The road to Skhidnytsia through the pass requires attention, especially in winter or rain. Do not exceed the speed on the serpentine.</li><li><span class='text-strong'>Parking:</span> Leave the car only in designated hotel parking lots or paid parking lots so as not to disturb other vacationers.</li><li><span class='text-strong'>Alcohol:</span> REIZ is for safe rest. Driving under the influence is strictly prohibited.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateChernivtsiEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Чернівці — це архітектурна перлина та логістичні ворота до Румунії. Вузькі вулички старого міста, велична Резиденція митрополитів та складний рельєф вимагають особливого підходу до мобільності. Сервіс REIZ у Чернівцях пропонує автомобілі, які ідеально вписуються в цей контекст: надійні підвіски для історичної бруківки та потужні двигуни для подорожей серпантинами Буковини. Забудьте про таксі, яке не завжди може заїхати у двори старого фонду. З власним авто ви — господар свого часу.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Екскурсія чи бізнес-зустріч?</div>
<div class='editor_text'>Приїхали потягом вранці і маєте час до вечора? Не витрачайте його на очікування. Погодинна оренда — це ваше рішення для коротких візитів.<ol><li><span class='text-strong'>Туризм:</span> Встигніть побачити Університет (ЮНЕСКО), прогулятися вулицею Ольги Кобилянської та випити кави на Турецькій площі.</li><li><span class='text-strong'>Справи:</span> Проведіть кілька зустрічей у різних кінцях міста з комфортом власного офісу на колесах.</li><li><span class='text-strong'>Фотосесії:</span> Чернівці — популярне місто для весіль та зйомок. Стильне авто стане ідеальним доповненням до кадру на фоні старовинної архітектури.</li></ol></div>

<div class='editor_title'>Тижнева оренда: Велика подорож Буковиною</div>
<div class='editor_text'>Чернівці — ідеальна база для радіальних виїздів. Тижневий тариф дозволить вам побачити все найцікавіше в радіусі 100 км без поспіху. Фіксована ціна за 7 днів робить оренду вигіднішою за будь-який трансфер. Куди поїхати:<ol><li><span class='text-strong'>Хотинська фортеця:</span> Легендарна твердиня над Дністром всього за годину їзди.</li><li><span class='text-strong'>Перевал Німчич:</span> Неймовірні краєвиди Буковинських Карпат біля Вижниці.</li><li><span class='text-strong'>Банчени:</span> Відомий монастир з унікальною архітектурою.</li></ol>Автомобіль дає вам свободу зустрічати світанки в горах і вечеряти в центрі міста.</div>

<div class='editor_title'>Оренда на місяць (Тариф для бізнесу та кордону)</div>
<div class='editor_text'>Чернівці — важливий транзитний вузол поруч із кордоном (КПП "Порубне"). Для підприємців, які працюють з експортом/імпортом, або тих, хто часто їздить у відрядження, тариф "Місяць" є незамінним.<ol><li><span class='text-strong'>Вигода:</span> Ви платите один раз на 30 днів і отримуєте спеціальну низьку ціну.</li><li><span class='text-strong'>Кордон:</span> За попереднім запитом ми готуємо пакет документів для виїзду за кордон (Румунія, Молдова, країни ЄС).</li><li><span class='text-strong'>Надійність:</span> Якщо авто потребуватиме ТО, ми просто надамо інше. Ваш бізнес не зупиниться ні на хвилину.</li></ol></div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Рішення для місцевих жителів та релокованих компаній. Чи варто купувати авто, якщо ваші плани можуть змінитися? Довгострокова оренда від REIZ — це гнучкість. Ви обираєте клас авто (від економ до преміум), а ми дбаємо про решту:<ol><li><span class='text-strong'>Страхування:</span> КАСКО/ОСЦПВ.</li><li><span class='text-strong'>Гума:</span> Сезонна заміна гуми (що критично важливо на буковинських схилах).</li><li><span class='text-strong'>Ремонти:</span> Планові ремонти.</li></ol>Ви платите фіксовану суму щомісяця і насолоджуєтесь водінням.</div>

<div class='editor_title'>Економ-клас: Королі вузьких вулиць</div>
<div class='editor_text'>Центр Чернівців — це мережа односторонніх та вузьких вуличок. Тут великий позашляховик може стати тягарем. Наші авто економ-класу — ідеальний вибір. Компактні хетчбеки та седани легко розминаються із зустрічним транспортом, знаходять місце для паркування біля Ратуші та економлять ваші кошти на пальному.</div>

<div class='editor_title'>Чому в Чернівцях обирають REIZ</div>
<div class='editor_text'><ul><li>Локація: Зустрічаємо на Залізничному вокзалі (вул. Гагаріна), автовокзалі або доставимо авто за вашою адресою.</li><li>Стан авто: Ми знаємо, що таке чернівецька бруківка, тому приділяємо особливу увагу діагностиці ходової частини. Ви отримуєте "збите", тихе та справне авто.</li><li>Прозорість: Жодних прихованих комісій. Ви отримуєте повний бак і повертаєте повний.</li><li>Підтримка: Ми завжди на зв'язку, щоб підказати маршрут або допомогти в нестандартній ситуації.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Подорожуйте без фінансового тиску. Для більшості моделей доступна опція "Без застави" за умови придбання повного страхового покриття. Це особливо зручно для туристів, які не хочуть блокувати кошти на карті.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Потрібно зустріти іноземних партнерів або ви плануєте святкову подію? Замовте авто з водієм. Професійний драйвер, який знає кожен провулок міста, доставить вас вчасно і з комфортом.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: Центральна частина міста, район парку Шевченка, проспект Незалежності, Ж/Д вокзал.<br/>Платна подача: Гравітон, Садгора, Роша, Годилів та приміські зони. Вартість прораховується індивідуально.</div>

<div class='editor_title'>Безпека руху в Чернівцях: Важливі поради</div>
<div class='editor_text'>Водіння тут має свій колорит:<ol><li><span class='text-strong'>Бруківка:</span> Весь старий центр вимощений каменем. У дощ він стає слизьким, як лід. Збільшуйте дистанцію і гальмуйте плавно.</li><li><span class='text-strong'>Рельєф:</span> Місто стоїть на пагорбах. Взимку або на мокрій дорозі рушати вгору (наприклад, по вул. Головній) треба обережно.</li><li><span class='text-strong'>Односторонній рух:</span> Центр — це лабіринт односторонніх вулиць. Уважно слідкуйте за навігатором і знаками.</li><li><span class='text-strong'>Алкоголь:</span> REIZ сповідує нульову толерантність. Вживання алкоголю за кермом неприпустиме.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Черновцы — это архитектурная жемчужина и логистические ворота в Румынию. Узкие улочки старого города, величественная Резиденция митрополитов и сложный рельеф требуют особого подхода к мобильности. Сервис REIZ в Черновцах предлагает автомобили, которые идеально вписываются в этот контекст: надежные подвески для исторической брусчатки и мощные двигатели для путешествий по серпантинам Буковины. Забудьте о такси, которое не всегда может заехать во дворы старого фонда. С личным авто вы — хозяин своего времени.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Экскурсия или бизнес-встреча?</div>
<div class='editor_text'>Приехали поездом утром и есть время до вечера? Не тратьте его на ожидание. Почасовая аренда — это ваше решение для коротких визитов.<ol><li><span class='text-strong'>Туризм:</span> Успейте увидеть Университет (ЮНЕСКО), прогуляться по улице Ольги Кобылянской и выпить кофе на Турецкой площади.</li><li><span class='text-strong'>Дела:</span> Проведите несколько встреч в разных концах города с комфортом собственного офиса на колесах.</li><li><span class='text-strong'>Фотосессии:</span> Черновцы — популярный город для свадеб и съемок. Стильное авто станет идеальным дополнением к кадру на фоне старинной архитектуры.</li></ol></div>

<div class='editor_title'>Недельная аренда: Большое путешествие по Буковине</div>
<div class='editor_text'>Черновцы — идеальная база для радиальных выездов. Недельный тариф позволит вам увидеть все самое интересное в радиусе 100 км без спешки. Фиксированная цена за 7 дней делает аренду выгоднее любого трансфера. Куда поехать:<ol><li><span class='text-strong'>Хотинская крепость:</span> Легендарная твердыня над Днестром всего в часе езды.</li><li><span class='text-strong'>Перевал Нимчич:</span> Невероятные пейзажи Буковинских Карпат возле Вижницы.</li><li><span class='text-strong'>Банчены:</span> Известный монастырь с уникальной архитектурой.</li></ol></div>

<div class='editor_title'>Аренда на месяц (Тариф для бизнеса и границы)</div>
<div class='editor_text'>Черновцы — важный транзитный узел рядом с границей (КПП "Порубное"). Для предпринимателей, работающих с экспортом/импортом, или тех, кто часто ездит в командировки, тариф "Месяц" незаменим.<ol><li><span class='text-strong'>Выгода:</span> Вы платите один раз в 30 дней и получаете специальную низкую цену.</li><li><span class='text-strong'>Граница:</span> По предварительному запросу мы готовим пакет документов для выезда за границу (Румыния, Молдова, страны ЕС).</li><li><span class='text-strong'>Надежность:</span> Если авто потребует ТО, мы просто предоставим другое.</li></ol></div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Решение для местных жителей и релоцированных компаний. Стоит ли покупать авто, если ваши планы могут измениться? Долгосрочная аренда от REIZ — это гибкость. Вы выбираете класс авто, а мы заботимся об остальном:<ol><li><span class='text-strong'>Страхование:</span> КАСКО/ОСАГО.</li><li><span class='text-strong'>Резина:</span> Сезонная замена резины (критично важно на буковинских склонах).</li><li><span class='text-strong'>Ремонты:</span> Плановые ремонты.</li></ol></div>

<div class='editor_title'>Эконом-класс: Короли узких улиц</div>
<div class='editor_text'>Центр Черновцов — это сеть односторонних и узких улочек. Здесь большой внедорожник может стать обузой. Наши авто эконом-класса — идеальный выбор. Компактные хэтчбеки и седаны легко разминаются со встречным транспортом и находят место для парковки у Ратуши.</div>

<div class='editor_title'>Почему в Черновцах выбирают REIZ</div>
<div class='editor_text'><ul><li>Локация: Встречаем на Ж/Д вокзале, автовокзале или доставим авто по вашему адресу.</li><li>Состояние авто: Мы знаем, что такое черновицкая брусчатка, поэтому уделяем особое внимание диагностике ходовой части.</li><li>Прозрачность: Никаких скрытых комиссий. Полный бак при выдаче и возврате.</li><li>Поддержка: Мы всегда на связи, чтобы подсказать маршрут или помочь в нестандартной ситуации.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Путешествуйте без финансового давления. Для большинства моделей доступна опция "Без залога" при условии покупки полного страхового покрытия. Это особенно удобно для туристов.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Нужно встретить иностранных партнеров или планируете праздничное событие? Закажите авто с водителем. Профессиональный драйвер доставит вас вовремя и с комфортом.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: Центральная часть города, район парка Шевченко, проспект Независимости, Ж/Д вокзал.<br/>Платная подача: Гравитон, Садгора, Роша, Годылов и пригородные зоны.</div>

<div class='editor_title'>Безопасность движения в Черновцах: Важные советы</div>
<div class='editor_text'>Вождение здесь имеет свой колорит:<ol><li><span class='text-strong'>Брусчатка:</span> Весь старый центр вымощен камнем. В дождь он становится скользким, как лед. Увеличивайте дистанцию.</li><li><span class='text-strong'>Рельеф:</span> Город стоит на холмах. Зимой или на мокрой дороге трогаться вверх нужно осторожно.</li><li><span class='text-strong'>Одностороннее движение:</span> Центр — это лабиринт односторонних улиц. Внимательно следите за навигатором.</li><li><span class='text-strong'>Алкоголь:</span> REIZ исповедует нулевую толерантность. Употребление алкоголя за рулем недопустимо.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Chernivtsi is an architectural gem and a logistic gateway to Romania. The narrow streets of the old city, the majestic Residence of Metropolitans, and the complex terrain require a special approach to mobility. REIZ service in Chernivtsi offers cars that perfectly fit this context: reliable suspensions for historic cobblestones and powerful engines for trips along the serpentines of Bukovina. Forget about taxis that cannot always enter the courtyards of the old buildings. With a personal car, you are the master of your time.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: Tour or Business Meeting?</div>
<div class='editor_text'>Arrived by train in the morning and have time until the evening? Do not waste it waiting. Hourly rental is your solution for short visits.<ol><li><span class='text-strong'>Tourism:</span> Have time to see the University (UNESCO site), walk along Olha Kobylianska Street, and drink coffee on Turkish Square.</li><li><span class='text-strong'>Business:</span> Hold several meetings in different parts of the city with the comfort of your own office on wheels.</li><li><span class='text-strong'>Photoshoots:</span> Chernivtsi is a popular city for weddings and filming. A stylish car will be a perfect addition to the frame against the background of ancient architecture.</li></ol></div>

<div class='editor_title'>Weekly Rental: Grand Tour of Bukovina</div>
<div class='editor_text'>Chernivtsi is an ideal base for radial trips. The weekly rate will allow you to see all the most interesting things within a radius of 100 km without haste. A fixed price for 7 days makes rental more profitable than any transfer. Where to go:<ol><li><span class='text-strong'>Khotyn Fortress:</span> Legendary stronghold on the Dniester River, just an hour's drive away.</li><li><span class='text-strong'>Nimchych Pass:</span> Incredible landscapes of the Bukovinian Carpathians near Vyzhnytsia.</li><li><span class='text-strong'>Bancheny:</span> A famous monastery with unique architecture.</li></ol></div>

<div class='editor_title'>Monthly Rental (Tariff for Business and Borders)</div>
<div class='editor_text'>Chernivtsi is an important transit hub near the border (Porubne checkpoint). For entrepreneurs working with export/import, or those who travel frequently on business, the "Month" tariff is indispensable.<ol><li><span class='text-strong'>Benefit:</span> You pay once every 30 days and get a special low price.</li><li><span class='text-strong'>Border:</span> Upon prior request, we prepare a package of documents for traveling abroad (Romania, Moldova, EU countries).</li><li><span class='text-strong'>Reliability:</span> If the car needs maintenance, we simply provide another one.</li></ol></div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>A solution for locals and relocated companies. Is it worth buying a car if your plans might change? Long-term rental from REIZ offers flexibility. You choose the car class, and we take care of the rest:<ol><li><span class='text-strong'>Insurance:</span> CASCO/MTPL.</li><li><span class='text-strong'>Tires:</span> Seasonal tire replacement (critical on Bukovinian slopes).</li><li><span class='text-strong'>Repairs:</span> Scheduled repairs.</li></ol></div>

<div class='editor_title'>Economy Class: Kings of Narrow Streets</div>
<div class='editor_text'>The center of Chernivtsi is a network of one-way and narrow streets. Here, a large SUV can become a burden. Our economy class cars are the perfect choice. Compact hatchbacks and sedans easily pass oncoming traffic, find parking space near the City Hall, and save your money on fuel.</div>

<div class='editor_title'>Why Choose REIZ in Chernivtsi</div>
<div class='editor_text'><ul><li>Location: We meet at the Railway Station, Bus Station, or deliver the car to your address.</li><li>Car Condition: We know what Chernivtsi cobblestones are, so we pay special attention to chassis diagnostics. You get a "tight", quiet, and serviceable car.</li><li>Transparency: No hidden fees. Full tank upon pick-up and return.</li><li>Support: We are always in touch, to suggest a route or help in an unusual situation.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>Travel without financial pressure. For most models, the "No Deposit" option is available subject to purchasing full insurance coverage. This is especially convenient for tourists.</div>

<div class='editor_title'>Chauffeur Services</div>
<div class='editor_text'>Need to meet foreign partners or planning a festive event? Order a car with a driver. A professional driver who knows every alley of the city will deliver you on time and with comfort.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: Central part of the city, Shevchenko Park area, Nezalezhnosti Avenue, Railway Station.<br/>Paid Delivery: Hraviton, Sadhora, Rosha, Hodyliv, and suburban zones.</div>

<div class='editor_title'>Traffic Safety in Chernivtsi: Important Tips</div>
<div class='editor_text'>Driving here has its own flavor:<ol><li><span class='text-strong'>Cobblestones:</span> The entire old center is paved with stone. In the rain, it becomes slippery like ice. Increase distance and brake smoothly.</li><li><span class='text-strong'>Terrain:</span> The city stands on hills. In winter or on a wet road, starting uphill (for example, on Holovna St.) requires caution.</li><li><span class='text-strong'>One-Way Traffic:</span> The center is a labyrinth of one-way streets. Watch the navigator and signs carefully.</li><li><span class='text-strong'>Alcohol:</span> REIZ adheres to zero tolerance. Drinking and driving is unacceptable.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateIvanoFrankivskEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Івано-Франківськ — це ідеальний хаб. Звідси однаково зручно їхати у справах до Львова або на відпочинок у Буковель. Але без власного авто ви прив'язані до розкладу автобусів або дорогих таксі. Сервіс REIZ пропонує прокат автомобілів, технічно підготовлених до специфіки регіону. Ми розуміємо, що дорога на Яремче може бути ідеальною, а з'їзд до водоспаду — ґрунтовим. Тому наші авто мають перевірену підвіску, а взимку — найкращу гуму.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Для міста та коротких поїздок</div>
<div class='editor_text'>Приїхали потягом вранці, а поселення в готель лише в обід? Не гайте час. Погодинна оренда — це можливість встигнути більше.<ol><li><span class='text-strong'>У місті:</span> Відвідайте Ратушу, прогуляйтеся славнозвісною "Стометрівкою" або заїдьте в Промприлад.Реновація.</li><li><span class='text-strong'>За містом:</span> З'їздіть до старовинного Галича або у Тисменицю.</li><li><span class='text-strong'>Тест-драйв:</span> Перевірте, чи комфортно вам керувати обраним кросовером, перш ніж вирушати ним у гори на тиждень.</li></ol></div>

<div class='editor_title'>Тижневий тариф: Відкрийте Прикарпаття</div>
<div class='editor_text'>Івано-Франківськ — найкраща база для радіальних подорожей. Тижнева оренда за фіксованим тарифом дає вам свободу. Сплануйте свій тур:<ol><li><span class='text-strong'>День 1:</span> Поїздка до скель Довбуша та водоспаду Пробій у Яремче.</li><li><span class='text-strong'>День 2:</span> Релакс у Манявському скиті та біля Манявського водоспаду.</li><li><span class='text-strong'>День 3:</span> Гастротур — форелеві господарства та сироварні Верховини.</li></ol>Власним авто ви не залежите від гідів. Ви зупиняєтесь там, де гарний краєвид, а не там, де зупинився автобус.</div>

<div class='editor_title'>Оренда на місяць (Тариф "Бізнес")</div>
<div class='editor_text'>Івано-Франківськ стрімко розвивається як IT-кластер та бізнес-центр. Якщо ви приїхали сюди по роботі надовго, тариф "Місяць" — це ваша економія та статус.<ol><li><span class='text-strong'>Вартість:</span> Значно дешевше, ніж каршерінг чи щоденне таксі.</li><li><span class='text-strong'>Логістика:</span> Ви вільно пересуваєтесь між офісом, домом та об'єктами в області.</li><li><span class='text-strong'>Гнучкість:</span> Потрібно поїхати у Львів чи Тернопіль? Жодних проблем та доплат за виїзд за межі міста.</li></ol></div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Для тих, хто переїхав у Франківськ жити. Купівля авто — це великі витрати та ризики. Довгострокова оренда від REIZ — це сервіс "під ключ". Ви обираєте авто, а ми дбаємо про його "здоров'я":<ol><li><span class='text-strong'>ТО:</span> Проходимо ТО.</li><li><span class='text-strong'>Страховка:</span> Слідкуємо за страховкою (повне КАСКО).</li><li><span class='text-strong'>Гума:</span> Вчасно "перевзуваємо" машину (у Франківську це критично важливо, бо зима тут настає раптово).</li></ol>Ви просто насолоджуєтесь комфортним життям у затишному європейському місті.</div>

<div class='editor_title'>Економ-клас: Зручність у центрі</div>
<div class='editor_text'>Історичний центр Франківська має багато вузьких односторонніх вулиць. Наші авто економ-класу (хетчбеки та компактні седани) — це ідеальний вибір для міста. Вони маневрені, легко паркуються біля Бастіону чи парку Шевченка і споживають мінімум пального.</div>

<div class='editor_title'>Переваги REIZ в Івано-Франківську</div>
<div class='editor_text'><ul><li>Аеропорт та Вокзал: Ми зустрінемо вас в Міжнародному аеропорту (IFO) або на залізничному вокзалі. Авто буде чекати вас одразу по прибуттю.</li><li>Стан авто: Після гірських доріг авто часто бувають брудними, але тільки не в REIZ. Ви отримуєте ідеально чисту машину після комплексної мийки.</li><li>Чесність: Політика пального "Full to Full". Ви отримуєте повний бак, щоб одразу їхати в гори.</li><li>Екіпірування: За запитом додамо в комплектацію дитяче крісло або кріплення для лиж.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Ми спрощуємо умови. Для багатьох моделей доступна опція оренди без застави при виборі повного страхового захисту. Це зручно для туристів, які хочуть витрачати кошти на враження, а не заморожувати їх на карті.</div>

<div class='editor_title'>Трансфер та водій</div>
<div class='editor_text'>Плануєте поїздку в Буковель, але боїтеся гірських доріг взимку? Замовте трансфер. Наш професійний водій зустріне вас в аеропорту Івано-Франківська і безпечно доставить до дверей готелю в горах на комфортабельному авто.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: Центральна частина міста, район Вокзалу, готель "Надія", район "Каскад".<br/>Платна подача: Крихівці, Угорники, Драгомирчани, а також доставка в Яремче чи Буковель. Вартість розраховується індивідуально.</div>

<div class='editor_title'>Безпека руху: Специфіка регіону</div>
<div class='editor_text'>Водіння на Прикарпатті має свої особливості:<ol><li><span class='text-strong'>Погода:</span> Погода змінюється миттєво. В місті може бути дощ, а за 30 км у горах — снігопад. Будьте готові.</li><li><span class='text-strong'>Велосипедисти:</span> У Франківську дуже розвинений велорух. Будьте уважні при поворотах направо та відкриванні дверей.</li><li><span class='text-strong'>Виїзд з міста:</span> Траса H-09 (на Львів та на Мукачево) завантажена. Плануйте час із запасом, особливо у п'ятницю ввечері та неділю.</li><li><span class='text-strong'>Алкоголь:</span> Нульова толерантність. Безпека на дорозі — наш пріоритет.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Ивано-Франковск — это идеальный хаб. Отсюда одинаково удобно ехать по делам во Львов или на отдых в Буковель. Но без собственного авто вы привязаны к расписанию автобусов или дорогим такси. Сервис REIZ предлагает прокат автомобилей, технически подготовленных к специфике региона. Мы понимаем, что дорога на Яремче может быть идеальной, а съезд к водопаду — грунтовым. Поэтому наши авто имеют проверенную подвеску, а зимой — лучшую резину.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Для города и коротких поездок</div>
<div class='editor_text'>Приехали поездом утром, а заселение в отель только в обед? Не теряйте время. Почасовая аренда — это возможность успеть больше.<ol><li><span class='text-strong'>В городе:</span> Посетите Ратушу, прогуляйтесь по знаменитой "Стометровке" или заедтье в Промприбор.Реновация.</li><li><span class='text-strong'>За городом:</span> Съездите в древний Галич или в Тысменицу.</li><li><span class='text-strong'>Тест-драйв:</span> Проверьте, комфортно ли вам управлять выбранным кроссовером, прежде чем отправляться на нем в горы на неделю.</li></ol></div>

<div class='editor_title'>Недельный тариф: Откройте Прикарпатье</div>
<div class='editor_text'>Ивано-Франковск — лучшая база для радиальных путешествий. Недельная аренда по фиксированному тарифу дает вам свободу. Спланируйте свой тур:<ol><li><span class='text-strong'>День 1:</span> Поездка к скалам Довбуша и водопаду Пробой в Яремче.</li><li><span class='text-strong'>День 2:</span> Релакс в Манявском ските и у Манявского водопада.</li><li><span class='text-strong'>День 3:</span> Гастротур — форелевые хозяйства и сыроварни Верховины.</li></ol>С собственным авто вы не зависите от гидов. Вы останавливаетесь там, где красивый вид, а не там, где остановился автобус.</div>

<div class='editor_title'>Аренда на месяц (Тариф "Бизнес")</div>
<div class='editor_text'>Ивано-Франковск стремительно развивается как IT-кластер и бизнес-центр. Если вы приехали сюда по работе надолго, тариф "Месяц" — это ваша экономия и статус.<ol><li><span class='text-strong'>Стоимость:</span> Значительно дешевле, чем каршеринг или ежедневное такси.</li><li><span class='text-strong'>Логистика:</span> Вы свободно перемещаетесь между офисом, домом и объектами в области.</li><li><span class='text-strong'>Гибкость:</span> Нужно поехать во Львов или Тернополь? Никаких проблем и доплат за выезд за пределы города.</li></ol></div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Для тех, кто переехал во Франковск жить. Покупка авто — это большие расходы и риски. Долгосрочная аренда от REIZ — это сервис "под ключ". Вы выбираете авто, а мы заботимся о его "здоровье":<ol><li><span class='text-strong'>ТО:</span> Проходим ТО.</li><li><span class='text-strong'>Страховка:</span> Следим за страховкой (полное КАСКО).</li><li><span class='text-strong'>Гума:</span> Вовремя "переобуваем" машину (во Франковске это критично важно, так как зима здесь наступает внезапно).</li></ol>Вы просто наслаждаетесь комфортной жизнью в уютном европейском городе.</div>

<div class='editor_title'>Эконом-класс: Удобство в центре</div>
<div class='editor_text'>Исторический центр Франковска имеет много узких односторонних улиц. Наши авто эконом-класса (хэтчбеки и компактные седаны) — это идеальный выбор для города. Они маневренные, легко паркуются возле Бастиона или парка Шевченко и потребляют минимум топлива.</div>

<div class='editor_title'>Преимущества REIZ в Ивано-Франковске</div>
<div class='editor_text'><ul><li>Аэропорт и Вокзал: Мы встретим вас в Международном аэропорту (IFO) или на железнодорожном вокзале. Авто будет ждать вас сразу по прибытию.</li><li>Состояние авто: После горных дорог авто часто бывают грязными, но только не в REIZ. Вы получаете идеально чистую машину после комплексной мойки.</li><li>Честность: Политика топлива "Full to Full". Вы получаете полный бак, чтобы сразу ехать в горы.</li><li>Экипировка: По запросу добавим в комплектацию детское кресло или крепления для лыж.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Мы упрощаем условия. Для многих моделей доступна опция аренды без залога при выборе полной страховой защиты. Это удобно для туристов, которые хотят тратить деньги на впечатления, а не замораживать их на карте.</div>

<div class='editor_title'>Трансфер и водитель</div>
<div class='editor_text'>Планируете поездку в Буковель, но боитесь горных дорог зимой? Закажите трансфер. Наш профессиональный водитель встретит вас в аэропорту Ивано-Франковска и безопасно доставит к дверям отеля в горах на комфортабельном авто.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: Центральная часть города, район Вокзала, отель "Надия", район "Каскад".<br/>Платная подача: Крыховцы, Угорники, Драгомирчаны, а также доставка в Яремче или Буковель. Стоимость рассчитывается индивидуально.</div>

<div class='editor_title'>Безопасность движения: Специфика региона</div>
<div class='editor_text'>Вождение на Прикарпатье имеет свои особенности:<ol><li><span class='text-strong'>Погода:</span> Погода меняется мгновенно. В городе может быть дождь, а в 30 км в горах — снегопад. Будьте готовы.</li><li><span class='text-strong'>Велосипедисты:</span> Во Франковске очень развито велодвижение. Будьте внимательны при поворотах направо и открывании дверей.</li><li><span class='text-strong'>Выезд из города:</span> Трасса H-09 (на Львов и на Мукачево) загружена. Планируйте время с запасом, особенно в пятницу вечером и воскресенье.</li><li><span class='text-strong'>Алкоголь:</span> Нулевая толерантность. Безопасность на дороге — наш приоритет.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Ivano-Frankivsk is the perfect hub. From here, it is equally convenient to travel on business to Lviv or for vacation to Bukovel. But without your own car, you are tied to bus schedules or expensive taxis. REIZ service offers car rental technically prepared for the specifics of the region. We understand that the road to Yaremche can be perfect, but the exit to the waterfall might be unpaved. That is why our cars have tested suspension, and in winter — the best tires.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: For the City and Short Trips</div>
<div class='editor_text'>Arrived by train in the morning, but hotel check-in is only in the afternoon? Don't waste time. Hourly rental is an opportunity to do more.<ol><li><span class='text-strong'>In the City:</span> Visit the Town Hall, walk along the famous "Stometrivka" (Hundred Meter Street), or drop by Promprylad.Renovation.</li><li><span class='text-strong'>Outside the City:</span> Drive to ancient Halych or Tysmenytsia.</li><li><span class='text-strong'>Test Drive:</span> Check if you are comfortable driving the chosen crossover before heading to the mountains for a week.</li></ol></div>

<div class='editor_title'>Weekly Rate: Discover Prykarpattia</div>
<div class='editor_text'>Ivano-Frankivsk is the best base for radial trips. Weekly rental at a fixed rate gives you freedom. Plan your tour:<ol><li><span class='text-strong'>Day 1:</span> Trip to Dovbush Rocks and Probiy Waterfall in Yaremche.</li><li><span class='text-strong'>Day 2:</span> Relax at Manyava Skete and near Manyava Waterfall.</li><li><span class='text-strong'>Day 3:</span> Gastro-tour — trout farms and cheese dairies of Verkhovyna.</li></ol>With your own car, you don't depend on guides. You stop where the view is beautiful, not where the bus stopped.</div>

<div class='editor_title'>Monthly Rental ("Business" Tariff)</div>
<div class='editor_text'>Ivano-Frankivsk is rapidly developing as an IT cluster and business center. If you came here for work for a long time, the "Month" tariff is your saving and status.<ol><li><span class='text-strong'>Cost:</span> Significantly cheaper than car sharing or daily taxi.</li><li><span class='text-strong'>Logistics:</span> You freely move between the office, home, and sites in the region.</li><li><span class='text-strong'>Flexibility:</span> Need to go to Lviv or Ternopil? No problems or extra charges for leaving the city limits.</li></ol></div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>For those who moved to Frankivsk to live. Buying a car means big expenses and risks. Long-term rental from REIZ is a turnkey service. You choose the car, and we take care of its "health":<ol><li><span class='text-strong'>Maintenance:</span> We pass technical inspections.</li><li><span class='text-strong'>Insurance:</span> We monitor insurance (full CASCO).</li><li><span class='text-strong'>Tires:</span> We change tires on time (in Frankivsk this is critically important, as winter comes here suddenly).</li></ol>You simply enjoy a comfortable life in a cozy European city.</div>

<div class='editor_title'>Economy Class: Convenience in the Center</div>
<div class='editor_text'>The historic center of Frankivsk has many narrow one-way streets. Our economy class cars (hatchbacks and compact sedans) are the ideal choice for the city. They are maneuverable, easy to park near the Bastion or Shevchenko Park, and consume minimum fuel.</div>

<div class='editor_title'>Advantages of REIZ in Ivano-Frankivsk</div>
<div class='editor_text'><ul><li>Airport and Train Station: We will meet you at the International Airport (IFO) or the Railway Station. The car will be waiting for you immediately upon arrival.</li><li>Car Condition: After mountain roads, cars can often be dirty, but not at REIZ. You get a perfectly clean car after a complex wash.</li><li>Honesty: "Full to Full" fuel policy. You get a full tank to drive straight to the mountains.</li><li>Equipment: Upon request, we will add a child seat or ski racks to the package.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>We simplify the conditions. For many models, a no-deposit rental option is available when choosing full insurance coverage. This is convenient for tourists who want to spend money on experiences, not freeze it on a card.</div>

<div class='editor_title'>Transfer and Chauffeur</div>
<div class='editor_text'>Planning a trip to Bukovel but afraid of mountain roads in winter? Order a transfer. Our professional driver will meet you at Ivano-Frankivsk airport and safely deliver you to the door of the hotel in the mountains in a comfortable car.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: Central part of the city, Railway Station area, "Nadiya" Hotel, "Cascade" district.<br/>Paid Delivery: Krykhivtsi, Uhornyky, Drahomyrchany, as well as delivery to Yaremche or Bukovel. The cost is calculated individually.</div>

<div class='editor_title'>Traffic Safety: Specifics of the Region</div>
<div class='editor_text'>Driving in Prykarpattia has its features:<ol><li><span class='text-strong'>Weather:</span> The weather changes instantly. It can be raining in the city, and snowing 30 km away in the mountains. Be prepared.</li><li><span class='text-strong'>Cyclists:</span> Cycling is very developed in Frankivsk. Be careful when turning right and opening doors.</li><li><span class='text-strong'>Exit from the City:</span> The H-09 highway (to Lviv and Mukachevo) is busy. Plan time with a margin, especially on Friday evenings and Sundays.</li><li><span class='text-strong'>Alcohol:</span> Zero tolerance. Safety on the road is our priority.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateSkhidnytsiaEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Східниця — це курорт без кордонів. Мінеральні джерела тут не зібрані в одному бюветі, як у Трускавці, а розкидані лісами та пагорбами. Пішки обійти джерела №1, №18 та №2С за один день — виснажливе завдання, особливо для людей поважного віку чи сімей з дітьми. Сервіс REIZ пропонує ідеальне рішення — власний автомобіль на час відпочинку. Ми рекомендуємо обирати кросовери з вищим кліренсом, щоб ви могли комфортно під'їхати до будь-якого джерела, навіть якщо дорога туди — це лісова гравійка.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Тест гірських доріг</div>
<div class='editor_text'>Сумніваєтесь, чи впораєтесь із місцевим рельєфом? Візьміть авто на добу.<ol><li><span class='text-strong'>Перевал:</span> Проїдьтеся знаменитим Східницьким перевалом. Це чудовий тест на керованість та роботу гальм.</li><li><span class='text-strong'>Джерела:</span> Спробуйте доїхати до дальніх джерел у лісі.</li><li><span class='text-strong'>Тустань:</span> Всього 8 км від Східниці розташована наскельна фортеця Тустань. Поїздка туди на орендованому авто займе 15 хвилин і подарує неймовірні краєвиди.</li></ol></div>

<div class='editor_title'>Тижнева оренда: Комфортне лікування</div>
<div class='editor_text'>Стандартний курс вживання "Нафтусі" — мінімум тиждень. Оренда авто на цей термін перетворить лікування на задоволення. Вам не доведеться мокнути під дощем в очікуванні таксі або йти пішки з важкими бутлями води в гору. Ви отримуєте свободу:<ol><li><span class='text-strong'>Зранку:</span> Поїздка до джерела.</li><li><span class='text-strong'>Вдень:</span> Обід у форелевому господарстві в Опаці.</li><li><span class='text-strong'>Ввечері:</span> Шопінг у Бориславі чи Дрогобичі.</li></ol>Фіксований тижневий тариф значно вигідніший за щоденні виклики місцевих перевізників.</div>

<div class='editor_title'>Місячна оренда (Тариф "Відпочинок + Робота")</div>
<div class='editor_text'>Східниця — ідеальне місце для втечі від міського шуму. Багато хто орендує тут котеджі на місяць. Тариф "30 днів" від REIZ дозволяє вам мати під рукою надійне авто за ціною, співмірною з довгостроковим лізингом. Ви живете в тиші гір, але залишаєтесь мобільними. Потрібно зустріти партнера у Львові? Дві години мальовничою дорогою — і ви на місці. Потрібно закупити продукти? Великий багажник нашого авто вмістить усе необхідне.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Для власників готелів, вілл та тих, хто будує свій дім у горах. Власне авто в горах швидко зношується. Оренда від 3 місяців перекладає амортизаційні витрати на нас. Ми слідкуємо за ходовою частиною, яка страждає від каміння, та вчасно змінюємо гуму на зимову (а зима на перевалі сувора). Ви просто користуєтесь справним позашляховиком.</div>

<div class='editor_title'>Економ-клас: Чи впорається він у горах?</div>
<div class='editor_text'>Так! Сучасні авто економ-класу в нашому парку мають достатню потужність, щоб долати східницькі підйоми. Якщо ви плануєте їздити переважно асфальтованими вулицями (вул. Шевченка, Стоцького) та трасою на Трускавець — це чудовий варіант заощадити. Компактність авто дозволить легко роз'їхатися із зустрічним транспортом на вузьких ділянках.</div>

<div class='editor_title'>Чому у Східниці обирають REIZ</div>
<div class='editor_text'><ul><li>Доставка до вілли: Східниця розтягнута на кілометри. Ми не змусимо вас йти до нас. Ми приженемо авто прямо до воріт вашого готелю ("Три Сини", "Київська Русь", "ТуСтань" та ін.).</li><li>Чистота: Пилюка гірських доріг не має шансів. Ви отримуєте авто після мийки та чистки салону.</li><li>Безпека: Ми ретельно перевіряємо гальма, адже розуміємо, що вам доведеться часто спускатися з гір.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Відпочивайте без зайвих думок про гроші. При виборі пакету повного страхування (Super CDW) ми можемо надати авто без застави. Насолоджуйтесь природою, а ризики подряпин чи сколів ми беремо на себе.</div>

<div class='editor_title'>Трансфер та водій</div>
<div class='editor_text'>Дорога до Східниці через перевал може лякати недосвідчених водіїв, особливо взимку. Замовте трансфер з професійним водієм від REIZ. Ми зустрінемо вас у Львові чи Трускавці і безпечно доставимо до готелю на комфортному авто преміум-класу.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: Вся територія смт Східниця (включаючи віддалені готелі на пагорбах).<br/>Платна подача: Урич (Тустань), Новий Кропивник, Рибник, Майдан.</div>

<div class='editor_title'>Безпека руху: Гірська специфіка</div>
<div class='editor_text'>Східниця має свої правила дороги:<ol><li><span class='text-strong'>Перевал:</span> Дорога з Борислава — це крутий серпантин ("тещин язик"). Не обганяйте на поворотах і гальмуйте двигуном на спуску.</li><li><span class='text-strong'>Гравій:</span> Під'їзди до багатьох джерел (наприклад, №25, №26) — це гравійна дорога. Їдьте повільно, щоб каміння не пошкодило авто.</li><li><span class='text-strong'>Вузькі проїзди:</span> Багато вуличок розраховані лише на одне авто. Будьте ввічливі та пропускайте тих, хто їде вгору.</li><li><span class='text-strong'>Алкоголь:</span> Нульова толерантність. Гірські дороги не пробачають неуважності.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Сходница — это курорт без границ. Минеральные источники здесь не собраны в одном бювете, как в Трускавце, а разбросаны по лесам и холмам. Обойти источники №1, №18 и №2С пешком за один день — утомительная задача. Сервис REIZ предлагает идеальное решение — личный автомобиль на время отдыха. Мы рекомендуем выбирать кроссоверы с высоким клиренсом, чтобы вы могли комфортно подъехать к любому источнику, даже если дорога туда — лесная грунтовка.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Тест горных дорог</div>
<div class='editor_text'>Сомневаетесь, справитесь ли с местным рельефом? Возьмите авто на сутки.<ol><li><span class='text-strong'>Перевал:</span> Проедьтесь по знаменитому Сходницкому перевалу. Это отличный тест на управляемость.</li><li><span class='text-strong'>Источники:</span> Попробуйте доехать до дальних источников в лесу.</li><li><span class='text-strong'>Тустань:</span> Всего в 8 км от Сходницы расположена наскальная крепость Тустань. Поездка туда на арендованном авто займет 15 минут.</li></ol></div>

<div class='editor_title'>Недельная аренда: Комфортное лечение</div>
<div class='editor_text'>Стандартный курс приема "Нафтуси" — минимум неделя. Аренда авто на этот срок превратит лечение в удовольствие. Вам не придется мокнуть под дождем в ожидании такси или идти пешком с тяжелыми бутылками воды в гору. Вы получаете свободу:<ol><li><span class='text-strong'>Утром:</span> Поездка к источнику.</li><li><span class='text-strong'>Днем:</span> Обед в форелевом хозяйстве в Опаке.</li><li><span class='text-strong'>Вечером:</span> Шопинг в Бориславе или Дрогобыче.</li></ol>Фиксированный недельный тариф значительно выгоднее ежедневных вызовов местных перевозчиков.</div>

<div class='editor_title'>Аренда на месяц (Тариф "Отдых + Работа")</div>
<div class='editor_text'>Сходница — идеальное место для побега от городского шума. Многие арендуют здесь коттеджи на месяц. Тариф "30 дней" от REIZ позволяет вам иметь под рукой надежное авто по цене, соизмеримой с долгосрочным лизингом. Вы живете в тишине гор, но остаетесь мобильными. Нужно встретить партнера во Львове? Два часа по живописной дороге — и вы на месте. Нужно закупить продукты? Большой багажник нашего авто вместит все необходимое.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Для владельцев отелей, вилл и тех, кто строит свой дом в горах. Личное авто в горах быстро изнашивается. Аренда от 3 месяцев перекладывает амортизационные расходы на нас. Мы следим за ходовой частью и вовремя меняем резину на зимнюю (а зима на перевале суровая). Вы просто пользуетесь исправным внедорожником.</div>

<div class='editor_title'>Эконом-класс: Справится ли он в горах?</div>
<div class='editor_text'>Да! Современные авто эконом-класса в нашем парке имеют достаточную мощность, чтобы преодолевать сходницкие подъемы. Если вы планируете ездить преимущественно по асфальтированным улицам и трассе на Трускавец — это отличный вариант сэкономить. Компактность авто позволит легко разъехаться со встречным транспортом на узких участках.</div>

<div class='editor_title'>Почему в Сходнице выбирают REIZ</div>
<div class='editor_text'><ul><li>Доставка к вилле: Сходница растянута на километры. Мы не заставим вас идти к нам. Мы пригоним авто прямо к воротам вашего отеля ("Три Сына", "Киевская Русь", "ТуСтань" и др.).</li><li>Чистота: Пыль горных дорог не имеет шансов. Вы получаете авто после мойки и чистки салона.</li><li>Безопасность: Мы тщательно проверяем тормоза, ведь понимаем, что вам придется часто спускаться с гор.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Отдыхайте без лишних мыслей о деньгах. При выборе пакета полного страхования (Super CDW) мы можем предоставить авто без залога. Наслаждайтесь природой, а риски царапин мы берем на себя.</div>

<div class='editor_title'>Трансфер и водитель</div>
<div class='editor_text'>Дорога в Сходницу через перевал может пугать неопытных водителей, особенно зимой. Закажите трансфер с профессиональным водителем от REIZ. Мы встретим вас во Львове или Трускавце и безопасно доставим в отель на комфортном авто премиум-класса.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: Вся территория пгт Сходница (включая отдаленные отели на холмах).<br/>Платная подача: Урыч (Тустань), Новый Кропивник, Рыбник, Майдан.</div>

<div class='editor_title'>Безопасность движения: Горная специфика</div>
<div class='editor_text'>У Сходницы свои правила дороги:<ol><li><span class='text-strong'>Перевал:</span> Дорога из Борислава — это крутой серпантин. Не обгоняйте на поворотах и тормозите двигателем на спуске.</li><li><span class='text-strong'>Гравий:</span> Подъезды ко многим источникам — это гравийная дорога. Езжайте медленно, чтобы камни не повредили авто.</li><li><span class='text-strong'>Узкие проезды:</span> Многие улочки рассчитаны только на одно авто. Будьте вежливы и пропускайте тех, кто едет вверх.</li><li><span class='text-strong'>Алкоголь:</span> Нулевая толерантность.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Skhidnytsia is a resort without borders. Mineral springs here are not collected in one pump room, as in Truskavets, but are scattered through forests and hills. Walking around springs No. 1, No. 18, and No. 2C in one day is an exhausting task. REIZ service offers the perfect solution — a personal car for the duration of your vacation. We recommend choosing crossovers with higher ground clearance so that you can comfortably drive up to any spring, even if the road there is a forest gravel path.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: Mountain Road Test</div>
<div class='editor_text'>Doubt if you can handle the local terrain? Take a car for a day.<ol><li><span class='text-strong'>The Pass:</span> Drive through the famous Skhidnytsia Pass. This is a great test for handling and brakes.</li><li><span class='text-strong'>Springs:</span> Try to drive to distant springs in the forest.</li><li><span class='text-strong'>Tustan:</span> Just 8 km from Skhidnytsia lies the Tustan rock fortress. A trip there by rented car will take 15 minutes and offer incredible views.</li></ol></div>

<div class='editor_title'>Weekly Rental: Comfortable Treatment</div>
<div class='editor_text'>The standard course of drinking mineral water is at least a week. Renting a car for this period will turn treatment into pleasure. You won't have to get wet in the rain waiting for a taxi or walk uphill with heavy water bottles. You get freedom:<ol><li><span class='text-strong'>Morning:</span> Trip to the spring.</li><li><span class='text-strong'>Afternoon:</span> Lunch at a trout farm in Opaka.</li><li><span class='text-strong'>Evening:</span> Shopping in Boryslav or Drohobych.</li></ol>A fixed weekly rate is much more profitable than daily calls to local carriers.</div>

<div class='editor_title'>Monthly Rental ("Vacation + Work" Tariff)</div>
<div class='editor_text'>Skhidnytsia is an ideal place to escape from city noise. Many people rent cottages here for a month. The "30 Days" tariff from REIZ allows you to have a reliable car at hand for a price comparable to long-term leasing. You live in the silence of the mountains but remain mobile. Need to meet a partner in Lviv? Two hours on a picturesque road — and you are there. Need to purchase groceries? The large trunk of our car will fit everything you need.</div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>For owners of hotels, villas, and those building their home in the mountains. A personal car wears out quickly in the mountains. Rental from 3 months shifts depreciation costs to us. We monitor the chassis, which suffers from stones, and change tires to winter ones on time (and winter on the pass is severe). You simply use a serviceable SUV.</div>

<div class='editor_title'>Economy Class: Can It Handle the Mountains?</div>
<div class='editor_text'>Yes! Modern economy class cars in our fleet have enough power to overcome Skhidnytsia climbs. If you plan to drive mainly on paved streets and the highway to Truskavets, this is a great option to save money. The compactness of the car will allow you to easily pass oncoming traffic on narrow sections.</div>

<div class='editor_title'>Why Choose REIZ in Skhidnytsia</div>
<div class='editor_text'><ul><li>Delivery to Villa: Skhidnytsia stretches for kilometers. We won't make you walk to us. We will drive the car right to the gates of your hotel ("Three Sons", "Kyivska Rus", "TuStan", etc.).</li><li>Cleanliness: Mountain road dust has no chance. You get a car after washing and interior cleaning.</li><li>Safety: We carefully check the brakes, knowing that you will have to descend from the mountains often.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>Relax without unnecessary thoughts about money. When choosing a full insurance package (Super CDW), we can provide a car without a deposit. Enjoy nature, and we take the risks of scratches on ourselves.</div>

<div class='editor_title'>Transfer and Chauffeur</div>
<div class='editor_text'>The road to Skhidnytsia through the pass can scare inexperienced drivers, especially in winter. Order a transfer with a professional driver from REIZ. We will meet you in Lviv or Truskavets and safely deliver you to the hotel in a comfortable premium car.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: The entire territory of Skhidnytsia (including remote hotels on the hills).<br/>Paid Delivery: Urych (Tustan), Novyi Kropyvnyk, Rybnyk, Maidan.</div>

<div class='editor_title'>Traffic Safety: Mountain Specifics</div>
<div class='editor_text'>Skhidnytsia has its own road rules:<ol><li><span class='text-strong'>The Pass:</span> The road from Boryslav is a steep serpentine. Do not overtake on turns and use engine braking on the descent.</li><li><span class='text-strong'>Gravel:</span> Approaches to many springs are gravel roads. Drive slowly so stones don't damage the car.</li><li><span class='text-strong'>Narrow Passages:</span> Many streets are designed for only one car. Be polite and give way to those driving uphill.</li><li><span class='text-strong'>Alcohol:</span> Zero tolerance. Mountain roads do not forgive inattention.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateUzhhorodEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Ужгород — місто, де каву п'ють повільно, а справи вирішують швидко. Це стратегічний вузол на кордоні зі Словаччиною та Угорщиною. Чи ви приїхали милуватися цвітінням сакур, чи вирішувати питання експорту — без авто тут складно. Сервіс REIZ в Ужгороді пропонує автомобілі, готові до будь-яких сценаріїв: від компактних моделей для вузьких вуличок центру до надійних універсалів для поїздок у гори чи за кордон.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Кава на Корзо та справи</div>
<div class='editor_text'>Ужгород можна проїхати за 20 хвилин, але насолоджуватися ним треба довго. Погодинна оренда — це ваш спосіб встигнути все:<ol><li><span class='text-strong'>Тест-драйв:</span> Спробуйте, як авто долає бруківку біля Хрестовоздвиженського собору.</li><li><span class='text-strong'>Мобільність:</span> Встигніть на зустріч у "Боздоський парк", потім на обід на набережну Незалежності, а ввечері — зустріти потяг.</li><li><span class='text-strong'>Перевірка:</span> Переконайтеся, що обраний клас авто підходить вам за комфортом, перш ніж їхати в тур Закарпаттям.</li></ol></div>

<div class='editor_title'>Тижнева оренда: Термальний та винний тур</div>
<div class='editor_text'>Закарпаття — це регіон, який треба досліджувати на колесах. Тижнева оренда від REIZ відкриває перед вами всі двері. За фіксовану ціну ви отримуєте свободу руху:<ol><li><span class='text-strong'>Релакс:</span> Поїдьте в Лумшори "варитися" в чанах або в Косино на термальні води.</li><li><span class='text-strong'>Гори:</span> Відвідайте озеро Синевир або водоспад Шипіт.</li><li><span class='text-strong'>Вино:</span> Влаштуйте тур винними підвалами Середнього та Берегового (пам'ятайте про водія!).</li></ol>Громадський транспорт у горах ходить рідко, а таксі на такі відстані коштує дорого. Власне авто — це економія та комфорт.</div>

<div class='editor_title'>Оренда на місяць (Тариф "Бізнес та Кордон")</div>
<div class='editor_text'>Ужгород — це логістичний хаб. Для тих, хто працює з європейськими партнерами або чекає на виїзд, ми пропонуємо тариф "Місяць".<ol><li><span class='text-strong'>Виїзд за кордон:</span> За попереднім запитом ми готуємо документи для виїзду в країни ЄС. Ужгород — ідеальна точка старту, адже до кордону всього 3 км.</li><li><span class='text-strong'>Економія:</span> Вартість оренди на місяць значно нижча за подобову.</li><li><span class='text-strong'>Змінність:</span> Потрібен бус для речей або седан для зустрічей? Ми підберемо авто під ваші задачі.</li></ol></div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Для тих, хто обрав Ужгород для життя. Це місто затишне і комфортне, і володіння авто тут має бути таким самим. Оренда від 3 місяців позбавляє вас клопоту. Ми дбаємо про те, щоб авто було "взуте" по сезону (зими в горах бувають сніжними), застраховане і справне. Ви просто насолоджуєтесь життям у найзахіднішому обласному центрі України.</div>

<div class='editor_title'>Економ-клас: Ідеально для старого міста</div>
<div class='editor_text'>Центр Ужгорода — це лабіринт вузьких односторонніх вулиць. Наші авто економ-класу — найкращий вибір для міста. Вони маневрені, легко паркуються біля Ужгородського замку чи філармонії і споживають мінімум пального.</div>

<div class='editor_title'>Чому в Ужгороді обирають REIZ</div>
<div class='editor_text'><ul><li>Зустріч на вокзалі: Залізничний вокзал Ужгорода — головні ворота міста. Ми подамо авто прямо до перону вашого потяга (Київ, Харків, Одеса).</li><li>Технічний стан: Гірські дороги вимагають ідеальних гальм та ходової. Ми перевіряємо кожне авто перед видачею.</li><li>Документи: Ми знаємо специфіку прикордонної зони і допоможемо з оформленням необхідних паперів.</li><li>Підтримка: Ми на зв'язку 24/7, щоб допомогти вам з маршрутом чи технічними питаннями.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Ми довіряємо нашим клієнтам. При оформленні повного страхування (Super CDW) ви можете орендувати авто без внесення депозиту. Подорожуйте Закарпаттям без зайвих фінансових блокувань.</div>

<div class='editor_title'>Трансфер та водій</div>
<div class='editor_text'>Хочете поїхати на дегустацію закарпатських вин або сирів? Не ризикуйте правами. Замовте авто з водієм. Ми відвеземо вас у найкращі шато регіону і доставимо назад у готель з максимальним комфортом.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: В межах Ужгорода (пл. Корятовича, пр. Свободи, Вокзал, р-н "Дастор").<br/>Платна подача: Минай, Чоп, Мукачево, Середнє, Перечин. Вартість залежить від відстані.</div>

<div class='editor_title'>Безпека руху в Ужгороді</div>
<div class='editor_text'>Специфіка найменшого обласного центру:<ol><li><span class='text-strong'>Бруківка:</span> Багато вулиць в центрі (Капушанська, Швабська) вимощені бруківкою. У дощ вона дуже слизька — тримайте дистанцію.</li><li><span class='text-strong'>Односторонній рух:</span> Центр міста має складну схему руху. Уважно дивіться на знаки, щоб не виїхати "проти шерсті".</li><li><span class='text-strong'>Пішоходи:</span> Ужгородці люблять гуляти. Будьте уважні на нерегульованих переходах, особливо на набережній.</li><li><span class='text-strong'>Кордон:</span> На під'їздах до КПП можуть бути черги з вантажівок. Будьте уважні, об'їжджаючи їх.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Ужгород — город, где кофе пьют медленно, а дела решают быстро. Это стратегический узел на границе со Словакией и Венгрией. Приехали ли вы любоваться цветением сакур или решать вопросы экспорта — без авто здесь сложно. Сервис REIZ в Ужгороде предлагает автомобили, готовые к любым сценариям: от компактных моделей для узких улочек центра до надежных универсалов для поездок в горы или за границу.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Кофе на Корзо и дела</div>
<div class='editor_text'>Ужгород можно проехать за 20 минут, но наслаждаться им нужно долго. Почасовая аренда — это ваш способ успеть всё:<ol><li><span class='text-strong'>Тест-драйв:</span> Попробуйте, как авто преодолевает брусчатку возле Крестовоздвиженского собора.</li><li><span class='text-strong'>Мобильность:</span> Успейте на встречу в "Боздошский парк", затем на обед на набережную Независимости, а вечером — встретить поезд.</li><li><span class='text-strong'>Проверка:</span> Убедитесь, что выбранный класс авто подходит вам по комфорту, прежде чем ехать в тур по Закарпатью.</li></ol></div>

<div class='editor_title'>Недельная аренда: Термальный и винный тур</div>
<div class='editor_text'>Закарпатье — это регион, который нужно исследовать на колесах. Недельная аренда от REIZ открывает перед вами все двери. За фиксированную цену вы получаете свободу движения:<ol><li><span class='text-strong'>Релакс:</span> Поезжайте в Лумшоры "вариться" в чанах или в Косино на термальные воды.</li><li><span class='text-strong'>Горы:</span> Посетите озеро Синевир или водопад Шипот.</li><li><span class='text-strong'>Вино:</span> Устройте тур по винным подвалам Среднего и Берегово (помните о водителе!).</li></ol>Общественный транспорт в горах ходит редко, а такси на такие расстояния стоит дорого. Свое авто — это экономия и комфорт.</div>

<div class='editor_title'>Аренда на месяц (Тариф "Бизнес и Граница")</div>
<div class='editor_text'>Ужгород — это логистический хаб. Для тех, кто работает с европейскими партнерами или ждет выезда, мы предлагаем тариф "Месяц".<ol><li><span class='text-strong'>Выезд за границу:</span> По предварительному запросу мы готовим документы для выезда в страны ЕС. Ужгород — идеальная точка старта, ведь до границы всего 3 км.</li><li><span class='text-strong'>Экономия:</span> Стоимость аренды на месяц значительно ниже посуточной.</li><li><span class='text-strong'>Сменность:</span> Нужен бус для вещей или седан для встреч? Мы подберем авто под ваши задачи.</li></ol></div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Для тех, кто выбрал Ужгород для жизни. Этот город уютный и комфортный, и владение авто здесь должно быть таким же. Аренда от 3 месяцев избавляет вас от хлопот. Мы заботимся о том, чтобы авто было "обуто" по сезону (зимы в горах бывают снежными), застраховано и исправно. Вы просто наслаждаетесь жизнью в самом западном областном центре Украины.</div>

<div class='editor_title'>Эконом-класс: Идеально для старого города</div>
<div class='editor_text'>Центр Ужгорода — это лабиринт узких односторонних улиц. Наши авто эконом-класса — лучший выбор для города. Они маневренные, легко паркуются возле Ужгородского замка или филармонии и потребляют минимум топлива.</div>

<div class='editor_title'>Почему в Ужгороде выбирают REIZ</div>
<div class='editor_text'><ul><li>Встреча на вокзале: Ж/Д вокзал Ужгорода — главные ворота города. Мы подадим авто прямо к перрону вашего поезда.</li><li>Техническое состояние: Горные дороги требуют идеальных тормозов и ходовой. Мы проверяем каждое авто перед выдачей.</li><li>Документы: Мы знаем специфику пограничной зоны и поможем с оформлением необходимых бумаг.</li><li>Поддержка: Мы на связи 24/7, чтобы помочь вам с маршрутом или техническими вопросами.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Мы доверяем нашим клиентам. При оформлении полного страхования (Super CDW) вы можете арендовать авто без внесения депозита. Путешествуйте по Закарпатью без лишних финансовых блокировок.</div>

<div class='editor_title'>Трансфер и водитель</div>
<div class='editor_text'>Хотите поехать на дегустацию закарпатских вин или сыров? Не рискуйте правами. Закажите авто с водителем. Мы отвезем вас в лучшие шато региона и доставим обратно в отель с максимальным комфортом.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: В пределах Ужгорода (пл. Корятовича, пр. Свободы, Вокзал, р-н "Дастор").<br/>Платная подача: Минай, Чоп, Мукачево, Среднее, Перечин. Стоимость зависит от расстояния.</div>

<div class='editor_title'>Безопасность движения в Ужгороде</div>
<div class='editor_text'>Специфика самого маленького областного центра:<ol><li><span class='text-strong'>Брусчатка:</span> Многие улицы в центре (Капушанская, Швабская) вымощены камнем. В дождь она очень скользкая — держите дистанцию.</li><li><span class='text-strong'>Одностороннее движение:</span> Центр города имеет сложную схему движения. Внимательно смотрите на знаки.</li><li><span class='text-strong'>Пешеходы:</span> Ужгородцы любят гулять. Будьте внимательны на нерегулируемых переходах.</li><li><span class='text-strong'>Граница:</span> На подъездах к КПП могут быть очереди из грузовиков. Будьте внимательны, объезжая их.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Uzhhorod is a city where coffee is drunk slowly, and business is done quickly. It is a strategic hub on the border with Slovakia and Hungary. Whether you came to admire the cherry blossoms or solve export issues, it is difficult without a car here. REIZ service in Uzhhorod offers cars ready for any scenario: from compact models for the narrow streets of the center to reliable estate cars for trips to the mountains or abroad.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: Coffee on Korzo and Business</div>
<div class='editor_text'>You can drive through Uzhhorod in 20 minutes, but you need to enjoy it for a long time. Hourly rental is your way to be on time everywhere:<ol><li><span class='text-strong'>Test Drive:</span> Try how the car overcomes the cobblestones near the Holy Cross Cathedral.</li><li><span class='text-strong'>Mobility:</span> Make it to a meeting in Bozdosh Park, then to lunch on the Independence Embankment, and in the evening — meet the train.</li><li><span class='text-strong'>Check:</span> Make sure the chosen car class suits your comfort needs before going on a tour of Zakarpattia.</li></ol></div>

<div class='editor_title'>Weekly Rental: Thermal and Wine Tour</div>
<div class='editor_text'>Zakarpattia is a region that needs to be explored on wheels. Weekly rental from REIZ opens all doors for you. For a fixed price, you get freedom of movement:<ol><li><span class='text-strong'>Relax:</span> Go to Lumshory to "boil" in vats (chan) or to Kosyno for thermal waters.</li><li><span class='text-strong'>Mountains:</span> Visit Lake Synevyr or Shypit Waterfall.</li><li><span class='text-strong'>Wine:</span> Arrange a tour of the wine cellars of Serednie and Berehove (remember about the driver!).</li></ol>Public transport runs rarely in the mountains, and taxis for such distances are expensive. Your own car means savings and comfort.</div>

<div class='editor_title'>Monthly Rental ("Business and Border" Tariff)</div>
<div class='editor_text'>Uzhhorod is a logistics hub. For those working with European partners or waiting for departure, we offer the "Month" tariff.<ol><li><span class='text-strong'>Travel Abroad:</span> Upon prior request, we prepare documents for travel to EU countries. Uzhhorod is the ideal starting point, as the border is only 3 km away.</li><li><span class='text-strong'>Savings:</span> The cost of monthly rental is significantly lower than daily rental.</li><li><span class='text-strong'>Flexibility:</span> Need a van for things or a sedan for meetings? We will select a car for your tasks.</li></ol></div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>For those who chose Uzhhorod for life. This city is cozy and comfortable, and owning a car here should be the same. Rental from 3 months relieves you of hassle. We ensure the car is "shod" for the season (winters in the mountains can be snowy), insured, and serviceable. You simply enjoy life in the westernmost regional center of Ukraine.</div>

<div class='editor_title'>Economy Class: Ideal for the Old City</div>
<div class='editor_text'>The center of Uzhhorod is a labyrinth of narrow one-way streets. Our economy class cars are the best choice for the city. They are maneuverable, easy to park near Uzhhorod Castle or the Philharmonic, and consume minimum fuel.</div>

<div class='editor_title'>Why Choose REIZ in Uzhhorod</div>
<div class='editor_text'><ul><li>Meeting at the Station: Uzhhorod Railway Station is the main gate of the city. We will deliver the car directly to the platform of your train.</li><li>Technical Condition: Mountain roads require perfect brakes and chassis. We check every car before delivery.</li><li>Documents: We know the specifics of the border zone and will help with the necessary paperwork.</li><li>Support: We are in touch 24/7, to help you with routes or technical questions.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>We trust our clients. When purchasing full insurance (Super CDW), you can rent a car without a deposit. Travel around Zakarpattia without unnecessary financial blocks.</div>

<div class='editor_title'>Chauffeur Services</div>
<div class='editor_text'>Want to go for a tasting of Transcarpathian wines or cheeses? Don't risk your license. Order a car with a driver. We will take you to the best chateaus of the region and deliver you back to the hotel with maximum comfort.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: Within Uzhhorod (Koryatovich Sq., Svobody Ave., Train Station, "Dastor" area).<br/>Paid Delivery: Mynai, Chop, Mukachevo, Serednie, Perechyn. The cost depends on the distance.</div>

<div class='editor_title'>Traffic Safety in Uzhhorod</div>
<div class='editor_text'>Specifics of the smallest regional center:<ol><li><span class='text-strong'>Cobblestones:</span> Many streets in the center (Kapushanska, Shvabska) are paved with stone. In the rain, it is very slippery — keep your distance.</li><li><span class='text-strong'>One-Way Traffic:</span> The city center has a complex traffic scheme. Watch the signs carefully.</li><li><span class='text-strong'>Pedestrians:</span> Uzhhorod residents love to walk. Be careful at uncontrolled crossings, especially on the embankment.</li><li><span class='text-strong'>Border:</span> There may be queues of trucks on the approaches to the checkpoint. Be careful when bypassing them.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateVinnytsiaEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Вінниця стабільно очолює рейтинги найкомфортніших міст України. Це стратегічний вузол, що з'єднує Київ, Одесу та Захід. Тут перетинаються шляхи бізнесу та туризму. Сервіс REIZ пропонує прокат автомобілів, який відповідає високим стандартам міста. Незалежно від того, чи потрібно вам зустріти партнерів на вокзалі, чи ви плануєте вікенд по замках Поділля — у нас є ідеальне авто. Забудьте про графік тролейбусів: з власним авто ви встигнете відвідати ставку "Вервольф" і повечеряти на Соборній в один день.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Тест-драйв "Містом ідей"</div>
<div class='editor_text'>Вінниця компактна, але насичена. Погодинна оренда — це ваш інструмент для швидких рішень.<ol><li><span class='text-strong'>Туризм:</span> Всього за кілька годин ви можете відвідати Національний музей-садибу М.І. Пирогова та Водонапірну вежу в центрі.</li><li><span class='text-strong'>Бізнес:</span> Проведіть зустріч у бізнес-центрі на Магістратській, а потім з комфортом дістаньтеся до індустріального парку.</li><li><span class='text-strong'>Тест:</span> Хочете купити авто, але сумніваєтесь? Візьміть аналогічну модель у нас на добу і перевірте її на вінницьких дорогах.</li></ol></div>

<div class='editor_title'>Тижнева оренда: Палаци та каньйони</div>
<div class='editor_text'>Вінниччина — це край, який неможливо пізнати з вікна автобуса. Тижневий тариф дає вам ключі від прихованих скарбів регіону. Сплануйте свій гранд-тур:<ol><li><span class='text-strong'>Тульчин:</span> Відвідайте "Подільський Версаль" — палац Потоцьких.</li><li><span class='text-strong'>Немирів:</span> Прогуляйтеся валами Великого скіфського городища.</li><li><span class='text-strong'>Буша:</span> Місце сили. Доїхати до цього заповідника на громадському транспорті — виклик, а на авто від REIZ — приємна подорож.</li></ol>Фіксована ціна за 7 днів робить таку поїздку дешевшою за будь-який організований тур.</div>

<div class='editor_title'>Місячна оренда (Тариф "Регіональний представник")</div>
<div class='editor_text'>Вінниця — ідеальна база для ведення бізнесу в Центральній Україні. Якщо ви приїхали налагоджувати процеси або контролювати філії, тариф "Місяць" — це безальтернативне рішення.<ol><li><span class='text-strong'>Економія:</span> Вартість доби знижується до мінімуму.</li><li><span class='text-strong'>Географія:</span> Ви можете легко робити радіальні виїзди: сьогодні Житомир, завтра Хмельницький, післязавтра Умань.</li><li><span class='text-strong'>Гнучкість:</span> Потрібен представницький седан для переговорів? Ми надамо. Потрібен універсал для перевезення зразків продукції? Замінимо без проблем.</li></ol></div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Багато IT-фахівців та сімей обирають Вінницю для життя через її затишок. Довгострокова оренда від REIZ дозволяє вам почуватися місцевим жителем з першого дня. Вам не треба витрачати велику суму на купівлю авто. Ви берете машину в підписку:<ol><li><span class='text-strong'>Страховка:</span> Ми платимо за страховку.</li><li><span class='text-strong'>ТО:</span> Ми робимо ТО.</li><li><span class='text-strong'>Зимова гума:</span> Ми зберігаємо вашу зимову гуму.</li></ol>Ви просто їздите на роботу, возите дітей у школу та насолоджуєтесь життям.</div>

<div class='editor_title'>Економ-клас: Практичність на Соборній</div>
<div class='editor_text'>Центральна вулиця Вінниці (Соборна) має обмеження руху для приватного транспорту вдень, а прилеглі вулички бувають завантажені. Наші авто економ-класу — це розумний вибір. Компактні габарити дозволяють легко паркуватися біля "Скай Парку" чи міськради, а економні двигуни бережуть ваш бюджет.</div>

<div class='editor_title'>Переваги REIZ у Вінниці</div>
<div class='editor_text'><ul><li>Зустріч на Вокзалі: Вінницький залізничний вокзал — це головні ворота міста. Ми подамо авто прямо на парковку вокзалу до прибуття вашого Інтерсіті.</li><li>Стан авто: Ми фанати чистоти. Ваше авто буде вимите і продезінфіковане.</li><li>Прозорість: Жодних прихованих комісій за "подачу в неробочий час" (при попередньому бронюванні).</li><li>Підтримка: Ми завжди на зв'язку, щоб підказати, де краще заправитися або як об'їхати ремонт дороги.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Ми спрощуємо процедуру. Для багатьох моделей доступна опція оренди без застави при умові придбання повного страхового захисту. Це ідеально для гостей міста, які не хочуть "заморожувати" кошти.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Потрібно зустріти VIP-гостей або ви хочете відвідати дегустацію подільських вин? Замовте трансфер з водієм. Наші драйвери — це професіонали, які знають місто ідеально і забезпечать найвищий рівень сервісу.</div>

<div class='editor_title'>Доставка авто по місту</div>
<div class='editor_text'>Безкоштовно: Центр, Замостя, Вишенька, район фонтану Roshen, Залізничний вокзал.<br/>Платна подача: Старе місто, П'ятничани, Сабарів, Агрономічне та передмістя.</div>

<div class='editor_title'>Безпека руху у Вінниці: Увага, Трамвай!</div>
<div class='editor_text'>Вінниця має унікальну особливість, про яку мають знати всі водії:<ol><li><span class='text-strong'>Швейцарські трамваї:</span> Вінниця славиться своїми синіми трамваями. Вони мають беззаперечний пріоритет. Будьте дуже уважні на перетинах колій та при поворотах. Трамваї тут рухаються швидко і тихо.</li><li><span class='text-strong'>Обмеження в центрі:</span> Рух вулицею Соборною для приватних авто обмежений у денний час. Слідкуйте за знаками, щоб не отримати штраф.</li><li><span class='text-strong'>Велодоріжки:</span> Вінниця — велостолиця. При поворотах завжди пропускайте велосипедистів.</li><li><span class='text-strong'>Алкоголь:</span> Нульова толерантність. Керування напідпитку суворо карається законом і правилами компанії.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Винница стабильно возглавляет рейтинги самых комфортных городов Украины. Это стратегический узел, соединяющий Киев, Одессу и Запад. Здесь пересекаются пути бизнеса и туризма. Сервис REIZ предлагает прокат автомобилей, соответствующий высоким стандартам города. Независимо от того, нужно ли вам встретить партнеров на вокзале или вы планируете уик-энд по замкам Подолья — у нас есть идеальное авто. Забудьте о графике троллейбусов: с личным авто вы успеете посетить ставку "Вервольф" и поужинать на Соборной в один день.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Тест-драйв по "Городу идей"</div>
<div class='editor_text'>Винница компактна, но насыщена. Почасовая аренда — это ваш инструмент для быстрых решений.<ol><li><span class='text-strong'>Туризм:</span> Всего за несколько часов вы можете посетить Национальный музей-усадьбу Н.И. Пирогова и Водонапорную башню в центре.</li><li><span class='text-strong'>Бизнес:</span> Проведите встречу в бизнес-центре на Магистратской, а затем с комфортом доберитесь до индустриального парка.</li><li><span class='text-strong'>Тест:</span> Хотите купить авто, но сомневаетесь? Возьмите аналогичную модель у нас на сутки и проверьте ее на винницких дорогах.</li></ol></div>

<div class='editor_title'>Недельная аренда: Дворцы и каньоны</div>
<div class='editor_text'>Винничина — это край, который невозможно узнать из окна автобуса. Недельный тариф дает вам ключи от скрытых сокровищ региона. Спланируйте свой гранд-тур:<ol><li><span class='text-strong'>Тульчин:</span> Посетите "Подольский Версаль" — дворец Потоцких.</li><li><span class='text-strong'>Немиров:</span> Прогуляйтесь по валам Большого скифского городища.</li><li><span class='text-strong'>Буша:</span> Место силы. Доехать до этого заповедника на общественном транспорте — вызов, а на авто от REIZ — приятное путешествие.</li></ol>Фиксированная цена за 7 дней делает такую поездку дешевле любого организованного тура.</div>

<div class='editor_title'>Аренда на месяц (Тариф "Региональный представитель")</div>
<div class='editor_text'>Винница — идеальная база для ведения бизнеса в Центральной Украине. Если вы приехали налаживать процессы или контролировать филиалы, тариф "Месяц" — это безальтернативное решение.<ol><li><span class='text-strong'>Экономия:</span> Стоимость суток снижается до минимума.</li><li><span class='text-strong'>География:</span> Вы можете легко делать радиальные выезды: сегодня Житомир, завтра Хмельницкий, послезавтра Умань.</li><li><span class='text-strong'>Гибкость:</span> Нужен представительский седан для переговоров? Мы предоставим. Нужен универсал для перевозки образцов? Заменим без проблем.</li></ol></div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Многие IT-специалисты и семьи выбирают Винницу для жизни из-за ее уюта. Долгосрочная аренда от REIZ позволяет вам чувствовать себя местным жителем с первого дня. Вам не нужно тратить большую сумму на покупку авто. Вы берете машину по подписке:<ol><li><span class='text-strong'>Страховка:</span> Мы платим за страховку.</li><li><span class='text-strong'>ТО:</span> Мы делаем ТО.</li><li><span class='text-strong'>Зимняя резина:</span> Мы храним вашу зимнюю резину.</li></ol>Вы просто ездите на работу, возите детей в школу и наслаждаетесь жизнью.</div>

<div class='editor_title'>Эконом-класс: Практичность на Соборной</div>
<div class='editor_text'>Центральная улица Винницы (Соборная) имеет ограничения движения для частного транспорта днем, а прилегающие улочки бывают загружены. Наши авто эконом-класса — это разумный выбор. Компактные габариты позволяют легко парковаться возле "Скай Парка" или горсовета, а экономные двигатели берегут ваш бюджет.</div>

<div class='editor_title'>Преимущества REIZ в Виннице</div>
<div class='editor_text'><ul><li>Встреча на Вокзале: Винницкий ж/д вокзал — это главные ворота города. Мы подадим авто прямо на парковку вокзала к прибытию вашего Интерсити.</li><li>Состояние авто: Мы фанаты чистоты. Ваше авто будет вымыто и продезинфицировано.</li><li>Прозрачность: Никаких скрытых комиссий за "подачу в нерабочее время" (при предварительном бронировании).</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Мы упрощаем процедуру. Для многих моделей доступна опция аренды без залога при условии покупки полной страховой защиты. Это идеально для гостей города.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Нужно встретить VIP-гостей или вы хотите посетить дегустацию подольских вин? Закажите трансфер с водителем. Наши драйверы — это профессионалы, которые знают город идеально.</div>

<div class='editor_title'>Доставка авто по городу</div>
<div class='editor_text'>Бесплатно: Центр, Замостье, Вишенка, район фонтана Roshen, Ж/Д вокзал.<br/>Платная подача: Старый город, Пятничаны, Сабаров, Агрономичное и пригород.</div>

<div class='editor_title'>Безопасность движения в Виннице: Внимание, Трамвай!</div>
<div class='editor_text'>Винница имеет уникальную особенность:<ol><li><span class='text-strong'>Швейцарские трамваи:</span> Они имеют безоговорочный приоритет. Будьте очень внимательны на пересечениях путей и при поворотах. Трамваи здесь движутся быстро и тихо.</li><li><span class='text-strong'>Ограничения в центре:</span> Движение по улице Соборной для частных авто ограничено в дневное время. Следите за знаками.</li><li><span class='text-strong'>Велодорожки:</span> Винница — велостолица. При поворотах всегда пропускайте велосипедистов.</li><li><span class='text-strong'>Алкоголь:</span> Нулевая толерантность.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Vinnytsia consistently tops the rankings of the most comfortable cities in Ukraine. It is a strategic hub connecting Kyiv, Odesa, and the West. Business and tourism paths cross here. REIZ service offers car rental that meets the high standards of the city. Whether you need to meet partners at the train station or plan a weekend tour of Podillia castles, we have the perfect car. Forget about the trolleybus schedule: with your own car, you will have time to visit the "Werewolf" bunker and have dinner on Soborna Street on the same day.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: Test Drive through the "City of Ideas"</div>
<div class='editor_text'>Vinnytsia is compact but intense. Hourly rental is your tool for quick decisions.<ol><li><span class='text-strong'>Tourism:</span> In just a few hours you can visit the National Pirogov's Estate Museum and the Water Tower in the center.</li><li><span class='text-strong'>Business:</span> Hold a meeting at the business center on Magistratska St., and then comfortably get to the industrial park.</li><li><span class='text-strong'>Test:</span> Want to buy a car but have doubts? Rent a similar model from us for a day and check it on Vinnytsia roads.</li></ol></div>

<div class='editor_title'>Weekly Rental: Palaces and Canyons</div>
<div class='editor_text'>Vinnytsia region is a land that cannot be known from a bus window. The weekly rate gives you the keys to the hidden treasures of the region. Plan your grand tour:<ol><li><span class='text-strong'>Tulchyn:</span> Visit the "Podillia Versailles" — Potocki Palace.</li><li><span class='text-strong'>Nemyriv:</span> Walk along the ramparts of the Great Scythian Settlement.</li><li><span class='text-strong'>Busha:</span> A place of power. Getting to this reserve by public transport is a challenge, but by REIZ car, it's a pleasant journey.</li></ol>A fixed price for 7 days makes such a trip cheaper than any organized tour.</div>

<div class='editor_title'>Monthly Rental ("Regional Representative" Tariff)</div>
<div class='editor_text'>Vinnytsia is an ideal base for doing business in Central Ukraine. If you came to set up processes or control branches, the "Month" tariff is the only solution.<ol><li><span class='text-strong'>Savings:</span> The daily cost is reduced to a minimum.</li><li><span class='text-strong'>Geography:</span> You can easily make radial trips: today Zhytomyr, tomorrow Khmelnytskyi, the day after tomorrow Uman.</li><li><span class='text-strong'>Flexibility:</span> Need a representative sedan for negotiations? We will provide it. Need a station wagon to transport product samples? We will replace it without problems.</li></ol></div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>Many IT specialists and families choose Vinnytsia for life because of its coziness. Long-term rental from REIZ allows you to feel like a local from day one. You don't need to spend a large sum on buying a car. You take a car by subscription:<ol><li><span class='text-strong'>Insurance:</span> We pay for insurance.</li><li><span class='text-strong'>Maintenance:</span> We do maintenance.</li><li><span class='text-strong'>Winter tires:</span> We store your winter tires.</li></ol>You simply commute to work, take kids to school, and enjoy life.</div>

<div class='editor_title'>Economy Class: Practicality on Soborna</div>
<div class='editor_text'>The central street of Vinnytsia (Soborna) has traffic restrictions for private transport during the day, and the adjacent streets can be busy. Our economy class cars are a smart choice. Compact dimensions allow you to easily park near "Sky Park" or the City Council, and economical engines save your budget.</div>

<div class='editor_title'>Advantages of REIZ in Vinnytsia</div>
<div class='editor_text'><ul><li>Meeting at the Station: Vinnytsia Railway Station is the main gate of the city. We will deliver the car directly to the station parking lot by the arrival of your Intercity train.</li><li>Car Condition: We are cleanliness fanatics. Your car will be washed and disinfected.</li><li>Transparency: No hidden fees for "delivery after hours" (with prior booking).</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>We simplify the procedure. For many models, a no-deposit rental option is available subject to purchasing full insurance protection. This is ideal for city guests who do not want to "freeze" funds.</div>

<div class='editor_title'>Chauffeur Services</div>
<div class='editor_text'>Need to meet VIP guests or want to visit a tasting of Podillia wines? Order a transfer with a driver. Our drivers are professionals who know the city perfectly.</div>

<div class='editor_title'>Car Delivery in the City</div>
<div class='editor_text'>Free: Center, Zamostia, Vyshenka, Roshen Fountain area, Railway Station.<br/>Paid Delivery: Old Town, Piatnychany, Sabariv, Ahronomichne, and suburbs.</div>

<div class='editor_title'>Traffic Safety in Vinnytsia: Attention, Tram!</div>
<div class='editor_text'>Vinnytsia has a unique feature:<ol><li><span class='text-strong'>Swiss Trams:</span> Vinnytsia is famous for its blue trams. They have unconditional priority. Be very careful at track crossings and turns. Trams move fast and silently here.</li><li><span class='text-strong'>Center Restrictions:</span> Traffic on Soborna Street for private cars is restricted during the day. Watch the signs.</li><li><span class='text-strong'>Bike Paths:</span> Vinnytsia is a cycling capital. Always give way to cyclists when turning.</li><li><span class='text-strong'>Alcohol:</span> Zero tolerance. Driving under the influence is strictly punished.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generateMukachevoEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Мукачево — це душа Закарпаття. Затишне європейське містечко, над яким височіє величний замок Паланок. Це ідеальна точка старту для будь-якої подорожі: на південь — термальні води, на північ — високі гори. Громадський транспорт тут не завжди зручний, тому оренда авто від REIZ — це необхідність. Ми пропонуємо автомобілі, які дозволять вам встигнути все: зранку випити кави біля Ратуші, вдень піднятися на круту замкову гору, а ввечері релаксувати в басейнах Косино.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Тест-драйв історією</div>
<div class='editor_text'>У вас є кілька годин між потягами або діловими зустрічами? Погодинна оренда — це можливість побачити більше, ніж просто вокзал.<ol><li><span class='text-strong'>Замок Паланок:</span> Доїхати до верхньої парковки замку — це чудовий тест для двигуна та гальм (підйом доволі крутий).</li><li><span class='text-strong'>Монастир:</span> Відвідайте Свято-Миколаївський жіночий монастир на березі Латориці.</li><li><span class='text-strong'>Шопінг:</span> З'їздіть на ринок ГІД або в супермаркети району Росвигово. Це також зручно, щоб зустріти родичів з важкими сумками на вокзалі.</li></ol></div>

<div class='editor_title'>Тижнева оренда: Термальний та гірський тур</div>
<div class='editor_text'>Якщо ви обрали Мукачево як базу для відпустки, тижнева оренда авто зекономить вам бюджет і час. Таксі до термальних курортів коштує недешево, а своїм авто ви їздите туди хоч щодня. Ваш план з REIZ:<ol><li><span class='text-strong'>Термали:</span> Всього 20-30 хвилин їзди — і ви в "Косино" або "Жайворонку" (Берегове).</li><li><span class='text-strong'>Природа:</span> Поїздка до водоспаду Скакало або в санаторій "Карпати" (замок Шенборнів).</li><li><span class='text-strong'>Гастрономія:</span> Відвідайте винні підвали в селі Бобовище.</li></ol>Ви платите фіксовану ціну за тиждень і отримуєте повну свободу пересування регіоном.</div>

<div class='editor_title'>Оренда на місяць (Тариф "Логістика")</div>
<div class='editor_text'>Мукачево — важливий транспортний вузол. Тут перетинаються траси Київ-Чоп та дороги до кордонів з Угорщиною та Румунією. Для бізнесу тариф "Місяць" — це знахідка.<ol><li><span class='text-strong'>Мобільність:</span> Ви легко контролюєте об'єкти в Ужгороді, Сваляві чи Хусті. Всі вони в межах години їзди.</li><li><span class='text-strong'>Вигода:</span> Один платіж на місяць значно дешевший за утримання власного автопарку.</li><li><span class='text-strong'>Сервіс:</span> Якщо авто потребує заміни мастила чи ремонту, ми миттєво надаємо підмінну машину.</li></ol>Ваша робота не зупиняється.</div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Рішення для місцевих жителів та тих, хто переїхав на Закарпаття. Володіння авто без турбот. Довгострокова оренда (від 3 місяців) включає повний пакет послуг. Ми слідкуємо за тим, щоб на авто стояла якісна гума (взимку на перевалах це питання життя), була дійсна страховка та пройдений техогляд. Ви просто заправляєтесь і їздите.</div>

<div class='editor_title'>Економ-клас: Зручно в центрі</div>
<div class='editor_text'>Центр Мукачева (пішохідна зона та прилеглі вулички) досить компактний. Наші авто економ-класу ідеально підходять для міста. Вони маневрені, легко розвертаються на вузьких вуличках біля костелу Святого Мартина і споживають мінімум пального в міському циклі.</div>

<div class='editor_title'>Чому в Мукачеві обирають REIZ</div>
<div class='editor_text'><ul><li>Зустріч на пероні: Мукачево — це важлива залізнична станція. Ми зустрінемо вас прямо біля вагона і проведемо до авто.</li><li>Чистота: Ваше авто буде ідеально чистим, навіть якщо на вулиці сльота.</li><li>Безпека: Ми перевіряємо кожне авто перед видачею, особливу увагу приділяючи гальмівній системі та світлу (тумани тут часті).</li><li>Підтримка: Ми завжди на зв'язку, щоб підказати дорогу до найкращого бограчу в місті.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Подорожуйте без зайвих думок про депозит. При оформленні повного страхування (Super CDW) доступна опція оренди без застави. Насолоджуйтесь відпочинком, а ризики дрібних пошкоджень ми беремо на себе.</div>

<div class='editor_title'>Послуги водія (Винні тури)</div>
<div class='editor_text'>Закарпаття славиться вином. Хочете відвідати дегустацію в "Старому Підвалі" або поїхати в Берегівський район? Не ризикуйте правами. Замовте авто з водієм. Ми з комфортом відвеземо вас на дегустацію і доставимо назад у готель.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Безкоштовно: Центр міста, район Паланок, Росвигово, Підгоряни, Залізничний вокзал.<br/>Платна подача: Чинадієво, Кольчино, Ключарки та інші села району.</div>

<div class='editor_title'>Безпека руху в Мукачеві</div>
<div class='editor_text'>Що треба знати водію:<ol><li><span class='text-strong'>Бруківка:</span> У центрі міста та на підйомі до замку збереглася стара бруківка. У дощ вона дуже слизька.</li><li><span class='text-strong'>Велосипедисти:</span> Мукачево — місто велосипедів. Їх тут дуже багато, і вони повноправні учасники руху. Будьте уважні при маневрах.</li><li><span class='text-strong'>Гужовий транспорт:</span> На виїздах з міста та в селах району все ще можна зустріти вози з кіньми. Будьте обережні в темну пору доби.</li><li><span class='text-strong'>Алкоголь:</span> Нульова толерантність. Поліція часто проводить рейди, особливо у вихідні.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Мукачево — это душа Закарпатья. Уютный европейский городок, над которым возвышается величественный замок Паланок. Это идеальная точка старта для любого путешествия: на юг — термальные воды, на север — высокие горы. Общественный транспорт здесь не всегда удобен, поэтому аренда авто от REIZ — это необходимость. Мы предлагаем автомобили, которые позволят вам успеть всё: утром выпить кофе у Ратуши, днем подняться на крутую замковую гору, а вечером релаксировать в бассейнах Косино.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Тест-драйв историей</div>
<div class='editor_text'>У вас есть несколько часов между поездами или деловыми встречами? Почасовая аренда — это возможность увидеть больше, чем просто вокзал.<ol><li><span class='text-strong'>Замок Паланок:</span> Доехать до верхней парковки замка — это отличный тест для двигателя и тормозов (подъем довольно крутый).</li><li><span class='text-strong'>Монастырь:</span> Посетите Свято-Николаевский женский монастырь на берегу Латорицы.</li><li><span class='text-strong'>Шопинг:</span> Съездите на рынок ГИД или в супермаркеты района Росвигово. Это также удобно, чтобы встретить родственников с тяжелыми сумками на вокзале.</li></ol></div>

<div class='editor_title'>Недельная аренда: Термальный и горный тур</div>
<div class='editor_text'>Если вы выбрали Мукачево как базу для отпуска, недельная аренда авто сэкономит вам бюджет и время. Такси до термальных курортов стоит недешево, а на своем авто вы ездите туда хоть каждый день. Ваш план с REIZ:<ol><li><span class='text-strong'>Термалы:</span> Всего 20-30 минут езды — и вы в "Косино" или "Жаворонке" (Берегово).</li><li><span class='text-strong'>Природа:</span> Поездка к водопаду Скакало или в санаторий "Карпаты" (замок Шенборнов).</li><li><span class='text-strong'>Гастрономия:</span> Посетите винные подвалы в селе Бобовище.</li></ol>Вы платите фиксированную цену за неделю и получаете полную свободу передвижения по региону.</div>

<div class='editor_title'>Аренда на месяц (Тариф "Логистика")</div>
<div class='editor_text'>Мукачево — важный транспортный узел. Здесь пересекаются трассы Киев-Чоп и дороги к границам с Венгрией и Румынией. Для бизнеса тариф "Месяц" — это находка.<ol><li><span class='text-strong'>Мобильность:</span> Вы легко контролируете объекты в Ужгороде, Сваляве или Хусте. Все они в пределах часа езды.</li><li><span class='text-strong'>Выгода:</span> Один платеж в месяц значительно дешевле содержания собственного автопарка.</li><li><span class='text-strong'>Сервис:</span> Если авто требует замены масла или ремонта, мы мгновенно предоставляем подменную машину.</li></ol>Ваша работа не останавливается.</div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Решение для местных жителей и тех, кто переехал на Закарпатье. Владение авто без забот. Долгосрочная аренда (от 3 месяцев) включает полный пакет услуг. Мы следим за тем, чтобы на авто стояла качественная резина (зимой на перевалах это вопрос жизни), была действительная страховка и пройден техосмотр. Вы просто заправляетесь и ездите.</div>

<div class='editor_title'>Эконом-класс: Удобно в центре</div>
<div class='editor_text'>Центр Мукачево (пешеходная зона и прилегающие улочки) довольно компактен. Наши авто эконом-класса идеально подходят для города. Они маневренные, легко разворачиваются на узких улочках возле костела Святого Мартина и потребляют минимум топлива в городском цикле.</div>

<div class='editor_title'>Почему в Мукачево выбирают REIZ</div>
<div class='editor_text'><ul><li>Встреча на перроне: Мукачево — это важная железнодорожная станция. Мы встретим вас прямо у вагона.</li><li>Чистота: Ваше авто будет идеально чистым, даже если на улице слякоть.</li><li>Безопасность: Мы проверяем каждое авто перед выдачей, особое внимание уделяя тормозной системе и свету (туманы здесь частые).</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Путешествуйте без лишних мыслей о депозите. При оформлении полного страхования (Super CDW) доступна опция аренды без залога. Наслаждайтесь отдыхом, а риски мелких повреждений мы берем на себя.</div>

<div class='editor_title'>Услуги водителя (Винные туры)</div>
<div class='editor_text'>Закарпатье славится вином. Хотите посетить дегустацию в "Старом Подвале" или поехать в Береговский район? Не рискуйте правами. Закажите авто с водителем. Мы с комфортом отвезем вас на дегустацию и доставим обратно в отель.</div>

<div class='editor_title'>Доставка авто</div>
<div class='editor_text'>Бесплатно: Центр города, район Паланок, Росвигово, Подгоряны, Ж/Д вокзал.<br/>Платная подача: Чинадиево, Кольчино, Ключарки и другие села района.</div>

<div class='editor_title'>Безопасность движения в Мукачево</div>
<div class='editor_text'>Что нужно знать водителю:<ol><li><span class='text-strong'>Брусчатка:</span> В центре города и на подъеме к замку сохранилась старая брусчатка. В дождь она очень скользкая.</li><li><span class='text-strong'>Велосипедисты:</span> Мукачево — город велосипедов. Их тут очень много, и они полноправные участники движения. Будьте внимательны при маневрах.</li><li><span class='text-strong'>Гужевой транспорт:</span> На выездах из города и в селах района все еще можно встретить телеги с лошадьми. Будьте осторожны в темное время суток.</li><li><span class='text-strong'>Алкоголь:</span> Нулевая толерантность.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Mukachevo is the soul of Transcarpathia. A cozy European town dominated by the majestic Palanok Castle. It is an ideal starting point for any trip: to the south — thermal waters, to the north — high mountains. Public transport here is not always convenient, so car rental from REIZ is a necessity. We offer cars that will allow you to do everything: drink coffee near the Town Hall in the morning, climb the steep Castle Hill in the afternoon, and relax in the Kosyno pools in the evening.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: History Test Drive</div>
<div class='editor_text'>Do you have a few hours between trains or business meetings? Hourly rental is an opportunity to see more than just the train station.<ol><li><span class='text-strong'>Palanok Castle:</span> Driving to the upper parking lot of the castle is a great test for the engine and brakes (the climb is quite steep).</li><li><span class='text-strong'>Monastery:</span> Visit the St. Nicholas Convent on the banks of the Latorytsia River.</li><li><span class='text-strong'>Shopping:</span> Go to the HYD market or supermarkets in the Rosvyhovo district. It is also convenient to meet relatives with heavy bags at the station.</li></ol></div>

<div class='editor_title'>Weekly Rental: Thermal and Mountain Tour</div>
<div class='editor_text'>If you chose Mukachevo as a vacation base, weekly car rental will save your budget and time. Taxis to thermal resorts are not cheap, and with your own car, you can go there every day. Your plan with REIZ:<ol><li><span class='text-strong'>Thermal Waters:</span> Just 20-30 minutes drive — and you are in "Kosyno" or "Zhayvoronok" (Berehove).</li><li><span class='text-strong'>Nature:</span> Trip to the Skakalo waterfall or to the "Karpaty" sanatorium (Shenborn Castle).</li><li><span class='text-strong'>Gastronomy:</span> Visit wine cellars in the village of Bobovyshche.</li></ol>You pay a fixed price for a week and get complete freedom of movement in the region.</div>

<div class='editor_title'>Monthly Rental ("Logistics" Tariff)</div>
<div class='editor_text'>Mukachevo is an important transport hub. The Kyiv-Chop highway and roads to the borders with Hungary and Romania intersect here. For business, the "Month" tariff is a godsend.<ol><li><span class='text-strong'>Mobility:</span> You easily control sites in Uzhhorod, Svalyava, or Khust. All of them are within an hour's drive.</li><li><span class='text-strong'>Benefit:</span> One payment per month is significantly cheaper than maintaining your own fleet.</li><li><span class='text-strong'>Service:</span> If the car needs an oil change or repair, we instantly provide a replacement car.</li></ol></div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>A solution for locals and those who moved to Transcarpathia. Car ownership without worries. Long-term rental (from 3 months) includes a full package of services. We ensure that the car has high-quality tires (in winter on passes, this is a matter of life), valid insurance, and passed technical inspection. You just refuel and drive.</div>

<div class='editor_title'>Economy Class: Convenient in the Center</div>
<div class='editor_text'>The center of Mukachevo (pedestrian zone and adjacent streets) is quite compact. Our economy class cars are perfect for the city. They are maneuverable, easy to turn around on narrow streets near St. Martin's Cathedral, and consume minimum fuel in the city cycle.</div>

<div class='editor_title'>Why Choose REIZ in Mukachevo</div>
<div class='editor_text'><ul><li>Meeting on the Platform: Mukachevo is an important railway station. We will meet you right next to the carriage and guide you to the car.</li><li>Cleanliness: Your car will be perfectly clean, even if it is slushy outside.</li><li>Safety: We check every car before delivery, paying special attention to the braking system and lights (fogs are frequent here).</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>Travel without unnecessary thoughts about the deposit. When purchasing full insurance (Super CDW), a no-deposit rental option is available. Enjoy your vacation, and we take the risks of minor damage on ourselves.</div>

<div class='editor_title'>Chauffeur Services (Wine Tours)</div>
<div class='editor_text'>Transcarpathia is famous for wine. Want to visit a tasting in the "Old Cellar" or go to the Berehove district? Don't risk your license. Order a car with a driver. We will comfortably take you to the tasting and deliver you back to the hotel.</div>

<div class='editor_title'>Car Delivery</div>
<div class='editor_text'>Free: City center, Palanok district, Rosvyhovo, Pidhoriany, Railway Station.<br/>Paid Delivery: Chynadiyovo, Kolchyno, Kliucharky, and other villages of the district.</div>

<div class='editor_title'>Traffic Safety in Mukachevo</div>
<div class='editor_text'>What a driver needs to know:<ol><li><span class='text-strong'>Cobblestones:</span> Old cobblestones have been preserved in the city center and on the ascent to the castle. In the rain, it is very slippery.</li><li><span class='text-strong'>Cyclists:</span> Mukachevo is a city of bicycles. There are many of them here, and they are full-fledged participants in the traffic. Be careful when maneuvering.</li><li><span class='text-strong'>Horse-Drawn Transport:</span> At the exits from the city and in the villages of the district, you can still meet carts with horses. Be careful in the dark.</li><li><span class='text-strong'>Alcohol:</span> Zero tolerance. Police often run checks, especially on weekends.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

function generatePoltavaEditorContent(locale: Locale): string {
  const contentByLocale = {
    uk: `
<div class='editor_text'>Полтава — місто, де історія зустрічається із сучасністю. Це важливий вузол між Києвом, Харковом та Дніпром, а також центр нафтогазової промисловості. Сервіс REIZ пропонує прокат автомобілів, що відповідає ритму міста. Чи ви приїхали на ділові переговори, чи хочете скуштувати справжніх галушок і побачити садибу Котляревського — з власним авто ви встигнете все. Забудьте про очікування маршруток: ваша подорож починається з повороту ключа запалювання.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>

<div class='editor_title'>Погодинний тариф: Тест-драйв містом парків</div>
<div class='editor_text'>Полтава — неймовірно зелене місто. Погодинна оренда дозволить вам відчути його атмосферу.<ol><li><span class='text-strong'>Центр:</span> Проїдьтеся навколо Корпусного саду — унікальної круглої площі, від якої променями розходяться вулиці.</li><li><span class='text-strong'>Оглядовий майданчик:</span> Підніміться на Білу Альтанку, щоб побачити панораму міста та долину Ворскли.</li><li><span class='text-strong'>Справи:</span> Вирішіть питання в податковій, заїдьте в ТРЦ "Екватор" та на вокзал "Київський" всього за пару годин. Це також чудова нагода протестувати авто перед поїздкою на дачу або природу.</li></ol></div>

<div class='editor_title'>Тижнева оренда: Гоголівський тур та гончарство</div>
<div class='editor_text'>Полтавщина — це туристичний магнат. Тижнева оренда авто відкриває для вас маршрути, недоступні для пішого туриста. Фіксована ціна за тиждень дозволяє відвідати:<ol><li><span class='text-strong'>Диканька:</span> Легендарне місце з тріумфальною аркою та Кочубеївськими дубами.</li><li><span class='text-strong'>Опішня:</span> Столиця українського гончарства. Купіть кераміку і спробуйте місцевий борщ з грушами.</li><li><span class='text-strong'>Великі Сорочинці:</span> Місце знаменитого ярмарку та Гоголівський музей.</li><li><span class='text-strong'>Миргород:</span> Курортне містечко з цілющою водою. Власним авто ви самі будуєте графік, зупиняючись для фото в мальовничих полях соняшників.</li></ol></div>

<div class='editor_title'>Місячна оренда (Тариф "Бізнес-регіон")</div>
<div class='editor_text'>Полтавська область — центр видобувної промисловості та агробізнесу. Якщо ваше відрядження затягується, тариф "Місяць" стане вашим порятунком.<ol><li><span class='text-strong'>Логістика:</span> Ви зможете вільно курсувати між об'єктами в Кременчуці, Горішніх Плавнях та Гадячі.</li><li><span class='text-strong'>Економія:</span> Вартість доби оренди при місячному тарифі конкурує з цінами на громадський транспорт, але дає незрівнянно вищий комфорт.</li><li><span class='text-strong'>Надійність:</span> Якщо ваше власне авто в ремонті або ви чекаєте на службове, REIZ надасть гідну заміну.</li></ol></div>

<div class='editor_title'>Довгострокова оренда</div>
<div class='editor_text'>Для тих, хто живе в Полтаві, але не хоче купувати авто. Довгострокова оренда (від 3 місяців) — це свобода від зобов'язань. Ми беремо на себе страхування (КАСКО), сезонну заміну гуми та техогляд. Ваша справа — лише заправляти авто і насолоджуватися поїздками: на роботу, за дітьми в школу чи на пікнік до Ворскли.</div>

<div class='editor_title'>Економ-клас: Практичність для міста</div>
<div class='editor_text'>Полтава має багато брукованих вулиць в історичному центрі. Наші авто економ-класу мають енергоємну підвіску, яка згладжує нерівності бруківки на вулиці Небесної Сотні чи Європейській. Компактність авто дозволить легко припаркуватися біля театру Гоголя чи ЦУМу.</div>

<div class='editor_title'>Чому в Полтаві обирають REIZ</div>
<div class='editor_text'><ul><li>Зустріч на вокзалі: Полтава-Київська — важлива станція для Інтерсіті. Ми зустрінемо вас на пероні, щоб ви не витрачали час на пошук таксі.</li><li>Стан авто: Ми ретельно миємо авто і перевіряємо технічний стан перед кожною видачею.</li><li>Прозорість: Жодних прихованих платежів. Ви отримуєте авто з повним баком і повертаєте так само.</li><li>Підтримка: Наші менеджери завжди на зв'язку, готові підказати дорогу або допомогти в екстреній ситуації.</li></ul></div>

<div class='editor_title'>Оренда без застави</div>
<div class='editor_text'>Ми робимо сервіс доступним. При оформленні повного страхування (Super CDW) ви можете взяти авто без застави. Це ідеально для гостей міста, які хочуть зберегти вільні кошти для вражень та сувенірів.</div>

<div class='editor_title'>Послуги водія</div>
<div class='editor_text'>Потрібно зустріти делегацію або плануєте весілля в заміському комплексі? Замовте авто бізнес-класу з водієм. Наші професіонали знають місто ідеально і забезпечать пунктуальність та комфорт.</div>

<div class='editor_title'>Доставка авто по місту</div>
<div class='editor_text'>Безкоштовно: Центр (Кругла площа), мікрорайон Алмаз, Левада, Поділ, вокзал "Полтава-Київська".<br/>Платна подача: Розсошенці, Супрунівка, Рибці та інші приміські зони.</div>

<div class='editor_title'>Безпека руху в Полтаві: "Корпуси" та бруківка</div>
<div class='editor_text'>Водіям-новачкам у Полтаві варто знати:<ol><li><span class='text-strong'>Кругла площа (Корпусний сад):</span> Це серце міста і гігантське кільце. Тут діють правила проїзду перехресть з круговим рухом. Будьте уважні при перестроюванні.</li><li><span class='text-strong'>Бруківка:</span> Частина центру вимощена історичним каменем. У дощ зчеплення з дорогою погіршується — збільшуйте дистанцію.</li><li><span class='text-strong'>Агротехніка:</span> На виїздах з міста та окружній дорозі часто зустрічається великогабаритна сільськогосподарська техніка. Будьте обережні при обгоні.</li><li><span class='text-strong'>Алкоголь:</span> REIZ — за тверезість. Керування в нетверезому стані суворо заборонено.</li></ol></div>
`.trim(),
    ru: `
<div class='editor_text'>Полтава — город, где история встречается с современностью. Это важный узел между Киевом, Харьковом и Днепром, а также центр нефтегазовой промышленности. Сервис REIZ предлагает прокат автомобилей, соответствующий ритму города. Приехали ли вы на деловые переговоры, или хотите попробовать настоящих галушек и увидеть усадьбу Котляревского — с личным авто вы успеете всё. Забудьте об ожидании маршруток: ваше путешествие начинается с поворота ключа зажигания.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>

<div class='editor_title'>Почасовой тариф: Тест-драйв по городу парков</div>
<div class='editor_text'>Полтава — невероятно зеленый город. Почасовая аренда позволит вам ощутить его атмосферу.<ol><li><span class='text-strong'>Центр:</span> Проедьтесь вокруг Корпусного сада — уникальной круглой площади, от которой лучами расходятся улицы.</li><li><span class='text-strong'>Смотровая площадка:</span> Поднимитесь к Белой Беседке, чтобы увидеть панораму города и долину Ворсклы.</li><li><span class='text-strong'>Дела:</span> Решите вопросы в налоговой, заедьте в ТРЦ "Экватор" и на вокзал "Киевский" всего за пару часов. Это также отличная возможность протестировать авто перед поездкой на дачу или природу.</li></ol></div>

<div class='editor_title'>Недельная аренда: Гоголевский тур и гончарство</div>
<div class='editor_text'>Полтавщина — это туристический магнит. Недельная аренда авто открывает для вас маршруты, недоступные для пешего туриста. Фиксированная цена за неделю позволяет посетить:<ol><li><span class='text-strong'>Диканька:</span> Легендарное место с триумфальной аркой и Кочубеевскими дубами.</li><li><span class='text-strong'>Опошня:</span> Столица украинского гончарства. Купите керамику и попробуйте местный борщ с грушами.</li><li><span class='text-strong'>Великие Сорочинцы:</span> Место знаменитой ярмарки и Гоголевский музей.</li><li><span class='text-strong'>Миргород:</span> Курортный городок с целебной водой. С собственным авто вы сами строите график, останавливаясь для фото в живописных полях подсолнухов.</li></ol></div>

<div class='editor_title'>Аренда на месяц (Тариф "Бизнес-регион")</div>
<div class='editor_text'>Полтавская область — центр добывающей промышленности и агробизнеса. Если ваша командировка затягивается, тариф "Месяц" станет вашим спасением.<ol><li><span class='text-strong'>Логистика:</span> Вы сможете свободно курсировать между объектами в Кременчуге, Горишних Плавнях и Гадяче.</li><li><span class='text-strong'>Экономия:</span> Стоимость суток аренды при месячном тарифе конкурирует с ценами на общественный транспорт, но дает несравнимо более высокий комфорт.</li><li><span class='text-strong'>Надежность:</span> Если ваше собственное авто в ремонте или вы ждете служебное, REIZ предоставит достойную замену.</li></ol></div>

<div class='editor_title'>Долгосрочная аренда</div>
<div class='editor_text'>Для тех, кто живет в Полтаве, но не хочет покупать авто. Долгосрочная аренда (от 3 месяцев) — это свобода от обязательств. Мы берем на себя страхование (КАСКО), сезонную замену резины и техосмотр. Ваше дело — только заправлять авто и наслаждаться поездками: на работу, за детьми в школу или на пикник к Ворскле.</div>

<div class='editor_title'>Эконом-класс: Практичность для города</div>
<div class='editor_text'>Полтава имеет много мощеных улиц в историческом центре. Наши авто эконом-класса имеют энергоемкую подвеску, которая сглаживает неровности брусчатки на улице Небесной Сотни или Европейской. Компактность авто позволит легко припарковаться возле театра Гоголя или ЦУМа.</div>

<div class='editor_title'>Почему в Полтаве выбирают REIZ</div>
<div class='editor_text'><ul><li>Встреча на вокзале: Полтава-Киевская — важная станция для Интерсити. Мы встретим вас на перроне, чтобы вы не тратили время на поиск такси.</li><li>Состояние авто: Мы тщательно моем авто и проверяем техническое состояние перед каждой выдачей.</li><li>Прозрачность: Никаких скрытых платежей. Вы получаете авто с полным баком и возвращаете так же.</li></ul></div>

<div class='editor_title'>Аренда без залога</div>
<div class='editor_text'>Мы делаем сервис доступным. При оформлении полного страхования (Super CDW) вы можете взять авто без залога. Это идеально для гостей города, которые хотят сохранить свободные средства для впечатлений.</div>

<div class='editor_title'>Услуги водителя</div>
<div class='editor_text'>Нужно встретить делегацию или планируете свадьбу в загородном комплексе? Закажите авто бизнес-класса с водителем. Наши профессионалы знают город идеально и обеспечат пунктуальность и комфорт.</div>

<div class='editor_title'>Доставка авто по городу</div>
<div class='editor_text'>Бесплатно: Центр (Круглая площадь), микрорайон Алмаз, Левада, Подол, вокзал "Полтава-Киевская".<br/>Платная подача: Рассошенцы, Супруновка, Рыбцы и другие пригородные зоны.</div>

<div class='editor_title'>Безопасность движения в Полтаве: "Корпуса" и брусчатка</div>
<div class='editor_text'>Водителям-новичкам в Полтаве стоит знать:<ol><li><span class='text-strong'>Круглая площадь (Корпусный сад):</span> Это сердце города и гигантское кольцо. Здесь действуют правила проезда перекрестков с круговым движением. Будьте внимательны при перестроении.</li><li><span class='text-strong'>Брусчатка:</span> Часть центра вымощена историческим камнем. В дождь сцепление с дорогой ухудшается — увеличивайте дистанцию.</li><li><span class='text-strong'>Агротехника:</span> На выездах из города и окружной дороге часто встречается крупногабаритная сельскохозяйственная техника. Будьте осторожны при обгоне.</li><li><span class='text-strong'>Алкоголь:</span> REIZ — за трезвость. Управление в нетрезвом виде строго запрещено.</li></ol></div>
`.trim(),
    en: `
<div class='editor_text'>Poltava is a city where history meets modernity. It is an important junction between Kyiv, Kharkiv, and Dnipro, as well as a center of the oil and gas industry. REIZ service offers car rental that matches the rhythm of the city. Whether you came for business negotiations, or want to taste real "halushky" (dumplings) and see Kotlyarevsky's estate — with your own car, you will have time for everything. Forget about waiting for minibuses: your journey begins with the turn of the ignition key.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>

<div class='editor_title'>Hourly Rate: City of Parks Test Drive</div>
<div class='editor_text'>Poltava is an incredibly green city. Hourly rental will allow you to feel its atmosphere.<ol><li><span class='text-strong'>Center:</span> Drive around the Corps Garden (Korpusny Sad) — a unique round square from which streets radiate like rays.</li><li><span class='text-strong'>Observation Deck:</span> Climb the White Arbor (Bila Altanka) to see the panorama of the city and the Vorskla valley.</li><li><span class='text-strong'>Business:</span> Solve issues at the tax office, visit the "Equator" mall and the "Kyivskyi" railway station in just a couple of hours. This is also a great opportunity to test the car before a trip to the country house or nature.</li></ol></div>

<div class='editor_title'>Weekly Rental: Gogol Tour and Pottery</div>
<div class='editor_text'>Poltava region is a tourist magnet. Weekly car rental opens routes unavailable to hikers. A fixed price for a week allows you to visit:<ol><li><span class='text-strong'>Dikanka:</span> A legendary place with a Triumphal Arch and Kochubey oaks.</li><li><span class='text-strong'>Opishnia:</span> The capital of Ukrainian pottery. Buy ceramics and try local borscht with pears.</li><li><span class='text-strong'>Velyki Sorochyntsi:</span> The place of the famous fair and the Gogol Museum.</li><li><span class='text-strong'>Myrhorod:</span> A resort town with healing water. With your own car, you build the schedule yourself, stopping for photos in picturesque sunflower fields.</li></ol></div>

<div class='editor_title'>Monthly Rental ("Business Region" Tariff)</div>
<div class='editor_text'>Poltava region is a center of extractive industry and agribusiness. If your business trip drags on, the "Month" tariff will be your salvation.<ol><li><span class='text-strong'>Logistics:</span> You can freely travel between sites in Kremenchuk, Horishni Plavni, and Hadiach.</li><li><span class='text-strong'>Savings:</span> The daily rental cost with a monthly tariff competes with public transport prices but gives incomparably higher comfort.</li><li><span class='text-strong'>Reliability:</span> If your own car is being repaired or you are waiting for a company car, REIZ will provide a worthy replacement.</li></ol></div>

<div class='editor_title'>Long-Term Rental</div>
<div class='editor_text'>For those who live in Poltava but do not want to buy a car. Long-term rental (from 3 months) is freedom from obligations. We take care of insurance, seasonal tire replacement, and maintenance. Your business is only to refuel the car and enjoy trips: to work, picking up children from school, or for a picnic by the Vorskla River.</div>

<div class='editor_title'>Economy Class: Practicality for the City</div>
<div class='editor_text'>Poltava has many cobbled streets in the historic center. Our economy class cars have energy-intensive suspension that smooths out the irregularities of cobblestones on Nebesna Sotnia or Yevropeiska streets. The compactness of the car will allow you to easily park near the Gogol Theater or TSUM.</div>

<div class='editor_title'>Why Choose REIZ in Poltava</div>
<div class='editor_text'><ul><li>Meeting at the Station: Poltava-Kyivska is an important station for Intercity trains. We will meet you on the platform so you don't waste time looking for a taxi.</li><li>Car Condition: We wash the car thoroughly and check the technical condition before each delivery.</li><li>Transparency: No hidden fees. You get a car with a full tank and return it the same way.</li></ul></div>

<div class='editor_title'>Rental Without Deposit</div>
<div class='editor_text'>We make the service accessible. When purchasing full insurance (Super CDW), you can rent a car without a deposit. This is ideal for city guests who want to save free funds for impressions and souvenirs.</div>

<div class='editor_title'>Chauffeur Services</div>
<div class='editor_text'>Need to meet a delegation or planning a wedding in a country complex? Order a business class car with a driver. Our professionals know the city perfectly and will ensure punctuality and comfort.</div>

<div class='editor_title'>Car Delivery in the City</div>
<div class='editor_text'>Free: Center (Round Square), Almaz district, Levada, Podil, "Poltava-Kyivska" station.<br/>Paid Delivery: Rozsoshentsi, Suprunivka, Rybtsi, and other suburban zones.</div>

<div class='editor_title'>Traffic Safety in Poltava: "The Corps" and Cobblestones</div>
<div class='editor_text'>Novice drivers in Poltava should know:<ol><li><span class='text-strong'>Round Square (Korpusny Sad):</span> This is the heart of the city and a giant ring. Roundabout rules apply here. Be careful when changing lanes.</li><li><span class='text-strong'>Cobblestones:</span> Part of the center is paved with historical stone. In the rain, grip on the road worsens — increase the distance.</li><li><span class='text-strong'>Agricultural Machinery:</span> Large agricultural machinery is often found at exits from the city and on the ring road. Be careful when overtaking.</li><li><span class='text-strong'>Alcohol:</span> REIZ adheres to sobriety. Driving under the influence is strictly prohibited.</li></ol></div>
`.trim(),
  };

  return contentByLocale[locale];
}

export function generateCityEditorContent(
  city: CityConfig,
  locale: Locale
): string {
  const cityData = citySpecificContent[city.slug];

  if (!cityData) {
    // Fallback для невідомих міст
    return generateFallbackContent(city, locale);
  }

  // Якщо є кастомний контент — використати його замість генерації
  if (cityData.customEditorContent?.[locale]) {
    return cityData.customEditorContent[locale];
  }

  if (city.slug === "kyiv") {
    return generateKyivEditorContent(locale);
  }
  if (city.slug === "odesa") {
    return generateOdesaEditorContent(locale);
  }
  if (city.slug === "dnipro") {
    return generateDniproEditorContent(locale);
  }
  if (city.slug === "kharkiv") {
    return generateKharkivEditorContent(locale);
  }
  if (city.slug === "zaporizhzhia") {
    return generateZaporizhzhiaEditorContent(locale);
  }
  if (city.slug === "boryspil") {
    return generateBoryspilEditorContent(locale);
  }
  if (city.slug === "bukovel") {
    return generateBukovelEditorContent(locale);
  }
  if (city.slug === "ternopil") {
    return generateTernopilEditorContent(locale);
  }
  if (city.slug === "truskavets") {
    return generateTruskavetsEditorContent(locale);
  }
  if (city.slug === "chernivtsi") {
    return generateChernivtsiEditorContent(locale);
  }
  if (city.slug === "ivano-frankivsk") {
    return generateIvanoFrankivskEditorContent(locale);
  }
  if (city.slug === "skhidnytsia") {
    return generateSkhidnytsiaEditorContent(locale);
  }
  if (city.slug === "uzhhorod") {
    return generateUzhhorodEditorContent(locale);
  }
  if (city.slug === "vinnytsia") {
    return generateVinnytsiaEditorContent(locale);
  }
  if (city.slug === "mukachevo") {
    return generateMukachevoEditorContent(locale);
  }
  if (city.slug === "poltava") {
    return generatePoltavaEditorContent(locale);
  }

  const loc = city.localized[locale];
  const introText = {
    uk: `REIZ — це прокат автомобілів у ${loc.nameLocative} з увагою до деталей та прозорими умовами. Ми подаємо авто по місту і можемо доставити машину у будь-яку точку України за запитом.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.`,
    ru: `REIZ — это прокат автомобилей в ${loc.nameLocative} с вниманием к деталям и прозрачными условиями. Мы подаём авто по городу и можем доставить машину в любую точку Украины по запросу.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.`,
    en: `REIZ is a car rental service in ${loc.name} with attention to detail and transparent terms. We deliver cars throughout the city and can deliver a car to any point in Ukraine upon request.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.`,
  };

  const hourlyExtended = {
    uk: `${staticContent.hourlyRental.content[locale]}<br/>За один день ви встигнете дізнатись, ${cityData.routeExample[locale]}, чи зручно паркуватись, чи вистачає місця для валіз або спортивного інвентарю, чи подобається звук, посадка й помічники водія.<br/>Часто клієнти беруть авто на день, щоб перевірити його перед ${cityData.weekendTrip[locale]} — підйоми, серпантини й довгі спуски швидко покажуть, ваш це автомобіль для відпочинку чи ні.`,
    ru: `${staticContent.hourlyRental.content[locale]}<br/>За один день вы успеете узнать, ${cityData.routeExample[locale]}, удобно ли парковаться, хватает ли места для чемоданов или спортивного инвентаря, нравится ли звук, посадка и помощники водителя.<br/>Часто клиенты берут авто на день, чтобы проверить его перед ${cityData.weekendTrip[locale]} — подъёмы, серпантины и длинные спуски быстро покажут, ваш это автомобиль для отдыха или нет.`,
    en: `${staticContent.hourlyRental.content[locale]}<br/>In one day, you'll have time to find out ${cityData.routeExample[locale]}, whether it's convenient to park, whether there's enough space for suitcases or sports equipment, whether you like the sound, seating position, and driver assists.<br/>Clients often rent a car for a day to test it before ${cityData.weekendTrip[locale]} — climbs, serpentines, and long descents will quickly show whether this is your car for recreation or not.`,
  };

  const content = `
<div class='editor_text'>${introText[locale]}</div>

<div class='editor_title'>${staticContent.hourlyRental.title[locale]}</div>
<div class='editor_text'>${hourlyExtended[locale]}</div>

<div class='editor_title'>${dynamicTitles.weeklyRental(city, locale)}</div>
<div class='editor_text'>${getWeeklyContent(city, cityData, locale)}</div>

<div class='editor_title'>${staticContent.monthlyRentalDescription[locale] ? dynamicTitles.monthlyRental(city, locale) : ""}</div>
<div class='editor_text'>${staticContent.monthlyRentalDescription[locale]}<br/>${getMonthlyRoutesContent(city, cityData, locale)}</div>

<div class='editor_title'>${dynamicTitles.longTermRental(city, locale)}</div>
<div class='editor_text'>${staticContent.longTermDescription[locale]}<br/>${getLongTermContent(city, cityData, locale)}</div>

<div class='editor_title'>${staticContent.budgetCars.title[locale]}</div>
<div class='editor_text'>${staticContent.budgetCars.content[locale]}</div>

<div class='editor_title'>${dynamicTitles.advantages(city, locale)}</div>
<div class='editor_text'>${getAdvantagesWithLocation(city, cityData, locale)}</div>

<div class='editor_title'>${staticContent.noDeposit.title[locale]}</div>
<div class='editor_text'>${staticContent.noDeposit.content[locale]}</div>

<div class='editor_title'>${dynamicTitles.driverService(city, locale)}</div>
<div class='editor_text'>${getDriverServiceContent(city, cityData, locale)}</div>

<div class='editor_title'>${dynamicTitles.freeDelivery(city, locale)}</div>
<div class='editor_text'>${getDeliveryContent(city, cityData, locale)}</div>

<div class='editor_title'>${staticContent.additionalServices.title[locale]}</div>
<div class='editor_text'>${staticContent.additionalServices.content[locale]}</div>

<div class='editor_title'>${staticContent.carCondition.title[locale]}</div>
<div class='editor_text'>${staticContent.carCondition.content[locale]}</div>

<div class='editor_title'>${staticContent.safetyTipsIntro.title[locale]}</div>
<div class='editor_text'>${staticContent.safetyTipsIntro.content[locale]}</div>

<div class='editor_title'>${staticContent.safeDistance.title[locale]}</div>
<div class='editor_text'>${staticContent.safeDistance.content[locale]}</div>

<div class='editor_title'>${staticContent.laneChange.title[locale]}</div>
<div class='editor_text'>${staticContent.laneChange.content[locale]}</div>

<div class='editor_title'>${staticContent.roadSigns.title[locale]}</div>
<div class='editor_text'>${staticContent.roadSigns.content[locale]}</div>

<div class='editor_title'>${staticContent.noAlcohol.title[locale]}</div>
<div class='editor_text'>${staticContent.noAlcohol.content[locale]}</div>
`.trim();

  return content;
}

// Helper functions
function getWeeklyContent(city: CityConfig, cityData: CitySpecificContent, locale: Locale): string {
  const loc = city.localized[locale];
  const templates = {
    uk: `Тижнева оренда авто у ${loc.nameLocative} — найкращий баланс ціни та свободи: один фіксований тариф на сім днів і власний темп без очікування таксі та пересадок.<br/>За тиждень легко поєднати місто та виїзди: ${cityData.weekendTrip[locale]}.<br/>Формат «тиждень» дає більше часу перевірити маршрут і автомобіль, ніж погодинний прокат, і за потреби просто продовжити строк.`,
    ru: `Недельная аренда авто в ${loc.nameLocative} — лучший баланс цены и свободы: один фиксированный тариф на семь дней и собственный темп без ожидания такси и пересадок.<br/>За неделю легко совместить город и выезды: ${cityData.weekendTrip[locale]}.<br/>Формат «неделя» даёт больше времени проверить маршрут и автомобиль, чем почасовой прокат, и при необходимости просто продлить срок.`,
    en: `Weekly car rental in ${loc.name} — the best balance of price and freedom: one fixed rate for seven days and your own pace without waiting for taxis and transfers.<br/>In a week, it's easy to combine the city and trips: ${cityData.weekendTrip[locale]}.<br/>The "week" format gives more time to check the route and car than hourly rental, and if necessary, simply extend the term.`,
  };
  return templates[locale];
}

function getMonthlyRoutesContent(_city: CityConfig, cityData: CitySpecificContent, locale: Locale): string {
  const templates = {
    uk: `Формат «30 днів» створений для регулярних бізнес-поЇздок і міжміських маршрутів: ${cityData.routes[locale]}.<br/>Один автомобіль закриває всі задачі місяця: офіс, зустрічі, переїзди, зустріч партнерів і гостей.<br/>За потреби легко продовжити строк або змінити клас моделі.`,
    ru: `Формат «30 дней» создан для регулярных бизнес-поездок и междугородних маршрутов: ${cityData.routes[locale]}.<br/>Один автомобиль закрывает все задачи месяца: офис, встречи, переезды, встреча партнёров и гостей.<br/>При необходимости легко продлить срок или сменить класс модели.`,
    en: `The "30 days" format is designed for regular business trips and intercity routes: ${cityData.routes[locale]}.<br/>One car covers all the tasks of the month: office, meetings, relocations, meeting partners and guests.<br/>If necessary, it's easy to extend the term or change the model class.`,
  };
  return templates[locale];
}

function getLongTermContent(_city: CityConfig, cityData: CitySpecificContent, locale: Locale): string {
  const templates = {
    uk: `Це зручно й економічно: машина завжди під рукою для щоденних справ та міжміських поїздок — офіс, зустрічі, філії, регулярні маршрути ${cityData.routes[locale]}.<br/>Формат дозволяє планувати навантаження на місяць уперед, а при зміні задач — легко продовжити строк або замінити модель на більш підходящу (міський седан, універсал, кросовер).<br/>За запитом організуємо подачу й повернення в інших містах України.`,
    ru: `Это удобно и экономично: машина всегда под рукой для ежедневных дел и междугородних поездок — офис, встречи, филиалы, регулярные маршруты ${cityData.routes[locale]}.<br/>Формат позволяет планировать нагрузку на месяц вперёд, а при смене задач — легко продлить срок или заменить модель на более подходящую (городской седан, универсал, кроссовер).<br/>По запросу организуем подачу и возврат в других городах Украины.`,
    en: `It's convenient and economical: the car is always at hand for daily tasks and intercity trips — office, meetings, branches, regular routes ${cityData.routes[locale]}.<br/>The format allows you to plan the workload for a month ahead, and when tasks change — easily extend the term or replace the model with a more suitable one (city sedan, station wagon, crossover).<br/>On request, we organize delivery and return in other cities of Ukraine.`,
  };
  return templates[locale];
}

function getAdvantagesWithLocation(_city: CityConfig, cityData: CitySpecificContent, locale: Locale): string {
  const airportLine = cityData.airport
    ? {
        uk: `<li>Видача там, де зручно — ${cityData.airport.name[locale]}, вокзал, центр міста або подача за адресою.</li>`,
        ru: `<li>Выдача там, где удобно — ${cityData.airport.name[locale]}, вокзал, центр города или подача по адресу.</li>`,
        en: `<li>Pickup where convenient — ${cityData.airport.name[locale]}, railway station, city center, or delivery to your address.</li>`,
      }[locale]
    : {
        uk: `<li>Видача там, де зручно — вокзал, центр міста або подача за адресою.</li>`,
        ru: `<li>Выдача там, где удобно — вокзал, центр города или подача по адресу.</li>`,
        en: `<li>Pickup where convenient — railway station, city center, or delivery to your address.</li>`,
      }[locale];

  const baseList = staticContent.advantagesList[locale];
  // Insert airport line after the second <li>
  const parts = baseList.split("</li>");
  if (parts.length > 2) {
    parts.splice(2, 0, airportLine.replace("<li>", "").replace("</li>", ""));
  }
  return parts.join("</li>");
}

function getDriverServiceContent(_city: CityConfig, cityData: CitySpecificContent, locale: Locale): string {
  const airportText = cityData.airport
    ? cityData.airport.name[locale]
    : {
        uk: "до готелю або на вокзал",
        ru: "к отелю или на вокзал",
        en: "to the hotel or railway station",
      }[locale];

  const templates = {
    uk: `Бажаєте комфорт без керма? Замовте авто з професійним водієм — ми подамо його в ${airportText}, до готелю або за вашою адресою.`,
    ru: `Хотите комфорт без руля? Закажите авто с профессиональным водителем — мы подадим его в ${airportText}, к отелю или по вашему адресу.`,
    en: `Want comfort without driving? Order a car with a professional driver — we'll deliver it to ${airportText}, hotel, or your address.`,
  };
  return templates[locale];
}

function getDeliveryContent(city: CityConfig, cityData: CitySpecificContent, locale: Locale): string {
  const loc = city.localized[locale];
  const locations = cityData.localAttractions[locale];
  const airportText = cityData.airport
    ? {
        uk: ` та ${cityData.airport.name[locale]}`,
        ru: ` и ${cityData.airport.name[locale]}`,
        en: ` and ${cityData.airport.name[locale]}`,
      }[locale]
    : "";

  const templates = {
    uk: `Безкоштовно по ${loc.name}. Подаємо автомобіль у межах міста — ${locations}${airportText} — без доплат${cityData.airport ? " (паркування в аеропорту оплачує клієнт)" : ""}.<br/>За містом — платно. Можлива подача по області і по всій Україні. Вартість залежить від адреси і кілометражу — уточнюється у адміністратора перед підтвердженням броні.<br/>Повернення. У межах ${loc.name} — без доплат; за містом — за тими ж умовами, що і подача.<br/>Як оформити. При бронюванні оберіть «подача за адресою» і вкажіть місце/час. Адміністратор підтвердить деталі і, при виїзді за ${loc.name}, назве вартість.`,
    ru: `Бесплатно по ${loc.name}. Подаём автомобиль в пределах города — ${locations}${airportText} — без доплат${cityData.airport ? " (парковка в аэропорту оплачивается клиентом)" : ""}.<br/>За городом — платно. Возможна подача по области и по всей Украине. Стоимость зависит от адреса и километража — уточняется у администратора перед подтверждением брони.<br/>Возврат. В пределах ${loc.name} — без доплат; за городом — на тех же условиях, что и подача.<br/>Как оформить. При бронировании выберите «подача по адресу» и укажите место/время. Администратор подтвердит детали и, при выезде за ${loc.name}, назовёт стоимость.`,
    en: `Free delivery in ${loc.name}. We deliver the car within the city — ${locations}${airportText} — at no extra charge${cityData.airport ? " (airport parking is paid by the client)" : ""}.<br/>Outside the city — paid. Delivery throughout the region and all of Ukraine is possible. The cost depends on the address and mileage — clarified with the administrator before booking confirmation.<br/>Return. Within ${loc.name} — at no extra charge; outside the city — under the same conditions as delivery.<br/>How to book. When booking, select "delivery to address" and specify the place/time. The administrator will confirm the details and, if traveling outside ${loc.name}, will name the cost.`,
  };
  return templates[locale];
}

function generateFallbackContent(city: CityConfig, locale: Locale): string {
  // Базовий контент для міст без специфічних даних
  const loc = city.localized[locale];
  const templates = {
    uk: `<div class='editor_text'>REIZ — це прокат автомобілів у ${loc.nameLocative} з увагою до деталей та прозорими умовами. Ми подаємо авто по місту і можемо доставити машину у будь-яку точку України за запитом.<br/><br/>Наш автопарк покриває будь-які потреби: статусний <h2>прокат преміум-авто</h2> для бізнесу, надійна <h2>оренда позашляховиків</h2> для мандрівок та місткий <h2>прокат мінівенів</h2> для сім'ї. Навіть якщо ви шукаєте <h2>оренду авто економ-класу</h2>, ми запропонуємо вам значно вищий рівень комфорту та новіші моделі.</div>`,
    ru: `<div class='editor_text'>REIZ — это прокат автомобилей в ${loc.nameLocative} с вниманием к деталям и прозрачными условиями. Мы подаём авто по городу и можем доставить машину в любую точку Украины по запросу.<br/><br/>Наш автопарк покрывает любые потребности: статусный <h2>прокат премиум-авто</h2> для бизнеса, надёжная <h2>аренда внедорожников</h2> для путешествий и вместительный <h2>прокат минивэнов</h2> для семьи. Даже если вы ищете <h2>аренду авто эконом-класса</h2>, мы предложим вам значительно более высокий уровень комфорта и новые модели.</div>`,
    en: `<div class='editor_text'>REIZ is a car rental in ${loc.name} with attention to detail and transparent terms. We deliver cars throughout the city and can deliver a car to any point in Ukraine upon request.<br/><br/>Our fleet covers all needs: prestigious <h2>premium car hire</h2> for business, reliable <h2>SUV rental</h2> for travel, and spacious <h2>minivan rental</h2> for families. Even if you're looking for <h2>economy car rental</h2>, we'll offer you a significantly higher level of comfort and newer models.</div>`,
  };
  return templates[locale];
}

// ============================================
// ГЕНЕРАТОР ЗАГОЛОВКА СЕКЦІЇ
// ============================================
export function generateCityEditorTitle(
  city: CityConfig,
  locale: Locale
): string {
  if (city.slug === "kyiv") {
    const kyivTitles = {
      uk: "Оренда авто в Києві з REIZ: Столичний ритм руху",
      ru: "Аренда авто в Киеве с REIZ: Столичный ритм движения",
      en: "Car Rental in Kyiv with REIZ: Capital City Rhythm",
    };
    return kyivTitles[locale];
  }
  if (city.slug === "odesa") {
    const odesaTitles = {
      uk: "Оренда авто в Одесі: Свобода руху біля моря",
      ru: "Аренда авто в Одессе: Свобода движения у моря",
      en: "Car Rental in Odesa: Freedom of Movement by the Sea",
    };
    return odesaTitles[locale];
  }
  if (city.slug === "dnipro") {
    const dniproTitles = {
      uk: "Оренда авто у Дніпрі: Швидкість та комфорт бізнес-столиці",
      ru: "Аренда авто в Днепре: Скорость и комфорт бизнес-столицы",
      en: "Car Rental in Dnipro: Speed and Comfort of the Business Capital",
    };
    return dniproTitles[locale];
  }
  if (city.slug === "kharkiv") {
    const kharkivTitles = {
      uk: "Оренда авто у Харкові: Максимальний комфорт у Першій столиці",
      ru: "Аренда авто в Харькове: Максимальный комфорт в Первой столице",
      en: "Car Rental in Kharkiv: Maximum Comfort in the First Capital",
    };
    return kharkivTitles[locale];
  }
  if (city.slug === "zaporizhzhia") {
    const zaporizhzhiaTitles = {
      uk: "Оренда авто у Запоріжжі: Енергія та драйв великого міста",
      ru: "Аренда авто в Запорожье: Энергия и драйв большого города",
      en: "Car Rental in Zaporizhzhia: Energy and Drive of the Big City",
    };
    return zaporizhzhiaTitles[locale];
  }
  if (city.slug === "boryspil") {
    const boryspilTitles = {
      uk: "Оренда авто в Борисполі: Мобільність одразу з трапа літака",
      ru: "Аренда авто в Борисполе: Мобильность сразу с трапа самолета",
      en: "Car Rental in Boryspil: Mobility Right from the Plane Steps",
    };
    return boryspilTitles[locale];
  }
  if (city.slug === "lutsk") {
    const lutskTitles = {
      uk: "Оренда авто в Луцьку з REIZ: волинські маршрути з комфортом",
      ru: "Аренда авто в Луцке с REIZ: волынские маршруты с комфортом",
      en: "Car Rental in Lutsk with REIZ: Explore Volyn with Comfort",
    };
    return lutskTitles[locale];
  }
  if (city.slug === "kalush") {
    const kalushTitles = {
      uk: "Оренда авто в Калуші з REIZ: комфортний старт до Карпат",
      ru: "Аренда авто в Калуше с REIZ: комфортный старт в Карпаты",
      en: "Car Rental in Kalush with REIZ: Your Gateway to the Carpathians",
    };
    return kalushTitles[locale];
  }
  if (city.slug === "nadvirna") {
    const nadvirnaTitles = {
      uk: "Оренда авто в Надвірній з REIZ: ваш старт у Карпати",
      ru: "Аренда авто в Надворной с REIZ: ваш старт в Карпаты",
      en: "Car Rental in Nadvirna with REIZ: Your Gateway to the Mountains",
    };
    return nadvirnaTitles[locale];
  }
  if (city.slug === "kosiv") {
    const kosivTitles = {
      uk: "Оренда авто у Косові з REIZ: серце Гуцульщини за кермом",
      ru: "Аренда авто в Косове с REIZ: сердце Гуцульщины за рулем",
      en: "Car Rental in Kosiv with REIZ: The Heart of Hutsulshchyna",
    };
    return kosivTitles[locale];
  }
  if (city.slug === "chortkiv") {
    const chortkivTitles = {
      uk: "Оренда авто в Чорткові з REIZ: подорожі Поділлям без обмежень",
      ru: "Аренда авто в Чорткове с REIZ: путешествия по Подолью без ограничений",
      en: "Car Rental in Chortkiv with REIZ: Explore Podillia Without Limits",
    };
    return chortkivTitles[locale];
  }
  if (city.slug === "kremenets") {
    const kremenetsTitles = {
      uk: "Оренда авто у Кременці з REIZ: підкорюйте пагорби з комфортом",
      ru: "Аренда авто в Кременце с REIZ: покоряйте холмы с комфортом",
      en: "Car Rental in Kremenets with REIZ: Conquer the Hills with Comfort",
    };
    return kremenetsTitles[locale];
  }
  if (city.slug === "berehove") {
    const berehoveTitles = {
      uk: "Оренда авто в Берегові з REIZ: термальні води та кордон поруч",
      ru: "Аренда авто в Берегово с REIZ: термальные воды и граница рядом",
      en: "Car Rental in Berehove with REIZ: Thermal Spas & Border Proximity",
    };
    return berehoveTitles[locale];
  }
  if (city.slug === "khust") {
    const khustTitles = {
      uk: "Оренда авто в Хусті з REIZ: центр Закарпаття",
      ru: "Аренда авто в Хусте с REIZ: центр Закарпатья",
      en: "Car Rental in Khust with REIZ: The Heart of Transcarpathia",
    };
    return khustTitles[locale];
  }
  if (city.slug === "rakhiv") {
    const rakhivTitles = {
      uk: "Оренда авто в Рахові з REIZ: висота під контролем",
      ru: "Аренда авто в Рахове с REIZ: высота под контролем",
      en: "Car Rental in Rakhiv with REIZ: Altitude Under Control",
    };
    return rakhivTitles[locale];
  }
  if (city.slug === "bukovel") {
    const bukovelTitles = {
      uk: "Оренда авто в Буковелі: Ваша свобода в серці Карпат",
      ru: "Аренда авто в Буковеле: Ваша свобода в сердце Карпат",
      en: "Car Rental in Bukovel: Your Freedom in the Heart of the Carpathians",
    };
    return bukovelTitles[locale];
  }
  if (city.slug === "ternopil") {
    const ternopilTitles = {
      uk: "Оренда авто у Тернополі: Подорожі серцем Галичини",
      ru: "Аренда авто в Тернополе: Путешествия по сердцу Галичины",
      en: "Car Rental in Ternopil: Journeys Through the Heart of Halychyna",
    };
    return ternopilTitles[locale];
  }
  if (city.slug === "truskavets") {
    const truskavetsTitles = {
      uk: "Оренда авто у Трускавці: Комфорт вашого оздоровлення",
      ru: "Аренда авто в Трускавце: Комфорт вашего оздоровления",
      en: "Car Rental in Truskavets: Comfort of Your Recovery",
    };
    return truskavetsTitles[locale];
  }
  if (city.slug === "chernivtsi") {
    const chernivtsiTitles = {
      uk: "Оренда авто у Чернівцях: Відкрийте \"Маленький Відень\" та Буковину",
      ru: "Аренда авто в Черновцах: Откройте \"Маленькую Вену\" и Буковину",
      en: "Car Rental in Chernivtsi: Discover \"Little Vienna\" and Bukovina",
    };
    return chernivtsiTitles[locale];
  }
  if (city.slug === "ivano-frankivsk") {
    const ivanoFrankivskTitles = {
      uk: "Оренда авто в Івано-Франківську: Старт вашої карпатської пригоди",
      ru: "Аренда авто в Ивано-Франковске: Старт вашего карпатского приключения",
      en: "Car Rental in Ivano-Frankivsk: Start of Your Carpathian Adventure",
    };
    return ivanoFrankivskTitles[locale];
  }
  if (city.slug === "skhidnytsia") {
    const skhidnytsiaTitles = {
      uk: "Оренда авто у Східниці: Мобільність в \"Українській Швейцарії\"",
      ru: "Аренда авто в Сходнице: Комфорт среди гор и источников",
      en: "Car Rental in Skhidnytsia: Mobility in the \"Ukrainian Switzerland\"",
    };
    return skhidnytsiaTitles[locale];
  }
  if (city.slug === "uzhhorod") {
    const uzhhorodTitles = {
      uk: "Оренда авто в Ужгороді: Ворота в Європу та серце Закарпаття",
      ru: "Аренда авто в Ужгороде: Ворота в Европу и сердце Закарпатья",
      en: "Car Rental in Uzhhorod: Gateway to Europe and Heart of Zakarpattia",
    };
    return uzhhorodTitles[locale];
  }
  if (city.slug === "vinnytsia") {
    const vinnytsiaTitles = {
      uk: "Оренда авто у Вінниці: Комфорт у серці Поділля",
      ru: "Аренда авто в Виннице: Комфорт в сердце Подолья",
      en: "Car Rental in Vinnytsia: Comfort in the Heart of Podillia",
    };
    return vinnytsiaTitles[locale];
  }
  if (city.slug === "mukachevo") {
    const mukachevoTitles = {
      uk: "Оренда авто в Мукачеві: Центр вашого закарпатського маршруту",
      ru: "Аренда авто в Мукачево: Центр вашего закарпатского маршрута",
      en: "Car Rental in Mukachevo: The Hub of Your Transcarpathian Route",
    };
    return mukachevoTitles[locale];
  }
  if (city.slug === "poltava") {
    const poltavaTitles = {
      uk: "Оренда авто у Полтаві: Комфорт у серці України",
      ru: "Аренда авто в Полтаве: Комфорт в сердце Украины",
      en: "Car Rental in Poltava: Comfort in the Heart of Ukraine",
    };
    return poltavaTitles[locale];
  }

  const loc = city.localized[locale];
  const templates = {
    uk: `Оренда авто у ${loc.nameLocative} з REIZ: новий підхід до комфорту`,
    ru: `Аренда авто в ${loc.nameLocative} с REIZ: новый подход к комфорту`,
    en: `Car Rental in ${loc.name} with REIZ: A New Approach to Comfort`,
  };
  return templates[locale];
}

// ============================================
// ОТРИМАННЯ FAQ ДЛЯ МІСТА
// ============================================
export type CityFAQFormatted = {
  title: string;
  items: {
    question: string;
    answer: string;
  }[];
};

const FAQ_REQUIRED_SECTIONS = 4;
const FAQ_REQUIRED_ITEMS = 12;

const DEFAULT_LOCAL_ATTRACTIONS = {
  uk: "центр міста та вашу адресу",
  ru: "центр города и ваш адрес",
  en: "the city center and your address",
};

const DEFAULT_ROUTES = {
  uk: "поїздки по області та в сусідні міста",
  ru: "поездки по области и в соседние города",
  en: "trips around the region and nearby cities",
};

const DEFAULT_WEEKEND = {
  uk: "популярні туристичні локації регіону",
  ru: "популярные туристические локации региона",
  en: "popular tourist spots in the region",
};

const joinWithConjunction = (items: string[], locale: Locale): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];

  const conjunction = {
    uk: "та",
    ru: "и",
    en: "and",
  }[locale];

  if (items.length === 2) {
    return `${items[0]} ${conjunction} ${items[1]}`;
  }

  return `${items.slice(0, -1).join(", ")} ${conjunction} ${items[items.length - 1]}`;
};

const getPickupLocationsText = (city: CityConfig, locale: Locale): string => {
  const locations =
    cityPickupLocations[city.slug]
      ?.map((location) => location.name[locale])
      .filter(Boolean) ?? [];

  if (locations.length === 0) {
    return {
      uk: "подача по місту",
      ru: "подача по городу",
      en: "city center pickup",
    }[locale];
  }

  return joinWithConjunction(locations.slice(0, 3), locale);
};

const getAirportSentence = (
  cityData: CitySpecificContent | undefined,
  locale: Locale
): string => {
  const airportName = cityData?.airport?.name?.[locale];
  if (!airportName) return "";

  const templates = {
    uk: `Подача в ${airportName} можлива за попереднім узгодженням, час та умови підтвердить менеджер.`,
    ru: `Подача в ${airportName} возможна по предварительному согласованию, время и условия подтвердит менеджер.`,
    en: `Delivery to ${airportName} is available by request; the manager confirms time and terms.`,
  };

  return templates[locale];
};

const generateCityFaqTemplate = (
  city: CityConfig,
  locale: Locale
): CityFAQFormatted[] => {
  const loc = city.localized[locale];
  const cityName = locale === "en" ? loc.name : loc.nameLocative;
  const cityData = citySpecificContent[city.slug];

  const pickupLocations = getPickupLocationsText(city, locale);
  const localAttractions =
    cityData?.localAttractions?.[locale] ?? DEFAULT_LOCAL_ATTRACTIONS[locale];
  const routes = cityData?.routes?.[locale] ?? DEFAULT_ROUTES[locale];
  const weekendTrip = cityData?.weekendTrip?.[locale] ?? DEFAULT_WEEKEND[locale];
  const airportSentence = getAirportSentence(cityData, locale);

  const deliveryAnswer = [
    {
      uk: `Найчастіші точки подачі: ${pickupLocations}.`,
      ru: `Частые точки подачи: ${pickupLocations}.`,
      en: `Common pickup points: ${pickupLocations}.`,
    }[locale],
    {
      uk: `Також доставляємо авто в ${localAttractions}.`,
      ru: `Также доставляем авто в ${localAttractions}.`,
      en: `We can also deliver the car to ${localAttractions}.`,
    }[locale],
    airportSentence,
  ]
    .filter(Boolean)
    .join(" ");

  return [
    {
      title: {
        uk: "Практична інформація",
        ru: "Практическая информация",
        en: "Practical Information",
      }[locale],
      items: [
        {
          question: {
            uk: `Де паркувати орендований автомобіль у ${cityName} і як уникнути штрафів?`,
            ru: `Где парковать арендованный автомобиль в ${cityName} и как избежать штрафов?`,
            en: `Where to park a rental car in ${loc.name} and how to avoid fines?`,
          }[locale],
          answer: {
            uk: "У центральних районах часто діє платне паркування — користуйтеся паркоматами або міськими додатками та перевіряйте знаки. Поза центром паркування зазвичай безкоштовне. Уникайте зупинок на тротуарах і під знаками «Зупинку заборонено».",
            ru: "В центральных районах часто действует платная парковка — используйте паркоматы или городские приложения и проверяйте знаки. Вне центра парковка обычно бесплатная. Избегайте остановок на тротуарах и под знаками «Остановка запрещена».",
            en: "Paid parking often applies in central areas — use meters or city apps and check signage. Outside the center, parking is usually free. Avoid sidewalks and No Stopping zones.",
          }[locale],
        },
        {
          question: {
            uk: `Де можна отримати авто в ${cityName} і чи є подача на вокзал/аеропорт?`,
            ru: `Где можно получить авто в ${cityName} и есть ли подача на вокзал/аэропорт?`,
            en: `Where can I pick up a car in ${loc.name} and is airport/station delivery available?`,
          }[locale],
          answer: deliveryAnswer,
        },
        {
          question: {
            uk: `Які маршрути з ${cityName} найпопулярніші?`,
            ru: `Какие маршруты из ${cityName} самые популярные?`,
            en: `Which routes from ${loc.name} are most popular?`,
          }[locale],
          answer: {
            uk: `Популярні маршрути: ${routes}. Для відпочинку радимо ${weekendTrip}.`,
            ru: `Популярные маршруты: ${routes}. Для отдыха рекомендуем ${weekendTrip}.`,
            en: `Popular routes: ${routes}. For a weekend trip, consider ${weekendTrip}.`,
          }[locale],
        },
      ],
    },
    {
      title: {
        uk: "Страхування та депозит",
        ru: "Страхование и депозит",
        en: "Insurance and Deposit",
      }[locale],
      items: [
        {
          question: {
            uk: `Що покриває страховка при оренді авто у ${cityName}?`,
            ru: `Что покрывает страховка при аренде авто в ${cityName}?`,
            en: `What does insurance cover when renting a car in ${loc.name}?`,
          }[locale],
          answer: {
            uk: "Базово авто застраховане ОСЦПВ і покриває шкоду третім особам. Додаткові пакети CDW/SCDW зменшують вашу відповідальність за пошкодження авто. Розширене покриття може включати скло, шини та дзеркала.",
            ru: "Базово авто застраховано по ОСАГО и покрывает ущерб третьим лицам. Дополнительные пакеты CDW/SCDW уменьшают вашу ответственность за повреждение авто. Расширенное покрытие может включать стекло, шины и зеркала.",
            en: "Every car has mandatory MTPL covering third-party damage. CDW/SCDW packages reduce your liability for car damage. Extended coverage may include glass, tires, and mirrors.",
          }[locale],
        },
        {
          question: {
            uk: `Франшиза та депозит у ${cityName}: у чому різниця?`,
            ru: `Франшиза и депозит в ${cityName}: в чем разница?`,
            en: `Deductible and deposit in ${loc.name}: what's the difference?`,
          }[locale],
          answer: {
            uk: "Депозит блокується на картці на час оренди й повертається після приймання авто. Франшиза — максимальна сума вашої відповідальності при страховому випадку. Страхові пакети зменшують обидві суми.",
            ru: "Депозит блокируется на карте на время аренды и возвращается после приема авто. Франшиза — максимальная сумма вашей ответственности при страховом случае. Страховые пакеты уменьшают обе суммы.",
            en: "The deposit is blocked on your card during the rental and returned after the car is accepted. The deductible is the maximum amount of your liability in case of an incident. Insurance packages reduce both amounts.",
          }[locale],
        },
        {
          question: {
            uk: `Чи можна орендувати авто у ${cityName} без застави?`,
            ru: `Можно ли арендовать авто в ${cityName} без залога?`,
            en: `Can I rent a car in ${loc.name} without a deposit?`,
          }[locale],
          answer: {
            uk: "Для окремих моделей доступна мінімальна застава або її відсутність при виборі розширеного страхування. Умови залежать від класу авто та строку оренди — уточнюйте у менеджера.",
            ru: "Для отдельных моделей доступен минимальный залог или его отсутствие при выборе расширенной страховки. Условия зависят от класса авто и срока аренды — уточняйте у менеджера.",
            en: "For selected models, a minimal deposit or no deposit is available with extended insurance. Terms depend on the car class and rental period — please check with the manager.",
          }[locale],
        },
      ],
    },
    {
      title: {
        uk: "Обмеження та заборони",
        ru: "Ограничения и запреты",
        en: "Restrictions and Prohibitions",
      }[locale],
      items: [
        {
          question: {
            uk: `Мінімальний вік і стаж водія для оренди авто у ${cityName}`,
            ru: `Минимальный возраст и стаж водителя для аренды авто в ${cityName}`,
            en: `Minimum age and driving experience for car rental in ${loc.name}`,
          }[locale],
          answer: {
            uk: "Мінімальний вік — 21 рік, стаж водіння — від 2 років. Для преміум-авто та кросоверів вимоги можуть бути вищі: від 25 років і стаж від 3 років.",
            ru: "Минимальный возраст — 21 год, стаж вождения — от 2 лет. Для премиум-авто и кроссоверов требования могут быть выше: от 25 лет и стаж от 3 лет.",
            en: "Minimum age is 21 and driving experience from 2 years. For premium cars and crossovers, requirements may be higher: from 25 years and 3+ years of experience.",
          }[locale],
        },
        {
          question: {
            uk: `Чи можна виїжджати за межі України на орендованому авто з ${cityName}?`,
            ru: `Можно ли выезжать за пределы Украины на арендованном авто из ${cityName}?`,
            en: `Can I travel outside Ukraine with a rental car from ${loc.name}?`,
          }[locale],
          answer: {
            uk: "Так, за попереднім погодженням. Потрібно повідомити менеджера заздалегідь і оформити додаткові документи (Green Card). Список дозволених країн уточнюється індивідуально.",
            ru: "Да, по предварительному согласованию. Нужно заранее сообщить менеджеру и оформить дополнительные документы (Green Card). Список разрешенных стран уточняется индивидуально.",
            en: "Yes, with prior approval. Please notify the manager in advance and arrange additional documents (Green Card). The list of permitted countries is confirmed individually.",
          }[locale],
        },
        {
          question: {
            uk: "Передача авто третім особам і робота в таксі: що заборонено",
            ru: "Передача авто третьим лицам и работа в такси: что запрещено",
            en: "Transferring the car to third parties and taxi use: what's prohibited",
          }[locale],
          answer: {
            uk: "Заборонено передавати авто особам, не вказаним у договорі, використовувати для таксі/доставки, суборенди, участі в перегонах та буксирування інших авто. Порушення призводять до штрафу та розірвання договору.",
            ru: "Запрещено передавать авто лицам, не указанным в договоре, использовать для такси/доставки, субаренды, участия в гонках и буксировки других авто. Нарушения приводят к штрафу и расторжению договора.",
            en: "It is prohibited to transfer the car to anyone not listed in the contract, use it for taxi/delivery, sublet it, participate in races, or tow other vehicles. Violations lead to penalties and contract termination.",
          }[locale],
        },
      ],
    },
    {
      title: {
        uk: "Оплата та документи",
        ru: "Оплата и документы",
        en: "Payment and Documents",
      }[locale],
      items: [
        {
          question: {
            uk: `Які способи оплати доступні при оренді авто у ${cityName}?`,
            ru: `Какие способы оплаты доступны при аренде авто в ${cityName}?`,
            en: `What payment methods are available for car rental in ${loc.name}?`,
          }[locale],
          answer: {
            uk: "Приймаємо Visa/Mastercard (Apple Pay, Google Pay), готівку UAH/USD/EUR та безготівковий розрахунок для юридичних осіб. Депозит блокується на картці або вноситься готівкою.",
            ru: "Принимаем Visa/Mastercard (Apple Pay, Google Pay), наличные UAH/USD/EUR и безналичный расчет для юридических лиц. Депозит блокируется на карте или вносится наличными.",
            en: "We accept Visa/Mastercard (Apple Pay, Google Pay), cash UAH/USD/EUR, and bank transfer for legal entities. The deposit is blocked on the card or paid in cash.",
          }[locale],
        },
        {
          question: {
            uk: `Які документи потрібні для оренди авто у ${cityName}?`,
            ru: `Какие документы нужны для аренды авто в ${cityName}?`,
            en: `What documents are required to rent a car in ${loc.name}?`,
          }[locale],
          answer: {
            uk: "Громадянам України потрібні паспорт/ID-картка, посвідчення водія кат. B та ІПН. Іноземцям — закордонний паспорт, водійське посвідчення (міжнародне, якщо права не латиницею) і віза/штамп в'їзду.",
            ru: "Гражданам Украины нужны паспорт/ID-карта, водительское удостоверение кат. B и ИНН. Иностранцам — загранпаспорт, водительское удостоверение (международное, если права не на латинице) и виза/штамп въезда.",
            en: "Ukrainian citizens need a passport/ID, a category B driver's license, and tax ID. Foreigners need a passport, a driver's license (international if not in Latin), and an entry visa/stamp.",
          }[locale],
        },
        {
          question: {
            uk: "Політика пального «повний‑повний»: як повернути авто без доплат?",
            ru: "Политика топлива «полный‑полный»: как вернуть авто без доплат?",
            en: "Full-to-full fuel policy: how to return a car without extra charges?",
          }[locale],
          answer: {
            uk: "Авто видається з повним баком — поверніть також із повним. Якщо не встигаєте заправитись, можемо заправити за ринковою ціною + сервісний збір.",
            ru: "Авто выдаётся с полным баком — верните также с полным. Если не успеваете заправиться, можем заправить по рыночной цене + сервисный сбор.",
            en: "The car is provided with a full tank — return it full as well. If you don't have time to refuel, we can fill it at market price plus a service fee.",
          }[locale],
        },
      ],
    },
  ];
};

const countFaqItems = (sections: CityFAQSection[]): number =>
  sections.reduce((total, section) => total + section.items.length, 0);

const hasRequiredFaq = (sections: CityFAQSection[]): boolean =>
  sections.length === FAQ_REQUIRED_SECTIONS &&
  countFaqItems(sections) === FAQ_REQUIRED_ITEMS &&
  sections.every((section) => section.items.length === 3);

const formatCityFaqSections = (
  sections: CityFAQSection[],
  locale: Locale
): CityFAQFormatted[] =>
  sections.map((section) => ({
    title: section.title[locale],
    items: section.items.map((item) => ({
      question: item.question[locale],
      answer: item.answer[locale],
    })),
  }));

export function getCityFAQ(
  city: CityConfig,
  locale: Locale
): CityFAQFormatted[] {
  const faqSections = cityFAQData[city.slug];
  if (faqSections && hasRequiredFaq(faqSections)) {
    return formatCityFaqSections(faqSections, locale);
  }

  return generateCityFaqTemplate(city, locale);
}
