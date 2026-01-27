import type { Metadata } from "next";
import CarRentPage, {
  generateMetadata as generateLocalizedMetadata,
} from "@/app/[locale]/(site)/cars/[idSlug]/rent/page";
import { defaultLocale } from "@/i18n/request";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ idSlug: string }>;
}): Promise<Metadata> {
  const { idSlug } = await params;
  return generateLocalizedMetadata({
    params: Promise.resolve({ idSlug, locale: defaultLocale }),
  });
}

export default async function CarRentPageDefault({
  params,
  searchParams,
}: {
  params: Promise<{ idSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { idSlug } = await params;
  const query = await searchParams;
  return CarRentPage({
    params: Promise.resolve({ idSlug, locale: defaultLocale }),
    searchParams: Promise.resolve(query),
  });
}
