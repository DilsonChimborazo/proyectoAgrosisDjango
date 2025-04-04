---
title: "Actualizar Rol"
description: "Reemplaza completamente los datos de un rol existente"
---

## Descripción:
Este endpoint permite actualizar un rol mediante su ID.

---

## Método:
```
 PUT
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/rol/{id_rol}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "fecha_creacion": "2025-03-27",
    "rol": "Aprendiz"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| fecha_creacion | date   | ✅       | fecha creacion del usuario  |
| rol            | string | ✅       | Nombre del rol              |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "fecha_creacion": "2025-03-27",
    "rol": "Aprendiz"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| fecha_creacion | date   | fecha creacion del usuario  |
| rol            | string | Nombre del rol              |
:::


### **Códigos de respuesta**
- **201**: rol actualizado con exito, devuelve el array del rol actualizado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Los roles se actualizan directamente en el backend para utilizarlo en frontend al momento de crear un usuario.
