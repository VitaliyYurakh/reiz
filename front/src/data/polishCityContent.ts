import { cityPickupLocations, type CityConfig } from "./cities";

/**
 * The shape intentionally mirrors CityFAQFormatted from cityContent.ts.
 * Keeping it local avoids a circular dependency when cityContent imports this
 * module to replace its Polish branch.
 */
export type PolishCityFAQItem = {
  question: string;
  answer: string;
};

export type PolishCityFAQSection = {
  title: string;
  items: PolishCityFAQItem[];
};

type PolishPickupPoint = {
  name: string;
  type: "railway" | "bus" | "airport" | "mall" | "center" | "other";
};

type PolishCityContext = {
  travelTip: string;
};

const CITY_CONTEXT: Record<string, PolishCityContext> = {
  kyiv: {
    travelTip:
      "W godzinach największego ruchu warto zostawić zapas czasu na dojazd i parkowanie.",
  },
  lviv: {
    travelTip:
      "W historycznej części miasta występują odcinki brukowane, dlatego dojazd i parkowanie warto zaplanować z wyprzedzeniem.",
  },
  odesa: {
    travelTip:
      "W sezonie przejazdy w kierunku nadmorskich dzielnic mogą zajmować więcej czasu, więc dobrze jest zaplanować trasę przed wyjazdem.",
  },
  dnipro: {
    travelTip:
      "Przy przejazdach przez miasto uwzględnij czas na dojazd między dzielnicami oraz wcześniejsze znalezienie parkingu.",
  },
  kharkiv: {
    travelTip:
      "Na dłuższe przejazdy po mieście i poza nim wybierz auto z klasą oraz wyposażeniem dopasowanymi do planowanej trasy.",
  },
  bukovel: {
    travelTip:
      "Przed górską trasą sprawdź prognozę pogody, stan dróg i wyposażenie samochodu odpowiednie do warunków sezonowych.",
  },
  truskavets: {
    travelTip:
      "Jeżeli planujesz odwiedzić uzdrowiska lub miejsca poza centrum, zaplanuj trasę i postój przed rozpoczęciem podróży.",
  },
  skhidnytsia: {
    travelTip:
      "Na drogach prowadzących przez tereny podgórskie zachowaj spokojne tempo jazdy i uwzględnij warunki pogodowe.",
  },
  uzhhorod: {
    travelTip:
      "Przed podróżą poza miasto sprawdź plan trasy oraz warunki ewentualnego wyjazdu za granicę z menedżerem.",
  },
  mukachevo: {
    travelTip:
      "Przy wyjazdach w kierunku gór lub granicy warto wcześniej sprawdzić trasę, pogodę i warunki rezerwacji.",
  },
  boryspil: {
    travelTip:
      "Przy odbiorze związanym z lotem podaj numer rezerwacji, terminal i zaplanowaną godzinę, aby ustalić szczegóły z menedżerem.",
  },
  yaremche: {
    travelTip:
      "Na trasach w rejonie górskim wybieraj tempo jazdy odpowiednie do pogody, widoczności i aktualnego stanu nawierzchni.",
  },
  rakhiv: {
    travelTip:
      "Na górskie wyjazdy wybierz samochód odpowiedni do liczby pasażerów, bagażu i aktualnych warunków na drodze.",
  },
};

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const joinPolishList = (items: string[]): string => {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} i ${items[1]}`;

  return `${items.slice(0, -1).join(", ")} i ${items[items.length - 1]}`;
};

const getPolishPickupPoints = (city: CityConfig): PolishPickupPoint[] =>
  (cityPickupLocations[city.slug] ?? [])
    .map((location) => ({
      name: location.name.pl.trim(),
      type: location.type,
    }))
    .filter((location) => location.name.length > 0);

const getPolishCityName = (city: CityConfig): string =>
  city.localized.pl.name.trim() || city.name;

const getPolishCityLocative = (city: CityConfig): string =>
  city.localized.pl.nameLocative.trim() || getPolishCityName(city);

const getPickupContext = (city: CityConfig) => {
  const points = getPolishPickupPoints(city);
  const primaryPoints = points.slice(0, 3);
  const primaryPointNames = primaryPoints.map((point) => point.name);
  const railway = points.find((point) => point.type === "railway");
  const airport = points.find((point) => point.type === "airport");
  const cityLocative = getPolishCityLocative(city);

  return {
    allPointsText:
      primaryPointNames.length > 0
        ? joinPolishList(primaryPointNames)
        : `adres wskazany podczas rezerwacji w ${cityLocative}`,
    railwayName: railway?.name,
    airportName: airport?.name,
  };
};

const getTravelTip = (city: CityConfig): string => {
  const cityLocative = getPolishCityLocative(city);

  return (
    CITY_CONTEXT[city.slug]?.travelTip ??
    `Przed wyjazdem poza ${cityLocative} sprawdź aktualną trasę, pogodę i zaplanuj miejsce postoju.`
  );
};

/**
 * Localized H2 for the long-form editor block on a Polish city page.
 */
export function getPolishCityEditorTitle(city: CityConfig): string {
  return `Wynajem samochodu w ${getPolishCityLocative(city)} z REIZ — praktyczny przewodnik`;
}

/**
 * Generates fully Polish, location-aware HTML for CityEditorSection.
 * Dynamic values are HTML-escaped even though the source data is internal.
 */
export function generatePolishCityEditorContent(city: CityConfig): string {
  const cityLocative = escapeHtml(getPolishCityLocative(city));
  const { allPointsText, airportName, railwayName } = getPickupContext(city);
  const pickupPointsText = escapeHtml(allPointsText);
  const railwayPoint = railwayName ? escapeHtml(railwayName) : undefined;
  const airportPoint = airportName ? escapeHtml(airportName) : undefined;
  const stationSentence = railwayName
    ? `Jeśli przyjeżdżasz pociągiem, przy rezerwacji możesz wskazać ${railwayPoint} i uzgodnić godzinę przekazania auta.`
    : "Przy rezerwacji wskaż dokładny adres, termin i godzinę, a menedżer potwierdzi możliwość przekazania auta.";
  const airportSentence = airportName
    ? `Dla odbioru przy ${airportPoint} podaj planowaną godzinę przylotu; szczegóły, dostępność i ewentualne opłaty parkingowe są potwierdzane przed rezerwacją.`
    : "Godzinę i miejsce odbioru oraz zwrotu ustalamy przed potwierdzeniem rezerwacji.";

  return `
