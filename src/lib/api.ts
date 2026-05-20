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