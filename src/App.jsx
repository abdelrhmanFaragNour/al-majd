import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Jobs from "./components/Jobs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

// رابط الشيت الجديد (public CSV)
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ6cGQr0Zu2Il5Df-ULm2h4jEfPi1bklr6uUF5g28nktjZK_yfk8tDCI92wC0oFKwitJXmEwn3UFs1/pub?gid=1276002029&single=true&output=csv";

function App() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cacheBuster = Date.now() + '-' + Math.random().toString(36).substring(2, 10);
        const response = await fetch(`${SHEET_URL}&cb=${cacheBuster}`, {
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`خطأ جلب: ${response.status}`);
        }

        const csvText = await response.text();
        console.log("CSV RAW:", csvText); // للتأكد إن البيانات جاية

        Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const config = {};
            results.data.forEach(row => {
              if (row[0] && row[1]) {
                const key = row[0].trim().replace(/\s+/g, '');
                config[key] = row[1].trim();
              }
            });
            console.log("البيانات من الشيت:", config);
            setSettings(config);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("مشكلة في الشيت:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:'100px'}}>جاري مزامنة المجد جروب...</div>;

  const myLogo = settings.logoSrc || settings.logoUrl || "https://i.postimg.cc/RFYB8gjL/1000273592_cd331d30c881c099ee519b011cb86f56_3_3_2026_5_26_08_PM.png";

  return (
    <div className="App">
      <Navbar logo={myLogo} brandName={settings.siteName || "المجد جروب"} />
      <main>
        <Hero
          title={settings.heroTitle || "المجد جروب للتوظيف الطبي"}
          subtitle={settings.heroDesc || "نربط الكفاءات الطبية بأفضل المؤسسات"}
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
      <Footer brandName={settings.siteName || "المجد جروب"} />
    </div>
  );
}

export default App;
