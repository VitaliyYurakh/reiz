import { cityPickupLocations, type CityConfig } from "./cities";

export type RomanianCityFAQItem = {
  question: string;
  answer: string;
};

export type RomanianCityFAQSection = {
  title: string;
  items: RomanianCityFAQItem[];
};

export const ROMANIAN_CITY_FAQ_ITEM_COUNT = 12;

export function getRomanianCityEditorTitle(city: CityConfig): string {
  return `Închiriere auto în ${city.localized.ro.name}: mobilitate fără griji`;
}

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

const containsEnglishBrandWords = (value: string): boolean =>
  /\b(?:city|mall|sky|park|center|forum|ocean|depot|dastor|arsen|most)\b/i.test(
    value,
  );

const joinRomanian = (items: string[]): string => {
  if (items.length === 0) return "la o adresă convenită în oraș";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} și ${items[1]}`;

  return `${items.slice(0, -1).join(", ")} și ${items[items.length - 1]}`;
};

const getPickupLocations = (city: CityConfig): string => {
  const locations = (cityPickupLocations[city.slug] ?? [])
    .map((location) => location.name.ro)
    .filter(Boolean)
    .filter((location) => !containsEnglishBrandWords(location))
    .slice(0, 3)
    .map(escapeHtml);

  return joinRomanian(locations);
};

const getCityName = (city: CityConfig): string =>
  escapeHtml(city.localized.ro.name);

/**
 * Conținut editorial românesc pentru orice pagină de oraș.
 * Datele interpolate sunt limitate la denumirea locală a orașului și la
 * punctele de predare configurate, pentru a evita promisiuni locale neverificate.
 */
export function generateRomanianCityEditorContent(city: CityConfig): string {
  const cityName = getCityName(city);
  const pickupLocations = getPickupLocations(city);

  return `
<div class='editor_text'>REIZ oferă închiriere auto în ${cityName} pentru deplasări personale, de afaceri și călătorii în Ucraina. Alegem împreună mașina și perioada potrivite, iar condițiile sunt confirmate înainte de rezervare. Puteți solicita predarea mașinii în oraș, iar echipa stabilește în prealabil ora și locul convenabil.</div>

<div class='editor_title'>Închiriere flexibilă în ${cityName}</div>
<div class='editor_text'>Mașina poate fi rezervată pentru o zi, pentru câteva zile sau pentru o perioadă mai lungă. Dacă planurile se schimbă, contactați managerul înainte de expirarea perioadei curente pentru a verifica posibilitatea de prelungire sau de schimbare a categoriei.</div>

<div class='editor_title'>Predare și returnare</div>
<div class='editor_text'>Punctele de predare disponibile pot include ${pickupLocations}. La cerere, putem discuta și o adresă din ${cityName}. Pentru returnare, comunicați din timp locul și ora dorite, astfel încât echipa să confirme toate detaliile.</div>

<div class='editor_title'>Mașina potrivită pentru traseul dvs.</div>
<div class='editor_text'>Pentru drumurile din oraș sunt utile mașinile compacte și ușor de parcat, iar pentru familie, bagaje sau călătorii mai lungi puteți alege o categorie mai spațioasă. Managerul vă ajută să comparați opțiunile disponibile pentru datele rezervării.</div>

<div class='editor_title'>Condiții clare înainte de plecare</div>
<div class='editor_text'>Înainte de semnarea contractului, verificați perioada de închiriere, costul, condițiile de predare și returnare, limita de kilometri, garanția și opțiunile de asigurare. Astfel, fiecare etapă a rezervării rămâne clară și previzibilă.</div>

<div class='editor_title'>Stare tehnică și siguranță</div>
<div class='editor_text'>Mașina este verificată înainte de predare. La preluare, inspectați împreună cu reprezentantul starea caroseriei, nivelul combustibilului și documentele. Pentru o călătorie sigură, respectați regulile de circulație și adaptați viteza la condițiile drumului.</div>

<div class='editor_title'>Călătorii în afara orașului</div>
<div class='editor_text'>Dacă intenționați să plecați din ${cityName}, anunțați managerul înainte de confirmarea rezervării. Acesta vă va comunica regulile aplicabile traseului, kilometrajului și returnării mașinii.</div>

