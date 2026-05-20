import { Product, Category, Brand, BannerSlide } from "@/types";

export const bannerSlides = [
  {
    id: 1,
    title: "iPhone 17 Series",
    subtitle: "Exclusive deals with up to 36 Months EMI",
    cta: "Shop Now",
    href: "/category/iphone",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    accentColor: "#e94560",
  },
  {
    id: 2,
    title: "Galaxy S26 Ultra 5G",
    subtitle: "Get ৳11,000 OFF — Limited Time Offer",
    cta: "Explore",
    href: "/product/galaxy-s26-ultra-5g",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    accentColor: "#4fc3f7",
  },
  {
    id: 3,
    title: "MacBook Pro M5",
    subtitle: "The most powerful MacBook ever. Now in Bangladesh.",
    cta: "Buy Now",
    href: "/category/macbook",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
    accentColor: "#a8e6cf",
  },
];
export const featuredCategories: Category[] = [
  { id: 1, name: "Mobile Phone", icon: "📱", slug: "mobile-phone" },
  { id: 2, name: "Laptop", icon: "💻", slug: "laptops" },
  { id: 3, name: "Tablet", icon: "🖥️", slug: "tablet" },
  { id: 4, name: "Smart Watch", icon: "⌚", slug: "smart-watch" },
  { id: 5, name: "AirPods", icon: "🎧", slug: "airpods" },
  { id: 6, name: "Speakers", icon: "🔊", slug: "speakers" },
  { id: 7, name: "Home Appliances", icon: "🏠", slug: "home-appliances" },
  { id: 8, name: "Wireless Charger", icon: "🔋", slug: "wireless-charger" },
  { id: 9, name: "Wired Headphone", icon: "🎵", slug: "wired-headphone" },
  { id: 10, name: "Adapter", icon: "🔌", slug: "adapter" },
  { id: 11, name: "Cables", icon: "🔗", slug: "cable" },
  { id: 12, name: "Starlink", icon: "🛰️", slug: "starlink" },
  { id: 13, name: "Hubs & Docks", icon: "🖧", slug: "hubs-and-docs" },
  { id: 14, name: "Smart Pen", icon: "✏️", slug: "smart-pen" },
  { id: 15, name: "Wireless Headphone", icon: "🎙️", slug: "wireless-headphone" },
  { id: 16, name: "Headphone", icon: "🎼", slug: "headphone" },
];

export const newTrends: Product[] = [
  { id: 1, name: "Galaxy S26 Ultra 5G", slug: "galaxy-s26-ultra-5g", salePrice: 125000, regularPrice: 136000, category: "mobile-phone", brand: "Samsung" },
  { id: 2, name: "Nothing Phone (4a) Pro", slug: "nothing-phone-4a-pro", salePrice: 58000, regularPrice: null, category: "mobile-phone", brand: "Nothing" },
  { id: 3, name: "Galaxy A57 5G", slug: "galaxy-a57-5g", salePrice: 0, regularPrice: null, badge: "TBA", category: "mobile-phone", brand: "Samsung" },
  { id: 4, name: "Xiaomi Pad 7", slug: "xiaomi-pad-7", salePrice: 38500, regularPrice: 42000, category: "tablet", brand: "Xiaomi" },
  { id: 5, name: "iPhone 17", slug: "iphone-17", salePrice: 96499, regularPrice: 102000, category: "mobile-phone", brand: "Apple" },
  { id: 6, name: "Galaxy TAB A11+", slug: "galaxy-tab-a11-plus", salePrice: 27000, regularPrice: null, category: "tablet", brand: "Samsung" },
  { id: 7, name: "iPad Air M4 - 2026", slug: "ipad-air-m4", salePrice: 76000, regularPrice: 88500, category: "tablet", brand: "Apple" },
  { id: 8, name: "MacBook Air M5 13-Inch", slug: "macbook-air-m5", salePrice: 134500, regularPrice: null, category: "laptop", brand: "Apple" },
  { id: 9, name: "MacBook Pro M5 Pro 14-Inch", slug: "macbook-pro-m5-pro-14-inch", salePrice: 282000, regularPrice: null, category: "laptop", brand: "Apple" },
];

