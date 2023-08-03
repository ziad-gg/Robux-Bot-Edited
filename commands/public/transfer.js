const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { DEFAULT_GUILD } = require('../../src/Constants.js');
const { createCanvas, loadImage } = require('canvas');
const uniqid = require('uniqid');

module.exports = new CommandBuilder()
  .setName('transfer')
  .setDescription('Transfer balance to robux.')
  .setUsage(['{cmdname} (UserName) (Amount)'])
  .setExample(['{cmdname} {rusername} 10'])
  .setCategory('public')
  .setCooldown('30s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(true).addStringOption((option) => option
    .setName('username')
    .setDescription('The username you want to transfer to')
    .setRequired(true)).addNumberOption((option) => option
      .setName('amount')
      .setDescription('The amount you want to transfer')
      .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setAttr('args', 2)
  .setAliases([{ cut: 'tran', prefix: true }])

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  if (interaction) return interaction.replyNoMention({ content: "❌ **Transfer is not valid with slash command !** " });

  const roblox = controller.getData('roblox');
  const guildsData = controller.getData('guilds');
  const Transition = controller.getData('Transition');

  const usersData = controller.getData('users');
  const username = controller[0];
  const amount = +controller[1];

  if (!amount.isNumber() || amount.toString().includes('.') || amount.toString().includes('e')) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد رقم صحيح!**' });

  const userData = await usersData.get(controller.author.id);
  if (userData.balance < amount) return controller.replyNoMention({ content: '❌ **ليس لديك رصيد كافي!**' });

  let user = await roblox.users.find({ userNames: username });
  if (!user) return controller.replyNoMention({ content: '❌ **يبدو أن هذا اللاعب غير متواجد في روبلوكس!**' });
  user = await roblox.users.get(user.id);

  const guildData = await guildsData.get(controller.guild?.id || DEFAULT_GUILD);
  const group = await roblox.groups.get(guildData.group);

  if ((!controller.author.isOwner && !guildData.transfer.status) || !Transition) return controller.replyNoMention({ content: '❌ **نظام السحب مقفل في الوقت الحالي!**' });
  if (guildData.transfer.min > amount) return controller.replyNoMention({ content: `❌ **عذرا ولاكن الحد الأدنى للتحويل هو ${guildData.transfer.min}**` });
  if (guildData.transfer.max > 0 && guildData.transfer.max < amount) return controller.replyNoMention({ content: `❌ **عذرا ولاكن الحد الأقصى للتحويل هو ${guildData.transfer.max}**` });

  const member = await group.members.get(user.id);
  if (!member) return controller.replyNoMention({ content: `❌ **هذا اللاعب غير متواجد في الجروب\nرابط الجروب:**\n${group}` });

  const robux = await group.fetchCurrency();
  if (robux < amount) return controller.replyNoMention({ content: '❌ **عذرا ولاكن هذا العدد غير متوفر في الجروب في الوقت الحالي!**' });

  const data = {
    id: uniqid(),
    username,
    amount,
    group
  };

  const msg = await controller.replyNoMention({ content: "⏰ **برجاء كن صبورا حتي تتم عمليه التحويل !**" });

  Transition.emit('transfer', data);

  Transition.once(data.id.toString(), async (data) => {

    if (data.done) {
      await controller.reply({ content: `✅ **تم بنجاح تحويل الروبوكس إلى ${username}${controller.client.channels.cache.get(guildData.thxChannel) ? `\nلا تنسى كتابة كلمة شكر في روم <#${guildData.thxChannel}>**` : '**'}` });
      msg.delete().catch(e => e)
      userData.balance -= amount;
      userData.transactionsTotal += amount;
      userData.transactionsCount += 1;
      userData.lastTransactionsAccount = username;
      await userData.save();

      const logsChannel = controller.client.channels.cache.get(guildData.logsChannel);
      if (logsChannel) logsChannel.send(`**هذا العضو ${controller.author} لقد سحب ${amount} رصيد الي ${user.name}\nرصيده الان هو ${userData.balance}**`);

      const canvas = createCanvas(991, 172);
      const ctx = canvas.getContext('2d')
      const background = await loadImage('https://cdn.glitch.global/60d2234a-7ca2-4fc7-a312-190e5d8c2e88/Picsart_23-02-24_20-56-24-896.jpg?v=1677265030940');

      ctx.beginPath();
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      ctx.font = '15px impact';
      ctx.fillStyle = 'black';
      ctx.fillText(amount.toLocaleString(), 802.5, 42.4);
      ctx.font = '650 16px impact';
      ctx.fillText(amount.toLocaleString(), 864.5, 82.5);
      ctx.fillText((robux - amount).toLocaleString(), 830.5, 105.7);
      ctx.font = '570 15.2px impact';
      ctx.fillText(username, 61, 35);
      ctx.closePath();

      const userImage = await loadImage(user.avatarURL({ type: 'Headshot' }));
      ctx.drawImage(userImage, 11.5, 16.5, 35, 35);

      const attach = new AttachmentBuilder(canvas.toBuffer(), { name: 'payout.png' });
      const channel = await controller.client.channels.cache.get(guildData.proofsChannel);

      if (channel) {
        channel.send({ content: `**تم الشراء بواسطة: ${controller.author}**`, files: [attach] });
      } else {
        controller.replyNoMention({ files: [attach] });
      }



    } else if (data.error && data.data.code == 8) {
      msg.edit({ content: '❌ **هذا اللاعب لم يكمل 14 يوم داخل الجروب!**' });
    } else {
      msg.edit({ content: '❌ **حدث خطأ ما**' });
    }

    console.log(data);
  })


};