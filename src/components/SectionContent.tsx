"use client";

import type { LandingPageContent, LandingSectionId } from "@/lib/types";
import { useLayoutMode } from "@/hooks/useLayoutMode";

/** Section body copy — larger type on mobile. */
export function SectionContent({
  id,
  content,
}: {
  id: LandingSectionId;
  content: LandingPageContent;
}) {
  const mode = useLayoutMode();
  const mobile = mode === "mobile"; // null (SSR/first paint) → desktop sizes
  const h1 = mobile ? "text-[18px]" : "text-[11px]";
  const h2 = mobile ? "text-[16px]" : "text-[10px]";
  const body = mobile ? "text-[14px] leading-relaxed" : "text-[8px] leading-relaxed";
  const sub = mobile ? "text-[13px]" : "text-[8px]";
  const tiny = mobile ? "text-[12px]" : "text-[7px]";
  const gap = mobile ? "mb-2" : "mb-1";

  switch (id) {
    case "home":
      return (
        <>
          <h1 className={`font-ig ${gap} ${h1} text-[#ffff00]`}>
            {content.headline}
          </h1>
          <p className={`${gap} ${sub} text-[#6cb068]`}>{content.tagline}</p>
          {content.body.map((p) => (
            <p key={p.slice(0, 24)} className={`${gap} ${body}`}>
              {p}
            </p>
          ))}
          <p className={`mt-2 flex flex-wrap gap-3 ${sub}`}>
            <a className="cursor-hand text-[#40c0e0] underline" href={content.links.wiki}>
              Learn
            </a>
            <a className="cursor-hand text-[#40c0e0] underline" href={content.links.issues}>
              Community
            </a>
            {content.trailerUrl && (
              <a
                className="cursor-hand text-[#40c0e0] underline"
                href={content.trailerUrl}
              >
                Watch
              </a>
            )}
          </p>
        </>
      );
    case "download":
      return (
        <>
          <h2 className={`font-ig ${gap} ${h2} text-[#ffff00]`}>
            Download {content.version}
          </h2>
          {content.releaseNotesUrl && (
            <p className={`${gap} ${sub}`}>
              <a
                className="cursor-hand text-[#40c0e0] underline"
                href={content.releaseNotesUrl}
              >
                Release notes
              </a>
            </p>
          )}
          <ul className={`m-0 list-none p-0 ${mobile ? "space-y-2" : "space-y-1"}`}>
            {content.downloads.map((d) => (
              <li key={d.platform}>
                <a
                  className={`cursor-hand ${sub} text-[#fc2828] no-underline hover:underline`}
                  href={d.url}
                >
                  {d.title}
                </a>
                <div className={`${tiny} text-[#6cb068]`}>
                  {d.description}
                </div>
              </li>
            ))}
          </ul>
        </>
      );
    case "media": {
      const trailerUrl = content.trailerUrl || content.videos?.[0]?.url;
      const trailerTitle = content.videos?.[0]?.title ?? "Gameplay trailer";
      const embedSrc = trailerUrl ? youtubeEmbedSrc(trailerUrl) : null;
      return (
        <>
          <h2 className={`font-ig ${gap} ${h2} text-[#ffff00]`}>Media</h2>
          {embedSrc ? (
            <div className="w-full min-w-0">
              <div
                className={`mb-1 ${tiny} uppercase tracking-wide text-[#6cb0c0]`}
              >
                {trailerTitle}
              </div>
              <div className="relative aspect-video w-full overflow-hidden border border-[#2a4a5a] bg-black">
                <iframe
                  src={embedSrc}
                  title={trailerTitle}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
            </div>
          ) : null}
        </>
      );
    }
    case "features":
      return (
        <>
          <h2 className={`font-ig ${gap} ${h2} text-[#ffff00]`}>Features</h2>
          <ul className={`m-0 list-none p-0 ${mobile ? "space-y-3" : "space-y-1"}`}>
            {content.features.map((f) => (
              <li key={f.title}>
                <div className={`${sub} text-[#fc2828]`}>{f.title}</div>
                <div className={`${tiny} text-[#6cb068]`}>{f.blurb}</div>
              </li>
            ))}
          </ul>
        </>
      );
    case "requirements":
      return (
        <>
          <h2 className={`font-ig ${gap} ${h2} text-[#ffff00]`}>Requirements</h2>
          <ul className={`m-0 list-disc space-y-1 pl-4 ${body}`}>
            {content.requirements.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
        </>
      );
    case "community":
      return (
        <>
          <h2 className={`font-ig ${gap} ${h2} text-[#ffff00]`}>Community</h2>
          <ul className={`m-0 list-none space-y-2 p-0 ${sub}`}>
            <Li href={content.links.github} label="GitHub repository" />
            <Li href={content.links.issues} label="Issues & ideas" />
            <Li href={content.links.wiki} label="Wiki" />
            <Li href={content.links.troubleshooting} label="Troubleshooting" />
            <Li href={content.links.youtube} label="YouTube" />
          </ul>
        </>
      );
    case "credits":
      return (
        <>
          <h2 className={`font-ig ${gap} ${h2} text-[#ffff00]`}>Credits</h2>
          {content.credits.map((p) => (
            <p key={p.slice(0, 32)} className={`${gap} ${body}`}>
              {p}
            </p>
          ))}
          <p className={`mt-2 flex flex-wrap gap-3 ${sub}`}>
            <a
              className="cursor-hand text-[#40c0e0] underline"
              href={content.links.credits}
            >
              Credits wiki
            </a>
            <a
              className="cursor-hand text-[#40c0e0] underline"
              href={content.links.legal}
            >
              Legal FAQ
            </a>
          </p>
        </>
      );
  }
}

function Li({ href, label }: { href: string; label: string }) {
  return (
    <li>
      <a className="cursor-hand text-[#40c0e0] underline" href={href}>
        {label}
      </a>
    </li>
  );
}

/** Convert a YouTube watch/share URL into an embeddable `/embed/` src. */
function youtubeEmbedSrc(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname === "youtu.be") {
      const id = u.pathname.split("/").filter(Boolean)[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (u.hostname.replace(/^www\./, "") === "youtube.com") {
      if (u.pathname.startsWith("/embed/")) return url;
      const id = u.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
  } catch {
    /* ignore */
  }
  return null;
}
