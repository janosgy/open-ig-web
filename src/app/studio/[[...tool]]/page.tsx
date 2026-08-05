"use client";

/**
 * Sanity Studio — requires NEXT_PUBLIC_SANITY_PROJECT_ID.
 * Visit /studio after configuring .env.local from .env.example.
 */
import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
