// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Documentacion',
			social: {
				github: 'https://github.com/withastro/starlight',
			},
			sidebar: [
				{
					label: 'Autenticacion',
					items: [
						{ label: 'token', slug: 'autenticacion/token'}
					],
				},
				{
					label: 'recuperacioncontrasena',
					items: [
						{ label: 'Resetar contrasena', slug: 'recuperacioncontrasena/resetearcontrasena'},
						{ label: 'Solicitar recuperacion', slug: 'recuperacioncontrasena/solicitarrecuperacion'}
					]
				},
				{
					label: 'usuarios',
					items: [
                        { label: 'Creacion de Usuarios', slug: 'usuarios/crearusuario' },
						{ label: 'Obtener Usuarios', slug: 'usuarios/obtenerusuarios'},
						{ label: 'Actuallizar usuarios', slug: 'usuarios/actualizarusuario'},
						{ label: 'Obtener usuarios por identificacion', slug: 'usuarios/obtenerusuariobyid'},
						{ label: 'Actualizar usuarios por campo especifico', slug: 'usuarios/patchusuarios'},
						{ label: 'Eliminar usuarios', slug: 'usuarios/deleteusuarios'},
                    ],
				},
				{
					label: 'rol',
					items: [
                        { label: 'Creacion de roles', slug: 'rol/crearrol' },
						{ label: 'Obtener roles', slug: 'rol/obtenerrol'},
						{ label: 'Actualizar rol', slug: 'rol/actualizarrol'},
						{ label: 'Obtener rol por id', slug: 'rol/obtenerrolbyid'},
						{ label: 'Actualizar rol por campo especifico', slug: 'rol/patchrolbyid'},
						{ label: 'Eliminar rol', slug: 'rol/deleterol'},
                    ],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
