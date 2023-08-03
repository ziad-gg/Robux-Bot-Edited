const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('thxChannel')
  .setDescription('Sets thanks channel.')
  .setUsage(['{mainName} {cmdname} (Channel)'])
  .setExample(['{mainName} {cmdname} {channelMention}', '{mainName} {cmdname} {channelId}'])
  .InteractionOn(new SlashCommandBuilder().addChannelOption((option) => option
     .addChannelTypes(0)                                                       
     .setName('channel')
     .setDescription('The channel you want')
     .setRequired(false)))
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .isSubCommand()

async function GlobalExecute(message, interaction, global) {
  const controller = message ?? interaction;
  const guildData = await global;
  const channelId = controller[0]?.toId();
  
  if (!channelId) {
    if (!guildData.thxChannel) return controller.replyNoMention({ content: '❌ **لا توجد قناة محددة لحذفها!**' });
    guildData.thxChannel = '';
    await guildData.save();
    return controller.replyNoMention({ content: '✅ **تم بنجاح حذف القناة!**' });
  };
  
  const channel = controller.guild.channels.cache.get(channelId);
  
  if (!channel) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد قناة صالحة!**' });
  if (channel.type !== 0) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد قناة كتابية!**' });
  if (guildData.thxChannel === channel.id) return controller.replyNoMention({ content: '❌ **هذه القناة محددة من قبل!**' });	
  
  guildData.thxChannel = channel.id;
  await guildData.save();
  
  controller.replyNoMention({ content: '✅ **تم بنجاح تحديد قناة الشكر!**' });
};

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};