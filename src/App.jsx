import React, { useState, useEffect, useRef, useCallback } from "react";

// --- الثوابت ---
const SPREADSHEET_ID = "2PACX-1vQQ6cGQr0Zu2Il5Df-ULm2h4jEfPi1bklr6uUF5g28nktjZK_yfk8tDCI92wC0oFKwitJXmEwn3UFs1";
const SHEET_GIDS = {
  settings: "1276002029",
  visa: "513051489",
  transfer: "532437154",
  ads: "13072504",
  social: "906944007"
};
const BASE_URL = `https://docs.google.com{SPREADSHEET_ID}/pub?gid=`;
const CACHE_KEY = "majd_v3";
const CACHE_TTL = 10 * 60 * 1000;

// --- كل التنسيقات الأصلية التي طلبتها (CSS الكامل) ---
const GLOBAL_CSS = `
:root {
  --gold: #c9a227; --gold2: #e8c44a; --dark: #06060a;
  --dark2: #0f0f14; --dark3: #1a1a20; --white: #f8f9fa;
  --shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  --shadow-gold: 0 0 30px rgba(201,162,39,0.4);
}

* { margin: 0; padding: 0; box-sizing: border-box; }
html, body {
  font-family: 'Cairo', sans-serif; background: var(--dark); color: var(--white);
  overflow-x: hidden; direction: rtl; scroll-behavior: smooth;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
@keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

.header-3d { perspective: 1000px; transform-style: preserve-3d; text-align: center; padding: 60px 0; }
.tilt-card { 
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94); 
  background: linear-gradient(145deg, var(--dark2), var(--dark3));
  border-radius: 20px; padding: 30px; position: relative; overflow: hidden;
}
.tilt-card:hover { transform: translateY(-10px) scale(1.02); box-shadow: var(--shadow-gold); border: 1px solid var(--gold); }
.card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
  background: linear-gradient(90deg, var(--gold), var(--gold2), var(--gold));
  animation: shimmer 2s infinite;
}

.btn-gold {
  background: linear-gradient(45deg, var(--gold), var(--gold2)); border: none;
  padding: 15px 30px; border-radius: 50px; color: var(--dark); font-weight: bold;
  cursor: pointer; transition: 0.3s; width: 100%; margin-top: 15px;
}
.btn-gold:hover { transform: scale(1.05); box-shadow: var(--shadow-gold); }

.ticker { background: var(--dark2); padding: 15px 0; border-bottom: 1px solid var(--gold); overflow: hidden; }
.ticker-content { display: inline-block; animation: ticker 25s linear infinite; font-weight: bold; color: var(--gold2); }

.urgent-badge {
  background: linear-gradient(45deg, #ff4444, #ff6666); color: white;
  padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold;
  position: absolute; top: 15px; left: 15px;
}

.ad-slider {
  height: 400px; border-radius: 25px; margin: 40px 0; position: relative; overflow: hidden;
  background: var(--dark2); display: flex; align-items: center; justify-content: center;
}

.floating-wa { position: fixed; bottom: 30px; right: 30px; z-index: 1000; animation: float 3s infinite ease-in-out; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 30px; padding: 20px 0; }
.container { max-width: 1400px; margin: 0 auto; padding: 0 20px; }

@media (max-width: 768px) { .ad-slider { height: 250px; } .grid { grid-template-columns: 1fr; } }
`;

// --- دوال المعالجة (Parsers) المحسنة ---
const parseCSV = (csvText) => {
  if (!csvText) return [];
  const lines = csvText.trim().split('\n');
  return lines.slice(1).map(line => {
    const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    return columns.map(col => col.replace(/^"|"$/g, '').trim());
  });
};

const parseSettings = (csvText) => {
  const rows = parseCSV(csvText);
  return rows.reduce((acc, [key, value]) => { if(key) acc[key] = value; return acc; }, {});
};

