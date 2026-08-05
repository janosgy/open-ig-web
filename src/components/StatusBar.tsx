"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ScreenMenu } from "./ScreenMenu";
import { daysSinceRelease } from "@/lib/daysSinceRelease";
import { SECTION_IDS } from "@/lib/sections";
import type { LayoutMode } from "@/hooks/useLayoutMode";
import type { LandingSectionId } from "@/lib/types";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/**
 * Exact StatusbarScreen.top label wells (640-wide bar, 20px tall).
 * @see hu.openig.screen.items.StatusbarScreen
 */
const SLOTS = {
  pause: { x: 1, y: 2 },
  speed1: { x: 16, y: 2 },
  speed2: { x: 31, y: 2 },
  speed4: { x: 46, y: 2 },
  money: { x: 75, y: 3, w: 82, h: 14 },
  year: { x: 171, y: 3, w: 34, h: 14 },
  month: { x: 211, y: 3, w: 82, h: 14 },
  day: { x: 299, y: 3, w: 18, h: 14 },
  time: { x: 331, y: 3, w: 42, h: 14 },
  lang: { x: 380, y: 0, w: 130, h: 20 },
} as const;

const BAR_WIDTH = 640;
const BAR_HEIGHT = 20;
const LEFT_ART_WIDTH = 376;
const MOBILE_BAR_HEIGHT = 44;

/**
 * In-game status bar on desktop; taller touch-friendly bar on mobile
 * that only keeps optional slots that fit.
 */
export function StatusBar({
  mode = "desktop",
  active,
}: {
  mode?: LayoutMode;
  active: LandingSectionId;
}) {
  const locale = useLocale();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
  const day = String(now.getDate());
  const month = now.toLocaleString(locale, { month: "long" });
  const year = String(now.getFullYear());
  const money = String(daysSinceRelease(now));

  if (mode === "mobile") {
    return (
      <MobileStatusBar
        active={active}
        money={money}
        year={year}
        month={month}
        day={day}
        time={time}
      />
    );
  }

  return (
    <DesktopStatusBar
      active={active}
      money={money}
      year={year}
      month={month}
      day={day}
      time={time}
    />
  );
}

function DesktopStatusBar({
  active,
  money,
  year,
  month,
  day,
  time,
}: {
  active: LandingSectionId;
  money: string;
  year: string;
  month: string;
  day: string;
  time: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / BAR_WIDTH));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      data-statusbar
      className="absolute top-0 left-0 z-30 w-full shrink-0 overflow-visible select-none"
      style={{ height: BAR_HEIGHT * scale }}
    >
      <div
        className="relative origin-top-left"
        style={{
          width: BAR_WIDTH,
          height: BAR_HEIGHT,
          transform: `scale(${scale})`,
          backgroundImage:
            "url(/assets/statusbar/statusbar_ingame_top_left_trim.png), url(/assets/statusbar/statusbar_ingame_top_fill.png), url(/assets/statusbar/statusbar_ingame_top_right.png)",
          backgroundRepeat: "no-repeat, repeat-x, no-repeat",
          backgroundPosition: `left top, ${LEFT_ART_WIDTH}px top, right top`,
          backgroundSize: `${LEFT_ART_WIDTH}px 20px, 1px 20px, 30px 20px`,
        }}
      >
        <SpeedButton
          src="/assets/statusbar/button_pause.png"
          label="Pause"
          style={{ left: SLOTS.pause.x, top: SLOTS.pause.y }}
        />
        <SpeedButton
          src="/assets/statusbar/button_speed_1.png"
          label="1x"
          selected
          style={{ left: SLOTS.speed1.x, top: SLOTS.speed1.y }}
        />
        <SpeedButton
          src="/assets/statusbar/button_speed_2.png"
          label="2x"
          style={{ left: SLOTS.speed2.x, top: SLOTS.speed2.y }}
        />
        <SpeedButton
          src="/assets/statusbar/button_speed_4.png"
          label="4x"
          style={{ left: SLOTS.speed4.x, top: SLOTS.speed4.y }}
        />

        <Slot {...SLOTS.money}>{money}</Slot>
        <Slot {...SLOTS.year}>{year}</Slot>
        <Slot {...SLOTS.month}>{month}</Slot>
        <Slot {...SLOTS.day}>{day}</Slot>
        <Slot {...SLOTS.time}>{time}</Slot>

        <div
          className="absolute z-[1] flex h-5 items-center"
          style={{
            left: SLOTS.lang.x,
            top: SLOTS.lang.y,
            width: SLOTS.lang.w,
            height: SLOTS.lang.h,
          }}
        >
          <LanguageSwitcher size="sm" />
        </div>

        <div className="absolute top-0 right-0 z-40 flex h-5 max-w-[140px] items-center">
          <ScreenMenu active={active} mode="desktop" size="sm" />
        </div>
      </div>
    </div>
  );
}

