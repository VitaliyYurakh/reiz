import type { Metadata } from "next";
import CarPage, {
  generateMetadata as generateLocalizedMetadata,
} from "@/app/[locale]/(site)/cars/[idSlug]/page";
import { defaultLocale } from "@/i18n/request";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ idSlug: string }>;
  searchParams: Promise<{ city?: string }>;
}): Promise<Metadata> {
  const { idSlug } = await params;
  return generateLocalizedMetadata({
    params: Promise.resolve({ idSlug, locale: defaultLocale }),
    searchParams,
  });
}

export default async function CarPageDefault({
  params,
  searchParams,
}: {
  params: Promise<{ idSlug: string }>;
  searchParams: Promise<{ city?: string }>;
}) {
  const { idSlug } = await params;
  return CarPage({
    params: Promise.resolve({ idSlug, locale: defaultLocale }),
    searchParams,
  });
}
