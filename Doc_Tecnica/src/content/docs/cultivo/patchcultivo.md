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
| nombre_cultivo | string | Identificación del usuario  |
| fecha_plantacion| string | 2024-03-26     |
| descripcion    | string | Cultivo de maíz amarillo|
| fk_id_especie  | string | Cereal  |
| fk_id_semillero| string | ISemillero Norte   |
:::


### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve la información actualizada del cultivo.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden actualizar cultivos. Los usuarios sin permisos adecuados no podrán realizar esta acción.



