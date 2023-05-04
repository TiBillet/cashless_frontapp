import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import * as dotenv from 'dotenv' // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

dotenv.config()

console.log('VITE_NFC_PORT_SERVER =', process.env.VITE_NFC_PORT_SERVER)
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "/src"),
      "~@": resolve(__dirname, "/src")
    },
  },
  build: {
    minify: false,
    outDir: 'www'
  },
  server: {
    cors: true,
    port: process.env.VITE_NFC_PORT_SERVER,
    proxy: {
      "/wv": {
        target: 'https://demo.cashless.tibillet.localhost',
        changeOrigin: true,
        secure: false
      },
    }
  }
})
