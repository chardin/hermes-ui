import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
	host: '0.0.0.0',
	proxy: {
	    "/api": {
		target: "http://localhost:5000",
		changeOrigin: true,
		secure: false,
		cors: false,
		ws: true,
	    },
	},
    },
    plugins: [react()],
})
