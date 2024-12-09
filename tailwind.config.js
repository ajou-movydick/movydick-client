module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            keyframes: {
                'non-linear-spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '50%': { transform: 'rotate(240deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            },
        },
    },
    plugins: [],
};

