---
title: "Eliminar Cultivo"
description: "Elimina un cultivo específico registrado en el sistema."
---


## Descripción:
Solicitud utilizada para la eliminación de un cultivo específico registrado en el sistema.

---


## Metodo: 
```
 DELETE
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/cultivo/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:


| Campo          | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id             | integer | ✅       | Id del cultivo |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Cultivo eliminado con exito",
}
```


### **Códigos de respuesta**
- **201**: Eliminacion exitosa, 
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden eliminar cultivos. Los usuarios sin permisos adecuados no podrán realizar esta acción.



