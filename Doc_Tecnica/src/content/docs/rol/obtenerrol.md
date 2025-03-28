---
title: "Obtener Roles"
description: "Obtiene la lista de roles registrados en el sistema"
---

## Descripción:
Este endpoint permite obtener todos los roles registrados en la base de datos.

---

## Método:
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/rol/
```
---

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **200** con la siguiente estructura:

```json
[
    {
        "id": 1,
        "fecha_creacion": "2025-03-27",
        "rol": "Aprendiz"
    },
    {
        "id": 2,
        "fecha_creacion": "2025-03-27",
        "rol": "Administrador"
    }
]

```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| fecha_creacion | date   | ✅       | fecha creacion del usuario  |
| rol            | string | ✅       | Nombre del rol              |

### **Códigos de respuesta**
- **201**: rol creado con exito, devuelve el array del rol registrado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Los roles se crean directamente en el backend para utilizarlo en frontend al momento de crear un usuario.
