from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from apps.finanzas.venta.models import Venta, ItemVenta
from apps.finanzas.venta.api.serializers import VentaSerializer, CrearVentaSerializer, LeerItemVentaSerializer, VentaFacturaSerializer
from django.http import HttpResponse
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.styles import getSampleStyleSheet

class VentaViewSet(ModelViewSet):
    queryset = Venta.objects.prefetch_related('items').all()
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return VentaSerializer
        return CrearVentaSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    @action(detail=True, methods=['get'], url_path='factura-pdf')
    def generar_factura_pdf(self, request, pk=None):
        venta = self.get_object()
        serializer = VentaFacturaSerializer(venta)
        data = serializer.data

        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="factura_venta_{pk}.pdf"'
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []

        styles = getSampleStyleSheet()
        title = Paragraph(f"Factura - Venta #{pk}", styles['Heading1'])
        elements.append(title)

        venta_data = [
            ['ID', str(data['id'])],
            ['Fecha', data['fecha']],
            ['Total', f"${data['total']:.2f}"],
            ['Vendedor', f"{data['usuario']['nombre']} {data['usuario']['apellido']}"],
            ['Email', data['usuario']['email']],
        ]
        table_venta = Table(venta_data)
        table_venta.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
        ]))
        elements.append(table_venta)

        items_data = [['Producto', 'Cantidad', 'Precio Unitario', 'Descuento (%)', 'Precio con Descuento', 'Subtotal']]
        for item in data['items']:
            subtotal = item['subtotal']
            descuento_porcentaje = item['descuento_porcentaje']
            subtotal_con_descuento = subtotal * (1 - descuento_porcentaje / 100) if descuento_porcentaje > 0 else subtotal
            items_data.append([
                item['produccion']['nombre_produccion'],
                f"{item['cantidad']} {item['unidad_medida']['unidad_base']}",
                f"${item['precio_unidad']:.2f}",
                f"{descuento_porcentaje:.2f}%",
                f"${item['precio_unidad_con_descuento']:.2f}",
                f"${subtotal_con_descuento:.2f}",
            ])
        table_items = Table(items_data)
        table_items.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, 0), 14),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
            ('ALIGN', (0, 1), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 1), (-1, -1), 12),
        ]))
        elements.append(table_items)

        doc.build(elements)
        return response

class ItemVentaViewSet(ModelViewSet):
    serializer_class = LeerItemVentaSerializer
    permission_classes = [IsAuthenticated]
    queryset = ItemVenta.objects.select_related('produccion', 'unidad_medida').all()
    
    def get_queryset(self):
        venta_id = self.kwargs.get('venta_pk')
        if venta_id:
            return self.queryset.filter(venta_id=venta_id)
        return self.queryset.none()