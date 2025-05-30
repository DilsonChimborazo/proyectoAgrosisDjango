import { useReportesDecisiones } from '@/hooks/finanzas/consultas/useReportesDecisiones';
import DescargarTablaPDF from '../../globales/DescargarTablaPDF';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ReporteAnalisisCostos = ({ plantacionId }: { plantacionId: number }) => {
  const { data } = useReportesDecisiones(plantacionId);

  const datosGrafico = [
    { name: 'Mano de Obra', value: data?.costo_mano_obra_acumulado || 0 },
    { name: 'Insumos', value: data?.egresos_insumos_acumulado || 0 },
    { name: 'Otros Costos', value: (data?.resumen?.costo_total_acumulado || 0) - 
                                 (data?.costo_mano_obra_acumulado || 0) - 
                                 (data?.egresos_insumos_acumulado || 0) }
  ];

  const datosPDF = [
    ['Tipo de Costo', 'Monto', '% del Total'],
    ...datosGrafico.map(item => [
      item.name,
      `$${item.value.toLocaleString()}`,
      `${((item.value / (data?.resumen?.costo_total_acumulado || 1)) * 100).toFixed(1)}%`
    ])
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Desglose de Costos - {data?.cultivo}
        </h2>
        <DescargarTablaPDF
          nombreArchivo={`analisis_costos_${plantacionId}.pdf`}
          columnas={datosPDF[0] as string[]}
          datos={datosPDF.slice(1)}
          titulo={`Análisis de Costos - ${data?.cultivo}`}
          className="bg-purple-600 hover:bg-purple-700 text-white"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <PieChart width={400} height={300}>
            <Pie
              data={datosGrafico}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {datosGrafico.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Valor']}/>
            <Legend />
          </PieChart>
        </div>
        
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-bold text-blue-800">Costo Total</h3>
            <p className="text-3xl font-bold text-blue-600">
              ${(data?.resumen?.costo_total_acumulado || 0).toLocaleString()}
            </p>
          </div>
          
          {datosGrafico.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </div>
              <span className="font-bold">
                ${item.value.toLocaleString()} (
                {((item.value / (data?.resumen?.costo_total_acumulado || 1)) * 100).toFixed(1)}%
                )
              </span>
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
            <h4 className="font-bold text-yellow-800">Recomendación:</h4>
            <p className="text-yellow-700">
              {datosGrafico[0].value / (data?.resumen?.costo_total_acumulado || 1) > 0.5
                ? "Los costos laborales son muy altos. Considera optimizar procesos o revisar salarios."
                : datosGrafico[1].value / (data?.resumen?.costo_total_acumulado || 1) > 0.4
                ? "Los insumos representan un porcentaje alto. Busca proveedores alternativos o reduce desperdicios."
                : "La estructura de costos está balanceada. Buen trabajo!"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ReporteAnalisisCostos;