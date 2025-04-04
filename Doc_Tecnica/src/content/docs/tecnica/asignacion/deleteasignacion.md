---
title: "Eliminar Asignación de Actividad"
description: "Elimina una asignación de actividad específica registrada en el sistema."
---

## Descripción:
Solicitud utilizada para la eliminación de una asignación de actividad específica registrada en el sistema.

---

## Método: 
```
DELETE
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/asignacion_actividad/{id_asignacion_actividad}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

:::markdown
| Campo                  | Tipo    | Requerido | Descripción                                  |
|------------------------|---------|-----------|----------------------------------------------|
| id_asignacion_actividad | integer | ✅       | Identificación de la asignación de actividad |
:::

## **Respuesta**

Si la eliminación es exitosa, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Asignación de actividad eliminada con éxito"
}
```

### **Códigos de respuesta**
- **201**: Eliminación exitosa.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

🗄 **Nota:** Solo los administradores o instructores pueden eliminar asignaciones de actividad en el sistema.

