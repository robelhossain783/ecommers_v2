import { Product, Category } from "@/lib/backend_type";
export const bannerSlides = [
  {
    id: 1,
    title: "Smart Fitness Watch Pro",
    subtitle: "Track your health, heart rate & sleep with 7 days battery life",
    cta: "Shop Smartwatch",
    href: "/category/smartwatch",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1600&q=80",
    accentColor: "#00b4d8",
  },
  {
    id: 2,
    title: "Samsung Galaxy S26 Ultra",
    subtitle: "Save up to ৳11,000 — Limited Time Offer",
    cta: "Explore Galaxy",
    href: "/product/galaxy-s26-ultra-5g",
    image:
      "https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?auto=format&fit=crop&w=1600&q=80",
    accentColor: "#4fc3f7",
  },
  {
    id: 3,
    title: "MacBook Pro M3 Max",
    subtitle: "Power meets performance for creators",
    cta: "Buy MacBook",
    href: "/category/macbook",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1600&q=80",
    accentColor: "#a8e6cf",
  },
  {
    id: 2,
    title: "Portable Bluetooth Speaker Xtreme",
    subtitle: "Deep bass, waterproof design & 12 hours playtime",
    cta: "Shop Speaker",
    href: "/category/speaker",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1600&q=80",
    accentColor: "#ff6b6b",
  },
  {
    id: 4,
    title: "Wireless Neckband Earphones",
    subtitle: "Crystal clear sound with 20 hours battery backup",
    cta: "Shop Neckband",
    href: "/category/neckband",
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1600&q=80",
    accentColor: "#4fc3f7",
  },
];
export const featuredCategories: Category[] = [
  { id: 1, name: "Mobile Phone", slug: "mobile-phone" },
  { id: 2, name: "Laptop", slug: "laptops" },
  { id: 3, name: "Tablet", slug: "tablet" },
  { id: 4, name: "Smart Watch", slug: "smart-watch" },
  { id: 5, name: "AirPods", slug: "airpods" },
  { id: 6, name: "Speakers", slug: "speakers" },
  { id: 7, name: "Home Appliances", slug: "home-appliances" },

];

// export const newTrends: Product[] = [
//   { id: 1, name: "Galaxy S26 Ultra 5G", slug: "galaxy-s26-ultra-5g", salePrice: "125000", regularPrice: 136000, brand: "Samsung" },
//   { id: 2, name: "Nothing Phone (4a) Pro", slug: "nothing-phone-4a-pro", salePrice: 58000, regularPrice: null, category: "mobile-phone", brand: "Nothing" },
//   { id: 3, name: "Galaxy A57 5G", slug: "galaxy-a57-5g", salePrice: 0, regularPrice: null, badge: "TBA", category: "mobile-phone", brand: "Samsung" },
//   { id: 4, name: "Xiaomi Pad 7", slug: "xiaomi-pad-7", salePrice: 38500, regularPrice: 42000, category: "tablet", brand: "Xiaomi" },
//   { id: 5, name: "iPhone 17", slug: "iphone-17", salePrice: 96499, regularPrice: 102000, category: "mobile-phone", brand: "Apple" },
//   { id: 6, name: "Galaxy TAB A11+", slug: "galaxy-tab-a11-plus", salePrice: 27000, regularPrice: null, category: "tablet", brand: "Samsung" },
//   { id: 7, name: "iPad Air M4 - 2026", slug: "ipad-air-m4", salePrice: 76000, regularPrice: 88500, category: "tablet", brand: "Apple" },
//   { id: 8, name: "MacBook Air M5 13-Inch", slug: "macbook-air-m5", salePrice: 134500, regularPrice: null, category: "laptop", brand: "Apple" },
//   { id: 9, name: "MacBook Pro M5 Pro 14-Inch", slug: "macbook-pro-m5-pro-14-inch", salePrice: 282000, regularPrice: null, category: "laptop", brand: "Apple" },
// ];

