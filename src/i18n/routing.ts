import { defineRouting } from "next-intl/routing";

export const locales = ["en", "hu", "de", "fr", "es", "ru"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: "always",
  localeDetection: true,
});