<div class='editor_title'>Asistență pe durata închirierii</div>
<div class='editor_text'>Pentru întrebări legate de rezervare, predare sau folosirea mașinii, păstrați legătura cu managerul REIZ. În cazul unei întârzieri, al unei defecțiuni sau al unui incident, anunțați echipa cât mai curând pentru a primi instrucțiuni.</div>
`.trim();
}

/**
 * Cele patru secțiuni conțin exact 12 întrebări și răspunsuri vizibile.
 * Structura este compatibilă structural cu CityFAQFormatted din cityContent.ts.
 */
export function getRomanianCityFAQ(city: CityConfig): RomanianCityFAQSection[] {
  const cityName = getCityName(city);
  const pickupLocations = getPickupLocations(city);

  return [
    {
      title: "Rezervare și predare",
      items: [
        {
          question: `Cum rezerv o mașină în ${cityName}?`,
          answer: `Trimiteți cererea cu datele dorite, categoria de mașină și locul de predare din ${cityName}. Managerul confirmă disponibilitatea și condițiile înainte de rezervare.`,
        },
        {
          question: `Unde poate fi predată mașina în ${cityName}?`,
          answer: `În funcție de programare, punctele de predare pot include ${pickupLocations}. Puteți solicita și o adresă convenită în oraș, iar managerul confirmă posibilitatea și ora.`,
        },
        {
          question: "Pot alege ora de predare și de returnare?",
          answer: "Da. Indicați ora dorită în cerere, iar echipa confirmă intervalul disponibil înainte de semnarea contractului.",
        },
      ],
    },
    {
      title: "Documente și șoferi",
      items: [
        {
          question: "Ce documente sunt necesare pentru închiriere?",
          answer: "De regulă sunt necesare un act de identitate și un permis de conducere valabil pentru categoria B. Pentru situații speciale, managerul vă comunică lista exactă înainte de rezervare.",
        },
        {
          question: "Poate conduce mașina și o altă persoană?",
          answer: "Da, dacă persoana este indicată și aprobată în contract înainte de predarea mașinii. Nu transmiteți mașina unei persoane care nu este inclusă în documente.",
        },
        {
          question: "Există cerințe privind vârsta sau experiența șoferului?",
          answer: "Cerințele pot depinde de categoria mașinii și de condițiile rezervării. Managerul le confirmă înainte de contract, pentru ca alegerea mașinii să fie potrivită profilului șoferului.",
        },
      ],
    },
    {
      title: "Cost și condiții",
      items: [
        {
          question: "Ce este inclus în prețul închirierii?",
          answer: "Costul și serviciile incluse sunt prezentate înainte de confirmare. Verificați în contract perioada, categoria mașinii, condițiile de asigurare, kilometrajul și serviciile suplimentare alese.",
        },
        {
          question: "Este necesară o garanție?",
          answer: "Valoarea garanției, dacă se aplică, depinde de mașină și de condițiile rezervării. Managerul explică suma, modalitatea de depunere și regulile de returnare înainte de semnarea contractului.",
        },
        {
          question: "Cum se stabilește condiția privind combustibilul?",
          answer: "Nivelul combustibilului este consemnat la predare, iar regula de returnare este indicată în contract. Dacă aveți întrebări, clarificați-le cu reprezentantul înainte de plecare.",
        },
      ],
    },
    {
      title: "Folosirea mașinii",
      items: [
        {
          question: `Pot călători în afara orașului ${cityName}?`,
          answer: "Da, dacă traseul este convenit înainte de rezervare. Comunicați planul de călătorie managerului, pentru a confirma condițiile de kilometraj, returnare și asigurare.",
        },
        {
          question: "Ce fac în cazul unei defecțiuni sau al unui incident?",
          answer: "Opriți în siguranță, urmați regulile legale aplicabile și contactați imediat managerul REIZ. Echipa vă oferă instrucțiuni pentru următorii pași.",
        },
        {
          question: "Ce fac dacă întârzii la returnare?",
          answer: "Anunțați managerul cât mai devreme. Acesta verifică disponibilitatea și vă comunică opțiunile pentru prelungire sau pentru stabilirea unei noi ore de returnare.",
        },
      ],
    },
  ];
}
