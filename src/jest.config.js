// Konfigurasi Jest untuk seluruh pengujian LawHub.
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  testTimeout: 30000,
  verbose: true,
  reporters: ['default'],   // tampilkan daftar setiap test (✓ lulus / ✕ gagal)
  collectCoverageFrom: [
    'models/**/*.js',
    'services/**/*.js',
    '!**/node_modules/**',
  ],
  coverageReporters: ['text', 'text-summary'],
};
