import config from 'config';
import livereload from 'connect-livereload';
import { createServer } from 'livereload';
import type { Express } from 'express';

export function liveServer(app: Express) {
  if (config.node.mode === 'production') return;
  const liveServer = createServer({ exts: ['ejs', 'css', 'js'], delay: 200 });

  liveServer.watch([
    '/src/pages',
    '/dist/stylesheets',
    '/dist/javascripts',
  ].map(path => process.env.PWD + path));

  app.use(livereload());
}
