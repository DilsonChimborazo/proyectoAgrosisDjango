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
					label: 'cultivo',
					items: [
						{ label: 'Creacion de Cultivo', slug: 'cultivo/crearcultivo' },
						{ label: 'Obtener Cultivo', slug: 'cultivo/obtenercultivo'},
						{ label: 'Actuallizar Cultivo', slug: 'cultivo/actualizarcultivo'},
						{ label: 'Obtener Cultivo por id', slug: 'cultivo/obtenercultivobyid'},
						{ label: 'Actualizar Cultivo por campo especifico', slug: 'cultivo/patchcultivo'},
						{ label: 'Eliminar Cultivo', slug: 'cultivo/deletecultivo'},
                    ],
				},
				{
					label: 'pea',
					items: [
						{ label: 'Creacion de pea', slug: 'pea/crearpea' },
						{ label: 'Obtener pea', slug: 'pea/obtenerpea'},
						{ label: 'Actuallizar pea', slug: 'pea/actualizarpea'},
						{ label: 'Obtener pea por id', slug: 'pea/obtenerpeabyid'},
						{ label: 'Actualizar pea por campo especifico', slug: 'pea/patchpea'},
						{ label: 'Eliminar pea', slug: 'pea/deletepea'},
                    ],
				},
				{
					label: 'residuos',
					items: [
						{ label: 'Creacion de residuo', slug: 'residuos/crearresiduo' },
						{ label: 'Obtener residuo', slug: 'residuos/obtenerresiduo'},
						{ label: 'Actuallizar residuo', slug: 'residuos/actualizarresiduo'},
						{ label: 'Obtener residuo por id', slug: 'residuos/obtenerresiduobyid'},
						{ label: 'Actualizar residuo por campo especifico', slug: 'residuos/patchresiduo'},
						{ label: 'Eliminar residuo', slug: 'residuos/deleteresiduo'},
                    ],
				},
				{
					label: 'control Fitosanitario',
					items: [
						{ label: 'Creacion de control', slug: 'controlfitosanitario/crearcontrol' },
						{ label: 'Obtener control', slug: 'controlfitosanitario/obtenercontrol'},
						{ label: 'Actuallizar control', slug: 'controlfitosanitario/actualizarcontrol'},
						{ label: 'Obtener control por id', slug: 'controlfitosanitario/obtenercontrolbyid'},
						{ label: 'Actualizar control por campo especifico', slug: 'controlfitosanitario/patchcontrol'},
						{ label: 'Eliminar control', slug: 'controlfitosanitario/deletecontrol'},
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
