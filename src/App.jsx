import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "./App.css";

// ملاحظة: لو عندك ملفات الـ Components في مجلد اسمه components تأكد من وجودها
// إذا كانت ملفاتك في نفس المجلد، امسح كلمة /components من السطور اللي تحت

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
      } catch (err) {
        console.error("Error:", err);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{textAlign:'center', padding:'50px'}}>جاري التحميل...</div>;

  const siteContent = data[0] || {};

  return (
    <div className="App" style={{direction: 'rtl'}}>
      {/* هنا استبدلنا المكونات المعطلة بأكواد بسيطة مباشرة عشان الموقع يشتغل فوراً */}
      <header style={{padding: '20px', background: '#333', color: '#fff', textAlign: 'center'}}>
        <h1>{siteContent.brandName || "المجد جروب"}</h1>
      </header>

      <section style={{padding: '50px', textAlign: 'center', background: '#f4f4f4'}}>
        <h2>{siteContent.heroTitle || "أهلاً بكم"}</h2>
        <p>{siteContent.heroSubtitle}</p>
        {siteContent.heroImage && <img src={siteContent.heroImage} alt="Hero" style={{maxWidth: '100%', borderRadius: '10px'}} />}
      </section>

      <section style={{padding: '20px'}}>
        <h3 style={{textAlign: 'center'}}>الوظائف المتاحة</h3>
        <div style={{display: 'grid', gap: '10px'}}>
          {data.map((item, index) => (
            <div key={index} style={{border: '1px solid #ddd', padding: '15px', borderRadius: '5px'}}>
              <h4>{item.jobTitle}</h4>
              <p>{item.category}</p>
            </div>
          ))}
        </div>
      </section>

      <footer style={{padding: '20px', textAlign: 'center', background: '#333', color: '#fff'}}>
        <p>للتواصل: {siteContent.contactPhone}</p>
      </footer>
    </div>
  );
}

export default App;
