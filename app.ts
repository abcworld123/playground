import http from 'http';
import compression from 'compression';
import express from 'express';
import { liveServer, socket } from 'libs';
import router from 'routes';
import { textCyan, textRed, textYellow } from 'utils/colorprint';

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.use(compression());
app.use(express.static('dist'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.locals = { templates: process.cwd() + '/views/templates/' };

// dbConnect();
socket(server);
liveServer(app);

app.use('/', router);

app.use((req, res, next) => {
  console.warn(`${textYellow('404')} | ${req.url}`);
  res.status(404).render('404');
});

app.use((err, req, res, next) => {
  console.error(`${textRed('500')} | ${req.url}`);
  if (app.settings.env === 'production') {
    console.error(err);
    res.status(500).render('500');
  } else {
    next(err.stack);
  }
});

server.on('error', (err) => {
  console.error(`${textRed('ERROR')} | ${err.stack}`);
});

const port = process.env.NODE_ENV === 'development' ? 3000 : 3100;
server.listen(port, () => {
  console.info(textCyan('connected!!'));
});
