import type { LandingSectionId } from "@/lib/types";

export const SECTION_IDS: LandingSectionId[] = [
  "home",
  "download",
  "media",
  "features",
  "requirements",
  "community",
  "credits",
];

/** URL path for a section (locale prefix added by next-intl Link/router). */
export function sectionHref(id: LandingSectionId): string {
  return id === "home" ? "/" : `/${id}`;
}

/** Resolve active section from a next-intl pathname (no locale prefix). */
export function sectionFromPathname(pathname: string): LandingSectionId {
  const raw = pathname.replace(/\/$/, "") || "/";
  const seg = raw === "/" ? "home" : raw.replace(/^\//, "").split("/")[0];
  return SECTION_IDS.includes(seg as LandingSectionId)
    ? (seg as LandingSectionId)
    : "home";
}

export function isSectionId(value: string): value is LandingSectionId {
  return SECTION_IDS.includes(value as LandingSectionId);
}
