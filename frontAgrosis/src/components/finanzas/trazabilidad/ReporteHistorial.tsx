import { useRef } from 'react';
import { ChartLine } from '@/components/globales/Charts';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { SnapshotTrazabilidad } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart as ChartJS } from 'chart.js';

interface ReporteHistorialProps {
    ordenarSnapshots: SnapshotTrazabilidad[];
    formato: 'pdf' | 'excel';
}

const ReporteHistorial = ({ ordenarSnapshots, formato }: ReporteHistorialProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    if (!ordenarSnapshots.length) {
        return <p className="text-gray-500 text-center py-4">No hay historial disponible</p>;
    }

    const generarDatosGraficoEvolucion = () => ({
        labels: ordenarSnapshots.map(s => `v${s.version}`),
        datasets: [{
            label: 'Relación B/C',
            data: ordenarSnapshots.map(s => s.datos.beneficio_costo_acumulado || 0),
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            yAxisID: 'y'
        }]
    });

    const generarReporte = async () => {
        const columnas = ['Versión', 'Fecha', 'B/C', 'Balance'];
        const datos = ordenarSnapshots.map(s => [
            `v${s.version}`,
            new Date(s.fecha_registro).toLocaleDateString('es-CO'),
            s.datos.beneficio_costo_acumulado.toFixed(2),
            new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
                (s.datos.ingresos_ventas_acumulado || 0) -
                (s.datos.costo_mano_obra_acumulado + s.datos.egresos_insumos_acumulado + s.datos.depreciacion_herramientas_acumulada)
            )
        ]);

        if (formato === 'pdf') {
            const doc = new jsPDF();
            doc.text('Historial de Snapshots', 14, 20);
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
                    type: 'line',
                    data: generarDatosGraficoEvolucion(),
                    options: {
                        plugins: {
                            title: { display: true, text: 'Evolución de Relación B/C', font: { size: 16 } }
                        }
                    }
                });
                const finalY = (doc as any).lastAutoTable?.finalY || 40;
                doc.addImage(canvas.toDataURL('image/png'), 'PNG', 14, finalY + 10, 180, 80);
            }
            doc.save('historial_snapshots.pdf');
        } else {
            const ws = XLSX.utils.json_to_sheet(datos.map(d => ({
                Versión: d[0],
                Fecha: d[1],
                'B/C': d[2],
                Balance: d[3]
            })));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Historial');
            if (chartRef.current) {
                const canvas = await html2canvas(chartRef.current);
                const imageData = canvas.toDataURL('image/png');
                const wsImage = XLSX.utils.json_to_sheet([{ Imagen: 'Gráfico de Historial' }]);
                XLSX.utils.book_append_sheet(wb, wsImage, 'Gráfico');
            }
            XLSX.writeFile(wb, 'historial_snapshots.xlsx');
        }
    };

    return (
        <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Historial de Snapshots</h3>
            <div ref={chartRef}>
                <ChartLine
                    data={generarDatosGraficoEvolucion()}
                    options={{ plugins: { title: { display: true, text: 'Evolución de Relación B/C', font: { size: 16 } } } }}
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

export default ReporteHistorial;