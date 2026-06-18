import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { 
  getFavicon, 
  getGameIcon, 
  getDomainFromUrl 
} from "../utils/logoHelper";

// ── CONFIG & CONSTANTS ────────────────────────────────────────────────────────

const TELEGRAM_LINK = "https://t.me/owner_trusted_streams";
const API_BASE = import.meta.env.PROD ? "" : "http://localhost:5000";

const getProxiedUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("data:")) return url;
  if (url.startsWith("/") || url.startsWith("http://localhost") || url.startsWith("https://streambazaar")) return url;
  return `${API_BASE}/api/proxy-image?url=${encodeURIComponent(url)}`;
};

const getProfileBadgeDetails = (desc) => {
  if (!desc) return { label: "SHARED PROFILE", color: "#f59e0b" };
  const lower = desc.toLowerCase();
  if (lower.includes("offline")) return { label: "OFFLINE ACTIVATION", color: "#fbbf24" };
  if (lower.includes("private")) return { label: "PRIVATE ACCOUNT", color: "#4ade80" };
  if (lower.includes("personal") || lower.includes("upgrade")) return { label: "PERSONAL UPGRADE", color: "#f472b6" };
  if (lower.includes("shared") || lower.includes("sharing") || lower.includes("seat")) return { label: "SHARED PROFILE", color: "#f59e0b" };
  return { label: "VERIFIED SAFE", color: "#4ade80" };
};

// ── INLINE SVG LOGOS (Design System Reference) ───────────────────────────────

const NetflixLogo = () => (
  <svg viewBox="0 0 111 30" xmlns="http://www.w3.org/2000/svg" style={{ width: 72, height: 22 }}>
    <path d="M105.062 28.916 94.577 0h-8.55l10.485 28.916c.463 1.28 1.68 2.084 3.025 2.084h9.076c-1.345 0-2.562-.804-3.025-2.084H105.062zM94.577 0H86.03L76.544 28.916C76.081 30.196 74.864 31 73.52 31h9.075c1.345 0 2.562-.804 3.025-2.084L94.577 0zM0 0v31h7.5V10.68L20.04 31h7.5V0h-7.5v20.32L7.5 0H0zm35 0v31h7.5v-9.5H55V16H42.5V7.5H57V0H35zm27 0v7.5h9V31h7.5V7.5h9V0H62z" fill="#E50914" />
  </svg>
);

const PrimeLogoSq = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={{ width: 54, height: 54 }}>
    <rect width="80" height="80" rx="12" fill="#00A8E0" />
    <text x="40" y="34" textAnchor="middle" fill="white" fontSize="13" fontWeight="700" fontFamily="Arial">prime</text>
    <text x="40" y="50" textAnchor="middle" fill="white" fontSize="11" fontWeight="400" fontFamily="Arial">video</text>
    <path d="M18 60 Q40 72 62 60" stroke="#FF9900" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

const SpotifyLogoSq = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={{ width: 54, height: 54 }}>
    <circle cx="40" cy="40" r="38" fill="#1DB954" />
    <path d="M54 52c-.6 1-1.9 1.3-2.9.7-7.9-4.8-17.8-5.9-29.5-3.2-1.1.3-2.2-.4-2.5-1.5-.3-1.1.4-2.2 1.5-2.5 12.8-2.9 23.8-1.7 32.7 3.7 1 .6 1.3 1.9.7 2.8zm3.6-8c-.7 1.2-2.2 1.6-3.4.9C44.2 39.5 30.3 38 16.6 42c-1.3.4-2.7-.3-3.1-1.6-.4-1.3.3-2.7 1.6-3.1 15.5-4.7 30.9-2.7 42.5 4.4 1.2.7 1.6 2.2.9 3.3zm.3-8.3c-11-6.5-29.1-7.1-39.6-3.9-1.6.5-3.3-.4-3.8-2s.4-3.3 2-3.8c12-3.7 32-3 44.6 4.5 1.5.9 2 2.8 1.1 4.3-.9 1.5-2.8 2-4.3 1.1v-.2z" fill="white" />
  </svg>
);

