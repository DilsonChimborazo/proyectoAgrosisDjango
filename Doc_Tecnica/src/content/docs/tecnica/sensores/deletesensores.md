---
title: "Eliminar sensor"
description: "Eliminar los sensores en el sistema"
---


## Descripción:
Solicitud utilizada  para eliminar un sensor del sistema.

---


## Metodo: 
```
 DELETE
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/sensores/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id    | integer | ✅       | Identificador del sensor |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Lote eliminado con exito",
}
```

### **Códigos de respuesta**
- **201**: Eliminacion exitosa
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden eliminar un sensor en el sistema.



