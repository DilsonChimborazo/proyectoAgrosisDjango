---
title: Eliminar Stock  
description: Elimina un registro de movimiento de stock existente en el sistema.
---
## Descripción:
Solicitud utilizada para eliminar un registro de movimiento de stock (entrada o salida) específico en el sistema mediante su identificador único.

## Metodo: 
```
DELETE
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/stock/deletestock/<id>/
```

### **Cuerpo de la solicitud**
No se requiere cuerpo de solicitud.

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Movimiento de stock eliminado exitosamente"
}
```

:::markdown
| Campo             | Tipo    | Descripción                                      |
|------------------|---------|--------------------------------------------------|
| message           | string  | Mensaje de confirmación de la eliminación        |
:::

### **Códigos de respuesta**
- **201**: Movimiento de stock eliminado con éxito, devuelve el mensaje de confirmación.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden eliminar movimientos de stock en el sistema.

---