---
title: "Crear Pea"
description: "Crear un nuevo PEA en el sistema."
---

## Descripción:

Solicitud utilizada para el registro de nuevos PEA en el sistema.

---

## Metodo:
```
 POST
```
---
## **Cabecera de la solicitud**
Incluye los siguientes encabezados en la solicitud:
```
Content-Type: application/json
Authorization: Bearer "tu_token_aquí"
```
|Encabezado	Requerido | Descripción  |
|-------------------- |--------------|
|Content-Type	      |✅	Indica que el cuerpo de la solicitud es JSON.
|Authorization        |❌	Token de autenticación si es necesario.


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/pea/
```
### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_pea": "plaga",
    "descripcion": "Descripción del Pea",
    "tipo_pea": "Plaga"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| nombre_pea      | string | ✅       | Nombre del pea(plaga/enfermedad/arvense)  |
| descripcion     | string | ✅       | Descripcion de la pea(plaga/enfermedad/arvense)|
| tipo_pea        | string | ✅       | Tipo de pea (plaga/enfermedad/arvense)  |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_pea": "plaga",
    "descripcion": "Descripción del pea",
    "tipo_pea": "Plaga"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| nombre_pea     | string | Nombre del pea(plaga/enfermedad/arvense) |
| descripcion    | string | Descripcion de la pea(plaga/enfermedad/arvense) |
| tipo_pea       | string | Tipo de pea (plaga/enfermedad/arvense)  |
:::


### **Códigos de respuesta**
- **201**:   PEA creado con éxito, devuelve el objeto del PEA registrado.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden registrar un nuevo pea. Los usuarios sin permisos adecuados no podrán realizar esta acción.
