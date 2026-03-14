import React, { useState, useEffect, useRef, useCallback } from "react";

const SPREADSHEET_ID = "2PACX-1vQQ6cGQr0Zu2Il5Df-ULm2h4jEfPi1bklr6uUF5g28nktjZK_yfk8tDCI92wC0oFKwitJXmEwn3UFs1";
const SHEET_GIDS = {
  settings: "1276002029",
  visa: "513051489",
  transfer: "532437154",
  ads: "13072504",
  social: "906944007"
};
const BASE_URL = `https://docs.google.com/spreadsheets/d/e/${SPREADSHEET_ID}/pub?gid=`;
const CACHE_KEY = "majd_v3";
const ADMIN_KEY = "majd_admin_v3";
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const ADMIN_PASSWORD = "majd2026";

const GLOBAL_CSS = `
:root {
  --gold: #c9a227;
  --gold2: #e8c44a;
  --dark: #06060a;
  --dark2: #0f0f14;
  --dark3: #1a1a20;
  --white: #f8f9fa;
  --shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
  --shadow-gold: 0 0 30px rgba(201,162,39,0.4);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  font-family: 'Cairo', sans-serif;
  background: var(--dark);
  color: var(--white);
  overflow-x: hidden;
  direction: rtl;
  scroll-behavior: smooth;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes float { 0%, 100% { transform: translateY(0px) rotateX(0deg); } 50% { transform: translateY(-10px) rotateX(5deg); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
@keyframes glow { 0%, 100% { box-shadow: 0 0 20px rgba(201,162,39,0.3); } 50% { box-shadow: 0 0 40px rgba(201,162,39,0.6); } }
@keyframes slideR { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes slideL { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes orb { 0% { transform: rotate(0deg) scale(1); } 50% { transform: rotate(180deg) scale(1.1); } 100% { transform: rotate(360deg) scale(1); } }
@keyframes ticker { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
@keyframes borderGlow { 0%, 100% { box-shadow: 0 0 10px var(--gold); } 50% { box-shadow: 0 0 25px var(--gold2); } }
@keyframes cardIn { from { opacity: 0; transform: translateY(50px) rotateX(-10deg); } to { opacity: 1; transform: translateY(0) rotateX(0); } }

.header-3d {
  perspective: 1000px;
  transform-style: preserve-3d;
}

.parallax-bg {
  transition: transform 0.1s ease-out;
  will-change: transform;
}

.tilt-card {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  transform-style: preserve-3d;
  will-change: transform;
}

.tilt-card:hover {
  transform: rotateX(5deg) rotateY(5deg) scale(1.05);
  box-shadow: var(--shadow-gold);
}

.social-icon {
  transition: all 0.3s ease;
  transform-style: preserve-3d;
}

.social-icon:hover {
  transform: scale(1.3) rotateY(360deg) translateZ(20px);
  filter: drop-shadow(0 0 15px var(--gold2));
}

.btn-gold {
  background: linear-gradient(45deg, var(--gold), var(--gold2));
  border: none;
  padding: 15px 30px;
  border-radius: 50px;
  color: var(--dark);
  font-weight: bold;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-gold:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: var(--shadow-gold);
}

.btn-gold::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
  transition: left 0.5s;
}

.btn-gold:hover::before {
  left: 100%;
}

.stats-card {
  background: linear-gradient(145deg, var(--dark2), var(--dark3));
  border: 1px solid var(--gold);
  animation: borderGlow 2s infinite;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.section {
  padding: 80px 0;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.fade-up {
  animation: fadeUp 0.8s ease forwards;
}

.card {
  background: linear-gradient(145deg, var(--dark2), var(--dark3));
  border-radius: 20px;
  padding: 30px;
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--gold), var(--gold2), var(--gold));
  animation: shimmer 2s infinite;
}

.urgent-badge {
  background: linear-gradient(45deg, #ff4444, #ff6666);
  color: white;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: bold;
  animation: pulse 2s infinite;
}

.ticker {
  background: linear-gradient(90deg, var(--dark2), var(--dark3));
  overflow: hidden;
  white-space: nowrap;
  padding: 15px 0;
  border-bottom: 1px solid var(--gold);
}

.ticker-content {
  display: inline-block;
  animation: ticker 25s linear infinite;
}

.ad-slider {
  position: relative;
  height: 400px;
  overflow: hidden;
  border-radius: 25px;
  margin: 40px 0;
}

.ad-slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transition: opacity 0.5s ease;
}

.progress-bar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 4px;
  background: rgba(255,255,255,0.2);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--gold2);
  width: 0%;
  transition: width 0.1s linear;
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0,0,0,0.5);
  border: none;
  color: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-nav:hover {
  background: var(--gold);
  transform: translateY(-50%) scale(1.1);
}

.slider-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255,255,255,0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot.active {
  background: var(--gold2);
  transform: scale(1.3);
}

.floating-wa {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 1000;
  animation: float 3s ease-in-out infinite;
}

.wa-buttons {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.admin-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(6,6,10,0.95);
  z-index: 9999;
  padding: 40px;
  overflow-y: auto;
}

.admin-section {
  margin-bottom: 40px;
  padding: 25px;
  background: var(--dark2);
  border-radius: 15px;
  border: 1px solid var(--gold);
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--gold);
}

.input-group input, .input-group textarea, .input-group select {
  width: 100%;
  padding: 12px;
  background: var(--dark3);
  border: 1px solid var(--gold);
  border-radius: 10px;
  color: var(--white);
  font-family: inherit;
}

.file-input {
  padding: 12px;
  background: var(--dark3);
  border: 2px dashed var(--gold);
  border-radius: 10px;
  color: var(--white);
  cursor: pointer;
}

.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: var(--dark3);
  margin-bottom: 10px;
  border-radius: 10px;
  border-right: 4px solid var(--gold);
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .section {
    padding: 50px 0;
  }
  
  .ad-slider {
    height: 300px;
  }
}
`;

