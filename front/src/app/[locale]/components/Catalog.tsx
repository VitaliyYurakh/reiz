"use client";

import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslations} from "next-intl";
import CustomSelect from "@/app/[locale]/components/CustomSelect";
import cn from "classnames";
import Icon from "@/components/Icon";
import {lockScroll, unlockScroll} from "@/lib/utils/scroll";
import {useSearchParams} from "next/navigation";
import type {Car} from "@/types/cars";
import {useLocale} from "use-intl";
import {useCatalogFilters} from "@/context/CatalogFiltersContext";
import {useSideBarModal} from "@/components/modals";
import CarCard from "@/app/[locale]/components/CarCard";
import {themeColorLock, useThemeColorOnOpen} from "@/hooks/useThemeColorOnOpen";
import {useCurrency} from "@/context/CurrencyContext";

type Filters = {
    segment?: string | null;
    fuel?: string | null;
    brand?: string | null;
    model?: string | null;
    priceMin?: number | null;
    priceMax?: number | null;
};

type SortKey = "default" | "asc" | "desc";

const createEmptyFilters = (): Filters => ({
    segment: null,
    brand: null,
    model: null,
    fuel: null,
    priceMin: null,
    priceMax: null,
});

const cleanString = (value: string | null): string | null => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed ? trimmed : null;
};

const parseNumberFromString = (value: string | null): number | null => {
    if (!value) return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? numeric : null;
};

const parseFiltersFromSearch = (
    search: string,
): { filters: Filters; sortKey: SortKey } => {
    const params = new URLSearchParams(search);
    const filters = createEmptyFilters();

    filters.segment = cleanString(params.get("class"));
    filters.brand = cleanString(params.get("brand"));
    filters.model = cleanString(params.get("model"));
    filters.fuel = cleanString(params.get("fuel"));
    filters.priceMin = parseNumberFromString(params.get("priceMin"));
    filters.priceMax = parseNumberFromString(params.get("priceMax"));

    const sort = params.get("sort");
    const sortKey: SortKey = sort === "asc" || sort === "desc" ? sort : "default";

    return {filters, sortKey};
};

const getMinPrice = (car: Car): number | null => {
    if (!car.rentalTariff || car.rentalTariff.length === 0) return null;
    return Math.min(...car.rentalTariff.map((t) => t.dailyPrice));
};

/**
 * Отримує ціну тарифу "Більше 29 днів" (minDays=30, maxDays=0)
 * Якщо такого тарифу немає - повертає null
 */
const getLongTermPrice = (car: Car): number | null => {
    if (!car.rentalTariff || car.rentalTariff.length === 0) return null;
    const longTermTariff = car.rentalTariff.find(
        (t) => t.minDays === 30 && t.maxDays === 0
    );
    return longTermTariff?.dailyPrice ?? null;
};

type CatalogProps = {
    cars: Car[];
    // Опціональний заголовок секції для міських сторінок
    sectionTitle?: string;
};

