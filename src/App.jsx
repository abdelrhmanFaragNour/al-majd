// v4.0 — Full stable version with Clinics section
import React from "react";
import { useState, useEffect, useMemo, useRef, useCallback, memo } from "react";

/* ════════════════════════════════════════════════════════════════════
   CONSTANTS & SEEDS
════════════════════════════════════════════════════════════════════ */
const LOGO_SRC = "https://iili.io/q1AdYlt.png";

const SHEET_ID   = "1nwJh2Cz-KP--SvvQmeipHate8GMfdreM";
const CACHE_KEY  = "majd_v4";
const ADMIN_KEY  = "majd_admin_v4";
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
  logoSrc:      LOGO_SRC,
  facebook:     "",
  instagram:    "",
  tiktok:       "",
  youtube:      "",
  twitter:      "",
  linkedin:     "",
  snapchat:    "",
  iconVisa:     "✈",
  iconTransfer: "🔄",
  iconUrgent:   "⚡",
  iconApply:    "✦",
  iconLocation: "📍",
  iconSalary:   "💰",
  iconExp:      "⏱",
  iconDate:     "📅",
  heroTitle:    "ابدأ مسيرتك الطبية في أرقى المستشفيات السعودية",
  heroDesc:     "نربطك بأفضل الفرص الطبية عبر المملكة — تأشيرات ونقل كفالة باجراءات احترافية وسريعة",
  stat1Num:     "+500",  stat1Text: "وظيفة متاحة",
  stat2Num:     "+8",    stat2Text: "مدن سعودية",
  stat3Num:     "+1000", stat3Text: "موظف تم توظيفه",
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
   GOOGLE SHEETS URLS
════════════════════════════════════════════════════════════════════ */
const CSV_URLS = {
  settings: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ6cGQr0Zu2Il5Df-ULm2h4jEfPi1bklr6uUF5g28nktjZK_yfk8tDCI92wC0oFKwitJXmEwn3UFs1/pub?gid=1276002029&single=true&output=csv",
  visa:     "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ6cGQr0Zu2Il5Df-ULm2h4jEfPi1bklr6uUF5g28nktjZK_yfk8tDCI92wC0oFKwitJXmEwn3UFs1/pub?gid=513051489&single=true&output=csv",
  transfer: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ6cGQr0Zu2Il5Df-ULm2h4jEfPi1bklr6uUF5g28nktjZK_yfk8tDCI92wC0oFKwitJXmEwn3UFs1/pub?gid=532437154&single=true&output=csv",
  ads:      "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ6cGQr0Zu2Il5Df-ULm2h4jEfPi1bklr6uUF5g28nktjZK_yfk8tDCI92wC0oFKwitJXmEwn3UFs1/pub?gid=13072504&single=true&output=csv",
  social:   "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ6cGQr0Zu2Il5Df-ULm2h4jEfPi1bklr6uUF5g28nktjZK_yfk8tDCI92wC0oFKwitJXmEwn3UFs1/pub?gid=906944007&single=true&output=csv",
};

