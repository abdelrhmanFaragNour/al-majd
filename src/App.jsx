// v3.1 — build fix ✓
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
        transform:"perspective(800px) rotateX(" + tilt.x + "deg) rotateY(" + tilt.y + "deg)",
        animation:"cardIn .5s var(--ease2) " + (idx * 0.07) + "s both",
      }}
    >
      <div style={{
        position:"absolute", inset:0, borderRadius:"var(--r2)", pointerEvents:"none",
        background:"radial-gradient(ellipse at " + tilt.shine.x + "% " + tilt.shine.y + "%, rgba(201,162,39,.1), transparent 55%)",
        transition:"background .1s",
      }}/>
      <div style={{
        position:"absolute", top:0, left:"20%", right:"20%",
        height:1, borderRadius:1,
        background:"linear-gradient(90deg,transparent,rgba(255,255,255,.12),transparent)",
      }}/>

      {job.urgent && (
        <span className="badge-urgent" style={{ position:"absolute", top:14, left:14 }}>⚡ عاجل</span>
      )}

      <h3 style={{ color:"var(--gold2)", fontSize:"1.06rem", fontWeight:800, lineHeight:1.4, marginBottom:6, paddingTop: job.urgent ? 26 : 0 }}>
        {job.title}
      </h3>
      <div style={{ display:"flex", alignItems:"center", gap:6, color:"var(--text2)", fontSize:13, marginBottom:14 }}>
        <span style={{ color:"var(--gold)", opacity:.65, fontSize:12 }}>📍</span>{job.city}
      </div>
      <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap" }}>
        {job.salary && <Chip icon="💰">{job.salary}</Chip>}
        {job.exp    && <Chip icon="⏱">{job.exp}</Chip>}
        {job.date   && <Chip icon="📅">{dateFmt(job.date)}</Chip>}
      </div>
      <a
        href={googleForm} target="_blank" rel="noopener noreferrer"
        className="btn btn-gold"
        style={{ width:"100%", padding:"12px 0", fontSize:13.5, borderRadius:12, textDecoration:"none" }}
      >
        {applyBtnText} ✦
      </a>
    </div>
  );
});

/* ════════════════════════════════════════════════════════════════════
   AD SLIDER  — fully animated, 3D depth
════════════════════════════════════════════════════════════════════ */
const AdSlider = memo(({ ads }) => {
  const [cur,    setCur]    = useState(0);
  const [dir,    setDir]    = useState(1);
  const [anim,   setAnim]   = useState(false);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);
  const progressRef = useRef(null);

  const go = useCallback((next, d = 1) => {
    setAnim(false);
    setDir(d);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setCur(typeof next === "function" ? next : next);
      setAnim(true);
    }));
  }, []);

  useEffect(() => { setAnim(true); }, []);

  useEffect(() => {
    if (ads.length < 2 || paused) return;
    timer.current = setInterval(() => {
      setCur(c => { const n = (c + 1) % ads.length; go(n, 1); return c; });
    }, 5000);
    return () => clearInterval(timer.current);
  }, [ads.length, paused, go]);

  if (!ads.length) return null;

  const ad   = ads[cur];
  const acol = ad.color || "#c9a227";

  const slideStyle = {
    animation: anim ? (dir > 0 ? "slideR .45s var(--ease2) both" : "slideL .45s var(--ease2) both") : "none",
  };

  return (
    <section style={{ maxWidth:1100, margin:"0 auto 56px", padding:"0 24px" }}>
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          position:"relative", borderRadius:"var(--r2)", overflow:"hidden",
          boxShadow:"var(--shadow), 0 0 0 1px var(--border)",
          minHeight:230,
        }}
      >
        {/* Slide content */}
        <a href={ad.link || "#"} target="_blank" rel="noopener noreferrer" style={{ display:"block", textDecoration:"none" }}>
          <div
            style={{
              ...slideStyle,
              minHeight:230, display:"flex", alignItems:"center", justifyContent:"center",
              padding:"2.5rem 5.5rem",
              background: ad.img
                ? `linear-gradient(rgba(6,6,10,.5),rgba(6,6,10,.5)),url(${ad.img}) center/cover`
                : `radial-gradient(ellipse at 25% 60%, rgba(${hexRgb(acol)},.2) 0%, transparent 65%),
                   radial-gradient(ellipse at 80% 30%, rgba(${hexRgb(acol)},.08) 0%, transparent 50%),
                   var(--dark2)`,
            }}
          >
            {/* Decorative grid lines */}
            <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px)", backgroundSize:"32px 32px", pointerEvents:"none" }} />

            <div style={{ textAlign:"center", position:"relative", zIndex:1 }}>
              <div style={{ display:"inline-block", background:"rgba(" + hexRgb(acol) + ",.15)", border:"1px solid rgba(" + hexRgb(acol) + ",.35)", borderRadius:50, padding:"4px 16px", fontSize:11, fontWeight:700, color:acol, letterSpacing:1, marginBottom:16 }}>
                ✦ المجد جروب
              </div>
              <div style={{ fontSize:"clamp(1.1rem,2.8vw,1.75rem)", fontWeight:900, color:"#fff", textShadow:"0 2px 16px rgba(0,0,0,.8)", lineHeight:1.3, marginBottom:10 }}>
                {ad.title}
              </div>
              {ad.subtitle && (
                <p style={{ color:"rgba(255,255,255,.65)", fontSize:14, marginBottom:20 }}>{ad.subtitle}</p>
              )}
              <span style={{ display:"inline-block", padding:"9px 28px", background:"linear-gradient(135deg," + acol + "," + hexLighten(acol) + ")", color:"#080604", borderRadius:50, fontWeight:800, fontSize:13 }}>
                اعرف أكثر →
              </span>
            </div>
          </div>
        </a>

        {/* Arrows */}
        {ads.length > 1 && <>
          <button className="sl-arrow" aria-label="السابق" onClick={() => go((cur - 1 + ads.length) % ads.length, -1)}
            style={{ position:"absolute", top:"50%", right:16, transform:"translateY(-50%)" }}>‹</button>
          <button className="sl-arrow" aria-label="التالي"  onClick={() => go((cur + 1) % ads.length, 1)}
            style={{ position:"absolute", top:"50%", left:16,  transform:"translateY(-50%)" }}>›</button>
        </>}

        {/* Progress bar */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2.5, background:"rgba(255,255,255,.08)" }}>
          {!paused && (
            <div ref={progressRef} key={cur + "-" + paused} style={{ height:"100%", background:"linear-gradient(90deg," + acol + "," + hexLighten(acol) + ")", animation:"ticker 5s linear forwards", width:"100%", transformOrigin:"left" }} />
          )}
        </div>
      </div>

      {/* Dots */}
      {ads.length > 1 && (
        <div style={{ display:"flex", justifyContent:"center", gap:8, marginTop:16 }}>
          {ads.map((_, i) => (
            <div key={i} className={`sl-dot ${i === cur ? "sl-dot-on" : "sl-dot-off"}`}
              onClick={() => go(i, i > cur ? 1 : -1)} />
          ))}
        </div>
      )}
    </section>
  );
});

