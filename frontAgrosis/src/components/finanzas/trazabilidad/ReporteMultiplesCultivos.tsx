import { useRef, useEffect, useState } from 'react';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { ChartBar } from '@/components/globales/Charts';
import html2canvas from 'html2canvas';
import { Download, X, Search } from 'lucide-react';
import Button from '@/components/globales/Button';
import { Plantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { cargarImagenComoBase64 } from './utils';
import { TrazabilidadCultivoReporte } from '@/components/finanzas/trazabilidad/Types';
import { DescargarExcel } from '@/components/globales/DescargarExcel';


interface ReporteMultiplesCultivosProps {
  plantaciones: Plantacion[] | undefined;
  plantacionSeleccionada: number | null;
  formato: 'pdf' | 'excel';
}

const useTrazabilidadMultiples = (plantacionIds: number[]) => {
  const token = localStorage.getItem('token');
  return useQueries({
    queries: plantacionIds.map(id => ({
      queryKey: ['trazabilidadActual', id],
      queryFn: async (): Promise<TrazabilidadCultivoReporte> => {
        try {
          console.log(`Solicitando datos para plantación ${id}`);
          const response = await axios.get(`/api/trazabilidad/plantacion/${id}/`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(`Datos recibidos para plantación ${id}:`, response.data);
          return {
            ...response.data,
            cultivo: response.data.cultivo || 'Sin cultivo',
            beneficio_costo_acumulado: Number(response.data.beneficio_costo_acumulado) || 0,
            ingresos_ventas_acumulado: Number(response.data.ingresos_ventas_acumulado) || 0,
            costo_mano_obra_acumulado: Number(response.data.costo_mano_obra_acumulado) || 0,
            egresos_insumos_acumulado: Number(response.data.egresos_insumos_acumulado) || 0,
            depreciacion_herramientas_acumulada: Number(response.data.depreciacion_herramientas_acumulada) || 0,
            precio_minimo_venta_por_unidad_acumulado: Number(response.data.precio_minimo_venta_por_unidad_acumulado) || 0,
            total_cantidad_producida_base_acumulado: Number(response.data.total_cantidad_producida_base_acumulado) || 0,
            total_horas: Number(response.data.total_horas) || 0,
            stock_disponible_total: Number(response.data.stock_disponible_total) || 0,
          };
        } catch (error) {
          console.error(`Error al obtener datos para plantación ${id}:`, error);
          throw error;
        }
      },
      enabled: !!id && !!token,
      staleTime: 1000 * 60 * 5,
      retry: false,
    })),
  });
};

const ReporteMultiplesCultivos = ({ plantaciones, plantacionSeleccionada, formato }: ReporteMultiplesCultivosProps) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [seleccionados, setSeleccionados] = useState<number[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [chartRendered, setChartRendered] = useState(false);

  useEffect(() => {
    if (plantacionSeleccionada && !seleccionados.includes(plantacionSeleccionada)) {
      setSeleccionados(prev => [...prev, plantacionSeleccionada]);
    }
  }, [plantacionSeleccionada]);

  const trazabilidadQueries = useTrazabilidadMultiples(seleccionados);
  const isLoading = trazabilidadQueries.some(q => q.isLoading);
  const isError = trazabilidadQueries.some(q => q.isError);
  const trazabilidadData = trazabilidadQueries.map(q => q.data).filter((d): d is TrazabilidadCultivoReporte => !!d);

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

  const generarDatosGraficoMultiples = () => {
    if (!trazabilidadData.length) {
      return { labels: [], datasets: [] };
    }
    return {
      labels: trazabilidadData.map(t => t.cultivo || 'Sin cultivo'),
      datasets: [
        {
          label: 'Costo Mano de Obra',
          data: trazabilidadData.map(t => t.costo_mano_obra_acumulado || 0),
          backgroundColor: '#4CAF50',
          stack: 'Stack 0',
        },
        {
          label: 'Costo Insumos',
          data: trazabilidadData.map(t => t.egresos_insumos_acumulado || 0),
          backgroundColor: '#2196F3',
          stack: 'Stack 0',
        },
        {
          label: 'Depreciación Herramientas',
          data: trazabilidadData.map(t => t.depreciacion_herramientas_acumulada || 0),
          backgroundColor: '#FF9800',
          stack: 'Stack 0',
        },
        {
          label: 'Productividad (kg/hora)',
          data: trazabilidadData.map(t =>
            t.total_horas > 0 ? (t.total_cantidad_producida_base_acumulado / t.total_horas) : 0
          ),
          backgroundColor: '#9C27B0',
          stack: 'Stack 1',
        },
        {
          label: 'Stock Disponible',
          data: trazabilidadData.map(t => t.stock_disponible_total || 0),
          backgroundColor: '#F44336',
          stack: 'Stack 2',
        },
      ],
    };
  };

  const generarReporte = async () => {
    if (!trazabilidadData.length || !chartRendered) return;

    const columnas = [
      { header: 'Cultivo', key: 'cultivo', width: 25 },
      { header: 'Costo por Unidad (COP)', key: 'costo_unidad', width: 20 },
      { header: 'Productividad (kg/hora)', key: 'productividad', width: 20 },
      { header: 'Stock Disponible (kg)', key: 'stock', width: 20 },
      { header: 'Ingresos Totales (COP)', key: 'ingresos', width: 20 },
      { header: 'Costos Totales (COP)', key: 'costos', width: 20 },
    ];

    const datos = trazabilidadData.map(t => ({
      cultivo: t.cultivo || 'Sin cultivo',
      costo_unidad: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
        t.precio_minimo_venta_por_unidad_acumulado || 0
      ),
      productividad: (t.total_horas > 0 ? (t.total_cantidad_producida_base_acumulado / t.total_horas) : 0).toFixed(2),
      stock: (t.stock_disponible_total || 0).toFixed(2),
      ingresos: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
        t.ingresos_ventas_acumulado || 0
      ),
      costos: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
        (t.costo_mano_obra_acumulado || 0) +
        (t.egresos_insumos_acumulado || 0) +
        (t.depreciacion_herramientas_acumulada || 0)
      ),
    }));

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
      doc.text('Reporte de Eficiencia Operativa y Rentabilidad', leftMargin, infoY, { align: 'left' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`, pageWidth - rightMargin, infoY, { align: 'right' });

      autoTable(doc, {
        startY: infoY + 10,
        head: [columnas.map(col => col.header)],
        body: datos.map(d => Object.values(d)),
        theme: 'striped',
        styles: { fontSize: 9, cellPadding: 3, halign: 'center', lineWidth: 0.1, font: 'helvetica' },
        headStyles: { fillColor: [0, 120, 100], textColor: 255, fontStyle: 'bold', fontSize: 10 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
        },
      });

      if (chartRef.current) {
        try {
          const canvas = await html2canvas(chartRef.current, { scale: 3, logging: false, useCORS: true });
          const imgData = canvas.toDataURL('image/png', 1.0);
          doc.addImage(imgData, 'PNG', 15, (doc as any).lastAutoTable.finalY + 10, 180, 100);
        } catch (error) {
          console.error('Error al capturar el gráfico:', error);
          doc.text('No se pudo incluir el gráfico', 15, (doc as any).lastAutoTable.finalY + 10);
        }
      }

      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano', leftMargin, doc.internal.pageSize.getHeight() - 10);
      doc.save('reporte_eficiencia_cultivos.pdf');
    } else {
      await DescargarExcel({
        data: datos,
        columns: columnas,
        title: 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO',
        subtitle: 'ÁREA PAE - Reporte de Eficiencia Operativa y Rentabilidad',
        logoSenaPath: '/logoSena.png',
        logoKaizenPath: '/agrosoft.png',
        chartRef,
        filename: 'reporte_eficiencia_cultivos.xlsx',
      });
    }
  };

  return (
    <div className="space-y-6 p-8 bg-white rounded-2xl shadow-xl max-w-5xl mx-auto">
      <h3 className="text-3xl font-semibold text-gray-900 tracking-tight">Reporte de Eficiencia Operativa y Rentabilidad</h3>

      <div className="flex items-center gap-4">
        <Button
          text="Seleccionar Cultivos"
          variant="green"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
        />
        <div className="flex flex-wrap gap-2">
          {seleccionados.length > 0 && plantaciones
            ?.filter(p => seleccionados.includes(p.id))
            .map(plantacion => (
              <div
                key={plantacion.id}
                className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
              >
                {plantacion.fk_id_cultivo.nombre_cultivo}
                <X
                  size={16}
                  className="ml-2 cursor-pointer hover:text-red-500 transition-colors"
                  onClick={() => setSeleccionados(prev => prev.filter(id => id !== plantacion.id))}
                />
              </div>
            ))}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-xl font-semibold text-gray-900">Seleccionar Cultivos</h4>
              <X
                size={24}
                className="cursor-pointer text-gray-500 hover:text-red-500 transition-colors"
                onClick={() => setModalOpen(false)}
              />
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar cultivos..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <div className="max-h-80 overflow-y-auto space-y-2">
              {plantacionesFiltradas.length > 0 ? (
                plantacionesFiltradas.map(plantacion => (
                  <div
                    key={plantacion.id}
                    className={`p-3 rounded-lg cursor-pointer flex items-center justify-between transition-colors duration-150 ${
                      seleccionados.includes(plantacion.id) ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSeleccionados(prev =>
                        prev.includes(plantacion.id)
                          ? prev.filter(id => id !== plantacion.id)
                          : [...prev, plantacion.id]
                      );
                    }}
                  >
                    <div>
                      <p className="font-medium text-gray-800">{plantacion.fk_id_cultivo.nombre_cultivo}</p>
                      <p className="text-sm text-gray-500">
                        Plantado: {new Date(plantacion.fecha_plantacion).toLocaleDateString('es-CO')}
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(plantacion.id)}
                      onChange={() => {}}
                      className="h-5 w-5 text-green-500 rounded focus:ring-green-500 border-gray-300"
                    />
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-6">
                  {busqueda ? 'No se encontraron resultados' : 'No hay cultivos disponibles'}
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                text="Limpiar"
                variant="green"
                onClick={() => setSeleccionados([])}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
              />
              <Button
                text="Confirmar"
                variant="success"
                onClick={() => setModalOpen(false)}
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              />
            </div>
          </div>
        </div>
      )}

      {seleccionados.length > 0 && !isLoading && !isError && (
        <div ref={chartRef} className="mt-8 bg-gray-50 p-6 rounded-xl shadow-sm">
          <ChartBar
            data={generarDatosGraficoMultiples()}
            options={{
              responsive: true,
              plugins: {
                title: { display: true, text: 'Eficiencia y Costos por Cultivo', font: { size: 18, family: 'Helvetica', weight: 'bold' } },
                legend: { position: 'top', labels: { font: { size: 12, family: 'Helvetica' } } },
              },
              scales: {
                y: { beginAtZero: true, stacked: true, grid: { color: '#e5e7eb' } },
                y1: { position: 'right', beginAtZero: true, grid: { display: false } },
              },
            }}
            height={350}
          />
        </div>
      )}

      {isLoading && (
        <p className="text-center py-6 text-gray-600 font-medium">Cargando datos de los cultivos seleccionados...</p>
      )}
      {isError && (
        <p className="text-center py-6 text-red-600 font-medium">
          Error al cargar los datos. Verifica la conexión con la API.
        </p>
      )}
      {!isLoading && !isError && seleccionados.length === 0 && (
        <p className="text-center py-6 text-gray-600 font-medium">Seleccione al menos un cultivo para generar el reporte</p>
      )}
      {!isLoading && !isError && seleccionados.length > 0 && trazabilidadData.length === 0 && (
        <p className="text-center py-6 text-yellow-600 font-medium">
          No se encontraron datos de trazabilidad para los cultivos seleccionados.
        </p>
      )}

      <Button
        text={isLoading ? 'Generando reporte...' : 'Descargar Reporte'}
        variant="green"
        onClick={generarReporte}
        className="w-full flex justify-center items-center gap-2 hover:bg-green-600 transition-colors py-3"
        icon={Download}
        disabled={isLoading || seleccionados.length === 0 || trazabilidadData.length === 0 || !chartRendered}
      />
    </div>
  );
};

export default ReporteMultiplesCultivos;