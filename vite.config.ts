import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        products: resolve(__dirname, 'products.html'),
        partners: resolve(__dirname, 'partners.html'),
        services: resolve(__dirname, 'services.html'),
        rfq: resolve(__dirname, 'rfq.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/echarts')) {
            return 'echarts';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
  },
});
