---
title: "Crear sensor"
description: "Crea los sensores nuevos parea el sistema"
---


## Descripción:
Solicitud utilizada  para el resgistro de nuevos sensores.

---


## Metodo: 
```
 POST
```
---


# **Solicitud**

### **Endpoint**
```
http://127.0.0.1:8000/api/sensores/
```

### **Cuerpo de la solicitud**
Envía un objeto JSON con los siguientes campos:

```json
{
    "nombre_sensor": "Sensor de temperatura",
    "tipo_sensor": "DHT22",
    "unidad_medida": "°C",
    "descripcion": "Sensor de temperatura y humedad",
    "medida_minima": -40,
    "medida_maxima": 80
}
```

| Campo           | Tipo   | Requerido | Descripción                |
|----------------|--------|-----------|-----------------------------|
| nombre_sensor  | string | ✅       | Nombre del sensor |
| tipo_sensor    | string | ✅       | Tipo de sensor    |
| unidad_medida  | string | ✅       | Unidad de medida del sensor |
| descripcion    | string | ✅       | Descripcion del sensor | 
| medida_minima  | integer| ✅       | Medida minima del sensor| 
| medida_maxima  | integer| ✅       | Medida maxima del sensor| 

## **Respuesta**

Si las credenciales son correctas, recibirás un código **201** con la siguiente estructura:

```json
{
    "id": 1,
    "nombre_sensor": "Sensor de temperatura",
    "tipo_sensor": "DHT22",
    "unidad_medida": "°C",
    "descripcion": "Sensor de temperatura y humedad",
    "medida_minima": -40,
    "medida_maxima": 80
}
```

:::markdown
| Campo           | Tipo   | Descripción                |
|----------------|--------|-----------------------------|
| nombre_sensor  | string | Nombre del sensor |
| tipo_sensor    | string | Tipo de sensor    |
| unidad_medida  | string | Unidad de medida del sensor |
| descripcion    | string | Descripcion del sensor | 
| medida_minima  | integer| Medida minima del sensor| 
| medida_maxima  | integer| Medida maxima del sensor| 
:::


### **Códigos de respuesta**
- **201**: Registro exitoso, devuelve el array del sensor registrado.
- **400**: Credenciales incorrectas.
- **500**: Error del servidor.

---

📄 **Nota:** Solo los administradores o usuarios con permisos pueden registrar un sensor en el sistema.



