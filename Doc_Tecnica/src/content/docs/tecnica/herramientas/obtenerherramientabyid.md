---
title: "Obtener herramienta por id"
description: "Obtiene la herramienta registrada dentro del sistema mediante su identificador único."
---


## Descripción:
Solicitud utilizada para obtener la informacion especifica de una herramienta que esta registrada dentro del sistema mediante su id.

---


## Metodo: 
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/herramienta/{id}
```

### **Cuerpo de la solicitud**

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
| id             | number | Identificador único de la herramienta  |
| nombre_h       | text   | Nombre de la herramienta     |
| fecha_prestamo | date   | Fecha de préstamo de la herramienta     |
| estado         | string | Estado actual de la herramienta   |
:::


### **Códigos de respuesta**
- **201**: Autenticación exitosa, devuelve el array a la herramienta obtenida por id.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los usuarios autorizados pueden consultar la información de una herramienta específica.