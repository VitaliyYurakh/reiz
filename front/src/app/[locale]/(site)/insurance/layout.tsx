import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";
import Image from "next/image";

export default function InsuranceLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      additionalChildren={
        <div className="rental-section__bg">
          <picture>
            <Image
              width="445"
              height="610"
              src="/img/bg.png"
              alt="Предупреждающий знак позади автомобиля на дороге — страховка при аренде авто"
            />
          </picture>
        </div>
      }
      sectionBoxClass={"rental-section__box"}
      sectionClass={"rental-section insurance"}
      mode={false}
      headerClass={"rental"}
    >
      {children}
    </SiteShell>
  );
}
