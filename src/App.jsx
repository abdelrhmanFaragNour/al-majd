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
   GLOBAL CSS (مختصر)
════════════════════════════════════════════════════════════════════ */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--gold:#c9a227;--gold2:#e8c44a;--dark:#06060a;--dark2:#0c0c12;--dark3:#13131c;--dark4:#1c1c28;--glass:rgba(255,255,255,.032);--border:rgba(201,162,39,.16);--border2:rgba(201,162,39,.32);--text:#dde2ee;--text2:#9aa3b8;--r:14px;--r2:22px;--shadow:0 24px 80px rgba(0,0,0,.7);--ease2:cubic-bezier(.25,.8,.25,1)}
body{background:var(--dark);color:var(--text);font-family:'Cairo',sans-serif;direction:rtl;overflow-x:hidden}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;font-weight:800;cursor:pointer;border:none;transition:all .28s var(--ease2)}
.btn-gold{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#0a0805;border-radius:50px}
.btn-gold:hover{box-shadow:0 6px 28px rgba(201,162,39,.5);transform:translateY(-2px)}
.btn-ghost{background:var(--glass);border:1.5px solid var(--border);color:var(--text);border-radius:50px}
.btn-danger{background:rgba(239,68,68,.12);border:1px solid rgba(239,68,68,.3);color:#f87171}
.field{background:var(--dark3);border:1.5px solid rgba(255,255,255,.08);color:var(--text);border-radius:var(--r);padding:12px;width:100%}
.field:focus{border-color:var(--gold)}
.tab{font-weight:700;cursor:pointer;border-radius:50px;padding:13px 38px;transition:all .28s}
.tab-on{background:linear-gradient(135deg,var(--gold),var(--gold2));color:#080604}
.tab-off{background:var(--dark3);color:var(--text2)}
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

/* ════════════════════════════════════════════════════════════════════
   CACHE & ADMIN STORE
════════════════════════════════════════════════════════════════════ */
const cache = {
  save: (d) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify({ ts:Date.now(), d })); } catch {} },
  load: () => { try { const r = JSON.parse(localStorage.getItem(CACHE_KEY)||"null"); return r && Date.now()-r.ts<CACHE_TTL ? r.d : null; } catch { return null; } },
  clear: () => { try { localStorage.removeItem(CACHE_KEY); } catch {} },
};
const adminStore = {
  save: (d) => { try { localStorage.setItem(ADMIN_KEY, JSON.stringify(d)); } catch {} },
  load: () => { try { return JSON.parse(localStorage.getItem(ADMIN_KEY)||"null"); } catch { return null; } },
  clear: () => { try { localStorage.removeItem(ADMIN_KEY); } catch {} },
};

/* ════════════════════════════════════════════════════════════════════
   GOOGLE SHEETS PARSERS
════════════════════════════════════════════════════════════════════ */
function parseCSV(text) {
  if (!text) return [];
  const rows = [];
  text.trim().split("\n").forEach(line => {
    if (!line.trim()) return;
    const cols = [];
    let cur = "", inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') inQ = !inQ;
      else if (ch === "," && !inQ) { cols.push(cur); cur = ""; }
      else cur += ch;
    }
    cols.push(cur);
    rows.push(cols);
  });
  return rows;
}

async function fetchSheet(name) {
  const url = CSV_URLS[name];
  if (!url) return [];
  try {
    const res = await fetch(url + "&t=" + Date.now(), { cache: "no-store" });
    if (!res.ok) return [];
    const text = await res.text();
    return parseCSV(text);
  } catch {
    return [];
  }
}

const parseSettings = (rows) => {
  const cfg = { ...DEF_CFG };
  if (!rows?.length) return cfg;
  
  // قراءة الإعدادات
  rows.slice(1).forEach(r => {
    if (!r?.[0]) return;
    const key = r[0].trim();
    const val = r[1]?.trim() || '';
    if (key === 'logoSrc' && val) cfg.logoSrc = val;
    else if (key === 'siteName' && val) cfg.siteName = val;
    else if (key === 'waEgypt' && val) cfg.waEgypt = val;
    else if (key === 'waSaudi' && val) cfg.waSaudi = val;
    else if (key === 'waEgyptNum' && val) cfg.waEgyptNum = val;
    else if (key === 'waSaudiNum' && val) cfg.waSaudiNum = val;
    else if (key === 'googleForm' && val) cfg.googleForm = val;
    else if (key === 'applyBtnText' && val) cfg.applyBtnText = val;
    else if (key === 'heroTitle' && val) cfg.heroTitle = val;
    else if (key === 'heroDesc' && val) cfg.heroDesc = val;
    else if (key === 'stat1Num' && val) cfg.stat1Num = val;
    else if (key === 'stat1Text' && val) cfg.stat1Text = val;
    else if (key === 'stat2Num' && val) cfg.stat2Num = val;
    else if (key === 'stat2Text' && val) cfg.stat2Text = val;
    else if (key === 'stat3Num' && val) cfg.stat3Num = val;
    else if (key === 'stat3Text' && val) cfg.stat3Text = val;
  });
  
  return cfg;
};

