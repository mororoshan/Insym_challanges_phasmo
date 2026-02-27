# Phasmophobia Challenge Companion — The Wheel

A web app for **Phasmophobia** players and streamers: spin wheels to pick ghosts and items, track evidence, and run challenge presets (Classic, Apocalypse, Zero Evidence, No Sanity, and more).

## What it does

- **Ghost wheel** — Spin to randomly pick one or more ghosts for your run. Filter by evidence you’ve found so only valid ghosts stay in the wheel.
- **Item wheel** — Optional wheel for equipment/evidence (e.g. “No truck” runs): spin to decide what you’re allowed to use.
- **Evidence & ghost list** — Mark evidence as found; ghosts that can’t have it get crossed out. Manually cross out or restore ghosts.
- **Challenge presets** — Start a session with a preset (Classic, Apocalypse, Zero Evidence, No Sanity, etc.) so the right wheels and rules are applied.
- **Session history** — Past spins and game results are stored locally (IndexedDB) so you can review or edit history.
- **Settings** — Choose game mode (regular vs random challenge), language (EN/RU), wheel size, spin duration, and other options.

Perfect for solo runs, co-op, or stream formats where chat or a wheel decides the challenge.

## Screenshots & demo

<!-- Add a screenshot or short video here once you have one:
- **Screenshot:** drag an image into the repo (e.g. `docs/screenshot.png`) and link it:
  ![App screenshot](docs/screenshot.png)
- **Video:** upload a short demo to YouTube/Giphy/etc. and embed or link it.
-->

_Placeholder: add a screenshot or short video of the app (e.g. main screen with the wheel, or a quick demo) to show how it looks and works._

## Tech stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** + **Ant Design** for UI
- **MobX** for state; **react-router-dom** for routing
- **i18next** for EN/RU
- **IndexedDB** (via app store) for session history

## Getting started

```bash
npm install
npm run dev
```

Open the app at the URL Vite prints (e.g. `http://localhost:5173/Insym_challanges_phasmo/` depending on your config).

- **Build:** `npm run build`
- **Preview build:** `npm run preview`
- **Lint:** `npm run lint`

## Project structure

- `src/app/` — router, layout, global store (sessions, game mode settings)
- `src/pages/main-mode/` — main “Wheel” page (evidence, ghost list, wheels, end-game modal)
- `src/pages/settings/` — settings page (game mode, language, wheel options, custom features)
- `src/widgets/` — header, footer, wheel component, language switcher
- `src/shared/` — UI primitives, i18n config, Phasmophobia data (ghosts, evidence, presets), types, IndexedDB helpers

---

_Phasmophobia is a co-op horror game by Kinetic Games. This app is an unofficial fan tool and is not affiliated with the game or its developers._
