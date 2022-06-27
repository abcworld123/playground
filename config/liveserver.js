module.exports = (app) => {
  const livereload = require('livereload');
  const liveServer = livereload.createServer({ exts: ['ejs', 'css', 'js'] });

  liveServer.watch([
    '/views',
    '/public/stylesheets',
    '/public/javascripts',
  ].map(path => process.cwd() + path));

  app.use(require('connect-livereload')());
};