const parseClinics = (rows) => {
  if (!rows?.length) return [];
  const clinics = [];
  const exclude = ['logoSrc', 'siteName', 'tagline', 'waEgypt', 'waSaudi', 'waEgyptNum', 'waSaudiNum', 'googleForm', 'applyBtnText', 'heroTitle', 'heroDesc', 'stat1Num', 'stat1Text', 'stat2Num', 'stat2Text', 'stat3Num', 'stat3Text'];
  
  rows.slice(1).forEach((r, idx) => {
    if (!r?.[0]) return;
    const key = r[0].trim();
    const val = r[1]?.trim() || '';
    if (key && val && !exclude.includes(key) && key !== 'logoSrc') {
      clinics.push({
        id: `clinic-${idx}-${uid()}`,
        name: key,
        image: val,
      });
    }
  });
  
  return clinics;
};

const parseJobs = (rows) => {
  if (!rows?.length) return [];
  return rows.slice(1).map((r, i) => ({
    id: "job" + i + "-" + uid(),
    title: r[0] || "",
    city: r[1] || "",
    salary: r[2] || "",
    exp: r[3] || "",
    urgent: parseUrgent(r[4]),
    date: r[5] || null,
    show: parseShow(r[6]),
  })).filter(j => j.title && j.show);
};

const parseAds = (rows) => {
  if (!rows?.length) return [];
  return rows.slice(1).map((r, i) => ({
    id: "ad" + i + "-" + uid(),
    img: r[0] || "",
    title: r[1] || "",
    subtitle: r[2] || "",
    link: r[3] || "#",
    color: r[4] || "#c9a227",
  })).filter(a => a.title || a.img);
};

const parseSocial = (rows) => {
  if (!rows?.length) return [];
  return rows.slice(1).map(r => ({
    platform: r[0] || "",
    url: r[1] || "",
    icon: r[2] || "",
  })).filter(s => s.platform && s.url);
};

