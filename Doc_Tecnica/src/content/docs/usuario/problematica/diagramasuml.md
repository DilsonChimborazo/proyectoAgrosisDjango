---
title: "Diagramacion UML - Agrosoft"
description: "Documento técnico versión 1.0 para el sistema Agrosoft."
pubDate: 2024-10-09
author: Wilson Eduardo Samboni Rodiguez
---

## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA | RESPONSABLE | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|-------|-------------|----------------|-----------------------|
| 1.0     | 2024/10/09 | Wilson Eduardo Samboni | 2024/10/09 | Carlos Sterling |

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
      - [1.3.1 Tecnología de la Información y la Comunicación (TIC)](#131-tecnología-de-la-información-y-la-comunicación-tic)  
      - [1.3.2 Sector agropecuario](#132-sector-agropecuario)  
      - [1.3.3 Levantamiento de información](#133-levantamiento-de-información)  
      - [1.3.4 Metodología de desarrollo de software](#134-metodología-de-desarrollo-de-software)  
      - [1.3.5 Sistema eficiente](#135-sistema-eficiente)  
      - [1.3.6 Herramienta práctica y útil](#136-herramienta-práctica-y-útil)  
      - [1.3.7 Instructores y aprendices](#137-instructores-y-aprendices)  
   1.4 [Responsables e involucrados](#14-responsables-e-involucrados)  
   1.5 [Referencias (bibliografía o webgrafía)](#15-referencias-bibliografía-o-webgrafía)  

2. [Descripción general de actores](#2-descripción-general-de-actores)  
   2.1 [Administrador](#21-administrador)  
   2.2 [Instructor](#22-instructor)  
   2.3 [Aprendiz](#23-aprendiz)  
   2.4 [Pasante](#24-pasante)  

6. [Diagrama de Casos de Uso](#6-diagrama-de-casos-de-uso)   
   6.1 [General](#61-general)  
   6.2 [Específicos](#62-específicos)  
      - [6.2.1 Módulo de registro](#621-módulo-de-registro)  
      - [6.2.2 Inicio de sesión](#622-inicio-de-sesión)  
      - [6.2.3 Lista de usuarios](#623-lista-de-usuarios)  
      - [6.2.5 Registro de insumos](#625-registro-de-insumos)  
      - [6.2.6 Registro de herramientas](#626-registro-de-herramientas)  
      - [6.2.8 Registro de cultivos](#628-registro-de-cultivos)  
      - [6.2.9 Registro de semilleros](#629-registro-de-semilleros)  
      - [6.2.10 Registro de lotes](#6210-registro-de-lotes)  
      - [6.2.11 Registro de eras](#6211-registro-de-eras)  
      - [6.2.12 Registro de la producción obtenida](#6212-registro-de-la-producción-obtenida)  
      - [6.2.14 Registro fitosanitario](#6214-registro-fitosanitario)  
      - [6.2.15 Registro fase lunares](#6215-registro-fase-lunares)  
      - [6.2.16 Visualización de mapa interactivo](#6216-visualización-de-mapa-interactivo)  

7. [Especificación de Casos de Uso](#7-especificación-de-casos-de-uso)  
   - [7.1 CU 1](#71-cu-1)  
   - [7.2 CU 2](#72-cu-2)  
   - [7.3 CU 3](#73-cu-3)  
   - [7.4 CU 4](#74-cu-4)  
   - [7.5 CU 5](#75-cu-5)  
   - [7.6 CU 6](#76-cu-6)  
   - [7.8 CU 8](#78-cu-8)  
   - [7.9 CU 9](#79-cu-9)  
   - [7.10 CU 10](#710-cu-10)  
   - [7.11 CU 11](#711-cu-11)  
   - [7.12 CU 12](#712-cu-12)  
   - [7.13 CU 13](#713-cu-13)  
   - [7.14 CU 14](#714-cu-14)  
   - [7.15 CU 15](#715-cu-15)  
   - [7.16 CU 16](#716-cu-16)  

8. [Diagrama de actividades](#8-diagrama-de-actividades)  
   - [8.2 Módulo inicio sesión](#82-módulo-inicio-sesión)  
   - [8.4 Calendario lunar](#84-calendario-lunar)  
   - [8.5 Módulo registro insumos](#85-módulo-registro-insumos)  
   - [8.6 Módulo registro herramientas](#86-módulo-registro-herramientas)  
   - [8.7 Módulo registro cultivos](#87-módulo-registro-cultivos)  
   - [8.8 Módulo registro semillero](#88-módulo-registro-semillero)  
   - [8.9 Módulo registro lotes](#89-módulo-registro-lotes)  
   - [8.10 Módulo registro eras](#810-módulo-registro-eras)  
   - [8.11](#811)  

9. [Diagrama de dominio y de clases](#9-diagrama-de-dominio-y-de-clases)  
10. [Modelo entidad - relación](#10-modelo-entidad---relación)  
11. [Modelo lógico](#11-modelo-lógico)

---

# 1. Introducción
Cuando estamos desarrollando un sistema, muchas veces necesitamos una forma clara de mostrar cómo funcionan las cosas por dentro: qué hace el sistema, cómo se comporta y cómo se relacionan sus partes. Ahí es donde entran los diagramas UML.
UML, que significa Lenguaje de Modelado Unificado, es básicamente una forma estándar de dibujar el funcionamiento de un software. Es como el plano de una casa, pero aplicado a programas. Nos ayuda a planear bien lo que vamos a construir, a que todos (analistas, programadores, instructores, etc.) hablemos el mismo idioma, y a entender mejor el sistema, incluso si lo miramos tiempo después.

## 1.1 Propósito
El propósito de este documento es presentar de manera visual y comprensible cómo está diseñado el sistema que estamos construyendo, utilizando diagramas UML. A través de estos diagramas, buscamos representar las funciones principales del sistema, los roles que interactúan con él (como administradores, instructores, aprendices y pasantes) y cómo fluye la información.
Esto no solo sirve para tener una guía clara durante el desarrollo, sino también para facilitar la comunicación entre todos los involucrados en el proyecto. Además, permite entender mejor el sistema si en el futuro otra persona necesita modificarlo o mantenerlo.
El sistema está principalmente orientado a mejorar la educación y prácticas locales de tanto aprendices, como instructores, combinando la tecnología con la gestión ecológica de los cultivos, creando productos de gran calidad para el mercado regional.

## 1.2 Alcance
Este documento cubre la estructura y el comportamiento del sistema a través de diferentes diagramas UML. Incluye desde los actores principales (administrador, instructor, aprendiz y pasante), hasta las funcionalidades clave como el registro de usuarios, la gestión de insumos, herramientas, cultivos, eras, semilleros, lotes y producción agrícola.
También se describen procesos como el inicio de sesión, visualización de información y el uso de un mapa interactivo. El objetivo es mostrar cómo interactúan las distintas partes del sistema para que todo funcione de forma eficiente, segura y organizada.

## 1.3 Definiciones, Acrónimos y Abreviaturas

### 1.3.1 Tecnología de la Información y la Comunicación (TIC)
- **Definición**: Conjunto de tecnologías que permiten el procesamiento, comunicación, almacenamiento y despliegue de información por medios electrónicos.
- **Fuente**: Palmero, 2011.

### 1.3.2 Sector agropecuario
- **Definición**: Sector económico que incluye las actividades de agricultura y ganadería, enfocadas en la producción de alimentos y otros productos derivados de la tierra y el ganado.

### 1.3.3 Levantamiento de información
- **Definición**: Proceso de recopilación de datos y detalles relevantes sobre un tema específico, utilizado para identificar necesidades y requerimientos.

### 1.3.4 Metodología de desarrollo de software
- **Definición**: Conjunto de principios, técnicas y procedimientos utilizados para diseñar, desarrollar, probar y mantener software de manera estructurada y eficiente.
- **Etapas incluidas**: Obtención de requerimientos, análisis, diseño, implementación, pruebas y documentación.

### 1.3.5 Sistema eficiente
- **Definición**: Sistema que realiza sus funciones con un uso óptimo de recursos, logrando el máximo rendimiento y efectividad en sus operaciones.

### 1.3.6 Herramienta práctica y útil
- **Definición**: Aplicación o sistema que proporciona una solución funcional y beneficiosa para un problema específico, facilitando las tareas y mejorando los resultados.

### 1.3.7 Instructores y aprendices
- **Definición**: Personas que participan en el proceso educativo y formativo; los instructores son los responsables de impartir conocimientos y habilidades, mientras que los aprendices son quienes reciben y aplican dicho aprendizaje.

## 1.4 Responsables e Involucrados

| Nombre                   | Tipo (Responsable/Involucrado) | Rol         |
|--------------------------|-------------------------------|--------------|
| Dilson Chimborazo Pérez  | Involucrado                   | Desarrollador |
| Lucy Fernandez           | Involucrado                   | Desarrollador |
| Wilson Eduardo Samboni   | Involucrado                   | Desarrollador |
| Francisco Burbano        | Involucrado                   | Desarrollador |
| Juan David Bolaños       | Involucrado                   | Desarrollador |
| Xiomara Sabi Rojas       | Involucrado                   | Desarrollador |
| Yanira Jimenez           | Involucrado                   | Desarrollador |

## 1.5 Referencias (bibliografía o webgrafía)

*(Aquí se incluirán las fuentes utilizadas para la elaboración del documento, tanto bibliográficas como webgráficas. Ejemplo: libros, artículos, sitios web, normas técnicas, etc.)*

---

## 2. Descripción general de actores

A continuación, se describen los roles que interactúan con el sistema, definidos según su función y nivel de acceso dentro del software.

### 2.1 Administrador
Este rol tiene la responsabilidad de gestionar el sistema en su totalidad, incluyendo la configuración, el mantenimiento y la supervisión de usuarios. Posee acceso completo a todas las funcionalidades y datos del sistema.

### 2.2 Instructor
Este rol tiene la responsabilidad de gestionar el sistema en su totalidad. Posee acceso completo a todas las funciones del sistema. Se encarga de gestionar contenido educativo, así como supervisar el progreso de los aprendices.

### 2.3 Aprendiz
Este rol corresponde a los usuarios en formación que utilizan el sistema para acceder a recursos educativos, realizar actividades y registrar su progreso. Su acceso está limitado a funcionalidades relacionadas con su aprendizaje.

### 2.4 Pasante
Este rol apoya tareas operativas dentro del sistema, como la carga de datos o el soporte a instructores. Su acceso es restringido a funciones específicas asignadas por el administrador o instructor.

---

## 6. Diagrama de Casos de Uso

### • Inicio de sesión
Permite a todos los roles (aprendiz, pasante, instructor y administrador) acceder a sus cuentas mediante sus credenciales, brindando acceso personalizado a las funcionalidades del sistema.

### • Calendario lunar
Disponible para aprendices, pasantes, instructores y administradores. Permite consultar eventos relacionados con las fases lunares, que pueden influir en las actividades agrícolas.

### • Registro de actividad de una persona
Funcionalidad para registrar y consultar actividades realizadas por cualquier usuario del sistema (aprendiz, pasante, instructor, administrador). Sirve para el seguimiento de tareas y avances individuales.

### • Mapa
Todos los roles pueden acceder a un mapa interactivo que proporciona información georreferenciada de los cultivos, eras, semilleros, lotes y zonas de producción agrícola.

### • Registro de lotes
Instructores y administradores pueden registrar, modificar y consultar información sobre los lotes disponibles para cultivo, incluyendo ubicación, tamaño y estado.

### • Registro de cultivos
Accesible para instructores, aprendices, pasantes y administradores. Permite registrar y gestionar los diferentes cultivos. Los administradores tienen permisos adicionales para eliminar registros.

### • Registro de semilleros
Instructores y administradores pueden registrar información sobre semilleros, incluyendo especie, ubicación, fecha de siembra y cuidados específicos.

### • Registro de residuos
Disponible para instructores y administradores. Se usa para documentar la gestión de residuos agrícolas, ayudando a mantener prácticas sostenibles.

### • Registro de plagas, enfermedades y avances
Solo el administrador tiene acceso para registrar, editar o eliminar información relacionada con plagas, enfermedades detectadas en los cultivos y los avances en el tratamiento o manejo de estas.

### • Registro de control fitosanitario
Funcionalidad exclusiva del administrador para documentar las medidas preventivas o correctivas aplicadas para proteger los cultivos.

### • Registro de especies
El administrador puede registrar, editar y eliminar las especies cultivadas, con sus respectivas características e información botánica.

### • Registro de producción agrícola
Solo el administrador puede registrar los resultados de la producción agrícola, indicando rendimientos, fechas de cosecha y otros datos relevantes.

### • Registro de insumos
Accesible para todos los roles. Permite registrar y gestionar los insumos utilizados en el proceso productivo: abonos, fertilizantes, semillas, etc.

### • Registro de herramientas
El administrador gestiona el inventario de herramientas, incluyendo su registro, mantenimiento y disponibilidad para los usuarios.

### • Registro de eras
Los instructores y el administrador pueden registrar, editar o eliminar la información relacionada con las eras (parcelas de cultivo específicas).

### • Registro de ventas
El administrador documenta las ventas realizadas, registrando datos como productos vendidos, cantidades, precios, fechas y clientes.

### 6.1 General

![Diagrama de Casos de Uso](/imguml/casosuso.png)

### 6.2 Especificos 

### 6.2.1 Modulo de registro

![Diagrama de modulo de registro](/imguml/registro.png)

### 6.2.2 Modulo inicio de sesion

![Diagrama de modulo de inicio sesion](/imguml/iniciosesion.png)

### 6.2.3 Modulo lista de usuarios

![Diagrama de modulo de lista de usuarios](/imguml/lista.png)

### 6.2.4 Registro de actividades

![Diagrama de modulo de registro de actividad](/imguml/actividad.png)

### 6.2.5 Registro de insumos

![Diagrama de modulo de registro de insumos](/imguml/insumos.png)


### 6.2.6 Registro de herramientas

![Diagrama de modulo de registro de herramientas](/imguml/herramientas.png)

### 6.2.7 Registro de sensores en tiempo real

![Diagrama de modulo de registro de sensores en tiempo real](/imguml/sensores.png)

### 6.2.9 Registro de cultivos

![Diagrama de modulo de registro de cultivos](/imguml/cultivos.png)

### 6.2.10 Registro de semilleros

![Diagrama de modulo de registro de semilleros](/imguml/semilleros.png)

### 6.2.11 Registro de lotes

![Diagrama de modulo de registro de lotes](/imguml/lotes.png)

### 6.2.12 Registro de eras

![Diagrama de modulo de registro de eras](/imguml/eras.png)

### 6.2.13 Registro de la produccion obtenida

![Diagrama de modulo de registro de la produccion obtenida](/imguml/produccion.png)

### 6.2.14 Registro de PEA (plagas, enfermedades y arvences)

![Diagrama de modulo de registro del PEA](/imguml/pea.png)

### 6.2.15 Registro de control fitosanitario

![Diagrama de modulo de control fitosanitario](/imguml/fitosanitario.png)


### 6.2.16 Registro de fases lunares

![Diagrama de modulo de fases lunares](/imguml/faseslunares.png)

### 6.2.17 Mapa interactivo

![Diagrama de modulo de mapa interactivo](/imguml/mapa.png)

### 6.2.18 Registro de ventas

![Diagrama de modulo de ventas  ](/imguml/ventas.png)

## 7. Especificación de casos de uso

## 7. Especificación de Casos de Uso

---

### 7.1 CU 1 - Registro de Administrador

- **Nombre:** Registro de Administrador  
- **Autores:** Wilson Eduardo Samboni Rodriguez  
- **Descripción:** Este apartado se encarga de registrar solo un administrador, el cual después podrá crear más usuarios. Si ya hay un administrador registrado, no se permitirá registrar otro.  
- **Actores:** Administrador  
- **Prioridad:** Alta  
- **Precondiciones:** No debe existir un administrador previamente registrado.  
- **Flujo Normal:**  
  1. El usuario ingresa al sistema.  
  2. El sistema presenta un formulario de registro.  
  3. El usuario llena los datos y presiona "Registrar".  
  4. El sistema valida la información y confirma el registro.  
  5. El administrador puede ahora crear más usuarios.  
- **Flujos Alternos:**  
  - Si ya existe un administrador registrado, el sistema mostrará un mensaje de error e impedirá el registro.  
- **Postcondición:** Se registra un administrador y se le permite gestionar usuarios.  
- **Excepciones:**  
  1. Si el usuario no llena todos los campos obligatorios, el sistema muestra un mensaje de error.  
  2. Si ya existe un administrador, el sistema bloquea el registro.

---

### 7.2 CU 2 - Inicio de Sesión

- **Nombre:** Inicio de Sesión  
- **Autores:** Wilson Eduardo Samboni Rodríguez  
- **Descripción:** El sistema permitirá a los usuarios autenticarse ingresando sus credenciales (identificación y contraseña). Dependiendo del rol del usuario, se le redirigirá a la interfaz correspondiente.  
- **Actores:** Administrador, Instructor, Aprendiz, Pasante  
- **Prioridad:** Alta  
- **Precondiciones:** El usuario debe estar registrado en el sistema con un rol asignado.  
- **Flujo Normal:**  
  1. El usuario accede a la página de inicio de sesión.  
  2. Ingresa su correo y contraseña.  
  3. Presiona "Iniciar Sesión".  
  4. El sistema verifica las credenciales.  
  5. Si son correctas, el sistema autentica al usuario y lo redirige según su rol.  
  6. El usuario accede a su interfaz correspondiente.  
- **Flujos Alternos:**  
  1. Credenciales incorrectas: el sistema muestra un mensaje de error y permite reintentar.  
  2. Opción para restablecer contraseña.  
- **Postcondición:** El usuario accede a su panel correspondiente.  
- **Excepciones:**  
  1. Cuenta inactiva: el sistema muestra advertencia.  
  2. Intentos fallidos superados: se bloquea el acceso y se notifica al administrador.

---

### 7.3 CU 3 - Listar Usuarios Agregados por el Administrador

- **Nombre:** Listar Usuarios Agregados por el Administrador  
- **Autores:** Wilson Eduardo Samboni Rodríguez  
- **Descripción:** La interfaz muestra una lista de usuarios registrados, indicando si están activos o inactivos, permitiendo editar su información.  
- **Actores:** Administrador  
- **Prioridad:** Alta  
- **Precondiciones:** El administrador debe haber iniciado sesión.  
- **Flujo Normal:**  
  1. Accede al módulo de gestión de usuarios.  
  2. Visualiza lista de usuarios.  
  3. Visualiza datos y estado de cada usuario.  
  4. Puede editar información del usuario.  
  5. Guarda los cambios.  
- **Flujos Alternos:**  
  - Sin usuarios registrados: se muestra un mensaje.  
  - Se puede usar filtro/búsqueda.  
- **Postcondición:** Se muestra la lista actualizada con cambios aplicados.  
- **Excepciones:**  
  1. Error en base de datos: la lista no se carga.  
  2. Problemas de conexión: los cambios no se guardan.

---

### 7.4 CU 4 - Registro de Actividades

- **Nombre:** Registro de Actividades  
- **Autores:** Francisco Javier Burbano  
- **Descripción:** El sistema permite a administradores e instructores asignar actividades a aprendices y pasantes, quienes pueden registrar su cumplimiento.  
- **Actores:** Administrador, Instructores  
- **Prioridad:** Alta  
- **Precondiciones:** El administrador o instructor debe haber iniciado sesión.  
- **Flujo Normal:**  
  1. Accede al módulo de asignación.  
  2. Selecciona al aprendiz o pasante.  
  3. Ingresa detalles de la actividad.  
  4. Se envía notificación automática.  
  5. El aprendiz/pasante consulta la actividad.  
  6. Registra la finalización.  
- **Flujos Alternos:**  
  - Si no llega la notificación, se puede consultar manualmente.  
  - El aprendiz puede solicitar una modificación.  
- **Postcondición:**  
  1. Actividad registrada con estado (pendiente o completada).  
  2. Se guarda el historial.  
- **Excepciones:**  
  1. Problema de conexión impide registro o notificación.  
  2. Si no se registra a tiempo, se genera alerta.

---

### 7.5 CU 5 - Registro de Insumos

- **Nombre:** Registro de Insumos  
- **Autores:** Yanira Jiménez  
- **Descripción:** El sistema permite registrar, visualizar y editar insumos con detalles como nombre, cantidad, empaque, caducidad, precio, unidad y tipo.  
- **Actores:** Aprendiz, Pasante, Administrador, Instructor  
- **Prioridad:** Alta  
- **Precondiciones:** Usuario autenticado.  
- **Flujo Normal:**  
  - Accede al módulo de insumos.  
  - Selecciona "Registrar nuevo insumo".  
  - Ingresa datos requeridos.  
  - Guarda el registro.  
  - Puede visualizar y editar insumos.  
- **Flujos Alternos:**  
  - Puede visualizar lista antes de registrar.  
  - Si ya existe, puede actualizar información.  
- **Postcondición:**  
  - Insumo almacenado correctamente.  
  - Disponible para visualización/edición.  
- **Excepciones:**  
  - Error de conexión impide registro.  
  - Campos incompletos: no se permite guardar.

---

### 7.6 CU 6 - Registro de Herramientas

- **Nombre:** Registro de Herramientas  
- **Autores:** Yanira Jiménez  
- **Descripción:** El sistema permite registrar, visualizar y editar herramientas, incluyendo nombre, cantidad, precio, estado y fecha de registro.  
- **Actores:** Aprendiz, Pasante, Administrador, Instructor  
- **Prioridad:** Alta  
- **Precondiciones:** Usuario autenticado.  
- **Flujo Normal:**  
  - Accede al módulo de herramientas.  
  - Selecciona "Registrar nueva herramienta".  
  - Ingresa los datos.  
  - Guarda el registro.  
  - Puede ver y editar herramientas.  
- **Flujos Alternos:**  
  - Puede consultar antes de registrar.  
  - Si ya existe, puede actualizar.  
- **Postcondición:**  
  - Herramienta registrada correctamente.  
  - Lista para consultar y editar.  
- **Excepciones:**  
  - Error de conexión impide registro.  
  - Campos vacíos: no permite guardar.

---

### 7.8 CU 8 - Registro de Sensores en Tiempo Real

- **Nombre:** Registro de Sensores en Tiempo Real  
- **Autores:** Juan David Bolaños  
- **Descripción:** El sistema obtiene y muestra datos en tiempo real de sensores ambientales, con íconos para representar variables como temperatura, humedad y viento.  
- **Actores:** Aprendiz, Pasante, Administrador, Instructor  
- **Prioridad:** Alta  
- **Precondiciones:** Sistema conectado a los sensores.  
- **Flujo Normal:**  
  - El sistema obtiene datos en tiempo real.  
  - Se actualizan constantemente.  
  - Muestra valores ambientales (temperatura, humedad, etc.).  
  - Representa la información con íconos.  
  - Todos los usuarios pueden consultar los datos.  
- **Flujos Alternos:**  
  - Si un sensor falla, se genera alerta.  
  - Si se pierde la conexión, intenta reconectar o muestra error.  
- **Postcondición:**  
  - Información disponible en tiempo real.  
  - Datos representados visualmente.  
- **Excepciones:**  
  - Falla de base de datos o sensores impide registro.  
  - Sin respuesta del usuario, se emite alerta.

  ---

  ## CU9 - Registro de lotes

- **Nombre del caso de uso:** Registro de lotes
- **Actores:** Aprendiz, Pasante, Administrador, Instructor
- **Descripción:** Este caso de uso permite a los usuarios registrar información sobre los lotes, así como consultar, editar, eliminar y generar reportes relacionados con los mismos.
- **Precondiciones:** El usuario debe estar autenticado y tener los permisos adecuados.
- **Flujo principal:**
  1. El usuario accede al módulo de lotes.
  2. Selecciona la opción para registrar un nuevo lote.
  3. Ingresa los datos requeridos: nombre, ubicación, área, etc.
  4. Guarda la información.
  5. El sistema confirma el registro exitoso.
- **Flujos alternativos:**
  - El usuario puede consultar, editar o eliminar lotes existentes.
  - El usuario puede generar reportes de los lotes.
- **Excepciones:**
  - Datos incompletos o inválidos.
  - Falta de permisos para realizar alguna acción.
  - Error de conexión con la base de datos.
- **Postcondiciones:** El lote queda registrado en el sistema.

---

## CU10 - Registro de eras

- **Nombre del caso de uso:** Registro de eras
- **Actores:** Aprendiz, Pasante, Administrador, Instructor
- **Descripción:** Permite a los usuarios registrar, consultar, editar y eliminar información sobre las eras, además de generar reportes.
- **Precondiciones:** El usuario debe estar autenticado.
- **Flujo principal:**
  1. Ingresar al módulo de eras.
  2. Seleccionar "Registrar era".
  3. Ingresar los datos requeridos: nombre, ubicación, cultivo, etc.
  4. Guardar los datos.
- **Flujos alternativos:**
  - Consultar, editar o eliminar registros de eras.
  - Generar reportes.
- **Excepciones:**
  - Validación de datos.
  - Permisos insuficientes.
  - Error de base de datos.
- **Postcondiciones:** La era queda registrada correctamente.

---

## CU11 - Registro de producción

- **Nombre del caso de uso:** Registro de producción
- **Actores:** Aprendiz, Pasante, Administrador, Instructor
- **Descripción:** Permite registrar la producción de cultivos, incluyendo cantidad, fecha, evidencia fotográfica, tiempo empleado, entre otros.
- **Precondiciones:** El usuario debe estar autenticado.
- **Flujo principal:**
  1. Acceder al módulo de producción.
  2. Hacer clic en "Registrar producción".
  3. Ingresar los datos solicitados.
  4. Adjuntar evidencia fotográfica.
  5. Guardar el registro.
- **Flujos alternativos:**
  - Consultar y editar registros de producción.
- **Excepciones:**
  - Datos inválidos o incompletos.
  - Falta de fotografía como evidencia.
  - Restricción de permisos.
- **Postcondiciones:** Producción registrada exitosamente.

---

## CU12 - Registro de PEA (Plagas, Enfermedades y Arvenses)

- **Nombre del caso de uso:** Registro de PEA
- **Actores:** Aprendiz, Pasante, Administrador, Instructor
- **Descripción:** Permite registrar plagas, enfermedades y arvenses detectadas en los cultivos, incluyendo su georreferencia, nombre común y científico, grado de afectación, entre otros.
- **Precondiciones:** Usuario autenticado.
- **Flujo principal:**
  1. Ingresar al módulo PEA.
  2. Seleccionar tipo de organismo: plaga, enfermedad o arvenses.
  3. Ingresar los datos solicitados.
  4. Guardar el registro.
- **Flujos alternativos:**
  - Consultar, editar o eliminar registros.
- **Excepciones:**
  - Campos obligatorios no completados.
  - Datos inválidos.
  - Permisos insuficientes.
- **Postcondiciones:** Registro exitoso de PEA.

---

## CU13 - Registro de control fitosanitario

- **Nombre del caso de uso:** Registro de control fitosanitario
- **Actores:** Aprendiz, Pasante, Administrador, Instructor
- **Descripción:** Registro de acciones de control fitosanitario (químico, biológico o cultural), incluyendo dosis, ubicación, evidencia fotográfica, etc.
- **Precondiciones:** Usuario autenticado.
- **Flujo principal:**
  1. Ingresar al módulo de control fitosanitario.
  2. Seleccionar tipo de tratamiento.
  3. Registrar los datos correspondientes.
  4. Adjuntar evidencia.
  5. Guardar.
- **Flujos alternativos:**
  - Consultar o editar registros existentes.
- **Excepciones:**
  - Datos faltantes o inválidos.
  - Imagen faltante.
  - Error de permisos.
- **Postcondiciones:** Registro exitoso.


---

## CU14 - Registro de Fases Lunares

- **Nombre del caso de uso:** Registro de fases lunares  
- **Autores:** Lucy Ordoñez  
- **Descripción:** El sistema permite registrar, consultar y modificar información sobre las fases lunares y su influencia en actividades agrícolas.  
- **Actores:** Aprendiz, Pasante, Administrador, Instructor  
- **Prioridad:** Media  
- **Precondiciones:** Los usuarios deben tener credenciales para iniciar sesión y permisos adecuados según su rol.  
- **Flujo principal:**  
  - El usuario inicia sesión en el sistema.  
  - Puede realizar las siguientes acciones según su rol:
    - Seleccionar la fase lunar (Luna Nueva, Cuarto Creciente, Luna Llena, Cuarto Menguante).
    - Registrar fecha de inicio y fin de la fase.
    - Asociar actividades recomendadas según la fase lunar.
  - Consultar el calendario lunar y recomendaciones.
  - Modificar registros existentes.

- **Flujos alternativos:**
  - El sistema muestra restricciones si no se tienen los permisos adecuados.
  - Si los datos ingresados son incorrectos, se solicita corrección.
  - En caso de pérdida de conexión, los datos no se actualizan.

- **Postcondición:**  
  Los registros quedan almacenados y disponibles para su consulta o modificación según los permisos.

- **Excepciones:**  
  - Datos incorrectos o incompletos.
  - Acceso no permitido según el rol.
  - Datos obligatorios no ingresados (fecha o fase lunar).

---

## CU15 - Mapa Interactivo

- **Nombre del caso de uso:** Mapa interactivo  
- **Autores:** Yanira Jiménez  
- **Descripción:** En el inicio de sesión se debe cumplir un requisito para acceder al mapa, el cual permite visualizar y editar cultivos registrados.  
- **Actores:** Instructor, Pasante, Aprendiz y Visitantes  
- **Prioridad:** Media  
- **Precondiciones:** El usuario debe iniciar sesión para que se le asigne un rol válido.  
- **Flujo principal:**  
  1. Iniciar sesión en el sistema.  
  2. Visualizar ventana principal con opciones para registrar o consultar cultivos.  
  3. Acceder a la edición de cultivos.  
  4. Buscar cultivos por ubicación.

- **Flujos alternativos:**  
  - El inicio de sesión debe realizarse obligatoriamente desde el botón principal.
  - No se permite una vía alternativa para ingresar.

- **Postcondición:**  
  El usuario es redirigido al módulo de mapa si el inicio de sesión es correcto.

- **Excepciones:**  
  - Formulario de inicio de sesión incompleto o con errores.
  - Si no se envía la modificación, los cambios no se guardan.

---

## CU16 - Registro de Ventas

- **Nombre del caso de uso:** Registro de ventas  
- **Autores:** Lucy Ordoñez  
- **Descripción:** Permite registrar y gestionar las ventas de productos, incluyendo generación de facturas, control de stock y reportes de ventas.  
- **Actores:** Aprendiz, Pasante, Administrador, Instructor  
- **Prioridad:** Alta  
- **Precondiciones:** El usuario debe tener credenciales válidas y permisos según su rol.  
- **Flujo principal:**  
  - Ingresar al módulo de ventas.
  - Registrar nueva venta:
    - Seleccionar productos.
    - Ingresar cantidad y aplicar descuentos.
    - Asociar cliente (opcional).
    - Generar factura.
  - Consultar historial de ventas.
  - Editar o anular ventas (según permisos).
  - Generar reportes:
    - Ventas diarias, semanales, mensuales.
    - Estadísticas de productos vendidos.
    - Ingresos generados.

- **Flujos alternativos:**  
  - Si no hay stock suficiente, el sistema lo notifica.
  - Si hay errores en los datos, se solicita corrección.
  - Para modificar una venta facturada, se verifican permisos.

- **Postcondición:**  
  - La venta queda registrada y afecta el stock.
  - Se genera una factura.
  - Si se anula, el stock se actualiza.

- **Excepciones:**  
  - Fallas en el procesamiento del pago.
  - Producto inexistente.
  - Inconsistencias en precios o descuentos.

---

# 8. Diagrama de actividades

![Diagrama de actividades  ](/imguml/actividades.png)

## 8.1 Modulo de registro

![Diagrama de registro](/imguml/aregistro.png)

## 8.2 Modulo de inicios sesion

![Diagrama de inicio sesion](/imguml/asesion.png)

## 8.3 Modulo de asignacion de actividades

![Diagrama de asignacion de actividades](/imguml/aasignacion.png)

## 8.4 Modulo de calendario lunar

![Diagrama de calendario lunar](/imguml/acalendario.png)

## 8.5 Modulo de insumos

![Diagrama de insumos](/imguml/ainsumos.png)

## 8.6 Modulo de herramientas

![Diagrama de herramientas](/imguml/aherramientas.png)

## 8.7 Modulo de cultivos

![Diagrama de cultivos](/imguml/acultivos.png)

## 8.8 Modulo de semilleros

![Diagrama de semilleros](/imguml/asemilleros.png)


## 8.9 Modulo de lotes

![Diagrama de lotes](/imguml/alotes.png)

## 8.10 Modulo de eras

![Diagrama de eras](/imguml/aeras.png)

## 8.11 

# 9. Diagrama de dominio y clases

![Diagrama de clases](/imguml/clases.png)

# 10. Modelo entidad relacion

![Diagrama de modelo entidad relacion](/imguml/entidadrelacion.png)

# 11. Modelo logico

![Diagrama logico](/imguml/logico.png)
