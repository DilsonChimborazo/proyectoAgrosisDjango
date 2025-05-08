from django.contrib import admin
from apps.iot.lote.models import Lote 

@admin.register(Lote)
class LoteAdmin(admin.ModelAdmin):
    list_display = ('dimencion','nombre_lote','estado') 
