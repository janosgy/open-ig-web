import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SectionContent } from "@/components/SectionContent";
import { getLandingContent } from "@/lib/content";
import { locales, type Locale } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const content = await getLandingContent(locale);
  const languages = Object.fromEntries(locales.map((l) => [l, `/${l}`]));

  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    ),
    title: content.headline || t("title"),
    description: content.tagline || t("description"),
    alternates: {
      languages: {
        ...languages,
        "x-default": "/en",
      },
    },
    openGraph: {
      title: content.headline,
      description: content.tagline,
      locale,
      images: [{ url: "/assets/bridge/bridge_level_3.png" }],
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = await getLandingContent(locale as Locale);

  return (
    <>
      <SectionContent id="home" content={content} />
      <article className="sr-only">
        <h1>{content.headline}</h1>
        <p>{content.tagline}</p>
        {content.body.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
        <nav>
          <a href={content.links.github}>GitHub</a>
          <a href={content.links.wiki}>Wiki</a>
          <a href={content.links.issues}>Issues</a>
        </nav>
      </article>
    </>
  );
}
