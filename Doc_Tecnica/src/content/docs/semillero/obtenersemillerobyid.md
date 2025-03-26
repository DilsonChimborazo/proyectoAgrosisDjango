---
title: "Obtener Semillero por ID"
description: "Obtiene un semillero específico registrado en el sistema mediante su ID."
---

## Descripción:
Solicitud utilizada para obtener los datos de un semillero registrado en el sistema mediante su identificador único.

---

## Método:
```
GET
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/semillero/{id_semillero}
```

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **200** con la siguiente estructura:

```json
{
    "id_semillero": 1,
    "nombre_semilla": "Maíz",
    "fecha_siembra": "2025-04-10",
    "fecha_estimada": "2025-06-15",
    "cantidad": 100
}
```

:::markdown
| Campo          | Tipo    | Descripción                                        |
|---------------|---------|----------------------------------------------------|
| id_semillero  | integer | Identificación única del semillero                 |
| nombre_semilla | string  | Nombre de la semilla sembrada                      |
| fecha_siembra | string  | Fecha en que se realizó la siembra (YYYY-MM-DD)    |
| fecha_estimada | string  | Fecha estimada de cosecha (YYYY-MM-DD)             |
| cantidad      | integer | Cantidad de semillas sembradas                      |
:::

### **Códigos de respuesta**
- **200**: Consulta exitosa, devuelve los datos del semillero.
- **400**: Solicitud incorrecta.
- **404**: Semillero no encontrado.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden obtener información sobre los semilleros en el sistema.

