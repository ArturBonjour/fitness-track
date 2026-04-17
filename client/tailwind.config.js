/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#4a148c',
                'primary-light': '#6a1b9a',
                'primary-dark': '#38006b',
                secondary: '#000000',
                light: '#ffffff',
            },
            fontFamily: {
                sans: ['Roboto', 'sans-serif'],
            },
            keyframes: {
                shimmer: {
                    '0%': { backgroundPosition: '-468px 0' },
                    '100%': { backgroundPosition: '468px 0' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(100%)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideOutRight: {
                    '0%': { transform: 'translateX(0)', opacity: '1' },
                    '100%': { transform: 'translateX(100%)', opacity: '0' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0.3)', opacity: '0' },
                    '50%': { transform: 'scale(1.05)' },
                    '70%': { transform: 'scale(0.9)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulse404: {
                    '0%, 100%': { textShadow: '0 0 20px rgba(74,20,140,0.5)' },
                    '50%': { textShadow: '0 0 60px rgba(74,20,140,0.9)' },
                },
                staggerFade: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
            },
            animation: {
                shimmer: 'shimmer 1.5s infinite linear',
                'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                'bounce-in': 'bounceIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                float: 'float 3s ease-in-out infinite',
                'pulse-404': 'pulse404 2s ease-in-out infinite',
                'stagger-fade': 'staggerFade 0.4s ease-out forwards',
            },
            boxShadow: {
                card: '0 4px 24px rgba(74,20,140,0.10)',
                'card-hover': '0 8px 40px rgba(74,20,140,0.18)',
                glow: '0 0 0 3px rgba(74,20,140,0.25)',
            },
        },
    },
    plugins: [],
}