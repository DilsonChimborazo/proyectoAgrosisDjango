---
title: Actualizar Stock por Campo Específico  
description: Actualiza campos específicos de un registro de movimiento de stock existente en el sistema.
---
## Descripción:
Solicitud utilizada para actualizar uno o más campos específicos de un registro de movimiento de stock (entrada o salida) existente en el sistema.

## Metodo: 
```
PATCH
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/stock/patchstock/<id>/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "cantidad": "110.250",
    "movimiento": "Entrada"
}
```

| Campo             | Tipo    | Requerido | Descripción                                      |
|------------------|---------|-----------|--------------------------------------------------|
| fk_id_produccion | integer | ❌        | ID de la producción asociada (para entradas)    |
| fk_id_item_venta | integer | ❌        | ID del item de venta asociado (para salidas)    |
| cantidad         | decimal | ❌        | Cantidad del movimiento (máx. 20 dígitos, 3 decimales) |
| movimiento       | string  | ❌        | Tipo de movimiento ("Entrada" o "Salida")       |

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "fk_id_produccion": 1,
    "fk_id_item_venta": null,
    "cantidad": "110.250",
    "fecha": "2025-06-11T17:59:00-05:00",
    "movimiento": "Entrada"
}
```

:::markdown
| Campo             | Tipo    | Descripción                                      |
|------------------|---------|--------------------------------------------------|
| id               | integer | Identificador único del movimiento de stock      |
| fk_id_produccion | integer | ID de la producción asociada                    |
| fk_id_item_venta | integer | ID del item de venta asociado                   |
| cantidad         | decimal | Cantidad del movimiento                         |
| fecha            | datetime | Fecha y hora del movimiento                     |
| movimiento       | string  | Tipo de movimiento ("Entrada" o "Salida")       |
:::

### **Códigos de respuesta**
- **201**: Movimiento de stock actualizado con éxito, devuelve el array del movimiento actualizado.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar campos específicos de movimientos de stock en el sistema.

---