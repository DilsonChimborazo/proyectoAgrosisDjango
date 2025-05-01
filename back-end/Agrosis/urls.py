"""
URL configuration for Agrosis project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from django.urls import path,include
from django.conf import settings
from django.conf.urls.static import static

#rutas de usuario
from apps.usuarios.usuario.api.router import routerUsuario
from apps.usuarios.rol.api.router import routerRol
from apps.usuarios.ficha.api.router import routerFicha
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from apps.usuarios.usuario.api.views import CustomTokenObtainPairView 
from apps.usuarios.usuario.api.forgotPassword import solicitar_recuperacion, resetear_contraseña

#rutas de trazabilidad
from apps.trazabilidad.actividad.api.router import router_actividad
from apps.trazabilidad.cultivo.api.router import router_cultivo
from apps.trazabilidad.residuos.api.router import router_residuos
from apps.trazabilidad.tipo_residuos.api.router import router_tipo_residuos
from apps.trazabilidad.control_fitosanitario.api.router import router_control_fitosanitario
from apps.trazabilidad.plantacion.api.router import router_plantacion
from apps.trazabilidad.pea.api.router import router_pea
from apps.trazabilidad.asignacion_actividades.api.router import routerAsignacion_actividades
from apps.trazabilidad.calendario_lunar.api.router import routerCalendario_lunar
from apps.trazabilidad.especie.api.router import routerEspecie
from apps.trazabilidad.notificacion.api.router import routerNotificacion
from apps.trazabilidad.programacion.api.router import routerProgramacion
from apps.trazabilidad.realiza.api.router import routerRealiza
from apps.trazabilidad.semillero.api.router import routerSemillero
from apps.trazabilidad.tipo_cultivo.api.router import routerTipo_cultivo

#rutas de finanzas
from apps.finanzas.produccion.api.router import router_produccion
from apps.finanzas.venta.api.router import router_venta
from apps.finanzas.salario.api.router import router_salario
from apps.finanzas.nomina.api.router import router_nomina
from apps.finanzas.stock.api.router import router_stock
from apps.finanzas.nomina.api.views import TrazabilidadCultivoAPIView




#rutas de inventario
from apps.inventario.herramientas.api.routers import router_herramientas
from apps.inventario.insumo.api.routers import router_insumo
from apps.inventario.bodega.api.routers import routerBodega
from apps.inventario.unidadMedida.api.routers import routerUnidadMedida
from apps.inventario.insumoCompuesto.api.routers import router_insumo_compuesto
from apps.inventario.detalleInsumoCompuesto.api.routers import detalleInsumoCompuesto_router

#rutas de IoT
from apps.iot.eras.api.router import router_Eras
from apps.iot.lote.api.router import router_Lote
from apps.iot.mide.api.router import router_mide
from apps.iot.sensores.api.router import router_Sensores
from apps.iot.evapotranspiracion.api.router import router_Evapo

schema_view = get_schema_view(
    openapi.Info(
        title="documentacion API",
        default_version='v0.1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True
)

urlpatterns = [
    path('admin/', admin.site.urls),
    #USUARIO
    path('api/', include(routerUsuario.urls)),
    path('api/', include(routerRol.urls)),
    path('api/', include(routerFicha.urls)),
    path("api/solicitar-recuperacion/", solicitar_recuperacion, name="solicitar_recuperacion"),
    path("api/resetear-contrasena/", resetear_contraseña, name="resetear_contraseña"),
    path('api/docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('api/redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    #IOT
    path('api/', include(router_Eras.urls)),
    path('api/', include(router_Lote.urls)),
    path('api/', include(router_mide.urls)), 
    path('api/', include(router_Sensores.urls)),
    path('api/', include(router_Evapo.urls)),
    
    #FINANZASS
    path('api/', include(router_produccion.urls)),
    path('api/', include(router_venta.urls)),
    path('api/', include(router_nomina.urls)),
    path('api/', include(router_salario.urls)),
    path('api/', include(router_stock.urls)),
    path('api/finanzas/nomina/trazabilidad/<int:cultivo_id>/', TrazabilidadCultivoAPIView.as_view(), name='trazabilidad-cultivo'),



    #TRAZABILIDAD
    path('api/', include(router_actividad.urls)),
    path('api/', include(router_cultivo.urls)),
    path('api/', include(router_tipo_residuos.urls)),
    path('api/', include(router_control_fitosanitario.urls)),
    path('api/', include(router_plantacion.urls)),
    path('api/', include(router_pea.urls)),
    path('api/', include(router_residuos.urls)),
    path('api/', include(routerAsignacion_actividades.urls)),
    path('api/', include(routerCalendario_lunar.urls)),
    path('api/', include(routerEspecie.urls)),
    path('api/', include(routerRealiza.urls)),
    path('api/', include(routerTipo_cultivo.urls)),
    path('api/', include(routerSemillero.urls)),
    path('api/', include(routerProgramacion.urls)),
    path('api/', include(routerNotificacion.urls)),

    #INVENTARIO
    path('api/', include(router_herramientas.urls)),
    path('api/', include(router_insumo.urls)),
    path('api/', include(routerBodega.urls)),
    path('api/', include(routerUnidadMedida.urls)),
    path('api/', include(router_insumo_compuesto.urls)),
    path('api/', include(detalleInsumoCompuesto_router.urls)),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)