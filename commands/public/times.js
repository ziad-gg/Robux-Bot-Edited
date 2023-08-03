const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('times')
  .setDescription('Shows the pending robux times.')
  .setCooldown('60s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false))
  .setGlobal(GlobalExecute)

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  if (message) controller.channel.sendTyping();

  try {
    if (interaction) interaction.deferReply({ ephemeral: false });
    const guildsData = controller.getData('guilds');
    const roblox = controller.getData('roblox');
    const guildData = await guildsData.get(controller.guild.id);
    
    const group = await roblox.groups.get(guildData.group);  
    const transactions = await group.fetchTransactions({ limit: 100 });
    const embed = new EmbedBuilder()
      .setColor('#0be881')
      .setTitle(group.name)
      .setThumbnail(controller.guild.iconURL({ dynamic: true })) 
      .setDescription(transactions.data.filter(e => e.isPending).sort((a, b) => Math.floor((new Date(a.created).getTime() + 432e6) / 1000) - Math.floor((new Date(b.created).getTime() + 432e6) / 1000)).map(e => `**- Amount : ${Math.ceil(e.currency.amount)}\n- Arrival time : <t:${Math.floor((new Date(e.created).getTime() + 432e6) / 1000)}:F> \n<t:${Math.floor((new Date(e.created).getTime() + 432e6) / 1000)}:R>**`).join('\n\n') || ' ')
      .setFooter({ text: controller.author.username, iconURL: controller.author.avatarURL() })
      .setTimestamp()
    
   controller.editMsg = (obj) => interaction ? interaction.editReply(obj) : message.replyNoMention(obj);
   controller.editMsg({ content: '', embeds: [embed] });
    
  } catch {
    return controller.replyNoMention({ content: '❌ **حدث خطأ ما**' });
  };
};

/*async function fetchAllGroupTransactions(Group) {
  let transactions = [];
  let nextPageCursor = null;

  do {
    const result = await Group.fetchTransactions({ limit: 100, cursor: nextPageCursor });
    const { data, nextPageCursor: nextCursor } = result;

    transactions = transactions.concat(data);
    nextPageCursor = nextCursor;
  } while (nextPageCursor !== null);

  return transactions;
}*/