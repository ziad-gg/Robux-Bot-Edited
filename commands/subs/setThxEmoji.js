const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('thxemoji')
  .setDescription('Sets the thx emoji.')
  .setUsage(['{mainName} {cmdname} (Emoji)'])
  .setExample(['{mainName} {cmdname} :heart:'])
  .InteractionOn(new SlashCommandBuilder().addStringOption((option) => option
     .setName('emoji')
     .setDescription('The name of the emoji you want')
     .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .OwnersOnly()
  .isSubCommand()

async function GlobalExecute(message, interaction, global) {
  const controller = message ?? interaction;
  const guildData = await global; 
  const emoji = controller.guild.emojis.cache.find((e) => e.name === controller[0].replaceAll(':', '')) || controller.guild.emojis.cache.find((e) => e.id === controller[0]) || controller.guild.emojis.cache.find((e) => e.name === convert(controller[0])[0]) || controller.guild.emojis.cache.find((e) => e.id === convert(controller[0])[0]);
  if (!emoji) return controller.replyNoMention({ content: '❌ **هذا الايموجي غير صالح او ليس في هذا السيرفر!**' });
    
  if (guildData.thxEmoji === emoji.id) return controller.replyNoMention({ content: '❌ **هذا الايموجي محدد من قبل!**' });
  guildData.thxEmoji = emoji.id;
  await guildData.save();
  
  controller.replyNoMention({ content: '✅ **تم بنجاح إضافة هذه الايموجي!**' });
};

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};

function convert(emoji) {
  return emoji.match(/\d+/) || '';
};