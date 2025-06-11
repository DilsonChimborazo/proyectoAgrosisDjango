---
title: Eliminar Nómina  
description: Elimina un registro de nómina existente en el sistema.
---
## Descripción:
Solicitud utilizada para eliminar un registro de nómina específico en el sistema mediante su identificador único.

## Metodo: 
```
DELETE
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/nomina/deletenomina/<id>/
```

### **Cuerpo de la solicitud**
No se requiere cuerpo de solicitud.

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Nómina eliminada exitosamente"
}
```

:::markdown
| Campo             | Tipo    | Descripción                                      |
|------------------|---------|--------------------------------------------------|
| message           | string  | Mensaje de confirmación de la eliminación        |
:::

### **Códigos de respuesta**
- **201**: Nómina eliminada con éxito, devuelve el mensaje de confirmación.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden eliminar nóminas en el sistema.