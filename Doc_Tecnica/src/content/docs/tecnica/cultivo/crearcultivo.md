---
title: "Crear Cultivo"
description: "Crea un nuevo cultivo en el sistema."
---
## Descripción:
Solicitud utilizada para el registro de nuevos cultivos en el sistema.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/cultivo/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_cultivo": "Tomates Orgánicos",
    "fecha_plantacion": "2024-03-26",
    "descripcion": "Cultivo de tomates en el invernadero",
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
    "descripcion": "Cultivo de tomates en el invernadero",
    "fk_id_especie": "Solanum lycopersicum",
    "fk_id_semillero": "Invernadero Central"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| nombre_cultivo | string | Identificación del usuario  |
| fecha_plantacion| string | 2024-03-26     |
| descripcion    | string | Cultivo de tomates orgánicos|
| fk_id_especie  | string | lycopersicum   |
| fk_id_semillero| string | Invernadero Central   |
:::


### **Códigos de respuesta**
- **201**:  Cultivo creado con éxito, devuelve el objeto del cultivo registrado.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden registrar un nuevo cultivo. Los usuarios sin permisos adecuados no podrán realizar esta acción.




