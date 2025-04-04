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
| nombre         | string | ✅       | Nombre del usuario      |
| apellido       | string | ✅       | Apellido del usuario      |
| email          | string | ✅       | Email del usuario      |
| password       | string | ✅       | Contraseña del usuario      |
| fk_id_rol      | integer| ✅       | Rol asignado del usuario      |

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
| nombre         | string | Nombre del usuario      |
| apellido       | string | Apellido del usuario      |
| email          | string | Email del usuario      |
| password       | string | Contraseña del usuario      |
| fk_id_rol      | integer| Rol asignado del usuario      |
:::


### **Códigos de respuesta**
- **201**: usuario creado con exito, devuelve el array del usuario registrado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Los usuarios deben ser actualizados por un administrados o instructor, los aprendices no se les permite
actualizar usuarios en el sistema.



