from django.db import models

# Create your models here.

class UnidadMedida (models.Model):
    class UnidadBaseEnum(models.TextChoices):
        GRAMO = 'g', 'Gramo'
        MILILITRO = 'ml', 'Mililitro'
        UNIDAD = 'u', 'Unidad'

    nombre_medida = models.CharField(max_length=50, unique=True)
    
    # ¿A qué unidad base pertenece esta unidad?
    unidad_base = models.CharField(
        max_length=5,
        choices=UnidadBaseEnum.choices,
        default=UnidadBaseEnum.GRAMO
    )

    # ¿Cuánto equivale 1 unidad de esta medida en la unidad base?
    # Ej: 1 litro = 1000 ml, 1 libra = 453.59 gramos
    factor_conversion = models.DecimalField(
        max_digits=10,
        decimal_places=4,
        help_text="Cantidad equivalente en la unidad base (g, ml o u)."
    )

    def convertir_a_base(self, cantidad):
        """Convierte cualquier cantidad registrada a su equivalente en la unidad base."""
        return cantidad * self.factor_conversion

    def __str__(self):
        return f"{self.nombre_medida} ({self.unidad_base})"

