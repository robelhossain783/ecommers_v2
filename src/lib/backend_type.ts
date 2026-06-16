
export interface Category {
  id: number;
  name: string;
  //   icon: string;
  slug: string;
}

export interface Product {
  id: number;

  category: any;

  name: string;
  slug: string;

  image: string | null;
  description: string;

  sell_price: string;
  regular_price: string | null;

  stock: number;
  is_active: boolean;
  is_new_arrivals?: boolean;

  created_at: string;

  badge?: string;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
}