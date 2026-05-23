import { defineConfig } from 'jest';

export default defineConfig({
  preset: 'ts-jest',
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
