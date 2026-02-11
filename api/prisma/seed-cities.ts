// Seed data for cities and pickup locations
// Extracted from front/src/data/cities.ts

interface SeedCity {
    slug: string;
    nameUk: string; nameRu: string; nameEn: string;
    nameLocativeUk: string; nameLocativeRu: string; nameLocativeEn: string;
    latitude: string; longitude: string;
    postalCode: string; region: string;
    sortOrder: number;
}

interface SeedLocation {
    slug: string;
    nameUk: string; nameRu: string; nameEn: string;
    type: string;
    sortOrder: number;
}

// Helper: c(slug, uk, ru, en, ukL, ruL, enL, lat, lng, postal, region, order)
function c(slug: string, uk: string, ru: string, en: string, ukL: string, ruL: string, enL: string, lat: string, lng: string, postal: string, region: string, order: number): SeedCity {
    return {slug, nameUk: uk, nameRu: ru, nameEn: en, nameLocativeUk: ukL, nameLocativeRu: ruL, nameLocativeEn: enL, latitude: lat, longitude: lng, postalCode: postal, region, sortOrder: order};
}

// Helper: l(slug, uk, ru, en, type, order)
function l(slug: string, uk: string, ru: string, en: string, type: string, order: number): SeedLocation {
    return {slug, nameUk: uk, nameRu: ru, nameEn: en, type, sortOrder: order};
}

export const popularCitySlugs = [
    'kyiv', 'lviv', 'odesa', 'dnipro', 'kharkiv', 'ivano-frankivsk', 'uzhhorod',
    'vinnytsia', 'zaporizhzhia', 'ternopil', 'poltava', 'chernivtsi', 'mukachevo',
    'bukovel', 'truskavets', 'skhidnytsia', 'boryspil',
];

