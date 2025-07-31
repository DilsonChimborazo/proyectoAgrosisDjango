import { useRef, useEffect, useState } from 'react';
import { Stock } from '@/hooks/finanzas/stock/useStock';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ChartLine } from '@/components/globales/Charts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DescargarExcel } from '@/components/globales/DescargarExcel';
import { cargarImagenComoBase64 } from '../trazabilidad/utils';

interface ReporteMovimientosStockProps {
  allStock: Stock[] | undefined;
  formato: 'pdf' | 'excel';
  onGenerate: () => void;
}

const ReporteMovimientosStock = ({ allStock, formato, onGenerate }: ReporteMovimientosStockProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartRendered, setChartRendered] = useState(false);

  const parseCantidad = (cantidad: unknown): number => {
    if (cantidad == null || (typeof cantidad === 'string' && cantidad.trim() === '')) return 0;
    const numero = typeof cantidad === 'string' ? parseFloat(cantidad) : cantidad;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const generarDatos = () => {
    // Filtrar movimientos inválidos
    const datosValidos = allStock?.filter(m => {
      const isValid = m.cantidad != null && !isNaN(parseCantidad(m.cantidad));
      if (!isValid) {
        console.warn('Movimiento inválido:', m);
      }
      return isValid;
    }) || [];

    const datos = datosValidos.map(m => ({
      cultivo: m.fk_id_produccion?.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || m.fk_id_item_venta?.produccion?.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo',
      tipo: m.movimiento,
      cantidad: parseCantidad(m.cantidad).toFixed(2),
      fecha: format(new Date(m.fecha), 'dd/MM/yyyy HH:mm', { locale: es }),
      unidad: m.fk_id_produccion?.fk_unidad_medida?.nombre_medida || m.fk_id_item_venta?.unidad_medida?.nombre_medida || 'N/A',
    }));

    // Agrupar por fecha para el gráfico
    const fechas = [...new Set(datos.map(d => d.fecha))].sort();
    const entradas = fechas.map(fecha =>
      datos
        .filter(d => d.fecha === fecha && d.tipo === 'Entrada')
        .reduce((sum, d) => sum + parseFloat(d.cantidad), 0)
    );
    const salidas = fechas.map(fecha =>
      datos
        .filter(d => d.fecha === fecha && d.tipo === 'Salida')
        .reduce((sum, d) => sum + parseFloat(d.cantidad), 0)
    );

    return {
      columnas: [
        { header: 'Cultivo', key: 'cultivo', width: 25 },
        { header: 'Tipo', key: 'tipo', width: 15 },
        { header: 'Cantidad', key: 'cantidad', width: 15 },
        { header: 'Fecha', key: 'fecha', width: 20 },
        { header: 'Unidad', key: 'unidad', width: 15 },
      ],
      datos,
      grafico: {
        labels: fechas,
        datasets: [
          {
            label: 'Entradas',
            data: entradas,
            borderColor: '#4CAF50',
            fill: false,
          },
          {
            label: 'Salidas',
            data: salidas,
            borderColor: '#F44336',
            fill: false,
          },
        ],
      },
      titulo: 'Reporte de Movimientos de Stock por Cultivo',
    };
  };

  useEffect(() => {
    if (chartRef.current && allStock?.length) {
      const checkChart = setInterval(() => {
        const canvas = chartRef.current?.querySelector('canvas');
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setChartRendered(true);
          clearInterval(checkChart);
        }
      }, 100);
      return () => clearInterval(checkChart);
    }
  }, [allStock]);

  const generarReporte = async () => {
    if (!chartRendered || !allStock?.length) return;
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
      doc.text(`Fecha de generación: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`, pageWidth - rightMargin, infoY, { align: 'right' });

      autoTable(doc, {
        startY: infoY + 10,
        head: [columnas.map(col => col.header)],
        body: datos.map(d => Object.values(d)),
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3, halign: 'center', lineWidth: 0.1, font: 'helvetica' },
        headStyles: { fillColor: [0, 120, 100], textColor: 255, fontStyle: 'bold', fontSize: 10 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: columnas.reduce((acc, col, index) => ({ ...acc, [index]: { cellWidth: col.width } }), {}),
      });

      if (chartRef.current) {
        try {
          const canvas = await html2canvas(chartRef.current, { scale: 3, logging: false, useCORS: true });
          const imgData = canvas.toDataURL('image/png', 1.0);
          doc.addImage(imgData, 'PNG', 15, (doc as any).lastAutoTable.finalY + 10, 180, 100);
        } catch (error) {
          console.error('Error al agregar imagen al PDF:', error);
          doc.text('No se pudo incluir el gráfico', 15, (doc as any).lastAutoTable.finalY + 10);
        }
      }

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano', leftMargin, doc.internal.pageSize.getHeight() - 10);
      doc.save('movimientos-stock.pdf');
    } else {
      // Usar DescargarExcel para generar el reporte Excel
      await DescargarExcel({
        data: datos,
        columns: columnas,
        title: 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO',
        subtitle: `ÁREA PAE - ${titulo}`,
        logoSenaPath: '/logoSena.png',
        logoKaizenPath: '/agrosoft.png',
        chartRef,
        filename: `movimientos-stock_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`,
      });
    }
    onGenerate();
  };

  const { grafico, titulo } = generarDatos();

  return (
    <div>
      <div ref={chartRef} className="mt-4 bg-gray-50 p-4 rounded-lg">
        <ChartLine
          data={grafico}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: titulo, font: { size: 16 } },
              legend: { position: 'top' },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
          height={300}
        />
      </div>
      <button
        onClick={generarReporte}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
        disabled={!chartRendered || !allStock?.length}
      >
        Descargar
      </button>
    </div>
  );
};

export default ReporteMovimientosStock;