// export const featuredProducts: Product[] = [
//   { id: 10, name: "iPhone 16 Pro Max", slug: "iphone-16-pro-max", salePrice: 146000, regularPrice: 165000, category: "mobile-phone", brand: "Apple" },
//   { id: 11, name: "iPhone 17", slug: "iphone-17", salePrice: 96499, regularPrice: 102000, category: "mobile-phone", brand: "Apple" },
//   { id: 12, name: "Galaxy Buds Core", slug: "galaxy-buds-core", salePrice: 4500, regularPrice: 4800, category: "airpods", brand: "Samsung" },
//   { id: 13, name: "PHILIPS HD4929 Induction Cooker", slug: "philips-hd4929-induction-cooker", salePrice: 7000, regularPrice: 9450, category: "home-appliances", brand: "Philips" },
//   { id: 14, name: "Galaxy Tab A11", slug: "galaxy-tab-a11", salePrice: 15500, regularPrice: null, category: "tablet", brand: "Samsung" },
//   { id: 15, name: "Gree GS-18XCOA3V Cosmo Inverter AC", slug: "gree-gs-18xcoa3v", salePrice: 64500, regularPrice: 81890, category: "home-appliances", brand: "Gree" },
//   { id: 16, name: "Haier HSU-12TurboAqua Non Inverter AC", slug: "haier-hsu-12", salePrice: 42900, regularPrice: 50990, category: "home-appliances", brand: "Haier" },
//   { id: 17, name: "CMF Watch Pro 2 BT Calling Smart Watch", slug: "cmf-watch-pro-2", salePrice: 5750, regularPrice: 7500, category: "smart-watch", brand: "Nothing" },
//   { id: 18, name: "MacBook Air M5 15-Inch", slug: "macbook-air-m5-15-inch", salePrice: 171000, regularPrice: null, category: "laptop", brand: "Apple" },
//   { id: 19, name: "QCY MeloBuds N20 ANC TWS Earbuds", slug: "qcy-melobuds-n20", salePrice: 2250, regularPrice: null, category: "earbuds", brand: "QCY" },
//   { id: 20, name: "iPad 11th Gen - 2025", slug: "ipad-11th-gen", salePrice: 44500, regularPrice: 48000, category: "tablet", brand: "Apple" },
//   { id: 21, name: "MacBook Air M4 13-Inch", slug: "macbook-air-m4-13-inch", salePrice: 142500, regularPrice: 146000, category: "laptop", brand: "Apple" },
//   { id: 22, name: "Apple Mac mini M4", slug: "apple-mac-mini-m4", salePrice: 89999, regularPrice: null, category: "laptop", brand: "Apple" },
//   { id: 23, name: "Galaxy Watch8", slug: "galaxy-watch8", salePrice: 24600, regularPrice: null, category: "smart-watch", brand: "Samsung" },
//   { id: 24, name: "QCY HT15 Buds ANC TWS Earbuds", slug: "qcy-ht15-buds", salePrice: 1900, regularPrice: 2300, category: "earbuds", brand: "QCY" },
//   { id: 25, name: "OnePlus Bullets Wireless Z3", slug: "oneplus-bullets-z3", salePrice: 2200, regularPrice: null, category: "earphones", brand: "OnePlus" },
// ];

export const newArrivals: Product[] = [
  {
    id: 30,
    name: "Anker Nano 45W Power Bank 10000mAh",
    slug: "anker-nano-45w-powerbank",

    image: null,
    description: "Fast charging power bank",

    sell_price: "5000",
    regular_price: "5500",

    stock: 10,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 1,
      name: "Accessories",
      slug: "accessories",
    },
  },
  {
    id: 31,
    name: "Apple Watch Series 11",
    slug: "apple-watch-series-11",

    image: null,
    description: "Smart watch",

    sell_price: "44000",
    regular_price: "53500",

    stock: 5,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 2,
      name: "Smart Watch",
      slug: "smart-watch",
    },
  },
  {
    id: 32,
    name: "Galaxy Buds4 Pro",
    slug: "galaxy-buds4-pro",

    image: null,
    description: "Wireless earbuds",

    sell_price: "23500",
    regular_price: "25500",

    stock: 7,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 3,
      name: "Earbuds",
      slug: "earbuds",
    },
  },
  {
    id: 33,
    name: "AirPods Pro 3",
    slug: "airpods-pro-3",

    image: null,
    description: "Apple earbuds",

    sell_price: "27500",
    regular_price: "34000",

    stock: 4,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 4,
      name: "AirPods",
      slug: "airpods",
    },
  },
  {
    id: 34,
    name: "Anker Soundcore Liberty 5 ANC",
    slug: "anker-liberty-5",

    image: null,
    description: "Noise cancelling earbuds",

    sell_price: "7150",
    regular_price: "8500",

    stock: 8,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 3,
      name: "Earbuds",
      slug: "earbuds",
    },
  },
  {
    id: 35,
    name: "Apple Watch SE 3",
    slug: "apple-watch-se-3",

    image: null,
    description: "Apple smart watch",

    sell_price: "36000",
    regular_price: "42000",

    stock: 6,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 2,
      name: "Smart Watch",
      slug: "smart-watch",
    },
  },
  {
    id: 36,
    name: "Galaxy Watch8 Classic",
    slug: "galaxy-watch8-classic",

    image: null,
    description: "Samsung watch",

    sell_price: "31500",
    regular_price: "40500",

    stock: 5,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 2,
      name: "Smart Watch",
      slug: "smart-watch",
    },
  },
  {
    id: 37,
    name: "CMF by Nothing Watch 3 Pro",
    slug: "cmf-watch-3-pro",

    image: null,
    description: "Budget smart watch",

    sell_price: "9400",
    regular_price: null,

    stock: 12,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 2,
      name: "Smart Watch",
      slug: "smart-watch",
    },
  },
  {
    id: 38,
    name: "realme Buds Air 8 ANC",
    slug: "realme-buds-air-8",

    image: null,
    description: "ANC earbuds",

    sell_price: "4750",
    regular_price: "5500",

    stock: 15,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 3,
      name: "Earbuds",
      slug: "earbuds",
    },
  },
  {
    id: 39,
    name: "JBL Boombox 4 Wireless Speaker",
    slug: "jbl-boombox-4",

    image: null,
    description: "Premium speaker",

    sell_price: "51500",
    regular_price: null,

    stock: 3,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 5,
      name: "Speakers",
      slug: "speakers",
    },
  },
  {
    id: 40,
    name: "Harman Kardon Luna Speaker",
    slug: "harman-kardon-luna",

    image: null,
    description: "Luxury speaker",

    sell_price: "15000",
    regular_price: "17000",

    stock: 4,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 5,
      name: "Speakers",
      slug: "speakers",
    },
  },
  {
    id: 41,
    name: "Amazfit Active 3 Smart Watch Premium",
    slug: "amazfit-active-3",

    image: null,
    description: "Fitness watch",

    sell_price: "20000",
    regular_price: "21999",

    stock: 9,
    is_active: true,
    created_at: new Date().toISOString(),

    category: {
      id: 2,
      name: "Smart Watch",
      slug: "smart-watch",
    },
  },
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
// export const topBrands: Brand[] = [
//   { id: 1, name: "Apple", slug: "apple" },
//   { id: 2, name: "Samsung", slug: "samsung" },
//   { id: 3, name: "Xiaomi", slug: "xiaomi" },
//   { id: 4, name: "JBL", slug: "jbl" },
//   { id: 5, name: "Anker", slug: "anker" },
//   { id: 6, name: "Nothing", slug: "nothing" },
//   { id: 7, name: "Sony", slug: "sony" },
//   { id: 8, name: "Motorola", slug: "motorola" },
//   { id: 9, name: "OnePlus", slug: "oneplus" },
//   { id: 10, name: "Panasonic", slug: "panasonic" },
//   { id: 11, name: "Philips", slug: "philips" },
// ];

