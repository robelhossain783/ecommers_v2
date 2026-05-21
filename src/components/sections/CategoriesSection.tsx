import { featuredCategories } from "@/data";

const CATEGORY_ICONS: Record<string, string> = {
  "mobile-phone": "📱",
  "laptops": "💻",
  "tablet": "📟",
  "smart-watch": "⌚",
  "airpods": "🎧",
  "speakers": "🔊",
  "home-appliances": "🏠",
};

export default function CategoriesSection() {
  return (
    <div className="container section-gap">
      <div className="section-header">
        <h2 className="section-title">Featured Categories</h2>
        <a href="/category" className="see-all">See All Categories</a>
      </div>
      <div className="categories-grid">
        {featuredCategories.map((cat) => (
          <a key={cat.id} href={`/category/${cat.slug}`} className="category-item">
            <div className="cat-icon-wrap">
              {CATEGORY_ICONS[cat.slug] || "📦"}
            </div>
            <span className="cat-name">{cat.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