export const seedCities: SeedCity[] = [
    c('kyiv', 'Київ', 'Киев', 'Kyiv', 'Києві', 'Киеве', 'Kyiv', '50.4501', '30.5234', '01001', 'Київська область', 0),
    c('lviv', 'Львів', 'Львов', 'Lviv', 'Львові', 'Львове', 'Lviv', '49.8397', '24.0297', '79000', 'Львівська область', 1),
    c('ternopil', 'Тернопіль', 'Тернополь', 'Ternopil', 'Тернополі', 'Тернополе', 'Ternopil', '49.5535', '25.5948', '46001', 'Тернопільська область', 2),
    c('odesa', 'Одеса', 'Одесса', 'Odesa', 'Одесі', 'Одессе', 'Odesa', '46.4825', '30.7233', '65000', 'Одеська область', 3),
    c('dnipro', 'Дніпро', 'Днепр', 'Dnipro', 'Дніпрі', 'Днепре', 'Dnipro', '48.4647', '35.0462', '49000', 'Дніпропетровська область', 4),
    c('kharkiv', 'Харків', 'Харьков', 'Kharkiv', 'Харкові', 'Харькове', 'Kharkiv', '49.9935', '36.2304', '61000', 'Харківська область', 5),
    c('bukovel', 'Буковель', 'Буковель', 'Bukovel', 'Буковелі', 'Буковеле', 'Bukovel', '48.3607', '24.4003', '78593', 'Івано-Франківська область', 6),
    c('truskavets', 'Трускавець', 'Трускавец', 'Truskavets', 'Трускавці', 'Трускавце', 'Truskavets', '49.2784', '23.5064', '82200', 'Львівська область', 7),
    c('ivano-frankivsk', 'Івано-Франківськ', 'Ивано-Франковск', 'Ivano-Frankivsk', 'Івано-Франківську', 'Ивано-Франковске', 'Ivano-Frankivsk', '48.9226', '24.7111', '76000', 'Івано-Франківська область', 8),
    c('skhidnytsia', 'Східниця', 'Сходница', 'Skhidnytsia', 'Східниці', 'Сходнице', 'Skhidnytsia', '49.2667', '23.4667', '82391', 'Львівська область', 9),
    c('uzhhorod', 'Ужгород', 'Ужгород', 'Uzhhorod', 'Ужгороді', 'Ужгороде', 'Uzhhorod', '48.6208', '22.2879', '88000', 'Закарпатська область', 10),
    c('vinnytsia', 'Вінниця', 'Винница', 'Vinnytsia', 'Вінниці', 'Виннице', 'Vinnytsia', '49.2328', '28.4681', '21000', 'Вінницька область', 11),
    c('zaporizhzhia', 'Запоріжжя', 'Запорожье', 'Zaporizhzhia', 'Запоріжжі', 'Запорожье', 'Zaporizhzhia', '47.8388', '35.1396', '69000', 'Запорізька область', 12),
    c('mukachevo', 'Мукачево', 'Мукачево', 'Mukachevo', 'Мукачеві', 'Мукачеве', 'Mukachevo', '48.4394', '22.7183', '89600', 'Закарпатська область', 13),
    c('poltava', 'Полтава', 'Полтава', 'Poltava', 'Полтаві', 'Полтаве', 'Poltava', '49.5883', '34.5514', '36000', 'Полтавська область', 14),
    c('chernivtsi', 'Чернівці', 'Черновцы', 'Chernivtsi', 'Чернівцях', 'Черновцах', 'Chernivtsi', '48.2920', '25.9358', '58000', 'Чернівецька область', 15),
    c('boryspil', 'Бориспіль', 'Борисполь', 'Boryspil', 'Борисполі', 'Борисполе', 'Boryspil', '50.3532', '30.9577', '08300', 'Київська область', 16),
    c('lutsk', 'Луцьк', 'Луцк', 'Lutsk', 'Луцьку', 'Луцке', 'Lutsk', '50.7472', '25.3254', '43000', 'Волинська область', 17),
    c('rivne', 'Рівне', 'Ровно', 'Rivne', 'Рівному', 'Ровно', 'Rivne', '50.6199', '26.2516', '33000', 'Рівненська область', 18),
    c('khmelnytskyi', 'Хмельницький', 'Хмельницкий', 'Khmelnytskyi', 'Хмельницькому', 'Хмельницком', 'Khmelnytskyi', '49.4230', '26.9871', '29000', 'Хмельницька область', 19),
    c('kamianets-podilskyi', 'Кам\'янець-Подільський', 'Каменец-Подольский', 'Kamianets-Podilskyi', 'Кам\'янці-Подільському', 'Каменце-Подольском', 'Kamianets-Podilskyi', '48.6744', '26.5809', '32300', 'Хмельницька область', 20),
    c('drohobych', 'Дрогобич', 'Дрогобыч', 'Drohobych', 'Дрогобичі', 'Дрогобыче', 'Drohobych', '49.3489', '23.5069', '82100', 'Львівська область', 21),
    c('stryi', 'Стрий', 'Стрый', 'Stryi', 'Стрию', 'Стрые', 'Stryi', '49.2606', '23.8536', '82400', 'Львівська область', 22),
    c('sambir', 'Самбір', 'Самбор', 'Sambir', 'Самборі', 'Самборе', 'Sambir', '49.5181', '23.2006', '81400', 'Львівська область', 23),
    c('chervonohrad', 'Червоноград', 'Червоноград', 'Chervonohrad', 'Червонограді', 'Червонограде', 'Chervonohrad', '50.3872', '24.2286', '80100', 'Львівська область', 24),
    c('boryslav', 'Борислав', 'Борислав', 'Boryslav', 'Бориславі', 'Бориславе', 'Boryslav', '49.2867', '23.4311', '82300', 'Львівська область', 25),
    c('zhovkva', 'Жовква', 'Жолква', 'Zhovkva', 'Жовкві', 'Жолкве', 'Zhovkva', '50.0547', '23.9714', '80300', 'Львівська область', 26),
    c('yaremche', 'Яремче', 'Яремче', 'Yaremche', 'Яремчі', 'Яремче', 'Yaremche', '48.4500', '24.5500', '78500', 'Івано-Франківська область', 27),
    c('kolomyia', 'Коломия', 'Коломыя', 'Kolomyia', 'Коломиї', 'Коломые', 'Kolomyia', '48.5310', '25.0339', '78200', 'Івано-Франківська область', 28),
    c('kalush', 'Калуш', 'Калуш', 'Kalush', 'Калуші', 'Калуше', 'Kalush', '49.0430', '24.3600', '77300', 'Івано-Франківська область', 29),
    c('nadvirna', 'Надвірна', 'Надворная', 'Nadvirna', 'Надвірній', 'Надворной', 'Nadvirna', '48.6340', '24.5790', '78400', 'Івано-Франківська область', 30),
    c('kosiv', 'Косів', 'Косов', 'Kosiv', 'Косові', 'Косове', 'Kosiv', '48.3100', '25.0950', '78600', 'Івано-Франківська область', 31),
    c('chortkiv', 'Чортків', 'Чортков', 'Chortkiv', 'Чорткові', 'Чорткове', 'Chortkiv', '49.0160', '25.7980', '48500', 'Тернопільська область', 32),
    c('kremenets', 'Кременець', 'Кременец', 'Kremenets', 'Кременці', 'Кременце', 'Kremenets', '50.1030', '25.7250', '47000', 'Тернопільська область', 33),
    c('berehove', 'Берегове', 'Берегово', 'Berehove', 'Береговому', 'Берегово', 'Berehove', '48.2050', '22.6440', '90200', 'Закарпатська область', 34),
    c('khust', 'Хуст', 'Хуст', 'Khust', 'Хусті', 'Хусте', 'Khust', '48.1700', '23.2890', '90400', 'Закарпатська область', 35),
    c('rakhiv', 'Рахів', 'Рахов', 'Rakhiv', 'Рахові', 'Рахове', 'Rakhiv', '48.0550', '24.2060', '90600', 'Закарпатська область', 36),
];

