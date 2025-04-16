---
title: "Configuracion base de datos - Agrosoft"
description: "Documento técnico versión 1.0 para el sistema Agrosoft."
pubDate: 2024-10-09
author: Lucy fernanda ordoñez
---

## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA | RESPONSABLE | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|-------|-------------|----------------|-----------------------|
| 1.0     | 2024/10/09 | Lucy fernanda ordoñez| 2024/10/09 | Carlos Sterling |

---

## CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR

| VERSIÓN | MODIFICACIÓN RESPECTO VERSIÓN ANTERIOR |
|---------|-----------------------------------------|
|    1    | Modificacion en todo el archivo por escritura |

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

El sistema **AgroSoft** tiene como objetivo implementar un sistema de seguimiento y trazabilidad para actividades agrícolas (control fitosanitario, riego, fertilización, insumos y monitoreo) en la **C.G.D.S.S.**  
Este documento describe la configuración de la base de datos que soportará los módulos de **IoT**, **Trazabilidad**, **Inventario** y **Finanzas**.

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

Se seleccionó **MySQL** por su rendimiento, facilidad de uso y compatibilidad con **PHP** y **Laragon**, lo que lo hace ideal para la gestión de datos en el Sistema de Seguimiento y Trazabilidad Agrícola.

### Razones principales:

- Código abierto y gratuito, sin costos de licencia.  
- Eficiente y rápido, ideal para manejar grandes volúmenes de datos.  
- Fácil de instalar y administrar con **phpMyAdmin**.  
- Compatible con múltiples herramientas y lenguajes.  
- Seguridad y control de acceso para proteger la información.  
- Amplio soporte y documentación, facilitando el mantenimiento.  

Gracias a estas ventajas, **MySQL** garantiza una gestión **estable**, **segura** y **óptima** de la información agrícola.

---

## 9. Requisitos de Configuración

### Herramientas Necesarias

