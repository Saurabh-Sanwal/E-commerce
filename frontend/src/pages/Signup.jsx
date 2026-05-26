import { useState } from "react";
import api from "../api/axios";
import { useNavigate, Link } from "react-router";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("error");
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const response = await api.post("/auth/signup", form);
      setMsgType("success");
      setMsg(response.data.message || "Account created! Redirecting to login…");
      setForm({ name: "", email: "", password: "" });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
    { name: "email", label: "Email Address", type: "email", placeholder: "you@example.com" },
    { name: "password", label: "Password", type: "password", placeholder: "Min. 8 characters" },
  ];

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
      background: "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(240,165,0,0.06) 0%, transparent 70%), var(--bg-primary)",
    }}>
      <div style={{ width: "100%", maxWidth: 420 }} className="page-enter">
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{
            width: 56, height: 56, borderRadius: 16,
            background: "var(--accent)", margin: "0 auto 20px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24,
          }}>✨</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 30, fontWeight: 700,
            color: "var(--text-primary)", marginBottom: 8,
          }}>Create account</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Join thousands of happy shoppers
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {msg && (
            <div style={{
              marginBottom: 20, padding: "12px 16px",
              borderRadius: 10, fontSize: 13, fontWeight: 500,
              background: msgType === "success" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
              color: msgType === "success" ? "var(--success)" : "var(--danger)",
              border: `1px solid ${msgType === "success" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}>
              {msgType === "success" ? "✓ " : "✕ "}{msg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {fields.map(f => (
              <div key={f.name}>
                <label style={{
                  display: "block", fontSize: 12, fontWeight: 600,
                  color: "var(--text-secondary)", marginBottom: 6,
                  letterSpacing: "0.05em", textTransform: "uppercase",
                }}>
                  {f.label}
                </label>
                <input
                  name={f.name} type={f.type}
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  className="input-field"
                  required
                />
              </div>
            ))}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ marginTop: 8, height: 46, fontSize: 15 }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-secondary)", fontSize: 14 }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}