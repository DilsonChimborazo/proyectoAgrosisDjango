import React, { useRef, useEffect, useState } from 'react';
import { usePagosPorActividad } from '@/hooks/finanzas/nomina/useNomina';
import { ChartPie, ChartBar } from '@/components/globales/Charts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DescargarExcel } from '@/components/globales/DescargarExcel';
import html2canvas from 'html2canvas';
import { cargarImagenComoBase64 } from '../trazabilidad/utils';

interface ResumenPagosActividadProps {
  esModal?: boolean;
  formato?: 'pdf' | 'excel';
  onGenerate?: () => void;
}

const ResumenPagosActividad: React.FC<ResumenPagosActividadProps> = ({ esModal = false, formato, onGenerate }) => {
  const { data, isLoading, error } = usePagosPorActividad();
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartRendered, setChartRendered] = useState(false);
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const parseNumber = (value: unknown): number => {
    if (value == null || (typeof value === 'string' && value.trim() === '')) return 0;
    const numero = typeof value === 'string' ? parseFloat(value) : value;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const generarDatos = () => {
    const datosValidos = data?.filter(p => parseNumber(p.total_pagado) > 0) || [];
    const colores = [
      '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#607D8B',
      '#FF5722', '#009688', '#673AB7', '#3F51B5', '#795548'
    ];

    return {
      columnas: ['Actividad', 'Tipo', 'Cantidad', 'Total Pagado (COP)'],
      datos: datosValidos.map(p => [
        p.actividad,
        p.actividad_tipo,
        p.cantidad.toString(),
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(p.total_pagado),
      ]),
      graficoPie: {
        labels: datosValidos.map(p => p.actividad),
        datasets: [
          {
            data: datosValidos.map(p => parseNumber(p.total_pagado)),
            backgroundColor: colores.slice(0, datosValidos.length),
          },
        ],
      },
      graficoBar: {
        labels: datosValidos.map(p => p.actividad),
        datasets: [
          {
            label: 'Total Pagado (COP)',
            data: datosValidos.map(p => parseNumber(p.total_pagado)),
            backgroundColor: '#4CAF50',
            yAxisID: 'y1',
            barPercentage: 0.4,
            categoryPercentage: 0.45,
          },
          {
            label: 'Cantidad Actividades',
            data: datosValidos.map(p => parseNumber(p.cantidad)),
            backgroundColor: '#2196F3',
            yAxisID: 'y',
            barPercentage: 0.4,
            categoryPercentage: 0.45,
          },
        ],
      },
      titulo: 'Resumen de Pagos por Actividad',
    };
  };

  useEffect(() => {
    if (chartRef.current && data?.length) {
      const checkChart = setInterval(() => {
        const canvas = chartRef.current?.querySelector('canvas');
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setChartRendered(true);
          clearInterval(checkChart);
        }
      }, 100);
      return () => clearInterval(checkChart);
    }
  }, [data]);

  const generarReporte = async () => {
    if (!chartRendered || !formato) return;
    const { columnas, datos, titulo } = generarDatos();

    if (formato === 'pdf') {
      const doc = new jsPDF();
      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      const pageWidth = doc.internal.pageSize.getWidth();
      const headerTop = 10;
      const headerHeight = 30;
      const leftMargin = 14;
      const rightMargin = 14;
      const usableWidth = pageWidth - leftMargin - rightMargin;
      const leftSectionWidth = usableWidth * 0.15;
      const centerSectionWidth = usableWidth * 0.70;
      const rightSectionWidth = usableWidth * 0.15;
      const leftX = leftMargin;
      const centerX = leftMargin + leftSectionWidth;
      const rightX = leftMargin + leftSectionWidth + centerSectionWidth;

      doc.setFillColor(245, 245, 245);
      doc.rect(leftX, headerTop, usableWidth, headerHeight, 'F');
      doc.setLineWidth(0.2);
      doc.setDrawColor(0, 120, 100);
      doc.line(centerX, headerTop, centerX, headerTop + headerHeight);
      doc.line(rightX, headerTop, rightX, headerTop + headerHeight);

      const logoSize1 = 22;
      const logoY = headerTop + (headerHeight - logoSize1) / 2;
      doc.addImage(logoSena, 'PNG', leftX + (leftSectionWidth - logoSize1) / 2, logoY, logoSize1, logoSize1);

      const centerContentX = centerX + centerSectionWidth / 2;
      const centerStartY = headerTop + headerHeight / 2;
      const lineHeight = 7;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 80, 60);
      doc.text('CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE', centerContentX, centerStartY - lineHeight, { align: 'center' });
      doc.text('SURCOLOMBIANO', centerContentX, centerStartY, { align: 'center' });
      doc.text('ÁREA PAE', centerContentX, centerStartY + lineHeight, { align: 'center' });

      const logoSize2 = 25;
      doc.addImage(logoKaizen, 'PNG', rightX + (rightSectionWidth - logoSize2) / 2, logoY, logoSize2, logoSize2);

      const infoY = headerTop + headerHeight + 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(titulo, leftMargin, infoY, { align: 'left' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`, pageWidth - rightMargin, infoY, { align: 'right' });

      autoTable(doc, {
        startY: infoY + 10,
        head: [columnas],
        body: datos,
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3, halign: 'center', lineWidth: 0.1, font: 'helvetica' },
        headStyles: { fillColor: [0, 120, 100], textColor: 255, fontStyle: 'bold', fontSize: 10 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: columnas.reduce((acc, _, index) => ({ ...acc, [index]: { cellWidth: 180 / columnas.length } }), {}),
      });

      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 15, (doc as any).lastAutoTable.finalY + 10, 180, 100);
      }

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano', leftMargin, doc.internal.pageSize.getHeight() - 10);
      doc.save('resumen-pagos-actividad.pdf');
    } else if (formato === 'excel') {
      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      await DescargarExcel({
        columnas,
        datos,
        titulo,
        nombreArchivo: 'resumen-pagos-actividad',
        logoIzquierdo: logoSena,
        logoDerecho: logoKaizen,
        graficoRef: chartRef as React.RefObject<HTMLDivElement>,
      });
    }

    onGenerate?.();
  };

  const { graficoPie, graficoBar, titulo } = generarDatos();

  if (isLoading) return <div className="text-center py-8 text-gray-600">Cargando datos...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <div className={`${esModal ? '' : 'bg-white p-6 rounded-lg shadow-md'}`}>
      {!esModal && <h2 className="text-xl font-semibold mb-4 text-gray-800">Pagos por Actividad</h2>}
      
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setChartType(chartType === 'pie' ? 'bar' : 'pie')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg text-sm"
        >
          Cambiar a {chartType === 'pie' ? 'Barras' : 'Torta'}
        </button>
      </div>

      <div ref={chartRef}>
        {chartType === 'pie' ? (
          <ChartPie
            data={graficoPie}
            options={{
              maintainAspectRatio: !esModal,
              responsive: true,
              plugins: {
                legend: { position: 'right', labels: { font: { size: 12 } } },
                title: { display: true, text: titulo, font: { size: 16, weight: 'bold' }, color: '#333' },
              },
            }}
            height={esModal ? 450 : 300}
          />
        ) : (
          <ChartBar
            data={graficoBar}
            options={{
              maintainAspectRatio: esModal ? false : true,
              responsive: true,
              plugins: {
                legend: { position: 'top', labels: { font: { size: 12 } } },
                title: { display: true, text: titulo, font: { size: 16, weight: 'bold' }, color: '#333' },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Cantidad Actividades', font: { size: 12 } },
                  grid: { color: '#e0e0e0' },
                },
                y1: {
                  position: 'right',
                  beginAtZero: true,
                  title: { display: true, text: 'Total Pagado (COP)', font: { size: 12 } },
                  grid: { display: false },
                },
              },
            }}
            height={esModal ? 450 : 300}
          />
        )}
      </div>

      {formato && onGenerate && (
        <button
          onClick={generarReporte}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full disabled:bg-gray-400"
          disabled={!chartRendered || !data?.length}
        >
          Descargar
        </button>
      )}

      {!esModal && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Detalles</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {['Actividad', 'Tipo', 'Cantidad', 'Total Pagado'].map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.map((pago, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-sm text-gray-700">{pago.actividad}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{pago.actividad_tipo}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{pago.cantidad}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(pago.total_pagado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenPagosActividad;