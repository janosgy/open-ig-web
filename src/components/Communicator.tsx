"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { DownloadItem } from "@/lib/types";
import {
  CLOSE_FRAME_COUNT,
  FRAME_MS,
  MESSAGE_CLOSED_TAB,
  MESSAGE_LIST,
  MESSAGE_OPEN_HIT,
  MESSAGE_RECT,
  OPEN_FRAME_COUNT,
  ROW_HEIGHT,
  STAGE_HEIGHT,
  STAGE_WIDTH,
} from "@/lib/coords";

type Phase = "closed" | "opening" | "open" | "closing";

function frameSrc(kind: "open" | "close", index: number) {
  return `/assets/communicator/${kind}/frame-${String(index).padStart(5, "0")}.png`;
}

const DEPLOY_SOUND = "/assets/audio/messages_deploy.wav";

/** Desktop-only communicator / download panel (hidden on mobile). */
export function Communicator({
  downloads,
  onOpenChange,
}: {
  downloads: DownloadItem[];
  /** Fired when the panel leaves/enters the closed state (for content fade). */
  onOpenChange?: (open: boolean) => void;
}) {
  const t = useTranslations("communicator");
  const [phase, setPhase] = useState<Phase>("closed");
  const [frame, setFrame] = useState(0);
  const [selected, setSelected] = useState(0);
  const [offset, setOffset] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const visibleRows = Math.floor(MESSAGE_LIST.h / ROW_HEIGHT);

  useEffect(() => {
    onOpenChange?.(phase !== "closed");
  }, [phase, onOpenChange]);

  useEffect(() => {
    const audio = new Audio(DEPLOY_SOUND);
    audio.preload = "auto";
    audio.volume = 1;
    audioRef.current = audio;
    audio.load();
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  const playDeploy = useCallback(() => {
    const base = audioRef.current;
    if (!base) return;
    const sound = base.cloneNode(true) as HTMLAudioElement;
    sound.volume = 1;
    void sound.play().catch(() => {
      base.currentTime = 0;
      void base.play().catch(() => undefined);
    });
  }, []);

  useEffect(() => {
    if (phase !== "opening" && phase !== "closing") return;
    const max = phase === "opening" ? OPEN_FRAME_COUNT : CLOSE_FRAME_COUNT;
    if (frame >= max - 1) {
      setPhase(phase === "opening" ? "open" : "closed");
      setFrame(0);
      return;
    }
    const id = window.setTimeout(() => setFrame((f) => f + 1), FRAME_MS);
    return () => window.clearTimeout(id);
  }, [phase, frame]);

  const open = () => {
    if (phase !== "closed") return;
    playDeploy();
    setFrame(0);
    setPhase("opening");
  };

  const close = () => {
    if (phase !== "open") return;
    playDeploy();
    setFrame(0);
    setPhase("closing");
  };

  const panelImage =
    phase === "closed"
      ? "/assets/communicator/closed.png"
      : phase === "open"
        ? "/assets/communicator/opened.png"
        : phase === "opening"
          ? frameSrc("open", frame)
          : frameSrc("close", frame);

  const showList = phase === "open";
  const slice = downloads.slice(offset, offset + visibleRows);

  return (
    <>
      <audio src={DEPLOY_SOUND} preload="auto" aria-hidden tabIndex={-1} />

      {/*
        Closed: dedicated tab sprite for the full MESSAGE_RECT right strip
        (full closed.png still contains opaque bridge chrome outside the tab).
        Use MESSAGE_CLOSED_TAB — not MESSAGE_OPEN_HIT — so the rounded top
        above the click hitbox is not cropped.
      */}
      {phase === "closed" ? (
        <div
          className="absolute z-40"
          style={{
            left: MESSAGE_CLOSED_TAB.x,
            top: MESSAGE_CLOSED_TAB.y,
            width: MESSAGE_CLOSED_TAB.w,
            height: MESSAGE_CLOSED_TAB.h,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/communicator/closed-tab.png"
            alt=""
            width={MESSAGE_CLOSED_TAB.w}
            height={MESSAGE_CLOSED_TAB.h}
            className="pixelated pointer-events-none absolute inset-0 h-full w-full"
            draggable={false}
          />
        </div>
      ) : (
        <div
          className="absolute z-40"
          style={{
            left: MESSAGE_RECT.x,
            top: MESSAGE_RECT.y,
            width: MESSAGE_RECT.w,
            height: MESSAGE_RECT.h,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={panelImage}
            alt=""
            width={MESSAGE_RECT.w}
            height={MESSAGE_RECT.h}
            className="pixelated pointer-events-none absolute inset-0 h-full w-full"
            draggable={false}
          />

          <span className="sr-only">{t("downloadLabel")}</span>

          {showList && (
            <DownloadList
              slice={slice}
              offset={offset}
              selected={selected}
              setSelected={setSelected}
              setOffset={setOffset}
              downloadsLength={downloads.length}
              visibleRows={visibleRows}
            />
          )}
        </div>
      )}

      {phase === "closed" && (
        <button
          type="button"
          className="cursor-hand absolute z-50 border-0 bg-transparent p-0"
          style={{
            left: MESSAGE_OPEN_HIT.x,
            top: MESSAGE_OPEN_HIT.y,
            width: MESSAGE_OPEN_HIT.w,
            height: MESSAGE_OPEN_HIT.h,
          }}
          aria-label={t("openHint")}
          onClick={open}
        />
      )}

      {phase === "open" && (
        <button
          type="button"
          className="absolute inset-0 z-10 cursor-pointer border-0 bg-transparent p-0"
          style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}
          aria-label={t("closeHint")}
          onClick={close}
        />
      )}
    </>
  );
}

function DownloadList({
  slice,
  offset,
  selected,
  setSelected,
  setOffset,
  downloadsLength,
  visibleRows,
}: {
  slice: DownloadItem[];
  offset: number;
  selected: number;
  setSelected: (n: number) => void;
  setOffset: (fn: (o: number) => number) => void;
  downloadsLength: number;
  visibleRows: number;
}) {
  return (
    <>
      <ul
        className="absolute z-[1] m-0 list-none overflow-hidden p-0"
        style={{
          left: MESSAGE_LIST.x - MESSAGE_RECT.x,
          top: MESSAGE_LIST.y - MESSAGE_RECT.y,
          width: MESSAGE_LIST.w,
          height: MESSAGE_LIST.h,
        }}
      >
        {slice.map((item, i) => {
          const abs = offset + i;
          const active = abs === selected;
          return (
            <li key={item.platform} style={{ height: ROW_HEIGHT }}>
              <a
                href={item.url}
                className="cursor-hand block h-full px-0.5 no-underline"
                style={{ outline: active ? "1px solid #ffffff" : "none" }}
                onMouseEnter={() => setSelected(abs)}
                onFocus={() => setSelected(abs)}
              >
                <div className="font-ig text-[8px] leading-tight text-[#fc2828]">
                  {item.title}
                </div>
                <div className="font-ig text-[6px] leading-tight text-[#6cb068]">
                  {item.description}
                </div>
              </a>
            </li>
          );
        })}
      </ul>

      <div className="absolute z-[1]" style={{ left: 231, top: 106 }}>
        <button
          type="button"
          className="cursor-hand mb-1 block border-0 bg-transparent p-0"
          aria-label="Scroll up"
          disabled={offset <= 0}
          onClick={() => setOffset((o) => Math.max(0, o - 1))}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              offset <= 0
                ? "/assets/buttons/button_upwards_level_3_empty.png"
                : "/assets/buttons/button_upwards_level_3.png"
            }
            alt=""
            width={25}
            height={29}
            className="pixelated"
            draggable={false}
          />
        </button>
        <button
          type="button"
          className="cursor-hand block border-0 bg-transparent p-0"
          aria-label="Scroll down"
          disabled={offset + visibleRows >= downloadsLength}
          onClick={() =>
            setOffset((o) =>
              Math.min(Math.max(0, downloadsLength - visibleRows), o + 1),
            )
          }
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              offset + visibleRows >= downloadsLength
                ? "/assets/buttons/button_downwards_level_3_empty.png"
                : "/assets/buttons/button_downwards_level_3.png"
            }
            alt=""
            width={25}
            height={32}
            className="pixelated"
            draggable={false}
          />
        </button>
      </div>
    </>
  );
}
