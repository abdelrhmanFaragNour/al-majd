import { useState, useEffect } from "react";

// ══════════════════════════════════════════════════
// الإعدادات والبيانات الأساسية
// ══════════════════════════════════════════════════
const LOGO_SRC = "data:image/webp;base64,UklGRjoaAABXRUJQVlA4IC4aAACwWgCdASrIAMgAPlEkjkUjoiEUum14OAUEpu9H/08NH5P1/3LjiK2p77TyZ9gfVHmV9A/nv20/6H1L+YpzqPMH+xP7Qe79/qP3A91X9T9QD+o/5/rTfQc/aj03/3d+Gv+4f9X9xvbW1Z2ULxq/J+EP4/8+/kPy/9eLJX14/2/oP/Kfu7+p/vP7q+0Hgv8i9RH8q/pX+r/Mf0U9xLbH0CO/v+3/wHjp/1XpF9hP+h7gX6u/637gPam8NHzr2Af6D/Xf91943x3f9v+T/0PqD+j//B/m/gP/nf9h/5X+A9rb//+3b9tP//7qv7Hf/Y4/nqspyO8h+GSR7/ETpLdmcl+c43Q8yB88LzQ4PiUlRNxaVMlIkLo7wQb0RmGmgF5RdbZ8N4H1/2F5PD9O4qquy+1/ToqIyg8iN11x0qLO0AYgDgxq0U6oBHqn9+NMagwuHAzurldVNfG+JjoWagyIOiPlcsDItXN6dDlHlvVrih4jBjVTf1QdbT7DjHZ7+FtAvZ2NDQAuJYO65dyr0enToKuAKDR0YVljCxpzumMTSZR552PVpXbGP2bbY75x64bsGSHdo/PaleCGqWfZJgpqe4wLL3asUDRmXh52JICkghYfxg9iczcihhP1Drn/bhNF0jeZAe++STpAMG7APqs/Zv2gZZ/9wHDfLxIocgU+eb+NkjfIJfXtlvMio9/A43lna5d7NtST4nQ2mXVY0PlPtvxB8txm6gpnhQN9R8wmoY/AU/25rm/xAfyWLZ7E3FH4mxi4Uflw2a+D1OSSPnSiijnPR5H1QoeZKVrOchokcj0phfudf5hoIfM2+4NEJfY0+f74TJSt1l/lnPZBNeTx3vk4k7esDfo5cxBoLB4PA8VbC3EfzonfBWDlfKptY1O3FL7RAVOacU3R5YUb2+h7qYm61e1nylS8oLzhuU2BL4+TxsPdXV0mPA+U5JU0h3kPwySbkLyX56rKcjvIfhkkQAD+/gbQAAw9v6MGQchhd4O9cAx1hwPql17Ef/EsVVnBPWzm4FKwHECj/oZ+OeWX85asrengcWerw3j4gFp9wM+Z9hb7HdsOnt5aemCEFxAK7wfhqzGUXh5pp4185nXos/5/oIgoGpJngAsm77Mq9e3LdHYSXiwUxUE8ZQt3b7rgfOllic97Fl96t42o6XLIRW/DOqbpBjSIhbsEds6iQVLnjXhd5KiqM8nsZqTSwWvCGA69vd9xvAGsuEgoCLqLklxVmQWH9emcgzwLoj83KNfo6T4jg/LIOjj1UX5kZKHrTPnz+HWGDHgQABTnloAH17IqLZBwC650XNNCl3Q3SU/KUHOwoXdVJBbyl0MiGBFUT3hmjwVjVruiZCcYvMH3x97Jaoe8A9J0G6O30CHGrZCZljRPNMWQQoqcYB7Q50bU4mdtPVcbkbZuWgpZiowl9P8ev6dPLz8vStKsynCwnLswxEhGCJsKsE7QT1kcV2Po5Up0ocA3nVqXiUlMEf87vNLBJtVAbzGgHzN7vpmMdLrHUPVjR7H4A5cU36VvXfjJsreAziqZlZf1ZUMZcyQH6D/vj+FSLi3ncJe1PM02CGgcrXNN0g8J1dmTL/NsOsU2lRe4wkf9oZ448gVfco0eATAIlRGkg4IA==";
const SHEET_ID = "1nwJh2Cz-KP--SvvQmeipHate8GMfdreM";
const APPLY_LINK = "https://forms.gle/AdC1x8tzz5HSJzJz5";

