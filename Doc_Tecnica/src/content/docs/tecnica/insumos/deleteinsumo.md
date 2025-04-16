---
title: "Eliminar insumo"
description: "Elimina un insumo especific registrado en el sistema."
---


## Descripción:
Solicitud utilizada la Eliminacion un insumo especifico registrado en el sistema.

---


## Metodo: 
```
 DELETE
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/insumo/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:


| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id             | number | ✅       | Identificador único del insumo a eliminar  |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Insumo eliminado con éxito"
}
```


### **Códigos de respuesta**
- **201**: Eliminacion exitosa, 
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden eliminar insumos del sistema.
