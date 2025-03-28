---
title: "Actualizar Pea"
description: "Actualiza los datos de un Pea ya registrado en el sistema."
---

## Descripción:

Solicitud utilizada para la actualización de los datos de un Pea previamente registrado.

---

## Metodo:
```
 PUT
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/pea/{id}
```
### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_pea": "Pea Ejemplo",
    "descripcion": "Descripción actualizada del Pea"
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| nombre_pea      | string | ✅       | Nombre del pea(plaga/enfermedad/arvense)  |
| descripcion     | string | ✅       | Descripcion de la pea(plaga/enfermedad/arvense)|

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_pea": "plaga",
    "descripcion": "Descripción actualizada del Pea"
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| nombre_pea     | string | plaga               |
| descripcion    | string | Descripción actualizada del Pea |
:::


### **Códigos de respuesta**
- **201**: Actualización exitosa, devuelve el objeto de un pea actualizado.
- **400**: Datos inválidos o error de validación.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o encargados pueden actualizar la información de un pea. Los usuarios sin permisos adecuados no podrán realizar esta acción.




