const { Partials, ActivityType } = require('discord.js');

module.exports.DEFAULT_PREFIX = '-'; //Default Prefix

module.exports.DEFAULT_GUILD = '988515701318901770'; //Default Server Id

module.exports.DEFAULT_THXEMOJI = '❤️'; //Default Thx Emoji

module.exports.PROJECT_LINK = 'https://' + 'bot-robux' + '.glitch.me' //Replace bot-robux with the project name

module.exports.CLIENT_OPTIONS = {
  intents: 3276799,
  partials: [Partials.Channel, Partials.User, Partials.Message, Partials.Reaction, Partials.GuildMember],
  presence: {
    status: 'Online',
    activities: [{
      type: ActivityType.Playing,
      name: '/help | Robux Factory'
    }]
  },
}; //Client Options

module.exports.PROBOT_IDS = [
  '282859044593598464',
  '567703512763334685',
]; //ProBot Ids

module.exports.OWNERS = [
  '860865950945378325'
]; //Owners Ids


// - - - - -
  
module.exports.PORT = 3000;

module.exports.UPTIME_API = 'https://web-uptimer.glitch.me';
