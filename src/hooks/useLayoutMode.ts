"use client";

import { useEffect, useState } from "react";

/** Layout mode for the bridge landing experience. */
export type LayoutMode = "desktop" | "mobile";

/**
 * Hysteresis band around the breakpoint so scrollbar show/hide and
 * tiny resizes don't flip mobile ↔ desktop in a loop.
 */
const ENTER_MOBILE_BELOW = 700;
const ENTER_DESKTOP_AT = 760;

function viewportWidth() {
  // Prefer layout viewport width (excludes scrollbar). Also clamp to
  // visualViewport when present — pinch-zoom / mobile chrome can differ.
  const layout =
    typeof document !== "undefined"
      ? document.documentElement.clientWidth
      : window.innerWidth;
  const visual = window.visualViewport?.width;
  return visual != null ? Math.min(layout, Math.round(visual)) : layout;
}

function pickMode(width: number, prev: LayoutMode | null): LayoutMode {
  if (prev === "mobile") {
    return width >= ENTER_DESKTOP_AT ? "desktop" : "mobile";
  }
  if (prev === "desktop") {
    return width < ENTER_MOBILE_BELOW ? "mobile" : "desktop";
  }
  return width < ENTER_MOBILE_BELOW ? "mobile" : "desktop";
}

/**
 * Stable mobile/desktop mode. Returns `null` until measured on the client
 * so we don't paint the wrong shell and then swap.
 */
export function useLayoutMode(): LayoutMode | null {
  const [mode, setMode] = useState<LayoutMode | null>(null);

  useEffect(() => {
    const update = () => {
      setMode((prev) => pickMode(viewportWidth(), prev));
    };
    update();
    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    return () => {
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
    };
  }, []);

  return mode;
}