/* ════════════════════════════════════════════════════════════════════
   PARALLAX HEADER  — mouse-tracking 3D logo
════════════════════════════════════════════════════════════════════ */
const Header = memo(({ cfg, error }) => {
  const [mouse, setMouse] = useState({ x:0, y:0 });
  const ref = useRef(null);
  const raf = useRef(null);

  const onMove = (e) => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      setMouse({
        x: ((e.clientX - r.left)  / r.width  - .5) * 22,
        y: ((e.clientY - r.top)   / r.height - .5) * 14,
      });
    });
  };

  return (
    <header ref={ref} onMouseMove={onMove} onMouseLeave={() => setMouse({ x:0, y:0 })}
      style={{ textAlign:"center", padding:"68px 24px 44px", position:"relative", overflow:"hidden" }}>

      {/* Ambient orbs */}
      {[["-10%","20%","400px","rgba(201,162,39,.06)","0s"],
        ["60%","10%","300px","rgba(59,130,246,.05)","1s"],
        ["30%","80%","250px","rgba(139,92,246,.04)","2s"]].map(([l,t,s,c,d], i) => (
        <div key={i} style={{ position:"absolute", left:l, top:t, width:s, height:s, borderRadius:"50%", background:"radial-gradient(circle," + c + ",transparent 70%)", animation:"orb " + (12+i*3) + "s ease-in-out " + d + " infinite", pointerEvents:"none" }} />
      ))}

      {/* Logo with parallax + float */}
      <div style={{
        display:"inline-block", marginBottom:26,
        transform:"perspective(700px) rotateX(" + (-mouse.y*.35) + "deg) rotateY(" + (mouse.x*.5) + "deg) translateZ(14px)",
        transition:"transform .1s ease-out",
        filter:"drop-shadow(0 0 " + (14 + Math.abs(mouse.x) * .6) + "px rgba(201,162,39,.55))",
        animation:"float 5.5s ease-in-out infinite",
      }}>
        <img src={LOGO_SRC} alt={cfg.siteName} loading="eager" decoding="async"
          style={{ height:94, display:"block" }} />
      </div>

      {/* Site name */}
      <h1 style={{
        fontSize:"clamp(1.3rem,3.5vw,2.2rem)", fontWeight:900, lineHeight:1.25,
        background:"linear-gradient(135deg,var(--gold) 0%,var(--gold2) 35%,#fff 55%,var(--gold) 100%)",
        backgroundSize:"250%",
        WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
        marginBottom:12,
        transform:"perspective(500px) rotateY(" + (mouse.x*.1) + "deg) translateX(" + (mouse.x*.04) + "px)",
        transition:"transform .18s ease-out",
      }}>
        {cfg.siteName}
      </h1>

      <p style={{
        color:"var(--text2)", fontSize:15, letterSpacing:".3px",
        transform:"translateX(" + (mouse.x*.06) + "px)", transition:"transform .22s ease-out",
      }}>
        {cfg.tagline}
      </p>

      {error && (
        <div role="alert" style={{ display:"inline-flex", alignItems:"center", gap:8, marginTop:14, padding:"6px 16px", background:"rgba(248,113,113,.1)", border:"1px solid rgba(248,113,113,.25)", borderRadius:50, color:"#f87171", fontSize:12, fontWeight:600 }}>
          ⚠ {error}
        </div>
      )}
    </header>
  );
});

