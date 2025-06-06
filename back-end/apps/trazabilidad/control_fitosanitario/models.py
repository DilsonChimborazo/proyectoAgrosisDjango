from django.db import models
from apps.trazabilidad.plantacion.models import Plantacion
from apps.trazabilidad.pea.models import Pea
from apps.inventario.insumo.models import Insumo
from apps.usuarios.usuario.models import Usuarios
from apps.inventario.unidadMedida.models import UnidadMedida
from apps.inventario.bodega.models import Bodega
from decimal import Decimal

class Control_fitosanitario(models.Model):
    TIPOS_CONTROL = [
        ('Control Biologico', 'Control Biologico'),
        ('Control Fisico', 'Control Fisico'),
        ('Control Quimico', 'Control Quimico'),
        ('Control Cultural', 'Control Cultural'),
        ('Control Genetico', 'Control Genetico')
    ]

    fecha_control = models.DateField()
    duracion = models.IntegerField(help_text="Duración en minutos")
    descripcion = models.CharField(max_length=300)
    tipo_control = models.CharField(max_length=20, choices=TIPOS_CONTROL, default='Control Biológico')
    fk_id_plantacion = models.ForeignKey(Plantacion, on_delete=models.SET_NULL, null=True)
    fk_id_pea = models.ForeignKey(Pea, on_delete=models.SET_NULL, null=True)
    fk_id_insumo = models.ForeignKey(Insumo, on_delete=models.SET_NULL, null=True)
    cantidad_insumo = models.IntegerField()
    cantidad_en_base = models.DecimalField(
        max_digits=20,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Cantidad de insumo convertida a unidad base (g, ml, u)"
    )
    fk_unidad_medida = models.ForeignKey(UnidadMedida, on_delete=models.SET_NULL, null=True)
    fk_identificacion = models.ManyToManyField(Usuarios, related_name='controles_fitosanitarios')
    img = models.ImageField(upload_to='imagenes/')
    costo_insumo = models.DecimalField(
        max_digits=20,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Costo total del insumo basado en la cantidad base y precio por base"
    )

    def save(self, *args, **kwargs):
        if self.fk_unidad_medida:
            try:
                self.cantidad_en_base = self.fk_unidad_medida.convertir_a_base(self.cantidad_insumo)
                if self.fk_id_insumo and self.cantidad_en_base:
                    if not self.fk_id_insumo.precio_por_base:
                        self.fk_id_insumo.save()
                    if self.fk_id_insumo.precio_por_base:
                        self.costo_insumo = Decimal(self.cantidad_en_base) * self.fk_id_insumo.precio_por_base
            except AttributeError as e:
                print(f"Error en conversión: {e}")
        else:
            print("Advertencia: No hay unidad de medida asignada")

        super().save(*args, **kwargs)

        if self.fk_id_insumo and self.cantidad_insumo:
            existe_salida = Bodega.objects.filter(
                fk_id_insumo=self.fk_id_insumo,
                cantidad_insumo=self.cantidad_insumo,
                movimiento='Salida',
                fk_unidad_medida=self.fk_unidad_medida,
                fecha__date=self.fecha_control
            ).exists()

            if not existe_salida:
                Bodega.objects.create(
                    fk_id_insumo=self.fk_id_insumo,
                    cantidad_insumo=self.cantidad_insumo,
                    movimiento='Salida',
                    fk_unidad_medida=self.fk_unidad_medida,
                    fk_id_asignacion=None,
                    cantidad_herramienta=None,
                )

    def __str__(self):
        usuarios = ", ".join([f"{u.nombre} {u.apellido}" for u in self.fk_identificacion.all()]) if self.fk_identificacion.exists() else "Sin usuarios"
        plantacion = str(self.fk_id_plantacion) if self.fk_id_plantacion else "Sin plantación"
        insumo = self.fk_id_insumo.nombre if self.fk_id_insumo else "Sin insumo"
        unidad = self.fk_unidad_medida.nombre_medida if self.fk_unidad_medida else "N/A"
        costo = str(self.costo_insumo) if self.costo_insumo is not None else "0"
        pea = str(self.fk_id_pea) if self.fk_id_pea else "Sin PEA"
        return f"plantacion: {plantacion}, Insumo: {insumo}, Cantidad: {self.cantidad_insumo}, Unidad: {unidad}, Costo: {costo}, PEA: {pea}, Usuarios: {usuarios}"