import { useRef } from 'react';
import { ChartBar } from '@/components/globales/Charts';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { TrazabilidadCultivoReporte } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DescargarExcel } from '@/components/globales/DescargarExcel';
import html2canvas from 'html2canvas';

interface ReporteRentabilidadProps {
  trazabilidadData: TrazabilidadCultivoReporte | undefined;
  formato: 'pdf' | 'excel';
}

const ReporteRentabilidad = ({ trazabilidadData, formato }: ReporteRentabilidadProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Validación inicial
  if (!trazabilidadData) {
    return <p className="text-gray-500 text-center py-4">Seleccione una plantación para generar el reporte</p>;
  }

  const generarDatosGraficoCostos = () => ({
    labels: ['Mano de Obra', 'Insumos', 'Depreciación'],
    datasets: [
      {
        label: 'Costos',
        data: [
          trazabilidadData.costo_mano_obra_acumulado || 0,
          trazabilidadData.egresos_insumos_acumulado || 0,
          trazabilidadData.depreciacion_herramientas_acumulada || 0,
        ],
        backgroundColor: ['#4CAF50', '#2196F3', '#FF9800'],
        borderColor: ['#388E3C', '#1976D2', '#F57C00'],
        borderWidth: 1,
      },
    ],
  });

  const cargarImagenComoBase64 = (url: string): Promise<string> => {
    return fetch(url)
      .then((res) => res.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          })
      );
  };

  const generarReporte = async () => {
    // Definir columnas para Excel
    const columnas = [
      { header: 'Métrica', key: 'metrica', width: 30 },
      { header: 'Valor', key: 'valor', width: 20 },
    ];

    // Preparar datos para Excel
    const datos = [
      {
        metrica: 'Relación B/C',
        valor: (trazabilidadData.beneficio_costo_acumulado ?? 0).toFixed(2),
      },
      {
        metrica: 'Balance',
        valor: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
          (trazabilidadData.ingresos_ventas_acumulado || 0) -
            ((trazabilidadData.costo_mano_obra_acumulado || 0) +
              (trazabilidadData.egresos_insumos_acumulado || 0) +
              (trazabilidadData.depreciacion_herramientas_acumulada || 0))
        ),
      },
      {
        metrica: 'Costo Mano de Obra',
        valor: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.costo_mano_obra_acumulado || 0),
      },
      {
        metrica: 'Costo Insumos',
        valor: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.egresos_insumos_acumulado || 0),
      },
      {
        metrica: 'Depreciación Herramientas',
        valor: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.depreciacion_herramientas_acumulada || 0),
      },
      {
        metrica: 'Ingresos por Ventas',
        valor: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(trazabilidadData.ingresos_ventas_acumulado || 0),
      },
    ];

    if (formato === 'pdf') {
      const doc = new jsPDF();

      // Cargar logos
      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      // Encabezado
      const pageWidth = doc.internal.pageSize.getWidth();
      const headerTop = 10;
      const headerHeight = 30;
      const leftMargin = 14;
      const rightMargin = 14;
      const usableWidth = pageWidth - leftMargin - rightMargin;
      const leftSectionWidth = usableWidth * 0.15;
      const centerSectionWidth = usableWidth * 0.70;
      const rightSectionWidth = usableWidth * 0.15;
      const leftX = leftMargin;
      const centerX = leftMargin + leftSectionWidth;
      const rightX = leftMargin + leftSectionWidth + centerSectionWidth;

      doc.setFillColor(245, 245, 245);
      doc.rect(leftX, headerTop, usableWidth, headerHeight, 'F');
      doc.setLineWidth(0.2);
      doc.setDrawColor(0, 120, 100);
      doc.line(centerX, headerTop, centerX, headerTop + headerHeight);
      doc.line(rightX, headerTop, rightX, headerTop + headerHeight);

      // Logo izquierdo
      const logoSize1 = 22;
      const logoY = headerTop + (headerHeight - logoSize1) / 2;
      doc.addImage(logoSena, 'PNG', leftX + (leftSectionWidth - logoSize1) / 2, logoY, logoSize1, logoSize1);

      // Texto central
      const centerContentX = centerX + centerSectionWidth / 2;
      const centerStartY = headerTop + headerHeight / 2;
      const lineHeight = 7;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 80, 60);
      doc.text('CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE', centerContentX, centerStartY - lineHeight, { align: 'center' });
      doc.text('SURCOLOMBIANO', centerContentX, centerStartY, { align: 'center' });
      doc.text('ÁREA PAE', centerContentX, centerStartY + lineHeight, { align: 'center' });

      // Logo derecho
      const logoSize2 = 25;
      doc.addImage(logoKaizen, 'PNG', rightX + (rightSectionWidth - logoSize2) / 2, logoY, logoSize2, logoSize2);

      // Título y fecha
      const infoY = headerTop + headerHeight + 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text(`Reporte de Rentabilidad - ${trazabilidadData.cultivo || 'Sin cultivo'}`, leftMargin, infoY, { align: 'left' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha de generación: ${new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}`, pageWidth - rightMargin, infoY, { align: 'right' });

      // Tabla
      autoTable(doc, {
        startY: infoY + 10,
        head: [columnas.map(col => col.header)],
        body: datos.map(d => Object.values(d)),
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 4, halign: 'center', lineWidth: 0.1, font: 'helvetica' },
        headStyles: { fillColor: [0, 120, 100], textColor: 255, fontStyle: 'bold', fontSize: 11 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        columnStyles: {
          0: { cellWidth: 40 },
          1: { cellWidth: 50 },
        },
      });

      // Gráfico
      if (chartRef.current) {
        const canvas = await html2canvas(chartRef.current, { scale: 3, useCORS: true, logging: false });
        const imageData = canvas.toDataURL('image/png', 1.0);
        const finalY = (doc as any).lastAutoTable?.finalY || (infoY + 10);
        try {
          doc.addImage(imageData, 'PNG', leftMargin, finalY + 10, 180, 80);
        } catch (error) {
          console.error('Error al agregar imagen al PDF:', error);
          doc.text('No se pudo incluir el gráfico en el PDF', leftMargin, finalY + 10);
        }
      } else {
        doc.text('No se encontró el gráfico para incluir en el PDF', leftMargin, (doc as any).lastAutoTable?.finalY + 10 || (infoY + 20));
      }

      // Pie de página
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano', leftMargin, doc.internal.pageSize.getHeight() - 10);

      doc.save(`reporte_rentabilidad_${trazabilidadData.cultivo || 'trazabilidad'}.pdf`);
    } else {
      // Usar DescargarExcel para generar el reporte Excel
      await DescargarExcel({
        data: datos,
        columns: columnas,
        title: 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO',
        subtitle: `ÁREA PAE - Reporte de Rentabilidad - ${trazabilidadData.cultivo || 'Sin cultivo'}`,
        logoSenaPath: '/logoSena.png',
        logoKaizenPath: '/agrosoft.png',
        chartRef,
        filename: `reporte_rentabilidad_${trazabilidadData.cultivo || 'trazabilidad'}.xlsx`,
      });
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Reporte de Rentabilidad</h3>
      <div ref={chartRef}>
        <ChartBar
          data={generarDatosGraficoCostos()}
          options={{
            plugins: { title: { display: true, text: 'Distribución de Costos', font: { size: 16 } } },
            scales: { y: { beginAtZero: true, title: { display: true, text: 'Costo (COP)' } } },
          }}
          height={300}
        />
      </div>
      <Button
        text="Descargar Reporte"
        variant="success"
        onClick={generarReporte}
        className="w-full flex justify-center items-center gap-2 hover:bg-green-600 transition-colors py-3"
        icon={Download}
      />
    </div>
  );
};

export default ReporteRentabilidad;