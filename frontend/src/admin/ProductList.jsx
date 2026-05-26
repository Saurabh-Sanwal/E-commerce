import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState("");

  const loadProducts = async () => {
    const res = await api.get("/products");
    setProducts(res.data);
    setLoading(false);
  };

  useEffect(() => { loadProducts(); }, []);

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;
    setDeletingId(id);
    try {
      await api.delete(`/products/delete/${id}`);
      setProducts(p => p.filter(x => x._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = products.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page-enter" style={{ minHeight: "calc(100vh - 64px)", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
          <div>
            <span className="tag">Admin Panel</span>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700, color: "var(--text-primary)", marginTop: 6 }}>
              Products
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginTop: 4 }}>
              {products.length} product{products.length !== 1 ? "s" : ""} total
            </p>
          </div>
          <Link to="/admin/products/add" className="btn-primary" style={{ textDecoration: "none", padding: "12px 24px" }}>
            + Add Product
          </Link>
        </div>

        {/* Search */}
        <div style={{ marginBottom: 20, position: "relative" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: 16, pointerEvents: "none" }}>🔍</span>
          <input
            type="text" placeholder="Search products…"
            value={search} onChange={e => setSearch(e.target.value)}
            className="input-field" style={{ paddingLeft: 42, maxWidth: 360 }}
          />
        </div>

        {/* Table */}
        <div className="card" style={{ overflow: "hidden", padding: 0 }}>
          {loading ? (
            <div style={{ padding: 32 }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "center" }}>
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 10, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: "50%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 12, width: "25%" }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "var(--text-muted)" }}>
              <p style={{ fontSize: 40, marginBottom: 12 }}>📭</p>
              <p>{search ? "No products match your search" : "No products yet"}</p>
            </div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)" }}>
                  {["Product", "Category", "Price", "Stock", "Actions"].map(h => (
                    <th key={h} style={{
                      padding: "14px 20px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: "var(--text-muted)",
                      letterSpacing: "0.07em", textTransform: "uppercase",
                      background: "var(--bg-secondary)",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((product, i) => (
                  <tr
                    key={product._id}
                    style={{
                      borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-card-hover)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 44, height: 44, background: "#1a1a26",
                          borderRadius: 10, flexShrink: 0, overflow: "hidden",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          <img src={product.image} alt={product.title}
                            style={{ maxWidth: "90%", maxHeight: "90%", objectFit: "contain" }}
                            onError={e => { e.target.style.display = "none"; }} />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "block" }}>
                          {product.title}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      {product.category
                        ? <span className="tag">{product.category}</span>
                        : <span style={{ color: "var(--text-muted)", fontSize: 13 }}>—</span>
                      }
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, fontWeight: 700, color: "var(--accent)" }}>
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{
                        fontSize: 13, fontWeight: 600,
                        color: product.stock === 0 ? "var(--danger)" : product.stock < 5 ? "#f97316" : "var(--success)",
                      }}>
                        {product.stock === 0 ? "Out of stock" : product.stock < 5 ? `Low (${product.stock})` : product.stock}
                      </span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 8 }}>
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          style={{
                            padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                            background: "var(--accent-muted)", color: "var(--accent)",
                            border: "1px solid rgba(240,165,0,0.2)", textDecoration: "none",
                            transition: "all 0.2s",
                          }}
                        >Edit</Link>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          disabled={deletingId === product._id}
                          className="btn-danger"
                          style={{ padding: "6px 14px", fontSize: 12 }}
                        >
                          {deletingId === product._id ? "…" : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}