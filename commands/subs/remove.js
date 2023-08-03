const { CommandBuilder } = require('handler.djs'); 
const { SlashCommandBuilder } = require('discord.js'); 
  
 module.exports = new CommandBuilder()  
   .setName('remove') 
   .setDescription('Remove admins.') 
   .setUsage(['{mainName} {cmdname} (User)']) 
   .setExample(['{mainName} {cmdname} {userMention}', '{mainName} {cmdname} {userId}']) 
   .InteractionOn(new SlashCommandBuilder().addUserOption((option) => option 
      .setName('admin') 
      .setDescription('Admin user to remove') 
      .setRequired(true))) 
   .setGlobal(GlobalExecute) 
   .setInteractionExecution(InteractionExecute) 
   .setMessageExecution(MessageExecute) 
   .isSubCommand() 
  
 async function GlobalExecute(message, interaction, global) { 
   const controller = message ?? interaction; 
   const Guilds = controller.getData('guilds'); 
   const guildData = await global; 
   const userId = controller[0]?.toId(); 
  
   if (!userId) return controller.replyNoMention({ content: '❌ **يحب أن تقوم بتحديد المستخدم!**' }); 
  
   const user = await controller.getUser(userId).then(u => u?.user?.id? u.user : u); 
   if (!user || user.bot) return controller.replyNoMention({ content: '❌ **هذا المستخدم غير صالح!**' }); 
  
   const isAdmin = guildData.admins.find(admin => admin.id === user.id); 
   if (!isAdmin) return controller.replyNoMention('❌ **هذا المستخدم ليس من الادمنز!**'); 
  
   await Guilds.updateOne({ id: controller.guild.id }, { $pull: { admins: { id: userId } } } ); 
   await controller.replyNoMention({ content: '✅ **تم بنجاح حذف هذا المستخدم من الادمنز!**' }); 
 }; 
  
 async function InteractionExecute(interaction, global) {}; 
 async function MessageExecute(message, Global) {};