import React, { useState, useEffect, useRef } from "react";

const API_BASE = import.meta.env.PROD ? "" : "http://localhost:5000";

const getProxiedUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("data:")) return url;
  if (url.startsWith("/") || url.startsWith("http://localhost") || url.startsWith("https://streambazaar")) return url;
  return `${API_BASE}/api/proxy-image?url=${encodeURIComponent(url)}`;
};

const highlightMatch = (text, query) => {
  if (!query || !text) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === query.toLowerCase() ? (
          <span key={i} style={{ color: '#6366f1', fontWeight: '700' }}>{part}</span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default function SearchDemo() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounced live search query matching hitting backend search API
  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setOpen(false);
      return;
    }

    const handler = setTimeout(() => {
      fetch(`${API_BASE}/api/search-games?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          const mapped = data.map((item, idx) => {
            const isGame = item.type === "Game";
            const tag = isGame ? (item.domain === "Steam Game" ? "STEAM" : "EPIC") : "BRAND";
            const tagColor = isGame ? "#1b9cf0" : "#e50914";
            return {
              id: idx,
              name: item.name,
              subtitle: item.domain || (isGame ? "Game Title" : "Brand Logo"),
              logo: getProxiedUrl(item.icon),
              tag: tag,
              tagColor: tagColor,
              isSvg: !isGame
            };
          });
          setResults(mapped.slice(0, 7));
          setOpen(true);
        })
        .catch((err) => {
          console.error("Failed to query search API:", err);
        });
    }, 200);

    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handler = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (item) => {
    setSelected(item);
    setQuery(item.name);
    setOpen(false);
    setImgError(false);
  };

  const handleClear = () => {
    setSelected(null);
    setQuery("");
    setResults([]);
    setImgError(false);
    inputRef.current?.focus();
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <span style={styles.logoIcon}>🎮</span>
          <span style={styles.logoText}>Stream<span style={styles.logoAccent}>Bazaar</span></span>
        </div>
        <span style={styles.badge}>Live Search Demo</span>
      </div>

      <div style={styles.container}>
        <h2 style={styles.title}>Unified Game & Service Search</h2>
        <p style={styles.subtitle}>Type search criteria to fetch live Steam, Epic, and brand logos instantly 🚀</p>

        {/* SEARCH BOX — SteamDB Style */}
        <div style={styles.searchSection}>
          <label style={styles.label}>Service / Game Title (Live Autocomplete)</label>

          <div style={styles.searchBox}>
            {/* LEFT LOGO BOX */}
            <div style={selected && !selected.isSvg ? { ...styles.logoBox, width: 120 } : styles.logoBox}>
              {selected && !imgError ? (
                <img
                  src={selected.logo}
                  alt={selected.name}
                  style={selected.isSvg ? styles.svgLogo : styles.gameLogo}
                  onError={() => setImgError(true)}
                />
              ) : (
                <span style={styles.placeholderIcon}>
                  {selected ? selected.name[0] : "🔍"}
                </span>
              )}
            </div>

            {/* INPUT */}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (selected) setSelected(null);
              }}
              onFocus={() => results.length > 0 && setOpen(true)}
              placeholder="GTA V, Netflix, NordVPN, Elden Ring..."
              style={styles.input}
            />

            {/* CLEAR BUTTON */}
            {query && (
              <button onClick={handleClear} style={styles.clearBtn}>✕</button>
            )}
          </div>

          {/* DROPDOWN */}
          {open && results.length > 0 && (
            <div ref={dropdownRef} style={styles.dropdown}>
              {results.map((item) => (
                <div
                  key={item.id}
                  style={styles.dropdownItem}
                  onMouseDown={() => handleSelect(item)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(99,102,241,0.15)";
                    e.currentTarget.style.borderLeft = "3px solid #6366f1";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.borderLeft = "3px solid transparent";
                  }}
                >
                  {/* Thumbnail */}
                  <div style={!item.isSvg ? { ...styles.thumbBox, width: 96, height: 36 } : styles.thumbBox}>
                    {item.logo ? (
                      <img
                        src={item.logo}
                        alt=""
                        style={!item.isSvg ? { ...styles.thumbImg, width: 96, height: 36 } : styles.thumbSvg}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <span style={{ fontSize: 10, color: "#6366f1" }}>{item.name[0]}</span>
                    )}
                  </div>
                  {/* Text */}
                  <div style={styles.itemText}>
                    <span style={styles.itemName}>{highlightMatch(item.name, query)}</span>
                    <span style={styles.itemSub}>{item.subtitle}</span>
                  </div>
                  {/* Tag */}
                  <span style={{ ...styles.itemTag, background: item.tagColor + "22", color: item.tagColor, border: `1px solid ${item.tagColor}44` }}>
                    {item.tag}
                  </span>
                </div>
              ))}
            </div>
          )}

          {open && results.length === 0 && query.length > 1 && (
            <div style={styles.noResults}>No matches found in database 😕</div>
          )}
        </div>

        {/* SELECTED PREVIEW */}
        {selected && (
          <div style={styles.preview}>
            <span style={styles.previewLabel}>✅ Selection Detail:</span>
            <div style={styles.previewCard}>
              <div style={styles.previewImgWrap}>
                {!imgError && selected.logo ? (
                  <img
                    src={selected.logo}
                    alt=""
                    style={selected.isSvg ? styles.previewSvg : styles.previewImg}
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <span style={styles.previewFallback}>{selected.name[0]}</span>
                )}
              </div>
              <div>
                <div style={styles.previewName}>{selected.name}</div>
                <div style={styles.previewSub}>{selected.subtitle}</div>
                <span style={{ ...styles.itemTag, background: selected.tagColor + "22", color: selected.tagColor, border: `1px solid ${selected.tagColor}44`, marginTop: 6, display: "inline-block" }}>
                  {selected.tag}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* HOW IT WORKS */}
        <div style={styles.howBox}>
          <div style={styles.howTitle}>💡 Integrated Search System Features</div>
          <div style={styles.howSteps}>
            <div style={styles.step}><span style={styles.stepNum}>1</span> Queries local seed list, Epic Games GraphQL, and Steam Web API</div>
            <div style={styles.step}><span style={styles.stepNum}>2</span> Fetches brand assets using Logo.dev and fallback engines</div>
            <div style={styles.step}><span style={styles.stepNum}>3</span> Provides instant previews with high-fidelity cover imagery</div>
            <div style={styles.step}><span style={styles.stepNum}>4</span> Integrated proxy resolver handles cross-origin asset loading securely</div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)",
    fontFamily: "'Segoe UI', sans-serif",
    color: "#fff",
    padding: "0 0 40px",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 24px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.3)",
    backdropFilter: "blur(10px)",
  },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoIcon: { fontSize: 26 },
  logoText: { fontSize: 20, fontWeight: 700, letterSpacing: 0.5 },
  logoAccent: { color: "#6366f1" },
  badge: {
    background: "rgba(99,102,241,0.2)",
    color: "#818cf8",
    border: "1px solid rgba(99,102,241,0.3)",
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
  },
  container: {
    maxWidth: 560,
    margin: "32px auto",
    padding: "0 20px",
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    margin: "0 0 6px",
    background: "linear-gradient(90deg, #fff, #a5b4fc)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: { color: "#64748b", fontSize: 14, margin: "0 0 28px" },
  searchSection: { position: "relative" },
  label: { display: "block", fontSize: 13, fontWeight: 600, color: "#94a3b8", marginBottom: 10, letterSpacing: 0.5, textTransform: "uppercase" },
  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "rgba(255,255,255,0.05)",
    border: "1.5px solid rgba(99,102,241,0.4)",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 0 0 1px rgba(99,102,241,0.1), 0 4px 20px rgba(0,0,0,0.3)",
    transition: "border-color 0.2s",
  },
  logoBox: {
    width: 56,
    height: 56,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    flexShrink: 0,
    overflow: "hidden",
  },
  gameLogo: { width: "100%", height: "100%", objectFit: "cover" },
  svgLogo: { width: 36, height: 36, objectFit: "contain" },
  placeholderIcon: { fontSize: 22, opacity: 0.5 },
  input: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: 15,
    padding: "14px 14px",
    fontFamily: "inherit",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#64748b",
    fontSize: 16,
    cursor: "pointer",
    padding: "0 14px",
    transition: "color 0.2s",
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    background: "#1e1e2e",
    border: "1.5px solid rgba(99,102,241,0.35)",
    borderRadius: 12,
    overflow: "hidden",
    zIndex: 100,
    boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
  },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 14px",
    cursor: "pointer",
    borderLeft: "3px solid transparent",
    transition: "background 0.15s, border-left 0.15s",
  },
  thumbBox: {
    width: 52,
    height: 30,
    borderRadius: 6,
    overflow: "hidden",
    background: "#0f0f1a",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbImg: { width: 52, height: 30, objectFit: "cover" },
  thumbSvg: { width: 30, height: 20, objectFit: "contain" },
  itemText: { flex: 1, display: "flex", flexDirection: "column", gap: 2 },
  itemName: { fontSize: 14, fontWeight: 600, color: "#e2e8f0" },
  itemSub: { fontSize: 11, color: "#64748b" },
  itemTag: {
    fontSize: 10,
    fontWeight: 700,
    padding: "2px 8px",
    borderRadius: 20,
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  noResults: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    right: 0,
    background: "#1e1e2e",
    border: "1.5px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "20px",
    textAlign: "center",
    color: "#64748b",
    fontSize: 14,
  },
  preview: { marginTop: 24 },
  previewLabel: { fontSize: 13, color: "#4ade80", fontWeight: 600, display: "block", marginBottom: 10 },
  previewCard: {
    display: "flex",
    alignItems: "center",
    gap: 16,
    background: "rgba(99,102,241,0.08)",
    border: "1px solid rgba(99,102,241,0.25)",
    borderRadius: 12,
    padding: 16,
  },
  previewImgWrap: {
    width: 120,
    height: 45,
    borderRadius: 8,
    overflow: "hidden",
    background: "#0f0f1a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  previewImg: { width: 120, height: 45, objectFit: "cover" },
  previewSvg: { width: 64, height: 36, objectFit: "contain" },
  previewFallback: { fontSize: 28, fontWeight: 700, color: "#6366f1" },
  previewName: { fontSize: 16, fontWeight: 700, color: "#e2e8f0" },
  previewSub: { fontSize: 12, color: "#64748b", marginTop: 2 },
  howBox: {
    marginTop: 32,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 12,
    padding: "18px 20px",
  },
  howTitle: { fontSize: 14, fontWeight: 700, color: "#a5b4fc", marginBottom: 14 },
  howSteps: { display: "flex", flexDirection: "column", gap: 10 },
  step: { display: "flex", alignItems: "center", gap: 10, fontSize: 13, color: "#94a3b8" },
  stepNum: {
    background: "rgba(99,102,241,0.3)",
    color: "#818cf8",
    width: 22,
    height: 22,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 11,
    fontWeight: 700,
    flexShrink: 0,
  },
};
