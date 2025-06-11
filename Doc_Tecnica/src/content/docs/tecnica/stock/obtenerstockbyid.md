---
title: Obtener Stock por ID  
description: Obtiene un registro de movimiento de stock específico por su identificador.
---
## Descripción:
Solicitud utilizada para obtener un registro de movimiento de stock (entrada o salida) específico en el sistema mediante su identificador único.

## Metodo: 
```
GET
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/stock/obtenerstockbyid/<id>/
```

### **Cuerpo de la solicitud**
No se requiere cuerpo de solicitud.

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "fk_id_produccion": 1,
    "fk_id_item_venta": null,
    "cantidad": "100.500",
    "fecha": "2025-06-11T17:57:00-05:00",
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
- **201**: Consulta exitosa, devuelve los datos del movimiento de stock.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden obtener información sobre un movimiento de stock específico en el sistema.