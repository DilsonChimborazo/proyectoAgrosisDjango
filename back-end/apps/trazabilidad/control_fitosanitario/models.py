from django.db import models
from apps.trazabilidad.cultivo.models import Cultivo
from apps.trazabilidad.pea.models import Pea
from apps.inventario.insumo.models import Insumo
from apps.usuarios.usuario.models import Usuarios
from apps.inventario.unidadMedida.models import UnidadMedida
from decimal import Decimal

# Create your models here.
class Control_fitosanitario(models.Model):
    TIPOS_CONTROL = [
        ('Control Biológico', 'Control Biológico'),
        ('Control Físico', 'Control Físico'),
        ('Control Químico', 'Control Químico'),
        ('Control Cultural', 'Control Cultural'),
        ('Control Genético ', 'Control Genético')
    ]
    fecha_control = models.DateField()
    duracion = models.IntegerField(help_text="Duración en minutos")
    descripcion = models.CharField(max_length=300)
    tipo_control = models.CharField(max_length=20, choices=TIPOS_CONTROL, default='Control Biológico')
    fk_id_cultivo = models.ForeignKey(Cultivo, on_delete=models.SET_NULL, null=True)
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
    fk_identificacion = models.ForeignKey(Usuarios, on_delete=models.SET_NULL, null=True)
    img = models.ImageField(upload_to='imagenes/')

 
    costo_insumo = models.DecimalField(
        max_digits=20,
        decimal_places=1,
        null=True,
        blank=True,
        help_text="Costo total del insumo basado en la cantidad base y precio por base"
    )
    
    def save(self, *args, **kwargs):
        # Asegurar que la unidad de medida existe
        if self.fk_unidad_medida:
            try:
                # Convertir cantidad a unidad base
                self.cantidad_en_base = self.fk_unidad_medida.convertir_a_base(self.cantidad_insumo)
                
                # Calcular costo solo si hay insumo y cantidad_en_base
                if self.fk_id_insumo and self.cantidad_en_base:
                    if not self.fk_id_insumo.precio_por_base:
                        # Si no tiene precio_por_base, actualizar el insumo primero
                        self.fk_id_insumo.save()
                    
                    if self.fk_id_insumo.precio_por_base:
                        self.costo_insumo = Decimal(self.cantidad_en_base) * self.fk_id_insumo.precio_por_base
            except AttributeError as e:
                print(f"Error en conversión: {e}")  # Para debug
        else:
            print("Advertencia: No hay unidad de medida asignada")  # Para debug

        super().save(*args, **kwargs)

        
    def __str__(self):
        return f"Cultivo: {self.fk_id_cultivo.nombre_cultivo} pea: {self.fk_id_pea}" 

