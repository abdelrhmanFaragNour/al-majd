import { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";

/* ════════════════════════════════════════════════════════════════════
   CONSTANTS & SEEDS
════════════════════════════════════════════════════════════════════ */
const LOGO_SRC = "data:image/webp;base64,UklGRjoaAABXRUJQVlA4IC4aAACwWgCdASrIAMgAPlEkjkUjoiEUum14OAUEpu9H/08NH5P1/3LjiK2p77TyZ9gfVHmV9A/nv20/6H1L+YpzqPMH+xP7Qe79/qP3A91X9T9QD+o/5/rTfQc/aj03/3d+Gv+4f9X9xvbW1Z2ULxq/J+EP4/8+/kPy/9eLJX14/2/oP/Kfu7+p/vP7q+0Hgv8i9RH8q/pX+r/Mf0U9xLbH0CO/v+3/wHjp/1XpF9hP+h7gX6u/637gPam8NHzr2Af6D/Xf91943x3f9v+T/0PqD+j//B/m/gP/nf9h/5X+A9rb//+3b9tP//7qv7Hf/Y4/nqspyO8h+GSR7/ETpLdmcl+c43Q8yB88LzQ4PiUlRNxaVMlIkLo7wQb0RmGmgF5RdbZ8N4H1/2F5PD9O4qquy+1/ToqIyg8iN11x0qLO0AYgDgxq0U6oBHqn9+NMagwuHAzurldVNfG+JjoWagyIOiPlcsDItXN6dDlHlvVrih4jBjVTf1QdbT7DjHZ7+FtAvZ2NDQAuJYO65dyr0enToKuAKDR0YVljCxpzumMTSZR552PVpXbGP2bbY75x64bsGSHdo/PaleCGqWfZJgpqe4wLL3asUDRmXh52JICkghYfxg9iczcihhP1Drn/bhNF0jeZAe++STpAMG7APqs/Zv2gZZ/9wHDfLxIocgU+eb+NkjfIJfXtlvMio9/A43lna5d7NtST4nQ2mXVY0PlPtvxB8txm6gpnhQN9R8wmoY/AU/25rm/xAfyWLZ7E3FH4mxi4Uflw2a+D1OSSPnSiijnPR5H1QoeZKVrOchokcj0phfudf5hoIfM2+4NEJfY0+f74TJSt1l/lnPZBNeTx3vk4k7esDfo5cxBoLB4PA8VbC3EfzonfBWDlfKptY1O3FL7RAVOacU3R5YUb2+h7qYm61e1nylS8oLzhuU2BL4+TxsPdXV0mPA+U5JU0h3kPwySbkLyX56rKcjvIfhkkQAD+/gbQAAw9v6MGQchhd4O9cAx1hwPql17Ef/EsVVnBPWzm4FKwHECj/oZ+OeWX85asrengcWerw3j4gFp9wM+Z9hb7HdsOnt5aemCEFxAK7wfhqzGUXh5pp4185nXos/5/oIgoGpJngAsm77Mq9e3LdHYSXiwUxUE8ZQt3b7rgfOllic97Fl96t42o6XLIRW/DOqbpBjSIhbsEds6iQVLnjXhd5KiqM8nsZqTSwWvCGA69vd9xvAGsuEgoCLqLklxVmQWH9emcgzwLoj83KNfo6T4jg/LIOjj1UX5kZKHrTPnz+HWGDHgQABTnloAH17IqLZBwC650XNNCl3Q3SU/KUHOwoXdVJBbyl0MiGBFUT3hmjwVjVruiZCcYvMH3x97Jaoe8A9J0G6O30CHGrZCZljRPNMWQQoqcYB7Q50bU4mdtPVcbkbZuWgpZiowl9P8ev6dPLz8vStKsynCwnLswxEhGCJsKsE7QT1kcV2Po5Up0ocA3nVqXiUlMEf87vNLBJtVAbzGgHzN7vpmMdLrHUPVjR7H4A5cU36VvXfjJsreAziqZlZf1ZUMZcyQH6D/vj+FSLi3ncJe1PM02CGgcrXNN0g8J1dmTL/NsOsU2lRe4wkf9oZ448gVfco0eATAIlRGkg4IA==";

const SHEET_ID   = "1nwJh2Cz-KP--SvvQmeipHate8GMfdreM";
const CACHE_KEY  = "majd_v3";
const ADMIN_KEY  = "majd_admin_v3";
const CACHE_TTL  = 10 * 60 * 1000;
const ADMIN_PASS = "majd2026";

const DEF_CFG = {
  googleForm:   "https://forms.gle/AdC1x8tzz5HSJzJz5",
  applyBtnText: "تقدم الآن",
  waEgypt:      "201000000000",
  waEgyptNum:   "+20 100 000 0000",
  waSaudi:      "966500000000",
  waSaudiNum:   "+966 50 000 0000",
  siteName:     "المجد جروب للتوظيف الطبي",
  tagline:      "بوابتك الذهبية للعمل في كبرى المستشفيات السعودية",
};

const SEED_VISA = [
  { id:"sv1", title:"طبيب عام",        city:"الرياض", salary:"15,000 ريال", exp:"3 سنوات",  urgent:true,  date:new Date().toISOString(), show:true },
  { id:"sv2", title:"ممرض/ة مؤهل/ة",  city:"جدة",    salary:"8,500 ريال",  exp:"سنتان",   urgent:false, date:new Date().toISOString(), show:true },
  { id:"sv3", title:"أخصائي تخدير",   city:"الدمام", salary:"18,000 ريال", exp:"5 سنوات", urgent:true,  date:new Date().toISOString(), show:true },
  { id:"sv4", title:"طبيب أشعة",      city:"الرياض", salary:"20,000 ريال", exp:"4 سنوات", urgent:false, date:new Date().toISOString(), show:true },
  { id:"sv5", title:"أخصائية تمريض", city:"جدة",    salary:"9,000 ريال",  exp:"سنتان",   urgent:true,  date:new Date().toISOString(), show:true },
];
const SEED_TRANS = [
  { id:"st1", title:"صيدلاني سريري",  city:"مكة",     salary:"12,000 ريال", exp:"سنة",    urgent:false, date:new Date().toISOString(), show:true },
  { id:"st2", title:"أخصائي مختبر",  city:"المدينة", salary:"9,000 ريال",  exp:"سنتان",  urgent:false, date:new Date().toISOString(), show:true },
  { id:"st3", title:"فني أشعة",       city:"الرياض",  salary:"7,500 ريال",  exp:"سنة",    urgent:true,  date:new Date().toISOString(), show:true },
];
const SEED_ADS = [
  { id:"ad1", img:"", title:"وظائف طبية عاجلة في السعودية",        subtitle:"تأشيرات جاهزة — سفر خلال أسابيع", link:"#", color:"#d4af37" },
  { id:"ad2", img:"", title:"نقل كفالة فوري",                       subtitle:"تواصل معنا الآن وابدأ إجراءاتك", link:"#", color:"#3b82f6" },
  { id:"ad3", img:"", title:"مميزات حصرية لأعضاء المجد جروب",      subtitle:"متابعة مستمرة حتى الوصول", link:"#", color:"#8b5cf6" },
];

/* ════════════════════════════════════════════════════════════════════
   GLOBAL CSS
════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&family=Playfair+Display:wght@700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root{
  --gold:#c9a227;
  --gold2:#e8c44a;
  --gold3:#f5e18a;
  --dark:#06060a;
  --dark2:#0c0c12;
  --dark3:#13131c;
  --dark4:#1c1c28;
  --glass:rgba(255,255,255,.032);
  --glass2:rgba(255,255,255,.06);
  --border:rgba(201,162,39,.16);
  --border2:rgba(201,162,39,.32);
  --text:#dde2ee;
  --text2:#9aa3b8;
  --r:14px;
  --r2:22px;
  --shadow:0 24px 80px rgba(0,0,0,.7);
  --shadow2:0 8px 32px rgba(0,0,0,.5);
  --ease:cubic-bezier(.22,.68,0,1.2);
  --ease2:cubic-bezier(.25,.8,.25,1);
}

html{scroll-behavior:smooth}
body{
  background:var(--dark);
  color:var(--text);
  font-family:'Cairo',sans-serif;
  direction:rtl;
  overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}

::selection{background:rgba(201,162,39,.3);color:#fff}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:var(--dark2)}
::-webkit-scrollbar-thumb{background:var(--gold);border-radius:4px}
::-webkit-scrollbar-thumb:hover{background:var(--gold2)}

/* ── Keyframes ───────────────────────────────────── */
@keyframes spin    {to{transform:rotate(360deg)}}
@keyframes fadeUp  {from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn  {from{opacity:0}to{opacity:1}}
@keyframes float   {0%,100%{transform:translateY(0) rotateZ(0)}50%{transform:translateY(-9px) rotateZ(.6deg)}}
@keyframes shimmer {0%{background-position:-400% 0}100%{background-position:400% 0}}
@keyframes pulse   {0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(.95)}}
@keyframes glow    {0%,100%{box-shadow:0 0 16px rgba(201,162,39,.25)}50%{box-shadow:0 0 36px rgba(201,162,39,.65)}}
@keyframes slideR  {from{opacity:0;transform:translateX(50px)}to{opacity:1;transform:translateX(0)}}
@keyframes slideL  {from{opacity:0;transform:translateX(-50px)}to{opacity:1;transform:translateX(0)}}
@keyframes orb     {0%{transform:translate(0,0) scale(1)}33%{transform:translate(30px,-20px) scale(1.05)}66%{transform:translate(-20px,15px) scale(.96)}100%{transform:translate(0,0) scale(1)}}
@keyframes ticker  {0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes borderGlow{0%,100%{border-color:rgba(201,162,39,.16)}50%{border-color:rgba(201,162,39,.5)}}
@keyframes cardIn  {from{opacity:0;transform:translateY(20px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}

/* ── Utility ─────────────────────────────────────── */
.fadeUp{animation:fadeUp .55s var(--ease2) both}
.fadeIn{animation:fadeIn .4s ease both}

/* ── 3D Card ─────────────────────────────────────── */
.card3d{
  transition:transform .3s var(--ease2),box-shadow .3s ease,border-color .3s ease;
  transform-style:preserve-3d;
  will-change:transform;
}
.card3d:hover{
  box-shadow:0 24px 64px rgba(0,0,0,.6),0 0 0 1px var(--border2),inset 0 1px 0 rgba(255,255,255,.08);
}

/* ── Button ──────────────────────────────────────── */
.btn{
  display:inline-flex;align-items:center;justify-content:center;
  gap:8px;font-family:'Cairo',sans-serif;font-weight:800;
  cursor:pointer;border:none;outline:none;
  transition:all .28s var(--ease2);
}
.btn-gold{
  background:linear-gradient(135deg,var(--gold) 0%,var(--gold2) 50%,var(--gold) 100%);
  background-size:200% 100%;
  color:#0a0805;border-radius:50px;
}
.btn-gold:hover{
  background-position:100% 0;
  box-shadow:0 6px 28px rgba(201,162,39,.5);
  transform:translateY(-2px) scale(1.02);
}
.btn-ghost{
  background:var(--glass);border:1.5px solid var(--border);
  color:var(--text);border-radius:50px;
  backdrop-filter:blur(12px);
}
.btn-ghost:hover{
  background:var(--glass2);border-color:var(--border2);
  transform:translateY(-2px);
}
.btn-danger{
  background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);
  color:#f87171;border-radius:8px;
}
.btn-danger:hover{background:rgba(239,68,68,.2)}

/* ── Input ───────────────────────────────────────── */
.field{
  background:var(--dark3);border:1.5px solid rgba(255,255,255,.08);
  color:var(--text);font-family:'Cairo',sans-serif;
  border-radius:var(--r);outline:none;
  transition:border-color .25s,box-shadow .25s;
  width:100%;
}
.field:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,162,39,.14)}
.field::placeholder{color:var(--text2)}

/* ── Tab ─────────────────────────────────────────── */
.tab{font-family:'Cairo',sans-serif;font-weight:700;cursor:pointer;border:none;outline:none;
  transition:all .28s var(--ease2);border-radius:50px;padding:13px 38px;font-size:14px}
.tab-on{
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  color:#080604;box-shadow:0 4px 20px rgba(201,162,39,.4),0 0 0 0 rgba(201,162,39,0);
  transform:scale(1.03);
}
.tab-off{background:var(--dark3);color:var(--text2)}
.tab-off:hover{background:var(--dark4);color:var(--text);transform:translateY(-1px)}

/* ── Shimmer ─────────────────────────────────────── */
.shimmer{
  background:linear-gradient(90deg,var(--dark3) 25%,var(--dark4) 50%,var(--dark3) 75%);
  background-size:400% 100%;animation:shimmer 1.8s ease-in-out infinite;
}

/* ── Badge ───────────────────────────────────────── */
.badge-urgent{
  font-size:10px;font-weight:900;padding:3px 10px;border-radius:20px;
  background:linear-gradient(135deg,#dc2626,#f97316);color:#fff;
  animation:glow 2.4s ease-in-out infinite;letter-spacing:.3px;
}

/* ── Slider ──────────────────────────────────────── */
.sl-arrow{
  width:46px;height:46px;border-radius:50%;
  background:rgba(10,10,16,.75);backdrop-filter:blur(16px);
  border:1px solid rgba(255,255,255,.12);color:#fff;font-size:20px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;outline:none;transition:all .25s var(--ease2);
  user-select:none;
}
.sl-arrow:hover{background:rgba(201,162,39,.2);border-color:var(--border2);transform:scale(1.1)}
.sl-dot{height:8px;border-radius:20px;cursor:pointer;transition:all .35s var(--ease2)}
.sl-dot-on{background:var(--gold);width:26px}
.sl-dot-off{background:rgba(255,255,255,.2);width:8px}
.sl-dot-off:hover{background:rgba(201,162,39,.5)}

/* ── Admin ───────────────────────────────────────── */
.admin-nav-item{
  padding:10px 16px;border-radius:10px;cursor:pointer;font-size:13px;
  font-weight:700;border:none;font-family:'Cairo',sans-serif;
  transition:all .2s;text-align:right;width:100%;
}
.admin-nav-on{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0a0805}
.admin-nav-off{background:transparent;color:var(--text2)}
.admin-nav-off:hover{background:var(--dark4);color:var(--text)}
.admin-row{
  border:1px solid var(--border);border-radius:12px;
  padding:12px 16px;transition:all .2s;
}
.admin-row:hover{border-color:var(--border2);background:rgba(201,162,39,.04)}
.admin-small-btn{
  font-size:11px;padding:5px 12px;border-radius:8px;
  border:1px solid var(--border);background:var(--dark4);
  color:var(--text2);font-family:'Cairo',sans-serif;font-weight:700;
  cursor:pointer;transition:all .2s;
}
.admin-small-btn:hover{border-color:var(--border2);color:var(--text)}

/* ── Ticker ──────────────────────────────────────── */
.ticker-track{display:flex;animation:ticker 28s linear infinite}
.ticker-track:hover{animation-play-state:paused}

/* ── Parallax bg grid ────────────────────────────── */
.bg-grid{
  position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:
    linear-gradient(rgba(201,162,39,.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(201,162,39,.025) 1px,transparent 1px);
  background-size:56px 56px;
}

/* ── Stats card ──────────────────────────────────── */
.stat-card{
  transition:all .3s var(--ease2);
  border:1px solid var(--border);
  animation:borderGlow 4s ease-in-out infinite;
}
.stat-card:nth-child(2){animation-delay:.6s}
.stat-card:nth-child(3){animation-delay:1.2s}
.stat-card:nth-child(4){animation-delay:1.8s}
.stat-card:nth-child(5){animation-delay:2.4s}
.stat-card:hover{transform:translateY(-4px) scale(1.04);border-color:var(--border2)}

/* ── Responsive ──────────────────────────────────── */
@media(max-width:768px){
  .tab{padding:11px 22px;font-size:13px}
  .hide-mob{display:none!important}
}
@media(max-width:480px){
  .tab{padding:10px 18px;font-size:12px}
}
`;

/* ════════════════════════════════════════════════════════════════════
   UTILITIES
════════════════════════════════════════════════════════════════════ */
const uid = () => Math.random().toString(36).slice(2, 8);

/** #9 — strip all non-digits from phone */
const cleanPhone = (v) => String(v ?? "").replace(/\D/g, "");

/** #4 — safe date formatter */
const dateFmt = (d) => {
  if (!d) return "";
  const t = new Date(d);
  if (isNaN(t.getTime())) return "";
  const diff = Math.floor((Date.now() - t.getTime()) / 86400000);
  if (diff <= 0) return "اليوم";
  if (diff === 1) return "أمس";
  if (diff < 30)  return `منذ ${diff} يوم`;
  return t.toLocaleDateString("ar-SA", { year:"numeric", month:"short" });
};

/** #1 — flexible urgent parser */
const parseUrgent = (v) => {
  if (v == null) return false;
  if (typeof v === "boolean") return v;
  return ["true","نعم","yes","1"].includes(String(v).trim().toLowerCase());
};

/** #2 — show only if NOT explicitly hidden */
const parseShow = (v) => {
  if (v == null || v === "") return true;
  return !["لا","no","false","0"].includes(String(v).trim().toLowerCase());
};

/** hex color utils for slider */
const hexRgb = (h) => {
  const n = parseInt((h||"#c9a227").replace("#",""), 16);
  return `${(n>>16)&255},${(n>>8)&255},${n&255}`;
};
const hexLighten = (h, amt=40) => {
  try {
    return "#" + [1,3,5].map(i => Math.min(255, parseInt(h.slice(i,i+2),16)+amt)
      .toString(16).padStart(2,"0")).join("");
  } catch { return "#e8c44a"; }
};

/* ════════════════════════════════════════════════════════════════════
   CACHE & ADMIN STORE  (#11)
════════════════════════════════════════════════════════════════════ */
const cache = {
  save: (d) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts:Date.now(), d })); } catch {} },
  load: () => { try { const r=JSON.parse(localStorage.getItem(CACHE_KEY)||"null"); return r&&Date.now()-r.ts<CACHE_TTL?r.d:null; } catch { return null; } },
  clear: () => { try { localStorage.removeItem(CACHE_KEY); } catch {} },
};
const adminStore = {
  save: (d) => { try { localStorage.setItem(ADMIN_KEY, JSON.stringify(d)); } catch {} },
  load: () => { try { return JSON.parse(localStorage.getItem(ADMIN_KEY)||"null"); } catch { return null; } },
};

/* ════════════════════════════════════════════════════════════════════
   GOOGLE SHEETS  (#6 res.ok check)
════════════════════════════════════════════════════════════════════ */
async function fetchSheet(name) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(name)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} — sheet: ${name}`);
  const txt = await res.text();
  const s = txt.indexOf("("), e = txt.lastIndexOf(")");
  if (s < 0 || e < 0) throw new Error(`Invalid JSONP — sheet: ${name}`);
  return JSON.parse(txt.slice(s + 1, e)).table;
}

const parseSettings = (t) => {
  const cfg = { ...DEF_CFG };
  t?.rows?.forEach(r => { const k=r.c?.[0]?.v, v=r.c?.[1]?.v; if (k && v != null) cfg[k] = v; });
  return cfg;
};

/** #1 #2 #5 #7 — robust job parser */
const parseJobs = (t) => {
  if (!t?.rows) return [];
  return t.rows.map((r, i) => ({
    id:     `sh${i}-${uid()}`,
    title:  String(r.c?.[0]?.v ?? "").trim(),     // #7 trim
    city:   String(r.c?.[1]?.v ?? "").trim(),     // #7 trim
    salary: String(r.c?.[2]?.v ?? "").trim(),
    exp:    String(r.c?.[3]?.v ?? "").trim(),
    urgent: parseUrgent(r.c?.[4]?.v),             // #1
    date:   r.c?.[5]?.v ?? null,
    show:   parseShow(r.c?.[6]?.v),               // #2
  }))
  .filter(j => j.show && j.title)
  .sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return (isNaN(db)?0:db) - (isNaN(da)?0:da);
  });
};

