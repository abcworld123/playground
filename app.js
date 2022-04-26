const express = require('express');
const http = require('http');
const app = express();
const mongoose = require('mongoose');
const config = require('#config');
const liveServer = require('./liveserver');
const server = http.createServer(app);

liveServer(app);

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
  err ? console.error(err) : console.info('\x1B[36mData DB Connected.\x1B[0m');
});

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
