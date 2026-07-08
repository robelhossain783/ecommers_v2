"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

import { getNewArrival2 } from "@/lib/api";
import ProductCard from "@/components/ui/ProductCard";
import { Product } from "@/lib/backend_type";

interface NewArrivalsProps {
  onAddToCart?: () => void;
}

export default function NewArrivals({ onAddToCart }: NewArrivalsProps) {
  const { addToCart } = useCart();
  const sliderRef = useRef<HTMLDivElement>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [hasOverflow, setHasOverflow] = useState(false);

  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    async function load() {
      const data = await getNewArrival2({ is_new_arrivals: true });
      setProducts(data);
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

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    onAddToCart?.();
  };

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

  if (products.length === 0) return null;

  return (
    <div className="container section-gap">

      <div className="section-header">
        <h2 className="section-title">New Arrival</h2>
        <Link href="/new-arrivals" className="see-all">View All</Link>
      </div>

      <div className="new-arrival-slider-wrapper">
        {hasOverflow && (
          <button onClick={() => scrollBy("left")} className="nar-slider-arrow nar-slider-arrow-left" aria-label="Scroll left">‹</button>
        )}

        {hasOverflow && (
          <button onClick={() => scrollBy("right")} className="nar-slider-arrow nar-slider-arrow-right" aria-label="Scroll right">›</button>
        )}

        <div
          ref={sliderRef}
          className="nar-slider-track"
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {products.map((product) => (
            <div key={product.id} className="nar-slider-item">
              <ProductCard
                product={product}
                onAddToCart={() => handleAddToCart(product)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