export const seedPickupLocations: Record<string, SeedLocation[]> = {
    'kyiv': [
        l('kyiv-railway', 'Центральний залізничний вокзал', 'Центральный ж/д вокзал', 'Central Railway Station', 'railway', 0),
        l('kyiv-bus', 'Автовокзал «Центральний»', 'Автовокзал «Центральный»', 'Central Bus Station', 'bus', 1),
        l('kyiv-boryspil', 'Аеропорт «Бориспіль» (KBP)', 'Аэропорт «Борисполь» (KBP)', 'Boryspil Airport (KBP)', 'airport', 2),
        l('kyiv-ocean-plaza', 'ТРЦ Ocean Plaza', 'ТРЦ Ocean Plaza', 'Ocean Plaza Mall', 'mall', 3),
        l('kyiv-maidan', 'Майдан Незалежності', 'Майдан Независимости', 'Maidan Nezalezhnosti', 'center', 4),
    ],
    'lviv': [
        l('lviv-railway', 'Головний залізничний вокзал', 'Главный ж/д вокзал', 'Main Railway Station', 'railway', 0),
        l('lviv-bus', 'Автостанція №8 (Стрийська)', 'Автостанция №8 (Стрыйская)', 'Bus Station №8 (Stryiska)', 'bus', 1),
        l('lviv-airport', 'Аеропорт «Львів» (LWO)', 'Аэропорт «Львов» (LWO)', 'Lviv Airport (LWO)', 'airport', 2),
        l('lviv-forum', 'ТРЦ Forum Lviv', 'ТРЦ Forum Lviv', 'Forum Lviv Mall', 'mall', 3),
        l('lviv-rynok', 'Площа Ринок', 'Площадь Рынок', 'Rynok Square', 'center', 4),
    ],
    'odesa': [
        l('odesa-railway', 'Залізничний вокзал «Одеса-Головна»', 'Ж/д вокзал «Одесса-Главная»', 'Odesa Main Railway Station', 'railway', 0),
        l('odesa-bus', 'Автовокзал «Привоз»', 'Автовокзал «Привоз»', 'Pryvoz Bus Station', 'bus', 1),
        l('odesa-airport', 'Аеропорт «Одеса» (ODS)', 'Аэропорт «Одесса» (ODS)', 'Odesa Airport (ODS)', 'airport', 2),
        l('odesa-fontan', 'ТРЦ Fontan Sky Center', 'ТРЦ Fontan Sky Center', 'Fontan Sky Center Mall', 'mall', 3),
        l('odesa-derybasivska', 'Дерибасівська вулиця', 'Дерибасовская улица', 'Derybasivska Street', 'center', 4),
    ],
    'dnipro': [
        l('dnipro-railway', 'Залізничний вокзал «Дніпро-Головний»', 'Ж/д вокзал «Днепр-Главный»', 'Dnipro Main Railway Station', 'railway', 0),
        l('dnipro-bus', 'Центральний автовокзал', 'Центральный автовокзал', 'Central Bus Station', 'bus', 1),
        l('dnipro-airport', 'Аеропорт «Дніпро» (DNK)', 'Аэропорт «Днепр» (DNK)', 'Dnipro Airport (DNK)', 'airport', 2),
        l('dnipro-most-city', 'ТРЦ MOST-city', 'ТРЦ MOST-city', 'MOST-city Mall', 'mall', 3),
        l('dnipro-european', 'Європейська площа', 'Европейская площадь', 'European Square', 'center', 4),
    ],
    'kharkiv': [
        l('kharkiv-railway', 'Залізничний вокзал «Харків-Пасажирський»', 'Ж/д вокзал «Харьков-Пассажирский»', 'Kharkiv Passenger Railway Station', 'railway', 0),
        l('kharkiv-bus', 'Центральний автовокзал', 'Центральный автовокзал', 'Central Bus Station', 'bus', 1),
        l('kharkiv-airport', 'Міжнародний аеропорт «Харків» (HRK)', 'Международный аэропорт «Харьков» (HRK)', 'Kharkiv International Airport (HRK)', 'airport', 2),
        l('kharkiv-nikolsky', 'ТРЦ Нікольський', 'ТРЦ Никольский', 'Nikolsky Mall', 'mall', 3),
        l('kharkiv-svobody', 'Площа Свободи', 'Площадь Свободы', 'Freedom Square', 'center', 4),
    ],
    'ternopil': [
        l('ternopil-railway', 'Залізничний вокзал «Тернопіль»', 'Ж/д вокзал «Тернополь»', 'Ternopil Railway Station', 'railway', 0),
        l('ternopil-bus', 'Центральний автовокзал', 'Центральный автовокзал', 'Central Bus Station', 'bus', 1),
        l('ternopil-podillia', 'ТРЦ «Поділля City»', 'ТРЦ «Подолье City»', 'Podillia City Mall', 'mall', 2),
        l('ternopil-teatralna', 'Театральна площа', 'Театральная площадь', 'Theatre Square', 'center', 3),
    ],
    'uzhhorod': [
        l('uzhhorod-railway', 'Залізничний вокзал «Ужгород»', 'Ж/д вокзал «Ужгород»', 'Uzhhorod Railway Station', 'railway', 0),
        l('uzhhorod-bus', 'Автовокзал «Ужгород»', 'Автовокзал «Ужгород»', 'Uzhhorod Bus Station', 'bus', 1),
        l('uzhhorod-dastor', 'ТРЦ «Дастор»', 'ТРЦ «Дастор»', 'Dastor Mall', 'mall', 2),
        l('uzhhorod-narodna', 'Площа Народна', 'Народная площадь', 'Narodna Square', 'center', 3),
    ],
    'vinnytsia': [
        l('vinnytsia-railway', 'Залізничний вокзал «Вінниця»', 'Ж/д вокзал «Винница»', 'Vinnytsia Railway Station', 'railway', 0),
        l('vinnytsia-bus', 'Центральний автовокзал', 'Центральный автовокзал', 'Central Bus Station', 'bus', 1),
        l('vinnytsia-airport', 'Аеропорт «Вінниця» (VIN)', 'Аэропорт «Винница» (VIN)', 'Vinnytsia Airport (VIN)', 'airport', 2),
        l('vinnytsia-skypark', 'ТРЦ Sky Park', 'ТРЦ Sky Park', 'Sky Park Mall', 'mall', 3),
        l('vinnytsia-european', 'Європейська площа', 'Европейская площадь', 'European Square', 'center', 4),
    ],
    'mukachevo': [
        l('mukachevo-railway', 'Залізничний вокзал «Мукачево»', 'Ж/д вокзал «Мукачево»', 'Mukachevo Railway Station', 'railway', 0),
        l('mukachevo-bus', 'Автовокзал «Мукачево»', 'Автовокзал «Мукачево»', 'Mukachevo Bus Station', 'bus', 1),
        l('mukachevo-karpaty', 'ТЦ «Карпати»', 'ТЦ «Карпаты»', 'Karpaty Shopping Center', 'mall', 2),
        l('mukachevo-kyryla', 'Площа Кирила і Мефодія', 'Площадь Кирилла и Мефодия', 'Cyril and Methodius Square', 'center', 3),
    ],
    'chernivtsi': [
        l('chernivtsi-railway', 'Залізничний вокзал «Чернівці»', 'Ж/д вокзал «Черновцы»', 'Chernivtsi Railway Station', 'railway', 0),
        l('chernivtsi-bus', 'Автовокзал «Чернівці»', 'Автовокзал «Черновцы»', 'Chernivtsi Bus Station', 'bus', 1),
        l('chernivtsi-depot', 'ТРЦ «Депот»', 'ТРЦ «Депот»', 'Depot Mall', 'mall', 2),
        l('chernivtsi-centralna', 'Центральна площа', 'Центральная площадь', 'Central Square', 'center', 3),
    ],
    'poltava': [
        l('poltava-railway', 'Залізничний вокзал «Полтава-Київська»', 'Ж/д вокзал «Полтава-Киевская»', 'Poltava-Kyivska Railway Station', 'railway', 0),
        l('poltava-bus', 'Центральний автовокзал', 'Центральный автовокзал', 'Central Bus Station', 'bus', 1),
        l('poltava-kyiv-mall', 'ТРЦ «Київ»', 'ТРЦ «Киев»', 'Kyiv Mall', 'mall', 2),
        l('poltava-kruhly', 'Круглий сквер', 'Круглый сквер', 'Round Square', 'center', 3),
    ],
    'zaporizhzhia': [
        l('zaporizhzhia-railway', 'Залізничний вокзал «Запоріжжя-1»', 'Ж/д вокзал «Запорожье-1»', 'Zaporizhzhia-1 Railway Station', 'railway', 0),
        l('zaporizhzhia-bus', 'Центральний автовокзал', 'Центральный автовокзал', 'Central Bus Station', 'bus', 1),
        l('zaporizhzhia-airport', 'Аеропорт «Запоріжжя» (OZH)', 'Аэропорт «Запорожье» (OZH)', 'Zaporizhzhia Airport (OZH)', 'airport', 2),
        l('zaporizhzhia-city-mall', 'ТРЦ City Mall', 'ТРЦ City Mall', 'City Mall', 'mall', 3),
        l('zaporizhzhia-festyvalna', 'Площа Фестивальна', 'Фестивальная площадь', 'Festival Square', 'center', 4),
    ],
    'boryspil': [
        l('boryspil-airport', 'Міжнародний аеропорт «Бориспіль» (KBP)', 'Международный аэропорт «Борисполь» (KBP)', 'Boryspil International Airport (KBP)', 'airport', 0),
        l('boryspil-terminal-d', 'Аеропорт «Бориспіль» — Термінал D', 'Аэропорт «Борисполь» — Терминал D', 'Boryspil Airport — Terminal D', 'airport', 1),
        l('boryspil-terminal-f', 'Аеропорт «Бориспіль» — Термінал F', 'Аэропорт «Борисполь» — Терминал F', 'Boryspil Airport — Terminal F', 'airport', 2),
        l('boryspil-railway', 'Залізничний вокзал «Бориспіль»', 'Ж/д вокзал «Борисполь»', 'Boryspil Railway Station', 'railway', 3),
        l('boryspil-center', 'Центр міста Бориспіль', 'Центр города Борисполь', 'Boryspil City Center', 'center', 4),
    ],
    'ivano-frankivsk': [
        l('ivano-frankivsk-railway', 'Залізничний вокзал «Івано-Франківськ»', 'Ж/д вокзал «Ивано-Франковск»', 'Ivano-Frankivsk Railway Station', 'railway', 0),
        l('ivano-frankivsk-bus', 'Центральний автовокзал', 'Центральный автовокзал', 'Central Bus Station', 'bus', 1),
        l('ivano-frankivsk-airport', 'Аеропорт «Івано-Франківськ» (IFO)', 'Аэропорт «Ивано-Франковск» (IFO)', 'Ivano-Frankivsk Airport (IFO)', 'airport', 2),
        l('ivano-frankivsk-arsen', 'ТРЦ «Арсен»', 'ТРЦ «Арсен»', 'Arsen Mall', 'mall', 3),
        l('ivano-frankivsk-viche', 'Площа Вічевий Майдан', 'Площадь Вечевой Майдан', 'Viche Maidan Square', 'center', 4),
    ],
    'bukovel': [
        l('bukovel-resort', 'Курорт Буковель — головний вхід', 'Курорт Буковель — главный вход', 'Bukovel Resort — Main Entrance', 'center', 0),
        l('bukovel-lift-8', 'Підйомник №8 (Буковель)', 'Подъемник №8 (Буковель)', 'Lift №8 (Bukovel)', 'other', 1),
        l('bukovel-yaremche', 'Яремче — залізничний вокзал', 'Яремче — ж/д вокзал', 'Yaremche Railway Station', 'railway', 2),
        l('bukovel-ivano-frankivsk-airport', 'Аеропорт «Івано-Франківськ» (IFO)', 'Аэропорт «Ивано-Франковск» (IFO)', 'Ivano-Frankivsk Airport (IFO)', 'airport', 3),
    ],
    'truskavets': [
        l('truskavets-railway', 'Залізничний вокзал «Трускавець»', 'Ж/д вокзал «Трускавец»', 'Truskavets Railway Station', 'railway', 0),
        l('truskavets-bus', 'Автовокзал «Трускавець»', 'Автовокзал «Трускавец»', 'Truskavets Bus Station', 'bus', 1),
        l('truskavets-naftusya', 'Бювет «Нафтуся»', 'Бювет «Нафтуся»', 'Naftusya Pump Room', 'center', 2),
        l('truskavets-lviv-airport', 'Аеропорт «Львів» (LWO)', 'Аэропорт «Львов» (LWO)', 'Lviv Airport (LWO)', 'airport', 3),
    ],
    'skhidnytsia': [
        l('skhidnytsia-center', 'Центр Східниці', 'Центр Сходницы', 'Skhidnytsia Center', 'center', 0),
        l('skhidnytsia-naftusya', 'Бювет мінеральних вод', 'Бювет минеральных вод', 'Mineral Water Pump Room', 'other', 1),
        l('skhidnytsia-drohobych', 'Дрогобич — залізничний вокзал', 'Дрогобыч — ж/д вокзал', 'Drohobych Railway Station', 'railway', 2),
        l('skhidnytsia-lviv-airport', 'Аеропорт «Львів» (LWO)', 'Аэропорт «Львов» (LWO)', 'Lviv Airport (LWO)', 'airport', 3),
    ],
    'lutsk': [
        l('lutsk-railway', 'Залізничний вокзал «Луцьк»', 'Ж/д вокзал «Луцк»', 'Lutsk Railway Station', 'railway', 0),
        l('lutsk-bus', 'Автовокзал «Луцьк»', 'Автовокзал «Луцк»', 'Lutsk Bus Station', 'bus', 1),
        l('lutsk-center', 'Центр міста Луцьк', 'Центр города Луцк', 'Lutsk City Center', 'center', 2),
    ],
    'rivne': [
        l('rivne-railway', 'Залізничний вокзал «Рівне»', 'Ж/д вокзал «Ровно»', 'Rivne Railway Station', 'railway', 0),
        l('rivne-bus', 'Автовокзал «Рівне»', 'Автовокзал «Ровно»', 'Rivne Bus Station', 'bus', 1),
        l('rivne-center', 'Центр міста Рівне', 'Центр города Ровно', 'Rivne City Center', 'center', 2),
    ],
    'khmelnytskyi': [
        l('khmelnytskyi-railway', 'Залізничний вокзал «Хмельницький»', 'Ж/д вокзал «Хмельницкий»', 'Khmelnytskyi Railway Station', 'railway', 0),
        l('khmelnytskyi-bus', 'Автовокзал «Хмельницький»', 'Автовокзал «Хмельницкий»', 'Khmelnytskyi Bus Station', 'bus', 1),
        l('khmelnytskyi-center', 'Центр міста Хмельницький', 'Центр города Хмельницкий', 'Khmelnytskyi City Center', 'center', 2),
    ],
    'kamianets-podilskyi': [
        l('kamianets-fortress', 'Кам\'янець-Подільська фортеця', 'Каменец-Подольская крепость', 'Kamianets-Podilskyi Fortress', 'other', 0),
        l('kamianets-old-town', 'Старе місто Кам\'янець-Подільський', 'Старый город Каменец-Подольский', 'Kamianets-Podilskyi Old Town', 'center', 1),
        l('kamianets-bus', 'Автовокзал «Кам\'янець-Подільський»', 'Автовокзал «Каменец-Подольский»', 'Kamianets-Podilskyi Bus Station', 'bus', 2),
    ],
    'drohobych': [
        l('drohobych-railway', 'Залізничний вокзал «Дрогобич»', 'Ж/д вокзал «Дрогобыч»', 'Drohobych Railway Station', 'railway', 0),
        l('drohobych-center', 'Центр міста Дрогобич', 'Центр города Дрогобыч', 'Drohobych City Center', 'center', 1),
    ],
    'stryi': [
        l('stryi-railway', 'Залізничний вокзал «Стрий»', 'Ж/д вокзал «Стрый»', 'Stryi Railway Station', 'railway', 0),
        l('stryi-center', 'Центр міста Стрий', 'Центр города Стрый', 'Stryi City Center', 'center', 1),
    ],
    'sambir': [
        l('sambir-railway', 'Залізничний вокзал «Самбір»', 'Ж/д вокзал «Самбор»', 'Sambir Railway Station', 'railway', 0),
        l('sambir-center', 'Центр міста Самбір', 'Центр города Самбор', 'Sambir City Center', 'center', 1),
    ],
    'chervonohrad': [
        l('chervonohrad-center', 'Центр міста Червоноград', 'Центр города Червоноград', 'Chervonohrad City Center', 'center', 0),
    ],
    'boryslav': [
        l('boryslav-center', 'Центр міста Борислав', 'Центр города Борислав', 'Boryslav City Center', 'center', 0),
    ],
    'zhovkva': [
        l('zhovkva-castle', 'Жовківський замок', 'Жолковский замок', 'Zhovkva Castle', 'other', 0),
        l('zhovkva-center', 'Центр міста Жовква', 'Центр города Жолква', 'Zhovkva City Center', 'center', 1),
    ],
    'yaremche': [
        l('yaremche-railway', 'Залізнична станція «Яремче»', 'Ж/д станция «Яремче»', 'Yaremche Railway Station', 'railway', 0),
        l('yaremche-probiy', 'Водоспад Пробій', 'Водопад Пробий', 'Probiy Waterfall', 'other', 1),
        l('yaremche-center', 'Центр Яремче', 'Центр Яремче', 'Yaremche City Center', 'center', 2),
    ],
    'kolomyia': [
        l('kolomyia-railway', 'Залізничний вокзал «Коломия»', 'Ж/д вокзал «Коломыя»', 'Kolomyia Railway Station', 'railway', 0),
        l('kolomyia-bus', 'Автовокзал «Коломия»', 'Автовокзал «Коломыя»', 'Kolomyia Bus Station', 'bus', 1),
        l('kolomyia-center', 'Центр міста Коломия', 'Центр города Коломыя', 'Kolomyia City Center', 'center', 2),
    ],
    'kalush': [
        l('kalush-railway', 'Залізничний вокзал «Калуш»', 'Ж/д вокзал «Калуш»', 'Kalush Railway Station', 'railway', 0),
        l('kalush-bus', 'Автовокзал «Калуш»', 'Автовокзал «Калуш»', 'Kalush Bus Station', 'bus', 1),
        l('kalush-center', 'Центр міста Калуш', 'Центр города Калуш', 'Kalush City Center', 'center', 2),
    ],
    'nadvirna': [
        l('nadvirna-railway', 'Залізничний вокзал «Надвірна»', 'Ж/д вокзал «Надворная»', 'Nadvirna Railway Station', 'railway', 0),
        l('nadvirna-bus', 'Автовокзал «Надвірна»', 'Автовокзал «Надворная»', 'Nadvirna Bus Station', 'bus', 1),
        l('nadvirna-center', 'Центр міста Надвірна', 'Центр города Надворная', 'Nadvirna City Center', 'center', 2),
    ],
    'kosiv': [
        l('kosiv-bus', 'Автовокзал «Косів»', 'Автовокзал «Косов»', 'Kosiv Bus Station', 'bus', 0),
        l('kosiv-market', 'Косівський базар', 'Косовский базар', 'Kosiv Market', 'other', 1),
        l('kosiv-center', 'Центр міста Косів', 'Центр города Косов', 'Kosiv City Center', 'center', 2),
    ],
    'chortkiv': [
        l('chortkiv-railway', 'Залізничний вокзал «Чортків»', 'Ж/д вокзал «Чортков»', 'Chortkiv Railway Station', 'railway', 0),
        l('chortkiv-bus', 'Автовокзал «Чортків»', 'Автовокзал «Чортков»', 'Chortkiv Bus Station', 'bus', 1),
        l('chortkiv-center', 'Центр міста Чортків', 'Центр города Чортков', 'Chortkiv City Center', 'center', 2),
    ],
    'kremenets': [
        l('kremenets-bus', 'Автовокзал «Кременець»', 'Автовокзал «Кременец»', 'Kremenets Bus Station', 'bus', 0),
        l('kremenets-castle', 'Замкова гора', 'Замковая гора', 'Castle Hill', 'other', 1),
        l('kremenets-center', 'Центр міста Кременець', 'Центр города Кременец', 'Kremenets City Center', 'center', 2),
    ],
    'berehove': [
        l('berehove-railway', 'Залізничний вокзал «Берегове»', 'Ж/д вокзал «Берегово»', 'Berehove Railway Station', 'railway', 0),
        l('berehove-bus', 'Автовокзал «Берегове»', 'Автовокзал «Берегово»', 'Berehove Bus Station', 'bus', 1),
        l('berehove-thermal', 'Термальні басейни Берегове', 'Термальные бассейны Берегово', 'Berehove Thermal Pools', 'other', 2),
        l('berehove-center', 'Центр міста Берегове', 'Центр города Берегово', 'Berehove City Center', 'center', 3),
    ],
    'khust': [
        l('khust-railway', 'Залізничний вокзал «Хуст»', 'Ж/д вокзал «Хуст»', 'Khust Railway Station', 'railway', 0),
        l('khust-bus', 'Автовокзал «Хуст»', 'Автовокзал «Хуст»', 'Khust Bus Station', 'bus', 1),
        l('khust-castle', 'Хустський замок', 'Хустский замок', 'Khust Castle', 'other', 2),
        l('khust-center', 'Центр міста Хуст', 'Центр города Хуст', 'Khust City Center', 'center', 3),
    ],
    'rakhiv': [
        l('rakhiv-railway', 'Залізничний вокзал «Рахів»', 'Ж/д вокзал «Рахов»', 'Rakhiv Railway Station', 'railway', 0),
        l('rakhiv-bus', 'Автовокзал «Рахів»', 'Автовокзал «Рахов»', 'Rakhiv Bus Station', 'bus', 1),
        l('rakhiv-center', 'Центр міста Рахів', 'Центр города Рахов', 'Rakhiv City Center', 'center', 2),
    ],
};
