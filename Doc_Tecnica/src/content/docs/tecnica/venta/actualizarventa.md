---
title: "Actualizar ventas"
description: "Actualiza los datos de una venta registrada en el sistema."
---

## Descripción:
Solicitud utilizada para la actualización de los datos de una venta previamente registrada.

---

## Método: 
```
 PUT
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/venta/{id_venta}
```
http://127.0.0.1:8000/api/venta
### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "precio_unidad": 25.50,
    "cantidad": 10,
    "fecha": "2025-03-26",
    "fk_id_produccion": 3
}
```

:::markdown
| Campo            | Tipo    | Requerido | Descripción                         |
|-----------------|---------|-----------|-------------------------------------|
| precio_unidad   | decimal | ✅        | Precio por unidad del producto     |
| cantidad        | integer | ✅        | Cantidad de unidades vendidas      |
| fecha           | date    | ✅        | Fecha de la venta                  |
| fk_id_produccion | integer | ✅       | ID de la producción asociada       |
:::

## **Respuesta**

Si la actualización es exitosa, recibirás un código **200** con la siguiente estructura:

```json
{
    "id_venta": 1,
    "precio_unidad": 25.50,
    "cantidad": 10,
    "fecha": "2025-03-26",
    "fk_id_produccion": 3
}
```

### **Códigos de respuesta**
- **200**: Actualización exitosa, devuelve los datos actualizados de la venta.
- **400**: Solicitud incorrecta o datos inválidos.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden actualizar los registros de venta en el sistema.

