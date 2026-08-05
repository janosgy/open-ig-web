"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTranslations } from "next-intl";
import type { LandingPageContent } from "@/lib/types";
import { STAGE_HEIGHT, STAGE_WIDTH } from "@/lib/coords";
import { sectionFromPathname } from "@/lib/sections";
import { useLayoutMode } from "@/hooks/useLayoutMode";
import { usePathname } from "@/i18n/navigation";
import { StatusBar } from "./StatusBar";
import { Communicator } from "./Communicator";
import { ContentPanel } from "./ContentPanel";

/**
 * Persistent bridge chrome (status bar, content frame, communicator).
 * Section pages render as `{children}` inside the content panel.
 */
export function BridgeShell({
  content,
  children,
}: {
  content: LandingPageContent;
  children: ReactNode;
}) {
  const mode = useLayoutMode();
  const pathname = usePathname();
  const t = useTranslations("sections");
  const active = sectionFromPathname(pathname);
  const sectionTitle = t(active);

  // Wait for a real measurement so we don't flash the wrong shell.
  if (mode === null) {
    return <div className="h-dvh w-full bg-black" aria-hidden />;
  }

  if (mode === "mobile") {
    return (
      <div className="flex h-dvh w-full max-w-full flex-col overflow-hidden overscroll-none bg-black">
        <StatusBar mode="mobile" active={active} />
        <div
          className="relative flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
          style={{
            backgroundImage: "url(/assets/bridge/bridge_level_3.png)",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center center",
            imageRendering: "pixelated",
          }}
        >
          <div className="pointer-events-none absolute inset-0 bg-black/25" />
          <div className="relative z-[1] flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden pt-3">
            <ContentPanel mode="mobile" sectionTitle={sectionTitle}>
              {children}
            </ContentPanel>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DesktopShell
      content={content}
      activeTitle={sectionTitle}
      active={active}
    >
      {children}
    </DesktopShell>
  );
}

function DesktopShell({
  content,
  active,
  activeTitle,
  children,
}: {
  content: LandingPageContent;
  active: ReturnType<typeof sectionFromPathname>;
  activeTitle: string;
  children: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [communicatorOpen, setCommunicatorOpen] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => {
      const { clientWidth, clientHeight } = el;
      setScale(
        Math.min(clientWidth / STAGE_WIDTH, clientHeight / STAGE_HEIGHT),
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className="flex h-dvh w-full items-center justify-center overflow-hidden bg-black"
    >
      <div
        className="relative shrink-0 origin-center"
        style={{
          width: STAGE_WIDTH,
          height: STAGE_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/bridge/bridge_level_3.png"
          alt=""
          width={STAGE_WIDTH}
          height={STAGE_HEIGHT}
          className="pixelated pointer-events-none absolute inset-0 h-full w-full object-cover object-center"
          draggable={false}
        />

        <StatusBar mode="desktop" active={active} />
        <ContentPanel
          mode="desktop"
          sectionTitle={activeTitle}
          faded={communicatorOpen}
        >
          {children}
        </ContentPanel>
        <Communicator
          downloads={content.downloads}
          onOpenChange={setCommunicatorOpen}
        />
      </div>
    </div>
  );
}
