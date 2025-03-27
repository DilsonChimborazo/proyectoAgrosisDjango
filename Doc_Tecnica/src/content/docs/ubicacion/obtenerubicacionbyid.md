---
title: "Obtener Ubicación por ID"
description: "Obtiene las ubicaciones que estan registradas dentro del sistema mediante su ID."
---


## Descripción:
Solicitud utilizada para obtener las ubicaciones que estan registradas dentro del sistema mediante su ID.

---


## Metodo: 
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/ubicacion/{id}
```

### **Cuerpo de la solicitud**

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "latitud": 4.60971,
    "longitud": -74.08175
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| id           | integer |identificador de la ubicacion   |
| latitud      | integer |latitud de la ubicacion  |
| longitud     | integer |longitud de la ubicacion |
:::


### **Códigos de respuesta**
- **201**: Devuelve el array de la ubicacion registrada con su ID.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:**  Solo los administradores o usuarios con permisos especiales pueden obtener la ubicacion en el sistema.

