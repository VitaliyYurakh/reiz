export const LANGUAGES = [
  { code: 'uk', label: 'UA' },
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'pl', label: 'PL' },
  { code: 'ro', label: 'RO' },
] as const;

export type LangCode = (typeof LANGUAGES)[number]['code'];

export type MultiLang = { uk: string; ru: string; en: string; pl: string; ro: string };

export const ENGINE_TYPES = [
  { value: 'petrol', label: { uk: 'Бензин', ru: 'Бензин', en: 'Petrol', pl: 'Benzyna', ro: 'Benzină' } },
  { value: 'diesel', label: { uk: 'Дизель', ru: 'Дизель', en: 'Diesel', pl: 'Diesel', ro: 'Diesel' } },
  { value: 'electric', label: { uk: 'Електро', ru: 'Электро', en: 'Electric', pl: 'Elektryczny', ro: 'Electric' } },
  { value: 'hybrid', label: { uk: 'Гібрид', ru: 'Гибрид', en: 'Hybrid', pl: 'Hybryda', ro: 'Hibrid' } },
];

export const TRANSMISSION_TYPES = [
  { value: 'automatic', label: { uk: 'Автомат', ru: 'Автомат', en: 'Automatic', pl: 'Automatyczna', ro: 'Automată' } },
  { value: 'manual', label: { uk: 'Механіка', ru: 'Механика', en: 'Manual', pl: 'Manualna', ro: 'Manuală' } },
  { value: 'robot', label: { uk: 'Робот', ru: 'Робот', en: 'Robot', pl: 'Zrobotyzowana', ro: 'Robotizată' } },
  { value: 'variator', label: { uk: 'Варіатор', ru: 'Вариатор', en: 'CVT', pl: 'CVT', ro: 'CVT' } },
];

export const DRIVE_TYPES = [
  { value: 'front', label: { uk: 'Передній', ru: 'Передний', en: 'Front', pl: 'Przedni', ro: 'Față' } },
  { value: 'rear', label: { uk: 'Задній', ru: 'Задний', en: 'Rear', pl: 'Tylny', ro: 'Spate' } },
  { value: 'full', label: { uk: 'Повний', ru: 'Полный', en: 'AWD', pl: '4x4', ro: '4x4' } },
];

export const normalizeMultiLang = (val: any): MultiLang => {
  if (!val) return { uk: '', ru: '', en: '', pl: '', ro: '' };
  if (typeof val === 'object' && val !== null) {
    return { uk: val.uk || '', ru: val.ru || '', en: val.en || '', pl: val.pl || '', ro: val.ro || '' };
  }
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (parsed && typeof parsed === 'object' && ('uk' in parsed || 'ru' in parsed || 'en' in parsed)) {
        return { uk: parsed.uk || '', ru: parsed.ru || '', en: parsed.en || '', pl: parsed.pl || '', ro: parsed.ro || '' };
      }
    } catch (e) {}
    return { uk: val, ru: val, en: val, pl: val, ro: val };
  }
  return { uk: '', ru: '', en: '', pl: '', ro: '' };
};

export function findSelectValue(attributeObj: any, options: any[]) {
  if (!attributeObj) return '';
  const valEn = attributeObj.en;
  const found = options.find((o) => o.label.en === valEn);
  return found ? found.value : '';
}
