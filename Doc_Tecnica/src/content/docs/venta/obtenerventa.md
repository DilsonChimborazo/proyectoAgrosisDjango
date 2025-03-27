---
title: "Obtener ventas"
description: "Obtiene todas las ventas registradas dentro del sistema."
---

## Descripción:
Solicitud utilizada para obtener todas las ventas registradas en el sistema.

---

## Método: 
```
 GET
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/venta/
```

### **Cuerpo de la solicitud**

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **200** con la siguiente estructura:

```json
[
    {
        "id_venta": 1,
        "precio_unidad": 25.50,
        "cantidad": 10,
        "fecha": "2025-03-26",
        "fk_id_produccion": 3
    },
    {
        "id_venta": 2,
        "precio_unidad": 30.00,
        "cantidad": 5,
        "fecha": "2025-03-27",
        "fk_id_produccion": 4
    }
]
```

:::markdown
| Campo            | Tipo    | Descripción                         |
|-----------------|---------|-------------------------------------|
| id_venta        | integer | Identificador único de la venta    |
| precio_unidad   | decimal | Precio por unidad del producto     |
| cantidad        | integer | Cantidad de unidades vendidas      |
| fecha           | date    | Fecha de la venta                  |
| fk_id_produccion | integer | ID de la producción asociada       |
:::

### **Códigos de respuesta**
- **200**: Consulta exitosa, devuelve el listado de ventas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden consultar los registros de venta en el sistema.

