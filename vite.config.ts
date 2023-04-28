import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  plugins: [react(),
    federation({
      name: 'log-viewer',
      filename: 'remoteEntry.js',
      exposes: {
          './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom']
  })
  ],
})
