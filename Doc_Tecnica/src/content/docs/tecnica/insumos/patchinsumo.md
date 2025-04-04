---
title: "Obtener insumo parcialmente"
description: "Permite la actualización parcial de los datos de un insumo registrado en el sistema."
---


## Descripción:
Esta solicitud se utiliza para modificar uno o más campos de un insumo sin necesidad de enviar toda la información.

---


## Metodo: 
```
 PATCH
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/insumo/{id}
```

### **Cuerpo de la solicitud**

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "precio_unidad": 15.50,
    "cantidad": 60
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| id             | number | Identificador unico del insumo   |
| nombre         | string | Nombre del insumo      |
| tipo           | string | Tipo de insumo (Ej: Material de construcció)       |
| precio_unidad  | number | Precio por unidad    |
| cantidad       | number | Cantidad disponible     |
:::


### **Códigos de respuesta**
- **201**: Autenticación exitosa, devuelve el array al insumo actualizado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores pueden actualizar los insumos. Los aprendices no tienen permisos para realizar esta acción.