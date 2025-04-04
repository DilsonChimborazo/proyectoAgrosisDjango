---
title: "Actualizar semillero"
description: "Actualiza los datos de un semillero ya registrado en el sistema."
---

## Descripción:
Solicitud utilizada para la actualización de los datos de un semillero previamente registrado.

---

## Metodo: 
```
 PUT
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/semillero/{id_semillero}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "id_semillero": 1,
    "nombre_semilla": "Maíz",
    "fecha_siembra": "2025-04-10",
    "fecha_estimada": "2025-06-15",
    "cantidad": 100
}
```

| Campo          | Tipo    | Requerido | Descripción                                |
|---------------|---------|-----------|--------------------------------------------|
| id_semillero  | integer | ✅        | Identificador del semillero               |
| nombre_semilla | string  | ✅        | Nombre de la semilla                      |
| fecha_siembra | string  | ✅        | Fecha de siembra en formato YYYY-MM-DD    |
| fecha_estimada | string  | ✅        | Fecha estimada de cosecha en formato YYYY-MM-DD |
| cantidad      | integer | ✅        | Cantidad de semillas sembradas            |

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id_semillero": 1,
    "nombre_semilla": "Maíz",
    "fecha_siembra": "2025-04-10",
    "fecha_estimada": "2025-06-15",
    "cantidad": 100
}
```

:::markdown
| Campo          | Tipo    | Descripción                                |
|---------------|---------|--------------------------------------------|
| id_semillero  | integer | Identificador del semillero               |
| nombre_semilla | string  | Nombre de la semilla                      |
| fecha_siembra | string  | Fecha de siembra en formato YYYY-MM-DD    |
| fecha_estimada | string  | Fecha estimada de cosecha en formato YYYY-MM-DD |
| cantidad      | integer | Cantidad de semillas sembradas            |
:::

### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve el array del semillero actualizado.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar la información de los semilleros.

