const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('min')
  .setDescription('Sets the minimum.')
  .setUsage(['{mainName} {groupname} {cmdname} (Minimum)'])
  .setExample(['{mainName} {groupname} {cmdname} 5'])
  .InteractionOn(new SlashCommandBuilder().addNumberOption((option) => option
     .setName('min')
     .setDescription('The minimum you want')
     .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .isSubCommand()

async function GlobalExecute(message, interaction, global) {
  const controller = message ?? interaction;
  const guildData = await global;
  const amount = +controller[0];
  
  if (!controller[0]) return controller.replyNoMention('❌ **يجب أن تقوم بتحديد الحد الأدنى!**');
  if (!amount.isNumber()) return controller.replyNoMention('❌ **يجب أن تقوم بتحديد رقم صحيح!**');
  
  if (controller.GroupName === 'transfer') {
    if (guildData.transfer.min === amount) return controller.replyNoMention({ content: '❌ **هذا الحد محدد من قبل!**' });
    guildData.transfer.min = amount;
    await guildData.save();
    
    controller.replyNoMention({ content: '✅ **تم تحديد الحد الأدنى بنجاح!**' });
    
  } else if (controller.GroupName === 'buy') {
    if (guildData.buy.min === amount) return controller.replyNoMention({ content: '❌ **هذا الحد محدد من قبل!**' });
    guildData.buy.min = amount; 
    await guildData.save();
    
    controller.replyNoMention({ content: '✅ **تم تحديد الحد الأدنى بنجاح!**' });
  };
};

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};