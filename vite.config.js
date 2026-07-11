import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    optimizeDeps: {
        // Pre-bundle Swiper before an Inertia page requests it dynamically.
        include: ['swiper/react', 'swiper/modules'],
    },
    plugins: [
        laravel({
            input: 'resources/js/app.tsx',
            refresh: true,
        }),
        react(),
    ],
});
