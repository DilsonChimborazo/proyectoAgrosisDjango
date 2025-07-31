import React, { useState } from 'react';
import { usePagosPorActividad } from '@/hooks/finanzas/nomina/useNomina';
import { ChartPie, ChartBar } from '@/components/globales/Charts';

interface ResumenPagosActividadProps {
  esModal?: boolean;
}

const ResumenPagosActividad: React.FC<ResumenPagosActividadProps> = ({ esModal = false }) => {
  const { data, isLoading, error } = usePagosPorActividad();
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie');

  const parseNumber = (value: unknown): number => {
    if (value == null || (typeof value === 'string' && value.trim() === '')) return 0;
    const numero = typeof value === 'string' ? parseFloat(value) : value;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const generarDatos = () => {
    const datosValidos = data?.filter(p => parseNumber(p.total_pagado) > 0) || [];
    const colores = [
      '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#607D8B',
      '#FF5722', '#009688', '#673AB7', '#3F51B5', '#795548'
    ];

    return {
      datos: datosValidos.map(p => ({
        actividad: p.actividad,
        tipo: p.actividad_tipo,
        cantidad: p.cantidad.toString(),
        total_pagado: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(p.total_pagado),
      })),
      graficoPie: {
        labels: datosValidos.map(p => p.actividad),
        datasets: [
          {
            data: datosValidos.map(p => parseNumber(p.total_pagado)),
            backgroundColor: colores.slice(0, datosValidos.length),
          },
        ],
      },
      graficoBar: {
        labels: datosValidos.map(p => p.actividad),
        datasets: [
          {
            label: 'Total Pagado (COP)',
            data: datosValidos.map(p => parseNumber(p.total_pagado)),
            backgroundColor: '#4CAF50',
            yAxisID: 'y1',
            barPercentage: 0.4,
            categoryPercentage: 0.45,
          },
          {
            label: 'Cantidad Actividades',
            data: datosValidos.map(p => parseNumber(p.cantidad)),
            backgroundColor: '#2196F3',
            yAxisID: 'y',
            barPercentage: 0.4,
            categoryPercentage: 0.45,
          },
        ],
      },
      titulo: 'Resumen de Pagos por Actividad',
    };
  };

  const { graficoPie, graficoBar, titulo, datos } = generarDatos();

  if (isLoading) return <div className="text-center py-8 text-gray-600">Cargando datos...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <div className={`${esModal ? '' : 'bg-white p-6 rounded-lg shadow-md'}`}>
      {!esModal && <h2 className="text-xl font-semibold mb-4 text-gray-800">Pagos por Actividad</h2>}

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setChartType(chartType === 'pie' ? 'bar' : 'pie')}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg text-sm"
        >
          Cambiar a {chartType === 'pie' ? 'Barras' : 'Torta'}
        </button>
      </div>

      <div>
        {chartType === 'pie' ? (
          <ChartPie
            data={graficoPie}
            options={{
              maintainAspectRatio: !esModal,
              responsive: true,
              plugins: {
                legend: { position: 'right', labels: { font: { size: 12 } } },
                title: { display: true, text: titulo, font: { size: 16, weight: 'bold' }, color: '#333' },
              },
            }}
            height={esModal ? 450 : 300}
          />
        ) : (
          <ChartBar
            data={graficoBar}
            options={{
              maintainAspectRatio: esModal ? false : true,
              responsive: true,
              plugins: {
                legend: { position: 'top', labels: { font: { size: 12 } } },
                title: { display: true, text: titulo, font: { size: 16, weight: 'bold' }, color: '#333' },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: { display: true, text: 'Cantidad Actividades', font: { size: 12 } },
                  grid: { color: '#e0e0e0' },
                },
                y1: {
                  position: 'right',
                  beginAtZero: true,
                  title: { display: true, text: 'Total Pagado (COP)', font: { size: 12 } },
                  grid: { display: false },
                },
              },
            }}
            height={esModal ? 450 : 300}
          />
        )}
      </div>

      {!esModal && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Detalles</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {['Actividad', 'Tipo', 'Cantidad', 'Total Pagado'].map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map((pago, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-sm text-gray-700">{pago.actividad}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{pago.tipo}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{pago.cantidad}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{pago.total_pagado}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumenPagosActividad;