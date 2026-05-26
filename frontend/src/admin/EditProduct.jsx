import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams, Link } from "react-router";

const fields = [
  { name: "title",       label: "Product Title",   type: "text",   full: true },
  { name: "description", label: "Description",      type: "text",   full: true },
  { name: "price",       label: "Price (₹)",        type: "number" },
  { name: "stock",       label: "Stock Quantity",   type: "number" },
  { name: "category",    label: "Category",         type: "text" },
  { name: "image",       label: "Image URL",        type: "url",   full: true },
];

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:"", price:"", description:"", category:"", image:"", stock:"" });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    api.get("/products").then(res => {
      const product = res.data.find(p => p._id === id);
      if (product) setForm(product);
    }).finally(() => setFetching(false));
  }, [id]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put(`/products/update/${id}`, form);
      setMsg("success");
      setTimeout(() => navigate("/admin/products"), 1200);
    } catch {
      setMsg("error");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ maxWidth: 680, margin: "60px auto", padding: "0 24px" }}>
      <div className="skeleton" style={{ height: 40, width: "40%", marginBottom: 24 }} />
      {[1,2,3,4].map(i => <div key={i} className="skeleton" style={{ height: 48, marginBottom: 16, borderRadius: 12 }} />)}
    </div>
  );

  return (
    <div className="page-enter" style={{ minHeight: "calc(100vh - 64px)", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <div style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 12 }}>
          <Link to="/admin/products" style={{ color: "var(--text-muted)", textDecoration: "none", fontSize: 20 }}>←</Link>
          <div>
            <span className="tag">Admin</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginTop: 6 }}>
              Edit Product
            </h1>
          </div>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {msg === "success" && (
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(34,197,94,0.12)", color: "var(--success)", border: "1px solid rgba(34,197,94,0.2)", marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
              ✓ Product updated! Redirecting…
            </div>
          )}
          {msg === "error" && (
            <div style={{ padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.12)", color: "var(--danger)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 20, fontSize: 14, fontWeight: 500 }}>
              ✕ Failed to update. Please try again.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {fields.map(f => (
                <div key={f.name} style={{ gridColumn: f.full ? "1 / -1" : "auto" }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                    {f.label}
                  </label>
                  {f.name === "description" ? (
                    <textarea
                      name={f.name} value={form[f.name] || ""} onChange={handleChange}
                      rows={3} className="input-field" style={{ resize: "vertical", minHeight: 80 }}
                    />
                  ) : (
                    <input
                      name={f.name} type={f.type} value={form[f.name] || ""}
                      onChange={handleChange} className="input-field"
                    />
                  )}
                </div>
              ))}
            </div>

            {form.image && (
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase", fontWeight: 600, letterSpacing: "0.05em" }}>Preview</p>
                <div style={{ height: 120, background: "#1a1a26", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                  <img src={form.image} alt="preview" style={{ maxHeight: 110, maxWidth: "90%", objectFit: "contain" }} onError={e => { e.target.style.display = "none"; }} />
                </div>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1, height: 48, fontSize: 15 }}>
                {loading ? "Saving…" : "Save Changes"}
              </button>
              <Link to="/admin/products" className="btn-ghost" style={{ textDecoration: "none", padding: "0 24px", display: "flex", alignItems: "center" }}>
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}