/* ════════════════════════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [S, setS] = useState({
    visaJobs: SEED_VISA,
    transJobs: SEED_TRANS,
    ads: SEED_ADS,
    cfg: DEF_CFG,
    clinics: [],
    cities: ["الرياض","جدة","مكة","المدينة","الدمام"],
    social: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState("visa");
  const [titleF, setTitleF] = useState("");
  const [cityF, setCityF] = useState("");
  const [count, setCount] = useState(9);
  const [vis, setVis] = useState(false);
  const [adminLogin, setAdminLogin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  useEffect(() => { requestAnimationFrame(() => setVis(true)); }, []);

  // Load from adminStore first
  useEffect(() => {
    const saved = adminStore.load();
    if (saved) setS(saved);
  }, []);

  // Fetch from sheets
  const fetchAllSheets = async () => {
    try {
      const [settings, visa, transfer, ads, social] = await Promise.all([
        fetchSheet("settings"),
        fetchSheet("visa"),
        fetchSheet("transfer"),
        fetchSheet("ads"),
        fetchSheet("social"),
      ]);

      const newCfg = parseSettings(settings);
      const newClinics = parseClinics(settings);
      const newVisa = parseJobs(visa);
      const newTrans = parseJobs(transfer);
      const newAds = parseAds(ads);
      const newSocial = parseSocial(social);

      // Merge with existing data (keep manual changes)
      setS(prev => ({
        ...prev,
        cfg: { ...prev.cfg, ...newCfg },
        clinics: newClinics.length ? newClinics : prev.clinics,
        visaJobs: newVisa.length ? newVisa : prev.visaJobs,
        transJobs: newTrans.length ? newTrans : prev.transJobs,
        ads: newAds.length ? newAds : prev.ads,
        social: newSocial.length ? newSocial : prev.social,
      }));

      // Save to cache
      cache.save({ settings, visa, transfer, ads, social });
    } catch (err) {
      console.error("Fetch error:", err);
      setError("خطأ في تحميل البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      const cached = cache.load();
      if (cached) {
        // Use cache first
        setS(prev => ({
          ...prev,
          cfg: parseSettings(cached.settings),
          clinics: parseClinics(cached.settings),
          visaJobs: parseJobs(cached.visa),
          transJobs: parseJobs(cached.transfer),
          ads: parseAds(cached.ads),
          social: parseSocial(cached.social),
        }));
        setLoading(false);
      }
      // Always fetch fresh data in background
      fetchAllSheets();
    };
    loadData();
  }, []);

  const allJobs = tab === "visa" ? S.visaJobs : S.transJobs;
  const filtered = useMemo(() => {
    const q = titleF.toLowerCase();
    return allJobs.filter(j => 
      j.show && 
      j.title.toLowerCase().includes(q) &&
      (!cityF || j.city === cityF)
    );
  }, [allJobs, titleF, cityF]);

  const visible = filtered.slice(0, count);

  const handleManualRefresh = () => {
    cache.clear();
    adminStore.clear();
    window.location.reload();
  };

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      
      <div style={{ opacity: vis ? 1 : 0, transition: "opacity .65s" }}>
        {/* Header */}
        <header style={{ textAlign: "center", padding: "60px 24px 40px" }}>
          <img 
            src={S.cfg.logoSrc} 
            alt={S.cfg.siteName}
            style={{ height: 94, marginBottom: 20 }}
            onError={(e) => e.target.src = LOGO_SRC}
          />
          <h1 style={{ fontSize: "clamp(1.3rem,3.5vw,2.2rem)", color: "var(--gold)" }}>
            {S.cfg.heroTitle || S.cfg.siteName}
          </h1>
          <p style={{ color: "var(--text2)" }}>{S.cfg.heroDesc || S.cfg.tagline}</p>
        </header>

        {/* Clinics Section - NEW */}
        {S.clinics.length > 0 && (
          <section style={{ maxWidth: 1200, margin: "0 auto 60px", padding: "0 24px" }}>
            <h2 style={{ textAlign: "center", color: "var(--gold)", marginBottom: 30, fontSize: 28 }}>
              عياداتنا
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: 24 
            }}>
              {S.clinics.map(clinic => (
                <div key={clinic.id} style={{
                  background: "var(--glass)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--r2)",
                  overflow: "hidden",
                  transition: "transform .3s, box-shadow .3s",
                  cursor: "pointer",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-5px) scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,.5)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                  {clinic.image && (
                    <img 
                      src={clinic.image} 
                      alt={clinic.name}
                      style={{ width: "100%", height: 160, objectFit: "cover" }}
                      onError={(e) => e.target.style.display = "none"}
                    />
                  )}
                  <div style={{ padding: 20, textAlign: "center" }}>
                    <h3 style={{ color: "var(--gold2)", fontSize: 18 }}>{clinic.name}</h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Rest of your existing UI (Jobs, Ads, Stats, etc.) */}
        {/* ... */}

        {/* Admin Controls */}
        <div style={{ position: "fixed", top: 16, left: 16, zIndex: 900, display: "flex", gap: 8 }}>
          <button onClick={() => setAdminLogin(true)}
            style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: "7px 11px", color: "rgba(255,255,255,.18)", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.18)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; }}>
            ⚙
          </button>
          <button onClick={handleManualRefresh}
            style={{ background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.06)", borderRadius: 10, padding: "7px 11px", color: "rgba(255,255,255,.18)", cursor: "pointer" }}
            onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--border)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,.18)"; e.currentTarget.style.borderColor = "rgba(255,255,255,.06)"; }}>
            🔄
          </button>
        </div>

        {/* Admin Login Modal */}
        {adminLogin && !adminOpen && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.9)", zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "var(--dark2)", padding: 40, borderRadius: 20, width: 300 }}>
              <h2 style={{ color: "var(--gold)", marginBottom: 20 }}>لوحة التحكم</h2>
              <input type="password" id="adminPass" placeholder="كلمة المرور" className="field" style={{ marginBottom: 15 }} />
              <button className="btn btn-gold" style={{ width: "100%", padding: 12 }} onClick={() => {
                const pass = document.getElementById('adminPass').value;
                if (pass === ADMIN_PASS) {
                  setAdminLogin(false);
                  setAdminOpen(true);
                } else {
                  alert("كلمة مرور غير صحيحة");
                }
              }}>دخول</button>
            </div>
          </div>
        )}

        {/* Admin Panel */}
        {adminOpen && (
          <AdminPanel 
            state={S} 
            setState={setS} 
            onClose={() => setAdminOpen(false)} 
          />
        )}
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   ADMIN PANEL COMPONENT
════════════════════════════════════════════════════════════════════ */
const AdminPanel = ({ state, setState, onClose }) => {
  const [sec, setSec] = useState("clinics"); // Default to clinics
  const [clinics, setClinics] = useState(state.clinics || []);
  const [clinicEdit, setClinicEdit] = useState(null);
  const [clinicForm, setClinicForm] = useState({ name: '', image: '' });

  // Save to adminStore on any change
  useEffect(() => {
    adminStore.save({ ...state, clinics });
  }, [clinics, state]);

  const openClinic = (clinic) => {
    setClinicEdit(clinic ? clinic.id : 'NEW');
    setClinicForm(clinic ? { name: clinic.name, image: clinic.image } : { name: '', image: '' });
  };

  const saveClinic = () => {
    if (!clinicForm.name?.trim()) return;
    
    const newClinic = {
      id: clinicEdit === 'NEW' ? `clinic-${uid()}` : clinicEdit,
      name: clinicForm.name.trim(),
      image: clinicForm.image.trim(),
    };
    
    let updatedClinics;
    if (clinicEdit === 'NEW') {
      updatedClinics = [...clinics, newClinic];
    } else {
      updatedClinics = clinics.map(c => c.id === clinicEdit ? newClinic : c);
    }
    
    setClinics(updatedClinics);
    setState(prev => ({ ...prev, clinics: updatedClinics }));
    setClinicEdit(null);
    cache.clear();
  };

  const deleteClinic = (id) => {
    if (!confirm('حذف العيادة؟')) return;
    const updatedClinics = clinics.filter(c => c.id !== id);
    setClinics(updatedClinics);
    setState(prev => ({ ...prev, clinics: updatedClinics }));
    cache.clear();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.95)", zIndex: 2100, overflow: "auto", padding: 20 }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", background: "var(--dark2)", borderRadius: 20, padding: 20 }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "var(--gold)" }}>لوحة التحكم</h2>
          <button className="btn btn-danger" onClick={onClose}>✕ إغلاق</button>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
          {[
            ["clinics", "🏥 العيادات"],
            ["jobs", "💼 الوظائف"],
            ["ads", "🖼 الإعلانات"],
            ["settings", "⚙ الإعدادات"]
          ].map(([id, label]) => (
            <button key={id} 
              className={`tab ${sec === id ? 'tab-on' : 'tab-off'}`}
              onClick={() => setSec(id)}>
              {label}
            </button>
          ))}
        </div>

        {/* Clinics Section */}
        {sec === "clinics" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <h3 style={{ color: "var(--text)" }}>🏥 قائمة العيادات</h3>
              <button className="btn btn-gold" onClick={() => openClinic(null)}>+ إضافة عيادة</button>
            </div>

            {/* Edit Form */}
            {clinicEdit && (
              <div style={{ background: "var(--dark3)", padding: 20, borderRadius: 10, marginBottom: 20 }}>
                <h4 style={{ color: "var(--gold)", marginBottom: 15 }}>
                  {clinicEdit === 'NEW' ? 'إضافة عيادة جديدة' : 'تعديل العيادة'}
                </h4>
                <div style={{ display: "grid", gap: 15, marginBottom: 15 }}>
                  <input
                    className="field"
                    placeholder="اسم العيادة"
                    value={clinicForm.name}
                    onChange={e => setClinicForm({ ...clinicForm, name: e.target.value })}
                  />
                  <input
                    className="field"
                    placeholder="رابط الصورة"
                    value={clinicForm.image}
                    onChange={e => setClinicForm({ ...clinicForm, image: e.target.value })}
                  />
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button className="btn btn-gold" onClick={saveClinic}>💾 حفظ</button>
                  <button className="btn btn-ghost" onClick={() => setClinicEdit(null)}>إلغاء</button>
                </div>
              </div>
            )}

            {/* Clinics Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 15 }}>
              {clinics.map(clinic => (
                <div key={clinic.id} style={{ 
                  background: "var(--dark3)", 
                  border: "1px solid var(--border)", 
                  borderRadius: 10, 
                  overflow: "hidden"
                }}>
                  {clinic.image && (
                    <img 
                      src={clinic.image} 
                      alt={clinic.name}
                      style={{ width: "100%", height: 150, objectFit: "cover" }}
                      onError={(e) => e.target.style.display = "none"}
                    />
                  )}
                  <div style={{ padding: 15 }}>
                    <h4 style={{ color: "var(--gold2)", marginBottom: 10 }}>{clinic.name}</h4>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button className="btn btn-ghost" style={{ padding: "5px 15px", fontSize: 12 }} onClick={() => openClinic(clinic)}>
                        ✏ تعديل
                      </button>
                      <button className="btn btn-danger" style={{ padding: "5px 15px", fontSize: 12 }} onClick={() => deleteClinic(clinic.id)}>
                        🗑 حذف
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Other sections (simplified - you can expand these) */}
        {sec === "jobs" && <div>قسم الوظائف (قيد التطوير)</div>}
        {sec === "ads" && <div>قسم الإعلانات (قيد التطوير)</div>}
        {sec === "settings" && <div>قسم الإعدادات (قيد التطوير)</div>}
      </div>
    </div>
  );
};