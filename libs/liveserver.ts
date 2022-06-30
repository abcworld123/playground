import config from 'config';
import livereload from 'connect-livereload';
import { createServer } from 'livereload';
import type { Express } from 'express';

export default function liveServer(app: Express) {
  if (config.node.mode === 'production') return;
  const liveServer = createServer({ exts: ['ejs', 'css', 'js'] });

  liveServer.watch([
    '/views',
    '/public/stylesheets',
    '/public/javascripts',
  ].map(path => process.env.PWD + path));

  app.use(livereload());
}
