const express = require('express');
const http = require('http');
const app = express();
const dbConnect = require('./config/mongoose');
const liveServer = require('./config/liveserver');
const server = http.createServer(app);

liveServer(app);
dbConnect();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  res.status(404).render('cannotAccess');
  console.warn(`not exists: ${req.originalUrl}`);
});

server.on('error', (err) => {
  console.error(err);
});

server.listen(3000, () => {
  console.info('\x1B[36mconnected!!\x1B[0m');
});