// دالة جلب البيانات من Google Sheets
async function fetchSheetData(sheetName) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`;
  const res = await fetch(url);
  const text = await res.text();
  const jsonStr = text.substring(text.indexOf("(") + 1, text.lastIndexOf(")"));
  const json = JSON.parse(jsonStr);
  return json.table;
}

// ── المكونات (Components) ──

function JobCard({ job }) {
  return (
    <div style={{background:"rgba(255,255,255,0.04)", border:"1px solid rgba(212,175,55,0.2)", borderRadius:16, padding:20, position:"relative", transition:"0.3s"}} className="card">
      {job.urgent && <span style={{position:"absolute", top:15, left:15, background:"#d4af37", color:"#000", fontSize:10, fontWeight:800, padding:"3px 8px", borderRadius:10}}>عاجل</span>}
      <h3 style={{color:"#f0d060", margin:"0 0 10px", fontSize:"1.1rem"}}>{job.title}</h3>
      <p style={{color:"#a0a8c0", fontSize:13, marginBottom:15}}>📍 {job.city}</p>
      <div style={{display:"flex", gap:15, fontSize:12, color:"#cbd5e0", marginBottom:20}}>
        <span>💰 {job.salary}</span>
        <span>⏱ {job.exp}</span>
      </div>
      <a href={APPLY_LINK} target="_blank" rel="noreferrer" style={{display:"block", textAlign:"center", background:"#d4af37", color:"#000", textDecoration:"none", padding:12, borderRadius:12, fontWeight:700}}>تقدم الآن</a>
      <style>{`.card:hover { transform:translateY(-5px); border-color:#d4af37; box-shadow:0 10px 30px rgba(212,175,55,0.15) }`}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════
// التطبيق الرئيسي (Main App)
// ══════════════════════════════════════════════════
export default function App() {
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState({ visa: [], transfer: [] });
  const [cities, setCities] = useState([]);
  const [tab, setTab] = useState("visa");
  const [search, setSearch] = useState("");
  const [cityFilter, setCityFilter] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [vjTable, tjTable] = await Promise.all([
          fetchSheetData("visa"),
          fetchSheetData("transfer")
        ]);

        const mapJobs = (table) => table.rows.map(r => ({
          title: r.c[0]?.v, city: r.c[1]?.v, salary: r.c[2]?.v, exp: r.c[3]?.v,
          urgent: r.c[4]?.v === "نعم", show: r.c[6]?.v !== "لا"
        })).filter(j => j.show);

        const vJobs = mapJobs(vjTable);
        const tJobs = mapJobs(tjTable);

        setJobs({ visa: vJobs, transfer: tJobs });
        setCities([...new Set([...vJobs, ...tJobs].map(j => j.city))]);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filtered = (tab === "visa" ? jobs.visa : jobs.transfer).filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) &&
    (cityFilter === "" || j.city === cityFilter)
  );

  return (
    <div style={{minHeight:"100vh", background:"#0a0a0c", color:"#fff", direction:"rtl", padding:20, fontFamily:"sans-serif"}}>
      
      {/* Header */}
      <header style={{textAlign:"center", padding:"40px 0"}}>
        <img src={LOGO_SRC} alt="Logo" style={{height:80, marginBottom:20}} />
        <h1 style={{color:"#d4af37", margin:0}}>المجد جروب للتوظيف الطبي</h1>
        <p style={{color:"#666"}}>بوابتك للعمل في كبرى المستشفيات السعودية</p>
      </header>

      {/* Tabs */}
      <div style={{display:"flex", justifyContent:"center", gap:15, marginBottom:30}}>
        {[{id:"visa",n:"تأشيرات"},{id:"transfer",n:"نقل كفالة"}].map(t => (
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"12px 35px", borderRadius:30, border:"none", cursor:"pointer", fontWeight:700, background:tab===t.id?"#d4af37":"#1a1a1c", color:tab===t.id?"#000":"#888"}}>
            {t.n}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{maxWidth:800, margin:"0 auto 40px", display:"flex", gap:10, flexWrap:"wrap"}}>
        <input type="text" placeholder="ابحث عن وظيفة..." onChange={(e)=>setSearch(e.target.value)} style={{flex:2, padding:15, borderRadius:15, border:"1px solid #333", background:"#111", color:"#fff"}} />
        <select onChange={(e)=>setCityFilter(e.target.value)} style={{flex:1, padding:15, borderRadius:15, border:"1px solid #333", background:"#111", color:"#fff"}}>
          <option value="">كل المدن</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Job Grid */}
      {loading ? <p style={{textAlign:"center", color:"#d4af37"}}>جاري التحميل...</p> : (
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(280px, 1fr))", gap:25, maxWidth:1200, margin:"0 auto"}}>
          {filtered.length > 0 ? filtered.map((j, i) => <JobCard key={i} job={j} />) : <p style={{gridColumn:"1/-1", textAlign:"center", color:"#444"}}>لا توجد نتائج بحث.</p>}
        </div>
      )}

      <footer style={{textAlign:"center", marginTop:80, color:"#333", fontSize:12}}>© 2026 Al-Majd Medical Group</footer>
    </div>
  );
}
    sort((a,b) => b.date - a.date);
}

