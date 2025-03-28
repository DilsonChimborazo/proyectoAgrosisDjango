---
title: "Crear herramienta"
description: "Crea herramienta nueva para el sistema."
---


## Descripción:
Solicitud utilizada para el registro de nuevas herramientas.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/herramienta/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_h": "Taladro eléctrico",
    "fecha_prestamo": "2025-05-12",
    "estado": "Disponible"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id             | number | ✅       | Id de la herramienta  |
| nombre_h       | text   | ✅       | Nombre de la herramienta      |
| fecha_prestamo | date   | ✅       | Fecha prestao de la herramienta      |
| estado         | string | ✅       | Estado en el que se encuentra la herramienta      |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_h": "Taladro eléctrico",
    "fecha_prestamo": "2025-05-12",
    "estado": "Disponible"
}
```

:::markdown
| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id             | number | ✅       | Id de la herramienta  |
| nombre_h       | text   | ✅       | Nombre de la herramienta      |
| fecha_prestamo | date   | ✅       | Fecha prestao de la herramienta      |
| estado         | string | ✅       | Estado en el que se encuentra la herramienta      |
:::


### **Códigos de respuesta**
- **201**: Herramienta creada con éxito, devuelve el array de la herramienta registrada.
- **400**: Datos incorrectos o faltantes
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden registrar nuevas herramientas al sistema. Los aprendices no tienen permisos para modificar esta información.