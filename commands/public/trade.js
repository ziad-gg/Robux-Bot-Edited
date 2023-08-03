const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('trade')
  .setDescription('Transfer your balance to someone else.')
  .setUsage(['{cmdname} (User) (Amount)'])
  .setExample(['{cmdname} {userMention} 10', '{cmdname} {userId} 10'])
  .setCooldown('10s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addUserOption((option) => option
     .setName('user')
     .setDescription('The user you want to transfer to')
     .setRequired(true)).addNumberOption((option) => option
        .setName('amount')
        .setDescription('The amount you want')                                                          
        .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setAttr('args', 2) 

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  const amount = +controller[1];
  const usersData = controller.getData('users');
  const authorData = await usersData.get(controller.author.id);
  const guildsData = controller.getData('guilds');
  const guildData = await guildsData.get(controller.guild.id);
  const user = await controller.getUser(controller[0].toId());
  
  if (!user) return controller.replyNoMention({ content: '❌ **هذا المستخدم غير صالح!**' });
  if (user.bot) return controller.replyNoMention({ content: '❌ **لا يمكن التحويل للبوتات!**' });
  if (user.id === controller.author.id) return controller.replyNoMention({ content: '❌ **لا يمكن التحويل لنفسك!**' });
  
  if (!amount.isNumber()) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد رقم صحيح!**' }); 
  if (authorData.balance < amount) return controller.replyNoMention({ content: '❌ **ليس لديك رصيد كافي!**' });
  if (guildData.transfer.min > amount) return controller.replyNoMention({ content: `❌ **عذرا ولاكن الحد الأدنى للتحويل هو ${guildData.transfer.min}**` });
  if (guildData.transfer.max > 0 && guildData.transfer.max < amount) return controller.replyNoMention({ content: `❌ **عذرا ولاكن الحد الأقصى للتحويل هو ${guildData.transfer.max}**` });
  
  const userData = await usersData.get(user.id);
  
  authorData.balance -= amount;
  userData.balance += amount;
   
  await authorData.save();
  await userData.save();
  
  user.send(`🥇**${controller.guild.name} Logs ATM\n\`\`\`You have recived ${amount}RB from ${controller.author.username}(${controller.author.id})\`\`\`**`).catch(() => 1);
  controller.replyNoMention({ content: `✅ **تم بنجاح تحويل ${amount} رصيد من حسابك إلى ${user}\nرصيدك الان هو ${authorData.balance}\nرصيده الان هو ${userData.balance}**` });
};