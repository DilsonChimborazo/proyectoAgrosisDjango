---
title: "Obtener herramienta"
description: "Obtiene una lista de las herramientas que estan registradas dentro del sistema."
---


## Descripción:
Solicitud utilizada para obtener todas las herramientas que estan registradas dentro del sistema.

---


## Metodo: 
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/herramienta/
```

### **Cuerpo de la solicitud**

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
[
    {
        "id": 1,
        "nombre_h": "Taladro eléctrico",
        "fecha_prestamo": "2025-05-12",
        "estado": "Disponible"
    },
    {
        "id": 2,
        "nombre_h": "Llave inglesa",
        "fecha_prestamo": "2025-06-01",
        "estado": "En uso"
    }
]
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
- **201**: Autenticación exitosa, devuelve el array de la lista de herramienta obtenida.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los usuarios autorizados pueden consultar la lista de herramientas.