import React from 'react';
// 1. استيراد الصور والأيقونات من جهازك (تأكد من وجود الملفات في مجلد src/assets)
import bannerImage from './assets/banner.jpg'; 
import animatedIcon from './assets/icon.gif'; // لو أيقونة متحركة GIF
import logo from './assets/logo.png';

function App() {
  return (
    <div className="min-h-screen bg-[#06060a] text-white font-sans">
      
      {/* قسم الهيدر / اللوجو والأيقونة */}
      <nav className="p-4 flex justify-between items-center border-b border-gray-800">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
          <span className="text-xl font-bold">المجد جروب</span>
        </div>
        
        {/* أيقونة متحركة في الهيدر */}
        <div className="w-12 h-12">
          <img src={animatedIcon} alt="Animated Icon" className="w-full h-full object-contain" />
        </div>
      </nav>

      {/* قسم البنر (Banner Section) */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <img 
          src={bannerImage} 
          alt="Main Banner" 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center p-6">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">أهلاً بكم في المجد جروب</h1>
          <p className="text-lg md:text-xl text-gray-200">حلول التوظيف الطبي المتكاملة</p>
        </div>
      </section>

      {/* باقي محتوى الموقع */}
      <main className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* كارت مثال لاستخدام أيقونة متحركة صغيرة */}
          <div className="bg-[#111116] p-6 rounded-2xl border border-gray-800 hover:border-blue-500 transition-all text-center">
            <img src={animatedIcon} alt="Service Icon" className="w-16 h-16 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">خدماتنا</h3>
            <p className="text-gray-400">نقدم أفضل الكوادر الطبية للسوق السعودي.</p>
          </div>
        </div>
      </main>

    </div>
  );
}

export default App;
