import type { ReactNode } from "react";
import SiteShell from "../components/SiteShell";
import UiImage from "@/components/ui/UiImage";

export default function InsuranceLayout({ children }: { children: ReactNode }) {
  return (
    <SiteShell
      additionalChildren={
        <div className="rental-section__bg">
          <UiImage
            width={445}
            height={610}
            src="/img/bg.png"
            alt="Предупреждающий знак позади автомобиля на дороге — страховка при аренде авто"
            sizePreset="card"
          />
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
