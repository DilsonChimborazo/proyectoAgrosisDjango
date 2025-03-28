---
title: "Obtener Control Fitosanitario por ID"
description: "Obtener los datos de un control fitosanitario ya registrado en el sistema por el ID que le corresponde."
---

## Descripción:

Solicitud utilizada para la obtener los datos de un control fitosanitario registrado en el sistema mediante si ID.

---

## Metodo:
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/control_fitosanitario/{id}
```
### **Cuerpo de la solicitud**

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
- **201**: Autenticación exitosa, devuelve el array del control que desea.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden obtener la información de los controles fitosanitarios. Los usuarios sin permisos adecuados no podrán realizar esta acción.
