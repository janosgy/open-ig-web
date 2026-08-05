"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { LandingSectionId } from "@/lib/types";
import { SECTION_IDS, sectionHref } from "@/lib/sections";
import type { LayoutMode } from "@/hooks/useLayoutMode";
import { Link } from "@/i18n/navigation";

type Size = "sm" | "lg";

/**
 * Screen menu: trigger shows active section name + dropdown icon.
 * Navigates via Link so section content is routed.
 */
export function ScreenMenu({
  active,
  mode,
  size = "sm",
  showLabel = true,
  /** Fixed width for the label slot (longest section title). */
  labelWidth,
}: {
  active: LandingSectionId;
  mode: LayoutMode;
  size?: Size;
  /** When false, only the dropdown icon is shown. */
  showLabel?: boolean;
  labelWidth?: number;
}) {
  const t = useTranslations("sections");
  const [open, setOpen] = useState(mode === "desktop");
  const rootRef = useRef<HTMLDivElement>(null);
  const large = size === "lg";

  useEffect(() => {
    setOpen(mode === "desktop");
  }, [mode]);

  useEffect(() => {
    if (!open || mode === "desktop") return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, mode]);

  const btnH = large ? "h-full" : "h-5";
  const textCls = large
    ? "truncate px-1.5 font-ig text-[13px] leading-none whitespace-nowrap text-[#ffcc00] hover:text-white"
    : "max-w-[100px] truncate px-1 font-ig text-[8px] leading-none whitespace-nowrap text-[#ffcc00] hover:text-white";
  const iconCls = large
    ? "pixelated block h-full w-auto shrink-0 object-fill"
    : "pixelated block h-5 w-[30px] shrink-0";

  return (
    <div ref={rootRef} className={`relative flex items-stretch ${btnH}`}>
      <button
        type="button"
        className={`cursor-hand flex max-w-full items-stretch border-0 bg-transparent p-0 ${btnH}`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t(active)}
        onClick={() => setOpen((v) => !v)}
      >
        {showLabel && (
          <span
            className={`flex items-center ${textCls}`}
            style={
              labelWidth
                ? { width: labelWidth, maxWidth: labelWidth }
                : large
                  ? { maxWidth: "7rem" }
                  : undefined
            }
          >
            {t(active)}
          </span>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/statusbar/menu.png"
          alt=""
          width={large ? 36 : 30}
          height={large ? 44 : 20}
          className={iconCls}
          style={large ? { width: MOBILE_ICON_W, height: "100%" } : undefined}
          draggable={false}
        />
      </button>
      {open && (
        <ul
          role="menu"
          className={`absolute right-0 z-50 m-0 list-none border border-[#808080] bg-[rgba(0,0,0,0.88)] py-1 ${large ? "top-full" : "top-5"}`}
          style={{ minWidth: large ? 160 : 130 }}
        >
          {SECTION_IDS.map((id) => (
            <li key={id} role="none">
              <Link
                role="menuitem"
                href={sectionHref(id)}
                className={`cursor-hand block w-full border-0 bg-transparent text-left font-ig no-underline ${
                  large ? "px-3 py-2.5 text-[13px]" : "px-2 py-0.5 text-[8px]"
                } ${
                  active === id
                    ? "text-white"
                    : "text-[#ffcc00] hover:text-white"
                }`}
                onClick={() => {
                  if (mode === "mobile") setOpen(false);
                }}
              >
                {t(id)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const MOBILE_ICON_W = 40;
