// // ------------------Api call for newArrival_product_list
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
// import { Product } from "@/types";
// import { Product } from "@/lib/backend_type";

// const BASE_URL = "http://127.0.0.1:8000";

// export async function getNewArrivals(): Promise<Product[]> {
//   try {
//     const res = await fetch(`${BASE_URL}/api/products/list/`);

//     if (!res.ok) {
//       throw new Error("API failed");
//     }

//     const data = await res.json();

//     console.log("API RESPONSE:", data);

//     // ✅ since backend returns ARRAY
//     return data as Product[];

//   } catch (error) {
//     console.log("API ERROR:", error);
//     return [];
//   }
// }



import { Product } from "@/lib/backend_type";
import { newArrivals as staticArrivals, brandProductMap } from "@/data";

const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    return "";
  }
  return process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
};

export async function getNewArrivals(): Promise<Product[]> {
  try {
    const res = await fetch(`${getBaseUrl()}/api/products/list/`);
    console.log("API RESP:", res);

    if (!res.ok) {
      throw new Error("API failed");
    }

    const data: Product[] = await res.json();

    return data; // ✅ direct array
  } catch (error) {
    console.log("API ERROR:", error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  // 1. Try to fetch from Django api
  try {
    const res = await fetch(`${getBaseUrl()}/api/products/${slug}/`, {
      cache: "no-store"
    });
    if (res.ok) {
      const data: Product = await res.json();
      return data;
    }
  } catch (error) {
    console.log("API Error while fetching product by slug:", error);
  }

  // 2. Fallback to local static data
  try {
    const allStatic = [
      ...staticArrivals,
      ...Object.values(brandProductMap).flat()
    ];
    const found = allStatic.find((p) => p.slug === slug);
    return found || null;
  } catch (error) {
    console.log("Fallback matching failed:", error);
    return null;
  }
}




interface GetNewTrendsParams {
  slug?: string;
  start_date?: string;
  end_date?: string;
}

export async function getNewArrival2(
  params?: GetNewTrendsParams
): Promise<Product[]> {

  try {
    const query = new URLSearchParams();

    if (params?.slug) query.append("slug", params.slug);
    if (params?.start_date) query.append("start_date", params.start_date);
    if (params?.end_date) query.append("end_date", params.end_date);

    const url = `${getBaseUrl()}/api/products/list/?${query.toString()}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
    });

    if (!res.ok) throw new Error(`API failed: ${res.status}`);

    const data = await res.json();

    // ✅ SAFE RETURN (NO BUG EVER)
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    if (Array.isArray(data?.data)) return data.data;

    return [];

  } catch (error) {
    console.log("API ERROR:", error);
    return [];
  }
}
// const BASE_URL = "http://127.0.0.1:8000";

// export async function getNewArrivals() {
//   const res = await fetch(`${BASE_URL}/api/products/list/`);
//   const data = await res.json();
//   return data;
// }