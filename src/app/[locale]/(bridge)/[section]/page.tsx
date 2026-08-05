import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { SectionContent } from "@/components/SectionContent";
import { getLandingContent } from "@/lib/content";
import { isSectionId, SECTION_IDS, sectionHref } from "@/lib/sections";
import { locales, type Locale } from "@/i18n/routing";
import type { LandingSectionId } from "@/lib/types";

export function generateStaticParams() {
  return SECTION_IDS.filter((id) => id !== "home").map((section) => ({
    section,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}): Promise<Metadata> {
  const { locale, section } = await params;
  if (!isSectionId(section) || section === "home") {
    return {};
  }
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const tSec = await getTranslations({ locale, namespace: "sections" });
  const content = await getLandingContent(locale);
  const title = `${tSec(section)} · ${content.headline || tMeta("title")}`;
  const languages = Object.fromEntries(
    locales.map((l) => [l, `/${l}${sectionHref(section)}`]),
  );

  return {
    title,
    description: content.tagline || tMeta("description"),
    alternates: {
      languages: {
        ...languages,
        "x-default": `/en${sectionHref(section)}`,
      },
    },
  };
}

export default async function SectionPage({
  params,
}: {
  params: Promise<{ locale: string; section: string }>;
}) {
  const { locale, section } = await params;
  if (!isSectionId(section) || section === "home") {
    notFound();
  }
  setRequestLocale(locale);
  const content = await getLandingContent(locale as Locale);
  const id = section as LandingSectionId;

  return <SectionContent id={id} content={content} />;
}
