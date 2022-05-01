const express = require('express');
const http = require('http');
const app = express();
const compression = require('compression');
const dbConnect = require('./config/mongoose');
const liveServer = require('./config/liveserver');
const appLocals = require('./config/app.locals');
const server = http.createServer(app);

app.set('view engine', 'ejs');
app.use(compression());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.locals = appLocals;

dbConnect();
liveServer(app);

app.use('/favicon.ico', express.static('public/images/favicon.ico'));
app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  res.status(404).render('cannotAccess');
  console.warn(`not exists: ${req.url}`);
});

server.on('error', (err) => {
  console.error(err);
});

server.listen(3000, () => {
  console.info('\x1B[36mconnected!!\x1B[0m');
});
