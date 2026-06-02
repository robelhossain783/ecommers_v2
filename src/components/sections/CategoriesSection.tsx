// import { featuredCategories } from "@/data";

// const CATEGORY_ICONS: Record<string, string> = {
//   "mobile-phone": "📱",
//   "laptops": "💻",
//   "tablet": "📟",
//   "smart-watch": "⌚",
//   "airpods": "🎧",
//   "speakers": "🔊",
//   "home-appliances": "🏠",
// };

// export default function CategoriesSection() {
//   return (
//     <div className="container section-gap">
//       <div className="section-header">
//         <h2 className="section-title">Featured Categories</h2>
//         <a href="/category" className="see-all">See All Categories</a>
//       </div>
//       <div className="categories-grid">
//         {featuredCategories.map((cat) => (
//           <a key={cat.id} href={`/category_product/${cat.slug}`} className="category-item">
//             <div className="cat-icon-wrap">
//               {CATEGORY_ICONS[cat.slug] || "📦"}
//             </div>
//             <span className="cat-name">{cat.name}</span>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }




"use client";

import { useEffect, useState } from "react";

interface Category {
  id?: number;
  name: string;
  slug: string;
  image?: string | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  gadget: "🔌",
  gadgets: "🔌",
  "mobile-phone": "📱",
  mobile: "📱",
  phone: "📱",
  phones: "📱",
  laptop: "💻",
  laptops: "💻",
  tablet: "📟",
  tablets: "📟",
  "smart-watch": "⌚",
  smartwatch: "⌚",
  wallet: "💼",
  wallets: "💼",
  backpack: "🎒",
  backpacks: "🎒",
  airpods: "🎧",
  speakers: "🔊",
  "home-appliances": "🏠",
};

export default function CategoriesSection() {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const baseUrl =
          process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

        const res = await fetch(`${baseUrl}/api/categories/list/`);

        if (!res.ok) return;

        const data = await res.json();

        setCategoriesList(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="container section-gap">
      <div className="section-header">
        <h2 className="section-title">Featured Categories</h2>
        {/* <a href="/product_category" className="see-all">
          See All Categories
        </a> */}
      </div>

      <div className="categories-grid">
        {categoriesList.map((cat) => {
          const icon =
            CATEGORY_ICONS[cat.slug] || "📦";

          return (
            <a
              key={cat.id}
              // href={`/category_product/${cat.slug}`}
              href={`/category_product?category=${cat.slug}`}
              className="category-item"
            >
              <div className="cat-icon-wrap">
                {cat.image ? (
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: "40px",
                      height: "40px",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  icon
                )}
              </div>

              <span className="cat-name">{cat.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// FINAL CODE

// "use client";

// import { useEffect, useState } from "react";

// interface Category {
//   id?: number;
//   name: string;
//   slug: string;
//   icon?: string;
// }

// export default function CategoriesSection() {
//   const [categoriesList, setCategoriesList] = useState<Category[]>([]);

//   useEffect(() => {
//     async function loadCategories() {
//       try {
//         const baseUrl =
//           process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

//         const res = await fetch(`${baseUrl}/api/categories/list/`);

//         if (!res.ok) return;

//         const data = await res.json();

//         const mapped = data.map((cat: any) => ({
//           id: cat.id,
//           name: cat.name,
//           slug: cat.slug,
//           icon: cat.icon || "📦", // fallback icon
//         }));

//         setCategoriesList(mapped);
//       } catch (err) {
//         console.error("Failed to fetch categories:", err);
//       }
//     }

//     loadCategories();
//   }, []);

//   return (
//     <div className="container section-gap">
//       <div className="section-header">
//         <h2 className="section-title">Featured Categories</h2>
//         <a href="/category" className="see-all">
//           See All Categories
//         </a>
//       </div>

//       <div className="categories-grid">
//         {categoriesList.map((cat) => (
//           <a
//             key={cat.slug}
//             href={`/category_product/${cat.slug}`}
//             className="category-item"
//           >
//             <div className="cat-icon-wrap">{cat.icon}</div>
//             <span className="cat-name">{cat.name}</span>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }