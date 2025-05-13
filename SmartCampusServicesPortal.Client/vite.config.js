import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import plugin from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const isDev = process.env.NODE_ENV === 'development';

let httpsConfig = {};

if (isDev) {
  const baseFolder =
      env.APPDATA !== undefined && env.APPDATA !== ''
          ? `${env.APPDATA}/ASP.NET/https`
          : `${env.HOME}/.aspnet/https`;

  const certificateName = 'SmartCampusServicesPortal.client';
  const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
  const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

  if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
    if (
        0 !==
        child_process.spawnSync(
            'dotnet',
            [
              'dev-certs',
              'https',
              '--export-path',
              certFilePath,
              '--format',
              'Pem',
              '--no-password'
            ],
            { stdio: 'inherit' }
        ).status
    ) {
      throw new Error('Could not create certificate.');
    }
  }

  httpsConfig = {
    key: fs.readFileSync(keyFilePath),
    cert: fs.readFileSync(certFilePath)
  };
}

const target = env.ASPNETCORE_HTTPS_PORT
    ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}`
    : env.ASPNETCORE_URLS
        ? env.ASPNETCORE_URLS.split(';')[0]
        : 'https://localhost:7257';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '^/api': {
        target,
        secure: false
      }
    },
    port: 5173,
    https: isDev ? httpsConfig : false // Only use HTTPS in development mode
  },
  build: {
    target: 'esnext' // This enables top-level await
  },
  esbuild: {
    supported: {
      'top-level-await': true // Enable top-level await in esbuild
    }
  }
})
