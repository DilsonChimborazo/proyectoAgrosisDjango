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

| VERSIÓN | MODIFICACIÓN RESPECTO VERSIÓN ANTERIOR |
|---------|-----------------------------------------|
|    1    | Modificacion en todo el archivo por escritura |

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

En este documento, te presentamos una aplicación móvil y web pensada para mejorar la producción agrícola en el SENA Yamboró. Con la ayuda de un dispositivo ESP32 y varios sensores, esta plataforma permitirá monitorear en tiempo real factores clave como la humedad del suelo y del aire, la temperatura, la luz y la calidad del viento. Así, los aprendices y productores podrán tomar mejores decisiones para sus cultivos y hacer un uso más eficiente de los recursos.

### 1.1 Propósito

El objetivo de este documento es mostrar cómo se desarrolló una aplicación que simplifica la gestión de cultivos utilizando tecnologías IoT. La aplicación permitirá a los usuarios registrar y seguir el estado de sus cultivos, además de recibir alertas sobre las condiciones ambientales y las necesidades de riego.

### 1.2 Alcance

Este proyecto incluye el desarrollo de una plataforma que combina una aplicación móvil y web. Las funciones incluirán el registro de sensores, la visualización de datos recogidos por los sensores y la configuración de alertas. Estará diseñada para ser accesible desde cualquier lugar con conexión a Internet.

### 1.3 Definiciones, Acrónimos y Abreviaturas

- **ESP32**: Un microcontrolador que permite conectarse a WiFi y Bluetooth.  
- **IoT**: Internet de las Cosas.  
- **Sensor de Humedad del Suelo**: Mide cuánta agua hay en el suelo.  
- **Sensor de Humedad Ambiental**: Mide la humedad en el aire.  
- **Sensor de Temperatura**: Mide qué tan caliente o frío está el ambiente.  
- **Sensor de Luminosidad**: Mide cuánta luz hay en un lugar.  
- **Sensor de Calidad del Aire**: Mide contaminantes y parámetros del aire.  
- **Riego Automatizado**: Sistema que activa o desactiva el riego automáticamente.  
- **Notificación**: Alerta sobre el estado de los cultivos o condiciones ambientales.  

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

- Zhao, H., & Wang, H. (2019). *Research on intelligent irrigation systems based on Internet of Things technology*. Journal of Intelligent & Fuzzy Systems, 37(6), 7051-7060. https://doi.org/10.3233/JIFS-190524

---

## 2. Descripción General

El tecnólogo de análisis y desarrollo de software con ID de ficha 2846103, se le asigna una problemática que se viene presentando en el área de producción agropecuaria ecológica (PAE). Se identificaron los siguientes problemas:

- Dificultad para la recolección de datos sobre la humedad ambiente en tiempo real.  
- Conocimiento exacto de la precipitación de la lluvia.  
- Desconocimiento de la velocidad del viento.  
- Almacenamiento de la temperatura y humedad de las eras en tiempo real.  
- Conocimiento de la luminosidad en tiempo real.  
- Documentación tediosa en papel.

---

## 3. Situación Actual

Actualmente, no existe un sistema implementado como tal. El proyecto está en fase de ejecución con el levantamiento de requerimientos e identificación de cinco módulos clave. El módulo IoT está enfocado en la recolección de datos como luminosidad, lluvia, viento, humedad del suelo, humedad ambiental y temperatura.

---

## 4. Situación Esperada

Se espera automatizar la recolección y almacenamiento de los datos en tiempo real de los factores medioambientales que afectan los cultivos del área PAE.

---

## 5. Justificación

Durante el levantamiento de requisitos se evidenció la falta de un sistema unificado. Este sistema IoT permitirá el registro automático y el acceso rápido a la información, ayudando a los usuarios a optimizar sus cultivos.

---

## 6. Observaciones

- Asegurar compatibilidad entre sensores y la plataforma.  
- Calibración y mantenimiento de sensores es crucial.  
- Validar los mockups desarrollados en Figma con usuarios finales.  
- Fomentar comunicación constante del equipo.  
- Identificar riesgos como obsolescencia de sensores y fallas de conectividad.  

---

¿Quieres que lo empaquete en un archivo `.mdx` y te lo adjunte directamente? También lo puedo transformar a `.astro` si lo prefieres como componente visual.
