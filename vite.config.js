import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import fs from 'fs'

// https://vite.dev/config/
export default defineConfig({
    server: {
	host: '0.0.0.0',
	https: {
	    key: fs.readFileSync('./localhost-key.pem'),
	    cert: fs.readFileSync('./localhost.pem'),
	},
	plugins: [
	    basicSsl()
	],
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
