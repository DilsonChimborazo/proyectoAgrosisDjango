---
title: "Obtener Todos los Semilleros"
description: "Obtiene todos los registros de semilleros registrados en el sistema."
---

## Descripción:
Solicitud utilizada para obtener todos los registros de semilleros registrados en el sistema.

---

## Método: 
```
GET
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/semilleros
```

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **200** con la siguiente estructura:

```json
[
    {
        "id_semillero": 1,
        "nombre_semilla": "Maíz",
        "fecha_siembra": "2025-04-10",
        "fecha_estimada": "2025-06-15",
        "cantidad": 100
    },
    {
        "id_semillero": 2,
        "nombre_semilla": "Frijol",
        "fecha_siembra": "2025-03-20",
        "fecha_estimada": "2025-05-30",
        "cantidad": 200
    }
]
```

:::markdown
| Campo           | Tipo    | Descripción                                  |
|----------------|---------|----------------------------------------------|
| id_semillero   | integer | Identificación del semillero                 |
| nombre_semilla | string  | Nombre de la semilla                         |
| fecha_siembra  | string  | Fecha de siembra en formato YYYY-MM-DD       |
| fecha_estimada | string  | Fecha estimada de cosecha en formato YYYY-MM-DD |
| cantidad       | integer | Cantidad de semillas sembradas               |
:::

### **Códigos de respuesta**
- **200**: Consulta exitosa, devuelve la lista de semilleros.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden obtener información sobre los semilleros en el sistema.