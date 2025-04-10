---
title: "Prototipado del sistema - Agrosoft"
description: "Documento técnico versión 1.0 para el sistema Agrosoft."
pubDate: 2024-10-09
author: Juan David Bolaños
---

## HISTORIAL DE REVISIÓN

| VERSIÓN | FECHA | RESPONSABLE | FECHA REVISIÓN | RESPONSABLE REVISIÓN |
|---------|-------|-------------|----------------|-----------------------|
| 1.0     | 2024/10/09 | Juan david bolaños | 2024/10/09 | Carlos Sterling |

---

## CAMBIOS RESPECTO A LA VERSIÓN ANTERIOR

| VERSIÓN | MODIFICACIÓN RESPECTO VERSIÓN ANTERIOR |
|---------|-----------------------------------------|
|    1    | Modificacion en todo el archivo por escritura |

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

En el contexto de la producción agrícola moderna, resulta fundamental contar con sistemas de gestión eficientes que permitan optimizar los procesos y asegurar un control riguroso de las actividades relacionadas con el cultivo. En este sentido, la Corporación de Gestión y Desarrollo Sostenible (C.G.D.S.S.) y sus áreas de influencia requieren de una herramienta tecnológica que facilite el seguimiento integral de las prácticas agrícolas, promoviendo un uso responsable y sostenible de los recursos.

El presente documento tiene como objetivo proponer el desarrollo de un sistema de gestión orientado al monitoreo y control de actividades clave en la producción agrícola, tales como el cuidado de las plantas, la gestión del riego, la aplicación de fertilizantes, el uso de insumos y el seguimiento de cultivos. Este sistema busca no solo simplificar el registro y la administración de estas actividades, sino también proporcionar información actualizada y precisa que respalde la toma de decisiones estratégicas.

Además, se prioriza la facilidad de uso del sistema para garantizar que los usuarios puedan interactuar con la plataforma de forma intuitiva, generando informes detallados que contribuyan a la mejora continua de los procesos agrícolas en la región. A través de esta herramienta, se espera fomentar prácticas agrícolas más eficientes y sostenibles, impulsando así un desarrollo agrícola más productivo y respetuoso con el medio ambiente.

## 1.1 Propósito

El presente documento tiene como objetivo detallar los requerimientos funcionales necesarios para el desarrollo de un sistema de información destinado a la gestión integral de cultivos en la unidad productiva PAE. Dichos requerimientos buscan asegurar que el sistema propuesto cumpla con las necesidades específicas de la unidad, abordando de manera eficiente aspectos esenciales como el monitoreo de cultivos, la gestión de inventario, la planificación de siembras, el control de plagas y enfermedades, así como la optimización del uso de recursos hídricos y nutrientes.

Asimismo, el sistema deberá proporcionar herramientas intuitivas y accesibles que faciliten una interacción ágil y efectiva por parte de los usuarios, permitiendo un manejo óptimo de la información relevante para la gestión agrícola. La implementación de este sistema no solo está orientada a mejorar la eficiencia operativa, sino también a ofrecer análisis e informes detallados que apoyen la toma de decisiones estratégicas en la unidad productiva PAE.

## 1.2 Alcance

El nuevo sistema de gestión agrícola para la Corporación de Gestión y Desarrollo Sostenible (C.G.D.S.S.) y sus áreas de influencia está diseñado para optimizar el monitoreo y la administración de las actividades agrícolas. El sistema se estructurará en cuatro módulos principales: Internet de las Cosas (IoT), Actividades, Finanzas e Inventario.

Estos módulos permitirán un control integral de procesos críticos, tales como el riego automatizado, la fertilización precisa, el cuidado de las plantas y la gestión eficiente de insumos. Gracias a esta estructura modular, el sistema no solo mejorará la eficiencia en la gestión de recursos, sino que también proporcionará datos clave para respaldar decisiones estratégicas y fomentar prácticas agrícolas más sostenibles.

## 1.3 Responsables e involucrados

| Nombre                     | Tipo (Responsable/Involucrado) | Rol           |
|---------------------------|----------------------------------|---------------|
| Juan David Bolaños        | Aprendiz                         | Desarrollador |
| Dilson Chimborazo Pérez   | Aprendiz                         | Líder y desarrollador |
| Xiomara Sabi Rojas        | Aprendiz                         | Desarrollador |
| Wilson Eduardo Samboni    | Aprendiz                         | Desarrollador |
| Lucy Fernanda Rodriguez   | Aprendiz                         | Desarrollador |
| Francisco Javier Urbano   | Aprendiz                         | Desarrollador |
| Yanira Jimenez Martinez   | Aprendiz                         | Desarrollador |

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

