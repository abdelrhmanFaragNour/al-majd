import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Jobs from "./components/Jobs";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import "./App.css";

// استخدم الـ Spreadsheet ID الأصلي (غيّره لو الشيت اللي بتعدل فيه مختلف)
const SPREADSHEET_ID = "1ooZmCk2uvkHqJDkWeYMcop9qzq9rVDkDenW8";
const SETTINGS_GID = "1276002029"; // gid الـ settings tab من الرابط

const SETTINGS_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/export?format=csv&gid=${SETTINGS_GID}`;

function App() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // اختياري: عشان تعرض رسالة خطأ لو حصل

  useEffect(() => {
    const fetchData = async () => {
      try {
        // cache buster قوي (timestamp + random) عشان نتجنب الكاش تمامًا
        const cacheBuster = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
        const urlWithCache = `${SETTINGS_URL}?cache=${cacheBuster}`;

        const response = await fetch(urlWithCache, {
          cache: "no-store", // إضافي: يطلب من المتصفح ما يستخدمش كاش أبدًا
        });

        if (!response.ok) {
          throw new Error(`خطأ في جلب الشيت: ${response.status} - ${response.statusText}`);
        }

        const csvText = await response.text();

        Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const config = {};
            results.data.forEach(row => {
              if (row[0] && row[1]) {
                // تنظيف المفتاح من مسافات زيادة أو رموز غريبة
                const key = row[0].trim().replace(/\s+/g, "").replace(/[^a-zA-Z0-9]/g, "");
                const value = row[1].trim();
                config[key] = value;
              }
            });
            console.log("البيانات اللي جات من الشيت:", config); // افتح console تشوف إيه اللي وصل
            setSettings(config);
            setLoading(false);
          },
          error: (parseError) => {
            console.error("خطأ في تحليل CSV:", parseError);
            setError("مشكلة في قراءة البيانات من الشيت");
            setLoading(false);
          },
        });
      } catch (err) {
        console.error("Sheet Fetch Error:", err);
        setError(err.message || "خطأ في الاتصال بالشيت");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "100px" }}>جاري مزامنة المجد جروب...</div>;
  }

  if (error) {
    return <div style={{ textAlign: "center", marginTop: "100px", color: "red" }}>خطأ: {error}</div>;
  }

  // fallback للوجو لو ما جاش من الشيت
  const myLogo =
    settings.logoSrc ||
    settings.logoUrl ||
    settings.logourl || // لو الكي اتغير شوية
    "https://i.postimg.cc/RFYB8gjL/1000273592_cd331d30c881c099ee519b011cb86f56_3_3_2026_5_26_08_PM.png";

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
          phone={settings.waEgyptNum || settings.waEgypt}
          email={settings.email}
          location={settings.location}
        />
      </main>

      <Footer brandName={settings.siteName || "المجد جروب"} />
    </div>
  );
}

export default App;
