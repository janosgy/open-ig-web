import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Press_Start_2P } from "next/font/google";
import { routing } from "@/i18n/routing";
import "../../app/globals.css";

/** Closest widely available match to Imperium Galactica’s bitmap UI font. */
const igFont = Press_Start_2P({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-ig-face",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`h-full max-w-full overflow-hidden ${igFont.variable}`}>
      <body
        className={`${igFont.className} h-full max-w-full overflow-hidden bg-black text-white antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
