---
title: "Restablecimiento de contraseña"
description: "Restablecimiento de contraseña."
---


## Descripción:
Solicitud utilizada para el restablecimiento de contraseña.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/resetear-contrasena/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "password": "************",
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| password          | string | ✅       | contraseña del usuario      |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "password": "*************",
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| password          | string | Contraseña del usuario      |
:::


### **Códigos de respuesta**
- **201**: Contraseña actualizada correctamente
- **400**: Error al resetear contraseña.
- **500**: Error del servidor.

---



