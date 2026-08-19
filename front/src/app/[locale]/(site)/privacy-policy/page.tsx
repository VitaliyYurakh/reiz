import type { Metadata } from "next";
import { getLocale, setRequestLocale } from "next-intl/server";
import { type Locale, locales } from "@/i18n/request";
import { Link } from "@/i18n/request";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";
import SectionNav from "../terms/SectionNav";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";
const POLICY_PATH = "/privacy-policy";
const UPDATED_AT = "19 серпня 2026 року";

const localeNotices: Partial<Record<Locale, string>> = {
  ru: "Официальная редакция Политики размещена на украинском языке. Перевод интерфейса предоставляется только для удобства.",
  en: "The official version of this Policy is published in Ukrainian. The translated interface is provided for convenience only.",
  pl: "Oficjalna wersja Polityki jest opublikowana w języku ukraińskim. Przetłumaczony interfejs udostępniamy wyłącznie dla wygody użytkownika.",
  ro: "Versiunea oficială a Politicii este publicată în limba ucraineană. Interfața tradusă este disponibilă doar pentru comoditate.",
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const canonical = new URL(POLICY_PATH, SITE_URL).toString();

  return {
    title: "Політика конфіденційності | REIZ",
    description:
      "Як REIZ обробляє та захищає персональні дані під час бронювання автомобіля, користування сайтом і особистим кабінетом.",
    alternates: { canonical },
    robots: locale === "uk" ? { index: true, follow: true } : { index: false, follow: true },
    openGraph: {
      type: "website",
      url: canonical,
      title: "Політика конфіденційності | REIZ",
      description:
        "Інформація про обробку персональних даних, cookie та права користувачів REIZ.",
    },
  };
}

