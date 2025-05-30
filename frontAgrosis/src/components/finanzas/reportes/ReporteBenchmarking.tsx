import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useReportesDecisiones } from '@/hooks/finanzas/consultas/useReportesDecisiones';
import DescargarTablaPDF from '../../globales/DescargarTablaPDF';

const apiUrl = import.meta.env.VITE_API_URL;

interface Plantacion {
  id: number;
  nombre: string;
  area: number;
  [key: string]: any;
}

interface TrazabilidadData {
  cultivo: string;
  total_cantidad_producida_base_acumulado: number;
  beneficio_costo_acumulado: number;
  resumen: {
    costo_total_acumulado: number;
  };
  [key: string]: any;
}

const ReporteBenchmarking = () => {
  // 1. Obtener todas las plantaciones
  const { data: plantaciones } = useQuery<Plantacion[]>({
    queryKey: ["allPlantaciones"],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${apiUrl}plantaciones/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    }
  });
  
  // 2. Obtener datos de trazabilidad para cada plantación
  const { data: comparativa, isLoading } = useQuery<Array<TrazabilidadData & { nombre: string; area: number }>>({
    queryKey: ["benchmarkingData", plantaciones],
    queryFn: async () => {
      if (!plantaciones) return [];
      
      const trazabilidades = await Promise.all(
        plantaciones.map((p) => 
          axios.get(`${apiUrl}trazabilidad/plantacion/${p.id}/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          }).then(res => res.data)
        )
      );
      
      return trazabilidades.map((t, i) => ({
        ...t,
        nombre: plantaciones[i].nombre,
        area: plantaciones[i].area
      }));
    },
    enabled: !!plantaciones
  });

  // 3. Preparar datos para PDF
  const datosPDF = [
    ['Cultivo', 'Área (m²)', 'Producción (u)', 'Producción/m²', 'Rentabilidad', 'Costo/m²'],
    ...(comparativa || []).map((item) => [
      item.cultivo,
      item.area,
      item.total_cantidad_producida_base_acumulado,
      ((item.total_cantidad_producida_base_acumulado || 0) / (item.area || 1)).toFixed(2),
      (item.beneficio_costo_acumulado || 0).toFixed(2),
      `$${((item.resumen?.costo_total_acumulado || 0) / (item.area || 1)).toFixed(2)}`
    ])
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando datos comparativos...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Benchmarking de Cultivos
        </h2>
        <DescargarTablaPDF
          nombreArchivo="benchmarking_cultivos.pdf"
          columnas={datosPDF[0] as string[]}
          datos={datosPDF.slice(1)}
          titulo="Comparativa de Rendimiento por Cultivo"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        />
      </div>
      
      {/* Tabla comparativa */}
      <div className="overflow-x-auto mb-8">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cultivo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producción/m²</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rentabilidad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Eficiencia</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recomendación</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(comparativa || []).map((item, index) => {
              const produccionM2 = (item.total_cantidad_producida_base_acumulado || 0) / (item.area || 1);
              const rentabilidad = item.beneficio_costo_acumulado || 0;
              const eficiencia = rentabilidad * produccionM2;
              
              return (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {item.cultivo}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-24 bg-gray-200 rounded-full h-2.5 mr-2">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${Math.min(100, produccionM2 * 10)}%` }}
                        />
                      </div>
                      <span>{produccionM2.toFixed(2)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      rentabilidad > 1.5 ? 'bg-green-100 text-green-800' :
                      rentabilidad > 1 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {rentabilidad.toFixed(2)}x
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold">{
                      eficiencia > 5 ? '⭐⭐⭐⭐⭐' :
                      eficiencia > 3 ? '⭐⭐⭐⭐' :
                      eficiencia > 1 ? '⭐⭐⭐' : '⭐'
                    }</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {rentabilidad > 1.5 && produccionM2 > 3 
                      ? <span className="text-green-600 font-medium">Priorizar expansión</span> 
                      : rentabilidad > 1 
                      ? <span className="text-yellow-600">Mantener producción</span>
                      : <span className="text-red-600 font-medium">Revisar proceso</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Resumen de métricas clave */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricaCard
          titulo="Mejor Rendimiento/m²"
          valor={comparativa?.reduce((max, item) => 
            ((item.total_cantidad_producida_base_acumulado || 0) / (item.area || 1)) > 
            ((max.total_cantidad_producida_base_acumulado || 0) / (max.area || 1)) ? item : max, 
            comparativa?.[0]
          )?.cultivo}
          icono="📊"
          color="blue"
        />
        
        <MetricaCard
          titulo="Mayor Rentabilidad"
          valor={comparativa?.reduce((max, item) => 
            (item.beneficio_costo_acumulado || 0) > (max.beneficio_costo_acumulado || 0) ? item : max, 
            comparativa?.[0]
          )?.cultivo}
          icono="💰"
          color="green"
        />
        
        <MetricaCard
          titulo="Mejor Eficiencia Global"
          valor={comparativa?.reduce((max, item) => 
            ((item.beneficio_costo_acumulado || 0) * ((item.total_cantidad_producida_base_acumulado || 0) / (item.area || 1))) > 
            ((max.beneficio_costo_acumulado || 0) * ((max.total_cantidad_producida_base_acumulado || 0) / (max.area || 1))) ? item : max, 
            comparativa?.[0]
          )?.cultivo}
          icono="🚀"
          color="purple"
        />
      </div>
    </div>
  );
};

// Componente auxiliar para mostrar métricas
const MetricaCard = ({ titulo, valor, icono, color }: { titulo: string; valor?: string; icono: string; color: string }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800'
  };

  return (
    <div className={`p-4 rounded-lg border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">{icono}</span>
        <div>
          <h3 className="font-bold text-sm">{titulo}</h3>
          <p className="text-xl font-bold">{valor || '-'}</p>
        </div>
      </div>
    </div>
  );
};

export default ReporteBenchmarking;