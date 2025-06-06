from django.db import models
from apps.finanzas.salario.models import Salario 
from apps.trazabilidad.programacion.models import Programacion 
from apps.trazabilidad.control_fitosanitario.models import Control_fitosanitario
from apps.usuarios.usuario.models import Usuarios

class Nomina(models.Model):
    fk_id_programacion = models.ForeignKey(Programacion, on_delete=models.SET_NULL, null=True, blank=True)
    fk_id_salario = models.ForeignKey(Salario, on_delete=models.SET_NULL, null=True)
    fk_id_usuario = models.ForeignKey(Usuarios, on_delete=models.SET_NULL, null=True, blank=True)  # Nuevo campo
    pago_total = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    fk_id_control_fitosanitario = models.ForeignKey(Control_fitosanitario, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_pago = models.DateField(null=True, blank=True)
    pagado = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Nómina #{self.id} - Pago total: {self.pago_total} - Usuario: {self.fk_id_usuario or 'N/A'}"

    @property
    def usuario(self):
        if self.fk_id_usuario:
            return self.fk_id_usuario
        elif self.fk_id_control_fitosanitario:
            return self.fk_id_control_fitosanitario.fk_identificacion
        return None

    @property
    def actividad(self):
        if self.fk_id_programacion:
            return self.fk_id_programacion.fk_id_asignacionActividades.fk_id_realiza.fk_id_actividad.nombre_actividad
        elif self.fk_id_control_fitosanitario:
            return self.fk_id_control_fitosanitario.tipo_control
        return "Desconocida"