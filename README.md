<div align="center">

# Wheel of Names

Fun, fast, and fair name picking with a beautiful spinning wheel. Installable as a PWA, mobile-friendly, and delightful to use.

[![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9%2B-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PWA](https://img.shields.io/badge/PWA-Ready-5a0fc8)](https://web.dev/what-are-pwas)
[![CRA](https://img.shields.io/badge/Build-Create%20React%20App-09d3ac?logo=create-react-app&logoColor=white)](https://create-react-app.dev)

</div>

<p align="center">
  <img src="docs/hero.svg" alt="Wheel of Names — banner" width="100%" />
</p>

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Preview](#preview)
- [Usage](#usage)
- [How It Works](#how-it-works)
  - [Selection Fairness](#selection-fairness)
  - [Layouts and UX](#layouts-and-ux)
- [Architecture Overview](#architecture-overview)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Testing](#testing)
- [Environment & Configuration](#environment--configuration)
- [Progressive Web App](#progressive-web-app)
- [Privacy & Data](#privacy--data)
- [Accessibility](#accessibility)
- [Browser Support](#browser-support)
- [Troubleshooting](#troubleshooting)
- [FAQ](#faq)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Features

- ✍️ **Dynamic Name Input**

  - Two-column layout for fast entry
  - Up to 30 entries
  - Per-name multiplier (1–10) to tune probability
  - Real-time validation

- 🖼️ **Flexible Layout**

  - Toggle portrait/landscape
  - Landscape keeps the wheel sticky on scroll
  - Fully responsive across screen sizes

- 🎯 **Interactive Wheel**

  - Smooth, natural deceleration
  - 5–7 full rotations before landing
  - Precise pointer alignment and instant feedback

- 🏆 **Winner Experience**

  - Prominent, animated winner reveal
  - History of previous winners with gradient cards

- 📦 **PWA**
  - Installable on desktop and mobile
  - Offline support
  - Fast, auto-updating

## Quick Start

### Prerequisites

- Node 18+ and npm
- macOS, Linux, or Windows (development tested on macOS ARM64)

### Setup

```bash
npm install
npm start
```

Open `http://localhost:3000` in your browser.

To create a production build:

```bash
npm run build
```

## Usage

1. Choose portrait or landscape using the header toggle.
2. Enter names in the input fields.
3. Optionally set a multiplier (1–10) per name to weight odds.
4. Click "Spin the Wheel!".
5. Celebrate the winner and review recent history.

## How It Works

### Selection Fairness

Names are expanded into a draw pool according to their multiplier, ensuring proportional odds while keeping the UI simple.

```ts
interface NameEntry {
  name: string;
  count: number; // 1–10
}

function getValidNames(entries: ReadonlyArray<NameEntry>): string[] {
  return entries
    .filter((e) => e.name.trim() !== "")
    .flatMap((e) =>
      Array.from({ length: Math.max(1, Math.min(10, e.count)) }, () => e.name)
    );
}
```

The wheel spin duration and final angle are derived from the selected index, producing a consistent 5–7 rotation experience with accurate pointer alignment.

### Layouts and UX

- Portrait stacks inputs, wheel, and results vertically.
- Landscape splits inputs and wheel side-by-side and keeps the wheel sticky.
- Subtle gradients, shadows, and transitions guide attention without distracting.

## Architecture Overview

```
wheel-of-names/
  public/
    manifest.json           # PWA metadata and icons
  src/
    components/
      Wheel.tsx            # Spinning wheel rendering and animation
      DancingBear.tsx      # Celebration overlay on win
    App.tsx                # App shell, state, layout controls
    index.tsx              # Bootstraps React and registers service worker
    serviceWorker.ts       # PWA registration (registered in index.tsx)
```

- Built with React 19 + TypeScript.
- Styling via Emotion (`@emotion/styled` and `@emotion/react`).
- Service worker is registered in `src/index.tsx` to enable offline and install experiences.

## Scripts

```bash
npm start      # Run the app in development mode
npm test       # Run tests (Jest + React Testing Library)
npm run build  # Production build
npm run eject  # Eject (Create React App)
```

### Asset Generation (optional)

This repo includes `generate-icons.js` and `generate-icons.sh` which use `sharp` to help (re)generate icons and splash assets. If you update the base logo, run one of:

```bash
node generate-icons.js
# or
bash generate-icons.sh
```

Note: If `sharp` installation fails on Apple Silicon, try `npm rebuild sharp` or reinstall Node 18+ via a universal installer.

## Deployment

This is a static React app. Any static host works once you run `npm run build`.

- Vercel
  - New Project → Import your repo → Framework Preset: React
  - Build command: `npm run build`
  - Output directory: `build`
- Netlify
  - New site from Git → Select repo
  - Build command: `npm run build`
  - Publish directory: `build`
- GitHub Pages (optional)
  - Add `"homepage": "https://<user>.github.io/<repo>"` in `package.json`
  - `npm install --save-dev gh-pages`
  - Add scripts:
    - `"predeploy": "npm run build"`
    - `"deploy": "gh-pages -d build"`
  - `npm run deploy`

To preview a production build locally:

```bash
npm run build
npx serve -s build
```

If `serve` is not installed, the `npx` variant above will fetch it temporarily.

## Testing

Run the test suite:

```bash
npm test
```

Collect coverage (interactive):

```bash
npm test -- --coverage
```

Tests are written with Jest and React Testing Library and configured by Create React App via `src/setupTests.ts`.

## Environment & Configuration

- `PORT` — change dev server port (example: `PORT=3001 npm start`).
- Node 18+ recommended for best compatibility (macOS ARM64 verified).

## Progressive Web App

- Manifest: `public/manifest.json` defines icons, colors, categories, and screenshots.
- Registration: `serviceWorker.register()` is called from `src/index.tsx`.
- Install:
  - Chrome/Edge: Click the install icon in the address bar.
  - iOS Safari: Share → Add to Home Screen.
- Updates: The service worker auto-updates; a full refresh may be needed to fetch the latest assets.

## Privacy & Data

- 100% client-side. No backend, no tracking, no analytics, and no external network calls.
- All names you enter stay in your browser session only.

## Accessibility

- Interactive controls include accessible labels (e.g., layout and theme toggles, count steppers).
- Clear focus states and sufficient color contrast in both light and dark modes.
- Pointer and keyboard-friendly interactions; inputs remain reachable and legible on small screens.

## Browser Support

Targets modern evergreen browsers per `browserslist`:

- Production: `>0.2%`, `not dead`, `not op_mini all`
- Development: last 1 version of Chrome/Firefox/Safari

## Troubleshooting

- Wheel button disabled: Enter at least two non-empty names.
- Stuck on an old version: Hard refresh to bypass cached service worker assets. On desktop, try closing all tabs for the app and reopening.
- `sharp` build/install errors on macOS ARM: `npm rebuild sharp` or reinstall Node 18+.
- Port already in use: Set `PORT=3001 npm start`.

## FAQ

**How are odds calculated?**

Each name’s multiplier (1–10) expands its presence in the draw pool, so probability equals `count / (sum of counts)`.

**Can I run it offline?**

Yes. After the first load, it works offline thanks to the registered service worker.

**Why won’t the wheel spin?**

The spin requires at least two valid names.

**Is there a dark mode?**

Yes. Toggle using the header sun/moon icon.

**Can I quickly add more inputs?**

Use the "Add More Names" button until you reach 30 entries.

## Roadmap

- Import/export name lists
- Custom themes and color palettes
- Sound effects and celebratory animations
- Stats and fairness reports
- Multiple wheel presets
- Touch gestures and richer mobile interactions
- Optional cloud sync

## Contributing

Contributions are welcome! To propose a change:

1. Fork the repo and create a feature branch.
2. Make your changes with clear, concise commits.
3. Add or update tests where relevant.
4. Open a pull request describing the change and rationale.

## License

No license file is present. If you plan to share or open source this project, consider adding a license (e.g., MIT) at the repository root.
