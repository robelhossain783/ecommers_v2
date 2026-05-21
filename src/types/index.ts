// export interface Product {
//   id: number;
//   name: string;
//   slug: string;
//   salePrice: number;
//   regularPrice: number | null;
//   badge?: string;
//   category: string;
//   brand: string;
//   isOutOfStock?: boolean;
// }

// export interface Category {
//   id: number;
//   name: string;
//   icon: string;
//   slug: string;
// }

export interface Brand {
  id: number;
  name: string;
  slug: string;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface BannerSlide {
  id: number;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  bg: string;
  accentColor: string;
}