import type { Metadata } from "next";
import Icon from "@/components/Icon";
import {Link, type Locale, defaultLocale} from "@/i18n/request";
import {
  OG_LOCALE,
  buildHreflangMap,
  getOgAlternateLocales,
} from "@/i18n/locale-config";
import CarAside from "@/app/[locale]/(site)/cars/[idSlug]/components/CarAside";
import CarGallerySlider from "@/app/[locale]/(site)/cars/[idSlug]/components/CarSlider";
import CarClientProvider from "@/app/[locale]/(site)/cars/[idSlug]/components/modals/CarClientProvider";
import ThemeColorSetter from "@/app/[locale]/(site)/cars/[idSlug]/components/ThemeColorSetter";
import CarTabs from "@/app/[locale]/(site)/cars/[idSlug]/components/CarTabs";
import {fetchCar} from "@/lib/api/cars";
import {getTranslations} from "next-intl/server";
import {LocalizedText} from "@/types/cars";
import {createCarIdSlug, parseCarIdFromSlug} from "@/lib/utils/carSlug";
import {formatEngine} from "@/lib/utils/catalog-utils";
import { notFound, permanentRedirect } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { generateVehicleSchema, generateProductSchema } from "@/lib/schema/vehicle";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://reiz.com.ua";

const toAbsolute = (value: string) => {
    if (!value) return value;
    if (value.startsWith("http://") || value.startsWith("https://")) return value;
    return `${BASE}${value.startsWith("/") ? "" : "/"}${value}`;
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ idSlug: string; locale: Locale }>;
}): Promise<Metadata> {
    const { idSlug, locale } = await params;
    const carId = parseCarIdFromSlug(idSlug);
    if (carId === null) return {};

    const car = await fetchCar(carId);
    if (!car) return {};

    const brand = car.brand ?? "";
    const model = car.model ?? "";
    const year = car.yearOfManufacture ?? "";
    const carName = `${brand} ${model} ${year}`.trim();
    const slug = createCarIdSlug(car);
    const path = `/cars/${slug}`;

    const t = await getTranslations("carPage");

    const minPrice =
      car.rentalTariff?.reduce((min, t) => Math.min(min, t.dailyPrice), Infinity) ?? 0;
    const price = Number.isFinite(minPrice) && minPrice > 0 ? minPrice : 50;

    const specs = [car.engineVolume, car.transmission?.[locale]].filter(Boolean).join(" ");
    const specsText = specs ? `${specs}, ` : "";
    const seats = car.seats || 5;

    const title = t("meta.title", {
      brand,
      model,
      price,
      year,
    });
    const description = t("meta.description", {
      carName,
      specsText,
      seats,
    });

    const languages = buildHreflangMap(path, (p) => `${BASE}${p}`);

    const ogImage = toAbsolute(
        car.carPhoto.find((p) => p.type === "PC")?.url || "/img/og/home.webp",
    );
    const ogLocale = OG_LOCALE[locale];
    const ogAlternateLocales = getOgAlternateLocales(locale);

    return {
        title,
        description,
        alternates: {
            canonical: `${BASE}${locale === defaultLocale ? "" : `/${locale}`}${path}`,
            languages,
        },
        openGraph: {
            type: "website",
            siteName: "REIZ",
            title,
            description,
            url: `${BASE}${locale === defaultLocale ? "" : `/${locale}`}${path}`,
            images: [{ url: ogImage, width: 891, height: 499, alt: carName }],
            locale: ogLocale,
            alternateLocale: ogAlternateLocales,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [ogImage],
        },
    };
}

