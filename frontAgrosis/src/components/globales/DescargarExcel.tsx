import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';

interface ExcelColumn {
  header: string;
  key: string;
  width: number;
}

interface ExcelData {
  [key: string]: string | number;
}

interface DescargarExcelProps {
  data: ExcelData[];
  columns: ExcelColumn[];
  title: string;
  subtitle: string;
  logoSenaPath: string;
  logoKaizenPath: string;
  chartRef?: React.RefObject<HTMLElement | null>;
  filename: string;
}

export const DescargarExcel = async ({
  data,
  columns,
  title,
  subtitle,
  logoSenaPath,
  logoKaizenPath,
  chartRef,
  filename,
}: DescargarExcelProps) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Reporte');

  // Helper function to load image as base64
  const loadImageAsBase64 = async (path: string): Promise<string> => {
    try {
      const response = await fetch(path);
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error(`Error loading image ${path}:`, error);
      return '';
    }
  };

  // Load logos
  const logoSena = await loadImageAsBase64(logoSenaPath);
  const logoKaizen = await loadImageAsBase64(logoKaizenPath);

  // Header Section
  worksheet.mergeCells('A1:F1');
  worksheet.getCell('A1').value = title;
  worksheet.getCell('A1').font = { name: 'Calibri', size: 14, bold: true, color: { argb: '004D3C' } };
  worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5F5F5' } };
  worksheet.getRow(1).height = 30;

  worksheet.mergeCells('A2:F2');
  worksheet.getCell('A2').value = subtitle;
  worksheet.getCell('A2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: '006633' } };
  worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(2).height = 25;

  // Logos
  if (logoSena) {
    const logoSenaId = workbook.addImage({ base64: logoSena, extension: 'png' });
    worksheet.mergeCells('A3:A4');
    worksheet.addImage(logoSenaId, { tl: { col: 0, row: 2 }, ext: { width: 50, height: 50 } });
  }

  if (logoKaizen) {
    const logoKaizenId = workbook.addImage({ base64: logoKaizen, extension: 'png' });
    worksheet.mergeCells('F3:F4');
    worksheet.addImage(logoKaizenId, { tl: { col: 5, row: 2 }, ext: { width: 50, height: 50 } });
  }

  // Date
  worksheet.mergeCells('A6:F6');
  worksheet.getCell('A6').value = `Fecha de generación: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`;
  worksheet.getCell('A6').font = { name: 'Calibri', size: 10, color: { argb: '666666' } };
  worksheet.getCell('A6').alignment = { horizontal: 'right', vertical: 'middle' };
  worksheet.getRow(6).height = 20;

  // Spacer
  worksheet.addRow([]);
  worksheet.getRow(7).height = 10;

  // Columns
  worksheet.columns = columns;

  // Header Row
  const headerRow = worksheet.getRow(8);
  headerRow.values = columns.map(col => col.header);
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

  // Data Rows
  data.forEach((rowData, index) => {
    const dataRow = worksheet.addRow(rowData);
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

  // Chart
  if (chartRef?.current) {
    try {
      const canvas = await html2canvas(chartRef.current, { scale: 3, useCORS: true, logging: false });
      const imageData = canvas.toDataURL('image/png', 1.0);
      const imageId = workbook.addImage({ base64: imageData, extension: 'png' });
      const chartStartRow = data.length + 9;
      worksheet.addImage(imageId, { tl: { col: 0, row: chartStartRow }, ext: { width: 500, height: 300 } });
    } catch (error) {
      console.error('Error al capturar el gráfico:', error);
      worksheet.addRow({ cultivo: 'Nota: No se pudo incluir el gráfico comparativo' });
    }
  }

  // Footer (fixed at row 27)
  const footerRow = 27;
  worksheet.mergeCells(`A${footerRow}:F${footerRow}`);
  worksheet.getCell(`A${footerRow}`).value = 'Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano';
  worksheet.getCell(`A${footerRow}`).font = { name: 'Calibri', size: 9, color: { argb: '666666' } };
  worksheet.getCell(`A${footerRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
  worksheet.getRow(footerRow).height = 20;

  // Generate and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};