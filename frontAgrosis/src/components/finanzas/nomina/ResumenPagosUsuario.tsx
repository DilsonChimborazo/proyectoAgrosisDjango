import React from 'react';
import { usePagosPorUsuario } from '@/hooks/finanzas/nomina/useNomina';
import { ChartBar } from '@/components/globales/Charts';

interface ResumenPagosUsuarioProps {
  esModal?: boolean;
}

const ResumenPagosUsuario: React.FC<ResumenPagosUsuarioProps> = ({ esModal = false }) => {
  const { data, isLoading, error } = usePagosPorUsuario();

  const parseNumber = (value: unknown): number => {
    if (value == null || (typeof value === 'string' && value.trim() === '')) return 0;
    const numero = typeof value === 'string' ? parseFloat(value) : value;
    return typeof numero === 'number' && !isNaN(numero) ? numero : 0;
  };

  const generarDatos = () => {
    // Agrupar datos por usuario
    const datosAgrupados = Array.from(
      data?.reduce((acc, p) => {
        const key = `${p.usuario_nombre} ${p.usuario_apellido}`;
        const total = acc.get(key) || {
          usuario_nombre: p.usuario_nombre,
          usuario_apellido: p.usuario_apellido,
          total_pagado: 0,
          cantidad_actividades: 0,
        };
        total.total_pagado += parseNumber(p.total_pagado);
        total.cantidad_actividades += parseNumber(p.cantidad_actividades);
        return acc.set(key, total);
      }, new Map<string, any>())?.values() || []
    ).filter(p => p.total_pagado > 0);

    return {
      datos: datosAgrupados.map(p => ({
        usuario: `${p.usuario_nombre} ${p.usuario_apellido}`,
        cantidad_actividades: p.cantidad_actividades.toString(),
        total_pagado: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(p.total_pagado),
      })),
      grafico: {
        labels: datosAgrupados.map(p => `${p.usuario_nombre} ${p.usuario_apellido}`),
        datasets: [
          {
            label: 'Total Pagado (COP)',
            data: datosAgrupados.map(p => p.total_pagado),
            backgroundColor: '#4CAF50',
            yAxisID: 'y1',
            barPercentage: 0.4,
            categoryPercentage: 0.45,
          },
          {
            label: 'Cantidad Actividades',
            data: datosAgrupados.map(p => p.cantidad_actividades),
            backgroundColor: '#2196F3',
            yAxisID: 'y',
            barPercentage: 0.4,
            categoryPercentage: 0.45,
          },
        ],
      },
      titulo: 'Resumen de Pagos por Usuario',
    };
  };

  const { grafico, titulo, datos } = generarDatos();

  if (isLoading) return <div className="text-center py-8 text-gray-600">Cargando datos...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  return (
    <div className={`${esModal ? '' : 'bg-white p-6 rounded-lg shadow-md'}`}>
      {!esModal && <h2 className="text-xl font-semibold mb-4 text-gray-800">Pagos por Usuario</h2>}

      <div>
        <ChartBar
          data={grafico}
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
      </div>

      {!esModal && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2 text-gray-700">Resumen de Pagos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  {['Usuario', 'Cantidad Actividades', 'Total Pagado'].map((header, index) => (
                    <th key={index} className="px-4 py-2 text-left text-sm font-semibold text-gray-600">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datos.map((pago, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2 text-sm text-gray-700">{pago.usuario}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">{pago.cantidad_actividades}</td>
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

export default ResumenPagosUsuario;