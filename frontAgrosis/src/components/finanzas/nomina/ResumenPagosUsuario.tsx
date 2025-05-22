import React from 'react';
import { usePagosPorUsuario } from '@/hooks/finanzas/nomina/useNomina';
import { ChartBar } from '@/components/globales/Charts';

interface ResumenPagosUsuarioProps {
  esModal?: boolean;
}

const ResumenPagosUsuario: React.FC<ResumenPagosUsuarioProps> = ({ esModal = false }) => {
  const { data, isLoading, error } = usePagosPorUsuario();

  if (isLoading) return <div className="text-center py-8">Cargando datos...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error.message}</div>;

  const chartData = {
    labels: data?.map(item => `${item.usuario_nombre} ${item.usuario_apellido}`) || [],
    datasets: [
      {
        label: 'Total Pagado',
        data: data?.map(item => item.total_pagado) || [],
        backgroundColor: '#4CAF50',
      }
    ]
  };

  return (
    <div className={`${esModal ? '' : 'bg-white p-6 rounded-lg shadow-md'}`}>
      {!esModal && <h2 className="text-xl font-semibold mb-4">Pagos por Usuario</h2>}
      
      <div className={esModal ? '' : 'h-64'}>
        <ChartBar 
          data={chartData} 
          options={{
            maintainAspectRatio: esModal ? false : true,
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              ...(esModal ? {} : {
                title: {
                  display: true,
                  text: 'Total pagado por usuario',
                }
              })
            }
          }}
        />
      </div>
      
      {!esModal && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Resumen de Pagos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-2">Usuario</th>
                  <th className="px-4 py-2">Total Pagado</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((pago, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-4 py-2">{pago.usuario_nombre} {pago.usuario_apellido}</td>
                    <td className="px-4 py-2">${pago.total_pagado.toLocaleString()}</td>
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