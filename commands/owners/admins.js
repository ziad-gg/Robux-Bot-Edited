const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('admins')
  .setDescription('Management admins.')
  .setUsage(['{cmdname} (CommandName)'])
  .setExample(['{cmdname} add {userMention} ', '{cmdname} add {userId}' ])
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false))
  .setGlobal(GlobalExecute)
  .OwnersOnly()
  .setSubcommands([
     { command: 'add' },
     { command: 'remove' },
     { command: 'list' },
  ]);

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;  
  const guildsData = controller.getData('guilds');
  const guildData = await guildsData.get(controller.guild.id);
  
  return guildData;
}