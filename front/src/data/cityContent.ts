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
export function generateCityEditorContent(
  city: CityConfig,
  locale: Locale
): string {
  const cityData = citySpecificContent[city.slug];

  if (!cityData) {
    // Fallback для невідомих міст
    return generateFallbackContent(city, locale);
  }

  const loc = city.localized[locale];
  const introText = {
    uk: `REIZ — це прокат автомобілів у ${loc.nameLocative} з увагою до деталей та прозорими умовами.<br/>Ми подаємо авто по місту і можемо доставити машину у будь-яку точку України за запитом.`,
    ru: `REIZ — это прокат автомобилей в ${loc.nameLocative} с вниманием к деталям и прозрачными условиями.<br/>Мы подаём авто по городу и можем доставить машину в любую точку Украины по запросу.`,
    en: `REIZ is a car rental service in ${loc.name} with attention to detail and transparent terms.<br/>We deliver cars throughout the city and can deliver a car to any point in Ukraine upon request.`,
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
    uk: `<div class='editor_text'>REIZ — це прокат автомобілів у ${loc.nameLocative} з увагою до деталей та прозорими умовами.<br/>Ми подаємо авто по місту і можемо доставити машину у будь-яку точку України за запитом.</div>`,
    ru: `<div class='editor_text'>REIZ — это прокат автомобилей в ${loc.nameLocative} с вниманием к деталям и прозрачными условиями.<br/>Мы подаём авто по городу и можем доставить машину в любую точку Украины по запросу.</div>`,
    en: `<div class='editor_text'>REIZ is a car rental in ${loc.name} with attention to detail and transparent terms.<br/>We deliver cars throughout the city and can deliver a car to any point in Ukraine upon request.</div>`,
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
