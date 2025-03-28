---
title: "Obtener Calendario Lunar"
description: "Obtiene los registros del calendario lunar registrados en el sistema."
---

## Descripción:
Solicitud utilizada para obtener los registros del calendario lunar registrados en el sistema.

---

## Método: 
```
GET
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/calendario-lunar/
```

## **Respuesta**

Si la solicitud es exitosa, recibirás un código **201** con la siguiente estructura:

```json
{
    "id_calendario_lunar": 1,
    "fecha": "2025-04-15",
    "descripcion_evento": "Luna llena",
    "evento": "Siembra de hortalizas"
}
```

:::markdown
| Campo                | Tipo    | Descripción                                      |
|----------------------|---------|--------------------------------------------------|
| id_calendario_lunar | integer | Identificación del registro en el calendario lunar |
| fecha              | string  | Fecha correspondiente al evento (YYYY-MM-DD)     |
| descripcion_evento | string  | Descripción del evento lunar                      |
| evento             | string  | Actividad recomendada para esta fase lunar       |
:::

### **Códigos de respuesta**
- **201**: Consulta exitosa, devuelve los datos del calendario lunar.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o instructores pueden obtener información sobre el calendario lunar en el sistema.