const YoutubeLogoSq = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={{ width: 54, height: 54 }}>
    <rect width="80" height="80" rx="14" fill="#FF0000" />
    <rect x="10" y="22" width="60" height="36" rx="8" fill="#FF0000" />
    <polygon points="30,28 30,52 55,40" fill="white" />
  </svg>
);

const DisneyLogoSq = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={{ width: 54, height: 54 }}>
    <rect width="80" height="80" rx="12" fill="#0a1931" />
    <text x="40" y="44" textAnchor="middle" fill="#1f80e0" fontSize="20" fontWeight="900" fontFamily="Georgia,serif">Disney+</text>
  </svg>
);

const HotstarLogoSq = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={{ width: 54, height: 54 }}>
    <rect width="80" height="80" rx="12" fill="#1a1a2e" />
    <text x="40" y="36" textAnchor="middle" fill="#FFD700" fontSize="11" fontWeight="900" fontFamily="Arial">JIO</text>
    <text x="40" y="54" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="Arial">CINEMA</text>
  </svg>
);

const SteamLogoSq = () => (
  <svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg" style={{ width: 54, height: 54 }}>
    <rect width="80" height="80" rx="12" fill="#1b2838" />
    <circle cx="40" cy="35" r="16" fill="none" stroke="#c6d4df" strokeWidth="4" />
    <circle cx="40" cy="35" r="6" fill="#c6d4df" />
    <text x="40" y="66" textAnchor="middle" fill="#c6d4df" fontSize="9" fontWeight="700" fontFamily="Arial" letterSpacing="1">STEAM</text>
  </svg>
);

const getInlineLogo = (name) => {
  const lower = (name || "").toLowerCase();
  if (lower.includes("netflix")) return <NetflixLogo />;
  if (lower.includes("prime") || lower.includes("amazon")) return <PrimeLogoSq />;
  if (lower.includes("spotify")) return <SpotifyLogoSq />;
  if (lower.includes("youtube")) return <YoutubeLogoSq />;
  if (lower.includes("disney") || lower.includes("hotstar") || lower.includes("jio hotstar")) return <DisneyLogoSq />;
  if (lower.includes("jio") || lower.includes("jiocinema")) return <HotstarLogoSq />;
  if (lower.includes("steam")) return <SteamLogoSq />;
  return null;
};

