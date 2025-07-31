---
title: "Manual De usuario - Agrosoft"
description: "Documento técnico versión 1.0 para el sistema Agrosoft."
pubDate: 2025-06-11
author: Dilson Chimborazo
---


## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA | RESPONSABLE | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|-------|-------------|----------------|-----------------------|
| 1.0     | 2024/10/09 | Dilson Chimborazo | 2025/06/11 | Carlos Sterling |

---

## CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR

| VERSIÓN | MODIFICACIÓN RESPECTO VERSIÓN ANTERIOR        |
|---------|-----------------------------------------------|
|    1    | Creacion de archivo de manual de usuarios     |


---

## Tabla de contenido

1. [Introducción](#1-introducción)  
2. [Alcance](#2-alcance)  
3. [Definiciones, Acrónimos y Abreviaturas](#3-definiciones-acrónimos-y-abreviaturas)  
4. [Responsables e involucrados](#4-responsables-e-involucrados)  
5. [Roles y Usuarios](#5-Roles y Usuarios)
    5.1 [Usuarios](#51-Usuarios)
    5.2 [Roles](#51-Roles)
6. [Ingreso al Sistema](#6-Ingreso al Sistema)
7. [Navegación](#7-Navegación)
8. [Opciones, Modulos o funcionalidades](#8-Opciones, Modulos o funcionalidades)
9. [Mensajes](#9-Mensajes)

---

## 1. Introducción

El sistema Agrosoft es una plataforma integral diseñada para optimizar la gestión de cultivos en el Centro de Formación Agropecuario Yamboró del Servicio Nacional de Aprendizaje (SENA). Combina una aplicación web con un módulo de hardware basado en el microcontrolador ESP32 y sensores IoT para monitorear en tiempo real variables ambientales como humedad del suelo, humedad relativa, temperatura, intensidad lumínica, velocidad y dirección del viento. Agrosoft permite a los usuarios (aprendices y productores agrícolas) realizar un seguimiento detallado de los cultivos, implementar prácticas de trazabilidad y tomar decisiones basadas en datos para maximizar el rendimiento y promover la sostenibilidad.  
Este manual de usuario proporciona una guía detallada sobre cómo utilizar la plataforma, incluyendo el ingreso al sistema, navegación, funcionalidades principales y manejo de mensajes del sistema.

## 2. Alcance

Este manual describe el uso del sistema Agrosoft, una plataforma híbrida (web) diseñada para la gestión de cultivos en el área de Producción Agropecuaria Ecológica (PAE) del SENA Yamboró. Cubre las instrucciones para interactuar con los módulos de IoT, trazabilidad, finanzas, inventario y usuarios, así como la navegación, ingreso al sistema y manejo de mensajes.    
    Proyectos asociados:  
        • Desarrollo del sistema IoT basado en ESP32 para recolección de datos ambientales.  
        • Implementación de la aplicación web para visualización y gestión de datos.  
    Afectados por este documento:  
        • Aprendices y productores agrícolas del SENA Yamboró.  
        • Personal técnico encargado del mantenimiento del sistema.  
        • Administradores de la plataforma.  



## 3. Definiciones, Acrónimos y Abreviaturas

•	ESP32: Microcontrolador con conectividad Wi-Fi y Bluetooth, núcleo del sistema IoT.  
•	IoT: Internet de las Cosas, red de dispositivos interconectados para recopilar y compartir datos.  
•	Sensor de Humedad del Suelo: Dispositivo (ej. FC-28) para medir el contenido de agua en el suelo.  
•	Sensor de Humedad Relativa: Sensor (ej. DHT22) para medir el porcentaje de humedad en el aire.  
•	Sensor de Temperatura: Dispositivo (ej. DHT22) para medir la temperatura ambiental.  
•	Sensor de Luminosidad: Sensor (ej. TSL2561) para medir la intensidad lumínica en lux.  
•	Sensor de Viento: Combinación de anemómetro y veleta para medir velocidad y dirección del viento.  
•	Trazabilidad: Capacidad de rastrear el historial, ubicación y estado de un cultivo durante su ciclo de vida.  
•	Riego Automatizado: Sistema que activa o desactiva el riego según datos de sensores y umbrales definidos.  
•	API RESTfull: Interfaz para la comunicación entre el frontend y el backend.  
•	PAE: Producción Agropecuaria Ecológica, área de enfoque del proyecto en SENA Yamboró.  
•	SENA: Servicio Nacional de Aprendizaje.  
•	TLS: Es un protocolo de cifrado que protege los datos mientras viajan por la red (por ejemplo, al usar HTTPS).
  


## 4 Responsables e involucrados

| Nombre              | Tipo         | Rol            |
|---------------------|--------------|----------------|
| Dilson Chimborazo   | Aprendiz     | Líder y desarrollador |
| Lucy Ordoñez        | Aprendiz     | Desarrollador  |
| Francisco Burbano   | Aprendiz     | Desarrollador  |
| Juan David Bolaños  | Aprendiz     | Desarrollador  |
| Wilson Samboni      | Aprendiz     | Desarrollador  |
| Xiomara Sabi        | Aprendiz     | Desarrollador  |
| Yanira Jiménez      | Aprendiz     | Desarrollador  |


---

## 5. Roles y Usuarios

### 5.1 Usuarios

Los usuarios generales del sistema Agrosoft incluyen:  
    •	Aprendices del SENA: Estudiantes que utilizan la plataforma para monitorear cultivos y aprender sobre tecnologías IoT.  
    •	Productores agrícolas: Personal del área de PAE que gestiona cultivos y toma decisiones basadas en datos.  
    •	Administradores: Personal técnico que configura y mantiene la plataforma.  
    •	Directivos del SENA: Encargados de supervisar el uso de los recursos, generar reportes financieros y tomar decisiones estratégicas basadas en la información registrada en el sistema

---

### 5.2 Roles

•	Administrador (Directivos/instructores/técnicos):
        Privilegios: Acceso completo a todos los módulos (IoT, trazabilidad, finanzas, inventario, usuarios). Puede configurar alertas, gestionar usuarios y modificar  
•	Pasante:
        Privilegios: Acceso completo a los módulos (IoT, trazabilidad). No Puede configurar alertas. No puede gestionar usuarios, finanzas e inventario  

•	Aprendiz:
        Privilegios: Acceso a los módulos de IoT, trazabilidad e inventario para visualización de datos, registro de cultivos y recepción de alertas. No puede modificar configuraciones del sistema ni gestionar usuarios. parámetros del sistema.  
•	Operario:
    	Privilegios: Acceso completo a los módulos (IoT, trazabilidad). No Puede configurar alertas. No puede gestionar usuarios, finanzas e inventario



---

## 6. Ingreso al sistema

El sistema Agrosoft requiere un inicio de sesión para acceder a la plataforma:  
    •	Acceda a la URL de la aplicación web (proporcionada por el administrador del sistema).  
    •	Si es el primer usuario en el sistema:              
            Seleccione la opción de registrarse:        
                - Datos requeridos: ingresar los datos requeridos por el sistema.  
                - Haga clic en el botón Registrarse (Lo redirige al Login automáticamente).

![register](/manualusuario/register.png)  

•	Ingrese las credenciales (El administrador registra los usuarios previamente):  
-identificación: Identificación registrada en el sistema.  
-Contraseña: Clave personal asignada o configurada por el usuario  
![register](/manualusuario/login.png) 


•   En caso de olvidar la contraseña, seleccione la opción Recuperar Contraseña e ingrese el correo registrado para recibir un enlace de restablecimiento  
![register](/manualusuario/recuperar.png)   

•	La autenticación utiliza un sistema seguro con cifrado TLS para proteger los datos del usuario.

---

## 7. Navegacion  
La navegación en Agrosoft se realiza a través de una interfaz web con un diseño intuitivo:  
•	Menú Principal: Ubicado en la barra lateral izquierda, incluye accesos directos a los módulos: home, usuarios, calendario, mapa, cultivo, finanzas, plagas, inventario, IoT, reportes   
![register](/manualusuario/sidebar.png)   

•	Barra de Herramientas Superior Contiene:  
Título de “Bienvenido a Agrosoft 🌱”   
Notificaciones (ícono de campana) para alertas.  
Icono de perfil para gestionar la cuenta del usuario.  
Botón de cierre de sesión.  
![register](/manualusuario/nabvar.png)  

•	Navegación Agrupada: Las funcionalidades están organizadas por módulos, accesibles desde el menú principal. Cada módulo tiene subsecciones para acciones específicas (ej.) en:  
Calendario: “actividad” y “calendario lunar”.   
Cultivo: “Eras”, “Lotes”, “Cultivos”, “Especies”,” Residuos”,” Plantación”,” Semilleros”.   
Finanzas: “Stock” y “Beneficio costo”,” Pagos”.   
Plagas: “Control fitosanitario”.   
Inventario: “Bodega”.   
IoT: “Sensores”.   
![register](/manualusuario/agrupados.png)  

---

## 8. Opciones, Módulos o Funcionalidades  
### 8.1	Home:   
Acceso: Desde el menú principal, seleccione Home.
Descripción: Permite monitorear en tiempo real las variables ambientales (humedad del suelo, humedad relativa, temperatura, luminosidad, velocidad y dirección del viento) recopiladas por sensores conectados al ESP32 y tiene un apartado para ver la evapotranspiración dependiendo la plantación.  
Procesos:  
Visualizar datos en tiempo real mediante gráficos interactivos.  
Muestra tablas de datos históricos de cada una de las tablas.  
Visualizar datos en tiempo real mediante gráficos la evapotranspiración.  
Permite ver datos históricos de sensores como de evapotranspiración
Permite crear sensores.  

![register](/manualusuario/home1.png) 
![register](/manualusuario/home2.png) 
![register](/manualusuario/home3.png) 

---

## 8.2	Usuarios: 
Acceso: Desde el menú principal, seleccione usuarios.  
Descripción: Permite al administrador ver todos los usuarios registrados en el sistema y a los usuarios les permite ver los datos del mismo.  
Procesos:  
Visualizar usuarios registrados en el sistema.  
Actualizar los usuarios y registrar usuarios nuevos para el sistema (solo el administrador tiene los permisos).  
Permite realizar cargas masivas de usuarios en un formato Excel (previamente debe estar registrados un rol (Aprendiz) y el número de ficha del cual realiza la carga masiva).  


![register](/manualusuario/user1.png) 
![register](/manualusuario/user2.png) 
![register](/manualusuario/user3.png) 
![register](/manualusuario/user4.png) 

---

## 8.3	Calendario:  
### Actividad:  
Acceso: Desde el menú principal, seleccione calendario luego actividad.  
Descripción: Permite al administrador asignar actividades que se le deben realizar a los cultivos.  
Procesos:  
Crear asignación llenar formulario con los datos necesarios.  
Finaliza las actividades asignadas previamente.   

![register](/manualusuario/actividad1.png) 
![register](/manualusuario/actividad2.png) 

---

### Calendario lunar:   
Acceso: Desde el menú principal, seleccione calendario luego calendario lunar.  
Descripción: Permite a los usuarios del sistema verificar las fases de la luna en el mes actual.  
Procesos:  
Se pueden crear eventos los cuales se pueden realizar en estas fecha y lunas específicas.  

![register](/manualusuario/calendario.png) 
![register](/manualusuario/calendario2.png) 

---

## 8.4	Mapa:   
Acceso: Desde el menú principal, seleccione Mapa.  
Descripción: Permite a los usuarios del sistema mirar las plantaciones registradas en un mapa con las ubicaciones del tecnoparqué Yamboró.  
Procesos:  
Visualizar en un mapa las plantaciones registradas con sus respectivos detalles.  

![register](/manualusuario/mapa.png)


## 8.5	Cultivo:
### Eras: 
Acceso: Desde el menú principal, seleccione cultivo luego eras.
Descripción: Permite a los usuarios registrar eras (previamente se debe registrar un lote).
Procesos:
Crear Eras llenar formulario con los datos necesarios.
Actualizar los detalles de las eras registradas en el sistema.

![register](/manualusuario/era1.png)
![register](/manualusuario/era2.png)
![register](/manualusuario/era3.png)


### Lotes: 
Acceso: Desde el menú principal, seleccione cultivo luego lotes.
Descripción: Permite a los usuarios registrar lotes.
Procesos:
Crear lotes llenar formulario con los datos necesarios.
Actualizar los detalles de los lotes registrados en el sistema.

![register](/manualusuario/lote1.png)
![register](/manualusuario/lote2.png)
![register](/manualusuario/lote3.png)


### Cultivos: 
Acceso: Desde el menú principal, seleccione cultivo luego cultivos.
Descripción: Permite a los usuarios registrar cultivos (previamente se debe registrar una especie).
Procesos:
Crear cultivos llenar formulario con los datos necesarios.
Actualizar los detalles de los cultivos registrados en el sistema.

![register](/manualusuario/cultivo1.png)
![register](/manualusuario/cultivo2.png)
![register](/manualusuario/cultivo3.png)


### Especies: 
Acceso: Desde el menú principal, seleccione cultivo luego especies.
Descripción: Permite a los usuarios registrar especies (previamente se debe registrar un tipo de cultivo).
Procesos:
Crear especies, llenar formulario con los datos necesarios.
Actualizar los detalles de las especies registradas en el sistema.

![register](/manualusuario/especie1.png)
![register](/manualusuario/especie2.png)
![register](/manualusuario/especie3.png)


### Residuos: 
Acceso: Desde el menú principal, seleccione cultivo luego residuos.
Descripción: Permite a los usuarios registrar residuos (previamente se debe registrar una un cultivo y un tipo de residuo).
Procesos:
Crear residuos, llenar formulario con los datos necesarios.
Actualizar los detalles de los residuos registrados en el sistema.

![register](/manualusuario/residuo1.png)
![register](/manualusuario/residuo2.png)
![register](/manualusuario/residuo3.png)

### Plantación: 
Acceso: Desde el menú principal, seleccione cultivo luego plantación.
Descripción: Permite a los usuarios registrar plantaciones (previamente se debe registrar cultivos, eras y semilleros).
Procesos:
Crear plantaciones, llenar formulario con los datos necesarios.
Actualizar los detalles de las plantaciones registradas en el sistema.

![register](/manualusuario/plantacion1.png)
![register](/manualusuario/plantacion2.png)
![register](/manualusuario/plantacion3.png)

### Semillero: 
Acceso: Desde el menú principal, seleccione cultivo luego semillero.
Descripción: Permite a los usuarios registrar semilleros.
Procesos:
Crear semilleros, llenar formulario con los datos necesarios.
Actualizar los detalles de los semilleros registrados en el sistema.

![register](/manualusuario/semillero1.png)
![register](/manualusuario/semillero2.png)
![register](/manualusuario/semillero3.png)


### 8.6	Finanzas:
### Stock: 
Acceso: Desde el menú principal, seleccione finanzas luego stock.
Descripción: Permite a los usuarios registrar las ventas y registrar las producciones de un cultivo (previamente de una venta se debe registrar una producción).
Procesos:
Crear ventas, llenar formulario con los datos necesarios (previamente debe registrarse una producción).
Crear producción, llenar formulario con los datos necesarios.

![register](/manualusuario/stock1.png)
![register](/manualusuario/stock2.png)
![register](/manualusuario/stock3.png)

### Beneficio costo: 
Acceso: Desde el menú principal, seleccione finanzas luego beneficio costo.
Descripción: Permite a los usuarios visualizar el beneficio costo de una plantación especifica.
Procesos:
	Seleccionar la plantación.
Visualizar todo el historial de beneficio costo de cada uno de las plantaciones registradas en el sistema.

![register](/manualusuario/beneficioCosto.png)

### Pagos: 
Acceso: Desde el menú principal, seleccione finanzas luego pagos.
Descripción: Permite a los usuarios registrar los pagos que van a tener cada uno de los roles dentro del sistema.
Procesos:
	Permite crear salario dependiendo el rol.
Crear pagos, llenar formulario con los datos necesarios.
Actualizar los detalles de los pagos registrados en el sistema.

![register](/manualusuario/pago1.png)
![register](/manualusuario/pago2.png)


### 8.7	Plagas:
### Control fitosanitario: 
Acceso: Desde el menú principal, seleccione plagas luego control fitosanitario.
Descripción: Permite a los usuarios registrar los controles fitosanitarios que se le deben llevar a cada cultivo luego de registrar una plaga (Previamente se debe registrar una plaga).
Procesos:
Crear control fitosanitario, llenar formulario con los datos necesarios.
Actualizar los detalles del control fitosanitario registrados en el sistema.

![register](/manualusuario/control1.png)
![register](/manualusuario/control2.png)
![register](/manualusuario/control3.png)


### 8.8	Inventario:
### Bodega: 
Acceso: Desde el menú principal, seleccione inventario luego bodega.
Descripción: Permite a los usuarios llevar el control sobre las herramientas e insumos que están disponibles para debido uso.
Procesos:
Crear herramientas, llenar formulario con los datos necesarios.
Crear insumos, llenar formulario con los datos necesarios.
Genera entradas y salidas para cada uno de los procesos que hagan tanto herramientas como insumos.
Actualizar los detalles de los insumos registrados en el sistema.
Actualizar los detalles de las herramientas registradas en el sistema.

![register](/manualusuario/bodega1.png)
![register](/manualusuario/bodega2.png)
![register](/manualusuario/bodega3.png)
![register](/manualusuario/bodega4.png)
![register](/manualusuario/bodega5.png)


### 8.9	IoT:
### Sensores: 
Acceso: Desde el menú principal, seleccione IoT luego sensores.
Descripción: Permite a los usuarios registrar sensores que se pueden utilizar en la medición de las diferentes variables en las plantaciones
Procesos:
Crear sensores, llenar formulario con los datos necesarios.
Actualizar los detalles de los sensores registrados en el sistema.

![register](/manualusuario/sensor1.png)
![register](/manualusuario/sensor2.png)
![register](/manualusuario/sensor3.png)


### 8.10 Reportes:
Acceso: Desde el menú principal, seleccione reportes.
Descripción: Permite a los usuarios visualizar y descargar los diferentes reportes generados por cada uno de los módulos existentes en el sistema.
Procesos:
Permite al usuario seleccionar el módulo y el reporte para visualizarlo
Permite al usuario seleccionar el módulo y el reporte para descargarlo

![register](/manualusuario/reporte.png)

### 9.	Mensajes
El sistema Agrosoft utiliza mensajes para informar al usuario sobre el estado de las operaciones, errores o alertas. Los mensajes se presentan mediante ventanas emergentes y notificaciones en pantalla con colores específicos.

### 9.1	Error
Descripción: Indican problemas que impiden completar una acción (ej. conexión fallida con sensores).
Formato: Ventana emergente con fondo rojo y texto blanco. Ejemplo: “Error al enviar el formulario.”
Ubicación: Esquina derecha de la pantalla, se cierra automáticamente tras 4 segundos o al hacer clic.

![register](/manualusuario/error.png)


#### 9.3 Confirmación
Descripción: Confirman la finalización exitosa de una acción (ej. registro de un cultivo exitoso).
Formato: Ventana emergente con fondo verde y texto blanco. Ejemplo: “Cultivo registrado exitosamente.”
Ubicación: Esquina derecha de la pantalla, se cierra automáticamente tras 4 segundos o al hacer clic.

![register](/manualusuario/confirmacion.png)


### 9.4	Información
Descripción: Proporcionan detalles adicionales o guías (ej. ayuda contextual).
Formato: ventana emergente con fondo azul claro y texto blanco. Ejemplo: “No hay asignaciones disponibles”.
Ubicación: Esquina derecha de la pantalla, se cierra automáticamente tras 4 segundos o al hacer clic.

![register](/manualusuario/informacion.png)