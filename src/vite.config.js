import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import { execSync } from 'child_process';

function getGitVersion() {
  try {
    const tag = execSync('git describe --tags --exact-match 2>/dev/null', { encoding: 'utf-8' }).trim();
    if (tag) return tag;
  } catch { /* no tag on current commit */ }
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    return 'unknown';
  }
}

export default defineConfig({
  plugins: [tailwindcss()],
  define: {
    __APP_VERSION__: JSON.stringify(getGitVersion()),
  },
  base: './',
  build: {
    outDir: '../docs',
    emptyOutDir: true
  }
});
