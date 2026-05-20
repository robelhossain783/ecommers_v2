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


export async function getNewArrivals(): Promise<Product[]> {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/products/list/");
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

// const BASE_URL = "http://127.0.0.1:8000";

// export async function getNewArrivals() {
//   const res = await fetch(`${BASE_URL}/api/products/list/`);
//   const data = await res.json();
//   return data;
// }