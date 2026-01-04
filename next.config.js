const { version } = require('./package.json');
const { execSync } = require('child_process');

// Obter o hash do commit atual
let buildHash = 'dev';
try {
  // Usar variável de ambiente do Vercel se disponível
  buildHash = process.env.VERCEL_GIT_COMMIT_SHA?.substring(0, 7) || 
             execSync('git rev-parse --short HEAD').toString().trim();
} catch (error) {
  console.warn('Não foi possível obter o hash do commit, usando "dev"');
}

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_BUILD_HASH: buildHash,
  },
  // Optimize production builds
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
}

module.exports = withBundleAnalyzer(nextConfig)