export const featuredProducts: Product[] = [
  { id: 10, name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", salePrice: 146000, regularPrice: 165000, category: "mobile-phone", brand: "Apple" },
  { id: 11, name: "iPhone 17", slug: "iphone-17", salePrice: 96499, regularPrice: 102000, category: "mobile-phone", brand: "Apple" },
  { id: 12, name: "Galaxy Buds Core", slug: "galaxy-buds-core", salePrice: 4500, regularPrice: 4800, category: "airpods", brand: "Samsung" },
  { id: 13, name: "PHILIPS HD4929 Induction Cooker", slug: "philips-hd4929-induction-cooker", salePrice: 7000, regularPrice: 9450, category: "home-appliances", brand: "Philips" },
  { id: 14, name: "Galaxy Tab A11", slug: "galaxy-tab-a11", salePrice: 15500, regularPrice: null, category: "tablet", brand: "Samsung" },
  { id: 15, name: "Gree GS-18XCOA3V Cosmo Inverter AC", slug: "gree-gs-18xcoa3v", salePrice: 64500, regularPrice: 81890, category: "home-appliances", brand: "Gree" },
  { id: 16, name: "Haier HSU-12TurboAqua Non Inverter AC", slug: "haier-hsu-12", salePrice: 42900, regularPrice: 50990, category: "home-appliances", brand: "Haier" },
  { id: 17, name: "CMF Watch Pro 2 BT Calling Smart Watch", slug: "cmf-watch-pro-2", salePrice: 5750, regularPrice: 7500, category: "smart-watch", brand: "Nothing" },
  { id: 18, name: "MacBook Air M5 15-Inch", slug: "macbook-air-m5-15-inch", salePrice: 171000, regularPrice: null, category: "laptop", brand: "Apple" },
  { id: 19, name: "QCY MeloBuds N20 ANC TWS Earbuds", slug: "qcy-melobuds-n20", salePrice: 2250, regularPrice: null, category: "earbuds", brand: "QCY" },
  { id: 20, name: "iPad 11th Gen - 2025", slug: "ipad-11th-gen", salePrice: 44500, regularPrice: 48000, category: "tablet", brand: "Apple" },
  { id: 21, name: "MacBook Air M4 13-Inch", slug: "macbook-air-m4-13-inch", salePrice: 142500, regularPrice: 146000, category: "laptop", brand: "Apple" },
  { id: 22, name: "Apple Mac mini M4", slug: "apple-mac-mini-m4", salePrice: 89999, regularPrice: null, category: "laptop", brand: "Apple" },
  { id: 23, name: "Galaxy Watch8", slug: "galaxy-watch8", salePrice: 24600, regularPrice: null, category: "smart-watch", brand: "Samsung" },
  { id: 24, name: "QCY HT15 Buds ANC TWS Earbuds", slug: "qcy-ht15-buds", salePrice: 1900, regularPrice: 2300, category: "earbuds", brand: "QCY" },
  { id: 25, name: "OnePlus Bullets Wireless Z3", slug: "oneplus-bullets-z3", salePrice: 2200, regularPrice: null, category: "earphones", brand: "OnePlus" },
];

export const newArrivals: Product[] = [
  { id: 30, name: "Anker Nano 45W Power Bank 10000mAh", slug: "anker-nano-45w-powerbank", salePrice: 5000, regularPrice: 5500, category: "accessories", brand: "Anker" },
  { id: 31, name: "Apple Watch Series 11", slug: "apple-watch-series-11", salePrice: 44000, regularPrice: 53500, category: "smart-watch", brand: "Apple" },
  { id: 32, name: "Galaxy Buds4 Pro", slug: "galaxy-buds4-pro", salePrice: 23500, regularPrice: 25500, category: "earbuds", brand: "Samsung" },
  { id: 33, name: "AirPods Pro 3", slug: "airpods-pro-3", salePrice: 27500, regularPrice: 34000, category: "airpods", brand: "Apple" },
  { id: 34, name: "Anker Soundcore Liberty 5 ANC", slug: "anker-liberty-5", salePrice: 7150, regularPrice: 8500, category: "earbuds", brand: "Anker" },
  { id: 35, name: "Apple Watch SE 3", slug: "apple-watch-se-3", salePrice: 36000, regularPrice: 42000, category: "smart-watch", brand: "Apple" },
  { id: 36, name: "Galaxy Watch8 Classic", slug: "galaxy-watch8-classic", salePrice: 31500, regularPrice: 40500, category: "smart-watch", brand: "Samsung" },
  { id: 37, name: "CMF by Nothing Watch 3 Pro", slug: "cmf-watch-3-pro", salePrice: 9400, regularPrice: null, category: "smart-watch", brand: "Nothing" },
  { id: 38, name: "realme Buds Air 8 ANC Earbuds", slug: "realme-buds-air-8", salePrice: 4750, regularPrice: 5500, category: "earbuds", brand: "realme" },
  { id: 39, name: "JBL Boombox 4 Wireless Speaker", slug: "jbl-boombox-4", salePrice: 51500, regularPrice: null, category: "speakers", brand: "JBL" },
  { id: 40, name: "Harman Kardon Luna Speaker", slug: "harman-kardon-luna", salePrice: 15000, regularPrice: 17000, category: "speakers", brand: "Harman Kardon" },
  { id: 41, name: "Amazfit Active 3 Smart Watch Premium", slug: "amazfit-active-3", salePrice: 20000, regularPrice: 21999, category: "smart-watch", brand: "Amazfit" },
];
// ------------------Api call for newArrival_product_list
// export type Product = {
//   id: number;
//   name: string;
//   slug: string;
//   salePrice: number;
//   regularPrice: number | null;
//   category: string;
//   brand: string;
// };

// const BASE_URL = "http://127.0.0.1:8001";

// export async function getNewArrivals(): Promise<Product[]> {
//   try {
//     const res = await fetch(
//       `${BASE_URL}/api/product/get-new-arrrival/`,
//       {
//         method: "GET",
//         cache: "no-store",
//       }
//     );

//     if (!res.ok) {
//       throw new Error("Failed to fetch products");
//     }

//     const data = await res.json();

//     return data?.results || data?.data || [];
//   } catch (error) {
//     console.error("API Error:", error);
//     return [];
//   }
// }
// ---------------end
export const topBrands: Brand[] = [
  { id: 1, name: "Apple", slug: "apple" },
  { id: 2, name: "Samsung", slug: "samsung" },
  { id: 3, name: "Xiaomi", slug: "xiaomi" },
  { id: 4, name: "JBL", slug: "jbl" },
  { id: 5, name: "Anker", slug: "anker" },
  { id: 6, name: "Nothing", slug: "nothing" },
  { id: 7, name: "Sony", slug: "sony" },
  { id: 8, name: "Motorola", slug: "motorola" },
  { id: 9, name: "OnePlus", slug: "oneplus" },
  { id: 10, name: "Panasonic", slug: "panasonic" },
  { id: 11, name: "Philips", slug: "philips" },
];

// export const acProducts: Product[] = [
//   { id: 50, name: "Gree GS-18XCOA3V Cosmo Split Inverter AC - 1.5 Ton", slug: "gree-gs-18xcoa3v", salePrice: 64500, regularPrice: 81890, category: "ac", brand: "Gree" },
//   { id: 51, name: "Gree GS-18XSMA4V Shimo Split Inverter AC - 1.5 Ton", slug: "gree-gs-18xsma4v", salePrice: 64500, regularPrice: 81390, category: "ac", brand: "Gree" },
//   { id: 52, name: "Haier HSU-12 Clean Cool Inverter Pro AC - 1.0 TON", slug: "haier-hsu-12cleancool", salePrice: 45000, regularPrice: 57990, category: "ac", brand: "Haier" },
//   { id: 53, name: "Midea MSA/MSG-18CRN Air Conditioner - 1.5 Ton", slug: "midea-msa-18crn", salePrice: 47500, regularPrice: 61990, category: "ac", brand: "Midea" },
//   { id: 54, name: "Midea MSI-18CRN Inverter AC - 1.5 TON", slug: "midea-msi-18crn", salePrice: 53000, regularPrice: 73900, category: "ac", brand: "Midea" },
// ];

export const brandProductMap: Record<string, Product[]> = {
  All: featuredProducts.slice(0, 8),
  Apple: featuredProducts.filter((p) => p.brand === "Apple").slice(0, 8),
  Samsung: featuredProducts.filter((p) => p.brand === "Samsung").slice(0, 8),
  Xiaomi: [
    { id: 60, name: "Xiaomi Pad 7 Pro", slug: "xiaomi-pad-7-pro", salePrice: 38500, regularPrice: 42000, category: "tablet", brand: "Xiaomi" },
  ],
  JBL: [
    { id: 61, name: "JBL Flip 7 Portable Wireless Speaker", slug: "jbl-flip-7", salePrice: 11000, regularPrice: null, category: "speakers", brand: "JBL" },
  ],
  Anker: [
    { id: 62, name: "Anker Soundcore Flare 2", slug: "anker-flare-2", salePrice: 5900, regularPrice: 7500, category: "speakers", brand: "Anker" },
  ],
};
