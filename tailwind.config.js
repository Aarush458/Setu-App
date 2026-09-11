/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                ink: {
                    DEFAULT: '#16232A',
                    light: '#2B3A42',
                },
                paper: {
                    DEFAULT: '#EEF0EA',
                    dark: '#10181D',
                },
                accent: {
                    DEFAULT: '#E3A23C',
                    dark: '#F0B25A',
                },
                teal: {
                    DEFAULT: '#1F5C56',
                    light: '#2E7A72',
                },
                muted: '#5B6560',
            },
            fontFamily: {
                display: ['Fraunces', 'serif'],
                sans: ['"Work Sans"', 'sans-serif'],
            },
        },
    },
    plugins: [],
}