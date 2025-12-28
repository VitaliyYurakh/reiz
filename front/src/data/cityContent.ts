import type { CityConfig } from "./cities";

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

export function getCityFAQ(
  city: CityConfig,
  locale: Locale
): CityFAQFormatted[] {
  const faqSections = cityFAQData[city.slug];
  if (!faqSections) return [];

  return faqSections.map((section) => ({
    title: section.title[locale],
    items: section.items.map((item) => ({
      question: item.question[locale],
      answer: item.answer[locale],
    })),
  }));
}
