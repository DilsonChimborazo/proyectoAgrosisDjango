---
title: "Requermientos - Agrosoft"
description: "Documento técnico versión 2.0 para el sistema Agrosoft."
pubDate: 2025-23-07
author: Xiomara Sabi Rojas
---

## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA | RESPONSABLE | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|-------|-------------|----------------|-----------------------|
| 1.0     | 2024/10/09 | Xiomara Sabi Rojas | 2024/10/09 | Carlos Sterling |
| 2.0     | 2025/23/07 | Xiomara Sabi Rojas | 2015/30/07 | Carlos Sterling |
---

## CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR

| VERSIÓN | MODIFICACIÓN RESPECTO VERSIÓN ANTERIOR |
|---------|-----------------------------------------|
|    1    | Modificacion en todo el archivo por escritura |
|    2    | Modificacion de redaccion en el archivo |

---
## Tabla de Contenido

1. [Introducción](#1-introducción)  
   1.1 [Propósito](#11-propósito)  
   1.2 [Alcance](#12-alcance)  
   1.3 [Definiciones, Acrónimos y Abreviaturas](#13-definiciones-acrónimos-y-abreviaturas)  
   1.4 [Responsables e involucrados](#14-responsables-e-involucrados)  

2. [Descripción general](#2-descripción-general)  
   2.1 [Perspectiva del producto](#21-perspectiva-del-producto)  
   &nbsp;&nbsp;&nbsp;&nbsp;2.1.1 [Interfaces del usuario](#211-interfaces-del-usuario)  
   &nbsp;&nbsp;&nbsp;&nbsp;2.1.2 [Mapa de Navegación](#212-mapa-de-navegación)  
   2.2 [Características del producto](#22-características-del-producto)  
   &nbsp;&nbsp;&nbsp;&nbsp;2.2.1 [Funciones del producto](#221-funciones-del-producto)  
   2.3 [Características del usuario](#23-características-del-usuario)  

3. [Especificación de requisitos](#3-especificación-de-requisitos)  
   3.1 [Requisitos funcionales](#31-requisitos-funcionales)  
   &nbsp;&nbsp;&nbsp;&nbsp;3.1.1 [Clasificación de requisitos funcionales](#311-clasificación-de-requisitos-funcionales)  

4. [Aspectos legales (normas o leyes)](#4-aspectos-legales-normas-o-leyes)  

5. [Restricciones del software](#5-restricciones-del-software)

## 1. Introducción

En este documento se establece una guía clara y detallada para el desarrollo de un sistema de información destinado a la gestión integral de cultivos en la unidad productiva PAE. Su objetivo principal es definir los requerimientos funcionales que aseguren que el sistema cumpla con las necesidades de los usuarios, facilitando la trazabilidad de cultivos y la optimización de procesos agrícolas. El documento describe las funcionalidades clave, los objetivos del sistema, los aspectos legales y las restricciones de desarrollo, sirviendo como base para el diseño, implementación y validación del sistema. Está dirigido a los desarrolladores, administradores agrícolas y partes interesadas involucradas en el proyecto, proporcionando una referencia estructurada para alinear expectativas y objetivos.

---

### 1.1 Propósito

El presente documento tiene como objetivo definir los requerimientos funcionales necesarios para el desarrollo de un sistema de información que optimice la gestión y trazabilidad de cultivos en la unidad productiva PAE. Este sistema abordará de manera eficiente el monitoreo de cultivos, la gestión de inventarios, la planificación de siembras, el control de plagas y enfermedades, y la optimización de recursos hídricos y nutrientes. El documento detalla las funcionalidades, restricciones y características necesarias para garantizar que el sistema cumpla con las necesidades operativas de la unidad, proporcionando herramientas intuitivas y análisis que apoyen la toma de decisiones estratégicas.

---

### 1.2 Alcance

Este documento especifica los requerimientos del sistema agrícola para la unidad productiva PAE, abarcando las funcionalidades necesarias para la gestión y trazabilidad de cultivos. Define los siguientes aspectos:
•	Requerimientos funcionales: Incluyen el registro y seguimiento de las etapas del cultivo, la gestión de inventarios de insumos, la planificación de siembras, el control de plagas y enfermedades, y la optimización de recursos hídricos y nutrientes.
•	Requerimientos no funcionales: Enfocan la usabilidad, accesibilidad, escalabilidad y rendimiento del sistema, asegurando una interfaz intuitiva y la capacidad de generar informes analíticos.
•	Límites del sistema: El documento se centra en la gestión de datos y la interfaz de usuario, excluyendo en esta fase la integración con hardware externo (como sensores IoT) o la automatización de procesos físicos.
•	Usuarios objetivo: Administradores agrícolas, técnicos y personal operativo de la unidad PAE que interactuarán con el sistema.
•	Entregables: Especificaciones detalladas de cada funcionalidad, restricciones, supuestos y criterios de aceptación para guiar el desarrollo y la validación.
El documento no cubre aspectos técnicos de implementación, como la arquitectura del sistema o el código fuente, ni especificaciones de hardware, los cuales se abordarán en fases posteriores del proyecto.



---

### 1.3 Definiciones, Acrónimos y Abreviaturas

- **PEA**: Plaga / Enfermedad / Arvenses  
- **IoT (Internet of Things - Internet de las Cosas)**: Conjunto de dispositivos interconectados que recopilan y transmiten datos a través de Internet, como sensores agrícolas en este caso.  
- **Calibración**: Proceso de ajuste y verificación de un sensor o dispositivo para garantizar mediciones precisas y confiables  
- **Infraestructura Robusta**: Conjunto de recursos tecnológicos (servidores, redes, bases de datos) diseñados para soportar altos volúmenes de información y tráfico de usuarios sin afectar el desempeño  
- **Latencia**: Tiempo que tarda un sistema en procesar una solicitud y devolver una respuesta. En IoT, una latencia alta puede afectar la actualización en tiempo real de los datos  

---

### 1.4 Responsables e Involucrados

| Nombre                         | Tipo        | Rol            |
|--------------------------------|-------------|-----------------|
| Juan David Bolaños             | Aprendiz    | Desarrollador   |
| Dilson Chimborazo Pérez        | Aprendiz    | Líder y desarrollador |
| Xiomara Sabi Rojas             | Aprendiz    | Desarrollador   |
| Wilson Eduardo Samboni         | Aprendiz    | Desarrollador   |
| Lucy Fernanda Rodriguez        | Aprendiz    | Desarrollador   |
| Francisco Javier Urbano        | Aprendiz    | Desarrollador   |

---

## 2. Descripción General

### 2.1 Perspectiva del Producto

Este documento presenta la Especificación de Requerimientos del Sistema Agrícola como la base para desarrollar un sistema de información adaptado a las necesidades de la unidad productiva PAE. Desde la perspectiva del producto, el documento define un sistema que centralizará la gestión de datos agrícolas, proporcionando herramientas para el monitoreo, planificación y análisis de cultivos. A diferencia de documentos técnicos de implementación, este se enfoca en describir qué debe hacer el sistema, no cómo hacerlo, asegurando que las funcionalidades propuestas cumplan con los objetivos operativos y estratégicos de la unidad PAE. El sistema descrito está diseñado para ser escalable y adaptable, con un enfoque inicial en la usabilidad y la generación de informes, y con potencial para futuras integraciones con tecnologías avanzadas, como análisis predictivo, según las necesidades evolutivas de la unidad.


---

#### 2.1.1 Interfaces del Usuario

A continuación, se describen las principales interfaces del usuario:

- **Ventana de Login**: Permite a los usuarios autenticarse en el sistema mediante credenciales (usuario y contraseña).  
- **Panel de Inicio**: Página principal donde los usuarios pueden acceder a las funcionalidades clave del sistema.  
- **Gestión de Usuarios**: Interfaz que permite la creación, modificación y eliminación de usuarios según sus roles.  
- **Módulo de Reportes**: Espacio donde los usuarios pueden generar y visualizar reportes relevantes del sistema.  
- **Configuración**: Sección para ajustar preferencias del sistema y gestionar permisos.


#### 2.1.2 Mapa de navegacion

![Mapa de navegacion](/imgrequerimientos/mnavegacion.png)

### 2.2 Características del producto

El documento detalla los requerimientos funcionales necesarios para implementar una funcionalidad de trazabilidad integral de cultivos en la unidad productiva PAE. Esta característica, definida en el documento, asegura que el sistema permita el registro, seguimiento y análisis de todas las etapas del ciclo de cultivo, desde la preparación del suelo hasta la cosecha. Los requerimientos especificados incluyen:
**• Especificación de registros:** El documento define que el sistema debe permitir a los usuarios registrar datos detallados de actividades agrícolas, como fechas de siembra, riego, fertilización, aplicación de pesticidas y cosecha, incluyendo detalles específicos como tipo de insumo y cantidades utilizadas.
**•	Requerimientos de seguimiento:** Se establece que el sistema debe ofrecer una vista consolidada y en tiempo real del estado de los cultivos, con capacidad para consultar hitos clave como germinación, floración y maduración, según lo especificado en el documento.
**•	Almacenamiento de datos históricos:** El documento especifica que el sistema debe almacenar registros históricos accesibles para consultas y análisis comparativos, soportando la planificación futura y la identificación de patrones.
**•	Requerimientos de usabilidad:** Se detalla que la funcionalidad debe estar soportada por una interfaz intuitiva, accesible para usuarios con conocimientos técnicos limitados, conforme a los requerimientos no funcionales del documento.
**•	Generación de reportes:** El documento requiere que el sistema genere reportes detallados, incluyendo gráficos y tablas que resuman las actividades de trazabilidad, para apoyar la toma de decisiones.


---

#### 2.2.1 Funciones del producto

##### 2.2.1.1 Módulo de Usuario

Este módulo permitirá la gestión de los usuarios que interactúan con el sistema, asegurando la autenticación, autorización y administración de roles.

**Funciones principales:**

- Registro y gestión de usuarios (administradores, agricultores, técnicos, etc.).
- Inicio de sesión y recuperación de credenciales.
- Asignación de permisos y roles según el tipo de usuario.
- Visualización y actualización del perfil del usuario.

---

##### 2.2.1.2 Módulo de IoT

Este módulo se encargará de recopilar, procesar y visualizar los datos obtenidos de sensores instalados en el cultivo, permitiendo un monitoreo en tiempo real.

**Funciones principales:**

- Recepción de datos de sensores (humedad del suelo, temperatura, humedad del aire, entre otros).
- Registro y almacenamiento de datos meteorológicos.
- Visualización de la información a través de gráficos y reportes.
- Generación de alertas en caso de condiciones críticas para el cultivo.

---

##### 2.2.1.3 Módulo de Trazabilidad

Este módulo documenta y rastrea todas las actividades relacionadas con el cultivo, desde la siembra hasta la cosecha, garantizando un seguimiento detallado del proceso agrícola.

**Funciones principales:**

- Registro de información sobre el ciclo del cultivo (fecha de siembra, crecimiento, fertilización, riego, cosecha).
- Gestión de prácticas agrícolas y aplicaciones de insumos (fertilizantes, pesticidas).
- Seguimiento de lotes de producción y condiciones del suelo.
- Generación de reportes sobre el estado del cultivo y recomendaciones basadas en datos históricos.

---

##### 2.2.1.4 Módulo de Finanzas

Se encargará del registro y control de los aspectos financieros del cultivo, ayudando a los usuarios a llevar un control de ingresos, egresos y costos operativos.

**Funciones principales:**

- Registro de gastos en insumos, mano de obra y mantenimiento.
- Control de ingresos por venta de productos agrícolas.
- Generación de reportes financieros para la toma de decisiones.
- Cálculo de rentabilidad del cultivo en base a los costos y ventas.

---

##### 2.2.1.5 Módulo de Inventario

Este módulo permitirá gestionar el stock de insumos agrícolas y herramientas necesarias para la producción, asegurando un control eficiente de los recursos.

**Funciones principales:**

- Registro y control del stock de fertilizantes, pesticidas, semillas y herramientas.
- Notificaciones cuando un producto esté por agotarse.
- Historial de movimientos de inventario (entradas y salidas).
- Integración con el módulo de trazabilidad para relacionar insumos con lotes de cultivo.

---

### 2.3 Características del usuario

---

#### 2.3.1 Administrador

El administrador tendrá el control total del sistema. Se encargará de gestionar la plataforma en su totalidad y tendrá acceso a todas las funcionalidades.

**Permisos y Funciones:**

- Crear, modificar y eliminar usuarios.
- Acceder a todos los módulos del sistema (Usuario, IoT, Trazabilidad, Finanzas e Inventario).
- Configurar parámetros y permisos dentro del sistema.
- Supervisar el correcto funcionamiento de la plataforma.

---

#### 2.3.2 Aprendiz

El aprendiz tendrá acceso restringido con funciones enfocadas en el aprendizaje y consulta de información relacionada con los cultivos y procesos agrícolas.

**Permisos y Funciones:**

- Acceso en modo solo lectura a los módulos del sistema.
- Visualización de datos en tiempo real (sensores IoT, trazabilidad, inventario, finanzas).
- Consultar reportes generados en la plataforma.

---

#### 2.3.3 Pasante

El pasante tendrá un rol activo con capacidad para registrar, editar y observar información, apoyando la gestión agrícola.

**Permisos y Funciones:**

- Registrar nuevos datos en los módulos de Trazabilidad, IoT e Inventario.
- Editar y actualizar información relacionada con los cultivos.
- Consultar reportes y métricas generadas en el sistema.
- Acceso limitado a módulos financieros (solo visualización).

---

#### 2.3.4 Instructor

El instructor tendrá permisos similares al pasante, pero también podrá validar y supervisar la información registrada por otros usuarios.

**Permisos y Funciones:**

- Registrar, editar y supervisar información en los módulos de Trazabilidad, IoT e Inventario.
- Aprobar o corregir registros realizados por aprendices o pasantes.
- Consultar reportes y métricas generadas en el sistema.
- Visualización de datos financieros sin capacidad de edición.


## 3. Especificación de Requisitos

---

### 3.1 Requisitos Funcionales

| Código  | Funcionalidad                                          | Tipo     |
|---------|--------------------------------------------------------|----------|
| RF01    | Inicio de sesión                                       | Esencial |
| RF02    | Registro de usuarios                                   | Esencial |
| RF03    | Listar Usuarios                                        | Esencial |
| RF04    | Editar usuarios                                        | Esencial |
| RF05    | Registrar Insumos                                      | Esencial |
| RF06    | Listar Insumos                                         | Esencial |
| RF07    | Editar información de insumos                          | Esencial |
| RF08    | Registrar Herramientas                                 | Esencial |
| RF09    | Listar Herramientas                                    | Esencial |
| RF10    | Editar Herramientas                                    | Esencial |
| RF11    | Mostrar en pantalla de IoT los sensores                | Esencial |
| RF12    | Mostrar información de la humedad                      | Esencial |
| RF13    | Mostrar información de humedad ambiente                | Esencial |
| RF14    | Mostrar información de luminosidad                     | Esencial |
| RF15    | Mostrar información de la lluvia                       | Esencial |
| RF16    | Mostrar información de la temperatura                  | Esencial |
| RF17    | Mostrar información del viento                         | Esencial |
| RF18    | Mostrar información del suelo                          | Esencial |
| RF19    | Monitoreo de la evapotranspiración                     | Esencial |
| RF20    | Gestión histórica de datos                             | Esencial |
| RF21    | Registrar, tipo de cultivos                            | Esencial |
| RF22    | Registro de nuevos semilleros                          | Esencial |
| RF23    | Registrar, listar y editar lotes                       | Esencial |
| RF24    | Registrar, listar y editar eras                        | Esencial |
| RF25    | Registrar, listar y editar cultivos                    | Esencial |
| RF26    | Registrar, listar y editar actividades                 | Esencial |
| RF27    | Asignación de actividades                              | Esencial |
| RF28    | Finalización de una actividad realizada                | Esencial |
| RF29    | Registrar la producción de un cultivo                  | Esencial |
| RF30    | Registrar PEA de los cultivos                          | Esencial |
| RF31    | Llevar el control fitosanitario                        | Esencial |
| RF32    | Registrar y editar fases lunares                       | Esencial |
| RF33    | Mostrar información de las fases lunares               | Esencial |
| RF34    | Área de recordatorios y eventos                        | Esencial |
| RF35    | Mostrar información por un mapa                        | Esencial |
| RF36    | Asignación de roles y permisos                         | Esencial |
| RF37    | Registrar y actualizar precio de producto              | Esencial |
| RF38    | Control de Arduino                                     | Esencial |
| RF39    | Registro de cada venta                                 | Esencial |
| RF40    | Rentabilidad de cada cultivo                           | Esencial |
| RF41    | Reportes de usuarios                                   | Esencial |
| RF42    | Reportes de insumos                                    | Esencial |
| RF44    | Reporte de datos de sensores                           | Esencial |
| RF50    | Reportes de actividades realizadas                     | Esencial |
| RF52    | Reporte de control fitosanitario                       | Esencial |
| RF53    | Reporte de venta                                       | Esencial |


### 3.1.1 Clasificación de Requisitos Funcionales

---

#### RF01 – EL SISTEMA DEBE PERMITIR AL USUARIO INICIAR SESIÓN
- **Descripción:** El sistema ofrecerá a los usuarios un formulario interactivo que contará con los campos Correo y Contraseña. Una vez que el usuario ingrese la información requerida, el sistema validará los datos proporcionados. Si la validación es exitosa, el usuario obtendrá acceso al sistema.
- **Prioridad:** Alta

---

#### RF02 – EL SISTEMA DEBE PERMITIR EL REGISTRO DE USUARIOS
- **Descripción:** El sistema dispondrá de un formulario interactivo con campos como: Tipo de Documento, Número de Documento, Nombre Completo, Teléfono, Correo Electrónico, Contraseña y Rol. El Rol define los privilegios de acceso. Tras validar los datos, el sistema registra al usuario garantizando seguridad e integridad.
- **Prioridad:** Alta

---

#### RF03 – EL SISTEMA DEBE PERMITIR LISTAR A LOS USUARIOS AGREGADOS POR EL ADMINISTRADOR
- **Descripción:** La interfaz mostrará una lista de usuarios con su estado (activo/inactivo). También permitirá editar la información registrada.
- **Prioridad:** Alta

---

#### RF04 – EL SISTEMA DEBE PERMITIR EDITAR LOS USUARIOS
- **Descripción:** Solo el administrador podrá editar o eliminar usuarios registrados, garantizando control y protección de datos.
- **Prioridad:** Alta

---

#### RF05 – EL SISTEMA DEBE PERMITIR REGISTRAR LOS INSUMOS AGRÍCOLAS
- **Descripción:** El sistema permitirá registrar insumos agrícolas y desplegar una lista de ellos. Los usuarios podrán visualizar, editar o eliminar registros desde una interfaz interactiva.
- **Prioridad:** Alta

---

#### RF06 – EL SISTEMA DEBE PERMITIR LISTAR INSUMOS REGISTRADOS PREVIAMENTE
- **Descripción:** El sistema mostrará un listado completo de los insumos registrados, facilitando la consulta detallada.
- **Prioridad:** Alta

---

#### RF07 – EL SISTEMA DEBE PERMITIR MOSTRAR Y ACTUALIZAR INFORMACIÓN DE INSUMOS
- **Descripción:** Permitirá actualizar la información de los insumos ya registrados para mantener los datos actualizados.
- **Prioridad:** Alta

---

#### RF08 – EL SISTEMA DEBE PERMITIR REGISTRAR HERRAMIENTAS AGRÍCOLAS
- **Descripción:** Permitirá registrar herramientas utilizadas en el cultivo, desplegando una lista con posibilidad de visualización, edición o eliminación.
- **Prioridad:** Alta

---

#### RF09 – EL SISTEMA DEBE PERMITIR LISTAR HERRAMIENTAS REGISTRADAS
- **Descripción:** Mostrará un listado con detalles completos de cada herramienta registrada.
- **Prioridad:** Alta

---

#### RF10 – EL SISTEMA DEBE PERMITIR MOSTRAR Y ACTUALIZAR INFORMACIÓN DE HERRAMIENTAS
- **Descripción:** Permitirá actualizar los datos de herramientas registradas para mantener la información actualizada.
- **Prioridad:** Alta

---

#### RF11 – EL SISTEMA DEBERÁ MOSTRAR EN LA PANTALLA DE IOT INFORMACIÓN DE TODOS LOS SENSORES EN TIEMPO REAL
- **Descripción:** Mostrará en tiempo real variables como:
  - Velocidad del viento (km/h)
  - Temperatura (°C)
  - Luz solar (%)
  - Humedad de eras (%)
  - Humedad ambiente
  - Lluvia (intensidad)
  
  Todo debe mostrarse en cuadros independientes con iconos representativos.
- **Prioridad:** Alta

---

#### RF12 – EL SISTEMA DEBERÁ MOSTRAR LA INFORMACIÓN DE HUMEDAD DE LAS ERAS
- **Descripción:** Mostrará la humedad del suelo en tiempo real gracias a sensores IoT, facilitando su monitoreo y gestión.
- **Prioridad:** Alta

---

#### RF13 – EL SISTEMA DEBERÁ MOSTRAR LA INFORMACIÓN DE HUMEDAD AMBIENTE
- **Descripción:** Presentará en tiempo real los niveles de humedad ambiental, recopilados mediante sensores.
- **Prioridad:** Alta

---

#### RF14 – EL SISTEMA DEBERÁ MOSTRAR LA INFORMACIÓN DE LUMINOSIDAD
- **Descripción:** Mostrará los niveles de luminosidad recopilados por sensores distribuidos, procesados y visualizados de forma clara.
- **Prioridad:** Alta

---

#### RF15 – EL SISTEMA DEBERÁ MOSTRAR LA INFORMACIÓN DE LLUVIA
- **Descripción:** A través de un pluviómetro, se mostrará la cantidad, intensidad, frecuencia y duración de la lluvia.
- **Prioridad:** Alta

#### RF16 – EL SISTEMA DEBERÁ MOSTRAR LA INFORMACIÓN RECOGIDA SOBRE LA TEMPERATURA
- **Descripción:** El sistema medirá y mostrará la temperatura en las áreas de cultivo utilizando sensores IoT. Los datos se recopilarán en tiempo real y se presentarán de manera clara.
- **Prioridad:** Alta

---

#### RF17 – EL SISTEMA DEBERÁ MOSTRAR LA INFORMACIÓN RECOGIDA SOBRE LA VELOCIDAD Y DIRECCIÓN DEL VIENTO
- **Descripción:** Se medirá la velocidad y dirección del viento mediante sensores. Los datos serán procesados y visualizados en tiempo real.
- **Prioridad:** Alta

---

#### RF18 – EL SISTEMA DEBERÁ MOSTRAR LA INFORMACIÓN RECOGIDA SOBRE EL PH DEL SUELO
- **Descripción:** Los sensores IoT medirán el pH del suelo, permitiendo gestionar su acidez o alcalinidad para mejorar la salud del cultivo.
- **Prioridad:** Alta

---

#### RF19 – EL SISTEMA DEBERÁ MONITOREAR LA EVAPOTRANSPIRACIÓN
- **Descripción:** Estimará la evapotranspiración considerando evaporación del suelo y transpiración de las plantas, facilitando un riego eficiente.
- **Prioridad:** Alta

---

#### RF20 – EL SISTEMA DEBERÁ PERMITIR ALMACENAMIENTO Y GESTIÓN HISTÓRICA DE DATOS
- **Descripción:** Almacenará datos capturados por sensores, permitiendo su análisis histórico para optimización agrícola.
- **Prioridad:** Alta

---

#### RF21 – EL SISTEMA DEBE PERMITIR REGISTRAR, LISTAR Y EDITAR EL NOMBRE Y TIPO DE CULTIVO
- **Descripción:** Permitirá registrar y administrar datos básicos de cultivos para su posterior gestión y asignación.
- **Prioridad:** Alta

---

#### RF22 – EL SISTEMA DEBE PERMITIR EL REGISTRO DE NUEVOS SEMILLEROS MEDIANTE UN FORMULARIO INTERACTIVO
- **Descripción:** Se registrará información de semilleros como número de unidades, fecha de siembra y salida.
- **Prioridad:** Alta

---

#### RF23 – EL SISTEMA DEBERÁ PERMITIR REGISTRAR, LISTAR Y EDITAR LOS LOTES
- **Descripción:** Permitirá registrar y modificar información de lotes para garantizar datos precisos.
- **Prioridad:** Alta

---

#### RF24 – EL SISTEMA DEBERÁ PERMITIR REGISTRAR, LISTAR Y EDITAR LA IMPLEMENTACIÓN DE ERAS EN UN LOTE
- **Descripción:** Permitirá implementar eras para optimizar espacio y facilitar el mantenimiento de cultivos.
- **Prioridad:** Alta

---

#### RF25 – EL SISTEMA DEBE PERMITIR REGISTRAR, LISTAR Y EDITAR LOS NUEVOS CULTIVOS MEDIANTE UN FORMULARIO
- **Descripción:** Facilitará la gestión eficiente del registro y control de nuevos cultivos.
- **Prioridad:** Alta

---

#### RF26 – EL SISTEMA DEBE PERMITIR REGISTRAR, LISTAR, EDITAR LAS ACTIVIDADES A REALIZAR EN LOS CULTIVOS
- **Descripción:** Permitirá crear y gestionar actividades con nombre, descripción y fecha de creación.
- **Prioridad:** Alta

---

#### RF27 – EL SISTEMA DEBE PERMITIR ASIGNAR, LISTAR Y EDITAR LAS ACTIVIDADES YA REGISTRADAS
- **Descripción:** Los instructores podrán asignar actividades incluyendo detalles, fechas, recursos y personal involucrado.
- **Prioridad:** Alta

---

#### RF28 – EL SISTEMA DEBE PERMITIR DAR FINALIZACIÓN A UNA ACTIVIDAD YA REALIZADA
- **Descripción:** Permitirá finalizar actividades indicando insumos, tiempo y estado final.
- **Prioridad:** Alta

---

#### RF29 – EL SISTEMA PERMITIRÁ REGISTRAR LA PRODUCCIÓN OBTENIDA DE UN CULTIVO
- **Descripción:** Permitirá registrar producción tras la cosecha, incluyendo detalles y fotografía.
- **Prioridad:** Alta

---

#### RF30 – EL SISTEMA PERMITIRÁ REGISTRAR LAS PLAGAS, ENFERMEDADES Y ARVENSES QUE AFECTAN LOS CULTIVOS
- **Descripción:** Documentará información detallada para control de organismos presentes en cultivos.
- **Prioridad:** Alta

---

#### RF31 – EL SISTEMA PERMITIRÁ LLEVAR EL RESPECTIVO CONTROL FITOSANITARIO
- **Descripción:** Permitirá registrar medidas tomadas contra enfermedades o plagas detectadas.
- **Prioridad:** Alta

---

#### RF32 – EL SISTEMA DEBE PERMITIR REGISTRAR Y EDITAR LA INFORMACIÓN SOBRE LAS FASES LUNARES
- **Descripción:** Permitirá registrar fases lunares e incluir recomendaciones de manejo agrícola asociadas.
- **Prioridad:** Alta

---

#### RF33 – EL SISTEMA DEBE PERMITIR MOSTRAR INFORMACIÓN SOBRE LA INFLUENCIA DE LAS FASES LUNARES
- **Descripción:** Mostrará fases lunares con recomendaciones interactivas según fecha y cultivo.
- **Prioridad:** Alta

---

#### RF34 – EL SISTEMA DEBE CONTENER UN ÁREA DE RECORDATORIOS Y EVENTOS
- **Descripción:** Un calendario interactivo permitirá gestionar eventos agrícolas como fertilizaciones y cosechas.
- **Prioridad:** Alta

---

#### RF35 – EL SISTEMA DEBE PERMITIR MOSTRAR EN UN MAPA EL NOMBRE DEL CULTIVO Y SU DESCRIPCIÓN
- **Descripción:** Un mapa mostrará cada cultivo con su historial, riego, abono y demás detalles.
- **Prioridad:** Alta

---

#### RF36 – EL SISTEMA DEBE PERMITIR ASIGNACIÓN DE ROLES Y PERMISOS
- **Descripción:** Permitirá asignar permisos diferenciados según el rol del usuario.
- **Prioridad:** Alta

---

#### RF37 – EL SISTEMA DEBERÁ PERMITIR REGISTRAR Y ACTUALIZAR EL PRECIO DE PRODUCTO
- **Descripción:** Permitirá gestionar el precio, impuestos y vigencia de cada producto.
- **Prioridad:** Alta

---

#### RF38 – EL SISTEMA PERMITIRÁ LLEVAR EL CONTROL DE ARDUINOS
- **Descripción:** Permitirá seleccionar y guardar configuraciones predefinidas de microcontroladores.
- **Prioridad:** Alta

---

#### RF39 – EL SISTEMA DEBE REGISTRAR DETALLES DE CADA VENTA
- **Descripción:** Permitirá documentar cada transacción con detalle para gestión de cartera de clientes.
- **Prioridad:** Alta

---

#### RF40 – EL SISTEMA DEBE MOSTRAR LA RENTABILIDAD DE CADA CULTIVO
- **Descripción:** Calculará rentabilidad con reportes exportables por actividad y cultivo.
- **Prioridad:** Alta

---

#### RF41 – EL SISTEMA DEBE GENERAR REPORTES DE USUARIOS
- **Descripción:** Analizará uso de la plataforma por parte de aprendices registrados.
- **Prioridad:** Alta

---

#### RF42 – EL SISTEMA DEBE GENERAR REPORTES DE INSUMOS
- **Descripción:** Permitirá visualizar listado completo de insumos con detalles clave.
- **Prioridad:** Alta

---


#### RF43 – EL SISTEMA DEBERÁ GENERAR REPORTE DE SENSORES EN TIEMPO REAL
- **Descripción:** Generará gráficos con datos de sensores (humedad, luz, pH, temperatura, etc.).
- **Prioridad:** Alta

---

#### RF44 – EL SISTEMA DEBE GENERAR REPORTE DE ACTIVIDADES REALIZADAS
- **Descripción:** Incluirá historial de tareas agrícolas realizadas por cultivo.
- **Prioridad:** Alta

---

#### RF45 – EL SISTEMA GENERARÁ REPORTE DE CONTROLES FITOSANITARIOS
- **Descripción:** Documento PDF que incluye acciones tomadas ante enfermedades y plagas.
- **Prioridad:** Alta

---

#### RF46 – EL SISTEMA DEBE GENERAR INFORME DE INGRESOS POR PRODUCTO VENDIDO
- **Descripción:** Detallará ventas, ingresos y margen por producto, útil para decisiones estratégicas.
- **Prioridad:** Alta

## 4. Aspectos legales (normas o leyes)

El desarrollo y uso del sistema deben cumplir con diversas normativas que regulan el manejo de datos, la seguridad informática y las prácticas agrícolas. Algunas de las leyes y regulaciones aplicables pueden incluir:

### 1. Protección de Datos Personales:
**- Ley:** Ley 1581 de 2012 y Decreto 1377 de 2013.
**-Aplicación:** Obtener consentimiento para datos personales de usuarios, usar cifrado (AES-256) y limitar accesos no autorizados.


### 2. Normativas Agrícolas:
**-Ley:** Ley 1581 de 2012 y Decreto 1377 de 2013.
**-Aplicación:** Obtener consentimiento para datos personales de usuarios, usar cifrado (AES-256) y limitar accesos no autorizados.


### 3. Seguridad en el Uso de IoT:
**-Ley:** Circular Externa 007 de 2018 (Superintendencia de Industria y Comercio).
**-Aplicación:** Usar protocolos seguros (MQTT con TLS/SSL) y cifrado para datos de sensores.

### 4. Normativas Financieras:
**-Ley:** Estatuto Tributario (Decreto 624 de 1989) y Circular Externa 100-000005 de 2017 (Superintendencia de Sociedades).
**-Aplicación:** Registrar ingresos/egresos y garantizar trazabilidad de transacciones para auditorías fiscales.

---

## 5. Restricciones del software

Durante el desarrollo del sistema, se han identificado diversas restricciones que pueden afectar su funcionalidad y desempeño:

### 1. Dependencia de Conectividad a Internet:
- Al integrar IoT y almacenamiento en la nube, el sistema requiere conexión a Internet para actualizar datos en tiempo real.

### 2. Limitaciones de Hardware en los Sensores:
- La precisión y el rendimiento del sistema dependen de la calidad y calibración de los sensores IoT utilizados.

### 3. Compatibilidad con Dispositivos:
- El sistema puede no ser completamente funcional en dispositivos con especificaciones bajas o navegadores desactualizados.

### 4. Gestión de Gran Volumen de Datos:
- Se necesita una infraestructura robusta para almacenar y procesar grandes cantidades de datos generados por sensores y registros del sistema.

### 5. Restricciones de Acceso por Roles:
- Algunas funcionalidades están limitadas según el tipo de usuario, lo que puede restringir ciertas acciones dentro del sistema.
