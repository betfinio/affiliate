/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	important: '.affiliate',
	content: ['./src/**/*.{ts,tsx}'],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				primary: '#0F121D',
				primaryLight: '#131624',
				primaryLighter: '#151A2A',
				secondary: '#201C40',
				secondaryLight: '#292546',
				secondaryLighter: '#201C4080',
				purple: {
					box: '#6A6A9F',
					table: '#201C40',
				},
				red: {
					600: '#B80042',
					roulette: '#dd375f',
				},
			},

			fontFamily: {
				sans: ['Rounds', 'sans-serif'],
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
};
