const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ComponentType, userMention } = require('discord.js');

module.exports = new CommandBuilder() 
  .setName('add')
  .setDescription('Add a new admin.')
  .setUsage(['{mainName} {cmdname} (User)'])
  .setExample(['{mainName} {cmdname} {userMention}', '{mainName} {cmdname} {userId}'])
  .InteractionOn(new SlashCommandBuilder().addUserOption((option) => option
     .setName('admin')
     .setDescription('The user to add it to the admins')
     .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setInteractionExecution(InteractionExecute)
  .setMessageExecution(MessageExecute)
  .isSubCommand()

async function GlobalExecute(message, interaction, global) {
  const controller = message ?? interaction;
  const guildData = await global;
  const userId = controller[0]?.toId();
  
  if (!userId) return controller.replyNoMention({ content: '❌ **يحب أن تقوم بتحديد المستخدم!**' });
  const user = await controller.getUser(userId).then(u => u?.user?.id? u.user : u);
  
  if (!user || user.bot) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد مستخدم صالح!**' });
  if (controller.Application.owners.includes(user.id)) return controller.replyNoMention({ content: '❌ **الاونرات لديهم صلاحيات بالفعل!**' });
  
  const isAdmin = guildData.admins.find(admin => admin.id === user.id);
  if (isAdmin) return controller.replyNoMention('❌ **هذا الادمن مضاف بالفعل!**');
  
  const embed = new EmbedBuilder().setAuthor({ name: controller.author.username, iconURL: controller.author.avatarURL() });

  embed.setTitle('الاوامر الذ يستطيع التحكم بها');
  
  const time = 500000;
  let commands = [];

  await controller.client.Application.commands.filter(cmd => cmd.category == 'admins').forEach((value, key) => {
    commands.push(key);
  })
  
  embed.setDescription(commands.join('\n\ ') + '\n\ \n\ لمسح اي امر من هذه الاوامر قم بكتابة اسمه فقط');

  const confirm = new ButtonBuilder().setCustomId('confirm').setLabel('Confirm').setStyle(ButtonStyle.Danger);
	const cancel = new ButtonBuilder().setCustomId('cancel').setLabel('Cancel').setStyle(ButtonStyle.Secondary);
  const row = new ActionRowBuilder().addComponents(confirm, cancel);
  
  const msg = await controller.replyNoMention({ embeds: [embed], components: [row] }); 
  const filter = (button) => button.user.id === controller.author.id;
  const ButtonCollector = msg.createMessageComponentCollector({ filter, componentType: ComponentType.Button, time });
  const MessageCollectorFilter = m => m.author.id === controller.author.id && commands.includes(m.content.toLowerCase());
  const MessageCollector = controller.channel.createMessageCollector({ filter: MessageCollectorFilter, time });

  MessageCollector.on('collect', m => {
    if (commands.length === 1) return;
    commands = commands.filter(command => command != m.content.toLowerCase());
    embed.setDescription(commands.join('\n\ ') + "\n\ \n\ لمسح اي امر من هذه الاوامر قم بكتابة اسمه فقط");
    msg.edit({ embeds: [embed] }).catch(console.log);
  });
  
  MessageCollector.on('end', () => {
    msg.delete().catch(console.log);
    controller.delete().catch(console.log);
  });
  
  ButtonCollector.on('collect', async i => {
    if (i.customId == 'confirm') {
      guildData.admins.push({ id: userId.toString(), commands: commands.map(cmd => cmd.toString()) });
      await guildData.save();
      await i.reply({ content: '✅ **تم بنجاح إضافة هذا المستخدم الي الادمنز!**' });
      msg.delete().catch(console.log);
    }
    if (i.customId == 'cancel') {
      msg.delete().catch(console.log);
    }
  });
}

async function InteractionExecute(interaction, global) {};
async function MessageExecute(message, Global) {};