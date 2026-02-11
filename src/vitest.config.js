import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Use happy-dom for lightweight DOM simulation
    environment: 'happy-dom',

    // Global test utilities
    globals: true,

    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['js/**/*.js'],
      exclude: [
        'js/**/*.test.js',
        '__tests__/**',
        'node_modules/**'
      ]
    },

    // Setup file for global mocks
    setupFiles: ['__tests__/setup.js'],

    // Test file patterns
    include: ['__tests__/**/*.test.js'],

    // Timeout for async tests
    testTimeout: 10000
  }
});
