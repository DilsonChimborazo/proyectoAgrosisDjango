---
title: "Obtener Residuos por si ID"
description: "Obtiene los residuo registrados en el sistema mediante su ID."
---

## Descripción:

Solicitud utilizada para obtener los residuos que estan registrados dentro del sistema mediante un ID.

---

## Metodo:
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/residuos/{id}
```
### **Cuerpo de la solicitud**


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
- **201**: Autenticación exitosa, devuelve el array del residuo que desea llamar.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden obtener informacion de los residuos. Los usuarios sin permisos adecuados no podrán realizar esta acción.
