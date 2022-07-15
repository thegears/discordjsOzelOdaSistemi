const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = {
  customId: "kanal-isim-degistir-modal",
  async run({ client, int, db, config }) {
    let kanalIsim = int.fields.getTextInputValue("kanal-isim");
    let kanal = await db.get(`${int.member.user.id}_kanal`);

    client.channels.cache.get(kanal.ses).setName(kanalIsim);

    await int.reply({
      content: "Değiştirildi",
      ephemeral: true
    });
  }
};
