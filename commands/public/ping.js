const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('ping')
  .setDescription('Test the bots response time.')
  .setCooldown('10s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false))
  .setGlobal(GlobalExecute)
  
async function GlobalExecute(message, interaction) {
  let now = message ? message.createdTimestamp : interaction.createdTimestamp;
  const controller = message ?? interaction;
  const msg = await controller.replyNoMention({ content: '**🏓 Pong...**' });
  now = Date.now() - now;
  const embed = new EmbedBuilder()
    .setColor(0x0068ff)
    .setDescription(`**⏰ Discord API: ${controller.client.ws.ping}ms\n📊 Time Taken: ${now}ms**`)
    .setTimestamp()
  
  controller.editMsg = (obj) => interaction ? interaction.editReply(obj) : msg.edit(obj);
  controller.editMsg({ content: '', embeds: [embed] });
}