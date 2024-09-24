import type { i18n } from 'i18next';
import * as i18 from 'i18next';
import ICU from 'i18next-icu';
import { initReactI18next } from 'react-i18next';

import czAffiliate from './translations/cz/affiliate.json';
import enAffiliate from './translations/en/affiliate.json';
import ruAffiliate from './translations/ru/affiliate.json';

import { sharedLang } from 'betfinio_app/locales/index';

export const resources = {
	en: {
		affiliate: enAffiliate,
		shared: sharedLang.en,
	},
	ru: {
		affiliate: ruAffiliate,
		shared: sharedLang.ru,
	},
	cz: {
		affiliate: czAffiliate,
		shared: sharedLang.cz,
	},
} as const;

const instance: i18n = i18.createInstance();
instance
	.use(initReactI18next)
	.use(ICU)
	.init({
		resources,
		lng: 'en', // default language
		fallbackLng: 'en',
		defaultNS: 'affiliate',
		interpolation: { escapeValue: false },
		react: { useSuspense: true },
	});

export default instance;
