import { Link, useNavigate, useLocation } from "react-router";
import { useState, useEffect } from "react";
import api from "../api/axios";

// Must match backend ADMIN_EMAILS list
const ADMIN_EMAILS = [
  "saurabh@admin.com",
  "devesh@admin.com",
  "dikshit@admin.com",
];


export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const userId = localStorage.getItem("userId");
  const userEmail = localStorage.getItem("userEmail");
  const isAdmin = ADMIN_EMAILS.includes(userEmail);

  useEffect(() => {
    const loadCart = async () => {
      if (!userId) return setCartCount(0);
      try {
        const res = await api.get(`/cart/${userId}`);
        const total = res.data?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        setCartCount(total);
      } catch { setCartCount(0); }
    };
    loadCart();
    window.addEventListener("cartUpdated", loadCart);
    return () => window.removeEventListener("cartUpdated", loadCart);
  }, [userId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const logout = () => {
    localStorage.clear();
    setCartCount(0);
    navigate("/login");
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: scrolled ? "rgba(10,10,15,0.95)" : "var(--bg-primary)",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      borderBottom: `1px solid ${scrolled ? "var(--border)" : "transparent"}`,
      transition: "all 0.3s",
      padding: "0 24px",
    }}>
      <div style={{
        maxWidth: 1280, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        {/* Logo */}
        <Link to="/" style={{
          fontFamily: "'Playfair Display', serif",
          fontSize: 22, fontWeight: 700,
          color: "var(--text-primary)", textDecoration: "none",
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, fontWeight: 800, color: "#0a0a0f",
          }}>S</span>
         Tech Bazaar
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {/* Admin link — only visible to admin emails */}
          {isAdmin && (
            <Link to="/admin/products" style={{
              color: "var(--accent)", fontSize: 13, fontWeight: 600,
              textDecoration: "none", padding: "6px 14px", borderRadius: 8,
              background: "var(--accent-muted)",
              border: "1px solid rgba(240,165,0,0.2)",
              transition: "all 0.2s",
            }}>
              ⚙️ Admin
            </Link>
          )}

          {/* Cart */}
          <Link to="/cart" style={{
            position: "relative", display: "flex", alignItems: "center",
            justifyContent: "center", width: 40, height: 40,
            borderRadius: 10, background: "var(--bg-card)",
            border: "1px solid var(--border)", color: "var(--text-primary)",
            textDecoration: "none", fontSize: 18, transition: "all 0.2s",
          }}>
            🛒
            {cartCount > 0 && (
              <span className="badge">{cartCount > 9 ? "9+" : cartCount}</span>
            )}
          </Link>

          {/* Auth buttons */}
          {!userId ? (
            <div style={{ display: "flex", gap: 8 }}>
              <Link to="/login" className="btn-ghost" style={{ textDecoration: "none", padding: "8px 18px", fontSize: 13 }}>
                Login
              </Link>
              <Link to="/signup" className="btn-primary" style={{ textDecoration: "none", padding: "8px 18px", fontSize: 13 }}>
                Sign Up
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {isAdmin && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "var(--accent)",
                  background: "var(--accent-muted)", padding: "3px 8px",
                  borderRadius: 6, letterSpacing: "0.05em", textTransform: "uppercase",
                }}>Admin</span>
              )}
              <button onClick={logout} className="btn-ghost" style={{ fontSize: 13, padding: "8px 18px" }}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}