function parseCities(table) {
  if (!table?.rows) return DEFAULT_CITIES;
  return table.rows.map(r => r.c?.[0]?.v).filter(Boolean);
}

const dateFmt = d => {
  try {
    const diff = Math.floor((new Date() - new Date(d)) / 86400000);
    return diff === 0 ? "اليوم" : diff === 1 ? "أمس" : `منذ ${diff} أيام`;
  } catch { return ""; }
};

// ── Components ─────────────────────────────────────

function Spinner() {
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:12,padding:"3rem",color:"#d4af37"}}>
      <div style={{width:32,height:32,borderRadius:"50%",border:"3px solid rgba(212,175,55,.2)",
        borderTopColor:"#d4af37",animation:"spin 1s linear infinite"}}/>
      <span style={{fontSize:14}}>جارٍ تحميل البيانات...</span>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function JobCard({ job, googleForm, applyBtnText }) {
  return (
    <div style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(212,175,55,.2)",
      borderRadius:16,padding:"1.4rem",transition:"all .3s",position:"relative",overflow:"hidden"}} className="jc">
      {job.urgent && <span style={{position:"absolute",top:14,left:14,
        background:"linear-gradient(135deg,#d4af37,#f0d060)",color:"#0a0a14",
        fontSize:11,fontWeight:700,padding:"3px 10px",borderRadius:20}}>عاجل</span>}
      <h3 style={{color:"#f0d060",fontSize:"1.05rem",fontWeight:700,margin:"0 0 4px"}}>{job.title}</h3>
      <div style={{color:"#a0a8c0",fontSize:13,marginBottom:12}}>📍 {job.city}</div>
      <div style={{display:"flex",gap:14,marginBottom:16,flexWrap:"wrap"}}>
        <span style={{fontSize:12.5,color:"#c8d0e8"}}>💰 {job.salary}</span>
        <span style={{fontSize:12.5,color:"#c8d0e8"}}>⏱ {job.exp}</span>
        <span style={{fontSize:12.5,color:"#888"}}>📅 {dateFmt(job.date)}</span>
      </div>
      <a href={googleForm} target="_blank" rel="noopener noreferrer"
        style={{display:"block",textAlign:"center",background:"linear-gradient(135deg,#d4af37,#f0d060)",
          color:"#0a0a14",borderRadius:10,padding:"10px 0",fontWeight:700,fontSize:13.5,textDecoration:"none"}}>
        {applyBtnText} ✦
      </a>
      <style>{`.jc:hover{border-color:rgba(212,175,55,.5)!important;background:rgba(212,175,55,.06)!important;transform:translateY(-2px);box-shadow:0 8px 32px rgba(212,175,55,.1)}`}</style>
    </div>
  );
}

