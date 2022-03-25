var express = require('express');
var http = require('http');
var app = express();

app.set('views', __dirname + '/Views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

var server = http.createServer(app);
app.use('/', require('./routes/index'));

app.use((req, res, next) => {
  res.status(404);
  res.render('didid');
  console.error(`no exists: ${req.originalUrl}`);
});

server.on('error', (err) => {
  console.error(err);
});

server.listen(3000, () => {
  console.log('connected!!');
});
