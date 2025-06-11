---
title: "Crear Ficha"  
description: "Registra una nueva ficha en el sistema."
---
## Descripción:
Solicitud utilizada para el registro de nuevas fichas en el sistema.

## Metodo: 
```
POST
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/ficha/crearficha/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_ficha": "Ficha de Programación",
    "abreviacion": "PROG",
    "fecha_inicio": "2025-06-11T11:36:00-05:00",
    "fecha_salida": "2025-06-11T11:36:00-05:00",
    "is_active": true
}
```

| Campo             | Tipo    | Requerido | Descripción                                      |
|------------------|---------|-----------|--------------------------------------------------|
| nombre_ficha     | string  | ✅        | Nombre descriptivo de la ficha                  |
| abreviacion      | string  | ❌        | Abreviación de la ficha (máximo 10 caracteres)  |
| fecha_inicio     | datetime | ❌        | Fecha y hora de inicio de la ficha              |
| fecha_salida     | datetime | ❌        | Fecha y hora de salida de la ficha              |
| is_active        | boolean | ❌        | Indica si la ficha está activa                  |

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "numero_ficha": 1,
    "nombre_ficha": "Ficha de Programación",
    "abreviacion": "PROG",
    "fecha_inicio": "2025-06-11T11:36:00-05:00",
    "fecha_salida": "2025-06-11T11:36:00-05:00",
    "is_active": true
}
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
- **201**: Ficha creada con éxito, devuelve el array de la ficha registrada.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden crear fichas en el sistema.

---
