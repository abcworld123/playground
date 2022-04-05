var express = require('express');
var http = require('http');
var app = express();
var server = http.createServer(app);

require('dotenv').config();
require('./sockets/socket')(server);

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  res.status(404).render('cannotAccess');
  console.error(`no exists: ${req.originalUrl}`);
});

server.on('error', (err) => {
  console.error(err);
});

server.listen(3000, () => {
  console.log('connected!!');
});
