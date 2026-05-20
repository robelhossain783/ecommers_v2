export default function PromoBanners() {
  return (
    <div className="container section-gap">
      <div className="promo-grid">
        <a href="/applegadgetscare" className="promo-card" style={{
          background: "linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)"
        }}>
          {/* Todo - update promo banner every month to do that from db admin panel */}
          <div className="promo-text">
            <strong>AG Care Service</strong>
            <span>Professional repair &amp; support</span>
          </div>
          <span style={{ position: "absolute", right: "20px", fontSize: "48px" }}>🛠️</span>
        </a>

        <a href="/category/induction-cooker" className="promo-card" style={{
          background: "linear-gradient(135deg, #b71c1c 0%, #e53935 100%)"
        }}>
          <div className="promo-text">
            <strong>Induction Cookers</strong>
            <span>Great deals on kitchen appliances</span>
          </div>
          <span style={{ position: "absolute", right: "20px", fontSize: "48px" }}>🍳</span>
        </a>
      </div>
    </div>
  );
}
