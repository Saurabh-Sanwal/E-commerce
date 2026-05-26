import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams, Link } from "react-router";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);
  const [qty, setQty] = useState(1);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await api.get("/products/");
        const p = res.data.find(item => item._id === id);
        setProduct(p);
      } finally {
        setLoading(false);
      }
    };
    loadProduct();
  }, [id]);

  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) { showToast("Please login first", "error"); return; }
    setAdding(true);
    try {
      for (let i = 0; i < qty; i++) {
        await api.post("/cart/add", { userId, productId: product._id });
      }
      const res = await api.get(`/cart/${userId}`);
      const total = res.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
      showToast(`Added ${qty} item${qty > 1 ? "s" : ""} to cart!`);
    } catch {
      showToast("Failed to add to cart", "error");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return (
    <div style={{ maxWidth: 900, margin: "60px auto", padding: "0 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      <div className="skeleton" style={{ height: 380, borderRadius: 20 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div className="skeleton" style={{ height: 16, width: "40%" }} />
        <div className="skeleton" style={{ height: 36, width: "90%" }} />
        <div className="skeleton" style={{ height: 24, width: "30%" }} />
        <div className="skeleton" style={{ height: 80 }} />
      </div>
    </div>
  );

  if (!product) return (
    <div style={{ textAlign: "center", padding: "80px 20px", color: "var(--text-muted)" }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <p>Product not found.</p>
      <Link to="/" style={{ color: "var(--accent)", textDecoration: "none", marginTop: 16, display: "inline-block" }}>← Back to store</Link>
    </div>
  );

  return (
    <div className="page-enter" style={{ minHeight: "calc(100vh - 64px)", padding: "40px 24px 80px" }}>
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999,
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(34,197,94,0.95)",
          color: "#fff", padding: "12px 20px", borderRadius: 12,
          fontSize: 14, fontWeight: 500, boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "fadeUp 0.3s ease",
        }}>
          {toast.type === "error" ? "✕ " : "✓ "}{toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--text-muted)" }}>
          <Link to="/" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <span style={{ color: "var(--text-muted)" }}>{product.category}</span>
              <span>/</span>
            </>
          )}
          <span style={{ color: "var(--text-secondary)" }}>{product.title?.substring(0, 30)}…</span>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 48,
          alignItems: "start",
        }}
          className="product-grid"
        >
          {/* Image */}
          <div className="card" style={{
            padding: 0, overflow: "hidden",
            background: "#1a1a26",
            display: "flex", alignItems: "center", justifyContent: "center",
            minHeight: 380,
          }}>
            <img
              src={product.image}
              alt={product.title}
              style={{ maxWidth: "80%", maxHeight: 320, objectFit: "contain", padding: 32 }}
              onError={e => { e.target.style.display = "none"; }}
            />
          </div>

          {/* Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {product.category && <span className="tag" style={{ alignSelf: "flex-start" }}>{product.category}</span>}

            <h1 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(1.4rem, 3vw, 2rem)",
              fontWeight: 700, color: "var(--text-primary)",
              lineHeight: 1.25,
            }}>{product.title}</h1>

            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 36, fontWeight: 700, color: "var(--accent)",
              }}>₹{Number(product.price).toLocaleString("en-IN")}</span>
            </div>

            {product.description && (
              <p style={{
                color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7,
                padding: "16px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)",
              }}>{product.description}</p>
            )}

            {/* Stock info */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 8, height: 8, borderRadius: "50%",
                background: product.stock > 0 ? "var(--success)" : "var(--danger)",
                display: "inline-block",
              }} />
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </span>
            </div>

            {/* Quantity */}
            {product.stock > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 13, color: "var(--text-secondary)", fontWeight: 500 }}>Qty:</span>
                <div style={{ display: "flex", alignItems: "center", gap: 0, background: "var(--bg-card)", borderRadius: 10, border: "1px solid var(--border)", overflow: "hidden" }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{
                      width: 36, height: 36, background: "transparent", border: "none",
                      color: "var(--text-primary)", cursor: "pointer", fontSize: 18,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.target.style.background = "var(--bg-card-hover)"}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                  >−</button>
                  <span style={{
                    width: 40, textAlign: "center", fontWeight: 600, fontSize: 14,
                    color: "var(--text-primary)",
                  }}>{qty}</span>
                  <button
                    onClick={() => setQty(q => Math.min(product.stock, q + 1))}
                    style={{
                      width: 36, height: 36, background: "transparent", border: "none",
                      color: "var(--text-primary)", cursor: "pointer", fontSize: 18,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.target.style.background = "var(--bg-card-hover)"}
                    onMouseLeave={e => e.target.style.background = "transparent"}
                  >+</button>
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button
                onClick={addToCart}
                disabled={adding || product.stock === 0}
                className="btn-primary"
                style={{ flex: 1, height: 50, fontSize: 15, opacity: product.stock === 0 ? 0.4 : 1 }}
              >
                {adding ? "Adding…" : product.stock === 0 ? "Out of Stock" : "🛒 Add to Cart"}
              </button>
            </div>

            {/* Perks */}
            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 8,
            }}>
              {["🚚 Free Delivery", "✅ Genuine Product", "↩️ Easy Returns", "🔒 Secure Checkout"].map(perk => (
                <div key={perk} style={{
                  padding: "10px 12px", background: "var(--bg-card)",
                  borderRadius: 10, border: "1px solid var(--border)",
                  fontSize: 12, color: "var(--text-secondary)",
                }}>{perk}</div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}