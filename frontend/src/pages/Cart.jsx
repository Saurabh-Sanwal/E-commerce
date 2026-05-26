import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const navigate = useNavigate();

  const loadCart = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const res = await api.get(`/cart/${userId}`);
      setCart(res.data);

      // ✅ FIX: sync cartCount to localStorage so navbar always reflects reality
      const count = res.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      localStorage.setItem("cartCount", count);

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadCart(); }, []);

  const removeItem = async (productId) => {
    setUpdatingId(productId);
    await api.post(`/cart/remove`, { userId, productId });
    await loadCart();                                  // loadCart now syncs count too
    window.dispatchEvent(new Event("cartUpdated"));
    setUpdatingId(null);
  };

  const updateQty = async (productId, quantity) => {
    if (quantity === 0) { await removeItem(productId); return; }
    setUpdatingId(productId);
    await api.post(`/cart/update`, { userId, productId, quantity });
    await loadCart();                                  // loadCart now syncs count too
    window.dispatchEvent(new Event("cartUpdated"));
    setUpdatingId(null);
  };

  if (loading) return (
    <div style={{ maxWidth: 860, margin: "60px auto", padding: "0 24px" }}>
      {[1,2,3].map(i => (
        <div key={i} className="card" style={{ padding: 20, marginBottom: 16, display: "flex", gap: 16, alignItems: "center" }}>
          <div className="skeleton" style={{ width: 80, height: 80, borderRadius: 12, flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div className="skeleton" style={{ height: 16, width: "60%", marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 14, width: "30%" }} />
          </div>
        </div>
      ))}
    </div>
  );

  if (!userId || !cart) return (
    <div className="page-enter" style={{
      minHeight: "calc(100vh - 64px)", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 16, padding: 40,
    }}>
      <div style={{ fontSize: 64, marginBottom: 8 }}>🛒</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "var(--text-primary)" }}>
        Your cart is empty
      </h2>
      <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
        {!userId ? "Please login to view your cart" : "You haven't added anything yet"}
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        {!userId && (
          <Link to="/login" className="btn-primary" style={{ textDecoration: "none", padding: "12px 28px" }}>
            Login
          </Link>
        )}
        <Link to="/" className="btn-ghost" style={{ textDecoration: "none", padding: "12px 28px" }}>
          Browse Products
        </Link>
      </div>
    </div>
  );

  const total = cart.items?.reduce((sum, item) => sum + item.productId.price * item.quantity, 0) || 0;
  const itemCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="page-enter" style={{ minHeight: "calc(100vh - 64px)", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            fontWeight: 700, color: "var(--text-primary)",
          }}>Your Cart</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </p>
        </div>

        {cart.items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛍️</div>
            <p style={{ color: "var(--text-muted)", fontSize: 16 }}>Your cart is empty</p>
            <Link to="/" className="btn-primary" style={{ textDecoration: "none", display: "inline-flex", marginTop: 20 }}>
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 24, alignItems: "start" }} className="cart-grid">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {cart.items.map(item => (
                <div
                  key={item.productId._id}
                  className="card"
                  style={{
                    padding: "20px", display: "flex", gap: 16, alignItems: "center",
                    opacity: updatingId === item.productId._id ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  <Link to={`/product/${item.productId._id}`} style={{
                    flexShrink: 0, width: 80, height: 80,
                    background: "#1a1a26", borderRadius: 12,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden",
                  }}>
                    <img
                      src={item.productId.image}
                      alt={item.productId.title}
                      style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                      onError={e => { e.target.style.display = "none"; }}
                    />
                  </Link>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link to={`/product/${item.productId._id}`} style={{ textDecoration: "none" }}>
                      <h3 style={{
                        color: "var(--text-primary)", fontSize: 14, fontWeight: 600,
                        marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>{item.productId.title}</h3>
                    </Link>
                    <p style={{ color: "var(--accent)", fontSize: 15, fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                      ₹{Number(item.productId.price).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <div style={{
                    display: "flex", alignItems: "center",
                    background: "var(--bg-secondary)", borderRadius: 10,
                    border: "1px solid var(--border)", overflow: "hidden",
                  }}>
                    <button
                      onClick={() => updateQty(item.productId._id, item.quantity - 1)}
                      style={{ width: 34, height: 34, background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", fontSize: 16 }}
                    >−</button>
                    <span style={{ width: 36, textAlign: "center", fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.productId._id, item.quantity + 1)}
                      style={{ width: 34, height: 34, background: "transparent", border: "none", color: "var(--text-primary)", cursor: "pointer", fontSize: 16 }}
                    >+</button>
                  </div>

                  <div style={{ textAlign: "right", minWidth: 80 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--text-primary)" }}>
                      ₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => removeItem(item.productId._id)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18, padding: 4, transition: "color 0.15s", lineHeight: 1 }}
                    onMouseEnter={e => e.target.style.color = "var(--danger)"}
                    onMouseLeave={e => e.target.style.color = "var(--text-muted)"}
                  >✕</button>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 24, position: "sticky", top: 80 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>
                Order Summary
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-secondary)" }}>
                  <span>Subtotal ({itemCount} items)</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--success)" }}>
                  <span>Delivery</span>
                  <span>Free</span>
                </div>
                <div style={{ height: 1, background: "var(--border)" }} />
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700 }}>
                  <span style={{ color: "var(--text-primary)" }}>Total</span>
                  <span style={{ color: "var(--accent)", fontFamily: "'Playfair Display', serif" }}>
                    ₹{total.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button onClick={() => navigate("/checkout-address")} className="btn-primary" style={{ width: "100%", height: 48, fontSize: 15 }}>
                Proceed to Checkout →
              </button>
              <Link to="/" style={{ display: "block", textAlign: "center", marginTop: 12, color: "var(--text-secondary)", fontSize: 13, textDecoration: "none" }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>
        )}
      </div>
      <style>{`@media (max-width: 680px) { .cart-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}