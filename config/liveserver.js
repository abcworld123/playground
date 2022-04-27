const livereload = require('livereload');
const liveServer = livereload.createServer({ exts: ['ejs', 'css', 'js'] });

liveServer.watch([
  '/views',
  '/src/css',
  '/public/stylesheets',
  '/public/javascripts',
].map(path => __dirname + path));

module.exports = (app) => {
  app.use(require('connect-livereload')());
};
