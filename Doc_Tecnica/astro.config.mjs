// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Documentacion Agrosoft',
			social: {
				github: 'https://github.com/DilsonChimborazo/proyectoAgrosisDjango',
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
						{ label: 'Eliminar insumos', slug: 'insumos/deleteinsumo'},
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
