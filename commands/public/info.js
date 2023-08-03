const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('info')
  .setDescription('Shows user information.')
  .setUsage(['{cmdname}', '{cmdname} (User)'])
  .setExample(['{cmdname}', '{cmdname} {userMention}', '{cmdname} {userId}'])
  .setCooldown('10s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addUserOption((option) => option
     .setName('user')
     .setDescription('User to show the his information')
     .setRequired(false)))
  .setGlobal(GlobalExecute)

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  const usersData = controller.getData('users');
  const args = controller[0];
  
  const user = args ? await controller.getUser(args.toId()) : controller.author;
  if (!user) return controller.replyNoMention({ content: '❌ **لا يمكنني العثور على هذا العضو!**' });
  if (user.bot) return controller.replyNoMention({ content: '❌ **البوتات لا تملك حساب!**' });
  
  const userData = await usersData.get(user.id);
  const embed = new EmbedBuilder()
    .setAuthor({ name: user.username, iconURL: user.avatarURL() })
    .setColor('#0be881')
    .addFields([{ name: 'عدد مرات شراء الروبكس:', value: `${userData.buyedCount}` }]) 
    .addFields([{ name: 'اجمالي الشراء:', value: `${userData.buyedTotal}` }]) 
    .addFields([{ name: 'عدد مرات سحب الروبكس:', value: `${userData.transactionsCount}` }]) 
    .addFields([{ name: 'اجمالي السحب:', value: `${userData.transactionsTotal}` }]) 
  if (userData.lastTransactionsAccount) embed.addFields([{ name: 'اخر حساب تم السحب اليه:', value: `${userData.lastTransactionsAccount}` }]) 
    .setFooter({ text: controller.author.username, iconURL: controller.author.avatarURL() })
    .setTimestamp();
  
  controller.replyNoMention({ embeds: [embed] });
};