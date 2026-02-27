# Application Architecture

This document describes the architecture of the Insym Phasmophobia Challenges app: high-level structure, page organization, routing, state management, and the translation (i18n) system.

---

## 1. Tech Stack & Entry Point

- **Runtime**: React 19, TypeScript, Vite 7
- **Routing**: React Router DOM v7 (`createBrowserRouter`, `RouterProvider`)
- **State**: MobX (`SessionsStore`) + React Context (`GameModeSettings`, `SessionsStoreProvider`)
- **UI**: Tailwind CSS 4, Ant Design 6
- **i18n**: i18next, react-i18next, i18next-browser-languagedetector, i18next-http-backend

**Entry**: `src/main.tsx`  
Renders the app inside:

- `StrictMode`
- `StyleProvider` (Ant Design)
- `ConfigProvider` (Ant Design)
- `SessionsStoreProvider` (MobX store for roll sessions)
- `GameModeSettingsProvider` (game mode + custom features)
- Imports `@/shared/config/i18next` so i18n is initialized before React.
- Renders `<App />` from `src/app/index.tsx`.

**Path alias**: `@/` resolves to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

**Base path**: The app is built for GitHub Pages under `/Insym_challanges_phasmo/` (`vite.config.ts` `base` and router `basename`).

---

## 2. High-Level Architecture

```
src/
├── app/                    # App shell: router, layout, global state
│   ├── index.tsx           # Registers all i18n namespaces, renders AppRouter
│   ├── layout/             # AppLayout (Header, Outlet, Footer)
│   ├── router/             # createBrowserRouter, route aggregation
│   └── store/              # SessionsStore (MobX), GameModeSettings (Context), providers
├── pages/                  # Feature-based pages (each: routes, ui, optional model, i18next)
├── widgets/                # Reusable layout/feature widgets (Header, Footer, LanguageSwitcher, etc.)
├── shared/                 # Shared config, UI, data, lib, types
│   ├── config/             # routes, i18next (init + common namespace)
│   ├── data/               # phasmophobia data, presets
│   ├── lib/                # e.g. IndexedDB helpers
│   ├── types/              # shared TypeScript types
│   └── ui/                 # shared UI (e.g. AppModal)
```

- **app**: Bootstrap, routing, layout, and global state (sessions + game mode).
- **pages**: One folder per “page” or feature area; each can expose `routes`, `ui`, `model`, and `i18next`.
- **widgets**: Cross-cutting UI (header, footer, language switcher).
- **shared**: Config, data, lib, types, and shared components used by app/widgets/pages.

---

## 3. Routing & Page Structure

### 3.1 Router Setup

- **File**: `src/app/router/index.tsx`
- **Router**: `createBrowserRouter` with `basename: '/Insym_challanges_phasmo'`.
- **Single layout route**: path `'/'`, element `AppLayout`, with **children** coming from page modules.

Child routes are collected via **Vite glob import**:

```ts
const pageRouteModules = import.meta.glob<{ routes: RouteObject[] }>(
    '../../pages/*/routes.tsx',
    { eager: true }
)
const childRoutes = [
    ...Object.values(pageRouteModules).flatMap((m) => m?.routes ?? []),
    { path: '*', element: <NotFoundPage /> },
]
```

So every **page** that has `src/pages/<name>/routes.tsx` exporting a `routes` array is automatically included. The catch-all `*` renders `NotFoundPage`.

### 3.2 Route Constants

- **File**: `src/shared/config/routes.ts`
- **ROUTE_PATHS**: segment names for children (`main-mode`, `settings`).
- **ROUTES**: full paths for links/navigation (`/`, `/main-mode`, `/settings`).

### 3.3 Layout

- **File**: `src/app/layout/AppLayout.tsx`
- **Structure**: Header (fixed) → main (flex, `Outlet` for page content) → Footer.
- All page content is rendered inside `<Outlet />`.

### 3.4 Page Module Convention

Each page lives under `src/pages/<PageName>/` and typically has:

| Item | Purpose |
|------|--------|
| **routes.tsx** | Exports `routes: RouteObject[]` (path + element). Picked up by the router glob. |
| **ui/** | Page component and page-specific components (e.g. `MainModePage.tsx`, `EvidenceSection.tsx`). |
| **model/** (optional) | Page-level state/logic (e.g. `useMainModeState`). |
| **i18next/** | Namespace resources (`en.ts`, `ru.ts`) and `index.ts` that registers the namespace with i18n. |

**Example – Home** (`src/pages/home/`):

- `routes.tsx`: index route `{ index: true, element: <HomePage /> }`.
- `ui/HomePage.tsx`: landing content, uses `ENameSpaces.MAIN_PAGE`.
- `i18next/index.ts`, `en.ts`, `ru.ts`: register and define `main_page` namespace.

**Example – Main Mode** (`src/pages/main-mode/`):

- `routes.tsx`: path `ROUTE_PATHS.MAIN_MODE`, element `MainModePage`.
- `ui/MainModePage.tsx`: composes EvidenceSection, GhostList, ItemWheelSection, WheelSection, modals; uses `useMainModeState` and `useSessionsStore` / `useGameModeSettings`.
- `model/useMainModeState.ts`: local state (evidence, crossed-out ghosts, wheel state, persistence), integrates with `SessionsStore` and presets.
- `i18next/`: `main_mode` namespace for all main-mode UI.

**Example – Settings** (`src/pages/settings/`):

- `routes.tsx`: path `ROUTE_PATHS.SETTINGS`, element `SettingsPage`.
- `ui/SettingsPage.tsx`: layout for GameModeSection, CustomFeaturesSection, LanguageSection (and any other settings widgets).
- `i18next/`: `settings` namespace.

**Example – Not found**:

- No `routes.tsx` in `pages/not-found`; the router explicitly adds `{ path: '*', element: <NotFoundPage /> }`.
- `ui/NotFoundPage.tsx` uses `ENameSpaces.NOT_FOUND`; `i18next/` registers `not_found`.

---

## 4. State Management

### 4.1 Global State

- **SessionsStore** (MobX, `src/app/store/SessionsStore.ts`):  
  Roll sessions, current session, persistence to IndexedDB and localStorage. Used by main-mode for starting/ending sessions and storing rolls. Components that depend on the store use `observer()` from `mobx-react-lite` and `useSessionsStore()`.

- **GameModeSettings** (React Context, `src/app/store/GameModeSettingsContext.tsx`):  
  `gameMode` (`'regular' | 'randomChallenge' | 'custom'`) and `customFeatures`; persisted in localStorage. Consumed via `useGameModeSettings()`.

### 4.2 Page-Level State

- **Main mode**: `useMainModeState()` in `src/pages/main-mode/model/useMainModeState.ts` encapsulates evidence, crossed-out ghosts, wheel results, item wheel, and per-session persistence. It reads from `SessionsStore` and `useGameModeSettings`, and syncs with presets from `@/shared/data/presets`.

Other pages (Home, Settings, Not found) are mostly presentational or use only global store/context.

---

## 5. Translations (i18n)

### 5.1 Initialization

- **Config**: `src/shared/config/i18next/index.ts`
  - Uses **i18next**, **Backend** (HTTP), **LanguageDetector**, **initReactI18next**.
  - `fallbackLng: 'en'`, `supportedLngs: ['en', 'ru']`.
  - Backend `loadPath` is set to `/locales/{{lng}}/translation.json` (optional; see below).
  - `debug: true`, `interpolation.escapeValue: false` for React.

i18n is imported in `main.tsx` so it is initialized before any component runs.

### 5.2 Namespaces

- **Definition**: `src/shared/config/i18next/models/i18n.namespaces.ts`  
  Enum `ENameSpaces`: `COMMON`, `MAIN_PAGE`, `MAIN_MODE`, `NOT_FOUND`, `SETTINGS`.

- **Usage**: Components call `useTranslation(ENameSpaces.XXX)` and use `t('key')` or `t('nested.key')` within that namespace.

### 5.3 Registration (Resource Bundles)

Translations are **not** loaded only from the HTTP backend. The app **registers resource bundles** at runtime so that all UI has translations without depending on external JSON.

- **Where**: In `src/app/index.tsx`, the following are called on every render (they are idempotent):
  - `registerCommonI18n()`
  - `registerMainPageI18n()`
  - `registerMainModeI18n()`
  - `registerNotFoundI18n()`
  - `registerSettingsI18n()`

- **How**: Each “page” (or shared) i18n module does:
  1. Import the singleton `i18n` from `@/shared/config/i18next`.
  2. Import plain objects `en` and `ru` from local `en.ts` / `ru.ts`.
  3. Call `i18n.addResourceBundle(lng, namespace, resource, deep?, overwrite?)` for `en` and `ru`.

Example (`src/pages/main-mode/i18next/index.ts`):

```ts
import i18n from '@/shared/config/i18next'
import en from './en'
import ru from './ru'
import { ENameSpaces } from '@/shared/config/i18next/models/i18n.namespaces'

export const registerMainModeI18n = () => {
    i18n.addResourceBundle('en', ENameSpaces.MAIN_MODE, en, true, true)
    i18n.addResourceBundle('ru', ENameSpaces.MAIN_MODE, ru, true, true)
}
```

So: **translations are in code** (per-namespace `en.ts`/`ru.ts`), and **registration is explicit** per namespace in `App`.

### 5.4 Per-Namespace File Layout

- **Shared “common”**: `src/shared/config/i18next/common/` — `en.ts`, `ru.ts`, `index.ts` (registerCommonI18n). Used e.g. by Header for nav labels.
- **Per-page**: e.g. `src/pages/main-mode/i18next/en.ts`, `ru.ts`, `index.ts`. Keys are nested objects (e.g. `evidence.title`, `presets.classic`).

Components use the namespace and the same key structure as in the objects, e.g. `t('evidence.title')`, `t(\`presets.${activePreset.id}\`, activePreset.name)`.

### 5.5 Language Switching

- **LanguageSwitcher** widget uses `useTranslation()` (no namespace) and calls `i18n.changeLanguage(code)` so the whole app switches language; all namespaces already have `en` and `ru` bundles registered.

### 5.6 Summary

| Aspect | Detail |
|--------|--------|
| **Engine** | i18next + react-i18next |
| **Namespaces** | `ENameSpaces`: common, main_page, main_mode, not_found, settings |
| **Storage** | In-repo TS files per namespace (`en.ts`, `ru.ts`), registered with `addResourceBundle` in `App` |
| **Usage** | `useTranslation(ENameSpaces.XXX)`, then `t('key')` or `t('nested.key')` |
| **Languages** | `en`, `ru`; fallback `en`; detection via i18next-browser-languagedetector |

---

## 6. Summary Diagram

```
main.tsx
  → import i18n config (init)
  → SessionsStoreProvider, GameModeSettingsProvider
  → App

App (app/index.tsx)
  → registerCommonI18n, registerMainPageI18n, registerMainModeI18n, registerNotFoundI18n, registerSettingsI18n
  → AppRouter

AppRouter
  → RouterProvider(createBrowserRouter([ { path: '/', element: AppLayout, children } ]))
  → childRoutes = glob from pages/*/routes.tsx + catch-all NotFoundPage

AppLayout
  → Header | main (Outlet) | Footer

Pages (children of layout)
  → home (index) → HomePage
  → main-mode → MainModePage (useMainModeState, SessionsStore, GameModeSettings)
  → settings → SettingsPage
  → * → NotFoundPage

Translations
  → i18n init in shared/config/i18next
  → Each namespace: pages/<page>/i18next or shared/config/i18next/common
  → Register in App with addResourceBundle('en'|'ru', namespace, en|ru)
  → Components: useTranslation(ENameSpaces.XXX), t('key')
```

This should give you a single place to look for how the app is structured, how pages and routes are defined, and how translations are organized and used.
