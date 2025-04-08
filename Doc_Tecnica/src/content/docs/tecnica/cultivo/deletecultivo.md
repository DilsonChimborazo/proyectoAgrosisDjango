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
## **Cabecera de la solicitud**
Incluye los siguientes encabezados en la solicitud:
```
Content-Type: application/json
Authorization: Bearer "tu_token_aquí"
```
|Encabezado	Requerido | Descripción  |
|-------------------- |--------------|
|Content-Type	      |✅	Indica que el cuerpo de la solicitud es JSON.
|Authorization        |❌	Token de autenticación si es necesario.


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
