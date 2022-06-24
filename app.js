const http = require('http');
const compression = require('compression');
const express = require('express');
const appLocals = require('./config/app.locals');
const liveServer = require('./config/liveserver');
const dbConnect = require('./config/mongoose');
const socket = require('./sockets/socket');

const app = express();
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.use(compression());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.locals = appLocals;

dbConnect();
liveServer(app);
socket(server);

app.use('/favicon.ico', express.static('public/images/favicon.ico'));
app.use('/', require('./routes/index'));

server.on('error', (err) => {
  console.error(err);
});

server.listen(3000, () => {
  console.info('\x1B[36mconnected!!\x1B[0m');
});
