import GraficoLinea from '@/components/globales/GraficoLinea';
import GraficoBarras from '@/components/globales/GraficoBarras';

interface GraficosTrazabilidadProps {
    data: any[];
    tipo: string;
}

const GraficosTrazabilidad = ({ data, tipo }: GraficosTrazabilidadProps) => {
    if (!data || data.length === 0) return <p>No hay datos históricos para mostrar</p>;

    if (tipo === 'evolucion') {
        const datosGrafico = {
            labels: data.map((s: any) => new Date(s.fecha_registro).toLocaleDateString()),
            datasets: [
                {
                    label: 'Relación Beneficio/Costo',
                    data: data.map((s: any) => {
                        const val = parseFloat(s.datos.beneficio_costo_acumulado); // Usar el campo correcto
                        return isNaN(val) ? 0 : val; // Si no es un número, usa 0
                    }),
                    borderColor: '#3B82F6',
                    backgroundColor: '#3B82F6',
                    yAxisID: 'y' // Esto está bien si GraficoLinea lo acepta
                },
                {
                    label: 'Ingresos',
                    data: data.map((s: any) => {
                        const val = parseFloat(s.datos.ingresos_ventas_acumulado); // Usar el campo correcto
                        return isNaN(val) ? 0 : val; // Si no es un número, usa 0
                    }),
                    borderColor: '#10B981',
                    backgroundColor: '#10B981',
                    yAxisID: 'y1'
                },
                {
                    label: 'Egresos',
                    data: data.map((s: any) => {
                        const costoManoObra = parseFloat(s.datos.costo_mano_obra_acumulado); // Usar el campo correcto
                        const egresosInsumos = parseFloat(s.datos.egresos_insumos_acumulado); // Usar el campo correcto
                        const val1 = isNaN(costoManoObra) ? 0 : costoManoObra;
                        const val2 = isNaN(egresosInsumos) ? 0 : egresosInsumos;
                        return val1 + val2; // La suma será un número
                    }),
                    borderColor: '#EF4444',
                    backgroundColor: '#EF4444',
                    yAxisID: 'y1'
                }
            ]
        };
        console.log('Datos para GraficoLinea:', JSON.stringify(datosGrafico, null, 2));
        console.log('ESTRUCTURA DE LA PROP "data" ORIGINAL:', JSON.stringify(data, null, 2)); // MUY IMPORTANTE
        console.log('Tipo recibido:', tipo);

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
                                        text: 'Relación B/C'
                                    }
                                },
                                y1: {
                                    type: 'linear',
                                    display: true,
                                    position: 'right',
                                    title: {
                                        display: true,
                                        text: 'Valor ($)'
                                    },
                                    grid: {
                                        drawOnChartArea: false
                                    }
                                }
                            }
                        }}
                    />
                </div>

                <div className="h-80">
                    <GraficoBarras
                        datos={{
                            labels: data.map((s: any) => `v${s.version}`),
                            datasets: [
                                {
                                    label: 'Tiempo (horas)',
                                    data: data.map((s: any) => s.datos.total_horas),
                                    backgroundColor: '#8B5CF6'
                                }
                            ]
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