type MobileFit = {
  showTime: boolean;
  showMonth: boolean;
  showYear: boolean;
  showMoney: boolean;
  menuLabelWidth: number;
};

/**
 * Mobile bar: language always compact (EN), menu label width = longest
 * section title. Optional slots (time → month → year → money) only if they
 * fit alongside that fixed menu width.
 */
function MobileStatusBar({
  active,
  money,
  year,
  month,
  day,
  time,
}: {
  active: LandingSectionId;
  money: string;
  year: string;
  month: string;
  day: string;
  time: string;
}) {
  const locale = useLocale();
  const tSections = useTranslations("sections");
  const barRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [fit, setFit] = useState<MobileFit>({
    showTime: false,
    showMonth: false,
    showYear: false,
    showMoney: false,
    menuLabelWidth: 80,
  });

  useLayoutEffect(() => {
    const bar = barRef.current;
    const measure = measureRef.current;
    if (!bar || !measure) return;

    const update = () => {
      const avail = bar.clientWidth;
      const probes = measure.querySelectorAll<HTMLElement>("[data-probe]");
      const widthOf = (id: string, fallback: number) => {
        const el = [...probes].find((p) => p.dataset.probe === id);
        const w = el ? Math.ceil(el.getBoundingClientRect().width) : 0;
        return Math.max(w, fallback);
      };

      const speeds = widthOf("speeds", 80);
      const sep = widthOf("sep", 4);
      const timeW = widthOf("time", 56);
      const monthW = widthOf("month", 110);
      const yearW = widthOf("year", 48);
      const moneyW = widthOf("money", 64);
      const langCode = widthOf("lang-code", 36);
      const menuIcon = widthOf("menu-icon", 40);
      let menuLabelOnly = 0;
      for (const id of SECTION_IDS) {
        menuLabelOnly = Math.max(
          menuLabelOnly,
          widthOf(`menu-label-${id}`, 40),
        );
      }
      menuLabelOnly = Math.max(menuLabelOnly, 40);
      const slack = 8;

      // Mandatory chrome first; cap label so the bar never exceeds the viewport
      // (a fixed "longest title" wider than the phone was causing sideways scroll).
      const mandatory =
        speeds + sep + langCode + sep + menuIcon + slack;
      const menuLabelWidth = Math.min(
        menuLabelOnly,
        Math.max(24, avail - mandatory),
      );
      const menuW = menuLabelWidth + menuIcon;
      let used = speeds + sep + langCode + sep + menuW + slack;

      const tryAdd = (w: number) => {
        if (used + sep + w <= avail) {
          used += sep + w;
          return true;
        }
        return false;
      };

      // Cascading keep: time → month → year → money (only if earlier fit).
      const showTime = tryAdd(timeW);
      const showMonth = showTime && tryAdd(monthW);
      const showYear = showMonth && tryAdd(yearW);
      const showMoney = showYear && tryAdd(moneyW);

      setFit({
        showTime,
        showMonth,
        showYear,
        showMoney,
        menuLabelWidth,
      });
    };

    update();
    const t = window.setTimeout(update, 100);
    const ro = new ResizeObserver(update);
    ro.observe(bar);
    return () => {
      ro.disconnect();
      window.clearTimeout(t);
    };
  }, [money, year, month, day, time, locale, tSections]);

  return (
    <div
      ref={barRef}
      data-statusbar
      className="relative z-30 flex w-full max-w-full shrink-0 items-stretch overflow-hidden select-none"
      style={{
        height: MOBILE_BAR_HEIGHT,
        backgroundImage: "url(/assets/statusbar/statusbar_ingame_top_fill.png)",
        backgroundRepeat: "repeat-x",
        backgroundSize: "1px 100%",
        borderTop: "1px solid #5a9aaa",
        borderBottom: "1px solid #5a9aaa",
      }}
    >
      <div
        ref={measureRef}
        className="pointer-events-none invisible absolute top-0 left-0 flex h-9 items-center whitespace-nowrap"
        aria-hidden
      >
        <span data-probe="speeds" className="flex h-9 items-stretch">
          <MobileSpeedButton
            src="/assets/statusbar/button_pause.png"
            label="Pause"
          />
          <MobileSpeedButton
            src="/assets/statusbar/button_speed_1.png"
            label="1x"
            selected
          />
        </span>
        <span data-probe="sep">
          <MobileSep />
        </span>
        <span data-probe="time" className="px-1.5 font-ig text-[13px]">
          {time}
        </span>
        <span data-probe="month" className="px-1.5 font-ig text-[13px]">
          {month} {day}
        </span>
        <span data-probe="year" className="px-1.5 font-ig text-[13px]">
          {year}
        </span>
        <span data-probe="money" className="px-1.5 font-ig text-[13px]">
          {money}
        </span>
        <span data-probe="lang-code" className="px-1.5 font-ig text-[13px]">
          {locale.toUpperCase()}
        </span>
        <span data-probe="menu-icon" className="flex items-stretch">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/statusbar/menu.png"
            alt=""
            className="h-full"
            style={{ width: 40, height: 44 }}
          />
        </span>
        {SECTION_IDS.map((id) => (
          <span
            key={id}
            data-probe={`menu-label-${id}`}
            className="px-1.5 font-ig text-[13px]"
          >
            {tSections(id)}
          </span>
        ))}
      </div>

      <div className="flex h-full shrink-0 items-stretch pl-0.5">
        <MobileSpeedButton
          src="/assets/statusbar/button_pause.png"
          label="Pause"
        />
        <MobileSpeedButton
          src="/assets/statusbar/button_speed_1.png"
          label="1x"
          selected
        />
      </div>

      {fit.showMoney && (
        <>
          <MobileSep />
          <MobileField>{money}</MobileField>
        </>
      )}
      {fit.showYear && (
        <>
          <MobileSep />
          <MobileField>{year}</MobileField>
        </>
      )}
      {fit.showMonth && (
        <>
          <MobileSep />
          <MobileField>
            {month} {day}
          </MobileField>
        </>
      )}
      {fit.showTime && (
        <>
          <MobileSep />
          <MobileField>{time}</MobileField>
        </>
      )}

      <div className="ml-auto flex h-full min-w-0 shrink items-stretch overflow-hidden pr-0.5">
        <MobileSep />
        <LanguageSwitcher size="lg" forceCompact showChevron={false} />
        <MobileSep />
        <ScreenMenu
          active={active}
          mode="mobile"
          size="lg"
          showLabel
          labelWidth={fit.menuLabelWidth}
        />
      </div>
    </div>
  );
}

