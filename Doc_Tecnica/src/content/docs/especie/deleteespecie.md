---
title: "Eliminar Especie"
description: "Elimina una especie específica registrada en el sistema."
---

## Descripción:
Solicitud utilizada para la eliminación de una especie específica registrada en el sistema.

---

## Método: 
```
DELETE
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/especie/{id_especie}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

| Campo        | Tipo   | Requerido | Descripción                      |
|-------------|--------|-----------|----------------------------------|
| id_especie  | integer | ✅       | Identificación de la especie     |

## **Respuesta**

Si la eliminación es exitosa, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Especie eliminada con éxito"
}
```

### **Códigos de respuesta**
- **201**: Eliminación exitosa.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden eliminar especies en el sistema.

