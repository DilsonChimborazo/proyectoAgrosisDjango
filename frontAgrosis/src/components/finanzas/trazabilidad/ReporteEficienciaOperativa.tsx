import { useRef } from 'react';
import { ChartScatter } from '@/components/globales/Charts';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { TrazabilidadCultivoReporte } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DescargarExcel } from '@/components/globales/DescargarExcel';
import html2canvas from 'html2canvas';

interface ReporteEficienciaOperativaProps {
  trazabilidadData: TrazabilidadCultivoReporte | undefined;
  formato: 'pdf' | 'excel';
}

const ReporteEficienciaOperativa = ({ trazabilidadData, formato }: ReporteEficienciaOperativaProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  // Validación inicial
  if (!trazabilidadData) {
    return <p className="text-gray-500 text-center py-4">Seleccione una plantación para generar el reporte</p>;
  }

  const hasInsumos = trazabilidadData.detalle_insumos?.length > 0;

  const generarDatosGraficoEficiencia = () => {
    if (!hasInsumos) {
      return {
        datasets: [
          {
            label: 'Eficiencia Operativa',
            data: [{ x: 0, y: trazabilidadData.total_cantidad_producida_base_acumulado || 0 }],
            backgroundColor: '#4CAF50',
            borderColor: '#388E3C',
            pointRadius: 5,
          },
        ],
      };
    }
    return {
      datasets: [
        {
          label: 'Eficiencia Operativa',
          data: trazabilidadData.detalle_insumos.map(i => ({
            x: i.costo_total || 0,
            y: trazabilidadData.total_cantidad_producida_base_acumulado || 0,
          })),
          backgroundColor: '#4CAF50',
          borderColor: '#388E3C',
          pointRadius: 5,
        },
      ],
    };
  };

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
      { header: 'Insumo', key: 'insumo', width: 30 },
      { header: 'Costo Total', key: 'costo', width: 20 },
      { header: 'Producción Total', key: 'produccion', width: 20 },
    ];

    // Preparar datos para Excel
    const datos = hasInsumos
      ? trazabilidadData.detalle_insumos.map(i => ({
          insumo: i.nombre || 'Sin nombre',
          costo: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(i.costo_total || 0),
          produccion: `${trazabilidadData.total_cantidad_producida_base_acumulado || 0} ${trazabilidadData.unidad_base || 'N/A'}`,
        }))
      : [{
          insumo: 'Sin insumos',
          costo: '0 COP',
          produccion: `${trazabilidadData.total_cantidad_producida_base_acumulado || 0} ${trazabilidadData.unidad_base || 'N/A'}`,
        }];

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
      doc.text(`Reporte de Eficiencia Operativa - ${trazabilidadData.cultivo || 'Sin cultivo'}`, leftMargin, infoY, { align: 'left' });
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
          0: { cellWidth: 60 },
          1: { cellWidth: 40 },
          2: { cellWidth: 40 },
        },
      });

      // Gráfico
      if (chartRef.current && hasInsumos) {
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
        doc.text(hasInsumos ? 'No se encontró el gráfico para incluir en el PDF' : 'No hay insumos para generar el gráfico', leftMargin, (doc as any).lastAutoTable?.finalY + 10 || (infoY + 20));
      }

      // Pie de página
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text('Generado por Agrosoft - Centro de Gestión y Desarrollo Sostenible Surcolombiano', leftMargin, doc.internal.pageSize.getHeight() - 10);

      doc.save(`reporte_eficiencia_${trazabilidadData.cultivo || 'trazabilidad'}.pdf`);
    } else {
      // Usar DescargarExcel para generar el reporte Excel
      await DescargarExcel({
        data: datos,
        columns: columnas,
        title: 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO',
        subtitle: `ÁREA PAE - Reporte de Eficiencia Operativa - ${trazabilidadData.cultivo || 'Sin cultivo'}`,
        logoSenaPath: '/logoSena.png',
        logoKaizenPath: '/agrosoft.png',
        chartRef: hasInsumos ? chartRef : undefined, // Solo pasar chartRef si hay insumos
        filename: `reporte_eficiencia_${trazabilidadData.cultivo || 'trazabilidad'}.xlsx`,
      });
    }
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800">Reporte de Eficiencia Operativa</h3>
      {hasInsumos ? (
        <div ref={chartRef}>
          <ChartScatter
            data={generarDatosGraficoEficiencia()}
            options={{
              plugins: { title: { display: true, text: 'Eficiencia: Costos vs. Producción', font: { size: 16 } } },
              scales: {
                x: { title: { display: true, text: 'Costo Total (COP)' } },
                y: { title: { display: true, text: `Producción (${trazabilidadData.unidad_base || 'N/A'})` } },
              },
            }}
            height={300}
          />
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">No hay insumos registrados, pero puedes descargar un reporte básico.</p>
      )}
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

export default ReporteEficienciaOperativa;