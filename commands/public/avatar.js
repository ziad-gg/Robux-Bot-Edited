const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('avatar')
  .setDescription('Get your roblox avatar.')
  .setUsage(['{cmdname} (UserName)'])
  .setExample(['{cmdname} {rusername}'])
  .setCooldown('10s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addStringOption((option) => option
     .setName('username')
     .setDescription('The username to get avatar for')
     .setRequired(true)))
  .setAttr('args', 1)
  .setGlobal(GlobalExecute)

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  try {
    const roblox = message ? message.getData('roblox') : interaction.getData('roblox');
    const username = controller[0];
  
    let user = await roblox.users.find({ userNames: username });
  
    if (!user) return controller.replyNoMention({ content: '❌ **يبدو أن هذا اللاعب غير متواجد في روبلوكس!**' });
    user = await roblox.users.get(user.id);

    const embed = new EmbedBuilder()
      .setAuthor({ name: user.name, iconURL: user.avatarURL({ type: 'Headshot' }) })
      .setTitle(user.name)
      .setURL(user.profileURL)
      .setImage(user.avatarURL({ type: 'Headshot' }))
      .setFooter({ text: controller.author.username, iconURL: controller.author.avatarURL() })
      .setTimestamp();
  
    controller.replyNoMention({ embeds: [embed] });
  } catch {
    return controller.replyNoMention({ content: '❌ **حدث خطأ ما**' });
  };
};