---
title: "Eliminar herramienta"
description: "Elimina una herramienta especifica registrada en el sistema."
---


## Descripción:
Solicitud utilizada la Eliminacion a una herramienta especifica registrada en el sistema.

---


## Metodo: 
```
 DELETE
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/herramienta/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:


| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id             | number | ✅       | Identificador único de la herramienta  |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Herramienta eliminada con éxito"
}
```


### **Códigos de respuesta**
- **201**: Eliminacion exitosa, 
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden eliminar herramientas del sistema. Los aprendices no tienen permisos para realizar esta acción.
