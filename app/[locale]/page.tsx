import { redirect } from "next/navigation";
import { hasLocale } from "@/lib/i18n/dictionaries";
import { notFound } from "next/navigation";

export default async function LocaleRoot({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  redirect(`/${locale}/onboarding/trip-context`);
}
