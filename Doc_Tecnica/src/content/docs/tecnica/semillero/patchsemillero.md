---
title: "Actualizar Semillero"
description: "Actualiza parcialmente los datos de un semillero registrado en el sistema."
---

## Descripción:
Solicitud utilizada para la actualización parcial de un semillero previamente registrado.

---

## Método:
```
PATCH
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/semillero/{id_semillero}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los campos que deseas actualizar:

```json
{
    "nombre_semilla": "Maíz",
    "fecha_siembra": "2024-03-15",
    "fecha_estimada": "2024-06-20",
    "cantidad": 100
}
```

| Campo           | Tipo    | Requerido | Descripción                                      |
|----------------|---------|-----------|--------------------------------------------------|
| nombre_semilla | string  | ❌        | Nombre de la semilla sembrada                   |
| fecha_siembra  | string  | ❌        | Fecha en la que se realizó la siembra (YYYY-MM-DD) |
| fecha_estimada | string  | ❌        | Fecha estimada de cosecha (YYYY-MM-DD)          |
| cantidad       | integer | ❌        | Cantidad de semillas sembradas                  |

## **Respuesta**

Si los datos son correctos, recibirás un código **200** con la siguiente estructura:

```json
{
    "id_semillero": 1,
    "nombre_semilla": "Maíz",
    "fecha_siembra": "2024-03-15",
    "fecha_estimada": "2024-06-20",
    "cantidad": 100
}
```

:::markdown
| Campo           | Tipo    | Descripción                                   |
|----------------|---------|-----------------------------------------------|
| id_semillero   | integer | Identificador único del semillero            |
| nombre_semilla | string  | Nombre de la semilla sembrada                 |
| fecha_siembra  | string  | Fecha en la que se realizó la siembra         |
| fecha_estimada | string  | Fecha estimada de cosecha                     |
| cantidad       | integer | Cantidad de semillas sembradas                |
:::

### **Códigos de respuesta**
- **200**: Actualización exitosa, devuelve los datos del semillero actualizado.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar la información de los semilleros en el sistema.