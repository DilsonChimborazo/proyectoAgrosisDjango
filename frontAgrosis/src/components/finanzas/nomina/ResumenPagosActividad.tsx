import React from 'react';
import { usePagosPorActividad } from '@/hooks/finanzas/nomina/useNomina';
import { ChartPie } from '@/components/globales/Charts';

interface ResumenPagosActividadProps {
  esModal?: boolean;
}

const ResumenPagosActividad: React.FC<ResumenPagosActividadProps> = ({ esModal = false }) => {
  const { data, isLoading, error } = usePagosPorActividad();

  if (isLoading) return <div className="text-center py-8">Cargando datos...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  const chartData = {
    labels: data?.map(item => item.actividad) || [],
    datasets: [
      {
        data: data?.map(item => item.total_pagado) || [],
        backgroundColor: [
          '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#607D8B',
          '#FF5722', '#009688', '#673AB7', '#3F51B5', '#795548'
        ],
      }
    ]
  };

  return (
    <div className={`${esModal ? '' : 'bg-white p-6 rounded-lg shadow-md'}`}>
      {!esModal && <h2 className="text-xl font-semibold mb-4">Pagos por Actividad</h2>}
      
      <div className={esModal ? 'h-full' : 'h-64'}>
        <ChartPie 
          data={chartData} 
          options={{
            maintainAspectRatio: !esModal,
            responsive: true,
            plugins: {
              legend: {
                position: 'right' as const,
              },
              ...(esModal ? {} : {
                title: {
                  display: true,
                  text: 'Distribución de pagos por actividad',
                }
              })
            }
          }}
        />
      </div>
      
      {!esModal && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Detalles</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Actividad</th>
                  <th className="px-4 py-2">Tipo</th>
                  <th className="px-4 py-2">Total Pagado</th>
                  <th className="px-4 py-2">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((pago, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2">{pago.actividad}</td>
                    <td className="px-4 py-2">{pago.actividad_tipo}</td>
                    <td className="px-4 py-2">${pago.total_pagado.toLocaleString()}</td>
                    <td className="px-4 py-2">{pago.cantidad}</td>
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