// export const acProducts: Product[] = [
//   { id: 50, name: "Gree GS-18XCOA3V Cosmo Split Inverter AC - 1.5 Ton", slug: "gree-gs-18xcoa3v", salePrice: 64500, regularPrice: 81890, category: "ac", brand: "Gree" },
//   { id: 51, name: "Gree GS-18XSMA4V Shimo Split Inverter AC - 1.5 Ton", slug: "gree-gs-18xsma4v", salePrice: 64500, regularPrice: 81390, category: "ac", brand: "Gree" },
//   { id: 52, name: "Haier HSU-12 Clean Cool Inverter Pro AC - 1.0 TON", slug: "haier-hsu-12cleancool", salePrice: 45000, regularPrice: 57990, category: "ac", brand: "Haier" },
//   { id: 53, name: "Midea MSA/MSG-18CRN Air Conditioner - 1.5 Ton", slug: "midea-msa-18crn", salePrice: 47500, regularPrice: 61990, category: "ac", brand: "Midea" },
//   { id: 54, name: "Midea MSI-18CRN Inverter AC - 1.5 TON", slug: "midea-msi-18crn", salePrice: 53000, regularPrice: 73900, category: "ac", brand: "Midea" },
// ];

export const brandProductMap: Record<string, Product[]> = {
  Xiaomi: [
    {
      id: 60,
      name: "Xiaomi Pad 7 Pro",
      slug: "xiaomi-pad-7-pro",

      image: null,
      description: "Premium Xiaomi tablet",

      sell_price: "38500",
      regular_price: "42000",

      stock: 10,
      is_active: true,
      created_at: new Date().toISOString(),

      category: {
        id: 1,
        name: "Tablet",
        slug: "tablet",
      },
    },
  ],

  JBL: [
    {
      id: 61,
      name: "JBL Flip 7 Portable Wireless Speaker",
      slug: "jbl-flip-7",

      image: null,
      description: "Portable Bluetooth speaker",

      sell_price: "11000",
      regular_price: null,

      stock: 7,
      is_active: true,
      created_at: new Date().toISOString(),

      category: {
        id: 2,
        name: "Speakers",
        slug: "speakers",
      },
    },
  ],

  Anker: [
    {
      id: 62,
      name: "Anker Soundcore Flare 2",
      slug: "anker-flare-2",

      image: null,
      description: "Portable speaker with LED",

      sell_price: "5900",
      regular_price: "7500",

      stock: 12,
      is_active: true,
      created_at: new Date().toISOString(),

      category: {
        id: 2,
        name: "Speakers",
        slug: "speakers",
      },
    },
  ],
};