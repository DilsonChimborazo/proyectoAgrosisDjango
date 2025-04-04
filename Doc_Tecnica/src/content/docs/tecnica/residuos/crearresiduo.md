---
title: "Crear Residuo"
description: "Crea un nuevo residuo y registralo en el sistema."
---

## Descripción:

Solicitud utilizada para el resgistro de un nuevo residuo.

---

## Metodo:
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/residuos/
```
### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_residuo": "Restos de poda",
    "fecha": "2024-03-26",
    "descripcion": "Residuos orgánicos de poda y mantenimiento",
    "fk_id_cultivo": 4,
    "fk_id_tipo_residuo": 2
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|---------------- |--------|-----------|-----------------------------|
| nombre_residuo | string | ✅       | Nombre del residuo|
| fecha          | string | ✅       | Fecha en que se recoge el residuo (YYYY-MM-DD)|
| descripcion    | string | ✅       | Descripcion del residuo |
| fk_id_cultivo  | integer| ✅       | Cultivo del cual se recoge el residuo  |
| fk_id_tipo_residuo| integer| ✅    | Tipo de residuo ya clasificado |


## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_residuo": "Restos de poda",
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
- **201**: Creacion exitosa, devuelve el array del residuo registrado.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden crear un residuo nuevo. Los usuarios sin permisos adecuados no podrán realizar esta acción.
