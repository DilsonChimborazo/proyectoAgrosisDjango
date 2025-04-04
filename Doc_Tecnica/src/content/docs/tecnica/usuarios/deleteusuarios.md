---
title: "Eliminar usuarios"
description: "Elimina a un usuario especifico registrado en el sistema."
---


## Descripción:
Solicitud utilizada la Eliminacion a un usuario especifico registrado en el sistema.

---


## Metodo: 
```
 DELETE
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/usuario/{identificacion}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:


| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| identificacion | integer| ✅       | Identificación del usuario  |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Usuario eliminado con exito",
}
```


### **Códigos de respuesta**
- **201**: Eliminacion exitosa, 
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Los usuarios deben ser creados por un administrados o instructor, los aprendices no se les permite
registar usuarios en el sistema.



