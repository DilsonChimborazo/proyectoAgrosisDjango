import { useRef } from 'react';
import { ChartBar } from '@/components/globales/Charts';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { SnapshotTrazabilidad } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ReporteComparacionesProps {
  ordenarSnapshots: SnapshotTrazabilidad[];
  comparando: number[];
  formato: 'pdf' | 'excel';
}

const ReporteComparaciones = ({ ordenarSnapshots, comparando, formato }: ReporteComparacionesProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!ordenarSnapshots || !ordenarSnapshots.length || !comparando.length) {
    return <p className="text-gray-500 text-center py-4">Seleccione al menos un snapshot para comparar</p>;
  }

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

  const generarReporte = async () => {
    const columnas = ['Snapshot', 'Cultivo', 'Fecha', 'Relación B/C', 'Balance'];
    const datos = ordenarSnapshots.map(s => [
      `v${s.version}`,
      s.datos.cultivo || 'Sin cultivo',
      new Date(s.fecha_registro).toLocaleDateString('es-CO'),
      (s.datos.beneficio_costo_acumulado ?? 0).toFixed(2),
      new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
        (s.datos.ingresos_ventas_acumulado || 0) -
        ((s.datos.costo_mano_obra_acumulado || 0) +
         (s.datos.egresos_insumos_acumulado || 0) +
         (s.datos.depreciacion_herramientas_acumulada || 0))
      ),
    ]);

    if (formato === 'pdf') {
      const doc = new jsPDF();

      // Cargar logos
      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      // Dimensiones de la página
      const pageWidth = doc.internal.pageSize.getWidth();
      const headerTop = 10;
      const headerHeight = 30;
      const leftMargin = 14;
      const rightMargin = 15;
      const usableWidth = pageWidth - leftMargin * 2;
      const leftSectionWidth = usableWidth * 0.15;
      const centerSectionWidth = usableWidth * 0.70;
      const rightSectionWidth = usableWidth * 0.15;
      const leftX = leftMargin;
      const centerX = leftMargin + leftSectionWidth;
      const rightX = leftMargin + leftSectionWidth + centerSectionWidth;

      // Contenedor principal
      doc.setFillColor(245, 245, 245);
      doc.rect(leftX, headerTop, usableWidth, headerHeight, 'F');
      doc.setLineWidth(0.2);
      doc.setDrawColor(0, 120, 100);
      doc.rect(leftX, headerTop, usableWidth, headerHeight);

      // Líneas divisorias
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
      doc.setTextColor(0, 120, 100);
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
      doc.text('Reporte de Comparaciones de Snapshots', leftMargin, infoY, { align: 'left' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-CO')}`, pageWidth - rightMargin, infoY, { align: 'right' });

      // Tabla
      autoTable(doc, {
        startY: headerTop + headerHeight + 16,
        head: [columnas],
        body: datos,
        theme: 'striped',
        styles: {
          fontSize: 10,
          cellPadding: 4,
          halign: 'center',
          lineWidth: 0.1,
          font: 'helvetica',
        },
        headStyles: {
          fillColor: [0, 120, 100],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Gráfico
      if (chartRef.current) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const canvas = await html2canvas(chartRef.current, { scale: 3 });
        const imageData = canvas.toDataURL('image/png', 1.0);
        const finalY = (doc as any).lastAutoTable?.finalY || 40;
        try {
          doc.addImage(imageData, 'PNG', leftMargin, finalY + 10, 180, 80);
        } catch (error) {
          console.error('Error al agregar imagen al PDF:', error);
          doc.text('No se pudo incluir el gráfico en el PDF', leftMargin, finalY + 10);
        }
      } else {
        doc.text('No se encontró el gráfico para incluir en el PDF', leftMargin, (doc as any).lastAutoTable?.finalY + 10 || 50);
      }

      doc.save('reporte_comparaciones_snapshots.pdf');
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Comparaciones Snapshots');

      // Cargar logos
      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      // Configurar anchos de columnas para simetría
      worksheet.columns = [
        { key: 'snapshot', width: 15 },
        { key: 'cultivo', width: 30 },
        { key: 'fecha', width: 20 },
        { key: 'bc', width: 15 },
        { key: 'balance', width: 25 },
      ];

      // Configurar alto de filas para el encabezado
      worksheet.getRow(1).height = 60;
      worksheet.getRow(2).height = 20;
      worksheet.getRow(4).height = 30;
      worksheet.getRow(5).height = 30;

      // Encabezado con logos y texto
      worksheet.mergeCells('A1:E1');
      const logoSenaId = workbook.addImage({ base64: logoSena, extension: 'png' });
      worksheet.addImage(logoSenaId, { tl: { col: 0, row: 0 }, ext: { width: 50, height: 50 } });

      worksheet.mergeCells('B1:D1');
      worksheet.getCell('B1').value = 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO\nÁREA PAE';
      worksheet.getCell('B1').alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      worksheet.getCell('B1').font = { name: 'Calibri', size: 14, bold: true, color: { argb: '004B3D' } };
      worksheet.getCell('B1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F0F7F4' } };

      const logoKaizenId = workbook.addImage({ base64: logoKaizen, extension: 'png' });
      worksheet.addImage(logoKaizenId, { tl: { col: 4, row: 0 }, ext: { width: 50, height: 50 } });

      // Subtítulo
      worksheet.mergeCells('A2:E2');
      worksheet.getCell('A2').value = 'Reporte de Comparaciones de Snapshots - Sector Agropecuario';
      worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: '004B3D' } };
      worksheet.getCell('A2').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6EFEA' } };
      worksheet.getCell('A2').border = {
        bottom: { style: 'medium', color: { argb: '004B3D' } },
      };

      // Fecha
      worksheet.mergeCells('A4:E4');
      worksheet.getCell('A4').value = `Fecha de generación: ${new Date().toLocaleDateString('es-CO')} ${new Date().toLocaleTimeString('es-CO')}`;
      worksheet.getCell('A4').alignment = { horizontal: 'right', vertical: 'middle' };
      worksheet.getCell('A4').font = { name: 'Calibri', size: 10, italic: true, color: { argb: '666666' } };
      worksheet.getCell('A4').border = {
        bottom: { style: 'thin', color: { argb: '004B3D' } },
      };

      // Espaciado
      worksheet.addRow([]);

      // Encabezado de la tabla
      const headerRow = worksheet.addRow(columnas);
      headerRow.eachCell(cell => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '004B3D' } };
        cell.font = { name: 'Calibri', size: 11, bold: true, color: { argb: 'FFFFFF' } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = {
          top: { style: 'thin', color: { argb: '004B3D' } },
          left: { style: 'thin', color: { argb: '004B3D' } },
          bottom: { style: 'thin', color: { argb: '004B3D' } },
          right: { style: 'thin', color: { argb: '004B3D' } },
        };
      });
      headerRow.height = 25;

      // Datos de la tabla
      datos.forEach((row, index) => {
        const dataRow = worksheet.addRow(row);
        dataRow.eachCell(cell => {
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.font = { name: 'Calibri', size: 10, color: { argb: '333333' } };
          cell.border = {
            top: { style: 'thin', color: { argb: 'D3D3D3' } },
            left: { style: 'thin', color: { argb: 'D3D3D3' } },
            bottom: { style: 'thin', color: { argb: 'D3D3D3' } },
            right: { style: 'thin', color: { argb: 'D3D3D3' } },
          };
          if (index % 2 === 0) {
            cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F7FAF8' } };
          }
        });
        dataRow.height = 22;
      });

      // Gráfico
      if (chartRef.current) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const canvas = await html2canvas(chartRef.current, { scale: 4 });
        const imageData = canvas.toDataURL('image/png', 1.0);
        const imageId = workbook.addImage({ base64: imageData, extension: 'png' });
        const startRow = datos.length + 10;
        worksheet.mergeCells(`A${startRow}:E${startRow + 13}`);
        worksheet.addImage(imageId, { tl: { col: 0, row: startRow }, ext: { width: 600, height: 350 } });
      }

      // Pie de página
      const footerRow = worksheet.addRow(['']);
      footerRow.height = 20;
      worksheet.mergeCells(`A${footerRow.number}:E${footerRow.number}`);
      worksheet.getCell(`A${footerRow.number}`).value = 'Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano';
      worksheet.getCell(`A${footerRow.number}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell(`A${footerRow.number}`).font = { name: 'Calibri', size: 9, italic: true, color: { argb: '666666' } };
      worksheet.getCell(`A${footerRow.number}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E6EFEA' } };
      worksheet.getCell(`A${footerRow.number}`).border = {
        top: { style: 'thin', color: { argb: '004B3D' } },
      };

      // Generar archivo
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Reporte_Comparaciones_Snapshots_Agropecuario.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">Reporte de Comparaciones de Snapshots</h3>
      <div ref={chartRef}>
        <ChartBar
          data={{
            labels: ordenarSnapshots.map(s => `Snapshot v${s.version} (${s.datos.cultivo || 'Sin cultivo'})`),
            datasets: [
              {
                label: 'Relación B/C',
                data: ordenarSnapshots.map(s => s.datos.beneficio_costo_acumulado || 0),
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1,
              },
              {
                label: 'Balance',
                data: ordenarSnapshots.map(s =>
                  (s.datos.ingresos_ventas_acumulado || 0) -
                  ((s.datos.costo_mano_obra_acumulado || 0) +
                   (s.datos.egresos_insumos_acumulado || 0) +
                   (s.datos.depreciacion_herramientas_acumulada || 0))
                ),
                backgroundColor: '#2196F3',
                borderColor: '#1976D2',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              title: { display: true, text: 'Comparación de Snapshots - Sector Agropecuario', font: { size: 18 } },
              legend: { position: 'top' },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
          height={350}
        />
      </div>
      <Button
        text="Descargar Reporte"
        variant="success"
        onClick={generarReporte}
        className="w-full flex justify-center items-center gap-2 hover:bg-green-600 transition-colors py-3"
        icon={Download}
      />
    </div>
  );
};

export default ReporteComparaciones;