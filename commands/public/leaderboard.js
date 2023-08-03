const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('leaderboard')
  .setDescription('Shows top users.')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false))
  .setGlobal(GlobalExecute)
  .setAliases([{ cut: 'lb', prefix: true }, { cut: 'top', prefix: true } ]);

async function GlobalExecute(message, interaction) { 
  const controller = message ?? interaction;
  if (interaction) await interaction.deferReply({ ephemeral: false });
  
  const MAX_LENGTH = 10;
  let data = await controller.getData('users').find();
  
  data = data.filter(e => e.balance > 0).sort((a, b) => b.balance - a.balance);
  data = data.splice(0, MAX_LENGTH);
  data = data.map((user, index) => `**#${index+1} ${getUser(user.id)} [${user.balance}]**`);
    
  const embed = new EmbedBuilder()
  .setThumbnail(controller.guild.iconURL())
  .setColor('#0be881')
  .setTitle('Leaderboard') 
  .setDescription(data.join('\n') || ' ') 
  .setFooter({ text: controller.author.username, iconURL: controller.author.avatarURL() })
  .setTimestamp();

  function getUser(userId) {
    const user = controller.client.users.cache.get(userId);
      
    return user ? user.toString() : `<@${userId}>`
  }

  controller.editMsg = (obj) => interaction ? interaction.editReply(obj) : message.replyNoMention(obj);
  controller.editMsg({
   embeds: [embed] });
};