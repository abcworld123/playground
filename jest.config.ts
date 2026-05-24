import { defineConfig } from 'jest';

export default defineConfig({
  preset: 'ts-jest/presets/default-esm',
  moduleFileExtensions: [
    'js',
    'json',
    'ts',
  ],
  rootDir: '.',
  testRegex: '.*\\.test\\.(t|j)s$',
  collectCoverageFrom: [
    '**/*.(t|j)s',
  ],
  testEnvironment: 'node',
});
