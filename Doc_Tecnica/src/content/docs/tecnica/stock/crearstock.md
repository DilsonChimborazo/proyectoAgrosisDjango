---
title: Crear Stock  
description: Registra un nuevo movimiento de stock en el sistema.
---
## Descripción:
Solicitud utilizada para el registro de nuevos movimientos de stock (entradas o salidas) en el sistema.

## Metodo: 
```
POST
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/stock/crearstock/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "fk_id_produccion": 1,
    "fk_id_item_venta": null,
    "cantidad": "100.500",
    "movimiento": "Entrada"
}
```

| Campo             | Tipo    | Requerido | Descripción                                      |
|------------------|---------|-----------|--------------------------------------------------|
| fk_id_produccion | integer | ❌        | ID de la producción asociada (para entradas)    |
| fk_id_item_venta | integer | ❌        | ID del item de venta asociado (para salidas)    |
| cantidad         | decimal | ✅        | Cantidad del movimiento (máx. 20 dígitos, 3 decimales) |
| movimiento       | string  | ✅        | Tipo de movimiento ("Entrada" o "Salida")       |

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "fk_id_produccion": 1,
    "fk_id_item_venta": null,
    "cantidad": "100.500",
    "fecha": "2025-06-11T17:53:00-05:00",
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
- **201**: Movimiento de stock creado con éxito, devuelve el array del movimiento registrado.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden crear movimientos de stock en el sistema.

---
