---
title: "Obtener usuarios"
description: "Obtiene los usuarios que estan registrados dentro del sistema."
---


## Descripción:
Solicitud utilizada para obtener los usuarios que estan registrados dentro del sistema.

---


## Metodo: 
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/usuario/
```

### **Cuerpo de la solicitud**

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
- **201**: Autenticación exitosa, devuelve el array del usuario registrado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Los usuarios deben ser creados por un administrados o instructor, los aprendices no se les permite
registar usuarios en el sistema.