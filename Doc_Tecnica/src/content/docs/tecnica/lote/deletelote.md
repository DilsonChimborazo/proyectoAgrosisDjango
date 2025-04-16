---
title: "Eliminar Lote"
description: "Eliminar un lote registrado en el sistema."
---


## Descripción:
Solicitud utilizada  para eliminar un lote.

---


## Metodo: 
```
 DELETE
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/lote/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:


| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id      | integer| ✅       | Id del lote  |


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

📄 **Nota:** Solo los administradores o usuarios con permisos pueden eliminar los lotes en el sistema.