// --- المكون الرئيسي ---
export default function MajdApp() {
  const [data, setData] = useState({ visa: [], transfer: [], settings: {}, ads: [], social: {}, loading: true });
  const [activeSlide, setActiveSlide] = useState(0);

  const fetchData = useCallback(async (force = false) => {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!force && cached) {
        const { timestamp, payload } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_TTL) {
          setData({ ...payload, loading: false });
          return;
        }
      }

      const fetchSheet = (gid) => fetch(`${BASE_URL}${gid}&output=csv`).then(r => r.text());

      const [settingsCSV, visaCSV, transferCSV, adsCSV, socialCSV] = await Promise.all([
        fetchSheet(SHEET_GIDS.settings),
        fetchSheet(SHEET_GIDS.visa),
        fetchSheet(SHEET_GIDS.transfer),
        fetchSheet(SHEET_GIDS.ads),
        fetchSheet(SHEET_GIDS.social)
      ]);

      const payload = {
        settings: parseSettings(settingsCSV),
        visa: parseCSV(visaCSV).map(r => ({ title: r[0], city: r[1], salary: r[2], exp: r[3], urgent: r[4]==='نعم', show: r[6]==='نعم' })).filter(j => j.show),
        transfer: parseCSV(transferCSV).map(r => ({ title: r[0], city: r[1], salary: r[2], exp: r[3], urgent: r[4]==='نعم', show: r[6]==='نعم' })).filter(j => j.show),
        ads: parseCSV(adsCSV).map(r => r[0]).filter(img => img), // يفترض أن رابط الصورة في أول عمود
        social: parseSettings(socialCSV)
      };

      setData({ ...payload, loading: false });
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), payload }));
    } catch (err) {
      console.error("Fetch Error:", err);
      setData(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // منطق السلايدر التلقائي
  useEffect(() => {
    if (data.ads.length > 0) {
      const timer = setInterval(() => {
        setActiveSlide(prev => (prev + 1) % data.ads.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [data.ads]);

  if (data.loading) return <div style={{height:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--gold2)'}}>جاري تحميل مجد للتوظيف...</div>;

  const waLink = `https://wa.me{data.settings.whatsapp || '966'}`;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* شريط الأخبار */}
      <div className="ticker">
        <div className="ticker-content">
          ✨ {data.settings.welcome_msg || "مرحباً بكم في منصة مجد للتوظيف"} ✨ &nbsp;&nbsp; | &nbsp;&nbsp; 📞 {data.settings.contact_info}
        </div>
      </div>

      <div className="container">
        {/* الهيدر 3D */}
        <header className="header-3d">
          <h1 style={{fontSize: '3.5rem', color: 'var(--gold2)', textShadow: '0 0 30px var(--gold)'}}>
            {data.settings.site_name || "مجد للتوظيف"}
          </h1>
          <p style={{fontSize: '1.2rem', opacity: 0.8}}>{data.settings.hero_text}</p>
        </header>

        {/* السلايدر الإعلاني */}
        {data.ads.length > 0 && (
          <div className="ad-slider" style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${data.ads[activeSlide]})`,
            backgroundSize: 'cover', backgroundPosition: 'center', transition: '1s'
          }}>
             <h2 style={{color:'white', fontSize:'2rem'}}>أحدث العروض الحصرية</h2>
          </div>
        )}

        {/* قسم التأشيرات */}
        <section style={{padding: '40px 0'}}>
          <h2 style={{borderRight: '5px solid var(--gold)', paddingRight: '15px', color: 'var(--gold2)'}}>📂 تأشيرات عمل جديدة</h2>
          <div className="grid">
            {data.visa.map((job, i) => (
              <div key={i} className="tilt-card card">
                {job.urgent && <span className="urgent-badge">عاجل 🔥</span>}
                <h3>{job.title}</h3>
                <p>📍 المدينة: {job.city}</p>
                <p>💰 الراتب: {job.salary}</p>
                <p>⏳ الخبرة: {job.exp}</p>
                <button className="btn-gold" onClick={() => window.open(waLink)}>قدم الآن</button>
              </div>
            ))}
          </div>
        </section>

        {/* قسم نقل الكفالة */}
        <section style={{padding: '40px 0'}}>
          <h2 style={{borderRight: '5px solid var(--gold)', paddingRight: '15px', color: 'var(--gold2)'}}>🔄 فرص نقل كفالة</h2>
          <div className="grid">
            {data.transfer.map((job, i) => (
              <div key={i} className="tilt-card card">
                {job.urgent && <span className="urgent-badge">مطلوب فوراً</span>}
                <h3>{job.title}</h3>
                <p>📍 الموقع: {job.city}</p>
                <p>💸 المميزات: {job.salary}</p>
                <button className="btn-gold" onClick={() => window.open(waLink)}>تواصل معنا</button>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* زر واتساب عائم */}
      <div className="floating-wa">
        <a href={waLink} target="_blank" rel="noreferrer">
          <img src="https://upload.wikimedia.org" width="65" alt="WhatsApp" />
        </a>
      </div>
    </>
  );
}
