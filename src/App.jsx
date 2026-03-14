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
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SHEET_URL}&t=${new Date().getTime()}`);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
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

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>جاري مزامنة المجد جروب...</div>;

  const siteContent = data[0] || {};

  // ده الرابط اللي إنت بعتهولي - هخليه هو الأساسي لو الشيت مجابش نتيجة
  const finalLogo = siteContent.logoUrl || "https://i.postimg.cc/RFYB8gjL/1000273592_cd331d30c881c099ee519b011cb86f56_3_3_2026_5_26_08_PM.png";

  return (
    <div className="App">
      {/* ركز هنا: بعتنا الـ finalLogo للـ Navbar */}
      <Navbar logo={finalLogo} brandName={siteContent.brandName || "المجد جروب"} />
      
      <main>
        <Hero 
          title={siteContent.heroTitle} 
          subtitle={siteContent.heroSubtitle} 
          image={siteContent.heroImage} 
        />
        <Categories data={data} />
        <Jobs data={data} />
        <Contact 
          phone={siteContent.contactPhone} 
          email={siteContent.contactEmail} 
          location={siteContent.location}
        />
      </main>
      <Footer brandName={siteContent.brandName || "المجد جروب"} />
    </div>
  );
}

export default App;
