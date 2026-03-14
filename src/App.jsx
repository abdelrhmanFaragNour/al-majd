import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Jobs from "./components/Jobs";
import "./App.css";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS--X_f_k-M3eA8D98D-D988D8ACD9881/pub?output=csv";

function App() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${SHEET_URL}&t=${new Date().getTime()}`);
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: false,
          skipEmptyLines: true,
          complete: (results) => {
            const config = {};
            results.data.forEach(row => {
              if (row[0] && row[1]) config[row[0].trim()] = row[1].trim();
            });
            setSettings(config);
            setLoading(false);
          },
        });
      } catch (error) { setLoading(false); }
    };
    fetchData();
  }, []);

  // هنا السحر: حطينا رابط صورتك مباشرة كقيمة أساسية
  const myLogo = "https://i.postimg.cc/RFYB8gjL/1000273592_cd331d30c881c099ee519b011cb86f56_3_3_2026_5_26_08_PM.png";

  return (
    <div className="App">
      <Navbar logo={myLogo} brandName={settings.siteName || "المجد جروب"} />
      <main>
        <Hero title={settings.heroTitle} subtitle={settings.heroDesc} image={settings.heroImage} />
        <Jobs data={settings} />
      </main>
    </div>
  );
}

export default App;
