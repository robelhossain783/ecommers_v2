"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
// import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/ui/ProductCard";
import { getNewArrivals } from "@/lib/api";
import { Product } from "@/lib/backend_type";
import { useCart } from "@/context/CartContext";
// import { newArrivals as staticArrivals, brandProductMap } from "@/data";

const ICON_MAPPING: Record<string, string> = {
  // "gadget": "🔌",
  // "gadgets": "🔌",
  // "mobile-phone": "📱",
  // "mobile": "📱",
  // "phone": "📱",
  // "phones": "📱",
  // "laptop": "💻",
  // "laptops": "💻",
  // "tablet": "📟",
  // "tablets": "📟",
  // "smart-watch": "⌚",
  // "smartwatch": "⌚",
  // "wallet": "💼",
  // "wallets": "💼",
  // "backpack": "🎒",
  // "backpacks": "🎒",
  // "airpods": "🎧",
  // "speakers": "🔊",
  // "home-appliances": "🏠",
};

function CategoryProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const categorySlug = searchParams.get("category") || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<any[]>([]);
  const [categoryTitle, setCategoryTitle] = useState("Category");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProductsAndCategories() {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";

        // 1. Fetch Categories list dynamically
        let fetchedCategories: any[] = [];
        try {
          const catRes = await fetch(`${baseUrl}/api/categories/list/`);
          if (catRes.ok) {
            fetchedCategories = await catRes.json();
            setCategoriesList(fetchedCategories);
          }
        } catch (err) {
          console.error("Failed to load backend categories list:", err);
        }

        // Resolve title
        const foundCat = fetchedCategories.find((cat) =>
          cat.slug?.toLowerCase() === categorySlug.toLowerCase() ||
          cat.name?.toLowerCase().replace(/\s+/g, "-") === categorySlug.toLowerCase()
        );

        if (foundCat) {
          const icon = ICON_MAPPING[foundCat.slug?.toLowerCase()] || "";
          setCategoryTitle(`${icon} ${foundCat.name}`);
        } else if (categorySlug) {
          setCategoryTitle(`${categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)}`);
        } else {
          setCategoryTitle("All Categories");
        }

        // 2. Fetch products
        const apiProducts = await getNewArrivals();

        // Fallbacks
        // const staticList = [
        //   ...staticArrivals,
        //   ...Object.values(brandProductMap).flat()
        // ];
        // const allProducts = apiProducts.length > 0 ? apiProducts : staticList;

        // Filter by slug
        const filtered = apiProducts.filter((product) => {
          if (!product.category) return false;

          const prodCatSlug = typeof product.category === "object"
            ? product.category.slug?.toLowerCase()
            : "";
          const prodCatName = typeof product.category === "object"
            ? product.category.name?.toLowerCase().replace(/\s+/g, "-")
            : "";

          return prodCatSlug === categorySlug.toLowerCase() || prodCatName === categorySlug.toLowerCase();
        });

        setProducts(filtered);
      } catch (error) {
        console.error("Failed to load category products:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProductsAndCategories();
  }, [categorySlug]);

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    alert(`"${product.name}" added to cart!`);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "100px 0" }}>
        <div className="checkout-spinner" style={{ margin: "0 auto 16px" }}></div>
        <h2 style={{ fontSize: "18px", color: "var(--text-secondary)" }}>Filtering products...</h2>
      </div>
    );
  }

  return (
    <div className="category-products-container">
      {/* Dynamic breadcrumb */}
      <div style={{ display: "flex", gap: "8px", fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>
        <Link href="/" style={{ color: "inherit", textDecoration: "none" }}>Home</Link>
        <span>/</span>
        <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{categoryTitle}</span>
      </div>

      {/* Category Header Banner */}
      <div className="category-products-header">
        <h1 className="category-products-title">{categoryTitle}</h1>
        <p className="category-products-count">
          Showing <strong>{products.length}</strong> dynamic items in this category
        </p>
      </div>

      {/* Product Display Grid or Empty State */}
      {products.length > 0 ? (
        <div className="products-row">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => handleAddToCart(product)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-category-view">
          <span className="empty-category-icon">🛍️</span>
          <h2 className="empty-category-title">No Products Found</h2>
          <p className="empty-category-desc">
            We currently don't have any items available under <strong>{categoryTitle}</strong>.
            Our team is working hard to restock this category soon!
          </p>

          {/* <h3 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "16px", color: "var(--text-secondary)" }}>
            Explore Other Hot Categories:
          </h3>
          <div className="browse-categories-grid">
            {categoriesList.length > 0 ? (
              categoriesList.slice(0, 4).map((cat) => {
                const slug = cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-");
                const icon = ICON_MAPPING[slug.toLowerCase()] || "";
                return (
                  <Link key={cat.id} href={`/category_product?category=${slug}`} className="browse-category-card">
                    {icon} {cat.name}
                  </Link>
                );
              })
            ) : (
              <>
                <Link href="/category_product?category=mobile-phone" className="browse-category-card">
                  📱 Mobile Phones
                </Link>
                <Link href="/category_product?category=smart-watch" className="browse-category-card">
                  ⌚ Smart Watches
                </Link>
                <Link href="/category_product?category=speakers" className="browse-category-card">
                  🔊 Speakers
                </Link>
                <Link href="/category_product?category=laptops" className="browse-category-card">
                  💻 Laptops
                </Link>
              </>
            )}
          </div> */}

          <div style={{ marginTop: "40px" }}>
            <Link href="/" className="continue-shopping" style={{ background: "var(--primary)", color: "#fff", padding: "12px 32px", borderRadius: "30px", fontWeight: "700", fontSize: "14px" }}>
              Back to Home Store
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CategoryProductsPage() {
  return (
    <>
      {/* <TopBar /> */}
      <Header />
      <Suspense fallback={
        <div style={{ textAlign: "center", padding: "100px 0" }}>
          <h2>Preparing product filters...</h2>
        </div>
      }>
        <CategoryProductsContent />
      </Suspense>
      <Footer />
    </>
  );
}
