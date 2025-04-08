import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import terser from '@rollup/plugin-terser'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {},
    global: 'window',
  },
  resolve: {
    alias: {
      'google-auth-library': 'google-auth-library/build/src/index.js',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      plugins: [terser()],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          mui: ['@mui/material', '@mui/icons-material'],
        },
      },
    },
  },
  // server: {
  //   port: 3000,
  //   strictPort: true,
  //   proxy: {
  //     '/api': {
  //       target: 'https://www.googleapis.com',
  //       changeOrigin: true,
  //       rewrite: (path) => path.replace(/^\/api/, ''),
  //       secure: false,
  //       configure: (proxy, _options) => {
  //         proxy.on('error', (err, _req, _res) => {
  //           //@ts-ignore
  //           console.log('proxy error', err);
  //         });
  //         proxy.on('proxyReq', (_proxyReq, req, _res) => {
  //           //@ts-ignore
  //           console.log('Sending Request to the Target:', req.method, req.url);
  //         });
  //         proxy.on('proxyRes', (proxyRes, req, _res) => {
  //           //@ts-ignore
  //           console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
  //         });
  //       },
  //     },
  //   },
  // },
  // preview: {
  //   port: 3000,
  // },
})
