
import React from 'react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
}

const PDFTemplate: React.FC<Props> = ({ data }) => {
  // Split images into two rows of 3
  const row1 = data.images.slice(0, 3);
  const row2 = data.images.slice(3, 6);

  return (
    <div className="bg-white p-[15mm] text-black w-[210mm] min-h-[297mm] mx-auto overflow-hidden">
      {/* Header Logo & Title */}
      <div className="flex flex-col items-center mb-6 text-center border-b-2 border-black pb-4">
        <img 
          src="https://i.postimg.cc/xCQ9fWNF/IMG-9606-(1)-(1).jpg" 
          alt="School Logo" 
          className="h-[25mm] w-auto mb-2"
        />
        <h1 className="text-lg font-bold uppercase leading-tight">
          LAPORAN MINGGUAN PERJUMPAAN KOKURIKULUM
        </h1>
        <h2 className="text-md font-bold uppercase leading-tight">
          SEKOLAH KEBANGSAAN KRANGAN 2026
        </h2>
      </div>

      {/* Details Table */}
      <table className="w-full border-collapse border border-black text-sm mb-4">
        <tbody>
          <tr>
            <td className="border border-black p-2 font-bold w-1/3 bg-gray-100">Program / Aktiviti:</td>
            <td className="border border-black p-2">{data.program || '-'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-gray-100">Anjuran:</td>
            <td className="border border-black p-2">{data.anjuran || '-'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-gray-100">Tarikh:</td>
            <td className="border border-black p-2">{data.tarikh || '-'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-gray-100">Masa:</td>
            <td className="border border-black p-2">{data.masa || '-'}</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-gray-100">Bilangan Murid Hadir:</td>
            <td className="border border-black p-2">{data.hadir || '0'} Orang</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-gray-100">Bilangan Murid Tidak Hadir:</td>
            <td className="border border-black p-2">{data.tidakHadir || '0'} Orang</td>
          </tr>
          <tr>
            <td className="border border-black p-2 font-bold bg-gray-100">Nama Guru Penasihat:</td>
            <td className="border border-black p-2 font-semibold uppercase">{data.guruPenasihat || '-'}</td>
          </tr>
        </tbody>
      </table>

      {/* Report Description */}
      <div className="mb-4">
        <div className="bg-gray-100 border border-black p-2 font-bold text-sm">Laporan Aktiviti:</div>
        <div className="border border-black border-t-0 p-3 text-sm min-h-[40mm] whitespace-pre-wrap text-justify">
          {data.laporan || 'Tiada laporan direkodkan.'}
        </div>
      </div>

      {/* Images Section - 3x2 Grid */}
      <div className="mb-6">
        <div className="bg-gray-100 border border-black p-2 font-bold text-sm mb-2">Lampiran Gambar Aktiviti:</div>
        
        {/* Row 1 */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          {[0, 1, 2].map((idx) => (
            <div key={`row1-${idx}`} className="border border-gray-300 aspect-[4/3] flex items-center justify-center bg-gray-50 overflow-hidden">
              {row1[idx] ? (
                <img src={row1[idx]} alt={`Activity ${idx + 1}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[8px] text-gray-300">Gambar {idx + 1}</span>
              )}
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((idx) => (
            <div key={`row2-${idx}`} className="border border-gray-300 aspect-[4/3] flex items-center justify-center bg-gray-50 overflow-hidden">
              {row2[idx] ? (
                <img src={row2[idx]} alt={`Activity ${idx + 4}`} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[8px] text-gray-300">Gambar {idx + 4}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Signature */}
      <div className="mt-auto pt-4 flex justify-between items-end text-sm">
        <div className="w-2/3">
          <p className="font-bold mb-8">Disediakan Oleh,</p>
          <div className="space-y-1">
            <p className="font-bold uppercase">Nama: {data.namaPenyedia || '_________________________'}</p>
            <p className="font-bold uppercase">Jawatan: {data.jawatanPenyedia || '_________________________'}</p>
          </div>
        </div>
        <div className="text-right text-[10px] text-gray-400">
          Dicetak pada: {new Date().toLocaleString('ms-MY')}
        </div>
      </div>
    </div>
  );
};

export default PDFTemplate;
