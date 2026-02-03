
import React, { useState, useEffect, useRef } from 'react';
import { ReportData } from './types';
import ReportForm from './components/ReportForm';
import PDFTemplate from './components/PDFTemplate';
import ReportHistory, { HistoryItem } from './components/ReportHistory';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'kokurikulum_reports_history';
const GPK_KOKU_PHONE = '60132576050';

export type ReportLength = 'pendek' | 'sederhana' | 'panjang';

const App: React.FC = () => {
  const [data, setData] = useState<ReportData>({
    unitName: '',
    program: '',
    anjuran: '',
    tarikh: '',
    masa: '12.45 tengah hari sehingga 2.45 petang',
    hadir: '',
    tidakHadir: '',
    guruPenasihat: '',
    laporan: '',
    namaPenyedia: '',
    jawatanPenyedia: '',
    images: [],
  });

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [reportLength, setReportLength] = useState<ReportLength>('sederhana');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  
  const pdfPrintRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const handleSaveDraft = () => {
    if (!data.program && !data.unitName) {
      alert('Sila berikan maklumat program atau unit sebelum menyimpan.');
      return;
    }
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      data: { ...data }
    };
    
    const updatedHistory = [newItem, ...history];
    setHistory(updatedHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    alert('Draf laporan berjaya disimpan!');
  };

  const handleLoadFromHistory = (item: HistoryItem) => {
    if (window.confirm('Muat draf ini? Data semasa yang tidak disimpan akan hilang.')) {
      setData(item.data);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleDeleteHistory = (id: string) => {
    if (window.confirm('Padam draf ini secara kekal?')) {
      const updatedHistory = history.filter(item => item.id !== id);
      setHistory(updatedHistory);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
    }
  };

  const handleNewReport = () => {
    if (window.confirm('Mula laporan baru?')) {
      setData({
        unitName: '',
        program: '',
        anjuran: '',
        tarikh: '',
        masa: '12.45 tengah hari sehingga 2.45 petang',
        hadir: '',
        tidakHadir: '',
        guruPenasihat: '',
        laporan: '',
        namaPenyedia: '',
        jawatanPenyedia: '',
        images: [],
      });
    }
  };

  const handleAIAssist = async () => {
    if (!data.program && !data.unitName) {
      alert('Sila masukkan maklumat Unit atau Program dahulu.');
      return;
    }

    setIsAILoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Tuliskan laporan aktiviti kokurikulum sekolah dalam Bahasa Melayu yang sangat formal and profesional. 
Butiran: Unit: ${data.unitName}, Program: ${data.program}, Anjuran: ${data.anjuran}, Tarikh: ${data.tarikh}. 
Kehendak: Saiz ${reportLength}, format naratif perenggan, jangan letak header, terus kepada isi laporan. Pastikan padat untuk dimuatkan dalam 1 muka surat A4 sahaja.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        setData(prev => ({ ...prev, laporan: text.trim() }));
      }
    } catch (error) {
      console.error("AI Error:", error);
      alert('Gagal menjana laporan AI. Sila semak sambungan internet anda.');
    } finally {
      setIsAILoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!pdfPrintRef.current) return;
    if (!data.program || !data.namaPenyedia) {
      alert('Sila lengkapkan nama program dan nama penyedia sebelum muat turun PDF.');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const images = pdfPrintRef.current.getElementsByTagName('img');
      const imagePromises = (Array.from(images) as HTMLImageElement[]).map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
        });
      });
      await Promise.all(imagePromises);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const element = pdfPrintRef.current;
      const opt = {
        margin: [5, 5, 5, 5],
        filename: `LAPORAN_KOKU_${(data.unitName || data.program).toUpperCase().replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg', quality: 1.0 },
        html2canvas: { 
          scale: 4, 
          useCORS: true, 
          letterRendering: true,
          logging: false,
          scrollY: 0,
          scrollX: 0,
          width: 794, 
          windowWidth: 794 
        },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
        pagebreak: { mode: 'avoid' }
      };

      // @ts-ignore
      await window.html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert('Ralat semasa menjana PDF. Sila pastikan anda menggunakan pelayar Chrome atau Edge.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `*LAPORAN KOKURIKULUM SK KRANGAN 2026*\n\n*Unit:* ${data.unitName || '-'}\n*Program:* ${data.program || '-'}\n*Tarikh:* ${data.tarikh || '-'}\n\nLaporan telah siap dijana. Sila semak fail PDF yang dilampirkan.`;
    const url = `https://wa.me/${GPK_KOKU_PHONE}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-900 pb-20 print:hidden">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-[#004488] p-2 rounded-xl text-white shadow-md">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-800 tracking-tight">E-LAPORAN KOKU</h1>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">SK KRANGAN 2026</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleNewReport}
              className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-lg transition-all border border-slate-200 uppercase"
            >
              Baru
            </button>
            <button 
              onClick={handleSaveDraft}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all shadow-sm uppercase"
            >
              Simpan Draf
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-10 w-2 bg-[#004488] rounded-full"></div>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Borang Pelaporan Rasmi</h2>
              </div>
              <ReportForm 
                data={data} 
                setData={setData} 
                onAIAssist={handleAIAssist}
                isAILoading={isAILoading}
                reportLength={reportLength}
                setReportLength={setReportLength}
              />
            </div>

            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1.5 bg-indigo-600 rounded-full"></div>
                <h2 className="text-lg font-bold text-slate-800 uppercase tracking-tight">Draf Tersimpan</h2>
              </div>
              <ReportHistory 
                history={history} 
                onLoad={handleLoadFromHistory} 
                onDelete={handleDeleteHistory} 
              />
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="sticky top-28 space-y-6">
              <div className="bg-slate-900 p-6 rounded-3xl shadow-2xl text-white">
                <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-60 text-blue-400">Kawalan Dokumen</h3>
                <div className="space-y-4">
                  <button 
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        MENJANA PDF...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        SIMPAN PDF (1 MUKA)
                      </>
                    )}
                  </button>
                  
                  <button 
                    onClick={handleShareWhatsApp}
                    className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-500 text-white font-black py-4 px-6 rounded-2xl transition-all shadow-lg active:scale-95"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 448 512">
                      <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.6-27.6-16.5-14.7-27.6-32.8-30.8-38.4-3.2-5.6-.3-8.6 2.5-11.4 2.5-2.5 5.5-6.5 8.3-9.8 2.8-3.3 3.7-5.6 5.5-9.3 1.8-3.7.9-6.9-.5-9.8-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.8 23.5 9.2 31.5 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.5 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
                    </svg>
                    WHATSAPP GPK KOKU
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden group">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pratonton Digital</span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                  </div>
                </div>
                <div className="overflow-auto bg-slate-200 p-4 max-h-[500px] flex justify-center">
                  <div className="origin-top scale-[0.45] transition-transform duration-500 bg-white shadow-2xl" style={{ width: '210mm', height: 'auto' }}>
                    <PDFTemplate data={data} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Kontena Tersembunyi untuk Penjanaan PDF */}
      <div 
        style={{ 
          position: 'fixed', 
          top: '-10000px', 
          left: '-10000px', 
          zIndex: -9999,
          visibility: 'hidden'
        }}
      >
        <div ref={pdfPrintRef} style={{ width: '210mm' }}>
          <PDFTemplate data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;
