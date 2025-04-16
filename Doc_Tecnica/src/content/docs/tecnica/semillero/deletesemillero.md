---
title: "Eliminar Semillero"
description: "Elimina un semillero específico registrado en el sistema."
---

## Descripción:
Solicitud utilizada para la eliminación de un semillero específico registrado en el sistema.

---

## Método: 
```
DELETE
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/semillero/{id_semillero}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

| Campo        | Tipo   | Requerido | Descripción                      |
|-------------|--------|-----------|----------------------------------|
| id_semillero | integer | ✅       | Identificación del semillero     |

## **Respuesta**

Si la eliminación es exitosa, recibirás un código **201** con la siguiente estructura:

```json
{
    "message": "Semillero eliminado con éxito"
}
```

### **Códigos de respuesta**
- **201**: Eliminación exitosa.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden eliminar semilleros en el sistema.

