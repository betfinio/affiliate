import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';
import { dependencies } from './package.json';

const getApp = () => {
	return `betfinio_app@${process.env.PUBLIC_APP_URL}/mf-manifest.json`;
};

function getOutput() {
	return process.env.PUBLIC_OUTPUT_URL;
}

export default defineConfig({
	server: {
		port: 8888,
	},
	dev: {
		assetPrefix: 'http://localhost:8888',
	},
	html: {
		title: 'BetFin Affiliate',
		favicon: './src/assets/favicon.svg',
	},
	output: {
		assetPrefix: getOutput(),
	},
	plugins: [pluginReact()],
	tools: {
		rspack: {
			ignoreWarnings: [/Critical dependency: the request of a dependency is an expression/],
			output: {
				uniqueName: 'betfinio_affiliate',
			},
			plugins: [
				TanStackRouterRspack(),
				new ModuleFederationPlugin({
					name: 'betfinio_affiliate',
					remotes: {
						betfinio_app: getApp(),
					},
					shared: {
						react: {
							singleton: true,
							requiredVersion: dependencies.react,
						},
						'react-dom': {
							singleton: true,
							requiredVersion: dependencies['react-dom'],
						},
						'@tanstack/react-router': {
							singleton: true,
							requiredVersion: dependencies['@tanstack/react-router'],
						},
						'@tanstack/react-query': {
							singleton: true,
							requiredVersion: dependencies['@tanstack/react-query'],
						},
						'@tanstack/react-table': {
							singleton: true,
							requiredVersion: dependencies['@tanstack/react-table'],
						},
						'lucide-react': {
							singleton: true,
							requiredVersion: dependencies['lucide-react'],
						},
						'@supabase/supabase-js': {
							singleton: true,
							requiredVersion: dependencies['@supabase/supabase-js'],
						},
						i18next: {
							singleton: true,
							requiredVersion: dependencies.i18next,
						},
						'react-i18next': {
							singleton: true,
							requiredVersion: dependencies['react-i18next'],
						},
						'tailwindcss-animate': {
							singleton: true,
							requiredVersion: dependencies['tailwindcss-animate'],
						},
						tailwindcss: {
							singleton: true,
							requiredVersion: dependencies.tailwindcss,
						},
						wagmi: {
							singleton: true,
							requiredVersion: dependencies.wagmi,
						},
						'i18next-browser-languagedetector': {
							singleton: true,
							requiredVersion: dependencies['i18next-browser-languagedetector'],
						},
					},
				}),
			],
		},
	},
});
