from django.db import models


# se crea la solicitud para saber si el lote esta disponible
class LoteManager(models.Manager):
    def lotes_activos(self):
        return self.filter(estado='ocupado')

class Lote(models.Model):
    dimencion = models.CharField(max_length=50)
    nombre_lote = models.CharField(max_length=50)
    estado = models.BooleanField(default=True)

    objects = LoteManager()

    def __str__(self):
        return self.nombre_lote