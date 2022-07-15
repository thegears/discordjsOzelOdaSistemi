const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "ban",
  command: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Birini ses kanalınızdan banlarsınız")
    .addUserOption(o =>
      o
        .setName("kisi")
        .setDescription("Kişi")
        .setRequired(true)
    ),
  async run({ client, int, db }) {
    let kisi = int.options.getUser("kisi");
    let kanal = await db.get(`${int.member.user.id}_kanal`);

    if (!kanal)
      return await int.reply({
        content: "Şuanda bir ses kanalınız yok.",
        ephemeral: true
      });

    let banlar = (await db.get(`${kanal.ses}_banlar`)) || [];

    if (banlar.includes(kisi.id))
      return await int.reply({
        content: "Bu kişi zaten ses kanalınızdan banlı.",
        ephemeral: true
      });

    let sesKanal = await client.channels.cache.get(kanal.ses);
    if (sesKanal.members.map(r => r).find(a => a.id == kisi.id)) {
      int.guild.members.cache
        .get(sesKanal.members.map(r => r).find(a => a.id == kisi.id).id)
        .voice.disconnect();
    }

    await db.push(`${kanal.ses}_banlar`, `${kisi.id}`);

    await int.reply({
      content: "Ses kanalınızdan banlandı.",
      ephemeral: true
    });
  }
};
