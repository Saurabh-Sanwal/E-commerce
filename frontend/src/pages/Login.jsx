import { useState } from "react";
import { useNavigate, Link } from "react-router";
import api from "../api/axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("error");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);
      localStorage.setItem("userEmail", res.data.user.email); // ← save email for admin check
      setMsgType("success");
      setMsg("Login successful! Redirecting…");
      setForm({ email: "", password: "" });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setMsgType("error");
      setMsg(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

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
          }}>🔐</div>
          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 30, fontWeight: 700,
            color: "var(--text-primary)", marginBottom: 8,
          }}>Welcome back</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 14 }}>
            Sign in to your account to continue
          </p>
        </div>

        <div className="card" style={{ padding: 32 }}>
          {msg && (
            <div style={{
              marginBottom: 20, padding: "12px 16px", borderRadius: 10, fontSize: 13, fontWeight: 500,
              background: msgType === "success" ? "rgba(34,197,94,0.12)" : "rgba(239,68,68,0.12)",
              color: msgType === "success" ? "var(--success)" : "var(--danger)",
              border: `1px solid ${msgType === "success" ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)"}`,
            }}>
              {msgType === "success" ? "✓ " : "✕ "}{msg}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Email Address
              </label>
              <input name="email" type="email" placeholder="you@example.com"
                value={form.email} onChange={handleChange} className="input-field" required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Password
              </label>
              <input name="password" type="password" placeholder="••••••••"
                value={form.password} onChange={handleChange} className="input-field" required />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}
              style={{ marginTop: 8, height: 46, fontSize: 15 }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, color: "var(--text-secondary)", fontSize: 14 }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "var(--accent)", fontWeight: 600, textDecoration: "none" }}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}