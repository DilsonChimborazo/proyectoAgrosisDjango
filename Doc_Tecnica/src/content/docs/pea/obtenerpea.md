---
title: "Obtener PEA"
description: "Obtiene la información de un PEA."
---

## Descripción:

Solicitud utilizada para obtener los peade previamente registrados.

---

## Metodo:
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/pea/
```
### **Cuerpo de la solicitud**
No se requiere cuerpo de solicitud.

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_pea": "plaga",
    "descripcion": "Descripción actualizada del Pea"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| nombre_pea     | string | plaga               |
| descripcion    | string | Descripción actualizada del Pea |
:::


### **Códigos de respuesta**
- **201**: consulta exitosa, devuelve la informacion de un pea.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden consultar pea registrados. Los usuarios sin permisos adecuados no podrán realizar esta acción.

