"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    async function loadCategories() {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://127.0.0.1:8000";
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

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || categoriesList.length === 0) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    return () => el.removeEventListener("scroll", checkScroll);
  }, [categoriesList, checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstItem = el.querySelector(".category-item") as HTMLElement;
    const itemWidth = firstItem?.offsetWidth || 128;
    const gap = 12;
    const visible = Math.floor(el.clientWidth / (itemWidth + gap)) || 1;
    const scrollAmount = (itemWidth + gap) * visible;
    el.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  return (
    <div className="container section-gap">
      <div className="section-header">
        <h2 className="section-title">Featured Categories</h2>
        <a href="/category_product" className="see-all">See All</a>
      </div>

      <div className="categories-slider-wrap">
        <div className="categories-slider" ref={scrollRef}>
          {categoriesList.map((cat) => {
            const icon = CATEGORY_ICONS[cat.slug] || "📦";
            return (
              <a
                key={cat.id}
                href={`/category_product?category=${cat.slug}`}
                className="category-item"
              >
                <div className="cat-icon-wrap">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} className="cat-icon-img" />
                  ) : (
                    <span className="cat-icon-emoji">{icon}</span>
                  )}
                </div>
                <span className="cat-name">{cat.name}</span>
              </a>
            );
          })}
        </div>

        {canScrollLeft && (
          <button className="categories-slider-arrow left" onClick={() => scroll("left")} aria-label="Previous">
            <ChevronLeft size={18} />
          </button>
        )}

        {canScrollRight && (
          <button className="categories-slider-arrow right" onClick={() => scroll("right")} aria-label="Next">
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
