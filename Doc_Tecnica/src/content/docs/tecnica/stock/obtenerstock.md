---
title: Obtener Stock  
description: Obtiene todos los registros de movimientos de stock registrados en el sistema.
---
## Descripción:
Solicitud utilizada para obtener todos los registros de movimientos de stock (entradas y salidas) registrados en el sistema.

## Metodo: 
```
GET
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/stock/obtenerstock/
```

### **Cuerpo de la solicitud**
No se requiere cuerpo de solicitud.

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
[
    {
        "id": 1,
        "fk_id_produccion": 1,
        "fk_id_item_venta": null,
        "cantidad": "100.500",
        "fecha": "2025-06-11T17:55:00-05:00",
        "movimiento": "Entrada"
    }
]
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
- **201**: Consulta exitosa, devuelve los datos de los movimientos de stock.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden obtener información sobre los movimientos de stock en el sistema.
---