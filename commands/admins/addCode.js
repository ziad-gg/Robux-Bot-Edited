const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('addcode')
  .setDescription('Create a gift code.')
  .setUsage(['{cmdname} (Code) (Prize) (Max)'])
  .setExample(['{cmdname} robuxfactory 1 100'])
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addStringOption((option) => option
     .setName('code')
     .setDescription('The code you want')
     .setRequired(true)).addNumberOption((option) => option
        .setName('prize')
        .setDescription('The prize you want')
        .setRequired(true)).addNumberOption((option) => option                                   
          .setName('max')
          .setDescription('Maximum users')
          .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setAttr('args', 3)
  
async function GlobalExecute(message, interaction) { 
  const controller = message ?? interaction;
  const code = controller[0];
  const prize = +controller[1];
  const maxUsers = +controller[2];
  
  if (!prize.isNumber()) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بوضع رقم صالح في الجائزة!**' });
  if (!maxUsers.isNumber()) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بوضع رقم صالح في الحد الأقصى!**' });    
    
  const gift = controller.getData('codes');
  const giftCode_Old = await gift.findOne({ guildId: controller.guild.id, code });
  const giftCode = await gift.findOrCreate({ guildId: controller.guild.id, code });
    
  if (giftCode_Old) return controller.replyNoMention({ content: '❌ **هذا الكود مضاف بالفعل!**' });
  giftCode.max = maxUsers;
  giftCode.prize = prize;
  giftCode.createdBy = controller.author.id;
  giftCode.redeemedBy = [];
  await giftCode.save();

  const embed = new EmbedBuilder()
  .setColor('#0be881')
  .setTitle('Robux Code Added')
  .setDescription(`Robux Code: ${code}`)
  .addFields([{ name: 'Max', value: `${maxUsers}` }])
  .addFields([{ name: 'Robux', value: `${prize}` }]) 
  .setTimestamp()
  .setFooter({ text: controller.author.username, iconURL: controller.author.avatarURL() });
  
  controller.channel.send({ embeds: [embed] });
};