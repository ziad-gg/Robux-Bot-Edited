const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('codes')
  .setDescription('To see current codes.')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false))
  .setUsage(['{cmdname}'])
  .setExample(['{cmdname}'])
  .setGlobal(GlobalExecute)
  
async function GlobalExecute(message, interaction) { 
  const controller = message ?? interaction;
  const giftsCode = await controller.getData('codes').find();
  const embed = new EmbedBuilder().setTitle('📃 مجموعة الكودات المضافة');
  giftsCode.forEach((i) => {
    embed.addFields([{ name: 'Code: ' + i.code, value: `**Usaged By: \`${i.redeemedBy.length}\`\nRemaining: \`${i.max - i.redeemedBy.length}\`\nPrize: \`${i.prize}R\`**` }]);
  });
  controller.channel.send({ embeds: [embed] });
};