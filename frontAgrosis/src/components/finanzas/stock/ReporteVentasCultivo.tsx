import { useRef, useEffect, useState } from 'react';
import { Venta } from '@/hooks/finanzas/venta/useVenta';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import { ChartBar } from '@/components/globales/Charts';
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
      cantidad: d.cantidad,
      subtotal: d.subtotal,
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
      columnas: ['Cultivo', 'Unidad', 'Cantidad Vendida', 'Subtotal (COP)', 'Fechas'],
      datos: datos.map(d => [
        d.cultivo,
        d.unidad,
        d.cantidad.toFixed(2),
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(d.subtotal),
        d.fechas,
      ]),
      grafico: {
        labels,
        datasets: [
          {
            label: 'Cantidad Vendida',
            data: cantidades,
            backgroundColor: '#4CAF50',
            stack: 'Stack 0',
          },
          {
            label: 'Subtotal (COP)',
            data: subtotales,
            backgroundColor: '#2196F3',
            stack: 'Stack 1',
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
    if (!chartRendered) return;
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
        try {
          const canvas = await html2canvas(chartRef.current, { scale: 2, logging: false, useCORS: true });
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 15, (doc as any).lastAutoTable.finalY + 10, 180, 100);
        } catch (error) {
          doc.text('No se pudo incluir el gráfico', 15, (doc as any).lastAutoTable.finalY + 10);
        }
      }

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano', leftMargin, doc.internal.pageSize.getHeight() - 10);
      doc.save('ventas-cultivo.pdf');
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Ventas Cultivo');

      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      worksheet.mergeCells('A1:E1');
      worksheet.getCell('A1').value = 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO';
      worksheet.getCell('A1').font = { name: 'Calibri', size: 14, bold: true, color: { argb: '004D3C' } };
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5F5F5' } };
      worksheet.getRow(1).height = 30;

      worksheet.mergeCells('A2:E2');
      worksheet.getCell('A2').value = `ÁREA PAE - ${titulo}`;
      worksheet.getCell('A2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: '006633' } };
      worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(2).height = 25;

      const logoSenaId = workbook.addImage({ base64: logoSena, extension: 'png' });
      worksheet.mergeCells('A3:A4');
      worksheet.addImage(logoSenaId, { tl: { col: 0, row: 2 }, ext: { width: 50, height: 50 } });

      const logoKaizenId = workbook.addImage({ base64: logoKaizen, extension: 'png' });
      worksheet.mergeCells('E3:E4');
      worksheet.addImage(logoKaizenId, { tl: { col: 4, row: 2 }, ext: { width: 50, height: 50 } });

      worksheet.mergeCells('A5:E5');
      worksheet.getCell('A5').value = `Fecha de generación: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`;
      worksheet.getCell('A5').font = { name: 'Calibri', size: 10, color: { argb: '666666' } };
      worksheet.getCell('A5').alignment = { horizontal: 'right', vertical: 'middle' };
      worksheet.getRow(5).height = 20;

      worksheet.addRow([]);
      worksheet.getRow(6).height = 10;

      worksheet.columns = columnas.map((header, index) => ({
        header,
        key: `col${index}`,
        width: 25,
      }));
      const headerRow = worksheet.getRow(7);
      headerRow.values = columnas;
      headerRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '007864' } };
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: '004D3C' } },
          left: { style: 'thin', color: { argb: '004D3C' } },
          bottom: { style: 'thin', color: { argb: '004D3C' } },
          right: { style: 'thin', color: { argb: '004D3C' } },
        };
      });
      headerRow.height = 25;

      datos.forEach((d, index) => {
        const dataRow = worksheet.addRow(d.reduce((acc, val, i) => ({ ...acc, [`col${i}`]: val }), {}));
        dataRow.eachCell(cell => {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.font = { name: 'Calibri', size: 10 };
          cell.border = {
            top: { style: 'thin', color: { argb: '004D3C' } },
            left: { style: 'thin', color: { argb: '004D3C' } },
            bottom: { style: 'thin', color: { argb: '004D3C' } },
            right: { style: 'thin', color: { argb: '004D3C' } },
          };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: index % 2 === 0 ? 'F7F7F7' : 'FFFFFF' } };
        });
        dataRow.height = 20;
      });

      if (chartRef.current) {
        try {
          const canvas = await html2canvas(chartRef.current, { scale: 2 });
          const imageData = canvas.toDataURL('image/png');
          const imageId = workbook.addImage({ base64: imageData, extension: 'png' });
          worksheet.addImage(imageId, { tl: { col: 0, row: datos.length + 8 }, ext: { width: 500, height: 300 } });
        } catch (error) {
          worksheet.addRow({ col0: 'Nota: No se pudo incluir el gráfico comparativo' });
        }
      }

      const footerRow = datos.length + (chartRef.current ? 18 : 9);
      worksheet.mergeCells(`A${footerRow}:E${footerRow}`);
      worksheet.getCell(`A${footerRow}`).value = 'Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano';
      worksheet.getCell(`A${footerRow}`).font = { name: 'Calibri', size: 9, color: { argb: '666666' } };
      worksheet.getCell(`A${footerRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(footerRow).height = 20;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ventas-cultivo.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
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
              y: { beginAtZero: true, stacked: true },
              y1: { position: 'right', beginAtZero: true, grid: { display: false } },
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