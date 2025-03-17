---
title: "Crear usuario"
description: "Crea los usuarios para que puedan iniciar sesion en el sistema."
---


## Descripción:
Solicitud utilizada para el resgistro de nuevos usuarios.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/usuario/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "identificacion": "1234567891",
    "nombre": "Dilson",
    "apellido": "Chimborazo",
    "email": "Dilson@gmail.com",
    "password": "123456.",
    "fk_id_rol": 1
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| identificacion | string | ✅       | Identificación del usuario  |
| nombre         | string | ✅       | Contraseña del usuario      |
| apellido       | string | ✅       | Contraseña del usuario      |
| email          | string | ✅       | Contraseña del usuario      |
| password       | string | ✅       | Contraseña del usuario      |
| fk_id_rol      | integer| ✅       | Contraseña del usuario      |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "identificacion": "1234567891",
    "nombre": "Dilson",
    "apellido": "Chimborazo",
    "email": "Dilson@gmail.com",
    "password": "123456.",
    "fk_id_rol": "Aprendiz"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| identificacion | string | Identificación del usuario  |
| nombre         | string | Contraseña del usuario      |
| apellido       | string | Contraseña del usuario      |
| email          | string | Contraseña del usuario      |
| password       | string | Contraseña del usuario      |
| fk_id_rol      | integer| Contraseña del usuario      |
:::


### **Códigos de respuesta**
- **201**: Autenticación exitosa, devuelve el array del usuario registrado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Los usuarios deben ser creados por un administrados o instructor, los aprendices no se les permite
registar usuarios en el sistema.



