const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('endbuy')
  .setDescription('Cancel your current purchase.')
  .setCooldown('10s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false))
  .setGlobal(GlobalExecute)
  //.setAliases([{ cut: 'end', prefix: true }])

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  const cooldowns = controller.getData('buy_cooldowns');
  const key = `${controller.author.id}-${controller.guild.id}`;
  const events = controller.getData('events');
  
  if (!controller.channel.name.startsWith('ticket-')) return;
  if (!cooldowns.has(key)) return controller.replyNoMention({ content: '❌ **ليس لديك عملية شراء!**' });
  
  await cooldowns.delete(key);
  events.emit('buy-end');
  
  controller.replyNoMention({ content: '✅ **تم بنجاح إنهاء عملية الشراء!**' });
}