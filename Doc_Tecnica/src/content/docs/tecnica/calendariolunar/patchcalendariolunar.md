---
title: "Actualizar calendario lunar"
description: "Actualiza parcialmente los datos de un evento en el calendario lunar del sistema."
---

## Descripción:
Solicitud utilizada para la actualización parcial de un evento previamente registrado en el calendario lunar.

---

## Método:
```
PATCH
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/calendario_lunar/{id_calendario_lunar}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los campos que deseas actualizar:

```json
{
    "fecha": "2025-04-15",
    "descripcion_evento": "La luna llena influye en la siembra y cosecha."
}
```

| Campo               | Tipo    | Requerido | Descripción                                     |
|---------------------|---------|-----------|-------------------------------------------------|
| fecha              | string  | ❌        | Fecha del evento en formato YYYY-MM-DD         |
| descripcion_evento | string  | ❌        | Descripción del evento y su impacto agrícola   |
| evento             | string  | ❌        | Nombre del evento lunar                        |

## **Respuesta**

Si los datos son correctos, recibirás un código **200** con la siguiente estructura:

```json
{
    "id_calendario_lunar": 1,
    "fecha": "2025-04-15",
    "descripcion_evento": "La luna llena influye en la siembra y cosecha.",
    "evento": "Luna llena"
}
```

:::markdown
| Campo               | Tipo    | Descripción                                     |
|---------------------|---------|-------------------------------------------------|
| id_calendario_lunar | integer | Identificador del evento lunar                 |
| fecha              | string  | Fecha del evento en formato YYYY-MM-DD         |
| descripcion_evento | string  | Descripción del evento y su impacto agrícola   |
| evento             | string  | Nombre del evento lunar                        |
:::

### **Códigos de respuesta**
- **200**: Actualización exitosa, devuelve los datos del evento actualizado.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar la información del calendario lunar. Los usuarios normales solo pueden visualizar los eventos.

