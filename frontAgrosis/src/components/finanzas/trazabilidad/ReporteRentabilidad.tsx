import { useRef } from 'react';
import { ChartBar } from '@/components/globales/Charts';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { TrazabilidadCultivoReporte } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart as ChartJS } from 'chart.js';

interface ReporteRentabilidadProps {
    trazabilidadData: TrazabilidadCultivoReporte | undefined;
    formato: 'pdf' | 'excel';
}

const ReporteRentabilidad = ({ trazabilidadData, formato }: ReporteRentabilidadProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    if (!trazabilidadData) {
        return <p className="text-gray-500 text-center py-4">Seleccione una plantación para generar el reporte</p>;
    }

    const generarDatosGraficoCostos = () => ({
        labels: ['Mano de Obra', 'Insumos', 'Depreciación'],
        datasets: [{
            label: 'Costos',
            data: [
                trazabilidadData.costo_mano_obra_acumulado || 0,
                trazabilidadData.egresos_insumos_acumulado || 0,
                trazabilidadData.depreciacion_herramientas_acumulada || 0
            ],
            backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
            borderColor: ['#388E3C', '#1976D2', '#F57C00'],
            borderWidth: 1
        }]
    });

    const generarReporte = async () => {
        const columnas = ['Métrica', 'Valor'];
        const datos = [
            ['Relación B/C', trazabilidadData.beneficio_costo_acumulado.toFixed(2)],
            ['Balance', new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                (trazabilidadData.ingresos_ventas_acumulado || 0) -
                (trazabilidadData.costo_mano_obra_acumulado + trazabilidadData.egresos_insumos_acumulado + trazabilidadData.depreciacion_herramientas_acumulada)
            )],
            ['Costo Mano de Obra', new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.costo_mano_obra_acumulado)],
            ['Costo Insumos', new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.egresos_insumos_acumulado)],
            ['Depreciación Herramientas', new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.depreciacion_herramientas_acumulada)],
            ['Ingresos por Ventas', new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.ingresos_ventas_acumulado)]
        ];

        if (formato === 'pdf') {
            const doc = new jsPDF();
            doc.text(`Reporte de Rentabilidad - ${trazabilidadData.cultivo || 'Sin cultivo'}`, 14, 20);
            doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 14, 30);
            autoTable(doc, {
                startY: 40,
                head: [columnas],
                body: datos,
                theme: 'striped',
                styles: { fontSize: 10, cellPadding: 4 },
                headStyles: { fillColor: [0, 120, 100], textColor: 255 }
            });
            const canvas = document.createElement('canvas');
            canvas.width = 500;
            canvas.height = 300;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                new ChartJS(ctx, {
                    type: 'bar',
                    data: generarDatosGraficoCostos(),
                    options: {
                        plugins: {
                            title: { display: true, text: 'Distribución de Costos' }
                        }
                    }
                });
                const finalY = (doc as any).lastAutoTable?.finalY || 40;
                doc.addImage(canvas.toDataURL('image/png'), 'PNG', 14, finalY + 10, 180, 80);
            }
            doc.save(`reporte_rentabilidad_${trazabilidadData.cultivo || 'trazabilidad'}.pdf`);
        } else {
            const ws = XLSX.utils.json_to_sheet(datos.map(d => ({ Métrica: d[0], Valor: d[1] })));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Rentabilidad');
            if (chartRef.current) {
                const canvas = await html2canvas(chartRef.current);
                const imageData = canvas.toDataURL('image/png');
                const wsImage = XLSX.utils.json_to_sheet([{ Imagen: 'Gráfico de Costos' }]);
                // Nota: Incrustar imágenes en Excel requiere soporte adicional (como complementos). Aquí se simula una hoja con referencia.
                XLSX.utils.book_append_sheet(wb, wsImage, 'Gráfico');
            }
            XLSX.writeFile(wb, `reporte_rentabilidad_${trazabilidadData.cultivo || 'trazabilidad'}.xlsx`);
        }
    };

    return (
        <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Reporte de Rentabilidad</h3>
            <div ref={chartRef}>
                <ChartBar
                    data={generarDatosGraficoCostos()}
                    options={{ plugins: { title: { display: true, text: 'Distribución de Costos', font: { size: 16 } } } }}
                    height={300}
                />
            </div>
            <Button
                text="Descargar Reporte"
                variant="success"
                onClick={generarReporte}
                className="w-full flex justify-center items-center gap-2 hover:bg-green-600 transition-colors"
                icon={Download}
            />
        </div>
    );
};

export default ReporteRentabilidad;