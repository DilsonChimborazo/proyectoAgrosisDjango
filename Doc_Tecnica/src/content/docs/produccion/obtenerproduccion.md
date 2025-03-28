---
title: "Obtener producción"
description: "Obtiene los registros de producción dentro del sistema."
---


## Descripción:
Solicitud utilizada para obtener los registros de producción dentro del sistema.

---


## Método:
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/produccion/
```
### **Cuerpo de la solicitud**

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id_produccion": 1,
    "fk_id": 5,
    "cantidad_produccion": "150.5000000000",
    "fecha": "2025-03-26"
}
```

:::markdown
| Campo              | Tipo   | Descripción                |
|--------------------|--------|-----------------------------|
| id_produccion      | integer| Identificador único de la producción |
| fk_id              | integer| Identificador del cultivo asociado      |
| cantidad_produccion| decimal| Cantidad producida      |
| fecha              | date   | Fecha del registro de producción      |

:::

### **Códigos de respuesta**
- **201**: Solicitud exitosa, devuelve el array de producción registrado.

- **400**: Solicitud incorrecta.

- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden registrar o modificar la producción en el sistema.