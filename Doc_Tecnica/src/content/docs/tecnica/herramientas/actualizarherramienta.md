---
title: "Actulizar herramienta"
description: "Actualiza los datos de una herramienta ya registrada en el sistema."
---


## Descripción:
Solicitud utilizada la actualizacion de los datos de una herramienta ya registrada previamente.

---


## Metodo: 
```
 PUT
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/herramientas/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
   "id": 1,
    "nombre_h": "Taladro eléctrico",
    "fecha_prestamo": "2025-05-12",
    "estado": "Disponible"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id             | number | ✅       | Identificador único de la herramienta   |
| nombre_h       | text   | ✅       | Nombre de la herramienta      |
| fecha_prestamo | date   | ✅       | Fecha de prestao de la herramienta     |
| estado         | string | ✅       | Estado actual de la herramienta     |

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
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| id             | number | Identificador único de la herramienta   |
| nombre_h       | string | Nombre de la herramienta      |
| fecha_prestamo | string | Fecha de prestamo de la herramienta      |
| estado         | number | Estado actual la herramienta    |
:::


### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve el array de la herramienta actualizada.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:**  Solo los administradores pueden actualizar la información de la herramienta. Los aprendices no tienen permisos para modificar esta información.


