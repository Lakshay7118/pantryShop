// App.jsx
import { useState, useEffect, useRef } from "react";
import AdminPanel from "./admin/AdminPanel";
import * as api from "./services/api";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0a;
    --surface: #141414;
    --surface2: #1e1e1e;
    --accent: #e8c06a;
    --accent2: #c97d3a;
    --text: #f0ece4;
    --muted: #7a7166;
    --border: #2a2520;
    --danger: #e05c5c;
    --radius: 12px;
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  /* NAVBAR */
  .navbar {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 2.5rem;
    height: 70px;
    background: rgba(10,10,10,0.85);
    backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
    transition: background 0.3s;
  }
  .nav-logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.6rem;
    font-weight: 900;
    color: var(--accent);
    letter-spacing: -0.5px;
    cursor: pointer;
  }
  .nav-logo span { color: var(--text); }
  .nav-links {
    display: flex; gap: 2rem; list-style: none;
  }
  .nav-links li a {
    color: var(--muted);
    text-decoration: none;
    font-size: 0.92rem;
    font-weight: 500;
    letter-spacing: 0.3px;
    transition: color 0.2s;
    cursor: pointer;
    background: none; border: none; font-family: inherit;
  }
  .nav-links li a:hover, .nav-links li a.active { color: var(--accent); }
  .nav-actions { display: flex; align-items: center; gap: 1rem; }
  .nav-btn {
    display: flex; align-items: center; gap: 0.45rem;
    padding: 0.45rem 1.1rem;
    border-radius: 50px;
    font-size: 0.88rem; font-weight: 600;
    cursor: pointer; transition: all 0.2s;
    font-family: 'DM Sans', sans-serif;
  }
  .btn-login {
    background: transparent; border: 1px solid var(--border);
    color: var(--text);
  }
  .btn-login:hover { border-color: var(--accent); color: var(--accent); }
  .btn-logout {
    background: transparent; border: 1px solid var(--danger);
    color: var(--danger);
  }
  .btn-logout:hover { background: var(--danger); color: #fff; }
  .cart-btn {
    position: relative; background: var(--accent); border: none;
    color: #0a0a0a; padding: 0.5rem 0.9rem;
    border-radius: 50px; cursor: pointer; font-size: 1.1rem;
    transition: transform 0.15s, background 0.2s;
  }
  .cart-btn:hover { transform: scale(1.08); background: var(--accent2); }
  .cart-badge {
    position: absolute; top: -5px; right: -6px;
    background: var(--danger); color: #fff;
    font-size: 0.65rem; font-weight: 700;
    width: 18px; height: 18px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    border: 2px solid var(--bg);
  }
  .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; background: none; border: none; padding: 4px; }
  .hamburger span { display: block; width: 22px; height: 2px; background: var(--text); border-radius: 2px; transition: all 0.3s; }

  /* HERO */
  .hero {
    min-height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    text-align: center; padding: 6rem 2rem 4rem;
    position: relative; overflow: hidden;
    background: radial-gradient(ellipse 80% 70% at 50% 60%, #1a1408 0%, var(--bg) 70%);
  }
  .hero::before {
    content: '';
    position: absolute; inset: 0;
    background: radial-gradient(circle at 20% 50%, rgba(232,192,106,0.07) 0%, transparent 60%),
                radial-gradient(circle at 80% 20%, rgba(201,125,58,0.06) 0%, transparent 50%);
  }
  .hero-tag {
    display: inline-block; background: rgba(232,192,106,0.1);
    border: 1px solid rgba(232,192,106,0.25);
    color: var(--accent); font-size: 0.78rem; font-weight: 600;
    letter-spacing: 2px; text-transform: uppercase;
    padding: 0.35rem 1rem; border-radius: 50px; margin-bottom: 1.8rem;
  }
  .hero h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(3rem, 7vw, 5.5rem); font-weight: 900;
    line-height: 1.05; letter-spacing: -2px; margin-bottom: 1.4rem;
  }
  .hero h1 em { color: var(--accent); font-style: italic; }
  .hero p {
    max-width: 520px; color: var(--muted); font-size: 1.05rem;
    line-height: 1.75; margin: 0 auto 2.5rem;
  }
  .hero-btns { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; }
  .btn-primary {
    padding: 0.85rem 2.2rem; border-radius: 50px;
    background: var(--accent); color: #0a0a0a;
    font-weight: 700; font-size: 0.95rem; cursor: pointer;
    border: none; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .btn-primary:hover { background: var(--accent2); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(232,192,106,0.25); }
  .btn-secondary {
    padding: 0.85rem 2.2rem; border-radius: 50px;
    background: transparent; color: var(--text);
    font-weight: 600; font-size: 0.95rem; cursor: pointer;
    border: 1px solid var(--border); transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .btn-secondary:hover { border-color: var(--accent); color: var(--accent); }
  .hero-stats {
    display: flex; gap: 3rem; margin-top: 4rem;
    padding-top: 2.5rem; border-top: 1px solid var(--border);
  }
  .stat-val {
    font-family: 'Playfair Display', serif;
    font-size: 2rem; font-weight: 700; color: var(--accent);
  }
  .stat-label { font-size: 0.78rem; color: var(--muted); margin-top: 2px; letter-spacing: 0.5px; text-transform: uppercase; }

  /* SECTIONS */
  section { padding: 5rem 2rem; max-width: 1200px; margin: 0 auto; }
  .section-tag {
    font-size: 0.75rem; font-weight: 700; letter-spacing: 2.5px;
    text-transform: uppercase; color: var(--accent); margin-bottom: 0.7rem;
  }
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 3rem); font-weight: 800;
    line-height: 1.1; margin-bottom: 0.6rem;
  }
  .section-sub { color: var(--muted); max-width: 480px; line-height: 1.75; margin-bottom: 3rem; font-size: 0.97rem; }

  /* MENU */
  .menu-filters { display: flex; gap: 0.6rem; flex-wrap: wrap; margin-bottom: 2.5rem; }
  .filter-btn {
    padding: 0.4rem 1.1rem; border-radius: 50px; font-size: 0.85rem; font-weight: 500;
    cursor: pointer; border: 1px solid var(--border); background: transparent;
    color: var(--muted); transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .filter-btn.active, .filter-btn:hover { background: var(--accent); color: #0a0a0a; border-color: var(--accent); font-weight: 700; }
  .products-grid {
    display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1.5rem;
  }
  .product-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden;
    transition: transform 0.25s, box-shadow 0.25s;
    cursor: pointer;
  }
  .product-card:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.5); border-color: #3a3028; }
  .product-img {
    width: 100%; height: 200px;
    display: flex; align-items: center; justify-content: center;
    font-size: 4rem; background: var(--surface2);
    position: relative;
  }
  .product-badge {
    position: absolute; top: 10px; left: 10px;
    font-size: 0.7rem; font-weight: 700; text-transform: uppercase;
    padding: 0.2rem 0.6rem; border-radius: 4px; letter-spacing: 0.5px;
  }
  .badge-new { background: rgba(232,192,106,0.15); color: var(--accent); border: 1px solid rgba(232,192,106,0.3); }
  .badge-hot { background: rgba(224,92,92,0.15); color: var(--danger); border: 1px solid rgba(224,92,92,0.3); }
  .product-body { padding: 1.2rem; }
  .product-cat { font-size: 0.72rem; color: var(--muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 0.4rem; }
  .product-name { font-family: 'Playfair Display', serif; font-size: 1.1rem; font-weight: 700; margin-bottom: 0.4rem; }
  .product-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.6; margin-bottom: 1rem; }
  .product-footer { display: flex; align-items: center; justify-content: space-between; }
  .product-price { font-family: 'Playfair Display', serif; font-size: 1.2rem; font-weight: 700; color: var(--accent); }
  .add-cart-btn {
    padding: 0.4rem 0.9rem; border-radius: 8px;
    background: var(--accent); color: #0a0a0a;
    font-weight: 700; font-size: 0.82rem; cursor: pointer;
    border: none; transition: all 0.15s; font-family: 'DM Sans', sans-serif;
  }
  .add-cart-btn:hover { background: var(--accent2); transform: scale(1.05); }

  /* ABOUT */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  .about-visual {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 3rem;
    text-align: center; position: relative; overflow: hidden;
  }
  .about-visual::before {
    content: '';
    position: absolute; top: -50%; left: -50%;
    width: 200%; height: 200%;
    background: radial-gradient(circle, rgba(232,192,106,0.06) 0%, transparent 60%);
  }
  .about-emoji { font-size: 5rem; display: block; margin-bottom: 1rem; }
  .about-visual-title { font-family: 'Playfair Display', serif; font-size: 1.5rem; font-weight: 700; color: var(--accent); }
  .about-features { list-style: none; margin-top: 2rem; display: flex; flex-direction: column; gap: 1rem; }
  .about-features li {
    display: flex; align-items: flex-start; gap: 1rem;
    padding: 1rem; background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); transition: border-color 0.2s;
  }
  .about-features li:hover { border-color: var(--accent); }
  .feature-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 1px; }
  .feature-title { font-weight: 600; margin-bottom: 0.2rem; font-size: 0.95rem; }
  .feature-desc { font-size: 0.83rem; color: var(--muted); line-height: 1.55; }
  .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.2rem; margin-top: 3rem; }
  .team-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.5rem; text-align: center;
    transition: border-color 0.2s;
  }
  .team-card:hover { border-color: var(--accent); }
  .team-avatar { font-size: 2.5rem; margin-bottom: 0.7rem; }
  .team-name { font-weight: 700; font-size: 0.95rem; margin-bottom: 0.2rem; }
  .team-role { font-size: 0.78rem; color: var(--accent); }

  /* CONTACT */
  .contact-grid { display: grid; grid-template-columns: 1fr 1.4fr; gap: 4rem; }
  .contact-info { display: flex; flex-direction: column; gap: 1.2rem; }
  .contact-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1.2rem 1.4rem;
    display: flex; align-items: center; gap: 1rem;
    transition: border-color 0.2s;
  }
  .contact-card:hover { border-color: var(--accent); }
  .contact-icon { font-size: 1.5rem; }
  .contact-label { font-size: 0.75rem; color: var(--muted); margin-bottom: 0.15rem; text-transform: uppercase; letter-spacing: 0.5px; }
  .contact-val { font-weight: 600; font-size: 0.92rem; }
  .contact-form { display: flex; flex-direction: column; gap: 1rem; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-group label { font-size: 0.82rem; font-weight: 600; color: var(--muted); letter-spacing: 0.3px; }
  .form-group input, .form-group textarea, .form-group select {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 0.75rem 1rem;
    color: var(--text); font-family: 'DM Sans', sans-serif; font-size: 0.9rem;
    outline: none; transition: border-color 0.2s;
  }
  .form-group input:focus, .form-group textarea:focus, .form-group select:focus { border-color: var(--accent); }
  .form-group textarea { resize: vertical; min-height: 110px; }
  .form-group select option { background: var(--surface2); }
  .form-submit {
    padding: 0.9rem; background: var(--accent); color: #0a0a0a;
    font-weight: 700; font-size: 0.95rem; cursor: pointer;
    border: none; border-radius: 10px; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .form-submit:hover { background: var(--accent2); transform: translateY(-2px); }
  .form-success {
    text-align: center; padding: 2rem;
    color: var(--accent); font-weight: 600; font-size: 1rem;
    background: rgba(232,192,106,0.06); border: 1px solid rgba(232,192,106,0.2);
    border-radius: var(--radius);
  }

  /* CART DRAWER */
  .cart-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.6);
    z-index: 2000; backdrop-filter: blur(4px);
    opacity: 0; pointer-events: none; transition: opacity 0.3s;
  }
  .cart-overlay.open { opacity: 1; pointer-events: all; }
  .cart-drawer {
    position: fixed; top: 0; right: 0; bottom: 0; width: 400px; max-width: 95vw;
    background: var(--surface); border-left: 1px solid var(--border);
    z-index: 2001; display: flex; flex-direction: column;
    transform: translateX(100%); transition: transform 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .cart-drawer.open { transform: translateX(0); }
  .cart-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.4rem 1.6rem; border-bottom: 1px solid var(--border);
  }
  .cart-title { font-family: 'Playfair Display', serif; font-size: 1.25rem; font-weight: 700; }
  .close-btn {
    background: var(--surface2); border: 1px solid var(--border);
    color: var(--text); width: 34px; height: 34px; border-radius: 50%;
    cursor: pointer; font-size: 1.1rem; display: flex; align-items: center; justify-content: center;
    transition: all 0.2s;
  }
  .close-btn:hover { background: var(--danger); border-color: var(--danger); color: #fff; }
  .cart-items { flex: 1; overflow-y: auto; padding: 1rem 1.6rem; display: flex; flex-direction: column; gap: 1rem; }
  .cart-item {
    display: flex; align-items: center; gap: 1rem;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 1rem;
  }
  .cart-item-emoji { font-size: 2rem; flex-shrink: 0; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-weight: 700; font-size: 0.92rem; margin-bottom: 0.2rem; }
  .cart-item-price { color: var(--accent); font-weight: 600; font-size: 0.88rem; }
  .cart-item-qty { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.5rem; }
  .qty-btn {
    width: 26px; height: 26px; border-radius: 50%; cursor: pointer;
    background: var(--border); border: none; color: var(--text); font-size: 0.95rem;
    display: flex; align-items: center; justify-content: center; transition: background 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .qty-btn:hover { background: var(--accent); color: #0a0a0a; }
  .qty-num { font-size: 0.88rem; font-weight: 700; min-width: 20px; text-align: center; }
  .remove-item { background: none; border: none; color: var(--muted); cursor: pointer; font-size: 1rem; transition: color 0.15s; }
  .remove-item:hover { color: var(--danger); }
  .cart-empty { text-align: center; padding: 3rem 1rem; color: var(--muted); }
  .cart-empty-emoji { font-size: 3.5rem; margin-bottom: 1rem; }
  .cart-footer { padding: 1.4rem 1.6rem; border-top: 1px solid var(--border); }
  .cart-total { display: flex; justify-content: space-between; margin-bottom: 1rem; font-weight: 700; font-size: 1.05rem; }
  .cart-total span:last-child { color: var(--accent); font-family: 'Playfair Display', serif; font-size: 1.2rem; }
  .checkout-btn {
    width: 100%; padding: 1rem; background: var(--accent); color: #0a0a0a;
    font-weight: 700; font-size: 1rem; cursor: pointer;
    border: none; border-radius: 10px; transition: all 0.2s; font-family: 'DM Sans', sans-serif;
  }
  .checkout-btn:hover { background: var(--accent2); }

  /* LOGIN MODAL */
  .modal-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.7);
    z-index: 3000; display: flex; align-items: center; justify-content: center;
    padding: 2rem; backdrop-filter: blur(6px);
    opacity: 0; pointer-events: none; transition: opacity 0.25s;
  }
  .modal-overlay.open { opacity: 1; pointer-events: all; }
  .modal {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 20px; padding: 2.5rem; width: 100%; max-width: 420px;
    transform: scale(0.95); transition: transform 0.25s;
  }
  .modal-overlay.open .modal { transform: scale(1); }
  .modal-title { font-family: 'Playfair Display', serif; font-size: 1.6rem; font-weight: 800; margin-bottom: 0.4rem; }
  .modal-sub { color: var(--muted); font-size: 0.88rem; margin-bottom: 2rem; }
  .modal-form { display: flex; flex-direction: column; gap: 1rem; }
  .modal-footer { text-align: center; margin-top: 1.2rem; font-size: 0.83rem; color: var(--muted); }
  .modal-footer button { background: none; border: none; color: var(--accent); cursor: pointer; font-weight: 600; font-family: 'DM Sans', sans-serif; font-size: 0.83rem; }
  .modal-close { float: right; background: none; border: none; color: var(--muted); cursor: pointer; font-size: 1.2rem; margin-top: -0.5rem; }

  /* FOOTER */
  footer {
    background: var(--surface); border-top: 1px solid var(--border);
    padding: 3rem 2rem 2rem; text-align: center;
    color: var(--muted); font-size: 0.85rem;
  }
  footer .footer-logo { font-family: 'Playfair Display', serif; font-size: 1.4rem; color: var(--accent); font-weight: 900; margin-bottom: 0.5rem; }
  footer p { line-height: 1.7; }

  /* TOAST */
  .toast {
    position: fixed; bottom: 2rem; left: 50%; transform: translateX(-50%) translateY(100px);
    background: var(--surface); border: 1px solid var(--border);
    border-left: 3px solid var(--accent);
    border-radius: 10px; padding: 0.8rem 1.4rem;
    color: var(--text); font-size: 0.9rem; font-weight: 500;
    z-index: 9999; transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
    white-space: nowrap; box-shadow: 0 8px 30px rgba(0,0,0,0.4);
  }
  .toast.show { transform: translateX(-50%) translateY(0); }

  /* RESPONSIVE */
  @media (max-width: 900px) {
    .about-grid, .contact-grid { grid-template-columns: 1fr; gap: 2.5rem; }
    .team-grid { grid-template-columns: repeat(3, 1fr); }
    .form-row { grid-template-columns: 1fr; }
  }
  @media (max-width: 700px) {
    .nav-links { display: none; }
    .nav-links.mobile-open {
      display: flex; flex-direction: column;
      position: absolute; top: 70px; left: 0; right: 0;
      background: rgba(10,10,10,0.98); border-bottom: 1px solid var(--border);
      padding: 1.5rem 2rem; gap: 1.2rem;
    }
    .hamburger { display: flex; }
    .hero-stats { gap: 1.5rem; flex-wrap: wrap; }
    .team-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .hero h1 { letter-spacing: -1px; }
    .navbar { padding: 0 1.2rem; }
    section { padding: 3.5rem 1.2rem; }
  }
`;

// Team data remains static (not managed by admin yet)
const TEAM = [
  { name: "Aditi Sharma", role: "Founder & CEO", emoji: "👩‍🍳" },
  { name: "Rohan Mehta", role: "Head of Sourcing", emoji: "👨‍💼" },
  { name: "Priya Kapoor", role: "Brand & Design", emoji: "👩‍🎨" },
];

export default function App() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const [filter, setFilter] = useState("All");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [formSent, setFormSent] = useState(false);
  const [toast, setToast] = useState({ msg: "", show: false });
  const [mobileMenu, setMobileMenu] = useState(false);
  const toastTimer = useRef(null);

  // API data states
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(true);

  // Check for existing login on mount
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsed = JSON.parse(userInfo);
      setIsLoggedIn(true);
      setIsAdmin(parsed.isAdmin);
    }
  }, []);

  // Fetch products and categories
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        api.productAPI.getAll(),
        api.categoryAPI.getAll()
      ]);
      setProducts(productsData);
      const categoryNames = categoriesData.map(c => c.name);
      setCategories(["All", ...categoryNames]);
    } catch (error) {
      showToast("Failed to load products");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  const showToast = (msg) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, show: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2500);
  };

  // Add this function inside the App component
const fetchProducts = async () => {
  try {
    setLoading(true);
    const productsData = await api.productAPI.getAll();
    setProducts(productsData);
  } catch (error) {
    showToast("Failed to load products");
  } finally {
    setLoading(false);
  }
};

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id);
      if (exists) return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i._id !== id));
  const updateQty = (id, delta) => setCart(prev =>
    prev.map(i => i._id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)
  );
  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const handleLogin = async () => {
    if (!user.email || !user.password) {
      showToast("Please fill all fields");
      return;
    }
    if (isSignup && !user.name) {
      showToast("Please enter your name");
      return;
    }

    try {
      let data;
      if (isSignup) {
        data = await api.authAPI.register({ name: user.name, email: user.email, password: user.password });
      } else {
        data = await api.authAPI.login({ email: user.email, password: user.password });
      }
      localStorage.setItem('userInfo', JSON.stringify(data));
      setIsLoggedIn(true);
      setIsAdmin(data.isAdmin);
      setLoginOpen(false);
      setUser({ name: "", email: "", password: "" });
      showToast(isSignup ? "Account created! Welcome 🎉" : "Welcome back! 👋");
    } catch (error) {
      showToast(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setIsAdmin(false);
    setUser({ name: "", email: "", password: "" });
    showToast("Logged out");
  };

  const handleContactSubmit = async () => {
    if (!formData.name || !formData.email || !formData.message) {
      showToast("Please fill required fields");
      return;
    }
    try {
      await api.contactAPI.send(formData);
      setFormSent(true);
      showToast("Message sent! We'll reply soon ✉️");
    } catch (error) {
      showToast("Failed to send message");
    }
  };

  const handleCheckout = async () => {
    if (!isLoggedIn) {
      showToast("Please login to checkout");
      setLoginOpen(true);
      return;
    }
    try {
      const orderItems = cart.map(item => ({
        product: item._id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        emoji: item.emoji,
      }));
      await api.orderAPI.create({ orderItems, totalPrice });
      setCart([]);
      setCartOpen(false);
      showToast("Order placed! Thank you 🎉");
    } catch (error) {
      showToast("Failed to place order. Please try again.");
    }
  };

  const filteredProducts = filter === "All" 
    ? products 
    : products.filter(p => p.category === filter);

  const navTo = (p) => {
    if (p === "admin") {
      if (!isLoggedIn) {
        showToast("Please login to access admin panel");
        setLoginOpen(true);
        return;
      }
      if (!isAdmin) {
        showToast("You don't have admin privileges");
        return;
      }
    }
    setPage(p);
    setMobileMenu(false);
  };

  // Helper to format price in INR
  const formatPrice = (price) => {
    return `₹${(price * 83).toFixed(0)}`;
  };

  return (
    <>
      <style>{style}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-logo" onClick={() => navTo("home")}>Lumin<span>Pantry</span></div>
        <ul className={`nav-links${mobileMenu ? " mobile-open" : ""}`}>
          {["home","menu","about","contact"].map(p => (
            <li key={p}><a className={page===p?"active":""} onClick={() => navTo(p)}>{p.charAt(0).toUpperCase()+p.slice(1)}</a></li>
          ))}
          {isAdmin && (
            <li><a className={page==="admin"?"active":""} onClick={() => navTo("admin")}>Admin</a></li>
          )}
        </ul>
        <div className="nav-actions">
          {isLoggedIn
            ? <button className="nav-btn btn-logout" onClick={handleLogout}>⏻ Logout</button>
            : <button className="nav-btn btn-login" onClick={() => setLoginOpen(true)}>👤 Login</button>
          }
          <button className="cart-btn" onClick={() => setCartOpen(true)}>
            🛒 {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </button>
          <button className="hamburger" onClick={() => setMobileMenu(m => !m)}>
            <span/><span/><span/>
          </button>
        </div>
      </nav>

      {/* PAGES */}
      {page === "home" && (
  <>
    <div className="hero">
      <div className="hero-tag">✦ Artisan Pantry Goods</div>
      <h1>Taste the World's<br/><em>Finest Ingredients</em></h1>
      <p>Curated spices, rare teas, and gourmet staples — sourced directly from origin farms and delivered to your door.</p>
      <div className="hero-btns">
        <button className="btn-primary" onClick={() => navTo("menu")}>Shop Now →</button>
        <button className="btn-secondary" onClick={() => navTo("about")}>Our Story</button>
      </div>
      <div className="hero-stats">
        {[["200+","Products"],["40+","Countries"],["50k+","Customers"]].map(([v,l]) => (
          <div key={l} style={{textAlign:"center"}}>
            <div className="stat-val">{v}</div>
            <div className="stat-label">{l}</div>
          </div>
        ))}
      </div>
    </div>

    {/* FEATURED PRODUCTS PREVIEW */}
    <section style={{padding: "5rem 2rem", maxWidth: "1200px", margin: "0 auto"}}>
      <div className="section-tag">✦ Handpicked For You</div>
      <h2 className="section-title">Featured<br/>Favorites</h2>
      <p className="section-sub">Our most loved ingredients — freshly stocked and ready to elevate your kitchen.</p>
      {loading ? (
        <div style={{textAlign: 'center', padding: '3rem', color: 'var(--muted)'}}>Loading...</div>
      ) : (
        <>
          <div className="products-grid">
            {products.slice(0, 3).map(p => (
              <div className="product-card" key={p._id} onClick={() => navTo("menu")}>
                <div className="product-img">
                  {p.badge && <span className={`product-badge badge-${p.badge}`}>{p.badge}</span>}
                  <span>{p.emoji}</span>
                </div>
                <div className="product-body">
                  <div className="product-cat">{p.category}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-desc">{p.description}</div>
                  <div className="product-footer">
                    <div className="product-price">{formatPrice(p.price)}</div>
                    <button className="add-cart-btn" onClick={(e) => { e.stopPropagation(); addToCart(p); }}>+ Add</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign: "center", marginTop: "2.5rem"}}>
            <button className="btn-secondary" onClick={() => navTo("menu")}>View All Products →</button>
          </div>
        </>
      )}
    </section>

    {/* WHY CHOOSE US */}
    <section style={{background: "var(--surface)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)"}}>
      <div style={{maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem"}}>
        <div className="section-tag" style={{textAlign: "center"}}>✦ The LuminPantry Difference</div>
        <h2 className="section-title" style={{textAlign: "center", marginBottom: "3rem"}}>Why Cooks<br/>Choose Us</h2>
        <div style={{display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem"}}>
          {[
            { icon: "🌱", title: "Single Origin", desc: "Every product is traceable to its farm — no middlemen, no blends." },
            { icon: "📦", title: "Eco‑Friendly", desc: "Plastic‑free packaging, carbon‑neutral shipping." },
            { icon: "⭐", title: "Chef Approved", desc: "Tested by Michelin‑starred chefs before listing." },
            { icon: "🚚", title: "Free Shipping", desc: "On orders above ₹999 across India." },
          ].map((item, i) => (
            <div key={i} style={{textAlign: "center", padding: "1.5rem", background: "var(--surface2)", borderRadius: "var(--radius)", border: "1px solid var(--border)"}}>
              <div style={{fontSize: "2.5rem", marginBottom: "1rem"}}>{item.icon}</div>
              <h3 style={{fontFamily: "'Playfair Display', serif", fontSize: "1.3rem", marginBottom: "0.5rem"}}>{item.title}</h3>
              <p style={{color: "var(--muted)", fontSize: "0.9rem", lineHeight: "1.6"}}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* NEWSLETTER */}
    <section style={{padding: "4rem 2rem", textAlign: "center"}}>
      <div style={{maxWidth: "600px", margin: "0 auto"}}>
        <div className="section-tag">✦ Join the Pantry</div>
        <h2 className="section-title">Get 10% Off<br/>Your First Order</h2>
        <p className="section-sub" style={{marginLeft: "auto", marginRight: "auto"}}>Subscribe for exclusive offers, recipes, and early access to seasonal releases.</p>
        <div style={{display: "flex", gap: "0.5rem", marginTop: "2rem", justifyContent: "center", flexWrap: "wrap"}}>
          <input 
            type="email" 
            placeholder="Your email address" 
            style={{
              padding: "0.9rem 1.5rem", 
              borderRadius: "50px", 
              border: "1px solid var(--border)", 
              background: "var(--surface2)", 
              color: "var(--text)", 
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "0.95rem",
              minWidth: "280px",
              outline: "none"
            }}
          />
          <button 
            className="btn-primary" 
            onClick={() => showToast("🎉 Thanks for subscribing! Check your inbox.")}
            style={{padding: "0.9rem 2rem"}}
          >
            Subscribe →
          </button>
        </div>
      </div>
    </section>
  </>
)}

      {page === "menu" && (
        <section id="menu">
          <div className="section-tag">✦ Our Products</div>
          <h2 className="section-title">Handpicked with<br/>Precision</h2>
          <p className="section-sub">Every item is sourced from trusted producers and tested by our culinary team before it reaches you.</p>
          <div className="menu-filters">
            {categories.map(c => (
              <button key={c} className={`filter-btn${filter===c?" active":""}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
          {loading ? (
            <div style={{textAlign: 'center', padding: '3rem', color: 'var(--muted)'}}>Loading products...</div>
          ) : (
            <div className="products-grid">
              {filteredProducts.map(p => (
                <div className="product-card" key={p._id}>
                  <div className="product-img">
                    {p.badge && <span className={`product-badge badge-${p.badge}`}>{p.badge}</span>}
                    <span>{p.emoji}</span>
                  </div>
                  <div className="product-body">
                    <div className="product-cat">{p.category}</div>
                    <div className="product-name">{p.name}</div>
                    <div className="product-desc">{p.description}</div>
                    <div className="product-footer">
                      <div className="product-price">{formatPrice(p.price)}</div>
                      <button className="add-cart-btn" onClick={() => addToCart(p)}>+ Add</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {page === "about" && (
        <section id="about">
          <div className="section-tag">✦ Our Story</div>
          <h2 className="section-title">Crafted for the<br/>Curious Palate</h2>
          <p className="section-sub">Founded in 2019 from a Jaipur kitchen table, LuminPantry was born out of a belief that extraordinary ingredients make extraordinary meals.</p>
          <div className="about-grid">
            <div>
              <ul className="about-features">
                {[
                  ["🌍","Direct Trade","We partner directly with over 200 farmers across 40 countries, ensuring fair pay and pristine quality."],
                  ["🔬","Lab Tested","Every batch is tested for purity, potency, and freshness before it ever reaches our warehouse."],
                  ["📦","Eco Packaging","Our packaging is 100% compostable or recyclable — because good taste shouldn't cost the earth."],
                  ["⭐","Curated Monthly","Our team of culinary experts handpicks seasonal favorites and rare finds every single month."],
                ].map(([icon,title,desc]) => (
                  <li key={title}>
                    <span className="feature-icon">{icon}</span>
                    <div><div className="feature-title">{title}</div><div className="feature-desc">{desc}</div></div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="about-visual">
                <span className="about-emoji">🫙</span>
                <div className="about-visual-title">Est. 2019, Jaipur</div>
                <p style={{color:"var(--muted)",fontSize:"0.88rem",marginTop:"0.8rem",lineHeight:1.7}}>
                  What started as a personal quest for quality pantry staples has grown into a community of 50,000+ food lovers across India.
                </p>
              </div>
              <div style={{marginTop:"2rem"}}>
                <div style={{fontSize:"0.82rem",color:"var(--muted)",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:"1rem"}}>Meet the Team</div>
                <div className="team-grid">
                  {TEAM.map(t => (
                    <div className="team-card" key={t.name}>
                      <div className="team-avatar">{t.emoji}</div>
                      <div className="team-name">{t.name}</div>
                      <div className="team-role">{t.role}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {page === "contact" && (
        <section id="contact">
          <div className="section-tag">✦ Get in Touch</div>
          <h2 className="section-title">We'd Love to<br/>Hear From You</h2>
          <p className="section-sub">Questions, wholesale inquiries, or just a recipe to share — our team responds within 24 hours.</p>
          <div className="contact-grid">
            <div className="contact-info">
              {[
                ["📍","Address","12 Spice Lane, Civil Lines, Jaipur, Rajasthan 302006"],
                ["📞","Phone","+91 98765 43210"],
                ["✉️","Email","hello@luminpantry.com"],
                ["🕐","Hours","Mon–Sat: 9am – 7pm IST"],
              ].map(([icon,label,val]) => (
                <div className="contact-card" key={label}>
                  <span className="contact-icon">{icon}</span>
                  <div>
                    <div className="contact-label">{label}</div>
                    <div className="contact-val">{val}</div>
                  </div>
                </div>
              ))}
            </div>
            <div>
              {formSent ? (
                <div className="form-success">
                  <div style={{fontSize:"2.5rem",marginBottom:"0.8rem"}}>✅</div>
                  <div style={{fontFamily:"'Playfair Display',serif",fontSize:"1.2rem",marginBottom:"0.5rem"}}>Message Sent!</div>
                  <div style={{color:"var(--muted)",fontSize:"0.88rem"}}>We'll get back to you within 24 hours.</div>
                  <button onClick={() => setFormSent(false)} style={{marginTop:"1.2rem",background:"none",border:"1px solid var(--accent)",color:"var(--accent)",padding:"0.4rem 1rem",borderRadius:"50px",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem"}}>Send Another</button>
                </div>
              ) : (
                <div className="contact-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name *</label>
                      <input placeholder="Your name" value={formData.name} onChange={e => setFormData({...formData,name:e.target.value})}/>
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" placeholder="you@email.com" value={formData.email} onChange={e => setFormData({...formData,email:e.target.value})}/>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Subject</label>
                    <select value={formData.subject} onChange={e => setFormData({...formData,subject:e.target.value})}>
                      <option value="">Select a topic</option>
                      <option>Order Issue</option>
                      <option>Wholesale Inquiry</option>
                      <option>Product Question</option>
                      <option>Partnership</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Message *</label>
                    <textarea placeholder="Tell us what's on your mind..." value={formData.message} onChange={e => setFormData({...formData,message:e.target.value})}/>
                  </div>
                  <button className="form-submit" onClick={handleContactSubmit}>Send Message →</button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}
{page === "admin" && (
  <AdminPanel 
    showToast={showToast} 
    refreshProducts={fetchProducts} 
  />
)}

      {/* FOOTER */}
      <footer>
        <div className="footer-logo">LuminPantry</div>
        <p>© 2025 LuminPantry. Crafted with ❤️ in Jaipur, Rajasthan.<br/>All rights reserved.</p>
      </footer>

      {/* CART DRAWER */}
      <div className={`cart-overlay${cartOpen?" open":""}`} onClick={() => setCartOpen(false)}/>
      <div className={`cart-drawer${cartOpen?" open":""}`}>
        <div className="cart-header">
          <span className="cart-title">Your Cart</span>
          <button className="close-btn" onClick={() => setCartOpen(false)}>✕</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-emoji">🛒</div>
              <div style={{fontWeight:600,marginBottom:"0.4rem"}}>Your cart is empty</div>
              <div style={{fontSize:"0.83rem"}}>Add some delicious items to get started</div>
              <button className="btn-primary" style={{marginTop:"1.2rem",padding:"0.6rem 1.4rem",fontSize:"0.88rem"}} onClick={() => {setCartOpen(false); navTo("menu");}}>Browse Menu</button>
            </div>
          ) : cart.map(item => (
            <div className="cart-item" key={item._id}>
              <span className="cart-item-emoji">{item.emoji}</span>
              <div className="cart-item-info">
                <div className="cart-item-name">{item.name}</div>
                <div className="cart-item-price">{formatPrice(item.price)} each</div>
                <div className="cart-item-qty">
                  <button className="qty-btn" onClick={() => updateQty(item._id, -1)}>−</button>
                  <span className="qty-num">{item.qty}</span>
                  <button className="qty-btn" onClick={() => updateQty(item._id, 1)}>+</button>
                </div>
              </div>
              <button className="remove-item" onClick={() => removeFromCart(item._id)}>🗑</button>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total"><span>Total</span><span>{formatPrice(totalPrice)}</span></div>
            <button className="checkout-btn" onClick={handleCheckout}>Proceed to Checkout</button>
          </div>
        )}
      </div>

      {/* LOGIN MODAL */}
      <div className={`modal-overlay${loginOpen?" open":""}`} onClick={e => e.target===e.currentTarget && setLoginOpen(false)}>
        <div className="modal">
          <button className="modal-close" onClick={() => setLoginOpen(false)}>✕</button>
          <div className="modal-title">{isSignup ? "Create Account" : "Welcome Back"}</div>
          <div className="modal-sub">{isSignup ? "Join 50,000+ food lovers on LuminPantry" : "Sign in to your LuminPantry account"}</div>
          <div className="modal-form">
            {isSignup && (
              <div className="form-group">
                <label>Full Name</label>
                <input 
                  placeholder="Your full name"
                  value={user.name}
                  onChange={e => setUser({...user, name: e.target.value})}
                />
              </div>
            )}
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="you@email.com" value={user.email} onChange={e => setUser({...user,email:e.target.value})}/>
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" placeholder="••••••••" value={user.password} onChange={e => setUser({...user,password:e.target.value})}/>
            </div>
            <button className="form-submit" onClick={handleLogin}>{isSignup ? "Create Account" : "Sign In"} →</button>
          </div>
          <div className="modal-footer">
            {isSignup ? "Already have an account? " : "New to LuminPantry? "}
            <button onClick={() => setIsSignup(s => !s)}>{isSignup ? "Sign In" : "Create Account"}</button>
          </div>
          <div style={{marginTop: "1rem", fontSize: "0.75rem", color: "var(--muted)", textAlign: "center"}}>
            Demo admin: admin@luminpantry.com / admin123
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className={`toast${toast.show?" show":""}`}>{toast.msg}</div>
    </>
  );
}