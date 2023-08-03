const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('deletecode')
  .setDescription('To remove a specific code.')
  .setUsage(['{cmdname} (Code)'])
  .setExample(['{cmdname} robuxfactory'])
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addStringOption((option) => option
     .setName('code')
     .setDescription('The code you want to delete')
     .setRequired(true)))                                                    
  .setGlobal(GlobalExecute)
  .setAttr('args', 1) 
  
async function GlobalExecute(message, interaction) { 
  const controller = message ?? interaction;
  const code = controller[0];
  const gifts = controller.getData('codes');
  const giftsData = await gifts.find();
    
  if (!giftsData.map(e => e.code).includes(code)) return controller.replyNoMention({ content: '❌ **هذا الكود غير مضاف!**' });
  await gifts.findOneAndRemove({ guildId: controller.guild.id, code });
  controller.replyNoMention({ content: '✅ **تم بنجاح حذف هذا الكود!**' });
};