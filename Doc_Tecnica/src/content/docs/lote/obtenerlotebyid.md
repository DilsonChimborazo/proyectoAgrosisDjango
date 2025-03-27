---
title: "Obtener Lote por ID"
description: "Obtener los datos de los lotes ya registrados en el sistema mediante el ID."
---


## Descripción:
Solicitud utilizada para obtener los lotes que estan registrados dentro del sistema mediante el ID.

---


## Metodo: 
```
 GET
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/lote/{id}
```

### **Cuerpo de la solicitud**

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "dimencion": 100,
    "nombre_lote": "Lote 1",
    "fk_id_ubicacion": 3,
    "estado": "disponible"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| dimencion      | string | dimencion del lote |
| nombre_lote    | string | Nombre del lote  |
| fk_id_ubicacion| integer| Ubicacion del lote |
| estado         | string | Estado del lote(disponible/no disponible) |
:::


### **Códigos de respuesta**
- **201**: Devuelve el array de los lotes registrados.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden obtener los lotes en el sistema.