/* ════════════════════════════════════════════════════════════════════
   STATS BAR
════════════════════════════════════════════════════════════════════ */
const StatsBar = memo(({ visa, trans }) => {
  const all    = [...visa, ...trans];
  const urgent = all.filter(j => j.urgent).length;
  const cities = new Set(all.map(j => j.city).filter(Boolean)).size;
  const stats  = [
    ["💼", visa.length + trans.length, "وظيفة متاحة"],
    ["✈",  visa.length,                "تأشيرة"],
    ["🔄", trans.length,               "نقل كفالة"],
    ["⚡", urgent,                     "وظيفة عاجلة"],
    ["🏙", cities,                     "مدينة"],
  ];
  return (
    <div style={{ display:"flex", justifyContent:"center", gap:10, flexWrap:"wrap", margin:"0 auto 52px", padding:"0 24px", maxWidth:900 }}>
      {stats.map(([icon, val, label]) => (
        <div key={label} className="stat-card"
          style={{ background:"var(--glass)", borderRadius:"var(--r)", padding:"14px 22px", textAlign:"center", minWidth:105 }}>
          <div style={{ fontSize:24, marginBottom:4 }}>{icon}</div>
          <div style={{ fontSize:22, fontWeight:900, color:"var(--gold)", lineHeight:1 }}>{val}</div>
          <div style={{ fontSize:11, color:"var(--text2)", marginTop:4 }}>{label}</div>
        </div>
      ))}
    </div>
  );
});

