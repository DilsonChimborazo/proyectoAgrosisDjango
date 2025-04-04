---
title: "Crear venta"
description: "Registra una nueva venta en el sistema."
---


## Descripción:
Solicitud utilizada para el registro de nuevas ventas.

---


## Metodo:
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/venta/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "precio_unidad": 10.50,
    "cantidad": 5,
    "fecha": "2025-03-26",
    "fk_id_produccion": 1
}
```

| Campo            | Tipo    | Requerido | Descripción                         |
|-----------------|---------|-----------|-------------------------------------|
| precio_unidad   | decimal | ✅        | Precio por unidad del producto     |
| cantidad        | integer | ✅        | Cantidad de unidades vendidas      |
| fecha           | date    | ✅        | Fecha de la venta                  |
| fk_id_produccion | integer | ✅       | ID de la producción asociada       |

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "precio_unidad": 10.50,
    "cantidad": 5,
    "fecha": "2025-03-26",
    "fk_id_produccion": 1
}
```

:::markdown
| Campo            | Tipo    | Descripción                         |
|-----------------|---------|-------------------------------------|
| id              | integer | Identificador de la venta         |
| precio_unidad   | decimal | Precio por unidad del producto     |
| cantidad        | integer | Cantidad de unidades vendidas      |
| fecha           | date    | Fecha de la venta                  |
| fk_id_produccion | integer | ID de la producción asociada       |
:::

### **Códigos de respuesta**
- **201**: Venta creada con éxito, devuelve la información de la venta registrada.
- **400**: Datos de entrada incorrectos.
- **500**: Error del servidor.

---

📝 **Nota:** Solo los administradores o usuarios con permisos adecuados pueden registrar una nueva venta en el sistema.

