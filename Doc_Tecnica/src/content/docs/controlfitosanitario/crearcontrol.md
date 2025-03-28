---
title: "Crear Control Fitosanitario"
description: "Crea un nuevo control fitosanitario y registralo en el sistema."
---

## Descripción:

Solicitud utilizada para el resgistro de nuevos controles fitosanitarios.

---

## Metodo:
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/control_fitosanitario/
```
### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "fecha_control": "2024-03-26",
    "descripcion": "Aplicación de fungicida ecológico",
    "fk_id_desarrollan": 3
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|---------------- |--------|-----------|-----------------------------|
| fecha_control   | string | ✅       | Fecha de control (YYYY-MM-DD)|
| descripcion     | string | ✅       | Descripcion del control|
| fk_id_desarrollan| integer| ✅       | Info de desarrollan   |


## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "fecha_control": "2024-03-26",
    "descripcion": "Aplicación de fungicida ecológico",
    "fk_id_desarrollan": "plaga en el cultivo de maiz"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|-----------------|--------|-----------------------------|
| fecha_plantacion| string | 2024-03-26     |
| descripcion     | string | Aplicación de fungicida ecológico|
| fk_id_especie  | string | plaga en el cultivo de maiz|
:::


### **Códigos de respuesta**
- **201**: Control fitosanitario creado exitosamente en el sistema.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden crear un nuevo control fitosanitario. Los usuarios sin permisos adecuados no podrán realizar esta acción.