export default async function PrivacyPolicyPage() {
  const locale = (await getLocale()) as Locale;
  setRequestLocale(locale);
  const localeNotice = localeNotices[locale];

  return (
    <div className="terms-section__inner">
      <Breadcrumbs
        mode="JsonLd"
        items={[
          { href: "/", name: "Головна" },
          { href: POLICY_PATH, name: "Політика конфіденційності" },
        ]}
      />

      <div className="terms-hero-group">
        <div className="terms-hero-top">
          <div className="terms-hero-content">
            <div className="blog-hero terms-hero">
              <h1 className="blog-hero__title">Політика конфіденційності</h1>
              <p className="terms-hero__subtitle">
                Ця Політика пояснює, які дані може обробляти сайт REIZ на
                етапі підготовки сервісу та як ви можете ними керувати.
              </p>
            </div>
            {localeNotice ? (
              <p className="terms-block__note">{localeNotice}</p>
            ) : null}
          </div>
        </div>
      </div>

      <SectionNav
        ariaLabel="Навігація політикою конфіденційності"
        goToSection="Перейти до розділу"
        items={[
          { id: "data", label: "Дані" },
          { id: "purpose", label: "Мета" },
          { id: "sharing", label: "Передавання" },
          { id: "cookies", label: "Cookie" },
          { id: "rights", label: "Ваші права" },
          { id: "contact", label: "Контакти" },
        ]}
      />

      <div className="terms-section__content">
        <section className="terms-block" id="general">
          <div className="terms-block__header">
            <h2 className="terms-block__title">1. До кого застосовується ця Політика</h2>
          </div>
          <p className="terms-block__text">
            Політика застосовується до відвідувачів reiz.com.ua, осіб, які
            надсилають звернення або попередню заявку, та користувачів
            особистого кабінету. У цій Політиці «REIZ», «ми» або «нас» —
            особа, яка адмініструє сайт і відповідає за обробку даних,
            описану на цій сторінці.
          </p>
          <p className="terms-block__text">
            Ми обробляємо дані відповідно до законодавства України, а коли
            це застосовно — з урахуванням правил країни, у якій перебуває
            користувач. Умови оренди, страхування, платежів і відповідальності
            будуть визначені окремими документами після запуску послуг та не
            замінюються цією Політикою.
          </p>
          <p className="terms-block__note">
            REIZ перебуває на етапі підготовки до запуску. Сайт не укладає
            договорів оренди, не приймає оплату за оренду та не вимагає
            документи водія через вебформу. До запуску послуг ми опублікуємо
            оновлену редакцію з реквізитами суб’єкта господарювання.
            Редакція чинна з {UPDATED_AT}.
          </p>
        </section>

        <section className="terms-block" id="data">
          <div className="terms-block__header">
            <h2 className="terms-block__title">2. Які дані ми отримуємо</h2>
            <p className="terms-block__subtitle">
              Ми просимо лише ті відомості, які потрібні для конкретної дії.
            </p>
          </div>
          <div className="terms-block__groups">
            <div className="terms-block__group">
              <h3 className="terms-block__label">Звернення та попередня заявка</h3>
              <p className="terms-block__text">
                Ім’я та прізвище, номер телефону, email, обраний автомобіль,
                дата й час, місця подачі та повернення, номер рейсу, коментар,
                обрані послуги, розрахунок вартості й інформація про статус
                звернення. Така заявка не є договором оренди чи підтвердженням
                доступності автомобіля.
              </p>
            </div>
            <div className="terms-block__group">
              <h3 className="terms-block__label">Дані для договору після запуску</h3>
              <p className="terms-block__text">
                Після фактичного запуску оренди для укладення та виконання
                договору можуть знадобитися паспорт або ID-картка, РНОКПП,
                водійське посвідчення, дані про вік, стаж, адресу та додаткових
                водіїв. До початку такого збирання ми оновимо цю Політику,
                зазначимо підстави, строк зберігання й сторони договору.
              </p>
            </div>
            <div className="terms-block__group">
              <h3 className="terms-block__label">Особистий кабінет</h3>
              <p className="terms-block__text">
                Дані профілю, історія бронювань і оренд, обрані автомобілі,
                звернення до підтримки, налаштування сповіщень. Під час входу
                через Google ми отримуємо дані, на які ви надали дозвіл у
                Google: ім’я, email, ідентифікатор облікового запису та,
                якщо доступно, зображення профілю.
              </p>
            </div>
            <div className="terms-block__group">
              <h3 className="terms-block__label">Технічні дані</h3>
              <p className="terms-block__text">
                IP-адреса, тип пристрою та браузера, мова, сторінки й час
                відвідування, джерело переходу, технічні журнали, cookie та
                інші ідентифікатори, необхідні для роботи, безпеки й аналітики
                сайту.
              </p>
            </div>
          </div>
          <p className="terms-block__note">
            Форма на сайті не запитує номер банківської картки чи CVV. На етапі
            підготовки сайт не приймає оплату та не блокує депозит.
          </p>
        </section>

        <section className="terms-block" id="purpose">
          <div className="terms-block__header">
            <h2 className="terms-block__title">3. Для чого ми використовуємо дані</h2>
          </div>
          <ul className="terms-block__list">
            <li>прийняти та опрацювати звернення або попередню заявку;</li>
            <li>зв’язатися щодо вашого запиту, запуску сервісу, підтримки або безпеки;</li>
            <li>створити й підтримувати особистий кабінет, показувати подані звернення та виконувати ваші налаштування;</li>
            <li>запобігати шахрайству, захищати сайт, користувачів і команду, розглядати претензії та спори;</li>
            <li>виконувати вимоги законодавства, коли вони застосовні;</li>
            <li>покращувати сайт та аналізувати його використання.</li>
          </ul>
          <p className="terms-block__text">
            Правова підстава залежить від ситуації: ваш запит або згода,
            обов’язок за законом, а також законний інтерес у безпеці та
            належній роботі сайту. Підстави для укладення та виконання договору
            застосовуватимуться лише після фактичного старту послуг.
            Маркетингові повідомлення надсилаємо лише за наявності належної
            підстави; від них можна відмовитися у повідомленні або звернувшись
            до нас.
          </p>
        </section>

        <section className="terms-block" id="sharing">
          <div className="terms-block__header">
            <h2 className="terms-block__title">4. Кому можуть бути передані дані</h2>
          </div>
          <p className="terms-block__text">
            Ми не продаємо персональні дані як окремий товар. Передавання
            можливе лише в обсязі, потрібному для послуги, безпеки або
            виконання вимоги закону.
          </p>
          <ul className="terms-block__list">
            <li><strong>Постачальникам технологій</strong> — хостингу, підтримки сайту, захисту від ботів, авторизації, комунікацій та аналітики, які діють за нашими інструкціями або власними правилами як окремі сервіси.</li>
            <li><strong>Державним органам та іншим уповноваженим особам</strong> — лише за законною й належно оформленою вимогою.</li>
          </ul>
          <p className="terms-block__text">
            Частина технічних постачальників, зокрема Google та Cloudflare,
            може обробляти технічні дані за межами України. У таких випадках
            застосовуються передбачені законодавством заходи захисту та умови
            відповідного постачальника. Перед запуском оренди ми окремо
            визначимо й опублікуємо умови передавання даних орендодавцям,
            страховикам, банкам і платіжним сервісам, якщо це буде потрібно.
          </p>
        </section>

        <section className="terms-block" id="cookies">
          <div className="terms-block__header">
            <h2 className="terms-block__title">5. Cookie, аналітика та маркетинг</h2>
          </div>
          <p className="terms-block__text">
            Cookie — невеликі файли, які браузер зберігає на вашому пристрої.
            Вони допомагають підтримувати сесію, запам’ятати мовні та інші
            налаштування, а також оцінювати роботу сайту.
          </p>
          <ul className="terms-block__list">
            <li><strong>Необхідні cookie</strong> підтримують безпечний вхід, сесію та базову роботу сайту.</li>
            <li><strong>Cookie вибору</strong> зберігають окремі рішення щодо аналітики та маркетингу; строк зберігання — до 180 днів.</li>
            <li><strong>Аналітика</strong> допомагає розуміти, як користуються сайтом, і запускається через Google Tag Manager лише відповідно до вашого вибору.</li>
            <li><strong>Маркетинг</strong> може використовуватися для вимірювання реклами та релевантних пропозицій, якщо такі інструменти будуть підключені; він також потребує окремого дозволу.</li>
          </ul>
          <p className="terms-block__text">
            Ви можете змінити рішення через «Налаштування cookie» у футері
            сайту або обмежити cookie в браузері. Після відкликання вибору ми
            передаємо оновлені налаштування підключеним інструментам і видаляємо
            відомі необов’язкові cookie, доступні сайту. Відмова від необхідних
            cookie може вплинути на вхід у кабінет та окремі функції.
          </p>
        </section>

        <section className="terms-block" id="storage">
          <div className="terms-block__header">
            <h2 className="terms-block__title">6. Строк зберігання та захист</h2>
          </div>
          <p className="terms-block__text">
            Ми зберігаємо дані не довше, ніж це потрібно для мети їх збирання:
            для обробки звернення, роботи облікового запису, вирішення спору,
            захисту прав REIZ або виконання обов’язку за законом. Дані кабінету
            зберігаються, доки існує обліковий запис або поки ви не подасте
            запит на видалення. Якщо після запуску послуг виникне обов’язок
            зберігати договірні чи бухгалтерські документи, відповідні строки
            будуть зазначені в оновленій редакції Політики.
          </p>
          <p className="terms-block__text">
            Ми застосовуємо розмежування доступу, автентифікацію, технічні
            засоби захисту та організаційні процедури. Жоден спосіб передавання
            даних через інтернет не гарантує абсолютної безпеки, тому просимо
            також захищати пароль, пристрій і доступ до вашої пошти.
          </p>
        </section>

        <section className="terms-block" id="rights">
          <div className="terms-block__header">
            <h2 className="terms-block__title">7. Ваші права та вибір</h2>
          </div>
          <p className="terms-block__text">
            Ви можете попросити підтвердити факт обробки, отримати доступ до
            своїх даних, уточнити їх, відкликати згоду там, де обробка на ній
            ґрунтується, а також вимагати обмеження або видалення даних у
            випадках, передбачених законом. Користувач особистого кабінету
            може завантажити доступні дані або подати запит на видалення через
            розділ «Конфіденційність» у кабінеті.
          </p>
          <p className="terms-block__text">
            Якщо до вас застосовується GDPR або аналогічне право, ви також
            можете мати право на заперечення проти певної обробки та на
            перенесення даних. Видалення не завжди охоплює дані, які ми
            зобов’язані зберігати за законом або які потрібні для встановлення,
            здійснення чи захисту правових вимог.
          </p>
        </section>

        <section className="terms-block" id="contact">
          <div className="terms-block__header">
            <h2 className="terms-block__title">8. Як звернутися до нас</h2>
          </div>
          <p className="terms-block__text">
            Для запиту щодо персональних даних напишіть на{" "}
            <a className="terms-block__link" href="mailto:info@reiz.com.ua">
              info@reiz.com.ua
            </a>{" "}
            або скористайтеся сторінкою{" "}
            <Link className="terms-block__link" href="/contacts">
              контактів
            </Link>.
            Укажіть, які дані або дію ви маєте на увазі, та додайте достатньо
            інформації, щоб ми могли безпечно підтвердити вашу особу. Ми
            розглянемо звернення у строк, визначений застосовним законодавством.
          </p>
        </section>

        <section className="terms-block" id="changes">
          <div className="terms-block__header">
            <h2 className="terms-block__title">9. Зміни до Політики</h2>
          </div>
          <p className="terms-block__text">
            Ми можемо оновлювати цю Політику, коли змінюється функціональність
            сайту, спосіб надання послуг або вимоги законодавства. Актуальна
            редакція завжди доступна на цій сторінці; дату останнього оновлення
            зазначено вище.
          </p>
        </section>
      </div>
    </div>
  );
}
