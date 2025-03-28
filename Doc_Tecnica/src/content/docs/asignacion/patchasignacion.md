---
title: "Actualizar Asignación de Actividad (PATCH)"
description: "Actualiza parcialmente los datos de una asignación de actividad en el sistema."
---

## Descripción:
Solicitud utilizada para la actualización parcial de una asignación de actividad ya registrada en el sistema.

---

## Método:
```
PATCH
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/asignacion_actividad/{id_asignacion_actividad}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los campos que deseas actualizar. Por ejemplo, si solo deseas actualizar la fecha:

```json
{
    "fecha": "2025-05-02"
}
```

| Campo                  | Tipo    | Requerido | Descripción                                  |
|------------------------|---------|-----------|----------------------------------------------|
| fecha                  | string  | ❌       | Fecha de la asignación (YYYY-MM-DD)         |
| fk_id_actividad        | integer | ❌       | Identificador de la actividad asignada      |
| fk_identificacion      | string  | ❌       | Identificación del usuario asignado         |

> **Nota**: Todos los campos son opcionales, ya que PATCH permite actualizar de forma parcial.

## **Respuesta**

Si la actualización es exitosa, recibirás un código **200** con la siguiente estructura:

```json
{
    "id_asignacion_actividad": 1,
    "fecha": "2025-05-02",
    "fk_id_actividad": 2,
    "fk_identificacion": "123456789"
}
```

| Campo                  | Tipo    | Descripción                                  |
|------------------------|---------|----------------------------------------------|
| id_asignacion_actividad | integer | Identificación de la asignación de actividad |
| fecha                  | string  | Fecha de la asignación (YYYY-MM-DD)         |
| fk_id_actividad        | integer | Identificación de la actividad asignada      |
| fk_identificacion      | string  | Identificación del usuario asignado          |

### **Códigos de respuesta**
- **200**: Actualización exitosa, devuelve los datos de la asignación actualizada.
- **400**: Datos incorrectos o faltantes.
- **404**: Asignación no encontrada.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden actualizar la información de las asignaciones de actividad. Los usuarios normales solo pueden visualizarlas.