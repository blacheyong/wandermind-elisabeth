import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n/dictionaries";
import { TripDraftProvider } from "@/lib/contexts/trip-draft-context";
import FirstVisitFlow from "@/components/first-visit/first-visit-flow";

export default async function LocaleRoot({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(locale)) notFound();
  const dictionary = await getDictionary(locale);

  return (
    <TripDraftProvider>
      <FirstVisitFlow locale={locale} lang={dictionary.lang} />
    </TripDraftProvider>
  );
}
