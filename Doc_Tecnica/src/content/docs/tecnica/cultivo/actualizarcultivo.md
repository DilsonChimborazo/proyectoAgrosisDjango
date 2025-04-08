---
title: "Actualizar Cultivo"
description: "Actualiza los datos de un cultivo ya registrado en el sistema."
---

## Descripción:

Solicitud utilizada para la actualización de los datos de un cultivo previamente registrado.

---

## Metodo:
```
 PUT
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
http://127.0.0.1:8000/api/cultivo/{id}
```
### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_cultivo": "Tomates Orgánicos",
    "fecha_plantacion": "2024-03-26",
    "descripcion": "Cultivo de tomates orgánicos en invernadero",
    "fk_id_especie": 2,
    "fk_id_semillero": 5
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| nombre_cultivo  | string | ✅       | Nombre del cultivo  |
| fecha_plantacion| string | ✅       | Fecha de plantación (YYYY-MM-DD)|
| descripcion     | string | ✅       | Descripcion del cultivo|
| fk_id_especie   | integer| ✅       | Especie del cultivo |
| fk_id_semillero | integer| ✅       | Semillero del cual proviene la semilla plantada     |


## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_cultivo": "Tomates Orgánicos",
    "fecha_plantacion": "2024-03-26",
    "descripcion": "Cultivo de tomates orgánicos en invernadero",
    "fk_id_especie": "Solanum lycopersicum",
    "fk_id_semillero": "Invernadero Central"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| nombre_cultivo | string | Nombre del cultivo      |
| fecha_plantacion| string | Fecha de plantación (YYYY-MM-DD)|
| descripcion    | string | Descripcion del cultivo|
| fk_id_especie  | integer | Especie del cultivo|
| fk_id_semillero| integer | Semillero del cual proviene la semilla plantada    |
:::


### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve el objeto del cultivo actualizado.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden actualizar la información de un cultivo. Los usuarios sin permisos adecuados no podrán realizar esta acción.
