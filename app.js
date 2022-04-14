var express = require('express');
var http = require('http');
var app = express();
var mongoose = require('mongoose');

require('dotenv').config();
mongoose.connect('mongodb://localhost:27017/playground');

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

var server = http.createServer(app);
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
