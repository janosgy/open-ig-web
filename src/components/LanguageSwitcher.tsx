"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { locales, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

type Size = "sm" | "lg";

/**
 * Language control for the status bar.
 * On mobile, parent can force compact code and/or hide the chevron.
 */
export function LanguageSwitcher({
  size = "sm",
  forceCompact,
  showChevron = true,
}: {
  size?: Size;
  forceCompact?: boolean;
  showChevron?: boolean;
}) {
  const t = useTranslations("language");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [autoCompact, setAutoCompact] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const large = size === "lg";
  const compact = forceCompact ?? autoCompact;

  useLayoutEffect(() => {
    if (forceCompact !== undefined) return;
    const root = rootRef.current;
    const measure = measureRef.current;
    if (!root || !measure) return;

    const update = () => {
      const well = root.parentElement?.clientWidth ?? (large ? 120 : 160);
      const icon = showChevron ? (large ? 40 : 30) : 0;
      setAutoCompact(measure.offsetWidth > well - icon - 8);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(root.parentElement ?? root);
    return () => ro.disconnect();
  }, [locale, large, forceCompact, showChevron]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const label = compact ? locale.toUpperCase() : t(locale);
  const textCls = large
    ? "px-1.5 font-ig text-[13px] leading-none whitespace-nowrap text-[#ffcc00] hover:text-white"
    : "px-1 font-ig text-[8px] leading-none whitespace-nowrap text-[#ffcc00] hover:text-white";
  const btnH = large ? "h-full" : "h-5";
  const iconCls = large
    ? "pixelated block h-full w-auto shrink-0 object-fill"
    : "pixelated block h-5 w-[30px] shrink-0";

  return (
    <div ref={rootRef} className={`relative flex items-stretch ${btnH}`}>
      <span
        ref={measureRef}
        className={`pointer-events-none invisible absolute font-ig whitespace-nowrap ${large ? "text-[13px]" : "text-[8px]"}`}
        aria-hidden
      >
        {t(locale)}
      </span>

      <button
        type="button"
        className={`cursor-hand flex items-stretch border-0 bg-transparent p-0 ${btnH}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("label")}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={`flex items-center ${textCls}`}>{label}</span>
        {showChevron && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/assets/statusbar/menu.png"
            alt=""
            width={large ? 36 : 30}
            height={large ? 44 : 20}
            className={iconCls}
            style={large ? { width: 40, height: "100%" } : undefined}
            draggable={false}
          />
        )}
      </button>

      {open && (
        <ul
          role="listbox"
          className={`absolute left-0 z-50 m-0 list-none border border-[#808080] bg-[rgba(0,0,0,0.88)] py-1 ${large ? "top-full" : "top-5"}`}
          style={{ minWidth: large ? 140 : 120 }}
        >
          {locales.map((code) => (
            <li key={code} role="none">
              <button
                type="button"
                role="option"
                aria-selected={code === locale}
                className={`cursor-hand block w-full border-0 bg-transparent text-left font-ig ${
                  large ? "px-3 py-2 text-[13px]" : "px-2.5 py-0.5 text-[8px]"
                } ${
                  code === locale
                    ? "text-white"
                    : "text-[#ffcc00] hover:text-white"
                }`}
                onClick={() => {
                  setOpen(false);
                  if (code !== locale) {
                    router.replace(pathname, { locale: code });
                  }
                }}
              >
                {t(code)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
