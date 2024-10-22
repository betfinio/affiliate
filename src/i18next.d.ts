import type { resources } from './i18n';

declare module 'i18next' {
	interface CustomTypeOptions {
		defaultNS: 'affiliate';
		resources: (typeof resources)['en'];
	}
}

export type IFilterKeys = (typeof resources)['en']['affiliate']['tables']['filter'];
