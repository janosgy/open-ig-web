export type DownloadKind =
  | "archive-torrent"
  | "public-torrent"
  | "archive-zip"
  | "windows"
  | "linux"
  | "mac";

export type LandingSectionId =
  | "home"
  | "download"
  | "media"
  | "features"
  | "requirements"
  | "community"
  | "credits";

export interface DownloadItem {
  /** Stable id (torrent/zip source, or legacy OS platform). */
  platform: DownloadKind | string;
  title: string;
  description: string;
  url: string;
  size?: string;
  checksumSha256?: string;
}

export interface FeatureItem {
  title: string;
  blurb: string;
}

export interface SiteLinks {
  github: string;
  wiki: string;
  issues: string;
  youtube: string;
  troubleshooting: string;
  credits: string;
  legal: string;
}

export interface MediaItem {
  src: string;
  alt: string;
  kind?: "image" | "video";
}

export interface LandingPageContent {
  language: string;
  headline: string;
  tagline: string;
  body: string[];
  version: string;
  releaseNotesUrl?: string;
  downloads: DownloadItem[];
  /** Screenshots / stills shown in Media */
  screenshots: MediaItem[];
  /** Optional extra video links (trailer lives in trailerUrl too) */
  videos?: { title: string; url: string }[];
  trailerUrl?: string;
  features: FeatureItem[];
  requirements: string[];
  links: SiteLinks;
  credits: string[];
}
