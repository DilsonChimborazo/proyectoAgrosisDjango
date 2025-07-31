---
title: "Documentacion Tecnica Configuracion - Agrosoft"
description: "Documento técnico versión 1.0 para el sistema Agrosoft."
pubDate: 2025-07-30
author: Wilson Eduardo Sambony
---

## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA | RESPONSABLE | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|-------|-------------|----------------|-----------------------|
| 1.0     | 2024/07/30 | Wilson Eduardo Sambony| 2025/07/06 | Carlos Sterling |

---

## Tabla de contenido

1. [Introducción](#1-introducción)  
2. [Alcance](#2-alcance)  
3. [Definiciones, siglas y abreviaturas](#3-definiciones-siglas-y-abreviaturas)  
4. [Responsables e involucrados](#4-responsables-e-involucrados)  
5. [Aspectos Técnicos](#5-aspectos-técnicos)  
6. [Requisitos de Configuración](#6-requisitos-de-configuración)  
7. [Proceso de Configuración o Despliegue](#7-proceso-de-configuración-o-despliegue)  
8. [Ingreso al Sistema](#8-ingreso-al-sistema)  
9. [Otras Consideraciones](#9-otras-consideraciones)  

---

## 1. Introducción

El correcto uso de un software se basa en gran parte en el nivel de conocimiento que tengamos sobre ella. Por la tanto, hemos elaborado este manual con la intención de explicar los elementos técnicos necesarios para la instalación y funcionamiento del sistema. Además, ofrece una visión básica de las especificaciones mínimas para que el sistema funcione de manera adecuada en un ordenador con las características mencionadas. 

AgroSoft se ha creado con el fin de desarrollador un sistema de información destinado a la gestión integral de cultivos en la unidad productiva PAE.

El objetivo principal de este documento muestra un diseño para el uso de las personas encargadas de gestionar, editar o modificar el software, garantizando su correcto mantenimiento y la adecuada administración de los datos almacenados.


---

## 2. Alcance

Proporcionar al administrador la información necesaria para gestionar el software, incluyendo los programas y herramientas utilizadas en el desarrollo y configuración del aplicativo AgroSoft.
-	Detallar los requisitos de hardware y software necesarios para instalar y operar el sistema en un ambiente adecuado.
-	Describir las funcionalidades técnicas del software para una mejor comprensión del mismo.
-	Indicar las herramientas empleadas en el desarrollo y diseño del aplicativo que fueron usados para la finalización de la misma.


---

## 3. Definiciones, siglas y abreviaturas

- AgroSoft: Sistema de información de desarrollo para la gestión integral de cultivos en la unidad productiva PAE.

- PAE: Proyecto agrícola basado en el desarrollo de prácticas en contexto educativo.

- Software: Conjunto de programas y sistemas necesarios para ejecutar tareas específicas.

- Hardware: Conjunto de componentes físicos de un sistema necesarios para el funcionamiento del software.

- Manual Técnico: Documento que describe los elementos técnicos necesarios para la instalación, uso y mantenimiento del sistema.


---

## 4. Responsables e involucrados

| Nombre                   | Tipo       | Rol            |
|--------------------------|------------|----------------|
| Dilson Chimborazo        | Aprendiz   | Líder / Dev    |
| Wilson Eduardo Samboní   | Aprendiz   | Desarrollador  |
| Lucy Fernanda Ordoñez    | Aprendiz   | Desarrollador  |
| Francisco Javier Burbano| Aprendiz   | Desarrollador  |
| Xiomara Sabi Rojas       | Aprendiz   | Desarrollador  |
| Juan David Bolaños       | Aprendiz   | Desarrollador  |

---

## 5. Aspectos Técnicos


**Equipo de cómputo**:

- RAM: 16 GB (recomendado 32 GB o más).
- Almacenamiento: Mínimo 250 GB SSD (recomendado 500 GB o más).
- Procesador: Intel Core i5-12400 o superior (recomendado Intel Xeon Silver 4210 o superior).

**Información técnica del servidor recomendado:**

- Procesador: Intel Xeon Gold 6254 (3.10 GHz) o superior.
- Frecuencia: 3.10 GHz o superior.
- RAM instalada: 64 GB o más.
- Tipo de sistema: Sistema operativo de 64 bits, procesador basado en x64.
- Sistema operativo: Linux Ubuntu Server.
- Versión: 24.04 LTS (recomendado).
- Disco duro: SSD NVMe de 1 TB o superior.

**Privilegios: Administrador**

***Sistema operativo:***
-	Windows 11 (recomendado)
-	Linux (Ubuntu Server 24.04 LTS recomendado)
-	macOS Monterey

***Navegadores de internet:***
-	Google Chrome (versión más reciente)
-	Mozilla Firefox (versión más reciente)
-	Microsoft Edge (versión más reciente)

## 6. Requisitos de Configuración

- **Django:** Framework web en Python usado para construir el backend del sistema. 
- **PIP:** Gestor de paquetes de Python para instalar dependencias del backend.
- **PostgresSQL:** Motor de base de datos utilizado para almacenar toda la información del sistema.
- **pgAdmin 4:** Cliente grafico para la administración y consulta de base de datos PostgreSQL.
- **React:** Librería JavaScript para el desarrollo de la interfaz gráfica del sistema.
- **TypeScript:** Superset de JavaScript con tipado estático utilizado en el frontend.
- **Astro:** Framework utilizado para la creación del sitio web de documentación técnica.
- **Node.js:** Entorno de ejecución para JavaScript necesario para compilar y correr el frontend con React y Astro.


## 7. Proceso de Configuración o Despliegue

**Requisitos previos**

- Docker Engine v20+
- Docker Compose v2+
- Git (Si se va a clonar el proyecto)
- Editor de código (visual estudio code)

**1. Clonación del proyecto:** Si el proyecto está en un repositorio remoto.

![Repositorio de git hub](/imgtecnica/img1.png)

**2. Estructura del proyecto AgroSoft:** Tener bien organizada las carpetas es clave. Así sabe dónde va cada cosa.


![#](/imgtecnica/img2.png)


**3. Configuración de Docker file para crear las imágenes:** Se crea un archivo Dockerfile para construir la imagen de backend, frontend y base de datos.

![#](/imgtecnica/img3.png)

![#](/imgtecnica/img4.png)

![#](/imgtecnica/img5.png)

**4. Ngix.conf:** Este archivo configura Nginx para que sirva el sitio React, redirija /api/ hacia django y sirva archivos estáticos /media.

![#](/imgtecnica/img6.png)

**5. Configuración de variables de entorno:** Contiene variables configurables que el sistema necesita para funcionar correctamente. Son usados por los contenedores Docker (como PostgreSQL, Django, etc.) y por el código Python/JavaScript para no escribir valores sensibles directamente en el código fuente.

![#](/imgtecnica/img7.png)

**6. Creación del entrypoint.sh:** Se crea un script de arranque para contenedores Docker que usan Django y PostegresSQL. Asegura que la base de datos esté listo antes de iniciar el servidor Django, set -e Detiene el script si ocurre un error, hace un chequeo de base de datos y espera que PostgresSQL este listo ante de continuar, con makemigrations genera archivos de migración a partir de los modelos de Django y con el mígrate aplica las migraciones a la base de datos e inicia el servidor después de levantar el contenedor con Docker compose up –build -d.

![#](/imgtecnica/img8.png)

**7. Creación de las imágenes:**
- Se crea un nuevo builder con soporte de multiplataforma se utiliza porque Docker tradicionalmente solo puede construir imágenes para la misma arquitectura del sistema. Si el sistema se desea compilar para ARM o x86 desde Windows o WSL, se necesita buildx.

![#](/imgtecnica/img9.png)

- Con docker buildx inspect mybuilder –bootstrap muestra los detalles y –Bootstrap lo inicializa.

![#](/imgtecnica/img10.png)

- docker buildx build --no-cache --platform linux/amd64,linux/arm64 -t samboniwilson09/front_agrosis:1.1.1 –push. Construye la imagen usando builder activo, fuerza una compilación limpia e ignora el cache, compila para múltiples arquitecturas como Linux-amd64 PC comunes, se etiqueta las imágenes samboniwilson09/front_agrosis:1.1.1 y con el push sube la imagen automáticamente a Docker hub. El punto final hace referencia el contexto de build es el directorio actual (donde está el Dockerfile).

![#](/imgtecnica/img11.png)


**8. Docker-compose.yml:** Este archivo orquesta todos los contenedores, se definen los contenedores que forman parte del sistema, contenedor con PostgresSQL como base de datos, se manejan volúmenes que guardan la información persistente de PostgresSQL incluso si se borra el contenedor. La imagen de Docker se obtiene de Docker hub.

![#](/imgtecnica/img12.png)

**9. Ejecuta miento del contenedor:** Este comando se usa para ejecutar los contenedores con Docker compose up –builder -d, es el comando principal que usa el archivo Docker-compose.yml para levantar y gestionar multiples servicios (como backend, frontend, base de datos y doc-tecnica).

![#](/imgtecnica/img13.png)

Así generalmente se ve los contenedores corriendo sobre una Ip estática para todo el proyecto en general.

![#](/imgtecnica/img14.png)


## 8. Ingreso al Sistema
Para ingresar al sistema solo se puede registrar un administrador como usuario semilla, para que este maneje el sistema en su totalidad. Después de haber un admistrador ya registrado como usuario base no dejara crear más administradores desde la ventana de register.

![#](/imgtecnica/img15.png)

Este es el resultado esperado después haber levantado el contenedor con sus servicios y ya el software en producción.

![#](/imgtecnica/img16.png)

Estando en la Dashboard como administrador se podrán crear mas usuarios administradores, aprendices pasantes e instructores, cada uno con su rol especifico y limitado para manejar el sistema.

![#](/imgtecnica/img17.png)

## 9. Otras Consideraciones

Una de las consideraciones mas importantes para que corra el proyecto es configurar bien sus variables de entorno, deben estar exactamente como en el archivo Readme indica, recalco que también hay una guía para que se puede configurar el proyecto.

![#](/imgtecnica/img18.png)