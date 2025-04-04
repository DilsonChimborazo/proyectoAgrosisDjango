---
title: "Eliminar roles"
description: "Elimina a un rol especifico registrado en el sistema."
---


## Descripción:
Solicitud utilizada la Eliminacion a un rol especifico registrado en el sistema.

---


## Metodo: 
```
 DELETE
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/rol/{id_rol}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:


| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id_rol | number | ✅       | id del rol  |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Rol eliminado con exito",
}
```


### **Códigos de respuesta**
- **201**: Eliminacion exitosa, 
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Los roles deben ser creados por un administrados o instructor, los aprendices no se les permite
registar usuarios en el sistema.



