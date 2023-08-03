const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder, roleMention } = require('discord.js');
const { DEFAULT_THXEMOJI } = require('../../src/Constants.js');

module.exports = new CommandBuilder() 
  .setName('settings')
  .setDescription('Displays system information.')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false))
  .setGlobal(GlobalExecute)
  .OwnersOnly()

async function GlobalExecute(message, interaction, global) {
  const controller = message ?? interaction;
  const guildsData = controller.getData('guilds');
  const guildData = await guildsData.get(controller.guild.id);
  const thxEmoji = controller.guild.emojis.cache.get(guildData.thxEmoji) ?? DEFAULT_THXEMOJI;  
  
  const embed = new EmbedBuilder()
    .setColor('#0be881')
    .setTitle('System Information')
    .addFields([{ name: 'Group', value: `\`\`\`${guildData.group || 'None'}\`\`\`` }])
    .addFields([{ name: 'Robux Price', value: `\`\`\`${guildData.price || 'None'}\`\`\`` }])
    .addFields([{ name: 'Minimum', value: `\`\`\`buy: ${guildData.buy.min || 'None'}, transfer: ${guildData.transfer.min}\`\`\`` }])
    .addFields([{ name: 'Maximum', value: `\`\`\`buy: ${guildData.buy.max || 'None'}, transfer: ${guildData.transfer.min}\`\`\`` }])
    .addFields([{ name: 'Thx Emoji', value: `${thxEmoji}` }])
    .addFields([{ name: 'Thx Channel', value: `${controller.client.channels.cache.get(guildData.thxChannel) || 'None'}` }])
    .addFields([{ name: 'Codes Channel', value: `${controller.client.channels.cache.get(guildData.codesChannel) || 'All Channels'}` }])
    .addFields([{ name: 'Logs Channel', value: `${controller.client.channels.cache.get(guildData.logsChannel) || 'None'}` }])
    .addFields([{ name: 'Done Channel', value: `${controller.client.channels.cache.get(guildData.proofsChannel) || 'None'}` }])
    .addFields([{ name: 'Recipient', value: `${controller.client.users.cache.get(guildData.recipient) || 'None'}`}])
    .addFields([{ name: 'Clients Role', value:`${controller.guild.roles.cache.get(guildData.clientsRole) || 'None'}` }])
    .addFields([{ name: 'Status', value: `\`\`\`buy: ${guildData.buy.status ? 'on' : 'off' || 'None'}, transfer: ${guildData.transfer.status ? 'on' : 'off' || 'None'}\`\`\`` }])
   
  return controller.replyNoMention({
    embeds: [embed]
  });
}