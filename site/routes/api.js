const express = require("express");
const { AttachmentBuilder } = require("discord.js");
const { createCanvas, loadImage } = require("canvas");

const client = require("../../index.js");
const { DEFAULT_GUILD } = require("../../src/Constants.js");
const { ensureAuthenticated, forwardAuthenticated } = require("../auth/auth");

const router = express.Router();

router.post("/transfer", async (req, res) => {
  const controller = client.Application;

  const roblox = controller.getData("roblox");
  const guildData = await controller.getData("guilds").get(DEFAULT_GUILD);
  const group = await roblox.groups.get(guildData.group);

  if (!guildData.transfer.status || !guildData.group || !group)
    return res.json({
      error: true,
      message: "❌ التحويل مقفل في الوقت الحالي!",
    });

  const userId = req.user.id;
  const username = req.query.username;
  const amount = req.query.amount;

  if (!userId || !username || !amount || !amount.isNumber())
    return res.json({ error: true, message: "❌ Invalid Arguments" });

  const Guild = await client.guilds.cache.get(DEFAULT_GUILD);
  const GuildMember = await Guild.members
    .fetch(userId)
    .then((u) => u)
    .catch((e) => null);

  if (!GuildMember)
    return res.json({
      error: true,
      message: `❌ لا يمكنني العثور عليك في ${Guild.name}`,
    });

  if (guildData.transfer.min > amount)
    return res.json({
      error: true,
      message: `❌ الحد الأدنى للتحويل هو ${guildData.transfer.min}`,
    });
  if (guildData.transfer.max > 0 && guildData.transfer.max < amount)
    return res.json({
      error: true,
      message: `❌ الحد الأقصى التحويل هو ${guildData.transfer.max}`,
    });

  const funds = await group.fetchCurrency().then((e) => e.robux);
  if (amount > funds)
    return res.json({
      error: true,
      message: `❌ عذرا ولاكن هذا العدد غير متوفر في الجروب في الوقت الحالي!`,
    });

  let user = await roblox.users.find({ userNames: username });
  if (!user)
    return res.json({
      error: true,
      message: "❌ يبدو أن هذا اللاعب غير متواجد في روبلوكس!",
    });

  user = await roblox.users.get(user.id);
  const member = await group.members.get(user.id);
  if (!member)
    return res.json({
      error: true,
      message: `❌ هذا اللاعب غير متواجد في الجروب`,
    });

  const proofChannel = await client.guilds.cache
    .get(DEFAULT_GUILD)
    ?.channels?.cache.get(guildData.proofsChannel);
  const userData = await controller.getData("users").get(userId);
  if (userData.balance < amount)
    return res.json({
      error: true,
      message: "❌ رصيدك الحالي غير كافي للتحويل",
    });

  userData.balance -= amount;
  userData.transactionsTotal += amount;
  userData.transactionsCount += 1;
  userData.lastTransactionsAccount = username;
  await userData.save();

  try {
    await member.payout({ amount });
    res.json({ user: userData, done: true, proofChannel });
  } catch (e) {
    if (e.message === "400 Payout is restricted.") {
      res.json({
        error: true,
        message: "❌ هذا اللاعب لم يكمل 14 يوم داخل الجروب!",
      });
    } else {
      console.error(e);
      res.json({ error: true, content: "❌ حدث خطأ ما" });
    }
  }

  const canvas = createCanvas(991, 172);
  const ctx = canvas.getContext("2d");
  const background = await loadImage(
    "https://cdn.glitch.global/60d2234a-7ca2-4fc7-a312-190e5d8c2e88/Picsart_23-02-24_20-56-24-896.jpg?v=1677265030940"
  );

  ctx.beginPath();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  ctx.font = "15px impact";
  ctx.fillStyle = "black";
  ctx.fillText(amount.toLocaleString(), 802.5, 42.4);
  ctx.font = "650 16px impact";
  ctx.fillText(amount.toLocaleString(), 864.5, 82.5);
  ctx.fillText((funds - amount).toLocaleString(), 830.5, 105.7);
  ctx.font = "570 15.2px impact";
  ctx.fillText(username, 61, 35);
  ctx.closePath();

  const userImage = await loadImage(user.avatarURL({ type: "Headshot" }));
  ctx.drawImage(userImage, 11.5, 16.5, 35, 35);

  const attach = new AttachmentBuilder(canvas.toBuffer(), {
    name: "payout.png",
  });

  proofChannel.send({
    content: `**تم الشراء بواسطة: <@${req.user.id}>**`,
    files: [attach],
  });
});

router.get("/funds", async (req, res) => {
  if (!req.user)
    return res.json({
      error: true,
      message: "unauthorized person with storage",
    });
  const controller = client.Application;
  const roblox = controller.getData("roblox");
  const guildData = await controller.getData("guilds").get(DEFAULT_GUILD);
  const group = await roblox.groups.get(guildData.group);
  const robux = await group.fetchCurrency();

  return res.json({ done: true, robux });
});

module.exports = router;
