"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

interface Category {
  id?: number;
  name: string;
  slug: string;
  image?: string | null;
}

const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  "mobile-phone": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80",
  laptops: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  laptop: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
  tablet: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
  tablets: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80",
  "smart-watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
  smartwatch: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80",
  airpods: "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=400&q=80",
  speakers: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80",
  "home-appliances": "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=400&q=80",
  wallet: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80",
  wallets: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=400&q=80",
  jeans: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80",
  tshirt: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80",
  gadget: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=400&q=80",
};

export default function CategoriesSection() {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    setHasOverflow(el.scrollWidth > el.clientWidth);
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
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      observer.disconnect();
    };
  }, [categoriesList, checkScroll]);

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstItem = el.querySelector(".category-item") as HTMLElement;
    const itemWidth = firstItem?.offsetWidth || 136;
    const gap = 14;
    const visible = Math.floor(el.clientWidth / (itemWidth + gap)) || 1;
    const scrollAmount = (itemWidth + gap) * visible;
    el.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
  };

  if (categoriesList.length === 0) return null;

  return (
    <div className="container section-gap">
      <div className="section-header">
        <h2 className="section-title">
          Featured Categories
        </h2>
        {hasOverflow && (
          <a href="/category_product" className="see-all">See All</a>
        )}
      </div>

      <div className="categories-slider-wrap">
        <div className="categories-slider" ref={scrollRef}>
          {categoriesList.map((cat) => {
            const imgSrc =
              cat.image ||
              DEFAULT_CATEGORY_IMAGES[cat.slug] ||
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80";

            return (
              <a
                key={cat.id || cat.slug}
                href={`/category_product?category=${cat.slug}`}
                className="category-item"
              >
                <div className="cat-icon-box">
                  <img src={imgSrc} alt={cat.name} className="cat-icon-img" />
                </div>
                <span className="cat-name">{cat.name}</span>
                <span className="cat-explore-link">
                  Explore <ArrowRight size={10} />
                </span>
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