/* ════════════════════════════════════════════════════════════════════
   JOBS TICKER  (scrolling urgent jobs strip)
════════════════════════════════════════════════════════════════════ */
const JobsTicker = memo(({ jobs }) => {
  const urgent = jobs.filter(j => j.urgent);
  if (!urgent.length) return null;
  const items = [...urgent, ...urgent]; // double for seamless loop
  return (
    <div style={{ overflow:"hidden", background:"linear-gradient(90deg,rgba(201,162,39,.08),rgba(201,162,39,.12),rgba(201,162,39,.08))", borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", padding:"10px 0", marginBottom:40 }}>
      <div className="ticker-track" style={{ whiteSpace:"nowrap" }}>
        {items.map((j, i) => (
          <span key={i} style={{ display:"inline-flex", alignItems:"center", gap:8, marginLeft:48, fontSize:13, fontWeight:700, color:"var(--gold2)" }}>
            ⚡ {j.title} — {j.city}
            {j.salary && <span style={{ color:"var(--text2)", fontWeight:400 }}>({j.salary})</span>}
          </span>
        ))}
      </div>
    </div>
  );
});

/* ════════════════════════════════════════════════════════════════════
   FLOATING WHATSAPP
════════════════════════════════════════════════════════════════════ */
const FloatingWA = memo(({ cfg }) => {
  const [open, setOpen] = useState(false);
  const we = cleanPhone(cfg.waEgypt);
  const ws = cleanPhone(cfg.waSaudi);

  const btnLink = {
    display:"flex", alignItems:"center", gap:12,
    padding:"11px 20px", textDecoration:"none",
    background:"rgba(12,12,18,.92)", backdropFilter:"blur(20px)",
    border:"1px solid rgba(201,162,39,.22)", borderRadius:50,
    color:"var(--text)", fontWeight:700, fontSize:13,
    boxShadow:"var(--shadow2)", whiteSpace:"nowrap",
    transition:"all .25s var(--ease2)",
  };

  const hover = (e, on) => {
    e.currentTarget.style.borderColor = on ? "rgba(37,211,102,.5)" : "rgba(201,162,39,.22)";
    e.currentTarget.style.transform   = on ? "translateY(-3px)" : "";
  };

  return (
    <div style={{ position:"fixed", bottom:28, left:28, zIndex:1000, direction:"rtl" }}>
      {open && (
        <div style={{ marginBottom:14, display:"flex", flexDirection:"column", gap:10, animation:"fadeUp .3s var(--ease2)" }}>
          {we && <a href={`https://wa.me/${we}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن التأشيرات")}`}
            target="_blank" rel="noopener noreferrer" style={btnLink}
            onMouseEnter={e=>hover(e,true)} onMouseLeave={e=>hover(e,false)}>
            <span style={{ fontSize:22 }}>🇪🇬</span>
            <div><div>مصر — التأشيرات</div><div style={{ color:"var(--text2)", fontSize:11, direction:"ltr" }}>{cfg.waEgyptNum}</div></div>
          </a>}
          {ws && <a href={`https://wa.me/${ws}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن نقل الكفالة")}`}
            target="_blank" rel="noopener noreferrer" style={btnLink}
            onMouseEnter={e=>hover(e,true)} onMouseLeave={e=>hover(e,false)}>
            <span style={{ fontSize:22 }}>🇸🇦</span>
            <div><div>السعودية — نقل كفالة</div><div style={{ color:"var(--text2)", fontSize:11, direction:"ltr" }}>{cfg.waSaudiNum}</div></div>
          </a>}
        </div>
      )}
      <button aria-label="تواصل عبر واتساب" onClick={() => setOpen(o => !o)}
        style={{ width:58, height:58, borderRadius:"50%", border:"none", cursor:"pointer",
          background:"linear-gradient(135deg,#25d366,#128c7e)",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize: open ? 18 : 26, color:"#fff",
          boxShadow:"0 4px 30px rgba(37,211,102,.6)",
          transform: open ? "rotate(90deg)" : "none",
          transition:"all .3s var(--ease2)" }}>
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
});

/* ════════════════════════════════════════════════════════════════════
   ADMIN LOGIN MODAL
════════════════════════════════════════════════════════════════════ */
const AdminLogin = ({ onOk, onClose }) => {
  const [pass, setPass] = useState("");
  const [err,  setErr]  = useState(false);
  const submit = () => {
    if (pass === ADMIN_PASS) { onOk(); }
    else { setErr(true); setTimeout(() => setErr(false), 1400); }
  };
  return (
    <div style={{ position:"fixed", inset:0, zIndex:2000, display:"flex", background:"rgba(0,0,0,.88)", backdropFilter:"blur(18px)", animation:"fadeIn .22s" }}>
      <div style={{ margin:"auto", background:"var(--dark2)", border:"1px solid var(--border)", borderRadius:"var(--r2)", padding:44, width:340, textAlign:"center", boxShadow:"var(--shadow)" }}>
        <div style={{ fontSize:40, marginBottom:14 }}>🔐</div>
        <h2 style={{ color:"var(--gold)", marginBottom:8, fontSize:18 }}>لوحة التحكم</h2>
        <p style={{ color:"var(--text2)", fontSize:12, marginBottom:24 }}>أدخل كلمة المرور للمتابعة</p>
        <input type="password" className="field" placeholder="••••••••"
          value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key==="Enter"&&submit()}
          style={{ padding:"12px 16px", marginBottom:12, textAlign:"center", letterSpacing:5, fontSize:20, borderColor:err?"#f87171":undefined }} />
        {err && <p style={{ color:"#f87171", fontSize:12, marginBottom:12 }}>كلمة مرور غير صحيحة</p>}
        <div style={{ display:"flex", gap:10 }}>
          <button className="btn btn-gold" style={{ flex:1, padding:"12px 0", fontSize:14 }} onClick={submit}>دخول</button>
          <button className="btn btn-ghost" style={{ padding:"12px 18px", fontSize:14 }} onClick={onClose}>إلغاء</button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   ADMIN PANEL
════════════════════════════════════════════════════════════════════ */
const AdminPanel = ({ state, setState, onClose }) => {
  const [sec,    setSec]    = useState("jobs");
  const [jobTab, setJobTab] = useState("visa");
  const [editId, setEditId] = useState(null);
  const [form,   setForm]   = useState({});
  const [adEdit, setAdEdit] = useState(null);
  const [adForm, setAdForm] = useState({});
  const [cfgF,   setCfgF]   = useState({ ...state.cfg });
  const [newCity,setNewCity] = useState("");

  const { visaJobs, transJobs, ads, cfg, cities } = state;
  const jobs    = jobTab === "visa" ? visaJobs : transJobs;
  const setJobs = (v) => setState(s => jobTab==="visa" ? {...s,visaJobs:v} : {...s,transJobs:v});

  // Persist on every change
  useEffect(() => { adminStore.save(state); }, [state]);

  const openJob = (job) => { setEditId(job ? job.id : "NEW"); setForm(job ? {...job} : { title:"", city:"", salary:"", exp:"", urgent:false, show:true, date:new Date().toISOString() }); };
  const saveJob = () => {
    if (!form.title?.trim()) return;
    const j = { ...form, id: editId==="NEW" ? `adm-${uid()}` : editId };
    setJobs(editId==="NEW" ? [j, ...jobs] : jobs.map(x => x.id===editId ? j : x));
    setEditId(null);
  };
  const deleteJob = (id) => { if (!confirm("حذف الوظيفة؟")) return; setJobs(jobs.filter(x=>x.id!==id)); };
  const toggleProp = (id, key) => setJobs(jobs.map(x => x.id===id ? {...x,[key]:!x[key]} : x));

  const openAd = (a) => { setAdEdit(a?a.id:"NEW"); setAdForm(a?{...a}:{title:"",img:"",subtitle:"",link:"#",color:"#c9a227"}); };
  const saveAd = () => {
    const a = { ...adForm, id: adEdit==="NEW" ? `adm-${uid()}` : adEdit };
    setState(s => ({ ...s, ads: adEdit==="NEW" ? [a,...s.ads] : s.ads.map(x=>x.id===adEdit?a:x) }));
    setAdEdit(null);
  };
  const deleteAd = (id) => { if (confirm("حذف الإعلان؟")) setState(s=>({...s,ads:s.ads.filter(x=>x.id!==id)})); };

  const addCity    = () => { if (newCity.trim()) { setState(s=>({...s,cities:[...s.cities,newCity.trim()]})); setNewCity(""); } };
  const removeCity = (c) => setState(s=>({...s,cities:s.cities.filter(x=>x!==c)}));
  const saveCfg    = () => { setState(s=>({...s,cfg:{...s.cfg,...cfgF}})); alert("✅ تم الحفظ"); };

  /* ── Shared input component ── */
  const F = ({ label, fkey, type="text", placeholder="" }) => (
    <div>
      <label style={{ fontSize:12, color:"var(--text2)", marginBottom:5, display:"block" }}>{label}</label>
      <input type={type} className="field" placeholder={placeholder}
        value={form[fkey]||""} onChange={e => setForm(f=>({...f,[fkey]:e.target.value}))}
        style={{ padding:"9px 12px" }} />
    </div>
  );
  const AF = ({ label, fkey, placeholder="" }) => (
    <div>
      <label style={{ fontSize:12, color:"var(--text2)", marginBottom:5, display:"block" }}>{label}</label>
      <input className="field" placeholder={placeholder} value={adForm[fkey]||""}
        onChange={e => setAdForm(f=>({...f,[fkey]:e.target.value}))} style={{ padding:"9px 12px" }} />
    </div>
  );

  const navItems = [["jobs","💼 الوظائف"],["ads","🖼 الإعلانات"],["cities","🏙 المدن"],["settings","⚙ الإعدادات"]];

  return (
    <div style={{ position:"fixed", inset:0, zIndex:2100, display:"flex", background:"rgba(0,0,0,.86)", backdropFilter:"blur(14px)", animation:"fadeIn .25s" }}>
      <div style={{ width:"100%", maxWidth:960, margin:"auto", background:"var(--dark2)", borderRadius:"var(--r2)", border:"1px solid var(--border)", display:"flex", flexDirection:"column", maxHeight:"93vh", overflow:"hidden", boxShadow:"var(--shadow)" }}>

        {/* Header */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"18px 24px", borderBottom:"1px solid var(--border)" }}>
          <div style={{ display:"flex", alignItems:"center", gap:10 }}>
            <span style={{ fontSize:20 }}>⚙</span>
            <span style={{ fontWeight:900, fontSize:17, color:"var(--gold)" }}>لوحة التحكم</span>
          </div>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <button className="btn btn-ghost" style={{ padding:"7px 14px", fontSize:12 }}
              onClick={() => { cache.clear(); alert("تم مسح الكاش!"); }}>🗑 مسح الكاش</button>
            <button className="btn btn-danger" style={{ padding:"7px 16px", fontSize:12 }} onClick={onClose}>✕ إغلاق</button>
          </div>
        </div>

        <div style={{ display:"flex", flex:1, overflow:"hidden" }}>
          {/* Sidebar */}
          <div style={{ width:168, flexShrink:0, borderLeft:"1px solid var(--border)", padding:12, display:"flex", flexDirection:"column", gap:4 }}>
            {navItems.map(([id, label]) => (
              <button key={id} className={`admin-nav-item ${sec===id?"admin-nav-on":"admin-nav-off"}`} onClick={()=>setSec(id)}>{label}</button>
            ))}
          </div>

          {/* Content */}
          <div style={{ flex:1, overflow:"auto", padding:"22px 26px" }}>

            {/* ── JOBS ── */}
            {sec === "jobs" && (
              <div>
                <div style={{ display:"flex", gap:8, marginBottom:18, flexWrap:"wrap", alignItems:"center" }}>
                  {["visa","transfer"].map(t => (
                    <button key={t} className={"tab " + (jobTab===t?"tab-on":"tab-off")} style={{ padding:"9px 20px", fontSize:13 }} onClick={()=>setJobTab(t)}>
                      {t==="visa"?"✈ تأشيرات":"🔄 نقل كفالة"}
                    </button>
                  ))}
                  <button className="btn btn-gold" style={{ marginRight:"auto", padding:"9px 20px", fontSize:13 }} onClick={()=>openJob(null)}>+ وظيفة جديدة</button>
                </div>

                {/* Edit form */}
                {editId && (
                  <div style={{ background:"var(--dark3)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:18, marginBottom:16 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                      <F label="المسمى الوظيفي" fkey="title"/>
                      <F label="المدينة" fkey="city"/>
                      <F label="الراتب" fkey="salary"/>
                      <F label="الخبرة المطلوبة" fkey="exp"/>
                    </div>
                    <label style={{ display:"flex", gap:10, alignItems:"center", cursor:"pointer", fontSize:13, marginBottom:14, color:"var(--text)" }}>
                      <input type="checkbox" checked={!!form.urgent} onChange={e=>setForm(f=>({...f,urgent:e.target.checked}))} style={{ accentColor:"var(--gold)", width:16, height:16 }}/>
                      تحديد كعاجل ⚡
                    </label>
                    <div style={{ display:"flex", gap:10 }}>
                      <button className="btn btn-gold" style={{ padding:"9px 24px", fontSize:13 }} onClick={saveJob}>💾 حفظ</button>
                      <button className="btn btn-ghost" style={{ padding:"9px 18px", fontSize:13 }} onClick={()=>setEditId(null)}>إلغاء</button>
                    </div>
                  </div>
                )}

                {/* Job list */}
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {jobs.length === 0 && <p style={{ color:"var(--text2)", textAlign:"center", padding:"2rem" }}>لا توجد وظائف في هذه القائمة</p>}
                  {jobs.map(j => (
                    <div key={j.id} className="admin-row" style={{ display:"flex", gap:10, alignItems:"center" }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:700, fontSize:13, color:j.show!==false?"var(--text)":"var(--text2)", textDecoration:j.show!==false?"none":"line-through" }}>{j.title}</div>
                        <div style={{ fontSize:11, color:"var(--text2)" }}>{j.city} · {j.salary}</div>
                      </div>
                      <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"flex-end" }}>
                        {j.urgent && <span style={{ fontSize:10, padding:"2px 8px", borderRadius:20, border:"1px solid #f97316", color:"#f97316" }}>عاجل</span>}
                        <button className="admin-small-btn" title="تعديل" onClick={()=>openJob(j)}>✏</button>
                        <button className="admin-small-btn" title={j.urgent?"إزالة عاجل":"تعيين عاجل"} onClick={()=>toggleProp(j.id,"urgent")}>{j.urgent?"🔕":"⚡"}</button>
                        <button className="admin-small-btn" title={j.show!==false?"إخفاء":"إظهار"} onClick={()=>toggleProp(j.id,"show")}>{j.show!==false?"👁":"🚫"}</button>
                        <button className="btn btn-danger admin-small-btn" onClick={()=>deleteJob(j.id)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── ADS ── */}
            {sec === "ads" && (
              <div>
                <button className="btn btn-gold" style={{ padding:"9px 20px", fontSize:13, marginBottom:18 }} onClick={()=>openAd(null)}>+ إعلان جديد</button>

                {adEdit && (
                  <div style={{ background:"var(--dark3)", border:"1px solid var(--border)", borderRadius:"var(--r)", padding:18, marginBottom:16 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:10 }}>
                      <AF label="عنوان الإعلان" fkey="title"/>
                      <AF label="نص فرعي" fkey="subtitle"/>
                      <AF label="رابط الصورة (URL)" fkey="img"/>
                      <AF label="رابط الإعلان" fkey="link"/>
                      <div>
                        <label style={{ fontSize:12, color:"var(--text2)", marginBottom:5, display:"block" }}>لون الإعلان (Hex)</label>
                        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                          <input type="color" value={adForm.color||"#c9a227"} onChange={e=>setAdForm(f=>({...f,color:e.target.value}))} style={{ width:46, height:38, borderRadius:8, border:"1px solid var(--border)", background:"none", cursor:"pointer" }}/>
                          <input className="field" value={adForm.color||""} onChange={e=>setAdForm(f=>({...f,color:e.target.value}))} style={{ padding:"9px 12px", flex:1 }}/>
                        </div>
                      </div>
                    </div>
                    <div style={{ display:"flex", gap:10 }}>
                      <button className="btn btn-gold" style={{ padding:"9px 24px", fontSize:13 }} onClick={saveAd}>💾 حفظ</button>
                      <button className="btn btn-ghost" style={{ padding:"9px 18px", fontSize:13 }} onClick={()=>setAdEdit(null)}>إلغاء</button>
                    </div>
                  </div>
                )}

                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {ads.map(a => (
                    <div key={a.id} className="admin-row" style={{ display:"flex", gap:12, alignItems:"center" }}>
                      <div style={{ width:40, height:40, borderRadius:8, background:a.img ? ("url(" + a.img + ") center/cover") : (a.color||"var(--gold)"), flexShrink:0, border:"1px solid var(--border)" }}/>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:13 }}>{a.title||"بدون عنوان"}</div>
                        <div style={{ fontSize:11, color:"var(--text2)" }}>{a.link}</div>
                      </div>
                      <div style={{ display:"flex", gap:6 }}>
                        <button className="admin-small-btn" onClick={()=>openAd(a)}>✏</button>
                        <button className="btn btn-danger admin-small-btn" onClick={()=>deleteAd(a.id)}>🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CITIES ── */}
            {sec === "cities" && (
              <div>
                <div style={{ display:"flex", gap:10, marginBottom:20 }}>
                  <input className="field" placeholder="اسم المدينة الجديدة" value={newCity}
                    onChange={e=>setNewCity(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCity()}
                    style={{ padding:"11px 16px", flex:1 }}/>
                  <button className="btn btn-gold" style={{ padding:"11px 22px", fontSize:14 }} onClick={addCity}>+ إضافة</button>
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
                  {cities.map(c => (
                    <div key={c} style={{ display:"flex", alignItems:"center", gap:8, background:"var(--dark3)", border:"1px solid var(--border)", borderRadius:50, padding:"7px 16px", fontSize:13, fontWeight:600 }}>
                      {c}
                      <span style={{ cursor:"pointer", color:"#f87171", fontSize:15, lineHeight:1 }} onClick={()=>removeCity(c)}>×</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {sec === "settings" && (
              <div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
                  {[
                    ["googleForm",   "رابط Google Form للتقديم"],
                    ["applyBtnText", "نص زر التقديم"],
                    ["siteName",     "اسم الموقع"],
                    ["tagline",      "الشعار الفرعي"],
                    ["waEgypt",      "رقم واتساب مصر (أرقام فقط)"],
                    ["waEgyptNum",   "رقم مصر للعرض"],
                    ["waSaudi",      "رقم واتساب السعودية (أرقام فقط)"],
                    ["waSaudiNum",   "رقم السعودية للعرض"],
                  ].map(([k, lbl]) => (
                    <div key={k}>
                      <label style={{ fontSize:12, color:"var(--text2)", marginBottom:5, display:"block" }}>{lbl}</label>
                      <input className="field" value={cfgF[k]||""} onChange={e=>setCfgF(f=>({...f,[k]:e.target.value}))} style={{ padding:"9px 12px" }}/>
                    </div>
                  ))}
                </div>
                <button className="btn btn-gold" style={{ padding:"12px 32px", fontSize:14 }} onClick={saveCfg}>💾 حفظ الإعدادات</button>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════════════════════════ */
export default function App() {

  /* ── Shared state ──────────────────────────────────────── */
  const [S, setS] = useState({
    visaJobs:  SEED_VISA,
    transJobs: SEED_TRANS,
    ads:       SEED_ADS,
    cfg:       DEF_CFG,
    cities:    ["الرياض","جدة","مكة","المدينة","الدمام","أبها","تبوك"],
  });

  /* ── UI state ──────────────────────────────────────────── */
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [tab,         setTab]         = useState("visa");
  const [titleF,      setTitleF]      = useState("");
  const [cityF,       setCityF]       = useState("");
  const [count,       setCount]       = useState(9);
  const [vis,         setVis]         = useState(false);
  const [adminLogin,  setAdminLogin]  = useState(false);
  const [adminOpen,   setAdminOpen]   = useState(false);
  const [scrollY,     setScrollY]     = useState(0);

  /* ── Scroll parallax ───────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive:true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Fade in ───────────────────────────────────────────── */
  useEffect(() => { requestAnimationFrame(() => setTimeout(() => setVis(true), 60)); }, []);

  /* ── Load saved admin data ─────────────────────────────── */
  useEffect(() => {
    const saved = adminStore.load();
    if (saved) setS(saved);
  }, []);

  /* ── Fetch from Google Sheets ──────────────────────────── */
  useEffect(() => {
    const applySheets = ({ stT, vjT, tjT, adT }) => {
      const newCfg  = stT ? parseSettings(stT) : DEF_CFG;
      const vj      = vjT ? parseJobs(vjT)     : [];
      const tj      = tjT ? parseJobs(tjT)     : [];
      const newAds  = adT ? parseAds(adT)      : [];
      const citiesRaw = [...new Set([...vj,...tj].map(j=>j.city).filter(Boolean))];

      setS(prev => ({
        ...prev,
        cfg:       newCfg,
        visaJobs:  vj.length  ? vj      : prev.visaJobs,
        transJobs: tj.length  ? tj      : prev.transJobs,
        ads:       newAds.length ? newAds : prev.ads,
        cities:    citiesRaw.length ? citiesRaw : prev.cities,
      }));
    };

    async function load() {
      const hit = cache.load();
      if (hit) { applySheets(hit); setLoading(false); return; }
      try {
        const [stT, vjT, tjT, adT] = await Promise.allSettled([
          fetchSheet("settings"),
          fetchSheet("visa"),
          fetchSheet("transfer"),
          fetchSheet("ads"),
        ]);
        const raw = {
          stT: stT.status==="fulfilled" ? stT.value : null,
          vjT: vjT.status==="fulfilled" ? vjT.value : null,
          tjT: tjT.status==="fulfilled" ? tjT.value : null,
          adT: adT.status==="fulfilled" ? adT.value : null,
        };
        cache.save(raw);
        applySheets(raw);
      } catch (e) {
        console.warn("Sheets error:", e);
        setError("تعذّر الاتصال بالبيانات — يتم عرض البيانات الافتراضية");
      } finally {
        setLoading(false);
      }
    }
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── Filtered jobs  (#3 safe toLowerCase) ──────────────── */
  const allJobs = tab === "visa" ? S.visaJobs : S.transJobs;
  const filtered = useMemo(() => {
    const q = titleF.trim().toLowerCase();
    return allJobs
      .filter(j => j.show !== false)
      .filter(j =>
        (j.title ?? "").toLowerCase().includes(q) &&   // #3
        (cityF === "" || (j.city ?? "") === cityF)      // #10
      );
  }, [allJobs, titleF, cityF]);

  const visible = filtered.slice(0, count);

  /* ── Admin shortcut: triple-click footer ───────────────── */
  const clickCount = useRef(0);
  const onFooterClick = () => {
    clickCount.current++;
    if (clickCount.current >= 3) { clickCount.current = 0; setAdminLogin(true); }
    setTimeout(() => { clickCount.current = 0; }, 900);
  };

  /* ── Parallax offset for bg grid ───────────────────────── */
  const gridOffset = scrollY * 0.15;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* Ambient bg grid with scroll parallax */}
      <div className="bg-grid" style={{ backgroundPosition:"0 " + gridOffset + "px" }} />

      <div style={{ position:"relative", zIndex:1, minHeight:"100vh", opacity:vis?1:0, transition:"opacity .65s ease" }}>

        {/* ── SEO title ── */}
        <title>{S.cfg.siteName}</title>

        {/* ── HEADER ── */}
        <Header cfg={S.cfg} error={error} />

        {/* ── URGENT TICKER ── */}
        <JobsTicker jobs={[...S.visaJobs, ...S.transJobs]} />

        {/* ── AD SLIDER ── */}
        <AdSlider ads={S.ads} />

        {/* ── STATS ── */}
        <StatsBar visa={S.visaJobs} trans={S.transJobs} />

        {/* ── TABS ── */}
        <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:32, padding:"0 24px" }}>
          {[["visa","✈ تأشيرات"],["transfer","🔄 نقل كفالة"]].map(([id, label]) => (
            <button key={id} className={`tab ${tab===id?"tab-on":"tab-off"}`}
              onClick={() => { setTab(id); setCount(9); setTitleF(""); setCityF(""); }}>
              {label}
            </button>
          ))}
        </div>

        {/* ── FILTERS ── */}
        <div style={{ maxWidth:840, margin:"0 auto 40px", padding:"0 24px", display:"flex", gap:10, flexWrap:"wrap" }}>
          <input type="text" className="field" placeholder="🔍 ابحث عن وظيفة أو تخصص..."
            value={titleF}
            onChange={e => { setTitleF(e.target.value); setCount(9); }}
            style={{ flex:2, minWidth:180, padding:"14px 18px", fontSize:14 }} />
          <select className="field" value={cityF}
            onChange={e => { setCityF(e.target.value); setCount(9); }}
            style={{ flex:1, minWidth:140, padding:"14px 16px", fontSize:14 }}>
            <option value="">🏙 كل المدن</option>
            {S.cities.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* ── JOB GRID ── */}
        <div style={{ maxWidth:1240, margin:"0 auto", padding:"0 24px" }}>
          {loading ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:24 }}>
              {Array(6).fill(null).map((_, i) => <ShimmerCard key={i} />)}
            </div>
          ) : visible.length > 0 ? (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))", gap:24 }}>
              {visible.map((j, i) => (
                <JobCard key={j.id} job={j} googleForm={S.cfg.googleForm} applyBtnText={S.cfg.applyBtnText} idx={i} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"5rem 2rem", color:"var(--text2)" }}>
              <div style={{ fontSize:52, marginBottom:14 }}>🔍</div>
              <p style={{ fontSize:16 }}>لا توجد وظائف مطابقة لبحثك</p>
              <p style={{ fontSize:13, marginTop:8, opacity:.6 }}>جرب تغيير الكلمة أو اختيار مدينة مختلفة</p>
            </div>
          )}

          {/* Load more */}
          {!loading && visible.length < filtered.length && (
            <div style={{ textAlign:"center", marginTop:44, marginBottom:16 }}>
              <button className="btn btn-ghost" style={{ padding:"14px 48px", fontSize:14 }}
                onClick={() => setCount(c => c + 9)}>
                تحميل المزيد · {filtered.length - visible.length} وظيفة متبقية
              </button>
            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        <footer onClick={onFooterClick}
          style={{ textAlign:"center", marginTop:90, padding:"28px 24px", borderTop:"1px solid rgba(255,255,255,.04)", color:"var(--text2)", fontSize:12, cursor:"default", userSelect:"none" }}>
          <div style={{ fontSize:24, marginBottom:8, opacity:.5 }}>⚕</div>
          <p>© 2026 Al-Majd Medical Group — جميع الحقوق محفوظة</p>
          <p style={{ marginTop:6, opacity:.3, fontSize:10 }}>اضغط على الأيقونة أعلاه ثلاث مرات لفتح لوحة التحكم</p>
        </footer>

        {/* ── Admin gear btn (top-left corner) ── */}
        <button onClick={() => setAdminLogin(true)} aria-label="لوحة التحكم"
          style={{ position:"fixed", top:16, left:16, zIndex:900, background:"rgba(255,255,255,.04)", border:"1px solid rgba(255,255,255,.06)", borderRadius:10, padding:"7px 11px", color:"rgba(255,255,255,.18)", cursor:"pointer", fontSize:14, transition:"all .2s" }}
          onMouseEnter={e => { e.currentTarget.style.color="var(--gold)"; e.currentTarget.style.borderColor="var(--border)"; }}
          onMouseLeave={e => { e.currentTarget.style.color="rgba(255,255,255,.18)"; e.currentTarget.style.borderColor="rgba(255,255,255,.06)"; }}>
          ⚙
        </button>

        {/* ── FLOATING WA ── */}
        <FloatingWA cfg={S.cfg} />
      </div>

      {/* ── MODALS ── */}
      {adminLogin && !adminOpen && (
        <AdminLogin onOk={() => { setAdminLogin(false); setAdminOpen(true); }} onClose={() => setAdminLogin(false)} />
      )}
      {adminOpen && (
        <AdminPanel state={S} setState={setS} onClose={() => setAdminOpen(false)} />
      )}
    </>
  );
}
