---
title: Eliminar Salario  
description: Elimina un registro de salario existente en el sistema.
---
## Descripción:
Solicitud utilizada para eliminar un registro de salario específico en el sistema mediante su identificador único.

## Metodo: 
```
DELETE
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/salario/deletesalario/<id>/
```

### **Cuerpo de la solicitud**
No se requiere cuerpo de solicitud.

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Salario eliminado exitosamente"
}
```

:::markdown
| Campo             | Tipo    | Descripción                                      |
|------------------|---------|--------------------------------------------------|
| message           | string  | Mensaje de confirmación de la eliminación        |
:::

### **Códigos de respuesta**
- **201**: Salario eliminado con éxito, devuelve el mensaje de confirmación.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden eliminar salarios en el sistema.