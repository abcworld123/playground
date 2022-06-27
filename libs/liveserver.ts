import livereload from 'connect-livereload';
import { createServer } from 'livereload';
import type { Express } from 'express';

export default function liveServer(app: Express) {
  const liveServer = createServer({ exts: ['ejs', 'css', 'js'] });

  liveServer.watch([
    '/views',
    '/public/stylesheets',
    '/public/javascripts',
  ].map(path => process.env.PWD + path));

  app.use(livereload());
}
