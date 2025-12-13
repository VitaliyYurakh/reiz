import type { Metadata } from "next";
import Image from "next/image";
import Icon from "@/components/Icon";
import GiftSlider from "@/app/[locale]/(site)/certificate/components/GiftSlider";
import { getTranslations } from "next-intl/server";
import AccordionGroup from "@/components/AccordionGroup";
import type { Locale } from "@/i18n/request";
import { getDefaultPath, getPageMetadata } from "@/lib/seo";
import Breadcrumbs from "@/app/[locale]/(site)/components/Breadcrumbs";

export async function generateMetadata({
  params,
}: {
  params: { locale: Locale };
}): Promise<Metadata> {
  const locale = (await params).locale;
  return getPageMetadata({
    routeKey: "certificate",
    ns: "certificatePage",
    locale,
  });
}

export default async function CertificatePage() {
  const t = await getTranslations("certificatePage");

  const images = ["car6", "gar4", "car5", "car7"];
  const slides = t.raw("slider.items");
  const slidesData = slides.map((item: any, index: number) => ({
    webp: `/img/car/${images[index]}.webp`,
    png: `/img/car/${images[index]}.png`,
    title: item.title,
    text: item.text,
    alt: item.title,
  }));

  return (
    <div className="gift-section__inner" data-body-flag={"dark"}>
      <h2
        className="pretitle"
        data-aos="fade-up"
        data-aos-duration={900}
        data-aos-delay={500}
      >
        {t("pretitle")}
      </h2>

      <Breadcrumbs
        mode={"JsonLd"}
        items={[
          { href: getDefaultPath("home"), name: t("breadcrumbs.home") },
          {
            href: getDefaultPath("certificate"),
            name: t("breadcrumbs.current"),
          },
        ]}
      />

      <div className="gift-section__content">
        {/* Top */}
        <div
          className="gift-section__top"
          data-aos="fade-up"
          data-aos-duration={900}
          data-aos-delay={650}
        >
          <div className="editor">
            <h1 className="main-title">
              <span className="desktop">{t("hero.titleDesktop")}</span>
              <span className="mob">{t("hero.titleMobile")}</span>
            </h1>
            <p>{t("hero.subtitle")}</p>
          </div>

          <div className="gift-section__image">
            <picture>
              {/*<source type="image/webp" srcSet="/img/certificatess.webp" />*/}
              <Image
                width={599}
                height={522}
                src="/img/certificatess.png"
                alt="Подарочные сертификаты REIZ на аренду автомобиля"
                priority
              />
            </picture>
          </div>

          <div className="gift-section__info">
            <h2 className="pretitle">{t("driverRequirements.title")}</h2>
            <div className="gift-section__info-box">
              {t.raw("driverRequirements.items").map((item: string) => (
                <span className="gift-section__info-text" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="gift-section__info">
            <h2 className="pretitle">{t("rentalNeeds.title")}</h2>
            <div className="gift-section__info-wrapp">
              <span className="gift-section__info-icon">
                <i className="sprite">
                  <Icon id="driver" width={45} height={35} />
                </i>
                {t.raw("rentalNeeds.items")[0]}
              </span>
              <span className="gift-section__info-icon">
                <i className="sprite">
                  <Icon id="driver2" width={45} height={35} />
                </i>
                {t.raw("rentalNeeds.items")[1]}
              </span>
            </div>
          </div>
        </div>

        <GiftSlider
          slides={slidesData}
          dataAos="fade-up"
          dataAosDuration={900}
          dataAosDelay={700}
        />

        <form
          className="gift-form"
          data-aos="fade-up"
          data-aos-duration={900}
          data-aos-delay={200}
        >
          <h2 className="gift-form__title">{t("form.title")}</h2>

          <div className="gift-form__inner">
            <div className="gift-form__image">
              <picture>
                {/*<source type="image/webp" srcSet="/img/gift.webp" />*/}
                <Image
                  width={413}
                  height={413}
                  src="/img/gift.png"
                  alt="Конверт с логотипом REIZ — подарочный сертификат на аренду авто"
                />
              </picture>
            </div>

            <div className="gift-form__box">
              <h2 className="pretitle">{t("form.chooseAmount")}</h2>

              {t.raw("form.amountOptions").map((v: string, i: number) => (
                <label key={v} className="radio-checkbox dark">
                  <input
                    type="radio"
                    name="type"
                    defaultChecked={i === 0}
                    value={v}
                    className="radio-checkbox__field"
                  />
                  <span className="radio-checkbox__content">{v}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="gift-form__fields">
            <h2 className="pretitle">{t("form.fillForm")}</h2>
            <label className="gift-form__label">
              <input
                type="text"
                name="name"
                id="name"
                required
                placeholder={t("form.placeholders.name")}
              />
              <span></span>
            </label>
            <label className="gift-form__label">
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                placeholder={t("form.placeholders.phone")}
                inputMode="tel"
              />
              <span></span>
            </label>
            <label className="gift-form__label">
              <input
                type="email"
                name="mail"
                id="mail"
                required
                placeholder={t("form.placeholders.email")}
              />
              <span></span>
            </label>
          </div>

          <label className="toggle-wrapper">
            <input type="checkbox" defaultChecked className="toggle-checkbox" />
            <span className="toggle-slider">
              <span className="checkmark"></span>
            </span>
            <span className="toggle-label">{t("form.togglePhysical")}</span>
          </label>

          <div className="gift-form__wrapp">
            <div className="editors">
              <div className="editor">
                <h4 className="pretitle">{t("form.preview.title")}</h4>
              </div>
              <div className="editor">
                <a href="#" className="main-button main-button--white">
                  {t("form.preview.button")}
                </a>
              </div>
            </div>
          </div>

          <div className="gift-form__wrapp">
            <div className="editor">
              <h4 className="pretitle">{t("form.terms.title")}</h4>
              <p>{t("form.terms.text")}</p>
            </div>
            <div className="editors mode">
              <div className="editor">
                <span className="price">1500 $</span>
              </div>
              <div className="editor">
                <button
                  className="main-button main-button--black"
                  type="submit"
                >
                  {t("form.payButton")}
                </button>
                <small>{t("form.consent")}</small>
              </div>
            </div>
          </div>
        </form>

        <div
          className="gift-section__wrapp"
          data-aos="fade-up"
          data-aos-duration={900}
          data-aos-delay={100}
        >
          <h4 className="pretitle">{t("faq.title")}</h4>
          <AccordionGroup
            className="acc mode"
            items={t.raw("faq.items").map((el: any) => ({
              title: el.q,
              content: `<p>${el.aHtml}</p>`,
            }))}
            dataDefault={3}
            dataSingle={true}
            dataBreakpoint={576}
          />
        </div>
      </div>
    </div>
  );
}
