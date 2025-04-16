---
title: "Obtener Cultivo por ID"
description: "Obtiene la información de un cultivo específico registrado en el sistema mediante su ID."
---


## Descripción:
Solicitud utilizada para obtener la información de un cultivo específico registrado en el sistema mediante su ID.

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
http://127.0.0.1:8000/api/cultivo/{id}
```

### **Cuerpo de la solicitud**

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_cultivo": "Maíz",
    "fecha_plantacion": "2024-03-01",
    "descripcion": "Cultivo de maíz amarillo",
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
| fk_id_semillero| integer | Semillero del cual proviene la semilla plantada    |


### **Códigos de respuesta**
- **201**: Consulta exitosa, devuelve la información del cultivo.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden consultar cultivos. Los usuarios sin permisos adecuados no podrán realizar esta acción.
