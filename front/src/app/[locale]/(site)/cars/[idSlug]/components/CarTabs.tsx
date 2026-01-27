"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import AccessibleTabs from "@/components/AccessibleTabs";

type TabItem = {
  value: string;
  label: string;
  content: React.ReactNode;
};

type Props = {
  items: TabItem[];
};

const EQUIPMENT_TAB = "1";
const EQUIPMENT_HASH = "#Equipment";

export default function CarTabs({ items }: Props) {
  const pathname = usePathname();
  const [defaultValue, setDefaultValue] = useState<string>("0");

  // Read hash on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash.toLowerCase() === EQUIPMENT_HASH.toLowerCase()) {
        setDefaultValue(EQUIPMENT_TAB);
      }
    }
  }, []);

  const handleTabChange = useCallback(
    (value: string) => {
      if (typeof window === "undefined") return;

      const search = window.location.search || "";

      if (value === EQUIPMENT_TAB) {
        // Set #Equipment for equipment tab
        history.replaceState(null, "", `${pathname}${search}${EQUIPMENT_HASH}`);
      } else {
        // Remove hash for other tabs
        history.replaceState(null, "", `${pathname}${search}`);
      }
    },
    [pathname]
  );

  return (
    <AccessibleTabs
      key={defaultValue}
      classNameContainer={"single-section__tabs"}
      classNameNavUl={"single-section__nav"}
      classNameNavLi={"single-section__item"}
      classNameItemLi={"single-section__item"}
      classNameBoxUl={"single-section__content"}
      classNameBtn={"single-section__btn"}
      sync={false}
      defaultValue={defaultValue}
      onChange={handleTabChange}
      items={items}
    />
  );
}
