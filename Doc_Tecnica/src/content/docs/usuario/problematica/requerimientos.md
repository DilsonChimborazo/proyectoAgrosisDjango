---
title: Especificación de Requerimientos de Software - AgroSis
descripción: archivo de recoleccion de requerimientos para funcionamiento correcto del software
---

## 1. Introducción

El presente documento tiene como objetivo describir de manera detallada los requerimientos funcionales y no funcionales del sistema **AgroSis**, una plataforma destinada a la gestión agrícola. AgroSis busca optimizar procesos relacionados con la planificación, ejecución, seguimiento y trazabilidad de las actividades del campo, facilitando la recolección de datos, el control de recursos y la toma de decisiones informadas.

## 2. Descripción General

### 2.1 Perspectiva del producto

AgroSis se integrará como una herramienta principal dentro de las actividades prácticas de formación en el área agrícola. Será utilizado tanto por aprendices como por instructores y pasantes, permitiendo la trazabilidad de cultivos, gestión de recursos (insumos y herramientas), monitoreo ambiental a través de sensores, y registro de actividades.

### 2.2 Funciones del producto

- Registro y gestión de cultivos.
- Registro y asignación de actividades agrícolas.
- Registro y monitoreo de parámetros ambientales (luminosidad, temperatura, humedad, viento).
- Control de plagas y aplicación de tratamientos fitosanitarios.
- Gestión de inventarios de insumos y herramientas.
- Asignación y control de costos de insumos, herramientas y mano de obra.
- Registro y control de residuos generados.
- Generación de reportes de trazabilidad y productividad.
- Visualización de calendario lunar y recomendaciones asociadas.

### 2.3 Características de los usuarios

#### 2.3.1 Administrador

Encargado de gestionar y configurar el sistema a nivel general. Sus funciones incluyen:

- Creación y gestión de usuarios.
- Asignación de roles.
- Configuración de módulos.
- Acceso completo a todos los registros y reportes.

#### 2.3.2 Aprendiz

Usuario que registra las actividades realizadas en campo. Sus funciones incluyen:

- Registrar actividades en cultivos.
- Ingresar parámetros ambientales recolectados.
- Documentar el uso de herramientas e insumos.
- Visualizar asignaciones y recomendaciones.

#### 2.3.3 Pasante

Usuario con rol de apoyo a los instructores. Sus funciones son similares a las del aprendiz, con permisos adicionales como:

- Validar registros de aprendices.
- Generar reportes básicos.
- Supervisar cumplimiento de actividades asignadas.

#### 2.3.4 Instructor

El instructor es un usuario con permisos amplios dentro de la plataforma, que participa activamente en la planificación, supervisión y evaluación de las actividades agrícolas ejecutadas por los aprendices y pasantes. Además, puede generar reportes y validar registros ingresados en el sistema.

**Permisos y Funciones:**

- Acceso completo a los módulos de Trazabilidad, IoT e Inventario.
- Validación de datos registrados por aprendices y pasantes.
- Generación y descarga de reportes para evaluar el desarrollo de los cultivos.
- Supervisión del uso adecuado de los recursos (insumos y herramientas).
- Consulta y análisis de datos financieros.
- Asignación de tareas específicas a los usuarios según los cronogramas de cultivo.

## 3. Requisitos Específicos

### 3.1 Requisitos Funcionales

- **RF01:** El sistema permitirá registrar un nuevo cultivo con los datos: nombre, fecha de siembra, lote y era.
- **RF02:** El sistema permitirá asignar actividades a aprendices o pasantes, con descripción, fecha, herramientas e insumos asociados.
- **RF03:** El sistema registrará parámetros ambientales y los almacenará en el historial del cultivo.
- **RF04:** El sistema permitirá registrar tratamientos fitosanitarios aplicados al cultivo.
- **RF05:** El sistema permitirá registrar el uso de insumos y herramientas en cada actividad.
- **RF06:** El sistema generará reportes de trazabilidad por cultivo.
- **RF07:** El sistema permitirá visualizar el calendario lunar y las recomendaciones asociadas al cultivo.

### 3.2 Requisitos No Funcionales

- **RNF01:** El sistema debe estar disponible el 99% del tiempo durante las jornadas laborales.
- **RNF02:** La interfaz debe ser amigable y adaptable a dispositivos móviles.
- **RNF03:** Los datos deben ser almacenados de manera segura y respaldados semanalmente.
- **RNF04:** El sistema debe permitir múltiples sesiones simultáneas sin pérdida de información.
