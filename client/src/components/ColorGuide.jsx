import React from 'react';

export default function ColorGuide() {

  const brands = [
    {
      name: "Netflix",
      primary: "#E50914",
      bg: "#1A0000",
      logoSize: "72×22px",
      boxSize: "68×68px",
      radius: "14px",
      svgViewBox: "111×30",
      ratio: "3.7 : 1  (wide wordmark)",
      logoType: "Wordmark (horizontal)",
      notes: "Red wordmark on dark red bg. NO square border.",
      swatch: ["#E50914","#1A0000","#F59E0B","#13131F"],
      swatchLabel:["Brand Red","Logo BG","Badge Gold","Card BG"],
    },
    {
      name: "Amazon Prime Video",
      primary: "#00A8E0",
      bg: "#001522",
      logoSize: "54×54px",
      boxSize: "68×68px",
      radius: "14px",
      svgViewBox: "80×80 (1:1 square)",
      ratio: "1 : 1  (square tile)",
      logoType: "Square Tile",
      notes: "Blue square bg, white text 'prime video', orange smile arc.",
      swatch: ["#00A8E0","#001522","#FF9900","#13131F"],
      swatchLabel:["Brand Blue","Logo BG","Smile Orange","Card BG"],
    },
    {
      name: "Spotify",
      primary: "#1DB954",
      bg: "#001208",
      logoSize: "54×54px",
      boxSize: "68×68px",
      radius: "14px",
      svgViewBox: "80×80 (1:1 circle)",
      ratio: "1 : 1  (circle)",
      logoType: "Circle Icon",
      notes: "Green circle with 3 white sound-wave arcs.",
      swatch: ["#1DB954","#001208","#4ADE80","#13131F"],
      swatchLabel:["Brand Green","Logo BG","Badge Green","Card BG"],
    },
    {
      name: "YouTube Premium",
      primary: "#FF0000",
      bg: "#1A0000",
      logoSize: "54×54px",
      boxSize: "68×68px",
      radius: "14px",
      svgViewBox: "80×80 (1:1 square)",
      ratio: "1 : 1  (square)",
      logoType: "Play Button Square",
      notes: "Red square, white triangle play icon centered.",
      swatch: ["#FF0000","#1A0000","#FF4444","#13131F"],
      swatchLabel:["Brand Red","Logo BG","Tag Red","Card BG"],
    },
    {
      name: "Disney+ Hotstar",
      primary: "#1F80E0",
      bg: "#00061A",
      logoSize: "54×54px",
      boxSize: "68×68px",
      radius: "14px",
      svgViewBox: "80×80 (1:1 square)",
      ratio: "1 : 1  (square)",
      logoType: "Square Tile",
      notes: "Dark navy bg, blue Disney+ wordmark.",
      swatch: ["#1F80E0","#00061A","#4ADE80","#13131F"],
      swatchLabel:["Brand Blue","Logo BG","Badge Green","Card BG"],
    },
    {
      name: "Steam Games",
      primary: "#1B9CF0",
      bg: "#1B2838",
      logoSize: "54×54px",
      boxSize: "68×68px",
      radius: "14px",
      svgViewBox: "80×80 (1:1 square)",
      ratio: "1 : 1  (square)",
      logoType: "Square Tile / Game Cover",
      notes: "Steam dark navy bg + steam icon OR game header.jpg 460×215 crop.",
      swatch: ["#1B9CF0","#1B2838","#C6D4DF","#13131F"],
      swatchLabel:["Steam Blue","Steam Dark","Steam Grey","Card BG"],
    },
  ];

  const globalColors = [
    { hex:"#0C0C14", label:"Page Background" },
    { hex:"#13131F", label:"Card Background" },
    { hex:"#1C1C2E", label:"Plan Row BG" },
    { hex:"#6366F1", label:"Brand Accent (Indigo)" },
    { hex:"#F59E0B", label:"Shared Profile Badge" },
    { hex:"#4ADE80", label:"Private Account Badge" },
    { hex:"#F1F5F9", label:"Title Text" },
    { hex:"#475569", label:"Subtitle Text" },
    { hex:"#94A3B8", label:"Muted Text" },
  ];

  const logoRatios = [
    { service:"Netflix",        viewBox:"111 × 30",  rendered:"72 × 22px",  ratio:"3.7:1",  shape:"Wide Horizontal" },
    { service:"Amazon Prime",   viewBox:"80 × 80",   rendered:"54 × 54px",  ratio:"1:1",    shape:"Square Tile" },
    { service:"Spotify",        viewBox:"80 × 80",   rendered:"54 × 54px",  ratio:"1:1",    shape:"Circle" },
    { service:"YouTube",        viewBox:"80 × 80",   rendered:"54 × 54px",  ratio:"1:1",    shape:"Square" },
    { service:"Disney+",        viewBox:"80 × 80",   rendered:"54 × 54px",  ratio:"1:1",    shape:"Square" },
    { service:"Steam Games",    viewBox:"80 × 80",   rendered:"54 × 54px",  ratio:"1:1",    shape:"Square" },
    { service:"Logo Box (outer)",viewBox:"—",        rendered:"68 × 68px",  ratio:"1:1",    shape:"Rounded Square, r=14px" },
  ];

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.headerIcon}>🎨</div>
        <div>
          <h1 style={S.title}>StreamBazaar — Colour & Logo Guide</h1>
          <p style={S.sub}>Exact hex codes, logo dimensions & ratios for all services</p>
        </div>
      </div>

      {/* GLOBAL COLORS */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>🌐 Global UI Colour Palette</h2>
        <div style={S.swatchGrid}>
          {globalColors.map(c => (
            <div key={c.hex} style={S.swatchCard}>
              <div style={{...S.bigSwatch, background:c.hex, border: c.hex==="#F1F5F9"?"1px solid #333":"none"}}/>
              <div style={S.swatchHex}>{c.hex}</div>
              <div style={S.swatchLbl}>{c.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* LOGO RATIO TABLE */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>📐 Logo Box & Ratio Reference</h2>
        <div style={S.table}>
          <div style={S.tableHead}>
            {["Service","SVG ViewBox","Rendered Size","Ratio","Shape"].map(h=>(
              <div key={h} style={S.th}>{h}</div>
            ))}
          </div>
          {logoRatios.map((r,i)=>(
            <div key={i} style={{...S.tableRow, background: i%2===0?"rgba(255,255,255,0.02)":"transparent"}}>
              <div style={S.td}>{r.service}</div>
              <div style={{...S.td,fontFamily:"monospace",color:"#818cf8"}}>{r.viewBox}</div>
              <div style={{...S.td,fontFamily:"monospace",color:"#4ade80"}}>{r.rendered}</div>
              <div style={{...S.td,color:"#f59e0b",fontWeight:700}}>{r.ratio}</div>
              <div style={S.td}>{r.shape}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PER-BRAND */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>🏷️ Per-Brand Colour Breakdown</h2>
        <div style={S.brandGrid}>
          {brands.map(b => (
            <div key={b.name} style={S.brandCard}>
              <div style={{...S.brandStripe, background:b.primary}}/>
              <div style={S.brandBody}>
                <div style={S.brandName}>{b.name}</div>
                <div style={S.brandMeta}>
                  <span style={S.metaChip}>📦 {b.logoType}</span>
                  <span style={S.metaChip}>📐 {b.ratio}</span>
                </div>

                {/* Swatches */}
                <div style={S.swatchRow}>
                  {b.swatch.map((hex,i)=>(
                    <div key={hex} style={S.miniSwatchWrap}>
                      <div style={{...S.miniSwatch, background:hex, border: hex==="#F1F5F9"||hex==="#13131F"?"1px solid #444":"none"}}/>
                      <div style={S.miniHex}>{hex}</div>
                      <div style={S.miniLbl}>{b.swatchLabel[i]}</div>
                    </div>
                  ))}
                </div>

                {/* Sizes */}
                <div style={S.sizeRow}>
                  <div style={S.sizeItem}>
                    <span style={S.sizeKey}>Logo rendered</span>
                    <span style={{...S.sizeVal,color:"#4ade80"}}>{b.logoSize}</span>
                  </div>
                  <div style={S.sizeItem}>
                    <span style={S.sizeKey}>Box size</span>
                    <span style={{...S.sizeVal,color:"#818cf8"}}>{b.boxSize}</span>
                  </div>
                  <div style={S.sizeItem}>
                    <span style={S.sizeKey}>Box radius</span>
                    <span style={{...S.sizeVal,color:"#f59e0b"}}>{b.radius}</span>
                  </div>
                  <div style={S.sizeItem}>
                    <span style={S.sizeKey}>SVG viewBox</span>
                    <span style={{...S.sizeVal,color:"#94a3b8"}}>{b.svgViewBox}</span>
                  </div>
                </div>

                <div style={S.noteBox}>💡 {b.notes}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* QUICK COPY */}
      <section style={S.section}>
        <h2 style={S.sectionTitle}>⚡ Quick Copy — CSS Variables</h2>
        <div style={S.codeBox}>
          <pre style={S.code}>{`:root {
  /* Page */
  --bg-page:       #0C0C14;
  --bg-card:       #13131F;
  --bg-plan-row:   #1C1C2E;

  /* Logo boxes */
  --logo-box-size:   68px;
  --logo-box-radius: 14px;

  /* Logo rendered sizes */
  --logo-netflix:  72px × 22px;   /* ratio 3.7:1 */
  --logo-square:   54px × 54px;   /* ratio 1:1   */

  /* Brand accents */
  --color-netflix:  #E50914;
  --color-prime:    #00A8E0;
  --color-spotify:  #1DB954;
  --color-youtube:  #FF0000;
  --color-disney:   #1F80E0;
  --color-steam:    #1B9CF0;

  /* UI */
  --accent-indigo:  #6366F1;
  --badge-shared:   #F59E0B;
  --badge-private:  #4ADE80;
  --text-primary:   #F1F5F9;
  --text-muted:     #475569;
}`}</pre>
        </div>
      </section>
    </div>
  );
}

const S = {
  page:{ minHeight:"100vh", background:"#080810", fontFamily:"'Segoe UI',system-ui,sans-serif", color:"#fff", padding:"0 0 48px" },
  header:{ display:"flex", alignItems:"center", gap:16, padding:"28px 24px 20px", borderBottom:"1px solid rgba(255,255,255,0.07)" },
  headerIcon:{ fontSize:40 },
  title:{ fontSize:22, fontWeight:900, margin:0, letterSpacing:-0.5 },
  sub:{ color:"#475569", fontSize:13, marginTop:4 },
  section:{ padding:"24px 20px 0" },
  sectionTitle:{ fontSize:15, fontWeight:700, color:"#a5b4fc", marginBottom:16, letterSpacing:0.3 },

  // global swatches
  swatchGrid:{ display:"flex", flexWrap:"wrap", gap:10 },
  swatchCard:{ display:"flex", flexDirection:"column", alignItems:"center", gap:6, width:80 },
  bigSwatch:{ width:60, height:60, borderRadius:12 },
  swatchHex:{ fontSize:10, fontFamily:"monospace", color:"#94a3b8" },
  swatchLbl:{ fontSize:10, color:"#475569", textAlign:"center", lineHeight:1.3 },

  // table
  table:{ borderRadius:12, overflow:"hidden", border:"1px solid rgba(255,255,255,0.08)" },
  tableHead:{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 0.7fr 1.2fr", background:"rgba(99,102,241,0.15)", padding:"10px 14px", gap:8 },
  th:{ fontSize:11, fontWeight:700, color:"#818cf8", letterSpacing:0.5, textTransform:"uppercase" },
  tableRow:{ display:"grid", gridTemplateColumns:"1.6fr 1fr 1fr 0.7fr 1.2fr", padding:"9px 14px", gap:8, borderTop:"1px solid rgba(255,255,255,0.04)" },
  td:{ fontSize:12, color:"#cbd5e1", display:"flex", alignItems:"center" },

  // brand cards
  brandGrid:{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))", gap:14 },
  brandCard:{ borderRadius:14, overflow:"hidden", background:"#13131f", border:"1px solid rgba(255,255,255,0.07)" },
  brandStripe:{ height:5 },
  brandBody:{ padding:"14px" },
  brandName:{ fontSize:15, fontWeight:800, marginBottom:8, color:"#f1f5f9" },
  brandMeta:{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" },
  metaChip:{ fontSize:10, padding:"2px 8px", borderRadius:20, background:"rgba(255,255,255,0.06)", color:"#94a3b8", border:"1px solid rgba(255,255,255,0.08)" },

  swatchRow:{ display:"flex", gap:8, marginBottom:12 },
  miniSwatchWrap:{ display:"flex", flexDirection:"column", alignItems:"center", gap:3 },
  miniSwatch:{ width:36, height:36, borderRadius:8 },
  miniHex:{ fontSize:9, fontFamily:"monospace", color:"#64748b" },
  miniLbl:{ fontSize:8, color:"#475569", textAlign:"center" },

  sizeRow:{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:6, marginBottom:10 },
  sizeItem:{ display:"flex", flexDirection:"column", gap:2, background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"6px 8px" },
  sizeKey:{ fontSize:9, color:"#475569", textTransform:"uppercase", letterSpacing:0.5 },
  sizeVal:{ fontSize:12, fontWeight:700, fontFamily:"monospace" },

  noteBox:{ fontSize:11, color:"#64748b", background:"rgba(255,255,255,0.03)", borderRadius:8, padding:"8px 10px", lineHeight:1.4 },

  // code
  codeBox:{ borderRadius:12, overflow:"hidden", border:"1px solid rgba(99,102,241,0.25)", background:"#0d0d1a" },
  code:{ margin:0, padding:"20px", fontSize:12, color:"#a5b4fc", fontFamily:"'Courier New',monospace", lineHeight:1.7, overflowX:"auto" },
};