// Device specific SVG renderers (clean inline representation)
const CustomIcons = {
  Apple: () => (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
      <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282"/>
    </svg>
  ),
  Android: () => (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
      <path d="M2.76 3.061a.5.5 0 0 1 .679.2l1.283 2.352A8.9 8.9 0 0 1 8 5a8.9 8.9 0 0 1 3.278.613l1.283-2.352a.5.5 0 1 1 .878.478l-1.252 2.295C14.475 7.266 16 9.477 16 12H0c0-2.523 1.525-4.734 3.813-5.966L2.56 3.74a.5.5 0 0 1 .2-.678ZM5 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m6 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
    </svg>
  ),
  TV: () => (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
      <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5M13.991 3l.024.001a1.5 1.5 0 0 1 .538.143.76.76 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.5 1.5 0 0 1-.143.538.76.76 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.5 1.5 0 0 1-.538-.143.76.76 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.5 1.5 0 0 1 .143-.538.76.76 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2"/>
    </svg>
  ),
  PC: () => (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
      <path d="M0 4s0-2 2-2h12s2 0 2 2v6s0 2-2 2h-4q0 1 .25 1.5H11a.5.5 0 0 1 0 1H5a.5.5 0 0 1 0-1h.75Q6 13 6 12H2s-2 0-2-2zm1.398-.855a.76.76 0 0 0-.254.302A1.5 1.5 0 0 0 1 4.01V10c0 .325.078.502.145.602q.105.156.302.254a1.5 1.5 0 0 0 .538.143L2.01 11H14c.325 0 .502-.078.602-.145a.76.76 0 0 0 .254-.302 1.5 1.5 0 0 0 .143-.538L15 9.99V4c0-.325-.078-.502-.145-.602a.76.76 0 0 0-.302-.254A1.5 1.5 0 0 0 13.99 3H2c-.325 0-.502.078-.602.145"/>
    </svg>
  ),
  Laptop: () => (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
      <path d="M13.5 3a.5.5 0 0 1 .5.5V11H2V3.5a.5.5 0 0 1 .5-.5zm-11-1A1.5 1.5 0 0 0 1 3.5V12h14V3.5A1.5 1.5 0 0 0 13.5 2zM0 12.5h16a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5"/>
    </svg>
  ),
  PlayStation: () => (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
      <path d="M15.858 11.451c-.313.395-1.079.676-1.079.676l-5.696 2.046v-1.509l4.192-1.493c.476-.17.549-.412.162-.538-.386-.127-1.085-.09-1.56.08l-2.794.984v-1.566l.161-.054s.807-.286 1.942-.412c1.135-.125 2.525.017 3.616.43 1.23.39 1.368.962 1.056 1.356M9.625 8.883v-3.86c0-.453-.083-.87-.508-.988-.326-.105-.528.198-.528.65v9.664l-2.606-.827V2c1.108.206 2.722.692 3.59.985 2.207.757 2.955 1.7 2.955 3.825 0 2.071-1.278 2.856-2.903 2.072Zm-8.424 3.625C-.061 12.15-.271 11.41.304 10.984c.532-.394 1.436-.69 1.436-.69l3.737-1.33v1.515l-2.69.963c-.474.17-.547.411-.161.538.386.126 1.085.09 1.56-.08l1.29-.469v1.356l-.257.043a8.45 8.45 0 0 1-4.018-.323Z"/>
    </svg>
  ),
  Xbox: () => (
    <svg viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
      <path d="M7.202 15.967a8 8 0 0 1-3.552-1.26c-.898-.585-1.101-.826-1.101-1.306 0-.965 1.062-2.656 2.879-4.583C6.459 7.723 7.897 6.44 8.052 6.475c.302.068 2.718 2.423 3.622 3.531 1.43 1.753 2.088 3.189 1.754 3.829-.254.486-1.83 1.437-2.987 1.802-.954.301-2.207.429-3.239.33m-5.866-3.57C.589 11.253.212 10.127.03 8.497c-.06-.539-.038-.846.137-1.95.218-1.377 1.002-2.97 1.945-3.95.401-.417.437-.427.926-.263.595.2 1.23.638 2.213 1.528l.574.519-.313.385C4.056 6.553 2.52 9.086 1.94 10.653c-.315.852-.442 1.707-.306 2.063.091.24.007.15-.3-.319Zm13.101.195c.074-.36-.019-1.02-.238-1.687-.473-1.443-2.055-4.128-3.508-5.953l-.457-.575.494-.454c.646-.593 1.095-.948 1.58-1.25.381-.237.927-.448 1.161-.448.145 0 .654.528 1.065 1.104a8.4 8.4 0 0 1 1.343 3.102c.153.728.166 2.286.024 3.012a9.5 9.5 0 0 1-.6 1.893c-.179.393-.624 1.156-.82 1.404-.1.128-.1.127-.043-.148ZM7.335 1.952c-.67-.34-1.704-.705-2.276-.803a4 4 0 0 0-.759-.043c-.471.024-.45 0 .306-.358A7.8 7.8 0 0 1 6.47.128c.8-.169 2.306-.17 3.094-.005.85.18 1.853.552 2.418.9l.168.103-.385-.02c-.766-.038-1.88.27-3.078.853-.361.176-.676.316-.699.312a12 12 0 0 1-.654-.319Z"/>
    </svg>
  )
};

// ── STEAM COVER WITH FALLBACK ────────────────────────────────────────────────

