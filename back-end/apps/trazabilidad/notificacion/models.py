# notificaciones/models.py
from django.db import models
from apps.usuarios.usuario.models import Usuarios

class Notificacion(models.Model):
    usuario = models.ForeignKey(Usuarios, on_delete=models.CASCADE, related_name='notificaciones')
    titulo = models.CharField(max_length=100)
    mensaje = models.TextField()
    fecha_notificacion = models.DateTimeField(auto_now_add=True)
    leida = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo

    class Meta:
        ordering = ['-fecha_notificacion']