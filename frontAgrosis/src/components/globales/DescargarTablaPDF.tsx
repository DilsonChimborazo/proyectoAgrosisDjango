import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import React from "react";
import { Download } from "lucide-react";

interface DescargarTablaPDFProps {
  nombreArchivo?: string;
  columnas: (string | number)[];
  datos: (string | number)[][];
  titulo?: string;
  className?: string;
  children?: React.ReactNode;
}

const DescargarTablaPDF: React.FC<DescargarTablaPDFProps> = ({
  nombreArchivo = "reporte.pdf",
  columnas = [],
  datos = [],
  titulo = "Reporte",
  className = "",
}) => {
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

  const generarPDF = async () => {
    const doc = new jsPDF();
  
    // Cargar logos
    const logoSena = await cargarImagenComoBase64("/logoSena.png");
    const logoKaizen = await cargarImagenComoBase64("/agrosoft.png");
  
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
    doc.rect(leftX, headerTop, usableWidth, headerHeight);
  
    // Líneas divisorias
    doc.line(centerX, headerTop, centerX, headerTop + headerHeight);
    doc.line(rightX, headerTop, rightX, headerTop + headerHeight);
  
    // Logo izquierdo
    const logoSize1 = 22;
    const logoY = headerTop + (headerHeight - logoSize1) / 2;
    doc.addImage(logoSena, "PNG", leftX + (leftSectionWidth - logoSize1) / 2, logoY, logoSize1, logoSize1);
  
    // Texto central
    const centerContentX = centerX + centerSectionWidth / 2;
    const centerStartY = headerTop + headerHeight / 2;
    const lineHeight = 7;
  
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("CENTRO DE GESTIÓN Y DESARROLLO SOSTENIBLE", centerContentX, centerStartY - lineHeight, { align: "center" });
    doc.text("SURCOLOMBIANO", centerContentX, centerStartY, { align: "center" });
    doc.text("ÁREA PAE", centerContentX, centerStartY + lineHeight, { align: "center" });
  
    // Logo derecho
    const logoSize2 = 25;
    doc.addImage(logoKaizen, "PNG", rightX + (rightSectionWidth - logoSize2) / 2, logoY, logoSize2, logoSize2);
  
    // Título debajo del encabezado
    const infoY = headerTop + headerHeight + 10;

    // Título alineado a la izquierda
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(titulo, leftMargin, infoY, { align: "left" });
    
    // Fecha alineada a la derecha
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Fecha de generación: " + new Date().toLocaleDateString(), pageWidth - rightMargin, infoY, { align: "right" });
    
  
  
    // Tabla
    autoTable(doc, {
      startY: headerTop + headerHeight + 16,
      head: [columnas],
      body: datos,
      theme: "striped",
      styles: {
        fontSize: 10,
        cellPadding: 4,
        halign: "center",
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [0, 120, 100],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
    });
  

  
    doc.save(nombreArchivo);
  };
  

  return (
  <button
    onClick={generarPDF}
    className={` hover:text-green-700 text-gray-700  p-2 py-3 rounded-full ${className}`}
    title="Generar Reportes En PDF"
  >
    <Download size={20} />
  </button>
  );
};

export default DescargarTablaPDF;
