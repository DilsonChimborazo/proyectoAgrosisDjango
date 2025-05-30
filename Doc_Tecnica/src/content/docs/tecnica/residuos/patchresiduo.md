---
title: "Actualizar Residuo"
description: "Actualiza los datos de un residuo ya registrado en el sistema."
---

## Descripción:

Solicitud utilizada para la actualización de los datos de un residuo previamente registrado.

---

## Metodo:
```
 PATCH
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
http://127.0.0.1:8000/api/residuos/{id}
```
### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_residuo": "Restos de abono",
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|---------------- |--------|-----------|-----------------------------|
| nombre_residuo  | string | ✅       | Nombre del residuo|



## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_residuo": "Restos de abono",
    "fecha": "2024-03-26",
    "descripcion": "Residuos orgánicos de poda",
    "fk_id_cultivo": "Tomates Orgánicos",
    "fk_id_tipo_residuo": "Orgánico"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|-----------------|--------|-----------------------------|
| nombre_residuo  | string | Nombre del residuo|
| fecha           | string | Fecha en que se recoge el residuo     |
| descripcion     | string | Descripcion del residuo |
| fk_id_cultivo| integer | Cultivo del cual se recoge el residuo|
| fk_id_tipo_residuo| integer | Tipo de residuo ya clasificado |
:::


### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve el objeto del residuo actualizado.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden actualizar la información de un residuo. Los usuarios sin permisos adecuados no podrán realizar esta acción.
