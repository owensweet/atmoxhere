# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

## Architecture

**Stack:** Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + Three.js/React Three Fiber + Firebase Firestore + Stripe + Resend

### Page Structure

- `/` — Homepage: a 3D Three.js sphere (`@react-three/fiber`) with collection links orbiting it. The `collections` array in `src/app/page.js` is the source of truth for all available collections.
- `/shop/[collection]` — Grid of product cards fetched from Firestore. `collection = "all"` fetches everything.
- `/shop/[collection]/[slug]` — Product detail with image gallery + Stripe checkout form. The gallery auto-discovers images by sequentially probing `/images/Clothes/{slug}{n}.webp` until a 404.
- `/lore` — Manga reader; uses `MangaButton` components, each of which auto-discovers pages by probing `/images/Manga/{manga_name}_{n}.png`.
- `/api/checkout_sessions` — POST route that creates a Stripe Checkout session and redirects to it.

### Client-Side Shell

`src/app/ClientWrapper.jsx` wraps all page content and renders globally:
- Background sigil images (fixed, pointer-events-none)
- `MouseFollower` cursor effect
- `CountryButton` — lets the user pick their shipping country, stored in `localStorage` as `shipping_country`. This value is read at checkout time and injected into the Stripe session form.
- Lore navigation button (top-left)

### Data Layer

`src/lib/firebase/Firestore.js` is a class wrapping Firestore operations. Products have these fields:
- `name`, `slug`, `collection`, `description`
- `priceUSD` (display price), `priceID` (Stripe price ID used for checkout)
- `stock` (≤0 means sold out / "SUPPLY_LOCKED")

### Image Conventions

- Product images: `public/images/Clothes/{slug}{n}.webp` (numbered from 1)
- Collection icons: `public/images/Icons/{collection}.webp`
- Manga pages: `public/images/Manga/{manga_name}_{n}.png` (numbered from 1)
- Border overlays: `public/images/Borders/`

### Styling

Global theme is in `src/app/globals.css`. Dark green CRT aesthetic (`--background: hsl(154 50% 11%)`). Font is Kode Mono loaded via `next/font/google` in `layout.js`. CRT scanline effects are applied via `.crt` and `.scanlines` CSS classes. Tailwind v4 is used (config via `postcss.config.mjs`, no `tailwind.config.js`). Sci-fi but with a slightly dystopian theme.

### Big Task
How to manage orders and items (the co-founder needs to be able to add items and photos). We already have the redundancy of uploading the photos and item info to stripe. but also firebase. im not really sure but I need to program a solution myself and I just want some guidance. 
