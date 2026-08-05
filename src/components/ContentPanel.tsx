"use client";

import type { ReactNode } from "react";
import { VIEWSCREEN } from "@/lib/coords";
import type { LayoutMode } from "@/hooks/useLayoutMode";

/** Framed viewscreen / content box that hosts routed section pages. */
export function ContentPanel({
  mode = "desktop",
  sectionTitle,
  faded = false,
  children,
}: {
  mode?: LayoutMode;
  sectionTitle: string;
  faded?: boolean;
  children: ReactNode;
}) {
  const fluid = mode === "mobile";

  return (
    <section
      className={
        fluid
          ? "relative z-10 mx-3 mb-3 flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden border border-[#2a6a7a]/80 bg-[rgba(4,12,20,0.88)] text-[#c8e8d0] transition-opacity duration-300"
          : "absolute z-10 flex flex-col overflow-hidden border border-[#2a6a7a]/80 bg-[rgba(4,12,20,0.88)] text-[#c8e8d0] transition-opacity duration-300"
      }
      style={
        fluid
          ? undefined
          : {
              left: VIEWSCREEN.x,
              top: VIEWSCREEN.y,
              width: VIEWSCREEN.w,
              height: VIEWSCREEN.h,
              opacity: faded ? 0 : 1,
              pointerEvents: faded ? "none" : "auto",
            }
      }
      aria-hidden={faded || undefined}
      aria-label="Open Imperium Galactica"
    >
      <div className="flex shrink-0 items-center border-b border-[#2a6a7a]/60 px-2 py-1">
        <span
          className={`font-ig uppercase tracking-wide text-[#ffff00] ${fluid ? "text-[12px]" : "text-[8px]"}`}
        >
          {sectionTitle}
        </span>
      </div>

      <div
        className={`min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain break-words ${fluid ? "px-3 py-3" : "px-2.5 py-1.5"}`}
      >
        {children}
      </div>
    </section>
  );
}
