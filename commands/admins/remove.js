const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('remove')
  .setDescription('Remove someone specific balance.')
  .setUsage(['{cmdname} (User) (Amount)'])
  .setExample(['{cmdname} {userMention} 10', '{cmdname} {userId} 10'])
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addUserOption((option) => option
     .setName('user')
     .setDescription('The user from whom the balance is to be removed')
     .setRequired(true)).addNumberOption((option) => option
        .setName('amount')
        .setDescription('The amount to remove')
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
  if (userData.balance < amount) return controller.replyNoMention({ content: '❌ **رصيد هذا الشخص اقل من المبلغ المراد خصمه!**' });
    
  userData.balance -= amount;
  await userData.save();
  
  controller.replyNoMention({ content: `✅ **تم بنجاح خصم ${amount} من ${user}\nرصيده الحالي هو ${userData.balance}**` });
};