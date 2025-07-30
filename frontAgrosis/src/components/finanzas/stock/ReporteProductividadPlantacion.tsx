import { useRef, useEffect, useState } from 'react';
import { Produccion } from '@/hooks/finanzas/venta/useVenta';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { ChartBar } from '@/components/globales/Charts';
import { DescargarExcel } from '@/components/globales/DescargarExcel';
import { cargarImagenComoBase64 } from '../trazabilidad/utils';
import { format } from 'date-fns';

interface ReporteProductividadPlantacionProps {
  producciones: Produccion[] | undefined;
  formato: 'pdf' | 'excel';
  onGenerate: () => void;
}

const ReporteProductividadPlantacion = ({ producciones, formato, onGenerate }: ReporteProductividadPlantacionProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartRendered, setChartRendered] = useState(false);

  const parseCantidadProducida = (cantidad: unknown): number => {
    if (cantidad == null || (typeof cantidad === 'string' && cantidad.trim() === '')) return 0;
    const numero = typeof cantidad === 'string' ? parseFloat(cantidad) : cantidad;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const parseStockDisponible = (stock: unknown): number => {
    if (stock == null || (typeof stock === 'string' && stock.trim() === '')) return 0;
    const numero = typeof stock === 'string' ? parseFloat(stock) : stock;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const parsePrecioSugerido = (precio: unknown): number => {
    if (precio == null || (typeof precio === 'string' && precio.trim() === '')) return 0;
    const numero = typeof precio === 'string' ? parseFloat(precio) : precio;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const generarDatos = () => {
    // Filtrar producciones inválidas
    const datosValidos = producciones?.filter(p => {
      const isValid =
        p.cantidad_producida != null &&
        !isNaN(parseCantidadProducida(p.cantidad_producida)) &&
        p.stock_disponible != null &&
        !isNaN(parseStockDisponible(p.stock_disponible));
      if (!isValid) {
        console.warn('Producción inválida:', p);
      }
      return isValid;
    }) || [];

    // Agrupar por cultivo, nombre de producción y unidad de medida
    const datosAgrupados = datosValidos.reduce((acc, p) => {
      const cultivo = p.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo';
      const nombreProduccion = p.nombre_produccion || 'Sin nombre';
      const unidad = p.fk_unidad_medida?.nombre_medida || 'N/A';
      const clave = `${cultivo}:${nombreProduccion}:${unidad}`;
      const cantidadProducida = parseCantidadProducida(p.cantidad_producida);
      const stock = parseStockDisponible(p.stock_disponible);
      const valor = stock * parsePrecioSugerido(p.precio_sugerido_venta);

      if (!acc[clave]) {
        acc[clave] = {
          cultivo,
          nombreProduccion,
          unidad,
          cantidadProducida: 0,
          stock: 0,
          valor: 0,
        };
      }
      acc[clave].cantidadProducida += cantidadProducida;
      acc[clave].stock += stock;
      acc[clave].valor += valor;
      return acc;
    }, {} as Record<string, { cultivo: string; nombreProduccion: string; unidad: string; cantidadProducida: number; stock: number; valor: number }>);

    // Convertir a lista para la tabla
    const datos = Object.values(datosAgrupados);

    // Generar datos para el gráfico
    const labels = datos.map(d => `${d.cultivo} - ${d.nombreProduccion} (${d.unidad})`);
    const cantidadesProducidas = datos.map(d => d.cantidadProducida);
    const stocks = datos.map(d => d.stock);
    const valores = datos.map(d => d.valor);

    return {
      columnas: [
        { header: 'Producción', key: 'produccion', width: 30 },
        { header: 'Unidad', key: 'unidad', width: 15 },
        { header: 'Cantidad Producida', key: 'cantidadProducida', width: 20 },
        { header: 'Stock Disponible', key: 'stock', width: 20 },
        { header: 'Valor Estimado (COP)', key: 'valor', width: 20 },
      ],
      datos: datos.map(d => ({
        produccion: `${d.cultivo} - ${d.nombreProduccion}`,
        unidad: d.unidad,
        cantidadProducida: d.cantidadProducida.toFixed(2),
        stock: d.stock.toFixed(2),
        valor: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(d.valor),
      })),
      grafico: {
        labels,
        datasets: [
          {
            label: 'Cantidad Producida',
            data: cantidadesProducidas,
            backgroundColor: '#4CAF50',
            yAxisID: 'y',
            barPercentage: 0.3,
            categoryPercentage: 0.4,
          },
          {
            label: 'Stock Disponible',
            data: stocks,
            backgroundColor: '#2196F3',
            yAxisID: 'y',
            barPercentage: 0.3,
            categoryPercentage: 0.4,
          },
          {
            label: 'Valor Estimado (COP)',
            data: valores,
            backgroundColor: '#FF9800',
            yAxisID: 'y1',
            barPercentage: 0.3,
            categoryPercentage: 0.4,
          },
        ],
      },
      titulo: 'Reporte de Productividad por Producción y Unidad de Medida',
    };
  };

  useEffect(() => {
    if (chartRef.current && producciones?.length) {
      const checkChart = setInterval(() => {
        const canvas = chartRef.current?.querySelector('canvas');
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setChartRendered(true);
          clearInterval(checkChart);
        }
      }, 100);
      return () => clearInterval(checkChart);
    }
  }, [producciones]);

  const generarReporte = async () => {
    if (!chartRendered || !producciones?.length) return;
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
      doc.save('productividad-plantacion.pdf');
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
        filename: `productividad-plantacion_${format(new Date(), 'yyyyMMdd_HHmm')}.xlsx`,
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
                title: { display: true, text: 'Cantidad (unidades)' },
              },
              y1: {
                position: 'right',
                beginAtZero: true,
                grid: { display: false },
                title: { display: true, text: 'Valor Estimado (COP)' },
              },
            },
          }}
          height={300}
        />
      </div>
      <button
        onClick={generarReporte}
        className="mt-4 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg w-full"
        disabled={!chartRendered || !producciones?.length}
      >
        Descargar
      </button>
    </div>
  );
};

export default ReporteProductividadPlantacion;