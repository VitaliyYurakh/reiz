"use client";

import {
  JSX,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { usePathname } from "next/navigation";

type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode | JSX.Element;
};

type Props = {
  items: TabItem[];
  defaultValue?: string;
  sync?: "hash" | false;

  classNameContainer?: string;
  classNameNavUl?: string;
  classNameBtn?: string;
  classNameBoxUl?: string;
  classNameItemLi?: string;
  classNameNavLi?: string;
  activeClass?: string;

  dataAos?: string;
  dataAosDuration?: string | number;
  dataAosDelay?: string | number;
};

export default function AccessibleTabs({
  items,
  defaultValue,
  sync = "hash",
  classNameContainer = "terms-section__tabs",
  classNameNavUl = "terms-nav",
  classNameNavLi = "terms-nav__item",
  classNameBtn = "terms-nav__btn",
  classNameBoxUl = "terms-section__tabs-box",
  classNameItemLi = "terms-section__tabs-item",
  activeClass = "active",
  dataAos = undefined,
  dataAosDuration = undefined,
  dataAosDelay = undefined,
}: Props) {
  const pathname = usePathname();
  const uid = useId();

  const initial = useMemo(() => {
    if (typeof window === "undefined") return defaultValue ?? items[0]?.value;
    if (sync === "hash") {
      const m = window.location.hash.match(/^#tab-(.+)$/);
      if (m?.[1] && items.some((i) => i.value === m[1])) return m[1];
    }
    return defaultValue ?? items[0]?.value;
  }, [items, sync, defaultValue]);

  const [value, setValue] = useState<string>(initial);

  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const change = useCallback(
    (next: string, focus = true) => {
      if (!items.some((i) => i.value === next)) return;
      setValue(next);

      if (sync === "hash") {
        const h = `#tab-${next}`;
        if (typeof window !== "undefined" && window.location.hash !== h) {
          history.replaceState(null, "", `${pathname}${h}`);
        }
      }

      if (focus) {
        const idx = items.findIndex((i) => i.value === next);
        const btn = btnRefs.current[idx];
        btn?.focus();
      }
    },
    [items, sync, pathname],
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  return (
    <div
      className={classNameContainer}
      role="tablist"
      aria-orientation="horizontal"
      data-aos={dataAos}
      data-aos-duration={dataAosDuration}
      data-aos-delay={dataAosDelay}
    >
      <ul className={classNameNavUl}>
        {items.map((it, i) => {
          const selected = it.value === value;
          const tabId = `tab-${uid}-${it.value}`;
          const panelId = `panel-${uid}-${it.value}`;
          return (
            <li className={classNameNavLi} key={it.value}>
              <button
                ref={(el: HTMLButtonElement | null) => {
                  btnRefs.current[i] = el;
                }}
                className={`${classNameBtn} ${selected ? activeClass : ""}`}
                type="button"
                role="tab"
                id={tabId}
                aria-controls={panelId}
                aria-selected={selected}
                tabIndex={selected ? 0 : -1}
                data-tab={it.value}
                onClick={() => change(it.value, false)}
              >
                {it.label}
              </button>
            </li>
          );
        })}
      </ul>

      <ul className={classNameBoxUl}>
        {items.map((it) => {
          const selected = it.value === value;
          const tabId = `tab-${uid}-${it.value}`;
          const panelId = `panel-${uid}-${it.value}`;
          return (
            <li
              key={it.value}
              id={panelId}
              role="tabpanel"
              aria-labelledby={tabId}
              className={`${classNameItemLi} ${selected ? activeClass : ""}`}
              data-tab-content={it.value}
              hidden={!selected}
              tabIndex={0}
            >
              {it.content}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