export default function Catalog({cars, sectionTitle}: CatalogProps) {
    const locale = useLocale();
    const t = useTranslations("homePage.catalog_aside");
    const [toggleFixed, setToggleFixed] = useState(false);
    const [internalFiltersOpen, setInternalFiltersOpen] = useState(false);
    const catalogFilters = useCatalogFilters();
    const {open} = useSideBarModal("requestCall");
    const {open: openManagerModal} = useSideBarModal(
        "managerWillContactYouModal",
    );
    const {convert, convertToUSD, getCurrencySymbol} = useCurrency();

    const filtersOpen = catalogFilters?.filtersOpen ?? internalFiltersOpen;

    useThemeColorOnOpen(filtersOpen);

    const setFiltersOpen = useCallback(
        (open: boolean) => {
            if (catalogFilters) {
                catalogFilters.setFiltersOpen(open);
            } else {
                setInternalFiltersOpen(open);
            }
        },
        [catalogFilters],
    );

    const themeColorMeta = useRef<HTMLMetaElement | null>(null);
    useEffect(() => {
        themeColorMeta.current = document.querySelector(
            'meta[name="theme-color"]',
        );
        if (!themeColorMeta.current) {
            themeColorMeta.current = document.createElement("meta");
            themeColorMeta.current.setAttribute("name", "theme-color");
            themeColorMeta.current.setAttribute("content", "#000");
            document.head.appendChild(themeColorMeta.current);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!themeColorMeta.current) return;
            // Skip if theme-color is locked by mobile menu
            if (themeColorLock.locked) return;
            if (window.scrollY > 100) {
                themeColorMeta.current.setAttribute("content", "#F1F0EB");
            } else {
                themeColorMeta.current.setAttribute("content", "#000");
            }
        };
        window.addEventListener("scroll", handleScroll, {passive: true});
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (!themeColorMeta.current) return;
            themeColorMeta.current.setAttribute("content", "#F1F0EB");
        };
    }, []);

    const searchParams = useSearchParams();
    const searchString = searchParams.toString();
    const parsedFromURL = useMemo(
        () => parseFiltersFromSearch(searchString),
        [searchString],
    );

    const [filters, setFilters] = useState<Filters>(parsedFromURL.filters);
    const [sortKey, setSortKey] = useState<SortKey>(parsedFromURL.sortKey);

    // Текстові опції з перекладів
    const sortLabelDefault = t("open_box.sort_option3"); // "По умолчанию"
    const sortLabelAsc = t("open_box.sort_option1");     // "По возрастанию"
    const sortLabelDesc = t("open_box.sort_option2");    // "По убыванию"

    // Масив опцій для селектора: default першим
    const sortOptions = useMemo(() => [
        sortLabelDefault,
        sortLabelAsc,
        sortLabelDesc,
    ], [sortLabelDefault, sortLabelAsc, sortLabelDesc]);

    // Маппінг тексту опції → SortKey
    const sortOptionToKey = useCallback((option: string): SortKey => {
        if (option === sortLabelAsc) return "asc";
        if (option === sortLabelDesc) return "desc";
        return "default";
    }, [sortLabelAsc, sortLabelDesc]);

    // Маппінг SortKey → тексту опції
    const sortKeyToOption = useCallback((key: SortKey): string => {
        if (key === "asc") return sortLabelAsc;
        if (key === "desc") return sortLabelDesc;
        return sortLabelDefault;
    }, [sortLabelAsc, sortLabelDesc, sortLabelDefault]);

    // Обробник зміни селектора сортування
    const handleSortChange = useCallback((option: string) => {
        setSortKey(sortOptionToKey(option));
    }, [sortOptionToKey]);

    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams();

        if (filters.segment) params.set("class", filters.segment);
        if (filters.brand) params.set("brand", filters.brand);
        if (filters.model) params.set("model", filters.model);
        if (filters.fuel) params.set("fuel", filters.fuel);
        if (filters.priceMin != null)
            params.set("priceMin", String(filters.priceMin));
        if (filters.priceMax != null)
            params.set("priceMax", String(filters.priceMax));
        if (sortKey !== "default") params.set("sort", sortKey);

        const search = params.toString();
        const basePath = window.location.pathname;
        const newUrl = search ? `${basePath}?${search}` : basePath;
        const currentSearch = window.location.search.replace(/^\?/, "");

        if (search === currentSearch) {
            return;
        }

        window.history.replaceState(null, "", newUrl);
    }, [filters, sortKey]);


    const isCarMatching = useCallback(
        (car: Car, excludeKey?: keyof Filters | "price") => {
            if (excludeKey !== "segment" && filters.segment) {
                const segNames = car.segment.map((s) => s.name.toUpperCase());
                if (!segNames.includes(filters.segment.toUpperCase())) return false;
            }

            if (excludeKey !== "fuel" && filters.fuel) {
                if (
                    !car.engineType ||
                    car.engineType[locale].toLowerCase() !== filters.fuel.toLowerCase()
                ) {
                    return false;
                }
            }

            if (excludeKey !== "brand" && filters.brand) {
                if (car.brand?.trim() !== filters.brand.trim()) return false;
            }

            if (excludeKey !== "model" && filters.model) {
                if (car.model?.trim() !== filters.model.trim()) return false;
            }

            // Пропускаємо фільтр ціни якщо excludeKey === "price"
            if (excludeKey !== "price") {
                const minTariffPrice = getMinPrice(car);

                if (filters.priceMin != null) {
                    if (minTariffPrice == null || minTariffPrice < filters.priceMin)
                        return false;
                }
                if (filters.priceMax != null) {
                    if (minTariffPrice == null || minTariffPrice > filters.priceMax)
                        return false;
                }
            }

            return true;
        },
        [filters, locale],
    );

    const filtered = useMemo(() => {
        return cars.filter((c) => isCarMatching(c));
    }, [cars, isCarMatching]);

    // Авто відфільтровані БЕЗ фільтра ціни (для розрахунку динамічних меж)
    const filteredWithoutPrice = useMemo(() => {
        return cars.filter((c) => isCarMatching(c, "price"));
    }, [cars, isCarMatching]);

    // Динамічні мін/макс ціни ">29 днів" для placeholder
    const priceRange = useMemo(() => {
        const prices = filteredWithoutPrice
            .map(getLongTermPrice)
            .filter((p): p is number => p !== null);

        if (prices.length === 0) {
            return { min: 0, max: 0 };
        }

        return {
            min: Math.min(...prices),
            max: Math.max(...prices),
        };
    }, [filteredWithoutPrice]);

    // Сортування відфільтрованих авто по ціні "Більше 29 днів"
    const sortedCars = useMemo(() => {
        if (sortKey === "default") {
            return filtered;
        }

        return [...filtered].sort((a, b) => {
            const priceA = getLongTermPrice(a);
            const priceB = getLongTermPrice(b);

            // Авто без ціни ставимо в кінець списку
            if (priceA === null && priceB === null) return 0;
            if (priceA === null) return 1;
            if (priceB === null) return -1;

            // asc = за зростанням (менша ціна вище)
            // desc = за спаданням (більша ціна вище)
            return sortKey === "asc" ? priceA - priceB : priceB - priceA;
        });
    }, [filtered, sortKey]);


    const carBrands = useMemo(() => {
        const matchingCars = cars.filter((c) => isCarMatching(c, "brand"));
        const brands = new Set(matchingCars.map((c) => c.brand?.trim()).filter((x): x is string => Boolean(x)));
        return Array.from(brands).sort((a, b) =>
            a.localeCompare(b, locale, { sensitivity: "base" })
        );
    }, [cars, isCarMatching, locale]);

    const carModels = useMemo(() => {
        const matchingCars = cars.filter((c) => isCarMatching(c, "model"));
        const models = new Set(matchingCars.map((c) => c.model?.trim()).filter((x): x is string => Boolean(x)));
        return Array.from(models).sort((a, b) =>
            a.localeCompare(b, locale, { sensitivity: "base" })
        );
    }, [cars, isCarMatching, locale]);

    const carFuels = useMemo(() => {
        const matchingCars = cars.filter((c) => isCarMatching(c, "fuel"));
        const fuels = new Set(
            matchingCars.map((c) => c.engineType?.[locale]).filter((x): x is string => Boolean(x)),
        );
        return Array.from(fuels).sort((a, b) =>
            a.localeCompare(b, locale, { sensitivity: "base" })
        );
    }, [cars, isCarMatching, locale]);

    const carSegments = useMemo(() => {
        const allSegments = ["Economy", "Business", "Suv", "Luxury", "Van"];
        const matchingCars = cars.filter((c) => isCarMatching(c, "segment"));

        const availableSegmentNames = new Set<string>();
        matchingCars.forEach(car => {
            car.segment.forEach(s => availableSegmentNames.add(s.name.toUpperCase()));
        });

        return allSegments.filter(seg => availableSegmentNames.has(seg.toUpperCase()));
    }, [cars, isCarMatching]);


    const reset = () => setFilters({});

    const selectedCount =
        (filters.segment ? 1 : 0) +
        (filters.fuel ? 1 : 0) +
        (filters.brand ? 1 : 0) +
        (filters.model ? 1 : 0) +
        (filters.priceMin != null ? 1 : 0) +
        (filters.priceMax != null ? 1 : 0);

    const anchorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!anchorRef.current) return;

        let rafId: number | null = null;
        let isScrolling = false;

        const checkFixed = () => {
            if (!anchorRef.current) return;
            const rect = anchorRef.current.getBoundingClientRect();
            const isAbove = rect.bottom < 0;
            const isBelow = rect.top > window.innerHeight;
            setToggleFixed(isAbove && !isBelow);
        };

        // Continuous check using rAF while scrolling
        const rafCheck = () => {
            checkFixed();
            if (isScrolling) {
                rafId = requestAnimationFrame(rafCheck);
            }
        };

        // IntersectionObserver for normal detection
        const obs = new IntersectionObserver(
            ([entry]) => {
                const rectTop = entry.boundingClientRect.top;
                const rectBottom = entry.boundingClientRect.bottom;
                const isAbove = rectBottom < 0;
                const isBelow = rectTop > window.innerHeight;
                setToggleFixed(isAbove && !isBelow);
            },
            {threshold: 0},
        );
        obs.observe(anchorRef.current);

        // Scroll listener starts rAF loop for smooth fast scroll handling
        let scrollTimeout: ReturnType<typeof setTimeout>;
        const handleScroll = () => {
            if (!isScrolling) {
                isScrolling = true;
                rafCheck();
            }
            // Reset timeout on each scroll
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                isScrolling = false;
                if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                }
                // Final check after scroll ends
                checkFixed();
            }, 150);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });

        return () => {
            obs.disconnect();
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
            if (rafId) {
                cancelAnimationFrame(rafId);
            }
        };
    }, []);


    useEffect(() => {
        if (filtersOpen) {
            lockScroll();
        } else {
            unlockScroll();
        }
    }, [filtersOpen]);

    return (
        <section id="catalog" className="catalog-section">
            <div className="container">
                <div className="catalog-section__box">
                    <aside
                        className={cn("catalog-aside", {active: filtersOpen})}
                    >
                        <div className="catalog-aside__top">
                            <p>{t("top_text")}</p>
                        </div>

                        <form className="catalog-aside__form">
                            <div className="catalog-aside__content">
                                <div className="catalog-aside__inner">
                                    {["Economy", "Business", "Suv", "Luxury", "Van"].map(
                                        (seg, idx) => (
                                            <label key={seg} className="radio-checkbox">
                                                <input
                                                    type="radio"
                                                    name="car-type"
                                                    value={seg}
                                                    className="radio-checkbox__field"
                                                    checked={filters.segment === seg}
                                                    onChange={() => {}}
                                                    onClick={() =>
                                                        setFilters((f) => ({
                                                            ...f,
                                                            segment: f.segment === seg ? null : seg
                                                        }))
                                                    }
                                                />
                                                <span className="radio-checkbox__content">
                          <i className="sprite">
                            <svg width="88" height="27">
                              <use
                                  href={`/img/sprite/sprite.svg#car${idx + 1}`}
                              />
                            </svg>
                          </i>
                                                    {t(`category${idx + 1}` as any)}
                        </span>
                                            </label>
                                        ),
                                    )}
                                </div>

                                <div ref={anchorRef} className={"catalog-aside__open"}>
                                    <div
                                        className={cn("catalog-aside__open-box", {
                                            fixed: toggleFixed,
                                        })}
                                    >
                                        <button
                                            type="button"
                                            className="catalog-aside__filter"
                                            onClick={() => setFiltersOpen(true)}
                                        >
                                            <i className="sprite">
                                                <svg width="21" height="21">
                                                    <use href="/img/sprite/sprite.svg#filter"></use>
                                                </svg>
                                            </i>
                                            {t("open_box.filter_button_text")}
                                            <b>{selectedCount}</b>
                                        </button>

                                        <CustomSelect
                                            containerClassName={"mode"}
                                            options={sortOptions}
                                            value={sortKeyToOption(sortKey)}
                                            onChange={handleSortChange}
                                            preSelectIcon={"filter2"}
                                            showArrow={false}
                                            defaultOption={sortLabelDefault}
                                        />
                                    </div>
                                </div>

                                <div
                                    className={cn("catalog-aside__filters", {
                                        active: filtersOpen,
                                    })}
                                >
                  <span className="catalog-aside__subtitle">
                    {t("open_box.filter_button_text")} <i>1</i>
                  </span>
                                    <button
                                        type="button"
                                        onClick={() => setFiltersOpen(false)}
                                        className="catalog-aside__close"
                                    >
                                        <i className="sprite">
                                            <Icon width={36} height={36} id={"close2"}></Icon>
                                        </i>
                                    </button>

                                    <CustomSelect
                                        containerClassName={"car"}
                                        placeholder={t("filters_panel.select_car_placeholder")}
                                        options={carSegments}
                                        onChange={(val) => setFilters({...filters, segment: val})}
                                        value={filters.segment ?? null}
                                    />

                                    <CustomSelect
                                        placeholder={t("filters_panel.select_brand_placeholder")}
                                        options={carBrands}
                                        onChange={(val) =>
                                            setFilters({...filters, brand: val, model: null})
                                        }
                                        value={filters.brand ?? null}
                                    />
                                    <CustomSelect
                                        placeholder={t("filters_panel.select_model_placeholder")}
                                        options={carModels}
                                        onChange={(val) => setFilters({...filters, model: val})}
                                        value={filters.model ?? null}
                                    />
                                    <CustomSelect
                                        placeholder={t("filters_panel.select_fuel_placeholder")}
                                        options={carFuels}
                                        onChange={(val) => setFilters({...filters, fuel: val})}
                                        value={filters.fuel ?? null}
                                    />
                                    <div className="catalog-aside__price">
                                        <label className="catalog-aside__label mode">
                                            <span id="price-min-label">{t("filters_panel.price_min_label")}</span>
                                            <input
                                                type="number"
                                                name="value_min"
                                                id="value_min"
                                                className="catalog-aside__input"
                                                placeholder={priceRange.min > 0 ? `${Math.round(convert(priceRange.min))}` : "0"}
                                                value={filters.priceMin ? Math.round(convert(filters.priceMin)) : ""}
                                                aria-labelledby="price-min-label"
                                                onChange={(e) =>
                                                    setFilters((f) => ({
                                                        ...f,
                                                        priceMin: e.target.valueAsNumber ? Math.round(convertToUSD(e.target.valueAsNumber)) : null,
                                                    }))
                                                }
                                            />
                                            <span aria-hidden="true">{getCurrencySymbol()}</span>
                                        </label>
                                        <label className="catalog-aside__label mode">
                                            <span id="price-max-label">{t("filters_panel.price_max_label")}</span>
                                            <input
                                                type="number"
                                                name="value_max"
                                                id="value_max"
                                                className="catalog-aside__input"
                                                placeholder={priceRange.max > 0 ? `${Math.round(convert(priceRange.max))}` : "0"}
                                                value={filters.priceMax ? Math.round(convert(filters.priceMax)) : ""}
                                                aria-labelledby="price-max-label"
                                                onChange={(e) =>
                                                    setFilters((f) => ({
                                                        ...f,
                                                        priceMax: e.target.valueAsNumber ? Math.round(convertToUSD(e.target.valueAsNumber)) : null,
                                                    }))
                                                }
                                            />
                                            <span aria-hidden="true">{getCurrencySymbol()}</span>
                                        </label>
                                    </div>

                                    <button className="reset-btn" type="button" onClick={reset}>
                                        {t("filters_panel.reset_button")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setFiltersOpen(false)}
                                        className="main-button"
                                    >
                                        {t("filters_panel.show_button_text")}{" "}
                                        <span>{filtered.length}</span>{" "}
                                        {t("filters_panel.show_button_suffix")}
                                    </button>
                                </div>
                            </div>

                            <button
                                className="main-button"
                                onClick={() => {
                                    open({}, (phone: string) => {
                                        setTimeout(() => {
                                            openManagerModal({
                                                type: "call_request",
                                                phone,
                                                showCloseButton: true,
                                            });
                                        }, 500);
                                    });
                                }}
                                type="button"
                            >
                                {t("submit")}
                            </button>
                        </form>
                    </aside>

                    {filtersOpen && (
                        <div
                            className="overlay fixed-block active"
                            role="presentation"
                            onClick={() => setFiltersOpen(false)}
                        />
                    )}

                    <div className="catalog-section__content">
                        <div
                            className="catalog-section__top"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-delay="200"
                        >
                            <h2 className="pretitle">{sectionTitle ?? t("catalog_content.pretitle")}</h2>

                            <CustomSelect
                                placeholder={sortOptions[0]}
                                containerClassName={"sort_options mode"}
                                options={sortOptions}
                                value={sortKeyToOption(sortKey)}
                                onChange={handleSortChange}
                                preSelectIcon={"filter2"}
                            />
                        </div>

                        <ul
                            id="cars"
                            className="catalog-section__list"
                            data-aos="fade-up"
                            data-aos-duration="500"
                            data-aos-delay="300"
                        >
                            {sortedCars.length > 0
                                ? sortedCars.map((car) => <CarCard key={car.id} car={car}/>)
                                : t("catalog_list.empty")}
                        </ul>
                    </div>
                </div>
            </div>
        </section>
    );
}