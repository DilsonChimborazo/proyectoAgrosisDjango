---
title: "Eliminar Control Fitosanitario"
description: "Eliminar un control fitosanitario registrado en el sistema."
---

## Descripción:

Solicitud utilizada para la eliminacion de controles fitosanitarios no deseados.

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
http://127.0.0.1:8000/api/control_fitosanitario/{id}
```
### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:
`

| Campo           | Tipo   | Requerido | Descripción                |
|---------------- |--------|-----------|---------------------------|
| id              | integer | ✅      | id del control fitosanitario|


## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Control Fitosanitario eliminado con exito",
}
```



### **Códigos de respuesta**
- **201**: Control fitosanitario eliminado exitosamente del sistema.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden eliminar un control fitosanitario. Los usuarios sin permisos adecuados no podrán realizar esta acción.
