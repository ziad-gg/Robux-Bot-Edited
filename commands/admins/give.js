const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('give')
  .setDescription('Transfer someone specific balance.')
  .setUsage(['{cmdname} (User) (Amount)'])
  .setExample(['{cmdname} {userMention} 10', '{cmdname} {userId} 10'])
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addUserOption((option) => option
     .setName('user')
     .setDescription('The user to transfer to')
     .setRequired(true)).addNumberOption((option) => option
        .setName('amount')
        .setDescription('The amount to transfer to')
        .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setAttr('args', 2)
  // .OwnersOnly()

async function GlobalExecute(message, interaction) { 
  const controller = message ?? interaction;
  const usersData = controller.getData('users');
  const userId = controller[0]?.toId();
  
  const amount = +controller[1];
  if (!amount.isNumber()) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد رقم صحيح!**' });
  
  const user = await controller.getUser(userId).then(u => u?.user?.id? u.user : u);
  if (!user) return controller.replyNoMention({ content: '❌ **لا يمكنني العثور على هذا العضو!**' });
  if (user.bot) return controller.replyNoMention({ content: '❌ **البوتات لا تملك حساب!**' });
  
  const userData = await usersData.get(user.id);
  
  userData.balance += amount;
  await userData.save();
  
  user.send(`🥇**${controller.guild.name} Logs ATM\n\`\`\`You have recived ${amount}RB from ${controller.author.username}(${controller.author.id})\`\`\`**`).catch(() => 1);
  controller.replyNoMention({ content: `✅ **تم بنجاح تحويل ${amount} الي ${user}\nرصيده الحالي هو ${userData.balance}**` });
};