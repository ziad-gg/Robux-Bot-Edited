const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('tax')
  .setDescription('ProBot tax calculation.')
  .setUsage(['{cmdname} (Amount)'])
  .setExample(['{cmdname} 1000'])
  .setCooldown('10s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addNumberOption((option) => option
     .setName('amount')
     .setDescription('The amount you would like to calculate')                                                   
     .setRequired(true))) 
  .setGlobal(GlobalExecute)
  .setAttr('args', 1)

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  const amount = +controller[0].toNumber();
  
  if (!amount.isNumber()) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد رقم صحيح!**' });
    
  const tax = Math.ceil(amount * 20 / 19);
  const transformation = Math.floor(amount * 0.95);
  
  return controller.replyNoMention({
    embeds: [
      new EmbedBuilder()
      .setColor('#0be881')
      .setThumbnail(controller.guild.iconURL())
      .setTitle('ضريبة بروبوت')
      .addFields([{ name: 'المبلغ بدون الضريبة :', value: transformation == 0 ? '1' : '' + transformation }])
      .addFields([{ name: 'المبلغ بعد الضريبة :', value: tax == 2 ? '1' : '' + tax }])
      .setTimestamp()
     ]
  })
}
