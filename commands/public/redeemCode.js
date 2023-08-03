const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('redeemcode')
  .setDescription('To redeem a gift code.')
  .setUsage(['{cmdname} (Code)'])
  .setExample(['{cmdname} robuxfactory'])
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addStringOption((option) => option
     .setName('code')
     .setDescription('The code you want to retrieve')
     .setRequired(true)))                                                    
  .setGlobal(GlobalExecute)
  .setAttr('args', 1) 
  .setAliases([{ cut: 'redeem', prefix: true }])

async function GlobalExecute(message, interaction) { 
  const controller = message ?? interaction;
  const code = controller[0];
  const gifts = controller.getData('codes');
  
  const guild = controller.getData('guilds');
  const users = controller.getData('users');
  const giftData = await gifts.findOne({ guildId: controller.guild.id, code });
  
  const guildData = await guild.get(controller.guild.id);
  const codesChannel = controller.client.channels.cache.get(guildData.codesChannel);
  if (codesChannel && (controller.channel.id !== codesChannel.id)) return controller.replyNoMention(`❌ **يجب أن تكتب الأكواد في روم ${codesChannel}**`);
  
  const userData = await users.get(controller.author.id);
      
  if (!giftData) return controller.replyNoMention({ content: '❌ **هذا الكود غير صالح او منتهي الصلاحية!**' }); 
  if (giftData.redeemedBy.includes(controller.author.id)) return controller.replyNoMention({ content: '❌ **لقد استعملت هذا الكود بالفعل!**' }); 
    
  giftData.redeemedBy.push(controller.author.id);
  userData.balance += giftData.prize;
  await giftData.save();    
  await userData.save();

  controller.replyNoMention({ content: `✅ **تم بنجاح استعمال الكود، وتم استلام ${giftData.prize} رصيد\nرصيدك الحالي هو ${userData.balance}**` });
  if (giftData.max - giftData.redeemedBy.length === 0) return gifts.findOneAndRemove({ guildId: controller.guild.id, code });
  
  const logsChannel = controller.client.channels.cache.get(guildData.logsChannel);
  if (logsChannel) logsChannel.send(`**هذا العضو ${controller.author} لقد استخدم كود ${code} وحصل على ${giftData.prize} رصيد\nرصيده الان هو ${userData.balance}**`);
}