function SteamCover({ appId, fallbackBg, LogoComp }) {
  const [err, setErr] = useState(false);
  if (!appId || err) {
    return (
      <div style={{ width: 60, height: 60, background: fallbackBg, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.08)" }}>
        {LogoComp ? <LogoComp /> : "🎮"}
      </div>
    );
  }
  return (
    <img
      src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`}
      alt=""
      style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 12, border: "1px solid rgba(255,255,255,0.08)" }}
      onError={() => setErr(true)}
    />
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function HomeLive() {
  const [tab, setTab] = useState("All");
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [popup, setPopup] = useState(null);

  const CATS = ["All", "Streaming", "Gaming", "VPN", "AI+"];

  // Fetch plans from database
  const fetchPlans = useCallback(() => {
    const cacheBuster = Date.now();
    fetch(`${API_BASE}/api/plans?v=${cacheBuster}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        const mapped = d.map((p) => {
          let cat = p.category ? p.category.trim() : "";
          const catLower = cat.toLowerCase();
          let resolvedCat = "Streaming";
          if (catLower.includes("gam") || catLower === "steam" || catLower === "playstation" || catLower === "xbox") {
            resolvedCat = "Gaming";
          } else if (catLower === "vpn") {
            resolvedCat = "VPN";
          } else if (catLower.includes("ai")) {
            resolvedCat = "AI+";
          }

          const accent = p.color || "#6366f1";
          const profileDetails = getProfileBadgeDetails(p.description);

          return {
            id: p._id,
            name: p.name,
            subtitle: p.description || (resolvedCat === "Gaming" ? "PC Seat Access • Guaranteed" : "Premium shared profiles. Instant access."),
            category: resolvedCat,
            tag: resolvedCat.toUpperCase(),
            tagColor: accent,
            accent: accent,
            logoBg: accent + "1a", // Hex opacity 10%
            profileType: profileDetails.label,
            profileColor: profileDetails.color,
            plans: (p.plans || []).map((pl) => ({
              quality: pl.quality || pl.label || "Premium",
              duration: pl.duration || "30 Days",
              price: pl.price.startsWith("₹") ? pl.price : "₹" + pl.price,
              rawPlan: pl
            })),
            originalProduct: p
          };
        });
        setPlans(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load plans:", err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchPlans();
    window.addEventListener("focus", fetchPlans);
    return () => window.removeEventListener("focus", fetchPlans);
  }, [fetchPlans]);

  const list = tab === "All" ? plans : plans.filter((p) => p.category.toLowerCase() === tab.toLowerCase());

  const openPopup = (product, plan) => {
    setPopup({ product, plan, device: null });
  };

  const handleBuy = () => {
    if (!popup || !popup.device) return;
    const { product, plan, device } = popup;

    fetch(`${API_BASE}/api/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product: product.name,
        plan: plan.rawPlan.label,
        device: device,
        price: plan.rawPlan.price
      })
    }).catch((err) => console.error("Failed to log checkout:", err));

    const msg = `Hi! I want to buy ${product.name} — ${plan.rawPlan.label} — Device: ${device} — Price: ${plan.rawPlan.price}`;
    window.open(`${TELEGRAM_LINK}?text=${encodeURIComponent(msg)}`, "_blank");
    setPopup(null);
  };

  return (
    <div style={S.page}>
      {/* NAVBAR */}
      <nav style={S.nav}>
        <div style={S.brand}>
          <div style={S.brandIcon}>
            <svg width="32" height="32" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="16" fill="#6366f1" />
              <circle cx="16" cy="16" r="10" fill="none" stroke="white" strokeWidth="2.5" />
              <circle cx="16" cy="16" r="4" fill="white" />
            </svg>
          </div>
          <span style={S.brandTxt}>Stream<span style={{ color: "#6366f1" }}>Bazaar</span></span>
        </div>
        <div style={S.navMid}>
          <Link to="/admin" style={{ textDecoration: 'none' }}>
            <span style={S.navItem}>⊞ Admin</span>
          </Link>
        </div>
        <div style={S.navR}>
          <button style={S.liveBtn} onClick={() => window.open(TELEGRAM_LINK, "_blank")}>💬 Live Support</button>
        </div>
      </nav>

      {/* TABS */}
      <div style={S.tabs}>
        {CATS.map((c) => (
          <button key={c} onClick={() => setTab(c)} style={{ ...S.tab, ...(tab === c ? S.tabOn : {}) }}>
            {c === "All" && "⊞ "}
            {c === "Streaming" && "📺 "}
            {c === "Gaming" && "🎮 "}
            {c === "VPN" && "🛡️ "}
            {c === "AI+" && "✨ "}
            {c}
          </button>
        ))}
      </div>

      {/* PRODUCT LIST */}
      <div style={S.list}>
        {loading ? (
          <div style={{ textAlign: "center", color: "#64748b", padding: "40px 0" }}>Loading storefront products...</div>
        ) : list.length > 0 ? (
          list.map((p) => (
            <ProductCard key={p.id} p={p} openPopup={openPopup} />
          ))
        ) : (
          <div style={{ textAlign: "center", color: "#64748b", padding: "40px 0" }}>No products available.</div>
        )}
      </div>

      {/* DEVICE SELECTOR MODAL */}
      {popup && (
        <div style={S.overlay} onClick={() => setPopup(null)}>
          <div style={{ ...S.modal, border: `1px solid ${popup.product.accent}80`, boxShadow: `0 20px 50px ${popup.product.accent}22` }} onClick={(e) => e.stopPropagation()}>
            <button style={S.closeBtn} onClick={() => setPopup(null)}>✕</button>
            <div style={S.modalHead}>
              <div style={{ ...S.modalLogoBox, background: popup.product.logoBg, border: `1.5px solid ${popup.product.accent}33` }}>
                {(() => {
                  const inlineLogo = getInlineLogo(popup.product.name);
                  if (inlineLogo) return inlineLogo;
                   const isGaming = popup.product.category === "Gaming";
                  const imgUrl = getFavicon(popup.product.name, popup.product.originalProduct?.customIcon);
                  if (imgUrl) {
                    return (
                      <img 
                        src={getProxiedUrl(imgUrl)} 
                        alt="" 
                        onError={(e) => {
                          if (e.target.src.includes('clearbit.com')) {
                            const domain = getDomainFromUrl(e.target.src);
                            e.target.src = `https://www.google.com/s2/favicons?domain=${domain || 'google.com'}&sz=256`;
                          }
                        }}
                        style={{ width: "100%", height: "100%", objectFit: isGaming ? "cover" : "contain", padding: isGaming ? "0" : "4px" }} 
                      />
                    );
                  }
                  return <span style={{ fontSize: 20, color: popup.product.accent, fontWeight: "bold" }}>{popup.product.name[0]}</span>;
                })()}
              </div>
              <div style={S.modalTitleBlock}>
                <h3 style={S.modalTitle}>{popup.product.name}</h3>
                <div style={{ color: "#64748b", fontSize: "0.85rem", marginTop: 4 }}>{popup.plan.quality} · {popup.plan.duration}</div>
              </div>
            </div>

            <div style={S.modalSectionTitle}>Select Your Device</div>
            <div style={{ ...S.deviceGrid, gridTemplateColumns: popup.product.category === "Gaming" ? "repeat(3, 1fr)" : "repeat(2, 1fr)" }}>
              {(popup.product.category === "Gaming"
                ? [
                    { id: "PC", label: "PC", icon: CustomIcons.PC },
                    { id: "Laptop", label: "Laptop", icon: CustomIcons.Laptop },
                    { id: "PS5", label: "PS5", icon: CustomIcons.PlayStation },
                    { id: "PS4", label: "PS4", icon: CustomIcons.PlayStation },
                    { id: "Xbox S", label: "Xbox S", icon: CustomIcons.Xbox },
                    { id: "Xbox X", label: "Xbox X", icon: CustomIcons.Xbox }
                  ]
                : [
                    { id: "TV", label: "TV", icon: CustomIcons.TV },
                    { id: "PC", label: "PC/Laptop", icon: CustomIcons.PC },
                    { id: "iOS", label: "iOS (Apple)", icon: CustomIcons.Apple },
                    { id: "Android", label: "Android", icon: CustomIcons.Android }
                  ]
              ).map((d) => {
                const isSelected = popup.device === d.id;
                return (
                  <button
                    key={d.id}
                    onClick={() => setPopup((prev) => ({ ...prev, device: d.id }))}
                    style={{
                      ...S.deviceBtn,
                      ...(isSelected ? { background: popup.product.accent, color: "#000", border: `1.5px solid ${popup.product.accent}` } : {})
                    }}
                  >
                    <span style={{ display: "inline-flex", marginBottom: 6 }}>{d.icon()}</span>
                    <span>{d.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleBuy}
              disabled={!popup.device}
              style={{
                ...S.submitBuyBtn,
                background: popup.device ? popup.product.accent : "rgba(255,255,255,0.05)",
                color: popup.device ? "#000" : "#475569",
                cursor: popup.device ? "pointer" : "not-allowed"
              }}
            >
              {popup.device ? "Buy on Telegram 💬" : "Please Select a Device"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── PRODUCT CARD ─────────────────────────────────────────────────────────────

function ProductCard({ p, openPopup }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        ...S.card,
        border: hov ? `1.5px solid ${p.accent}66` : "1.5px solid rgba(255,255,255,0.07)",
        boxShadow: hov ? `0 8px 40px ${p.accent}22` : "0 2px 16px rgba(0,0,0,0.4)"
      }}
    >
      {/* CARD HEADER */}
      <div style={S.cardHead}>
        <div style={{ ...S.logoBox, background: p.logoBg, border: `1.5px solid ${p.accent}33` }}>
          {(() => {
            const inlineLogo = getInlineLogo(p.name);
            if (inlineLogo) return inlineLogo;

            const isGaming = p.category === "Gaming";
            const imgUrl = getFavicon(p.name, p.originalProduct?.customIcon);

            if (imgUrl) {
              return (
                <img
                  src={getProxiedUrl(imgUrl)}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: isGaming ? "cover" : "contain",
                    padding: isGaming ? "0" : "4px"
                  }}
                  onError={(e) => {
                    if (e.target.src.includes('clearbit.com')) {
                      const domain = getDomainFromUrl(e.target.src);
                      e.target.src = `https://www.google.com/s2/favicons?domain=${domain || 'google.com'}&sz=256`;
                      return;
                    }
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />
              );
            }
            return (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "20px", fontWeight: "bold", color: p.accent }}>
                {p.name ? p.name.charAt(0).toUpperCase() : "?"}
              </div>
            );
          })()}
          <div style={{ display: "none", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", fontSize: "20px", fontWeight: "bold", color: p.accent }}>
            {p.name ? p.name.charAt(0).toUpperCase() : "?"}
          </div>
        </div>

        {/* Name + badges */}
        <div style={S.headInfo}>
          <div style={S.cardName}>{p.name}</div>
          <div style={S.badgeRow}>
            <span style={{ ...S.catTag, color: p.tagColor, background: p.tagColor + "18", border: `1px solid ${p.tagColor}44`, position: 'static', marginTop: 0 }}>
              {p.tag}
            </span>
            <span style={{ ...S.profileBadge, color: p.profileColor, borderColor: p.profileColor + "44", background: p.profileColor + "12" }}>
              ⚡ {p.profileType}
            </span>
          </div>
          <div style={S.subtitleTxt}>{p.subtitle}</div>
        </div>
      </div>

      {/* PLANS */}
      <div style={S.plans}>
        {p.plans.map((pl, i) => (
          <div key={i} style={{ ...S.plan, borderColor: p.accent + "33" }}>
            <div style={S.planLeft}>
              <span style={{ ...S.qualityTag, color: p.accent, borderColor: p.accent + "44" }}>
                🖥 {pl.quality}
              </span>
              <span style={{ ...S.durTag, color: "#94a3b8", borderColor: "rgba(255,255,255,0.15)" }}>
                {pl.duration}
              </span>
            </div>
            <div style={S.planRight}>
              <span style={{ ...S.price, color: p.accent }}>{pl.price}</span>
              <button
                onClick={() => openPopup(p, pl)}
                style={{ ...S.buyBtn, color: p.accent, border: `1.5px solid ${p.accent}55`, background: `${p.accent}12` }}
                onMouseEnter={(e) => {
                  e.target.style.background = p.accent;
                  e.target.style.color = "#000";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = `${p.accent}12`;
                  e.target.style.color = p.accent;
                }}
              >
                Buy
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── INLINE STYLES ────────────────────────────────────────────────────────────

const S = {
  page: {
    minHeight: "100vh",
    background: "#0c0c14",
    fontFamily: "'Segoe UI',system-ui,sans-serif",
    color: "#fff"
  },
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 20px",
    background: "rgba(12,12,20,0.95)",
    backdropFilter: "blur(20px)",
    borderBottom: "1px solid rgba(255,255,255,0.07)",
    position: "sticky",
    top: 0,
    zIndex: 50
  },
  brand: { display: "flex", alignItems: "center", gap: 10 },
  brandIcon: {},
  brandTxt: { fontSize: 17, fontWeight: 900, letterSpacing: -0.5 },
  navMid: { display: "flex", gap: 16 },
  navItem: { fontSize: 13, color: "#64748b", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 },
  navR: { display: "flex", alignItems: "center", gap: 10 },
  liveBtn: {
    padding: "7px 14px",
    borderRadius: 20,
    background: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.35)",
    color: "#818cf8",
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit"
  },
  tabs: {
    display: "flex",
    gap: 8,
    padding: "16px 16px 0",
    overflowX: "auto"
  },
  tab: {
    padding: "7px 16px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.09)",
    background: "rgba(255,255,255,0.04)",
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    whiteSpace: "nowrap",
    transition: "all 0.18s",
    fontFamily: "inherit"
  },
  tabOn: {
    background: "rgba(99,102,241,0.18)",
    color: "#a5b4fc",
    border: "1px solid rgba(99,102,241,0.4)"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    padding: "14px 14px 32px"
  },
  card: {
    borderRadius: 16,
    background: "#13131f",
    overflow: "hidden",
    transition: "border 0.2s, box-shadow 0.2s"
  },
  cardHead: {
    display: "flex",
    alignItems: "flex-start",
    gap: 12,
    padding: "14px 14px 10px",
    position: "relative"
  },
  logoBox: {
    width: 68,
    height: 68,
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    overflow: "hidden"
  },
  headInfo: { flex: 1, minWidth: 0 },
  cardName: { fontSize: 17, fontWeight: 800, color: "#f1f5f9", marginBottom: 5 },
  badgeRow: { display: "flex", gap: 6, marginBottom: 5, flexWrap: "wrap", alignItems: "center" },
  profileBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: "3px 9px",
    borderRadius: 6,
    border: "1px solid",
    letterSpacing: 0.3
  },
  subtitleTxt: { fontSize: 12, color: "#64748b", lineHeight: 1.4, whiteSpace: "pre-line" },
  catTag: {
    fontSize: 10,
    fontWeight: 800,
    padding: "3px 10px",
    borderRadius: 6,
    letterSpacing: 0.8,
    flexShrink: 0
  },
  plans: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
    padding: "0 0 4px"
  },
  plan: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "10px 14px",
    borderLeft: "3px solid",
    borderTop: "1px solid rgba(255,255,255,0.05)"
  },
  planLeft: { display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" },
  qualityTag: {
    fontSize: 11,
    fontWeight: 600,
    padding: "3px 10px",
    borderRadius: 6,
    border: "1px solid",
    background: "rgba(255,255,255,0.04)"
  },
  durTag: {
    fontSize: 11,
    fontWeight: 500,
    padding: "3px 10px",
    borderRadius: 6,
    border: "1px solid",
    background: "rgba(255,255,255,0.04)"
  },
  planRight: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 },
  price: { fontSize: 18, fontWeight: 900, minWidth: 52, textAlign: "right" },
  buyBtn: {
    padding: "6px 18px",
    borderRadius: 8,
    fontSize: 12,
    fontWeight: 700,
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    fontFamily: "inherit"
  },

  // Modal / Popup Overlay
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.85)",
    backdropFilter: "blur(12px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    zIndex: 999
  },
  modal: {
    background: "#13131f",
    borderRadius: 20,
    width: "100%",
    maxWidth: 440,
    padding: 24,
    position: "relative"
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: 18,
    cursor: "pointer"
  },
  modalHead: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20
  },
  modalLogoBox: {
    width: 60,
    height: 60,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  },
  modalTitleBlock: { flex: 1 },
  modalTitle: { fontSize: 18, fontWeight: 800, color: "#fff", margin: 0 },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12
  },
  deviceGrid: {
    display: "grid",
    gap: 8,
    marginBottom: 24
  },
  deviceBtn: {
    background: "rgba(255,255,255,0.03)",
    border: "1.5px solid rgba(255,255,255,0.07)",
    borderRadius: 10,
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#cbd5e1",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.15s",
    fontFamily: "inherit"
  },
  submitBuyBtn: {
    width: "100%",
    padding: "14px",
    borderRadius: 12,
    border: "none",
    fontSize: 14,
    fontWeight: 700,
    transition: "all 0.2s",
    fontFamily: "inherit"
  }
};
