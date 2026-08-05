import type { LandingPageContent } from "./types";

/** Preferred download links from the project README (preserve GitHub bandwidth). */
const ARCHIVE_TORRENT =
  "https://archive.org/download/open-ig-0.95.-x/open-ig-0.95.-x_archive.torrent";
const PUBLIC_TORRENT =
  "https://github.com/akarnokd/open-ig/raw/master/Open-IG-0.95.X.torrent";
const ARCHIVE_ZIP =
  "https://archive.org/download/open-ig-0.95.-x/Open-IG-0.95.X.zip";

const FILE_LINE = "Open-IG-0.95.X.zip: 1.21 GB";
const ZIP_SHA256 =
  "e2154b8d5bbcceb8d2f250ef6bc4bf309d77ddd069dc6d4d2a23a5aa921746b8";

const LAUNCHER =
  "https://github.com/akarnokd/open-ig/raw/master/open-ig-launcher.jar";

const sharedLinks = {
  github: "https://github.com/akarnokd/open-ig",
  wiki: "https://github.com/akarnokd/open-ig/wiki",
  issues: "https://github.com/akarnokd/open-ig/issues",
  youtube: "https://www.youtube.com/watch?v=FnlIEwW2OkM",
  troubleshooting: "https://github.com/akarnokd/open-ig/wiki/Troubleshooting",
  credits: "https://github.com/akarnokd/open-ig/wiki/Credits",
  legal: "https://github.com/akarnokd/open-ig/wiki/Legal-FAQ",
} as const;

/** Seed / offline fallback content per locale until Sanity is connected. */
export const fallbackContent: Record<string, LandingPageContent> = {
  en: {
    language: "en",
    headline: "Open Imperium Galactica",
    tagline: "Command your empire from the bridge.",
    body: [
      "Open-IG is a free & open-source reimplementation of Digital Reality’s Imperium Galactica — a classic 4X real-time space strategy game from 1996.",
      "It aims to reproduce the feel of the original while fixing bugs and adding features. No original game files are required.",
    ],
    version: "0.95.X",
    releaseNotesUrl: "https://github.com/akarnokd/open-ig/releases",
    downloads: [
      {
        platform: "archive-torrent",
        title: "Archive.org Torrent",
        description: FILE_LINE,
        url: ARCHIVE_TORRENT,
        size: "1.21 GB",
        checksumSha256: ZIP_SHA256,
      },
      {
        platform: "public-torrent",
        title: "Public Torrent",
        description: FILE_LINE,
        url: PUBLIC_TORRENT,
        size: "1.21 GB",
        checksumSha256: ZIP_SHA256,
      },
      {
        platform: "archive-zip",
        title: "Archive.org Zip",
        description: FILE_LINE,
        url: ARCHIVE_ZIP,
        size: "1.21 GB",
        checksumSha256: ZIP_SHA256,
      },
    ],
    screenshots: [
      {
        src: "/assets/bridge/bridge_level_3.png",
        alt: "Bridge screen from Open Imperium Galactica",
      },
    ],
    videos: [
      {
        title: "Gameplay trailer",
        url: "https://www.youtube.com/watch?v=FnlIEwW2OkM",
      },
    ],
    trailerUrl: "https://www.youtube.com/watch?v=FnlIEwW2OkM",
    features: [
      {
        title: "Full campaign",
        blurb: "Play through the main story with scripting, missions, and videos.",
      },
      {
        title: "Skirmish",
        blurb: "Custom battles and sandbox setups.",
      },
      {
        title: "Standalone",
        blurb: "All assets included — no need for the original Imperium Galactica.",
      },
      {
        title: "Cross-platform",
        blurb: "Runs on Windows, Linux, and macOS with a graphical desktop.",
      },
    ],
    requirements: [
      "Java 11 or newer (x64 recommended)",
      "Any OS with a graphical desktop",
      "≈3 GB RAM recommended (832 MB minimum)",
      "≈1.4 GB disk space",
      "Mouse with scroll wheel",
    ],
    links: { ...sharedLinks },
    credits: [
      "Open-IG by David Karnok & contributors.",
      "Based on Imperium Galactica by Digital Reality.",
      "See the Credits and Legal FAQ wiki pages for details.",
    ],
  },
};

// Reuse English seed for other locales until translated in Sanity
for (const locale of ["hu", "de", "fr", "es", "ru"]) {
  fallbackContent[locale] = {
    ...fallbackContent.en,
    language: locale,
  };
}

/** Temporary launcher link kept for editors; not shown in communicator list. */
export const legacyLauncherUrl = LAUNCHER;
