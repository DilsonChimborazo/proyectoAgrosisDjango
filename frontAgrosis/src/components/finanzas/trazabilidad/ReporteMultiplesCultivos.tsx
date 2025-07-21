import { useRef, useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { ChartBar } from '@/components/globales/Charts';
import ExcelJS from 'exceljs';
import html2canvas from 'html2canvas';
import { Download, Check, X, ChevronDown, Search } from 'lucide-react';
import Button from '@/components/globales/Button';
import { Plantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cargarImagenComoBase64 } from './utils';

interface ReporteMultiplesCultivosProps {
  plantaciones: Plantacion[] | undefined;
  plantacionSeleccionada: number | null; // Nueva prop para inicialización
  formato: 'pdf' | 'excel';
}

interface TrazabilidadData {
  cultivo: string;
  beneficio_costo_acumulado: number;
  ingresos_ventas_acumulado: number;
  costo_mano_obra_acumulado: number;
  egresos_insumos_acumulado: number;
  depreciacion_herramientas_acumulada: number;
}

const useTrazabilidadMultiples = (plantacionIds: number[]) => {
  return useQueries({
    queries: plantacionIds.map(id => ({
      queryKey: ['trazabilidad', id],
      queryFn: async (): Promise<{ datos: TrazabilidadData }> => {
        try {
          const response = await axios.get(`/api/trazabilidad/${id}`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
          });

          if (typeof response.data === 'string' && response.data.startsWith('<!doctype html>')) {
            throw new Error('El servidor devolvió una página HTML en lugar de datos JSON');
          }

          return response.data;
        } catch (error) {
          console.error(`Error al obtener datos para plantación ${id}:`, error);
          throw error;
        }
      },
      enabled: !!id,
      retry: false,
    })),
  });
};

