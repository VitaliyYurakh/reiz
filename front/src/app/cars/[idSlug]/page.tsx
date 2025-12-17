import { redirect } from "next/navigation";

export default async function CarPageRedirect({
  params,
}: {
  params: Promise<{ idSlug: string }>;
}) {
  const { idSlug } = await params;
  redirect(`/ru/cars/${idSlug}`);
}
