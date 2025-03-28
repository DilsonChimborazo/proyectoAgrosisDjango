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
					label: 'herramientas',
					items: [
                        { label: 'Creacion de Herramientas', slug: 'herramientas/crearherramienta' },
						{ label: 'Obtener Herramientas', slug: 'herramientas/obtenerherramienta'},
						{ label: 'Actuallizar herramientas', slug: 'herramientas/actualizarherramienta'},
						{ label: 'Obtener herramientas por identificacion', slug: 'herramientas/obtenerherramientabyid'},
						{ label: 'Actualizar herramientas por campo especifico', slug: 'herramientas/patchherramienta'},
						{ label: 'Eliminar herramientas', slug: 'herramientas/deleteherramienta'},
                    ],
				},

				{
					label: 'insumos',
					items: [
                        { label: 'Creacion de insumos', slug: 'insumos/crearinsumo' },
						{ label: 'Obtener Insumos', slug: 'insumos/obtenerinsumo'},
						{ label: 'Actuallizar insumos', slug: 'insumos/actualizarinsumo'},
						{ label: 'Obtener insumos por identificacion', slug: 'insumos/obtenerinsumobyid'},
						{ label: 'Actualizar insumos por campo especifico', slug: 'insumos/patchinsumo'},
						{ label: 'Eliminar insumos', slug: 'insumos/deleteherramienta'},
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
