---
title: "Autenticación de Usuario"
description: "Obtiene un par de tokens JSON Web Token (JWT) mediante credenciales de usuario."
---


## Descripción:
Solicitud utilizada para generar el token e iniciar sesion autenticado por el sistema.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/token/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
  "identificacion": "usuario123",
  "password": "tu_contraseña_segura"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| identificacion | string | ✅       | Identificación del usuario  |
| password       | string | ✅       | Contraseña del usuario      |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5..."
}
```

:::markdown
| Campo   | Tipo   | Descripción                   |
|---------|--------|--------------------------------|
| access  | string | Token JWT de acceso           |
| refresh | string | Token JWT de actualización    |
:::


### **Códigos de respuesta**
- **201**: Autenticación exitosa, devuelve tokens JWT.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Asegúrate de almacenar el token de actualización de manera segura, ya que permite obtener un nuevo token de acceso sin necesidad de volver a iniciar sesión.



