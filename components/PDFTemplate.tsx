
import React from 'react';
import { ReportData } from '../types';

interface Props {
  data: ReportData;
}

const PDFTemplate: React.FC<Props> = ({ data }) => {
  // Hanya ambil 6 gambar (3 atas, 3 bawah)
  const displayImages = data.images.slice(0, 6);

  // Gaya halaman A4 yang diperkukuhkan (210mm x 297mm)
  const pageStyle: React.CSSProperties = {
    width: '210mm',
    height: '297mm',
    padding: '12mm 20mm 12mm 20mm', // Margin kiri & kanan dinaikkan ke 20mm untuk elak terpotong
    backgroundColor: '#ffffff',
    color: '#000000',
    fontFamily: "'Inter', 'Arial', sans-serif",
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    margin: '0 auto', // Pastikan elemen di tengah
  };

  const tableHeaderStyle: React.CSSProperties = {
    backgroundColor: '#f8fafc',
    fontWeight: 'bold',
    padding: '5px 8px',
    border: '1pt solid #000000',
    fontSize: '8.5pt',
    textTransform: 'uppercase',
    width: '25%',
  };

  const tableBodyStyle: React.CSSProperties = {
    padding: '5px 8px',
    border: '1pt solid #000000',
    fontSize: '9.5pt',
    verticalAlign: 'middle',
    wordBreak: 'break-word',
  };

  return (
    <div id="pdf-container" style={{ backgroundColor: '#ffffff', display: 'block', width: '210mm' }}>
      <div className="pdf-page" style={pageStyle}>
        {/* Header Rasmi */}
        <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%' }}>
          <div style={{ position: 'absolute', top: '12mm', right: '20mm', fontSize: '6.5pt', color: '#64748b' }}>
            REF: SKK/KOKU/2026/{(new Date().getTime().toString().slice(-4))}
          </div>
          <img 
            src="https://i.postimg.cc/xCQ9fWNF/IMG-9606-(1)-(1).jpg" 
            alt="Logo Sekolah" 
            crossOrigin="anonymous"
            style={{ height: '20mm', width: 'auto', marginBottom: '4px', display: 'inline-block' }}
          />
          <h1 style={{ fontSize: '12pt', fontWeight: 'bold', margin: '0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SEKOLAH KEBANGSAAN KRANGAN</h1>
          <p style={{ fontSize: '8.5pt', margin: '1px 0', fontWeight: '600' }}>94700 SERIAN, SARAWAK</p>
          <div style={{ borderBottom: '1.5pt double #000000', marginTop: '6px', width: '100%' }}></div>
        </div>

        {/* Tajuk Laporan */}
        <div style={{ textAlign: 'center', marginBottom: '8px', width: '100%' }}>
          <h2 style={{ fontSize: '9pt', fontWeight: 'bold', textDecoration: 'underline', textTransform: 'uppercase' }}>
            LAPORAN PERJUMPAAN MINGGUAN KOKURIKULUM TAHUN 2026
          </h2>
        </div>

        {/* Jadual Butiran */}
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '8px', tableLayout: 'fixed' }}>
          <tbody>
            <tr>
              <td style={tableHeaderStyle}>KELAB / UNIT</td>
              <td style={{ ...tableBodyStyle, fontWeight: 'bold', textTransform: 'uppercase' }} colSpan={3}>{data.unitName || '-'}</td>
            </tr>
            <tr>
              <td style={tableHeaderStyle}>PROGRAM / AKTIVITI</td>
              <td style={{ ...tableBodyStyle }}>{data.program || '-'}</td>
              <td style={{ ...tableHeaderStyle, width: '15%' }}>TARIKH</td>
              <td style={{ ...tableBodyStyle, width: '20%' }}>{data.tarikh || '-'}</td>
            </tr>
            <tr>
              <td style={tableHeaderStyle}>ANJURAN</td>
              <td style={tableBodyStyle}>{data.anjuran || '-'}</td>
              <td style={tableHeaderStyle}>MASA</td>
              <td style={tableBodyStyle}>{data.masa}</td>
            </tr>
            <tr>
              <td style={tableHeaderStyle}>KEHADIRAN</td>
              <td style={tableBodyStyle}>HADIR: {data.hadir || '0'} | T/HADIR: {data.tidakHadir || '0'}</td>
              <td style={tableHeaderStyle}>PENASIHAT</td>
              <td style={tableBodyStyle}>{data.guruPenasihat || '-'}</td>
            </tr>
          </tbody>
        </table>

        {/* Laporan Naratif */}
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minHeight: '30mm', marginBottom: '8px', overflow: 'hidden' }}>
          <div style={{ 
            backgroundColor: '#f1f5f9', 
            padding: '3px 8px', 
            border: '1pt solid #000000', 
            borderBottom: 'none',
            fontSize: '8pt', 
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            RINGKASAN AKTIVITI / LAPORAN :
          </div>
          <div style={{ 
            border: '1pt solid #000000', 
            padding: '8px 10px', 
            fontSize: '9.5pt', 
            lineHeight: '1.4', 
            textAlign: 'justify',
            flexGrow: 1,
            backgroundColor: '#ffffff',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden'
          }}>
            {data.laporan || 'Tiada laporan aktiviti direkodkan.'}
          </div>
        </div>

        {/* Lampiran Gambar */}
        {displayImages.length > 0 && (
          <div style={{ marginBottom: '8px', width: '100%' }}>
             <div style={{ fontSize: '7.5pt', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', borderBottom: '0.8pt solid #000000', display: 'inline-block' }}>
               LAMPIRAN FOTO AKTIVITI :
             </div>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
               {displayImages.map((img, idx) => (
                 <div key={idx} style={{ border: '0.5pt solid #000000', padding: '2px', backgroundColor: '#ffffff' }}>
                   <div style={{ height: '24mm', width: '100%', overflow: 'hidden', backgroundColor: '#f8fafc' }}>
                     <img 
                       src={img} 
                       alt={`Foto ${idx+1}`}
                       crossOrigin="anonymous"
                       style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                     />
                   </div>
                   <div style={{ fontSize: '6.5pt', textAlign: 'center', marginTop: '1px', fontWeight: 'bold' }}>FOTO {idx+1}</div>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* Ruangan Tandatangan */}
        <div style={{ borderTop: '1pt solid #000000', paddingTop: '6px', marginTop: 'auto', width: '100%' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <tr>
                <td style={{ width: '50%', verticalAlign: 'top', paddingRight: '15px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '9pt', margin: '0 0 20px 0' }}>Disediakan Oleh,</p>
                  <div style={{ borderBottom: '0.8pt solid #000000', width: '85%', marginBottom: '2px' }}></div>
                  <p style={{ fontWeight: 'bold', fontSize: '9pt', margin: '0', textTransform: 'uppercase' }}>({data.namaPenyedia || '............................................'})</p>
                  <p style={{ margin: '0', fontSize: '8pt' }}>{data.jawatanPenyedia || 'GURU PENASIHAT'}</p>
                  <p style={{ margin: '0', fontSize: '8pt' }}>SK KRANGAN, SERIAN</p>
                </td>
                <td style={{ width: '50%', verticalAlign: 'top', paddingLeft: '15px' }}>
                  <p style={{ fontWeight: 'bold', fontSize: '9pt', margin: '0 0 20px 0' }}>Disahkan Oleh,</p>
                  <div style={{ borderBottom: '0.8pt solid #000000', width: '85%', marginBottom: '2px' }}></div>
                  <p style={{ fontWeight: 'bold', fontSize: '9pt', margin: '0', textTransform: 'uppercase' }}>(GPK KOKURIKULUM)</p>
                  <p style={{ margin: '0', fontSize: '8pt' }}>SK KRANGAN, SERIAN</p>
                  <p style={{ margin: '0', fontSize: '8pt' }}>Tarikh: ............................................</p>
                </td>
              </tr>
            </tbody>
          </table>
          
          <div style={{ 
            marginTop: '6px', 
            paddingTop: '4px', 
            borderTop: '0.5pt solid #e2e8f0', 
            fontSize: '6pt', 
            textAlign: 'center', 
            color: '#94a3b8',
            fontStyle: 'italic'
          }}>
            E-Laporan Koku SK Krangan | Dijana pada: {new Date().toLocaleString('ms-MY')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFTemplate;
