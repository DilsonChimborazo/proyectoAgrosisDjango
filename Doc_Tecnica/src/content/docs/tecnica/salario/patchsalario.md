---
title: Actualizar Salario por Campo Específico  
description: Actualiza campos específicos de un registro de salario existente en el sistema.
---
## Descripción:
Solicitud utilizada para actualizar uno o más campos específicos de un registro de salario existente en el sistema.

## Metodo: 
```
PATCH
```

# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/tecnica/salario/patchsalario/<id>/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "precio_jornal": "52.50",
    "activo": false
}
```

| Campo             | Tipo    | Requerido | Descripción                                      |
|------------------|---------|-----------|--------------------------------------------------|
| fk_id_rol        | integer | ❌        | ID del rol asociado                             |
| precio_jornal    | decimal | ❌        | Precio por jornal                               |
| horas_por_jornal | integer | ❌        | Horas por jornal (por defecto 8)                |
| fecha_inicio     | date    | ❌        | Fecha de inicio en formato YYYY-MM-DD           |
| fecha_fin        | date    | ❌        | Fecha de fin en formato YYYY-MM-DD (opcional)   |
| activo           | boolean | ❌        | Indica si el salario está activo                |

## **Respuesta**

If the data is correct, you will receive a **201** code with the following structure:

```json
{
    "id": 1,
    "fk_id_rol": 1,
    "precio_jornal": "52.50",
    "horas_por_jornal": 8,
    "fecha_inicio": "2025-06-11",
    "fecha_fin": null,
    "activo": false
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

📄 **Nota:** Solo los administradores pueden actualizar campos específicos de salarios en el sistema.