import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function Checkout() {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (!userId) { navigate("/login"); return; }
    Promise.all([
      api.get(`/cart/${userId}`),
      api.get(`/address/${userId}`),
    ]).then(([cartRes, addrRes]) => {
      setCart(cartRes.data);
      setAddresses(addrRes.data);
      setSelectedAddress(addrRes.data[0]);
    }).finally(() => setLoading(false));
  }, []);

  const placeOrder = async () => {
    if (!selectedAddress) { alert("Please select an address"); return; }
    setPlacing(true);
    try {
      const res = await api.post("/order/place", { userId, address: selectedAddress });
      navigate(`/order-success/${res.data.orderId}`);
    } catch {
      alert("Failed to place order. Please try again.");
      setPlacing(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ textAlign: "center", color: "var(--text-muted)" }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>⏳</div>
        <p>Loading checkout…</p>
      </div>
    </div>
  );

  const total = cart?.items?.reduce((sum, item) => sum + item.productId.price * item.quantity, 0) || 0;
  const itemCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="page-enter" style={{ minHeight: "calc(100vh - 64px)", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Link to="/checkout-address" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 20 }}>←</Link>
            <span className="tag">Step 2 of 2</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 700, color: "var(--text-primary)",
          }}>Review & Place Order</h1>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 36 }}>
          {["Address", "Review & Pay"].map((step, i) => (
            <div key={step} style={{ flex: 1 }}>
              <div style={{ height: 4, borderRadius: 2, background: "var(--accent)" }} />
              <p style={{ fontSize: 11, marginTop: 6, fontWeight: 500, color: "var(--accent)" }}>{step}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 24, alignItems: "start" }} className="checkout-grid">
          {/* Left */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Address selection */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18, fontWeight: 600, marginBottom: 16,
                color: "var(--text-primary)",
              }}>Delivery Address</h2>

              {addresses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <p style={{ color: "var(--text-muted)", marginBottom: 12 }}>No addresses found</p>
                  <Link to="/checkout-address" className="btn-primary" style={{ textDecoration: "none" }}>
                    Add Address
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {addresses.map(addr => (
                    <label
                      key={addr._id}
                      style={{
                        display: "flex", gap: 14, padding: 16, borderRadius: 12,
                        border: `1px solid ${selectedAddress?._id === addr._id ? "var(--accent)" : "var(--border)"}`,
                        background: selectedAddress?._id === addr._id ? "var(--accent-muted)" : "var(--bg-secondary)",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      <input
                        type="radio" name="address"
                        checked={selectedAddress?._id === addr._id}
                        onChange={() => setSelectedAddress(addr)}
                        style={{ accentColor: "var(--accent)", marginTop: 2, flexShrink: 0 }}
                      />
                      <div>
                        <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>{addr.fullName}</p>
                        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 3 }}>
                          {addr.addressLine}, {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                        <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>📞 {addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Cart items */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18, fontWeight: 600, marginBottom: 16,
                color: "var(--text-primary)",
              }}>Order Items ({itemCount})</h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {cart?.items?.map(item => (
                  <div key={item.productId._id} style={{
                    display: "flex", gap: 12, alignItems: "center",
                    padding: "12px 0", borderBottom: "1px solid var(--border)",
                  }}>
                    <div style={{
                      width: 56, height: 56, background: "#1a1a26",
                      borderRadius: 10, flexShrink: 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <img src={item.productId.image} alt={item.productId.title}
                        style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                        onError={e => { e.target.style.display = "none"; }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {item.productId.title}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Qty: {item.quantity}</p>
                    </div>
                    <p style={{ fontWeight: 700, color: "var(--accent)", fontSize: 14, fontFamily: "'Playfair Display', serif" }}>
                      ₹{(item.productId.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div className="card" style={{ padding: 24 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, marginBottom: 12, color: "var(--text-primary)" }}>
                Payment Method
              </h2>
              <div style={{
                display: "flex", gap: 12, alignItems: "center",
                padding: 16, borderRadius: 12,
                border: "1px solid var(--accent)",
                background: "var(--accent-muted)",
              }}>
                <span style={{ fontSize: 24 }}>💵</span>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--text-primary)", fontSize: 14 }}>Cash on Delivery</p>
                  <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 2 }}>Pay when your order arrives</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="card" style={{ padding: 24, position: "sticky", top: 80 }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, marginBottom: 20, color: "var(--text-primary)" }}>
              Price Details
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--text-secondary)" }}>
                <span>Price ({itemCount} items)</span>
                <span>₹{total.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "var(--success)" }}>
                <span>Delivery Charges</span>
                <span>Free</span>
              </div>
              <div style={{ height: 1, background: "var(--border)" }} />
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700 }}>
                <span style={{ color: "var(--text-primary)" }}>Total Amount</span>
                <span style={{ color: "var(--accent)", fontFamily: "'Playfair Display', serif" }}>
                  ₹{total.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <div style={{
              padding: "12px 14px", borderRadius: 10,
              background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.15)",
              marginBottom: 16, fontSize: 12, color: "var(--success)", fontWeight: 500,
            }}>
              ✅ Your order is eligible for free delivery
            </div>

            <button
              onClick={placeOrder}
              disabled={placing || !selectedAddress}
              className="btn-primary"
              style={{
                width: "100%", height: 52, fontSize: 16,
                opacity: !selectedAddress ? 0.5 : 1,
              }}
            >
              {placing ? (
                <span style={{ display: "flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", animation: "spin 0.6s linear infinite", display: "inline-block" }} />
                  Placing Order…
                </span>
              ) : "Place Order (COD)"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 720px) { .checkout-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}