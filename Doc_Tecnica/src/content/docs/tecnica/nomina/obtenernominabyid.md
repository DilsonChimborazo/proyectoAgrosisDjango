---
title: "Obtener Nómina por ID"  
description: "Obtiene un registro de nómina específico por su identificador."
---

## Descripción:
Solicitud utilizada para obtener un registro de nómina específico en el sistema mediante su identificador único.

## Metodo: 
```
GET
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/nomina/obtenernominabyid/<id>/
```

### **Cuerpo de la solicitud**
No se requiere cuerpo de solicitud.

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "fk_id_programacion": 1,
    "fk_id_salario": 2,
    "fk_id_usuario": 1234567891,
    "pago_total": "1500.50",
    "fk_id_control_fitosanitario": null,
    "fecha_pago": "2025-06-11",
    "pagado": false
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
- **201**: Consulta exitosa, devuelve los datos de la nómina.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden obtener información sobre una nómina específica en el sistema.