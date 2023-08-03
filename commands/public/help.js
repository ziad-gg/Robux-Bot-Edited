const { EmbedBuilder, SlashCommandBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType } = require('discord.js');
const { CommandBuilder } = require('handler.djs');

module.exports = new CommandBuilder()
  .setName('help')
  .setDescription('Feeling lost?')
  .setCooldown('10s')
  .setCategory('help')
  .InteractionOn(new SlashCommandBuilder().setDMPermission(true).addStringOption((option) => option
     .setName('command')
     .setDescription('Shows details about how to use a command')                                                           
     .setRequired(false)))
  .setGlobal(GlobalExecute)

async function GlobalExecute(message, interaction) {
  const controller = message ?? interaction;
  const client = controller.client;
  const roblox = controller.getData('roblox');
  
  if (controller.channel?.type === ChannelType.DM) {
    const embed = new EmbedBuilder().setColor('#0be881')
      .setTitle('قائمة الأوامر')
      .setThumbnail(client.user.displayAvatarURL())
      .addFields([{ name: client.Application.prefix + 'balance', value: '**رصيدك من الروبكس.**' }])
      .addFields([{ name: client.Application.prefix + 'transfer (username) (robux)', value: '**لتحويل رصيدك الى روبكس.**' }])
      .setTimestamp() 
    
   return controller.replyNoMention({ embeds: [embed] });
  }
  const Guilds = controller.getData('guilds');
  const Constants = controller.getData('Constants');
  const Guild = await Guilds.get(controller.guild.id);
  
  const isAdmin = Guild.admins.find(admin => admin.id === controller.author.id);
  const command = message ? message[0]?.toLowerCase() : interaction[0]?.split(' ')[0];
  const embed = new EmbedBuilder().setColor('#0be881');
  //const link = new ActionRowBuilder().addComponents(new ButtonBuilder().setLabel(`${client.user.username} Dashboard`).setURL(Constants.PROJECT_LINK).setStyle(ButtonStyle.Link));

  if (command && command !== 'help') {
    let cmd = client.Application.getCommand(command) || client.Application.getCommandByCut(command);
    if (!cmd || (!controller.author.isOwner && cmd.category === 'owners') || (!isAdmin && !controller.author.isOwner && cmd.category === 'admins') || cmd.isSubCommand) return controller.replyNoMention({ content: '❌ **هذا الأمر غير موجود!**' });
    
    embed.setTitle(`Command: ${cmd.name}`);
    
    const SubCommands = cmd.SubCommands;
    const GroupName = message ? message[1]?.toLowerCase() : interaction[0].split(' ')[1]?.toLowerCase();
    const GroupChildName = message ? message[2]?.toLowerCase() : interaction[0].split(' ')[2]?.toLowerCase();
      
    let subs;
    let main;
    
    if (GroupName || GroupChildName) {
      subs = SubCommands?.find(sub => sub.commandGroup?.toLowerCase() === GroupName && (GroupChildName ? sub.commandName === GroupChildName : true));
      if (!subs) subs = SubCommands.find(op => op.commandName.toLowerCase() === GroupName && !op.commandGroup);
      if (!subs) return controller.replyNoMention({ content: '❌ **هذا الأمر غير موجود!**' });
    }
    
    if (subs) {
      main = cmd;
      cmd = client.Application.subs.get(subs.commandName);
    }

    const Aliases = cmd.Application.Cuts;
    
    if (cmd.description) embed.setDescription(cmd.description);
    if (Aliases && Aliases.size > 0) embed.addFields([{ name: 'Aliases:', value: Aliases.map(e => e.withPrefix ? `${client.Application.prefix}${e.cutName}`: e.cutName).join('\n') }])
    if (cmd.usage) embed.addFields([{ name: 'Usages:' , value: cmd.usage.map(e => `${client.Application.prefix}${e.replace(/\{cmdname}/, cmd.name).replace(/\{mainName}/, main?.name).replace(/\{groupname}/, GroupName)}`).join('\n') }]);
    if (!main && SubCommands.length > 0) embed.addFields([{ name: 'Subs:', value: SubCommands.map(e => `${client.Application.prefix}${cmd.name} ${e.commandGroup ? e.commandGroup : e.commandName } ${e.commandGroup ? e.commandName : ''}`).join('\n') }]);
    if (cmd.examples) embed.addFields([{ name: 'Exmaples:', value: cmd.examples.map(e => `${client.Application.prefix}${e.replace(/\{cmdname}/, cmd.name).replace(/\{mainName}/, main?.name).replace(/\{groupname}/, GroupName).replace(/\{roleMention}/, `<@&${controller.guild.roles.cache.randomKey()}>`).replace(/\{roleId}/, `${controller.guild.roles.cache.randomKey()}`).replace(/\{channelId}/, `${controller.guild.channels.cache.randomKey()}`).replace(/\{channelMention}/, `<#${controller.guild.channels.cache.randomKey()}>`).replace(/\{rusername}/, roblox.me.username).replace(/\{userMention}/g, `<@${controller.author.id}>`).replace(/\{userId}/g, `${controller.author.id}`)}`).join('\n') }]);
    
  } else {
    const commands = [];

    client.Application.commands.filter(e => e.category !== 'help').forEach(cmd => {
      if (!cmd.isSubCommand) commands.push({ name: `\`${cmd.name}\``, category: cmd.category });
    });

    const general = commands.filter(cmd => cmd.category === 'public').map(cmd => cmd.name);
    const admins = commands.filter(cmd => cmd.category === 'admins').map(cmd => cmd.name);
    const owners = commands.filter(cmd => cmd.category === 'owners').map(cmd => cmd.name);

    embed.setTitle(`قائمة أوامر ${controller.client.user.username}`);
    embed.setDescription(`**للحصول على معلومات أكثر حول أمر معين ، اكتب : ${client.Application.prefix}help <command name>**`)
    embed.setThumbnail(controller.guild.iconURL())

    if (general.length) embed.addFields([{ name: 'General Commands', value: general.join(', ') }]);
    if (admins.length && (controller.author.isOwner || isAdmin)) embed.addFields([{ name: 'Admins Commands', value: admins.join(', ') }]);
    if (owners.length && (controller.author.isOwner)) embed.addFields([{ name: 'Owners Commands', value: owners.join(', ') }]);
  };
  
  controller.replyNoMention({ embeds: [embed]/*, components: [link] */ });
};