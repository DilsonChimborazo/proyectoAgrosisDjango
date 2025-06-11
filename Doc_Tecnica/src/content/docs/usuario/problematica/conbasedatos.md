---
title: "Configuracion base de datos - Agrosoft"
description: "Documento técnico versión 1.0 para el sistema Agrosoft."
pubDate: 2024-10-09
author: Lucy fernanda ordoñez
---

## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA      | RESPONSABLE          | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|------------|----------------------|----------------|-----------------------|
| 1.0     | 2024/10/09 | Lucy fernanda ordoñez| 2024/10/09     | Carlos Sterling |
| 2.0     | 2025/06/10 | Lucy fernanda ordoñez| 2024/10/09     | Carlos Sterling |

---

## CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR

| VERSIÓN | MODIFICACIÓN RESPECTO VERSIÓN ANTERIOR |
|---------|-----------------------------------------|
|    1    | Modificacion en todo el archivo por escritura |
|    2    | Modificacion en todo el archivo por cambios a la bd y conceptos|

---

## Tabla de contenido

1. [Introducción](#1-introducción)  
2. [Alcance](#2-alcance)  
3. [Responsables e involucrados](#3-responsables-e-involucrados)  
4. [Modelo Entidad Relación (MER)](#4-modelo-entidad-relación-mer)  
5. [Diccionario de Datos](#5-diccionario-de-datos)  
6. [Modelo Relacional](#6-modelo-relacional)  
7. [Justificación Motor Seleccionado](#7-justificación-motor-seleccionado)  
8. [Requisitos de Configuración](#8-requisitos-de-configuración)  
9. [Scripts](#9-scripts)  
10. [Configuración y Ejecución de la Base de Datos](#10-configuración-y-ejecución-de-la-base-de-datos)  
11. [Otras Consideraciones](#11-otras-consideraciones)  

---

## 1. Introducción

El sistema **AgroSoft** tiene como objetivo implementar un sistema de seguimiento y trazabilidad para actividades agrícolas (control fitosanitario, riego, fertilización, insumos y monitoreo) en la *C.G.D.S.S.*. Este documento describe la configuración de la base de datos que soporta los módulos de *IoT*, **Trazabilidad**, **Inventario** y **Finanzas**.

El propósito es proporcionar una guía clara para el receptor del proyecto, ya sea un desarrollador, administrador de sistemas o responsable de mantenimiento, asegurando que pueda entender, implementar y mantener la base de datos. La base de datos está implementada en **MySQL 8.0+**, seleccionada por su compatibilidad con **Laravel 12** y el entorno de desarrollo **Laragon**.

---

## 2. Alcance

### Base de datos

La base de datos **agrosoft** almacenará toda la información generada por el sistema de seguimiento y trazabilidad agrícola del **C.G.D.S.S.**, incluyendo datos de sensores IoT, historial de actividades, inventario de insumos y registros financieros.

### Módulos cubiertos

- **IoT**: Datos de sensores (humedad, temperatura, pH, luminosidad, lluvia, viento)  
- **Trazabilidad**: Registro de actividades (siembra, riego, fertilización, cosecha)  
- **Inventario**: Gestión de herramientas, insumos y recursos agrícolas  
- **Finanzas**: Costos, ingresos, egresos y reportes económicos  

### Impacto del documento

- **Equipo de desarrollo**: Implementación inicial y actualizaciones de la estructura de datos  
- **Instructores PAE**: Validación de que los datos capturados cumplen con necesidades agrícolas  
- **Usuarios finales**: Garantiza que la información mostrada en interfaces sea consistente  
- **Mantenimiento**: Base para futuras expansiones del sistema  

---

## 3. Responsables e Involucrados

| Nombre                                   | Tipo (Responsable/Involucrado) | Rol                        |
|------------------------------------------|-------------------------------|-----------------------------|
| Dilson Chimborazo Perez                  | Responsable                   | Líder proyecto              |
| Juan David Bolaños                       | Responsable                   | Líder Módulo IoT           |
| Yanira Jimenez                           | Responsable                   | Líder Módulo Inventario    |
| Lucy Fernanda Ordoñez Hernandez          | Responsable                   | Líder Módulo Finanzas      |
| Francisco Javier Burbano Suarez          | Responsable                   | Líder Módulo Trazabilidad  |
| Wilson Eduardo Samboni                   | Responsable                   | Líder Módulo Usuarios      |
| Xiomara Sabi Rojas                       | Responsable                   | Líder Módulo Trazabilidad  |

## 5. Modelo entidad relacion

![Diagrama de entidad relacion](/imgbasedatos/entidadrelacion.png) 

## Modelo Entidad-Relación: Resumen

### Entidades Principales

- **Usuarios**: Incluye roles como aprendiz, pasante e instructor, además de credenciales de acceso.
- **Actividades**: Representa tareas agrícolas como siembra, riego, fertilización, etc., asignadas a responsables.
- **Cultivos**: Registro de especies cultivadas, ubicación (lotes o eras) y su producción asociada.
- **Sensores**: Dispositivos IoT que capturan datos ambientales como humedad, temperatura, entre otros.
- **Insumos/Herramientas**: Recursos físicos utilizados en la ejecución de las actividades agrícolas.

---

### Relaciones Clave

- **Usuarios → Actividades**: Asignación de tareas específicas a usuarios según su rol.
- **Cultivos → Producción**: Registro del rendimiento y ventas asociadas a cada cultivo.
- **Sensores → Eras**: Relación de sensores con ubicaciones específicas donde se realiza el monitoreo.
- **Actividades ↔ Insumos/Herramientas**: Uso y requerimiento de recursos durante las tareas agrícolas.

---

### Notas Técnicas

- El modelo se encuentra normalizado en **Tercera Forma Normal (3FN)** para evitar redundancias.
- Uso de **claves foráneas** para garantizar la integridad referencial entre tablas.
- Inclusión de **atributos clave** como:
  - Fechas para trazabilidad de procesos.
  - Rangos de valores para registros de sensores (por ejemplo: humedad mínima/máxima).

  ## 6. Diccionario de Datos

---

### Tabla: `rol`

| Campo           | Tipo   | Longitud | PK  | AI  | Nulo | Descripción                          | Ejemplo        |
|----------------|--------|----------|-----|-----|------|--------------------------------------|----------------|
| id_rol         | INT    | -        | Sí  | Sí  | No   | ID único del rol                     | 1              |
| nombre_rol     | ENUM   | -        | No  | No  | No   | Tipo de rol ('aprendiz','pasante','instructor') | 'instructor' |
| fecha_creacion | DATE   | -        | No  | No  | No   | Fecha de creación del registro       | '2024-01-15'   |

---

### Tabla: `usuarios`

| Campo           | Tipo     | Longitud | PK  | AI  | Nulo | Descripción                        | Ejemplo           |
|----------------|----------|----------|-----|-----|------|------------------------------------|-------------------|
| identificacion | BIGINT   | 15       | Sí  | No  | No   | Número de identificación           | 1004418401        |
| nombre         | VARCHAR  | 100      | No  | No  | No   | Nombre completo                    | 'Lucy Ordoñez'    |
| contrasena     | VARCHAR  | 255      | No  | No  | No   | Contraseña (encriptada)            | '********'        |
| email          | VARCHAR  | 50       | No  | No  | No   | Correo electrónico                 | lucy@gmail.com    |
| fk_id_rol      | INT      | 10       | No  | No  | No   | (FK) Rol de usuario                | 1                 |

---

### Tabla: `herramientas`

| Campo           | Tipo     | Longitud | PK  | AI  | Nulo | Descripción            | Ejemplo       |
|----------------|----------|----------|-----|-----|------|------------------------|---------------|
| id_herramientas| INT      | -        | Sí  | Sí  | No   | ID único               | 1             |
| nombre_h       | VARCHAR  | 50       | No  | No  | No   | Nombre de la herramienta | 'Pala'       |
| fecha_prestamo | DATE     | -        | No  | No  | No   | Fecha de préstamo      | '2024-03-04'  |
| estado         | VARCHAR  | 100      | No  | No  | Sí   | Estado del préstamo    | 'Disponible'  |

---

### Tabla: `insumos`

| Campo           | Tipo     | Longitud | PK  | AI  | Nulo | Descripción         | Ejemplo              |
|----------------|----------|----------|-----|-----|------|---------------------|----------------------|
| id_insumo      | INT      | -        | Sí  | Sí  | No   | ID único            | 1                    |
| nombre         | VARCHAR  | 50       | No  | No  | No   | Nombre del insumo   | 'Fertilizante OPK'   |
| tipo           | VARCHAR  | 50       | No  | No  | No   | Tipo de insumo      | 'Químico'            |
| precio_unidad  | INT      | 50       | No  | No  | No   | Precio por unidad   | 12000                |
| cantidad       | INT      | 50       | No  | No  | No   | Cantidad disponible | 100                  |
| unidad_medidad | VARCHAR  | 50       | No  | No  | No   | Unidad de medida    | 'kg'                 |

---

### Tabla: `actividad`

| Campo            | Tipo     | Longitud | PK  | AI  | Nulo | Descripción            | Ejemplo           |
|------------------|----------|----------|-----|-----|------|------------------------|-------------------|
| id_actividad     | INT      | -        | Sí  | Sí  | No   | ID único               | 1                 |
| nombre_actividad | VARCHAR  | 50       | No  | No  | No   | Nombre de la actividad | 'Riego'           |
| descripcion      | VARCHAR  | 255      | No  | No  | No   | Detalles de la actividad | 'Riego por goteo' |

---

### Tabla: `calendario_lunar`

| Campo              | Tipo   | Longitud | PK  | AI  | Nulo | Descripción            | Ejemplo                         |
|--------------------|--------|----------|-----|-----|------|------------------------|---------------------------------|
| id_calendario_lunar| INT    | -        | Sí  | Sí  | No   | ID único               | 1                               |
| fecha              | DATE   | -        | No  | No  | No   | Fecha del evento       | '2024-02-02'                    |
| descripcion_evento | TEXT   | -        | No  | No  | No   | Detalles del evento    | 'Luna llena - Ideal para siembra' |
| evento             | VARCHAR| 100      | No  | No  | Sí   | Tipo de evento         | 'Siembra'                       |

---

### Tabla: `asignación_actividad`

| Campo                 | Tipo | Longitud | PK  | AI  | Nulo | Descripción                  | Ejemplo      |
|-----------------------|------|----------|-----|-----|------|------------------------------|--------------|
| id_asignacion_actividad | INT  | -      | Sí  | Sí  | No   | ID único                     | 1            |
| fecha                 | DATE | -        | No  | No  | No   | Fecha de asignación          | '2024-02-02' |
| fk_id_actividad       | INT  | 10       | No  | No  | No   | Actividad asignada (FK)      | 5            |
| fk_identificacion     | INT  | 10       | No  | No  | Sí   | Usuario asignado (FK)        | 1004418401   |

---

### Tabla: `programacion`

| Campo                    | Tipo   | Longitud | PK  | AI  | Nulo | Descripción                      | Ejemplo        |
|--------------------------|--------|----------|-----|-----|------|----------------------------------|----------------|
| id_programacion          | INT    | -        | Sí  | Sí  | No   | ID único                         | 1              |
| estado                   | VARCHAR| 100      | No  | No  | No   | Estado de la programación        | 'Pendiente'    |
| fecha_programada         | DATE   | -        | No  | No  | No   | Fecha planificada                | '2024-06-10'   |
| duracion                 | INT    | 50       | No  | No  | No   | Duración en días                 | 10             |
| fk_id_asignacion_actividad | INT | 10       | No  | No  | No   | Asignación relacionada (FK)      | 1              |
| fk_id_calendario_lunar   | INT    | 10       | No  | No  | No   | Evento lunar relacionado (FK)    | 1              |

---

### Tabla: `notificacion`

| Campo              | Tipo    | Longitud | PK  | AI  | Nulo | Descripción               | Ejemplo                         |
|--------------------|---------|----------|-----|-----|------|---------------------------|---------------------------------|
| id_notificacion    | INT     | -        | Sí  | Sí  | No   | ID único                  | 1                               |
| titulo             | VARCHAR | 50       | No  | No  | No   | Título de la notificación | "Recordatorio"                  |
| mensaje            | VARCHAR | 100      | No  | No  | No   | Contenido breve           | "Riego programado para hoy"     |
| fk_id_programacion | INT     | 10       | No  | No  | No   | Programación relacionada (FK) | 1                           |

---

### Tabla: `requiere`

| Campo                      | Tipo | Longitud | PK  | AI  | Nulo | Descripción                  | Ejemplo |
|----------------------------|------|----------|-----|-----|------|------------------------------|---------|
| id_requiere                | INT  | -        | Sí  | Sí  | No   | ID único                     | 1       |
| fk_id_herramienta          | INT  | 10       | No  | No  | No   | Herramienta requerida (FK)   | 1       |
| fk_id_asignacion_actividad | INT  | 10       | No  | No  | No   | Asignación relacionada (FK)  | 5       |


---

### Tabla: `utiliza`

| Campo                   | Tipo | Longitud | PK  | AI  | Nulo | Descripción                   | Ejemplo |
|-------------------------|------|----------|-----|-----|------|-------------------------------|---------|
| id_utiliza              | INT  | -        | Sí  | Sí  | No   | ID único                      | 1       |
| fk_id_insumo            | INT  | 10       | No  | No  | No   | Insumo utilizado (FK)         | 1       |
| fk_id_asignacion_actividad | INT | 10    | No  | No  | No   | Asignación relacionada (FK)   | 5       |

---

### Tabla: `PEA`

| Campo       | Tipo    | Longitud | PK  | AI  | Nulo | Descripción                                      | Ejemplo               |
|-------------|---------|----------|-----|-----|------|--------------------------------------------------|-----------------------|
| id_pea      | INT     | -        | Sí  | Sí  | No   | ID único                                         | 1                     |
| nombre      | VARCHAR | 50       | No  | No  | No   | Nombre del Plaga, Enfermedad, Arvense           | 'Hormigas'            |
| descripcion | TEXT    | -        | No  | No  | No   | Descripción detallada                            | 'Invasión de hormiga roja' |

---

### Tabla: `ubicación`

| Campo      | Tipo    | Longitud | PK  | AI  | Nulo | Descripción             | Ejemplo    |
|------------|---------|----------|-----|-----|------|-------------------------|------------|
| id_ubicacion | INT   | -        | Sí  | Sí  | No   | ID único                | 1          |
| latitud    | DECIMAL | (9,6)    | No  | No  | No   | Coordenada geográfica   | 4.567890   |
| descripcion| DECIMAL | (9,6)    | No  | No  | No   | Coordenada geográfica   | -73.543210 |

---

### Tabla: `lote`

| Campo           | Tipo    | Longitud | PK  | AI  | Nulo | Descripción           | Ejemplo     |
|------------------|---------|----------|-----|-----|------|-----------------------|-------------|
| id_lote          | INT     | -        | Sí  | Sí  | No   | ID único              | 1           |
| dimension        | INT     | 100      | No  | No  | No   | Tamaño en m²          | 122         |
| nombre_lote      | VARCHAR | 50       | No  | No  | No   | Nombre identificador  | 'Lote sur'  |
| fk_id_ubicacion  | INT     | 10       | No  | No  | No   | Ubicación geográfica (FK) | 1       |
| estado           | VARCHAR | 50       | No  | No  | No   | Estado actual         | 'Activo'    |

---

### Tabla: `eras`

| Campo         | Tipo    | Longitud | PK  | AI  | Nulo | Descripción             | Ejemplo             |
|---------------|---------|----------|-----|-----|------|-------------------------|---------------------|
| id_eras       | INT     | -        | Sí  | Sí  | No   | ID único                | 1                   |
| descripcion   | VARCHAR | 100      | No  | No  | No   | Detalles de la era      | 'Era maíz 2024'     |
| fk_id_lote    | INT     | 10       | No  | No  | No   | Lote al que pertenece (FK) | 1                |

---

### Tabla: `tipo_cultivo`

| Campo            | Tipo    | Longitud | PK  | AI  | Nulo | Descripción                           | Ejemplo                |
|------------------|---------|----------|-----|-----|------|---------------------------------------|------------------------|
| id_tipo_cultivo  | INT     | -        | Sí  | Sí  | No   | ID único                              | 1                      |
| nombre           | VARCHAR | 50       | No  | No  | No   | Nombre del tipo (Cereal, Hortaliza)   | 'Hortaliza'            |
| descripcion      | TEXT    | -        | No  | No  | No   | Características principales           | 'Cultivos de ciclo corto' |

---

### Tabla: `especie`

| Campo             | Tipo    | Longitud | PK  | AI  | Nulo | Descripción                        | Ejemplo                   |
|-------------------|---------|----------|-----|-----|------|------------------------------------|---------------------------|
| id_especie        | INT     | -        | Sí  | Sí  | No   | ID único                           | 1                         |
| nombre_comun      | VARCHAR | 50       | No  | No  | No   | Nombre común                       | 'Tomate'                  |
| nombre_cientifico | VARCHAR | 50       | No  | No  | No   | Nombre científico                  | 'Solanum lycopersicum'   |
| descripcion       | TEXT    | -        | No  | No  | No   | Detalles morfológicos              | 'Variedad cherry'         |
| fk_id_tipo_cultivo| INT     | 10       | No  | No  | No   | Tipo de cultivo asociado (FK)      | 1                         |

---

### Tabla: `semilleros`

| Campo          | Tipo    | Longitud | PK  | AI  | Nulo | Descripción                   | Ejemplo           |
|----------------|---------|----------|-----|-----|------|-------------------------------|-------------------|
| id_semillero   | INT     | -        | Sí  | Sí  | No   | ID único                      | 1                 |
| nombre_semilla | VARCHAR | 50       | No  | No  | No   | Nombre/identificador          | 'TOM-1'           |
| fecha_siembra  | DATE    | -        | No  | No  | No   | Fecha de siembra inicial      | '2024-03-10'      |
| fecha_estimada | DATE    | -        | No  | No  | No   | Fecha estimada de trasplante  | '2024-04-25'      |
| cantidad       | INT     | 10       | No  | No  | No   | Cantidad                      | 1                 |

---

### Tabla: `cultivo`

| Campo             | Tipo    | Longitud | PK  | AI  | Nulo | Descripción                            | Ejemplo                     |
|-------------------|---------|----------|-----|-----|------|----------------------------------------|-----------------------------|
| id_cultivo        | INT     | -        | Sí  | Sí  | No   | ID único                               | 1                           |
| fecha_plantacion  | DATE    | -        | No  | No  | No   | Fecha de siembra                       | '2024-03-10'                |
| nombre_cultivo    | VARCHAR | 50       | No  | No  | No   | Nombre del cultivo                     | 'Tomate'                    |
| descripcion       | TEXT    | -        | No  | No  | Sí   | Observaciones                          | 'Cinco semillas se dañaron' |
| fk_id_especie     | INT     | 10       | No  | No  | No   | Especie asociada (FK)                  | 1                           |
| fk_id_semillero   | INT     | 10       | No  | No  | No   | Semillero asociado (FK)                | 1                           |

---

### Tabla: `realiza`

| Campo          | Tipo | Longitud | PK  | AI  | Nulo | Descripción             | Ejemplo |
|----------------|------|----------|-----|-----|------|-------------------------|---------|
| id_realiza     | INT  | -        | Sí  | Sí  | No   | ID único                | 1       |
| fk_id_cultivo  | INT  | 10       | No  | No  | No   | Cultivo asociado (FK)   | 1       |
| fk_id_actividad| INT  | 10       | No  | No  | No   | Actividad ejecutada (FK)| 1       |

---

### Tabla: `plantacion`

| Campo          | Tipo | Longitud | PK  | AI  | Nulo | Descripción             | Ejemplo |
|----------------|------|----------|-----|-----|------|-------------------------|---------|
| id_plantacion  | INT  | -        | Sí  | Sí  | No   | ID único                | 1       |
| fk_id_cultivo  | INT  | 10       | No  | No  | No   | Cultivo asociado (FK)   | 1       |
| fk_id_era      | INT  | 10       | No  | No  | No   | Ubicación asociada (FK) | 1       |


---

### Tabla: `desarrollan`

| Campo                | Tipo | Longitud | PK  | AI  | Nulo | Descripción                    | Ejemplo |
|----------------------|------|----------|-----|-----|------|--------------------------------|---------|
| id_desarrollan       | INT  | -        | Sí  | Sí  | No   | ID único                       | 1       |
| fk_id_cultivo        | INT  | 10       | No  | No  | No   | Cultivo asociado (FK)          | 1       |
| fk_id_pea            | INT  | 10       | No  | No  | No   | PEA asociado (FK)              | 1       |

---

### Tabla: `produccion`

| Campo                  | Tipo   | Longitud | PK  | AI  | Nulo | Descripción                              | Ejemplo                      |
|------------------------|--------|----------|-----|-----|------|------------------------------------------|------------------------------|
| id_produccion          | INT    | -        | Sí  | No  | No   | ID único                                 | 1                            |
| fk_id_cultivo          | INT    | 10       | No  | No  | No   | Cultivo asociado (FK)                    | 1                            |
| cantidad_producida     | INT    | 10       | No  | No  | No   | Volumen (unidades/kg)                    | 150                          |
| fecha_produccion       | DATE   | -        | No  | No  | No   | Fecha en que empezó la producción        | "2024-03-10"                 |
| fk_id_lot              | INT    | 10       | No  | No  | No   | Lote asociado (FK)                       | 1                            |
| descripcion_produccion | TEXT   | -        | No  | No  | No   | Descripción de puntos importantes        | “hubieron pocos frutos dañados” |
| estado                 | ENUM   | -        | No  | No  | No   | ('En proceso', 'Finalizado', 'Cancelado')| “En proceso”                |
| fecha_cosecha          | DATE   | -        | No  | No  | No   | Fecha de la cosecha                      | "2024-03-10"                 |

---

### Tabla: `venta`

| Campo           | Tipo   | Longitud | PK  | AI  | Nulo | Descripción                      | Ejemplo        |
|------------------|--------|----------|-----|-----|------|----------------------------------|----------------|
| id_venta         | INT    | -        | Sí  | No  | No   | ID único                         | 1              |
| fk_id_produccion | INT    | 10       | No  | No  | No   | Producción asociada (FK)         | 1              |
| cantidad         | INT    | 10       | No  | No  | No   | Cantidad de productos vendidos   | 150            |
| precio_unitario  | INT    | 10       | No  | No  | No   | Precio por unidad del producto   | 1400           |
| total_venta      | INT    | 10       | No  | No  | No   | Total de la venta                | 210000         |
| fecha_venta      | DATE   | -        | No  | No  | No   | Fecha de la venta                | "2024-08-20"   |

---

### Tabla: `genera`

| Campo             | Tipo | Longitud | PK  | AI  | Nulo | Descripción                   | Ejemplo |
|-------------------|------|----------|-----|-----|------|-------------------------------|---------|
| id_genera         | INT  | -        | Sí  | No  | No   | ID único                      | 1       |
| fk_id_cultivo     | INT  | 10       | No  | No  | No   | Cultivo asociado (FK)         | 1       |
| fk_id_produccion  | INT  | 10       | No  | No  | No   | Producción asociada (FK)      | 1       |

---

### Tabla: `sensores`

| Campo           | Tipo    | Longitud | PK  | AI  | Nulo | Descripción                     | Ejemplo                    |
|------------------|---------|----------|-----|-----|------|---------------------------------|----------------------------|
| id_sensor        | INT     | -        | Sí  | No  | No   | ID único                        | 1                          |
| nombre_sensor    | VARCHAR | 50       | No  | No  | No   | Nombre del sensor               | “AT1”                      |
| tipo_sensor      | VARCHAR | 50       | No  | No  | No   | Tipo de sensor                  | “temperatura”              |
| unidad_medida    | INT     | 10       | No  | No  | No   | Unidad de medida                | "%"                        |
| descripcion      | TEXT    | -        | No  | No  | No   | Descripción de ubicación/uso    | “sensor en el suelo del lote a1” |
| medida_minima    | FLOAT   | 10       | No  | No  | No   | Límite mínimo esperado          | 20.0                       |
| medida_maxima    | FLOAT   | 10       | No  | No  | No   | Límite máximo esperado          | 30.2                       |

---

### Tabla: `mide`

| Campo         | Tipo | Longitud | PK  | AI  | Nulo | Descripción           | Ejemplo |
|----------------|------|----------|-----|-----|------|-----------------------|---------|
| id_mide        | INT  | -        | Sí  | Sí  | No   | ID único              | 1       |
| fk_id_sensor   | INT  | 10       | No  | No  | No   | Sensor asociado (FK)  | 1       |
| fk_id_era      | INT  | 10       | No  | No  | No   | Era asociada (FK)     | 1       |

---

### Tabla: `tipo_residuos`

| Campo            | Tipo    | Longitud | PK  | AI  | Nulo | Descripción        | Ejemplo         |
|------------------|---------|----------|-----|-----|------|--------------------|-----------------|
| id_tipo_residuo  | INT     | -        | Sí  | Sí  | No   | ID único           | 1               |
| nombre_residuo   | VARCHAR | 50       | No  | No  | No   | Categoría          | “orgánico”      |
| descripcion      | TEXT    | -        | No  | No  | No   | Características    | “biodegradable” |

---

### Tabla: `residuos`

| Campo             | Tipo    | Longitud | PK  | AI  | Nulo | Descripción               | Ejemplo             |
|-------------------|---------|----------|-----|-----|------|---------------------------|---------------------|
| id_residuo        | INT     | -        | Sí  | No  | No   | ID único                  | 1                   |
| nombre            | VARCHAR | 50       | No  | No  | No   | Nombre del residuo        | “Hojas caídas”      |
| fecha             | DATE    | -        | No  | No  | No   | Fecha de generación       | "2024-07-15"        |
| descripcion       | TEXT    | -        | No  | No  | No   | Detalles                  | "mantenimiento"     |
| fk_id_tipo_residuo| INT     | 10       | No  | No  | No   | Tipo de residuo asociado (FK) | 1              |
| fk_id_cultivo     | INT     | 10       | No  | No  | No   | Cultivo asociado (FK)     | 1                   |

---

### Tabla: `control_fitosanitario`

| Campo                   | Tipo | Longitud | PK  | AI  | Nulo | Descripción                              | Ejemplo              |
|-------------------------|------|----------|-----|-----|------|------------------------------------------|----------------------|
| id_control_fitosanitario| INT  | -        | Sí  | No  | No   | ID único                                 | 1                    |
| fk_id_desarrollan       | INT  | 10       | No  | No  | No   | Cultivo y PEA relacionado (FK)           | 1                    |
| fecha_control           | DATE | -        | No  | No  | No   | Fecha de tratamiento                     | "2024-07-15"         |
| descripcion             | TEXT | -        | No  | No  | No   | Detalles del tratamiento                 | "aplicación de insecticida" |

---

### Tabla: `control_usa_insumo`

| Campo                       | Tipo | Longitud | PK  | AI  | Nulo | Descripción                       | Ejemplo |
|-----------------------------|------|----------|-----|-----|------|-----------------------------------|---------|
| id_control_usa_insumo       | INT  | -        | Sí  | No  | No   | ID único                          | 1       |
| fk_id_insumo                | INT  | 10       | No  | No  | No   | Insumo asociado (FK)              | 1       |
| fk_id_control_fitosanitario| INT  | 10       | No  | No  | No   | Control fitosanitario asociado    | 1       |
| cantidad                    | INT  | 10       | No  | No  | No   | Cantidad aplicada                 | 10      |


## 7. Modelo relacional


![Diagrama de entidad relacion](/imgbasedatos/modelorelacional.png) 

## 8. Justificación del Motor Seleccionado

Se seleccionó *MySQL 8.0+* como motor de base de datos por las siguientes razones, evaluadas en comparación con alternativas como *PostgreSQL* y *SQLite*:

- *Rendimiento y escalabilidad*: MySQL ofrece un rendimiento sólido para aplicaciones web como *AgroSoft*, con tiempos de respuesta rápidos para consultas en tablas de tamaño mediano. Aunque *PostgreSQL* es superior para consultas complejas o datos geoespaciales, las necesidades de *AgroSoft* no requieren estas características.
- *Compatibilidad con Laravel*: MySQL es totalmente compatible con *Laravel 12* y su ORM *Eloquent*, reduciendo errores de configuración en comparación con *SQLite*.
- *Código abierto y gratuito*: MySQL no tiene costos de licencia, ideal para un proyecto con restricciones presupuestarias, a diferencia de motores como *Microsoft SQL Server*.
- *Facilidad de uso*: MySQL, combinado con *phpMyAdmin* (incluido en *Laragon*), permite una gestión visual sencilla, adecuada para equipos con experiencia técnica moderada.
- *Seguridad*: MySQL ofrece control de acceso y cifrado robustos para proteger datos agrícolas sensibles.
- *Soporte y comunidad*: La amplia documentación y comunidad de MySQL facilitan la resolución de problemas.

=== Comparativa con alternativas

- *PostgreSQL*: Más avanzado para datos geoespaciales o JSON, pero su configuración es más compleja y menos integrada con *Laragon*.
- *SQLite*: Adecuado para prototipos, pero no escalable para múltiples usuarios o grandes volúmenes de datos IoT.
- *MariaDB*: Similar a MySQL, pero MySQL fue elegido por ser el estándar en *Laragon* y por su soporte en la comunidad de *Laravel*.

En resumen, *MySQL* ofrece un equilibrio óptimo entre rendimiento, facilidad de uso, compatibilidad y costos para *AgroSoft*.


---

## 9. Requisitos de Configuración

=== Herramientas necesarias

- *Motor de Base de Datos*: MySQL 8.0+ (incluido en *Laragon*).
- *Cliente de Base de Datos*: phpMyAdmin (incluido en *Laragon*) o CLI de MySQL.
- *Servidor Local*: Laragon (https://laragon.org/) para desarrollo en Windows. En producción, un servidor Linux con Apache/Nginx y MySQL.
- *Editor de Código*: Visual Studio Code o cualquier editor compatible con PHP.
- *PHP*: Versión 8.2+ (requerida por *Laravel 12*, incluida en *Laragon*).
- *Composer*: Gestor de dependencias de PHP (incluido en *Laragon*).

=== Requisitos del sistema

- *Sistema Operativo*: Windows 10+ (para *Laragon*) o Linux (producción).
- *RAM*: Mínimo 4 GB, recomendado 8 GB.
- *Espacio en Disco*: Mínimo 2 GB.
- *Puertos*: Puerto 3306 para MySQL (debe estar libre).

=== Configuración recomendada

- *Usuario de MySQL*: `root` (por defecto en *Laragon*).
- *Contraseña*: Vacía por defecto en *Laragon*, pero se recomienda una contraseña segura en producción.
- *Codificación*: UTF-8 (`utf8mb4_unicode_ci`).
- *Zona Horaria*: Configurar MySQL con la zona horaria local (por ejemplo, `America/Bogota`).


## 10. Script de Creación de Base de Datos

== 10. Scripts

=== Uso de Migraciones en Laravel

*Laravel* utiliza migraciones para automatizar y versionar la creación de la base de datos. Sigue estos pasos para usar migraciones en lugar de scripts SQL:

==== 10.2.1. Configuración del Archivo `.env`
Edita el archivo `.env` en la raíz del proyecto *Laravel* con los siguientes valores: 

**DB_CONNECTION=mysql**

**DB_HOST=127.0.0.1**

**DB_PORT=3306**

**DB_DATABASE=agrosoft**

**DB_USERNAME=root**

**DB_PASSWORD=**


NOTE: Asegúrate de que *MySQL* esté activo en *Laragon* y que el puerto 3306 esté disponible. En producción, configura una contraseña segura para `root`.

==== 10.2.2. Crear una Migración
Genera un archivo de migración para la tabla *sensor_data*: **php artisan make:migration create_sensor_data_table**


==== 10.2.3. Editar la Migración
Abre el archivo generado en `database/migrations/` y agrega la siguiente estructura:

**use Illuminate\Database\Migrations\Migration;**

**use Illuminate\Database\Schema\Blueprint;**

**use Illuminate\Support\Facades\Schema;**

class CreateSensorDataTable extends Migration

{

    public function up()

    {

        Schema::create('sensor_data', function (Blueprint $table) {

            $table->id();

            $table->string('sensor_type', 50);

            $table->decimal('value', 10, 2);

            $table->dateTime('timestamp');

            $table->timestamps();

        });

    }

    public function down()
    {
        Schema::dropIfExists('sensor_data');
    }
}
----

==== 10.2.4. Ejecutar las Migraciones
Ejecuta el comando siguiente en la terminal del proyecto: **php artisan migrate**


Verifica en *phpMyAdmin* que la tabla *sensor_data* se haya creado correctamente.

==== 10.2.5. Resolución de Problemas
Si las migraciones "no te funcionan", revisa lo siguiente:
- **Error de conexión**: Asegúrate de que *MySQL* esté activo y las credenciales en `.env` sean correctas.
- **Puerto ocupado**: Si el puerto 3306 está en uso, cambia `DB_PORT` a otro valor (por ejemplo, 3307) y ajusta la configuración de *MySQL* en *Laragon*.
- **Permisos**: Verifica que el usuario `root` tenga permisos para crear bases de datos.
- **Sintaxis**: Asegúrate de que no haya errores tipográficos en el archivo de migración.

Si persisten los problemas, consulta la documentación oficial de Laravel (https://laravel.com/docs/12.x/migrations) o comparte el mensaje de error para obtener ayuda específica.


## 11. Configuración y Ejecución de la Base de Datos

Esta sección detalla el proceso para configurar y ejecutar la base de datos *agrosoft* usando *Laragon* y *phpMyAdmin*. Se incluyen instrucciones para scripts SQL y migraciones de *Laravel*, junto con pasos para verificar la configuración.


=== Ejecución con Migraciones

Para usar migraciones de *Laravel* como alternativa a los scripts SQL:

1. Configura el archivo `.env` según la sección 10.
2. Abre una terminal en el directorio del proyecto *Laravel*.
3. Ejecuta el comando: **php artisan migrate**

4. Verifica en *phpMyAdmin* que la tabla *sensor_data* se haya creado correctamente ejecutando `SHOW TABLES;`.

NOTE: Asegúrate de que *MySQL* esté activo y las credenciales en `.env` coincidan con tu configuración.

=== Resolución de Problemas

Si encuentras problemas durante la configuración o ejecución, revisa los siguientes casos:

- **MySQL no se inicia en Laragon**:
  - Solución: Reinicia *Laragon* o verifica que el puerto 3306 no esté en uso por otro servicio. Cambia el puerto en *Laragon* si es necesario.
- **Error al conectar a phpMyAdmin**:
  - Solución: Confirma que *MySQL* está activo y que usas las credenciales correctas (`root` sin contraseña por defecto).
- **Script SQL falla**:
  - Solución: Revisa la sintaxis en la sección 10. Si la tabla ya existe, usa `DROP TABLE sensor_data;` antes de ejecutar el script.
- **Migraciones no funcionan**:
  - **Error de conexión**: Verifica que las credenciales en `.env` sean correctas y que *MySQL* esté activo.
  - **Puerto ocupado**: Si el puerto 3306 está en uso, ajusta `DB_PORT` en `.env` (por ejemplo, a 3307) y reconfigura *MySQL* en *Laragon*.
  - **Permisos insuficientes**: Asegúrate de que el usuario `root` tenga permisos para crear bases de datos y tablas.
  - **Sintaxis en migración**: Revisa el archivo de migración en `database/migrations/` por errores tipográficos.
  - Solución: Ejecuta `php artisan migrate:rollback` para deshacer cambios y corrige el problema. Consulta la documentación de Laravel (https://laravel.com/docs/12.x/migrations) si persiste.

TIP: Si el problema continúa, anota el mensaje de error exacto (por ejemplo, el texto que aparece en la terminal) y consulta con el equipo de desarrollo o la documentación.