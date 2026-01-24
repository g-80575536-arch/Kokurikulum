
import React, { useState, useEffect, useRef } from 'react';
import { ReportData } from './types';
import ReportForm from './components/ReportForm';
import PDFTemplate from './components/PDFTemplate';

const STORAGE_KEY = 'kokurikulum_report_draft';
const DEFAULT_PHONE = '+60 13-257 6050';
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
    phonePK: DEFAULT_PHONE
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setData(prev => ({ 
          ...prev, 
          ...parsed,
          phonePK: parsed.phonePK || DEFAULT_PHONE 
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

  const getPDFWorker = () => {
    if (!pdfRef.current) return null;
    const element = pdfRef.current;
    const opt = {
      margin: 10,
      filename: `Laporan_Koku_${data.program || 'Mingguan'}_${data.tarikh}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    // @ts-ignore
    return window.html2pdf().from(element).set(opt);
  };

  const handleGeneratePDF = () => {
    const worker = getPDFWorker();
    if (!worker) return;
    
    setIsGenerating(true);
    worker.save().then(() => {
      setIsGenerating(false);
    }).catch((err: any) => {
      console.error(err);
      setIsGenerating(false);
      alert('Gagal menjana PDF.');
    });
  };

  const handleWhatsAppPK = () => {
    if (!data.phonePK) {
      alert('Sila isi nombor telefon Penolong Kanan Kokurikulum.');
      return;
    }

    let phone = data.phonePK.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '6' + phone;
    } else if (phone.startsWith('1')) {
      phone = '60' + phone;
    }

    const message = encodeURIComponent(
      `*LAPORAN MINGGUAN KOKURIKULUM SK KRANGAN 2026*\n\n` +
      `*Program:* ${data.program || '-'}\n` +
      `*Tarikh:* ${data.tarikh || '-'}\n` +
      `*Kehadiran:* ${data.hadir || '0'} Orang\n\n` +
      `*Disediakan oleh:* ${data.namaPenyedia || '-'}\n\n` +
      `_Sila lampirkan fail PDF yang telah dijana. Laporan juga akan dimuat naik ke folder Google Drive Kokurikulum._`
    );

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const handleOpenDrive = () => {
    window.open(DRIVE_FOLDER_LINK, '_blank');
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="bg-[#003366] text-white py-8 shadow-md no-print">
        <div className="container mx-auto px-4 flex flex-col items-center text-center">
          <img 
            src="https://i.postimg.cc/xCQ9fWNF/IMG-9606-(1)-(1).jpg" 
            alt="Logo Sekolah" 
            className="h-24 w-auto mb-4 drop-shadow-lg"
          />
          <h1 className="text-2xl md:text-3xl font-bold uppercase tracking-wide">
            Laporan Mingguan Perjumpaan Kokurikulum
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold opacity-90">
            Sekolah Kebangsaan Krangan 2026
          </h2>
        </div>
      </header>

      <main className="container mx-auto px-4 mt-8 max-w-5xl no-print">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
          <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-700 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Borang Maklumat Laporan
            </h3>
            <span className="text-xs font-semibold text-slate-400 uppercase bg-slate-100 px-2 py-1 rounded">Kemaskini Drive 2026</span>
          </div>
          
          <div className="p-6">
            <ReportForm data={data} setData={setData} />
            
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-100 pt-8">
              <button
                onClick={handleSaveDraft}
                className="w-full px-4 py-4 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-xl transition-all flex items-center justify-center shadow-md active:transform active:scale-95"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                SIMPAN DRAF
              </button>
              
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className={`w-full px-4 py-4 bg-[#003366] hover:bg-[#002244] text-white font-bold rounded-xl transition-all flex items-center justify-center shadow-lg active:transform active:scale-95 ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                className="w-full px-4 py-4 bg-white border-2 border-slate-200 hover:border-blue-400 text-slate-700 font-bold rounded-xl transition-all flex items-center justify-center shadow-lg active:transform active:scale-95 group"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" className="w-6 h-6 mr-2" alt="Drive" />
                SIMPAN KE DRIVE
              </button>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
               </svg>
               <div className="text-sm text-blue-800">
                  <p className="font-bold">Langkah Seterusnya:</p>
                  <ol className="list-decimal ml-4 mt-1 space-y-1">
                    <li>Klik <strong>MUAT TURUN PDF</strong> untuk simpan laporan dalam peranti anda.</li>
                    <li>Klik <strong>SIMPAN KE DRIVE</strong> untuk membuka folder Google Drive Kokurikulum dan tarik fail PDF tersebut ke dalamnya.</li>
                    <li>Klik <strong>WA PK KOKU</strong> untuk menghantar notifikasi rasmi melalui WhatsApp.</li>
                  </ol>
               </div>
            </div>
          </div>
        </div>
      </main>

      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div ref={pdfRef}>
          <PDFTemplate data={data} />
        </div>
      </div>

      <footer className="mt-12 text-center text-slate-400 text-sm no-print">
        <p>&copy; 2026 SK Krangan - Sistem Pelaporan Rasmi</p>
      </footer>
    </div>
  );
};

export default App;
