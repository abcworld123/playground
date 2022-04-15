var express = require('express');
var http = require('http');
var app = express();
var mongoose = require('mongoose');
var config = require('./config/config');
require('dotenv').config();

const mongooseOption = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  auth: {
    authdb: config.database.mongooseAUTH,
    username: config.database.mongooseID,
    password: config.database.mongoosePW,
  },
};
mongoose.connect(`mongodb://${config.database.serverURL}/${config.database.mongooseAUTH}`, mongooseOption, function (err) {
  err ? console.error(err) : console.log('Data DB Connected.');
});

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
