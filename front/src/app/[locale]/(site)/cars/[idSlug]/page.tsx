import type { Metadata } from "next";
import Icon from "@/components/Icon";
import HomeIcon from "@/components/HomeIcon";
import CatalogLink from "@/components/CatalogLink";
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
import RentalPolicyButton from "@/app/[locale]/(site)/cars/[idSlug]/components/RentalPolicyButton";
import {fetchCar} from "@/lib/api/cars";
import {getTranslations} from "next-intl/server";
import {LocalizedText, localized} from "@/types/cars";
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

    const specs = [car.engineVolume, localized(car.transmission, locale)].filter(Boolean).join(" ");
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

    const driverAge = car.driverAge ?? car.segment?.[0]?.driverAge ?? 21;
    const driverExperience = car.driverExperience ?? car.segment?.[0]?.experience ?? 2;
    const overmileagePrice = car.overmileagePrice ?? car.segment?.[0]?.overmileagePrice ?? 0;
    const baseDeposit = car.rentalTariff.length > 0
        ? Math.min(...car.rentalTariff.map((t_) => t_.deposit))
        : 0;
    const sortedRules = [...(car.carCountingRule || [])].sort(
        (a, b) => a.depositPercent - b.depositPercent,
    );
    const depositValues = sortedRules.map((rule) =>
        rule.depositFixed != null
            ? rule.depositFixed
            : Math.max(Math.round(baseDeposit * (1 - rule.depositPercent / 100)), 0),
    );
    if (depositValues.length === 0) depositValues.push(baseDeposit);
    const minDeposit = Math.min(...depositValues);
    const maxDeposit = Math.max(...depositValues, baseDeposit);
    const freeDeliveryThreshold = car.freeDeliveryThreshold ?? 351;
    const cancellationHours = car.cancellationHours ?? 24;
    const carPaymentMethods = car.paymentMethods;
    const minRentalDays = car.minRentalDays ?? 1;
    const dailyMileageLimit = car.dailyMileageLimit ?? 300;

    const tabsNav = [
        {
            label: t("tabs.specifications"),
            content: (
                <div className="editor">
                    <ul className="rental-conditions">
                        <li className="rental-conditions__section-title">
                            {t("rentalConditions.title")}
                        </li>
                        <li className="rental-conditions__item">
                            <span className="rental-conditions__icon sprite">
                                <Icon id={"geo-alt"} width={22} height={22}/>
                            </span>
                            <span className="rental-conditions__label">{t("rentalConditions.delivery")}</span>
                            <span className="rental-conditions__value">{t("rentalConditions.deliveryValue", { threshold: freeDeliveryThreshold })}</span>
                        </li>
                        <li className="rental-conditions__item">
                            <span className="rental-conditions__icon sprite">
                                <Icon id={"shield-deposit"} width={22} height={22}/>
                            </span>
                            <span className="rental-conditions__label">{t("rentalConditions.deposit")}</span>
                            <span className="rental-conditions__value">{minDeposit === maxDeposit ? t("rentalConditions.depositValue", { amount: minDeposit }) : t("rentalConditions.depositRange", { min: minDeposit, max: maxDeposit })}</span>
                        </li>
                        <li className="rental-conditions__item">
                            <span className="rental-conditions__icon sprite">
                                <Icon id={"cancel-circle"} width={22} height={22}/>
                            </span>
                            <span className="rental-conditions__label">{t("rentalConditions.cancellation")}</span>
                            <span className="rental-conditions__value">{cancellationHours ? t("rentalConditions.cancellationValue", { hours: cancellationHours }) : t("rentalConditions.cancellationFree")}</span>
                        </li>
                        <li className="rental-conditions__item">
                            <span className="rental-conditions__icon sprite">
                                <Icon id={"credit-card"} width={22} height={22}/>
                            </span>
                            <span className="rental-conditions__label">{t("rentalConditions.payment")}</span>
                            <span className="rental-conditions__value">{carPaymentMethods || t("rentalConditions.paymentValue")}</span>
                        </li>

                        <li className="rental-conditions__section-title">
                            {t("rentalConditions.restrictionsTitle")}
                        </li>
                        <li className="rental-conditions__item">
                            <span className="rental-conditions__icon sprite">
                                <Icon id={"calendar-rental"} width={22} height={22}/>
                            </span>
                            <span className="rental-conditions__label">{t("rentalConditions.minRental")}</span>
                            <span className="rental-conditions__value">{t("rentalConditions.minRentalValue", { days: minRentalDays })}{minRentalDays >= 2 && <Icon id="warning-triangle" width={16} height={16} className="rental-conditions__warning" />}</span>
                        </li>
                        <li className="rental-conditions__item">
                            <span className="rental-conditions__icon sprite">
                                <Icon id={"t-person-key"} width={22} height={22}/>
                            </span>
                            <span className="rental-conditions__label">{t("rentalConditions.driverAge")}</span>
                            <span className="rental-conditions__value">{t("rentalConditions.driverAgeValue", { age: driverAge, experience: driverExperience })}</span>
                        </li>
                        <li className="rental-conditions__item">
                            <span className="rental-conditions__icon sprite">
                                <Icon id={"mileage"} width={22} height={22}/>
                            </span>
                            <span className="rental-conditions__label">{t("rentalConditions.mileageLimit")}</span>
                            <span className="rental-conditions__value">{t("rentalConditions.mileageLimitValue", { limit: dailyMileageLimit })}</span>
                        </li>
                        <li className="rental-conditions__item">
                            <span className="rental-conditions__icon sprite">
                                <Icon id={"plus-circle"} width={22} height={22}/>
                            </span>
                            <span className="rental-conditions__label">{t("rentalConditions.mileageCharge")}</span>
                            <span className="rental-conditions__value">{t("rentalConditions.mileageChargeValue", { price: overmileagePrice })} <Icon id="warning-triangle" width={16} height={16} className="rental-conditions__warning" /></span>
                        </li>
                    </ul>
                    <RentalPolicyButton
                        car={car}
                        carName={carDisplayName}
                        label={t("rentalConditions.readPolicy", { carName: carDisplayName })}
                    />
                </div>
            ),
        },
        {
            label: t("tabs.equipment"),
            content: (
                <div className="editor">
                    <h2>{t("equipmentTitle", {carName: carDisplayName})}</h2>
                    <ul className="equipment-list">
                        {(car.configuration || []).map((el) => (
                            <li key={el.ru} className="equipment-list__item">
                                <Icon id={"checkmark"} width={20} height={20}/>
                                {localized(el, locale) || "-"}
                            </li>
                        ))}
                    </ul>
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
        <>
            <JsonLd data={vehicleSchema} />
            <JsonLd data={productSchema} />
            <JsonLd data={breadcrumbSchema} />
            <ThemeColorSetter />
            <div className="container single-section__breadcrumb-row">
                <nav aria-label="Breadcrumb">
                    <ul
                        className="breadcrumbs"
                        data-aos="fade-right"
                        data-aos-duration="900"
                        data-aos-delay="400"
                    >
                        <li>
                            <Link href="/"><HomeIcon className="breadcrumbs__home-icon" /><span className="breadcrumbs__home-text">{t("breadcrumbs.home")}</span></Link>
                        </li>
                        <li>
                            <CatalogLink>{t("breadcrumbs.cars")}</CatalogLink>
                        </li>
                        <li aria-current="page">
                            {car.brand} {car.model} {car.yearOfManufacture}
                        </li>
                    </ul>
                </nav>
            </div>
            <section className="single-section">
            <div className="container">
                <div className="single-section__box">
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
                                ariaLabel={t("gallery.ariaLabel", { brand: car.brand ?? "", model: car.model ?? "" })}
                                prevSlideLabel={t("gallery.prevSlide")}
                                nextSlideLabel={t("gallery.nextSlide")}
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

                        {localizedDescription ? (
                            <div className="single-section__mobile-description">
                                <h2 className="single-section__mobile-description-title">
                                    {t("specifications.descriptionTitle")}
                                </h2>

                                <div
                                    className="single-section__mobile-description-content"
                                    // biome-ignore lint/security/noDangerouslySetInnerHtml: <1>
                                    dangerouslySetInnerHTML={{
                                        __html: localizedDescription,
                                    }}
                                />
                            </div>
                        ) : null}

                    </div>

                    <div className="single-section__specs-block">
                        <h2 className="single-section__specs-title">{t("specificationsTitle", { carName: carDisplayName })}</h2>
                        <ul className="table-info">
                            <li className="table-info__item">
                                <span className="sprite"><Icon id={"engine"} width={26} height={26}/></span>
                                <span className="table-info__name">{t("specifications.engine")}</span>
                                <span className="table-info__value">{formatEngine(car.engineVolume, car.engineType, locale)}</span>
                            </li>
                            <li className="table-info__item">
                                <span className="sprite"><Icon id={"gearbox"} width={26} height={26}/></span>
                                <span className="table-info__name">{t("specifications.transmission")}</span>
                                <span className="table-info__value">{localized(car.transmission, locale) || "-"}</span>
                            </li>
                            <li className="table-info__item">
                                <span className="sprite"><Icon id={"fuel"} width={26} height={26}/></span>
                                <span className="table-info__name">{t("specifications.fuelConsumption")}</span>
                                <span className="table-info__value">{car.fuelConsumption || "-"}</span>
                            </li>
                            <li className="table-info__item">
                                <span className="sprite"><Icon id={"drivetrain"} width={26} height={26}/></span>
                                <span className="table-info__name">{t("specifications.driveType")}</span>
                                <span className="table-info__value">{localized(car.driveType, locale) || "-"}</span>
                            </li>
                            <li className="table-info__item">
                                <span className="sprite"><Icon id={"seats"} width={26} height={26}/></span>
                                <span className="table-info__name">{t("specifications.seatsLabel")}</span>
                                <span className="table-info__value">{t("specifications.seats", {count: car.seats ?? 0})}</span>
                            </li>
                            <li className="table-info__item">
                                <span className="sprite"><Icon id={"calendar-detail"} width={26} height={26}/></span>
                                <span className="table-info__name">{t("specifications.year")}</span>
                                <span className="table-info__value">{car.yearOfManufacture}</span>
                            </li>
                        </ul>
                    </div>

                    {localizedDescription ? (
                        <div className="single-section__car-description">
                            <h2 className="single-section__specs-title">{t("specifications.descriptionTitle")}</h2>
                            <p
                                // biome-ignore lint/security/noDangerouslySetInnerHtml: <1>
                                dangerouslySetInnerHTML={{
                                    __html: localizedDescription,
                                }}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
        </>
    );
}
