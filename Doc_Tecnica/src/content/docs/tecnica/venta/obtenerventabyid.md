---
title: "Obtener venta por ID"
description: "Obtiene los datos de una venta registrada en el sistema mediante su ID."
---

## Descripción:
Solicitud utilizada para obtener los datos de una venta registrada en el sistema mediante su identificador único.

---

## Método: 
```
 GET
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/venta/{id_venta}
```

### **Cuerpo de la solicitud**

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **200** con la siguiente estructura:

```json
{
    "id_venta": 1,
    "precio_unidad": 25.50,
    "cantidad": 10,
    "fecha": "2025-03-26",
    "fk_id_produccion": 3
}
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
- **200**: Consulta exitosa, devuelve los datos de la venta.
- **404**: Venta no encontrada.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden consultar los registros de venta en el sistema.

