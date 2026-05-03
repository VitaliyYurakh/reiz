import { getRentals } from "@/lib/api/customer";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import NewComplaintForm from "./NewComplaintForm";

interface SearchParams {
  rentalId?: string;
  category?: string;
}

export default async function NewComplaintPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const session = await auth();
  if (!session?.user?.clientId) {
    redirect("/account");
  }

  const sp = await searchParams;
  const t = await getTranslations("account.complaints");

  const rentals = await getRentals();
  const rentalOptions = (rentals || []).map((r: any) => ({
    id: r.id,
    contractNumber: r.contractNumber,
    label: `${r.contractNumber || `#${r.id}`} · ${r.car?.brand ?? ""} ${r.car?.model ?? ""}`.trim(),
  }));

  const initialRentalId = sp.rentalId ? Number(sp.rentalId) : undefined;
  const initialCategory =
    sp.category && ["DEPOSIT", "DAMAGE", "FINE", "SERVICE", "GDPR", "OTHER"].includes(sp.category)
      ? (sp.category as "DEPOSIT" | "DAMAGE" | "FINE" | "SERVICE" | "GDPR" | "OTHER")
      : undefined;

  return (
    <div className="account-page">
      <div className="acc-page-header">
        <div>
          <h1>{t("new.page_title")}</h1>
          <div className="acc-page-header__sub">{t("new.intro")}</div>
        </div>
      </div>

      <NewComplaintForm
        rentals={rentalOptions}
        initialRentalId={initialRentalId}
        initialCategory={initialCategory}
      />
    </div>
  );
}
