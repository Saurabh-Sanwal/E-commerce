import { useParams, Link } from "react-router";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="page-enter" style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 20px",
      background: "radial-gradient(ellipse 50% 40% at 50% 30%, rgba(34,197,94,0.08) 0%, transparent 70%), var(--bg-primary)",
    }}>
      <div style={{ textAlign: "center", maxWidth: 500 }}>
        {/* Icon */}
        <div style={{
          width: 96, height: 96, borderRadius: "50%",
          background: "rgba(34,197,94,0.12)", border: "2px solid rgba(34,197,94,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 48, margin: "0 auto 32px",
          boxShadow: "0 0 60px rgba(34,197,94,0.15)",
        }}>
          ✅
        </div>

        <span className="tag" style={{ borderColor: "rgba(34,197,94,0.3)", background: "rgba(34,197,94,0.1)", color: "var(--success)" }}>
          Order Confirmed
        </span>

        <h1 style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "clamp(2rem, 5vw, 2.8rem)",
          fontWeight: 700, color: "var(--text-primary)",
          marginTop: 16, marginBottom: 12,
          lineHeight: 1.2,
        }}>
          Order Placed<br />Successfully! 🎉
        </h1>

        <p style={{ color: "var(--text-secondary)", fontSize: 15, marginBottom: 32 }}>
          Thank you for your order. We'll start processing it right away.
        </p>

        {/* Order ID card */}
        <div className="card" style={{
          padding: "20px 28px", marginBottom: 32, display: "inline-block",
          textAlign: "left", width: "100%",
        }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 6 }}>
            Order ID
          </p>
          <p style={{
            fontFamily: "monospace", fontSize: 16, fontWeight: 600,
            color: "var(--accent)", letterSpacing: "0.02em",
            wordBreak: "break-all",
          }}>{id}</p>
        </div>

        {/* Delivery info */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 32,
        }}>
          {[
            { icon: "📦", label: "Processing", desc: "Now" },
            { icon: "🚚", label: "Dispatch", desc: "1-2 days" },
            { icon: "🏠", label: "Delivery", desc: "3-5 days" },
          ].map(step => (
            <div key={step.label} className="card" style={{ padding: "16px 12px" }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>{step.icon}</div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)" }}>{step.label}</p>
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Payment method */}
        <div style={{
          padding: "12px 16px", borderRadius: 12,
          background: "var(--bg-card)", border: "1px solid var(--border)",
          fontSize: 13, color: "var(--text-secondary)", marginBottom: 32,
        }}>
          💵 Payment: <strong style={{ color: "var(--text-primary)" }}>Cash on Delivery</strong> — pay when you receive your order
        </div>

        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link to="/" className="btn-primary" style={{ textDecoration: "none", padding: "12px 32px" }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}