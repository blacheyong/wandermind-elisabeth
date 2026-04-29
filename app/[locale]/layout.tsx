import { notFound } from "next/navigation";
import { hasLocale, locales } from "@/lib/i18n/dictionaries";
import AppShell from "@/components/layout/AppShell";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();

  return <AppShell>{children}</AppShell>;
}
