import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';

function routeFallbacks() {
  return {
    name: 'route-fallbacks',
    closeBundle() {
      const dist = path.resolve(process.cwd(), 'dist');
      ['admin', 'about', 'ventures', 'services', 'contact'].forEach((route) => {
        const routeDir = path.join(dist, route);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.copyFileSync(path.join(dist, 'index.html'), path.join(routeDir, 'index.html'));
      });
    },
  };
}

export default defineConfig({
  plugins: [react({ include: /src\/.*\.[jt]sx?$/ }), routeFallbacks()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), 'src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Split big libraries into their own files so browsers cache them
        // separately from site code that changes more often.
        manualChunks(id) {
          if (!id.includes('node_modules')) return undefined;
          if (id.includes('@supabase')) return 'vendor-supabase';
          if (id.includes('framer-motion') || id.includes('motion-dom') || id.includes('motion-utils')) return 'vendor-motion';
          if (id.includes('gsap') || id.includes('lenis')) return 'vendor-gsap';
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/') || id.includes('scheduler')) return 'vendor-react';
          return undefined;
        },
      },
    },
  },
});
