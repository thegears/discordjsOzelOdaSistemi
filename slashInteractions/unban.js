const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "unban",
  command: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Birinin ses kanalınızdan banını kaldırırsınız")
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

    if (!banlar.includes(kisi.id))
      return await int.reply({
        content: "Bu kişi zaten ses kanalınızdan banlı değil.",
        ephemeral: true
      });

    await db.pull(
      `${kanal.ses}_banlar`,
      (element, index, array) => element == kisi.id,
      true
    );

    await int.reply({
      content: "Ses kanalınızdan banı kaldırıldı.",
      ephemeral: true
    });
  }
};
