
import React, { useState, useEffect, useRef } from 'react';
import { ReportData } from './types';
import ReportForm from './components/ReportForm';
import PDFTemplate from './components/PDFTemplate';
import { GoogleGenAI } from "@google/genai";

const STORAGE_KEY = 'kokurikulum_report_draft';
const GPK_KOKU_PHONE = '60132576050';
const DRIVE_FOLDER_LINK = 'https://drive.google.com/drive/folders/1IQcstBUm_iv75qTZQpX3r99smSBU9kMj?usp=drive_link';

const App: React.FC = () => {
  const [data, setData] = useState<ReportData>({
    program: '',
    anjuran: '',
    tarikh: '',
    masa: '',
    hadir: '',
    tidakHadir: '',
    guruPenasihat: '',
    laporan: '',
    namaPenyedia: '',
    jawatanPenyedia: '',
    images: [],
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isAILoading, setIsAILoading] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(prev => ({ 
          ...prev, 
          ...parsed
        }));
      } catch (e) {
        console.error("Failed to load draft", e);
      }
    }
  }, []);

  const handleSaveDraft = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    alert('Draf laporan telah berjaya disimpan!');
  };

  const generateAIReport = async () => {
    if (!data.program) {
      alert("Sila isi nama 'Program / Aktiviti' terlebih dahulu supaya AI mempunyai konteks.");
      return;
    }

    setIsAILoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Tuliskan satu laporan aktiviti kokurikulum sekolah yang profesional dan padat dalam Bahasa Melayu.
        Butiran Program:
        - Nama Program: ${data.program}
        - Anjuran: ${data.anjuran}
        - Tarikh: ${data.tarikh}
        - Masa: ${data.masa}
        - Kehadiran: ${data.hadir} orang
        
        Sila hasilkan 2-3 perenggan yang merangkumi:
        1. Tujuan/Objektif aktiviti.
        2. Ringkasan perjalanan aktiviti dari mula hingga tamat.
        3. Rumusan/Impak aktiviti kepada murid.
        
        Gunakan nada rasmi kerajaan/sekolah (Formal). Jangan gunakan emoji.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite-latest',
        contents: [{ parts: [{ text: prompt }] }],
      });

      const generatedText = response.text || '';
      setData(prev => ({ ...prev, laporan: generatedText.trim() }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Gagal menjana laporan dengan AI. Sila semak sambungan internet anda.");
    } finally {
      setIsAILoading(false);
    }
  };

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    
    setIsGenerating(true);
    const element = pdfRef.current;
    
    const images = element.getElementsByTagName('img');
    const imagePromises = Array.from(images).map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => {
        img.onload = resolve;
        img.onerror = resolve;
      });
    });

    await Promise.all(imagePromises);

    const opt = {
      margin: 0,
      filename: `Laporan_Koku_${data.program.replace(/\s+/g, '_') || 'Mingguan'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        logging: false,
        scrollY: -window.scrollY 
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // @ts-ignore
      await window.html2pdf().from(element).set(opt).save();
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Terdapat ralat semasa menjana PDF. Sila cuba lagi.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleWhatsAppPK = () => {
    const message = encodeURIComponent(
      `*LAPORAN MINGGUAN KOKURIKULUM SK KRANGAN 2026*\n\n` +
      `*Program:* ${data.program || '-'}\n` +
      `*Tarikh:* ${data.tarikh || '-'}\n` +
      `*Kehadiran:* ${data.hadir || '0'} Orang\n\n` +
      `*Disediakan oleh:* ${data.namaPenyedia || '-'}\n\n` +
      `_Sila lampirkan fail PDF yang telah dimuat turun. Laporan juga akan dimuat naik ke folder Google Drive Kokurikulum._`
    );

    window.open(`https://wa.me/${GPK_KOKU_PHONE}?text=${message}`, '_blank');
  };

  const handleOpenDrive = () => {
    window.open(DRIVE_FOLDER_LINK, '_blank');
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-slate-200 py-6 shadow-sm no-print">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <img 
            src="https://i.postimg.cc/xCQ9fWNF/IMG-9606-(1)-(1).jpg" 
            alt="Logo Sekolah" 
            className="h-20 w-auto mb-4"
          />
          <h1 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-[#004488]">
            Laporan Mingguan Perjumpaan Kokurikulum
          </h1>
          <h2 className="text-lg md:text-xl font-medium text-slate-600">
            Sekolah Kebangsaan Krangan 2026
          </h2>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-5xl no-print">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-blue-100 relative">
          {/* AI Generation Overlay */}
          {isAILoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004488] mb-4"></div>
              <p className="text-[#004488] font-bold animate-pulse text-lg">AI sedang menjana laporan anda...</p>
            </div>
          )}

          <div className="bg-blue-50 border-b border-blue-100 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-[#004488] flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Borang Maklumat Laporan
            </h3>
            <div className="flex items-center gap-2">
               <span className="flex items-center text-[10px] font-bold text-white bg-[#004488] px-3 py-1 rounded-full shadow-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                  </svg>
                  POWERED BY GEMINI AI
               </span>
            </div>
          </div>
          
          <div className="p-8">
            <ReportForm data={data} setData={setData} onAIAssist={generateAIReport} isAILoading={isAILoading} />
            
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-100 pt-8">
              <button
                onClick={handleSaveDraft}
                className="w-full px-4 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-all flex items-center justify-center border border-slate-200 active:transform active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                SIMPAN DRAF
              </button>
              
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className={`w-full px-4 py-4 bg-[#004488] hover:bg-[#003366] text-white font-bold rounded-xl transition-all flex items-center justify-center shadow-lg active:transform active:scale-95 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGenerating ? 'MENJANA...' : 'MUAT TURUN PDF'}
              </button>

              <button
                onClick={handleWhatsAppPK}
                className="w-full px-4 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-all flex items-center justify-center shadow-lg active:transform active:scale-95"
              >
                <svg className="w-5 h-5 mr-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WA PK KOKU
              </button>

              <button
                onClick={handleOpenDrive}
                className="w-full px-4 py-4 bg-white border-2 border-[#004488] hover:bg-blue-50 text-[#004488] font-bold rounded-xl transition-all flex items-center justify-center shadow-lg active:transform active:scale-95 group"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-6 h-6 mr-2" alt="Drive" />
                SIMPAN KE DRIVE
              </button>
            </div>

            <div className="mt-8 p-5 bg-blue-50 border border-blue-100 rounded-xl flex items-start">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#004488] mt-0.5 mr-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <div className="text-sm text-[#004488]">
                  <p className="font-bold text-base mb-2">Panduan Penggunaan:</p>
                  <ol className="list-decimal ml-5 space-y-1 font-medium">
                    <li>Isi maklumat aktiviti. Klik butang <span className="text-indigo-600 font-bold">✨ BANTU SAYA TULIS</span> untuk draf laporan pantas.</li>
                    <li>Muat naik gambar (maksimum 6 keping).</li>
                    <li>Klik <strong>MUAT TURUN PDF</strong> dan <strong>SIMPAN KE DRIVE</strong>.</li>
                    <li>Hantar makluman rasmi melalui butang <strong>WA PK KOKU</strong> kepada Penolong Kanan Kokurikulum (No: 013-257 6050).</li>
                  </ol>
               </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-10 no-print">
        <div className="container mx-auto px-4 text-center">
          <p className="text-slate-600 font-medium">&copy; 2026 SK Krangan - Sistem Pelaporan Kokurikulum Rasmi</p>
          <div className="flex justify-center gap-4 mt-4 text-xs text-slate-400 uppercase tracking-widest">
            <span>Inovasi Pendidikan</span>
            <span>•</span>
            <span>Kecemerlangan Kokurikulum</span>
            <span>•</span>
            <span>Penyampaian Digital</span>
          </div>
        </div>
      </footer>

      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={pdfRef}>
          <PDFTemplate data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;
