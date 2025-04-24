from django.db import models
from apps.trazabilidad.especie.models import Especie

class Nombre_cultivo(models.Model):
    nombre_cultivo = models.CharField(
        max_length=100,
        verbose_name="Nombre del Cultivo",
        unique=True,
        help_text="Nombre común del cultivo"
    )
    
    fk_id_especie = models.ForeignKey(
        Especie, 
        on_delete=models.SET_NULL, 
        null=True,
        blank=True,
        verbose_name="Especie",
        related_name="cultivos_de_especie"
    )
    
    class Meta:
        verbose_name = "Nombre de Cultivo"
        verbose_name_plural = "Nombres de Cultivos"
        ordering = ['nombre_cultivo']
    
    def __str__(self):
        return self.nombre_cultivo