function MobileField({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-full items-center px-1.5 font-ig text-[13px] leading-none whitespace-nowrap text-[#ffff00]">
      {children}
    </span>
  );
}

function MobileSep() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/assets/statusbar/statusbar_sep.png"
      alt=""
      width={3}
      height={20}
      className="pixelated h-full w-[3px] shrink-0 self-stretch object-fill"
      draggable={false}
      aria-hidden
    />
  );
}

function MobileSpeedButton({
  src,
  label,
  selected,
}: {
  src: string;
  label: string;
  selected?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex h-full w-10 shrink-0 items-stretch justify-center border-0 bg-transparent p-0"
      onClick={(e) => e.preventDefault()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={selected ? src.replace(".png", "_selected.png") : src}
        alt=""
        width={14}
        height={16}
        className="pixelated h-full w-full object-fill"
        style={{ imageRendering: "pixelated" }}
        draggable={false}
      />
    </button>
  );
}

function Slot({
  x,
  y,
  w,
  h,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute flex items-center justify-center overflow-hidden px-0.5 font-ig text-[8px] leading-none whitespace-nowrap tabular-nums text-[#ffff00]"
      style={{ left: x, top: y, width: w, height: h }}
    >
      {children}
    </div>
  );
}

function SpeedButton({
  src,
  label,
  selected,
  style,
}: {
  src: string;
  label: string;
  selected?: boolean;
  style: { left: number; top: number };
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="absolute h-4 w-[14px] border-0 bg-transparent p-0"
      style={style}
      onClick={(e) => e.preventDefault()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={selected ? src.replace(".png", "_selected.png") : src}
        alt=""
        width={14}
        height={16}
        className="pixelated block h-4 w-[14px]"
        draggable={false}
      />
    </button>
  );
}
