---
title: "Eliminar Evento del Calendario Lunar"
description: "Elimina un evento específico del calendario lunar registrado en el sistema."
---

## Descripción:
Solicitud utilizada para la eliminación de un evento específico del calendario lunar registrado en el sistema.

---

## Método: 
```
DELETE
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/calendario-lunar/{id_calendario_lunar}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

| Campo                | Tipo    | Requerido | Descripción                          |
|----------------------|---------|-----------|--------------------------------------|
| id_calendario_lunar | integer | ✅        | Identificación del evento en el calendario lunar |

## **Respuesta**

Si la eliminación es exitosa, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Evento del calendario lunar eliminado con éxito"
}
```

### **Códigos de respuesta**
- **201**: Eliminación exitosa.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden eliminar eventos del calendario lunar en el sistema.