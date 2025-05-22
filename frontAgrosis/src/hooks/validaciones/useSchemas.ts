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
  identificacion: z
    .string()
    .min(5, 'La identificación debe tener al menos 5 caracteres')
    .max(20, 'La identificación no debe exceder los 20 caracteres'),

  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no debe exceder los 50 caracteres'),

  apellido: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no debe exceder los 50 caracteres'),

  email: z
    .string()
    .email('Debe ser un correo valido'),

  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional()
    .or(z.literal('')), // Permite contraseña vacía si no se desea cambiar

  img: z
    .any()
    .optional()
    .refine((file) => file instanceof File || file === null || file === undefined, {
      message: 'La imagen debe ser un archivo válido',
    }),
});

export const usuarioSchema = z.object({
  identificacion: z
    .string()
    .min(5, "La identificación debe tener al menos 5 dígitos")
    .regex(/^\d+$/, "La identificación debe contener solo números"),

  email: z.string().email("Correo electrónico no válido"),

  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede tener más de 50 caracteres"),

  apellido: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede tener más de 50 caracteres"),

  fk_id_rol: z
    .string()
    .regex(/^\d+$/, "Selecciona un rol válido"),
});

export const registroUsuario = z.object({
  identificacion: z
    .string()
    .min(1, { message: "La identificación es obligatoria" })
    .regex(/^\d+$/, { message: "Solo se permiten números" }),

  email: z
    .string()
    .email({ message: "Debe ser un correo electrónico válido" }),

  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no debe exceder los 50 caracteres'),

  apellido: z
    .string()
    .min(2, 'El apellido debe tener al menos 2 caracteres')
    .max(50, 'El apellido no debe exceder los 50 caracteres'),

  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .optional()
    .or(z.literal('')),
});

export const crearRolSchema = z.object({
  rol: z
    .string()
    .min(1, { message: "El nombre del rol es obligatorio" })
    .max(50, { message: "El nombre del rol no debe exceder los 50 caracteres" }),
  fecha_creacion: z
    .string()
    .refine(
      (date) => {
        // Validar que la fecha es válida y no vacía
        return !isNaN(Date.parse(date));
      },
      { message: "Debes ingresar una fecha válida" }
    ),
});


// Tipos generados a partir de los esquemas
export type LoginData = z.infer<typeof loginSchema>;
export type RegistroData = z.infer<typeof registroSchema>;
export type ContactoData = z.infer<typeof contactoSchema>;
export type PerfilData = z.infer<typeof perfilSchema>;
export type UsuariolData = z.infer<typeof usuarioSchema>;
export type CreateUsuario = z.infer<typeof registroUsuario>;
export type CreateRol = z.infer<typeof crearRolSchema>;