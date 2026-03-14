// استبدل محتوى ملف App.jsx بهذا الكود المطور
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
// ... (باقي الاستيرادات الخاصة بك ستعمل تلقائياً)

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS--X_f_k-M3eA8D98D-D988D8ACD9881/pub?output=csv";

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // إضافة التوقيت لضمان جلب أحدث تعديل من الشيت فوراً
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

  if (loading) return <div className="loading">جاري المزامنة...</div>;

  const siteContent = data[0] || {};

  // هنا السحر: الكود سيتحقق أولاً من وجود رابط في الشيت، وإذا لم يجد سيستخدم اللوجو القديم
  const currentLogo = siteContent.logoUrl || siteContent.logo || "data:image/webp;base64,..."; // ضع هنا الكود المشفر القديم لو أردت

  return (
    <div className="App">
      {/* تأكد أنك تمرر currentLogo للمكون المسؤول عن الهيدر */}
      <header>
        <img src={currentLogo} alt="Logo" style={{ width: '150px' }} />
        <h1>{siteContent.brandName}</h1>
      </header>
      
      {/* باقي الأقسام الخاصة بك تظل كما هي */}
      {/* <Hero ... /> */}
      {/* <Jobs data={data} /> */}
    </div>
  );
}

export default App;
