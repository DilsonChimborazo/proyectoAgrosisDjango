---
title: "Crear Rol"
description: "Crea los roles para que le puedan asignar a un usuario"
---


## Descripción:
Solicitud utilizada para el resgistro de roles.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/rol/
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
- **201**: rol creado con exito, devuelve el array del rol registrado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Los roles se crean directamente en el backend para utilizarlo en frontend al momento de crear un usuario.



