const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  name: "sahiplik-aktar",
  command: new SlashCommandBuilder()
    .setName("sahiplik-aktar")
    .setDescription("Birine ses kanalınızın sahipliğini aktarırsınız")
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

    if (await db.get(`${kisi.id}_kanal`))
      return await int.reply({
        content: "Etiketlediğiniz kişinin zaten bir ses kanalı var",
        ephemeral: true
      });

    db.set(`${kisi.id}_kanal`, kanal);
    db.set(`${kanal.ses}_sahip`, kisi.id);
    await client.channels.cache.get(kanal.yazi).setName(kisi.username);
    client.channels.cache.get(kanal.yazi).permissionOverwrites.set([
      {
        id: int.guild.roles.everyone,
        deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
      },
      {
        id: int.member.user.id,
        deny: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
      },
      {
        id: kisi.id,
        allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "READ_MESSAGE_HISTORY"]
      }
    ]);
    db.delete(`${int.member.user.id}_kanal`);

    await int.reply({
      content: "Sahiplik aktarıldı.",
      ephemeral: true
    });
  }
};
