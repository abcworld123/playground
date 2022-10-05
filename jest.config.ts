import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
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
};

export default config;
