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
                Datos requeridos: ingresar los datos requeridos por el sistema.
                Haga clic en el botón Registrarse (Lo redirige al Login automáticamente).

 


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


