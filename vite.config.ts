import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const productionApiUrl = 'https://real-estate-website-3u6z.onrender.com';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  if (mode === 'production') {
    const apiUrl = env.VITE_API_URL?.trim();
    if (!apiUrl) {
      throw new Error('VITE_API_URL is required for production builds. Set it to the deployed Express backend URL.');
    }
    if (apiUrl !== productionApiUrl) {
      throw new Error(`VITE_API_URL must be ${productionApiUrl} for production builds.`);
    }

    try {
      const parsedApiUrl = new URL(apiUrl);
      if (!['http:', 'https:'].includes(parsedApiUrl.protocol) || !parsedApiUrl.host) {
        throw new Error('invalid URL');
      }
    } catch {
      throw new Error('VITE_API_URL must be a complete http(s) URL for the deployed Express backend.');
    }
  }

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/sitemap.xml': 'http://localhost:5000',
        '/robots.txt': 'http://localhost:5000',
      },
    },
  };
})
