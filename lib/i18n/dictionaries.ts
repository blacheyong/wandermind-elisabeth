import "server-only";

const dictionaries = {
  fr: () => import("./locales/fr").then((m) => m.default),
  en: () => import("./locales/en").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;

export const locales: Locale[] = ["fr", "en"];
export const defaultLocale: Locale = "fr";

export function hasLocale(value: string): value is Locale {
  return value in dictionaries;
}

export async function getDictionary(locale: Locale) {
  return dictionaries[locale]();
}
