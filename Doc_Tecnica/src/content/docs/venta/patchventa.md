---
title: "Actualizar Venta"
description: "Actualiza los datos de una venta ya registrada en el sistema."
---

## Descripción:
Solicitud utilizada para la actualización de los datos de una venta registrada previamente.

---

## Método:
```
 PATCH
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/venta/{id_venta}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con el campo que deseas actualizar:

```json
{
    "precio_unidad": 15.50
}
```

| Campo            | Tipo    | Requerido | Descripción                         |
|-----------------|---------|-----------|-------------------------------------|
| precio_unidad   | decimal | ✅        | Precio por unidad del producto     |
| cantidad        | integer | ✅        | Cantidad de unidades vendidas      |
| fecha           | date    | ✅        | Fecha de la venta                  |
| fk_id_produccion | integer | ✅       | ID de la producción asociada       |

## **Respuesta**

Si la solicitud es correcta, recibirás un código **200** con la siguiente estructura:

```json
{
    "id_venta": 1,
    "precio_unidad": 15.50,
    "cantidad": 10,
    "fecha": "2025-03-26",
    "fk_id_produccion": 2
}
```

:::markdown
| Campo            | Tipo    | Descripción                         |
|-----------------|---------|-------------------------------------|
| id_venta        | integer | Identificador único de la venta   |
| precio_unidad   | decimal | Precio por unidad del producto     |
| cantidad        | integer | Cantidad de unidades vendidas      |
| fecha           | date    | Fecha de la venta                  |
| fk_id_produccion | integer | ID de la producción asociada       |
:::

### **Códigos de respuesta**
- **200**: Actualización exitosa, devuelve el array de la venta actualizada.
- **400**: Datos incorrectos o solicitud mal formada.
- **404**: Venta no encontrada.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o vendedores autorizados pueden actualizar ventas en el sistema.