export default async function CarPage({
                                          params,
                                      }: {
    params: Promise<{ idSlug: string; locale: Locale }>;
}) {
    const {idSlug, locale} = await params;
    const carId = parseCarIdFromSlug(idSlug);
    if (carId === null) {
        notFound();
    }
    const car = await fetchCar(carId);
    if (!car) {
        notFound();
    }

    // 308 redirect if slug is missing or incorrect
    const expectedIdSlug = createCarIdSlug(car);
    if (idSlug !== expectedIdSlug) {
        const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
        permanentRedirect(`${localePrefix}/cars/${expectedIdSlug}`);
    }

    const t = await getTranslations("carPage");

    const carDisplayName =
        `${car.brand} ${car.model} ${car.yearOfManufacture}`.trim();

    // Витягуємо ТІЛЬКИ локалізований опис (не весь JSON з усіма мовами)
    let localizedDescription = "";
    try {
        const raw = car.description;
        const descriptionJson: LocalizedText | null = raw
            ? (typeof raw === "string" ? JSON.parse(raw) : raw) as LocalizedText
            : null;
        localizedDescription = descriptionJson?.[locale]?.replaceAll("\\n", "<br/>") || "";
    } catch (e) {
        console.error("Error parsing description JSON:", e);
    }

    const tabsNav = [
        {
            label: t("tabs.specifications"),
            content: (
                <div className="editor">
                    <h2>
                        {t("specifications.descriptionTitle", {
                            carName: carDisplayName,
                        })}
                    </h2>

                    <p
                        // biome-ignore lint/security/noDangerouslySetInnerHtml: <1>
                        dangerouslySetInnerHTML={{
                            __html: localizedDescription,
                        }}
                    />

                    <ul className="table-info">
                        <li className="table-info__item">
              <span className="sprite">
                <Icon id={"icon1"} width={26} height={26}/>
              </span>
                            <span className="table-info__name">
                {t("specifications.engine")}
              </span>
                            <span className="table-info__value">{formatEngine(car.engineVolume, car.engineType, locale)}</span>
                        </li>
                        <li className="table-info__item">
              <span className="sprite">
                <Icon id={"icon2"} width={26} height={26}/>
              </span>
                            <span className="table-info__name">
                {t("specifications.transmission")}
              </span>
                            <span className="table-info__value">
                {car.transmission?.[locale] || "-"}
              </span>
                        </li>
                        <li className="table-info__item">
                            <img src="/img/fuel-icon.png" width={23} height={23} alt={t("specifications.fuelIcon")}/>
                            <span className="table-info__name">
                {t("specifications.fuelConsumption")}
              </span>
                            <span className="table-info__value">
                {car.fuelConsumption || "-"}
              </span>
                        </li>

                        <li className="table-info__item">
              <span className="sprite">
                <Icon id={"icon3"} width={26} height={26}/>
              </span>
                            <span className="table-info__name">
                {t("specifications.driveType")}
              </span>
                            <span className="table-info__value">
                {car.driveType?.[locale] || "-"}
              </span>
                        </li>
                        <li className="table-info__item">
              <span className="sprite">
                <Icon id={"icon4"} width={26} height={26}/>
              </span>
                            <span className="table-info__name">
                {t("specifications.seatsLabel")}
              </span>
                            <span className="table-info__value">
                {t("specifications.seats", {count: car.seats ?? 0})}
              </span>
                        </li>
                        <li className="table-info__item">
              <span className="sprite">
                <Icon id={"icon21"} width={26} height={26}/>
              </span>
                            <span className="table-info__name">
                {t("specifications.year")}
              </span>
                            <span className="table-info__value">{car.yearOfManufacture}</span>
                        </li>
                    </ul>
                </div>
            ),
        },
        {
            label: t("tabs.equipment"),
            content: (
                <div className="editor">
                    <h2>{t("equipmentTitle", {carName: carDisplayName})}</h2>
                    <p style={{display: "flex", flexWrap: "wrap", gap: "8px"}}>
                        {(car.configuration || []).map((el) => (
                            <span
                                key={el.ru}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    backgroundColor: "#f5f5f5",
                                    padding: "6px 12px",
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    gap: "3px",
                                }}
                            >
                <Icon id={"checkmark"} width={20} height={20}/>
                                {el?.[locale] || "-"}
              </span>
                        ))}
                    </p>
                </div>
            ),
        },
    ];

    const imageAlt = t("imageAlt", { brand: car.brand ?? "", model: car.model ?? "" });

    const PCImages = car.carPhoto
        .filter((image) => image.type === "PC")
        .map((image) => ({
            src: image.url,
            w: 891,
            h: 499,
            alt: imageAlt,
        }));

    const mobileImages = car.carPhoto
        .filter((image) => image.type === "MOBILE")
        .map((image) => ({
            src: image.url,
            w: 500,
            h: 500,
            alt: imageAlt,
        }));

    // Generate canonical URL for schema
    const slug = createCarIdSlug(car);
    const canonicalUrl = `${BASE}${locale === defaultLocale ? "" : `/${locale}`}/cars/${slug}`;

    // Generate Vehicle schema.org JSON-LD
    const vehicleSchema = generateVehicleSchema({
        car,
        locale,
        canonicalUrl,
    });

    // Generate Product schema.org JSON-LD for Google Rich Snippets
    const productSchema = generateProductSchema({
        car,
        locale,
        canonicalUrl,
    });

    // Generate BreadcrumbList schema.org JSON-LD
    const localePrefix = locale === defaultLocale ? "" : `/${locale}`;
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
            {
                "@type": "ListItem",
                position: 1,
                name: t("breadcrumbs.home"),
                item: `${BASE}${localePrefix || "/"}`,
            },
            {
                "@type": "ListItem",
                position: 2,
                name: t("breadcrumbs.cars"),
                item: `${BASE}${localePrefix}/#catalog`,
            },
            {
                "@type": "ListItem",
                position: 3,
                name: `${car.brand} ${car.model}`,
                item: canonicalUrl,
            },
        ],
    };

    return (
        <section className="single-section">
            <JsonLd data={vehicleSchema} />
            <JsonLd data={productSchema} />
            <JsonLd data={breadcrumbSchema} />
            <ThemeColorSetter />
            <div className="container">
                <div className="single-section__box">
                    <ul
                        className="breadcrumbs"
                        data-aos="fade-right"
                        data-aos-duration="900"
                        data-aos-delay="400"
                    >
                        <li>
                            <Link href="/">{t("breadcrumbs.home")}</Link>
                        </li>
                        <li>
                            <Link href="/#catalog">{t("breadcrumbs.cars")}</Link>
                        </li>
                        <li>
                            {car.brand} {car.model} {car.yearOfManufacture}
                        </li>
                    </ul>

                    <div className="single-section__inner">
                        <h1
                            className="main-title"
                            data-aos="fade-right"
                            data-aos-duration="900"
                            data-aos-delay="450"
                        >
                            {t("title", {
                                brand: car.brand || "",
                                model: car.model || "",
                                year: car.yearOfManufacture || "",
                            })}
                        </h1>

                        <div className="single-section__info">
                            <CarGallerySlider
                                group={"1"}
                                pcItems={PCImages}
                                mobileItems={mobileImages}
                            />

                            <CarTabs
                                items={tabsNav.map((nav, i) => ({
                                    label: nav.label,
                                    value: String(i),
                                    content: nav.content,
                                }))}
                            />
                        </div>

                        <CarClientProvider>
                            <CarAside car={{...car, description: null}}/>
                        </CarClientProvider>

                        <div className="main-order-wrapper rentPage">
                            <div className="main-order"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
