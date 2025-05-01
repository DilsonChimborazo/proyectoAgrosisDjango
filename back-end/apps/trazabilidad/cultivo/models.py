from django.db import models
from apps.trazabilidad.especie.models import Especie

class Cultivo(models.Model):
    # Opciones para la etapa del cultivo
    ETAPAS = (
        ('inicial', 'Inicial'),
        ('desarrollo', 'Desarrollo'),
        ('final', 'Final'),
    )

    nombre_cultivo = models.CharField(max_length=100)
    descripcion = models.CharField(max_length=300)

    # Kc para cada etapa
    kc_inicial = models.DecimalField(max_digits=5, decimal_places=2, default=0.6)
    kc_desarrollo = models.DecimalField(max_digits=5, decimal_places=2, default=0.9)
    kc_final = models.DecimalField(max_digits=5, decimal_places=2, default=0.8)

    # Etapa actual (selección manual)
    etapa_actual = models.CharField(max_length=20, choices=ETAPAS, default='inicial')

    fk_id_especie = models.ForeignKey(Especie, on_delete=models.SET_NULL, null=True)

    def get_kc_actual(self):
        """
        Devuelve el Kc según la etapa actual seleccionada manualmente.
        """
        try:
            etapa = self.etapa_actual
            if etapa == "inicial":
                return self.kc_inicial
            elif etapa == "desarrollo":
                return self.kc_desarrollo
            elif etapa == "final":
                return self.kc_final
            else:
                return 0.0  # Para casos desconocidos
        except (TypeError, ValueError):
            return 0.0

    def calcular_etc(self, eto):
        """
        Calcula la evapotranspiración del cultivo (ETc) usando ETo y Kc.
        Argumentos:
            eto: Evapotranspiración de referencia (mm/día).
        Devuelve: ETc en mm/día.
        """
        kc = self.get_kc_actual()
        return float(eto) * float(kc)

    
    def __str__(self):
        return self.nombre_cultivo


