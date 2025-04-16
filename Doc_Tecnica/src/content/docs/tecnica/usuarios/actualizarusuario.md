---
title: "Actulaizar usuario"
description:  "Actualiza los datos de los usuarios ya registrados en el sistema."
---


## Descripción:
Solicitud utilizada para la actualización de los datos de un usuario ya registrado previamente.

---


## Metodo: 
```
 PUT
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/usuario/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "id": 1,
    "nombre": "Producto Ejemplo",
    "tipo": "Alimento",
    "precio_unidad": 12.50,
    "cantidad": 100,
    "unidad_medida": "kg"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id             | number | ✅       | Identificación del usuario  |
| nombre         | string | ✅       | Nombre del usuario      |
| tipo           | string | ✅       | Apellido del usuario      |
| precio_unidad  | number | ✅       | Email del usuario      |
| cantidad       | number | ✅       | Contraseña del usuario      |
| unidad_medida  | integer| ✅       | Rol asignado del usuario      |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre": "Producto Ejemplo",
    "tipo": "Alimento",
    "precio_unidad": 12.50,
    "cantidad": 100,
    "unidad_medida": "kg"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| id             | string | Identificación del usuario  |
| nombre         | string | Nombre del usuario      |
| tipo           | string | Apellido del usuario      |
| precio_unidad  | string | Email del usuario      |
| cantidad       | string | Contraseña del usuario      |
| unidad_medida  | integer| Rol asignado del usuario      |
:::


### **Códigos de respuesta**
- **201**: Actualizacion exitosa, devuelve el array del usuario registrado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios autorizados pueden actualizar los datos del producto en el sistema.



