import React, { useState, useCallback } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Search, Rocket, Loader2, Globe, AlertCircle, RefreshCcw, Info, QrCode, ShieldCheck,
  BarChart3, PieChart as PieChartIcon, TrendingUp, Users, MessageSquare
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ReportGraphics } from './src/components/ReportGraphics';
import { ConsultationForm } from './src/components/ConsultationForm';

interface AnalysisResult {
  content: string;
  location: string;
  product: string;
  timestamp: string;
  lang: 'bn' | 'en';
  demographics?: {
    population: number;
    businessPotential: number;
  };
  socialMedia?: {
    facebook: number;
    instagram: number;
    tiktok: number;
    youtube: number;
  };
}

interface TabType {
  id: 'analysis' | 'graphics' | 'consultation';
  label: string;
  icon: React.ReactNode;
}

const App: React.FC = () => {
  const [location, setLocation] = useState('Dhanmondi');
  const [product, setProduct] = useState('clothing boutique');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisResult | null>(null);
  const [language, setLanguage] = useState<'bn' | 'en'>('bn');
  const [activeTab, setActiveTab] = useState<'analysis' | 'graphics' | 'consultation'>('analysis');

  // Multi-source API Key Detection
  const getApiKey = () => {
    const key = (import.meta.env as any).VITE_GEMINI_API_KEY || 
                (window as any).__VITE_GEMINI_API_KEY__ ||
                '';
    return key?.trim() || "";
  };

  const API_KEY = getApiKey();

  const translations = {
    bn: {
      locationLabel: "আপনার এলাকা (যেমন: ধানমন্ডি)",
      productLabel: "পণ্যের নাম (যেমন: কফি শপ)",
      button: "ফ্রি মার্কেট এনালাইসিস দেখুন",
      loadingText: "এআই ডাটা বিশ্লেষণ করছে...",
      heroTitle: "সফল ব্যবসার শুরু হোক সঠিক তথ্য দিয়ে",
      heroDesc: "বাংলাদেশের প্রতিটি এলাকার জন্য হাইপার-লোকাল এআই মার্কেট ইন্টেলিজেন্স। আপনার এলাকা এবং ব্যবসার নাম লিখে শুরু করুন।",
      errorTitle: "তথ্য সংগ্রহে সমস্যা হয়েছে",
      retryButton: "আবার চেষ্টা করুন",
      tabAnalysis: "বিস্তারিত বিশ্লেষণ",
      tabGraphics: "গ্রাফিক্যাল রিপোর্ট",
      tabConsultation: "পরামর্শ সেবা",
    },
    en: {
      locationLabel: "Your Area (e.g., Dhanmondi)",
      productLabel: "Product Name (e.g., Coffee Shop)",
      button: "Get Free Market Analysis",
      loadingText: "AI is analyzing...",
      heroTitle: "Success Starts with Data",
      heroDesc: "Hyper-local AI market intelligence for every area in Bangladesh. Enter your area and business type.",
      errorTitle: "Something went wrong",
      retryButton: "Try Again",
      tabAnalysis: "Detailed Analysis",
      tabGraphics: "Graphical Report",
      tabConsultation: "Consultation Services",
    }
  };

  const t = translations[language];

  // Mock demographic data (এটি আপনার API থেকে আসবে)
  const generateDemographicData = (location: string) => {
    const areaData: Record<string, any> = {
      'Dhanmondi': {
        population: 450000,
        businessPotential: 85,
        socialMedia: { facebook: 35, instagram: 30, tiktok: 20, youtube: 15 },
        businesses: ['Coffee Shop', 'Boutique', 'Yoga Studio', 'Coworking Space']
      },
      'Gulshan': {
        population: 380000,
        businessPotential: 90,
        socialMedia: { facebook: 30, instagram: 35, tiktok: 25, youtube: 10 },
        businesses: ['Restaurant', 'Gym', 'Salon', 'Event Management']
      },
      'Mirpur': {
        population: 650000,
        businessPotential: 75,
        socialMedia: { facebook: 40, instagram: 25, tiktok: 20, youtube: 15 },
        businesses: ['Electronics Shop', 'Grocery Store', 'Mobile Repair', 'Tailoring']
      },
    };
    
    return areaData[location] || {
      population: 500000,
      businessPotential: 80,
      socialMedia: { facebook: 35, instagram: 30, tiktok: 20, youtube: 15 },
      businesses: ['General Business 1', 'General Business 2', 'General Business 3']
    };
  };

  const generateReport = useCallback(async () => {
    if (!location || !product) return;
    
    if (!API_KEY || API_KEY.length < 10) {
      setError(language === 'bn' 
        ? "সিস্টেম এপিআই কি খুঁজে পাচ্ছে না। আপনার গিটহাব সিক্রেটে VITE_GEMINI_API_KEY সেট করা আছে কি না নিশ্চিত করুন।" 
        : "Critical: API Key not found or too short. Check GitHub Secrets.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: API_KEY });
      const demographicData = generateDemographicData(location);
      
      const prompt = `Act as TargetLocal.ai. Analyze the market for "${product}" in "${location}", Bangladesh with population ~${demographicData.population}.
      
      Provide detailed analysis:
      1. Target Audience Analysis (Age, Gender, Income)
      2. Competition Analysis (5-7 competitors)
      3. Marketing Strategy (Multi-channel approach)
      4. Pricing Strategy
      5. Growth Potential & Timeline
      
      Language: ${language === 'bn' ? 'Bangla' : 'English'}. 
      Use Markdown formatting with proper headers and bullet points.`;

      const response = await ai.models.generateContent({
        model: 'gemini-1.5-flash',
        contents: prompt,
      });

      if (!response.text) throw new Error("Empty AI Response");

      const demographics = generateDemographicData(location);

      setReport({
        content: response.text,
        location,
        product,
        timestamp: new Date().toLocaleTimeString('bn-BD'),
        lang: language,
        demographics: {
          population: demographics.population,
          businessPotential: demographics.businessPotential,
        },
        socialMedia: demographics.socialMedia,
      });
      
      setActiveTab('graphics');
    } catch (err: any) {
      console.error(err);
      let msg = err.message || "Unknown Error";
      if (msg.includes("API key not valid")) {
        msg = language === 'bn' ? "আপনার এপিআই কি-টি সঠিক নয়। দয়া করে নতুন একটি কি তৈরি করে গিটহাবে আপডেট করুন।" : "Invalid API Key. Please update it in GitHub Secrets.";
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [location, product, language, API_KEY]);

  const tabs: TabType[] = [
    { id: 'analysis', label: t.tabAnalysis, icon: <Search size={16} /> },
    { id: 'graphics', label: t.tabGraphics, icon: <BarChart3 size={16} /> },
    { id: 'consultation', label: t.tabConsultation, icon: <MessageSquare size={16} /> },
  ];

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex flex-col md:flex-row font-['Hind_Siliguri']">
      {/* Sidebar */}
      <aside className="w-full md:w-80 bg-white border-r p-6 flex flex-col gap-8 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500 p-2 rounded-lg text-white">
            <Rocket size={20} />
          </div>
          <h1 className="text-xl font-bold text-slate-800">targetlocal<span className="text-emerald-500">.ai</span></h1>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">{t.locationLabel}</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 ring-emerald-400 transition-all" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">{t.productLabel}</label>
            <input 
              className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 ring-emerald-400 transition-all" 
              value={product} 
              onChange={(e) => setProduct(e.target.value)} 
            />
          </div>
          <button 
            onClick={generateReport} 
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-xl shadow-slate-200"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
            {loading ? t.loadingText : t.button}
          </button>
        </div>

        <div className="mt-auto pt-6 border-t flex flex-col gap-4">
           <button onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')} className="text-[10px] font-black text-slate-500 flex items-center gap-2 hover:text-emerald-500 uppercase tracking-widest transition-colors">
             <Globe size={14} /> {language === 'bn' ? 'English Version' : 'বাংলা সংস্করণ'}
           </button>
           <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Verified AI Engine</span>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 overflow-y-auto">
        {error && (
          <div className="max-w-xl mx-auto p-10 bg-white border border-rose-100 rounded-[2rem] shadow-2xl shadow-rose-100 text-center space-y-5 animate-in">
            <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="text-rose-500" size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">{t.errorTitle}</h2>
            <div className="text-xs text-rose-600 bg-rose-50/50 p-4 rounded-xl font-mono break-all border border-rose-100">
              {error}
            </div>
            <button onClick={generateReport} className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 mx-auto hover:bg-rose-600 transition-all shadow-lg shadow-rose-200"><RefreshCcw size={16} /> {t.retryButton}</button>
          </div>
        )}

        {!report && !loading && !error && (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto space-y-8 animate-in">
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-tight">{t.heroTitle}</h2>
              <p className="text-slate-500 text-lg font-medium">{t.heroDesc}</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="h-full flex flex-col items-center justify-center space-y-6 animate-pulse">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-center">
              <p className="font-bold text-slate-800 text-xl tracking-tight">{t.loadingText}</p>
              <p className="text-slate-400 text-sm mt-1">আমাদের এআই হাইপার-লোকাল ডাটা প্রসেস করছে...</p>
            </div>
          </div>
        )}

        {report && !loading && (
          <div className="max-w-6xl mx-auto space-y-8 animate-in">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-200 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 font-bold text-sm flex items-center gap-2 whitespace-nowrap transition-all border-b-2 ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="space-y-8">
              {activeTab === 'analysis' && (
                <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl shadow-slate-200 border border-slate-100 space-y-10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Rocket size={120} />
                  </div>
                  
                  <div className="flex items-center gap-3 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest w-fit">
                    <Info size={14} /> Market Analysis: {report.location}
                  </div>

                  <div className="prose prose-slate max-w-none prose-h1:text-3xl prose-h2:text-2xl prose-h2:font-black prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
                    <ReactMarkdown>{report.content}</ReactMarkdown>
                  </div>

                  <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-slate-50 rounded-2xl text-slate-400 border border-slate-100"><QrCode size={32} /></div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Report ID</p>
                        <p className="text-xs font-bold text-slate-800 tracking-tighter uppercase">{Math.random().toString(36).substring(7)} / {report.timestamp}</p>
                      </div>
                    </div>
                    <button onClick={() => window.print()} className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-slate-900 transition-all shadow-xl shadow-emerald-100">
                      PDF ডাউনলোড করুন
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'graphics' && report.demographics && report.socialMedia && (
                <ReportGraphics 
                  data={{
                    areaName: report.location,
                    population: report.demographics.population,
                    businessPotential: report.demographics.businessPotential,
                    recommendedBusinesses: ['E-commerce Store', 'Digital Marketing Agency', 'Online Coaching'],
                    socialMediaStats: report.socialMedia,
                    marketTrends: [
                      { month: 'Jan', growth: 15 },
                      { month: 'Feb', growth: 22 },
                      { month: 'Mar', growth: 28 },
                      { month: 'Apr', growth: 35 },
                      { month: 'May', growth: 42 },
                      { month: 'Jun', growth: 38 },
                    ]
                  }}
                />
              )}

              {activeTab === 'consultation' && (
                <ConsultationForm />
              )}
            </div>

            <button onClick={() => { setReport(null); setError(null); setActiveTab('analysis'); }} className="w-full py-4 text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] hover:text-emerald-500 transition-all">← নতুন মার্কেট রিসার্চ শুরু করুন</button>
          </div>
        )}
      </main>

      <style>{`
        @keyframes fade-in { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @media print { aside { display: none !important; } }
      `}</style>
    </div>
  );
};

export default App;
