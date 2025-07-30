---
title: "Informe general del sistema - Agrosoft"
description: "Documento técnico versión 1.0 para el sistema Agrosoft."
pubDate: 2025-07-30
author: Lucy Ordoñez
---

## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA | RESPONSABLE | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|-------|-------------|----------------|-----------------------|
| 1.0     | 2024/07/30 | Lucy Orodñez| 2025/07/06 | Carlos Sterling |

---

## Tabla de Contenido

1. [Introducción](#1-introducción)  
2. [Justificación](#2-justificación)  
3. [Descripción](#3-descripción)  
4. [Objetivo](#4-objetivo)  
5. [Alcance](#5-alcance)  
6. [Características del Sistema](#6-características-del-sistema)  
7. [Arquitectura de Información](#7-arquitectura-de-información)  
8. [Funcionalidades](#8-funcionalidades)  
9. [Usuarios – Roles](#9-usuarios-roles)  
   9.1 [Administrador](#91-administrador)  
   9.2 [Aprendiz](#92-aprendiz)  
   9.3 [Pasante](#93-pasante)  
   9.4 [Instructor](#94-instructor)  
10. [Diagrama de Casos de Uso](#10-diagrama-de-casos-de-uso)  
    10.1 [General](#101-general)  
    10.2 [Específicos](#102-específicos)  
        10.2.1 [Módulo de Registro](#1021-módulo-de-registro)  
        10.2.2 [Módulo de Inicio de Sesión](#1022-módulo-de-inicio-de-sesión)  
        10.2.3 [Módulo de Lista de Usuarios](#1023-módulo-de-lista-de-usuarios)  
        10.2.4 [Módulo de Registro de Actividades](#1024-módulo-de-registro-de-actividades)  
        10.2.5 [Módulo de Registro de Insumos](#1025-módulo-de-registro-de-insumos)  
        10.2.6 [Módulo de Registro de Herramientas](#1026-módulo-de-registro-de-herramientas)  
        10.2.7 [Módulo de Registro de Sensores en Tiempo Real](#1027-módulo-de-registro-de-sensores-en-tiempo-real)  
        10.2.8 [Módulo de Registro de Cultivos](#1028-módulo-de-registro-de-cultivos)  
        10.2.9 [Módulo de Registro de Semilleros](#1029-módulo-de-registro-de-semilleros)  
        10.2.10 [Módulo de Registro de Lotes](#10210-módulo-de-registro-de-lotes)  
        10.2.11 [Módulo de Registro de Eras](#10211-módulo-de-registro-de-eras)  
        10.2.12 [Módulo de Registro de la Producción Obtenida](#10212-módulo-de-registro-de-la-producción-obtenida)  
        10.2.13 [Módulo de Registro de PEA (Plagas, Enfermedades y Arvenses)](#10213-módulo-de-registro-de-pea-plagas-enfermedades-y-arvenses)  
        10.2.14 [Módulo de Registro de Control Fitosanitario](#10214-módulo-de-registro-de-control-fitosanitario)  
        10.2.15 [Módulo de Registro de Fases Lunares](#10215-módulo-de-registro-de-fases-lunares)  
        10.2.16 [Módulo de Mapa Interactivo](#10216-módulo-de-mapa-interactivo)  
        10.2.17 [Módulo de Registro de Ventas](#10217-módulo-de-registro-de-ventas)  
11. [Historias de Usuario](#11-historias-de-usuario)  
12. [Diagrama de Clases](#12-diagrama-de-clases)

---

## 1. Introducción

El presente documento describe de forma general el sistema AgroSoft, una aplicación web desarrollada como herramienta tecnológica para optimizar la gestión agrícola en la unidad productiva PAE. El documento está dirigido a todas las partes interesadas en el proyecto, incluyendo desarrolladores, administradores, instructores y usuarios finales.
Su objetivo es ofrecer una visión global sobre el propósito, justificación, alcance y características clave del sistema, sirviendo como base para comprender el contexto funcional y técnico del desarrollo.


## 2. Justificación

En el contexto agrícola actual, donde la eficiencia, trazabilidad y sostenibilidad son factores clave, surge la necesidad de contar con herramientas digitales que respalden y mejoren los procesos productivos. AgroSoft se justifica como una solución tecnológica capaz de centralizar y sistematizar la información agrícola, facilitando la toma de decisiones informadas y la gestión eficiente de cultivos.

Este sistema tendrá un impacto positivo en los usuarios al permitir:
•	Un monitoreo en tiempo real de variables ambientales mediante sensores IoT.
•	Un control detallado del uso de insumos y herramientas.
•	Una trazabilidad completa del proceso agrícola, desde la siembra hasta la cosecha.
•	Una mejora en la productividad, reducción de pérdidas y optimización de recursos.

Se espera como resultado una mayor precisión en la gestión operativa, generación automática de reportes y una plataforma intuitiva que facilite el aprendizaje y uso por parte de aprendices, técnicos y administradores agrícolas.

## 3. Descripcción

AgroSoft es una aplicación web modular orientada a la gestión agrícola integral. Está compuesta por diversos módulos interconectados que abarcan desde el control de inventarios, actividades agrícolas, gestión de usuarios y análisis de datos ambientales, hasta el control fitosanitario y el registro financiero del cultivo.

Su enfoque principal es brindar a los usuarios una herramienta digital moderna y accesible, que les permita visualizar, registrar y analizar toda la información relevante del ciclo productivo agrícola. Al estar conectada a sensores mediante tecnología IoT, también proporciona datos en tiempo real que enriquecen la toma de decisiones.

AgroSoft se caracteriza por su interfaz amigable, adaptable a distintos dispositivos, y por su estructura escalable, permitiendo futuras mejoras y extensiones según las necesidades de la unidad productiva.


## 4. Objetivo

El objetivo general de AgroSoft es desarrollar un sistema de información agrícola que permita optimizar la gestión, monitoreo y trazabilidad de cultivos en la unidad productiva PAE, integrando tecnologías modernas como IoT, y facilitando el control de recursos, actividades y producción agrícola de forma eficiente y accesible.

## 5. Alcance

El alcance del sistema AgroSoft comprende el diseño, desarrollo e implementación de una aplicación web destinada a la gestión agrícola en la unidad productiva PAE. Este sistema integra múltiples funcionalidades, entre las cuales se incluyen:
•	Registro y seguimiento del ciclo de cultivo.
•	Gestión de usuarios, insumos y herramientas.
•	Control fitosanitario (PEA).
•	Monitoreo de condiciones ambientales mediante sensores IoT.
•	Generación de reportes analíticos y financieros.
•	Visualización de datos históricos y en tiempo real.

Proyectos asociados: El sistema se relaciona directamente con procesos de formación en tecnologías de la información, prácticas de agricultura inteligente y gestión ambiental dentro del programa de formación SENA.

Límites geográficos: La implementación inicial se centrará en la unidad productiva PAE, ubicada en el contexto regional del SENA. No obstante, la arquitectura del sistema está preparada para ser replicada o adaptada a otras unidades agrícolas o instituciones con características similares.

Alcance técnico: Esta primera versión del sistema no contempla automatización física del riego ni control remoto de hardware agrícola, aunque su diseño permite escalar hacia esas funcionalidades en futuras versiones.


## 6. Caracteristicas del sistema

El sistema **AgroSoft** ha sido diseñado como una solución web integral para la gestión agrícola de la unidad productiva **PAE**, enfocándose en la trazabilidad, monitoreo ambiental, control fitosanitario, inventario de insumos y herramientas, así como en la gestión financiera del cultivo. A continuación, se detallan las características técnicas y generales del sistema:

### Características Técnicas y Generales

- **Tipo de Aplicación**: Web responsive (compatible con dispositivos móviles, tablets y equipos de escritorio).  
- **Tecnología Base**:  
  - **Backend**: Node.js (Express.js)  
  - **Base de Datos**: PostgreSQL  
  - **Frontend**: React + Vite + TypeScript  
  - **Comunicación IoT**: Protocolo HTTP y MQTT (opcional), integración con dispositivos basados en ESP32.  
- **Versión Actual del Sistema**: 1.0  
- **Orientación de Uso**: Interfaz adaptable tanto en orientación vertical como horizontal.  
- **Compatibilidad de Dispositivos**:  
  - **Navegadores Compatibles**: Google Chrome, Mozilla Firefox, Microsoft Edge (últimas versiones).  
  - **Mínimo Recomendado**: Android 8.0+, iOS 12+, Windows 10+.  
  - **Pantallas Soportadas**: Teléfonos móviles y pantallas grandes.  
- **Soporte para Múltiples Densidades de Pantalla**:  
  El sistema está optimizado mediante diseño responsive, adaptándose a diferentes densidades de píxeles (mdpi, hdpi, xhdpi, xxhdpi), garantizando una experiencia visual coherente y accesible.  
- **Interfaz de Usuario**:  
  Moderna, intuitiva y accesible, con un enfoque en la experiencia del usuario para facilitar la navegación incluso a usuarios con conocimientos técnicos básicos.  
- **Seguridad**:  
  - Autenticación basada en roles (Administrador, Aprendiz, Pasante, Instructor).  
  - Manejo seguro de contraseñas mediante cifrado.  
  - Control de permisos por módulo.  
- **Escalabilidad**:  
  Pensado para futuras integraciones con módulos adicionales como predicción de cosechas, análisis mediante inteligencia artificial, o integración con sistemas ERP.  
- **Multiplataforma**:  
  El sistema puede ejecutarse desde cualquier dispositivo con acceso a Internet y un navegador moderno, sin requerir instalación.  
- **Actualizaciones Automáticas**:  
  El sistema se entrega como un producto web, permitiendo actualizaciones sin intervención del usuario final.

## 7. Arquitectura de información

La arquitectura de información del sistema AgroSoft representa la estructura de navegación y la organización jerárquica de las vistas disponibles en la aplicación. Este modelo facilita la comprensión del flujo de navegación del usuario, desde el ingreso al sistema hasta la interacción con cada uno de los módulos funcionales.

A continuación, se muestra un diagrama que refleja las relaciones entre las principales interfaces del sistema, permitiendo visualizar la forma en que están conectadas y organizadas las secciones como: gestión de usuarios, trazabilidad, monitoreo IoT, inventario, control fitosanitario, finanzas y generación de reportes.

![Diagrama de arquitectura de información de AgroSoft](/imgbasedatos/arquitectura.jpeg)

## 8. Funcionalidades

En esta sección se listan las funcionalidades del sistema **AgroSoft**, representando los requisitos funcionales de la aplicación. Las funcionalidades están organizadas por módulos para facilitar la comprensión de las capacidades del sistema. Cada funcionalidad incluye su tipo: **Esencial** (requerida para el funcionamiento básico), **Ideal** (deseable para mejorar la experiencia) u **Opcional** (adicional y no crítica).

### 8.1 Módulo de Usuarios

- **RF01: Iniciar Sesión**  
  El sistema ofrece un formulario interactivo con campos para **Correo** y **Contraseña**. Valida los datos ingresados para garantizar un acceso seguro al sistema.  
  *Tipo: Esencial*

- **RF02: Registro de Usuarios**  
  Permite registrar nuevos usuarios mediante un formulario con campos: **Tipo de Documento**, **Número de Documento**, **Nombre Completo**, **Teléfono**, **Correo Electrónico**, **Contraseña** y **Rol**. El rol determina los privilegios de acceso.  
  *Tipo: Esencial*

- **RF03: Listar Usuarios**  
  Muestra una lista detallada de usuarios registrados con su estado (**activo** o **inactivo**) y permite editar la información de cada usuario.  
  *Tipo: Esencial*

- **RF04: Editar y Eliminar Usuarios**  
  Solo los administradores pueden editar o eliminar usuarios, garantizando la seguridad e integridad de la información.  
  *Tipo: Esencial*

- **RF36: Asignación de Roles y Permisos**  
  Permite al administrador asignar roles (**administrador**, **instructor**, **pasante**, **operario**, **visitante**) y definir permisos de acceso a módulos o funcionalidades.  
  *Tipo: Esencial*

- **RF41: Generación de Reportes de Usuarios**  
  Genera reportes sobre el uso de la plataforma por parte de los aprendices, analizando actividad, satisfacción y problemas frecuentes para optimizar la experiencia de aprendizaje.  
  *Tipo: Ideal*

### 8.2 Módulo de IoT

- **RF11: Mostrar Información de Sensores en Tiempo Real**  
  Procesa y muestra datos en tiempo real de sensores, incluyendo:  
  - **Velocidad del viento** (km/h)  
  - **Temperatura** (°C)  
  - **Luz solar** (estado del cielo y porcentaje de luz)  
  - **Humedad de eras** (% de humedad en el suelo)  
  - **Humedad ambiente** (% de humedad en el aire)  
  - **Lluvia** (presencia e intensidad)  
  Los datos se presentan en cuadros independientes con iconos representativos.  
  *Tipo: Esencial*

- **RF12: Información de Humedad del Terreno**  
  Recopila y muestra en tiempo real datos de humedad del suelo mediante sensores IoT, facilitando la gestión eficiente del riego.  
  *Tipo: Esencial*

- **RF13: Información de Humedad Ambiente**  
  Muestra datos en tiempo real sobre la humedad ambiental recopilada por sensores IoT.  
  *Tipo: Esencial*

- **RF14: Información de Luminosidad**  
  Recopila y presenta datos en tiempo real sobre la luminosidad en el campo, obtenidos mediante sensores distribuidos.  
  *Tipo: Esencial*

- **RF15: Información de Lluvia**  
  Mide la cantidad, intensidad, frecuencia y duración de la lluvia mediante un pluviómetro, presentando los datos en tiempo real.  
  *Tipo: Esencial*

- **RF16: Información de Temperatura**  
  Mide y muestra la temperatura en las áreas de cultivo en tiempo real mediante sensores IoT.  
  *Tipo: Esencial*

- **RF17: Información de Velocidad y Dirección del Viento**  
  Captura y muestra en tiempo real la velocidad y dirección del viento mediante sensores, enviados a una plataforma en la nube.  
  *Tipo: Ideal*

- **RF18: Información de pH del Suelo**  
  Recopila y muestra lecturas de pH del suelo mediante sensores IoT, clave para gestionar la acidez o alcalinidad del suelo.  
  *Tipo: Esencial*

- **RF19: Monitoreo de Evapotranspiración**  
  Estima la evapotranspiración (ET) en las áreas de cultivo usando sensores y algoritmos, optimizando la gestión del riego.  
  *Tipo: Ideal*

- **RF20: Almacenamiento y Gestión Histórica de Datos**  
  Almacena los datos de sensores en una base de datos para consulta y análisis histórico, optimizando la detección de tendencias agrícolas.  
  *Tipo: Esencial*

- **RF38: Control de Arduinos**  
  Permite al usuario seleccionar, almacenar y alternar configuraciones predefinidas de software en microcontroladores, optimizando su funcionalidad.  
  *Tipo: Esencial*

- **RF43: Reporte de Datos de Sensores en Tiempo Real**  
  Genera reportes con datos en tiempo real de sensores (humedad, temperatura, viento, luminosidad, pH, pluviómetro) presentados mediante gráficas.  
  *Tipo: Esencial*

### 8.3 Módulo de Trazabilidad

- **RF21: Registrar, Listar y Editar Nombre y Tipo de Cultivo**  
  Permite registrar, listar y editar información sobre el nombre y tipo de cultivo para su gestión en el sistema.  
  *Tipo: Esencial*

- **RF22: Registro de Semilleros**  
  Registra información de semilleros mediante un formulario interactivo, incluyendo número de unidades, fecha de siembra y fecha estimada de salida a producción.  
  *Tipo: Esencial*

- **RF23: Registrar, Listar y Editar Lotes**  
  Permite registrar nuevos lotes, listar y editar la información de lotes existentes para garantizar la precisión de los datos.  
  *Tipo: Esencial*

- **RF24: Registrar, Listar y Editar Eras**  
  Optimiza el espacio de cultivo mediante el registro, listado y edición de eras en un lote, facilitando el mantenimiento de plantas.  
  *Tipo: Esencial*

- **RF25: Registrar, Listar y Editar Cultivos**  
  Permite registrar, listar y editar información clave de cultivos mediante un formulario, optimizando su gestión.  
  *Tipo: Esencial*

- **RF26: Registrar Actividades de Cultivos**  
  Registra nuevas actividades para cultivos, incluyendo nombre, descripción y fecha de creación, como referencia para los aprendices.  
  *Tipo: Esencial*

- **RF27: Asignar, Listar y Editar Actividades de Cultivos**  
  Permite a los instructores asignar actividades a cultivos, detallando lote, cultivo, actividad (riego, siembra, fertilización), descripción, fecha, personal, insumos, herramientas y estado.  
  *Tipo: Esencial*

- **RF28: Finalización de Actividades**  
  Permite cambiar el estado de una actividad completada, ingresando tiempo gastado, cantidad de insumo utilizado y nuevo estado, finalizando con un botón de actualización.  
  *Tipo: Esencial*

- **RF29: Registrar Producción Obtenida**  
  Registra la producción de un cultivo tras la cosecha, incluyendo cultivo recolectado, cantidad, unidad de medida, fecha y fotografía.  
  *Tipo: Esencial*

- **RF30: Registrar Plagas, Enfermedades y Arvenses**  
  Registra la fecha de observación, identificación del organismo, ubicación, nivel de daño, descripción, métodos de erradicación y comentarios para un control preciso.  
  *Tipo: Esencial*

- **RF31: Control Fitosanitario**  
  Permite registrar acciones de control fitosanitario para plagas o recuperación de cultivos, documentando medidas de eliminación y seguimiento.  
  *Tipo: Esencial*

- **RF44: Reporte de Actividades Realizadas**  
  Genera un reporte detallado de actividades realizadas en cada cultivo, facilitando la trazabilidad y el análisis de prácticas agrícolas.  
  *Tipo: Esencial*

- **RF45: Reporte de Controles Fitosanitarios**  
  Genera un reporte en PDF de los controles realizados para erradicar plagas, enfermedades o arvenses, permitiendo un seguimiento detallado.  
  *Tipo: Esencial*

### 8.4 Módulo de Inventario

- **RF05: Registrar Insumos Agrícolas**  
  Registra insumos necesarios para los cultivos y permite visualizar, editar o eliminar registros desde una lista interactiva.  
  *Tipo: Esencial*

- **RF06: Listar Insumos Registrados**  
  Muestra un listado de insumos con detalles completos, facilitando su consulta y gestión.  
  *Tipo: Esencial*

- **RF07: Actualizar Información de Insumos**  
  Permite actualizar la información de insumos registrados para mantener los datos precisos.  
  *Tipo: Esencial*

- **RF08: Registrar Herramientas Agrícolas**  
  Registra herramientas necesarias para la producción, permitiendo visualizar, editar o eliminar registros.  
  *Tipo: Ideal*

- **RF09: Listar Herramientas Registradas**  
  Muestra un listado de herramientas con detalles completos para su consulta y gestión.  
  *Tipo: Ideal*

- **RF10: Actualizar Información de Herramientas**  
  Permite actualizar la información de herramientas registradas, asegurando la precisión de los datos.  
  *Tipo: Ideal*

- **RF42: Reporte de Insumos Registrados**  
  Genera un reporte detallado de los insumos registrados, incluyendo nombre, cantidad, fecha de caducidad y otras características relevantes.  
  *Tipo: Esencial*

### 8.5 Módulo de Finanzas

- **RF37: Registrar y Actualizar Precio de Producto**  
  Registra el precio base de un producto (moneda, impuestos, vigencia) y permite actualizar precios de productos existentes.  
  *Tipo: Esencial*

- **RF39: Registro Detallado de Ventas**  
  Registra cada transacción de venta con detalles como fecha, producto, cantidad, ingresos y cliente, creando un historial completo.  
  *Tipo: Esencial*

- **RF40: Calcular y Mostrar Rentabilidad de Cultivos**  
  Calcula y muestra la rentabilidad de cada cultivo en porcentajes y valores absolutos, con opción de exportar informes en PDF o Excel.  
  *Tipo: Ideal*

- **RF46: Informe de Ingresos por Producto Vendido**  
  Genera un reporte detallado de ventas por producto, incluyendo unidades vendidas, ingresos totales y margen de ganancia.  
  *Tipo: Esencial*

### 8.6 Módulo de Calendario y Fases Lunares

- **RF32: Registrar y Editar Información de Fases Lunares**  
  Permite al administrador registrar o actualizar imágenes e información de fases lunares, incluyendo recomendaciones para siembra, riego, poda y fertilización.  
  *Tipo: Opcional*

- **RF33: Mostrar Influencia de Fases Lunares en Cultivos**  
  Muestra un calendario lunar interactivo con fases (nueva, cuarto creciente, llena, menguante), semáforo de actividades y detalles al seleccionar una fecha.  
  *Tipo: Opcional*

- **RF34: Recordatorios y Eventos en Calendario Interactivo**  
  Ofrece un calendario para registrar, visualizar y gestionar eventos agrícolas (siembra, fertilización, cosechas) con recordatorios automáticos y opciones de edición.  
  *Tipo: Ideal*

### 8.7 Módulo de Mapa

- **RF35: Mostrar Cultivos en un Mapa Interactivo**  
  Despliega un mapa interactivo con el historial de cada cultivo, mostrando detalles como riego y abono al seleccionar un sector específico.  
  *Tipo: Ideal*


## 9. Usuarios – Roles

En esta sección se describen los roles de los usuarios que interactúan con el sistema **AgroSoft**, detallando sus responsabilidades, permisos y funciones dentro de la plataforma. Los roles definidos son: **Administrador**, **Aprendiz**, **Pasante** e **Instructor**.

### 9.1 Administrador

Este usuario tiene control total del sistema, siendo el encargado de gestionar la plataforma en su totalidad. Posee acceso completo a todas las funcionalidades, incluyendo la administración de usuarios, configuración del sistema y supervisión de los diferentes módulos.

**Permisos y Funciones:**
- Crear, modificar y eliminar usuarios.
- Acceder a todos los módulos del sistema (**Usuario**, **IoT**, **Trazabilidad**, **Finanzas** e **Inventario**).
- Configurar parámetros y permisos dentro del sistema.
- Supervisar el correcto funcionamiento de la plataforma.

### 9.2 Aprendiz

El aprendiz es un usuario con acceso restringido, enfocado en el aprendizaje y la consulta de información relacionada con los cultivos y procesos agrícolas. No tiene permisos para modificar datos, limitándose a la visualización de información.

**Permisos y Funciones:**
- Acceso en modo **solo lectura** a los módulos del sistema.
- Visualización de datos en tiempo real (**sensores IoT**, **trazabilidad**, **inventario**, **finanzas**).
- Consultar reportes generados en la plataforma.

### 9.3 Pasante

El pasante tiene un rol más activo, contribuyendo en la gestión de procesos agrícolas mediante el registro y edición de información relevante. Tiene acceso limitado a ciertas funcionalidades, como los módulos financieros.

**Permisos y Funciones:**
- Registrar nuevos datos en los módulos de **Trazabilidad**, **IoT** e **Inventario**.
- Editar y actualizar información relacionada con los cultivos.
- Consultar reportes y métricas generadas en el sistema.
- Acceso limitado a módulos financieros (solo visualización).

### 9.4 Instructor

El instructor tiene un rol orientado a la formación y supervisión, con permisos similares a los del pasante, pero con la capacidad adicional de validar y corregir información ingresada por otros usuarios. No puede editar datos financieros.

**Permisos y Funciones:**
- Registrar, editar y supervisar información en los módulos de **Trazabilidad**, **IoT** e **Inventario**.
- Aprobar o corregir registros realizados por aprendices o pasantes.
- Consultar reportes y métricas generadas en el sistema.
- Visualización de datos financieros sin capacidad de edición.

## 10. Diagrama de Casos de Uso

Esta sección presenta los diagramas de casos de uso del sistema **AgroSoft**, que ilustran las interacciones entre los usuarios y las funcionalidades de la plataforma. Se divide en un diagrama general y diagramas específicos para cada módulo.

### 10.1 General

El diagrama general muestra una visión global de las interacciones entre los usuarios y los principales módulos del sistema.

![Diagrama general de casos de uso de AgroSoft](/imguml/casosuso.png)

### 10.2 Específicos

Los diagramas específicos detallan las interacciones de los usuarios con cada módulo funcional del sistema.

#### 10.2.1 Módulo de Registro

![Diagrama de casos de uso del módulo de registro](/imguml/registro.png)

#### 10.2.2 Módulo de Inicio de Sesión

![Diagrama de casos de uso del módulo de inicio de sesión](/imguml/iniciosesion.png)

#### 10.2.3 Módulo de Lista de Usuarios

![Diagrama de casos de uso del módulo de lista de usuarios](/imguml/lista.png)

#### 10.2.4 Módulo de Registro de Actividades

![Diagrama de casos de uso del módulo de registro de actividades](/imguml/actividad.png)

#### 10.2.5 Módulo de Registro de Insumos

![Diagrama de casos de uso del módulo de registro de insumos](/imguml/insumos.png)

#### 10.2.6 Módulo de Registro de Herramientas

![Diagrama de casos de uso del módulo de registro de herramientas]/imguml/herramientas.png)

#### 10.2.7 Módulo de Registro de Sensores en Tiempo Real

![Diagrama de casos de uso del módulo de registro de sensores en tiempo real](/imguml/sensores.png)

#### 10.2.8 Módulo de Registro de Cultivos

![Diagrama de casos de uso del módulo de registro de cultivos](/imguml/cultivos.png)

#### 10.2.9 Módulo de Registro de Semilleros

![Diagrama de casos de uso del módulo de registro de semilleros](/imguml/semilleros.png)

#### 10.2.10 Módulo de Registro de Lotes

![Diagrama de casos de uso del módulo de registro de lotes](/imguml/lotes.png)

#### 10.2.11 Módulo de Registro de Eras

![Diagrama de casos de uso del módulo de registro de eras](/imguml/eras.png)

#### 10.2.12 Módulo de Registro de la Producción Obtenida

![Diagrama de casos de uso del módulo de registro de la producción obtenida](/imguml/produccion.png)

#### 10.2.13 Módulo de Registro de PEA (Plagas, Enfermedades y Arvenses)

![Diagrama de casos de uso del módulo de registro de PEA](/imguml/pea.png)

#### 10.2.14 Módulo de Registro de Control Fitosanitario

![Diagrama de casos de uso del módulo de control fitosanitario](/imguml/fitosanitario.png)

#### 10.2.15 Módulo de Registro de Fases Lunares

![Diagrama de casos de uso del módulo de registro de fases lunares](/imguml/faseslunares.png)

#### 10.2.16 Módulo de Mapa Interactivo

![Diagrama de casos de uso del módulo de mapa interactivo](/imguml/mapa.png)

#### 10.2.17 Módulo de Registro de Ventas

![Diagrama de casos de uso del módulo de registro de ventas](/imguml/ventas.png)



## 11. Historias de Usuario

### Tabla de Historias de Usuario

|**ID Historia**|**HU 1**|**Nombre**|Ingreso al Sistema|**Peso**|5
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo iniciar sesión en la aplicación|
|**RESULTADO**|Para hacer uso de las funcionalidades del sistema.|
|**Flujo Normal**|1.	ingresa al sistema <br>2.	El sistema presenta la ventana de login  <br>3.	El usuario ingresa el número de identificación y contraseña <br>4.	El sistema valida la información y permite el ingreso asignando los permisos de usuario.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Ingreso exitoso|Si los datos son validos|Cuando se presione el botón de ingresar en el formulario de login|Se permitirá el ingreso al sistema y se mostrará el nombre del usuario logueado.|
|2|Ingreso fallido|Si los datos son inválidos|Cuando se presione el botón de ingresar en el formulario de login|Se presentará un mensaje de advertencia indicando que los datos son inválidos.|
|3|Ingreso fallido|Si el nombre de usuario es inválido|Cuando se presione el botón de ingresar en el formulario de login|Se presentará un mensaje de advertencia indicando que el nombre de usuario es inválido.|
|4|Ingreso fallido|Si la contraseña es invalida|Cuando se presione el botón de ingresar en el formulario de login|Se presentará un mensaje de advertencia indicando que la contraseña es inválida.|

--

|**ID Historia**|**HU 2**|**Nombre**|Registro de usuarios|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como administrador|
|**FUNCIONALIDAD**|Deseo registrar nuevos usuarios en el sistema proporcionando su tipo de documento, número de documento, nombre completo, teléfono, correo, contraseña y rol|
|**RESULTADO**|Para garantizar que los usuarios puedan acceder al sistema con los privilegios adecuados según su rol.|
|**Flujo Normal**|1.	El usuario ingresa al sistema. <br>2.	El sistema presenta la ventana de registro de usuarios.<br>3.	El usuario ingresa el tipo de documento, número de documento, nombre completo, teléfono, correo electrónico, contraseña y selecciona un rol.<br>4.	El sistema valida la información ingresada.<br>5.	Si los datos son válidos, el sistema registra al usuario y asigna los privilegios correspondientes.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si todos los datos son válidos|Cuando se presione el botón de registrar|El sistema creará el usuario y asignará los privilegios según el rol seleccionado.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si el correo ya está registrado|Si el correo ya está registrado|Se presentará un mensaje de advertencia indicando que el correo ya está en uso.|
|4|Registro fallido|Si el número de documento ya está registrado|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que el número de documento ya está registrado.|

--

|**ID Historia**|**HU 3**|**Nombre**|Listar usuarios|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como administrador|
|**FUNCIONALIDAD**|Deseo visualizar una lista de todos los usuarios registrados en el sistema|
|**RESULTADO**|Para gestionar y verificar el estado y la información de los usuarios de manera eficiente.|
|**Flujo Normal**|1.	El administrador ingresa al sistema.<br>2.	El administrador selecciona la opción de listar usuarios.<br>3.	El sistema muestra una lista con todos los usuarios registrados, incluyendo su estado (activo/inactivo).<br>4.	El administrador puede seleccionar un usuario para ver o editar su información.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Listado exitoso|Si existen usuarios registrados|Cuando se acceda a la sección de listar usuarios|El sistema mostrará una lista con los datos de los usuarios y su estado.|
|2|Listado vacío|Si no hay usuarios registrados|Cuando se acceda a la sección de listar usuarios|El sistema mostrará un mensaje indicando que no hay usuarios registrados.|
|3|Visualización de detalles|Si se selecciona un usuario|Cuando se haga clic en un usuario de la lista|El sistema mostrará los detalles completos del usuario seleccionado.|
|4|Acceso restringido|Si el usuario no es administrador|Cuando se intente acceder a la sección de listar usuarios|El sistema denegará el acceso y mostrará solo la información de él.|

--

|**ID Historia**|**HU 4**|**Nombre**|Editar usuarios|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como administrador|
|**FUNCIONALIDAD**|Deseo editar la información de los usuarios registrados|
|**RESULTADO**|Para mantener actualizada y segura la información de los usuarios en el sistema.|
|**Flujo Normal**|1.	El administrador ingresa al sistema.<br>2.	El administrador selecciona la opción de listar usuarios.<br>3.	El sistema muestra la lista de usuarios registrados.<br>4.	El administrador selecciona un usuario y elige la opción de editar.<br>5.	Para editar, el administrador actualiza los datos y guarda los cambios.<br>6.	El sistema valida y aplica los cambios del usuario.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Edición exitosa|Si los datos actualizados son válidos|Cuando se presione el botón de guardar cambios|El sistema actualizará la información del usuario.|
|2|Edición fallida|Si los datos actualizados son inválidos|Cuando se presione el botón de guardar cambios|El sistema mostrará un mensaje de advertencia indicando los datos inválidos.|
|3|Acceso restringido|Si el usuario no es administrador|Cuando se intente editar un usuario|El sistema denegará el acceso y mostrará un mensaje de error.|

--

|**ID Historia**|**HU 5**|**Nombre**|Registrar Insumos Agrícolas|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como administrador|
|**FUNCIONALIDAD**|Deseo registrar los insumos agrícolas utilizados en la producción de cultivos|
|**RESULTADO**|Para gestionar eficientemente los recursos necesarios para los cultivos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar insumos.<br>3.	El sistema presenta un formulario para ingresar los datos del insumo (nombre, tipo, cantidad, etc.).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra el insumo, mostrando una lista actualizada de insumos.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos del insumo son válidos|Cuando se presione el botón de registrar|El sistema registrará el insumo y lo añadirá a la lista de insumos.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|El sistema mostrará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si el insumo ya está registrado|Cuando se presione el botón de registrar|El sistema mostrará un mensaje de advertencia indicando que el insumo ya existe.|

--

|**ID Historia**|**HU 6**|**Nombre**|Listar Insumos Registrados|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como administrador|
|**FUNCIONALIDAD**|Deseo visualizar una lista de todos los insumos agrícolas registrados en el sistema|
|**RESULTADO**|Para consultar y gestionar de manera eficiente la información de los insumos disponibles.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de listar insumos.<br>3.	El sistema presenta una ventana con la lista de insumos registrados, incluyendo detalles como nombre, tipo y cantidad<br>4.	El sistema permite al usuario seleccionar un insumo para ver información detallada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Listado exitoso|Si existen insumos registrados|Cuando se acceda a la sección de listar insumos|Se mostrará una lista con los insumos registrados y sus detalles básicos.|
|2|Listado vacío|Si no hay insumos registrados|Cuando se acceda a la sección de listar insumos|Se presentará un mensaje indicando que no hay insumos registrados.|
|3|Visualización de detalles|Si se selecciona un insumo de la lista|Cuando se presione en un insumo|Se mostrará una ventana con la información detallada del insumo seleccionado.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la lista de insumos|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 7**|**Nombre**|Actualizar Insumos|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como administrador|
|**FUNCIONALIDAD**|Deseo actualizar la información de los insumos agrícolas registrados|
|**RESULTADO**|Para mantener los datos de los insumos actualizados y precisos en el sistema.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de listar insumos.<br>3.	El sistema presenta la lista de insumos registrados.<br>4.	El usuario selecciona un insumo y elige la opción de actualizar.<br>5.	El usuario modifica los datos en el formulario de actualización.<br>6.	El sistema valida la información y actualiza el registro del insumo.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Actualización exitosa|Si los datos modificados son válidos|Cuando se presione el botón de guardar cambios|Se actualizará la información del insumo en el sistema.|
|2|Actualización fallida|Si los datos modificados son inválidos|Cuando se presione el botón de guardar cambios|Se presentará un mensaje de advertencia indicando que los datos son inválidos.|
|3|Actualización fallida|Si algún campo obligatorio está vacío|Cuando se presione el botón de guardar cambios|Se presentará un mensaje de advertencia indicando que todos los campos obligatorios deben completarse.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente actualizar un insumo|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 8**|**Nombre**|Registrar Herramientas|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como administrador|
|**FUNCIONALIDAD**|Deseo registrar las herramientas agrícolas utilizadas en la producción de cultivos|
|**RESULTADO**|Para gestionar de manera eficiente los recursos necesarios para los cultivos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar herramientas.<br>3.	El sistema presenta un formulario para ingresar los datos de la herramienta (nombre, tipo, cantidad, etc.).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra la herramienta, mostrando una lista actualizada de herramientas.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos de la herramienta son válidos|Cuando se presione el botón de registrar|Se registrará la herramienta y se añadirá a la lista de herramientas.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si la herramienta ya está registrada|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que la herramienta ya existe.|

--

|**ID Historia**|**HU 9**|**Nombre**|Listar Herramientas
Registradas|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar una lista de todas las herramientas agrícolas registradas en el sistema|
|**RESULTADO**|Para consultar y gestionar de manera eficiente la información de las herramientas disponibles.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de listar herramientas.<br>3.	El sistema presenta una ventana con la lista de herramientas registradas, incluyendo detalles como nombre, tipo y cantidad.<br>4.	El sistema permite al usuario seleccionar una herramienta para ver información detallada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Listado exitoso|Si existen herramientas registradas|Cuando se acceda a la sección de listar herramientas|Se mostrará una lista con las herramientas registradas y sus detalles básicos.|
|2|Listado vacío|Si no hay herramientas registradas|Cuando se acceda a la sección de listar herramientas|Se presentará un mensaje indicando que no hay herramientas registradas.|
|3|Visualización de detalles|Si se selecciona una herramienta de la lista|Cuando se presione en una herramienta|Se mostrará una ventana con la información detallada de la herramienta seleccionada.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la lista de herramientas|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 10**|**Nombre**|Actualizar Herramientas|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo actualizar la información de las herramientas agrícolas registradas|
|**RESULTADO**|Para mantener los datos de las herramientas actualizados y precisos en el sistema.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de listar herramientas.<br>3.	El sistema presenta la lista de herramientas registradas.<br>4.	El usuario selecciona una herramienta y elige la opción de actualizar.<br>5.	El usuario modifica los datos en el formulario de actualización.<br>6.	El sistema valida la información y actualiza el registro de la herramienta.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Actualización exitosa|Si los datos modificados son válidos|Cuando se presione el botón de guardar cambios|Se actualizará la información de la herramienta en el sistema.|
|2|Actualización fallida|Si los datos modificados son inválidos|Cuando se presione el botón de guardar cambios|Se presentará un mensaje de advertencia indicando que los datos son inválidos.|
|3|Actualización fallida|Si algún campo obligatorio está vacío|Cuando se presione el botón de guardar cambios|Se presentará un mensaje de advertencia indicando que todos los campos obligatorios deben completarse.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente actualizar una herramienta|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 11**|**Nombre**|Mostrar en Tiempo Real Información de Sensores IoT|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar en tiempo real los datos de los sensores IoT instalados en el sector agrícola|
|**RESULTADO**|Para monitorear las condiciones ambientales y optimizar la gestión de los cultivos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de panel de sensores IoT.<br>3.	El sistema presenta un panel con los datos en tiempo real de los sensores (velocidad del viento, temperatura, luz solar, humedad de eras, humedad ambiente, lluvia).<br>4.	El sistema actualiza los datos automáticamente en tiempo real.<br>5.	El usuario puede interactuar con los cuadros para ver detalles adicionales de cada sensor.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización Cuando se acceda al panel de sensores|exitosa|Si los sensores están activos y envían datos|Se mostrará un panel con los datos en tiempo real de todos los sensores.|
|2|Visualización fallida|Si no hay datos disponibles|Cuando se acceda al panel de sensores|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Interacción con sensor|Si se selecciona un cuadro de sensor|Cuando se presione en un cuadro|Se mostrará información detallada del sensor seleccionado.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder al panel de sensores|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 12**|**Nombre**|Mostrar Información de Humedad del Terrenos|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar los datos de humedad del terreno recopilados por sensores IoT.|
|**RESULTADO**|Para monitorear y gestionar eficientemente la humedad del suelo en las áreas de cultivo.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de visualizar datos de humedad del terreno.<br>3.	El sistema presenta una ventana con los datos en tiempo real de la humedad del terreno.<br>4.	El sistema actualiza los datos automáticamente en tiempo real.<br>5.	El usuario puede consultar detalles específicos de una era seleccionada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa|Si los sensores de humedad están activos|Cuando se acceda a la sección de humedad del terreno|Se mostrará los datos en tiempo real de la humedad del terreno.|
|2|Visualización fallida|Si no hay datos disponibles|Cuando se acceda a la sección de humedad del terreno|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Detalles de era|Si se selecciona una era específica|Cuando se presione en una era|Se mostrará información detallada de la humedad en esa era.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la sección de humedad del terreno|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 13**|**Nombre**|Mostrar Información de Humedad Ambiente|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar los datos de humedad ambiente recopilados por sensores IoT.|
|**RESULTADO**|Para monitorear las condiciones de humedad en el entorno y optimizar la gestión de cultivos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de visualizar datos de humedad ambiente.<br>3.	El sistema presenta una ventana con los datos en tiempo real de la humedad ambiente.<br>4.	El sistema actualiza los datos automáticamente en tiempo real.<br>5.	El usuario puede consultar detalles específicos de una ubicación seleccionada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa|Si los sensores de humedad ambiente están activos|Cuando se acceda a la sección de humedad ambiente|Se mostrará los datos en tiempo real de la humedad ambiente.|
|2|Visualización fallida|Si no hay datos disponibles|Cuando se acceda a la sección de humedad ambiente|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Detalles de ubicación|Si se selecciona una ubicación específica|Cuando se presione en una ubicación|Se mostrará información detallada de la humedad ambiente en esa ubicación.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la sección de humedad ambiente|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 14**|**Nombre**|Mostrar Información de Luminosidad|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar los datos de luminosidad recopilados por sensores IoT.|
|**RESULTADO**|Para gestionar las condiciones de iluminación en el campo y optimizar la producción agrícola.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de visualizar datos de luminosidad.<br>3.	El sistema presenta una ventana con los datos en tiempo real de la luminosidad.<br>4.	El sistema actualiza los datos automáticamente en tiempo real.<br>5.	El usuario puede consultar detalles específicos de una ubicación seleccionada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa|Si los sensores de luminosidad están activos|Cuando se acceda a la sección de luminosidad|Se mostrará los datos en tiempo real de la luminosidad.|
|2|Visualización fallida|Si no hay datos disponibles|Cuando se acceda a la sección de luminosidad|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Detalles de ubicación|Si se selecciona una ubicación específica|Cuando se presione en una ubicación|Se mostrará información detallada de la luminosidad en esa ubicación|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la sección de luminosidad|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 15**|**Nombre**|Mostrar Información de Lluvia|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar los datos de lluvia recopilados por un pluviómetro|
|**RESULTADO**|Para monitorear la cantidad, intensidad, frecuencia y duración de la lluvia en las áreas de cultivo.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de visualizar datos de lluvia.<br>3.	El sistema presenta una ventana con los datos en tiempo real de la lluvia (cantidad, intensidad, etc.).<br>4.	El sistema actualiza los datos automáticamente en tiempo real.<br>5.	El usuario puede consultar detalles específicos de una ubicación seleccionada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa|Si el pluviómetro está activo|Cuando se acceda a la sección de lluvia|Se mostrará los datos en tiempo real de la lluvia.|
|2|Visualización fallida|Si no hay datos disponibles|Cuando se acceda a la sección de lluvia|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Detalles de ubicación|Si se selecciona una ubicación específica|Cuando se presione en una ubicación|Se mostrará información detallada de la lluvia en esa ubicación.|
|4|Acceso restringido|Acceso restringido|Cuando se intente acceder a la sección de lluvia|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 1**|**Nombre**|Mostrar Información de Temperatura|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar los datos de temperatura recopilados por sensores IoT|
|**RESULTADO**|Para monitorear las condiciones térmicas y optimizar la gestión de los recursos agrícolas.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de visualizar datos de temperatura.<br>3.	El sistema presenta una ventana con los datos en tiempo real de la temperatura en grados Celsius.<br>4.	El sistema actualiza los datos automáticamente en tiempo real.<br>5.	El usuario puede consultar detalles específicos de una ubicación seleccionada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa|Si los sensores de temperatura están activos|Cuando se acceda a la sección de temperatura|Se mostrará los datos en tiempo real de la temperatura.|
|2|Visualización fallida|Si no hay datos disponibles|Cuando se acceda a la sección de temperatura|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Detalles de ubicación|Si se selecciona una ubicación específica|Cuando se presione en una ubicación|Se mostrará información detallada de la temperatura en esa ubicación.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la sección de temperatura|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 1**|**Nombre**|Mostrar Información de Velocidad y Dirección del Viento|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar los datos de velocidad y dirección del viento recopilados por sensores IoT|
|**RESULTADO**|Para monitorear las condiciones del viento y optimizar la gestión de los cultivos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de visualizar datos de velocidad y dirección del viento.<br>3.	El sistema presenta una ventana con los datos en tiempo real de la velocidad (en km/h) y dirección del viento.<br>4.	El sistema actualiza los datos automáticamente en tiempo real.<br>5.	El usuario puede consultar detalles específicos de una ubicación seleccionada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa|Si los sensores de viento están activos|Cuando se acceda a la sección de velocidad y dirección del viento|Se mostrará los datos en tiempo real de la velocidad y dirección del viento.|
|2|Visualización fallida|Si no hay datos disponibles|Cuando se acceda a la sección de velocidad y dirección del viento|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Detalles de ubicación|Si se selecciona una ubicación específica|Cuando se presione en una ubicación|Se mostrará información detallada de la velocidad y dirección del viento en esa ubicación.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la sección de velocidad y dirección del viento|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 1**|**Nombre**|Mostrar Información de pH del Suelo|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar los datos de pH del suelo recopilados por sensores IoT|
|**RESULTADO**|Para gestionar la acidez o alcalinidad del suelo y optimizar la salud de los cultivos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de visualizar datos de pH del suelo.<br>3.	El sistema presenta una ventana con los datos en tiempo real del pH del suelo.<br>4.	El sistema actualiza los datos automáticamente en tiempo real.<br>5.	El usuario puede consultar detalles específicos de una era seleccionada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa|Si los sensores de pH están activos|Cuando se acceda a la sección de pH del suelo|Se mostrará los datos en tiempo real del pH del suelo.|
|2|Visualización fallida|Si no hay datos disponibles|Cuando se acceda a la sección de pH del suelo|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Detalles de era|Si se selecciona una era específica|Cuando se presione en una era|Se mostrará información detallada del pH en esa era.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la sección de pH del suelo|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 19**|**Nombre**|Monitorear EvapotranspiraciónRegistro de usuarios|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo monitorear la evapotranspiración en las áreas de cultivo
|**RESULTADO**|Para gestionar eficientemente el riego y optimizar el uso del agua en los cultivos.
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de monitorear evapotranspiración.<br>3.	El sistema presenta una ventana con los datos estimados de evapotranspiración basados en sensores y algoritmos.<br>4.	El sistema actualiza los datos automáticamente en tiempo real.<br>5.	El usuario puede consultar detalles específicos de una era seleccionada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa|Si los datos de evapotranspiración están disponibles|Cuando se acceda a la sección de evapotranspiración|Se mostrará los datos estimados de evapotranspiración en tiempo real.|
|2|Visualización fallida|Si no hay datos disponibles|Cuando se acceda a la sección de evapotranspiración|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Detalles de era|Si se selecciona una era específica|Cuando se presione en una era|Se mostrará información detallada de la evapotranspiración en esa era|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la sección de evapotranspiración|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 20**|**Nombre**|Almacenar y Gestionar Datos Históricos|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo almacenar y consultar los datos históricos capturados por los sensores.|
|**RESULTADO**|Para analizar tendencias y optimizar la gestión agrícola.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de consultar datos históricos.<br>3.	El sistema presenta una ventana con los datos históricos almacenados (humedad, temperatura, pH, etc.).<br>4.	El usuario filtra los datos por fecha, sensor o era.<br>5.	El sistema muestra los datos filtrados en una tabla o gráfica.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Consulta exitosa|Si hay datos históricos disponibles|Cuando se acceda a la sección de datos históricos|Se mostrará una tabla o gráfica con los datos históricos filtrados.|
|2|Consulta fallida|Si no hay datos históricos disponibles|Cuando se acceda a la sección de datos históricos|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Filtrado exitoso|Si los filtros son válidos|Cuando se apliquen filtros de fecha, sensor o era|Se mostrará los datos históricos correspondientes a los filtros seleccionados.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder a la sección de datos históricos|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 21**|**Nombre**|Registrar, Listar y Editar Nombre y Tipo de Cultivo|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar, listar y editar el nombre y tipo de cultivo|
|**RESULTADO**|Para gestionar eficientemente la información de los cultivos en el sistema.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar cultivo.<br>3.	El sistema presenta un formulario para ingresar el nombre y tipo de cultivo.<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra el cultivo, mostrando una lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos del cultivo son válidos|Cuando se presione el botón de registrar|Se registrará el cultivo y se añadirá a la lista de cultivos.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si el cultivo ya está registrado|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que el cultivo ya existe.|
|4|Visualización de lista|Si el registro es exitoso|Después de registrar el cultivo|Se mostrará la lista actualizada de cultivos registrados.|

--

|**ID Historia**|**HU 22**|**Nombre**| Registrar Nuevos Semilleros |**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar nuevos semilleros mediante un formulario interactivo|
|**RESULTADO**|Para gestionar la información de los semilleros y planificar la producción agrícola.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar semilleros.<br>3.	El sistema presenta un formulario para ingresar el número de unidades, fecha de siembra y fecha estimada de salida a producción.<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra el semillero, mostrando una lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos del semillero son válidos|Cuando se presione el botón de registrar|Se registrará el semillero y se añadirá a la lista de semilleros.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si las fechas son inválidas|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que las fechas son inválidas.|
|4|Visualización de lista|Si el registro es exitoso|Después de registrar el semillero|Se mostrará la lista actualizada de semilleros registrados.|

--

|**ID Historia**|**HU 23**|**Nombre**|Registrar, Listar y Editar Lotes|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar, listar y editar la información de los lotes|
|**RESULTADO**|Para gestionar eficientemente los lotes y mantener actualizada su información.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar lotes.<br>3.	El sistema presenta un formulario para ingresar los datos del lote (nombre, ubicación, etc.).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra el lote, mostrando una lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos del lote son válidos|Cuando se presione el botón de registrar|Se registrará el lote y se añadirá a la lista de lotes.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si el lote ya está registrado|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que el lote ya existe.|
|4|Visualización de lista|Si el registro es exitoso|Después de registrar el lote|Se mostrará la lista actualizada de lotes registrados.|

--

|**ID Historia**|**HU 24**|**Nombre**|Registro Eras|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar, listar y editar la información de las eras en un lote|
|**RESULTADO**|Para optimizar el espacio de cultivo y facilitar el mantenimiento de las plantas.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar eras en un lote.<br>3.	El sistema presenta un formulario para ingresar los datos de la era (nombre, dimensiones, lote asociado, etc.).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra la era, mostrando una lista actualizada de eras.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos de la era son válidos|Cuando se presione el botón de registrar|Se registrará la era y se añadirá a la lista de eras del lote.|
|2|Registro fallido|Si algún campo está vacío|Si algún campo está vacío|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si la era ya está registrada en el lote|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que la era ya existe.|
|4|Visualización de lista|Si el registro es exitoso|Después de registrar la era|Se mostrará la lista actualizada de eras registradas en el lote.|

--

|**ID Historia**|**HU 25**|**Nombre**|Registrar, Listar y Editar Nuevos Cultivos|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar, listar y editar nuevos cultivos mediante un formulario|
|**RESULTADO**|Para gestionar eficientemente la información de los cultivos en el sistema.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar cultivos.<br>3.	El sistema presenta un formulario para ingresar los datos del cultivo (nombre, tipo, fecha de siembra, etc.).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra el cultivo, mostrando una lista actualizada de cultivos.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos del cultivo son válidos|Cuando se presione el botón de registrar|Se registrará el cultivo y se añadirá a la lista de cultivos.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si el cultivo ya está registrado|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que el cultivo ya existe.|
|4|Visualización de lista|Si el registro es exitoso|Después de registrar el cultivo|Se mostrará la lista actualizada de cultivos registrados.|

--

|**ID Historia**|**HU 26**|**Nombre**|Registrar, Listar y Editar Actividades|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar, listar y editar actividades a realizar en los cultivos|
|**RESULTADO**|Para planificar y gestionar las tareas necesarias para el mantenimiento de los cultivos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar actividades de cultivos.<br>3.	El sistema presenta un formulario para ingresar los datos de la actividad (nombre, descripción, fecha de creación).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra la actividad, mostrando una lista actualizada de actividades.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos de la actividad son válidos|Cuando se presione el botón de registrar|Se registrará la actividad y se añadirá a la lista de actividades.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si la actividad ya está registrada |Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que la actividad ya existe.|

--

|**ID Historia**|**HU 2**|**Nombre**|Asignar, Listar y Editar las Actividades|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo asignar, listar y editar actividades ya registradas para un cultivo|
|**RESULTADO**|Para gestionar las tareas específicas asignadas a los cultivos, incluyendo insumos, herramientas y personal.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de asignar actividades a cultivos.<br>3.	El sistema presenta un formulario para ingresar los datos de la asignación (lote, cultivo, actividad, descripción, fecha, personal, insumos, herramientas, estado).<br>4.	El usuario completa el formulario y confirma la asignación.<br>5.	El sistema valida la información y registra la asignación, mostrando una lista actualizada de actividades asignadas.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Asignación exitosa|Si los datos de la asignación son válidos|Cuando se presione el botón de asignar|Se registrará la asignación y se añadirá a la lista de actividades asignadas.|
|2|Asignación fallida|Si algún campo está vacío|Cuando se presione el botón de asignar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Asignación fallida|Si la actividad ya está asignada al cultivo|Cuando se presione el botón de asignar|Se presentará un mensaje de advertencia indicando que la actividad ya está asignada.|
|4|Visualización de lista|Si la asignación es exitosa|Después de asignar la actividad|Se mostrará la lista actualizada de actividades asignadas.|

--

|**ID Historia**|**HU 1**|**Nombre**|Dar Finalización a una Actividad Realizada|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo dar por finalizada una actividad asignada, actualizando su estado|
|**RESULTADO**|Para registrar el tiempo, insumos utilizados y el estado final de la actividad.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de listar actividades asignadas.<br>3.	El sistema presenta una lista de actividades asignadas.<br>4.	El usuario selecciona una actividad y elige la opción de finalizar.<br>5.	El usuario ingresa el tiempo gastado (en minutos), la cantidad de insumos utilizados y el nuevo estado.<br>6.	El sistema valida la información y finaliza la actividad.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Finalización exitosa|Si los datos ingresados son válidos|Cuando se presione el botón de finalizar actividad|Se actualizará el estado de la actividad a finalizada.|
|2|Finalización fallida|Si algún campo está vacío|Cuando se presione el botón de finalizar actividad|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Finalización fallida|Si los datos ingresados son inválidos|Cuando se presione el botón de finalizar actividad|Se presentará un mensaje de advertencia indicando que los datos son inválidos.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente finalizar una actividad|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 29**|**Nombre**|Registrar la Producción Obtenida de un Cultivo|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar la producción obtenida de un cultivo tras la cosecha|
|**RESULTADO**|Para documentar la cantidad recolectada y mantener un registro de la producción agrícola.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar producción de cultivos.<br>3.	El sistema presenta un formulario para ingresar los datos de la producción (cultivo, cantidad, unidad de medida, fecha, fotografía).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra la producción, mostrando una lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos de la producción son válidos|Cuando se presione el botón de registrar|Se registrará la producción y se añadirá a la lista de producciones.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si la fotografía no es válida|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que la fotografía es inválida.|
|4|Visualización de lista|Si el registro es exitoso|Después de registrar la producción|Se mostrará la lista actualizada de producciones registradas.|

--

|**ID Historia**|**HU 30**|**Nombre**|Registrar Plagas, Enfermedades y Arvenses que Afectan los Cultivos|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar las plagas, enfermedades y arvenses que afectan los cultivos|
|**RESULTADO**|Para llevar un control preciso de las amenazas y documentar las acciones de erradicación.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar plagas, enfermedades o arvenses.<br>3.	El sistema presenta un formulario para ingresar los datos (fecha, nombre científico y común, ubicación, nivel de daño, descripción, métodos de erradicación).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra la amenaza, mostrando una lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos de la amenaza son válidos|Cuando se presione el botón de registrar|Se registrará la amenaza y se añadirá a la lista de registros.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si la amenaza ya está registrada para el cultivo |Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que la amenaza ya existe. |
|4|Visualización de lista |Si el registro es exitoso|Después de registrar la amenaza|Se mostrará la lista actualizada de amenazas registradas.|

--

|**ID Historia**|**HU 31**|**Nombre**|Llevar el Control Fitosanitario de un Cultivo|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar y gestionar las acciones de control fitosanitario para un cultivo|
|**RESULTADO**|Para documentar las medidas de eliminación de plagas o recuperación del cultivo.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de control fitosanitario.<br>3.	El sistema presenta un formulario para ingresar los datos de las medidas (plaga/enfermedad, acciones realizadas, fecha, comentarios).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra las medidas, mostrando una lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos de las medidas son válidos|Cuando se presione el botón de registrar|Se registrará las medidas y se añadirá a la lista de controles fitosanitarios.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si las medidas ya están registradas para la plaga |Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que las medidas ya existen.|

--

|**ID Historia**|**HU 32**|**Nombre**|Registrar y Editar Información sobre las Fases Lunares|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar y editar información sobre las fases lunares, incluyendo imágenes y recomendaciones|
|**RESULTADO**|Para proporcionar guías sobre siembra, riego, poda y fertilización según las fases lunares.|
|**Flujo Normal**|1.	El administrador ingresa al sistema.<br>2.	El administrador selecciona la opción de registrar fases lunares.<br>3.	El sistema presenta un formulario para ingresar los datos de la fase lunar (nombre, fecha, recomendaciones, imagen).<br>4.	El administrador completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra la fase lunar, mostrando una lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos de la fase lunar son válidos|Cuando se presione el botón de registrar|Se registrará la fase lunar y se añadirá a la lista de fases lunares.|
|2|Registro fallido |Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si la fase lunar ya está registrada para la fecha |Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que la fase lunar ya existe.|
|4|Visualización de lista|Si el registro es exitoso|Después de registrar la fase lunar |Se mostrará la lista actualizada de fases lunares registradas.|

--

|**ID Historia**|**HU 33**|**Nombre**|Mostrar Información sobre la Influencia de las Fases Lunares en los Cultivos|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar información sobre cómo influyen las fases lunares en los cultivos|
|**RESULTADO**|Para tomar decisiones informadas sobre siembra, riego, poda y fertilización.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de consultar fases lunares.<br>3.	El sistema presenta un calendario lunar con las fases (nueva, cuarto creciente, llena, menguante).<br>4.	El usuario selecciona una fecha en el calendario.<br>5.	El sistema muestra información relevante, recomendaciones y fotos asociadas a la fase lunar seleccionada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa |Si hay datos de fases lunares disponibles|Cuando se acceda al calendario lunar|Se mostrará el calendario con las fases lunares y sus detalles.|
|2|Visualización fallida|Si no hay datos disponibles |Cuando se acceda al calendario lunar|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Detalles de fase|Si se selecciona una fecha|Cuando se presione en una fecha|Se mostrará información detallada de la fase lunar, incluyendo recomendaciones y fotos.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder al calendario lunar|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--


|**ID Historia**|**HU 34**|**Nombre**|Gestionar Recordatorios y Eventos en un Calendario Interactivo|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar, visualizar y gestionar eventos agrícolas en un calendario interactivo|
|**RESULTADO**|Para planificar y recibir recordatorios de actividades como siembra, fertilización y cosechas.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de calendario interactivo.<br>3.	El sistema presenta un calendario con eventos registrados.<br>4.	El usuario selecciona la opción de registrar un nuevo evento, completando los datos (fecha, descripción, categoría).<br>5.	El sistema valida la información y registra el evento, actualizando el calendario.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos del evento son válidos|Cuando se presione el botón de registrar evento|Se registrará el evento y se mostrará en el calendario.
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar evento|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Visualización de eventos|Si hay eventos registrados|Cuando se acceda al calendario|Se mostrará el calendario con los eventos programados.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente registrar un evento|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--


|**ID Historia**|**HU 35**|**Nombre**|Mostrar Cultivos con Descripción en un Mapa Interactivo|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo visualizar un mapa interactivo con los cultivos y su historial|
|**RESULTADO**|Para consultar información detallada de cada cultivo, como riego y abono, en un sector específico.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de visualizar mapa de cultivos.<br>3.	El sistema presenta un mapa interactivo con los cultivos registrados.<br>4.	El usuario selecciona un sector o cultivo en el mapa.<br>5.	El sistema muestra el historial del cultivo seleccionado (riego, abono, etc.).|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Visualización exitosa|Si hay cultivos registrados|Cuando se acceda al mapa|Se mostrará el mapa con los cultivos y sus ubicaciones.|
|2|Visualización fallida|Si no hay cultivos registrados|Cuando se acceda al mapa|Se presentará un mensaje indicando que no hay cultivos disponibles.|
|3|Detalles de cultivo|Si se selecciona un cultivo|Cuando se presione en un cultivo|Se mostrará el historial detallado del cultivo seleccionado.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente acceder al mapa|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 36**|**Nombre**|Mostrar Cultivos con Descripción en un Mapa Interactivo|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo asignar roles y permisos a los usuarios.|
|**RESULTADO**|Para definir el acceso a módulos y funcionalidades según el rol de cada usuario.|
|**Flujo Normal**|1.	El administrador ingresa al sistema.<br>2.	El administrador selecciona la opción de gestionar roles y permisos.<br>3.	El sistema presenta una lista de usuarios registrados.<br>4.	El administrador selecciona un usuario y asigna un rol (administrador, instructor, etc.) y permisos.<br>5.	El sistema valida la información y actualiza los roles y permisos del usuario.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Asignación exitosa|Si los datos de rol y permisos son válidos|Cuando se presione el botón de guardar|Se asignará el rol y permisos al usuario seleccionado.|
|2|Asignación fallida|Si no se selecciona un rol|Cuando se presione el botón de guardar|Se presentará un mensaje de advertencia indicando que el rol es obligatorio|
|3|Visualización de lista|Si hay usuarios registrados|Cuando se acceda a la sección de roles|Se mostrará la lista de usuarios con sus roles actuales.|
|4|Acceso restringido|Si el usuario no es administrador|Cuando se intente asignar roles|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 37**|**Nombre**|Registrar y Actualizar el Precio de un Producto|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar y actualizar el precio de los productos|
|**RESULTADO**|Para mantener actualizada la información de precios, incluyendo moneda e impuestos.|
|**Flujo Normal**|1.	El administrador ingresa al sistema.<br>2.	El administrador selecciona la opción de registrar precio de producto.<br>3.	El sistema presenta un formulario para ingresar los datos del precio (producto, precio base, moneda, impuestos, vigencia).<br>4.	El administrador completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra o actualiza el precio del producto.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos del precio son válidos|Cuando se presione el botón de registrar|Se registrará o actualizará el precio del producto.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si el precio es inválido|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que el precio es inválido.|
|4|Acceso restringido|Si el usuario no es administrador|Cuando se intente registrar un precio|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 38**|**Nombre**|Llevar el Control de Arduino|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo gestionar configuraciones predefinidas de software en microcontroladores Arduino |
|**RESULTADO**|Para optimizar la flexibilidad y funcionalidad de los dispositivos en el sistema agrícola.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de control de los Arduinos.<br>3.	El sistema presenta una lista de configuraciones disponibles para los microcontroladores.<br>4.	El usuario selecciona o crea una configuración, especificando parámetros (software, sensores, etc.).<br>5.	El sistema valida la información y aplica o guarda la configuración al Arduino.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Configuración exitosa|Si los parámetros son válidos|Cuando se presione el botón de aplicar configuración|Se aplicará la configuración al Arduino seleccionado.|
|2|Configuración fallida|Si algún parámetro está vacío|Cuando se presione el botón de aplicar configuración|Se presentará un mensaje de advertencia indicando que todos los parámetros son obligatorios.|
|3|Visualización de lista|Si el usuario no tiene permisos|Cuando se intente configurar un Arduino|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 39**|**Nombre**|Registrar Detalles de Cada Venta|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo registrar los detalles de cada transacción de venta|
|**RESULTADO**|Para mantener un historial completo de operaciones comerciales y gestionar la cartera de clientes.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de registrar venta.<br>3.	El sistema presenta un formulario para ingresar los datos de la venta (fecha, producto, cantidad, ingresos, cliente).<br>4.	El usuario completa el formulario y confirma el registro.<br>5.	El sistema valida la información y registra la venta, mostrando una lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Registro exitoso|Si los datos de la venta son válidos|Cuando se presione el botón de registrar|Se registrará la venta y se añadirá a la lista de ventas.|
|2|Registro fallido|Si algún campo está vacío|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que todos los campos son obligatorios.|
|3|Registro fallido|Si los datos de la venta son inválidos|Cuando se presione el botón de registrar|Se presentará un mensaje de advertencia indicando que los datos son inválidos.|
|4|Visualización de lista|Si el registro es exitoso|Después de registrar la venta|Se mostrará la lista actualizada de ventas registradas.|

--

|**ID Historia**|**HU 40**|**Nombre**|Calcular y Mostrar la Rentabilidad de Cada Cultivo|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo calcular y visualizar la rentabilidad de cada cultivo registrado|
|**RESULTADO**|Para analizar los ingresos y egresos y tomar decisiones estratégicas en la gestión agrícola.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de calcular rentabilidad de cultivos.<br>3.	El sistema presenta una lista de cultivos registrados.<br>4.	El usuario selecciona un cultivo o bancal para analizar.<br>5.	El sistema calcula la rentabilidad (ingresos vs. egresos) y muestra los resultados en porcentajes y valores absolutos, con opción de exportar en PDF o Excel.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Cálculo exitoso|Si hay datos de ingresos y egresos disponibles|Cuando se seleccione un cultivo|Se mostrará la rentabilidad en porcentajes y valores absolutos.|
|2|Cálculo fallido|Si no hay datos disponibles|Cuando se seleccione un cultivo|Se presentará un mensaje indicando que no hay datos suficientes.|
|3|Exportación exitosa|Si se solicita exportar el informe|Cuando se presione el botón de exportar|Se generará un archivo PDF o Excel con los datos de rentabilidad.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente calcular rentabilidad|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 41|**|**Nombre**|Generar Reportes de Actividades Realizadas|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo generar reportes de las actividades realizadas en un cultivo|
|**RESULTADO**|Para analizar el progreso y documentar las tareas ejecutadas.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de generar reportes de actividades.<br>3.	El sistema presenta un formulario para filtrar actividades por cultivo, fecha o estado.<br>4.	El usuario completa los filtros y solicita el reporte.<br>5.	El sistema genera el reporte, mostrando los resultados en pantalla con opción de exportar en PDF o Excel.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Generación exitosa|Si hay actividades registradas|Cuando se solicite el reporte|Se mostrará un reporte con las actividades filtradas.|
|2|Generación fallida|Si no hay actividades para los filtros seleccionados|Cuando se solicite el reporte|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Exportación exitosa|Si se solicita exportar el reporte|Cuando se presione el botón de exportar|Se generará un archivo PDF o Excel con el reporte.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente generar un reporte|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción|

--

|**ID Historia**|**HU 42**|**Nombre**|Gestionar el Inventario de Insumos|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo gestionar el inventario de insumos agrícolas|
|**RESULTADO**|Para garantizar la disponibilidad de insumos y optimizar su uso en los cultivos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de gestionar inventario de insumos.<br>3.	El sistema presenta una lista de insumos con sus cantidades actuales.<br>4.	El usuario selecciona un insumo para actualizar su cantidad o registrar un nuevo ingreso/egreso.<br>5.	El sistema valida la información y actualiza el inventario, mostrando la lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Actualización exitosa|Si los datos de inventario son válidos|Cuando se presione el botón de actualizar|Se actualizará la cantidad del insumo en el inventario
|2|Actualización fallida|Si los datos ingresados son inválidos|Cuando se presione el botón de actualizar|Se presentará un mensaje de advertencia indicando que los datos son inválidos.|
|3|Visualización de lista|Si hay insumos registrados|Cuando se acceda a la sección de inventario|Se mostrará la lista de insumos con sus cantidades actuales.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente gestionar el inventario|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 43**|**Nombre**|Gestionar el Inventario de Herramientas|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo gestionar el inventario de herramientas agrícolas|
|**RESULTADO**|Para garantizar la disponibilidad de herramientas y optimizar su uso en los cultivos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de gestionar inventario de herramientas.<br>3.	El sistema presenta una lista de herramientas con sus cantidades y estados actuales.<br>4.	El usuario selecciona una herramienta para actualizar su cantidad, estado o registrar un nuevo ingreso/egreso.<br>5.	El sistema valida la información y actualiza el inventario, mostrando la lista actualizada.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Actualización exitosa|Si los datos de inventario son válidos|Cuando se presione el botón de actualizar|Se actualizará la cantidad o estado de la herramienta en el inventario.|
|2|Actualización fallida|Si los datos ingresados son inválidos|Cuando se presione el botón de actualizar|Se presentará un mensaje de advertencia indicando que los datos son inválidos.|
|3|Visualización de lista|Si hay herramientas registradas|Cuando se acceda a la sección de inventario|Se mostrará la lista de herramientas con sus cantidades y estados actuales.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente gestionar el inventario|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 44**|**Nombre**|Generar Informes de Producción|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo generar informes detallados de producción agrícola|
|**RESULTADO**|Para analizar la cantidad producida por cultivo, lote o era, y exportar los datos.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de generar informes de producción<br>3.	El sistema presenta un formulario para filtrar por cultivo, lote, era o fecha.<br>4.	El usuario completa los filtros y solicita el informe.<br>5.	El sistema genera el informe, mostrando los resultados en pantalla con opción de exportar en PDF o Excel.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Generación exitosa|Si hay datos de producción disponibles |Cuando se solicite el informe|Se mostrará un informe con los datos filtrados.|
|2|Generación fallida|Si no hay datos para los filtros seleccionados|Cuando se solicite el informe|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Exportación exitosa|Si se solicita exportar el informe|Cuando se presione el botón de exportar|Se generará un archivo PDF o Excel con el informe.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente generar un informe|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 45**|**Nombre**|Generar Informes de Ventas|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo generar informes detallados de las ventas realizadas|
|**RESULTADO**|Para analizar las transacciones comerciales y gestionar la cartera de clientes.|
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de generar informes de ventas.<br>3.	El sistema presenta un formulario para filtrar por producto, cliente, fecha o monto.<br>4.	El usuario completa los filtros y solicita el informe.<br>5.	El sistema genera el informe, mostrando los resultados en pantalla con opción de exportar en PDF o Excel.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Generación exitosa|Si hay datos de ventas disponibles|Cuando se solicite el informe|Se mostrará un informe con las ventas filtradas.|
|2|Generación fallida|Si no hay datos para los filtros seleccionados|Cuando se solicite el informe|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Exportación exitosa|Si se solicita exportar el informe|Cuando se presione el botón de exportar|Se generará un archivo PDF o Excel con el informe.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente generar un informe|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

|**ID Historia**|**HU 45**|**Nombre**|Generar Informes de Rentabilidad|**Peso**|5|
|----------------|-------|----------|-------------------|---------|---|
|**HISTORIA**|
|**ROL**|Yo como usuario|
|**FUNCIONALIDAD**|Deseo generar informes detallados de la rentabilidad de los cultivos|
|**RESULTADO**|Para evaluar el rendimiento financiero y tomar decisiones estratégicas.|.
|**Flujo Normal**|1.	El usuario ingresa al sistema.<br>2.	El usuario selecciona la opción de generar informes de rentabilidad.<br>3.	El sistema presenta un formulario para filtrar por cultivo, lote, era o fecha.<br>4.	El usuario completa los filtros y solicita el informe.<br>5.	El sistema genera el informe, mostrando los resultados en pantalla con opción de exportar en PDF o Excel.|
|**CRITERIOS DE ACEPTACIÓN**|
|**#**|**Criterio**|**Condición**|**Acción**|**Resultado**|
|1|Generación exitosa|Si hay datos de rentabilidad disponibles|Cuando se solicite el informe|Se mostrará un informe con los datos de rentabilidad filtrados.|
|2|Generación fallida|Si no hay datos para los filtros seleccionados|Cuando se solicite el informe|Se presentará un mensaje indicando que no hay datos disponibles.|
|3|Exportación exitosa|Si se solicita exportar el informe|Cuando se presione el botón de exportar|Se generará un archivo PDF o Excel con el informe.|
|4|Acceso restringido|Si el usuario no tiene permisos|Cuando se intente generar un informe|Se presentará un mensaje de advertencia indicando que no tiene permisos para esta acción.|

--

## 12. Diagrama de clases
![Diagrama de clases](/imguml/clases.png)