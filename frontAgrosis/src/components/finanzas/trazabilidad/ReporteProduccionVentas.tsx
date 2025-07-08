import { useRef } from 'react';
import { ChartLine } from '@/components/globales/Charts';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { TrazabilidadCultivoReporte } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Chart as ChartJS } from 'chart.js';

interface ReporteProduccionVentasProps {
    trazabilidadData: TrazabilidadCultivoReporte | undefined;
    formato: 'pdf' | 'excel';
}

const ReporteProduccionVentas = ({ trazabilidadData, formato }: ReporteProduccionVentasProps) => {
    const chartRef = useRef<HTMLDivElement>(null);

    if (!trazabilidadData || !trazabilidadData.detalle_ventas?.length) {
        return <p className="text-gray-500 text-center py-4">No hay datos de ventas disponibles</p>;
    }

    const generarDatosGraficoVentas = () => ({
        labels: trazabilidadData.detalle_ventas.map(v => v.fecha || 'Sin fecha'),
        datasets: [
            {
                label: 'Cantidad Vendida',
                data: trazabilidadData.detalle_ventas.map(v => v.cantidad || 0),
                borderColor: '#4CAF50',
                backgroundColor: 'rgba(76, 175, 80, 0.2)',
                yAxisID: 'y'
            },
            {
                label: 'Ingresos',
                data: trazabilidadData.detalle_ventas.map(v => v.total || 0),
                borderColor: '#2196F3',
                backgroundColor: 'rgba(33, 150, 243, 0.2)',
                yAxisID: 'y1'
            }
        ]
    });

    const generarReporte = async () => {
        const columnas = ['Fecha', 'Cantidad', 'Precio Unitario', 'Total'];
        const datos = trazabilidadData.detalle_ventas.map(v => [
            v.fecha || 'Sin fecha',
            `${v.cantidad || 0} ${v.unidad_medida || 'N/A'}`,
            new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(v.precio_unidad_con_descuento || 0),
            new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(v.total || 0)
        ]);

        if (formato === 'pdf') {
            const doc = new jsPDF();
            doc.text(`Reporte de Producción y Ventas - ${trazabilidadData.cultivo || 'Sin cultivo'}`, 14, 20);
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
                    data: generarDatosGraficoVentas(),
                    options: {
                        plugins: {
                            title: { display: true, text: 'Tendencias de Ventas', font: { size: 16 } }
                        },
                        scales: {
                            y: { position: 'left', title: { display: true, text: 'Cantidad' } },
                            y1: { position: 'right', title: { display: true, text: 'Ingresos (COP)' } }
                        }
                    }
                });
                const finalY = (doc as any).lastAutoTable?.finalY || 40;
                doc.addImage(canvas.toDataURL('image/png'), 'PNG', 14, finalY + 10, 180, 80);
            }
            doc.save(`reporte_ventas_${trazabilidadData.cultivo || 'trazabilidad'}.pdf`);
        } else {
            const ws = XLSX.utils.json_to_sheet(datos.map(d => ({
                Fecha: d[0],
                Cantidad: d[1],
                'Precio Unitario': d[2],
                Total: d[3]
            })));
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Ventas');
            if (chartRef.current) {
                const canvas = await html2canvas(chartRef.current);
                const imageData = canvas.toDataURL('image/png');
                const wsImage = XLSX.utils.json_to_sheet([{ Imagen: 'Gráfico de Ventas' }]);
                XLSX.utils.book_append_sheet(wb, wsImage, 'Gráfico');
            }
            XLSX.writeFile(wb, `reporte_ventas_${trazabilidadData.cultivo || 'trazabilidad'}.xlsx`);
        }
    };

    return (
        <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">Reporte de Producción y Ventas</h3>
            <div ref={chartRef}>
                <ChartLine
                    data={generarDatosGraficoVentas()}
                    options={{
                        plugins: { title: { display: true, text: 'Tendencias de Ventas', font: { size: 16 } } },
                        scales: {
                            y: { position: 'left', title: { display: true, text: 'Cantidad' } },
                            y1: { position: 'right', title: { display: true, text: 'Ingresos (COP)' } }
                        }
                    }}
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

export default ReporteProduccionVentas;