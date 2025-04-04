---
title: "Crear insumo"
description: "Registra un nuevo insumo en el sistema."
---


## Descripción:
Solicitud utilizada para registrar un nuevo insumo en el sistema.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/insumo/
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

| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| id             | number | Identificador unico del insumo   |
| nombre         | string | Nombre del insumo      |
| tipo           | string | Tipo de insumo (Ej: Material de construcció)       |
| precio_unidad  | number | Precio por unidad    |
| cantidad       | number | Cantidad disponible     |
| unidad_medida  | string | Unidad de medida del insumo     |

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