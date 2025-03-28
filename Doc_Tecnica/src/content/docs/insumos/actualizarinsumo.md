---
title: "Actulizar herramienta"
description: "Actualiza los datos de las herramientas ya registradas en el sistema."
---


## Descripción:
Solicitud utilizada la actualizacion de los datos de una herramienta ya registrada previamente.

---


## Metodo: 
```
 PUT
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/herramientas/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "id": 1,
    "nombre": "Cemento",
    "tipo": "Material de construcción",
    "precio_unidad": 12.75,
    "cantidad": 50,
    "unidad_medida": "bolsa"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| id             | number | ✅       | Identificador único del insumo  |
| nombre         | string | ✅       | Nombre del insumo      |
| tipo           | string | ✅       | Tipo de insumo (Ej: Material de construcció)      |
| precio_unidad  | number | ✅       | Precio por unidad     |
| cantidad       | number | ✅       | Cantidad disponible      |
| unidad_medida  | string | ✅       | Unidad de medida del insumo    |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre": "Cemento",
    "tipo": "Material de construcción",
    "precio_unidad": 12.75,
    "cantidad": 50,
    "unidad_medida": "bolsa"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| id             | number | Identificador unico del insumo   |
| nombre         | string | Nombre del insumo      |
| tipo           | string | Tipo de insumo (Ej: Material de construcció)       |
| precio_unidad  | number | Precio por unidad    |
| cantidad       | number | Cantidad disponible     |
| unidad_medida  | string | Unidad de medida del insumo     |
:::


### **Códigos de respuesta**
- **201**: Registro exitosa, devuelve el array del insumo actualizado.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden registrar nuevos insumos en el sistema.
