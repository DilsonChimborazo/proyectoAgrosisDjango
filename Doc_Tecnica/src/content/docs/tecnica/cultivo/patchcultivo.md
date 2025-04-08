---
title: "Actulaizar Cultivo"
description: "Actualiza los datos de un cultivo ya registrado en el sistema."
---


## Descripción:
Solicitud utilizada la actualizacion de los datos de un cultivo ya registrado previamente.

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
http://127.0.0.1:8000/api/cultivo/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con el campo que deseas actualizar:

```json
{
    "nombre_cultivo": "Maíz Mejorado"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| nombre_cultivo | string | ✅        | nombre del cultivo           |


## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_cultivo": "Maíz Mejorado",
    "fecha_plantacion": "2024-03-01",
    "descripcion": "Cultivo de maíz amarillo mejorado",
    "fk_id_especie": "Cereal",
    "fk_id_semillero": "Semillero Norte"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| nombre_cultivo | string | Nombre del cultivo      |
| fecha_plantacion| string | Fecha de plantación (YYYY-MM-DD)|
| descripcion    | string | Descripcion del cultivo|
| fk_id_especie  | integer | Especie del cultivo|
| fk_id_semillero| integer | Info del Semillero   |


### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve la información actualizada del cultivo.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden actualizar cultivos. Los usuarios sin permisos adecuados no podrán realizar esta acción.