const parseAds = (t) => {
  if (!t?.rows) return [];
  return t.rows.map((r, i) => ({
    id:       `ad${i}`,
    img:      String(r.c?.[0]?.v ?? "").trim(),
    title:    String(r.c?.[1]?.v ?? "").trim(),
    subtitle: String(r.c?.[2]?.v ?? "").trim(),
    link:     String(r.c?.[3]?.v ?? "#").trim(),
    color:    String(r.c?.[4]?.v ?? "#c9a227").trim(),
  })).filter(a => a.title || a.img);
};

/* ════════════════════════════════════════════════════════════════════
   MICRO COMPONENTS
════════════════════════════════════════════════════════════════════ */
const Spinner = ({ size = 34 }) => (
  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:14, padding:"4rem 2rem", color:"var(--gold)" }}>
    <div style={{ width:size, height:size, borderRadius:"50%", border:"3px solid rgba(201,162,39,.2)", borderTopColor:"var(--gold)", animation:"spin .9s linear infinite" }} />
    <span style={{ fontSize:14, opacity:.8, fontWeight:600 }}>جارٍ تحميل البيانات...</span>
  </div>
);

const ShimmerCard = () => (
  <div style={{ background:"var(--glass)", border:"1px solid var(--border)", borderRadius:"var(--r2)", padding:"1.6rem", display:"flex", flexDirection:"column", gap:14 }}>
    {[["65%",18],["45%",14],["80%",14],["100%",46]].map(([w,h],i) => (
      <div key={i} className="shimmer" style={{ width:w, height:h, borderRadius:8 }} />
    ))}
  </div>
);

