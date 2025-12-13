"use client";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { usePathname } from "next/navigation";

type AOSPartial = Partial<AOS.AosOptions>;

export default function AOSProvider({ config = {} as AOSPartial }) {
  const pathname = usePathname();

  useEffect(() => {
    AOS.init({
      disable: () =>
        typeof window !== "undefined" ? window.innerWidth < 1024 : false,
      once: true,
      ...config,
    });

    const onResize = () => AOS.refresh();
    window.addEventListener("resize", onResize);

    const observers: IntersectionObserver[] = [];

    const gallerySlider =
      document.querySelector<HTMLElement>(".gallery-slider");
    const tabs = document.querySelector<HTMLElement>(".single-section__tabs");
    if (gallerySlider && tabs) {
      const ob = new IntersectionObserver(
        (entries, self) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              tabs.classList.add("aos-animate");
              self.disconnect();
            }
          });
        },
        { threshold: 0.2 },
      );
      ob.observe(gallerySlider);
      observers.push(ob);
    }

    const asideEl = document.querySelector<HTMLElement>(".aside");
    const catalogEl = document.querySelector<HTMLElement>(".catalog-aside");
    const onTransition = (el: HTMLElement) => (ev: TransitionEvent) => {
      if (ev.propertyName === "opacity" || ev.propertyName === "transform") {
        el.classList.add("aos-transition-done");
      }
    };
    if (asideEl)
      asideEl.addEventListener("transitionend", onTransition(asideEl));
    if (catalogEl)
      catalogEl.addEventListener("transitionend", onTransition(catalogEl));

    const middleEl = document.querySelector<HTMLElement>(".footer__middle");
    const bottomEl = document.querySelector<HTMLElement>(".footer__bottom");
    if (middleEl && bottomEl) {
      const ob = new IntersectionObserver(
        (entries, self) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              bottomEl.removeAttribute("data-aos");
              bottomEl.classList.add("aos-animate");
              bottomEl.style.opacity = "0";
              bottomEl.style.transition = "opacity 0.6s ease";
              setTimeout(() => {
                bottomEl.style.opacity = "1";
              }, 850);
              self.disconnect();
            }
          });
        },
        { threshold: 0.5 },
      );
      ob.observe(middleEl);
      observers.push(ob);
    }

    const nameEls = Array.from(
      document.querySelectorAll<HTMLElement>(".car-card__name"),
    );
    const hoverHandlers: Array<{ el: HTMLElement; enter: any; leave: any }> =
      [];
    nameEls.forEach((name) => {
      const card = name.closest<HTMLElement>(".car-card");
      if (!card) return;
      const button = card.querySelector<HTMLElement>(".main-button");
      if (!button) return;
      const onEnter = () => button.classList.add("hovered");
      const onLeave = () => button.classList.remove("hovered");
      name.addEventListener("mouseenter", onEnter);
      name.addEventListener("mouseleave", onLeave);
      hoverHandlers.push({ el: name, enter: onEnter, leave: onLeave });
    });

    return () => {
      window.removeEventListener("resize", onResize);
      observers.forEach((o) => o.disconnect());
      if (asideEl)
        asideEl.removeEventListener("transitionend", onTransition(asideEl));
      if (catalogEl)
        catalogEl.removeEventListener("transitionend", onTransition(catalogEl));
      hoverHandlers.forEach(({ el, enter, leave }) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, [pathname, config]);

  useEffect(() => {
    AOS.refresh();
  }, [pathname]);

  return null;
}
