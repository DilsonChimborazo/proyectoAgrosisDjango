from django.contrib import admin
from apps.iot.lote.models import Lote 

@admin.register(Lote)
class LoteAdmin(admin.ModelAdmin):
    list_display = ('estado','dimencion','nombre_lote') 
