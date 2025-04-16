---
title: "Obtener Residuos"
description: "Obtiene los residuo registrados en el sistema."
---

## Descripción:

Solicitud utilizada para obtener los residuos que estan registrados dentro del sistema.

---

## Metodo:
```
 GET
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
http://127.0.0.1:8000/api/residuos/
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
- **201**: Autenticación exitosa, devuelve el array de los residuos registrados.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden obtener informacion de los residuos. Los usuarios sin permisos adecuados no podrán realizar esta acción.