/* ════════════════════════════════════════════════════════════════════
   GLOBAL CSS (كامل)
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

.fadeUp{animation:fadeUp .55s var(--ease2) both}
.fadeIn{animation:fadeIn .4s ease both}

.card3d{
  transition:transform .3s var(--ease2),box-shadow .3s ease,border-color .3s ease;
  transform-style:preserve-3d;
  will-change:transform;
}
.card3d:hover{
  box-shadow:0 24px 64px rgba(0,0,0,.6),0 0 0 1px var(--border2),inset 0 1px 0 rgba(255,255,255,.08);
}

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

.field{
  background:var(--dark3);border:1.5px solid rgba(255,255,255,.08);
  color:var(--text);font-family:'Cairo',sans-serif;
  border-radius:var(--r);outline:none;
  transition:border-color .25s,box-shadow .25s;
  width:100%;
}
.field:focus{border-color:var(--gold);box-shadow:0 0 0 3px rgba(201,162,39,.14)}
.field::placeholder{color:var(--text2)}

.tab{font-family:'Cairo',sans-serif;font-weight:700;cursor:pointer;border:none;outline:none;
  transition:all .28s var(--ease2);border-radius:50px;padding:13px 38px;font-size:14px}
.tab-on{
  background:linear-gradient(135deg,var(--gold),var(--gold2));
  color:#080604;box-shadow:0 4px 20px rgba(201,162,39,.4),0 0 0 0 rgba(201,162,39,0);
  transform:scale(1.03);
}
.tab-off{background:var(--dark3);color:var(--text2)}
.tab-off:hover{background:var(--dark4);color:var(--text);transform:translateY(-1px)}

.shimmer{
  background:linear-gradient(90deg,var(--dark3) 25%,var(--dark4) 50%,var(--dark3) 75%);
  background-size:400% 100%;animation:shimmer 1.8s ease-in-out infinite;
}

.badge-urgent{
  font-size:10px;font-weight:900;padding:3px 10px;border-radius:20px;
  background:linear-gradient(135deg,#dc2626,#f97316);color:#fff;
  animation:glow 2.4s ease-in-out infinite;letter-spacing:.3px;
}

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

.ticker-track{display:flex;animation:ticker 28s linear infinite}
.ticker-track:hover{animation-play-state:paused}

.bg-grid{
  position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:
    linear-gradient(rgba(201,162,39,.025) 1px,transparent 1px),
    linear-gradient(90deg,rgba(201,162,39,.025) 1px,transparent 1px);
  background-size:56px 56px;
}

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
const cleanPhone = (v) => String(v ?? "").replace(/\D/g, "");
const dateFmt = (d) => {
  if (!d) return "";
  const t = new Date(d);
  if (isNaN(t.getTime())) return "";
  const diff = Math.floor((Date.now() - t.getTime()) / 86400000);
  if (diff <= 0) return "اليوم";
  if (diff === 1) return "أمس";
  if (diff < 30) return "منذ " + diff + " يوم";
  return t.toLocaleDateString("ar-SA", { year:"numeric", month:"short" });
};
const parseUrgent = (v) => {
  if (v == null) return false;
  return ["true","نعم","yes","1"].includes(String(v).trim().toLowerCase());
};
const parseShow = (v) => {
  if (v == null || v === "") return true;
  return !["لا","no","false","0"].includes(String(v).trim().toLowerCase());
};
const hexRgb = (h) => {
  const n = parseInt((h||"#c9a227").replace("#",""), 16);
  return ((n>>16)&255) + "," + ((n>>8)&255) + "," + (n&255);
};
const hexLighten = (h, amt=40) => {
  try {
    return "#" + [1,3,5].map(i => Math.min(255, parseInt(h.slice(i,i+2),16)+amt)
      .toString(16).padStart(2,"0")).join("");
  } catch { return "#e8c44a"; }
};

/* ════════════════════════════════════════════════════════════════════
   CACHE & ADMIN STORE
════════════════════════════════════════════════════════════════════ */
const cache = {
  save: (d) => { 
    try { 
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts:Date.now(), d })); 
    } catch (e) {
      console.warn("⚠️ فشل حفظ الكاش:", e);
    } 
  },
  load: () => { 
    try { 
      const r = JSON.parse(localStorage.getItem(CACHE_KEY)||"null"); 
      return r && Date.now() - r.ts < CACHE_TTL ? r.d : null; 
    } catch { 
      return null; 
    } 
  },
  clear: () => { 
    try { 
      localStorage.removeItem(CACHE_KEY); 
      console.log("🗑 تم مسح الكاش");
    } catch {} 
  },
};
const adminStore = {
  save: (d) => { 
    try { 
      localStorage.setItem(ADMIN_KEY, JSON.stringify(d)); 
      console.log("💾 تم حفظ التغييرات في adminStore");
    } catch {} 
  },
  load: () => { 
    try { 
      return JSON.parse(localStorage.getItem(ADMIN_KEY)||"null"); 
    } catch { 
      return null; 
    } 
  },
  clear: () => {
    try {
      localStorage.removeItem(ADMIN_KEY);
      console.log("🗑 تم مسح adminStore");
    } catch {}
  }
};

/* ════════════════════════════════════════════════════════════════════
   GOOGLE SHEETS
════════════════════════════════════════════════════════════════════ */

function parseCSV(text) {
  if (!text || typeof text !== 'string') {
    console.warn("⚠️ نص CSV غير صالح:", text);
    return [];
  }
  
  const rows = [];
  const lines = text.trim().split("\n");
  if (lines.length === 0) return [];
  
  lines.forEach((line, idx) => {
    if (!line.trim()) return;
    
    const cols = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { 
        inQ = !inQ; 
      }
      else if (ch === "," && !inQ) { 
        cols.push(cur); 
        cur = ""; 
      }
      else { 
        cur += ch; 
      }
    }
    cols.push(cur);
    
    rows.push(cols);
  });
  
  console.log(`✅ تم تحليل ${rows.length} صف من CSV`);
  if (rows.length > 0) {
    console.log("📋 أول صف (العناوين):", rows[0]);
    if (rows.length > 1) {
      console.log("📋 ثاني صف (أول بيانات):", rows[1]);
    }
  }
  return rows;
}

