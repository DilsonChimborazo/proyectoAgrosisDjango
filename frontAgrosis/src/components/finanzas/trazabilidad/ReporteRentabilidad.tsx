import { useRef } from 'react';
import { ChartBar } from '@/components/globales/Charts';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { TrazabilidadCultivoReporte } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReporteRentabilidadProps {
  trazabilidadData: TrazabilidadCultivoReporte | undefined;
  formato: 'pdf' | 'excel';
}

const ReporteRentabilidad = ({ trazabilidadData, formato }: ReporteRentabilidadProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Validación inicial
  if (!trazabilidadData) {
    return <p className="text-gray-500 text-center py-4">Seleccione una plantación para generar el reporte</p>;
  }

  const generarDatosGraficoCostos = () => ({
    labels: ['Mano de Obra', 'Insumos', 'Depreciación'],
    datasets: [
      {
        label: 'Costos',
        data: [
          trazabilidadData.costo_mano_obra_acumulado || 0,
          trazabilidadData.egresos_insumos_acumulado || 0,
          trazabilidadData.depreciacion_herramientas_acumulada || 0,
        ],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
        borderColor: ['#388E3C', '#1976D2', '#F57C00'],
        borderWidth: 1,
      },
    ],
  });

  const generarReporte = async () => {
    const columnas = ['Métrica', 'Valor'];
    const datos = [
      ['Relación B/C', (trazabilidadData.beneficio_costo_acumulado ?? 0).toFixed(2)],
      [
        'Balance',
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
          (trazabilidadData.ingresos_ventas_acumulado || 0) -
            ((trazabilidadData.costo_mano_obra_acumulado || 0) +
              (trazabilidadData.egresos_insumos_acumulado || 0) +
              (trazabilidadData.depreciacion_herramientas_acumulada || 0))
        ),
      ],
      [
        'Costo Mano de Obra',
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.costo_mano_obra_acumulado || 0),
      ],
      [
        'Costo Insumos',
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.egresos_insumos_acumulado || 0),
      ],
      [
        'Depreciación Herramientas',
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.depreciacion_herramientas_acumulada || 0),
      ],
      [
        'Ingresos por Ventas',
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.ingresos_ventas_acumulado || 0),
      ],
    ];

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
      doc.text(`Reporte de Rentabilidad - ${trazabilidadData.cultivo || 'Sin cultivo'}`, leftMargin, infoY, { align: 'left' });
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
          0: { cellWidth: 40 },
          1: { cellWidth: 50 },
        },
      });

      // Gráfico
      if (chartRef.current) {
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
        doc.text('No se encontró el gráfico para incluir en el PDF', leftMargin, (doc as any).lastAutoTable?.finalY + 10 || (infoY + 20));
      }

      // Pie de página
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano', leftMargin, doc.internal.pageSize.getHeight() - 10);

      doc.save(`reporte_rentabilidad_${trazabilidadData.cultivo || 'trazabilidad'}.pdf`);
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Rentabilidad');

      // Cargar logos
      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      // Encabezado
      worksheet.mergeCells('A1:B1');
      worksheet.getCell('A1').value = 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO';
      worksheet.getCell('A1').font = { name: 'Calibri', size: 14, bold: true, color: { argb: '004D3C' } };
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5F5F5' } };
      worksheet.getRow(1).height = 30;

      worksheet.mergeCells('A2:B2');
      worksheet.getCell('A2').value = `ÁREA PAE - Reporte de Rentabilidad - ${trazabilidadData.cultivo || 'Sin cultivo'}`;
      worksheet.getCell('A2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: '006633' } };
      worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(2).height = 25;

      // Logos
      const logoSenaId = workbook.addImage({ base64: logoSena, extension: 'png' });
      worksheet.mergeCells('A3:A4');
      worksheet.addImage(logoSenaId, { tl: { col: 0, row: 2 }, ext: { width: 50, height: 50 } });

      const logoKaizenId = workbook.addImage({ base64: logoKaizen, extension: 'png' });
      worksheet.mergeCells('B3:B4');
      worksheet.addImage(logoKaizenId, { tl: { col: 1, row: 2 }, ext: { width: 50, height: 50 } });

      // Fecha de generación
      worksheet.mergeCells('A5:B5');
      worksheet.getCell('A5').value = `Fecha de generación: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`;
      worksheet.getCell('A5').font = { name: 'Calibri', size: 10, color: { argb: '666666' } };
      worksheet.getCell('A5').alignment = { horizontal: 'right', vertical: 'middle' };
      worksheet.getRow(5).height = 20;

      // Espaciado
      worksheet.addRow([]); // Fila vacía
      worksheet.getRow(6).height = 10;

      // Tabla - Encabezado
      worksheet.columns = [
        { header: 'Métrica', key: 'metrica', width: 30 },
        { header: 'Valor', key: 'valor', width: 20 },
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
        const dataRow = worksheet.addRow({ metrica: d[0], valor: d[1] });
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
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current);
        const imageData = canvas.toDataURL('image/png');
        const imageId = workbook.addImage({ base64: imageData, extension: 'png' });
        worksheet.addImage(imageId, { tl: { col: 0, row: datos.length + 8 }, ext: { width: 500, height: 300 } });
      }

      // Pie de página
      const footerRow = datos.length + 18;
      worksheet.mergeCells(`A${footerRow}:B${footerRow}`);
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
      a.download = `reporte_rentabilidad_${trazabilidadData.cultivo || 'trazabilidad'}.xlsx`;
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
      <h3 className="text-lg font-semibold text-gray-800">Reporte de Rentabilidad</h3>
      <div ref={chartRef}>
        <ChartBar
          data={generarDatosGraficoCostos()}
          options={{
            plugins: { title: { display: true, text: 'Distribución de Costos', font: { size: 16 } } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Costo (COP)' } } },
          }}
          height={300}
        />
      </div>
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

export default ReporteRentabilidad;