import { useRef } from 'react';
import { ChartBar } from '@/components/globales/Charts';
import { Download } from 'lucide-react';
import Button from '@/components/globales/Button';
import { SnapshotTrazabilidad } from './Types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DescargarExcel } from '@/components/globales/DescargarExcel';
import html2canvas from 'html2canvas';

interface ReporteComparacionesProps {
  ordenarSnapshots: SnapshotTrazabilidad[];
  comparando: number[];
  formato: 'pdf' | 'excel';
}

const ReporteComparaciones = ({ ordenarSnapshots, comparando, formato }: ReporteComparacionesProps) => {
  const chartRef = useRef<HTMLDivElement>(null);

  if (!ordenarSnapshots || !ordenarSnapshots.length || !comparando.length) {
    return <p className="text-gray-500 text-center py-4">Seleccione al menos un snapshot para comparar</p>;
  }

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
    const columnas: { header: string; key: string; width: number }[] = [
      { header: 'Snapshot', key: 'snapshot', width: 15 },
      { header: 'Cultivo', key: 'cultivo', width: 30 },
      { header: 'Fecha', key: 'fecha', width: 20 },
      { header: 'Relación B/C', key: 'bc', width: 15 },
      { header: 'Balance', key: 'balance', width: 25 },
    ];

    // Preparar datos para Excel
    const datos = ordenarSnapshots.map(s => ({
      snapshot: `v${s.version}`,
      cultivo: s.datos.cultivo || 'Sin cultivo',
      fecha: new Date(s.fecha_registro).toLocaleDateString('es-CO'),
      bc: (s.datos.beneficio_costo_acumulado ?? 0).toFixed(2),
      balance: new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(
        (s.datos.ingresos_ventas_acumulado || 0) -
        ((s.datos.costo_mano_obra_acumulado || 0) +
         (s.datos.egresos_insumos_acumulado || 0) +
         (s.datos.depreciacion_herramientas_acumulada || 0))
      ),
    }));

    if (formato === 'pdf') {
      const doc = new jsPDF();

      // Cargar logos
      const logoSena = await cargarImagenComoBase64('/logoSena.png');
      const logoKaizen = await cargarImagenComoBase64('/agrosoft.png');

      // Dimensiones de la página
      const pageWidth = doc.internal.pageSize.getWidth();
      const headerTop = 10;
      const headerHeight = 30;
      const leftMargin = 14;
      const rightMargin = 15;
      const usableWidth = pageWidth - leftMargin * 2;
      const leftSectionWidth = usableWidth * 0.15;
      const centerSectionWidth = usableWidth * 0.70;
      const rightSectionWidth = usableWidth * 0.15;
      const leftX = leftMargin;
      const centerX = leftMargin + leftSectionWidth;
      const rightX = leftMargin + leftSectionWidth + centerSectionWidth;

      // Contenedor principal
      doc.setFillColor(245, 245, 245);
      doc.rect(leftX, headerTop, usableWidth, headerHeight, 'F');
      doc.setLineWidth(0.2);
      doc.setDrawColor(0, 120, 100);
      doc.rect(leftX, headerTop, usableWidth, headerHeight);

      // Líneas divisorias
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
      doc.setTextColor(0, 120, 100);
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
      doc.text('Reporte de Comparaciones de Snapshots', leftMargin, infoY, { align: 'left' });
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text(`Fecha de generación: ${new Date().toLocaleDateString('es-CO')}`, pageWidth - rightMargin, infoY, { align: 'right' });

      // Tabla
      autoTable(doc, {
        startY: headerTop + headerHeight + 16,
        head: [columnas.map(col => col.header)],
        body: datos.map(d => Object.values(d)),
        theme: 'striped',
        styles: {
          fontSize: 10,
          cellPadding: 4,
          halign: 'center',
          lineWidth: 0.1,
          font: 'helvetica',
        },
        headStyles: {
          fillColor: [0, 120, 100],
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 11,
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
      });

      // Gráfico
      if (chartRef.current) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const canvas = await html2canvas(chartRef.current, { scale: 3, useCORS: true, logging: false });
        const imageData = canvas.toDataURL('image/png', 1.0);
        const finalY = (doc as any).lastAutoTable?.finalY || 40;
        try {
          doc.addImage(imageData, 'PNG', leftMargin, finalY + 10, 180, 80);
        } catch (error) {
          console.error('Error al agregar imagen al PDF:', error);
          doc.text('No se pudo incluir el gráfico en el PDF', leftMargin, finalY + 10);
        }
      } else {
        doc.text('No se encontró el gráfico para incluir en el PDF', leftMargin, (doc as any).lastAutoTable?.finalY + 10 || 50);
      }

      doc.save('reporte_comparaciones_snapshots.pdf');
    } else {
      // Usar DescargarExcel para generar el reporte Excel
      await DescargarExcel({
        data: datos,
        columns: columnas,
        title: 'CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE SURCOLOMBIANO',
        subtitle: 'Reporte de Comparaciones de Snapshots - Sector Agropecuario',
        logoSenaPath: '/logoSena.png',
        logoKaizenPath: '/agrosoft.png',
        chartRef,
        filename: 'Reporte_Comparaciones_Snapshots_Agropecuario.xlsx',
      });
    }
  };

  return (
    <div className="space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-semibold text-gray-800">Reporte de Comparaciones de Snapshots</h3>
      <div ref={chartRef}>
        <ChartBar
          data={{
            labels: ordenarSnapshots.map(s => `Snapshot v${s.version} (${s.datos.cultivo || 'Sin cultivo'})`),
            datasets: [
              {
                label: 'Relación B/C',
                data: ordenarSnapshots.map(s => s.datos.beneficio_costo_acumulado || 0),
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1,
              },
              {
                label: 'Balance',
                data: ordenarSnapshots.map(s =>
                  (s.datos.ingresos_ventas_acumulado || 0) -
                  ((s.datos.costo_mano_obra_acumulado || 0) +
                   (s.datos.egresos_insumos_acumulado || 0) +
                   (s.datos.depreciacion_herramientas_acumulada || 0))
                ),
                backgroundColor: '#2196F3',
                borderColor: '#1976D2',
                borderWidth: 1,
              },
            ],
          }}
          options={{
            plugins: {
              title: { display: true, text: 'Comparación de Snapshots - Sector Agropecuario', font: { size: 18 } },
              legend: { position: 'top' },
            },
            scales: {
              y: { beginAtZero: true },
            },
          }}
          height={350}
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

export default ReporteComparaciones;