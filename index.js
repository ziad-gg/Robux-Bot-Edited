const { Client } = require('discord.js');
const { Zoblox, Events } = require('zoblox.js');
const { Application } = require('handler.djs');
const { DEFAULT_PREFIX, OWNERS, CLIENT_OPTIONS } = require('./src/Constants.js');
const EventEmitter = require('node:events');
const mongoose = require('mongoose');
const path = require('node:path');
const client = new Client(CLIENT_OPTIONS);
const zoblox = new Zoblox();

require('dotenv').config()

new Application(client, {
  commandsPath: path.join(__dirname, 'commands'),
  validationPath: path.join(__dirname, 'validation'),
  EventsPath: path.join(__dirname, 'events'),
  owners: OWNERS,
  prefix: DEFAULT_PREFIX
});

client.Application.setCooldown({   
  message: '**{Username}**, Cooldown (**{counter}** left)', 
  reference: true, 
  long: true, 
  Mdelete: 2500,
  EphemeralReply: true,
  once: true
});

client.Application.build();
client.Application.setData({
  events: new EventEmitter(), 
  roblox: zoblox, 
  buy_cooldowns: new Map(),
  guilds: require('./src/models/Guilds.js'),
  codes: require('./src/models/Codes.js'),
  users: require('./src/models/Users.js'),
  requests: require('./src/models/Requests.js'),
  Constants: require('./src/Constants.js'),
});

process.on('unhandledRejection', (err) => console.error(err));
zoblox.on(Events.UserReady, () => console.log(`Logged in as: ${zoblox.me.username} !`));
mongoose.connection.on('connected', () => console.log('Connected to database !'));

mongoose.connect(process.env.MONGO_URL);
zoblox.login(process.env.COOKIE);

require('./src/Util.js');

(async () => {
  await client.login(process.env.TOKEN);
  
  require('./src/intervalRequests.js')();  
})();

module.exports = client;