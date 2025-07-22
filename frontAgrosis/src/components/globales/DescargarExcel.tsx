import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';

interface ExcelData {
  columnas: string[];
  datos: any[][];
  titulo: string;
  nombreArchivo?: string;
  logoIzquierdo?: string;
  logoDerecho?: string;
  graficoRef?: React.RefObject<HTMLDivElement | null>;
  piePagina?: string;
}

const setCellStyle = (
  cell: ExcelJS.Cell,
  font: Partial<ExcelJS.Font>,
  alignment: Partial<ExcelJS.Alignment>,
  fill?: ExcelJS.Fill,
  border?: Partial<ExcelJS.Borders>
) => {
  cell.font = font;
  cell.alignment = alignment;
  if (fill) cell.fill = fill;
  if (border) cell.border = border;
};

const addImage = (
  ws: ExcelJS.Worksheet,
  imageId: number,
  col1: number,
  row1: number,
  col2: number,
  row2: number
) => {
  (ws as any).addImage(imageId, {
    tl: { col: col1, row: row1 },
    br: { col: col2, row: row2 },
    editAs: 'oneCell'
  });
};

const autoAdjustColumns = (ws: ExcelJS.Worksheet) => {
  ws.columns?.forEach(col => {
    let maxLen = 10;
    col.eachCell?.({ includeEmpty: true }, cell => {
      const len = cell.value ? String(cell.value).length : 0;
      if (len > maxLen) maxLen = len;
    });
    col.width = Math.min(maxLen + 4, 20);
  });
};

const downloadExcel = async (wb: ExcelJS.Workbook, name: string) => {
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${name}.xlsx`;
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 200);
};

export const DescargarExcel = async ({
  columnas,
  datos,
  titulo,
  nombreArchivo = 'reporte',
  logoIzquierdo,
  logoDerecho,
  graficoRef,
  piePagina = 'Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano'
}: ExcelData) => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Reporte', {
    pageSetup: { fitToPage: true, fitToWidth: 1, fitToHeight: 0 }
  });

  ws.columns = new Array(7).fill({ width: 18 });

  const safeMergeCells = (range: string) => {
    try {
      const [start] = range.split(':');
      const startCell = ws.getCell(start);
      if (!startCell.isMerged) {
        ws.mergeCells(range);
      }
    } catch (err) {
      console.error(`Error al fusionar celdas ${range}:`, err);
    }
  };

  // Logos
  if (logoIzquierdo) {
    const imgId = wb.addImage({ base64: logoIzquierdo, extension: 'png' });
    addImage(ws, imgId, 0, 0, 1, 3);
  }
  if (logoDerecho) {
    const imgId = wb.addImage({ base64: logoDerecho, extension: 'png' });
    addImage(ws, imgId, 5, 0, 6, 3);
  }

  // Títulos centrados
  safeMergeCells('A1:G1');
  ws.getRow(1).height = 25;
  ws.getCell('A1').value = 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO';
  setCellStyle(ws.getCell('A1'), { bold: true, size: 14, name: 'Calibri', color: { argb: '004D3C' } }, { horizontal: 'center', vertical: 'middle' });

  safeMergeCells('A2:G2');
  ws.getRow(2).height = 20;
  ws.getCell('A2').value = `ÁREA PAE - ${titulo}`;
  setCellStyle(ws.getCell('A2'), { bold: true, size: 12, name: 'Calibri', color: { argb: '006633' } }, { horizontal: 'center', vertical: 'middle' });

  // Fecha
  safeMergeCells('A4:G4');
  ws.getCell('A4').value = `📅 Fecha de generación: ${new Date().toLocaleDateString('es-CO', { dateStyle: 'medium' })}`;
  setCellStyle(ws.getCell('A4'), { size: 10, color: { argb: '666666' } }, { horizontal: 'center', vertical: 'middle' });

  ws.addRow([]);

  // Tabla
  const header = ws.addRow(columnas);
  header.eachCell(cell => {
    setCellStyle(
      cell,
      { bold: true, size: 11, color: { argb: 'FFFFFF' }, name: 'Calibri' },
      { horizontal: 'center', vertical: 'middle', wrapText: true },
      { type: 'pattern', pattern: 'solid', fgColor: { argb: '007864' } },
      {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    );
  });

  datos.forEach((row, idx) => {
    const dataRow = ws.addRow(row);
    dataRow.eachCell(cell => {
      setCellStyle(
        cell,
        { size: 10, name: 'Calibri' },
        { horizontal: 'center', vertical: 'middle', wrapText: true },
        { type: 'pattern', pattern: 'solid', fgColor: { argb: idx % 2 === 0 ? 'F9F9F9' : 'FFFFFF' } },
        {
          top: { style: 'thin', color: { argb: 'CCCCCC' } },
          left: { style: 'thin', color: { argb: 'CCCCCC' } },
          bottom: { style: 'thin', color: { argb: 'CCCCCC' } },
          right: { style: 'thin', color: { argb: 'CCCCCC' } }
        }
      );
    });
  });

  // Espacio antes del gráfico
  ws.addRow([]);
  ws.addRow([]);

  // Gráfico
  if (graficoRef?.current) {
    try {
      const canvas = await html2canvas(graficoRef.current, {
        scale: 3,
        logging: false,
        useCORS: true,
        width: graficoRef.current.offsetWidth,
        height: graficoRef.current.offsetHeight
      });
      const imgData = canvas.toDataURL('image/png', 1.0);
      const imgId = wb.addImage({ base64: imgData, extension: 'png' });

      const startRow = ws.lastRow?.number! + 2;
      const chartCols = 5;
      const startCol = 1;
      const chartHeight = Math.ceil((graficoRef.current.offsetHeight / graficoRef.current.offsetWidth) * chartCols * 6);

      addImage(ws, imgId, startCol, startRow, startCol + chartCols, startRow + chartHeight);
      for (let i = 0; i <= chartHeight; i++) {
        ws.getRow(startRow + i).height = 15;
      }
    } catch (err) {
      console.error('Error al capturar el gráfico:', err);
      const fallback = ws.addRow(['⚠ No se pudo incluir el gráfico']);
      safeMergeCells(`A${fallback.number}:G${fallback.number}`);
      setCellStyle(fallback.getCell(1), { italic: true, color: { argb: 'FF0000' }, size: 10 }, { horizontal: 'center' });
    }
  }

  // Pie de página
  const footer = ws.addRow([]);
  safeMergeCells(`A${footer.number}:G${footer.number}`);
  ws.getCell(`A${footer.number}`).value = piePagina;
  setCellStyle(ws.getCell(`A${footer.number}`), { italic: true, size: 9, color: { argb: '666666' } }, { horizontal: 'center' });

  autoAdjustColumns(ws);
  await downloadExcel(wb, nombreArchivo);
};
