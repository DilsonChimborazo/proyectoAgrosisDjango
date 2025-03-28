---
title: "Crear asignación de actividad"
description: "Registra la asignación de actividades a usuarios en el sistema."
---

## Descripción:
Solicitud utilizada para el registro de asignaciones de actividades a usuarios.

---

## Metodo: 
```
 POST
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/asignacion_actividad/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "id_asignacion_actividad": 1,
    "fecha": "2025-04-15",
    "fk_id_actividad": 2,
    "fk_identificacion": 1234567891
}
```

| Campo                  | Tipo    | Requerido | Descripción                            |
|------------------------|---------|-----------|------------------------------------------|
| id_asignacion_actividad | integer | ✅        | Identificador de la asignación         |
| fecha                 | string  | ✅        | Fecha de la asignación en formato YYYY-MM-DD |
| fk_id_actividad       | integer | ✅        | Identificador de la actividad asignada  |
| fk_identificacion     | integer  | ✅        | Identificación del usuario asignado    |

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id_asignacion_actividad": 1,
    "fecha": "2025-04-15",
    "fk_id_actividad": 2,
    "fk_identificacion": 1234567891
}
```

:::markdown
| Campo                  | Tipo    | Descripción                            |
|------------------------|---------|------------------------------------------|
| id_asignacion_actividad | integer | Identificador de la asignación         |
| fecha                 | string  | Fecha de la asignación en formato YYYY-MM-DD |
| fk_id_actividad       | integer | Identificador de la actividad asignada  |
| fk_identificacion     | string  | Identificación del usuario asignado    |
:::

### **Códigos de respuesta**
- **201**: Asignación creada con éxito, devuelve el array de la asignación registrada.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar la información de asignaciones. Los usuarios solo pueden visualizar sus asignaciones.

