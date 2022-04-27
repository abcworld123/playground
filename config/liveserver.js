module.exports = (app) => {
  const livereload = require('livereload');
  const liveServer = livereload.createServer({ exts: ['ejs', 'css', 'js'] });

  liveServer.watch([
    '/views',
    '/src/css',
    '/public/stylesheets',
    '/public/javascripts',
  ].map(path => process.env.PWD + path));

  app.use(require('connect-livereload')());
};
