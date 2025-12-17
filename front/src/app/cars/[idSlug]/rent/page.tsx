import { redirect } from "next/navigation";

export default async function CarRentPageRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ idSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { idSlug } = await params;
  const query = await searchParams;
  const queryString = new URLSearchParams(
    Object.entries(query).reduce((acc, [key, value]) => {
      if (typeof value === "string") acc[key] = value;
      return acc;
    }, {} as Record<string, string>)
  ).toString();
  redirect(`/ru/cars/${idSlug}/rent${queryString ? `?${queryString}` : ""}`);
}
