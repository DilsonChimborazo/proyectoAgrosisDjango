---
title: "Obtener Ficha por ID"  
description: "Obtiene un registro de ficha específico por su identificador."
---
## Descripción:
Solicitud utilizada para obtener un registro de ficha específico en el sistema mediante su identificador único.

## Metodo: 
```
GET
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/ficha/obtenerfichabyid/<numero_ficha>/
```

### **Cuerpo de la solicitud**
No se requiere cuerpo de solicitud.

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "numero_ficha": 1,
    "nombre_ficha": "Ficha de Programación",
    "abreviacion": "PROG",
    "fecha_inicio": "2025-06-11T11:40:00-05:00",
    "fecha_salida": "2025-06-11T11:40:00-05:00",
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
- **201**: Consulta exitosa, devuelve los datos de la ficha.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden obtener información sobre una ficha específica en el sistema.