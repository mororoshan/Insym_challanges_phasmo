import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
    base: '/Insym_challanges_phasmo/',
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    server: {
        host: true,
        ...(fs.existsSync('./localhost+1-key.pem') &&
            fs.existsSync('./localhost+1.pem') && {
            https: {
                key: fs.readFileSync('./localhost+1-key.pem'),
                cert: fs.readFileSync('./localhost+1.pem'),
            },
        }),
    },
})
