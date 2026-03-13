import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Jobs from "./components/Jobs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

// رابط جوجل شيت الخاص بك
const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS--X_f_k-M3eA8D98D-D988D8ACD9881/pub?output=csv";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // التعديل الوحيد هنا لضمان تحديث البيانات فوراً
        const response = await fetch(`${SHEET_URL}&t=${new Date().getTime()}`);
        const reader = response.body.getReader();
        const result = await reader.read();
        const decoder = new TextDecoder("utf-8");
        const csv = decoder.decode(result.value);
        
        Papa.parse(csv, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setData(results.data);
            setLoading(false);
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  // توزيع البيانات على المكونات الأصلية لموقعك
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
