---
title: Actualizar Salario  
description: Actualiza un registro de salario existente en el sistema.
---
## Descripción:
Solicitud utilizada para actualizar un registro de salario existente en el sistema.

## Metodo: 
```
PUT
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/salario/actualizarsalario/<id>/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "fk_id_rol": 1,
    "precio_jornal": "55.00",
    "horas_por_jornal": 8,
    "fecha_inicio": "2025-06-11",
    "fecha_fin": null,
    "activo": true
}
```

| Campo             | Tipo    | Requerido | Descripción                                      |
|------------------|---------|-----------|--------------------------------------------------|
| fk_id_rol        | integer | ✅        | ID del rol asociado                             |
| precio_jornal    | decimal | ✅        | Precio por jornal                               |
| horas_por_jornal | integer | ❌        | Horas por jornal (por defecto 8)                |
| fecha_inicio     | date    | ❌        | Fecha de inicio en formato YYYY-MM-DD           |
| fecha_fin        | date    | ❌        | Fecha de fin en formato YYYY-MM-DD (opcional)   |
| activo           | boolean | ❌        | Indica si el salario está activo                |

## **Respuesta**

Si los datos son correctos, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "fk_id_rol": 1,
    "precio_jornal": "55.00",
    "horas_por_jornal": 8,
    "fecha_inicio": "2025-06-11",
    "fecha_fin": null,
    "activo": true
}
```

:::markdown
| Campo             | Tipo    | Descripción                                      |
|------------------|---------|--------------------------------------------------|
| id               | integer | Identificador único del salario                 |
| fk_id_rol        | integer | ID del rol asociado                             |
| precio_jornal    | decimal | Precio por jornal                               |
| horas_por_jornal | integer | Horas por jornal                                |
| fecha_inicio     | date    | Fecha de inicio en formato YYYY-MM-DD           |
| fecha_fin        | date    | Fecha de fin en formato YYYY-MM-DD (opcional)   |
| activo           | boolean | Indica si el salario está activo                |
:::

### **Códigos de respuesta**
- **201**: Salario actualizado con éxito, devuelve el array del salario actualizado.
- **400**: Datos incorrectos o faltantes.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar salarios en el sistema.