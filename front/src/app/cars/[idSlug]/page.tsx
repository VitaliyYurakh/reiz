import type { Metadata } from "next";
import CarPage, {
  generateMetadata as generateLocalizedMetadata,
} from "@/app/[locale]/(site)/cars/[idSlug]/page";
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

export default async function CarPageDefault({
  params,
}: {
  params: Promise<{ idSlug: string }>;
}) {
  const { idSlug } = await params;
  return CarPage({
    params: Promise.resolve({ idSlug, locale: defaultLocale }),
  });
}
