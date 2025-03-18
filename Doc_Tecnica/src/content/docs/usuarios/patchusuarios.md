---
title: "Actulaizar usuarios"
description: "Actualiza los datos de los usuarios ya registrados en el sistema."
---


## Descripción:
Solicitud utilizada la actualizacion de los datos de un usuario ya registrado previamente.

---


## Metodo: 
```
 PATCH
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/usuario/{identificacion}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con el campo que deseas actualizar:

```json
{
    "nombre": "Dilson",
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| nombre         | string | ✅       | Contraseña del usuario      |


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
| nombre         | string | nombre del usuario      |
| apellido       | string | apellido del usuario      |
| email          | string | email del usuario      |
| password       | string | Contraseña del usuario      |
| fk_id_rol      | integer| rol asignado del usuario      |
:::


### **Códigos de respuesta**
- **201**: Actualizacion exitosa, devuelve el array del usuario registrado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Los usuarios deben ser creados por un administrados o instructor, los aprendices no se les permite
registar usuarios en el sistema.



