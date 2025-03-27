import { z } from "zod";

// Esquema para el formulario de login
export const loginSchema = z.object({
  identificacion: z
    .string()
    .min(1, { message: "La identificación es obligatoria" })
    .regex(/^\d+$/, { message: "Solo se permiten números" }),
  password: z
    .string()
    .min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
});

// Esquema para el formulario de registro (ejemplo adicional)
export const registroSchema = z.object({
    identificacion: z
      .string()
      .min(1, { message: "La identificación es obligatoria" })
      .regex(/^\d+$/, { message: "Solo se permiten números" }),
    email: z.string().email({ message: "Debe ser un correo válido" }),
    nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
    apellido: z.string().min(2, { message: "El apellido debe tener al menos 2 caracteres" }),
    password: z.string().min(6, { message: "La contraseña debe tener al menos 6 caracteres" }),
    fk_id_rol: z.string().min(1, { message: "Debes seleccionar un rol" }), // Se valida como string porque el select devuelve string
  });

// Esquema para el formulario de contacto (ejemplo adicional)
export const contactoSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Debe ser un correo válido" }),
  mensaje: z.string().min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
});

// Esquema para el formulario de perfil (ejemplo adicional)
export const perfilSchema = z.object({
  edad: z.number().min(18, { message: "Debes ser mayor de 18" }).max(120, { message: "Edad no válida" }),
  telefono: z.string().regex(/^\d{9}$/, { message: "Debe ser un número de 9 dígitos" }),
  direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }).optional(),
});

// Tipos generados a partir de los esquemas
export type LoginData = z.infer<typeof loginSchema>;
export type RegistroData = z.infer<typeof registroSchema>;
export type ContactoData = z.infer<typeof contactoSchema>;
export type PerfilData = z.infer<typeof perfilSchema>;