import { useReportesDecisiones } from '@/hooks/finanzas/consultas/useReportesDecisiones';
import DescargarTablaPDF from '../../globales/DescargarTablaPDF';

const ReporteIndicadoresClave = ({ plantacionId }: { plantacionId: number }) => {
  const { data, isLoading } = useReportesDecisiones(plantacionId);

  if (isLoading) return <div>Cargando...</div>;

  // Valores seguros con operador de coalescencia nula
  const beneficioCosto = data?.beneficio_costo_acumulado ?? 0;
  const balanceAcumulado = data?.resumen?.balance_acumulado ?? 0;
  const produccionTotal = data?.total_cantidad_producida_base_acumulado ?? 0;
  const horasTotales = data?.total_horas ?? 1; // Evitar división por cero
  const ingresosVentas = data?.ingresos_ventas_acumulado ?? 0;
  const costosTotales = data?.resumen?.costo_total_acumulado ?? 0;
  const nombreCultivo = data?.cultivo ?? 'Cultivo no identificado';

  const indicadores = [
    {
      titulo: "Retorno por Cada $1 Invertido",
      valor: beneficioCosto.toFixed(2),
      icono: '💰',
      descripcion: "Cuantos dólares ganas por cada dólar invertido",
      esBuenaNoticia: beneficioCosto > 1
    },
    {
      titulo: "Pérdidas/Ganancias Acumuladas",
      valor: `$${Math.abs(balanceAcumulado).toLocaleString()}`,
      icono: balanceAcumulado >= 0 ? '📈' : '📉',
      descripcion: balanceAcumulado >= 0 ? "Ganancias totales" : "Pérdidas totales",
      esBuenaNoticia: balanceAcumulado >= 0
    },
    {
      titulo: "Eficiencia de Producción",
      valor: `${(produccionTotal / horasTotales).toFixed(2)} u/hora`,
      icono: '⚡',
      descripcion: "Unidades producidas por hora de trabajo",
      esBuenaNoticia: true
    },
    {
      titulo: "Margen de Seguridad",
      valor: `${(((ingresosVentas - costosTotales) / (ingresosVentas || 1)) * 100).toFixed(1)}%`,
      icono: '🛡️',
      descripcion: "Cuánto pueden caer las ventas antes de tener pérdidas",
      esBuenaNoticia: true
    }
  ];

  const columnasPDF = ['Indicador', 'Valor', 'Significado'];
  const datosPDF = indicadores.map(ind => [
    ind.titulo, 
    ind.valor, 
    ind.descripcion
  ]);

  const getRecomendacion = () => {
    if (beneficioCosto > 1.5) {
      return `El cultivo de ${nombreCultivo} está dando excelentes resultados. Considera expandir su producción.`;
    }
    if (beneficioCosto > 1) {
      return `El cultivo de ${nombreCultivo} es rentable pero podrías optimizar costos.`;
    }
    return `Revisa urgentemente los costos de producción para ${nombreCultivo}. Está generando pérdidas.`;
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Indicadores Clave de Rentabilidad - {nombreCultivo}
        </h2>
        <DescargarTablaPDF
          nombreArchivo={`indicadores_clave_${plantacionId}.pdf`}
          columnas={columnasPDF}
          datos={datosPDF}
          titulo={`Indicadores Clave - ${nombreCultivo}`}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {indicadores.map((item, index) => (
          <div 
            key={index}
            className={`p-5 rounded-xl border ${item.esBuenaNoticia ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} transition-all hover:scale-[1.02]`}
          >
            <div className="flex items-start gap-4">
              <span className="text-3xl">{item.icono}</span>
              <div>
                <h3 className="font-bold text-lg">{item.titulo}</h3>
                <p className={`text-3xl font-extrabold my-2 ${item.esBuenaNoticia ? 'text-green-600' : 'text-red-600'}`}>
                  {item.valor}
                </p>
                <p className="text-gray-600">{item.descripcion}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="font-bold text-yellow-800 mb-2">Recomendación basada en datos:</h3>
        <p className="text-yellow-700">{getRecomendacion()}</p>
      </div>
    </div>
  );
};

export default ReporteIndicadoresClave;