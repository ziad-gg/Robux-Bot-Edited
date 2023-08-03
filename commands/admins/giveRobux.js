const { CommandBuilder } = require('handler.djs');
const { SlashCommandBuilder, AttachmentBuilder } = require('discord.js');
const { DEFAULT_GUILD } = require('../../src/Constants.js');
const { createCanvas, loadImage } = require('canvas');

module.exports = new CommandBuilder()
  .setName('giverobux')
  .setDescription('Transfer robux into someone.')
  .setUsage(['{cmdname} (UserName) (Amount)'])
  .setExample(['{cmdname} {rusername} {snumber}'])
  .setCooldown('20s')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(false).addStringOption((option) => option
     .setName('username')
     .setDescription('The username you want to transfer to')
     .setRequired(true)).addNumberOption((option) => option
        .setName('amount')
        .setDescription('The amount you want to transfer')
        .setRequired(true)))
  .setGlobal(GlobalExecute)
  .setAttr('args', 2)
  .setAliases([{ cut: 'gr', prefix: true }])
  // .OwnersOnly()

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  const roblox = controller.getData('roblox');
  
  const username = controller[0];
  const amount = +controller[1];
  
  if (!amount.isNumber()) return controller.replyNoMention({ content: '❌ **يجب أن تقوم بتحديد رقم صحيح!**' });

  let user = await roblox.users.find({ userNames: username });
  if (!user) return controller.replyNoMention({ content: '❌ **يبدو أن هذا اللاعب غير متواجد في روبلوكس!**' });
  user = await roblox.users.get(user.id);

  const guildData = await controller.getData('guilds').get(controller.guild.id);
  const group = await roblox.groups.get(guildData.group);
  const member = await group.members.get(user.id);
  if (!member) return controller.replyNoMention({ content: `❌ **هذا اللاعب غير متواجد في الجروب\nرابط الجروب:**\n${group}` });

  const robux = await group.fetchCurrency();
  if (robux < amount) return controller.replyNoMention({ content: '❌ **هذا العدد من الروبكس غير متوفر في الجروب في الوقت الحالي!**' });

  try {
  await member.payout({ amount });
    
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
    ctx.drawImage(userImage, 11.5,16.5,35,35);
    
    const attach = new AttachmentBuilder(canvas.toBuffer(), { name: 'payout.png' });
    
    controller.replyNoMention({ content: `✅ **تم بنجاح تحويل الروبوكس إلى ${username}**`, files: [attach] });
    
    } catch (e) {
      if (e.message === '400 Payout is restricted.') { 
        controller.replyNoMention({ content: '❌ **هذا اللاعب لم يكمل 14 يوم داخل الجروب!**' });
      } else {
        console.error(e);
        controller.replyNoMention({ content: '❌ **حدث خطأ ما**' });
      } 
    }
 };