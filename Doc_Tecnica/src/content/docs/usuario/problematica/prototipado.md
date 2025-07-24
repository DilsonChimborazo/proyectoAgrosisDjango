---
title: "Prototipado del sistema - Agrosoft"
description: "Documento técnico versión 2.0 para el sistema Agrosoft."
pubDate: 2025-07-23
author: Juan David Bolaños
---

## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA | RESPONSABLE | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|-------|-------------|----------------|-----------------------|
| 1.0     | 2024/10/09 | Juan david bolaños | 2024/10/09 | Carlos Sterling |
| 2.0     | 2025/07/29 | Juan david bolaños | 2025/07/30 | Carlos Sterling |
---

## CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR

| VERSIÓN | MODIFICACIÓN RESPECTO VERSIÓN ANTERIOR |
|---------|-----------------------------------------|
|    1    | Modificacion en todo el archivo por escritura |
|    2    | ActualizaciÓn de los Figmas del sistema      |
---

1. [Introducción](#1-introducción)  
   1.1 [Propósito](#11-propósito)  
   1.2 [Alcance](#12-alcance)  
   1.3 [Responsables e involucrados](#13-responsables-e-involucrados)  

2. [Prototipos](#2-prototipos)  
   2.1 [El sistema debe permitir al usuario iniciar sesión](#21-el-sistema-debe-permitir-al-usuario-iniciar-sesión)  
   2.2 [El sistema debe permitir el registro de usuarios](#22-el-sistema-debe-permitir-el-registro-de-usuarios)  
   2.3 [El sistema debe permitir listar a los usuarios agregados por el administrador](#23-el-sistema-debe-permitir-listar-a-los-usuarios-agregados-por-el-administrador)  
   2.4 [El sistema debe permitir editar los usuarios](#24-el-sistema-debe-permitir-editar-los-usuarios)  
   2.5 [El sistema debe permitir registrar los insumos agrícolas](#25-el-sistema-debe-permitir-registrar-los-insumos-agrícolas)  
   2.6 [El sistema debe permitir listar insumos registrados](#26-el-sistema-debe-permitir-listar-insumos-registrados)  
   2.7 [El sistema debe permitir mostrar y actualizar información de insumos](#27-el-sistema-debe-permitir-mostrar-y-actualizar-información-de-insumos)  
   2.8 [El sistema debe permitir registrar herramientas agrícolas](#28-el-sistema-debe-permitir-registrar-herramientas-agrícolas)  
   2.9 [El sistema debe permitir listar herramientas registradas](#29-el-sistema-debe-permitir-listar-herramientas-registradas)  
   2.10 [El sistema debe permitir mostrar y actualizar herramientas](#210-el-sistema-debe-permitir-mostrar-y-actualizar-herramientas)  
   2.11 [El sistema deberá mostrar en pantalla IoT la info de sensores en tiempo real](#211-el-sistema-deberá-mostrar-en-pantalla-iot-la-info-de-sensores-en-tiempo-real)  
   2.12 [El sistema deberá mostrar la humedad de las eras](#212-el-sistema-deberá-mostrar-la-humedad-de-las-eras)  
   2.13 [El sistema deberá mostrar la humedad ambiente](#213-el-sistema-deberá-mostrar-la-humedad-ambiente)  
   2.14 [El sistema deberá mostrar la luminosidad](#214-el-sistema-deberá-mostrar-la-luminosidad)  
   2.15 [El sistema deberá mostrar la lluvia](#215-el-sistema-deberá-mostrar-la-lluvia)  
   2.16 [El sistema deberá mostrar la temperatura](#216-el-sistema-deberá-mostrar-la-temperatura)  
   2.17 [El sistema deberá mostrar velocidad y dirección del viento](#217-el-sistema-deberá-mostrar-velocidad-y-dirección-del-viento)  
   2.18 [El sistema deberá mostrar el pH del suelo](#218-el-sistema-deberá-mostrar-el-ph-del-suelo)  
   2.19 [El sistema deberá monitorear la evapotranspiración](#219-el-sistema-deberá-monitorear-la-evapotranspiración)  
   2.20 [El sistema deberá almacenar y gestionar datos históricos](#220-el-sistema-deberá-almacenar-y-gestionar-datos-históricos)  
   2.21 [El sistema debe registrar, listar y editar nombre y tipo de cultivo](#221-el-sistema-debe-registrar-listar-y-editar-nombre-y-tipo-de-cultivo)  
   2.22 [El sistema debe permitir registrar nuevos semilleros](#222-el-sistema-debe-permitir-registrar-nuevos-semilleros)  
   2.23 [El sistema debe registrar y editar lotes de cultivo](#223-el-sistema-debe-registrar-y-editar-lotes-de-cultivo)  
   2.24 [El sistema debe listar lotes de cultivo](#224-el-sistema-debe-listar-lotes-de-cultivo)  
   2.25 [El sistema debe actualizar información de los lotes](#225-el-sistema-debe-actualizar-información-de-los-lotes)  
   2.26 [El sistema debe gestionar especies cultivadas](#226-el-sistema-debe-gestionar-especies-cultivadas)  
   2.27 [El sistema debe registrar producción de cultivos](#227-el-sistema-debe-registrar-producción-de-cultivos)  
   2.28 [El sistema debe listar registros de producción](#228-el-sistema-debe-listar-registros-de-producción)  
   2.29 [El sistema debe actualizar registros de producción](#229-el-sistema-debe-actualizar-registros-de-producción)  
   2.30 [El sistema debe gestionar información de ventas](#230-el-sistema-debe-gestionar-información-de-ventas)  
   2.31 [El sistema debe visualizar registros de ventas](#231-el-sistema-debe-visualizar-registros-de-ventas)  
   2.32 [El sistema debe actualizar registros de ventas](#232-el-sistema-debe-actualizar-registros-de-ventas)  
   2.33 [El sistema debe configurar alertas en tiempo real](#233-el-sistema-debe-configurar-alertas-en-tiempo-real)  
   2.34 [El sistema debe integrarse con herramientas externas](#234-el-sistema-debe-integrarse-con-herramientas-externas)  
   2.35 [El sistema debe mostrar reportes gráficos](#235-el-sistema-debe-mostrar-reportes-gráficos)  
   2.36 [El sistema debe permitir configuración de visualización](#236-el-sistema-debe-permitir-configuración-de-visualización)  
   2.37 [El sistema debe exportar datos a Excel o PDF](#237-el-sistema-debe-exportar-datos-a-excel-o-pdf)  
   2.38 [El sistema debe permitir agregar notas y comentarios](#238-el-sistema-debe-permitir-agregar-notas-y-comentarios)  
   2.39 [El sistema debe gestionar roles y permisos](#239-el-sistema-debe-gestionar-roles-y-permisos)  
   2.40 [El sistema debe configurar notificaciones importantes](#240-el-sistema-debe-configurar-notificaciones-importantes)  
   2.41 [El sistema debe generar reportes de usuarios](#241-el-sistema-debe-generar-reportes-de-usuarios)  
   2.42 [El sistema debe generar reportes de insumos](#242-el-sistema-debe-generar-reportes-de-insumos)  
   2.43 [El sistema debe generar reportes de herramientas](#243-el-sistema-debe-generar-reportes-de-herramientas)  
   2.44 [El sistema debe generar reportes de sensores en tiempo real](#244-el-sistema-debe-generar-reportes-de-sensores-en-tiempo-real)  
   2.45 [El sistema debe generar reportes de especies y tipos](#245-el-sistema-debe-generar-reportes-de-especies-y-tipos)  
   2.46 [El sistema debe generar reportes de semilleros activos](#246-el-sistema-debe-generar-reportes-de-semilleros-activos)  
   2.47 [El sistema debe generar reportes de lotes](#247-el-sistema-debe-generar-reportes-de-lotes)  
   2.48 [El sistema debe generar reportes de historial de eras](#248-el-sistema-debe-generar-reportes-de-historial-de-eras)  
   2.49 [El sistema debe generar reporte de cultivos activos](#249-el-sistema-debe-generar-reporte-de-cultivos-activos)  
   2.50 [El sistema debe generar reporte de actividades realizadas](#250-el-sistema-debe-generar-reporte-de-actividades-realizadas)  
   2.51 [El sistema debe generar reporte mensual de PEA](#251-el-sistema-debe-generar-reporte-mensual-de-pea)  
   2.52 [El sistema debe generar reporte de controles fitosanitarios](#252-el-sistema-debe-generar-reporte-de-controles-fitosanitarios)  
   2.53 [El sistema debe generar informe de ingresos por producto](#253-el-sistema-debe-generar-informe-de-ingresos-por-producto)

# 1. Introducción

El presente documento tiene como propósito el diseño y prototipado de un sistema de gestión agrícola basado en tecnologías IoT, orientado a satisfacer las necesidades de la C.G.D.S.S. El prototipo propuesto permitirá el registro, monitoreo y análisis de datos agrícolas en tiempo real, garantizando la trazabilidad de insumos y actividades, conforme a normativas colombianas como la Ley 1581 de 2012 (protección de datos), la Resolución 464 de 2017 (Buenas Prácticas Agrícolas) y el Estatuto Tributario. El enfoque del presente documento se centra específicamente en el desarrollo del prototipo, abarcando desde la definición de requerimientos funcionales hasta la implementación de una solución preliminar que facilite la interacción intuitiva de los usuarios y la generación de informes detallados. A través de este prototipo, se busca sentar las bases para una herramienta que no solo simplifique la administración agrícola, sino que también promueva prácticas sostenibles, contribuyendo al desarrollo productivo y ambiental de la región.

## 1.1 Propósito

El presente documento tiene como objetivo detallar por medios del prototipado los requerimientos funcionales necesarios para el desarrollo de un sistema de información destinado a la gestión integral de cultivos en la unidad productiva PAE. Dichos requerimientos buscan asegurar que el sistema propuesto cumpla con las necesidades específicas de la unidad, abordando de manera eficiente aspectos esenciales como el monitoreo de cultivos, la gestión de inventario, la planificación de siembras, el control de plagas y enfermedades, así como la optimización del uso de recursos hídricos y nutrientes.

Asimismo, el sistema deberá proporcionar herramientas intuitivas y accesibles que faciliten una interacción ágil y efectiva por parte de los usuarios, permitiendo un manejo óptimo de la información relevante para la gestión agrícola. La implementación de este sistema no solo está orientada a mejorar la eficiencia operativa, sino también a ofrecer análisis e informes detallados que apoyen la toma de decisiones estratégicas en la unidad productiva PAE.


## 1.2 Alcance

El presente documento tiene como alcance el diseño y prototipado de un sistema de gestión agrícola basado en tecnologías IoT, enfocado en cumplir con los requerimientos funcionales establecidos para la Corporación de Gestión y Desarrollo Sostenible (C.G.D.S.S.). Se centra exclusivamente en desarrollar un prototipo que permita el registro, monitoreo y análisis de actividades agrícolas clave, garantizando la trazabilidad y cumplimiento normativo, con una interfaz intuitiva para los usuarios.

## 1.3 Responsables e involucrados

| Nombre                     | Tipo (Responsable/Involucrado) | Rol           |
|---------------------------|----------------------------------|---------------|
| Juan David Bolaños        | Aprendiz                         | Desarrollador |
| Dilson Chimborazo Pérez   | Aprendiz                         | Líder y desarrollador |
| Xiomara Sabi Rojas        | Aprendiz                         | Desarrollador |
| Wilson Eduardo Samboni    | Aprendiz                         | Desarrollador |
| Lucy Fernanda Rodriguez   | Aprendiz                         | Desarrollador |
| Francisco Javier Urbano   | Aprendiz                         | Desarrollador |

# Prototipado del Sistema

## 1. El sistema debe permitir al usuario iniciar sesión

**Descripción:**  
El sistema ofrecerá a los usuarios un formulario interactivo que contará con los campos **Correo** y **Contraseña**. Una vez que el usuario ingrese la información requerida, el sistema validará los datos proporcionados en cada campo para verificar su autenticidad. Si la validación es exitosa, el usuario obtendrá acceso al sistema, asegurando así un control seguro y eficiente de los datos y funcionalidades disponibles.

**DISEÑO:**
**Página web:** ![Pagina de inicio](/imgprototipado/login.png)								 
**Aplicativo Móvil:** ![Pagina de inicio](/imgprototipado/loginc.png)	

## 2. El sistema debe permitir el registro de usuarios

**Descripción:**  
El sistema dispondrá de un formulario interactivo compuesto por múltiples campos que permitirán registrar nuevos usuarios de manera eficiente. Los campos incluidos en el formulario serán los siguientes: **Tipo de Documento**, **Número de Documento**, **Nombre Completo**, **Teléfono**, **Correo Electrónico**, **Contraseña** y **Rol**.  
El campo **Rol** será determinante para asignar los privilegios de acceso correspondientes a cada usuario, asegurando que las funciones y permisos dentro del sistema se ajusten a su perfil. Tras la validación exhaustiva de los datos ingresados en cada campo, el sistema procederá a registrar al usuario de forma exitosa, garantizando la integridad y seguridad de la información capturada.

**Diseño:**  
**Página web:** ![Pagina de registro](/imgprototipado/register.png)  
**Aplicativo móvil:** ![Pagina de registro](/imgprototipado/registerc.png) 

## 3. El sistema debe permitir listar a los usuarios agregados por el administrador

**Descripción:**  
La interfaz proporcionará una lista detallada de todos los usuarios registrados en el sistema, acompañada de un indicador de estado que mostrará si cada usuario se encuentra **activo** o **inactivo**.  
Adicionalmente, se incluirá la opción de **editar la información** de un usuario, permitiendo corregir cualquier dato que haya sido ingresado incorrectamente durante el proceso de registro. Esta funcionalidad asegurará la **precisión** y **actualización continua** de la información del usuario en el sistema.

**Diseño:**  
**Página web:** ![Pagina de lista de usuarios](/imgprototipado/listau.png) 
**Aplicativo Móvil:** ![Pagina de lista de usuarios](/imgprototipado/listauc.png) 

## 4. El sistema debe permitir editar los usuarios

**Descripción:**  
Esta interfaz permitirá que únicamente el **administrador** tenga la capacidad de **editar** y **eliminar** usuarios registrados en el sistema, garantizando así la **seguridad** y la **integridad** de la información.  
Al restringir estas funciones a un rol específico, se asegura que los datos sensibles permanezcan **protegidos** y se mantenga un **control adecuado** sobre la gestión de usuarios.

**Diseño:**  
**Página web:**  ![Pagina de editar usuarios](/imgprototipado/editu.png) 
**Aplicativo Móvil:** ![Pagina de editar usuarios](/imgprototipado/edituc.png) 

## 5. El sistema debe permitir registrar los insumos agrícolas que se utilizan para el levantamiento de cultivos

**Descripción:**  
El sistema permitirá el **registro** de los diferentes **insumos** necesarios para optimizar la producción de los cultivos.  
Además, proporcionará una **lista interactiva** de todos los insumos registrados, la cual podrá ser visualizada por el usuario.  
Desde esta interfaz, el usuario tendrá la opción de **visualizar, editar o eliminar** los registros de insumos, facilitando así una gestión **eficiente** y **precisa** de los recursos agrícolas.

**Diseños:**  
**Página web:**  ![Pagina de registrar insumos](/imgprototipado/reginsu.png) 
**Aplicativo Móvil:** ![Pagina de registrar insumos](/imgprototipado/reginsuc.png) 

## 6. El sistema debe permitir listar insumos registrados previamente

**Descripción:**  
El sistema presentará un **listado** de los insumos registrados, permitiendo al usuario acceder a **detalles completos** de cada insumo.  
Esta funcionalidad facilitará la **consulta exhaustiva** de la información asociada a cada insumo, proporcionando una visión más **detallada** y **precisa** para su correcta gestión.

**Diseños:**  
**Página web:**  ![Pagina de lista insumos](/imgprototipado/lisinsu.png) 
**Aplicativo Móvil:** ![Pagina de lista insumos](/imgprototipado/lisinsuc.png) 

## 7. El sistema debe permitir mostrar y actualizar información de insumos registrados previamente

**Descripción:**  
El sistema mostrará un **listado de los insumos registrados**, brindando al usuario la posibilidad de **actualizar la información** asociada a cada uno de ellos.  
Esta funcionalidad permitirá **mantener los registros actualizados** y garantizar la **precisión de los datos** en el sistema.

**Diseños:**  
**Página web:**  ![Pagina de actualizar insumos](/imgprototipado/acinsu.png) 
**Aplicativo Móvil:** ![Pagina de actualizar insumos](/imgprototipado/acinsuc.png)

## 8. El sistema debe permitir registrar las herramientas agrícolas que se utilizan para el levantamiento de cultivos

**Descripción:**  
El sistema contará con un apartado específico para **registrar los diferentes tipos de herramientas** necesarias para optimizar la producción de los cultivos.  
Además, se desplegará un **listado de herramientas registradas**, que permitirá al usuario **visualizar, editar o eliminar** los registros según sea necesario, facilitando una **gestión eficiente y actualizada** de los recursos utilizados en la producción agrícola.

**Diseño:**  
**Página web:**  ![Pagina de registrar herramientas](/imgprototipado/reherra.png) 
**Aplicativo Móvil:** ![Pagina de registrar herramientas](/imgprototipado/reherrac.png) 

## 9. El sistema debe permitir listar herramientas registradas previamente

**Descripción:**  
El sistema listará las herramientas registradas, permitiendo al usuario **acceder a detalles completos** de la información asociada a cada herramienta.  
Esta funcionalidad ofrecerá una **visión más profunda y detallada de los registros**, facilitando su **gestión y consulta**.

**Diseños:**  
- **Página web:** ![Pagina de listar herramientas](/imgprototipado/lisherra.png)  
- **Aplicativo Móvil:**  ![Pagina de listar herramientas](/imgprototipado/lisherrac.png)  

## 10. El sistema debe permitir mostrar y actualizar información de herramientas registradas previamente

**Descripción:**  
El sistema listará las herramientas registradas, brindando al usuario la posibilidad de **actualizar la información** asociada a cada herramienta.  
Esta funcionalidad permitirá **mantener los registros actualizados**, asegurando la **precisión de los datos** en el sistema.

**Diseños:**  
- **Página web:** ![Pagina de actualizar herramientas](/imgprototipado/acherra.png)  
- **Aplicativo Móvil:** ![Pagina de actualizar herramientas](/imgprototipado/acherrac.png)  

## 11. El sistema deberá mostrar en la pantalla de IoT información de todos los sensores en tiempo real

**Descripción:**  
El sistema deberá procesar y mostrar en **tiempo real** los datos de los sensores instalados en el sector agrícola, en un **panel organizado y fácil de interpretar**.  

Las métricas que se deben visualizar incluyen:

- **Velocidad del viento:** mostrar la velocidad actual en km/h  
- **Temperatura:** presentar la temperatura ambiental en grados Celsius  
- **Luz solar:** indicar el estado del cielo y el porcentaje de luz solar captada  
- **Humedad de eras:** reflejar el porcentaje de humedad presente en el suelo de una era  
- **Humedad ambiente:** mostrar niveles de humedad ambiente  
- **Lluvia:** indicar si detecta precipitación y su intensidad  

Cada variable debe actualizarse **en tiempo real** y mostrarse en **cuadros independientes**, con **iconos representativos** que faciliten la rápida identificación.

**Diseños:**

- **Página web:**  ![Pagina de mostrar datos en tiempo real de sensores](/imgprototipado/resen.png)  
- **Aplicativo Móvil:**  ![Pagina de mostrar datos en tiempo real de sensores](/imgprototipado/resenc.png) 
 

## 12. El sistema deberá mostrar la información recogida sobre la humedad ambiente

**Descripción:**  
El sistema mostrará la información sobre la **humedad ambiente** recopilada mediante **sensores IoT**, presentando los datos en **tiempo real** para ofrecer información **precisa y actualizada** sobre los niveles de humedad en el entorno.

**Diseños:**
- **Pagina Web:** ![Pagina de mostrar datos de humedad ambiente](/imgprototipado/humea.png)
- **Aplicativo Móvil:**  ![Pagina de mostrar datos de humedad ambiente](/imgprototipado/humeac.png)

## 13. El sistema deberá mostrar la información recogida sobre la luminosidad

**Descripción:**  
La información sobre la **luminosidad** se obtiene mediante **sensores distribuidos** en varios puntos, que envían datos en **tiempo real** a la base de datos. Estos datos son **procesados y presentados** de forma clara, facilitando la **gestión de las condiciones de iluminación** en el campo.

**Diseños:**

- **Página web:**  ![Pagina de mostrar datos de la luminosidad](/imgprototipado/lum.png)

- **Aplicativo Móvil:** ![Pagina de mostrar datos de la luminosidad](/imgprototipado/lumc.png)  

## 14. El sistema deberá mostrar la información recogida sobre la temperatura

**Descripción:**  
El sistema medirá y mostrará la **temperatura** en las áreas de cultivo utilizando **sensores IoT**. Los datos se recopilarán en **tiempo real** y se presentarán de manera clara, permitiendo a los usuarios monitorear las **condiciones térmicas** y optimizar la gestión de los recursos agrícolas.

**Diseños:**

- **Página web:**  ![Pagina de mostrar datos de la temperatura](/imgprototipado/tem.png) 
- **Aplicativo Móvil:** ![Pagina de mostrar datos de la temperatura](/imgprototipado/temc.png)  

## 15. El sistema deberá mostrar la información recogida sobre la velocidad y dirección del viento

**Descripción:**  
Mediante sensores, se medirá la **velocidad** y **dirección del viento**. Los datos serán capturados en diferentes ubicaciones y enviados en **tiempo real** a una plataforma en la nube para su procesamiento y visualización. Esta información será clave para la planificación de actividades agrícolas sensibles a las condiciones climáticas.

**Diseños:**

- **Página web:**  ![Pagina de mostrar datos de el viento](/imgprototipado/vient.png)   
- **Aplicativo Móvil:** ![Pagina de mostrar datos de el viento](/imgprototipado/vientc.png)  

## 16. El sistema deberá mostrar la información recogida sobre el pH del suelo

**Descripción:**  
El sistema recopilará y mostrará las lecturas de **pH del suelo** mediante **sensores IoT especializados**. Esta información será clave para gestionar la **acidez o alcalinidad del suelo**, lo cual influye directamente en la **salud de las plantas** y en la **eficiencia de absorción de los nutrientes**. Los datos se mostrarán en tiempo real para facilitar la toma de decisiones agronómicas oportunas.

**Diseños:**

- **Página web:**  ![Pagina de mostrar datos recogidos del ph](/imgprototipado/ph.png)   
- **Aplicativo Móvil:** ![Pagina de mostrar datos recogidos del ph](/imgprototipado/phc.png)   

## 17.	EL SISTEMA DEBERÁ MONITOREAR LA EVAPOTRANSPIRACIÓN

**Descripción:**  
El sistema integrará sensores y algoritmos para estimar la evapotranspiración (ET) en las áreas de cultivo, considerando la evaporación del suelo y la transpiración de las plantas. Esta información será esencial para una gestión eficiente del riego.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/evapo.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/evapoc.png)   

## 18.	EL SISTEMA DEBE PERMITIR REGISTRAR, LISTAR Y EDITAR EL NOMBRE Y TIPO DE CULTIVO 

**Descripción:**  
Este formulario tiene como propósito facilitar el registro de nombre del cultivo y tipo de cultivo, para luego ser asignados a los cultivos en el sistema. Está diseñado para permitir a los usuarios ingresar datos básicos, los cuales serán almacenados para su posterior consulta y gestión.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/cul.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/culc.png) 

## 19. EL SISTEMA DEBE PERMITIR EL REGISTRO DE NUEVOS SEMILLEROS MEDIANTE UN FORMULARIO INTERACTIVO.

**Descripción:**  
Los usuarios podrán registrar información sobre los semilleros mediante un formulario interactivo, donde podrán ingresar el número de unidades de semilleros, la fecha de siembra y la fecha estimada de salida a producción.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/sem.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/semc.png) 


## 20.	EL SISTEMA DEBERÁ PERMITIR REGISTRAR, LISTAR Y EDITAR LOS LOTES.

**Descripción:**  
En la sección de lotes, los usuarios podrán registrar nuevos lotes y editar la información de los lotes ya registrados. La opción de edición es esencial para corregir errores, actualizar datos y garantizar la precisión de la información almacenada.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/lote.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/lotec.png.png) 

## 21.	EL SISTEMA DEBERÁ PERMITIR REGISTRAR, LISTAR Y EDITAR LA IMPLEMENTACIÓN DE ERAS EN UN LOTE:

**Descripción:**  
El sistema de eras será diseñado y construido con el objetivo de optimizar el espacio de cultivo y facilitar el mantenimiento de las plantas. Este sistema contribuirá a crear un entorno más eficiente y sostenible para el crecimiento de los cultivos.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/era.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/erac.png) 

## 22.	EL SISTEMA DEBE PERMITIR REGISTRAR, LISTAR Y EDITAR LOS NUEVOS CULTIVOS MEDIANTE UN FORMULARIO.  

**Descripción:**  
El propósito de este formulario es optimizar el registro de nuevos cultivos en el sistema. A través de él, los usuarios podrán ingresar información clave sobre cada cultivo, que será almacenada y organizada para su posterior consulta y gestión eficiente.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/cult.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/cultc.png) 

## 23.	EL SISTEMA DEBE PERMITIR REGISTRAR LAS ACTIVIDADES A REALIZAR EN LOS CULTIVOS

**Descripción:**  
Los usuarios podrán registrar nuevas actividades para los cultivos, proporcionando información clave como el nombre de la actividad, una descripción que sirva de referencia para los aprendices, y la fecha de creación de la actividad.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/acti.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/actic.png) 

## 24.	EL SISTEMA DEBE PERMITIR ASIGNAR, LISTAR Y EDITAR LAS ACTIVIDADES YA REGISTRADAS, QUE SE PUEDEN REALIZAR EN UN CULTIVO

**Descripción:**  
Los instructores podrán asignar nuevas actividades a los cultivos proporcionando detalles como el lote donde se encuentra el cultivo, el cultivo en sí, y la actividad que se va a realizar (por ejemplo, riego, siembra o fertilización). Además, deberán incluir una descripción detallada de la actividad, la fecha programada, y el personal asignado para llevarla a cabo. También se especificarán los insumos y herramientas que se utilizarán durante la actividad, así como el estado en el que se asigna la actividad.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/asig.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/asigc.png) 

## 25.	EL SISTEMA DEBE PERMITIR DAR FINALIZACIÓN A UNA ACTIVIDAD YA REALIZADA

**Descripción:**  
después que la persona termina la actividad que se le asignó debe cambiar el estado de la actividad a lo cual podrá realizar mediante un botón de actualización (icono de actualización), para continuar con este proceso el usuario debe ingresar los datos del tiempo gastado en la actividad (en minutos), la cantidad gastada del insumo que se le asignó, y seleccionar el nuevo estado de la actividad por último dar en ‘finalizar actividad’ para terminar el proceso y dar por terminada la actividad.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/fin.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/finc.png) 

## 26.	EL SISTEMA PERMITIRÁ REGISTRAR LA PRODUCCION OBTENIDA DE UN CULTIVO

**Descripción:**  
El sistema permitirá registrar la producción obtenida de un cultivo, después de realizada la actividad de cosecha donde se debe brindar información como: El cultivo que se recolecto, la cantidad recolectada, la unidad de medida para la recolección, la fecha de recolección y una fotografía de la recolección.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/pro.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/proc.png) 

## 27.	EL SISTEMA PERMITIRÁ REGISTRAR LAS PLAGAS, ENFERMEDADES Y ARVENSES QUE AFECTAN LOS CULTIVOS

**Descripción:**  
El registro debe incluir la fecha de observación, la identificación del organismo (nombre científico y común), su ubicación exacta en el cultivo, el nivel de daño causado, y una descripción detallada de los daños, métodos de erradicación y comentarios adicionales. Este registro tiene como objetivo realizar un control preciso de los organismos presentes en los cultivos, documentando las acciones de erradicación para mejorar la gestión de amenazas y garantizar la salud del cultivo.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/pea.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/peac.png) 

## 28.	EL SISTEMA PERMITIRÁ AL USUARIO LLEVAR EL RESPECTIVO CONTROL FITOSANITARIO DE CADA CULTIVO EN ESPECÍFICO

**Descripción:**  
El objetivo es ofrecer a los usuarios un control fitosanitario eficiente, permitiendo registrar las acciones realizadas. Tras registrar la información sobre la plaga que afecta un cultivo, el usuario podrá acceder al apartado de control fitosanitario para documentar las medidas de eliminación de la plaga o el seguimiento para la recuperación del cultivo.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/confi.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/confic.png) 

## 29.	EL SISTEMA DEBE PERMITIR MOSTRAR AL USUARIO LA INFORMACION SOBRE COMO INFLUYE LAS FASES LUNARES EN EL CULTIVO

**Descripción:**  
El calendario lunar mostrará las fases de la luna (nueva, cuarto creciente, llena y menguante) con una interfaz intuitiva. Incluirá un semáforo interactivo para actividades, y al seleccionar una fecha, se mostrará información relevante y fotos de las plantas. 

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/cal.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/calc.png) 

## 30.	EL SISTEMA HA DE CONTENER UN AREA DE RECORDATORIOS Y EVENTOS POR MEDIO DE UN CALENDARIO INTERACTIVO EN DONDE SE SUMINISTREN NOTAS, FECHAS DE FERTILIZACIÓN O COSECHAS

**Descripción:**  
El sistema ofrecerá un calendario accesible desde la interfaz principal, permitiendo a los usuarios registrar, visualizar y gestionar eventos relacionados con la producción agrícola, como siembra, fertilización, tratamientos fitosanitarios y cosechas. Este calendario contará con una interfaz intuitiva para facilitar la navegación y visualización de eventos. Los usuarios recibirán recordatorios automáticos sobre eventos próximos y podrán personalizar los registros con categorías, etiquetas, descripciones y notas adicionales. Además, será posible modificar o eliminar eventos según sea necesario para ajustar la programación de actividades.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/rec.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/recc.png) 

## 31.	EL SISTEMA DEBE PERMITIR MOSTRAR POR MEDIO DE UN MAPA EL NOMBRE DE CULTIVO CON SU RESPECTIVA DESCRIPCIÓN

**Descripción:**  
Desarrollar un mapa interactivo que registre el historial de cada cultivo. Al seleccionar un sector específico como tomate o cebolla, se desplegará el historial relacionado, incluyendo detalles como riego y abono.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/map.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/mapc.png) 

## 32.	EL SISTEMA DEBE PERMITIR AL ADMINISTRADOR LA ASIGNACIÓN DE ROLES Y PERMISOS.

**Descripción:**  
El sistema debe permitir asignar roles a los usuarios, como administrador, instructor, pasante, operario, o visitante, definiendo los permisos de acceso a diferentes módulos o funcionalidades según el rol asignado.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/rol.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/rolc.png) 

## 33.	EL SISTEMA DEBERÁ PERMITIR REGISTRAR Y ACTUALIZAR EL PRECIO DE PRODUCTO

**Descripción:**  
Permitirá registrar el precio base de un producto al momento de agregarlo al sistema Y provee una interfaz para actualizar los precios de productos existentes, permitiendo registrar cambios Este precio debe incluir información como moneda, impuestos aplicables y vigencia inicial.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/pre.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/prec.png) 

## 34.	EL SISTEMA DEBE DAR UN REGISTRO DETALLADO DE CADA VENTA.

**Descripción:**  
El sistema permite registrar cada transacción de venta, capturando detalles como fecha, producto, cantidad, ingresos y cliente. Esto crea un historial completo que facilita el seguimiento de operaciones comerciales y mejora la gestión de la cartera de clientes.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/ven.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/venc.png) 

## 35.	EL SISTEMA DEBE PERMITIR CALCULAR Y MOSTRAR LA RENTABILIDAD DE CADA CULTIVO.	

**Descripción:**  
El sistema permitirá a los usuarios calcular y comparar la rentabilidad de cada cultivo registrado, basándose en ingresos y egresos. Los resultados se mostrarán tanto en porcentajes como en valores absolutos, detallados por actividad y bancal. Además, incluirá un Resumen General enfocado en un bancal seleccionado, consolidando los datos financieros para facilitar el análisis. Los usuarios tendrán la opción de exportar estos informes en formatos PDF o Excel, optimizando la gestión y toma de decisiones estratégicas.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/ren.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/renc.png) 

## 36.	EL SISTEMA DEBE GENERAR REPORTES DE LOS USUARIOS:

**Descripción:**  
Este reporte analiza el uso de la plataforma "AgroSoft" por parte de los aprendices registrados previamente por el administrador. Presenta datos clave sobre su actividad, satisfacción y problemas frecuentes, con el fin de mejorar la experiencia de aprendizaje y optimizar las funcionalidades más utilizadas.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/reus.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/reusc.png) 

## 17.	EL SISTEMA DEBERÁ MONITOREAR LA EVAPOTRANSPIRACIÓN

**Descripción:**  
El sistema integrará sensores y algoritmos para estimar la evapotranspiración (ET) en las áreas de cultivo, considerando la evaporación del suelo y la transpiración de las plantas. Esta información será esencial para una gestión eficiente del riego.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/evapo.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/evapoc.png) 


## 37.	EL SISTEMA DEBE PERMITIR HACER REPORTES DE LOS INSUMOS PREVIAMENTE REGISTRADOS:

**Descripción:**  
El sistema debe permitir visualizar todos los datos de los insumos registrados, enlistando cada producto con detalles como nombre, cantidad disponible, fecha de caducidad, y otras características relevantes. Esta visualización proporcionará una descripción clara de los insumos, facilitando su gestión y permitiendo un control eficiente sobre los recursos disponibles.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/reins.png)   


## 38.	EL SISTEMA DEBERÁ GENERAR UN REPORTE DE LOS DATOS TOMADOS EN TIEMPO REAL (SENSORES)

**Descripción:**  
El sistema generará un reporte con los datos tomados en tiempo real por los sensores, incluyendo información sobre humedad del suelo, humedad ambiente, temperatura, viento, luminosidad, pH y pluviómetro. Los datos serán presentados de manera clara y organizada mediante gráficas, permitiendo a los usuarios analizar las condiciones del entorno de los cultivos.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/repsen.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/repsenc.png) 


## 39.	EL SISTEMA DEBE GENERAR UN REPORTE DE LAS ACTIVIDADES REALIZADAS:

**Descripción:**  
El sistema debe permitir la generación de un reporte detallado de las actividades realizadas en cada cultivo. este reporte servirá para monitorear el historial de mantenimiento y cuidado de cada cultivo, facilitando la trazabilidad y el análisis de las prácticas agrícolas realizadas

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/reasi.png)   


## 40.	EL SISTEMA GENERARÁ UN REPORTE DE LOS REGISTROS DE CONTROLES QUE SE LES LLEVÓ A LA PLAGAS, ENFERMEDADES O ARVENSE PRESENTE EN EL CULTIVO

**Descripción:**  
El sistema deberá generar un PDF, con los reportes de los controles que se llevaron a cabo para erradicar las enfermedades, plagas o arvenses presentes en los cultivos. Al conocer los controles que se le realizaron, permitirá llevar un seguimiento detallado del cultivo. 

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/recon.png)    


## 41.	EL SISTEMA DEBE PERMITIR LA GENERACIÓN DE UN INFORME DE INGRESOS DETALLADO POR CADA PRODUCTO VENDIDO.

**Descripción:**  
El sistema genera un reporte que desglosa las ventas de cada producto, incluyendo unidades vendidas, ingresos totales y margen de ganancia. Este informe permite analizar el rendimiento comercial de los productos y tomar decisiones informadas para mejorar las estrategias de venta.

**Diseños:**

- **Página web:**  ![Pagina web](/imgprototipado/reing.png)   
- **Aplicativo Móvil:** ![aplicativo movil](/imgprototipado/reingc.png) 

