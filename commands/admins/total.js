const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('total')
  .setDescription("To see everyone's balance.")
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false))
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .setAliases([{ cut: 'all', prefix: true }])

async function GlobalExecute(message, interaction) { 
  const controller = message ?? interaction;
  const usersData = await controller.getData('users').find({ balance: { $ne: 0 } });
  
  controller.replyNoMention({ content: `${usersData.reduce((a, b) => a + b.balance, 0)}` });
};

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};