
import React from 'react';
import { ReportData } from '../types';

export interface HistoryItem {
  id: string;
  timestamp: string;
  data: ReportData;
}

interface Props {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

const ReportHistory: React.FC<Props> = ({ history, onLoad, onDelete }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-400 italic">Tiada draf laporan dijumpai.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b border-slate-200">
            <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Tarikh Simpan</th>
            <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Program / Aktiviti</th>
            <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Tindakan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {history.map((item) => (
            <tr key={item.id} className="hover:bg-blue-50 transition-colors">
              <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                {new Date(item.timestamp).toLocaleString('ms-MY', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </td>
              <td className="px-4 py-3 text-sm font-semibold text-slate-700">
                {item.data.program || <span className="text-slate-300 italic">Tanpa Tajuk</span>}
              </td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onLoad(item)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                    title="Muat Draf"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    MUAT
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold"
                    title="Padam"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    PADAM
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportHistory;
