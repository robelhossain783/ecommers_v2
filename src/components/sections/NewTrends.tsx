"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ProductCard from "@/components/ui/ProductCard";
import { getNewArrivals } from "@/lib/api";
import { Product } from "@/lib/backend_type";

export default function NewTrends() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const sliderRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    async function load() {
      try {
        const data = await getNewArrivals();
        setProducts(data || []);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const check = () => setHasOverflow(el.scrollWidth > el.clientWidth);
    check();
    const observer = new ResizeObserver(check);
    observer.observe(el);
    return () => observer.disconnect();
  }, [products]);

  const scrollBy = (dir: "left" | "right") => {
    const el = sliderRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const el = sliderRef.current;
    if (!el) return;
    isDragging.current = true;
    startX.current = e.pageX - el.offsetLeft;
    scrollLeft.current = el.scrollLeft;
    el.style.cursor = "grabbing";
    el.style.userSelect = "none";
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const el = sliderRef.current;
    if (!el) return;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    el.scrollLeft = scrollLeft.current - walk;
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (sliderRef.current) {
      sliderRef.current.style.cursor = "grab";
      sliderRef.current.style.userSelect = "";
    }
  };

  if (loading || products.length === 0) return null;

  return (
    <div className="container section-gap">
      <div className="section-header">
        <h2 className="section-title">Just For You</h2>
      </div>

      <div className="new-arrival-slider-wrapper">
        {hasOverflow && (
          <button
            onClick={() => scrollBy("left")}
            className="nar-slider-arrow nar-slider-arrow-left"
            aria-label="Scroll left"
          >
            ‹
          </button>
        )}

        {hasOverflow && (
          <button
            onClick={() => scrollBy("right")}
            className="nar-slider-arrow nar-slider-arrow-right"
            aria-label="Scroll right"
          >
            ›
          </button>
        )}

        <div
          ref={sliderRef}
          className="nar-slider-track"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {products.map((p) => (
            <div key={p.id} className="nar-slider-item">
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <Link href="/all-products" className="see-all see-more-btn">
          See More
        </Link>
      </div>
    </div>
  );
}
