const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('group')
  .setDescription('Sets the group.')
  .setUsage(['{mainName} {cmdname} (GroupId)'])
  .setExample(['{mainName} {cmdname} 9740515'])
  .InteractionOn(new SlashCommandBuilder().addNumberOption((option) => option
     .setName('group')
     .setDescription('The group ID you want')
     .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .isSubCommand()

async function GlobalExecute(message, interaction, global) {
  const controller = message ?? interaction;
  const roblox = controller.getData('roblox');
  const guildData = await global;
  
  const groupId = controller[0];
  if (!roblox.me) return controller.replyNoMention({ content: '❌ **يحب أن تحدد الكوكيز اولا!**' });
  if (!groupId) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد معرف الجروب!**' });
  if (!groupId.isNumber()) return controller.replyNoMention({ content: '❌ **يجب أن يكون معرف المجموعة رقمآ!**' });
  
  const group = await roblox.groups.get(groupId);
  if (!group) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد معرف جروب صحيح!**' });
  if (guildData.group === group.id) return controller.replyNoMention({ content: '❌ **يبدو أن هذا الجروب محدد من قبل!**' });
  
  const me = await group.members.me;
  if (!me || !me.isOwner) return controller.replyNoMention({ content: '❌ **يجب أن تكون انت مالك الجروب!**' });
  
  guildData.group = group.id;
  await guildData.save();
  
  controller.replyNoMention({ content: '**✅ تم تحديد الجروب بنجاح!**' });
}

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};