import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",

    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.tsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--avora-font-body)", ...defaultTheme.fontFamily.sans],
                heading: ["var(--avora-font-heading)", ...defaultTheme.fontFamily.serif],
                brand: ["var(--avora-font-brand)", ...defaultTheme.fontFamily.sans],
                roboto: ["var(--avora-font-roboto)", ...defaultTheme.fontFamily.sans],
                science: ["var(--avora-font-science)", ...defaultTheme.fontFamily.sans],
                cairo: ["var(--avora-font-cairo)", ...defaultTheme.fontFamily.sans],
                playfair: ["var(--avora-font-playfair)", ...defaultTheme.fontFamily.serif],
            },
        },
    },

    plugins: [forms],
};
