import { useRef } from 'react';
import { ChartPie } from '@/components/globales/Charts';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { TrazabilidadCultivoReporte } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart as ChartJS } from 'chart.js';

interface ReporteInsumosProps {
    trazabilidadData: TrazabilidadCultivoReporte | undefined;
    formato: 'pdf' | 'excel';
}

const ReporteInsumos = ({ trazabilidadData, formato }: ReporteInsumosProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    if (!trazabilidadData || !trazabilidadData.detalle_insumos?.length) {
        return <p className="text-gray-500 text-center py-4">No hay datos de insumos disponibles</p>;
    }

    const generarDatosGraficoInsumos = () => ({
        labels: trazabilidadData.detalle_insumos.map(i => i.nombre || 'Sin nombre'),
        datasets: [{
            label: 'Costo de Insumos',
            data: trazabilidadData.detalle_insumos.map(i => i.costo_total || 0),
            backgroundColor: ['#4CAF50', '#2196F3', '#FF9800', '#F44336', '#9C27B0'],
            borderWidth: 1
        }]
    });

    const generarReporte = async () => {
        const columnas = ['Insumo', 'Tipo', 'Cantidad', 'Costo'];
        const datos = trazabilidadData.detalle_insumos.map(i => [
            i.nombre || 'Sin nombre',
            i.tipo_insumo || 'Sin tipo',
            `${i.cantidad || 0} ${i.unidad_medida || 'N/A'}`,
            new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(i.costo_total || 0)
        ]);

        if (formato === 'pdf') {
            const doc = new jsPDF();
            doc.text(`Reporte de Insumos - ${trazabilidadData.cultivo || 'Sin cultivo'}`, 14, 20);
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
                    type: 'pie',
                    data: generarDatosGraficoInsumos(),
                    options: {
                        plugins: {
                            title: { display: true, text: 'Distribución de Costos de Insumos', font: { size: 16 } }
                        }
                    }
                });
                const finalY = (doc as any).lastAutoTable?.finalY || 40;
                doc.addImage(canvas.toDataURL('image/png'), 'PNG', 14, finalY + 10, 180, 80);
            }
            doc.save(`reporte_insumos_${trazabilidadData.cultivo || 'trazabilidad'}.pdf`);
        } else {
            const ws = XLSX.utils.json_to_sheet(datos.map(d => ({
                Insumo: d[0],
                Tipo: d[1],
                Cantidad: d[2],
                Costo: d[3]
            })));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Insumos');
            if (chartRef.current) {
                const canvas = await html2canvas(chartRef.current);
                const imageData = canvas.toDataURL('image/png');
                const wsImage = XLSX.utils.json_to_sheet([{ Imagen: 'Gráfico de Insumos' }]);
                XLSX.utils.book_append_sheet(wb, wsImage, 'Gráfico');
            }
            XLSX.writeFile(wb, `reporte_insumos_${trazabilidadData.cultivo || 'trazabilidad'}.xlsx`);
        }
    };

    return (
        <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Reporte de Uso de Insumos</h3>
            <div ref={chartRef}>
                <ChartPie
                    data={generarDatosGraficoInsumos()}
                    options={{ plugins: { title: { display: true, text: 'Distribución de Costos de Insumos', font: { size: 16 } } } }}
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

export default ReporteInsumos;