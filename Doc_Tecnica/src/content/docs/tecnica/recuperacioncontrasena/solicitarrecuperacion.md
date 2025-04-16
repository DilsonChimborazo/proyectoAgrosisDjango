---
title: "Solicitar Recuperacion de contraseña"
description: "Solicitar recuperacion de contraseña por medio de email."
---


## Descripción:
Solicitud utilizada para la recuperacion de contraseña.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/solicitar-recuperacion/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "email": "samboniwilson09@gmail.com",
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| email          | string | ✅       | Email del usuario      |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "email": "samboniwilson09@gmail.com",
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| email          | string | Email del usuario      |
:::


### **Códigos de respuesta**
- **201**: Correo enviado correctamente, revisa tu correo
- **400**: Correo no registrado.
- **500**: Error del servidor.

---



