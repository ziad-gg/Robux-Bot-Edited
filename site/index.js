const express = require('express');
const session = require('express-session');
const passport = require('passport');
const path = require('path');
const axios = require('axios');
const WebSocket = require('ws');
const events = require('node:events');

const Transition = new events.EventEmitter();

const { PORT, UPTIME_API, PROJECT_LINK } = require('../src/Constants.js');
const client = require('../index');

const app = express();
const http = require('http').Server(app);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

require('./auth/passport')(passport);

const MongoStore = require('connect-mongo');

app.use(
  session({
    secret: 'foo',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: 'Session',
    }),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use('/', require('./routes/home.js'));
app.use('/api', require('./routes/api.js'));
app.use('/login', require('./routes/login.js'));
app.use('/dashboard', require('./routes/dashboard.js'));

app.get('/uptime', (req, res) => {
  res.status(200).send('OK');
});

app.use(function (req, res) {
  res.redirect('/');
});

const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {

  Transition.on('transfer', (data) => {
    const { username, amount, id, group } = data;

    ws.send(JSON.stringify({
      op: 'transfer',
      groupId: group.id,
      username: username,
      amount: amount,
      id: id
    }));

  });


  ws.on('error', console.error);

  ws.on('message', (message) => {
    const data = JSON.parse(message);

    if (data?.user) {
      const roblox = client.Application.getData('roblox');
      
      if (roblox.me.username !== data.user.username) {
        return ws.close();
      };

      client.Application.setData({ Transition });
      console.log('WebSocket client connected !');
    }

    if (data.op === 'transfer') {
      const id = data.id;
      Transition.emit(id.toString(), data);
    };

  });

  ws.on('close', () => {
    console.log('WebSocket client disconnected !');
    client.Application.setData({ Transition: null });
  });

});

http.on('upgrade', (req, socket, head) => {
  if (req.url === '/gateway') {
    wss.handleUpgrade(req, socket, head, (ws) => {
      wss.emit('connection', ws, req);
    });
  } else {
    socket.destroy();
  }
});

http.on('listening', async () => {
  await axios({ url: UPTIME_API + '/add', method: 'POST', data: { url: PROJECT_LINK + '/uptime' } })
    .then(() => {
      console.log('Uptimed Successfully !');
    })
    .catch((e) => {
      if (e.response?.status === 403) console.log('Uptimed Successfully !');
      console.error('Uptimed Failed !');
    });
});

delete Object.prototype.extends;
http.listen(PORT, () => {
  console.log(`HTTP server listening on port ${PORT}.`);
});