const Chip = memo(({ icon, children }) => (
  <span style={{ display:"inline-flex", alignItems:"center", gap:5, background:"rgba(255,255,255,.05)", border:"1px solid rgba(255,255,255,.07)", borderRadius:8, padding:"4px 11px", fontSize:12, color:"#98a6bf", fontWeight:600 }}>
    <span style={{ opacity:.7, fontSize:11 }}>{icon}</span>{children}
  </span>
));

/* ════════════════════════════════════════════════════════════════════
   3D JOB CARD
════════════════════════════════════════════════════════════════════ */
const JobCard = memo(({ job, googleForm, applyBtnText, idx = 0 }) => {
  const ref   = useRef(null);
  const frame = useRef(null);
  const [tilt, setTilt] = useState({ x:0, y:0, shine:{ x:50, y:50 } });

  const onMove = useCallback((e) => {
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const nx = (e.clientX - r.left)  / r.width;
      const ny = (e.clientY - r.top)   / r.height;
      setTilt({ x:(ny-.5)*15, y:(nx-.5)*-15, shine:{x:nx*100, y:ny*100} });
    });
  }, []);

  const onLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    setTilt({ x:0, y:0, shine:{x:50, y:50} });
  }, []);

  return (
    <div
      ref={ref}
      className="card3d"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        background:"var(--glass)",
        border:"1px solid var(--border)",
        borderRadius:"var(--r2)",
        padding:"1.6rem",
        position:"relative",
        overflow:"hidden",
        transform:`perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        animation:`cardIn .5s var(--ease2) ${idx * 0.07}s both`,
      }}
    >
      {/* Dynamic shine layer */}
      <div style={{
        position:"absolute", inset:0, borderRadius:"var(--r2)", pointerEvents:"none",
        background:`radial-gradient(ellipse at ${tilt.shine.x}% ${tilt.shine.y}%, rgba(201,162,39,.1), transparent 55%)`,
        transition:"background .1s",
      }}/>
      {/* Top edge glint */}
      <div style={{ position:"absolut
