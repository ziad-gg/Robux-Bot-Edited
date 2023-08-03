const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('balance')
  .setDescription('Shows user balance.')
  .setUsage(['{cmdname}', '{cmdname} (User)'])
  .setExample(['{cmdname}', '{cmdname} {userMention}', '{cmdname} {userId}'])
  .setCooldown('10s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(true).addUserOption((option) => option
     .setName('user')
     .setDescription('User to show the his balance')
     .setRequired(false)))
  .setGlobal(GlobalExecute)
  .setAliases([{ cut: 'bal', prefix: true }])

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  const usersData = controller.getData('users');
  const args = controller[0];
  
  const user = args ? await controller.getUser(args.toId()) : controller.author;
  if (!user) return controller.replyNoMention({ content: '❌ **لا يمكنني العثور على هذا العضو!**' });
  if (user.bot) return controller.replyNoMention({ content: '❌ **البوتات لا تملك حساب!**' });
  
  const userData = await usersData.get(user.id);
  const msg = user.id === controller.author.id ? `**رصيد حسابك هو \`${userData.balance}\`** 🪙` : `**رصيد ${user.username} هو \`${userData.balance}\`** 🪙`;
  
  controller.replyNoMention({ content: msg });
};