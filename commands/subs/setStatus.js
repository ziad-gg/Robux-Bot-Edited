const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('status')
  .setDescription('Sets status to reverse status.')
  .setUsage(['{mainName} {groupname} {cmdname}'])
  .setExample(['{mainName} {groupname} {cmdname}'])
  .InteractionOn(new SlashCommandBuilder())
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .isSubCommand()

async function GlobalExecute(message, interaction, global) {
  const controller = message ?? interaction;
  const guildData = await global;

  if (controller.GroupName === 'transfer') {
    guildData.transfer.status = !guildData.transfer.status;  
    await guildData.save();
    
    controller.replyNoMention({ content: `✅ **تم بنجاح ${guildData.transfer.status ? 'فتح' : 'قفل'} حالة السحب بنجاح!**` });
    
  } else if (controller.GroupName === 'buy') {
    guildData.buy.status = !guildData.buy.status;  
    await guildData.save();
   
    controller.replyNoMention({ content: `✅ **تم بنجاح ${guildData.buy.status ? 'فتح' : 'قفل'} حالة الشراء بنجاح!**` });
  };
};

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};