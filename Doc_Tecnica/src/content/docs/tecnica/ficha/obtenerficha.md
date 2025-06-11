---
title: "Obtener Fichas"
description: "Obtiene todos los registros de fichas registrados en el sistema."
---

## Descripción:
Solicitud utilizada para obtener todos los registros de fichas registrados en el sistema.

---

## Método: 
```
GET
```

---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/ficha/
```

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **201** con la siguiente estructura:

```json
[
    {
        "numero_ficha": 1,
        "nombre_ficha": "Ficha de Programación",
        "abreviacion": "PROG",
        "fecha_inicio": "2025-06-11T11:07:00Z",
        "fecha_salida": "2025-06-11T11:07:00Z",
        "is_active": true
    }
]
```

:::markdown
| Campo             | Tipo    | Descripción                                      |
|------------------|---------|--------------------------------------------------|
| numero_ficha     | integer | Identificación única de la ficha                |
| nombre_ficha     | string  | Nombre descriptivo de la ficha                  |
| abreviacion      | string  | Abreviación de la ficha (máximo 10 caracteres)  |
| fecha_inicio     | datetime | Fecha y hora de inicio de la ficha              |
| fecha_salida     | datetime | Fecha y hora de salida de la ficha              |
| is_active        | boolean | Indica si la ficha está activa                  |
:::

### **Códigos de respuesta**
- **201**: Consulta exitosa, devuelve los datos de las fichas.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden obtener información sobre las fichas en el sistema.

---
