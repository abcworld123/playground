module.exports = (app) => {
  const livereload = require('livereload');
  const liveServer = livereload.createServer({ exts: ['ejs', 'css', 'js'], debug: true });

  liveServer.watch([
    '/views',
    '/src/css',
    '/public/stylesheets',
    '/public/javascripts',
  ].map(path => process.cwd() + path));

  app.use(require('connect-livereload')());
};
