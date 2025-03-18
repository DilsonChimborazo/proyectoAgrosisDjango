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
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
