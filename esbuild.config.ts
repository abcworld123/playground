import { build } from 'esbuild';

await build({
  entryPoints: ['app.ts'],
  outfile: 'build/server.mjs',
  bundle: true,
  platform: 'node',
  format: 'esm',
  target: 'node26',
  tsconfig: 'tsconfig.json',
  sourcemap: true,
  sourcesContent: false,
  external: ['bufferutil', 'utf-8-validate'],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  banner: {
    js: 'import { createRequire } from \'node:module\'; const require = createRequire(import.meta.url);',
  },
  logLevel: 'warning',
});