function FloatingWA({ cfg }) {
  const [open, setOpen] = useState(false);
  const lnk = {background:"#fff",color:"#0a0a14",border:"1px solid rgba(212,175,55,.35)",borderRadius:40,
    padding:"11px 18px",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",gap:10,
    textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,.35)",whiteSpace:"nowrap"};
  return (
    <div style={{position:"fixed",bottom:28,left:28,zIndex:999,direction:"rtl"}}>
      {open && (
        <div style={{marginBottom:14,display:"flex",flexDirection:"column",gap:10,animation:"fadeUp .25s ease"}}>
          <a href={`https://wa.me/${cfg.waEgypt}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن التأشيرات")}`}
            target="_blank" rel="noopener noreferrer" style={lnk}>
            <span style={{fontSize:24}}>🇪🇬</span>
            <div>
              <div style={{fontSize:13,fontWeight:900}}>مصر — التأشيرات</div>
              <div style={{fontSize:11,color:"#555",direction:"ltr"}}>{cfg.waEgyptNum}</div>
            </div>
          </a>
          <a href={`https://wa.me/${cfg.waSaudi}?text=${encodeURIComponent("مرحباً، أريد الاستفسار عن نقل الكفالة")}`}
            target="_blank" rel="noopener noreferrer" style={lnk}>
            <span style={{fontSize:24}}>🇸🇦</span>
            <div>
              <div style={{fontSize:13,fontWeight:900}}>السعودية — نقل الكفالة</div>
              <div style={{fontSize:11,color:"#555",direction:"ltr"}}>{cfg.waSaudiNum}</div>
            </div>
          </a>
        </div>
      )}
      <button onClick={()=>setOpen(o=>!o)} style={{width:60,height:60,borderRadius:"50%",
        background:"linear-gradient(135deg,#25d366,#128c7e)",border:"none",cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:open?20:28,color:"#fff",
        boxShadow:"0 4px 24px rgba(37,211,102,.55)",transition:"all .25s",transform:open?"rotate(135deg)":"scale(1)"}}>
        {open?"✕":"💬"}
      </button>
      <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

// ══════════════════════════════════════════════════
// الصفحة الرئيسية
// ══════════════════════════════════════════════════
export default function App() {
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState(null);
  const [cfg,     setCfg]       = useState(DEFAULT_CONFIG);
  const [visaJobs,  setVisaJobs]  = useState(DEFAULT_VISA_JOBS);
  const [transJobs, setTransJobs] = useState(DEFAULT_TRANS_JOBS);
  const [cities,  setCities]    = useState(DEFAULT_CITIES);

  const [tab,    setTab]    = useState("visa");
  const [titleF, setTitleF] = useState("");
  const [cityF,  setCityF]  = useState("");
  const [count,  setCount]  = useState(9);
  const [vis,    setVis]    = useState(false);

  useEffect(() => { setTimeout(()=>setVis(true),80); }, []);

  // ── جلب البيانات من Google Sheets ──
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [stTable, vjTable, tjTable] = await Promise.all([
          fetchSheet("settings"),
          fetchSheet("visa"),
          fetchSheet("transfer"),
        ]);
        setCfg(parseSettings(stTable));
        const vj = parseJobs(vjTable);
        const tj = parseJobs(tjTable);
        if (vj.length > 0) setVisaJobs(vj);
        if (tj.length > 0) setTransJobs(tj);

        // استخراج المدن من الوظائف
        const allCities = [...new Set([...vj,...tj].map(j=>j.city).filter(Boolean))];
        if (allCities.length > 0) setCities(allCities);
      } catch(e) {
        console.warn("Sheet fetch failed, using defaults:", e);
        setError("تعذّر الاتصال بالشيت — يتم عرض البيانات الافتراضية");
      } finally {
        se
