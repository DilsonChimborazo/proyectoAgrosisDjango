import { useRef } from 'react';
import { useQueries } from '@tanstack/react-query';
import axios from 'axios';
import { ChartBar } from '@/components/globales/Charts';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { Plantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart as ChartJS } from 'chart.js';

interface ReporteMultiplesCultivosProps {
    plantaciones: Plantacion[] | undefined;
    plantacionesSeleccionadas: number[];
    formato: 'pdf' | 'excel';
}

const useTrazabilidadMultiples = (plantacionIds: number[]) => {
    return useQueries({
        queries: plantacionIds.map(id => ({
            queryKey: ['trazabilidad', id],
            queryFn: async () => {
                const response = await axios.get(`/api/trazabilidad/${id}/`);
                return response.data;
            },
            enabled: !!id,
        })),
    });
};

const ReporteMultiplesCultivos = ({ plantaciones, plantacionesSeleccionadas, formato }: ReporteMultiplesCultivosProps) => {
    const chartRef = useRef<HTMLDivElement>(null);
    const trazabilidadQueries = useTrazabilidadMultiples(plantacionesSeleccionadas);
    const trazabilidadData = trazabilidadQueries.map(q => q.data).filter(d => !!d);

    if (!plantaciones || !plantacionesSeleccionadas.length || !trazabilidadData.length) {
        return <p className="text-gray-500 text-center py-4">Seleccione al menos un cultivo para generar el reporte</p>;
    }

    const generarDatosGraficoMultiples = () => ({
        labels: trazabilidadData.map(t => t.cultivo || 'Sin cultivo'),
        datasets: [
            {
                label: 'Relación B/C',
                data: trazabilidadData.map(t => t.beneficio_costo_acumulado || 0),
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1
            },
            {
                label: 'Balance',
                data: trazabilidadData.map(t => 
                    (t.ingresos_ventas_acumulado || 0) -
                    (t.costo_mano_obra_acumulado + t.egresos_insumos_acumulado + t.depreciacion_herramientas_acumulada)
                ),
                backgroundColor: '#2196F3',
                borderColor: '#1976D2',
                borderWidth: 1
            }
        ]
    });

    const generarReporte = async () => {
        const columnas = ['Cultivo', 'Relación B/C', 'Balance'];
        const datos = trazabilidadData.map(t => [
            t.cultivo || 'Sin cultivo',
            t.beneficio_costo_acumulado.toFixed(2),
            new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                (t.ingresos_ventas_acumulado || 0) -
                (t.costo_mano_obra_acumulado + t.egresos_insumos_acumulado + t.depreciacion_herramientas_acumulada)
            )
        ]);

        if (formato === 'pdf') {
            const doc = new jsPDF();
            doc.text('Reporte de Múltiples Cultivos', 14, 20);
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
                    data: generarDatosGraficoMultiples(),
                    options: {
                        plugins: {
                            title: { display: true, text: 'Comparación de Cultivos', font: { size: 16 } }
                        }
                    }
                });
                const finalY = (doc as any).lastAutoTable?.finalY || 40;
                doc.addImage(canvas.toDataURL('image/png'), 'PNG', 14, finalY + 10, 180, 80);
            }
            doc.save('reporte_multiples_cultivos.pdf');
        } else {
            const ws = XLSX.utils.json_to_sheet(datos.map(d => ({
                Cultivo: d[0],
                'Relación B/C': d[1],
                Balance: d[2]
            })));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Múltiples Cultivos');
            if (chartRef.current) {
                const canvas = await html2canvas(chartRef.current);
                const imageData = canvas.toDataURL('image/png');
                const wsImage = XLSX.utils.json_to_sheet([{ Imagen: 'Gráfico de Comparación de Cultivos' }]);
                XLSX.utils.book_append_sheet(wb, wsImage, 'Gráfico');
            }
            XLSX.writeFile(wb, 'reporte_multiples_cultivos.xlsx');
        }
    };

    return (
        <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Reporte de Múltiples Cultivos</h3>
            <div ref={chartRef}>
                <ChartBar
                    data={generarDatosGraficoMultiples()}
                    options={{ plugins: { title: { display: true, text: 'Comparación de Cultivos', font: { size: 16 } } } }}
                    height={300}
                />
            </div>
            <Button
                text="Descargar Reporte"
                variant="success"
                onClick={generarReporte}
                className="w-full flex justify-center items-center gap-2 hover:bg-green-600 transition-colors"
                icon={Download}
                disabled={trazabilidadQueries.some(q => q.isLoading)}
            />
        </div>
    );
};

export default ReporteMultiplesCultivos;