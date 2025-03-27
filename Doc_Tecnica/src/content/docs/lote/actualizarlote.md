---
title: "Actulaizar Lote"
description: "Actualiza los datos de los lotes ya registrados en el sistema."
---


## Descripción:
Solicitud utilizada la actualizacion de los datos de un lote ya registrado previamente.

---


## Metodo: 
```
 PUT
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/lote/{id}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "dimencion": 100,
    "nombre_lote": "Lote A",
    "fk_id_ubicacion": 3,
    "estado": "disponible"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| dimencion      | integer| ✅       | dimencion del lote  |
| nombre_lote    | string | ✅       | Nombre del lote     |
| fk_id_ubicacion| integer| ✅       | Ubicacion del lote   |
| estado         | string | ✅       | Estado del lote     | 

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "dimencion": 100,
    "nombre_lote": "Lote A",
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
- **201**: Actualizacion exitosa, devuelve el array del lote actualizado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden actualizar los lotes en el sistema.



