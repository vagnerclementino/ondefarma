const { version } = require('./package.json');
const { execSync } = require('child_process');

// Obter o hash do commit atual
let buildHash = 'dev';
try {
  buildHash = execSync('git rev-parse --short HEAD').toString().trim();
} catch (error) {
  console.warn('Não foi possível obter o hash do commit, usando "dev"');
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_BUILD_HASH: buildHash,
  },
}

module.exports = nextConfig
