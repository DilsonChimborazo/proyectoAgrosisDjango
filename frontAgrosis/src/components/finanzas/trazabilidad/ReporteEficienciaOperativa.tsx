import { useRef } from 'react';
import { ChartScatter } from '@/components/globales/Charts';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { TrazabilidadCultivoReporte } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReporteEficienciaOperativaProps {
  trazabilidadData: TrazabilidadCultivoReporte | undefined;
  formato: 'pdf' | 'excel';
}

const ReporteEficienciaOperativa = ({ trazabilidadData, formato }: ReporteEficienciaOperativaProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Validación inicial
  if (!trazabilidadData) {
    return <p className="text-gray-500 text-center py-4">Seleccione una plantación para generar el reporte</p>;
  }

  const hasInsumos = trazabilidadData.detalle_insumos?.length > 0;

  const generarDatosGraficoEficiencia = () => {
    if (!hasInsumos) {
      return {
        datasets: [
          {
            label: 'Eficiencia Operativa',
            data: [{ x: 0, y: trazabilidadData.total_cantidad_producida_base_acumulado || 0 }],
            backgroundColor: '#4CAF50',
            borderColor: '#388E3C',
            pointRadius: 5,
          },
        ],
      };
    }
    return {
      datasets: [
        {
          label: 'Eficiencia Operativa',
          data: trazabilidadData.detalle_insumos.map(i => ({
            x: i.costo_total || 0,
            y: trazabilidadData.total_cantidad_producida_base_acumulado || 0,
          })),
          backgroundColor: '#4CAF50',
          borderColor: '#388E3C',
          pointRadius: 5,
        },
      ],
    };
  };

  const generarReporte = async () => {
    const columnas = ['Insumo', 'Costo Total', 'Producción Total'];
    const datos = hasInsumos
      ? trazabilidadData.detalle_insumos.map(i => [
          i.nombre || 'Sin nombre',
          new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(i.costo_total || 0),
          `${trazabilidadData.total_cantidad_producida_base_acumulado || 0} ${trazabilidadData.unidad_base || 'N/A'}`,
        ])
      : [['Sin insumos', '0 COP', `${trazabilidadData.total_cantidad_producida_base_acumulado || 0} ${trazabilidadData.unidad_base || 'N/A'}`]];

    if (formato === 'pdf') {
      const doc = new jsPDF();

      // Cargar logos
      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      // Encabezado
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

      // Logo izquierdo
      const logoSize1 = 22;
      const logoY = headerTop + (headerHeight - logoSize1) / 2;
      doc.addImage(logoSena, 'PNG', leftX + (leftSectionWidth - logoSize1) / 2, logoY, logoSize1, logoSize1);

      // Texto central
      const centerContentX = centerX + centerSectionWidth / 2;
      const centerStartY = headerTop + headerHeight / 2;
      const lineHeight = 7;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 80, 60);
      doc.text('CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE', centerContentX, centerStartY - lineHeight, { align: 'center' });
      doc.text('SURCOLOMBIANO', centerContentX, centerStartY, { align: 'center' });
      doc.text('ÁREA PAE', centerContentX, centerStartY + lineHeight, { align: 'center' });

      // Logo derecho
      const logoSize2 = 25;
      doc.addImage(logoKaizen, 'PNG', rightX + (rightSectionWidth - logoSize2) / 2, logoY, logoSize2, logoSize2);

      // Título y fecha
      const infoY = headerTop + headerHeight + 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`Reporte de Eficiencia Operativa - ${trazabilidadData.cultivo || 'Sin cultivo'}`, leftMargin, infoY, { align: 'left' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`, pageWidth - rightMargin, infoY, { align: 'right' });

      // Tabla
      autoTable(doc, {
        startY: infoY + 10,
        head: [columnas],
        body: datos,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 4, halign: 'center', lineWidth: 0.1, font: 'helvetica' },
        headStyles: { fillColor: [0, 120, 100], textColor: 255, fontStyle: 'bold', fontSize: 11 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 60 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
        },
      });

      // Gráfico
      if (chartRef.current && hasInsumos) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const canvas = await html2canvas(chartRef.current);
        const imageData = canvas.toDataURL('image/png');
        const finalY = (doc as any).lastAutoTable?.finalY || (infoY + 10);
        try {
          doc.addImage(imageData, 'PNG', leftMargin, finalY + 10, 180, 80);
        } catch (error) {
          console.error('Error al agregar imagen al PDF:', error);
          doc.text('No se pudo incluir el gráfico en el PDF', leftMargin, finalY + 10);
        }
      } else {
        doc.text(hasInsumos ? 'No se encontró el gráfico para incluir en el PDF' : 'No hay insumos para generar el gráfico', leftMargin, (doc as any).lastAutoTable?.finalY + 10 || (infoY + 20));
      }

      // Pie de página
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano', leftMargin, doc.internal.pageSize.getHeight() - 10);

      doc.save(`reporte_eficiencia_${trazabilidadData.cultivo || 'trazabilidad'}.pdf`);
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Eficiencia Operativa');

      // Cargar logos
      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      // Encabezado
      worksheet.mergeCells('A1:C1');
      worksheet.getCell('A1').value = 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO';
      worksheet.getCell('A1').font = { name: 'Calibri', size: 14, bold: true, color: { argb: '004D3C' } };
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5F5F5' } };
      worksheet.getRow(1).height = 30;

      worksheet.mergeCells('A2:C2');
      worksheet.getCell('A2').value = `ÁREA PAE - Reporte de Eficiencia Operativa - ${trazabilidadData.cultivo || 'Sin cultivo'}`;
      worksheet.getCell('A2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: '006633' } };
      worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(2).height = 25;

      // Logos
      const logoSenaId = workbook.addImage({ base64: logoSena, extension: 'png' });
      worksheet.mergeCells('A3:A4');
      worksheet.addImage(logoSenaId, { tl: { col: 0, row: 2 }, ext: { width: 50, height: 50 } });

      const logoKaizenId = workbook.addImage({ base64: logoKaizen, extension: 'png' });
      worksheet.mergeCells('C3:C4');
      worksheet.addImage(logoKaizenId, { tl: { col: 2, row: 2 }, ext: { width: 50, height: 50 } });

      // Fecha de generación
      worksheet.mergeCells('A5:C5');
      worksheet.getCell('A5').value = `Fecha de generación: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`;
      worksheet.getCell('A5').font = { name: 'Calibri', size: 10, color: { argb: '666666' } };
      worksheet.getCell('A5').alignment = { horizontal: 'right', vertical: 'middle' };
      worksheet.getRow(5).height = 20;

      // Espaciado
      worksheet.addRow([]); // Fila vacía
      worksheet.getRow(6).height = 10;

      // Tabla - Encabezado
      worksheet.columns = [
        { header: 'Insumo', key: 'insumo', width: 30 },
        { header: 'Costo Total', key: 'costo', width: 20 },
        { header: 'Producción Total', key: 'produccion', width: 20 },
      ];
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

      // Tabla - Datos
      datos.forEach((d, index) => {
        const dataRow = worksheet.addRow({ insumo: d[0], costo: d[1], produccion: d[2] });
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

      // Gráfico
      if (chartRef.current && hasInsumos) {
        const canvas = await html2canvas(chartRef.current);
        const imageData = canvas.toDataURL('image/png');
        const imageId = workbook.addImage({ base64: imageData, extension: 'png' });
        worksheet.addImage(imageId, { tl: { col: 0, row: datos.length + 8 }, ext: { width: 500, height: 300 } });
      } else if (!hasInsumos) {
        worksheet.addRow({ insumo: 'Nota: No se incluyó gráfico debido a la falta de datos de insumos.', costo: '', produccion: '' });
      }

      // Pie de página
      const footerRow = datos.length + (chartRef.current && hasInsumos ? 18 : 9);
      worksheet.mergeCells(`A${footerRow}:C${footerRow}`);
      worksheet.getCell(`A${footerRow}`).value = 'Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano';
      worksheet.getCell(`A${footerRow}`).font = { name: 'Calibri', size: 9, color: { argb: '666666' } };
      worksheet.getCell(`A${footerRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(footerRow).height = 20;

      // Generar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reporte_eficiencia_${trazabilidadData.cultivo || 'trazabilidad'}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  const cargarImagenComoBase64 = (url: string): Promise<string> => {
    return fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Reporte de Eficiencia Operativa</h3>
      {hasInsumos ? (
        <div ref={chartRef}>
          <ChartScatter
            data={generarDatosGraficoEficiencia()}
            options={{
              plugins: { title: { display: true, text: 'Eficiencia: Costos vs. Producción', font: { size: 16 } } },
              scales: {
                x: { title: { display: true, text: 'Costo Total (COP)' } },
                y: { title: { display: true, text: `Producción (${trazabilidadData.unidad_base || 'N/A'})` } },
              },
            }}
            height={300}
          />
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No hay insumos registrados, pero puedes descargar un reporte básico.</p>
      )}
      <Button
        text="Descargar Reporte"
        variant="success"
        onClick={generarReporte}
        className="w-full flex justify-center items-center gap-2 hover:bg-green-600 transition-colors"
        icon={Download}
      />
    </div>
  );
};

export default ReporteEficienciaOperativa;