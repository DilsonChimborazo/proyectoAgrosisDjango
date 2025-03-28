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
					label: 'ubicacion',
					items: [
                        { label: 'Creacion de ubicacion', slug: 'ubicacion/crearubicacion' },
						{ label: 'Obtener ubicacion', slug: 'ubicacion/obtenerubicacion'},
						{ label: 'Actuallizar ubicacion', slug: 'ubicacion/actualizarubicacion'},
						{ label: 'Obtener ubicacion por identificacion', slug: 'ubicacion/obtenerubicacionbyid'},
						{ label: 'Actualizar ubicacion por campo especifico', slug: 'ubicacion/patchubicacion'},
						{ label: 'Eliminar ubicacion', slug: 'ubicacion/deleteubicacion'},
                    ],
				},
				{
					label: 'lote',
					items: [
                        { label: 'Creacion de lote', slug: 'lote/crearlote' },
						{ label: 'Obtener lote', slug: 'lote/obtenerlote'},
						{ label: 'Actuallizar lote', slug: 'lote/actualizarlote'},
						{ label: 'Obtener lote por identificacion', slug: 'lote/obtenerlotebyid'},
						{ label: 'Actualizar lote por campo especifico', slug: 'lote/patchlote'},
						{ label: 'Eliminar lote', slug: 'lote/deletelote'},
                    ],
				},
				{
					label: 'eras',
					items: [
                        { label: 'Creacion de eras', slug: 'eras/creareras' },
						{ label: 'Obtener eras', slug: 'eras/obtenereras'},
						{ label: 'Actuallizar eras', slug: 'eras/actualizareras'},
						{ label: 'Obtener eras por identificacion', slug: 'eras/obtenererasbyid'},
						{ label: 'Actualizar eras por campo especifico', slug: 'eras/patcheras'},
						{ label: 'Eliminar eras', slug: 'eras/deleteeras'},
                    ],
				},
				{
					label: 'sensores',
					items: [
                        { label: 'Creacion de sensores', slug: 'sensores/crearsensores' },
						{ label: 'Obtener sensores', slug: 'sensores/obtenersensores'},
						{ label: 'Actuallizar sensores', slug: 'sensores/actualizarsensores'},
						{ label: 'Obtener sensores por identificacion', slug: 'sensores/obtenersensoresbyid'},
						{ label: 'Actualizar sensores por campo especifico', slug: 'sensores/patchsensores'},
						{ label: 'Eliminar sensores', slug: 'sensores/deletesensores'},
                    ],
				},
				{
					label: 'Reference',
					autogenerate: { directory: 'reference' },
				},
				{
					label: 'semillero',
					items: [
                        { label: 'Creacion de Semillero', slug: 'semillero/crearsemillero' },
						{ label: 'Obtener Semillero', slug: 'semillero/obtenersemillero'},
						{ label: 'Obtener Semillero por id', slug: 'semillero/obtenersemillerobyid'},
						{ label: 'Actualizar Semillero', slug: 'semillero/actualizarsemillero'},
						{ label: 'Actualizar Semillero por campo especifico', slug: 'semillero/patchsemillero'},
						{ label: 'Eliminar Semillero', slug: 'semillero/deletesemillero'},
					],
				},
				{
					label: 'especie',
					items: [
                        { label: 'Creacion de Especie', slug: 'especie/crearespecie' },
						{ label: 'Obtener Especie', slug: 'especie/obtenerespecie'},
						{ label: 'Obtener Especie por Id', slug: 'especie/obtenerespeciebyid'},
						{ label: 'Actualizar Especie', slug: 'especie/actualizarespecie'},
						{ label: 'Actualizar Especie por campo especifico', slug: 'especie/patchespecie'},
						{ label: 'Eliminar Especie', slug: 'especie/deleteespecie'},
					],
				},
				{
					label: 'asignacion',
					items: [
                        { label: 'Creacion de Asignacion', slug: 'asignacion/crearasignacion' },
						{ label: 'Obtener Asignacion', slug: 'asignacion/obtenerasignacion'},
						{ label: 'Obtener Asignacion por Id', slug: 'asignacion/obtenerasignacionbyid'},
						{ label: 'Actualizar Asignacion', slug: 'asignacion/actualizarasignacion'},
						{ label: 'Actualizar Asignacion por campo especifico', slug: 'asignacion/patchasignacion'},
						{ label: 'Eliminar Asignacion', slug: 'asignacion/deleteasignacion'},
					],
				},
				{
					label: 'calendario_lunar',
					items: [
                        { label: 'Creacion de Calendario Lunar', slug: 'calendariolunar/crearcalendariolunar' },
						{ label: 'Obtener Calendario Lunar', slug: 'calendariolunar/obtenercalendariolunar'},
						{ label: 'Obtener Calendario Lunar por Id', slug: 'calendariolunar/obtenercalendariolunarbyid'},
						{ label: 'Actualizar Calendario Lunar', slug: 'calendariolunar/actualizarcalendariolunar'},
						{ label: 'Actualizar Calendario Lunar por campo especifico', slug: 'calendariolunar/patchcalendariolunar'},
						{ label: 'Eliminar Calendario Lunar', slug: 'calendariolunar/deletecalendariolunar'},
					],
				},
			],
		}),
	],
});
