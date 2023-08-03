const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder, userMention } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('list')
  .setDescription('Shows admins users.')
  .setUsage(['{mainName} {cmdname}'])
  .setExample(['{mainName} {cmdname}'])
  .InteractionOn(new SlashCommandBuilder())
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .isSubCommand()

async function GlobalExecute(message, interaction, global) {  
  const controller = message ?? interaction;
  const guildData = await global;
  const Admins = guildData.admins;
  
  const list = Admins.map((admin, index) => `${(index + 1 == 1 || index + 1 == 2 || index + 1 == 3) ? `**-${index + 1}**` : `-${index + 1}`  } ${userMention(admin.id)} (${admin.id})`);
  const embed = new EmbedBuilder()
  .setTitle('📃 مجموعة الادمنز المضافة')
  .setDescription(list.join('\n') || ' ')
  
  controller.replyNoMention({ embeds: [embed] })
}

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};