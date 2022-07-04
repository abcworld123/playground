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

server.on('error', (err) => {
  console.error(err);
});

server.listen(3000, () => {
  console.info('\x1B[36mconnected!!\x1B[0m');
});
