import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";

function ProductSkeleton() {
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      <div className="skeleton" style={{ height: 200 }} />
      <div style={{ padding: "16px" }}>
        <div className="skeleton" style={{ height: 16, width: "75%", marginBottom: 8 }} />
        <div className="skeleton" style={{ height: 13, width: "50%", marginBottom: 16 }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="skeleton" style={{ height: 20, width: 60 }} />
          <div className="skeleton" style={{ height: 34, width: 72, borderRadius: 8 }} />
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const loadProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/products?search=${search}&category=${category}`);
      setProducts(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProducts(); }, [search, category]);

  const addToCart = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (!userId) { showToast("Please login to add items", "error"); return; }
    setAddingId(productId);
    try {
      const res = await api.post(`/cart/add`, { userId, productId });
      const total = res.data.cart.items.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cartCount", total);
      window.dispatchEvent(new Event("cartUpdated"));
      showToast("Added to cart!");
    } catch {
      showToast("Failed to add to cart", "error");
    } finally {
      setAddingId(null);
    }
  };

  const categories = ["", "Laptops", "Mobiles", "Tablets"];

  return (
    <div className="page-enter" style={{ minHeight: "calc(100vh - 64px)", background: "var(--bg-primary)" }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 999,
          background: toast.type === "error" ? "rgba(239,68,68,0.95)" : "rgba(34,197,94,0.95)",
          color: "#fff", padding: "12px 20px", borderRadius: 12,
          fontSize: 14, fontWeight: 500,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          animation: "fadeUp 0.3s ease",
        }}>
          {toast.type === "error" ? "✕ " : "✓ "}{toast.msg}
        </div>
      )}

      {/* Hero */}
      <div style={{
        padding: "60px 24px 40px",
        maxWidth: 1280, margin: "0 auto",
        display: "flex", flexDirection: "column", gap: 8,
      }}>
        <span className="tag" style={{ alignSelf: "flex-start" }}>New Arrivals 2025</span>
        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 700, lineHeight: 1.15,
          color: "var(--text-primary)",
          letterSpacing: "-0.02em",
          maxWidth: 600,
        }}>
          Discover <span style={{ color: "var(--accent)" }}>Premium</span><br />Tech Products
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 480 }}>
          Curated selection of the finest laptops, mobiles, and tablets — shipped to your door.
        </p>
      </div>

      {/* Search & Filter */}
      <div style={{ padding: "0 24px 32px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{
          display: "flex", gap: 12, flexWrap: "wrap",
          background: "var(--bg-card)", borderRadius: 16,
          padding: 16, border: "1px solid var(--border)",
        }}>
          <div style={{ flex: "1 1 280px", position: "relative" }}>
            <span style={{
              position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
              color: "var(--text-muted)", fontSize: 16, pointerEvents: "none",
            }}>🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field"
              style={{ paddingLeft: 42 }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "10px 18px", borderRadius: 10, fontSize: 13,
                  fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
                  border: category === cat ? "1px solid var(--accent)" : "1px solid var(--border)",
                  background: category === cat ? "var(--accent-muted)" : "var(--bg-secondary)",
                  color: category === cat ? "var(--accent)" : "var(--text-secondary)",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {cat === "" ? "All" : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{
        padding: "0 24px 60px", maxWidth: 1280, margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 20,
      }}>
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
          : products.length === 0
            ? (
              <div style={{
                gridColumn: "1 / -1", textAlign: "center",
                padding: "80px 20px", color: "var(--text-muted)",
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
                <p style={{ fontSize: 16 }}>No products found</p>
              </div>
            )
            : products.map((product, i) => (
              <div
                key={product._id}
                className="card"
                style={{
                  padding: 0, overflow: "hidden", cursor: "pointer",
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                {/* Image */}
                <Link to={`/product/${product._id}`} style={{ display: "block", textDecoration: "none" }}>
                  <div style={{
                    height: 200, background: "#1a1a26",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", position: "relative",
                  }}>
                    <img
                      src={product.image}
                      alt={product.title}
                      style={{
                        maxWidth: "85%", maxHeight: "85%",
                        objectFit: "contain", transition: "transform 0.4s",
                      }}
                      onMouseEnter={e => e.target.style.transform = "scale(1.06)"}
                      onMouseLeave={e => e.target.style.transform = "scale(1)"}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                    {product.category && (
                      <span className="tag" style={{
                        position: "absolute", top: 12, left: 12,
                      }}>{product.category}</span>
                    )}
                  </div>
                </Link>

                {/* Info */}
                <div style={{ padding: "16px" }}>
                  <Link to={`/product/${product._id}`} style={{ textDecoration: "none" }}>
                    <h2 style={{
                      color: "var(--text-primary)", fontSize: 14,
                      fontWeight: 600, marginBottom: 4,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                      lineHeight: 1.4,
                    }}>{product.title}</h2>
                  </Link>

                  {product.stock < 5 && product.stock > 0 && (
                    <p style={{ color: "#f97316", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                      Only {product.stock} left!
                    </p>
                  )}
                  {product.stock === 0 && (
                    <p style={{ color: "var(--danger)", fontSize: 11, fontWeight: 600, marginBottom: 8 }}>
                      Out of stock
                    </p>
                  )}

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <p style={{
                      fontFamily: "'Playfair Display', serif",
                      fontSize: 18, fontWeight: 700, color: "var(--accent)",
                    }}>
                      ₹{Number(product.price).toLocaleString("en-IN")}
                    </p>
                    <button
                      onClick={() => addToCart(product._id)}
                      disabled={addingId === product._id || product.stock === 0}
                      style={{
                        background: addingId === product._id ? "var(--accent-muted)" : "var(--accent)",
                        color: addingId === product._id ? "var(--accent)" : "#0a0a0f",
                        border: "none", borderRadius: 8, padding: "8px 14px",
                        fontSize: 12, fontWeight: 700, cursor: product.stock === 0 ? "not-allowed" : "pointer",
                        transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
                        opacity: product.stock === 0 ? 0.4 : 1,
                        letterSpacing: "0.02em",
                      }}
                    >
                      {addingId === product._id ? "..." : product.stock === 0 ? "Sold Out" : "+ Add"}
                    </button>
                  </div>
                </div>
              </div>
            ))
        }
      </div>
    </div>
  );
}