<div class='editor_title'>Wynajem samochodu w ${cityLocative}: swoboda planowania dnia</div>
<div class='editor_text'>REIZ pomaga zorganizować <strong>wynajem samochodu w ${cityLocative}</strong> na podróż służbową, rodzinny wyjazd albo codzienne przejazdy. W katalogu porównasz dostępne klasy aut, wyposażenie, warunki wynajmu i termin rezerwacji. Wybierając samochód, dopasuj go do liczby pasażerów, bagażu oraz planowanej długości trasy.</div>

<div class='editor_title'>Odbiór i zwrot auta w ${cityLocative}</div>
<div class='editor_text'>Najczęściej wybierane miejsca przekazania samochodu to: ${pickupPointsText}. ${stationSentence} ${airportSentence} Przy zwrocie auta ustal wcześniej miejsce, godzinę i poziom paliwa wskazany w warunkach rezerwacji — dzięki temu odbiór przebiegnie sprawnie.</div>

<div class='editor_title'>Jak dobrać samochód do swojej trasy</div>
<div class='editor_text'>Do krótkich przejazdów po mieście wygodny będzie kompaktowy samochód, natomiast na dalszą trasę warto rozważyć sedan lub crossover. Gdy podróżujesz z rodziną, większym bagażem albo sprzętem sportowym, sprawdź pojemność bagażnika i dostępność minivana lub SUV-a. Przed rezerwacją porównaj warunki wybranego modelu, limit kilometrów i dostępne pakiety ochrony.</div>

<div class='editor_title'>Trasa, parkowanie i komfort podróży</div>
<div class='editor_text'>${escapeHtml(getTravelTip(city))} Korzystaj z aktualnej nawigacji, zwracaj uwagę na oznakowanie oraz zasady parkowania w miejscu postoju. Jeśli planujesz kilka spotkań lub wycieczkę poza miasto, zapisz kolejność punktów na trasie i pozostaw zapas czasu na odbiór, tankowanie oraz zwrot samochodu.</div>

<div class='editor_title'>Warunki wynajmu, kaucja i ochrona</div>
<div class='editor_text'>Przed podpisaniem umowy sprawdź kwotę kaucji, zakres ubezpieczenia i udział własny w razie szkody. Dla wybranych modeli mogą być dostępne warianty z ograniczoną kaucją lub rozszerzoną ochroną — o aktualne warunki zapytaj przed opłaceniem rezerwacji. Auto powinny prowadzić wyłącznie osoby wpisane do umowy.</div>

