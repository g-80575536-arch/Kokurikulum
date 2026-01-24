
import React from 'react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
  setData: React.Dispatch<React.SetStateAction<ReportData>>;
}

const ReportForm: React.FC<Props> = ({ data, setData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const inputClass = "w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1";

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
          <input type="date" name="tarikh" value={data.tarikh} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Masa:</label>
          <input type="text" name="masa" value={data.masa} onChange={handleChange} placeholder="Contoh: 2:00 PM - 4:00 PM" className={inputClass} />
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

      <div>
        <label className={labelClass}>Laporan Aktiviti:</label>
        <textarea name="laporan" value={data.laporan} onChange={handleChange} rows={5} placeholder="Nyatakan ringkasan aktiviti yang dijalankan..." className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Muat Naik Gambar Aktiviti (Maksimum 6):</label>
        <div className="mt-2 flex flex-col items-center p-6 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer relative">
          <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-slate-500 font-medium text-center">Klik atau tarik gambar ke sini</p>
          <p className="text-[10px] text-slate-400 mt-1">Susunan: 3 atas, 3 bawah</p>
        </div>
        {data.images.length > 0 && (
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-6 gap-3">
            {data.images.map((img, idx) => (
              <div key={idx} className="aspect-square rounded-lg overflow-hidden border-2 border-slate-200 relative shadow-sm group">
                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="text-white font-bold text-xs">#{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-emerald-100 rounded-full mr-3 text-emerald-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-emerald-800 uppercase tracking-wider">WhatsApp GPK KOKU</h4>
          </div>
          <div>
            <label className={labelClass}>No. Tel WhatsApp:</label>
            <input 
              type="text" 
              name="phonePK" 
              value={data.phonePK} 
              onChange={handleChange} 
              className={`${inputClass} bg-white font-bold text-emerald-700 border-emerald-200`} 
            />
          </div>
        </div>

        <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-blue-100 rounded-full mr-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h4 className="text-sm font-bold text-blue-800 uppercase tracking-wider">Maklumat Penyedia</h4>
          </div>
          <div className="space-y-3">
            <input type="text" name="namaPenyedia" value={data.namaPenyedia} onChange={handleChange} placeholder="Nama Penuh" className={inputClass} />
            <input type="text" name="jawatanPenyedia" value={data.jawatanPenyedia} onChange={handleChange} placeholder="Jawatan" className={inputClass} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportForm;
