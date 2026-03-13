import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Jobs from "./components/Jobs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

// رابط جوجل شيت (بصيغة CSV) الخاص بك
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS--X_f_k-M3eA8D98D-D988D8ACD9881/pub?output=csv";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // إضافة t= لمنع التخزين المؤقت وضمان جلب البيانات الجديدة فوراً
        const response = await fetch(`${SHEET_URL}&t=${new Date().getTime()}`);
        
        if (!response.ok) {
          throw new Error("لم يتمكن الموقع من الاتصال بجوجل شيت");
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setData(results.data);
            } else {
              setError("تأكد من وجود بيانات داخل ملف الإكسيل");
            }
          },
        });
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', direction: 'rtl' }}>
        <h2>جاري تحديث بيانات المجد جروب...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'red', direction: 'rtl' }}>
        <h2>حدث خطأ في المزامنة: {error}</h2>
        <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
      </div>
    );
  }

  // استلام المحتوى من الصف الأول
  const siteContent = data[0] || {};

  return (
    <div className="App">
      <Navbar 
        logo={siteContent.logoUrl} 
        brandName={siteContent.brandName || "المجد جروب"} 
      />
      
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
