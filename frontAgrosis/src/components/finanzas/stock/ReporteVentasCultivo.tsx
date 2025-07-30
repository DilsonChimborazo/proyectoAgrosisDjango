import { useRef, useEffect, useState } from 'react';
import { Venta } from '@/hooks/finanzas/venta/useVenta';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ChartBar } from '@/components/globales/Charts';
import { DescargarExcel } from '@/components/globales/DescargarExcel';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cargarImagenComoBase64 } from '../trazabilidad/utils';

interface ReporteVentasCultivoProps {
  ventas: Venta[] | undefined;
  formato: 'pdf' | 'excel';
  onGenerate: () => void;
}

const ReporteVentasCultivo = ({ ventas, formato, onGenerate }: ReporteVentasCultivoProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartRendered, setChartRendered] = useState(false);

  const parseCantidad = (cantidad: unknown): number => {
    if (cantidad == null || (typeof cantidad === 'string' && cantidad.trim() === '')) return 0;
    const numero = typeof cantidad === 'string' ? parseFloat(cantidad) : cantidad;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const parseSubtotal = (subtotal: unknown): number => {
    if (subtotal == null || (typeof subtotal === 'string' && subtotal.trim() === '')) return 0;
    const numero = typeof subtotal === 'string' ? parseFloat(subtotal) : subtotal;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const generarDatos = () => {
    // Filtrar ítems de venta inválidos y loggear para depuración
    const datosValidos = ventas?.flatMap(venta =>
      venta.items.filter(item => {
        const isValid = item.cantidad != null && !isNaN(parseCantidad(item.cantidad)) && item.subtotal != null && !isNaN(parseSubtotal(item.subtotal));
        if (!isValid) {
          console.warn('Item de venta inválido:', item);
        }
        return isValid;
      }).map(item => ({
        venta,
        item,
      }))
    ) || [];

    // Agrupar por cultivo y unidad de medida
    const datosAgrupados = datosValidos.reduce((acc, { venta, item }) => {
      const cultivo = item.produccion?.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo';
      const unidad = item.unidad_medida?.nombre_medida || 'N/A';
      const clave = `${cultivo}:${unidad}`;
      const cantidad = parseCantidad(item.cantidad);
      const subtotal = parseSubtotal(item.subtotal);
      const fecha = format(new Date(venta.fecha), 'dd/MM/yyyy HH:mm', { locale: es });

      if (!acc[clave]) {
        acc[clave] = {
          cultivo,
          unidad,
          cantidad: 0,
          subtotal: 0,
          fechas: new Set<string>(),
        };
      }
      acc[clave].cantidad += cantidad;
      acc[clave].subtotal += subtotal;
      acc[clave].fechas.add(fecha);
      return acc;
    }, {} as Record<string, { cultivo: string; unidad: string; cantidad: number; subtotal: number; fechas: Set<string> }>);

    // Convertir a lista para la tabla
    const datos = Object.values(datosAgrupados).map(d => ({
      cultivo: d.cultivo,
      unidad: d.unidad,
      cantidad: d.cantidad.toFixed(2),
      subtotal: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(d.subtotal),
      fechas: Array.from(d.fechas).join(', '),
    }));

    // Generar datos para el gráfico
    const claves = Object.keys(datosAgrupados);
    const labels = claves.map(clave => {
      const { cultivo, unidad } = datosAgrupados[clave];
      return `${cultivo} (${unidad})`;
    });
    const cantidades = claves.map(clave => datosAgrupados[clave].cantidad);
    const subtotales = claves.map(clave => datosAgrupados[clave].subtotal);

    return {
      columnas: [
        { header: 'Cultivo', key: 'cultivo', width: 25 },
        { header: 'Unidad', key: 'unidad', width: 15 },
        { header: 'Cantidad Vendida', key: 'cantidad', width: 20 },
        { header: 'Subtotal (COP)', key: 'subtotal', width: 20 },
        { header: 'Fechas', key: 'fechas', width: 40 },
      ],
      datos,
      grafico: {
        labels,
        datasets: [
          {
            label: 'Cantidad Vendida',
            data: cantidades,
            backgroundColor: '#4CAF50',
            yAxisID: 'y',
            barPercentage: 0.4,
            categoryPercentage: 0.45,
          },
          {
            label: 'Subtotal (COP)',
            data: subtotales,
            backgroundColor: '#2196F3',
            yAxisID: 'y1',
            barPercentage: 0.4,
            categoryPercentage: 0.45,
          },
        ],
      },
      titulo: 'Reporte de Ventas por Cultivo y Unidad de Medida',
    };
  };

  useEffect(() => {
    if (chartRef.current && ventas?.length) {
      const checkChart = setInterval(() => {
        const canvas = chartRef.current?.querySelector('canvas');
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setChartRendered(true);
          clearInterval(checkChart);
        }
      }, 100);
      return () => clearInterval(checkChart);
    }
  }, [ventas]);

  const generarReporte = async () => {
    if (!chartRendered || !ventas?.length) return;
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
      doc.save('ventas-cultivo.pdf');
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
        filename: `ventas-cultivo_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`,
      });
    }
    onGenerate();
  };

  const { grafico, titulo } = generarDatos();

  return (
    <div>
      <div ref={chartRef} className="mt-4 bg-gray-50 p-4 rounded-lg">
        <ChartBar
          data={grafico}
          options={{
            responsive: true,
            plugins: {
              title: { display: true, text: titulo, font: { size: 16 } },
              legend: { position: 'top' },
            },
            scales: {
              y: {
                beginAtZero: true,
                title: { display: true, text: 'Cantidad Vendida' },
              },
              y1: {
                position: 'right',
                beginAtZero: true,
                grid: { display: false },
                title: { display: true, text: 'Subtotal (COP)' },
              },
            },
          }}
          height={300}
        />
      </div>
      <button
        onClick={generarReporte}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
        disabled={!chartRendered || !ventas?.length}
      >
        Descargar
      </button>
    </div>
  );
};

export default ReporteVentasCultivo;