async function fetchSheet(name) {
  const url = CSV_URLS[name];
  if (!url) return [];
  
  console.log(`🌐 جلب ${name} من:`, url);
  
  try {
    const res = await fetch(url + "&t=" + Date.now(), { 
      cache: "no-store",
      mode: 'cors',
      headers: {
        'Accept': 'text/csv'
      }
    });
    
    if (!res.ok) {
      console.warn(`⚠️ ${name} - HTTP ${res.status}`);
      return [];
    }
    
    const text = await res.text();
    if (!text || text.trim().length === 0) {
      console.warn(`⚠️ ${name} - استجابة فارغة`);
      return [];
    }
    
    console.log(`✅ ${name} - تم استلام ${text.length} حرف`);
    return parseCSV(text);
  } catch (e) {
    console.error(`❌ فشل جلب ${name}:`, e);
    return [];
  }
}

const parseSettings = (rows) => {
  const cfg = { ...DEF_CFG };
  if (!Array.isArray(rows) || rows.length < 2) {
    console.warn("⚠️ لا توجد بيانات إعدادات كافية");
    return cfg;
  }
  
  rows.slice(1).forEach((r, idx) => {
    if (!Array.isArray(r) || r.length < 1) return;
    
    const key = r[0] ? r[0].trim() : '';
    const value = r[1] ? r[1].trim() : '';
    
    if (key && value) {
      if (key === 'logoSrc') cfg.logoSrc = value;
      else if (key === 'siteName') cfg.siteName = value;
      else if (key === 'waEgypt') cfg.waEgypt = value;
      else if (key === 'waSaudi') cfg.waSaudi = value;
      else if (key === 'waEgyptNum') cfg.waEgyptNum = value;
      else if (key === 'waSaudiNum') cfg.waSaudiNum = value;
      else if (key === 'googleForm') cfg.googleForm = value;
      else if (key === 'applyBtnText') cfg.applyBtnText = value;
      else if (key === 'heroTitle') cfg.heroTitle = value;
      else if (key === 'heroDesc') cfg.heroDesc = value;
      else if (key === 'stat1Num') cfg.stat1Num = value;
      else if (key === 'stat1Text') cfg.stat1Text = value;
      else if (key === 'stat2Num') cfg.stat2Num = value;
      else if (key === 'stat2Text') cfg.stat2Text = value;
      else if (key === 'stat3Num') cfg.stat3Num = value;
      else if (key === 'stat3Text') cfg.stat3Text = value;
    }
  });
  
  return cfg;
};

const parseClinics = (rows) => {
  if (!Array.isArray(rows) || rows.length < 2) return [];
  
  const clinics = [];
  const exclude = ['logoSrc', 'siteName', 'tagline', 'waEgypt', 'waSaudi', 'waEgyptNum', 'waSaudiNum', 'googleForm', 'applyBtnText', 'heroTitle', 'heroDesc', 'stat1Num', 'stat1Text', 'stat2Num', 'stat2Text', 'stat3Num', 'stat3Text'];
  
  rows.slice(1).forEach((r, idx) => {
    if (!Array.isArray(r) || r.length < 2) return;
    
    const key = r[0] ? r[0].trim() : '';
    const value = r[1] ? r[1].trim() : '';
    
    if (key && value && !exclude.includes(key) && key !== 'logoSrc') {
      clinics.push({
        id: `clinic-${idx}-${uid()}`,
        name: key,
        image: value,
      });
    }
  });
  
  return clinics;
};

const parseJobs = (rows) => {
  if (!Array.isArray(rows) || rows.length < 2) return [];
  
  const jobs = rows.slice(1).map((r, i) => {
    if (!Array.isArray(r)) return null;
    
    return {
      id: "job" + i + "-" + uid(),
      title: r[0] || "",
      city: r[1] || "",
      salary: r[2] || "",
      exp: r[3] || "",
      urgent: parseUrgent(r[4]),
      date: r[5] || null,
      show: parseShow(r[6]),
    };
  }).filter(j => j && j.title && j.show);
  
  return jobs;
};

const parseAds = (rows) => {
  if (!Array.isArray(rows) || rows.length < 2) return [];
  
  const ads = rows.slice(1).map((r, i) => {
    if (!Array.isArray(r)) return null;
    
    return {
      id: "ad" + i + "-" + uid(),
      img: r[0] || "",
      title: r[1] || "",
      subtitle: r[2] || "",
      link: r[3] || "#",
      color: r[4] || "#c9a227",
      imgPosition: r[5] || "center",
    };
  }).filter(a => a && (a.title || a.img));
  
  return ads;
};

const parseSocial = (rows) => {
  if (!Array.isArray(rows) || rows.length < 2) return [];
  
  const social = rows.slice(1).map(r => {
    if (!Array.isArray(r) || r.length < 2) return null;
    
    return {
      platform: String(r[0] || "").trim().toLowerCase(),
      url: String(r[1] || "").trim(),
      icon: String(r[2] || "").trim(),
      iconHover: String(r[3] || "").trim(),
    };
  }).filter(s => s && s.platform && s.url);
  
  return social;
};

/* ════════════════════════════════════════════════════════════════════
   MICRO COMPONENTS
════════════════════════════════════════════════════════════