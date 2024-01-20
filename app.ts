import http from 'http';
import compression from 'compression';
import express from 'express';
import { dbConnect, liveServer, socket } from 'libs';
import router from 'routes';

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.use(compression());
app.use(express.static('dist'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.locals = { templates: process.cwd() + '/views/templates/' };

dbConnect();
socket(server);
liveServer(app);

app.use('/', router);

app.use((req, res, next) => {
  console.warn(`\x1B[33m404\x1B[0m | ${req.url}`);
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(`\x1B[31m500\x1B[0m | ${req.url}`);
  if (app.settings.env === 'production') {
    console.error(err);
    res.status(500).render('500');
  } else {
    next(err.stack);
  }
});

server.on('error', (err) => {
  console.error(`\x1B[31mERROR\x1B[0m | ${err.stack}`);
});

server.listen(3100, () => {
  console.info('\x1B[36mconnected!!\x1B[0m');
});
