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
						{ label: 'token', slug: 'guides/token'}
					],
				},
				{
					label: 'usuarios',
					items: [
                        { label: 'Creacion de Usuarios', slug: 'guides/crearusuario' },
						{ label: 'Obtener Usuarios', slug: 'guides/obtenerusuarios'}
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