- **Motor de Base de Datos**: MySQL 8.0+ (incluido en Laragon)  
- **Cliente de Base de Datos**: phpMyAdmin (incluido en Laragon)  
- **Servidor Local**: [Laragon](https://laragon.org/)  
- **Editor de Código**: Visual Studio Code  

---

### Requisitos del Sistema

- **Sistema Operativo**: Windows 10 o superior  
- **RAM**: 4GB mínimo (8GB recomendado)  

---

### Configuración Recomendada

- **Puerto MySQL**: 3306  
- **Usuario**: `root`  
- **Contraseña**: *(vacía por defecto en Laragon)*      

## 10. Script de Creación de Base de Datos

```sql
CREATE DATABASE IF NOT EXISTS agrosof;
USE agrosof;

CREATE TABLE Rol (
    id_rol INT AUTO_INCREMENT PRIMARY KEY,
    nombre_rol ENUM('aprendiz', 'pasante', 'instructor') NOT NULL,
    fecha_creacion DATE
);

CREATE TABLE usuarios (
    identificacion BIGINT PRIMARY KEY,
    nombre VARCHAR(50),
    contrasena VARCHAR(50),
    email VARCHAR(50),
    fk_id_rol INT,
    FOREIGN KEY (fk_id_rol) REFERENCES Rol(id_rol)
);

CREATE TABLE herramientas (
    id_herramienta INT AUTO_INCREMENT PRIMARY KEY,
    nombre_h VARCHAR(50),
    fecha_prestamo DATE,
    estado VARCHAR(50)
);

CREATE TABLE insumos (
    id_insumo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    tipo VARCHAR(50),
    precio_unidad INT,
    cantidad INT,
    unidad_medida VARCHAR(50)
);

CREATE TABLE actividad (
    id_actividad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_actividad VARCHAR(50),
    descripcion TEXT
);

CREATE TABLE calendario_lunar (
    id_calendario_lunar INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    descripcion_evento TEXT,
    evento VARCHAR(50)
);

CREATE TABLE asignacion_actividad (
    id_asignacion_actividad INT AUTO_INCREMENT PRIMARY KEY,
    fecha DATE,
    fk_id_actividad INT,
    fk_identificacion BIGINT,
    FOREIGN KEY (fk_id_actividad) REFERENCES actividad(id_actividad),
    FOREIGN KEY (fk_identificacion) REFERENCES usuarios(identificacion)
);

CREATE TABLE programacion (
    id_programacion INT AUTO_INCREMENT PRIMARY KEY,
    estado VARCHAR(50),
    fecha_programada DATE,
    duracion INT,
    fk_id_asignacion_actividad INT,
    fk_id_calendario_lunar INT,
    FOREIGN KEY (fk_id_asignacion_actividad) REFERENCES asignacion_actividad(id_asignacion_actividad),
    FOREIGN KEY (fk_id_calendario_lunar) REFERENCES calendario_lunar(id_calendario_lunar)
);

CREATE TABLE notificacion (
    id_notificacion INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(50),
    mensaje VARCHAR(50),
    fk_id_programacion INT,
    FOREIGN KEY (fk_id_programacion) REFERENCES programacion(id_programacion)
);

CREATE TABLE requiere (
    id_requiere INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_herramienta INT,
    FOREIGN KEY (fk_id_herramienta) REFERENCES herramientas(id_herramienta),
    fk_id_asignacion_actividad INT,
    FOREIGN KEY (fk_id_asignacion_actividad) REFERENCES asignacion_actividad(id_asignacion_actividad)
);

CREATE TABLE utiliza (
    id_utiliza INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_insumo INT,
    FOREIGN KEY (fk_id_insumo) REFERENCES insumos(id_insumo),
    fk_id_asignacion_actividad INT,
    FOREIGN KEY (fk_id_asignacion_actividad) REFERENCES asignacion_actividad(id_asignacion_actividad)
);

CREATE TABLE PEA (
    id_pea INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT
);

CREATE TABLE ubicacion (
    id_ubicacion INT AUTO_INCREMENT PRIMARY KEY,
    latitud DECIMAL(9,6),
    longitud DECIMAL(9,6)
);

CREATE TABLE lote (
    id_lote INT AUTO_INCREMENT PRIMARY KEY,
    dimension INT,
    nombre_lote VARCHAR(50),
    fk_id_ubicacion INT,
    CONSTRAINT ubicacion_lote FOREIGN KEY (fk_id_ubicacion) REFERENCES ubicacion(id_ubicacion),
    estado VARCHAR(50)
);

CREATE TABLE eras (
    id_eras INT AUTO_INCREMENT PRIMARY KEY,
    descripcion VARCHAR(50),
    fk_id_lote INT,
    CONSTRAINT lote_era FOREIGN KEY (fk_id_lote) REFERENCES lote(id_lote)
);

CREATE TABLE tipo_cultivo (
    id_tipo_cultivo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    descripcion TEXT
);

CREATE TABLE especie (
    id_especie INT AUTO_INCREMENT PRIMARY KEY,
    nombre_comun VARCHAR(50),
    nombre_cientifico VARCHAR(50),
    descripcion TEXT,
    fk_id_tipo_cultivo INT,
    CONSTRAINT tipo_especie FOREIGN KEY (fk_id_tipo_cultivo) REFERENCES tipo_cultivo(id_tipo_cultivo)
);

CREATE TABLE semilleros (
    id_semillero INT AUTO_INCREMENT PRIMARY KEY,
    nombre_semilla VARCHAR(50),
    fecha_siembra DATE,
    fecha_estimada DATE,
    cantidad INT
);

CREATE TABLE cultivo (
    id_cultivo INT AUTO_INCREMENT PRIMARY KEY,
    fecha_plantacion DATE NOT NULL,
    nombre_cultivo VARCHAR(50),
    descripcion TEXT,
    fk_id_especie INT,
    CONSTRAINT especie_cultivo FOREIGN KEY (fk_id_especie) REFERENCES especie(id_especie),
    fk_id_semillero INT,
    CONSTRAINT semillero_cultivo FOREIGN KEY (fk_id_semillero) REFERENCES semilleros(id_semillero)
);

CREATE TABLE realiza (
    id_realiza INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_cultivo INT,
    FOREIGN KEY (fk_id_cultivo) REFERENCES cultivo(id_cultivo),
    fk_id_actividad INT,
    CONSTRAINT actividad_realiza FOREIGN KEY (fk_id_actividad) REFERENCES actividad(id_actividad)
);

CREATE TABLE plantacion (
    id_plantacion INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_cultivo INT,
    FOREIGN KEY (fk_id_cultivo) REFERENCES cultivo(id_cultivo),
    fk_id_era INT,
    CONSTRAINT era_plantacion FOREIGN KEY (fk_id_era) REFERENCES eras(id_eras)
);

CREATE TABLE desarrollan (
    id_desarrollan INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_cultivo INT,
    FOREIGN KEY (fk_id_cultivo) REFERENCES cultivo(id_cultivo),
    fk_id_pea INT,
    CONSTRAINT pea_desarrollan FOREIGN KEY (fk_id_pea) REFERENCES PEA(id_pea)
);

CREATE TABLE produccion (
    id_produccion INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_cultivo INT,
    CONSTRAINT fk_cultivo_prod FOREIGN KEY (fk_id_cultivo) REFERENCES cultivo(id_cultivo),
    cantidad_producida INT NOT NULL,
    fecha_produccion DATE NOT NULL,
    fk_id_lote INT,
    CONSTRAINT fk_lote_prod FOREIGN KEY (fk_id_lote) REFERENCES lote(id_lote),
    descripcion_produccion TEXT,
    estado ENUM('En proceso', 'Finalizado', 'Cancelado'),
    fecha_cosecha DATE
);

CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_produccion INT,
    CONSTRAINT fk_produccion_venta FOREIGN KEY (fk_id_produccion) REFERENCES produccion(id_produccion),
    cantidad INT NOT NULL,
    precio_unitario INT NOT NULL,
    total_venta INT,
    fecha_venta DATE NOT NULL
);

CREATE TABLE genera (
    id_genera INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_cultivo INT,
    fk_id_produccion INT,
    CONSTRAINT cultivo_gen FOREIGN KEY (fk_id_cultivo) REFERENCES cultivo(id_cultivo),
    CONSTRAINT produ_gen FOREIGN KEY (fk_id_produccion) REFERENCES produccion(id_produccion)
);

CREATE TABLE sensores (
    id_sensor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_sensor VARCHAR(50),
    tipo_sensor VARCHAR(50),
    unidad_medida VARCHAR(50),
    descripcion TEXT,
    medida_minima FLOAT,
    medida_maxima FLOAT
);

CREATE TABLE mide (
    id_mide INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_sensor INT,
    FOREIGN KEY (fk_id_sensor) REFERENCES sensores(id_sensor),
    fk_id_era INT,
    CONSTRAINT era_mide FOREIGN KEY (fk_id_era) REFERENCES eras(id_eras)
);

CREATE TABLE tipo_residuos (
    id_tipo_residuo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_residuo VARCHAR(50),
    descripcion TEXT
);

CREATE TABLE residuos (
    id_residuo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50),
    fecha DATE,
    descripcion TEXT,
    fk_id_tipo_residuo INT,
    CONSTRAINT tipo_residuo_residuo FOREIGN KEY (fk_id_tipo_residuo) REFERENCES tipo_residuos(id_tipo_residuo),
    fk_id_cultivo INT,
    CONSTRAINT cultivo_residuo FOREIGN KEY (fk_id_cultivo) REFERENCES cultivo(id_cultivo)
);

CREATE TABLE control_fitosanitario (
    id_control_fitosanitario INT AUTO_INCREMENT PRIMARY KEY,
    fecha_control DATE,
    descripcion TEXT,
    fk_id_desarrollan INT,
    CONSTRAINT desarrollan_control_fitosanitario FOREIGN KEY (fk_id_desarrollan) REFERENCES desarrollan(id_desarrollan)
);

CREATE TABLE control_usa_insumo (
    id_control_usa_insumo INT AUTO_INCREMENT PRIMARY KEY,
    fk_id_insumo INT,
    FOREIGN KEY (fk_id_insumo) REFERENCES insumos(id_insumo),
    fk_id_control_fitosanitario INT,
    CONSTRAINT control_fitosanitario_usa_insumo FOREIGN KEY (fk_id_control_fitosanitario) REFERENCES control_fitosanitario(id_control_fitosanitario),
    cantidad INT
);

```

## 11. Configuración y Ejecución de la Base de Datos

### 1. Instalación y Configuración

Para este sistema, se utiliza **MySQL** como motor de base de datos, gestionado a través de **Laragon**.

#### Pasos para la configuración:

1. Instalar **Laragon** (si no está instalado) desde [https://laragon.org/](https://laragon.org/).
2. Iniciar Laragon y asegurarse de que el servicio de **MySQL** esté activo.
3. Abrir **phpMyAdmin** desde [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
4. Crear una nueva base de datos desde phpMyAdmin o ejecutar el script SQL de creación.

> 💡 **Nota:**  
> Si se requiere una instalación manual de **MySQL** o **phpMyAdmin**, se recomienda consultar los manuales externos incluidos en los anexos del proyecto.

---

### 2. Ejecución del Script de Creación

Para crear la base de datos, sigue los siguientes pasos:

1. Abrir **phpMyAdmin** en [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).
2. Seleccionar la pestaña **"SQL"** en la parte superior.
3. Copiar y pegar el **script de creación de la base de datos**.
4. Ejecutar el script presionando el botón **"Continuar"**.

> ✅ **Resultado esperado:**  
> Al finalizar la ejecución, se debe verificar la creación correcta de todas las **tablas** y sus respectivas **relaciones** en la base de datos `agrosof`.