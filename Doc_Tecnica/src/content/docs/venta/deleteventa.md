---
title: "Eliminar venta"
description: "Elimina una venta específica registrada en el sistema."
---

## Descripción:
Solicitud utilizada para la eliminación de una venta específica registrada en el sistema.

---

## Método: 
```
 DELETE
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/venta/{id_venta}
```

### **Cuerpo de la solicitud**
No se requiere cuerpo en la solicitud.

## **Respuesta**

Si la eliminación es exitosa, recibirás un código **200** con la siguiente estructura:

```json
{
    "message": "Venta eliminada con éxito"
}
```

### **Códigos de respuesta**
- **200**: Eliminación exitosa.
- **400**: Solicitud incorrecta o datos inválidos.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden eliminar registros de venta en el sistema.

