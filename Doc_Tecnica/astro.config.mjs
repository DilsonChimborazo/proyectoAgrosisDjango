// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
integrations: [
    starlight({
    title: 'Documentacion Agrosoft',
	customCss: [
		// Ruta relativa a tu archivo CSS personalizado
		'./src/styles/custom.css',
	],
    social: {
        github: 'https://github.com/DilsonChimborazo/proyectoAgrosisDjango',
    },
    sidebar: [
        // Documentación Técnica
        {
        label: 'Documentacion Tecnica',
		collapsed: true, 
        items: [
			{
				label: 'Autenticacion',
				items: [
					{ label: 'token', slug: 'tecnica/autenticacion/token'}
				],
			},
			{
				label: 'recuperacioncontrasena',
				items: [
					{ label: 'Resetar contrasena', slug: 'tecnica/recuperacioncontrasena/resetearcontrasena'},
					{ label: 'Solicitar recuperacion', slug: 'tecnica/recuperacioncontrasena/solicitarrecuperacion'}
				]
			},
			{
				label: 'usuarios',
				items: [
					{ label: 'Creacion de Usuarios', slug: 'tecnica/usuarios/crearusuario' },
					{ label: 'Obtener Usuarios', slug: 'tecnica/usuarios/obtenerusuarios'},
					{ label: 'Actuallizar usuarios', slug: 'tecnica/usuarios/actualizarusuario'},
					{ label: 'Obtener usuarios por identificacion', slug: 'tecnica/usuarios/obtenerusuariobyid'},
					{ label: 'Actualizar usuarios por campo especifico', slug: 'tecnica/usuarios/patchusuarios'},
					{ label: 'Eliminar usuarios', slug: 'tecnica/usuarios/deleteusuarios'},
				],

			},
			{
				label: 'cultivo',
				items: [
					{ label: 'Creacion de Cultivo', slug: 'tecnica/cultivo/crearcultivo' },
					{ label: 'Obtener Cultivo', slug: 'tecnica/cultivo/obtenercultivo'},
					{ label: 'Actuallizar Cultivo', slug: 'tecnica/cultivo/actualizarcultivo'},
					{ label: 'Obtener Cultivo por id', slug: 'tecnica/cultivo/obtenercultivobyid'},
					{ label: 'Actualizar Cultivo por campo especifico', slug: 'tecnica/cultivo/patchcultivo'},
					{ label: 'Eliminar Cultivo', slug: 'tecnica/cultivo/deletecultivo'},
				],
			},
			{
				label: 'pea',
				items: [
					{ label: 'Creacion de pea', slug: 'tecnica/pea/crearpea' },
					{ label: 'Obtener pea', slug: 'tecnica/pea/obtenerpea'},
					{ label: 'Actuallizar pea', slug: 'tecnica/pea/actualizarpea'},
					{ label: 'Obtener pea por id', slug: 'tecnica/pea/obtenerpeabyid'},
					{ label: 'Actualizar pea por campo especifico', slug: 'tecnica/pea/patchpea'},
					{ label: 'Eliminar pea', slug: 'tecnica/pea/deletepea'},
				],
			},
			{
				label: 'residuos',
				items: [
					{ label: 'Creacion de residuo', slug: 'tecnica/residuos/crearresiduo' },
					{ label: 'Obtener residuo', slug: 'tecnica/residuos/obtenerresiduo'},
					{ label: 'Actuallizar residuo', slug: 'tecnica/residuos/actualizarresiduo'},
					{ label: 'Obtener residuo por id', slug: 'tecnica/residuos/obtenerresiduobyid'},
					{ label: 'Actualizar residuo por campo especifico', slug: 'tecnica/residuos/patchresiduo'},
					{ label: 'Eliminar residuo', slug: 'tecnica/residuos/deleteresiduo'},
				],
			},
			{
				label: 'control Fitosanitario',
				items: [
					{ label: 'Creacion de control', slug: 'tecnica/controlfitosanitario/crearcontrol' },
					{ label: 'Obtener control', slug: 'tecnica/controlfitosanitario/obtenercontrol'},
					{ label: 'Actuallizar control', slug: 'tecnica/controlfitosanitario/actualizarcontrol'},
					{ label: 'Obtener control por id', slug: 'tecnica/controlfitosanitario/obtenercontrolbyid'},
					{ label: 'Actualizar control por campo especifico', slug: 'tecnica/controlfitosanitario/patchcontrol'},
					{ label: 'Eliminar control', slug: 'tecnica/controlfitosanitario/deletecontrol'},
				],
			},
			{
				label: 'ubicacion',
				items: [
					{ label: 'Creacion de ubicacion', slug: 'tecnica/ubicacion/crearubicacion' },
					{ label: 'Obtener ubicacion', slug: 'tecnica/ubicacion/obtenerubicacion'},
					{ label: 'Actuallizar ubicacion', slug: 'tecnica/ubicacion/actualizarubicacion'},
					{ label: 'Obtener ubicacion por identificacion', slug: 'tecnica/ubicacion/obtenerubicacionbyid'},
					{ label: 'Actualizar ubicacion por campo especifico', slug: 'tecnica/ubicacion/patchubicacion'},
					{ label: 'Eliminar ubicacion', slug: 'tecnica/ubicacion/deleteubicacion'},
				],
			},
			{
				label: 'lote',
				items: [
					{ label: 'Creacion de lote', slug: 'tecnica/lote/crearlote' },
					{ label: 'Obtener lote', slug: 'tecnica/lote/obtenerlote'},
					{ label: 'Actuallizar lote', slug: 'tecnica/lote/actualizarlote'},
					{ label: 'Obtener lote por identificacion', slug: 'tecnica/lote/obtenerlotebyid'},
					{ label: 'Actualizar lote por campo especifico', slug: 'tecnica/lote/patchlote'},
					{ label: 'Eliminar lote', slug: 'tecnica/lote/deletelote'},
				],
			},
			{
				label: 'eras',
				items: [
					{ label: 'Creacion de eras', slug: 'tecnica/eras/creareras' },
					{ label: 'Obtener eras', slug: 'tecnica/eras/obtenereras'},
					{ label: 'Actuallizar eras', slug: 'tecnica/eras/actualizareras'},
					{ label: 'Obtener eras por identificacion', slug: 'tecnica/eras/obtenererasbyid'},
					{ label: 'Actualizar eras por campo especifico', slug: 'tecnica/eras/patcheras'},
					{ label: 'Eliminar eras', slug: 'tecnica/eras/deleteeras'},
				],
			},
			{
				label: 'sensores',
				items: [
					{ label: 'Creacion de sensores', slug: 'tecnica/sensores/crearsensores' },
					{ label: 'Obtener sensores', slug: 'tecnica/sensores/obtenersensores'},
					{ label: 'Actuallizar sensores', slug: 'tecnica/sensores/actualizarsensores'},
					{ label: 'Obtener sensores por identificacion', slug: 'tecnica/sensores/obtenersensoresbyid'},
					{ label: 'Actualizar sensores por campo especifico', slug: 'tecnica/sensores/patchsensores'},
					{ label: 'Eliminar sensores', slug: 'tecnica/sensores/deletesensores'},
				],
			},
			{
				label: 'rol',
				items: [
					{ label: 'Creacion de roles', slug: 'tecnica/rol/crearrol' },
					{ label: 'Obtener roles', slug: 'tecnica/rol/obtenerrol'},
					{ label: 'Actualizar rol', slug: 'tecnica/rol/actualizarrol'},
					{ label: 'Obtener rol por id', slug: 'tecnica/rol/obtenerrolbyid'},
					{ label: 'Actualizar rol por campo especifico', slug: 'tecnica/rol/patchrolbyid'},
					{ label: 'Eliminar rol', slug: 'tecnica/rol/deleterol'},
				],
			},
			{
				label: 'Produccion',
				items: [
					{ label: 'Creacion de produccion', slug: 'tecnica/produccion/crearproduccion' },
					{ label: 'Obtener produccion', slug: 'tecnica/produccion/obtenerproduccion'},
					{ label: 'Actuallizar produccion', slug: 'tecnica/produccion/actualizarproduccion'},
					{ label: 'Obtener produccion por identificacion', slug: 'tecnica/produccion/obtenerproduccionbyid'},
					{ label: 'Actualizar produccion por campo especifico', slug: 'tecnica/produccion/patchproduccion'},
					{ label: 'Eliminar produccion', slug: 'tecnica/produccion/deleteproduccion'},
				],
			},
			{
				label: 'Venta',
				items: [
					{ label: 'Creacion de venta', slug: 'tecnica/venta/crearventa' },
					{ label: 'Obtener venta', slug: 'tecnica/venta/obtenerventa'},
					{ label: 'Actuallizar venta', slug: 'tecnica/venta/actualizarventa'},
					{ label: 'Obtener venta por identificacion', slug: 'tecnica/venta/obtenerventabyid'},
					{ label: 'Actualizar venta por campo especifico', slug: 'tecnica/venta/patchventa'},
					{ label: 'Eliminar venta', slug: 'tecnica/venta/deleteventa'},
				],
			},

			{
				label: 'herramientas',
				items: [
					{ label: 'Creacion de Herramientas', slug: 'tecnica/herramientas/crearherramienta' },
					{ label: 'Obtener Herramientas', slug: 'tecnica/herramientas/obtenerherramienta'},
					{ label: 'Actuallizar herramientas', slug: 'tecnica/herramientas/actualizarherramienta'},
					{ label: 'Obtener herramientas por identificacion', slug: 'tecnica/herramientas/obtenerherramientabyid'},
					{ label: 'Actualizar herramientas por campo especifico', slug: 'tecnica/herramientas/patchherramienta'},
					{ label: 'Eliminar herramientas', slug: 'tecnica/herramientas/deleteherramienta'},
				],
			},

			{
				label: 'insumos',
				items: [
					{ label: 'Creacion de insumos', slug: 'tecnica/insumos/crearinsumo' },
					{ label: 'Obtener Insumos', slug: 'tecnica/insumos/obtenerinsumo'},
					{ label: 'Actuallizar insumos', slug: 'tecnica/insumos/actualizarinsumo'},
					{ label: 'Obtener insumos por identificacion', slug: 'tecnica/insumos/obtenerinsumobyid'},
					{ label: 'Actualizar insumos por campo especifico', slug: 'tecnica/insumos/patchinsumo'},
					{ label: 'Eliminar insumos', slug: 'tecnica/insumos/deleteinsumo'},
				],
			},

			{
				label: 'Reference',
				autogenerate: { directory: 'reference' },
			},
			{
				label: 'semillero',
				items: [
					{ label: 'Creacion de Semillero', slug: 'tecnica/semillero/crearsemillero' },
					{ label: 'Obtener Semillero', slug: 'tecnica/semillero/obtenersemillero'},
					{ label: 'Obtener Semillero por id', slug: 'tecnica/semillero/obtenersemillerobyid'},
					{ label: 'Actualizar Semillero', slug: 'tecnica/semillero/actualizarsemillero'},
					{ label: 'Actualizar Semillero por campo especifico', slug: 'tecnica/semillero/patchsemillero'},
					{ label: 'Eliminar Semillero', slug: 'tecnica/semillero/deletesemillero'},
				],
			},
			{
				label: 'especie',
				items: [
					{ label: 'Creacion de Especie', slug: 'tecnica/especie/crearespecie' },
					{ label: 'Obtener Especie', slug: 'tecnica/especie/obtenerespecie'},
					{ label: 'Obtener Especie por Id', slug: 'tecnica/especie/obtenerespeciebyid'},
					{ label: 'Actualizar Especie', slug: 'tecnica/especie/actualizarespecie'},
					{ label: 'Actualizar Especie por campo especifico', slug: 'tecnica/especie/patchespecie'},
					{ label: 'Eliminar Especie', slug: 'tecnica/especie/deleteespecie'},
				],
			},
			{
				label: 'asignacion',
				items: [
					{ label: 'Creacion de Asignacion', slug: 'tecnica/asignacion/crearasignacion' },
					{ label: 'Obtener Asignacion', slug: 'tecnica/asignacion/obtenerasignacion'},
					{ label: 'Obtener Asignacion por Id', slug: 'tecnica/asignacion/obtenerasignacionbyid'},
					{ label: 'Actualizar Asignacion', slug: 'tecnica/asignacion/actualizarasignacion'},
					{ label: 'Actualizar Asignacion por campo especifico', slug: 'tecnica/asignacion/patchasignacion'},
					{ label: 'Eliminar Asignacion', slug: 'tecnica/asignacion/deleteasignacion'},
				],
			},
			{
				label: 'calendario_lunar',
				items: [
					{ label: 'Creacion de Calendario Lunar', slug: 'tecnica/calendariolunar/crearcalendariolunar' },
					{ label: 'Obtener Calendario Lunar', slug: 'tecnica/calendariolunar/obtenercalendariolunar'},
					{ label: 'Obtener Calendario Lunar por Id', slug: 'tecnica/calendariolunar/obtenercalendariolunarbyid'},
					{ label: 'Actualizar Calendario Lunar', slug: 'tecnica/calendariolunar/actualizarcalendariolunar'},
					{ label: 'Actualizar Calendario Lunar por campo especifico', slug: 'tecnica/calendariolunar/patchcalendariolunar'},
					{ label: 'Eliminar Calendario Lunar', slug: 'tecnica/calendariolunar/deletecalendariolunar'},
				],
			},
        ]
        },
        //  Documentación de Usuario
        {
          label: 'Documentacion de Usuario',
		  collapsed: true, 
          items: [
			{
				label: 'Planteamiento del problema',
				items: [
					{ label: 'Planteamiento del Problema', slug: 'usuario/problematica/planteamiento'},
				],
			},
			{
				label: 'Requerimientos',
				items: [
					{ label: 'Especificación de Requerimientos de Software', slug: 'usuario/problematica/requerimientos'},
				],
			},
			{
				label: 'DiagramasUML',
				items: [
					{ label: 'Diagramacion UML del sistema', slug: 'usuario/problematica/diagramasuml'},
				],
			},
			{
				label: 'Manual configuracion ase de datos',
				items: [
					{ label: 'Configuracion de la base de datos', slug: 'usuario/problematica/conbasedatos'},
				],
			},
			{
				label: 'Prototipado del sistema',
				items: [
					{ label: 'Prototipado del sistema', slug: 'usuario/problematica/prototipado'},
				],
			},
          ]
        },
      ]
    })
  ]
});