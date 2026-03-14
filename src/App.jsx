import React, { useState, useEffect, useRef, useCallback } from "react";

// --- الإعدادات الأساسية ---
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

// --- التنسيقات (CSS) ---
const GLOBAL_CSS = `
:root {
  --gold: #c9a227; --gold2: #e8c44a; --dark: #06060a;
  --dark2: #0f0f14; --dark3: #1a1a20; --white: #f8f9fa;
  --shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Cairo', sans-serif; background: var(--dark); color: var(--white); direction: rtl; overflow-x: hidden; }
.container { max-width: 1200px; margin: 0 auto; padding: 20px; }
.grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; margin-top: 20px; }
.card { background: var(--dark2); border-radius: 15px; padding: 25px; border: 1px solid var(--dark3); transition: 0.3s; position: relative; overflow: hidden; }
.card:hover { transform: translateY(-8px); border-color: var(--gold); box-shadow: 0 10px 30px rgba(201,162,39,0.2); }
.card h3 { color: var(--gold2); margin-bottom: 15px; font-size: 1.4rem; }
.card p { margin: 8px 0; color: #ccc; font-size: 0.95rem; }
.btn-gold { background: linear-gradient(45deg, var(--gold), var(--gold2)); border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 20px; color: var(--dark); transition: 0.3s; }
.btn-gold:hover { opacity: 0.9; transform: scale(1.02); }
.ticker { background: linear-gradient(90deg, var(--dark2), var(--dark3)); padding: 12px; border-bottom: 2px solid var(--gold); overflow: hidden; }
.ticker-content { display: inline-block; white-space: nowrap; animation: ticker 25s linear infinite; font-weight: bold; color: var(--gold2); }
@keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
.urgent-badge { background: #ff4444; color: white; padding: 4px 12px; border-radius: 20px; font-size: 11px; position: absolute; top: 15px; left: 15px; animation: pulse 2s infinite; }
@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
.loading { height: 100vh; display: flex; align-items: center; justify-content: center; color: var(--gold2); font-size: 1.5rem; }
@media (max-width: 768px) { .grid { grid-template-columns: 1fr; } }
`;

// --- دوال معالجة البيانات المحسنة ---
const parseCSV = (csvText) => {
  if (!csvText) return [];
  const lines = csvText.trim().split('\n');
  return lines.slice(1).map(line => {
    // Regex متقدم لتقسيم الأعمدة حتى لو بداخلها فواصل
    const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
    return columns.map(col => col.replace(/^"|"$/g, '').trim());
  });
};

const parseSettings = (csvText) => {
  const rows = parseCSV(csvText);
  const settings = {};
  rows.forEach(([key, value]) => { if(key) settings[key] = value; });
  return settings;
};

// --- المكون الرئيسي للموقع ---
export default function MajdApp() {
  const [data, setData] = useState({ visa: [], transfer: [], settings: {}, ads: [], loading: true });

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

      const fetchSheet = async (gid) => {
        const response = await fetch(`${BASE_URL}${gid}&output=csv`);
        if (!response.ok) throw new Error("فشل الجلب");
        return response.text();
      };

      const [settingsCSV, visaCSV, transferCSV, adsCSV] = await Promise.all([
        fetchSheet(SHEET_GIDS.settings),
        fetchSheet(SHEET_GIDS.visa),
        fetchSheet(SHEET_GIDS.transfer),
        fetchSheet(SHEET_GIDS.ads)
      ]);

      const payload = {
        settings: parseSettings(settingsCSV),
        visa: parseCSV(visaCSV).map(row => ({
          title: row[0], city: row[1], salary: row[2], exp: row[3], urgent: row[4] === 'نعم', show: row[6] === 'نعم'
        })).filter(j => j.show),
        transfer: parseCSV(transferCSV).map(row => ({
          title: row[0], city: row[1], salary: row[2], exp: row[3], urgent: row[4] === 'نعم', show: row[6] === 'نعم'
        })).filter(j => j.show),
        ads: parseCSV(adsCSV).map(row => row[0])
      };

      setData({ ...payload, loading: false });
      localStorage.setItem(CACHE_KEY, JSON.stringify({ timestamp: Date.now(), payload }));
    } catch (err) {
      console.error("Error:", err);
      setData(prev => ({ ...prev, loading: false }));
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  if (data.loading) return <div className="loading">جاري تحميل الفرص الذهبية...</div>;

  const whatsappLink = `https://wa.me{data.settings.whatsapp || '966500000000'}`;

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      {/* شريط الأخبار العلوي */}
      <div className="ticker">
        <div className="ticker-content">
          ✨ {data.settings.welcome_msg || "مرحباً بكم في منصة مجد للتوظيف - وجهتكم الأولى لأفضل الفرص الوظيفية"} ✨
          &nbsp;&nbsp; | &nbsp;&nbsp; 📞 للتواصل مباشرة: {data.settings.contact_info}
        </div>
      </div>

      <div className="container">
        <header style={{textAlign:'center', padding:'50px 0'}}>
          <h1 style={{color:'var(--gold2)', fontSize:'3rem', textShadow:'0 0 20px rgba(201,162,39,0.3)'}}>
            {data.settings.site_name || "مجد للتوظيف"}
          </h1>
          <p style={{marginTop:'10px', opacity:0.8}}>بوابتك لأفضل فرص العمل في المملكة</p>
        </header>

        {/* قسم التأشيرات */}
        <section style={{marginBottom: '60px'}}>
          <h2 style={{borderRight:'5px solid var(--gold)', paddingRight:'15px', color:'var(--gold)'}}>💼 فرص التأشيرات</h2>
          <div className="grid">
            {data.visa.length > 0 ? data.visa.map((job, idx) => (
              <div key={idx} className="card">
                {job.urgent && <span className="urgent-badge">عاجل جداً 🔥</span>}
                <h3>{job.title}</h3>
                <p>📍 <b>المدينة:</b> {job.city}</p>
                <p>💰 <b>الراتب:</b> {job.salary}</p>
                <p>⏳ <b>الخبرة:</b> {job.exp}</p>
                <button className="btn-gold" onClick={() => window.open(whatsappLink)}>قدم الآن عبر واتساب</button>
              </div>
            )) : <p>لا توجد وظائف متاحة حالياً في هذا القسم.</p>}
          </div>
        </section>

        {/* قسم نقل الكفالة */}
        <section style={{paddingBottom: '80px'}}>
          <h2 style={{borderRight:'5px solid var(--gold)', paddingRight:'15px', color:'var(--gold)'}}>🔄 نقل الكفالة</h2>
          <div className="grid">
            {data.transfer.length > 0 ? data.transfer.map((job, idx) => (
              <div key={idx} className="card">
                {job.urgent && <span className="urgent-badge">مطلوب فوراً</span>}
                <h3>{job.title}</h3>
                <p>📍 <b>الموقع:</b> {job.city}</p>
                <p>💰 <b>المميزات:</b> {job.salary}</p>
                <button className="btn-gold" onClick={() => window.open(whatsappLink)}>استفسر الآن</button>
              </div>
            )) : <p>سيتم إضافة فرص نقل كفالة قريباً.</p>}
          </div>
        </section>
      </div>

      {/* زر واتساب عائم للجوال */}
      <a href={whatsappLink} target="_blank" rel="noreferrer" style={{position:'fixed', bottom:'30px', right:'30px', zIndex:1000}}>
        <img src="https://upload.wikimedia.org" width="60" height="60" alt="WhatsApp" />
      </a>
    </>
  );
}
