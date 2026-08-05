# AGENTS.md — Open-IG landing (`web/`)

Instructions for AI agents working on this Next.js marketing site.

## Purpose

Immersive landing page that looks like the in-game **level-3 bridge**, used to popularize [Open Imperium Galactica](https://github.com/akarnokd/open-ig). SEO-friendly HTML (not `<canvas>`). CMS-backed copy via Sanity.

## Stack

- Next.js App Router (see `node_modules/next/dist/docs/` for this version’s APIs)
- Tailwind CSS v4
- next-intl — locales: `en`, `hu`, `de`, `fr`, `es`, `ru` (`src/i18n/`)
- Sanity — schemas in `src/sanity/`, Studio at `/studio`
- Deploy: Vercel, project root = `web/`

## Do not

- Do not modify the parent Java game (`../src`, `../data`, etc.) unless the user asks
- Do not edit the plan file in `.cursor/plans/`
- Do not put marketing copy only inside `<canvas>` — keep real DOM text for SEO

## Layout coordinates

Logical stage is **640×442** (game resolution). Scale with CSS `transform`. Key rects in `src/lib/coords.ts`:

| Region | Coords |
|--------|--------|
| Communicator panel | `(342, 260, 298, 182)` |
| Open tab hitbox | `(572, 292, 68, 170)` |
| Message list | `(355, 287, 180, 138)` |
| Viewscreen overlay | `(168, 108, 304, 148)` |

## Assets

Copied under `public/assets/`:

- `bridge/bridge_level_3.png` — background
- `communicator/` — closed/opened chrome + `open/` `close/` `appear/` frame sequences
- `cursors/` — game cursors
- `statusbar/` — top bar + speed buttons
- `buttons/` — list scroll / send / receive
- `audio/messages_deploy.wav`


## Content / CMS

- Fallback seed: `src/lib/fallbackContent.ts` (works with no Sanity env)
- Fetch: `src/lib/content.ts` → `getLandingContent(locale)`
- Schema: `landingPage` including **Steam / Steam Deck** (`steam` field) and **Media** (screenshots + videos)
- Env: copy `.env.example` → `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID`

## Sections (viewscreen overlay)

home · download · **media** · features · requirements · **steam** · community · credits

## Commands

```bash
npm install
npm run dev      # http://localhost:3000 → redirects to /en etc.
npm run build
```

## Sanity Studio

`/studio` after project id is set. Without env, the public site still runs on fallback content.
