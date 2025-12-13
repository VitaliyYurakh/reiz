"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import CustomSelect from "@/app/[locale]/components/CustomSelect";
import cn from "classnames";
import Icon from "@/components/Icon";
import { lockScroll, unlockScroll } from "@/lib/utils/scroll";
import { useSearchParams } from "next/navigation";
import type { Car } from "@/types/cars";
import { useLocale } from "use-intl";
import { useCatalogFilters } from "@/context/CatalogFiltersContext";
import { useSideBarModal } from "@/components/modals";
import CarCard from "@/app/[locale]/components/CarCard";

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

  return { filters, sortKey };
};

type CatalogProps = {
  cars: Car[];
};

export default function Catalog({ cars }: CatalogProps) {
  const locale = useLocale();
  const t = useTranslations("homePage.catalog_aside");
  const [toggleFixed, setToggleFixed] = useState(false);
  const [scrollingUp, setScrollingUp] = useState(false);
  const [internalFiltersOpen, setInternalFiltersOpen] = useState(false);
  const catalogFilters = useCatalogFilters();
  const { open } = useSideBarModal("requestCall");
  const { open: openManagerModal } = useSideBarModal(
    "managerWillContactYouModal",
  );

  const filtersOpen = catalogFilters?.filtersOpen ?? internalFiltersOpen;

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
        if(!themeColorMeta.current) {
            themeColorMeta.current = document.createElement('meta');
            themeColorMeta.current.setAttribute("name", "theme-color");
            themeColorMeta.current.setAttribute("content", "#000");
            document.head.appendChild(themeColorMeta.current);
        }
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (!themeColorMeta.current) return;
            if (window.scrollY > 100) {
                themeColorMeta.current.setAttribute("content", "#F1F0EB");
            } else {
                themeColorMeta.current.setAttribute("content", "#000");
            }
        }
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            if (!themeColorMeta.current) return;
            themeColorMeta.current.setAttribute("content", "#F1F0EB");
        }
    }, []);

  const searchParams = useSearchParams();
  const searchString = searchParams.toString();
  const parsedFromURL = useMemo(
    () => parseFiltersFromSearch(searchString),
    [searchString],
  );

  const [filters, setFilters] = useState<Filters>(parsedFromURL.filters);
  const [sortKey, setSortKey] = useState<SortKey>(parsedFromURL.sortKey);

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

  const filtered = cars.filter((c) => {
    if (filters.segment) {
      const segNames = c.segment.map((s) => s.name.toUpperCase());
      if (!segNames.includes(filters.segment.toUpperCase())) return false;
    }
    if (
      filters.fuel &&
      c.engineType &&
      c.engineType[locale].toLowerCase() !== filters.fuel
    ) {
      return false;
    }
    if (filters.brand && c.brand !== filters.brand) return false;
    if (filters.model && c.model !== filters.model) return false;

    const minTariffPrice =
      c.rentalTariff.length > 0
        ? Math.min(...c.rentalTariff.map((t) => t.dailyPrice))
        : null;

    if (
      filters.priceMin != null &&
      minTariffPrice != null &&
      minTariffPrice < filters.priceMin
    ) {
      return false;
    }
    if (
      filters.priceMax != null &&
      minTariffPrice != null &&
      minTariffPrice > filters.priceMax
    ) {
      return false;
    }
    return true;
  });

  const reset = () => setFilters({});

  const carBrands = Array.from(
    new Set(cars.map((car) => car.brand).filter(Boolean)),
  ) as string[];

  const carModels = Array.from(
    new Set(cars.map((car) => car.model).filter(Boolean)),
  ) as string[];

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
    const obs = new IntersectionObserver(
      ([entry]) => {
        const rectTop = entry.boundingClientRect.top;
        const rectBottom = entry.boundingClientRect.bottom;
        const isAbove = rectBottom < 0;
        const isBelow = rectTop > window.innerHeight;
        setToggleFixed(isAbove && !isBelow);
      },
      { threshold: 0 },
    );
    obs.observe(anchorRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    let prevScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        setScrollingUp(currentScrollY < prevScrollY);
        prevScrollY = currentScrollY;
        ticking = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!toggleFixed) {
      setScrollingUp(false);
    }
  }, [toggleFixed]);

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
            // data-aos="fade-right"
            // data-aos-duration="900"
            className={cn("catalog-aside", { active: filtersOpen })}
            aria-hidden={!filtersOpen}
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
                          onChange={() =>
                            setFilters((f) => ({ ...f, segment: seg }))
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
                      "with-sticky": toggleFixed && scrollingUp,
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
                      options={[
                        t("open_box.sort_option1"),
                        t("open_box.sort_option2"),
                        t("open_box.sort_option3"),
                      ]}
                      preSelectIcon={"filter2"} // TODO filter3 icon
                      showArrow={false}
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
                    options={["Economy", "Business", "Suv", "Luxury", "Van"]}
                    onChange={(val) => setFilters({ ...filters, segment: val })}
                    value={filters.segment ?? null}
                  />

                  <CustomSelect
                    placeholder={t("filters_panel.select_brand_placeholder")}
                    options={carBrands}
                    onChange={(val) => setFilters({ ...filters, brand: val })}
                    value={filters.brand ?? null}
                  />
                  <CustomSelect
                    placeholder={t("filters_panel.select_model_placeholder")}
                    options={carModels}
                    onChange={(val) => setFilters({ ...filters, model: val })}
                    value={filters.model ?? null}
                  />
                  <CustomSelect
                    placeholder={t("filters_panel.select_fuel_placeholder")}
                    options={["Benz", "Electro"]}
                    onChange={(val) => setFilters({ ...filters, fuel: val })}
                    value={filters.fuel ?? null}
                  />
                  <div className="catalog-aside__price">
                    <label className="catalog-aside__label mode">
                      <span>{t("filters_panel.price_min_label")}</span>
                      <input
                        type="number"
                        name="value_min"
                        id="value_min"
                        className="catalog-aside__input"
                        placeholder={t("filters_panel.price_min_placeholder")}
                        value={filters.priceMin ?? ""}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            priceMin: e.target.valueAsNumber || null,
                          }))
                        }
                      />
                      <span>$</span>
                    </label>
                    <label className="catalog-aside__label mode">
                      <span>{t("filters_panel.price_max_label")}</span>
                      <input
                        type="number"
                        name="value_max"
                        id="value_max"
                        className="catalog-aside__input"
                        placeholder={t("filters_panel.price_max_placeholder")}
                        value={filters.priceMax ?? ""}
                        onChange={(e) =>
                          setFilters((f) => ({
                            ...f,
                            priceMax: e.target.valueAsNumber || null,
                          }))
                        }
                      />
                      <span>$</span>
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
              aria-hidden
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
              <h2 className="pretitle">{t("catalog_content.pretitle")}</h2>

              <CustomSelect
                placeholder={t("open_box.sort_option3")}
                containerClassName={"sort_options mode"}
                options={[
                  t("open_box.sort_option1"),
                  t("open_box.sort_option2"),
                  t("open_box.sort_option3"),
                ]}
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
              {filtered.length > 0
                ? filtered.map((car) => <CarCard key={car.id} car={car} />)
                : t("catalog_list.empty")}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
