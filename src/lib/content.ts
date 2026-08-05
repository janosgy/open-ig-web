import { createClient, type SanityClient } from "next-sanity";
import type { LandingPageContent } from "./types";
import { fallbackContent } from "./fallbackContent";

export function getSanityEnv() {
  return {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-01",
    token: process.env.SANITY_API_READ_TOKEN,
  };
}

export function isSanityConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
}

export function getClient(): SanityClient | null {
  if (!isSanityConfigured()) return null;
  const env = getSanityEnv();
  return createClient({
    projectId: env.projectId,
    dataset: env.dataset,
    apiVersion: env.apiVersion,
    useCdn: true,
    token: env.token,
  });
}

const landingQuery = `*[_type == "landingPage" && language == $locale][0]{
  language,
  headline,
  tagline,
  "body": body[]{..., _type == "block" => {..., "children": children[]}},
  version,
  releaseNotesUrl,
  downloads[]{platform, title, description, url, size, checksumSha256},
  "screenshots": screenshots[]{"src": asset->url, alt},
  videos[]{title, url},
  trailerUrl,
  features[]{title, blurb},
  "requirements": requirements[],
  links,
  "credits": credits[]
}`;

function portableToStrings(body: unknown): string[] {
  if (!Array.isArray(body)) return [];
  return body
    .map((block) => {
      if (
        block &&
        typeof block === "object" &&
        "children" in block &&
        Array.isArray((block as { children: unknown }).children)
      ) {
        return (
          (block as { children: { text?: string }[] }).children
            .map((c) => c.text || "")
            .join("")
        );
      }
      return "";
    })
    .filter(Boolean);
}

function normalize(
  doc: Record<string, unknown> | null,
  locale: string,
): LandingPageContent {
  const base = fallbackContent[locale] || fallbackContent.en;
  if (!doc) return base;

  return {
    language: locale,
    headline: (doc.headline as string) || base.headline,
    tagline: (doc.tagline as string) || base.tagline,
    body: Array.isArray(doc.body)
      ? portableToStrings(doc.body).length
        ? portableToStrings(doc.body)
        : (doc.body as string[])
      : base.body,
    version: (doc.version as string) || base.version,
    releaseNotesUrl: (doc.releaseNotesUrl as string) || base.releaseNotesUrl,
    downloads:
      (doc.downloads as LandingPageContent["downloads"])?.length
        ? (doc.downloads as LandingPageContent["downloads"])
        : base.downloads,
    screenshots:
      (doc.screenshots as LandingPageContent["screenshots"])?.length
        ? (doc.screenshots as LandingPageContent["screenshots"])
        : base.screenshots,
    videos:
      (doc.videos as LandingPageContent["videos"])?.length
        ? (doc.videos as LandingPageContent["videos"])
        : base.videos,
    trailerUrl: (doc.trailerUrl as string) || base.trailerUrl,
    features:
      (doc.features as LandingPageContent["features"])?.length
        ? (doc.features as LandingPageContent["features"])
        : base.features,
    requirements:
      (doc.requirements as string[])?.length
        ? (doc.requirements as string[])
        : base.requirements,
    links: { ...base.links, ...(doc.links as object) },
    credits:
      (doc.credits as string[])?.length
        ? (doc.credits as string[])
        : base.credits,
  };
}

export async function getLandingContent(
  locale: string,
): Promise<LandingPageContent> {
  const client = getClient();
  if (!client) {
    return fallbackContent[locale] || fallbackContent.en;
  }
  try {
    const doc = await client.fetch<Record<string, unknown> | null>(
      landingQuery,
      { locale },
    );
    return normalize(doc, locale);
  } catch {
    return fallbackContent[locale] || fallbackContent.en;
  }
}
