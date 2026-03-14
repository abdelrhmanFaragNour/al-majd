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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SHEET_URL}&t=${new Date().getTime()}`);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: false, // خليناها false عشان نقرأ الأعمدة يدوي
          skipEmptyLines: true,
          complete: (results) => {
            const rows = results.data;
            const config = {};
            
            // هنا بنحول الشكل الرأسي (A و B) لشكل يفهمه الكود
            rows.forEach(row => {
              if (row[0] && row[1]) {
                config[row[0].trim()] = row[1].trim();
              }
            });

            setSettings(config);
            setData(rows); 
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>جاري التحديث...</div>;

  // تحديد اللوجو (من الشيت أو الرابط الاحتياطي)
  const finalLogo = settings.logoUrl || "https://i.postimg.cc/RFYB8gjL/1000273592_cd331d30c881c099ee519b011cb86f56_3_3_2026_5_26_08_PM.png";

  return (
    <div className="App">
      <Navbar logo={finalLogo} brandName={settings.brandName || "المجد جروب"} />
      
      <main>
        <Hero 
          title={settings.heroTitle} 
          subtitle={settings.heroSubtitle} 
          image={settings.heroImage} 
        />
        <Categories data={data} />
        <Jobs data={data} />
        <Contact 
          phone={settings.contactPhone} 
          email={settings.contactEmail} 
          location={settings.location}
        />
      </main>
      <Footer brandName={settings.brandName || "المجد جروب"} />
    </div>
  );
}

export default App;
