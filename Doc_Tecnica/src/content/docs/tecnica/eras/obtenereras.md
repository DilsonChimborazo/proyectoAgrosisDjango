---
title: "Obtener Eras"
description: "Obtener eras del sistema."
---


## Descripción:
Solicitud utilizada para obtener las eras registradas en el sistema.

---


## Metodo: 
```
 Get
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/eras/
```

### **Cuerpo de la solicitud**

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
- **201**: Devuelve el array de las eras registradas.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:**  Solo los administradores o usuarios con permisos especiales pueden obtener informacion de las eras en el sistema.

