---
title: "Actualizar Asignación de Actividad"
description: "Actualiza los datos de una asignación de actividad ya registrada en el sistema."
---

## Descripción:
Solicitud utilizada para la actualización de los datos de una asignación de actividad ya registrada previamente.

---

## Método: 
```
PUT
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/asignacion_actividad/{id_asignacion_actividad}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "id_asignacion_actividad": 1,
    "fecha": "2025-04-05",
    "fk_id_actividad": 2,
    "fk_identificacion": 123456789
}
```

:::markdown
| Campo                  | Tipo    | Requerido | Descripción                                  |
|------------------------|---------|-----------|----------------------------------------------|
| id_asignacion_actividad | integer | ✅       | Identificación de la asignación de actividad |
| fecha                 | string  | ✅       | Fecha de la asignación (YYYY-MM-DD)         |
| fk_id_actividad       | integer | ✅       | Identificación de la actividad asignada     |
| fk_identificacion     | integer  | ✅       | Identificación del usuario asignado         |
:::

## **Respuesta**

Si la actualización es exitosa, recibirás un código **201** con la siguiente estructura:

```json
{
    "id_asignacion_actividad": 1,
    "fecha": "2025-04-05",
    "fk_id_actividad": 2,
    "fk_identificacion": 123456789
}
```

### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve los datos de la asignación actualizada.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

🗄 **Nota:** Solo los administradores o instructores pueden actualizar asignaciones de actividad en el sistema.