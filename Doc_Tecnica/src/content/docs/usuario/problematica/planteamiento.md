---
title: "Planteamiento del Problema - Agrosoft"
description: "Documento técnico versión 1.0 para el sistema Agrosoft."
pubDate: 2024-10-09
author: Dilson Chimborazo
---


## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA | RESPONSABLE | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|-------|-------------|----------------|-----------------------|
| 1.0     | 2024/10/09 | Dilson Chimborazo | 2024/10/09 | Carlos Sterling |

---

## CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR

| VERSIÓN | MODIFICACIÓN RESPECTO VERSIÓN ANTERIOR        |
|---------|-----------------------------------------------|
|    1    | Modificacion en todo el archivo por escritura |
|    2    | Actualizacion del archivo                     |

---

## Tabla de contenido

1. [Introducción](#1-introducción)  
   1.1 [Propósito](#11-propósito)  
   1.2 [Alcance](#12-alcance)  
   1.3 [Definiciones, Acrónimos y Abreviaturas](#13-definiciones-acrónimos-y-abreviaturas)  
   1.4 [Responsables e involucrados](#14-responsables-e-involucrados)  
   1.5 [Referencias](#15-referencias-bibliografía-o-webgrafía)  
2. [Descripción General](#2-descripción-general)  
3. [Situación Actual](#3-situación-actual)  
4. [Situación Esperada](#4-situación-esperada)  
5. [Justificación](#5-justificación)  
6. [Observaciones](#6-observaciones)  

---

## 1. Introducción

El sistema Agrosoft es una solución integral diseñada para optimizar la gestión de cultivos en el Centro de Formación Agropecuario Yamboró del Servicio Nacional de Aprendizaje (SENA).
Esta plataforma combina una aplicación móvil y web con un módulo de hardware basado en el microcontrolador ESP32 y una red de sensores para monitorear en tiempo real variables ambientales críticas, como humedad del suelo, humedad relativa del aire, temperatura, intensidad lumínica, velocidad y dirección del viento. Agrosoft permite a aprendices y productores agrícolas realizar un seguimiento detallado de los cultivos, implementar prácticas de trazabilidad y tomar decisiones basadas en datos para maximizar el rendimiento y promover la sostenibilidad en la producción agrícola


### 1.1 Propósito

Este documento tiene como objetivo definir el planteamiento del problema que aborda Agrosoft, detallando las necesidades identificadas, la situación actual, la solución propuesta y su justificación técnica. La plataforma busca proporcionar herramientas avanzadas de Internet de las cosas (IoT) para automatizar la recolección, almacenamiento y análisis de datos ambientales, permitiendo a los usuarios registrar y monitorear el estado de los cultivos, configurar alertas personalizadas y garantizar la trazabilidad de cada cultivo registrado, desde la siembra hasta la cosecha.

### 1.2 Alcance

El proyecto abarca el desarrollo de una plataforma híbrida (web) que integra un sistema IoT para la gestión de cultivos en el área de Producción Agropecuaria Ecológica (PAE) del SENA Yamboró. Las funcionalidades principales incluyen:

   • Recolección de datos en tiempo real mediante sensores conectados al ESP32.  
   • Visualización de datos ambientales (humedad del suelo, humedad relativa, temperatura, luminosidad, velocidad y dirección del viento).  
   • Configuración de alertas automáticas para condiciones críticas, como necesidades de riego o
   umbrales ambientales.  
   • Registro y trazabilidad de cultivos, permitiendo un seguimiento detallado de su ciclo de vida.  
   • Almacenamiento de datos en una base de datos centralizada para análisis históricos.  

La plataforma será accesible desde cualquier ubicación con conexión a Internet, utilizando tecnologías escalables que permitan futuras expansiones, como la integración de nuevos sensores o módulos analíticos. El sistema se centra en las funcionalidades descritas, con un enfoque inicial en el contexto del SENA Yamboró, pero diseñado para ser adaptable a otros entornos agrícolas.


### 1.3 Definiciones, Acrónimos y Abreviaturas

ESP32: Microcontrolador de bajo costo con conectividad Wi-Fi y Bluetooth, utilizado como
núcleo del sistema IoT.

**IoT**: Internet de las Cosas, red de dispositivos físicos interconectados para recopilar y compartir datos.  
**Sensor de Humedad del Suelo**: Dispositivo capacitivo (ej. FC-28) para medir el contenido de agua en el suelo.  
**Sensor de Humedad Relativa**: Sensor (ej. DHT22) para medir el porcentaje de humedad en el aire.  
**Sensor de Temperatura**: Dispositivo (ej. DHT22) para medir la temperatura ambiental.  
**Sensor de Luminosidad**: Sensor (ej. TSL2561) para medir la intensidad lumínica en lux.  
**Sensor de Viento**: Combinación de anemómetro y veleta para medir velocidad y dirección del viento.  
**Trazabilidad**: Capacidad de rastrear el historial, ubicación y estado de un cultivo a lo largo de su ciclo de vida.  
**Riego Automatizado**: Sistema que activa o desactiva el riego según datos de sensores y umbrales predefinidos.  
**API RESTfull**: Interfaz de programación de aplicaciones para la comunicación entre el frontend y el backend.  


### 1.4 Responsables e involucrados

| Nombre              | Tipo         | Rol            |
|---------------------|--------------|----------------|
| Dilson Chimborazo   | Aprendiz     | Líder y desarrollador |
| Lucy Ordoñez        | Aprendiz     | Desarrollador  |
| Francisco Burbano   | Aprendiz     | Desarrollador  |
| Juan David Bolaños  | Aprendiz     | Desarrollador  |
| Wilson Samboni      | Aprendiz     | Desarrollador  |
| Xiomara Sabi        | Aprendiz     | Desarrollador  |
| Yanira Jiménez      | Aprendiz     | Desarrollador  |

### 1.5 Referencias (bibliografía o webgrafía)

- Liu, X., Zhao, Z., & Rezaeipanah, A. (2025). Intelligent and automatic irrigation system based on Internet of Things using fuzzy control technology. Scientific Reports, 15, 14577. https://doi.org/10.1038/s41598-025-98137-2[] (https://pubmed.ncbi.nlm.nih.gov/40281085/) 

---

## 2. Descripción General

El proyecto Agrosoft, desarrollado por el equipo del programa de Tecnólogo en Análisis y desarrollo de Software (ficha 2846103), aborda problemáticas identificadas en el área de Producción Agropecuaria Ecológica (PAE) del SENA Yamboró. A través de entrevistas y análisis de requerimientos, se identificaron las siguientes limitaciones:  

   •	Falta de recolección automatizada de datos ambientales en tiempo real (humedad del suelo, humedad relativa, temperatura, luminosidad, velocidad y dirección del viento).    
   •	Ausencia de un sistema de trazabilidad para monitorear el ciclo de vida de los cultivos.   
   •	Dependencia de métodos manuales para el registro de datos, utilizando papel, lo que resulta ineficiente y propenso a errores.  
   •	Dificultad para documentar y analizar datos históricos de los cultivos.  

Para abordar estas problemáticas, Agrosoft implementa un sistema IoT basado en el microcontrolador ESP32, equipado con sensores especializados para la medición de variables ambientales. Los datos recopilados se transmiten a una base de datos centralizada mediante un protocolo HTTP, permitiendo su visualización en tiempo real a través de una aplicación web. Además, el sistema incorpora funcionalidades de trazabilidad que registran el historial de cada cultivo, desde la siembra hasta la cosecha, facilitando el análisis de rendimiento y la optimización de recursos.


---

## 3. Situación Actual

Actualmente, el área de PAE del SENA Yamboró no cuenta con un sistema integrado para la recolección y gestión de datos agrícolas. Los procesos de monitoreo dependen de métodos manuales, como el registro en papel de variables ambientales, lo que limita la precisión y accesibilidad de la información. El proyecto Agrosoft se encuentra en la fase de ejecución, habiendo completado el levantamiento de requerimientos y la identificación de cinco módulos funcionales clave:

•	**Módulo IoT**: Se encarga de la recolección automática de datos ambientales en tiempo real mediante sensores especializados, incluyendo humedad del suelo, humedad relativa, temperatura, luminosidad, así como velocidad y dirección del viento. Esta información es fundamental para la toma de decisiones agronómicas.  
•	**Módulo de Trazabilidad**: Permite registrar, monitorear y documentar cada etapa del ciclo de vida del cultivo, desde la siembra hasta la cosecha, asegurando el seguimiento detallado de actividades, insumos utilizados y condiciones ambientales.  
•	**Módulo de Finanzas**: Proporciona una visualización clara del estado económico del sistema agrícola, mostrando datos financieros en tiempo real, además de análisis de tendencias históricas mediante gráficos interactivos que facilitan la toma de decisiones económicas.  
•	**Módulo de Inventario**: Administra el stock de insumos y herramientas, generando notificaciones automáticas cuando los niveles bajan de los umbrales preestablecidos, lo que permite mantener una gestión eficiente y evitar desabastecimientos.  
•	**Módulo de Usuarios**: Gestiona la información de cada usuario del sistema en una base de datos NoSQL, facilitando el almacenamiento estructurado de datos y permitiendo análisis posteriores para mejorar la eficiencia y personalización del sistema.  

En esta etapa, los requerimientos del módulo IoT han sido definidos, pero la implementación de hardware y software está en curso.


---

## 4. Situación Esperada

El sistema Agrosoft busca automatizar la recolección, almacenamiento y análisis de datos ambientales en tiempo real, integrando sensores IoT para monitorear variables críticas en el área de PAE. Los objetivos esperados incluyen:

•	Automatización de la recolección de datos ambientales, eliminando la dependencia de registros manuales.  
•	Implementación de un sistema de trazabilidad que permita un seguimiento detallado de cada cultivo, desde la siembra hasta la cosecha.  
•	Visualización de datos en tiempo real mediante una interfaz web y móvil, accesible desde cualquier ubicación con conexión a Internet.  
•	Generación de alertas automáticas para optimizar el riego y el manejo de insumos.  
•	Almacenamiento centralizado de datos para análisis históricos y toma de decisiones basadas en datos.  

La plataforma garantizará una gestión eficiente de los cultivos, mejorando el rendimiento agrícola y promoviendo prácticas sostenibles.
 


---

## 5. Justificación

El levantamiento de requerimientos reveló una carencia crítica de herramientas tecnológicas para la gestión eficiente de cultivos en el SENA Yamboró. Los métodos manuales actuales son ineficientes, propensos a errores y no permiten un análisis en tiempo real ni la trazabilidad de los cultivos. Agrosoft aborda estas limitaciones mediante la integración de tecnologías IoT, proporcionando una solución unificada que:

•	Automatiza la recolección de datos ambientales, reduciendo la carga de trabajo manual.  
•	Habilita la trazabilidad de cultivos, mejorando la planificación y el control de calidad.  
•	Optimiza el uso de recursos hídricos y energéticos mediante alertas basadas en datos.  
•	Facilita la capacitación de aprendices en tecnologías emergentes, fortaleciendo sus competencias técnicas.  

La implementación de Agrosoft no solo mejorará la productividad agrícola, sino que también posicionará al SENA Yamboró como un referente en la adopción de soluciones IoT para la agricultura sostenible.


---

## 6. Observaciones

Para garantizar el éxito del proyecto Agrosoft, se deben considerar las siguientes observaciones:

•	Compatibilidad de Hardware: Los sensores seleccionados deben ser compatibles con el ESP32 y los protocolos de comunicación (ej. HTTP) utilizados en el sistema.  
•	Calibración de Sensores: La precisión de los datos depende de la calibración inicial y el mantenimiento periódico de los sensores.  
•	Validación de Interfaz: Los prototipos de la interfaz (desarrollados en Figma) deben ser validados con usuarios finales para garantizar usabilidad y accesibilidad.  
•	Comunicación del Equipo: Es crucial mantener una comunicación fluida entre los desarrolladores para alinear objetivos y resolver problemas técnicos de manera oportuna.  
•	Gestión de Riesgos: Identificar y mitigar riesgos, como fallos de conectividad, obsolescencia de hardware o limitaciones en la escalabilidad del sistema.  
•	Seguridad de Datos: Implementar medidas de seguridad, como cifrado TLS y autenticación de usuarios, para proteger la integridad  


---