const ReporteMultiplesCultivos = ({ plantaciones, plantacionSeleccionada, formato }: ReporteMultiplesCultivosProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [chartRendered, setChartRendered] = useState(false);

  // Inicializar seleccionados con plantacionSeleccionada si existe
  useEffect(() => {
    if (plantacionSeleccionada && !seleccionados.includes(plantacionSeleccionada)) {
      setSeleccionados(prev => [plantacionSeleccionada, ...prev]);
    }
  }, [plantacionSeleccionada]);

  const trazabilidadQueries = useTrazabilidadMultiples(seleccionados);
  const isLoading = trazabilidadQueries.some(q => q.isLoading);
  const isError = trazabilidadQueries.some(q => q.isError);
  const trazabilidadData = trazabilidadQueries.map(q => q.data?.datos).filter((d): d is TrazabilidadData => !!d);

  const plantacionesFiltradas = plantaciones?.filter(plantacion =>
    plantacion.fk_id_cultivo.nombre_cultivo.toLowerCase().includes(busqueda.toLowerCase()) ||
    plantacion.id.toString().includes(busqueda)
  ) || [];

  useEffect(() => {
    if (chartRef.current && trazabilidadData.length > 0) {
      const checkChart = setInterval(() => {
        const canvas = chartRef.current?.querySelector('canvas');
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setChartRendered(true);
          clearInterval(checkChart);
        }
      }, 100);
      return () => clearInterval(checkChart);
    }
  }, [trazabilidadData]);

  const toggleTodosFiltrados = () => {
    if (plantacionesFiltradas.length === 0) return;

    const todosSeleccionados = plantacionesFiltradas.every(p => seleccionados.includes(p.id));

    if (todosSeleccionados) {
      setSeleccionados(prev => prev.filter(id => !plantacionesFiltradas.some(p => p.id === id)));
    } else {
      const nuevosIds = plantacionesFiltradas
        .filter(p => !seleccionados.includes(p.id))
        .map(p => p.id);
      setSeleccionados(prev => [...prev, ...nuevosIds]);
    }
  };

  const generarDatosGraficoMultiples = () => {
    if (!trazabilidadData.length) {
      return { labels: [], datasets: [] };
    }

    return {
      labels: trazabilidadData.map(t => t.cultivo || 'Sin cultivo'),
      datasets: [
        {
          label: 'Relación B/C',
          data: trazabilidadData.map(t => t.beneficio_costo_acumulado || 0),
          backgroundColor: '#4CAF50',
          borderColor: '#388E3C',
          borderWidth: 1,
        },
        {
          label: 'Balance',
          data: trazabilidadData.map(t =>
            (t.ingresos_ventas_acumulado || 0) -
            ((t.costo_mano_obra_acumulado || 0) +
              (t.egresos_insumos_acumulado || 0) +
              (t.depreciacion_herramientas_acumulada || 0))
          ),
          backgroundColor: '#2196F3',
          borderColor: '#1976D2',
          borderWidth: 1,
        },
      ],
    };
  };

  const generarReporte = async () => {
    if (!trazabilidadData.length || !chartRendered) return;

    const columnas = ['Cultivo', 'Relación B/C', 'Balance'];
    const datos = trazabilidadData.map(t => [
      t.cultivo || 'Sin cultivo',
      (t.beneficio_costo_acumulado ?? 0).toFixed(2),
      new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
      }).format(
        (t.ingresos_ventas_acumulado || 0) -
        ((t.costo_mano_obra_acumulado || 0) +
          (t.egresos_insumos_acumulado || 0) +
          (t.depreciacion_herramientas_acumulada || 0))
      ),
    ]);

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
      doc.text('Reporte de Múltiples Cultivos', leftMargin, infoY, { align: 'left' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`, pageWidth - rightMargin, infoY, { align: 'right' });

      autoTable(doc, {
        startY: infoY + 10,
        head: [columnas],
        body: datos,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 4, halign: 'center', lineWidth: 0.1, font: 'helvetica' },
        headStyles: { fillColor: [0, 120, 100], textColor: 255, fontStyle: 'bold', fontSize: 11 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 50 },
          1: { cellWidth: 30 },
          2: { cellWidth: 40 },
        },
      });

      if (chartRef.current) {
        try {
          const canvas = await html2canvas(chartRef.current, {
            scale: 2,
            logging: false,
            useCORS: true,
          });
          const imgData = canvas.toDataURL('image/png');
          doc.addImage(imgData, 'PNG', 15, (doc as any).lastAutoTable.finalY + 10, 180, 100);
        } catch (error) {
          console.error('Error al capturar el gráfico:', error);
          doc.text('No se pudo incluir el gráfico', 15, (doc as any).lastAutoTable.finalY + 10);
        }
      }

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano', leftMargin, doc.internal.pageSize.getHeight() - 10);

      doc.save('reporte_multiples_cultivos.pdf');
    } else {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Múltiples Cultivos');

      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      worksheet.mergeCells('A1:C1');
      worksheet.getCell('A1').value = 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO';
      worksheet.getCell('A1').font = { name: 'Calibri', size: 14, bold: true, color: { argb: '004D3C' } };
      worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getCell('A1').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'F5F5F5' } };
      worksheet.getRow(1).height = 30;

      worksheet.mergeCells('A2:C2');
      worksheet.getCell('A2').value = 'ÁREA PAE - Reporte de Múltiples Cultivos';
      worksheet.getCell('A2').font = { name: 'Calibri', size: 12, bold: true, color: { argb: '006633' } };
      worksheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(2).height = 25;

      const logoSenaId = workbook.addImage({ base64: logoSena, extension: 'png' });
      worksheet.mergeCells('A3:A4');
      worksheet.addImage(logoSenaId, { tl: { col: 0, row: 2 }, ext: { width: 50, height: 50 } });

      const logoKaizenId = workbook.addImage({ base64: logoKaizen, extension: 'png' });
      worksheet.mergeCells('C3:C4');
      worksheet.addImage(logoKaizenId, { tl: { col: 2, row: 2 }, ext: { width: 50, height: 50 } });

      worksheet.mergeCells('A5:C5');
      worksheet.getCell('A5').value = `Fecha de generación: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`;
      worksheet.getCell('A5').font = { name: 'Calibri', size: 10, color: { argb: '666666' } };
      worksheet.getCell('A5').alignment = { horizontal: 'right', vertical: 'middle' };
      worksheet.getRow(5).height = 20;

      worksheet.addRow([]);
      worksheet.getRow(6).height = 10;

      worksheet.columns = [
        { header: 'Cultivo', key: 'cultivo', width: 30 },
        { header: 'Relación B/C', key: 'bc', width: 15 },
        { header: 'Balance', key: 'balance', width: 20 },
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

      datos.forEach((d, index) => {
        const dataRow = worksheet.addRow({ cultivo: d[0], bc: d[1], balance: d[2] });
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
          console.error('Error al capturar el gráfico:', error);
          worksheet.addRow({ cultivo: 'Nota: No se pudo incluir el gráfico comparativo', bc: '', balance: '' });
        }
      }

      const footerRow = datos.length + (chartRef.current ? 18 : 9);
      worksheet.mergeCells(`A${footerRow}:C${footerRow}`);
      worksheet.getCell(`A${footerRow}`).value = 'Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano';
      worksheet.getCell(`A${footerRow}`).font = { name: 'Calibri', size: 9, color: { argb: '666666' } };
      worksheet.getCell(`A${footerRow}`).alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(footerRow).height = 20;

      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'reporte_multiples_cultivos.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Reporte de Múltiples Cultivos</h3>

      <div className="relative">
        <div
          className="flex items-center justify-between p-3 border rounded-lg cursor-pointer bg-gray-50"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="text-gray-700">
            {seleccionados.length > 0
              ? `${seleccionados.length} cultivo(s) seleccionado(s)`
              : 'Seleccionar cultivos'}
          </span>
          <ChevronDown className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} size={18} />
        </div>

        {dropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-96 overflow-hidden">
            <div className="p-2 border-b sticky top-0 bg-white">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Buscar cultivos..."
                  className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
              </div>
            </div>

            <div
              className="p-2 border-b cursor-pointer hover:bg-gray-50 flex items-center text-sm"
              onClick={toggleTodosFiltrados}
            >
              <div
                className={`w-5 h-5 border rounded mr-2 flex items-center justify-center
                  ${plantacionesFiltradas.length > 0 && plantacionesFiltradas.every(p => seleccionados.includes(p.id))
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300'}`}
              >
                {plantacionesFiltradas.length > 0 &&
                  plantacionesFiltradas.every(p => seleccionados.includes(p.id)) && <Check size={14} />}
              </div>
              <span>Seleccionar todos los filtrados</span>
            </div>

            <div className="overflow-y-auto max-h-64">
              {plantacionesFiltradas.length > 0 ? (
                plantacionesFiltradas.map(plantacion => (
                  <div
                    key={plantacion.id}
                    className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between border-b"
                    onClick={() => {
                      setSeleccionados(prev =>
                        prev.includes(plantacion.id)
                          ? prev.filter(id => id !== plantacion.id)
                          : [...prev, plantacion.id]
                      );
                    }}
                  >
                    <div>
                      <p className="font-medium">{plantacion.fk_id_cultivo.nombre_cultivo}</p>
                      <p className="text-xs text-gray-500">
                        Plantado: {new Date(plantacion.fecha_plantacion).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 border rounded flex items-center justify-center
                        ${seleccionados.includes(plantacion.id)
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300'}`}
                    >
                      {seleccionados.includes(plantacion.id) && <Check size={14} />}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {busqueda ? 'No se encontraron resultados' : 'No hay cultivos disponibles'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {seleccionados.length > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Cultivos seleccionados:</h4>
          <div className="flex flex-wrap gap-2">
            {plantaciones
              ?.filter(p => seleccionados.includes(p.id))
              .map(plantacion => (
                <div key={plantacion.id} className="flex items-center bg-white px-3 py-1 rounded-full border text-sm">
                  {plantacion.fk_id_cultivo.nombre_cultivo}
                  <X
                    size={14}
                    className="ml-2 text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={e => {
                      e.stopPropagation();
                      setSeleccionados(prev => prev.filter(id => id !== plantacion.id));
                    }}
                  />
                </div>
              ))}
          </div>
        </div>
      )}

      {seleccionados.length > 0 && !isLoading && !isError && (
        <div ref={chartRef} className="mt-4">
          <ChartBar
            data={generarDatosGraficoMultiples()}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: 'Comparación de Cultivos', font: { size: 16 } },
                legend: { position: 'top' },
              },
              scales: { y: { beginAtZero: true } },
            }}
            height={300}
          />
        </div>
      )}

      {isLoading && <p className="text-center py-4 text-gray-500">Cargando datos de los cultivos seleccionados...</p>}
      {isError && (
        <p className="text-center py-4 text-red-500">
          Error al cargar los datos. Verifica que la API esté disponible y devolviendo datos JSON válidos.
        </p>
      )}
      {!isLoading && !isError && seleccionados.length === 0 && (
        <p className="text-center py-4 text-gray-500">Seleccione al menos un cultivo para generar el reporte</p>
      )}
      {!isLoading && !isError && seleccionados.length > 0 && trazabilidadData.length === 0 && (
        <p className="text-center py-4 text-yellow-600">
          No se encontraron datos de trazabilidad para los cultivos seleccionados.
        </p>
      )}

      <Button
        text={isLoading ? 'Generando reporte...' : 'Descargar Reporte'}
        variant="success"
        onClick={generarReporte}
        className="w-full flex justify-center items-center gap-2 hover:bg-green-600 transition-colors"
        icon={Download}
        disabled={isLoading || seleccionados.length === 0 || trazabilidadData.length === 0 || !chartRendered}
      />
    </div>
  );
};

export default ReporteMultiplesCultivos;