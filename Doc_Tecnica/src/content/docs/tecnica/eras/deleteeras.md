---
title: "Eliminar Era"
description: "Emininar una era del sistema."
---


## Descripción:
Solicitud utilizada la Eliminacion a una era en especifico registrada en el sistema.

---


## Metodo: 
```
 DELETE
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/eras/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id | string | ✅       | Identificador de la era   |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Era eliminada con exito",
}
```

### **Códigos de respuesta**
- **201**: Eliminacion exitosa.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:**  Solo los administradores o usuarios con permisos pueden eliminar una era en el sistema.

