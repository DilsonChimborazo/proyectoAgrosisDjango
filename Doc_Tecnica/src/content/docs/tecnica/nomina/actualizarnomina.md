---
title: "Actualizar Nómina"  
description: "Actualiza un registro de nómina existente en el sistema."
---
## Descripción:
Solicitud utilizada para actualizar un registro de nómina existente en el sistema.

## Metodo: 
```
PUT
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/nomina/actualizarnomina/<id>/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "fk_id_programacion": 1,
    "fk_id_salario": 2,
    "fk_id_usuario": 1234567891,
    "pago_total": "1600.75",
    "fk_id_control_fitosanitario": null,
    "fecha_pago": "2025-06-11",
    "pagado": true
}
```

| Campo                     | Tipo    | Requerido | Descripción                                      |
|--------------------------|---------|-----------|--------------------------------------------------|
| fk_id_programacion       | integer | ❌        | ID de la programación asociada                  |
| fk_id_salario            | integer | ❌        | ID del salario asociado                        |
| fk_id_usuario            | integer | ❌        | Identificación del usuario asociado            |
| pago_total               | decimal | ❌        | Monto total del pago de la nómina              |
| fk_id_control_fitosanitario | integer | ❌        | ID del control fitosanitario asociado          |
| fecha_pago               | date    | ❌        | Fecha del pago en formato YYYY-MM-DD           |
| pagado                   | boolean | ❌        | Indica si la nómina ha sido pagada             |

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "fk_id_programacion": 1,
    "fk_id_salario": 2,
    "fk_id_usuario": 1234567891,
    "pago_total": "1600.75",
    "fk_id_control_fitosanitario": null,
    "fecha_pago": "2025-06-11",
    "pagado": true
}
```

:::markdown
| Campo                     | Tipo    | Descripción                                      |
|--------------------------|---------|--------------------------------------------------|
| id                       | integer | Identificador único de la nómina                |
| fk_id_programacion       | integer | ID de la programación asociada                  |
| fk_id_salario            | integer | ID del salario asociado                        |
| fk_id_usuario            | integer | Identificación del usuario asociado            |
| pago_total               | decimal | Monto total del pago de la nómina              |
| fk_id_control_fitosanitario | integer | ID del control fitosanitario asociado          |
| fecha_pago               | date    | Fecha del pago en formato YYYY-MM-DD           |
| pagado                   | boolean | Indica si la nómina ha sido pagada             |
:::

### **Códigos de respuesta**
- **201**: Nómina actualizada con éxito, devuelve el array de la nómina actualizada.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar nóminas en el sistema.