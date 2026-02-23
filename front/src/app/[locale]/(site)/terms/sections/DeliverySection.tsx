import { getTranslations } from "next-intl/server";

type MenuItem = { name: string; price: string; desc?: string };

export default async function DeliverySection() {
  const t = await getTranslations("termsPage.sections.delivery");
  const deliveryItems = t.raw("deliveryItems") as MenuItem[];
  const returnItems = t.raw("returnItems") as MenuItem[];

  return (
    <section className="terms-block" id="delivery">
      <div className="terms-block__header">
        <h2 className="terms-block__title">{t("title")}</h2>
        <p className="terms-block__subtitle">{t("subtitle")}</p>
      </div>

      <div className="terms-block__groups">
        <div className="terms-block__group">
          <h3 className="terms-block__label">{t("deliveryTitle")}</h3>
          <div className="terms-menu">
            {deliveryItems.map((item) => (
              <div className="terms-menu__item" key={item.name}>
                <div className="terms-menu__row">
                  <span className="terms-menu__name">{item.name}</span>
                  <span className="terms-menu__dots" />
                  <span className="terms-menu__price">{item.price}</span>
                </div>
                {item.desc && <p className="terms-menu__desc">{item.desc}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="terms-block__group">
          <h3 className="terms-block__label">{t("returnTitle")}</h3>
          <div className="terms-menu">
            {returnItems.map((item) => (
              <div className="terms-menu__item" key={item.name}>
                <div className="terms-menu__row">
                  <span className="terms-menu__name">{item.name}</span>
                  <span className="terms-menu__dots" />
                  <span className="terms-menu__price">{item.price}</span>
                </div>
                {item.desc && <p className="terms-menu__desc">{item.desc}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="terms-block__group">
          <div className="terms-menu">
            <div className="terms-menu__item">
              <div className="terms-menu__row">
                <span className="terms-menu__name">{t("washName")}</span>
                <span className="terms-menu__dots" />
                <span className="terms-menu__price">{t("washPrice")}</span>
              </div>
              <p className="terms-menu__desc">{t("washDesc")}</p>
            </div>
          </div>
        </div>
      </div>

      <p className="terms-block__note">{t("note")}</p>
    </section>
  );
}
