import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Jobs from "./components/Jobs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS--X_f_k-M3eA8D98D-D988D8ACD9881/pub?output=csv";

function App() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // إضافة توقيت t لضمان عدم حدوث تعليق (Cache)
        const response = await fetch(`${SHEET_URL}&t=${new Date().getTime()}`);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: false, // شيت رأسي يعني مفيش عناوين عرضية
          skipEmptyLines: true,
          complete: (results) => {
            const config = {};
            // تحويل العمود A والعمود B لكلمات مفتاحية وقيم
            results.data.forEach(row => {
              if (row[0] && row[1]) {
                const key = row[0].trim();
                const value = row[1].trim();
                config[key] = value;
              }
            });
            setSettings(config);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching sheet:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:'100px', fontSize:'20px'}}>جاري تحديث بيانات المجد جروب...</div>;

  // الربط المباشر مع أسماء الخلايا في الشيت عندك
  const logo = settings.logoSrc || settings.logoUrl || "https://i.postimg.cc/RFYB8gjL/1000273592_cd331d30c881c099ee519b011cb86f56_3_3_2026_5_26_08_PM.png";
  const siteName = settings.siteName || "المجد جروب";

  return (
    <div className="App">
      {/* سطر تأكيد: لو اللوجو مظهرش في النافبار هيظهر هنا غصب عنه للتأكد */}
      <div style={{display:'none'}}><img src={logo} alt="check" /></div>

      <Navbar logo={logo} brandName={siteName} />
      
      <main>
        <Hero 
          title={settings.heroTitle || "ابدأ مسيرتك"} 
          subtitle={settings.heroDesc || "نربطك بأفضل الفرص"} 
          image={settings.heroImage} 
        />
        
        <Categories data={settings} />
        <Jobs data={settings} />
        
        <Contact 
          phone={settings.waEgyptNum} 
          email={settings.email} 
          location={settings.location}
        />
      </main>

      <Footer brandName={siteName} />
    </div>
  );
}

export default App;
