const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('max')
  .setDescription('Sets the maximum.')
  .setUsage(['{mainName} {groupname} {cmdname} (Maximum)'])
  .setExample(['{mainName} {groupname} {cmdname} 1000'])
  .InteractionOn(new SlashCommandBuilder().addNumberOption((option) => option
     .setName('max')
     .setDescription('The maximum you want')
     .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .isSubCommand()

async function GlobalExecute(message, interaction, global) {
  const controller = message ?? interaction;
  const guildData = await global;
  const amount = +controller[0];
  
  if (!controller[0]) return controller.replyNoMention('❌ **يجب أن تقوم بتحديد الحد الأقصى!**');
  if (!amount.isInteger()) return controller.replyNoMention('❌ **يجب أن تقوم بتحديد رقم صحيح!**');
  
  if (controller.GroupName === 'transfer') {
    if (guildData.transfer.max === amount) return controller.replyNoMention({ content: '❌ **هذا الحد محدد من قبل!**' });
    guildData.transfer.max = amount;
    await guildData.save();
    
    controller.replyNoMention({ content: '✅ **تم تحديد الحد الأقصى بنجاح!**' });
    
  } else if (controller.GroupName === 'buy') {
    if (guildData.buy.max === amount) return controller.replyNoMention({ content: '❌ **هذا الحد محدد من قبل!**' });
    guildData.buy.max = amount; 
    await guildData.save();
    
    controller.replyNoMention({ content: '✅ **تم تحديد الحد لأقصى بنجاح!**' });
  };
};

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};