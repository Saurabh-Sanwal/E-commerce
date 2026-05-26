import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

const fieldConfig = [
  { name: "fullName",    label: "Full Name",      placeholder: "John Doe",          type: "text" },
  { name: "phone",       label: "Phone Number",   placeholder: "+91 98765 43210",   type: "tel" },
  { name: "addressLine", label: "Address Line",   placeholder: "House no., Street", type: "text" },
  { name: "city",        label: "City",           placeholder: "Mumbai",            type: "text" },
  { name: "state",       label: "State",          placeholder: "Maharashtra",       type: "text" },
  { name: "pincode",     label: "Pincode",        placeholder: "400001",            type: "text" },
];

export default function CheckoutAddress() {
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ fullName:"", phone:"", addressLine:"", city:"", state:"", pincode:"" });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const saveAddress = async () => {
    if (!userId) { navigate("/login"); return; }
    setLoading(true);
    try {
      await api.post("/address/add", { ...form, userId });
      navigate("/checkout");
    } catch {
      alert("Failed to save address. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-enter" style={{ minHeight: "calc(100vh - 64px)", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <Link to="/cart" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 20 }}>←</Link>
            <span className="tag">Step 1 of 2</span>
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(1.6rem, 4vw, 2.2rem)",
            fontWeight: 700, color: "var(--text-primary)",
          }}>Delivery Address</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 6 }}>
            Where should we deliver your order?
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
          {["Address", "Review & Pay"].map((step, i) => (
            <div key={step} style={{ flex: 1 }}>
              <div style={{
                height: 4, borderRadius: 2,
                background: i === 0 ? "var(--accent)" : "var(--border)",
              }} />
              <p style={{
                fontSize: 11, marginTop: 6, fontWeight: 500,
                color: i === 0 ? "var(--accent)" : "var(--text-muted)",
              }}>{step}</p>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 32 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {fieldConfig.map((f, i) => (
              <div
                key={f.name}
                style={{ gridColumn: i === 0 || i === 2 ? "1 / -1" : "auto" }}
              >
                <label style={{
                  display: "block", fontSize: 12, fontWeight: 600,
                  color: "var(--text-secondary)", marginBottom: 6,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                }}>{f.label}</label>
                <input
                  name={f.name}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            ))}
          </div>

          <button
            onClick={saveAddress}
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", height: 50, fontSize: 15, marginTop: 24 }}
          >
            {loading ? "Saving…" : "Continue to Review →"}
          </button>
        </div>
      </div>
    </div>
  );
}