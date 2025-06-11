---
title: "Actualizar Ficha por Campo Específico"  
description: "Actualiza campos específicos de un registro de ficha existente en el sistema."
---
## Descripción:
Solicitud utilizada para actualizar uno o más campos específicos de un registro de ficha existente en el sistema.

## Metodo: 
```
PATCH
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/ficha/patchficha/<numero_ficha>/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_ficha": "Ficha de Desarrollo Web",
    "is_active": false
}
```

| Campo             | Tipo    | Requerido | Descripción                                      |
|------------------|---------|-----------|--------------------------------------------------|
| nombre_ficha     | string  | ❌        | Nombre descriptivo de la ficha                  |
| abreviacion      | string  | ❌        | Abreviación de la ficha (máximo 10 caracteres)  |
| fecha_inicio     | datetime | ❌        | Fecha y hora de inicio de la ficha              |
| fecha_salida     | datetime | ❌        | Fecha y hora de salida de la ficha              |
| is_active        | boolean | ❌        | Indica si la ficha está activa                  |

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "numero_ficha": 1,
    "nombre_ficha": "Ficha de Desarrollo Web",
    "abreviacion": "PROG",
    "fecha_inicio": "2025-06-11T11:41:00-05:00",
    "fecha_salida": "2025-06-11T11:41:00-05:00",
    "is_active": false
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
- **201**: Ficha actualizada con éxito, devuelve el array de la ficha actualizada.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden actualizar campos específicos de fichas en el sistema.