## 12. El sistema deberá mostrar la información recogida sobre la humedad de las eras

**Descripción:**  
El sistema utilizará tecnología **IoT** para recopilar y transmitir en **tiempo real** los datos sobre la **humedad en las eras**. Esta información será presentada de manera **clara y accesible**, permitiendo a los usuarios **monitorear y gestionar eficientemente** la humedad del suelo en las áreas de cultivo.

**Diseños:**

- **Página web:** ![Pagina de mostrar datos de humedad de las eras](/imgprototipado/hume.png)
- **Aplicativo Móvil:** ![Pagina de mostrar datos de humedad de las eras](/imgprototipado/humec.png)  

## 13. El sistema deberá mostrar la información recogida sobre la humedad ambiente

**Descripción:**  
El sistema mostrará la información sobre la **humedad ambiente** recopilada mediante **sensores IoT**, presentando los datos en **tiempo real** para ofrecer información **precisa y actualizada** sobre los niveles de humedad en el entorno.

**Diseños:**
- **Pagina Web:** ![Pagina de mostrar datos de humedad ambiente](/imgprototipado/humea.png)
- **Aplicativo Móvil:**  ![Pagina de mostrar datos de humedad ambiente](/imgprototipado/humeac.png)

## 14. El sistema deberá mostrar la información recogida sobre la luminosidad

**Descripción:**  
La información sobre la **luminosidad** se obtiene mediante **sensores distribuidos** en varios puntos, que envían datos en **tiempo real** a la base de datos. Estos datos son **procesados y presentados** de forma clara, facilitando la **gestión de las condiciones de iluminación** en el campo.

**Diseños:**

- **Página web:**  ![Pagina de mostrar datos de la luminosidad](/imgprototipado/lum.png)

- **Aplicativo Móvil:** ![Pagina de mostrar datos de la luminosidad](/imgprototipado/lumc.png)  

## 15. El sistema deberá mostrar la información recogida sobre la lluvia

**Descripción:**  
Mediante un **pluviómetro**, se medirá la cantidad de lluvia en un área específica durante un período determinado. Este instrumento proporcionará datos sobre la **cantidad, intensidad, frecuencia y duración** de la lluvia en la ubicación seleccionada.

**Diseños:**

- **Página web:** ![Pagina de mostrar datos de la lluvia](/imgprototipado/llu.png) 

- **Aplicativo Móvil:**  ![Pagina de mostrar datos de la lluvia](/imgprototipado/lluc.png) 

## 16. El sistema deberá mostrar la información recogida sobre la temperatura

**Descripción:**  
El sistema medirá y mostrará la **temperatura** en las áreas de cultivo utilizando **sensores IoT**. Los datos se recopilarán en **tiempo real** y se presentarán de manera clara, permitiendo a los usuarios monitorear las **condiciones térmicas** y optimizar la gestión de los recursos agrícolas.

**Diseños:**

- **Página web:**  ![Pagina de mostrar datos de la temperatura](/imgprototipado/tem.png) 
- **Aplicativo Móvil:** ![Pagina de mostrar datos de la temperatura](/imgprototipado/temc.png)  

## 17. El sistema deberá mostrar la información recogida sobre la velocidad y dirección del viento

**Descripción:**  
Mediante sensores, se medirá la **velocidad** y **dirección del viento**. Los datos serán capturados en diferentes ubicaciones y enviados en **tiempo real** a una plataforma en la nube para su procesamiento y visualización. Esta información será clave para la planificación de actividades agrícolas sensibles a las condiciones climáticas.

**Diseños:**

- **Página web:**  ![Pagina de mostrar datos de el viento](/imgprototipado/vient.png)   
- **Aplicativo Móvil:** ![Pagina de mostrar datos de el viento](/imgprototipado/vientc.png)  

## 18. El sistema deberá mostrar la información recogida sobre el pH del suelo

**Descripción:**  
El sistema recopilará y mostrará las lecturas de **pH del suelo** mediante **sensores IoT especializados**. Esta información será clave para gestionar la **acidez o alcalinidad del suelo**, lo cual influye directamente en la **salud de las plantas** y en la **eficiencia de absorción de los nutrientes**. Los datos se mostrarán en tiempo real para facilitar la toma de decisiones agronómicas oportunas.

**Diseños:**

- **Página web:**  ![Pagina de mostrar datos recogidos del ph](/imgprototipado/ph.png)   
- **Aplicativo Móvil:** ![Pagina de mostrar datos recogidos del ph](/imgprototipado/phc.png)   


















