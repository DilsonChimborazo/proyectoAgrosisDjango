---
title: "Actualizar Ubicación"
description: "Actualiza los datos de las ubicaciones ya registradas en el sistema."
---


## Descripción:
Solicitud utilizada para la actualización de los datos de la ubicacion ya registrada previamente.

---


## Metodo: 
```
 PUT
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/ubicacion/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "latitud": 4.60971,
    "longitud": -74.08175
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| latitud        | integer | ✅       | latitud de la ubicacion|
| longitud       | integer | ✅       | longitud de la ubicacion|


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
- **201**: Actualización exitosa, devuelve el array de la ubicacion actualizada.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:**  Solo los administradores o usuarios con permisos especiales pueden actualizar las ubicaciones en el sistema.