const CSVParser = ({ csvText }) => {
  const lines = csvText.trim().split('\n').slice(1);
  return lines.map(line => {
    const [title, city, salary, exp, urgent, date, show] = line.split(',').map(cell => cell.replace(/"/g, '').trim());
    return { title, city, salary, exp, urgent: urgent === 'نعم', date, show: show === 'نعم' };
  }).filter(job => job.show);
};

const SettingsParser = ({ csvText }) => {
  const lines = csvText.trim().split('\n').slice(1);
  const settings = {};
  lines.forEach(line => {
    const [key, value] = line.split(',').map(cell => cell.replace(/"/g, '').trim());
    settings[key] = value;
  });
  return settings;
};

const AdsParser = ({ csvText }) => {
  const lines = csvText.trim().split('\n').slice(1);
  return lines.map(line => {
    const [img, title, subtitle, link, color, imgPosition] = line.split(',').map(cell => cell.replace(/"/g, '').trim());
    return { img, title, subtitle, link, color: color || '#c9a227', imgPosition: imgPosition || 'center' };
  });
};

const SocialParser = ({ csvText }) => {
  const lines = csvText.trim().split('\n').slice(1);
  return lines.map(line => {
    const [platform, url, icon, iconHover] = line.split(',').map(cell => cell.replace(/"/g, '').trim());
    return { platform, url, icon, iconHover };
  });
};

const fetchSheet = async (gid) => {
  try {
    const url = BASE_URL + gid + '&single=true&output=csv&t=' + Date.now();
    const res = await fetch(url, { cache: 'no-store' });
    return await res.text();
  } catch {
    return '';
  }
};

const useSheetsData = () => {
  const [data, setData] = useState({
    settings: {},
    visa: [],
    transfer: [],
    ads: [],
    social: [],
    stats: { totalJobs: 0, visas: 0, transfers: 0, urgent: 0, cities: new Set() }
  });

  useEffect(() => {
    const loadData = async () => {
      const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
      const cacheTime = cache.timestamp || 0;
      
      if (Date.now() - cacheTime < CACHE_TTL && cache.data) {
        setData(cache.data);
        return;
      }

      try {
        const [settingsText, visaText, transferText, adsText, socialText] = await Promise.all([
          fetchSheet(SHEET_GIDS.settings),
          fetchSheet(SHEET_GIDS.visa),
          fetchSheet(SHEET_GIDS.transfer),
          fetchSheet(SHEET_GIDS.ads),
          fetchSheet(SHEET_GIDS.social)
        ]);

        const settings = SettingsParser({ csvText: settingsText });
        const visaJobs = CSVParser({ csvText: visaText });
        const transferJobs = CSVParser({ csvText: transferText });
        const ads = AdsParser({ csvText: adsText });
        const social = SocialParser({ csvText: socialText });

        const allJobs = [...visaJobs, ...transferJobs];
        const cities = new Set(allJobs.map(job => job.city));
        
        const newData = {
          settings,
          visa: visaJobs,
          transfer: transferJobs,
          ads,
          social,
          stats: {
            totalJobs: allJobs.length,
            visas: visaJobs.length,
            transfers: transferJobs.length,
            urgent: allJobs.filter(j => j.urgent).length,
            cities: cities.size
          }
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify({
          data: newData,
          timestamp: Date.now()
        }));
        setData(newData);
      } catch (error) {
        console.error('Failed to load sheets:', error);
        if (cache.data) setData(cache.data);
      }
    };

    loadData();
  }, []);

  return data;
};

const Header = ({ data, mousePos, adminMode, toggleAdmin }) => {
  const logoRef = useRef(null);

  return (
    <header className="header-3d section" style={{ perspective: '1000px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .logo-float { animation: float 4s ease-in-out infinite; }
        .gradient-title {
          background: linear-gradient(45deg, var(--gold), var(--gold2));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      ` }} />
      <div className="container" style={{ position: 'relative' }}>
        <button 
          onClick={toggleAdmin}
          style={{
            position: 'absolute',
            top: '20px',
            left: '20px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: 'var(--gold)',
            cursor: 'pointer',
            zIndex: 10
          }}
        >
          ⚙
        </button>
        
        <div className="text-center" style={{ transformStyle: 'preserve-3d' }}>
          <div 
            ref={logoRef}
            className="logo-float mb-4 mx-auto"
            style={{ 
              width: '120px', 
              height: '120px',
              backgroundImage: `url(${data.settings.logoSrc || '/logo.png'})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              transform: `rotateX(${mousePos.y * 0.1}deg) rotateY(${mousePos.x * 0.1}deg)`
            }}
          />
          
          <h1 className="gradient-title text-5xl md:text-7xl font-bold mb-6" style={{ textShadow: '0 0 30px rgba(201,162,39,0.5)' }}>
            {data.settings.siteName || 'الشركة الطبية'}
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90" style={{ lineHeight: '1.6' }}>
            {data.settings.heroTitle || 'أفضل الوظائف الطبية في السعودية'}
          </p>
          
          <p className="text-lg mb-12 max-w-3xl mx-auto opacity-80">
            {data.settings.heroDesc || 'توظيف مباشر مع تأشيرات ونقل كفالة ✓ راتب مجزي ✓ سكن ومواصلات ✓ تأمين صحي'}
          </p>
          
          <div className="flex flex-wrap justify-center
