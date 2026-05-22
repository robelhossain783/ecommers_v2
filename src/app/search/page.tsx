"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ui/ProductCard";

const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "http://127.0.0.1:8000";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const name = searchParams.get("name");

    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!name) return;

        const fetchData = async () => {
            try {
                const res = await fetch(
                    `${BASE_URL}/api/products/search/?name=${name}`
                );

                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.log(err);
            }
        };

        fetchData();
    }, [name]);

    return (
        <div className="container section-gap">
            <h2>Search Results for: {name}</h2>

            <div className="product-grid">
                {products.length > 0 ? (
                    products.map((product: any) => (
                        <ProductCard
                            key={product.id}
                            product={product}
                            onAddToCart={() => { }}
                        />
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
        </div>
    );
}