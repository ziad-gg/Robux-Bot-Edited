const { Validation } = require('handler.djs');
const { ChannelType } = require('discord.js');

module.exports = new Validation()
  .setCommnads('all')
  .setExecution(Exection)
  .setOrder(1);

function Exection(controller, next, end) {
  const allowed = ['balance', 'transfer', 'help'];
  
  if (!controller.author.isOwner && controller.Command.category === 'admins') return;
  if (controller.channel?.type === ChannelType.DM && !allowed.includes(controller.Command.name)) {
    controller.replyNoMention({ content: '❌ **يمكنك استخدام هذا الأمر في السيرفر فقط!**' });
    return end();
  } else {
    next();
  }
}