<div class='editor_title'>Rezerwacja krok po kroku</div>
<div class='editor_text'>Wybierz daty, klasę samochodu i miejsce odbioru, a następnie podaj dane kierowcy oraz kontakt do potwierdzenia. Menedżer pomoże doprecyzować szczegóły dotyczące dokumentów, płatności, dodatkowego kierowcy i planowanej trasy. Tak przygotowana rezerwacja pozwala odebrać samochód bez niepotrzebnego pośpiechu.</div>
`.trim();
}

/**
 * Returns four sections with twelve useful Q&A pairs for a Polish city page.
 * The returned structure is compatible with CityFAQFormatted.
 */
export function getPolishCityFaq(city: CityConfig): PolishCityFAQSection[] {
  const cityLocative = getPolishCityLocative(city);
  const { allPointsText, airportName, railwayName } = getPickupContext(city);
  const transportQuestion = airportName
    ? `Czy można odebrać auto przy dworcu lub lotnisku w ${cityLocative}?`
    : `Czy można odebrać auto przy dworcu w ${cityLocative}?`;
  const transportAnswer = [
    railwayName
      ? `Przy rezerwacji możesz wskazać ${railwayName} jako preferowany punkt odbioru.`
      : "Możliwość odbioru przy dworcu ustalamy indywidualnie podczas rezerwacji.",
    airportName
      ? `Odbiór przy ${airportName} również wymaga wcześniejszego potwierdzenia godziny i miejsca spotkania.`
      : "Dokładny punkt, godzinę i ewentualny koszt przekazania auta potwierdzi menedżer przed rezerwacją.",
  ].join(" ");

  return [
    {
      title: "Odbiór i zwrot samochodu",
      items: [
        {
          question: `W jakich miejscach w ${cityLocative} można odebrać samochód?`,
          answer: `Wśród dostępnych punktów znajdują się: ${allPointsText}. W formularzu rezerwacji wskaż preferowane miejsce i godzinę, aby menedżer mógł potwierdzić szczegóły przekazania auta.`,
        },
        {
          question: transportQuestion,
          answer: transportAnswer,
        },
        {
          question: `Jak ustalić zwrot auta w ${cityLocative}?`,
          answer: `Miejsce i godzina zwrotu są ustalane przy rezerwacji. Przed oddaniem samochodu sprawdź jego stan, poziom paliwa zgodny z warunkami wynajmu oraz upewnij się, że wszystkie rzeczy osobiste zostały zabrane z auta.`,
        },
      ],
    },
    {
      title: "Wybór auta i koszt wynajmu",
      items: [
        {
          question: `Jaki samochód wybrać na pobyt w ${cityLocative}?`,
          answer: "Kompakt sprawdzi się na krótkie przejazdy po mieście, sedan lub crossover na dłuższe trasy, a SUV albo minivan przy większej liczbie pasażerów i bagażu. Porównaj klasę, bagażnik, skrzynię biegów i wyposażenie wybranego modelu w katalogu.",
        },
        {
          question: "Od czego zależy cena wynajmu samochodu?",
          answer: "Na cenę wpływają przede wszystkim termin, długość wynajmu, klasa auta, wybrany pakiet ochrony oraz dodatkowe usługi. Aktualną cenę i dostępność konkretnego modelu zobaczysz po wskazaniu dat rezerwacji.",
        },
        {
          question: "Jak wygląda kwestia paliwa?",
          answer: "Przy odbiorze sprawdź poziom paliwa zapisany w protokole. Jeżeli rezerwacja przewiduje zasadę pełny–pełny, samochód należy zwrócić z takim samym poziomem paliwa; szczegółowe warunki potwierdzi menedżer.",
        },
      ],
    },
    {
      title: "Ubezpieczenie, kaucja i dokumenty",
      items: [
        {
          question: `Czy samochód jest ubezpieczony podczas wynajmu w ${cityLocative}?`,
          answer: "Przed rezerwacją sprawdź zakres ochrony przypisany do wybranego auta. Dodatkowe pakiety mogą ograniczać odpowiedzialność za określone szkody, dlatego warto porównać ich warunki z wysokością kaucji i udziału własnego.",
        },
        {
          question: "Czym różni się kaucja od udziału własnego?",
          answer: "Kaucja jest zabezpieczeniem na czas wynajmu i podlega rozliczeniu po zwrocie auta. Udział własny określa maksymalną odpowiedzialność kierowcy w sytuacjach opisanych w umowie. Dokładne kwoty zależą od modelu i wybranego pakietu.",
        },
        {
          question: `Jakie dokumenty są potrzebne, aby wynająć auto w ${cityLocative}?`,
          answer: "Zwykle potrzebne są ważny dokument tożsamości, prawo jazdy odpowiedniej kategorii oraz dane do rozliczenia rezerwacji. Wymagania dotyczące wieku i stażu kierowcy mogą zależeć od klasy samochodu, dlatego potwierdź je przed opłaceniem zamówienia.",
        },
      ],
    },
    {
      title: "Zasady podróży i rezerwacji",
      items: [
        {
          question: "Czy autem mogą jeździć dodatkowi kierowcy?",
          answer: "Tak, jeśli zostaną wcześniej zgłoszeni i wpisani do umowy. Nie przekazuj samochodu osobie niewskazanej w dokumentach — może to naruszać warunki wynajmu i ochrony ubezpieczeniowej.",
        },
        {
          question: `Czy można wyjechać wynajętym autem z ${cityLocative} do innego miasta lub za granicę?`,
          answer: "Wyjazd do innego miasta, regionu lub za granicę uzgodnij przed rezerwacją. Menedżer potwierdzi dopuszczalną trasę, wymagane dokumenty, ewentualne ograniczenia i warunki ochrony dla takiej podróży.",
        },
        {
          question: "Co zrobić w razie szkody, awarii lub zmiany planu?",
          answer: "Zadbaj o bezpieczeństwo, postępuj zgodnie z warunkami umowy i jak najszybciej skontaktuj się z menedżerem. Nie naprawiaj auta samodzielnie ani nie zmieniaj miejsca zwrotu bez wcześniejszego uzgodnienia.",
        },
      ],
    },
  ];
}
