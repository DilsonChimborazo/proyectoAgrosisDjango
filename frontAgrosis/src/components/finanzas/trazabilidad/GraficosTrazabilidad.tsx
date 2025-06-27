import GraficoLinea from '@/components/globales/GraficoLinea';
import GraficoBarras from '@/components/globales/GraficoBarras';

interface DataPoint {
  fecha_registro: string;
  version: number;
  datos: {
    beneficio_costo_acumulado: string | number;
    ingresos_ventas_acumulado: string | number;
    costo_mano_obra_acumulado: string | number;
    egresos_insumos_acumulado: string | number;
    total_horas: number;
  };
}

interface GraficosTrazabilidadProps {
  data: DataPoint[];
  tipo: string;
}

const GraficosTrazabilidad = ({ data, tipo }: GraficosTrazabilidadProps) => {
  if (!data || data.length === 0) return <p>No hay datos históricos para mostrar</p>;

  if (tipo === 'evolucion') {
    const datosGrafico = {
      labels: data.map((s) => new Date(s.fecha_registro).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })),
      datasets: [
        {
          label: 'Relación Beneficio/Costo',
          data: data.map((s) => {
            const val = parseFloat(s.datos.beneficio_costo_acumulado.toString());
            return isNaN(val) ? 0 : val;
          }),
          borderColor: '#3B82F6',
          backgroundColor: '#3B82F6',
          yAxisID: 'y',
        },
        {
          label: 'Ingresos',
          data: data.map((s) => {
            const val = parseFloat(s.datos.ingresos_ventas_acumulado.toString());
            return isNaN(val) ? 0 : val;
          }),
          borderColor: '#10B981',
          backgroundColor: '#10B981',
          yAxisID: 'y1',
        },
        {
          label: 'Egresos',
          data: data.map((s) => {
            const costoManoObra = parseFloat(s.datos.costo_mano_obra_acumulado.toString());
            const egresosInsumos = parseFloat(s.datos.egresos_insumos_acumulado.toString());
            const val1 = isNaN(costoManoObra) ? 0 : costoManoObra;
            const val2 = isNaN(egresosInsumos) ? 0 : egresosInsumos;
            return val1 + val2;
          }),
          borderColor: '#EF4444',
          backgroundColor: '#EF4444',
          yAxisID: 'y1',
        },
      ],
    };

    return (
      <div className="space-y-6">
        <div className="h-80">
          <GraficoLinea
            datos={datosGrafico}
            titulo="Evolución de Rentabilidad"
            opciones={{
              responsive: true,
              interaction: {
                mode: 'index',
                intersect: false,
              },
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Relación B/C',
                  },
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  title: {
                    display: true,
                    text: 'Valor ($)',
                  },
                  grid: {
                    drawOnChartArea: false,
                  },
                },
              },
            }}
          />
        </div>

        <div className="h-80">
          <GraficoBarras
            datos={{
              labels: data.map((s) => `v${s.version}`),
              datasets: [
                {
                  label: 'Tiempo (horas)',
                  data: data.map((s) => s.datos.total_horas),
                  backgroundColor: '#8B5CF6',
                },
              ],
            }}
            titulo="Evolución de Tiempo Invertido"
          />
        </div>
      </div>
    );
  }

  return null;
};

export default GraficosTrazabilidad;