import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import fs from 'fs'

// GitHub Pages: serve SPA for unknown paths so client-side router can handle /main-mode etc.
function copyIndexAs404() {
    return {
        name: 'copy-index-as-404',
        closeBundle() {
            const outDir = path.resolve(__dirname, 'dist')
            const indexPath = path.join(outDir, 'index.html')
            const notFoundPath = path.join(outDir, '404.html')
            if (fs.existsSync(indexPath)) {
                fs.copyFileSync(indexPath, notFoundPath)
                console.log('GitHub Pages: wrote 404.html for SPA routing')
            }
        },
    }
}

// https://vite.dev/config/
export default defineConfig({
    base: '/Insym_challanges_phasmo/',
    plugins: [react(), tailwindcss(), copyIndexAs404()],
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
