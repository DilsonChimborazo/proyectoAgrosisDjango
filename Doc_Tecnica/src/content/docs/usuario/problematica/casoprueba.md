---
title: "Plan de Pruebas - AgroSoft"
description: "Documento de plan de pruebas versión 0.1 para el sistema AgroSoft."
pubDate: 2025-07-28
author: Xiomara Sabi Rojas
---

## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA      | RESPONSABLE          | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|------------|----------------------|----------------|-----------------------|
| 0.1     | 2025/07/28 | Xiomara Sabi Rojas   | 2025/07/28     | Carlos Sterling      |

---

## CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR

| VERSIÓN | MODIFICACIÓN RESPECTO VERSIÓN ANTERIOR |
|---------|-----------------------------------------|
| 0.1     | Creación inicial del documento de plan de pruebas |

---

## Tabla de contenido

1. [Introducción](#1-introducción)  
2. [Alcance](#2-alcance)  
3. [Definiciones, siglas y abreviaturas](#3-definiciones-siglas-y-abreviaturas)  
4. [Responsables e involucrados](#4-responsables-e-involucrados)  
5. [Plan de Pruebas](#5-plan-de-pruebas)  
   - [5.1 MÓDULO 1: Gestión de Usuarios](#51-módulo-1-gestión-de-usuarios)  
   - [5.2 MÓDULO 2: Trazabilidad de Cultivos](#52-módulo-2-trazabilidad-de-cultivos)  
   - [5.3 MÓDULO 3: Inventario](#53-módulo-3-inventario)  
   - [5.4 MÓDULO 4: Finanzas](#54-módulo-4-finanzas)  
   - [5.5 MÓDULO 5: IoT (Monitoreo de sensores)](#55-módulo-5-iot-monitoreo-de-sensores)  
6. [Casos de Prueba](#6-casos-de-prueba)  
   - [6.1 Caso de uso - CU1. Registro de Usuarios](#61-caso-de-uso-cu1-registro-de-usuarios)  
   - [6.2 Caso de uso - CU2. Inicio de Sesión](#62-caso-de-uso-cu2-inicio-de-sesión)  
   - [6.3 Caso de uso - CU3. Editar Usuario](#63-caso-de-uso-cu3-editar-usuario)  
   - [6.4 Caso de uso - CU4. Asignación de Rol](#64-caso-de-uso-cu4-asignación-de-rol)  
   - [6.5 Caso de uso - CU5. Registro, actualización y lista cultivo](#65-caso-de-uso-cu5-registro-actualización-y-lista-cultivo)  
   - [6.6 Caso de uso - CU6. Registro y Lista Actividades](#66-caso-de-uso-cu6-registro-y-lista-actividades)  
   - [6.7 Caso de uso - CU7. Finalización de la Actividad](#67-caso-de-uso-cu7-finalización-de-la-actividad)  
   - [6.8 Caso de uso - CU8. Registro, actualización y lista de Control Fitosanitario](#68-caso-de-uso-cu8-registro-actualización-y-lista-de-control-fitosanitario)  
   - [6.9 Caso de uso - CU9. Registro, actualización y lista Insumos](#69-caso-de-uso-cu9-registro-actualización-y-lista-insumos)  
   - [6.10 Caso de uso - CU10. Registro, actualización y lista Herramientas](#610-caso-de-uso-cu10-registro-actualización-y-lista-herramientas)  
   - [6.11 Caso de uso - CU11. Registro, actualización de precio de producto](#611-caso-de-uso-cu11-registro-actualización-de-precio-de-producto)  
   - [6.12 Caso de uso - CU12. Registro de venta](#612-caso-de-uso-cu12-registro-de-venta)  
   - [6.13 Caso de uso - CU13. Visualización de datos de sensores](#613-caso-de-uso-cu13-visualización-de-datos-de-sensores)  
   - [6.14 Caso de uso - CU14. Monitoreo de evapotranspiración](#614-caso-de-uso-cu14-monitoreo-de-evapotranspiración)

---

## 1. Introducción

El sistema **AgroSoft** es una aplicación web diseñada para la gestión agrícola de la unidad productiva PAE (Producción Agrícola Ecológica). Este documento describe el plan de pruebas diseñado para validar el correcto funcionamiento de los módulos del sistema, asegurando que cumplan con los requerimientos definidos y operen adecuadamente bajo diferentes escenarios.

El propósito es garantizar la calidad del software mediante la ejecución de casos de prueba funcionales que identifiquen defectos o desviaciones, asegurando la fiabilidad y usabilidad de la aplicación.

---

## 2. Alcance

Este documento aplica al sistema **AgroSoft** en su versión 1.0, cubriendo los módulos esenciales implementados: **Gestión de Usuarios**, **Trazabilidad de Cultivos**, **Inventario**, **Finanzas** y **Módulo IoT**. A través de este plan de pruebas se validarán las funcionalidades principales, identificando posibles defectos o desviaciones, y garantizando que el sistema funcione conforme a los requerimientos establecidos. Este documento forma parte del proyecto de desarrollo de software en el marco del programa de formación del SENA.

### Módulos cubiertos

- **Gestión de Usuarios**: Registro, edición, visualización, eliminación de usuarios y asignación de roles.
- **Trazabilidad de Cultivos**: Registro y gestión de actividades agrícolas, desde la siembra hasta la cosecha.
- **Inventario**: Gestión de herramientas e insumos agrícolas.
- **Finanzas**: Registro y actualización de precios de productos, así como gestión de ventas.
- **IoT**: Visualización de datos ambientales en tiempo real recolectados por sensores.

### Impacto del documento

- **Equipo de desarrollo**: Guía para ejecutar pruebas funcionales y garantizar la calidad del sistema.
- **Instructores PAE**: Validación de que las funcionalidades cumplen con las necesidades agrícolas.
- **Usuarios finales**: Asegura que la interfaz y los datos sean consistentes y confiables.
- **Mantenimiento**: Base para futuras actualizaciones y expansiones del sistema.

---

## 3. Definiciones, siglas y abreviaturas

| Sigla/Abreviatura | Descripción                          |
|--------------------|--------------------------------------|
| IoT               | Internet of Things (Internet de las cosas) |
| PAE               | Producción Agrícola Ecológica        |
| CU                | Caso de Uso                          |
| QA                | Quality Assurance (Aseguramiento de Calidad) |
| CRUD              | Crear, Leer, Actualizar y Eliminar   |

---

## 4. Responsables e involucrados

| Nombre                     | Tipo (Responsable/Involucrado) | Rol              |
|----------------------------|--------------------------------|------------------|
| Xiomara Sabi Rojas         | Responsable                    | Desarrolladora   |
| Juan David Bolaños Espinosa| Responsable                    | Desarrollador  |
| Dilson Chimborazo Pérez    | Involucrado                    | Líder Técnico    |
| Lucy Fernanda Rodríguez     | Involucrado                    | Desarrolladora   |
| Francisco Javier Urbano    | Involucrado                    | Desarrollador    |
| Wilson Eduardo Samboní     | Involucrado                    | Desarrollador    |

---

## 5. Plan de Pruebas

Esta sección describe los módulos del sistema que serán sometidos a pruebas funcionales, junto con los casos de prueba planeados para cada uno.

### 5.1 MÓDULO 1: Gestión de Usuarios

Este módulo permite el registro, edición, visualización y eliminación de usuarios, así como el inicio de sesión y la asignación de roles.

#### 5.1.1 Casos de prueba planeados

- **CU1**: Registro de nuevo usuario
- **CU2**: Inicio de sesión con credenciales válidas
- **CU3**: Edición de información de usuario
- **CU4**: Asignación de roles

### 5.2 MÓDULO 2: Trazabilidad de Cultivos

Permite registrar y gestionar todas las actividades relacionadas con el cultivo, desde la siembra hasta la cosecha.

#### 5.2.1 Casos de prueba planeados

- **CU5**: Registro, Lista, Actualización de cultivo
- **CU6**: Registro y lista de actividad agrícola
- **CU7**: Finalización de una actividad
- **CU8**: Registro, Lista, Actualización de control fitosanitario

### 5.3 MÓDULO 3: Inventario

Permite registrar y gestionar un inventario de herramientas e insumos agrícolas para un mejor control.

#### 5.3.1 Casos de prueba planeados

- **CU9**: Registro, Lista, Actualización de insumos
- **CU10**: Registro, Lista, Actualización de herramientas

### 5.4 MÓDULO 4: Finanzas

Permite registrar y actualizar precios de productos, así como gestionar ventas.

#### 5.4.1 Casos de prueba planeados

- **CU11**: Registrar y Actualizar precio del producto
- **CU12**: Registro de venta

### 5.5 MÓDULO 5: IoT (Monitoreo de sensores)

Visualiza los datos ambientales en tiempo real recolectados por sensores, como humedad, temperatura y luminosidad.

#### 5.5.1 Casos de prueba planeados

- **CU13**: Mostrar datos recogidos de todos los sensores
- **CU14**: Monitoreo de evapotranspiración

---

## 6. Casos de Prueba

### 6.1 Caso de uso - CU1. Registro de Usuarios

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU1                           |
| **VERSIÓN DE EJECUCIÓN**                  | 1.0                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Registro de Usuarios          |
| **MÓDULO DEL SISTEMA**                    | Gestión de Usuarios           |
| **Descripción del caso de prueba**        | Verificar que el sistema permita registrar un nuevo usuario con todos los datos obligatorios. |

#### CASO DE PRUEBA

**Precondiciones**:  
El usuario debe estar autenticado como administrador.

**Pasos de la prueba**:  
- Ingresar al módulo de usuarios.  
- Hacer clic en “Registrar usuario”.  
- Llenar todos los campos del formulario.  
- Hacer clic en “Guardar”.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Nombre               | Juan Pérez                              | Positivo           | x      |        | Usuario registrado y listado correctamente |
| Documento            | 123456789                               | Positivo           | x      |        | |
| Contraseña           | 123456789                               | Positivo           | x      |        | |
| Rol                  | Admin                                   | Positivo           | x      |        | |
| Ficha                | 12345                                   | Positivo           | x      |        | |

**Post condiciones**:  
Usuario registrado en base de datos y visible en el módulo.

**RESULTADOS DE LA PRUEBA**  

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Wilson Samboni |

---

### 6.2 Caso de uso - CU2. Inicio de Sesión

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU2                           |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Inicio de Sesión              |
| **MÓDULO DEL SISTEMA**                    | Gestión de Usuarios           |
| **Descripción del caso de prueba**        | El usuario debe estar previamente registrado por el administrador para poder ingresar al sistema. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario registrado.

**Pasos de la prueba**:  
- Ingresar identificación y contraseña en login.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Identificación       | 12345678                                | Positivo           | x      |        | Bienvenido a AgroSoft |
| Contraseña           | unafacil                                | Positivo           | x      |        | |

**Post condiciones**:  
Acceso concedido y redirección al panel principal.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Xiomara Sabi Rojas |

---

### 6.3 Caso de uso - CU3. Editar Usuario

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU3                           |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Editar Usuario                |
| **MÓDULO DEL SISTEMA**                    | Gestión de Usuarios           |
| **Descripción del caso de prueba**        | Los usuarios serán listados por el administrador para poder visualizar su información y solo él podrá editar su información. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario existente.

**Pasos de la prueba**:  
- Buscar usuario, editar campos, guardar.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Identificación       | 12345678                                | Positivo           | x      |        | Usuario actualizado |

**Post condiciones**:  
Usuario actualizado correctamente.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Wilson Samboni  |

---

### 6.4 Caso de uso - CU4. Asignación de Rol

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU4                           |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Asignación de Rol             |
| **MÓDULO DEL SISTEMA**                    | Gestión de Usuarios           |
| **Descripción del caso de prueba**        | El usuario debe estar previamente registrado por el administrador pero sin un rol asignado que luego será establecido por el administrador. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario registrado sin rol.

**Pasos de la prueba**:  
- Se ingresa al usuario al cual se le quiere asignar el rol, luego de esto se podrá asignar un rol ya existente en el sistema.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Rol                  | Aprendiz                                | Positivo           | x      |        | Se asignó un rol |

**Post condiciones**:  
Acceso concedido y redirección al panel principal.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Wilson Samboni  |

---

### 6.5 Caso de uso - CU5. Registro, actualización y lista cultivo

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU5                           |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Registro, actualización y lista cultivo |
| **MÓDULO DEL SISTEMA**                    | Trazabilidad Cultivo          |
| **Descripción del caso de prueba**        | Luego del usuario ingresa al sistema tendrá la opción de poder registrar un cultivo por consiguiente podrá listarlos y actualizarlos si así lo desea. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos.

**Pasos de la prueba**:  
- Ingresa los datos que requiere para poder registrar el cultivo.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Nombre               | café                                    | Positivo           | x      |        | Cultivo registrado exitosamente |
| Descripción          | Café rico                               | Positivo           | x      |        | |
| Especie              | Vainillo                                | Positivo           | x      |        | |

**Post condiciones**:  
Registra cultivo y guarda en la base de datos.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Xiomara Sabi Rojas |

---

### 6.6 Caso de uso - CU6. Registro y Lista Actividades

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU6                           |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Registro y lista Actividades  |
| **MÓDULO DEL SISTEMA**                    | Trazabilidad Cultivo          |
| **Descripción del caso de prueba**        | Luego del usuario ingresa al sistema tendrá la opción de poder registrar una actividad la cual se listará en la tabla de actividades. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos.

**Pasos de la prueba**:  
- Ingresa los datos que requiere para poder registrar la actividad que es asignada.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Actividad            | Recoger café                            | Positivo           | x      |        | Actividad registrada exitosamente |
| Usuario              | Juan                                    | Positivo           | x      |        | |
| Estado               | pendiente                               | Positivo           | x      |        | |
| Fecha                | 25/01/25                                | Positivo           | x      |        | |
| Observaciones        | Muy fácil                               | Positivo           | x      |        | |

**Post condiciones**:  
Registra actividad, se asigna a alguien y le llega un correo a la persona que se le asignó dicha actividad y guarda en la base de datos.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Francisco Burbano |

---

### 6.7 Caso de uso - CU7. Finalización de la Actividad

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU7                           |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Finalización de la actividad  |
| **MÓDULO DEL SISTEMA**                    | Trazabilidad Cultivo          |
| **Descripción del caso de prueba**        | Luego del usuario ingresa al sistema le listará las actividades que tiene asignadas y pendientes, podrá darle fin a estas. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos.

**Pasos de la prueba**:  
- Ingresa los datos que requiere para finalizar actividad.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Fecha realizada      | 25/2/2025                               | Positivo           | x      |        | Actividad Finalizada exitosamente |
| Duración             | 125 min                                 | Positivo           | x      |        | |
| Cantidad Insumo      | 34 g                                    | Positivo           | x      |        | |
| Unidad medida        | gramos                                  | Positivo           | x      |        | |
| Imagen               | opcional                                | Positivo           | x      |        | |

**Post condiciones**:  
Se actualiza la información nueva de la actividad y se registra como realizada.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Francisco Burbano |

---

### 6.8 Caso de uso - CU8. Registro, actualización y lista de Control Fitosanitario

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU8                           |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Registro, actualización y lista de control fitosanitario |
| **MÓDULO DEL SISTEMA**                    | Trazabilidad Cultivo          |
| **Descripción del caso de prueba**        | Luego del usuario ingresa al sistema podrá registrar, listar y actualizar un control fitosanitario. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos.

**Pasos de la prueba**:  
- Ingresa los datos que requiere para poder registrar el control que se realiza a una plaga.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Fecha de control     | 23/2/2025                               | Positivo           | x      |        | Control registrado exitosamente |
| Duración             | 250 min                                 | Positivo           | x      |        | |
| Descripción          | El mejor                                | Positivo           | x      |        | |
| Tipo de control      | orgánico                                | Positivo           | x      |        | |
| Plantación           | Café                                    | Positivo           | x      |        | |
| Plaga                | Plaga                                   | Positivo           | x      |        | |
| Insumo/cantidad      | Fértil/43g                              | Positivo           | x      |        | |
| Usuario              | Juan                                    | Positivo           | x      |        | |
| Imagen               | opcional                                | Positivo           | x      |        | |

**Post condiciones**:  
Registra control y guarda en la base de datos.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Xiomara Sabi Rojas |

---

### 6.9 Caso de uso - CU9. Registro, actualización y lista Insumos

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU9                           |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Registro, actualización y lista insumos |
| **MÓDULO DEL SISTEMA**                    | Inventario                    |
| **Descripción del caso de prueba**        | Luego del usuario ingresa al sistema podrá hacer el registro y la actualización de los insumos que hay, también se generará un tipo de sistema de salida y entrada de los mismos, para un mejor control. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos.

**Pasos de la prueba**:  
- Ingresa los datos que requiere para poder registrar el insumo.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Nombre               | Abono                                   | Positivo           | x      |        | Insumo registrado exitosamente |
| Tipo                 | Fertilizante                            | Positivo           | x      |        | |
| Precio               | 2000                                    | Positivo           | x      |        | |
| Cantidad             | 5234                                    | Positivo           | x      |        | |
| Unidad medida        | Gramos                                  | Positivo           | x      |        | |
| Fecha                | 23/5/2025                               | Positivo           | x      |        | |
| Imagen               | opcional                                | Positivo           | x      |        | |

**Post condiciones**:  
Registra insumo y guarda en la base de datos.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Dilson Chimborazo |

---

### 6.10 Caso de uso - CU10. Registro, actualización y lista Herramientas

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU10                          |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Registro, actualización y lista Herramientas |
| **MÓDULO DEL SISTEMA**                    | Inventario                    |
| **Descripción del caso de prueba**        | Luego del usuario ingresa al sistema podrá hacer el registro y la actualización de las herramientas que hay, también se generará un tipo de sistema de salida y entrada de los mismos, para un mejor control. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos.

**Pasos de la prueba**:  
- Ingresa los datos que requiere para poder registrar la herramienta.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Nombre               | Abono                                   | Positivo           | x      |        | Herramienta registrada exitosamente |
| Estado               | disponible                              | Positivo           | x      |        | |
| Precio               | 2000                                    | Positivo           | x      |        | |
| Cantidad             | 5234                                    | Positivo           | x      |        | |

**Post condiciones**:  
Registra herramienta y guarda en la base de datos.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Dilson Chimborazo |

---

### 6.11 Caso de uso - CU11. Registro, actualización de precio de producto

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU11                          |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Registro, actualización de precio de producto |
| **MÓDULO DEL SISTEMA**                    | Finanzas                      |
| **Descripción del caso de prueba**        | Luego del usuario ingresa al sistema podrá hacer el registro y la actualización de precio del producto de los productos que salen de la unidad productiva. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos de administrador.

**Pasos de la prueba**:  
- Ingresa los datos que requiere para poder registrar el precio del producto.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Plantación           | Café                                    | Positivo           | x      |        | Precio registrado y actualizado exitosamente |
| Nombre producción    | Producto 1                              | Positivo           | x      |        | |
| Cantidad producida   | 2000                                    | Positivo           | x      |        | |
| Unidad medida        | Libras                                  | Positivo           | x      |        | |
| Fecha                | 30/7/2025                               | Positivo           | x      |        | |
| Stock disponible     | 50                                      | Positivo           | x      |        | |
| Precio sugerido      | 40000                                   | Positivo           | x      |        | |

**Post condiciones**:  
Registra y actualiza el precio del producto y guarda en la base de datos.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Lucy Ordoñez |

---

### 6.12 Caso de uso - CU12. Registro de venta

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU12                          |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Registro de venta             |
| **MÓDULO DEL SISTEMA**                    | Finanzas                      |
| **Descripción del caso de prueba**        | Luego del usuario ingresa al sistema podrá hacer el registro de la venta de los productos que salen de la unidad productiva. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos de administrador.

**Pasos de la prueba**:  
- Ingresa los datos que requiere para poder registrar la venta.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Producción           | Café                                    | Positivo           | x      |        | Registro de venta exitoso |
| Cantidad             | 50                                      | Positivo           | x      |        | |
| Unidad de medida de la venta | Libras                         | Positivo           | x      |        | |
| Total, sin descuento | 1000                                    | Positivo           | x      |        | |
| Descuento            | 10%                                     | Positivo           | x      |        | |
| Precio con descuento (Por unidad) | 900                        | Positivo           | x      |        | |
| Total, con descuento | 45000                                   | Positivo           | x      |        | |

**Post condiciones**:  
Registra una venta y guarda en la base de datos.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Lucy Ordoñez |

---

### 6.13 Caso de uso - CU13. Visualización de datos de sensores

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU13                          |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Visualización de datos de sensores |
| **MÓDULO DEL SISTEMA**                    | IoT                           |
| **Descripción del caso de prueba**        | El usuario podrá visualizar los datos de los sensores. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos.

**Pasos de la prueba**:  
- Ingresa los datos que requiere para poder visualizar los datos de los sensores.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| Datos de humedad ambiente | 68%                                | Positivo           | x      |        | Mostrar datos de sensores |
| Datos de temperatura | 18 °C                                  | Positivo           | x      |        | |
| Datos de humedad terreno | 75%                                | Positivo           | x      |        | |
| Datos de iluminación | 1000 lux                               | Positivo           | x      |        | |
| Datos de velocidad de viento | 500 m/s                        | Positivo           | x      |        | |

**Post condiciones**:  
Visualización de datos de sensores en tiempo real.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Juan David Bolaños |

---

### 6.14 Caso de uso - CU14. Monitoreo de evapotranspiración

| **INFORMACIÓN GLOBAL DEL CASO DE PRUEBA** | |
|-------------------------------------------|-------------------------------|
| **CASO DE PRUEBA No.**                    | CU14                          |
| **VERSIÓN DE EJECUCIÓN**                  | 0.1                           |
| **FECHA EJECUCIÓN**                       | 2025/07/28                    |
| **CASO DE USO**                           | Monitoreo de evapotranspiración |
| **MÓDULO DEL SISTEMA**                    | IoT                           |
| **Descripción del caso de prueba**        | Luego del usuario ingresa al sistema podrá visualizar el cálculo de la evapotranspiración. |

#### CASO DE PRUEBA

**Precondiciones**:  
Usuario logueado con permisos.

**Pasos de la prueba**:  
- Visualizar el cálculo de la evapotranspiración.

| **DATOS DE ENTRADA** | **RESPUESTA ESPERADA DE LA APLICACIÓN** | **COINCIDE** | **RESPUESTA DEL SISTEMA** |
|----------------------|-----------------------------------------|--------------|---------------------------|
| **CAMPO**            | **VALOR**                               | **TIPO ESCENARIO** | **SI** | **NO** |
| ETC                  | 15.44                                   | Positivo           | x      |        | Evapotranspiración calculada |
| ETO                  | 9.26                                    | Positivo           | x      |        | |
| Recomendación de riego | 9.26                                  | Positivo           | x      |        | |

**Post condiciones**:  
Visualizar el cálculo de la evapotranspiración.

**RESULTADOS DE LA PRUEBA**

| **Defectos y desviaciones** | **Veredicto** | **Observaciones** | **Probador** |
|-----------------------------|---------------|-------------------|--------------|
| N/A                         | Aprobado      | Ninguna           | Juan David Bolaños |

---