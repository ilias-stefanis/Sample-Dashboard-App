/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,vue}",
        "./node_modules/tw-elements/js/**/*.{js,cjs}",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("tw-elements/plugin.cjs")],
    darkMode: 'class'
}
