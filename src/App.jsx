import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Jobs from "./components/Jobs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

// هذا هو الرابط الذي سيسحب منه الموقع البيانات
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS--X_f_k-M3eA8D98D-D988D8ACD9881/pub?output=csv";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // إضافة t= لمنع المتصفح من عرض نسخة قديمة (Cache-busting)
        const response = await fetch(`${SHEET_URL}&t=${new Date().getTime()}`);
        const csvText = await response.text();
        
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            // هنا نتأكد أن البيانات وصلت
            console.log("البيانات المستلمة:", results.data);
            setData(results.data);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{textAlign:'center', marginTop:'50px', direction:'rtl'}}>جاري مزامنة بيانات المجد جروب...</div>;
  }

  // أول صف في الشيت يحتوي على الإعدادات العامة (العناوين والصورة الرئيسية)
  const siteContent = data[0] || {};

  return (
    <div className="App">
      <Navbar logo={siteContent.logoUrl} brandName={siteContent.brandName} />
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
      <Footer brandName={siteContent.brandName} />
    </div>
  );
}

export default App;
