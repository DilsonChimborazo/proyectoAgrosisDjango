import { useRef, useEffect, useState } from 'react';
import { Produccion } from '@/hooks/finanzas/stock/useStock';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import { ChartBar } from '@/components/globales/Charts';
import { cargarImagenComoBase64 } from '../trazabilidad/utils';

interface ReporteValorInventarioProps {
  producciones: Produccion[] | undefined;
  formato: 'pdf' | 'excel';
  onGenerate: () => void;
}

const ReporteValorInventario = ({ producciones, formato, onGenerate }: ReporteValorInventarioProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartRendered, setChartRendered] = useState(false);

  const parsePrecioSugerido = (precio: string | number | null | undefined): number => {
    if (precio == null) return 0;
    const numero = typeof precio === 'string' ? parseFloat(precio) : precio;
    return isNaN(numero) ? 0 : numero;
  };

  const parseStockDisponible = (stock: unknown): number => {
    if (stock == null || (typeof stock === 'string' && stock.trim() === '')) return 0;
    const numero = typeof stock === 'string' ? parseFloat(stock) : stock;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const generarDatos = () => {
    // Filtrar producciones inválidas y loggear datos para depuración
    const datosValidos = producciones?.filter(p => {
      const isValid = p.stock_disponible != null && !isNaN(parseStockDisponible(p.stock_disponible));
      if (!isValid) {
      }
      return isValid;
    }) || [];

    // Agrupar por cultivo y unidad de medida
    const datosAgrupados = datosValidos.reduce((acc, p) => {
      const cultivo = p.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo';
      const unidad = p.fk_unidad_medida?.nombre_medida || 'N/A';
      const clave = `${cultivo}:${unidad}`;
      const stock = parseStockDisponible(p.stock_disponible);
      const valor = stock * parsePrecioSugerido(p.precio_sugerido_venta);

      if (!acc[clave]) {
        acc[clave] = {
          cultivo,
          unidad,
          stock: 0,
          valor: 0,
        };
      }
      acc[clave].stock += stock;
      acc[clave].valor += valor;
      return acc;
    }, {} as Record<string, { cultivo: string; unidad: string; stock: number; valor: number }>);

    // Convertir a lista para la tabla
    const datos = Object.values(datosAgrupados);


    // Generar datos para el gráfico
    const labels = datos.map(d => `${d.cultivo} (${d.unidad})`);
    const stocks = datos.map(d => d.stock);
    const valores = datos.map(d => d.valor);

    return {
      columnas: ['Cultivo', 'Unidad', 'Stock Disponible', 'Valor Estimado (COP)'],
      datos: datos.map(d => [
        d.cultivo,
        d.unidad,
        d.stock.toFixed(2),
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(d.valor),
      ]),
      grafico: {
        labels,
        datasets: [
          {
            label: 'Stock Disponible',
            data: stocks,
            backgroundColor: '#4CAF50',
            yAxisID: 'y', // Asignar al eje Y izquierdo
            barPercentage: 0.4, // Reducir el ancho de las barras
            categoryPercentage: 0.45, // Espacio entre categorías
          },
          {
            label: 'Valor Estimado (COP)',
            data: valores,
            backgroundColor: '#2196F3',
            yAxisID: 'y1', // Asignar al eje Y derecho
            barPercentage: 0.4,
            categoryPercentage: 0.45,
          },
        ],
      },
      titulo: 'Reporte de Valor de Inventario por Cultivo y Unidad de Medida',
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
      doc.save('valor-inventario.pdf');
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Reporte Valor Inventario');

      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      worksheet.mergeCells('A1:D1');
      worksheet.getCell('A1').value = 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO';
      worksheet.getCell('A1').font = { name: 'Calibri', size: 14, bold: true, color: { argb: '004D3C' } };
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5F5F5' } };
      worksheet.getRow(1).height = 30;

      worksheet.mergeCells('A2:D2');
      worksheet.getCell('A2').value = `ÁREA PAE - ${titulo}`;
      worksheet.getCell('A2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: '006633' } };
      worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(2).height = 25;

      const logoSenaId = workbook.addImage({ base64: logoSena, extension: 'png' });
      worksheet.mergeCells('A3:A4');
      worksheet.addImage(logoSenaId, { tl: { col: 0, row: 2 }, ext: { width: 50, height: 50 } });

      const logoKaizenId = workbook.addImage({ base64: logoKaizen, extension: 'png' });
      worksheet.mergeCells('D3:D4');
      worksheet.addImage(logoKaizenId, { tl: { col: 3, row: 2 }, ext: { width: 50, height: 50 } });

      worksheet.mergeCells('A5:D5');
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
      worksheet.mergeCells(`A${footerRow}:D${footerRow}`);
      worksheet.getCell(`A${footerRow}`).value = 'Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano';
      worksheet.getCell(`A${footerRow}`).font = { name: 'Calibri', size: 9, color: { argb: '666666' } };
      worksheet.getCell(`A${footerRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(footerRow).height = 20;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'valor-inventario.xlsx';
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
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Stock Disponible (unidades)',
                },
              },
              y1: {
                position: 'right',
                beginAtZero: true,
                grid: { display: false },
                title: {
                  display: true,
                  text: 'Valor Estimado (COP)',
                },
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

export default ReporteValorInventario;