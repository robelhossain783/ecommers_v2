"use client";

import { useEffect, useState } from "react";
import { getNewArrivals, getNewArrival2 } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import CategoryRowSlider from "@/components/sections/CategoryRowSlider";

interface Category {
  id?: number;
  name: string;
  slug: string;
}

export default function CategoryProductsSection() {
  const [categoryGroups, setCategoryGroups] = useState<{
    [categorySlug: string]: { name: string; slug: string; products: Product[] };
  }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

        // 1. Fetch category list
        let categories: Category[] = [];
        try {
          const resCat = await fetch(`${baseUrl}/api/categories/list/`);
          if (resCat.ok) {
            categories = await resCat.json();
          }
        } catch (e) {
          console.error("Failed to fetch categories list", e);
        }

        // 2. Fetch all products
        const allProducts = await getNewArrivals();

        // Prepare grouping container
        const groups: {
          [slug: string]: { name: string; slug: string; products: Product[] };
        } = {};

        // Pre-fill categories from categories API
        categories.forEach((cat) => {
          if (cat.slug) {
            groups[cat.slug] = {
              name: cat.name,
              slug: cat.slug,
              products: [],
            };
          }
        });

        // Unique products map to avoid duplicate items
        const uniqueProducts = new Map<number, Product>();
        allProducts.forEach((p) => {
          if (p && p.id) uniqueProducts.set(p.id, p);
        });

        // Group products by category
        Array.from(uniqueProducts.values()).forEach((product) => {
          let catSlug = "";
          let catName = "";

          if (typeof product.category === "object" && product.category !== null) {
            catSlug = product.category.slug || "";
            catName = product.category.name || "";
          } else if (typeof product.category === "string") {
            catName = product.category;
            catSlug = product.category.toLowerCase().trim().replace(/\s+/g, "-");
          }

          if (catSlug) {
            // Find existing group by matching slug or category name
            const existingKey = Object.keys(groups).find(
              (key) => key === catSlug || groups[key].name.toLowerCase() === catName.toLowerCase()
            );

            if (existingKey) {
              groups[existingKey].products.push(product);
            } else {
              groups[catSlug] = {
                name: catName || catSlug,
                slug: catSlug,
                products: [product],
              };
            }
          }
        });

        // Also fetch per-category if categories API exists but returned products were sparse
        for (const cat of categories) {
          if (cat.slug && groups[cat.slug] && groups[cat.slug].products.length === 0) {
            try {
              const catProds = await getNewArrival2({ slug: cat.slug });
              if (catProds && catProds.length > 0) {
                groups[cat.slug].products = catProds;
              }
            } catch (e) {
              console.error(`Failed to fetch products for category ${cat.slug}`, e);
            }
          }
        }

        setCategoryGroups(groups);
      } catch (err) {
        console.error("Failed to load category products:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return null;

  const validGroups = Object.values(categoryGroups).filter(
    (g) => g.products && g.products.length > 0
  );

  if (validGroups.length === 0) return null;

  return (
    <div className="category-products-sections">
      {validGroups.map((group) => (
        <CategoryRowSlider
          key={group.slug}
          title={group.name}
          categorySlug={group.slug}
          products={group.products}
        />
      ))}
    </div>
  );
}
