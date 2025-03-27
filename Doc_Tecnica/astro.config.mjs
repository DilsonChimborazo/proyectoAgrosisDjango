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
					label: 'Produccion',
					items: [
						{ label: 'Creacion de produccion', slug: 'produccion/crearproduccion' },
						{ label: 'Obtener produccion', slug: 'produccion/obtenerproduccion'},
						{ label: 'Actuallizar produccion', slug: 'produccion/actualizarproduccion'},
						{ label: 'Obtener produccion por identificacion', slug: 'produccion/obtenerproduccionbyid'},
						{ label: 'Actualizar produccion por campo especifico', slug: 'produccion/patchproduccion'},
						{ label: 'Eliminar produccion', slug: 'produccion/deleteproduccion'},
                    ],
				},
				{
					label: 'Venta',
					items: [
						{ label: 'Creacion de venta', slug: 'venta/crearventa' },
						{ label: 'Obtener venta', slug: 'venta/obtenerventa'},
						{ label: 'Actuallizar venta', slug: 'venta/actualizarventa'},
						{ label: 'Obtener venta por identificacion', slug: 'venta/obtenerventabyid'},
						{ label: 'Actualizar venta por campo especifico', slug: 'venta/patchventa'},
						{ label: 'Eliminar venta', slug: 'venta/deleteventa'},
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
