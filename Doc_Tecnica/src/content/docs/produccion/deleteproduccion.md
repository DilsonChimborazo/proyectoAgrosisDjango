---
title: "Eliminar producción"
description: "Elimina un registro de producción específico en el sistema."
---

## Descripción:
Solicitud utilizada para la eliminación de un registro de producción específico en el sistema.

---

## Método: 
```
 DELETE
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/produccion/{id_produccion}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

| Campo          | Tipo    | Requerido | Descripción                         |
|---------------|---------|-----------|-------------------------------------|
| id_produccion | integer | ✅       | Identificador único de la producción |

## **Respuesta**

Si la eliminación es exitosa, recibirás un código **200** con la siguiente estructura:

```json
{
    "message": "Producción eliminada con éxito"
}
```

---

### **Códigos de respuesta**
- **200**: Eliminación exitosa.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden eliminar registros de producción en el sistema.

