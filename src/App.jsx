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
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SHEET_URL}&t=${new Date().getTime()}`);
        if (!response.ok) throw new Error("فشل الاتصال بجوجل شيت");
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              setData(results.data);
            } else {
              setError("تأكد من وجود بيانات في الشيت");
            }
          },
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{textAlign:'center', marginTop:'50px'}}>جاري التحديث...</div>;
  if (error) return <div style={{textAlign:'center', color:'red'}}>{error}</div>;

  const siteContent = data[0] || {};

  return (
    <div className="App">
      <Navbar logo={siteContent.logoUrl} brandName={siteContent.brandName || "المجد جروب"} />
      <main>
        <Hero title={siteContent.heroTitle} subtitle={siteContent.heroSubtitle} image={siteContent.heroImage} />
        <Categories data={data} />
        <Jobs data={data} />
        <Contact phone={siteContent.contactPhone} email={siteContent.contactEmail} location={siteContent.location} />
      </main>
      <Footer brandName={siteContent.brandName || "المجد جروب"} />
    </div>
  );
}

export default App;
