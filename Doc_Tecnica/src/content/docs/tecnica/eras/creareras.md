---
title: "Crear Eras"
description: "Registrar nuevas eras en el sistema."
---


## Descripción:
Solicitud utilizada para el resgistro de nuevas eras.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/eras/
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
| id             | string | ✅       | Id de la era     |
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
| id             | integer |identificador de la era |
| descripcion     | string |descripcion de la era   |
| fk_id_lote      | integer|ID del lote en el que se encuentra  |
:::


### **Códigos de respuesta**
- **201**: Registro exitoso, devuelve el array de la era registrada.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:**  Solo los administradores o usuarios con permisos especiales pueden registrar una nueva era en el sistema.



