const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { PROBOT_IDS } = require('../../src/Constants.js');

module.exports = new CommandBuilder()
  .setName('buy')
  .setDescription('Buy a balance.')
  .setUsage(['{cmdname} (Amount)'])
  .setExample(['{cmdname} 100'])
  .setCooldown('20s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addNumberOption((option) => option
     .setName('amount')
     .setDescription('The amount you want to buy')                                                          
     .setRequired(true)))
  .setAttr('args', 1)
  .setGlobal(GlobalExecute)

async function GlobalExecute(message, interaction) {
  let buyed = false;
  const controller = message ?? interaction;
  if (!controller.channel.name.startsWith('ticket-')) return;

  const key = `${controller.author.id}-${controller.guild.id}`;
  const cooldowns = controller.getData('buy_cooldowns');
  const guildsData = controller.getData('guilds');
  const usersData = controller.getData('users');
  if (cooldowns.has(key)) return controller.replyNoMention({ content: '❌ **لديك عملية شراء بالفعل!**' });

  const amount = +controller[0];
  if (!amount.isNumber()) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد رقم صحيح!**' });
  
  const events = controller.getData('events');
  const time = 3e5;
  const guildData = await guildsData.get(controller.guild.id);
  
  if (!controller.author.isOwner && !guildData.buy.status) return controller.replyNoMention({ content: '❌ **نظام الشراء مقفل في الوقت الحالي!**' });
  if (guildData.buy.min > amount) return controller.replyNoMention({ content: `❌ **عذرا ولاكن الحد الأدنى للشراء هو ${guildData.buy.min}**` });
  if (guildData.buy.max > 0 && guildData.buy.max < amount) return controller.replyNoMention({ content: `❌ **عذرا ولاكن الحد الأقصى للشراء هو ${guildData.buy.max}**` });
  
  const userData = await usersData.get(controller.author.id);
  const recipient = controller.client.users.cache.get(guildData.recipient);
  const recipientId = recipient?.id ?? await controller.guild.fetchOwner().then((owner) => owner.user.id);
  
  const price = guildData.price * amount;
  const tax = Math.ceil(price * 20 / 19) == 2 ? 1 : Math.ceil(price * 20 / 19);
  const embed = new EmbedBuilder().setColor('#0be881').setTitle('لديك 5 دقائق لتحويل المبلغ:').setDescription(`\`\`\`c ${recipientId} ${tax}\`\`\``);
  
  const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('end').setStyle(ButtonStyle.Danger).setLabel('إنهاء عملية الشراء'));
  const filter_button = (button) => button.user.id === controller.author.id;
  const msg = await controller.replyNoMention({ embeds: [embed], components: [row] });
  
  const collector = msg.createMessageComponentCollector({ filter: filter_button, time, max: 1 });
  const filter = m => PROBOT_IDS.includes(m.author.id) && m.content.includes(`${price}`) & m.content.includes(`${recipientId}`) && m.content.includes(`${controller.author.username}`);
  const pay = controller.channel.createMessageCollector({ filter, time, max: 1 });
  const transactionId = 'xxxx-xxxx-xxxx-xxxx'.replace(/x/g, () => Math.floor(Math.random() * 16).toString(16));
  
  cooldowns.set(key, {
    transactionId
  });

  pay.on('collect', async () => {
    if (!(cooldowns.has(key) && cooldowns.get(key).transactionId === transactionId)) return;
    
    events.emit('buy-end');
      
    userData.balance += amount;
    userData.buyedTotal += amount;
    userData.buyedCount += 1;
    buyed = true;
    await userData.save();

    controller.channel.send({ content: `**✅ تم بنجاح شراء \`${amount}\` رصيد!\nرصيدك الحالي: \`${userData.balance}RB\`.**` });

    const logsChannel = controller.client.channels.cache.get(guildData.logsChannel);
    if (logsChannel) logsChannel.send(`**هذا العضو ${controller.author} اشتري ${amount} رصيد\nرصيده الان هو ${userData.balance}**`);
      
    const clientsRole = await controller.guild.roles.cache.get(guildData.clientsRole);
    if (clientsRole) controller.member.roles.add(clientsRole.id).catch(() => 1);
      
    setTimeout(() => {
      controller.channel.delete();
      cooldowns.delete(key);
    }, 5000);
  });
  
  collector.on('collect', async (button) => {
    if (button.customId === 'end') {
      await cooldowns.delete(key);
      events.emit('buy-end');
      button.reply({ content: '✅ **تم بنجاح إنهاء عملية الشراء!**' });
    }
  });
  
  events.on('buy-end', () => {
    row.components[0].setDisabled(true);
    msg.edit({ components: [row] }).catch(() => 1);
  });
  
  pay.on('end', async () => {
    if (buyed) return;
    if (!(cooldowns.has(key) && cooldowns.get(key).transactionId === transactionId)) return;
      
    await cooldowns.delete(key);
    events.emit('buy-end');
    controller.channel?.send({ content: '🕓 **لقد انتهى وقت التحويل!**' });
  });
};