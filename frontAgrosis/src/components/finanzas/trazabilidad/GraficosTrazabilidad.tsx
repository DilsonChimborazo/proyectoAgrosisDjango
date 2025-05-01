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
                    data: data.map((s: any) => s.datos.beneficio_costo),
                    borderColor: '#3B82F6',
                    backgroundColor: '#3B82F6',
                    yAxisID: 'y'
                },
                {
                    label: 'Ingresos',
                    data: data.map((s: any) => s.datos.ingresos_ventas),
                    borderColor: '#10B981',
                    backgroundColor: '#10B981',
                    yAxisID: 'y1'
                },
                {
                    label: 'Egresos',
                    data: data.map((s: any) => s.datos.costo_mano_obra + s.datos.egresos_insumos),
                    borderColor: '#EF4444',
                    backgroundColor: '#EF4444',
                    yAxisID: 'y1'
                }
            ]
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