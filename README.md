# Apple Gadgets BD Clone — Next.js 14 + TypeScript

A full clone of applegadgetsbd.com built with Next.js 14 App Router and TypeScript.

## Features
- ✅ Sticky header with search, cart counter, nav links
- ✅ Hero banner with auto-sliding and dot navigation
- ✅ Trust badges (EMI, Delivery, Exchange, Price, Service)
- ✅ Featured categories grid (16 categories)
- ✅ New Trends product section
- ✅ Featured Products with Best Deals / Top Selling tabs
- ✅ Promo banners (2-grid layout)
- ✅ New Arrivals with Gadgets / Device tabs
- ✅ Air Conditioner deals section
- ✅ Top Brand Products with brand filter tabs
- ✅ SEO text section
- ✅ Full footer with links, social icons
- ✅ Floating WhatsApp button
- ✅ Fully responsive (mobile / tablet / desktop)
- ✅ TypeScript throughout

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Home page
│   └── globals.css         # All styles
├── components/
│   ├── layout/
│   │   ├── TopBar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── HeroBanner.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── CategoriesSection.tsx
│   │   ├── NewTrends.tsx
│   │   ├── FeaturedProducts.tsx
│   │   ├── PromoBanners.tsx
│   │   ├── NewArrivals.tsx
│   │   ├── AcSection.tsx
│   │   ├── TopBrandProducts.tsx
│   │   └── SeoSection.tsx
│   ├── ui/
│   │   └── ProductCard.tsx
│   └── HomeClient.tsx
├── data/
│   └── index.ts            # All mock data
├── lib/
│   └── utils.ts            # Formatters
└── types/
    └── index.ts            # TypeScript interfaces
```

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Build for Production

```bash
npm run build
npm start
```
