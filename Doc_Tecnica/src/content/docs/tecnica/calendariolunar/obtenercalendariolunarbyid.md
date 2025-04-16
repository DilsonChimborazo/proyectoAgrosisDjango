---
title: "Actualizar Asignación de Actividad"
description: "Actualiza los datos de una asignación de actividad ya registrada en el sistema."
---

## Descripción:
Solicitud utilizada para la actualización de los datos de una asignación de actividad ya registrada previamente.

---

## Método: 
```
PUT
```
---

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/asignacion_actividad/{id_asignacion_actividad}
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "id_asignacion_actividad": 1,
    "fecha": "2025-04-05",
    "fk_id_actividad": 2,
    "fk_identificacion": "123456789"
}
```

:::markdown
| Campo                  | Tipo    | Requerido | Descripción                                  |
|------------------------|---------|-----------|----------------------------------------------|
| id_asignacion_actividad | integer | ✅       | Identificación de la asignación de actividad |
| fecha                 | string  | ✅       | Fecha de la asignación (YYYY-MM-DD)         |
| fk_id_actividad       | integer | ✅       | Identificación de la actividad asignada     |
| fk_identificacion     | string  | ✅       | Identificación del usuario asignado         |
:::

## **Respuesta**

Si la actualización es exitosa, recibirás un código **201** con la siguiente estructura:

```json
{
    "id_asignacion_actividad": 1,
    "fecha": "2025-04-05",
    "fk_id_actividad": 2,
    "fk_identificacion": "123456789"
}
```

### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve los datos de la asignación actualizada.
- **400**: Solicitud incorrecta.
- **500**: Error del servidor.

---

🗄 **Nota:** Solo los administradores o instructores pueden actualizar asignaciones de actividad en el sistema.

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
http://127.0.0.1:8000/api/calendario-lunar/{id_calendario_lunar}
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

