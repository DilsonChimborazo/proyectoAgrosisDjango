---
title: "Actualizar Eras"
description: "Actualiza los datos de las eras ya registradas en el sistema."
---


## Descripción:
Solicitud utilizada para la actualización de los datos de una era ya registrada previamente.

---


## Metodo: 
```
 PUT
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/eras/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "descripcion": "Era de cultivo de maíz",
    "fk_id_lote": 2
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| descripcion    | string | ✅       | descripcion de la era    |
| fk_id_lote     | integer| ✅       | ID del lote en el que se encuentra |

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "descripcion": "Era de cultivo de maíz",
    "fk_id_lote": 2
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| descripcion     | string |descripcion de la era   |
| fk_id_lote      | integer|ID del lote en el que se encuentra  |
:::


### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve el array de la era actualizada.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:**  Solo los administradores o usuarios con permisos especiales pueden actualizar las eras en el sistema.



