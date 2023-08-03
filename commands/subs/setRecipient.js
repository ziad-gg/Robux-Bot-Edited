const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('recipient')
  .setDescription('Sets Recipient.')
  .setUsage(['{mainName} {cmdname} (User)'])
  .setExample(['{mainName} {cmdname} {userMention}', '{mainName} {cmdname} {userId}'])
  .InteractionOn(new SlashCommandBuilder().addUserOption((option) => option
     .setName('user')
     .setDescription('The Recipient you want')
     .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .isSubCommand()

async function GlobalExecute(message, interaction, global) {
  const controller = message ?? interaction;
  const guildData = await global;
  
  if (!controller[0]) return controller.replyNoMention({ content: '❌ **قم بتحديد المستخدم!**' });
  
  const Recipient = await controller.getUser(controller[0].toId()).then(user => user).catch(e => null);

  if (!Recipient) return controller.replyNoMention({ content: '❌ **قم بتحديد مستخدم صالح!**' });
  if (Recipient.bot) return controller.replyNoMention({ content: '❌ **قم بتحديد مستخدم وليس بوت!**' });
  if (guildData.recipient === Recipient.id) return controller.replyNoMention({ content: '❌ **هذا المستخدم محدد من قبل!**' });
  
  guildData.recipient = Recipient.id;
  await guildData.save();
  
  controller.replyNoMention({ content: '✅ **تم بنجاح تحديد مستلم الأرباح!**' });
};

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};