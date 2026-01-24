
import React from 'react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
  setData: React.Dispatch<React.SetStateAction<ReportData>>;
  onAIAssist?: () => void;
  isAILoading?: boolean;
}

const ReportForm: React.FC<Props> = ({ data, setData, onAIAssist, isAILoading }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const filesArray = Array.from(files).slice(0, 6);
    const readers = filesArray.map(file => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(images => {
      setData(prev => ({ ...prev, images }));
    });
  };

  // Standard input class with light gray background
  const inputClass = "w-full px-4 py-2 rounded-lg border border-slate-300 bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

  const timeSuggestions = [
    "1:00 PM - 2:00 PM",
    "1:30 PM - 3:30 PM",
    "2:00 PM - 4:00 PM",
    "2:30 PM - 4:30 PM",
    "3:00 PM - 5:00 PM",
    "8:00 AM - 10:00 AM",
    "8:30 AM - 10:30 AM",
    "9:00 AM - 11:00 AM",
    "9:00 AM - 12:00 PM"
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Program / Aktiviti:</label>
          <input type="text" name="program" value={data.program} onChange={handleChange} placeholder="Contoh: Perjumpaan Pengakap Bil. 1" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Anjuran:</label>
          <input type="text" name="anjuran" value={data.anjuran} onChange={handleChange} placeholder="Contoh: Unit Beruniform" className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Tarikh:</label>
          <input 
            type="date" 
            name="tarikh" 
            value={data.tarikh} 
            onChange={handleChange} 
            className={inputClass} 
          />
        </div>
        <div>
          <label className={labelClass}>Masa (Taip atau Pilih Cadangan):</label>
          <input 
            list="time-options"
            name="masa" 
            value={data.masa} 
            onChange={handleChange} 
            placeholder="Contoh: 2:00 PM - 4:00 PM"
            className={inputClass}
          />
          <datalist id="time-options">
            {timeSuggestions.map((option, idx) => (
              <option key={idx} value={option} />
            ))}
          </datalist>
        </div>
        <div>
          <label className={labelClass}>Bilangan Murid Hadir:</label>
          <input type="number" name="hadir" value={data.hadir} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Bilangan Murid Tidak Hadir:</label>
          <input type="number" name="tidakHadir" value={data.tidakHadir} onChange={handleChange} className={inputClass} />
        </div>
        <div className="md:col-span-2">
          <label className={labelClass}>Nama Guru Penasihat:</label>
          <input type="text" name="guruPenasihat" value={data.guruPenasihat} onChange={handleChange} placeholder="Nama guru terlibat" className={inputClass} />
        </div>
      </div>

      <div className="relative">
        <div className="flex justify-between items-center mb-1">
          <label className={labelClass}>Laporan Aktiviti:</label>
          <button 
            type="button"
            onClick={onAIAssist}
            disabled={isAILoading}
            className="text-[11px] flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1 rounded-full font-bold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
            </svg>
            {isAILoading ? 'MENJANA...' : '✨ BANTU SAYA TULIS'}
          </button>
        </div>
        <textarea 
          name="laporan" 
          value={data.laporan} 
          onChange={handleChange} 
          rows={6} 
          placeholder="Tuliskan ringkasan aktiviti di sini atau klik butang AI untuk bantuan..." 
          className={inputClass} 
        />
        <p className="text-[10px] text-slate-400 mt-1 italic">* AI akan menjana draf laporan berdasarkan butiran program di atas.</p>
      </div>

      <div>
        <label className={labelClass}>Muat Naik Gambar Aktiviti (Maksimum 6):</label>
        <div className="mt-2 flex flex-col items-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer relative shadow-inner">
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-slate-500 font-medium text-center">Klik atau tarik gambar ke sini</p>
          <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-tighter">SUSUNAN: 3 KEPING ATAS, 3 KEPING BAWAH</p>
        </div>
        {data.images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
            {data.images.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200 relative shadow-sm group">
                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-white font-bold text-xs">FOTO {idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 shadow-inner">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-blue-100 rounded-full mr-3 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider">Maklumat Penyedia</h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Nama Penuh:</label>
            <input type="text" name="namaPenyedia" value={data.namaPenyedia} onChange={handleChange} placeholder="Nama Penuh" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Jawatan:</label>
            <input type="text" name="jawatanPenyedia" value={data.jawatanPenyedia} onChange={handleChange} placeholder="Jawatan" className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
